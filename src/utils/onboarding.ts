import { WORKOUTS_DATA } from '../data/workouts';
import {
  DayPlan,
  Goal,
  OnboardingAnswers,
  TrainingFocus,
  Workout
} from '../types';

type FocusDefinition = {
  label: string;
  shortLabel: string;
  categories: Workout['category'][];
};

export const TRAINING_FOCUS: Record<TrainingFocus, FocusDefinition> = {
  'ball-handle': {
    label: 'Controle de bola e drible',
    shortLabel: 'Controle de bola',
    categories: ['ball-handle', 'finishing', 'complete', 'shooting', 'pick-and-roll', 'defense']
  },
  shooting: {
    label: 'Arremesso e criação de espaço',
    shortLabel: 'Arremesso',
    categories: ['shooting', 'complete', 'ball-handle', 'finishing', 'pick-and-roll', 'defense']
  },
  finishing: {
    label: 'Finalização perto da cesta',
    shortLabel: 'Finalização',
    categories: ['finishing', 'ball-handle', 'complete', 'shooting', 'pick-and-roll', 'defense']
  },
  passing: {
    label: 'Passe e leitura de jogo',
    shortLabel: 'Passe e visão',
    categories: ['pick-and-roll', 'complete', 'ball-handle', 'finishing', 'shooting', 'defense']
  },
  defense: {
    label: 'Defesa individual e agilidade',
    shortLabel: 'Defesa',
    categories: ['defense', 'complete', 'ball-handle', 'finishing', 'shooting', 'pick-and-roll']
  },
  athletic: {
    label: 'Explosão e condicionamento',
    shortLabel: 'Físico',
    categories: ['athletic', 'defense', 'complete', 'ball-handle', 'finishing', 'shooting']
  },
  complete: {
    label: 'Desenvolvimento completo',
    shortLabel: 'Jogo completo',
    categories: ['complete', 'ball-handle', 'shooting', 'finishing', 'defense', 'pick-and-roll']
  }
};

const DAY_NAMES = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

const TRAINING_DAYS: Record<OnboardingAnswers['trainingDaysPerWeek'], number[]> = {
  2: [2, 5],
  3: [1, 3, 6],
  4: [1, 2, 4, 6],
  5: [1, 2, 4, 5, 6],
  6: [1, 2, 3, 4, 5, 6]
};

const LEVEL_ORDER = ['Iniciante', 'Intermediário', 'Avançado', 'Competitivo'];

const rankForAnswers = (workout: Workout, answers: OnboardingAnswers) => {
  const categoryPriority = TRAINING_FOCUS[answers.trainingFocus].categories.indexOf(workout.category);
  const categoryScore = categoryPriority === -1 ? 0 : 100 - categoryPriority * 14;
  const levelDistance = Math.abs(LEVEL_ORDER.indexOf(workout.level) - LEVEL_ORDER.indexOf(answers.level));
  const levelScore = 24 - levelDistance * 9;
  const durationDifference = workout.estimatedMinutes - answers.sessionDurationMinutes;
  const durationScore = durationDifference <= 5 ? 12 : Math.max(-12, 12 - durationDifference);
  return categoryScore + levelScore + durationScore + (workout.featured ? 2 : 0);
};

export const createInitialWeeklyPlan = (answers: OnboardingAnswers): DayPlan[] => {
  const selectedDays = TRAINING_DAYS[answers.trainingDaysPerWeek];
  const workouts = [...WORKOUTS_DATA]
    .sort((a, b) => rankForAnswers(b, answers) - rankForAnswers(a, answers))
    .slice(0, selectedDays.length);

  return DAY_NAMES.map((dayName, index) => {
    const dayOfWeek = index + 1 as DayPlan['dayOfWeek'];
    const workoutIndex = selectedDays.indexOf(dayOfWeek);
    const workout = workoutIndex >= 0 ? workouts[workoutIndex] : undefined;

    return workout
      ? {
          dayOfWeek,
          dayName,
          workoutId: workout.id,
          customTitle: workout.title,
          isRest: false,
          completed: false
        }
      : {
          dayOfWeek,
          dayName,
          customTitle: 'Descanso e recuperação',
          isRest: true,
          completed: false
        };
  });
};

export const createInitialGoals = (answers: OnboardingAnswers): Goal[] => {
  const focus = TRAINING_FOCUS[answers.trainingFocus];
  return [
    {
      id: 'onboarding-weekly-sessions',
      title: `Treinar ${answers.trainingDaysPerWeek} dias nesta semana`,
      category: 'treinos',
      targetValue: answers.trainingDaysPerWeek,
      currentValue: 0,
      unit: 'treinos',
      completed: false,
      iconName: 'Flame'
    },
    {
      id: 'onboarding-weekly-minutes',
      title: `${answers.trainingDaysPerWeek * answers.sessionDurationMinutes} min com foco em ${focus.shortLabel.toLowerCase()}`,
      category: 'tempo',
      targetValue: answers.trainingDaysPerWeek * answers.sessionDurationMinutes,
      currentValue: 0,
      unit: 'min',
      completed: false,
      iconName: 'Timer'
    }
  ];
};
