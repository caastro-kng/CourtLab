import { Exercise, Goal, PlayerProfile, Program, SkillRating, Workout, WorkoutSessionLog, SkillCategory } from '../types';

export type RecommendationReason = {
  score: number;
  reason: string;
  matchedFocus?: string;
};

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const SKILL_TO_CATEGORY: Record<string, SkillCategory | 'complete'> = {
  'ball-handle': 'ball-handle',
  shooting: 'shooting',
  'three-points': 'shooting',
  'mid-range': 'shooting',
  finishing: 'finishing',
  'weak-hand': 'finishing',
  passing: 'passing',
  'court-vision': 'passing',
  'pick-and-roll': 'pick-and-roll',
  defense: 'defense',
  speed: 'athletic',
  explosion: 'athletic',
  conditioning: 'athletic',
  'change-of-pace': 'ball-handle',
  'off-ball': 'off-ball',
  confidence: 'complete'
};

const GOAL_KEYWORDS: Array<[string, SkillCategory | 'complete']> = [
  ['arremesso', 'shooting'],
  ['shoot', 'shooting'],
  ['3 pontos', 'shooting'],
  ['bola', 'ball-handle'],
  ['handle', 'ball-handle'],
  ['ritmo', 'ball-handle'],
  ['final', 'finishing'],
  ['bandeja', 'finishing'],
  ['passe', 'passing'],
  ['visao', 'passing'],
  ['pick', 'pick-and-roll'],
  ['pnr', 'pick-and-roll'],
  ['defesa', 'defense'],
  ['sem bola', 'off-ball'],
  ['movimentacao', 'off-ball'],
  ['explos', 'athletic'],
  ['veloc', 'athletic'],
  ['condicion', 'athletic']
];

const getGoalCategories = (profile: PlayerProfile, goals: Goal[]) => {
  const text = normalize([
    ...(profile.primaryGoals || []),
    ...goals.filter((goal) => !goal.completed).map((goal) => goal.title)
  ].join(' '));

  return GOAL_KEYWORDS.filter(([keyword]) => text.includes(keyword)).map(([, category]) => category);
};

const getWeakSkills = (skills: SkillRating[]) => [...skills].sort((a, b) => a.score - b.score).slice(0, 4);

const recentWorkoutCounts = (logs: WorkoutSessionLog[]) => {
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const counts = new Map<string, number>();
  logs.filter((log) => new Date(log.completedAt).getTime() >= cutoff).forEach((log) => {
    counts.set(log.workoutId, (counts.get(log.workoutId) || 0) + 1);
  });
  return counts;
};

export const getWorkoutRecommendation = (
  workout: Workout,
  profile: PlayerProfile,
  skills: SkillRating[],
  goals: Goal[],
  logs: WorkoutSessionLog[]
): RecommendationReason => {
  let score = 0;
  const reasons: string[] = [];
  const weakSkills = getWeakSkills(skills);
  const goalCategories = getGoalCategories(profile, goals);
  const recentCounts = recentWorkoutCounts(logs);

  weakSkills.forEach((skill, index) => {
    const category = SKILL_TO_CATEGORY[skill.key];
    if (category === workout.category || (category === 'complete' && workout.category === 'complete')) {
      score += 34 - index * 6;
      if (index === 0) reasons.push(`ataca seu principal foco: ${skill.name}`);
    }
  });

  if (goalCategories.includes(workout.category)) {
    score += 24;
    reasons.push('combina com seus objetivos atuais');
  }

  if (workout.level === profile.level) score += 10;
  else if (profile.level === 'Competitivo' && workout.level === 'Avançado') score += 6;
  else if (profile.level === 'Avançado' && workout.level === 'Intermediário') score += 4;

  const positionText = normalize(profile.position);
  const workoutText = normalize(`${workout.title} ${workout.description} ${workout.tags.join(' ')}`);
  if ((positionText.includes('pg') || positionText.includes('sg')) && /(guard|armador|pnr|pull-up|handle|creation)/.test(workoutText)) {
    score += 8;
  }

  const repetitions = recentCounts.get(workout.id) || 0;
  if (repetitions >= 2) score -= 18;
  else if (repetitions === 1) score -= 7;

  return {
    score,
    reason: reasons.length ? `Recomendado porque ${reasons.slice(0, 2).join(' e ')}.` : 'Boa opção para variar o estímulo e manter sua semana equilibrada.',
    matchedFocus: weakSkills[0]?.name
  };
};

export const rankWorkouts = (
  workouts: Workout[],
  profile: PlayerProfile,
  skills: SkillRating[],
  goals: Goal[],
  logs: WorkoutSessionLog[]
) => [...workouts]
  .map((item) => ({ item, ...getWorkoutRecommendation(item, profile, skills, goals, logs) }))
  .sort((a, b) => b.score - a.score);

export const getExerciseRecommendation = (
  exercise: Exercise,
  profile: PlayerProfile,
  skills: SkillRating[],
  goals: Goal[]
): RecommendationReason => {
  let score = 0;
  const reasons: string[] = [];
  const weakSkills = getWeakSkills(skills);
  const goalCategories = getGoalCategories(profile, goals);

  weakSkills.forEach((skill, index) => {
    if (SKILL_TO_CATEGORY[skill.key] === exercise.category) {
      score += 32 - index * 6;
      if (index === 0) reasons.push(`trabalha ${skill.name}`);
    }
  });

  if (goalCategories.includes(exercise.category)) {
    score += 22;
    reasons.push('está alinhado às suas metas');
  }
  if (exercise.difficulty === profile.level) score += 8;

  return {
    score,
    reason: reasons.length ? `Boa escolha agora: ${reasons.slice(0, 2).join(' e ')}.` : 'Ajuda a diversificar seu desenvolvimento técnico.',
    matchedFocus: weakSkills[0]?.name
  };
};

export const rankExercises = (
  exercises: Exercise[],
  profile: PlayerProfile,
  skills: SkillRating[],
  goals: Goal[]
) => [...exercises]
  .map((item) => ({ item, ...getExerciseRecommendation(item, profile, skills, goals) }))
  .sort((a, b) => b.score - a.score);

export const getProgramRecommendation = (
  program: Program,
  profile: PlayerProfile,
  skills: SkillRating[],
  goals: Goal[]
): RecommendationReason => {
  let score = 0;
  const weakSkills = getWeakSkills(skills);
  const goalCategories = getGoalCategories(profile, goals);
  const reasons: string[] = [];

  weakSkills.forEach((skill, index) => {
    const category = SKILL_TO_CATEGORY[skill.key];
    if (category === program.category || (program.category === 'complete' && index < 2)) {
      score += program.category === 'complete' ? 12 : 30 - index * 5;
      if (index === 0) reasons.push(`prioriza ${skill.name}`);
    }
  });

  if (goalCategories.includes(program.category)) {
    score += 24;
    reasons.push('conversa com seus objetivos');
  }
  if (program.level === profile.level) score += 10;

  return {
    score,
    reason: reasons.length ? `Faz sentido para você porque ${reasons.slice(0, 2).join(' e ')}.` : 'Uma trilha equilibrada para ampliar seu repertório.',
    matchedFocus: weakSkills[0]?.name
  };
};

export const rankPrograms = (
  programs: Program[],
  profile: PlayerProfile,
  skills: SkillRating[],
  goals: Goal[]
) => [...programs]
  .map((item) => ({ item, ...getProgramRecommendation(item, profile, skills, goals) }))
  .sort((a, b) => b.score - a.score);
