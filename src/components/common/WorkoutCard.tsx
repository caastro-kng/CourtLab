import React, { useState } from 'react';
import { Clock, Flame, Dumbbell, Award, ArrowRight, ImageOff } from 'lucide-react';
import { Workout } from '../../types';
import { getCategoryVisual } from '../../utils/categoryVisual';

interface WorkoutCardProps {
  workout: Workout;
  onStart: (workout: Workout) => void;
  featured?: boolean;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStart, featured = false }) => {
  const visual = getCategoryVisual(workout.category);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article
      className={`group cl-card-lift relative bg-[#0F141A] border ${
        featured ? 'border-[#FF6B1A]/35' : 'border-white/[0.06]'
      } hover:border-white/[0.13] rounded-[20px] overflow-hidden transition-all duration-200 flex flex-col h-full`}
    >
      <span className="absolute inset-x-0 top-0 h-[2px] z-20" style={{ backgroundColor: visual.accent }} />

      <div className="relative aspect-video w-full overflow-hidden bg-[#0A0D11] isolate">
        {!imageFailed ? (
          <img
            src={workout.thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.76] brightness-[0.7] saturate-[0.66] contrast-[1.08] group-hover:scale-[1.04] group-hover:brightness-[0.75] group-hover:saturate-[0.74] transition-[transform,filter,opacity] duration-500 ease-out"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-5" style={{ background: `radial-gradient(circle at 50% 35%, ${visual.glow}, transparent 58%), #0A0D11` }}>
            <div className="w-11 h-11 rounded-2xl border border-white/[0.08] bg-white/[0.035] flex items-center justify-center">
              <ImageOff className="w-5 h-5" style={{ color: visual.accent }} />
            </div>
            <span className="cl-label text-white/55">Imagem indisponível</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-transparent to-[#0F141A]/96 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[46%] opacity-65 group-hover:opacity-90 transition-opacity pointer-events-none" style={{ background: `linear-gradient(to top, ${visual.glow}, transparent)` }} />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.035] pointer-events-none" />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full cl-label bg-black/55 text-white backdrop-blur-md border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: visual.accent }} />
            {workout.categoryLabel}
          </span>
          <span className="cl-label text-white/78 pt-1 drop-shadow-sm">{workout.level}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center gap-4 cl-copy-small text-[#A2ABB5] mb-3">
          <span className="flex items-center gap-1.5 font-mono-num"><Clock className="w-3.5 h-3.5 text-[#FF6B1A]" />{workout.estimatedMinutes} min</span>
          <span className="flex items-center gap-1.5"><Dumbbell className="w-3.5 h-3.5 text-[#FF6B1A]" />{workout.exercises.length} exercícios</span>
          <span className="flex items-center gap-1.5 ml-auto text-[#FF9B62] font-mono-num"><Award className="w-3.5 h-3.5" />+{workout.xpReward} XP</span>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="cl-label" style={{ color: visual.accent }}>{visual.label}</span>
          </div>
          <h3 className="cl-card-title text-white group-hover:text-[#F4F6F8] transition-colors">
            {workout.title}
          </h3>
          <p className="cl-copy-small line-clamp-2 mt-2">
            {workout.description}
          </p>

          {workout.tags.length > 0 && (
            <p className="mt-4 cl-label text-[#697481] line-clamp-1">
              {workout.tags.slice(0, 3).join(' · ')}
            </p>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
          <span className="cl-label text-[#717B86]">Sessão pronta</span>
          <button
            onClick={() => onStart(workout)}
            className="min-h-10 px-4 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] active:scale-[0.98] text-white cl-button-text transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
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
