import React from 'react';
import { Clock, Flame, Dumbbell, Award, ArrowRight } from 'lucide-react';
import { Workout } from '../../types';

interface WorkoutCardProps {
  workout: Workout;
  onStart: (workout: Workout) => void;
  featured?: boolean;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStart, featured = false }) => {
  return (
    <div
      className={`group relative bg-[#15191F] border ${
        featured ? 'border-[#FF6B1A]/40 shadow-xl shadow-[#FF6B1A]/5' : 'border-[#1F2630]'
      } hover:border-[#FF6B1A]/80 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between`}
    >
      {/* Visual Image Header */}
      <div className="relative h-44 w-full overflow-hidden bg-[#0D1014]">
        <img
          src={workout.thumbnail}
          alt={workout.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 mix-blend-luminosity brightness-75"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15191F] via-[#15191F]/50 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#FF6B1A] text-white">
            {workout.categoryLabel}
          </span>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-black/60 backdrop-blur-sm text-white border border-white/10">
            {workout.level}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono-num font-bold bg-[#FF6B1A]/20 text-[#FF8D4D] border border-[#FF6B1A]/30 flex items-center gap-1">
            <Award className="w-3 h-3" />
            +{workout.xpReward} XP
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
          <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm font-mono-num border border-white/10">
            <Clock className="w-3.5 h-3.5 text-[#FF6B1A]" />
            {workout.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm font-semibold border border-white/10">
            <Dumbbell className="w-3.5 h-3.5 text-[#FF6B1A]" />
            {workout.exercises.length} exercícios
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xl font-heading text-white tracking-tight leading-tight group-hover:text-[#FF6B1A] transition-colors">
            {workout.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#9AA1AA] line-clamp-2 mt-2 leading-relaxed">
            {workout.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {workout.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-[#11151A] text-[10px] font-medium text-[#9AA1AA] border border-[#1F2630]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-3 border-t border-[#1F2630]">
          <button
            onClick={() => onStart(workout)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-md shadow-[#FF6B1A]/20 flex items-center justify-center gap-2 group-hover:shadow-lg"
          >
            <Flame className="w-4 h-4" />
            Começar Treino
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
