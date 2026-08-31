import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Dumbbell, Flame, Layers, ArrowRight, Target } from 'lucide-react';
import { EXERCISES_DATA } from '../../data/exercises';
import { WORKOUTS_DATA } from '../../data/workouts';
import { PROGRAMS_DATA } from '../../data/programs';
import { FUNDAMENTALS_DATA } from '../../data/fundamentals';
import { Exercise, Workout, Program } from '../../types';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onSelectWorkout: (workout: Workout) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  onSelectWorkout
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Search filtered results
  const filteredExercises = normalizedQuery
    ? EXERCISES_DATA.filter(
        (e) =>
          e.name.toLowerCase().includes(normalizedQuery) ||
          e.categoryLabel.toLowerCase().includes(normalizedQuery) ||
          e.subcategory.toLowerCase().includes(normalizedQuery) ||
          e.description.toLowerCase().includes(normalizedQuery) ||
          e.gameTransfer.skill.toLowerCase().includes(normalizedQuery)
      ).slice(0, 5)
    : [];

  const filteredWorkouts = normalizedQuery
    ? WORKOUTS_DATA.filter(
        (w) =>
          w.title.toLowerCase().includes(normalizedQuery) ||
          w.description.toLowerCase().includes(normalizedQuery) ||
          w.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
      ).slice(0, 3)
    : [];

  const filteredPrograms = normalizedQuery
    ? PROGRAMS_DATA.filter(
        (p) =>
          p.title.toLowerCase().includes(normalizedQuery) ||
          p.subtitle.toLowerCase().includes(normalizedQuery) ||
          p.description.toLowerCase().includes(normalizedQuery)
      ).slice(0, 2)
    : [];

  const filteredFundamentals = normalizedQuery
    ? FUNDAMENTALS_DATA.filter(
        (f) =>
          f.name.toLowerCase().includes(normalizedQuery) ||
          f.subcategories.some((sub) => sub.name.toLowerCase().includes(normalizedQuery))
      ).slice(0, 3)
    : [];

  const totalResults =
    filteredExercises.length +
    filteredWorkouts.length +
    filteredPrograms.length +
    filteredFundamentals.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-[#0D1014] border border-[#1F2630] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1F2630] bg-[#11151A]">
          <Search className="w-5 h-5 text-[#FF6B1A] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar exercício, fundamento ou movimento (ex: Crossover, Floater, PnR)..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-[#9AA1AA] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#9AA1AA] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-[#1F2630] text-[10px] uppercase font-mono-num text-[#9AA1AA] hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="overflow-y-auto p-4 space-y-5 flex-1">
          {!normalizedQuery && (
            <div className="py-8 text-center">
              <span className="text-xs uppercase font-mono-num text-[#9AA1AA] block mb-3">Sugestões rápidas</span>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                {['Crossover', 'Floater', 'Pick and Roll', 'Step Back', 'Weak Hand', 'Catch & Shoot', 'Euro Step'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-xl bg-[#15191F] hover:bg-[#191E24] border border-[#1F2630] text-xs font-semibold text-white/90 hover:border-[#FF6B1A]/50 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {normalizedQuery && totalResults === 0 && (
            <div className="py-12 text-center text-[#9AA1AA]">
              <p className="text-sm">Nenhum resultado encontrado para "{query}".</p>
              <p className="text-xs mt-1">Tente buscar por termos como Crossover, Arremesso, Floater ou PnR.</p>
            </div>
          )}

          {/* Exercises Category */}
          {filteredExercises.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B1A] mb-2 px-1">
                <Target className="w-3.5 h-3.5" />
                Exercícios ({filteredExercises.length})
              </div>
              <div className="space-y-1.5">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    onClick={() => {
                      onClose();
                      onSelectExercise(exercise);
                    }}
                    className="p-3 rounded-xl bg-[#15191F] hover:bg-[#191E24] border border-[#1F2630] hover:border-[#FF6B1A]/50 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-[#FF6B1A] transition-colors">
                          {exercise.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1F2630] text-[#9AA1AA]">
                          {exercise.categoryLabel}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#9AA1AA] line-clamp-1 mt-0.5">
                        {exercise.subcategory} — {exercise.description}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9AA1AA] group-hover:text-[#FF6B1A] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workouts Category */}
          {filteredWorkouts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF8D4D] mb-2 px-1">
                <Flame className="w-3.5 h-3.5" />
                Treinos ({filteredWorkouts.length})
              </div>
              <div className="space-y-1.5">
                {filteredWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    onClick={() => {
                      onClose();
                      onSelectWorkout(workout);
                    }}
                    className="p-3 rounded-xl bg-[#15191F] hover:bg-[#191E24] border border-[#1F2630] hover:border-[#FF6B1A]/50 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-[#FF6B1A] transition-colors">
                          {workout.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF6B1A]/20 text-[#FF8D4D]">
                          {workout.estimatedMinutes} min
                        </span>
                      </div>
                      <span className="text-[11px] text-[#9AA1AA] line-clamp-1 mt-0.5">
                        {workout.description}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#FF6B1A] flex items-center gap-1">
                      Treinar
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Programs Category */}
          {filteredPrograms.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 px-1">
                <Layers className="w-3.5 h-3.5" />
                Programas ({filteredPrograms.length})
              </div>
              <div className="space-y-1.5">
                {filteredPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    onClick={() => {
                      onClose();
                      navigate(`/programas/${prog.slug}`);
                    }}
                    className="p-3 rounded-xl bg-[#15191F] hover:bg-[#191E24] border border-[#1F2630] hover:border-emerald-500/50 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {prog.title}
                      </span>
                      <span className="text-[11px] text-[#9AA1AA] block mt-0.5">
                        {prog.subtitle} ({prog.durationWeeks} semanas)
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9AA1AA] group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
