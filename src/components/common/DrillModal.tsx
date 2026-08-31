import React, { useState } from 'react';
import { X, Play, Clock, Flame, Shield, MapPin, CheckCircle2, AlertTriangle, ArrowRight, Video, Target, Award } from 'lucide-react';
import { Exercise } from '../../types';
import { CourtDiagram } from './CourtDiagram';
import { usePlayer } from '../../context/PlayerContext';

interface DrillModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onStartDrill?: (exercise: Exercise) => void;
}

export const DrillModal: React.FC<DrillModalProps> = ({ exercise, isOpen, onClose, onStartDrill }) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'game-transfer' | 'video'>('instructions');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { addXp } = usePlayer();

  if (!isOpen || !exercise) return null;

  const handleMarkPracticed = () => {
    addXp(30);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#0D1014] border border-[#1F2630] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Visual Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#15191F] flex-shrink-0">
          <img
            src={exercise.thumbnail}
            alt={exercise.name}
            className="w-full h-full object-cover opacity-45 mix-blend-luminosity brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1014] via-[#0D1014]/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on Banner */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FF6B1A] text-white">
                {exercise.categoryLabel}
              </span>
              <span className="px-2.5 py-1 rounded text-[11px] font-semibold uppercase bg-[#1F2630] text-[#9AA1AA] border border-[#2B3542]">
                {exercise.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded text-[11px] font-mono-num font-semibold text-white/90 bg-black/50 border border-white/10 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#FF6B1A]" />
                {exercise.durationMinutes} MIN
              </span>
              <span className="px-2.5 py-1 rounded text-[11px] font-semibold text-white/90 bg-black/50 border border-white/10 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {exercise.space}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading text-white tracking-tight leading-tight">
              {exercise.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA1AA] line-clamp-1 mt-0.5">
              {exercise.subcategory} — {exercise.description}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1F2630] bg-[#11151A] px-4 flex-shrink-0">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'instructions'
                ? 'border-[#FF6B1A] text-white'
                : 'border-transparent text-[#9AA1AA] hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#FF6B1A]" />
            Como Fazer & Detalhes
          </button>
          <button
            onClick={() => setActiveTab('game-transfer')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'game-transfer'
                ? 'border-[#FF6B1A] text-white'
                : 'border-transparent text-[#9AA1AA] hover:text-white'
            }`}
          >
            <Target className="w-4 h-4 text-[#FF6B1A]" />
            Leve para o Jogo
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'video'
                ? 'border-[#FF6B1A] text-white'
                : 'border-transparent text-[#9AA1AA] hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 text-[#FF6B1A]" />
            Vídeo & Demonstração
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'instructions' && (
            <>
              {/* Quick Specs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#15191F] border border-[#1F2630]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Séries / Sets</span>
                  <span className="text-sm sm:text-base font-heading text-white">{exercise.sets} Séries</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Repetições</span>
                  <span className="text-sm sm:text-base font-heading text-white">{exercise.reps}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Equipamento</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#FF8D4D]">{exercise.equipment.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Espaço</span>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-400">{exercise.space}</span>
                </div>
              </div>

              {/* Como Fazer (Numbered Steps) */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF6B1A] mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Como Fazer (Passo a Passo)
                </h3>
                <div className="space-y-2.5">
                  {exercise.instructions.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#15191F]/70 border border-[#1F2630]"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF6B1A]/20 text-[#FF6B1A] font-mono-num font-bold text-xs flex items-center justify-center border border-[#FF6B1A]/40">
                        {index + 1}
                      </span>
                      <p className="text-sm text-[#FFFFFF] leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pontos Importantes & Erros Comuns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pontos importantes */}
                <div className="p-4 rounded-xl bg-[#131E18] border border-emerald-900/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Pontos Importantes (Key Points)
                  </h4>
                  <ul className="space-y-2">
                    {exercise.tips.map((tip, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-emerald-100/90 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Erros comuns */}
                <div className="p-4 rounded-xl bg-[#221314] border border-red-900/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Erros Comuns a Evitar
                  </h4>
                  <ul className="space-y-2">
                    {exercise.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-red-100/90 flex items-start gap-2">
                        <span className="text-red-400 font-bold mt-0.5">•</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Court Placement Diagram */}
              <CourtDiagram placement={exercise.courtPlacement || 'top'} />
            </>
          )}

          {activeTab === 'game-transfer' && (
            <div className="space-y-6">
              {/* The DRILL -> SKILL -> GAME Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#191E24] to-[#12161C] border border-[#FF6B1A]/40 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono-num font-bold uppercase tracking-widest text-[#FF8D4D]">
                    Conceito Fundamental COURT LAB
                  </span>
                  <Award className="w-5 h-5 text-[#FF6B1A]" />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center my-4 py-2">
                  <div className="p-3 bg-[#0D1014] rounded-xl border border-[#2B3542] w-full sm:w-1/3">
                    <span className="text-[10px] uppercase text-[#9AA1AA] font-bold block">1. Treino</span>
                    <span className="text-sm font-heading text-white">DRILL</span>
                    <span className="text-xs text-[#9AA1AA] block mt-1">{exercise.gameTransfer.drill}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#FF6B1A] rotate-90 sm:rotate-0 flex-shrink-0" />
                  <div className="p-3 bg-[#0D1014] rounded-xl border border-[#2B3542] w-full sm:w-1/3">
                    <span className="text-[10px] uppercase text-[#9AA1AA] font-bold block">2. Habilidade</span>
                    <span className="text-sm font-heading text-[#FF6B1A]">SKILL</span>
                    <span className="text-xs text-[#9AA1AA] block mt-1">{exercise.gameTransfer.skill}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#FF6B1A] rotate-90 sm:rotate-0 flex-shrink-0" />
                  <div className="p-3 bg-[#0D1014] rounded-xl border border-emerald-800/60 w-full sm:w-1/3">
                    <span className="text-[10px] uppercase text-emerald-400 font-bold block">3. Aplicação</span>
                    <span className="text-sm font-heading text-emerald-400">GAME</span>
                    <span className="text-xs text-[#9AA1AA] block mt-1">Jogo Real</span>
                  </div>
                </div>
              </div>

              {/* Game Situation Details */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#15191F] border border-[#1F2630]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA1AA] mb-1">
                    Situação Tática no Jogo
                  </h4>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    {exercise.gameTransfer.gameSituation}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#15191F] border border-[#1F2630]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA1AA] mb-1">
                    Objetivo Técnico na Quadra
                  </h4>
                  <p className="text-sm text-[#FFFFFF] leading-relaxed">
                    {exercise.gameTransfer.objective}
                  </p>
                </div>
              </div>

              <CourtDiagram placement={exercise.courtPlacement || 'top'} />
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#1F2630] flex items-center justify-center group">
                {!isVideoPlaying ? (
                  <>
                    <img
                      src={exercise.thumbnail}
                      alt={exercise.name}
                      className="w-full h-full object-cover opacity-60"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      className="absolute p-4 rounded-full bg-[#FF6B1A] text-white hover:scale-110 transition-transform shadow-xl shadow-[#FF6B1A]/30 flex items-center justify-center"
                    >
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <span className="text-xs uppercase font-mono-num tracking-wider text-[#9AA1AA] block">
                        Demonstração Técnica em Vídeo
                      </span>
                      <span className="text-sm font-semibold text-white">
                        ▶ Assistir execução em câmera lenta e biomecânica
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#11151A]">
                    <div className="w-14 h-14 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A] flex items-center justify-center mb-3">
                      <Play className="w-6 h-6 text-[#FF6B1A]" />
                    </div>
                    <h4 className="text-base font-heading text-white mb-1">Demonstração Integrada</h4>
                    <p className="text-xs text-[#9AA1AA] max-w-md mb-4">
                      Em produção, o vídeo demonstrativo em alta definição com câmera lenta e ângulos múltiplos é carregado aqui.
                    </p>
                    <button
                      onClick={() => setIsVideoPlaying(false)}
                      className="px-4 py-2 rounded-lg bg-[#1F2630] text-xs font-semibold text-white hover:bg-[#2B3542]"
                    >
                      Voltar para thumbnail
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-[#9AA1AA] text-center">
                Vídeos demonstrativos gravados com treinadores e atletas de basquete nacional e internacional.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1F2630] bg-[#11151A] flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={handleMarkPracticed}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#191E24] hover:bg-[#202730] border border-[#2B3542] text-xs font-semibold text-[#FFFFFF] transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Marcar Praticado (+30 XP)
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[#9AA1AA] hover:text-white transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                if (onStartDrill) {
                  onStartDrill(exercise);
                } else {
                  onClose();
                }
              }}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#FF6B1A]/20 flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4" />
              Treinar Exercício
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
