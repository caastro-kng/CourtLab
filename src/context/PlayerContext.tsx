import React, { createContext, useContext, useState, useEffect } from 'react';
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
  { dayOfWeek: 1, dayName: 'SEG', workoutId: 'wk-ball-handle-foundations', customTitle: 'Controle de Bola + Shooting', isRest: false, completed: true, completedAt: '2026-08-25' },
  { dayOfWeek: 2, dayName: 'TER', workoutId: 'wk-finishing-lab', customTitle: 'Finishing Lab', isRest: false, completed: true, completedAt: '2026-08-26' },
  { dayOfWeek: 3, dayName: 'QUA', dayNameLabel: 'QUA', customTitle: 'Descanso Ativo', isRest: true, completed: true, completedAt: '2026-08-27' },
  { dayOfWeek: 4, dayName: 'QUI', workoutId: 'wk-shot-creator', customTitle: 'Shot Creation', isRest: false, completed: true, completedAt: '2026-08-28' },
  { dayOfWeek: 5, dayName: 'SEX', workoutId: 'wk-pnr-guard', customTitle: 'Pick and Roll Guard', isRest: false, completed: false },
  { dayOfWeek: 6, dayName: 'SÁB', workoutId: 'wk-perimeter-defense', customTitle: 'Defesa + Conditioning', isRest: false, completed: false },
  { dayOfWeek: 7, dayName: 'DOM', customTitle: 'Descanso e Recuperação', isRest: true, completed: false }
] as any[];

const INITIAL_GOALS: Goal[] = [
  { id: 'g1', title: '500 arremessos esta semana', category: 'arremessos', targetValue: 500, currentValue: 340, unit: 'arremessos', completed: false, iconName: 'Target' },
  { id: 'g2', title: 'Treinar 4 dias', category: 'treinos', targetValue: 4, currentValue: 3, unit: 'treinos', completed: false, iconName: 'Flame' },
  { id: 'g3', title: '3 treinos de mão fraca', category: 'fundamento', targetValue: 3, currentValue: 2, unit: 'treinos', completed: false, iconName: 'Hand' },
  { id: 'g4', title: 'Fazer 100 lances livres', category: 'arremessos', targetValue: 100, currentValue: 80, unit: 'lances livres', completed: false, iconName: 'Award' }
];

const INITIAL_LOGS: WorkoutSessionLog[] = [
  {
    id: 'log-1',
    workoutId: 'wk-ball-handle-foundations',
    workoutTitle: 'Controle de Bola + Shooting',
    completedAt: '2026-08-25T17:30:00Z',
    durationMinutes: 42,
    exercisesCompleted: 8,
    totalSets: 24,
    totalReps: 160,
    shotsMade: 90,
    xpEarned: 120,
    perceivedDifficulty: 'Bom'
  },
  {
    id: 'log-2',
    workoutId: 'wk-finishing-lab',
    workoutTitle: 'Finishing Lab',
    completedAt: '2026-08-26T18:00:00Z',
    durationMinutes: 48,
    exercisesCompleted: 9,
    totalSets: 27,
    totalReps: 180,
    shotsMade: 110,
    xpEarned: 130,
    perceivedDifficulty: 'Difícil'
  },
  {
    id: 'log-3',
    workoutId: 'wk-shot-creator',
    workoutTitle: 'Shot Creation',
    completedAt: '2026-08-28T16:45:00Z',
    durationMinutes: 45,
    exercisesCompleted: 8,
    totalSets: 24,
    totalReps: 156,
    shotsMade: 120,
    xpEarned: 120,
    perceivedDifficulty: 'Bom'
  }
];

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem('courtlab_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [skillsRating, setSkillsRating] = useState<SkillRating[]>(() => {
    const saved = localStorage.getItem('courtlab_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('courtlab_xp');
    return saved ? Number(saved) : 1420;
  });

  const [currentStreakDays] = useState<number>(4);
  const [longestStreakDays] = useState<number>(7);

  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(() => {
    const saved = localStorage.getItem('courtlab_weekly_plan');
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_PLAN;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('courtlab_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutSessionLog[]>(() => {
    const saved = localStorage.getItem('courtlab_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [customWorkouts, setCustomWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('courtlab_custom_workouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [isLoggedInDemo, setIsLoggedInDemo] = useState<boolean>(true);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('courtlab_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('courtlab_skills', JSON.stringify(skillsRating));
  }, [skillsRating]);

  useEffect(() => {
    localStorage.setItem('courtlab_xp', String(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('courtlab_weekly_plan', JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  useEffect(() => {
    localStorage.setItem('courtlab_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('courtlab_logs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem('courtlab_custom_workouts', JSON.stringify(customWorkouts));
  }, [customWorkouts]);

  // Derived Tier from XP
  const getTier = (points: number): PlayerTier => {
    if (points >= 3500) return 'Elite';
    if (points >= 2500) return 'All-Star';
    if (points >= 1800) return 'Sixth Man';
    if (points >= 1200) return 'Starter';
    if (points >= 600) return 'Prospect';
    return 'Rookie';
  };

  const tier = getTier(xp);

  // Identify top strength & lowest skill to develop
  const sortedSkills = [...skillsRating].sort((a, b) => b.score - a.score);
  const topStrength = {
    name: sortedSkills[0]?.name || 'Mudança de Ritmo',
    score: sortedSkills[0]?.score || 8.2
  };
  const mainFocusArea = {
    name: sortedSkills[sortedSkills.length - 1]?.name || 'Pick and Roll',
    score: sortedSkills[sortedSkills.length - 1]?.score || 4.1
  };

  // Skill progress breakdown across content
  const skillProgressList: SkillProgressItem[] = [
    { category: 'ball-handle', label: 'Controle de Bola', percentage: 62, completedDrillsCount: 15, totalDrillsCount: 24 },
    { category: 'shooting', label: 'Arremesso', percentage: 48, completedDrillsCount: 12, totalDrillsCount: 25 },
    { category: 'finishing', label: 'Finalização', percentage: 71, completedDrillsCount: 17, totalDrillsCount: 24 },
    { category: 'passing', label: 'Passe', percentage: 53, completedDrillsCount: 8, totalDrillsCount: 15 },
    { category: 'defense', label: 'Defesa', percentage: 37, completedDrillsCount: 6, totalDrillsCount: 16 },
    { category: 'pick-and-roll', label: 'Pick and Roll', percentage: 41, completedDrillsCount: 7, totalDrillsCount: 17 }
  ];

  const updateProfile = (updated: Partial<PlayerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const updateSkillRating = (key: string, newScore: number) => {
    setSkillsRating((prev) =>
      prev.map((s) => (s.key === key ? { ...s, score: Math.max(0, Math.min(10, Number(newScore.toFixed(1)))) } : s))
    );
  };

  const addXp = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const updateDayPlan = (dayOfWeek: number, updates: Partial<DayPlan>) => {
    setWeeklyPlan((prev) =>
      prev.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ...updates } : day))
    );
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'completed'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: 'goal-' + Date.now(),
      completed: goalData.currentValue >= goalData.targetValue
    };
    setGoals((prev) => [newGoal, ...prev]);
    addXp(25);
  };

  const updateGoalProgress = (id: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newVal = Math.max(0, g.currentValue + delta);
          const wasCompleted = g.completed;
          const isNowCompleted = newVal >= g.targetValue;
          if (!wasCompleted && isNowCompleted) {
            addXp(50);
          }
          return { ...g, currentValue: newVal, completed: isNowCompleted };
        }
        return g;
      })
    );
  };

  const completeWorkoutSession = (logData: Omit<WorkoutSessionLog, 'id' | 'completedAt'>) => {
    const newLog: WorkoutSessionLog = {
      ...logData,
      id: 'log-' + Date.now(),
      completedAt: new Date().toISOString()
    };
    setWorkoutLogs((prev) => [newLog, ...prev]);
    addXp(logData.xpEarned || 120);

    // Update goals
    updateGoalProgress('g2', 1);
    if (logData.shotsMade) {
      updateGoalProgress('g1', logData.shotsMade);
    }
  };

  const saveCustomWorkout = (workout: Workout) => {
    setCustomWorkouts((prev) => [workout, ...prev]);
    addXp(50);
  };

  const startWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
  };

  const finishActiveWorkout = () => {
    setActiveWorkout(null);
  };

  const cancelActiveWorkout = () => {
    setActiveWorkout(null);
  };

  const getExerciseById = (id: string): Exercise | undefined => {
    return EXERCISES_DATA.find((e) => e.id === id);
  };

  const getWorkoutById = (id: string): Workout | undefined => {
    return (
      WORKOUTS_DATA.find((w) => w.id === id) ||
      customWorkouts.find((w) => w.id === id)
    );
  };

  const loginAsDemo = () => {
    setIsLoggedInDemo(true);
  };

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
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
