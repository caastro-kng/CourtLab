import { EXERCISES_DATA } from '../data/exercises';
import { WORKOUTS_DATA } from '../data/workouts';
import { PlayerTier, SkillCategory, SkillProgressItem, Workout, WorkoutSessionLog } from '../types';

export const XP_REWARDS = {
  createGoal: 25,
  completeGoal: 50,
  createCustomWorkout: 50,
  fallbackWorkoutCompletion: 120
} as const;

export const TIER_THRESHOLDS: Array<{ tier: PlayerTier; minXp: number }> = [
  { tier: 'Rookie', minXp: 0 },
  { tier: 'Prospect', minXp: 600 },
  { tier: 'Starter', minXp: 1200 },
  { tier: 'Sixth Man', minXp: 1800 },
  { tier: 'All-Star', minXp: 2500 },
  { tier: 'Elite', minXp: 3500 }
];

export const getTierFromXp = (xp: number): PlayerTier => {
  return [...TIER_THRESHOLDS].reverse().find((item) => xp >= item.minXp)?.tier || 'Rookie';
};

const dateKey = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, amount: number) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() + amount);
  return copy;
};

export const calculateTrainingStreaks = (logs: WorkoutSessionLog[]) => {
  const uniqueDates = Array.from(
    new Set(logs.map((log) => dateKey(log.completedAt)).filter((value): value is string => Boolean(value)))
  ).sort();

  if (!uniqueDates.length) return { current: 0, longest: 0 };

  let longest = 1;
  let running = 1;
  for (let index = 1; index < uniqueDates.length; index += 1) {
    const previous = new Date(`${uniqueDates[index - 1]}T00:00:00`);
    const current = new Date(`${uniqueDates[index]}T00:00:00`);
    const diffDays = Math.round((current.getTime() - previous.getTime()) / 86400000);
    if (diffDays === 1) running += 1;
    else running = 1;
    longest = Math.max(longest, running);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = dateKey(today);
  const yesterdayKey = dateKey(addDays(today, -1));
  const lastKey = uniqueDates[uniqueDates.length - 1];

  if (lastKey !== todayKey && lastKey !== yesterdayKey) return { current: 0, longest };

  let currentStreak = 1;
  for (let index = uniqueDates.length - 1; index > 0; index -= 1) {
    const current = new Date(`${uniqueDates[index]}T00:00:00`);
    const previous = new Date(`${uniqueDates[index - 1]}T00:00:00`);
    const diffDays = Math.round((current.getTime() - previous.getTime()) / 86400000);
    if (diffDays !== 1) break;
    currentStreak += 1;
  }

  return { current: currentStreak, longest };
};

const CATEGORY_LABELS: Partial<Record<SkillCategory, string>> = {
  'ball-handle': 'Controle de Bola',
  shooting: 'Arremesso',
  finishing: 'Finalização',
  footwork: 'Footwork',
  passing: 'Passe',
  'pick-and-roll': 'Pick and Roll',
  defense: 'Defesa',
  'off-ball': 'Sem Bola',
  athletic: 'Físico',
  'post-game': 'Post Game'
};

export const deriveSkillProgress = (
  logs: WorkoutSessionLog[],
  customWorkouts: Workout[]
): SkillProgressItem[] => {
  const workouts = [...customWorkouts, ...WORKOUTS_DATA];
  const workoutMap = new Map(workouts.map((workout) => [workout.id, workout]));
  const completedExerciseIds = new Set<string>();

  logs.forEach((log) => {
    workoutMap.get(log.workoutId)?.exercises.forEach((item) => completedExerciseIds.add(item.exerciseId));
  });

  const categories = Array.from(new Set(EXERCISES_DATA.map((exercise) => exercise.category)));

  return categories.map((category) => {
    const drills = EXERCISES_DATA.filter((exercise) => exercise.category === category);
    const completed = drills.filter((exercise) => completedExerciseIds.has(exercise.id)).length;
    const total = drills.length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;

    return {
      category,
      label: CATEGORY_LABELS[category] || drills[0]?.categoryLabel || category,
      percentage,
      completedDrillsCount: completed,
      totalDrillsCount: total
    };
  });
};
