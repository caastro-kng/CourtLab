import React from 'react';
import { ArrowRight, Clock, MapPin, Video } from 'lucide-react';
import { Exercise } from '../../types';
import { EXERCISE_VIDEO_SOURCES } from '../../data/exerciseVideos';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  compact?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSelect, compact = false }) => {
  const videoSource = EXERCISE_VIDEO_SOURCES[exercise.id];

  return <button
    type="button"
    onClick={() => onSelect(exercise)}
    className="group text-left flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] rounded-2xl overflow-hidden bg-[#0D1116] border border-white/[0.055] hover:border-[#FF6B1A]/35 transition-colors"
    aria-label={`Abrir exercício ${exercise.name}`}
  >
    <div className={`relative ${compact ? 'h-28' : 'h-44'} overflow-hidden bg-[#090C10]`}>
      <img src={exercise.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-78 brightness-75 saturate-75 group-hover:scale-[1.02] transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1116] via-black/10 to-black/15" />
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
        <span className="text-[9px] uppercase font-bold tracking-[0.12em] text-white bg-black/55 backdrop-blur-sm px-2.5 py-1 rounded-full">{exercise.categoryLabel}</span>
        {videoSource && <span className="w-8 h-8 rounded-full bg-[#FF6B1A] text-white flex items-center justify-center shadow-lg" title="Vídeo disponível"><Video className="w-3.5 h-3.5" /></span>}
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-[10px] text-white/85">
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#FF8D4D]" />{exercise.durationMinutes} min</span>
        <span className="flex items-center gap-1 min-w-0"><MapPin className="w-3.5 h-3.5 text-[#FF8D4D]" /><span className="truncate">{exercise.space}</span></span>
        <span className="ml-auto uppercase font-semibold text-white/70">{exercise.difficulty}</span>
      </div>
    </div>

    <div className="p-4 sm:p-5 flex flex-col flex-1">
      <span className="text-[9px] uppercase font-bold tracking-[0.14em] text-[#FF8D4D]">{exercise.subcategory}</span>
      <h3 className="text-lg font-heading text-white leading-snug mt-1 group-hover:text-[#FF8D4D] transition-colors line-clamp-2">{exercise.name}</h3>
      {!compact && <p className="text-xs text-[#89939E] mt-2 leading-relaxed line-clamp-2">{exercise.description}</p>}

      <div className="mt-auto pt-4">
        <div className="border-t border-white/[0.055] pt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#66717D] block">Leve para o jogo</span>
            <span className="text-[11px] text-[#D0D5DA] line-clamp-1">{exercise.gameTransfer.skill}</span>
            {videoSource && !compact && <span className="text-[9px] text-[#737E8A] line-clamp-1 mt-1 block">Vídeo: {videoSource.source}</span>}
          </div>
          <span className="text-xs font-bold text-[#FF6B1A] flex items-center gap-1 shrink-0">Abrir <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></span>
        </div>
      </div>
    </div>
  </button>;
};
