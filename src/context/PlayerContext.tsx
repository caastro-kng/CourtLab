import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  PlayerProfile,
  SkillRating,
  DayPlan,
  Goal,
  WorkoutSessionLog,
  SkillProgressItem,
  Workout,
  PlayerTier,
  Exercise,
  OnboardingAnswers
} from '../types';
import { WORKOUTS_DATA } from '../data/workouts';
import { EXERCISES_DATA } from '../data/exercises';
import { calculateTrainingStreaks, deriveSkillProgress, getTierFromXp, XP_REWARDS } from '../utils/progression';
import { readNumberStorage, readStorage, writeStorage } from '../utils/storage';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { createInitialGoals, createInitialWeeklyPlan, TRAINING_FOCUS } from '../utils/onboarding';

interface PlayerContextType {
  profile: PlayerProfile;
  playerReady: boolean;
  updateProfile: (updated: Partial<PlayerProfile>) => Promise<{ error?: string }>;
  completeOnboarding: (answers: OnboardingAnswers) => Promise<{ error?: string }>;
  skillsRating: SkillRating[];
  updateSkillRating: (key: string, newScore: number) => void;
  topStrength: { name: string; score: number };
  mainFocusArea: { name: string; score: number };
  xp: number;
  addXp: (amount: number, reason?: string) => void;
  tier: PlayerTier;
  currentStreakDays: number;
  longestStreakDays: number;
  weeklyPlan: DayPlan[];
  updateDayPlan: (dayOfWeek: number, updates: Partial<DayPlan>) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'completed'>) => void;
  updateGoalProgress: (id: string, delta: number) => void;
  skillProgressList: SkillProgressItem[];
  workoutLogs: WorkoutSessionLog[];
  completeWorkoutSession: (log: Omit<WorkoutSessionLog, 'id' | 'completedAt'>) => void;
  customWorkouts: Workout[];
  saveCustomWorkout: (workout: Workout) => void;
  activeWorkout: Workout | null;
  startWorkout: (workout: Workout) => void;
  finishActiveWorkout: () => void;
  cancelActiveWorkout: () => void;
  getExerciseById: (id: string) => Exercise | undefined;
  getWorkoutById: (id: string) => Workout | undefined;
  isLoggedInDemo: boolean;
  loginAsDemo: () => void;
}

type ProfileRow = {
  id: string;
  name: string | null;
  age: number | null;
  height: string | null;
  weight: string | null;
  position: string | null;
  dominant_hand: string | null;
  level: string | null;
  city: string | null;
  bio: string | null;
  primary_goals: string[] | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  training_focus: PlayerProfile['trainingFocus'] | null;
  training_days_per_week: number | null;
  session_duration_minutes: number | null;
};

type PlayerStatePayload = {
  skillsRating: SkillRating[];
  xp: number;
  weeklyPlan: DayPlan[];
  goals: Goal[];
  workoutLogs: WorkoutSessionLog[];
  customWorkouts: Workout[];
};

type PlayerStateRow = {
  id: string;
  state: Partial<PlayerStatePayload> | null;
};

const BASE_PROFILE: PlayerProfile = {
  name: 'Jogador',
  age: 18,
  height: '',
  weight: '',
  position: 'SG / PG',
  dominantHand: 'Direita',
  level: 'Iniciante',
  primaryGoals: [],
  bio: '',
  city: '',
  onboardingCompleted: false
};

const profileFromAuth = (name?: string | null): PlayerProfile => ({
  ...BASE_PROFILE,
  name: name?.trim() || BASE_PROFILE.name
});

const profileFromRow = (row: ProfileRow, fallback: PlayerProfile): PlayerProfile => ({
  name: row.name?.trim() || fallback.name,
  age: typeof row.age === 'number' ? row.age : fallback.age,
  height: row.height ?? fallback.height,
  weight: row.weight ?? fallback.weight,
  position: (row.position as PlayerProfile['position']) || fallback.position,
  dominantHand: (row.dominant_hand as PlayerProfile['dominantHand']) || fallback.dominantHand,
  level: (row.level as PlayerProfile['level']) || fallback.level,
  city: row.city ?? fallback.city,
  bio: row.bio ?? fallback.bio,
  primaryGoals: Array.isArray(row.primary_goals) ? row.primary_goals : fallback.primaryGoals,
  avatarUrl: row.avatar_url ?? fallback.avatarUrl,
  onboardingCompleted: row.onboarding_completed === true,
  trainingFocus: row.training_focus ?? fallback.trainingFocus,
  trainingDaysPerWeek: row.training_days_per_week ?? fallback.trainingDaysPerWeek,
  sessionDurationMinutes: row.session_duration_minutes ?? fallback.sessionDurationMinutes
});

const profileToRow = (id: string, profile: PlayerProfile) => ({
  id,
  name: profile.name,
  age: profile.age,
  height: profile.height,
  weight: profile.weight,
  position: profile.position,
  dominant_hand: profile.dominantHand,
  level: profile.level,
  city: profile.city || '',
  bio: profile.bio || '',
  primary_goals: profile.primaryGoals,
  avatar_url: profile.avatarUrl || null,
  onboarding_completed: profile.onboardingCompleted,
  training_focus: profile.trainingFocus || null,
  training_days_per_week: profile.trainingDaysPerWeek || null,
  session_duration_minutes: profile.sessionDurationMinutes || null
});

const INITIAL_SKILLS: SkillRating[] = [
  { key: 'ball-handle', name: 'Controle de Bola', score: 7.0, category: 'Técnica' },
  { key: 'shooting', name: 'Arremesso', score: 6.0, category: 'Técnica' },
  { key: 'three-points', name: '3 Pontos', score: 5.0, category: 'Técnica' },
  { key: 'mid-range', name: 'Mid Range', score: 6.0, category: 'Técnica' },
  { key: 'finishing', name: 'Finalização', score: 7.1, category: 'Técnica' },
  { key: 'weak-hand', name: 'Mão Fraca', score: 5.0, category: 'Técnica' },
  { key: 'passing', name: 'Passe', score: 6.0, category: 'Técnica' },
  { key: 'court-vision', name: 'Visão de Jogo', score: 6.0, category: 'Tática' },
  { key: 'pick-and-roll', name: 'Pick and Roll', score: 4.1, category: 'Tática' },
  { key: 'defense', name: 'Defesa', score: 5.0, category: 'Física' },
  { key: 'speed', name: 'Velocidade', score: 7.0, category: 'Física' },
  { key: 'explosion', name: 'Explosão', score: 7.0, category: 'Física' },
  { key: 'conditioning', name: 'Condicionamento', score: 6.0, category: 'Física' },
  { key: 'change-of-pace', name: 'Mudança de Ritmo', score: 8.2, category: 'Técnica' },
  { key: 'off-ball', name: 'Movimentação sem Bola', score: 5.0, category: 'Tática' },
  { key: 'confidence', name: 'Confiança', score: 4.0, category: 'Mental' }
];

const INITIAL_WEEKLY_PLAN: DayPlan[] = [
  { dayOfWeek: 1, dayName: 'SEG', workoutId: 'wk-ball-handle-foundations', customTitle: 'Controle de Bola + Shooting', isRest: false, completed: false },
  { dayOfWeek: 2, dayName: 'TER', workoutId: 'wk-finishing-lab', customTitle: 'Finishing Lab', isRest: false, completed: false },
  { dayOfWeek: 3, dayName: 'QUA', customTitle: 'Descanso Ativo', isRest: true, completed: false },
  { dayOfWeek: 4, dayName: 'QUI', workoutId: 'wk-shot-creator', customTitle: 'Shot Creation', isRest: false, completed: false },
  { dayOfWeek: 5, dayName: 'SEX', workoutId: 'wk-pnr-guard', customTitle: 'Pick and Roll Guard', isRest: false, completed: false },
  { dayOfWeek: 6, dayName: 'SÁB', workoutId: 'wk-perimeter-defense', customTitle: 'Defesa + Conditioning', isRest: false, completed: false },
  { dayOfWeek: 7, dayName: 'DOM', customTitle: 'Descanso e Recuperação', isRest: true, completed: false }
];

const INITIAL_GOALS: Goal[] = [
  { id: 'g1', title: '500 arremessos esta semana', category: 'arremessos', targetValue: 500, currentValue: 0, unit: 'arremessos', completed: false, iconName: 'Target' },
  { id: 'g2', title: 'Treinar 4 dias', category: 'treinos', targetValue: 4, currentValue: 0, unit: 'treinos', completed: false, iconName: 'Flame' },
  { id: 'g3', title: '3 treinos de mão fraca', category: 'fundamento', targetValue: 3, currentValue: 0, unit: 'treinos', completed: false, iconName: 'Hand' },
  { id: 'g4', title: 'Fazer 100 lances livres', category: 'arremessos', targetValue: 100, currentValue: 0, unit: 'lances livres', completed: false, iconName: 'Award' }
];

const INITIAL_LOGS: WorkoutSessionLog[] = [];
const EMPTY_WEEKLY_PLAN: DayPlan[] = [];
const EMPTY_GOALS: Goal[] = [];
const LEGACY_STATE_KEYS = ['courtlab_skills', 'courtlab_xp', 'courtlab_weekly_plan', 'courtlab_goals', 'courtlab_logs', 'courtlab_custom_workouts'];
const scopedStorageKey = (key: string, userId?: string) => userId ? `${key}:${userId}` : key;

const normalizePlayerState = (state?: Partial<PlayerStatePayload> | null): PlayerStatePayload => ({
  skillsRating: Array.isArray(state?.skillsRating) ? state!.skillsRating! : INITIAL_SKILLS,
  xp: typeof state?.xp === 'number' && Number.isFinite(state.xp) ? Math.max(0, state.xp) : 0,
  weeklyPlan: Array.isArray(state?.weeklyPlan) ? state!.weeklyPlan! : EMPTY_WEEKLY_PLAN,
  goals: Array.isArray(state?.goals) ? state!.goals! : EMPTY_GOALS,
  workoutLogs: Array.isArray(state?.workoutLogs) ? state!.workoutLogs! : INITIAL_LOGS,
  customWorkouts: Array.isArray(state?.customWorkouts) ? state!.customWorkouts! : []
});

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const authName = typeof user?.user_metadata?.name === 'string' ? user.user_metadata.name : '';
  const userId = user?.id;

  const [profile, setProfile] = useState<PlayerProfile>(() => profileFromAuth(authName));
  const [skillsRating, setSkillsRating] = useState<SkillRating[]>(() => readStorage(scopedStorageKey('courtlab_skills', userId), INITIAL_SKILLS));
  const [xp, setXp] = useState<number>(() => readNumberStorage(scopedStorageKey('courtlab_xp', userId), 0));
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(() => readStorage(scopedStorageKey('courtlab_weekly_plan', userId), EMPTY_WEEKLY_PLAN));
  const [goals, setGoals] = useState<Goal[]>(() => readStorage(scopedStorageKey('courtlab_goals', userId), EMPTY_GOALS));
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutSessionLog[]>(() => readStorage(scopedStorageKey('courtlab_logs', userId), INITIAL_LOGS));
  const [customWorkouts, setCustomWorkouts] = useState<Workout[]>(() => readStorage(scopedStorageKey('courtlab_custom_workouts', userId), []));
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(() => readStorage(scopedStorageKey('courtlab_active_workout', userId), null));
  const [isLoggedInDemo, setIsLoggedInDemo] = useState<boolean>(true);
  const [profileHydrated, setProfileHydrated] = useState(false);
  const [cloudHydrated, setCloudHydrated] = useState(false);

  useEffect(() => {
    if (!user || !supabase) return;

    let cancelled = false;
    const fallback = profileFromAuth(typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : '');
    setProfileHydrated(false);
    setProfile(fallback);

    const hydrateProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id,name,age,height,weight,position,dominant_hand,level,city,bio,primary_goals,avatar_url,onboarding_completed,training_focus,training_days_per_week,session_duration_minutes')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error('CourtLab profile load failed:', error.message);
        setProfileHydrated(true);
        return;
      }

      if (data) {
        setProfile(profileFromRow(data as ProfileRow, fallback));
        setProfileHydrated(true);
        return;
      }

      const { error: insertError } = await supabase
        .from('profiles')
        .upsert(profileToRow(user.id, fallback), { onConflict: 'id' });

      if (insertError) console.error('CourtLab profile creation failed:', insertError.message);
      if (!cancelled) setProfileHydrated(true);
    };

    void hydrateProfile();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user || !supabase) return;

    let cancelled = false;
    setCloudHydrated(false);

    const hydratePlayerState = async () => {
      const { data, error } = await supabase
        .from('player_state')
        .select('id,state')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error('CourtLab player state load failed:', error.message);
        const fallback = normalizePlayerState({
          skillsRating: readStorage(scopedStorageKey('courtlab_skills', user.id), INITIAL_SKILLS),
          xp: readNumberStorage(scopedStorageKey('courtlab_xp', user.id), 0),
          weeklyPlan: readStorage(scopedStorageKey('courtlab_weekly_plan', user.id), EMPTY_WEEKLY_PLAN),
          goals: readStorage(scopedStorageKey('courtlab_goals', user.id), EMPTY_GOALS),
          workoutLogs: readStorage(scopedStorageKey('courtlab_logs', user.id), INITIAL_LOGS),
          customWorkouts: readStorage(scopedStorageKey('courtlab_custom_workouts', user.id), [])
        });
        setSkillsRating(fallback.skillsRating);
        setXp(fallback.xp);
        setWeeklyPlan(fallback.weeklyPlan);
        setGoals(fallback.goals);
        setWorkoutLogs(fallback.workoutLogs);
        setCustomWorkouts(fallback.customWorkouts);
        setCloudHydrated(true);
        return;
      }

      if (data) {
        const remote = normalizePlayerState((data as PlayerStateRow).state);
        setSkillsRating(remote.skillsRating);
        setXp(remote.xp);
        setWeeklyPlan(remote.weeklyPlan);
        setGoals(remote.goals);
        setWorkoutLogs(remote.workoutLogs);
        setCustomWorkouts(remote.customWorkouts);
        setCloudHydrated(true);
        return;
      }

      let hasLegacyState = false;
      try {
        hasLegacyState = LEGACY_STATE_KEYS.some((key) => localStorage.getItem(key) !== null);
      } catch {
        // A new cloud profile can still start with an empty state if local storage is unavailable.
      }

      const migrated = hasLegacyState
        ? normalizePlayerState({
            skillsRating: readStorage('courtlab_skills', INITIAL_SKILLS),
            xp: readNumberStorage('courtlab_xp', 0),
            weeklyPlan: readStorage('courtlab_weekly_plan', INITIAL_WEEKLY_PLAN),
            goals: readStorage('courtlab_goals', INITIAL_GOALS),
            workoutLogs: readStorage('courtlab_logs', INITIAL_LOGS),
            customWorkouts: readStorage('courtlab_custom_workouts', [])
          })
        : normalizePlayerState();

      setSkillsRating(migrated.skillsRating);
      setXp(migrated.xp);
      setWeeklyPlan(migrated.weeklyPlan);
      setGoals(migrated.goals);
      setWorkoutLogs(migrated.workoutLogs);
      setCustomWorkouts(migrated.customWorkouts);

      const { error: insertError } = await supabase
        .from('player_state')
        .upsert({ id: user.id, state: migrated }, { onConflict: 'id' });

      if (insertError) {
        console.error('CourtLab player state creation failed:', insertError.message);
      } else {
        try {
          LEGACY_STATE_KEYS.forEach((key) => localStorage.removeItem(key));
        } catch {
          // Cloud data remains the source of truth if local storage is unavailable.
        }
      }

      if (!cancelled) setCloudHydrated(true);
    };

    void hydratePlayerState();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!userId) return;
    writeStorage(scopedStorageKey('courtlab_active_workout', userId), activeWorkout);
  }, [activeWorkout, userId]);

  useEffect(() => {
    if (!cloudHydrated || !user || !supabase) return;

    const payload: PlayerStatePayload = {
      skillsRating,
      xp,
      weeklyPlan,
      goals,
      workoutLogs,
      customWorkouts
    };

    writeStorage(scopedStorageKey('courtlab_skills', user.id), skillsRating);
    writeStorage(scopedStorageKey('courtlab_xp', user.id), String(xp));
    writeStorage(scopedStorageKey('courtlab_weekly_plan', user.id), weeklyPlan);
    writeStorage(scopedStorageKey('courtlab_goals', user.id), goals);
    writeStorage(scopedStorageKey('courtlab_logs', user.id), workoutLogs);
    writeStorage(scopedStorageKey('courtlab_custom_workouts', user.id), customWorkouts);

    const saveTimer = window.setTimeout(() => {
      void supabase
        .from('player_state')
        .upsert({ id: user.id, state: payload }, { onConflict: 'id' })
        .then(({ error }) => {
          if (error) console.error('CourtLab player state save failed:', error.message);
        });
    }, 500);

    return () => window.clearTimeout(saveTimer);
  }, [cloudHydrated, customWorkouts, goals, skillsRating, user?.id, weeklyPlan, workoutLogs, xp]);

  const tier = getTierFromXp(xp);

  const sortedSkills = useMemo(() => [...skillsRating].sort((a, b) => b.score - a.score), [skillsRating]);
  const topStrength = {
    name: sortedSkills[0]?.name || 'Sem avaliação',
    score: sortedSkills[0]?.score || 0
  };
  const mainFocusArea = {
    name: sortedSkills[sortedSkills.length - 1]?.name || 'Sem avaliação',
    score: sortedSkills[sortedSkills.length - 1]?.score || 0
  };

  const streaks = useMemo(() => calculateTrainingStreaks(workoutLogs), [workoutLogs]);
  const currentStreakDays = streaks.current;
  const longestStreakDays = streaks.longest;
  const skillProgressList = useMemo(
    () => deriveSkillProgress(workoutLogs, customWorkouts),
    [workoutLogs, customWorkouts]
  );

  const updateProfile = async (updated: Partial<PlayerProfile>) => {
    const previous = profile;
    const next = { ...previous, ...updated };
    setProfile(next);

    if (!user || !supabase) return {};

    const { error } = await supabase
      .from('profiles')
      .upsert(profileToRow(user.id, next), { onConflict: 'id' });

    if (error) {
      console.error('CourtLab profile save failed:', error.message);
      setProfile(previous);
      return { error: 'Não foi possível salvar o perfil. Tente novamente.' };
    }

    if (updated.name && updated.name !== previous.name) {
      const { error: authError } = await supabase.auth.updateUser({ data: { ...user.user_metadata, name: next.name } });
      if (authError) console.error('CourtLab auth name save failed:', authError.message);
    }

    return {};
  };

  const completeOnboarding = async (answers: OnboardingAnswers) => {
    if (!user || !supabase) {
      return { error: 'Sua sessão não está disponível. Entre novamente para continuar.' };
    }

    const nextWeeklyPlan = createInitialWeeklyPlan(answers);
    const nextGoals = createInitialGoals(answers);
    const nextProfile: PlayerProfile = {
      ...profile,
      level: answers.level,
      primaryGoals: [TRAINING_FOCUS[answers.trainingFocus].label],
      onboardingCompleted: true,
      trainingFocus: answers.trainingFocus,
      trainingDaysPerWeek: answers.trainingDaysPerWeek,
      sessionDurationMinutes: answers.sessionDurationMinutes
    };
    const nextState: PlayerStatePayload = {
      skillsRating,
      xp,
      weeklyPlan: nextWeeklyPlan,
      goals: nextGoals,
      workoutLogs,
      customWorkouts
    };

    const { error: stateError } = await supabase
      .from('player_state')
      .upsert({ id: user.id, state: nextState }, { onConflict: 'id' });

    if (stateError) {
      console.error('CourtLab onboarding state save failed:', stateError.message);
      return { error: 'Não foi possível montar seu plano agora. Tente novamente.' };
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileToRow(user.id, nextProfile), { onConflict: 'id' });

    if (profileError) {
      console.error('CourtLab onboarding profile save failed:', profileError.message);
      return { error: 'O plano foi preparado, mas não foi possível concluir seu perfil. Tente novamente.' };
    }

    setWeeklyPlan(nextWeeklyPlan);
    setGoals(nextGoals);
    setProfile(nextProfile);
    return {};
  };

  const updateSkillRating = (key: string, newScore: number) => {
    setSkillsRating((prev) =>
      prev.map((skill) =>
        skill.key === key
          ? { ...skill, score: Math.max(0, Math.min(10, Number(newScore.toFixed(1)))) }
          : skill
      )
    );
  };

  const addXp = (amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setXp((prev) => prev + Math.round(amount));
  };

  const updateDayPlan = (dayOfWeek: number, updates: Partial<DayPlan>) => {
    setWeeklyPlan((prev) =>
      prev.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ...updates } : day))
    );
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'completed'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      completed: goalData.currentValue >= goalData.targetValue
    };
    setGoals((prev) => [newGoal, ...prev]);
    addXp(XP_REWARDS.createGoal);
  };

  const updateGoalProgress = (id: string, delta: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== id) return goal;
        const newValue = Math.max(0, goal.currentValue + delta);
        const isNowCompleted = newValue >= goal.targetValue;
        if (!goal.completed && isNowCompleted) addXp(XP_REWARDS.completeGoal);
        return { ...goal, currentValue: newValue, completed: isNowCompleted };
      })
    );
  };

  const completeWorkoutSession = (logData: Omit<WorkoutSessionLog, 'id' | 'completedAt'>) => {
    const completedAt = new Date().toISOString();
    const newLog: WorkoutSessionLog = {
      ...logData,
      id: `log-${Date.now()}`,
      completedAt
    };

    setWorkoutLogs((prev) => [newLog, ...prev]);
    addXp(logData.xpEarned || XP_REWARDS.fallbackWorkoutCompletion);

    setWeeklyPlan((prev) =>
      prev.map((day) =>
        day.workoutId === logData.workoutId
          ? { ...day, completed: true, completedAt }
          : day
      )
    );

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.completed) return goal;
        let delta = 0;
        if (goal.category === 'treinos') delta = 1;
        if (goal.category === 'tempo') delta = logData.durationMinutes || 0;
        if (goal.category === 'arremessos') delta = logData.shotsMade || 0;
        if (goal.category === 'repeticoes') delta = logData.totalReps || 0;
        if (!delta) return goal;

        const newValue = Math.min(goal.targetValue, Math.max(0, goal.currentValue + delta));
        const isNowCompleted = newValue >= goal.targetValue;
        if (!goal.completed && isNowCompleted) addXp(XP_REWARDS.completeGoal);
        return { ...goal, currentValue: newValue, completed: isNowCompleted };
      })
    );
  };

  const saveCustomWorkout = (workout: Workout) => {
    setCustomWorkouts((prev) => [workout, ...prev.filter((item) => item.id !== workout.id)]);
    addXp(XP_REWARDS.createCustomWorkout);
  };

  const startWorkout = (workout: Workout) => setActiveWorkout(workout);
  const finishActiveWorkout = () => setActiveWorkout(null);
  const cancelActiveWorkout = () => setActiveWorkout(null);

  const getExerciseById = (id: string): Exercise | undefined => EXERCISES_DATA.find((exercise) => exercise.id === id);

  const getWorkoutById = (id: string): Workout | undefined =>
    WORKOUTS_DATA.find((workout) => workout.id === id) || customWorkouts.find((workout) => workout.id === id);

  const loginAsDemo = () => setIsLoggedInDemo(true);

  return (
    <PlayerContext.Provider
      value={{
        profile,
        playerReady: profileHydrated && cloudHydrated,
        updateProfile,
        completeOnboarding,
        skillsRating,
        updateSkillRating,
        topStrength,
        mainFocusArea,
        xp,
        addXp,
        tier,
        currentStreakDays,
        longestStreakDays,
        weeklyPlan,
        updateDayPlan,
        goals,
        addGoal,
        updateGoalProgress,
        skillProgressList,
        workoutLogs,
        completeWorkoutSession,
        customWorkouts,
        saveCustomWorkout,
        activeWorkout,
        startWorkout,
        finishActiveWorkout,
        cancelActiveWorkout,
        getExerciseById,
        getWorkoutById,
        isLoggedInDemo,
        loginAsDemo
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
};
