import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Flame,
  Award,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Play,
  ShieldCheck,
  Target
} from 'lucide-react';
import { PROGRAMS_DATA } from '../data/programs';
import { WORKOUTS_DATA } from '../data/workouts';
import { usePlayer } from '../context/PlayerContext';

export const ProgramDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { startWorkout, getWorkoutById } = usePlayer();

  const program = PROGRAMS_DATA.find((p) => p.slug === slug) || PROGRAMS_DATA[0];
  const [expandedWeek, setExpandedWeek] = useState<number>(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Back Button */}
      <Link
        to="/programas"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9AA1AA] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Programas
      </Link>

      {/* Program Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#191E24] via-[#12161C] to-[#0D1014] border border-[#1F2630] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF6B1A] text-white">
            {program.categoryLabel}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase bg-black/60 text-white border border-white/10">
            Nível {program.level}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono-num font-bold text-[#FF8D4D] bg-[#FF6B1A]/10 border border-[#FF6B1A]/30">
            +{program.xpTotal} XP Total
          </span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-5xl font-heading text-white tracking-tight leading-none">
            {program.title}
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#FF8D4D] mt-1">
            {program.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-[#9AA1AA] mt-3 max-w-3xl leading-relaxed">
            {program.description}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Duração</span>
            <span className="text-lg sm:text-xl font-heading text-white">{program.durationWeeks} Semanas</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Frequência</span>
            <span className="text-lg sm:text-xl font-heading text-white">{program.workoutsPerWeek}x por semana</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Foco Pedagógico</span>
            <span className="text-xs sm:text-sm font-semibold text-emerald-400 mt-1 block">Drill ➔ Skill ➔ Game</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Status Atual</span>
            <span className="text-xs sm:text-sm font-semibold text-[#FF6B1A] mt-1 block">Semana 1 Ativa</span>
          </div>
        </div>

        {/* Prerequisites */}
        {program.prerequisites && program.prerequisites.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#15191F] border border-[#1F2630] space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9AA1AA] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Pré-requisitos Recomendados
            </span>
            <div className="flex flex-wrap gap-3">
              {program.prerequisites.map((req, idx) => (
                <span key={idx} className="text-xs text-white/90 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Week-by-Week Curriculum */}
      <div className="space-y-4">
        <h2 className="text-2xl font-heading text-white">
          Currículo & Cronograma Semana a Semana
        </h2>

        <div className="space-y-3">
          {program.weeks.map((week) => {
            const isExpanded = expandedWeek === week.weekNumber;

            return (
              <div
                key={week.weekNumber}
                className="rounded-3xl bg-[#0D1014] border border-[#1F2630] overflow-hidden transition-colors"
              >
                <div
                  onClick={() => setExpandedWeek(isExpanded ? 0 : week.weekNumber)}
                  className="p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-[#11151A] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-xl bg-[#FF6B1A]/20 text-[#FF6B1A] font-mono-num font-bold text-sm flex items-center justify-center border border-[#FF6B1A]/30">
                      S{week.weekNumber}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-heading text-white">
                        {week.title}: <span className="text-[#FF8D4D]">{week.focus}</span>
                      </h3>
                      <span className="text-xs text-[#9AA1AA]">
                        {week.days.length} sessões programadas
                      </span>
                    </div>
                  </div>

                  <div className="p-2 text-[#9AA1AA]">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Day Drills Breakdown */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-[#1F2630]/60 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                      {week.days.map((day, idx) => {
                        const workoutObj = day.workoutId ? getWorkoutById(day.workoutId) : undefined;

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                              day.isRest
                                ? 'bg-[#11151A] border-[#1F2630] opacity-70'
                                : 'bg-[#15191F] border-[#1F2630]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono-num font-bold uppercase px-2 py-0.5 rounded bg-[#0D1014] text-[#9AA1AA]">
                                Dia {day.dayOfWeek}
                              </span>
                              {day.isRest ? (
                                <span className="text-[10px] uppercase font-bold text-amber-400">Descanso</span>
                              ) : (
                                <span className="text-[10px] uppercase font-bold text-emerald-400">Treino de Quadra</span>
                              )}
                            </div>

                            <div>
                              <h4 className="text-base font-heading text-white">{day.title}</h4>
                              <p className="text-xs text-[#9AA1AA] mt-0.5">
                                Foco: <strong className="text-white/90">{day.focus}</strong>
                              </p>
                            </div>

                            {!day.isRest && workoutObj && (
                              <div className="pt-2 border-t border-[#1F2630] flex items-center justify-between">
                                <span className="text-xs text-[#9AA1AA]">
                                  {workoutObj.estimatedMinutes} min • {workoutObj.exercises.length} drills
                                </span>
                                <button
                                  onClick={() => startWorkout(workoutObj)}
                                  className="px-3 py-1.5 rounded-lg bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#FF6B1A]/20"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  Treinar
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
