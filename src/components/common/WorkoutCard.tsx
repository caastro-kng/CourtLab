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
    <article
      className={`group relative bg-[#0F141A] border ${
        featured ? 'border-[#FF6B1A]/35' : 'border-white/[0.06]'
      } hover:border-[#FF6B1A]/45 rounded-[20px] overflow-hidden transition-all duration-200 flex flex-col h-full`}
    >
      <div className="relative h-44 w-full overflow-hidden bg-[#0A0D11]">
        <img
          src={workout.thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-500 opacity-58 mix-blend-luminosity brightness-75"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F141A] via-[#0F141A]/28 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-3">
          <span className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-[#FF6B1A] text-white">
            {workout.categoryLabel}
          </span>
          <span className="text-[9px] font-semibold uppercase text-white/75 pt-1">{workout.level}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-[10px] text-[#A2ABB5] mb-3">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#FF6B1A]" />{workout.estimatedMinutes} min</span>
          <span className="flex items-center gap-1.5"><Dumbbell className="w-3.5 h-3.5 text-[#FF6B1A]" />{workout.exercises.length} exercícios</span>
          <span className="flex items-center gap-1.5 ml-auto text-[#FF9B62]"><Award className="w-3.5 h-3.5" />+{workout.xpReward} XP</span>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-heading text-white tracking-tight leading-tight group-hover:text-[#FF8D4D] transition-colors">
            {workout.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#8F98A4] line-clamp-2 mt-2 leading-relaxed">
            {workout.description}
          </p>

          {workout.tags.length > 0 && (
            <p className="mt-4 text-[10px] uppercase tracking-[0.11em] text-[#697481] line-clamp-1">
              {workout.tags.slice(0, 3).join(' · ')}
            </p>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#717B86]">Sessão pronta</span>
          <button
            onClick={() => onStart(workout)}
            className="min-h-10 px-4 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
          >
            <Flame className="w-3.5 h-3.5" />
            Começar
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
