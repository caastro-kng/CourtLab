import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Flame,
  Award,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Play,
  ShieldCheck,
  Target,
  Route,
  Clock3,
  Dumbbell,
  Trophy
} from 'lucide-react';
import { PROGRAMS_DATA } from '../data/programs';
import { usePlayer } from '../context/PlayerContext';

export const ProgramDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { startWorkout, getWorkoutById, workoutLogs } = usePlayer();

  const program = PROGRAMS_DATA.find((p) => p.slug === slug) || PROGRAMS_DATA[0];
  const completedWorkoutIds = useMemo(() => new Set(workoutLogs.map((log) => log.workoutId)), [workoutLogs]);

  const weekProgress = useMemo(() => {
    return program.weeks.map((week) => {
      const sessions = week.days.filter((day) => day.workoutId && !day.isRest);
      const completed = sessions.filter((day) => day.workoutId && completedWorkoutIds.has(day.workoutId)).length;
      const total = sessions.length;
      const percentage = total ? Math.round((completed / total) * 100) : 0;
      return { weekNumber: week.weekNumber, completed, total, percentage, done: total > 0 && completed === total };
    });
  }, [program, completedWorkoutIds]);

  const firstIncompleteWeek = weekProgress.find((week) => !week.done)?.weekNumber || program.weeks.length;
  const [expandedWeek, setExpandedWeek] = useState<number>(firstIncompleteWeek);

  const allSessions = program.weeks.flatMap((week) => week.days.filter((day) => day.workoutId && !day.isRest));
  const completedSessions = allSessions.filter((day) => day.workoutId && completedWorkoutIds.has(day.workoutId)).length;
  const totalProgress = allSessions.length ? Math.round((completedSessions / allSessions.length) * 100) : 0;
  const isProgramComplete = totalProgress === 100;

  const currentWeekNumber = weekProgress.find((week) => !week.done)?.weekNumber || program.weeks.length;
  const currentWeek = program.weeks.find((week) => week.weekNumber === currentWeekNumber) || program.weeks[0];
  const nextSession = currentWeek.days.find((day) => day.workoutId && !day.isRest && !completedWorkoutIds.has(day.workoutId));
  const nextWorkout = nextSession?.workoutId ? getWorkoutById(nextSession.workoutId) : undefined;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <Link
        to="/programas"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9AA1AA] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Programas
      </Link>

      <section className="relative rounded-3xl overflow-hidden bg-[#0D1014] border border-[#1F2630] p-5 sm:p-7">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B1A]/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF6B1A] text-white">{program.categoryLabel}</span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase bg-[#15191F] text-white border border-[#1F2630]">{program.level}</span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-num font-bold text-[#FF8D4D] bg-[#15191F] border border-[#1F2630]">+{program.xpTotal} XP</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_.8fr] gap-6 items-end">
            <div>
              <h1 className="text-3xl sm:text-5xl font-heading text-white tracking-tight leading-none">{program.title}</h1>
              <p className="text-sm sm:text-base font-semibold text-[#FF8D4D] mt-2">{program.subtitle}</p>
              <p className="text-xs sm:text-sm text-[#9AA1AA] mt-3 max-w-3xl leading-relaxed">{program.description}</p>

              <div className="flex flex-wrap gap-4 mt-5 text-xs text-white/90">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#FF6B1A]" />{program.durationWeeks} semanas</span>
                <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-[#FF6B1A]" />{program.workoutsPerWeek} treinos / semana</span>
                <span className="flex items-center gap-1.5"><Route className="w-4 h-4 text-[#FF6B1A]" />Drill → Skill → Game</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA]">Progresso do programa</span>
                <span className={isProgramComplete ? 'text-emerald-400 text-2xl font-mono-num font-bold' : 'text-white text-2xl font-mono-num font-bold'}>{totalProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#080A0D] overflow-hidden">
                <div className="h-full bg-[#FF6B1A] rounded-full transition-all" style={{ width: `${totalProgress}%` }} />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-[#9AA1AA]">{completedSessions} de {allSessions.length} sessões</span>
                <span className="text-[#FF8D4D] font-semibold">Semana {currentWeekNumber}</span>
              </div>
            </div>
          </div>

          {program.prerequisites && program.prerequisites.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#11151A] border border-[#1F2630]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9AA1AA] flex items-center gap-1.5 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Pré-requisitos recomendados
              </span>
              <div className="flex flex-wrap gap-3">
                {program.prerequisites.map((req, idx) => (
                  <span key={idx} className="text-xs text-white/90 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />{req}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {!isProgramComplete && nextWorkout && (
        <section className="rounded-3xl border border-[#FF6B1A]/35 bg-[#0D1014] p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF6B1A]">Próxima sessão</span>
              <h2 className="text-2xl font-heading text-white mt-1">{nextWorkout.title}</h2>
              <p className="text-xs text-[#9AA1AA] mt-1">Semana {currentWeekNumber} • {nextWorkout.estimatedMinutes} min • {nextWorkout.exercises.length} exercícios</p>
            </div>
            <button
              type="button"
              onClick={() => startWorkout(nextWorkout)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Play className="w-4 h-4 fill-current" /> Iniciar próxima sessão
            </button>
          </div>
        </section>
      )}

      {isProgramComplete && (
        <section className="rounded-3xl border border-emerald-800/50 bg-[#0D1511] p-5 sm:p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"><Trophy className="w-6 h-6 text-emerald-400" /></div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Programa concluído</span>
            <h2 className="text-xl font-heading text-white">Trilha finalizada</h2>
            <p className="text-xs text-[#9AA1AA] mt-1">Todas as sessões registradas. Agora o foco é manter a skill sob pressão de jogo.</p>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA]">Mapa de evolução</span>
          <h2 className="text-2xl font-heading text-white mt-1">Semana a semana</h2>
          <p className="text-xs text-[#9AA1AA] mt-1">As semanas seguintes ficam disponíveis conforme você conclui a etapa anterior.</p>
        </div>

        <div className="space-y-3">
          {program.weeks.map((week) => {
            const progress = weekProgress.find((item) => item.weekNumber === week.weekNumber)!;
            const previousWeek = weekProgress.find((item) => item.weekNumber === week.weekNumber - 1);
            const isUnlocked = week.weekNumber === 1 || Boolean(previousWeek?.done) || week.weekNumber <= currentWeekNumber;
            const isExpanded = expandedWeek === week.weekNumber;

            return (
              <div key={week.weekNumber} className={`rounded-3xl border overflow-hidden transition-colors ${isUnlocked ? 'bg-[#0D1014] border-[#1F2630]' : 'bg-[#0A0C0F] border-[#15191F] opacity-65'}`}>
                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => isUnlocked && setExpandedWeek(isExpanded ? 0 : week.weekNumber)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className={`w-9 h-9 rounded-xl font-mono-num font-bold text-sm flex items-center justify-center border flex-shrink-0 ${progress.done ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : isUnlocked ? 'bg-[#FF6B1A]/15 text-[#FF6B1A] border-[#FF6B1A]/30' : 'bg-[#15191F] text-[#6E7681] border-[#1F2630]'}`}>
                      {progress.done ? <CheckCircle2 className="w-4 h-4" /> : isUnlocked ? `S${week.weekNumber}` : <Lock className="w-4 h-4" />}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-xl font-heading text-white truncate">{week.title}</h3>
                        {week.weekNumber === currentWeekNumber && !progress.done && <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-[#FF6B1A] text-white">Atual</span>}
                      </div>
                      <p className="text-xs text-[#9AA1AA] mt-0.5">Foco: <span className="text-white/90">{week.focus}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-3">
                    {isUnlocked && (
                      <div className="hidden sm:block text-right">
                        <span className="text-xs font-mono-num font-bold text-white">{progress.completed}/{progress.total}</span>
                        <div className="w-20 h-1 mt-1 rounded-full bg-[#15191F] overflow-hidden"><div className="h-full bg-[#FF6B1A]" style={{ width: `${progress.percentage}%` }} /></div>
                      </div>
                    )}
                    {isUnlocked && (isExpanded ? <ChevronUp className="w-5 h-5 text-[#9AA1AA]" /> : <ChevronDown className="w-5 h-5 text-[#9AA1AA]" />)}
                  </div>
                </button>

                {isExpanded && isUnlocked && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-[#1F2630]/70">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                      {week.days.map((day, idx) => {
                        const workoutObj = day.workoutId ? getWorkoutById(day.workoutId) : undefined;
                        const completed = Boolean(day.workoutId && completedWorkoutIds.has(day.workoutId));

                        return (
                          <div key={idx} className={`p-4 rounded-2xl border ${day.isRest ? 'bg-[#101318] border-[#1F2630]' : completed ? 'bg-emerald-950/15 border-emerald-900/30' : 'bg-[#15191F] border-[#1F2630]'}`}>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[10px] uppercase font-mono-num font-bold text-[#9AA1AA]">Dia {day.dayOfWeek}</span>
                              {day.isRest ? (
                                <span className="text-[10px] uppercase font-bold text-amber-400">Recuperação</span>
                              ) : completed ? (
                                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Concluído</span>
                              ) : (
                                <span className="text-[10px] uppercase font-bold text-[#FF8D4D]">Pendente</span>
                              )}
                            </div>

                            <h4 className="text-base font-heading text-white mt-3">{day.title}</h4>
                            <p className="text-xs text-[#9AA1AA] mt-1">Foco: <strong className="text-white/90">{day.focus}</strong></p>

                            {day.isRest && <p className="text-xs text-[#9AA1AA] mt-3">Dia planejado para recuperação e assimilação do estímulo.</p>}

                            {!day.isRest && workoutObj && (
                              <div className="mt-4 pt-3 border-t border-[#1F2630] flex items-center justify-between gap-3">
                                <div className="text-[11px] text-[#9AA1AA] flex flex-wrap gap-3">
                                  <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" />{workoutObj.estimatedMinutes} min</span>
                                  <span className="flex items-center gap-1"><Dumbbell className="w-3.5 h-3.5" />{workoutObj.exercises.length} drills</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => startWorkout(workoutObj)}
                                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${completed ? 'bg-[#1F2630] text-white hover:bg-[#2B3542]' : 'bg-[#FF6B1A] text-white hover:bg-[#FF7A2E]'}`}
                                >
                                  <Play className="w-3 h-3 fill-current" />{completed ? 'Refazer' : 'Treinar'}
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
      </section>

      <section className="rounded-3xl bg-[#0D1014] border border-[#1F2630] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-heading text-white">Como usar esta trilha</h3>
            <p className="text-xs text-[#9AA1AA] mt-1 leading-relaxed">Siga a ordem das semanas, registre as sessões e evite avançar só porque um drill ficou confortável. O objetivo do programa é levar a habilidade de execução controlada para decisão e pressão de jogo.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
