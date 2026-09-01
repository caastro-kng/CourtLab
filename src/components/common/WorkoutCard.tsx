import React from 'react';
import { Clock, Flame, Dumbbell, Award, ArrowRight } from 'lucide-react';
import { Workout } from '../../types';
import { getCategoryVisual } from '../../utils/categoryVisual';

interface WorkoutCardProps {
  workout: Workout;
  onStart: (workout: Workout) => void;
  featured?: boolean;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStart, featured = false }) => {
  const visual = getCategoryVisual(workout.category);

  return (
    <article
      className={`group relative bg-[#0F141A] border ${
        featured ? 'border-[#FF6B1A]/35' : 'border-white/[0.06]'
      } hover:border-white/[0.13] rounded-[20px] overflow-hidden transition-all duration-200 flex flex-col h-full`}
    >
      <span className="absolute inset-x-0 top-0 h-[2px] z-20" style={{ backgroundColor: visual.accent }} />
      <div className="relative h-44 w-full overflow-hidden bg-[#0A0D11]">
        <img
          src={workout.thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-500 opacity-62 brightness-75 saturate-75"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F141A] via-[#0F141A]/28 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 opacity-65" style={{ background: `linear-gradient(to top, ${visual.glow}, transparent)` }} />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-black/55 text-white backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: visual.accent }} />
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
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-[8px] uppercase tracking-[0.14em] font-bold" style={{ color: visual.accent }}>{visual.label}</span>
          </div>
          <h3 className="text-xl font-heading text-white tracking-tight leading-tight group-hover:text-[#F4F6F8] transition-colors">
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
