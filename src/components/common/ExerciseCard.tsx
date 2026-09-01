import React, { useState } from 'react';
import { ArrowRight, Clock, ImageOff, MapPin, Video } from 'lucide-react';
import { Exercise } from '../../types';
import { EXERCISE_VIDEO_SOURCES } from '../../data/exerciseVideos';
import { getCategoryVisual } from '../../utils/categoryVisual';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  compact?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSelect, compact = false }) => {
  const videoSource = EXERCISE_VIDEO_SOURCES[exercise.id];
  const visual = getCategoryVisual(exercise.category);
  const [imageFailed, setImageFailed] = useState(false);

  return <button
    type="button"
    onClick={() => onSelect(exercise)}
    className="group cl-card-lift relative text-left flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] rounded-2xl overflow-hidden bg-[#0D1116] border border-white/[0.055] hover:border-white/[0.13] transition-colors"
    aria-label={`Abrir exercício ${exercise.name}`}
  >
    <span className="absolute inset-x-0 top-0 h-[2px] z-20" style={{ backgroundColor: visual.accent }} />

    <div className="relative aspect-video w-full overflow-hidden bg-[#090C10] isolate">
      {!imageFailed ? (
        <img
          src={exercise.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.82] brightness-[0.72] saturate-[0.68] contrast-[1.08] group-hover:scale-[1.035] group-hover:brightness-[0.76] group-hover:saturate-[0.76] transition-[transform,filter,opacity] duration-500 ease-out"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-5" style={{ background: `radial-gradient(circle at 50% 35%, ${visual.glow}, transparent 58%), #090C10` }}>
          <div className="w-11 h-11 rounded-2xl border border-white/[0.08] bg-white/[0.035] flex items-center justify-center">
            <ImageOff className="w-5 h-5" style={{ color: visual.accent }} />
          </div>
          <span className="cl-label text-white/55">Imagem indisponível</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0D1116]/95 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[46%] opacity-70 group-hover:opacity-95 transition-opacity pointer-events-none" style={{ background: `linear-gradient(to top, ${visual.glow}, transparent)` }} />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.035] pointer-events-none" />

      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 cl-label text-white bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/[0.06]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: visual.accent }} />
          {exercise.categoryLabel}
        </span>
        {videoSource && <span className="w-8 h-8 rounded-full bg-[#FF6B1A] text-white flex items-center justify-center shadow-lg shadow-black/25 group-hover:scale-105 transition-transform" title="Vídeo disponível"><Video className="w-3.5 h-3.5" /></span>}
      </div>

      <div className={`absolute bottom-3 left-3 right-3 flex items-center gap-3 cl-copy-small text-white/90 ${compact ? 'text-[10px]' : ''}`}>
        <span className="flex items-center gap-1 font-mono-num"><Clock className="w-3.5 h-3.5 text-[#FF8D4D]" />{exercise.durationMinutes} min</span>
        <span className="flex items-center gap-1 min-w-0"><MapPin className="w-3.5 h-3.5 text-[#FF8D4D]" /><span className="truncate">{exercise.space}</span></span>
        <span className="ml-auto cl-label text-white/72">{exercise.difficulty}</span>
      </div>
    </div>

    <div className="p-4 sm:p-5 flex flex-col flex-1">
      <div className="flex items-center justify-between gap-3">
        <span className="cl-label" style={{ color: visual.accent }}>{exercise.subcategory}</span>
        <span className="cl-label text-[#59636E]">{visual.label}</span>
      </div>
      <h3 className="cl-card-title text-white mt-1 group-hover:text-[#F4F6F8] transition-colors line-clamp-2">{exercise.name}</h3>
      {!compact && <p className="cl-copy-small mt-2 line-clamp-2">{exercise.description}</p>}

      <div className="mt-auto pt-4">
        <div className="border-t border-white/[0.055] pt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <span className="cl-label text-[#66717D] block">Leve para o jogo</span>
            <span className="cl-copy-small text-[#D0D5DA] line-clamp-1">{exercise.gameTransfer.skill}</span>
            {videoSource && !compact && <span className="cl-label normal-case tracking-normal text-[#737E8A] line-clamp-1 mt-1 block">Vídeo: {videoSource.source}</span>}
          </div>
          <span className="cl-button-text flex items-center gap-1 shrink-0 group-hover:gap-1.5 transition-all" style={{ color: visual.accent }}>Abrir <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></span>
        </div>
      </div>
    </div>
  </button>;
};
