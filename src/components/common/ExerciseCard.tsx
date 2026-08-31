import React from 'react';
import { Clock, Eye, Target, MapPin, Dumbbell, ArrowRight } from 'lucide-react';
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
      className="group relative bg-[#11151A] hover:bg-[#15191F] border border-[#1F2630] hover:border-[#FF6B1A]/60 rounded-2xl overflow-hidden transition-all duration-200 text-left flex flex-col h-full shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
      aria-label={`Abrir exercício ${exercise.name}`}
    >
      <div className={`relative ${compact ? 'h-28' : 'h-40'} w-full overflow-hidden bg-[#0D1014]`}>
        <img
          src={exercise.thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-65 mix-blend-luminosity brightness-75"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11151A] via-[#11151A]/35 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-[#FF6B1A] text-white shadow-lg">
            {exercise.categoryLabel}
          </span>
          <span className="px-2 py-1 rounded-lg text-[10px] font-semibold uppercase bg-black/60 backdrop-blur-sm text-white border border-white/10">
            {exercise.difficulty}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className="px-2 py-1 rounded-lg text-[10px] font-mono-num font-semibold bg-black/70 backdrop-blur-sm text-white border border-white/10 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#FF6B1A]" />
            {exercise.durationMinutes} min
          </span>
          <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-black/70 backdrop-blur-sm text-white border border-white/10 flex items-center gap-1 max-w-[55%] truncate">
            <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            {exercise.space}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <span className="text-[10px] font-bold text-[#FF8D4D] uppercase tracking-wider block mb-1">
            {exercise.subcategory}
          </span>
          <h3 className="text-lg font-heading text-white tracking-tight leading-snug group-hover:text-[#FF6B1A] transition-colors line-clamp-2">
            {exercise.name}
          </h3>
          <p className="text-xs text-[#9AA1AA] line-clamp-2 mt-1.5 leading-relaxed">
            {exercise.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="px-2 py-1 rounded-lg bg-[#0D1014] border border-[#1F2630] text-[10px] text-[#B0B6BE] flex items-center gap-1">
              <Target className="w-3 h-3 text-[#FF6B1A]" />
              {exercise.sets} séries
            </span>
            <span className="px-2 py-1 rounded-lg bg-[#0D1014] border border-[#1F2630] text-[10px] text-[#B0B6BE] flex items-center gap-1 min-w-0 max-w-full">
              <Dumbbell className="w-3 h-3 text-[#FF6B1A] flex-shrink-0" />
              <span className="truncate">{equipmentLabel}</span>
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1F2630] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#6F7782] block">Leve para o jogo</span>
            <span className="text-[11px] text-[#C3C8CE] line-clamp-1">{exercise.gameTransfer.skill}</span>
          </div>
          <span className="text-xs font-bold text-[#FF6B1A] flex items-center gap-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
            Ver exercício
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </button>
  );
};
