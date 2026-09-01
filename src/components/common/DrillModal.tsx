import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Play,
  Clock,
  Shield,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Video,
  Target,
  Award,
  Dumbbell,
  Plus,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { Exercise, Workout } from '../../types';
import { CourtDiagram } from './CourtDiagram';
import { usePlayer } from '../../context/PlayerContext';
import { EXERCISE_VIDEO_SOURCES } from '../../data/exerciseVideos';

interface DrillModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onStartDrill?: (exercise: Exercise) => void;
}

type DetailTab = 'execution' | 'transfer' | 'video';

export const DrillModal: React.FC<DrillModalProps> = ({ exercise, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('execution');
  const [showAllInstructions, setShowAllInstructions] = useState(false);
  const [savedAsWorkout, setSavedAsWorkout] = useState(false);
  const { startWorkout, saveCustomWorkout, customWorkouts } = usePlayer();

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (exercise) {
      setActiveTab('execution');
      setShowAllInstructions(false);
      setSavedAsWorkout(false);
    }
  }, [exercise?.id]);

  const videoEmbedUrl = useMemo(() => {
    if (!exercise) return null;
    if (exercise.youtubeId) return `https://www.youtube-nocookie.com/embed/${exercise.youtubeId}`;
    if (exercise.videoUrl?.includes('youtube.com/watch?v=')) {
      const id = exercise.videoUrl.split('v=')[1]?.split('&')[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (exercise.videoUrl?.includes('youtu.be/')) {
      const id = exercise.videoUrl.split('youtu.be/')[1]?.split('?')[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    return null;
  }, [exercise]);

  if (!isOpen || !exercise) return null;

  const videoSource = EXERCISE_VIDEO_SOURCES[exercise.id];
  const videoAvailable = Boolean(videoSource || videoEmbedUrl || exercise.videoUrl);

  const standaloneWorkout: Workout = {
    id: `drill-${exercise.id}`,
    title: exercise.name,
    slug: `drill-${exercise.slug}`,
    description: `Sessão avulsa focada em ${exercise.gameTransfer.skill}.`,
    category: exercise.category,
    categoryLabel: exercise.categoryLabel,
    level: exercise.difficulty,
    estimatedMinutes: exercise.durationMinutes,
    exercises: [
      {
        exerciseId: exercise.id,
        customSets: exercise.sets,
        customReps: exercise.reps,
        restSeconds: 30
      }
    ],
    xpReward: Math.max(30, exercise.sets * 10),
    tags: ['Drill avulso', exercise.categoryLabel],
    thumbnail: exercise.thumbnail
  };

  const handleStart = () => {
    startWorkout(standaloneWorkout);
    onClose();
  };

  const handleSaveToWorkouts = () => {
    const exists = customWorkouts.some((workout) => workout.id === standaloneWorkout.id);
    if (!exists) saveCustomWorkout(standaloneWorkout);
    setSavedAsWorkout(true);
  };

  const visibleInstructions = showAllInstructions
    ? exercise.instructions
    : exercise.instructions.slice(0, 4);

  const tabs: { id: DetailTab; label: string; icon: React.ElementType }[] = [
    { id: 'execution', label: 'Execução', icon: CheckCircle2 },
    { id: 'transfer', label: 'DRILL → SKILL → GAME', icon: Target },
    { id: 'video', label: 'Vídeo', icon: Video }
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm sm:p-4 flex items-end sm:items-center justify-center animate-in fade-in duration-150"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-detail-title"
        className="w-full sm:max-w-5xl h-[96dvh] sm:h-auto sm:max-h-[92vh] bg-[#0B0E12] border border-[#1F2630] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <header className="relative min-h-[220px] sm:min-h-[270px] overflow-hidden flex-shrink-0 bg-[#11151A]">
          <img
            src={exercise.thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-45 brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E12] via-[#0B0E12]/65 to-black/20" />

          <button
            onClick={onClose}
            aria-label="Fechar detalhes do exercício"
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/65 border border-white/10 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute left-4 right-4 bottom-5 sm:left-6 sm:right-6 sm:bottom-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-lg bg-[#FF6B1A] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                {exercise.categoryLabel}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/55 border border-white/10 text-white text-[10px] sm:text-xs font-semibold">
                {exercise.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/55 border border-white/10 text-white text-[10px] sm:text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF6B1A]" /> {exercise.durationMinutes} min
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/55 border border-white/10 text-white text-[10px] sm:text-xs font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {exercise.space}
              </span>
              {videoAvailable && (
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className="px-2.5 py-1 rounded-lg bg-[#FF6B1A]/20 border border-[#FF6B1A]/40 text-[#FFB184] text-[10px] sm:text-xs font-bold flex items-center gap-1.5 hover:bg-[#FF6B1A]/30 transition-colors"
                >
                  <Video className="w-3.5 h-3.5" /> Vídeo disponível
                </button>
              )}
            </div>

            <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#FF9B62] font-bold">
              {exercise.subcategory}
            </span>
            <h2 id="exercise-detail-title" className="text-3xl sm:text-5xl font-heading text-white tracking-tight leading-none mt-1">
              {exercise.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#B2B8C0] mt-2 max-w-3xl leading-relaxed line-clamp-2 sm:line-clamp-none">
              {exercise.description}
            </p>
          </div>
        </header>

        <nav className="flex-shrink-0 bg-[#0F1318] border-y border-[#1F2630] overflow-x-auto scrollbar-none" aria-label="Detalhes do exercício">
          <div className="flex min-w-max px-2 sm:px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
                    active
                      ? 'border-[#FF6B1A] text-white bg-[#FF6B1A]/5'
                      : 'border-transparent text-[#8E969F] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#FF6B1A]' : ''}`} />
                  {tab.label}
                  {tab.id === 'video' && videoAvailable && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-label="Vídeo disponível" />}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 pb-32 sm:pb-7">
          {activeTab === 'execution' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <Spec label="Volume" value={`${exercise.sets} séries`} icon={Dumbbell} />
                <Spec label="Meta" value={exercise.reps} icon={Target} />
                <Spec label="Equipamento" value={exercise.equipment.join(', ')} icon={Sparkles} />
                <Spec label="Espaço" value={exercise.space} icon={MapPin} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5">
                <div className="space-y-5">
                  <section>
                    <div className="flex items-end justify-between gap-4 mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B1A]">Execução</span>
                        <h3 className="text-xl font-heading text-white">Como fazer</h3>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {visibleInstructions.map((step, index) => (
                        <div key={index} className="flex gap-3 p-3.5 rounded-2xl bg-[#12171D] border border-[#1F2630]">
                          <span className="w-7 h-7 rounded-full bg-[#FF6B1A]/15 border border-[#FF6B1A]/35 text-[#FF8D4D] flex-shrink-0 flex items-center justify-center text-xs font-black">
                            {index + 1}
                          </span>
                          <p className="text-sm text-[#E9EDF1] leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>

                    {exercise.instructions.length > 4 && (
                      <button
                        onClick={() => setShowAllInstructions((current) => !current)}
                        className="mt-2 w-full py-2.5 rounded-xl text-xs font-bold text-[#A9B0B8] hover:text-white hover:bg-[#151A20] transition-colors flex items-center justify-center gap-1.5"
                      >
                        {showAllInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showAllInstructions ? 'Mostrar menos' : `Ver todos os ${exercise.instructions.length} passos`}
                      </button>
                    )}
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <section className="p-4 rounded-2xl bg-emerald-500/[0.07] border border-emerald-500/20">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Pontos-chave
                      </h4>
                      <ul className="space-y-2.5">
                        {exercise.tips.map((tip, index) => (
                          <li key={index} className="text-xs sm:text-sm text-[#D9E7DF] leading-relaxed flex gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="p-4 rounded-2xl bg-red-500/[0.06] border border-red-500/20">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Erros comuns
                      </h4>
                      <ul className="space-y-2.5">
                        {exercise.commonMistakes.map((mistake, index) => (
                          <li key={index} className="text-xs sm:text-sm text-[#E8D9DB] leading-relaxed flex gap-2">
                            <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            {mistake}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B1A]">Posicionamento</span>
                    <h3 className="text-xl font-heading text-white">Onde executar</h3>
                  </div>
                  <CourtDiagram placement={exercise.courtPlacement || 'top'} />
                  <div className="p-4 rounded-2xl bg-[#12171D] border border-[#1F2630]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F98A2]">Antes de começar</span>
                    <p className="text-xs sm:text-sm text-[#D1D6DC] mt-1.5 leading-relaxed">
                      Faça as primeiras repetições em velocidade controlada. Aumente o ritmo apenas quando conseguir manter o mesmo padrão técnico.
                    </p>
                  </div>
                  {videoAvailable && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('video')}
                      className="w-full p-4 rounded-2xl bg-[#FF6B1A]/[0.06] border border-[#FF6B1A]/25 text-left hover:bg-[#FF6B1A]/10 transition-colors"
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF9B62] flex items-center gap-1.5"><Video className="w-3.5 h-3.5" />Demonstração disponível</span>
                      <span className="text-sm font-bold text-white block mt-1">Veja o movimento antes de treinar</span>
                      {videoSource?.source && <span className="text-[11px] text-[#8F98A2] block mt-1 line-clamp-2">{videoSource.source}</span>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transfer' && (
            <div className="space-y-6">
              <section className="p-5 sm:p-6 rounded-3xl bg-[#12171D] border border-[#FF6B1A]/30 overflow-hidden relative">
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-[#FF6B1A]/10 blur-3xl" />
                <div className="relative">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF8D4D]">Método CourtLab</span>
                  <h3 className="text-2xl sm:text-3xl font-heading text-white mt-1">Treine o movimento. Desenvolva a skill. Use no jogo.</h3>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-stretch mt-5">
                    <TransferStep number="01" title="DRILL" text={exercise.gameTransfer.drill} />
                    <ArrowRight className="w-5 h-5 text-[#FF6B1A] self-center justify-self-center rotate-90 md:rotate-0" />
                    <TransferStep number="02" title="SKILL" text={exercise.gameTransfer.skill} accent />
                    <ArrowRight className="w-5 h-5 text-[#FF6B1A] self-center justify-self-center rotate-90 md:rotate-0" />
                    <TransferStep number="03" title="GAME" text={exercise.gameTransfer.gameSituation} game />
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <section className="p-5 rounded-2xl bg-[#12171D] border border-[#1F2630]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F98A2]">Quando usar</span>
                  <h4 className="text-lg font-heading text-white mt-1">Situação de jogo</h4>
                  <p className="text-sm text-[#D6DBE0] mt-2 leading-relaxed">{exercise.gameTransfer.gameSituation}</p>
                </section>
                <section className="p-5 rounded-2xl bg-[#12171D] border border-[#1F2630]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F98A2]">O que procurar</span>
                  <h4 className="text-lg font-heading text-white mt-1">Objetivo técnico</h4>
                  <p className="text-sm text-[#D6DBE0] mt-2 leading-relaxed">{exercise.gameTransfer.objective}</p>
                </section>
              </div>

              {exercise.gameTransfer.nbaExampleConcept && (
                <section className="p-5 rounded-2xl border border-[#FF6B1A]/25 bg-[#FF6B1A]/[0.05] flex gap-3">
                  <Award className="w-5 h-5 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF9B62]">Referência para estudar</span>
                    <p className="text-sm text-white mt-1 leading-relaxed">{exercise.gameTransfer.nbaExampleConcept}</p>
                  </div>
                </section>
              )}

              <CourtDiagram placement={exercise.courtPlacement || 'top'} />
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B1A]">Demonstração</span>
                  <h3 className="text-2xl font-heading text-white">Veja antes de executar</h3>
                  <p className="text-sm text-[#9DA5AE] mt-1">Use o vídeo para reconhecer o movimento e depois volte para as instruções em português.</p>
                </div>
                {videoSource && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Vídeo curado
                  </span>
                )}
              </div>

              {videoEmbedUrl ? (
                <div className="aspect-video rounded-2xl overflow-hidden border border-[#1F2630] bg-black">
                  <iframe
                    src={videoEmbedUrl}
                    title={`Demonstração de ${exercise.name}`}
                    className="w-full h-full"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#1F2630] bg-[#11151A] flex items-center justify-center">
                  <img src={exercise.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="relative z-10 text-center px-6 max-w-md">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#FF6B1A]/15 border border-[#FF6B1A]/40 flex items-center justify-center mb-3">
                      <Video className="w-6 h-6 text-[#FF6B1A]" />
                    </div>
                    <h4 className="text-lg font-heading text-white">Vídeo ainda não vinculado</h4>
                    <p className="text-xs sm:text-sm text-[#A4ABB3] mt-1.5 leading-relaxed">
                      O exercício já possui instruções, pontos-chave e aplicação no jogo. Quando uma demonstração for adicionada à base, ela aparecerá aqui.
                    </p>
                  </div>
                </div>
              )}

              {videoAvailable && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <section className="p-4 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" />O que observar</span>
                    <p className="text-sm text-[#D9E7DF] leading-relaxed mt-2">{exercise.tips?.[0] || exercise.instructions?.[0] || 'Observe a base, o ritmo e a sequência do movimento antes de aumentar a velocidade.'}</p>
                  </section>
                  <section className="p-4 rounded-2xl bg-[#12171D] border border-[#1F2630]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F98A2] flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-[#FF6B1A]" />Fonte da demonstração</span>
                    <p className="text-sm text-white leading-relaxed mt-2">{videoSource?.source || 'Vídeo externo vinculado ao exercício'}</p>
                  </section>
                </div>
              )}

              {exercise.videoUrl && (
                <a
                  href={exercise.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl border border-[#2B3542] bg-[#151A20] text-sm font-bold text-white flex items-center justify-center gap-2 hover:border-[#FF6B1A]/60 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-[#FF6B1A]" /> Abrir vídeo original no YouTube
                </a>
              )}
            </div>
          )}
        </div>

        <footer className="fixed sm:static bottom-0 left-0 right-0 z-20 p-3 sm:p-4 bg-[#0B0E12]/95 backdrop-blur-xl border-t border-[#1F2630] flex-shrink-0">
          <div className="max-w-5xl mx-auto flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleSaveToWorkouts}
              className={`h-12 sm:h-13 px-3 sm:px-5 rounded-xl border text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                savedAsWorkout
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-[#151A20] border-[#2B3542] text-white hover:border-[#FF6B1A]/50'
              }`}
            >
              {savedAsWorkout ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4 text-[#FF6B1A]" />}
              <span className="hidden xs:inline sm:inline">{savedAsWorkout ? 'Salvo' : 'Adicionar aos meus treinos'}</span>
              <span className="xs:hidden sm:hidden">{savedAsWorkout ? 'Salvo' : 'Salvar'}</span>
            </button>

            <button
              onClick={handleStart}
              className="flex-1 h-12 sm:h-13 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] active:scale-[0.99] text-white font-heading text-sm sm:text-base uppercase tracking-wider transition-all shadow-lg shadow-[#FF6B1A]/20 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> Treinar este drill
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

const Spec: React.FC<{ label: string; value: string; icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
  <div className="p-3.5 rounded-2xl bg-[#12171D] border border-[#1F2630] min-w-0">
    <span className="text-[10px] uppercase font-bold tracking-wider text-[#838C96] flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-[#FF6B1A]" /> {label}
    </span>
    <span className="text-sm font-bold text-white block mt-1 truncate" title={value}>{value}</span>
  </div>
);

const TransferStep: React.FC<{ number: string; title: string; text: string; accent?: boolean; game?: boolean }> = ({ number, title, text, accent, game }) => (
  <div className={`p-4 rounded-2xl border ${game ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : accent ? 'border-[#FF6B1A]/35 bg-[#FF6B1A]/[0.06]' : 'border-[#2B3542] bg-[#0D1014]'}`}>
    <span className={`text-[10px] font-black tracking-widest ${game ? 'text-emerald-400' : accent ? 'text-[#FF8D4D]' : 'text-[#7F8994]'}`}>{number}</span>
    <h4 className={`text-xl font-heading mt-1 ${game ? 'text-emerald-400' : accent ? 'text-[#FF6B1A]' : 'text-white'}`}>{title}</h4>
    <p className="text-xs text-[#A7AEB6] leading-relaxed mt-2">{text}</p>
  </div>
);
