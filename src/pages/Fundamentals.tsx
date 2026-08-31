import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Target,
  Flame,
  Footprints,
  Send,
  Layers,
  Shield,
  Compass,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Lock,
  CheckCircle2,
  CircleDot,
  Route,
  Sparkles,
  Trophy,
  Play,
  Gauge,
  BrainCircuit
} from 'lucide-react';
import { FUNDAMENTALS_DATA, FundamentalCategory } from '../data/fundamentals';
import { EXERCISES_DATA } from '../data/exercises';
import { WORKOUTS_DATA } from '../data/workouts';
import { usePlayer } from '../context/PlayerContext';

const DIFFICULTY_ORDER = ['Iniciante', 'Intermediário', 'Avançado', 'Competitivo'] as const;

const SCORE_UNLOCK: Record<(typeof DIFFICULTY_ORDER)[number], number> = {
  Iniciante: 0,
  Intermediário: 4,
  Avançado: 6,
  Competitivo: 7.5
};

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const Fundamentals: React.FC = () => {
  const { skillsRating, workoutLogs, mainFocusArea } = usePlayer();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    const focus = normalize(mainFocusArea.name);
    if (focus.includes('pick')) return 'pick-and-roll';
    if (focus.includes('arremesso') || focus.includes('3 pontos') || focus.includes('mid')) return 'shooting';
    if (focus.includes('controle') || focus.includes('ritmo') || focus.includes('mao fraca')) return 'ball-handle';
    if (focus.includes('final')) return 'finishing';
    if (focus.includes('passe') || focus.includes('visao')) return 'passing';
    if (focus.includes('defesa')) return 'defense';
    if (focus.includes('sem bola')) return 'off-ball';
    return FUNDAMENTALS_DATA[0].id;
  });
  const navigate = useNavigate();

  const selectedCategory: FundamentalCategory =
    FUNDAMENTALS_DATA.find((f) => f.id === selectedCategoryId) || FUNDAMENTALS_DATA[0];

  const getIcon = (id: string) => {
    switch (id) {
      case 'ball-handle': return Activity;
      case 'shooting': return Target;
      case 'finishing': return Flame;
      case 'footwork': return Footprints;
      case 'passing': return Send;
      case 'pick-and-roll': return Layers;
      case 'defense': return Shield;
      case 'off-ball': return Compass;
      default: return Activity;
    }
  };

  const categorySkill = useMemo(() => {
    const aliases: Record<string, string[]> = {
      'ball-handle': ['ball-handle', 'weak-hand', 'change-of-pace'],
      shooting: ['shooting', 'three-points', 'mid-range'],
      finishing: ['finishing'],
      footwork: ['speed', 'explosion'],
      passing: ['passing', 'court-vision'],
      'pick-and-roll': ['pick-and-roll', 'court-vision'],
      defense: ['defense'],
      'off-ball': ['off-ball', 'conditioning']
    };
    const relevant = skillsRating.filter((skill) => (aliases[selectedCategory.id] || [selectedCategory.id]).includes(skill.key));
    if (!relevant.length) return 5;
    return relevant.reduce((sum, skill) => sum + skill.score, 0) / relevant.length;
  }, [selectedCategory.id, skillsRating]);

  const availableDrills = useMemo(
    () => EXERCISES_DATA.filter((exercise) => exercise.category === selectedCategory.id),
    [selectedCategory.id]
  );

  const categoryWorkoutIds = useMemo(
    () => new Set(WORKOUTS_DATA.filter((workout) => workout.category === selectedCategory.id).map((workout) => workout.id)),
    [selectedCategory.id]
  );

  const categorySessions = useMemo(
    () => workoutLogs.filter((log) => categoryWorkoutIds.has(log.workoutId)).length,
    [categoryWorkoutIds, workoutLogs]
  );

  const stages = useMemo(
    () => DIFFICULTY_ORDER.map((difficulty) => ({
      difficulty,
      threshold: SCORE_UNLOCK[difficulty],
      nodes: selectedCategory.subcategories.filter((sub) => sub.difficulty === difficulty)
    })).filter((stage) => stage.nodes.length > 0),
    [selectedCategory]
  );

  const currentStageIndex = useMemo(() => {
    const unlocked = stages.filter((stage) => categorySkill >= stage.threshold).length;
    return Math.max(0, Math.min(stages.length - 1, unlocked - 1));
  }, [categorySkill, stages]);

  const currentStage = stages[currentStageIndex];
  const nextStage = stages[currentStageIndex + 1];
  const overallProgress = stages.length
    ? Math.round((stages.filter((stage) => categorySkill >= stage.threshold).length / stages.length) * 100)
    : 0;

  const recommendedNodes = useMemo(() => {
    const pool = currentStage?.nodes || selectedCategory.subcategories;
    return pool.slice(0, 3);
  }, [currentStage, selectedCategory.subcategories]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-7 sm:space-y-8 animate-in fade-in duration-300">
      <section className="relative overflow-hidden rounded-[28px] border border-[#1F2630] bg-[#0D1014] p-5 sm:p-7 lg:p-8">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#FF6B1A]/10 blur-3xl pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.35fr_.65fr] gap-6 items-end">
          <div>
            <span className="text-[10px] uppercase font-mono-num font-bold tracking-[0.2em] text-[#FF6B1A] block mb-2">
              Skill Tree CourtLab
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading text-white tracking-tight leading-none">
              CONSTRUA O JOGO NA ORDEM CERTA
            </h1>
            <p className="text-sm text-[#9AA1AA] mt-3 max-w-2xl leading-relaxed">
              Fundamentos organizados em progressão. Comece pela base, avance quando sua autoavaliação sustentar o próximo nível e leve cada skill do <strong className="text-white">DRILL → SKILL → GAME</strong>.
            </p>
          </div>
          <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA]">
              <Sparkles className="w-4 h-4 text-[#FF6B1A]" /> Seu foco atual
            </div>
            <div className="mt-2 text-xl font-heading text-white">{mainFocusArea.name}</div>
            <p className="text-xs text-[#7F8995] mt-1">A árvore abre inicialmente o pilar mais relacionado ao seu ponto prioritário.</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#777F89]">Escolha um pilar</span>
            <h2 className="text-xl sm:text-2xl font-heading text-white">Mapa de desenvolvimento</h2>
          </div>
          <span className="hidden sm:block text-xs text-[#6F7883]">8 pilares técnicos</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {FUNDAMENTALS_DATA.map((item) => {
            const Icon = getIcon(item.id);
            const isSelected = item.id === selectedCategoryId;
            const relevantSkill = skillsRating.find((skill) => skill.key === item.id);

            return (
              <button
                key={item.id}
                onClick={() => setSelectedCategoryId(item.id)}
                className={`relative p-3.5 rounded-2xl border text-left transition-all min-h-[112px] ${
                  isSelected
                    ? 'bg-[#FF6B1A]/12 border-[#FF6B1A] shadow-lg shadow-[#FF6B1A]/10'
                    : 'bg-[#11151A] border-[#1F2630] hover:border-[#38424E]'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#FF6B1A] text-white' : 'bg-[#171C22] text-[#FF6B1A]'}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="mt-4">
                  <span className="text-xs font-heading text-white block leading-tight">{item.name}</span>
                  <span className="text-[9px] text-[#707985] mt-1 block">
                    {relevantSkill ? `Nota ${relevantSkill.score.toFixed(1)}` : `${item.subcategories.length} skills`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.45fr_.55fr] gap-6">
        <div className="rounded-[28px] bg-[#0D1014] border border-[#1F2630] p-5 sm:p-7 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 pb-6 border-b border-[#1F2630]">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-[#FF6B1A]">Pilar selecionado</span>
              <h2 className="text-3xl sm:text-4xl font-heading text-white mt-1">{selectedCategory.name}</h2>
              <p className="text-sm font-semibold text-[#FF8D4D] mt-1">{selectedCategory.tagline}</p>
              <p className="text-xs sm:text-sm text-[#9AA1AA] mt-3 leading-relaxed">{selectedCategory.description}</p>
            </div>
            <button
              onClick={() => navigate(`/biblioteca?category=${selectedCategory.id}`)}
              className="min-h-11 px-4 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" /> Ver drills
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#11151A] border border-[#1F2630]">
              <Gauge className="w-4 h-4 text-[#FF6B1A] mb-3" />
              <span className="text-[9px] uppercase font-bold text-[#747E89] block">Autoavaliação</span>
              <strong className="text-2xl font-heading text-white">{categorySkill.toFixed(1)}<span className="text-sm text-[#6D7680]">/10</span></strong>
            </div>
            <div className="p-4 rounded-2xl bg-[#11151A] border border-[#1F2630]">
              <Route className="w-4 h-4 text-[#FF6B1A] mb-3" />
              <span className="text-[9px] uppercase font-bold text-[#747E89] block">Etapa atual</span>
              <strong className="text-lg font-heading text-white">{currentStage?.difficulty || 'Base'}</strong>
            </div>
            <div className="p-4 rounded-2xl bg-[#11151A] border border-[#1F2630]">
              <BookOpen className="w-4 h-4 text-[#FF6B1A] mb-3" />
              <span className="text-[9px] uppercase font-bold text-[#747E89] block">Drills disponíveis</span>
              <strong className="text-2xl font-heading text-white">{availableDrills.length}</strong>
            </div>
            <div className="p-4 rounded-2xl bg-[#11151A] border border-[#1F2630]">
              <Trophy className="w-4 h-4 text-[#FF6B1A] mb-3" />
              <span className="text-[9px] uppercase font-bold text-[#747E89] block">Sessões registradas</span>
              <strong className="text-2xl font-heading text-white">{categorySessions}</strong>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#777F89]">Progressão do pilar</span>
                <h3 className="text-xl font-heading text-white">Base → leitura → execução sob pressão</h3>
              </div>
              <span className="text-sm font-mono-num font-bold text-[#FF8D4D]">{overallProgress}% aberto</span>
            </div>
            <div className="h-2 rounded-full bg-[#151A20] overflow-hidden">
              <div className="h-full rounded-full bg-[#FF6B1A] transition-all" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>

          <div className="space-y-5">
            {stages.map((stage, stageIndex) => {
              const unlocked = categorySkill >= stage.threshold;
              const isCurrent = stageIndex === currentStageIndex;
              const isPast = stageIndex < currentStageIndex;

              return (
                <div key={stage.difficulty} className={`rounded-2xl border p-4 sm:p-5 ${isCurrent ? 'border-[#FF6B1A]/55 bg-[#FF6B1A]/[0.05]' : 'border-[#1F2630] bg-[#101419]'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${isPast ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : isCurrent ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white' : 'bg-[#15191F] border-[#2A323C] text-[#69737F]'}`}>
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : unlocked ? <CircleDot className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base sm:text-lg font-heading text-white">{stage.difficulty}</h4>
                        {isCurrent && <span className="px-2 py-0.5 rounded-full bg-[#FF6B1A]/15 text-[#FF8D4D] text-[9px] uppercase font-bold">Sua etapa</span>}
                        {!unlocked && <span className="text-[9px] uppercase font-bold text-[#707A86]">abre com nota {stage.threshold.toFixed(1)}</span>}
                      </div>
                      <p className="text-[11px] text-[#77818C] mt-0.5">{stage.nodes.length} habilidades desta etapa</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {stage.nodes.map((sub, index) => (
                      <div key={`${sub.name}-${index}`} className={`p-4 rounded-xl border ${unlocked ? 'bg-[#15191F] border-[#232B34]' : 'bg-[#0C0F13] border-[#181D23] opacity-55'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h5 className="text-sm font-bold text-white">{sub.name}</h5>
                            <p className="text-xs text-[#89929D] mt-1.5 leading-relaxed">{sub.description}</p>
                          </div>
                          {!unlocked && <Lock className="w-3.5 h-3.5 text-[#626C77] flex-shrink-0 mt-0.5" />}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#20262E] flex items-center justify-between gap-3">
                          <span className="text-[10px] text-[#737D88]">{sub.drillsCount} drills na trilha</span>
                          {unlocked ? (
                            <button onClick={() => navigate(`/biblioteca?category=${selectedCategory.id}`)} className="text-[11px] font-bold text-[#FF6B1A] flex items-center gap-1 hover:text-[#FF8D4D]">
                              Treinar <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-[9px] uppercase font-bold text-[#59626D]">Bloqueado</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-[#0D1014] border border-[#FF6B1A]/25 p-5 sm:p-6">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B1A] text-white flex items-center justify-center mb-4">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF8D4D]">Próximo passo</span>
            <h3 className="text-xl font-heading text-white mt-1">{currentStage?.difficulty || 'Fundamentos'}</h3>
            <p className="text-xs text-[#8D96A1] mt-2 leading-relaxed">
              Priorize estas skills antes de aumentar a complexidade. A árvore usa sua autoavaliação para indicar quando a próxima etapa faz sentido.
            </p>

            <div className="mt-4 space-y-2">
              {recommendedNodes.map((node, index) => (
                <div key={node.name} className="flex items-center gap-3 p-3 rounded-xl bg-[#15191F] border border-[#232B34]">
                  <span className="w-6 h-6 rounded-full bg-[#FF6B1A]/10 text-[#FF8D4D] flex items-center justify-center text-[10px] font-bold">{index + 1}</span>
                  <span className="text-xs font-semibold text-white">{node.name}</span>
                </div>
              ))}
            </div>

            <button onClick={() => navigate(`/biblioteca?category=${selectedCategory.id}`)} className="mt-4 w-full min-h-11 rounded-xl bg-white text-[#080A0D] hover:bg-[#EDF0F3] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" /> Treinar este pilar
            </button>
          </div>

          <div className="rounded-3xl bg-[#11151A] border border-[#1F2630] p-5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#747E89]">Como ler a árvore</span>
            <div className="space-y-4 mt-4">
              <div className="flex gap-3"><CircleDot className="w-4 h-4 text-[#FF6B1A] mt-0.5 flex-shrink-0" /><div><strong className="text-xs text-white block">Etapa atual</strong><span className="text-[11px] text-[#7F8995]">É onde sua avaliação indica maior retorno agora.</span></div></div>
              <div className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /><div><strong className="text-xs text-white block">Base já liberada</strong><span className="text-[11px] text-[#7F8995]">Você pode revisitá-la para consolidar a mecânica.</span></div></div>
              <div className="flex gap-3"><Lock className="w-4 h-4 text-[#69737E] mt-0.5 flex-shrink-0" /><div><strong className="text-xs text-white block">Próxima camada</strong><span className="text-[11px] text-[#7F8995]">Não é punição: evita pular para variações complexas sem base.</span></div></div>
            </div>
          </div>

          {nextStage && (
            <div className="rounded-3xl bg-[#0D1014] border border-[#1F2630] p-5">
              <span className="text-[10px] uppercase font-bold text-[#747E89]">Próximo desbloqueio</span>
              <h4 className="text-lg font-heading text-white mt-1">{nextStage.difficulty}</h4>
              <p className="text-xs text-[#8B949F] mt-2">A partir de uma autoavaliação média de <strong className="text-white">{nextStage.threshold.toFixed(1)}</strong> neste pilar.</p>
              <button onClick={() => navigate('/progresso')} className="mt-4 text-xs font-bold text-[#FF6B1A] flex items-center gap-1">
                Revisar autoavaliação <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>
      </section>

      <section className="rounded-3xl border border-[#1F2630] bg-[#11151A] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF8D4D]">DRILL → SKILL → GAME</span>
          <h3 className="text-lg sm:text-xl font-heading text-white mt-1">A árvore mostra o que aprender. A Biblioteca mostra como praticar.</h3>
          <p className="text-xs text-[#89929D] mt-1">Use a progressão como mapa e os drills como ferramenta — não como fim.</p>
        </div>
        <button onClick={() => navigate(`/biblioteca?category=${selectedCategory.id}`)} className="px-5 py-3 rounded-xl border border-[#FF6B1A]/35 bg-[#FF6B1A]/10 text-[#FF8D4D] hover:bg-[#FF6B1A] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap">
          Abrir Biblioteca <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
