import { Workout } from '../types';

export const WORKOUTS_DATA: Workout[] = [
  {
    id: 'wk-shot-creator',
    title: 'Shot Creation',
    slug: 'shot-creation',
    description: 'Desenvolva a capacidade de criar seu próprio arremesso a partir do drible, paradas bruscas e step backs.',
    category: 'shooting',
    categoryLabel: 'Arremesso',
    level: 'Intermediário',
    estimatedMinutes: 45,
    xpReward: 120,
    tags: ['Shot Creation', 'Pull-up', 'Step Back', '1v1'],
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    featured: true,
    exercises: [
      { exerciseId: 'bh-01', customSets: 3, customReps: '20 reps', restSeconds: 30 },
      { exerciseId: 'bh-02', customSets: 3, customReps: '15 reps', restSeconds: 30 },
      { exerciseId: 'fw-02', customSets: 3, customReps: '12 jabs cada pé', restSeconds: 30 },
      { exerciseId: 'sh-01', customSets: 2, customReps: '15 acertos', restSeconds: 20 },
      { exerciseId: 'sh-02', customSets: 3, customReps: '10 de cada lado', restSeconds: 40 },
      { exerciseId: 'sh-03', customSets: 3, customReps: '10 pull-ups cada lado', restSeconds: 45 },
      { exerciseId: 'sh-06', customSets: 3, customReps: '8 side steps cada lado', restSeconds: 45 },
      { exerciseId: 'sh-04', customSets: 3, customReps: '6 step backs cada lado', restSeconds: 50 }
    ]
  },
  {
    id: 'wk-ball-handle-foundations',
    title: 'Ball Handle Foundations',
    slug: 'ball-handle-foundations',
    description: 'Construa a base sólida do drible: força no pound, velocidade na troca e independência das duas mãos.',
    category: 'ball-handle',
    categoryLabel: 'Controle de Bola',
    level: 'Iniciante',
    estimatedMinutes: 30,
    xpReward: 100,
    tags: ['Ball Handle', 'Fundamentos', 'Stationary', 'Two Ball'],
    thumbnail: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    featured: true,
    exercises: [
      { exerciseId: 'bh-04', customSets: 4, customDurationSeconds: 60, restSeconds: 30 },
      { exerciseId: 'bh-01', customSets: 3, customReps: '15 reps cada lado', restSeconds: 30 },
      { exerciseId: 'bh-05', customSets: 3, customReps: '12 combos', restSeconds: 30 },
      { exerciseId: 'bh-07', customSets: 3, customReps: '8 sprints', restSeconds: 40 },
      { exerciseId: 'fn-01', customSets: 3, customReps: '20 bandejas', restSeconds: 30 }
    ]
  },
  {
    id: 'wk-guard-workout',
    title: 'Guard Workout',
    slug: 'guard-workout',
    description: 'Rotina completa para armadores e alas: leitura de Pick and Roll, passes rápidos e mudanças de velocidade.',
    category: 'complete',
    categoryLabel: 'Completo',
    level: 'Avançado',
    estimatedMinutes: 50,
    xpReward: 140,
    tags: ['Guard Skills', 'Pick and Roll', 'Passing', 'Decision Making'],
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    featured: true,
    exercises: [
      { exerciseId: 'bh-03', customSets: 3, customReps: '12 reps', restSeconds: 30 },
      { exerciseId: 'bh-06', customSets: 3, customReps: '15 toss', restSeconds: 30 },
      { exerciseId: 'pnr-01', customSets: 3, customReps: '12 pocket feeds', restSeconds: 45 },
      { exerciseId: 'pnr-02', customSets: 3, customReps: '8 snakes', restSeconds: 45 },
      { exerciseId: 'ps-01', customSets: 3, customReps: '15 push passes', restSeconds: 30 },
      { exerciseId: 'fn-02', customSets: 3, customReps: '10 floaters', restSeconds: 40 },
      { exerciseId: 'sh-03', customSets: 3, customReps: '8 pull-ups', restSeconds: 45 }
    ]
  },
  {
    id: 'wk-shooting-rhythm',
    title: 'Shooting Rhythm & Volume',
    slug: 'shooting-rhythm',
    description: 'Treino de alto volume de arremessos focando em consistência mecânica, catch & shoot e arremessos em curva.',
    category: 'shooting',
    categoryLabel: 'Arremesso',
    level: 'Intermediário',
    estimatedMinutes: 40,
    xpReward: 110,
    tags: ['Catch & Shoot', 'Corner 3s', 'Volume', 'Swish'],
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    exercises: [
      { exerciseId: 'sh-01', customSets: 3, customReps: '15 acertos', restSeconds: 20 },
      { exerciseId: 'sh-02', customSets: 4, customReps: '12 arremessos', restSeconds: 35 },
      { exerciseId: 'sh-05', customSets: 4, customReps: '10 corner 3s', restSeconds: 40 },
      { exerciseId: 'sh-08', customSets: 3, customReps: '10 pin-down shots', restSeconds: 45 },
      { exerciseId: 'sh-07', customSets: 2, customReps: '15 lances livres', restSeconds: 30 }
    ]
  },
  {
    id: 'wk-finishing-lab',
    title: 'Finishing Lab',
    slug: 'finishing-lab',
    description: 'Arsenal completo ao redor do aro: Euro steps, floaters altos, reverse layups e toques com a mão fraca.',
    category: 'finishing',
    categoryLabel: 'Finalização',
    level: 'Intermediário',
    estimatedMinutes: 35,
    xpReward: 105,
    tags: ['Floater', 'Euro Step', 'Reverse', 'High Glass'],
    thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80',
    exercises: [
      { exerciseId: 'fn-01', customSets: 3, customReps: '25 bandejas', restSeconds: 25 },
      { exerciseId: 'fn-02', customSets: 3, customReps: '12 floaters', restSeconds: 35 },
      { exerciseId: 'fn-03', customSets: 3, customReps: '10 euro steps cada lado', restSeconds: 40 },
      { exerciseId: 'fn-05', customSets: 3, customReps: '8 reverse cada lado', restSeconds: 40 },
      { exerciseId: 'fn-04', customSets: 3, customReps: '8 Nash finishes', restSeconds: 40 },
      { exerciseId: 'fn-08', customSets: 2, customReps: '10 high glass', restSeconds: 30 }
    ]
  },
  {
    id: 'wk-weak-hand-workout',
    title: 'Weak Hand Workout',
    slug: 'weak-hand-workout',
    category: 'ball-handle',
    categoryLabel: 'Controle de Bola',
    description: 'Elimine de vez a limitação do seu lado não dominante. Drible sob pressão, passes com 1 mão e bandejas difíceis.',
    level: 'Intermediário',
    estimatedMinutes: 35,
    xpReward: 100,
    tags: ['Mão Fraca', 'No Weak Side', 'Bilateral', 'Coordination'],
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    exercises: [
      { exerciseId: 'bh-04', customSets: 4, customDurationSeconds: 45, restSeconds: 30 },
      { exerciseId: 'bh-07', customSets: 4, customReps: '10 sprints', restSeconds: 40 },
      { exerciseId: 'ps-01', customSets: 3, customReps: '20 passes de mão fraca', restSeconds: 30 },
      { exerciseId: 'fn-01', customSets: 3, customReps: '20 bandejas só mão esquerda', restSeconds: 30 },
      { exerciseId: 'fn-03', customSets: 3, customReps: '10 euros com finalização esquerda', restSeconds: 40 }
    ]
  },
  {
    id: 'wk-pnr-guard',
    title: 'Pick and Roll Guard',
    slug: 'pick-and-roll-guard',
    category: 'pick-and-roll',
    categoryLabel: 'Pick and Roll',
    description: 'Aprenda a ler todas as coberturas defensivas (Drop, Switch, Hedge, Blitz) e tomar decisões instantâneas.',
    level: 'Avançado',
    estimatedMinutes: 45,
    xpReward: 130,
    tags: ['PnR', 'Pocket Pass', 'Snake Dribble', 'Skip Pass'],
    thumbnail: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=800&q=80',
    exercises: [
      { exerciseId: 'bh-02', customSets: 3, customReps: '12 reps', restSeconds: 30 },
      { exerciseId: 'pnr-01', customSets: 4, customReps: '10 pocket feeds', restSeconds: 40 },
      { exerciseId: 'pnr-02', customSets: 3, customReps: '8 snakes', restSeconds: 45 },
      { exerciseId: 'ps-02', customSets: 3, customReps: '10 skip passes', restSeconds: 40 },
      { exerciseId: 'fn-02', customSets: 3, customReps: '10 floaters pós PnR', restSeconds: 35 },
      { exerciseId: 'sh-03', customSets: 3, customReps: '8 pull-ups do PnR', restSeconds: 45 }
    ]
  },
  {
    id: 'wk-complete-scorer',
    title: 'Complete Scorer',
    slug: 'complete-scorer',
    category: 'complete',
    categoryLabel: 'Completo',
    description: 'Rotina de pontuador completo: arremessos nos 3 níveis (perímetro, meia distância e aro) sob pressão de jogo.',
    level: 'Competitivo',
    estimatedMinutes: 55,
    xpReward: 160,
    tags: ['3-Level Scorer', 'Finishing', 'Pull-up', 'Step Back'],
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    exercises: [
      { exerciseId: 'fw-02', customSets: 3, customReps: '12 reps', restSeconds: 30 },
      { exerciseId: 'bh-01', customSets: 3, customReps: '15 reps', restSeconds: 30 },
      { exerciseId: 'sh-02', customSets: 3, customReps: '10 catch & shoot', restSeconds: 35 },
      { exerciseId: 'sh-03', customSets: 3, customReps: '8 pull-ups', restSeconds: 40 },
      { exerciseId: 'fn-03', customSets: 3, customReps: '8 euro steps', restSeconds: 40 },
      { exerciseId: 'fn-06', customSets: 3, customReps: '8 spin finishes', restSeconds: 40 },
      { exerciseId: 'sh-04', customSets: 3, customReps: '6 step backs', restSeconds: 45 },
      { exerciseId: 'sh-07', customSets: 2, customReps: '10 lances livres', restSeconds: 30 }
    ]
  },
  {
    id: 'wk-perimeter-defense',
    title: 'Perimeter Lock Defense',
    slug: 'perimeter-lock-defense',
    category: 'defense',
    categoryLabel: 'Defesa',
    description: 'Construa pés rápidos, closeouts controlados e capacidade de conter penetrações no mano a mano.',
    level: 'Intermediário',
    estimatedMinutes: 30,
    xpReward: 100,
    tags: ['Defense', 'Slides', 'Closeout', 'Lockdown'],
    thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80',
    exercises: [
      { exerciseId: 'at-01', customSets: 3, customReps: '8 bounds cada perna', restSeconds: 45 },
      { exerciseId: 'df-02', customSets: 4, customReps: '4 travessias de quadra', restSeconds: 45 },
      { exerciseId: 'df-01', customSets: 4, customReps: '8 closeouts', restSeconds: 40 },
      { exerciseId: 'fw-01', customSets: 3, customReps: '8 paradas em sprint', restSeconds: 35 }
    ]
  }
];
