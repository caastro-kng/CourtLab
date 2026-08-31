import React from 'react';
import { Clock, Target, MapPin, Dumbbell, ArrowRight } from 'lucide-react';
import { Exercise } from '../../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  compact?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSelect, compact = false }) => {
  const equipmentLabel = exercise.equipment.length
    ? exercise.equipment.slice(0, 2).join(' + ')
    : 'Sem equipamento';

  return (
    <button
      type="button"
      onClick={() => onSelect(exercise)}
      className="group relative bg-[#0F141A] hover:bg-[#121820] border border-white/[0.06] hover:border-[#FF6B1A]/45 rounded-[20px] overflow-hidden transition-all duration-200 text-left flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
      aria-label={`Abrir exercício ${exercise.name}`}
    >
      <div className={`relative ${compact ? 'h-28' : 'h-40'} w-full overflow-hidden bg-[#0A0D11]`}>
        <img
          src={exercise.thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-500 opacity-62 mix-blend-luminosity brightness-75"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F141A] via-[#0F141A]/25 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-[#FF6B1A] text-white">
            {exercise.categoryLabel}
          </span>
          <span className="text-[9px] font-semibold uppercase text-white/75 pt-1">
            {exercise.difficulty}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[10px] text-[#9EA7B1] mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#FF6B1A]" />{exercise.durationMinutes} min</span>
          <span className="flex items-center gap-1 min-w-0"><MapPin className="w-3.5 h-3.5 text-[#FF6B1A] flex-shrink-0" /><span className="truncate">{exercise.space}</span></span>
        </div>

        <div className="flex-1">
          <span className="text-[9px] font-bold text-[#FF8D4D] uppercase tracking-[0.14em] block mb-1.5">
            {exercise.subcategory}
          </span>
          <h3 className="text-lg font-heading text-white tracking-tight leading-snug group-hover:text-[#FF8D4D] transition-colors line-clamp-2">
            {exercise.name}
          </h3>
          <p className="text-xs text-[#8F98A4] line-clamp-2 mt-2 leading-relaxed">
            {exercise.description}
          </p>

          <div className="mt-4 flex items-center gap-4 text-[10px] text-[#AAB2BC]">
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-[#FF6B1A]" />{exercise.sets} séries</span>
            <span className="flex items-center gap-1.5 min-w-0"><Dumbbell className="w-3.5 h-3.5 text-[#FF6B1A] flex-shrink-0" /><span className="truncate">{equipmentLabel}</span></span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#66717D] block">Leve para o jogo</span>
            <span className="text-[11px] text-[#C1C7CE] line-clamp-1">{exercise.gameTransfer.skill}</span>
          </div>
          <span className="text-xs font-bold text-[#FF6B1A] flex items-center gap-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
            Ver
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </button>
  );
};
