import { Exercise } from '../types';

export const EXERCISES_DATA: Exercise[] = [
  // ----------------------------------------------------
  // CONTROLE DE BOLA (BALL HANDLE)
  // ----------------------------------------------------
  {
    id: 'bh-01',
    name: 'Pound + Crossover Attack',
    slug: 'pound-crossover-attack',
    category: 'ball-handle',
    categoryLabel: 'Controle de Bola',
    subcategory: 'Crossover',
    description: 'Combinação clássica de força e velocidade para quebrar o ritmo defensivo e cruzar a bola abaixo dos joelhos.',
    difficulty: 'Intermediário',
    durationMinutes: 3,
    reps: '20 repetições por lado',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Área pequena',
    instructions: [
      'Fique em posição atlética de tripla ameaça, com pés ligeiramente além da largura dos ombros.',
      'Execute 2 Pound Dribbles potentes com a mão direita, na altura do quadril.',
      'Afunde o centro de gravidade e execute um Crossover rápido e rasante rente aos joelhos para a mão esquerda.',
      'Absorva o impacto na mão esquerda e ataque o espaço imediatamente.',
      'Repita o padrão iniciando com a mão esquerda.'
    ],
    tips: [
      'Mantenha o quadril baixo e o tronco ativo.',
      'Não olhe para a bola; foque os olhos no aro ou no defensor imaginário.',
      'Ataque o chão no drible; quanto mais forte a bola subir, mais rápido será o controle.'
    ],
    commonMistakes: [
      'Ficar com o tronco ereto e joelhos estendidos.',
      'Crossover muito alto, facilitando o desarme pelo defensor.',
      'Movimentar apenas os braços sem deslocar o peso do corpo.'
    ],
    gameTransfer: {
      skill: 'Crossover Explosivo',
      drill: 'Pound + Crossover Attack',
      gameSituation: 'Defensor pressionando de perto no mano a mano no topo da cabeça.',
      objective: 'Fazer o defensor hesitar no pound e congelar na mudança brusca de direção.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'top'
  },
  {
    id: 'bh-02',
    name: 'Between the Legs + Hesitation',
    slug: 'between-the-legs-hesitation',
    category: 'ball-handle',
    categoryLabel: 'Controle de Bola',
    subcategory: 'Between the Legs',
    description: 'Trabalho de mudança de ritmo passando a bola entre as pernas com pausa calculada nos olhos.',
    difficulty: 'Intermediário',
    durationMinutes: 4,
    reps: '15 reps por perna',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Área pequena',
    instructions: [
      'Inicie em deslocamento curto ou drible estacionário em base aberta.',
      'Passe a bola entre as pernas de frente para trás em ângulo de 45 graus.',
      'Ao receber a bola na mão posterior, faça uma Hesitation elevando o olhar para o aro como se fosse arremessar.',
      'Assim que o defensor subir na finta, ataque a passada lateralmente.'
    ],
    tips: [
      'O segredo da hesitation está nos olhos e na leve subida do tronco antes do rebaixamento.',
      'Mantenha o drible protegido com o antebraço oposto (off-arm).'
    ],
    commonMistakes: [
      'Bater a bola na coxa ou no calcanhar.',
      'Não pausar na hesitation, tornando o movimento previsível.'
    ],
    gameTransfer: {
      skill: 'Hesitation Move',
      drill: 'Between the Legs + Hesi',
      gameSituation: 'Leitura em transição rápida no 1v1 na quadra de ataque.',
      objective: 'Congelar o recuo do defensor para escolher entre arremesso em suspensão ou infiltração.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },
  {
    id: 'bh-03',
    name: 'Behind the Back Wrap + Drop',
    slug: 'behind-the-back-wrap-drop',
    category: 'ball-handle',
    categoryLabel: 'Behind the Back',
    subcategory: 'Behind the Back',
    description: 'Drible por trás das costas envolvendo o quadril com drop stance para troca rápida de corredor.',
    difficulty: 'Avançado',
    durationMinutes: 4,
    reps: '12 repetições alternadas',
    sets: 4,
    equipment: ['1 bola', 'Cone'],
    space: 'Meia quadra',
    instructions: [
      'Ataque o cone com 2 dribles em velocidade.',
      'Na distância de 1 metro do cone, realize o drop stance (pés em tesoura rápida).',
      'Passe a bola por trás das costas em arco justo abaixo dos glúteos.',
      'Exploda na passada com o pé contrário e finalize com passada larga.'
    ],
    tips: [
      'A bola deve passar rente ao corpo sem subir acima da linha da cintura.',
      'Gire o punho com firmeza para dar rotação e direção imediata à bola.'
    ],
    commonMistakes: [
      'Bater a bola nos glúteos ou pernas.',
      'Pular em vez de deslizar os pés no drop.'
    ],
    gameTransfer: {
      skill: 'Behind the Back em Transição',
      drill: 'Behind the Back Wrap + Drop',
      gameSituation: 'Contra-ataque com defensor cortando a linha de penetração reta.',
      objective: 'Mudar de direção em velocidade máxima mantendo o corpo como escudo protetor.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'top'
  },
  {
    id: 'bh-04',
    name: 'Stationary Two-Ball Rhythm Drills',
    slug: 'stationary-two-ball-rhythm',
    category: 'ball-handle',
    categoryLabel: 'Controle de Bola',
    subcategory: 'Two Ball Drills',
    description: 'Exercício neuro-motor com 2 bolas para igualar a força das duas mãos e ampliar a visão periférica.',
    difficulty: 'Iniciante',
    durationMinutes: 5,
    reps: '30s simultâneo / 30s alternado',
    sets: 4,
    equipment: ['2 bolas'],
    space: 'Casa',
    instructions: [
      'Posicione-se com joelhos flexionados e cabeça erguida.',
      'Execute dribles simultâneos na altura dos joelhos por 30 segundos.',
      'Alterne para dribles intercalados (piston dribbles) por mais 30 segundos.',
      'Finalize com 1 drible alto e 1 drible baixo simultaneamente.'
    ],
    tips: [
      'Foque em manter a mesma pressão em ambas as mãos.',
      'Procure ler números ou olhar para uma parede à frente sem abaixar a cabeça.'
    ],
    commonMistakes: [
      'A mão fraca perder o ritmo e bater mais fraco.',
      'Olhar constantemente para o chão.'
    ],
    gameTransfer: {
      skill: 'Coordenação Bimanual',
      drill: 'Two-Ball Sync/Async',
      gameSituation: 'Pressão defensiva em quadra inteira com armador sendo dobrado.',
      objective: 'Capacidade de controlar a bola com a mão fraca sob stress sem precisar olhar.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'restricted'
  },
  {
    id: 'bh-05',
    name: 'In & Out + Cross Combo',
    slug: 'in-and-out-cross-combo',
    category: 'ball-handle',
    categoryLabel: 'Controle de Bola',
    subcategory: 'In & Out',
    description: 'Finta de corpo inteira simulando infiltração na mesma direção antes de cortar no contra-fluxo.',
    difficulty: 'Intermediário',
    durationMinutes: 3,
    reps: '15 combos cada mão',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Área pequena',
    instructions: [
      'Drible com a mão direita empurrando a bola em semi-círculo para dentro e puxando de volta (In & Out).',
      'Desloque os ombros e a cabeça na direção da finta.',
      'Imediatamente após a recuperação da bola, engate um Crossover explosivo para a esquerda.',
      'Avance 2 passos simulando quebra de linha defensiva.'
    ],
    tips: [
      'A mão não pode carregar por baixo da bola (carry); mantenha a palma no topo/lateral.',
      'Venda a finta com a cabeça e com o pé de apoio.'
    ],
    commonMistakes: [
      'Carregar a bola (condução irregular).',
      'Fazer o in & out sem mover o tronco superior.'
    ],
    gameTransfer: {
      skill: 'In & Out Fake Attack',
      drill: 'In & Out + Cross',
      gameSituation: 'Ataque em closeout defensivo na ala (wing).',
      objective: 'Desequilibrar o defensor que está recuperando a passada defensiva.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },
  {
    id: 'bh-06',
    name: 'Tennis Ball Toss & Pound',
    slug: 'tennis-ball-toss-pound',
    category: 'ball-handle',
    categoryLabel: 'Controle de Bola',
    subcategory: 'Tennis Ball Drills',
    description: 'Drible vigoroso com uma mão enquanto arremessa e agarra uma bola de tênis com a outra mão.',
    difficulty: 'Avançado',
    durationMinutes: 4,
    reps: '20 arremessos por mão',
    sets: 3,
    equipment: ['1 bola', 'Bola de tênis'],
    space: 'Casa',
    instructions: [
      'Mantenha drible potente e contínuo com a bola de basquete na mão direita.',
      'Com a mão esquerda, lance a bola de tênis para cima na altura dos olhos e agarre-a por cima (overhand catch).',
      'Faça 10 reps e em seguida passe a bola de basquete por entre as pernas enquanto a bola de tênis está no ar.',
      'Troque as mãos.'
    ],
    tips: [
      'Exige reação rápida; não deixe o drible de basquete desacelerar.',
      'Pegue a bola de tênis com os dedos apontando para baixo para simular roubada de bola.'
    ],
    commonMistakes: [
      'Parar o drible de basquete ao focar na bola de tênis.',
      'Perder a postura atlética.'
    ],
    gameTransfer: {
      skill: 'Processamento Visual em Jogo',
      drill: 'Tennis Ball Reaction',
      gameSituation: 'Armador lendo o posicionamento da ajuda defensiva enquanto bate bola.',
      objective: 'Desacoplar a atenção visual do drible para focar na leitura tática da quadra.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'top'
  },

  // ----------------------------------------------------
  // ARREMESSO (SHOOTING)
  // ----------------------------------------------------
  {
    id: 'sh-01',
    name: 'Form Shooting a 1 Metro',
    slug: 'form-shooting-1m',
    category: 'shooting',
    categoryLabel: 'Arremesso',
    subcategory: 'Form Shooting',
    description: 'Calibração da mecânica pura de arremesso, alinhamento de cotovelo, punho solto e rotação da bola.',
    difficulty: 'Iniciante',
    durationMinutes: 5,
    reps: '15 acertos em 3 pontos diferentes',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Meia quadra',
    instructions: [
      'Posicione-se a 1 metro da cesta, frontalmente.',
      'Segure a bola apenas com a mão de arremesso (sem a mão guia inicialmente para calibrar alinhamento).',
      'Cotovelo alinhado com o quadril e o aro, punho flexionado para trás formando ângulo de 90 graus.',
      'Estenda pernas e braço em movimento fluido (One-motion), soltando a bola na ponta dos dedos com follow-through até a bola entrar sem tocar no aro (swish).',
      'Adicione a mão guia suavemente e repita a 45 graus e das laterais.'
    ],
    tips: [
      'Deixe os dedos indicador e médio apontando para o centro do aro na terminação.',
      'A bola deve girar para trás de forma reta (backspin limpo).'
    ],
    commonMistakes: [
      'Usar o polegar da mão guia para empurrar (thumb flick).',
      'Abrir o cotovelo para fora tipo "asa de frango".'
    ],
    gameTransfer: {
      skill: 'Mecânica Consistente sob Fadiga',
      drill: 'One-Hand Form Shooting',
      gameSituation: 'Qualquer arremesso em jogo: a memória muscular garante o mesmo arco sempre.',
      objective: 'Criar repetibilidade perfeita no ponto de soltura da bola.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'paint'
  },
  {
    id: 'sh-02',
    name: 'Catch & Shoot com Footwork 1-2',
    slug: 'catch-and-shoot-1-2',
    category: 'shooting',
    categoryLabel: 'Arremesso',
    subcategory: 'Catch & Shoot',
    description: 'Recepção de passe em deslocamento com parada 1-2 (interno-externo) e subida imediata para o arremesso.',
    difficulty: 'Intermediário',
    durationMinutes: 6,
    reps: '20 arremessos (10 de cada lado)',
    sets: 3,
    equipment: ['1 bola', 'Parceiro'],
    space: 'Meia quadra',
    instructions: [
      'Inicie a 2 metros da linha de 3 pontos na ala.',
      'Dê um auto-passe com rotação ou receba o passe de um parceiro enquanto corta para o perímetro.',
      'Plante o pé interno primeiro (pé esquerdo se cortando para a direita) seguido do pé externo virando os quadris para o aro.',
      'Suba direto em movimento contínuo antes que o defensor recupere o closeout.'
    ],
    tips: [
      'Pegue a bola já na "pocket de arremesso" sem precisar abaixar a bola até o joelho.',
      'Quadris e ombros devem estar alinhados ao aro no momento da decolagem.'
    ],
    commonMistakes: [
      'Abaixar a bola após receber o passe, dando tempo para o toco.',
      'Drift lateral excessivo no ar por falta de equilíbrio na base dos pés.'
    ],
    gameTransfer: {
      skill: 'Spot-up Shooting',
      drill: 'Catch & Shoot 1-2 Footwork',
      gameSituation: 'Infiltração do armador com passe para o perímetro (Drive and Kick).',
      objective: 'Converter bolas abertas de 3 pontos com rapidez e estabilidade postural.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },
  {
    id: 'sh-03',
    name: '1-Dribble Pull-Up lateral',
    slug: '1-dribble-pull-up',
    category: 'shooting',
    categoryLabel: 'Arremesso',
    subcategory: 'Pull-up',
    description: 'Ataque agressivo em 1 drible para o lado com parada brusca em suspensão na meia distância.',
    difficulty: 'Avançado',
    durationMinutes: 5,
    reps: '10 arremessos para a direita, 10 para a esquerda',
    sets: 3,
    equipment: ['1 bola', 'Cadeira'],
    space: 'Meia quadra',
    instructions: [
      'Simule a recepção no topo da cabeça ou perímetro.',
      'Execute uma finta de arremesso (shot fake) ou jab step.',
      'Dê 1 drible potente em direção à cotovelada da garrafa (elbow).',
      'Trave o movimento no 1-2 footwork ou hop, eleve o corpo na vertical e arremesse no ponto mais alto.'
    ],
    tips: [
      'Desaceleração é tão importante quanto aceleração: o pé de freio absorve a energia para converter em salto vertical.',
      'Não se incline para a frente no ar; mantenha a coluna reta.'
    ],
    commonMistakes: [
      'Correr na diagonal e arremessar caindo para o lado.',
      'Dar 2 dribles quando 1 drible longo cobriria a distância necessária.'
    ],
    gameTransfer: {
      skill: 'Pull-up Mid-Range',
      drill: '1-Dribble Lateral Pull-Up',
      gameSituation: 'Defensor corre desesperado no closeout tirando a bola de 3.',
      objective: 'Punir a recuperação defensiva atacando o espaço livre na meia distância.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'top'
  },
  {
    id: 'sh-04',
    name: 'Step Back Separation 3-Pointer',
    slug: 'step-back-separation-3pt',
    category: 'shooting',
    categoryLabel: 'Arremesso',
    subcategory: 'Step Back',
    description: 'Criação de espaço de elite empurrando contra o pé frontal para criar 1 metro de separação do marcador.',
    difficulty: 'Competitivo',
    durationMinutes: 6,
    reps: '8 acertos por lado',
    sets: 3,
    equipment: ['1 bola', 'Cone'],
    space: 'Meia quadra',
    instructions: [
      'Ataque em drible fingindo penetração forte na direção da cesta.',
      'Plante o pé guia dianteiro fundo, empurre o chão para trás e dê o passo de recuo com o pé de trás.',
      'Aterrisse em base equilibrada na linha de 3 pontos.',
      'Suba imediatamente com arco alto de arremesso.'
    ],
    tips: [
      'Use o ombro e o tronco para vender a infiltração antes de empurrar para trás.',
      'Aterrisse com os dois pés equilibrados para não perder força nas pernas.'
    ],
    commonMistakes: [
      'Pular muito para trás e ficar sem perna para o arremesso de 3.',
      'Arremessar com o corpo ainda em movimento de recuo ao invés de fixar a base.'
    ],
    gameTransfer: {
      skill: 'Espaço Individual no Fim de Posse',
      drill: 'Step Back Separation',
      gameSituation: 'Relógio de posse estourando com defesa fechada na garrafa.',
      objective: 'Criar arremesso limpo sem ajuda de companheiros contra marcadores atléticos.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },
  {
    id: 'sh-05',
    name: 'Corner 3s Transition Drill',
    slug: 'corner-3s-transition',
    category: 'shooting',
    categoryLabel: 'Arremesso',
    subcategory: 'Corner 3',
    description: 'Corrida para os cantos da quadra com pés rápidos alinhados à linha lateral para o arremesso mais eficiente do jogo.',
    difficulty: 'Intermediário',
    durationMinutes: 5,
    reps: '25 arremessos alternando cantos',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Meia quadra',
    instructions: [
      'Inicie no meio da garrafa, corra em sprint para a zona morta (corner).',
      'Gire o corpo sem pisar na linha lateral ou na linha de 3 pontos.',
      'Receba o passe imaginário e execute o arremesso com arco otimizado.',
      'Pegue o rebote, corra para o outro corner e repita.'
    ],
    tips: [
      'O arremesso de corner tem menos margem por não ter tabela de apoio: priorize backspin suave.',
      'Esteja com as mãos prontas (shot ready hands) antes da bola chegar.'
    ],
    commonMistakes: [
      'Pisar na linha lateral por falta de percepção espacial do canto.',
      'Arremessar com arco muito reto.'
    ],
    gameTransfer: {
      skill: 'Corner Spacing Specialist',
      drill: 'Sprint to Corner 3',
      gameSituation: 'Transição ofensiva em que os alas correm abrindo a quadra nos cantos.',
      objective: 'Punir rotações defensivas com a bola de 3 de menor distância da quadra.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'corner'
  },

  // ----------------------------------------------------
  // FINALIZAÇÃO (FINISHING)
  // ----------------------------------------------------
  {
    id: 'fn-01',
    name: 'Mikan Drill Clássico + Reverso',
    slug: 'mikan-drill-classic-reverse',
    category: 'finishing',
    categoryLabel: 'Finalização',
    subcategory: 'Layup básico',
    description: 'O exercício fundamental de toque de tabela com ambas as mãos sob o aro em ritmo contínuo.',
    difficulty: 'Iniciante',
    durationMinutes: 4,
    reps: '30 bandejas consecutivas',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Área pequena',
    instructions: [
      'Fique embaixo do aro.',
      'Salte na perna esquerda e finalize na tabela com a mão direita.',
      'Pegue a bola ainda no ar ou imediatamente após passar pela rede sem deixá-la cair no chão.',
      'Dê um passo com o pé direito, salte na perna direita e finalize com a mão esquerda do outro lado.',
      'Mantenha ritmo ininterrupto.'
    ],
    tips: [
      'Mantenha a bola acima da linha do peito o tempo todo.',
      'Mire no canto superior do quadrado da tabela com toque suave.'
    ],
    commonMistakes: [
      'Abaixar a bola até a cintura a cada rebote.',
      'Soltar a bola com muita força contra a tabela.'
    ],
    gameTransfer: {
      skill: 'Toque Suave ao Redor do Aro',
      drill: 'Mikan Drill Continuo',
      gameSituation: 'Rebotes ofensivos e finalizações no tráfego embaixo da cesta.',
      objective: 'Garantir 100% de aproveitamento em bandejas sem contestação.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'restricted'
  },
  {
    id: 'fn-02',
    name: 'High-Float Floater sobre a Ajuda',
    slug: 'high-float-floater',
    category: 'finishing',
    categoryLabel: 'Finalização',
    subcategory: 'Floater',
    description: 'Arremesso flutuante de uma ou duas pernas para soltar a bola acima dos braços de pivôs protetores de aro.',
    difficulty: 'Avançado',
    durationMinutes: 5,
    reps: '15 floaters de direita e 15 de esquerda',
    sets: 3,
    equipment: ['1 bola', 'Cadeira'],
    space: 'Meia quadra',
    instructions: [
      'Ataque do topo da garrafa passando ao lado da cadeira (simulando defensor de perímetro batido).',
      'Desacelere a 2 a 3 metros do aro antes de entrar no corpo do pivô.',
      'Decole em 1 pé ou 2 pés (pro hop), elevando a bola com a mão aberta e soltando em parábola alta com toque suave dos dedos.',
      'A bola não deve bater na tabela, mas cair suavemente dentro do aro.'
    ],
    tips: [
      'Não encoste a mão guia no momento da soltura; o floater é um movimento de toque puro com a palma virada para o teto.',
      'Absorva a queda com flexão dos joelhos.'
    ],
    commonMistakes: [
      'Entrar em choque com o pivô e cometer falta de ataque.',
      'Arremessar com trajetória plana que bate na parte frontal do aro.'
    ],
    gameTransfer: {
      skill: 'Finalização contra Drop Coverage',
      drill: 'High Arc Floater',
      gameSituation: 'Pivô adversário recuado no garrafão protegendo o aro.',
      objective: 'Pontuar no espaço vazio antes da área restrita sem sofrer toco.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'paint'
  },
  {
    id: 'fn-03',
    name: 'Euro Step com Troca de Eixo',
    slug: 'euro-step-axis-shift',
    category: 'finishing',
    categoryLabel: 'Finalização',
    subcategory: 'Euro Step',
    description: 'Dois passos em zigue-zague para desviar lateralmente do protetor de aro sem cometer falta de ataque.',
    difficulty: 'Intermediário',
    durationMinutes: 4,
    reps: '12 repetições cada lado',
    sets: 3,
    equipment: ['1 bola', '2 Cones'],
    space: 'Meia quadra',
    instructions: [
      'Ataque em drible na direção dos cones.',
      'Recolha a bola dando o primeiro passo forte com o pé direito para a direita (venda a infiltração neste lado).',
      'Ao invés de subir, plante o pé e dê o segundo passo explosivo com o pé esquerdo para o lado oposto (esquerda).',
      'Finalize com layup de mão esquerda protegendo a bola com o tronco.'
    ],
    tips: [
      'Segure a bola firme em cima do peito ou envolva-a (football carry) durante a troca de passada para não sofrer strips.',
      'A amplitude lateral da passada é o que garante o espaço limpo.'
    ],
    commonMistakes: [
      'Dar passos muito curtos que não deslocam o defensor.',
      'Andar com a bola por recolher antes do tempo correto.'
    ],
    gameTransfer: {
      skill: 'Finalização sem Contato Direto',
      drill: 'Euro Step Lateral Shift',
      gameSituation: 'Contra-ataque com defensor posicionado para cavar falta de ataque.',
      objective: 'Contornar o corpo do defensor no ar e finalizar limpo na tabela.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'paint'
  },
  {
    id: 'fn-04',
    name: 'Same Foot Same Hand Finish (Nash Finish)',
    slug: 'same-foot-same-hand-finish',
    category: 'finishing',
    categoryLabel: 'Finalização',
    subcategory: 'Same Foot Same Hand',
    description: 'Finalização antecipada saltando no pé do mesmo lado da mão de arremesso para pegar o defensor de surpresa.',
    difficulty: 'Avançado',
    durationMinutes: 4,
    reps: '10 acertos por lado',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Meia quadra',
    instructions: [
      'Infiltre pela ala direita em velocidade.',
      'Em vez de fazer o tradicional 1-2 saltando no pé esquerdo, decole no pé direito (Right Foot Right Hand).',
      'Solte a bola na tabela 0.5 segundo mais cedo do que a defesa espera.',
      'Repita pela esquerda decolando no pé esquerdo finalizando com a mão esquerda.'
    ],
    tips: [
      'A surpresa temporal anula o tempo de salto do bloqueador.',
      'Toque macio no canto alto da tabela.'
    ],
    commonMistakes: [
      'Hesitar na decolagem e perder a impulsão.',
      'Forçar arremesso reto sem usar a tabela.'
    ],
    gameTransfer: {
      skill: 'Manipulação do Timing Defensivo',
      drill: 'Same Foot Layup',
      gameSituation: 'Defensor atlético caçando toco pelas costas (chase-down block).',
      objective: 'Soltar a bola antes que o defensor consiga estender o braço para o toco.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'paint'
  },
  {
    id: 'fn-05',
    name: 'Reverse Layup sob Pressão de Linha de Fundo',
    slug: 'reverse-layup-baseline',
    category: 'finishing',
    categoryLabel: 'Finalização',
    subcategory: 'Reverse Layup',
    description: 'Ataque pela linha de fundo passando por baixo do aro e finalizando do lado oposto usando o aro como escudo.',
    difficulty: 'Intermediário',
    durationMinutes: 4,
    reps: '12 acertos de cada lado',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Meia quadra',
    instructions: [
      'Ataque a linha de fundo em drible rápido.',
      'Entre embaixo da tabela mantendo o controle corporal.',
      'Passe por baixo do aro e salte finalizando com rotação inversa (english) no lado contrário da tabela.',
      'Proteja a bola com a cabeça e ombros voltados para o centro da quadra.'
    ],
    tips: [
      'Use o aro e a rede como obstáculo físico contra o toco do marcador.',
      'Gire o punho de fora para dentro para dar efeito na bola ao bater na tabela.'
    ],
    commonMistakes: [
      'Pisar na linha de fundo durante a infiltração.',
      'Bater com a cabeça no aro ou suporte por falta de controle de velocidade.'
    ],
    gameTransfer: {
      skill: 'Proteção com o Aro (Rim Protection Shield)',
      drill: 'Baseline Reverse Layup',
      gameSituation: 'Infiltração de fundo onde o defensor fecha o lado primário da tabela.',
      objective: 'Criar ângulo de arremesso inalcançável para a ajuda vinda do meio da garrafa.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'restricted'
  },

  // ----------------------------------------------------
  // FOOTWORK & DECELERATION
  // ----------------------------------------------------
  {
    id: 'fw-01',
    name: 'Deceleration & Stride Stop Mastery',
    slug: 'deceleration-stride-stop',
    category: 'footwork',
    categoryLabel: 'Footwork',
    subcategory: 'Stride Stop',
    description: 'Treinamento de freio motor em alta velocidade para transição instantânea de sprint para postura de chute ou passe.',
    difficulty: 'Intermediário',
    durationMinutes: 4,
    reps: '10 sprints com paradas perfeitas',
    sets: 3,
    equipment: ['Cones'],
    space: 'Meia quadra',
    instructions: [
      'Corra em sprint máximo por 10 metros.',
      'No cone de frenagem, craque o pé traseiro seguido pelo pé dianteiro afundando o centro de gravidade em ângulo fechado.',
      'Permaneça imóvel e estável em postura de tripla ameaça por 2 segundos.',
      'Execute pivô frontal e reverso sem perder o equilíbrio.'
    ],
    tips: [
      'Afunde o quadril; quanto mais baixo você frear, mais estável e rápida será a parada.',
      'Não deixe o peso do corpo ultrapassar os joelhos para a frente.'
    ],
    commonMistakes: [
      'Tropeçar ou dar passos extras ao tentar frear.',
      'Frear com as pernas retas sobrecarregando a lombar.'
    ],
    gameTransfer: {
      skill: 'Mudança Brutal de Ritmo',
      drill: 'Decel Stride Stop',
      gameSituation: 'Ataque em transição rápida contra defesa que recua desordenada.',
      objective: 'Parar na linha de lance livre ou 3 pontos sem deslizar ou cometer falta de ataque.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'top'
  },
  {
    id: 'fw-02',
    name: 'Jab Step & Rip Through Series',
    slug: 'jab-step-rip-through',
    category: 'footwork',
    categoryLabel: 'Footwork',
    subcategory: 'Jab Step',
    description: 'Trabalho de pés na tripla ameaça para ler e manipular a distância do defensor individual.',
    difficulty: 'Iniciante',
    durationMinutes: 4,
    reps: '15 jabs cada pé de pivô',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Área pequena',
    instructions: [
      'Estabeleça o pé esquerdo como pé de pivô fixo.',
      'Execute um Jab Step curto e explosivo com o pé direito em direção ao pé do defensor.',
      'Observe a reação: se o defensor recuar, suba para o arremesso; se não recuar, execute o Rip Through passando a bola abaixo dos joelhos e exploda no drible.',
      'Mantenha a bola protegida na "pocket".'
    ],
    tips: [
      'O jab deve ser de 30 a 45cm, rápido como um golpe de boxe.',
      'Não mexa o pé de pivô para não cometer violação de andar.'
    ],
    commonMistakes: [
      'Tirar o pé de pivô do chão antes de soltar a bola no drible.',
      'Fazer o rip through alto na altura do peito expondo a bola a desarmes.'
    ],
    gameTransfer: {
      skill: 'Criação a partir da Tripla Ameaça',
      drill: 'Jab & Rip Series',
      gameSituation: 'Recepção de bola estática na ala contra marcador agressivo.',
      objective: 'Testar e vencer o defensor no primeiro passo sem desperdiçar dribles.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },

  // ----------------------------------------------------
  // PICK AND ROLL
  // ----------------------------------------------------
  {
    id: 'pnr-01',
    name: 'PnR Shoulder to Hip & Pocket Pass',
    slug: 'pnr-shoulder-to-hip-pocket-pass',
    category: 'pick-and-roll',
    categoryLabel: 'Pick and Roll',
    subcategory: 'Pocket Pass',
    description: 'Uso cirúrgico do bloqueio raspando o ombro no quadril do bloqueador e entrega milimétrica de pocket pass.',
    difficulty: 'Avançado',
    durationMinutes: 5,
    reps: '15 passes de cada lado',
    sets: 3,
    equipment: ['1 bola', 'Cadeira', 'Cone'],
    space: 'Meia quadra',
    instructions: [
      'Posicione uma cadeira no topo da cabeça simulando o bloqueador (screener).',
      'Dê 1 drible para o lado oposto para induzir o defensor a bater no screen (setup do defensor).',
      'Ataque o bloqueio raspando o ombro no quadril da cadeira sem deixar espaço para o defensor passar por dentro.',
      'Ao atrair o defensor do pivô (hedge/drop), empurre um Pocket Pass com 1 mão quicando a bola entre as pernas dos marcadores na passada do rolador.'
    ],
    tips: [
      'O pocket pass deve ser solto direto do drible com o punho estalando para o chão.',
      'Mantenha os olhos na ajuda do lado fraco (weak-side defender) para não telegrafar o passe.'
    ],
    commonMistakes: [
      'Abrir muito longe do bloqueio, permitindo que a defesa passe por cima sem contato.',
      'Passar a bola pelo ar facilitando interceptação pela defesa.'
    ],
    gameTransfer: {
      skill: 'Desmontagem de Drop Coverage no PnR',
      drill: 'Shoulder-to-Hip Setup & Pocket Feed',
      gameSituation: 'Situação principal de ataque moderno de meia quadra.',
      objective: 'Alimentar o pivô que corta em direção ao aro no exato momento da dobra defensiva.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'top'
  },
  {
    id: 'pnr-02',
    name: 'Snake Dribble no Pick and Roll',
    slug: 'snake-dribble-pnr',
    category: 'pick-and-roll',
    categoryLabel: 'Pick and Roll',
    subcategory: 'Snake Dribble',
    description: 'Manobra para cortar a frente do defensor bloqueado, colocando-o nas costas (jail) e atacando o espaço livre.',
    difficulty: 'Competitivo',
    durationMinutes: 5,
    reps: '10 repetições com finalização/floater',
    sets: 3,
    equipment: ['1 bola', '2 Cones'],
    space: 'Meia quadra',
    instructions: [
      'Ataque o bloqueio e force o defensor original a ficar preso atrás de você.',
      'Faça um drible cruzando na frente do bloqueador (Snake) em direção ao meio da garrafa.',
      'Mantenha o defensor original nas suas costas usando o corpo como proteção (put defender in jail).',
      'Desacelere, leia o pivô defensor e decida entre pull-up, floater ou passe para o corner.'
    ],
    tips: [
      'Controle de ritmo é tudo no Snake; você dita a velocidade da jogada.',
      'Mantenha a bola protegida no quadril oposto ao marcador.'
    ],
    commonMistakes: [
      'Acelerar demais e bater de frente no pivô adversário.',
      'Não fechar o caminho do marcador original, permitindo que ele se recupere pela frente.'
    ],
    gameTransfer: {
      skill: 'Controle Total do Ritmo no Meio da Quadra',
      drill: 'Snake Dribble Jail Concept',
      gameSituation: 'Quando a defesa joga em Drop e você quer entrar no meio do garrafão com vantagem.',
      objective: 'Neutralizar 2 defensores simultaneamente criando opções de passe e arremesso livre.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'top'
  },

  // ----------------------------------------------------
  // PASSE (PASSING)
  // ----------------------------------------------------
  {
    id: 'ps-01',
    name: 'One-Hand Off-Dribble Push Pass',
    slug: 'one-hand-off-dribble-pass',
    category: 'passing',
    categoryLabel: 'Passe',
    subcategory: 'One Hand Pass',
    description: 'Passe direto da batida de bola com uma mão só sem juntar as duas mãos, ganhando frações de segundo vitais.',
    difficulty: 'Intermediário',
    durationMinutes: 4,
    reps: '20 passes de direita e 20 de esquerda contra a parede ou parceiro',
    sets: 3,
    equipment: ['1 bola', 'Parede'],
    space: 'Área pequena',
    instructions: [
      'Drible forte na altura do joelho.',
      'Sem pegar na bola com a outra mão, empurre a bola direto do chão com o punho e os dedos em direção ao alvo.',
      'O passe deve sair em linha reta como um dardo.',
      'Alterne entre passe de peito direto e passe picado (bounce).'
    ],
    tips: [
      'Acelere o punho no final para dar força sem precisar mover o ombro inteiro.',
      'Mantenha o braço livre preparado para proteger contra o desarme.'
    ],
    commonMistakes: [
      'Juntar as duas mãos na bola antes do passe, telegrafando a intenção para a defesa.',
      'Falta de precisão por empurrar com a palma em vez dos dedos.'
    ],
    gameTransfer: {
      skill: 'Passe Imediato em Janelas Curtas',
      drill: 'Off-Dribble One-Hand Push',
      gameSituation: 'Infiltração com ajuda defensiva rápida fechando o aro.',
      objective: 'Encontrar o arremessador no corner ou cortador antes que a defesa feche a linha de passe.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },
  {
    id: 'ps-02',
    name: 'Skip Pass Overhead sob Pressão',
    slug: 'skip-pass-overhead',
    category: 'passing',
    categoryLabel: 'Passe',
    subcategory: 'Skip Pass',
    description: 'Passe longo por cima da defesa para inverter a bola direto do lado forte para o lado fraco aberto.',
    difficulty: 'Avançado',
    durationMinutes: 4,
    reps: '15 passes diagonais perfeitos',
    sets: 3,
    equipment: ['1 bola', 'Parceiro'],
    space: 'Meia quadra',
    instructions: [
      'Infiltre pela ala direita atraindo a rotação de 3 defensores.',
      'Salte com os dois pés (jump stop) mantendo a bola acima da cabeça com as duas mãos.',
      'Passe a bola em arco tenso cruzando toda a largura da quadra para o arremessador desmarcado no corner oposto.',
      'A bola deve chegar na altura do peito do companheiro sem tocar no chão.'
    ],
    tips: [
      'Não faça arco alto demais que permita a recuperação defensiva.',
      'Use o impulso das pernas e punhos firmes.'
    ],
    commonMistakes: [
      'Passar sem força permitindo interceptação pelo defensor da ajuda.',
      'Pular no ar sem saber para onde passar e cometer turnover.'
    ],
    gameTransfer: {
      skill: 'Inversão Rápida de Jogo (Weak Side Punish)',
      drill: 'Overhead Skip Pass',
      gameSituation: 'Zona defensiva 2-3 ou defesa homem-a-homem hiper-compactada no garrafão.',
      objective: 'Gerar arremessos de 3 pontos com 3 a 4 metros de espaço no lado fraco.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },

  // ----------------------------------------------------
  // DEFESA (DEFENSE)
  // ----------------------------------------------------
  {
    id: 'df-01',
    name: 'Closeout com Choppy Feet & Hand Contest',
    slug: 'closeout-choppy-feet-contest',
    category: 'defense',
    categoryLabel: 'Defesa',
    subcategory: 'Closeout',
    description: 'Recuperação defensiva veloz com passadas curtas de desaceleração para contestar sem ser batido no drible.',
    difficulty: 'Intermediário',
    durationMinutes: 4,
    reps: '10 repetições de closeouts em alta intensidade',
    sets: 3,
    equipment: ['Cones'],
    space: 'Meia quadra',
    instructions: [
      'Inicie no centro da garrafa em postura de ajuda.',
      'Ao comando, faça sprint explosivo nos primeiros 3 metros em direção ao atirador no perímetro.',
      'Nos últimos 2 metros, diminua o tamanho dos passos com "choppy feet" rápidos batendo no chão e abaixe o quadril.',
      'Erga uma mão na linha de visão do arremessador (high hand contest) enquanto mantém a outra baixa para barrar a infiltração.'
    ],
    tips: [
      'Nunca pule no closeout a menos que o adversário já tenha iniciado a mecânica de arremesso.',
      'Não cruze os pés durante a desaceleração.'
    ],
    commonMistakes: [
      'Chegar voando sem controle e ser ultrapassado com uma finta simples.',
      'Chegar com o tronco ereto e pés juntos.'
    ],
    gameTransfer: {
      skill: 'Contestação sem Falta nem Drible Sofrido',
      drill: 'Sprint to Choppy Feet Closeout',
      gameSituation: 'Rotação da ajuda defensiva após passe para o perímetro.',
      objective: 'Forçar um arremesso contestado de baixo aproveitamento ou desacelerar a jogada adversária.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },
  {
    id: 'df-02',
    name: 'Defensive Slides Zig-Zag em Meia Quadra',
    slug: 'defensive-slides-zigzag',
    category: 'defense',
    categoryLabel: 'Defesa',
    subcategory: 'Slides',
    description: 'Deslocamentos laterais contínuos em base baixa com abertura rápida de quadril nas mudanças de direção.',
    difficulty: 'Iniciante',
    durationMinutes: 5,
    reps: '5 travessias de quadra inteira',
    sets: 3,
    equipment: ['Cones'],
    space: 'Quadra inteira',
    instructions: [
      'Posicione-se em postura defensiva: peito aberto, quadris baixos, pés afastados além dos ombros.',
      'Deslize lateralmente em ângulo de 45 graus empurrando com o pé posterior.',
      'No cone, faça o drop step com o pé de trás, abra o quadril e mude a direção deslizando para o próximo cone.',
      'Mantenha as mãos ativas acima da linha da cintura.'
    ],
    tips: [
      'Nunca junte ou cruze os pés durante o slide.',
      'Mantenha o peito sempre na linha do peito do atacante imaginário.'
    ],
    commonMistakes: [
      'Subir a postura e ficar em pé por cansaço nos quadríceps.',
      'Bater um calcanhar no outro.'
    ],
    gameTransfer: {
      skill: 'Contenção no 1v1 no Perímetro',
      drill: 'Zig-Zag Slides with Drop Step',
      gameSituation: 'Defesa homem a homem contra armadores velozes.',
      objective: 'Negar o meio da quadra e forçar o atacante para as linhas laterais.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'full-court'
  },

  // ----------------------------------------------------
  // MOVIMENTAÇÃO SEM BOLA (OFF-BALL MOVEMENT)
  // ----------------------------------------------------
  {
    id: 'ob-01',
    name: 'Backdoor Cut Explosivo',
    slug: 'backdoor-cut-explosivo',
    category: 'off-ball',
    categoryLabel: 'Movimentação sem Bola',
    subcategory: 'Backdoor Cut',
    description: 'Corte nas costas do marcador que está negando a linha de passe em antecipação exagerada.',
    difficulty: 'Intermediário',
    durationMinutes: 4,
    reps: '10 cortes de cada lado com finalização',
    sets: 3,
    equipment: ['1 bola', 'Cadeira'],
    space: 'Meia quadra',
    instructions: [
      'Inicie na ala a 3 pontos. Dê 2 passos em direção à bola fingindo que vai receber o passe no perímetro.',
      'Assim que o defensor subir na linha de passe para roubar a bola, crave o pé dianteiro e exploda em direção à cesta por trás do corpo dele.',
      'Receba o passe picado na passada e finalize com layup seguro.'
    ],
    tips: [
      'O segredo do corte é a mudança de velocidade: devagar na aproximação, explosivo no corte.',
      'Mantenha a mão estendida como alvo para o passador.'
    ],
    commonMistakes: [
      'Cortar antes do passador estar em ângulo de visão.',
      'Hesitar na decolagem permitindo que o defensor se recupere.'
    ],
    gameTransfer: {
      skill: 'Punição da Pressão Defensiva de Passe',
      drill: 'V-Setup to Backdoor Cut',
      gameSituation: 'Defesa muito agressiva pressionando um passe de distância no perímetro.',
      objective: 'Gerar bandejas fáceis e forçar a defesa a afrouxar a marcação no perímetro.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },
  {
    id: 'ob-02',
    name: 'Flare Cut para o Corner Oposto',
    slug: 'flare-cut-corner',
    category: 'off-ball',
    categoryLabel: 'Movimentação sem Bola',
    subcategory: 'Flare',
    description: 'Leitura de bloqueio indireto afastando-se da bola para encontrar arremesso livre no lado oposto.',
    difficulty: 'Avançado',
    durationMinutes: 4,
    reps: '12 arremessos em saída de flare',
    sets: 3,
    equipment: ['1 bola', 'Cadeira'],
    space: 'Meia quadra',
    instructions: [
      'Posicione-se no topo da garrafa.',
      'Use a cadeira simulando um bloqueio cego (flare screen).',
      'Corra rente ao bloqueador afastando-se da bola em direção à asa ou ao corner.',
      'Receba o passe em skip, alinhe os pés no ar e execute o arremesso de 3 pontos.'
    ],
    tips: [
      'Passe bem rente ao bloqueador para impedir que o seu marcador contorne por dentro.',
      'Esteja pronto para soltar a bola no menor tempo possível.'
    ],
    commonMistakes: [
      'Afastar-se em linha reta em vez de em arco fechado.',
      'Arremessar desequilibrado por não fixar o pé de apoio.'
    ],
    gameTransfer: {
      skill: 'Aproveitamento de Bloqueio Cego',
      drill: 'Flare Screen Read & Shoot',
      gameSituation: 'Jogadas desenhadas de reposição de bola ou ataque contra defesas compactas.',
      objective: 'Criar arremesso de alta porcentagem para o melhor arremessador da equipe.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },

  // ----------------------------------------------------
  // WEAK HAND (MÃO FRACA) & ADVANCED BALL HANDLE
  // ----------------------------------------------------
  {
    id: 'bh-07',
    name: 'Weak Hand Pocket & Speed Dribble',
    slug: 'weak-hand-pocket-speed',
    category: 'ball-handle',
    categoryLabel: 'Controle de Bola',
    subcategory: 'Weak Hand',
    description: 'Trabalho exclusivo com a mão não dominante em velocidade e controle sob pressão.',
    difficulty: 'Intermediário',
    durationMinutes: 4,
    reps: '10 sprints de meia quadra',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Meia quadra',
    instructions: [
      'Utilize apenas a mão fraca durante todo o exercício.',
      'Inicie com 5 pocket dribbles baixos recuando a bola até a linha do quadril.',
      'Exploda em sprint de 3 dribles em velocidade máxima empurrando a bola à frente.',
      'Freie em stride stop e execute 3 dribles baixos sem trocar de mão.'
    ],
    tips: [
      'Gere a mesma força de drible da mão dominante.',
      'Mantenha o braço forte como anteparo protetor na altura do peito.'
    ],
    commonMistakes: [
      'Tentar socorrer a bola com a mão dominante no primeiro desequilíbrio.',
      'Não estender o cotovelo no sprint de drible.'
    ],
    gameTransfer: {
      skill: 'Ataque em Qualquer Direção (No Weak Side)',
      drill: 'Weak Hand Full Speed Pocket',
      gameSituation: 'Defesa força você intencionalmente para o seu lado fraco.',
      objective: 'Punir a estratégia defensiva infiltrando e finalizando com a mão não dominante.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'top'
  },
  {
    id: 'bh-08',
    name: 'Retreat Dribble + Crossover Counter',
    slug: 'retreat-dribble-cross-counter',
    category: 'ball-handle',
    categoryLabel: 'Controle de Bola',
    subcategory: 'Retreat Dribble',
    description: 'Drible de recuo em base lateral protegida para escapar de armadilhas e atacar o espaço aberto.',
    difficulty: 'Intermediário',
    durationMinutes: 4,
    reps: '12 repetições cada lado',
    sets: 3,
    equipment: ['1 bola', 'Cone'],
    space: 'Meia quadra',
    instructions: [
      'Ataque o cone com 2 dribles fortes.',
      'Ao contato simulado, dê 2 passos de recuo para trás e para o lado mantendo o ombro virado para o marcador (escudo).',
      'Assim que o marcador avançar para fechar o espaço, execute um Crossover rápido ou Between the Legs explodindo para o lado oposto.'
    ],
    tips: [
      'Mantenha os olhos na quadra durante o recuo; não abaixe a cabeça.',
      'O pé dianteiro deve agir como barreira contra o avanço do defensor.'
    ],
    commonMistakes: [
      'Recuar de costas retas perdendo a visão periférica.',
      'Fazer o recuo muito lento sem criar separação real.'
    ],
    gameTransfer: {
      skill: 'Escape de Dobras e Blitz',
      drill: 'Retreat to Attack Crossover',
      gameSituation: 'Pressão defensiva na linha lateral ou dobra no Pick and Roll.',
      objective: 'Aliviar a pressão sem queimar o drible e manter a ofensiva viva.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },

  // ----------------------------------------------------
  // ARREMESSO AVANÇADO (SHOT CREATION)
  // ----------------------------------------------------
  {
    id: 'sh-06',
    name: 'Side Step 3-Point Counter',
    slug: 'side-step-3pt-counter',
    category: 'shooting',
    categoryLabel: 'Arremesso',
    subcategory: 'Side Step',
    description: 'Salto lateral milimétrico para sair do campo de visão do contestador e arremessar com linha limpa.',
    difficulty: 'Competitivo',
    durationMinutes: 5,
    reps: '10 acertos para a direita, 10 para a esquerda',
    sets: 3,
    equipment: ['1 bola', 'Cone'],
    space: 'Meia quadra',
    instructions: [
      'Drible em direção ao cone na linha de 3 pontos.',
      'Dê um drible afundando o pé interno e empurre o corpo lateralmente em salto horizontal de 1 metro.',
      'Aterrisse com os dois pés em paralelo, absorva o impacto e salte direto para o arremesso.',
      'Mantenha a mira fixa no centro do aro durante o deslocamento lateral.'
    ],
    tips: [
      'O movimento lateral deve ser plano, não saltando alto demais na primeira fase.',
      'Gire os ombros em direção ao aro ainda durante o pouso.'
    ],
    commonMistakes: [
      'Pousar com pés desalinhados e perder o equilíbrio na subida.',
      'Arremessar com o tronco inclinado lateralmente.'
    ],
    gameTransfer: {
      skill: 'Escape de Contestação Frontal',
      drill: 'Lateral Side Step 3',
      gameSituation: 'Defensor alto saltando para bloquear arremesso reto.',
      objective: 'Sair da linha reta de contestação e arremessar sem interferência.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },
  {
    id: 'sh-07',
    name: 'Free Throw Pressure Calibration',
    slug: 'free-throw-pressure-calibration',
    category: 'shooting',
    categoryLabel: 'Arremesso',
    subcategory: 'Free Throws',
    description: 'Rotina idêntica de lance livre com simulação de fadiga física para garantir precisão em momentos decisivos.',
    difficulty: 'Iniciante',
    durationMinutes: 5,
    reps: '20 lances livres (meta: 80%+)',
    sets: 2,
    equipment: ['1 bola'],
    space: 'Meia quadra',
    instructions: [
      'Faça 10 polichinelos ou 2 suicídios curtos antes de cada série para elevar a frequência cardíaca.',
      'Caminhe até a linha de lance livre e execute sua rotina fixa (ex: 2 dribles, respiração profunda, fixação no aro).',
      'Arremesse com mecânica suave e termine com o follow-through mantido até a bola passar pelo aro.',
      'Anote o número de conversões.'
    ],
    tips: [
      'A rotina deve ser rigorosamente a mesma em todos os arremessos.',
      'Solte o ar no momento em que a bola sobe para relaxar os ombros.'
    ],
    commonMistakes: [
      'Apressar o arremesso sem respirar após esforço físico.',
      'Mudar a rotina a cada tentativa.'
    ],
    gameTransfer: {
      skill: 'Clutch Free Throws',
      drill: 'Fatigued Routine FTs',
      gameSituation: 'Minutos finais de partida disputada na linha de lances livres.',
      objective: 'Controlar o batimento cardíaco e garantir pontos fáceis com o relógio parado.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'paint'
  },
  {
    id: 'sh-08',
    name: 'Movement Shooting off Pin-Down Screen',
    slug: 'pin-down-screen-shooting',
    category: 'shooting',
    categoryLabel: 'Arremesso',
    subcategory: 'Shooting off Screens',
    description: 'Leitura de saída de bloqueio indireto vertical com parada em curva e arremesso em velocidade.',
    difficulty: 'Avançado',
    durationMinutes: 6,
    reps: '15 arremessos cada lado',
    sets: 3,
    equipment: ['1 bola', 'Cadeira', 'Parceiro'],
    space: 'Meia quadra',
    instructions: [
      'Inicie na linha de fundo abaixo da cesta.',
      'Corra em direção à asa raspando na cadeira (pin-down screen).',
      'Receba o passe de peito, plante o pé interno e gire o corpo em 90 graus no ar alinhando ao aro.',
      'Solte o arremesso na subida sem hesitação.'
    ],
    tips: [
      'Encurte os passos antes de receber a bola para não perder o centro de gravidade na curva.',
      'Mantenha as mãos em formato de cone receptivo (shot pocket).'
    ],
    commonMistakes: [
      'Drift lateral excessivo no ar empurrando o arremesso para o lado.',
      'Abrir espaço entre você e a cadeira permitindo a passagem do defensor.'
    ],
    gameTransfer: {
      skill: 'Arremesso em Saída de Bloqueio (Catch & Shoot em Movimento)',
      drill: 'Pin-down Curl / Flare Read',
      gameSituation: 'Sistemas táticos de ataque contra defesas agressivas.',
      objective: 'Punir o marcador que persegue por trás do bloqueio.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'wing'
  },

  // ----------------------------------------------------
  // FINALIZAÇÃO AVANÇADA (CRAFTY FINISHING & CONTACT)
  // ----------------------------------------------------
  {
    id: 'fn-06',
    name: 'Spin Move Finish na Garrafa',
    slug: 'spin-move-finish',
    category: 'finishing',
    categoryLabel: 'Finalização',
    subcategory: 'Spin Finish',
    description: 'Giro de 180 a 360 graus no eixo do pé de apoio para contornar o marcador e finalizar com a mão oposta.',
    difficulty: 'Avançado',
    durationMinutes: 5,
    reps: '10 acertos de cada lado',
    sets: 3,
    equipment: ['1 bola', 'Cone'],
    space: 'Meia quadra',
    instructions: [
      'Ataque o garrafão pela diagonal.',
      'Bata a bola firme ao lado do cone com o pé dianteiro cravado.',
      'Gire sobre o pé de pivô trazendo a bola colada ao peito ou na linha da cintura.',
      'Saia do giro de frente para o aro e finalize com layup estendido ou floater suave.'
    ],
    tips: [
      'Mantenha a bola protegida com as duas mãos durante o giro para não sofrer strips de braços soltos.',
      'Mantenha os olhos rápidos para encontrar a cesta assim que completar a rotação.'
    ],
    commonMistakes: [
      'Girar com o centro de gravidade alto perdendo o equilíbrio.',
      'Arrastar o pé de pivô antes de soltar a bola no ar.'
    ],
    gameTransfer: {
      skill: 'Contorno de Corta-Luz Defensivo e Ajudas',
      drill: 'Contact Spin Move',
      gameSituation: 'Defensor entra no corredor de infiltração tentando bloquear a passagem reta.',
      objective: 'Transformar a força do defensor em alavanca para girar para o espaço aberto.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'paint'
  },
  {
    id: 'fn-07',
    name: 'Pro Hop no Tráfego com Finalização de 2 Pés',
    slug: 'pro-hop-traffic-finish',
    category: 'finishing',
    categoryLabel: 'Finalização',
    subcategory: 'Pro Hop',
    description: 'Salto em dois pés com absorção de impacto no meio de múltiplos defensores para finalização equilibrada.',
    difficulty: 'Intermediário',
    durationMinutes: 4,
    reps: '12 finalizações alternadas',
    sets: 3,
    equipment: ['1 bola', '2 Cones'],
    space: 'Meia quadra',
    instructions: [
      'Ataque o espaço entre os dois cones.',
      'No último drible, recolha a bola e salte com os dois pés simultaneamente (jump stop / pro hop) pousando em base ampla.',
      'Absorva o contato imaginário com o peito e joelhos flexionados.',
      'Decole na vertical e finalize com power layup na tabela.'
    ],
    tips: [
      'Pousar em 2 pés permite usar qualquer um dos pés como pivô caso a defesa feche o arremesso.',
      'Mantenha os cotovelos ligeiramente afastados protegendo a bola no peito.'
    ],
    commonMistakes: [
      'Pousar com os pés muito juntos correndo risco de torção de tornozelo.',
      'Perder a força de salto vertical após aterrissar.'
    ],
    gameTransfer: {
      skill: 'Power Finishing em Garrafão Cheio',
      drill: 'Two-Foot Pro Hop',
      gameSituation: 'Infiltração com múltiplos defensores congestionando a área restrita.',
      objective: 'Absorver contato sem desequilíbrio e cavar falta de 2+1.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'paint'
  },
  {
    id: 'fn-08',
    name: 'Crafty High Glass Finish (Toque no Topo da Tabela)',
    slug: 'high-glass-crafty-finish',
    category: 'finishing',
    categoryLabel: 'Finalização',
    subcategory: 'High Glass',
    description: 'Uso das quinas superiores da tabela para fazer a bola subir acima da envergadura de pivôs altos.',
    difficulty: 'Avançado',
    durationMinutes: 4,
    reps: '15 acertos cada lado',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Área pequena',
    instructions: [
      'Infiltre em ângulo fechado pela lateral do garrafão.',
      'Estenda o braço ao máximo para o alto e solte a bola com efeito para que ela toque no quarto superior da tabela.',
      'A bola deve descer suavemente na cesta após o toque alto.',
      'Pratique tanto com a mão direita quanto com a esquerda.'
    ],
    tips: [
      'O segredo é o giro dos dedos (finger roll spin) no momento da soltura.',
      'A bola colocada no topo da tabela torna o toco praticamente impossível sem cometer interferência (goaltending).'
    ],
    commonMistakes: [
      'Bater com muita força e a bola ricochetear para longe.',
      'Não estender o braço na amplitude total.'
    ],
    gameTransfer: {
      skill: 'Finalização Anti-Toco (Shot Blocker Neutralizer)',
      drill: 'High Glass Extension',
      gameSituation: 'Finalização contra pivô de 2 metros posicionado sob o aro.',
      objective: 'Pontuar aproveitando o ponto cego do bloqueador alto.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'restricted'
  },

  // ----------------------------------------------------
  // POST GAME & ATHLETIC DEVELOPMENT
  // ----------------------------------------------------
  {
    id: 'pg-01',
    name: 'Drop Step & Power Finish no Poste Baixo',
    slug: 'drop-step-power-finish',
    category: 'post-game',
    categoryLabel: 'Post Game',
    subcategory: 'Drop Step',
    description: 'Trabalho de pés clássico de pivô e ala-pivô selando o marcador com o quadril e girando para a cesta.',
    difficulty: 'Intermediário',
    durationMinutes: 5,
    reps: '10 repetições de cada lado do poste',
    sets: 3,
    equipment: ['1 bola'],
    space: 'Meia quadra',
    instructions: [
      'Receba a bola no poste baixo (low block) de costas para a cesta.',
      'Sinta em qual ombro o defensor está encostando.',
      'Dê 1 drible de potência (power pound) enquanto crava o pé traseiro atrás da perna do defensor (Drop Step).',
      'Gire o corpo em 180 graus selando o marcador com as costas e suba para enterrar ou finalizar na tabela com as duas mãos.'
    ],
    tips: [
      'Mantenha a base ampla e os cotovelos abertos para não perder a posse.',
      'Suba com os dois pés na decolagem para máxima impulsão.'
    ],
    commonMistakes: [
      'Girar para fora da quadra em vez de girar em direção ao aro.',
      'Abaixar a bola facilitando o roubo por guardas que descem para dobrar.'
    ],
    gameTransfer: {
      skill: 'Domínio de Poste Baixo',
      drill: 'Low Block Drop Step',
      gameSituation: 'Mismatch ofensivo (jogador menor marcando no garrafão).',
      objective: 'Garantir 2 pontos de alta porcentagem através de posicionamento físico dominante.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'paint'
  },
  {
    id: 'at-01',
    name: 'Pliometria Reactiva & Lateral Bounds',
    slug: 'plyo-reactive-lateral-bounds',
    category: 'athletic',
    categoryLabel: 'Athletic Development',
    subcategory: 'Explosão',
    description: 'Saltos laterais e aterrissagens reativas para aumento de velocidade de primeiro passo e impulsão vertical.',
    difficulty: 'Avançado',
    durationMinutes: 6,
    reps: '8 saltos por perna com sustentação de 2s',
    sets: 3,
    equipment: ['Sem equipamento'],
    space: 'Casa',
    instructions: [
      'Fique equilibrado na perna direita em flexão de joelho.',
      'Exploda lateralmente para a esquerda cobrindo o máximo de distância possível.',
      'Aterrisse suavemente na perna esquerda absorvendo com quadril e joelho sem perder o equilíbrio.',
      'Sustente por 2 segundos e exploda de volta para a direita.',
      'Finalize com 5 saltos verticais com toque no teto/tabela imediato.'
    ],
    tips: [
      'A aterrissagem deve ser silenciosa (amortecimento elástico dos tendões).',
      'Use os braços em sincronia para gerar torque.'
    ],
    commonMistakes: [
      'Valgo dinâmico (joelho colapsar para dentro no pouso).',
      'Saltar sem absorver o impacto.'
    ],
    gameTransfer: {
      skill: 'Primeiro Passo Explosivo e Recuperação Defensiva',
      drill: 'Lateral Skater Bounds',
      gameSituation: 'Reação instantânea a fintas e decolagem em rebotes no tráfego.',
      objective: 'Desenvolver potência elástica nos membros inferiores para dominar o jogo físico.'
    },
    thumbnail: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80',
    courtPlacement: 'full-court'
  }
];

