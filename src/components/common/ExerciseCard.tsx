import React from 'react';
import { Clock, Eye, Target, MapPin } from 'lucide-react';
import { Exercise } from '../../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  compact?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSelect, compact = false }) => {
  return (
    <div
      onClick={() => onSelect(exercise)}
      className="group relative bg-[#15191F] hover:bg-[#191E24] border border-[#1F2630] hover:border-[#FF6B1A]/60 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col h-full shadow-lg"
    >
      {/* 35-45% Visual Aspect Header */}
      <div className={`relative ${compact ? 'h-32' : 'h-40'} w-full overflow-hidden bg-[#0D1014]`}>
        <img
          src={exercise.thumbnail}
          alt={exercise.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 mix-blend-luminosity brightness-75"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15191F] via-[#15191F]/40 to-transparent" />

        {/* Badges in visual header */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#FF6B1A] text-white">
            {exercise.categoryLabel}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-black/60 backdrop-blur-sm text-[#FFFFFF] border border-white/10">
            {exercise.difficulty}
          </span>
        </div>

        <div className="absolute bottom-2 right-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-num font-semibold bg-black/70 backdrop-blur-sm text-white/90 border border-white/10 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#FF6B1A]" />
            {exercise.durationMinutes} MIN
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#FF8D4D] uppercase tracking-wider block mb-1">
            {exercise.subcategory}
          </span>
          <h3 className="text-base sm:text-lg font-heading text-white tracking-tight leading-snug group-hover:text-[#FF6B1A] transition-colors line-clamp-1">
            {exercise.name}
          </h3>
          <p className="text-xs text-[#9AA1AA] line-clamp-2 mt-1.5 leading-relaxed">
            {exercise.description}
          </p>
        </div>

        {/* Bottom meta & CTA */}
        <div className="mt-4 pt-3 border-t border-[#1F2630] flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-[#9AA1AA]">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3 text-[#FF6B1A]" />
              {exercise.sets} séries
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {exercise.space}
            </span>
          </div>

          <span className="text-xs font-bold text-[#FF6B1A] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            Ver
          </span>
        </div>
      </div>
    </div>
  );
};
