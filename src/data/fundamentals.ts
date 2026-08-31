export interface FundamentalCategory {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  subcategories: {
    name: string;
    description: string;
    drillsCount: number;
    difficulty: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Competitivo';
  }[];
}

export const FUNDAMENTALS_DATA: FundamentalCategory[] = [
  {
    id: 'ball-handle',
    name: 'Controle de Bola',
    slug: 'controle-de-bola',
    tagline: 'Transforme a bola em uma extensão do seu corpo',
    description: 'Do drible de controle à finta em alta velocidade, domine a bola sob qualquer nível de pressão defensiva.',
    icon: 'Activity',
    subcategories: [
      { name: 'Fundamentos & Postura', description: 'Base atlética, centro de gravidade e pound vigoroso.', drillsCount: 5, difficulty: 'Iniciante' },
      { name: 'Stationary Dribbling', description: 'Drible parado para calibração neurológica e ritmo.', drillsCount: 6, difficulty: 'Iniciante' },
      { name: 'Crossover', description: 'Mudança de direção frontal rasante e explosiva.', drillsCount: 8, difficulty: 'Intermediário' },
      { name: 'Between the Legs', description: 'Proteção e mudança de ângulo entre as pernas.', drillsCount: 7, difficulty: 'Intermediário' },
      { name: 'Behind the Back', description: 'Troca de corredor envolvendo o quadril em velocidade.', drillsCount: 6, difficulty: 'Avançado' },
      { name: 'In & Out', description: 'Finta de corpo mantendo o mesmo lado de infiltração.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Hesitation (Hesi)', description: 'Congelamento do defensor com os olhos e subida de tronco.', drillsCount: 6, difficulty: 'Avançado' },
      { name: 'Change of Pace', description: 'Variação imprevisível de velocidade rápida/lenta.', drillsCount: 7, difficulty: 'Avançado' },
      { name: 'Combination Moves', description: 'Encadeamento de 2 a 3 movimentos sem perder a fluidez.', drillsCount: 8, difficulty: 'Competitivo' },
      { name: 'Retreat Dribble', description: 'Drible de recuo em base protegida para abrir espaço.', drillsCount: 4, difficulty: 'Intermediário' },
      { name: 'Escape Dribble', description: 'Saída rápida de armadilhas e dobras na lateral.', drillsCount: 4, difficulty: 'Intermediário' },
      { name: 'Pocket Dribble', description: 'Recuo da bola para a pocket antes do ataque.', drillsCount: 4, difficulty: 'Avançado' },
      { name: 'Drible em Velocidade', description: 'Sprint empurrando a bola à frente na transição.', drillsCount: 5, difficulty: 'Iniciante' },
      { name: 'Drible sob Pressão', description: 'Controle de bola sob contato físico e marcação acirrada.', drillsCount: 6, difficulty: 'Competitivo' },
      { name: 'Weak Hand (Mão Fraca)', description: 'Desenvolvimento bilateral completo da mão não dominante.', drillsCount: 9, difficulty: 'Intermediário' },
      { name: 'Two Ball Drills', description: 'Exercícios simultâneos com duas bolas de basquete.', drillsCount: 6, difficulty: 'Intermediário' },
      { name: 'Tennis Ball Drills', description: 'Exercícios neuro-visuais com bola de tênis.', drillsCount: 5, difficulty: 'Avançado' }
    ]
  },
  {
    id: 'shooting',
    name: 'Arremesso',
    slug: 'arremesso',
    tagline: 'Precisão cirúrgica, arco limpo e repetibilidade mecânica',
    description: 'Construa uma mecânica sólida desde a base dos pés até o follow-through perfeito em qualquer ponto da quadra.',
    icon: 'Target',
    subcategories: [
      { name: 'Mecânica Fundamental', description: 'Alinhamento dos pés, joelhos, cotovelo e linha de visão.', drillsCount: 6, difficulty: 'Iniciante' },
      { name: 'Form Shooting', description: 'Calibração a 1-2 metros para toque de rede suave (swish).', drillsCount: 5, difficulty: 'Iniciante' },
      { name: 'Catch & Shoot', description: 'Recepção pronta com parada 1-2 e subida sem delay.', drillsCount: 8, difficulty: 'Intermediário' },
      { name: 'Pull-up', description: 'Parada em suspensão após infiltração em drible.', drillsCount: 8, difficulty: 'Avançado' },
      { name: '1 Dribble Pull-up', description: 'Ataque agressivo em 1 drible para a lateral ou cotovelo.', drillsCount: 6, difficulty: 'Intermediário' },
      { name: '2 Dribble Pull-up', description: 'Criação de espaço em 2 dribles com absorção de impacto.', drillsCount: 5, difficulty: 'Avançado' },
      { name: 'Mid Range', description: 'Arremessos eficientes da meia distância e cotovelos da garrafa.', drillsCount: 7, difficulty: 'Intermediário' },
      { name: '3 Pontos', description: 'Mecânica otimizada para transferir força das pernas para trás do arco.', drillsCount: 9, difficulty: 'Intermediário' },
      { name: 'Corner 3', description: 'Especialização nas zonas mortas com arco alto sem tabela.', drillsCount: 6, difficulty: 'Intermediário' },
      { name: 'Wing 3', description: 'Arremessos das asas em transição ou inversão de bola.', drillsCount: 6, difficulty: 'Intermediário' },
      { name: 'Top of the Key', description: 'Arremesso frontal do topo da cabeça após bloqueio.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Step Back', description: 'Separação empurrando contra o pé frontal para abrir 1 metro.', drillsCount: 7, difficulty: 'Competitivo' },
      { name: 'Side Step', description: 'Salto lateral para escapar da linha de contestação do marcador.', drillsCount: 5, difficulty: 'Competitivo' },
      { name: 'Floater', description: 'Arremesso flutuante de parábola alta no meio do garrafão.', drillsCount: 7, difficulty: 'Avançado' },
      { name: 'Free Throws (Lances Livres)', description: 'Rotina idêntica e foco mental sob cansaço físico.', drillsCount: 4, difficulty: 'Iniciante' },
      { name: 'Shot Creation', description: 'Criação individual de arremesso no fim de posse.', drillsCount: 8, difficulty: 'Competitivo' },
      { name: 'Shooting off Screens', description: 'Arremessos em saídas de bloqueios indiretos (Pin-down, Flare).', drillsCount: 7, difficulty: 'Avançado' },
      { name: 'Movement Shooting', description: 'Arremessos em constante deslocamento e curvas de quadra.', drillsCount: 6, difficulty: 'Avançado' }
    ]
  },
  {
    id: 'finishing',
    name: 'Finalização',
    slug: 'finalizacao',
    tagline: 'Toque suave, criatividade e finalização através do contato',
    description: 'Arsenal completo para pontuar perto da cesta contra bloqueadores altos e defesas compactadas.',
    icon: 'Flame',
    subcategories: [
      { name: 'Layup básico', description: 'Bandejas convencionais com passada 1-2 e toque de tabela.', drillsCount: 5, difficulty: 'Iniciante' },
      { name: 'Mão direita', description: 'Domínio do lado direito da tabela em diversos ângulos.', drillsCount: 4, difficulty: 'Iniciante' },
      { name: 'Mão esquerda', description: 'Finalizações consistentes com a mão não dominante.', drillsCount: 7, difficulty: 'Intermediário' },
      { name: 'Inside Hand Finish', description: 'Uso da mão interna para soltar a bola antes do toco.', drillsCount: 5, difficulty: 'Avançado' },
      { name: 'Outside Hand Finish', description: 'Uso da mão externa com o corpo como escudo contra o defensor.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Reverse Layup', description: 'Bandeja invertida passando por baixo da cesta.', drillsCount: 6, difficulty: 'Intermediário' },
      { name: 'Euro Step', description: 'Dois passos em zigue-zague para contornar defensores no ar.', drillsCount: 7, difficulty: 'Intermediário' },
      { name: 'Floater / Runner', description: 'Soltura rápida de 1 ou 2 pés com arco elevado.', drillsCount: 6, difficulty: 'Avançado' },
      { name: 'Pro Hop', description: 'Salto em dois pés com absorção no garrafão cheio.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Spin Finish', description: 'Giro no pé de pivô para contornar a contestação.', drillsCount: 6, difficulty: 'Avançado' },
      { name: 'Same Foot Same Hand', description: 'Finalização antecipada saltando no pé da mesma mão (Nash).', drillsCount: 5, difficulty: 'Avançado' },
      { name: 'Wrong Foot Finish', description: 'Quebra do timing tradicional de salto da defesa.', drillsCount: 4, difficulty: 'Avançado' },
      { name: 'Extended Layup', description: 'Extensão máxima do braço longe do corpo para evitar toco.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'High Glass', description: 'Toque no quadrante superior da tabela.', drillsCount: 5, difficulty: 'Avançado' },
      { name: 'Low Glass', description: 'Toque rápido na parte inferior da tabela em velocidade.', drillsCount: 4, difficulty: 'Intermediário' },
      { name: 'Finishing through Contact', description: 'Absorção física no tronco e finalização de 2+1.', drillsCount: 6, difficulty: 'Competitivo' },
      { name: 'Weak Hand Finishing', description: 'Arsenal acrobático com a mão fraca.', drillsCount: 7, difficulty: 'Avançado' },
      { name: 'Crafty Finishing', description: 'Toques com rotação inversa (english) e fintas de aro.', drillsCount: 6, difficulty: 'Competitivo' }
    ]
  },
  {
    id: 'footwork',
    name: 'Footwork',
    slug: 'footwork',
    tagline: 'O trabalho de pés é a fundação de todo movimento no basquete',
    description: 'Paradas, pivôs, desacelerações e ângulos de decolagem que geram vantagens antes mesmo do drible.',
    icon: 'Footprints',
    subcategories: [
      { name: 'Jump Stop', description: 'Parada equilibrada em dois pés simultâneos.', drillsCount: 5, difficulty: 'Iniciante' },
      { name: 'Stride Stop', description: 'Parada 1-2 absorvendo a inércia em alta velocidade.', drillsCount: 5, difficulty: 'Iniciante' },
      { name: 'Pivot & Front Pivot', description: 'Giro frontal mantendo pé de sustentação imóvel.', drillsCount: 4, difficulty: 'Iniciante' },
      { name: 'Reverse Pivot', description: 'Giro de costas para proteger a bola e varrer a quadra.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Jab Step', description: 'Finta curta com o pé livre para testar a defesa.', drillsCount: 6, difficulty: 'Iniciante' },
      { name: 'Drop Step', description: 'Passo de selagem para contornar o marcador no garrafão.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Stride Footwork', description: 'Passadas longas na transição ofensiva.', drillsCount: 4, difficulty: 'Intermediário' },
      { name: 'Hop Footwork', description: 'Salto curto preparatório para o arremesso.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: '1-2 Step', description: 'Passada de aproximação tradicional para o arremesso.', drillsCount: 6, difficulty: 'Iniciante' },
      { name: 'Shot Footwork', description: 'Alinhamento dos pés específico para mecânica de chute.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Drive Footwork', description: 'Passo cruzado e passo aberto na penetração.', drillsCount: 6, difficulty: 'Intermediário' },
      { name: 'Deceleration (Frenagem)', description: 'Capacidade de frear instantaneamente em sprint.', drillsCount: 6, difficulty: 'Avançado' },
      { name: 'Change of Direction', description: 'Cortes angulares bruscos com o pé de freio.', drillsCount: 6, difficulty: 'Avançado' }
    ]
  },
  {
    id: 'passing',
    name: 'Passe',
    slug: 'passe',
    tagline: 'Visão de quadra, antecipação e entrega na mão certa',
    description: 'Encontre janelas curtas, passe direto do drible e quebre defesas compactas com precisão cirúrgica.',
    icon: 'Send',
    subcategories: [
      { name: 'Chest Pass', description: 'Passe de peito clássico com rotação nos polegares.', drillsCount: 4, difficulty: 'Iniciante' },
      { name: 'Bounce Pass', description: 'Passe picado no ponto a 2/3 da distância do receptor.', drillsCount: 4, difficulty: 'Iniciante' },
      { name: 'Overhead Pass', description: 'Passe por cima da cabeça para iniciar contra-ataques.', drillsCount: 4, difficulty: 'Iniciante' },
      { name: 'One Hand Pass', description: 'Passe com uma mão direto do drible.', drillsCount: 6, difficulty: 'Intermediário' },
      { name: 'Pocket Pass', description: 'Entrega rápida e picada na janela do Pick and Roll.', drillsCount: 6, difficulty: 'Avançado' },
      { name: 'Hook Pass', description: 'Passe em gancho por cima da marcação.', drillsCount: 4, difficulty: 'Avançado' },
      { name: 'Skip Pass', description: 'Inversão longa cruzando a quadra para o lado fraco.', drillsCount: 5, difficulty: 'Avançado' },
      { name: 'Drive and Kick', description: 'Infiltração atraindo defensores e passe para fora.', drillsCount: 6, difficulty: 'Intermediário' },
      { name: 'Kick Out', description: 'Passe imediato para o corner após colapso defensivo.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Passes em Transição', description: 'Conexão longa e passes na corrida em contra-ataque.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Passe contra Pressão', description: 'Distribuição lúcida sob dobra e pressão quadra inteira.', drillsCount: 6, difficulty: 'Competitivo' },
      { name: 'Pick and Roll Passing', description: 'Leituras de todas as opções de passe no bloqueio direto.', drillsCount: 7, difficulty: 'Competitivo' }
    ]
  },
  {
    id: 'pick-and-roll',
    name: 'Pick and Roll',
    slug: 'pick-and-roll',
    tagline: 'O motor tático do basquete contemporâneo',
    description: 'Aprenda a orquestrar bloqueios diretos, ler coberturas de pivô e manipular a defesa adversária.',
    icon: 'Layers',
    subcategories: [
      { name: 'Uso do Screen & Setup', description: 'Indução do marcador contra o bloqueador (ombro no quadril).', drillsCount: 6, difficulty: 'Intermediário' },
      { name: 'Shoulder to Hip', description: 'Passagem raspando sem deixar espaço de corte.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Snake Dribble', description: 'Cruzamento na frente do bloqueador colocando o defensor nas costas.', drillsCount: 6, difficulty: 'Avançado' },
      { name: 'Reject Screen (Rejeitar)', description: 'Ataque surpresa no lado oposto do bloqueio.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Split (Dividir a Dobra)', description: 'Penetração entre o bloqueador e seu defensor.', drillsCount: 5, difficulty: 'Competitivo' },
      { name: 'Pocket Pass', description: 'Passe picado milimétrico para o rolador em movimento.', drillsCount: 6, difficulty: 'Avançado' },
      { name: 'Roll Man Read', description: 'Leitura se o pivô está livre ou com ajuda na linha de passe.', drillsCount: 5, difficulty: 'Avançado' },
      { name: 'Skip Pass no PnR', description: 'Alimentação do arremessador no corner oposto.', drillsCount: 5, difficulty: 'Avançado' },
      { name: 'Weak Side Read', description: 'Identificação de quem é a última linha de ajuda defensiva.', drillsCount: 6, difficulty: 'Competitivo' },
      { name: 'Reading Drop Coverage', description: 'Punindo pivôs recuados com pull-up ou floater.', drillsCount: 6, difficulty: 'Avançado' },
      { name: 'Reading Switch', description: 'Atacando o pivô no perímetro ou isolando mismatch.', drillsCount: 6, difficulty: 'Competitivo' },
      { name: 'Reading Hedge & Blitz', description: 'Escapando de dobras agressivas no topo da garrafa.', drillsCount: 5, difficulty: 'Competitivo' }
    ]
  },
  {
    id: 'defense',
    name: 'Defesa',
    slug: 'defesa',
    tagline: 'Intensidade, comunicação, leitura e contenção individual',
    description: 'Torne-se um defensor implacável na bola, nas ajudas e nas rotações táticas.',
    icon: 'Shield',
    subcategories: [
      { name: 'Defensive Stance', description: 'Postura baixa, peito aberto, mãos ativas e equilíbrio.', drillsCount: 4, difficulty: 'Iniciante' },
      { name: 'Defensive Slides', description: 'Deslocamento lateral em zigue-zague empurrando com o pé traseiro.', drillsCount: 6, difficulty: 'Iniciante' },
      { name: 'Closeout', description: 'Sprint de aproximação com choppy feet e contestação alta.', drillsCount: 6, difficulty: 'Intermediário' },
      { name: 'Containment', description: 'Conter penetrações de armadores velozes sem fazer falta.', drillsCount: 6, difficulty: 'Intermediário' },
      { name: 'On Ball Defense', description: 'Pressão mano a mano no portador da bola.', drillsCount: 6, difficulty: 'Intermediário' },
      { name: 'Off Ball Defense', description: 'Posicionamento em triângulo defensivo (bola, você e seu homem).', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Help Defense (Ajuda)', description: 'Timing de rotação da garrafa e recuperação.', drillsCount: 5, difficulty: 'Avançado' },
      { name: 'Screen Navigation', description: 'Passar por cima (Over) ou por baixo (Under) de bloqueios.', drillsCount: 6, difficulty: 'Avançado' },
      { name: 'Pick and Roll Defense', description: 'Comunicação e execução de esquemas (Drop, Ice, Switch).', drillsCount: 6, difficulty: 'Competitivo' },
      { name: 'Transition Defense', description: 'Sprint de retorno para proteger o aro e organizar a defesa.', drillsCount: 5, difficulty: 'Intermediário' }
    ]
  },
  {
    id: 'off-ball',
    name: 'Movimentação sem Bola',
    slug: 'movimentacao-sem-bola',
    tagline: 'Espaçamento inteligente, cortes letais e uso de bloqueios',
    description: 'Aprenda a ser perigoso sem a bola nas mãos, gerando pontos fáceis e abrindo espaço para a equipe.',
    icon: 'Compass',
    subcategories: [
      { name: 'Spacing (Espaçamento)', description: 'Manutenção de distâncias táticas de 4 a 5 metros.', drillsCount: 4, difficulty: 'Iniciante' },
      { name: 'Backdoor Cut', description: 'Corte nas costas do marcador que tenta antecipar o passe.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'V Cut & L Cut', description: 'Fintas em formato de V e L para desmarcar no perímetro.', drillsCount: 5, difficulty: 'Iniciante' },
      { name: '45 Cut', description: 'Corte diagonal pela asa em direção à cesta.', drillsCount: 4, difficulty: 'Intermediário' },
      { name: 'Relocation', description: 'Re-posicionamento ao longo da linha de 3 durante infiltrações.', drillsCount: 5, difficulty: 'Intermediário' },
      { name: 'Drift & Lift', description: 'Deslocamento lateral e subida para a linha de visão do passador.', drillsCount: 5, difficulty: 'Avançado' },
      { name: 'Corner Movement', description: 'Preenchimento e saída da zona morta.', drillsCount: 4, difficulty: 'Iniciante' },
      { name: 'Screen Usage (Curl, Flare, Fade)', description: 'Leitura de como o defensor persegue o bloqueio indireto.', drillsCount: 7, difficulty: 'Avançado' },
      { name: 'Basket Cut', description: 'Corte direto ao aro após passe no Give & Go.', drillsCount: 4, difficulty: 'Iniciante' }
    ]
  }
];
