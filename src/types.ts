export type SkillCategory =
  | 'ball-handle'
  | 'shooting'
  | 'finishing'
  | 'footwork'
  | 'passing'
  | 'pick-and-roll'
  | 'defense'
  | 'off-ball'
  | 'post-game'
  | 'athletic';

export type DifficultyLevel = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Competitivo';

export type TrainingFocus =
  | 'ball-handle'
  | 'shooting'
  | 'finishing'
  | 'passing'
  | 'defense'
  | 'athletic'
  | 'complete';

export interface OnboardingAnswers {
  trainingFocus: TrainingFocus;
  level: DifficultyLevel;
  trainingDaysPerWeek: 2 | 3 | 4 | 5 | 6;
  sessionDurationMinutes: 30 | 45 | 60;
}

export type EquipmentType =
  | 'Sem equipamento'
  | '1 bola'
  | '2 bolas'
  | 'Cone'
  | 'Cones'
  | '2 Cones'
  | 'Cadeira'
  | 'Parede'
  | 'Elástico'
  | 'Bola de tênis'
  | 'Parceiro';

export type SpaceRequirement =
  | 'Casa'
  | 'Área pequena'
  | 'Meia quadra'
  | 'Quadra inteira'
  | 'Academia';

export type PlayerPosition = 'PG' | 'SG' | 'SF' | 'PF' | 'C' | 'SG / PG' | 'SF / SG' | 'PF / C';

export interface GameTransfer {
  skill: string;
  drill: string;
  gameSituation: string;
  objective: string;
  nbaExampleConcept?: string;
}

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  category: SkillCategory;
  categoryLabel: string;
  subcategory: string;
  description: string;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  reps: string;
  sets: number;
  equipment: EquipmentType[];
  space: SpaceRequirement;
  instructions: string[];
  tips: string[];
  commonMistakes: string[];
  gameTransfer: GameTransfer;
  videoUrl?: string;
  youtubeId?: string;
  thumbnail: string;
  courtPlacement?: 'top' | 'wing' | 'corner' | 'paint' | 'full-court' | 'restricted';
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  customSets?: number;
  customReps?: string;
  customDurationSeconds?: number;
  restSeconds?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: SkillCategory | 'complete';
  categoryLabel: string;
  level: DifficultyLevel;
  estimatedMinutes: number;
  exercises: WorkoutExerciseItem[];
  xpReward: number;
  tags: string[];
  thumbnail: string;
  featured?: boolean;
}

export interface ProgramWeekDay {
  dayOfWeek: number; // 1 (Mon) to 7 (Sun)
  title: string;
  workoutId?: string;
  isRest?: boolean;
  focus: string;
}

export interface ProgramWeek {
  weekNumber: number;
  title: string;
  focus: string;
  days: ProgramWeekDay[];
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  level: DifficultyLevel;
  durationWeeks: number;
  workoutsPerWeek: number;
  category: SkillCategory | 'complete';
  categoryLabel: string;
  weeks: ProgramWeek[];
  thumbnail: string;
  xpTotal: number;
  prerequisites?: string[];
}

export interface DayPlan {
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7; // Mon=1, Sun=7
  dayName: string;
  workoutId?: string;
  customTitle?: string;
  isRest: boolean;
  completed: boolean;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  category: 'treinos' | 'tempo' | 'arremessos' | 'repeticoes' | 'fundamento' | 'sequencia' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  completed: boolean;
  iconName: string;
}

export interface SkillRating {
  name: string;
  key: string;
  score: number; // 0 to 10
  category: string;
}

export type PlayerTier = 'Rookie' | 'Prospect' | 'Starter' | 'Sixth Man' | 'All-Star' | 'Elite';

export interface PlayerProfile {
  name: string;
  age: number;
  height: string; // e.g. "1.86m"
  weight: string; // e.g. "82kg"
  position: PlayerPosition;
  dominantHand: 'Direita' | 'Esquerda' | 'Ambidestro';
  level: DifficultyLevel;
  primaryGoals: string[];
  avatarUrl?: string;
  bio?: string;
  city?: string;
  onboardingCompleted: boolean;
  trainingFocus?: TrainingFocus;
  trainingDaysPerWeek?: number;
  sessionDurationMinutes?: number;
}

export interface WorkoutSessionLog {
  id: string;
  workoutId: string;
  workoutTitle: string;
  completedAt: string;
  durationMinutes: number;
  exercisesCompleted: number;
  totalSets: number;
  totalReps: number;
  shotsMade?: number;
  xpEarned: number;
  perceivedDifficulty: 'Muito difícil' | 'Difícil' | 'Bom' | 'Fácil';
  notes?: string;
}

export interface SkillProgressItem {
  category: SkillCategory;
  label: string;
  percentage: number;
  completedDrillsCount: number;
  totalDrillsCount: number;
}
