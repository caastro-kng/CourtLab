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
  Exercise
} from '../types';
import { WORKOUTS_DATA } from '../data/workouts';
import { EXERCISES_DATA } from '../data/exercises';
import { calculateTrainingStreaks, deriveSkillProgress, getTierFromXp, XP_REWARDS } from '../utils/progression';
import { readNumberStorage, readStorage, writeStorage } from '../utils/storage';

interface PlayerContextType {
  profile: PlayerProfile;
  updateProfile: (updated: Partial<PlayerProfile>) => void;
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

const INITIAL_PROFILE: PlayerProfile = {
  name: 'Caio',
  age: 19,
  height: '1.88m',
  weight: '82kg',
  position: 'SG / PG',
  dominantHand: 'Direita',
  level: 'Intermediário',
  primaryGoals: [
    'Melhorar arremesso',
    'Melhorar controle de bola',
    'Criar espaço',
    'Melhorar finalização',
    'Pick and Roll'
  ],
  bio: 'Armador focado em evolução individual constante, arremesso após drible e leitura de defesas no Pick and Roll.',
  city: 'São Paulo, SP'
};

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

const FRESH_START_VERSION = 'fresh-start-v1';
const PROGRESS_STORAGE_KEYS = [
  'courtlab_xp',
  'courtlab_weekly_plan',
  'courtlab_goals',
  'courtlab_logs',
  'courtlab_custom_workouts',
  'courtlab_active_workout'
];

const ensureFreshStart = () => {
  try {
    if (localStorage.getItem('courtlab_progress_version') === FRESH_START_VERSION) return;
    PROGRESS_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.setItem('courtlab_progress_version', FRESH_START_VERSION);
  } catch {
    // The app can still use in-memory zeroed defaults when storage is unavailable.
  }
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  ensureFreshStart();

  const [profile, setProfile] = useState<PlayerProfile>(() => readStorage('courtlab_profile', INITIAL_PROFILE));
  const [skillsRating, setSkillsRating] = useState<SkillRating[]>(() => readStorage('courtlab_skills', INITIAL_SKILLS));
  const [xp, setXp] = useState<number>(() => readNumberStorage('courtlab_xp', 0));
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(() => readStorage('courtlab_weekly_plan', INITIAL_WEEKLY_PLAN));
  const [goals, setGoals] = useState<Goal[]>(() => readStorage('courtlab_goals', INITIAL_GOALS));
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutSessionLog[]>(() => readStorage('courtlab_logs', INITIAL_LOGS));
  const [customWorkouts, setCustomWorkouts] = useState<Workout[]>(() => readStorage('courtlab_custom_workouts', []));
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(() => readStorage('courtlab_active_workout', null));
  const [isLoggedInDemo, setIsLoggedInDemo] = useState<boolean>(true);

  useEffect(() => writeStorage('courtlab_profile', profile), [profile]);
  useEffect(() => writeStorage('courtlab_skills', skillsRating), [skillsRating]);
  useEffect(() => writeStorage('courtlab_xp', String(xp)), [xp]);
  useEffect(() => writeStorage('courtlab_weekly_plan', weeklyPlan), [weeklyPlan]);
  useEffect(() => writeStorage('courtlab_goals', goals), [goals]);
  useEffect(() => writeStorage('courtlab_logs', workoutLogs), [workoutLogs]);
  useEffect(() => writeStorage('courtlab_custom_workouts', customWorkouts), [customWorkouts]);
  useEffect(() => writeStorage('courtlab_active_workout', activeWorkout), [activeWorkout]);

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

  const updateProfile = (updated: Partial<PlayerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
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
        updateProfile,
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