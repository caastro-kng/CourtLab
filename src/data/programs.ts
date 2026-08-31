import { Program } from '../types';

export const PROGRAMS_DATA: Program[] = [
  {
    id: 'prog-complete-guard',
    title: 'COMPLETE GUARD',
    slug: 'complete-guard',
    subtitle: 'O programa definitivo de 8 semanas para dominar a armação moderna.',
    description: 'Um currículo completo desenhado para transformar sua tomada de decisão, controle de bola, criação de arremesso e liderança dentro de quadra. Da biomecânica básica à simulação de jogo real.',
    level: 'Avançado',
    durationWeeks: 8,
    workoutsPerWeek: 4,
    category: 'complete',
    categoryLabel: 'Completo',
    xpTotal: 1200,
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    prerequisites: ['Domínio básico de drible com ambas as mãos', 'Mínimo de 3x treinos por semana'],
    weeks: [
      {
        weekNumber: 1,
        title: 'Semana 1',
        focus: 'Fundamentos + Controle de Bola Estacionário',
        days: [
          { dayOfWeek: 1, title: 'Ball Handle Foundations', workoutId: 'wk-ball-handle-foundations', focus: 'Drible de força e duas bolas' },
          { dayOfWeek: 2, title: 'Weak Hand Workout', workoutId: 'wk-weak-hand-workout', focus: 'Equalização da mão fraca' },
          { dayOfWeek: 3, title: 'Descanso Ativo', isRest: true, focus: 'Alongamento e mobilidade de tornozelo' },
          { dayOfWeek: 4, title: 'Shooting Rhythm', workoutId: 'wk-shooting-rhythm', focus: 'Alinhamento mecânico a 1m e 1-2 footwork' },
          { dayOfWeek: 5, title: 'Finishing Lab', workoutId: 'wk-finishing-lab', focus: 'Mikan drill e toque de tabela' },
          { dayOfWeek: 6, title: 'Descanso', isRest: true, focus: 'Recuperação muscular' },
          { dayOfWeek: 7, title: 'Descanso', isRest: true, focus: 'Preparação para semana 2' }
        ]
      },
      {
        weekNumber: 2,
        title: 'Semana 2',
        focus: 'Change of Pace & Mudanças de Ritmo',
        days: [
          { dayOfWeek: 1, title: 'Ball Handle Foundations + Hesitations', workoutId: 'wk-ball-handle-foundations', focus: 'Between the legs + hesi' },
          { dayOfWeek: 2, title: 'Perimeter Lock Defense', workoutId: 'wk-perimeter-defense', focus: 'Deslocamentos laterais e drop step' },
          { dayOfWeek: 3, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 4, title: 'Shot Creation', workoutId: 'wk-shot-creator', focus: '1-Dribble pull-ups' },
          { dayOfWeek: 5, title: 'Finishing Lab', workoutId: 'wk-finishing-lab', focus: 'Euro step e floaters' },
          { dayOfWeek: 6, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 7, title: 'Descanso', isRest: true, focus: 'Descanso' }
        ]
      },
      {
        weekNumber: 3,
        title: 'Semana 3',
        focus: 'Arsenal de Finalização (Finishing Package)',
        days: [
          { dayOfWeek: 1, title: 'Finishing Lab Intenso', workoutId: 'wk-finishing-lab', focus: 'Same foot same hand & high glass' },
          { dayOfWeek: 2, title: 'Weak Hand Workout', workoutId: 'wk-weak-hand-workout', focus: 'Bandejas e passes com a esquerda' },
          { dayOfWeek: 3, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 4, title: 'Shot Creation', workoutId: 'wk-shot-creator', focus: 'Step backs e side steps' },
          { dayOfWeek: 5, title: 'Guard Workout', workoutId: 'wk-guard-workout', focus: 'Combinação de penetração e passe' },
          { dayOfWeek: 6, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 7, title: 'Descanso', isRest: true, focus: 'Descanso' }
        ]
      },
      {
        weekNumber: 4,
        title: 'Semana 4',
        focus: 'Pull-up & Mid-Range Mastery',
        days: [
          { dayOfWeek: 1, title: 'Shooting Rhythm', workoutId: 'wk-shooting-rhythm', focus: 'Volume de arremessos da meia distância' },
          { dayOfWeek: 2, title: 'Shot Creation', workoutId: 'wk-shot-creator', focus: 'Desaceleração brusca em suspensão' },
          { dayOfWeek: 3, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 4, title: 'Perimeter Lock Defense', workoutId: 'wk-perimeter-defense', focus: 'Closeouts sem ceder o pull-up' },
          { dayOfWeek: 5, title: 'Guard Workout', workoutId: 'wk-guard-workout', focus: 'Passe direto da batida' },
          { dayOfWeek: 6, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 7, title: 'Descanso', isRest: true, focus: 'Descanso' }
        ]
      },
      {
        weekNumber: 5,
        title: 'Semana 5',
        focus: 'Pick and Roll: Leituras & Pocket Passes',
        days: [
          { dayOfWeek: 1, title: 'Pick and Roll Guard', workoutId: 'wk-pnr-guard', focus: 'Shoulder to hip e pocket pass' },
          { dayOfWeek: 2, title: 'Guard Workout', workoutId: 'wk-guard-workout', focus: 'Snake dribble e jail' },
          { dayOfWeek: 3, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 4, title: 'Shot Creation', workoutId: 'wk-shot-creator', focus: 'Pull-up na saída do bloqueio' },
          { dayOfWeek: 5, title: 'Finishing Lab', workoutId: 'wk-finishing-lab', focus: 'Floaters contra drop coverage' },
          { dayOfWeek: 6, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 7, title: 'Descanso', isRest: true, focus: 'Descanso' }
        ]
      },
      {
        weekNumber: 6,
        title: 'Semana 6',
        focus: 'Shot Creation sob Pressão',
        days: [
          { dayOfWeek: 1, title: 'Shot Creation Intenso', workoutId: 'wk-shot-creator', focus: 'Separação no fim da posse' },
          { dayOfWeek: 2, title: 'Shooting Rhythm', workoutId: 'wk-shooting-rhythm', focus: 'Corner 3s e pin-down screens' },
          { dayOfWeek: 3, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 4, title: 'Pick and Roll Guard', workoutId: 'wk-pnr-guard', focus: 'Skip pass para o lado fraco' },
          { dayOfWeek: 5, title: 'Complete Scorer', workoutId: 'wk-complete-scorer', focus: 'Pontuação em 3 níveis' },
          { dayOfWeek: 6, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 7, title: 'Descanso', isRest: true, focus: 'Descanso' }
        ]
      },
      {
        weekNumber: 7,
        title: 'Semana 7',
        focus: 'Decision Making & Speed of Play',
        days: [
          { dayOfWeek: 1, title: 'Guard Workout', workoutId: 'wk-guard-workout', focus: 'Decisão em frações de segundo' },
          { dayOfWeek: 2, title: 'Perimeter Lock Defense', workoutId: 'wk-perimeter-defense', focus: 'Leitura de passe e antecipação' },
          { dayOfWeek: 3, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 4, title: 'Complete Scorer', workoutId: 'wk-complete-scorer', focus: 'Pontuação com fadiga acumulada' },
          { dayOfWeek: 5, title: 'Pick and Roll Guard', workoutId: 'wk-pnr-guard', focus: 'Leitura contra defesas híbridas' },
          { dayOfWeek: 6, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 7, title: 'Descanso', isRest: true, focus: 'Descanso' }
        ]
      },
      {
        weekNumber: 8,
        title: 'Semana 8',
        focus: 'Game Simulation & Leve para o Jogo',
        days: [
          { dayOfWeek: 1, title: 'Complete Scorer', workoutId: 'wk-complete-scorer', focus: 'Avaliação final de repertório' },
          { dayOfWeek: 2, title: 'Guard Workout', workoutId: 'wk-guard-workout', focus: 'Ritmo competitivo total' },
          { dayOfWeek: 3, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 4, title: 'Shooting Rhythm', workoutId: 'wk-shooting-rhythm', focus: 'Lances livres sob pressão e 3pts' },
          { dayOfWeek: 5, title: 'Shot Creation', workoutId: 'wk-shot-creator', focus: 'Consolidação do programa' },
          { dayOfWeek: 6, title: 'Descanso', isRest: true, focus: 'Descanso' },
          { dayOfWeek: 7, title: 'Formatura do Programa', isRest: true, focus: 'Conclusão +1200 XP' }
        ]
      }
    ]
  },
  {
    id: 'prog-ball-handle-fundamentals',
    title: 'Ball Handle Fundamentals',
    slug: 'ball-handle-fundamentals',
    subtitle: '4 semanas para transformar a bola em uma extensão do seu corpo.',
    description: 'Focado em jogadores que desejam eliminar a insegurança com a bola nas mãos, dominar o drible de proteção e adquirir velocidade de execução.',
    level: 'Iniciante',
    durationWeeks: 4,
    workoutsPerWeek: 3,
    category: 'ball-handle',
    categoryLabel: 'Controle de Bola',
    xpTotal: 600,
    thumbnail: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    weeks: [
      {
        weekNumber: 1,
        title: 'Semana 1',
        focus: 'Postura, Pound e Drible Estacionário',
        days: [
          { dayOfWeek: 1, title: 'Fundamentos de Pound', workoutId: 'wk-ball-handle-foundations', focus: 'Postura atlética e força de drible' },
          { dayOfWeek: 3, title: 'Dois Balões e Ritmo', workoutId: 'wk-ball-handle-foundations', focus: 'Coordenação bimanual' },
          { dayOfWeek: 5, title: 'Mão Fraca Inicial', workoutId: 'wk-weak-hand-workout', focus: 'Iniciação com mão não dominante' }
        ]
      },
      {
        weekNumber: 2,
        title: 'Semana 2',
        focus: 'Mudanças de Direção Simples',
        days: [
          { dayOfWeek: 1, title: 'Crossover Rasante', workoutId: 'wk-ball-handle-foundations', focus: 'Ataque abaixo dos joelhos' },
          { dayOfWeek: 3, title: 'In & Out Fake', workoutId: 'wk-ball-handle-foundations', focus: 'Finta de corpo' },
          { dayOfWeek: 5, title: 'Mão Fraca em Velocidade', workoutId: 'wk-weak-hand-workout', focus: 'Drible em linha reta com esquerda' }
        ]
      },
      {
        weekNumber: 3,
        title: 'Semana 3',
        focus: 'Between the Legs & Behind the Back',
        days: [
          { dayOfWeek: 1, title: 'Between the Legs Flow', workoutId: 'wk-ball-handle-foundations', focus: 'Passagem limpa entre as pernas' },
          { dayOfWeek: 3, title: 'Behind the Back Wrap', workoutId: 'wk-guard-workout', focus: 'Envolvimento do quadril' },
          { dayOfWeek: 5, title: 'Weak Hand Pocket', workoutId: 'wk-weak-hand-workout', focus: 'Pocket dribbles' }
        ]
      },
      {
        weekNumber: 4,
        title: 'Semana 4',
        focus: 'Combinações e Drible sob Pressão',
        days: [
          { dayOfWeek: 1, title: 'Combos Rápidos', workoutId: 'wk-ball-handle-foundations', focus: 'Pound + Cross + Between' },
          { dayOfWeek: 3, title: 'Retreat & Attack', workoutId: 'wk-guard-workout', focus: 'Drible de recuo' },
          { dayOfWeek: 5, title: 'Teste de Domínio de Drible', workoutId: 'wk-ball-handle-foundations', focus: 'Avaliação prática final' }
        ]
      }
    ]
  },
  {
    id: 'prog-elite-shooter',
    title: 'Elite Shooter',
    slug: 'elite-shooter',
    subtitle: '6 semanas de precisão cirúrgica e alto aproveitamento do perímetro.',
    description: 'Projetado para construir arremessadores confiáveis tanto em catch & shoot quanto em saídas de bloqueio e pull-ups sob marcação cerrada.',
    level: 'Avançado',
    durationWeeks: 6,
    workoutsPerWeek: 4,
    category: 'shooting',
    categoryLabel: 'Arremesso',
    xpTotal: 900,
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    weeks: [
      {
        weekNumber: 1,
        title: 'Semana 1',
        focus: 'Biomecânica e Alinhamento Perfeito',
        days: [
          { dayOfWeek: 1, title: 'Form Shooting & Swish', workoutId: 'wk-shooting-rhythm', focus: 'Alinhamento cotovelo-punho' },
          { dayOfWeek: 2, title: 'Catch & Shoot 1-2 Footwork', workoutId: 'wk-shooting-rhythm', focus: 'Pés na pocket' },
          { dayOfWeek: 4, title: 'Corner 3s', workoutId: 'wk-shooting-rhythm', focus: 'Volume nas zonas mortas' },
          { dayOfWeek: 5, title: 'Shot Creation Intro', workoutId: 'wk-shot-creator', focus: '1-dribble pull-ups' }
        ]
      },
      {
        weekNumber: 2,
        title: 'Semana 2',
        focus: 'Velocidade de Soltura (Quick Release)',
        days: [
          { dayOfWeek: 1, title: 'Catch & Shoot Veloz', workoutId: 'wk-shooting-rhythm', focus: 'Subida sem abaixar a bola' },
          { dayOfWeek: 2, title: 'Pin-down Curl & Flare', workoutId: 'wk-shooting-rhythm', focus: 'Arremesso em movimento' },
          { dayOfWeek: 4, title: 'Shot Creation Pull-ups', workoutId: 'wk-shot-creator', focus: 'Frenagem vertical' },
          { dayOfWeek: 5, title: 'Lances Livres com Fadiga', workoutId: 'wk-shooting-rhythm', focus: 'Calibração mental' }
        ]
      }
    ]
  },
  {
    id: 'prog-finishing-package',
    title: 'Finishing Package',
    slug: 'finishing-package',
    subtitle: '4 semanas para se tornar letal ao redor do aro contra qualquer defensor.',
    description: 'Aprenda o pacote completo de finalizações acrobáticas, floaters, euro steps e absorção de contato.',
    level: 'Intermediário',
    durationWeeks: 4,
    workoutsPerWeek: 3,
    category: 'finishing',
    categoryLabel: 'Finalização',
    xpTotal: 550,
    thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80',
    weeks: []
  },
  {
    id: 'prog-pick-and-roll-mastery',
    title: 'Pick and Roll Mastery',
    slug: 'pick-and-roll-mastery',
    subtitle: '4 semanas para dominar a jogada mais importante do basquete moderno.',
    description: 'Leitura de defesas Drop, Switch, Blitz e Hedge, com passes milimétricos e tomadas de decisão de elite.',
    level: 'Avançado',
    durationWeeks: 4,
    workoutsPerWeek: 3,
    category: 'pick-and-roll',
    categoryLabel: 'Pick and Roll',
    xpTotal: 650,
    thumbnail: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=800&q=80',
    weeks: []
  },
  {
    id: 'prog-perimeter-defense',
    title: 'Perimeter Defense Lock',
    slug: 'perimeter-defense-lock',
    subtitle: '3 semanas para se tornar o marcador que nenhum atacante quer enfrentar.',
    description: 'Pés rápidos, leitura de antecipação, contenção sem falta e defesa de bloqueios.',
    level: 'Intermediário',
    durationWeeks: 3,
    workoutsPerWeek: 3,
    category: 'defense',
    categoryLabel: 'Defesa',
    xpTotal: 450,
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    weeks: []
  }
];
