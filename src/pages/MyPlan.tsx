import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  Flame,
  CheckCircle2,
  Clock,
  Dumbbell,
  Play,
  RotateCcw,
  Plus,
  ChevronRight,
  Coffee,
  Trophy,
  HeartPulse,
  CircleDot,
  Copy,
  X,
  Pencil,
  Zap,
  Activity
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { WORKOUTS_DATA } from '../data/workouts';
import { Workout } from '../types';

type SessionPreset = 'workout' | 'pickup' | 'game' | 'gym' | 'rest';

const getTodayPlanDay = () => {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 7 : jsDay;
};

const inferSessionType = (title: string, isRest: boolean): SessionPreset => {
  const normalized = title.toLowerCase();
  if (isRest) return 'rest';
  if (normalized.includes('rach') || normalized.includes('pickup')) return 'pickup';
  if (normalized.includes('jogo') || normalized.includes('game')) return 'game';
  if (normalized.includes('academia') || normalized.includes('muscula')) return 'gym';
  return 'workout';
};

const sessionMeta: Record<SessionPreset, { label: string; detail: string; icon: React.ElementType }> = {
  workout: { label: 'Treino técnico', detail: 'Sessão individual de quadra', icon: Flame },
  pickup: { label: 'Rachão', detail: 'Aplicação em jogo e leitura', icon: CircleDot },
  game: { label: 'Jogo', detail: 'Competição / Game Day', icon: Trophy },
  gym: { label: 'Academia', detail: 'Força, potência e prevenção', icon: Dumbbell },
  rest: { label: 'Recuperação', detail: 'Descanso e mobilidade', icon: Coffee }
};

export const MyPlan: React.FC = () => {
  const {
    weeklyPlan,
    updateDayPlan,
    startWorkout,
    getWorkoutById,
    getExerciseById,
    workoutLogs
  } = usePlayer();

  const today = getTodayPlanDay();
  const [selectedDay, setSelectedDay] = useState<number>(today);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const currentDayData = weeklyPlan.find((d) => d.dayOfWeek === selectedDay) || weeklyPlan[0];
  const workoutForSelectedDay: Workout | undefined = currentDayData.workoutId
    ? getWorkoutById(currentDayData.workoutId)
    : undefined;

  const selectedSessionType = inferSessionType(currentDayData.customTitle, currentDayData.isRest);
  const selectedSessionMeta = sessionMeta[selectedSessionType];

  const summary = useMemo(() => {
    const completed = weeklyPlan.filter((day) => day.completed && !day.isRest).length;
    const planned = weeklyPlan.filter((day) => !day.isRest).length;
    const rest = weeklyPlan.filter((day) => day.isRest).length;
    const estimatedMinutes = weeklyPlan.reduce((sum, day) => {
      if (!day.workoutId) return sum;
      return sum + (getWorkoutById(day.workoutId)?.estimatedMinutes || 0);
    }, 0);
    return { completed, planned, rest, estimatedMinutes };
  }, [weeklyPlan, getWorkoutById]);

  const handleToggleComplete = () => {
    updateDayPlan(selectedDay, {
      completed: !currentDayData.completed,
      completedAt: !currentDayData.completed ? new Date().toISOString() : undefined
    });
  };

  const handleSwapWorkout = (workout: Workout) => {
    updateDayPlan(selectedDay, {
      workoutId: workout.id,
      customTitle: workout.title,
      isRest: false,
      completed: false,
      completedAt: undefined
    });
    setIsEditOpen(false);
  };

  const setPreset = (type: SessionPreset) => {
    const labels: Record<SessionPreset, string> = {
      workout: 'Treino Técnico Individual',
      pickup: 'Rachão / Pickup Game',
      game: 'Game Day',
      gym: 'Academia — Força e Potência',
      rest: 'Descanso e Recuperação'
    };

    updateDayPlan(selectedDay, {
      workoutId: type === 'workout' ? currentDayData.workoutId : undefined,
      customTitle: labels[type],
      isRest: type === 'rest',
      completed: false,
      completedAt: undefined
    });
    setIsEditOpen(false);
  };

  const duplicateSelectedDayToNext = () => {
    const nextDay = selectedDay === 7 ? 1 : selectedDay + 1;
    updateDayPlan(nextDay, {
      workoutId: currentDayData.workoutId,
      customTitle: currentDayData.customTitle,
      isRest: currentDayData.isRest,
      completed: false,
      completedAt: undefined
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-7 animate-in fade-in duration-300">
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.18em] text-[#FF6B1A] mb-2">
            <CalendarDays className="w-4 h-4" />
            Semana de desenvolvimento
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-white leading-none tracking-tight">
            MEU PLANO
          </h1>
          <p className="text-sm text-[#9AA1AA] mt-2 max-w-2xl">
            Organize treino técnico, rachão, jogo, academia e recuperação em uma única rotina semanal.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full xl:w-auto">
          <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] px-4 py-3">
            <span className="text-[10px] uppercase font-bold text-[#707985] block">Planejados</span>
            <strong className="text-xl text-white font-mono-num">{summary.planned}</strong>
          </div>
          <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] px-4 py-3">
            <span className="text-[10px] uppercase font-bold text-[#707985] block">Concluídos</span>
            <strong className="text-xl text-emerald-400 font-mono-num">{summary.completed}</strong>
          </div>
          <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] px-4 py-3">
            <span className="text-[10px] uppercase font-bold text-[#707985] block">Recuperação</span>
            <strong className="text-xl text-white font-mono-num">{summary.rest}</strong>
          </div>
          <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] px-4 py-3">
            <span className="text-[10px] uppercase font-bold text-[#707985] block">Volume</span>
            <strong className="text-xl text-white font-mono-num">{summary.estimatedMinutes}m</strong>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#1F2630] bg-[#0D1014] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#707985]">Sua semana</span>
            <h2 className="text-xl font-heading text-white">Agenda de atleta</h2>
          </div>
          <span className="hidden sm:inline text-xs text-[#707985]">Selecione um dia para editar ou iniciar</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
          {weeklyPlan.map((day) => {
            const isSelected = day.dayOfWeek === selectedDay;
            const isToday = day.dayOfWeek === today;
            const type = inferSessionType(day.customTitle, day.isRest);
            const meta = sessionMeta[type];
            const Icon = meta.icon;
            const workout = day.workoutId ? getWorkoutById(day.workoutId) : undefined;

            return (
              <button
                key={day.dayOfWeek}
                onClick={() => setSelectedDay(day.dayOfWeek)}
                className={`text-left rounded-2xl border p-3.5 min-h-40 transition-all ${
                  isSelected
                    ? 'bg-[#FF6B1A]/10 border-[#FF6B1A] shadow-lg shadow-[#FF6B1A]/10'
                    : 'bg-[#11151A] border-[#1F2630] hover:border-[#343E4B] hover:bg-[#15191F]'
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-black tracking-wider text-white">{day.dayName}</span>
                  {isToday ? (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF6B1A] text-white">Hoje</span>
                  ) : day.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : null}
                </div>

                <div className="w-9 h-9 rounded-xl bg-[#0D1014] border border-[#1F2630] flex items-center justify-center mb-3">
                  <Icon className={`w-4.5 h-4.5 ${type === 'rest' ? 'text-amber-400' : 'text-[#FF6B1A]'}`} />
                </div>

                <div className="min-h-11">
                  <span className="text-xs font-bold text-white line-clamp-2">{day.customTitle}</span>
                  <span className="text-[10px] text-[#707985] mt-1 block">{meta.label}</span>
                </div>

                <div className="pt-3 mt-3 border-t border-[#1F2630] text-[10px] text-[#9AA1AA] flex items-center justify-between">
                  <span>{workout ? `${workout.estimatedMinutes} min` : type === 'rest' ? 'OFF' : 'Sessão livre'}</span>
                  <span className={day.completed ? 'text-emerald-400' : isSelected ? 'text-[#FF8D4D]' : ''}>
                    {day.completed ? 'Feito' : 'Planejado'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="rounded-3xl border border-[#1F2630] bg-[#0D1014] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#1F2630] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FF6B1A]">{currentDayData.dayName}</span>
                {currentDayData.dayOfWeek === today && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-black bg-[#FF6B1A]/15 text-[#FF8D4D] border border-[#FF6B1A]/20">Hoje</span>
                )}
                {currentDayData.completed && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Concluído</span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading text-white">{currentDayData.customTitle}</h2>
              <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1">{selectedSessionMeta.detail}</p>
            </div>

            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#15191F] hover:bg-[#1B2129] border border-[#2B3542] text-xs font-bold text-white flex items-center justify-center gap-2"
            >
              <Pencil className="w-4 h-4 text-[#FF6B1A]" />
              Editar sessão
            </button>
          </div>

          {workoutForSelectedDay ? (
            <div className="p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] p-4">
                  <Clock className="w-4 h-4 text-[#FF6B1A] mb-2" />
                  <span className="text-[10px] uppercase font-bold text-[#707985] block">Duração</span>
                  <strong className="text-lg text-white font-mono-num">{workoutForSelectedDay.estimatedMinutes} min</strong>
                </div>
                <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] p-4">
                  <Activity className="w-4 h-4 text-[#FF6B1A] mb-2" />
                  <span className="text-[10px] uppercase font-bold text-[#707985] block">Exercícios</span>
                  <strong className="text-lg text-white font-mono-num">{workoutForSelectedDay.exercises.length}</strong>
                </div>
                <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] p-4">
                  <Zap className="w-4 h-4 text-[#FF6B1A] mb-2" />
                  <span className="text-[10px] uppercase font-bold text-[#707985] block">XP</span>
                  <strong className="text-lg text-[#FF8D4D] font-mono-num">+{workoutForSelectedDay.xpReward}</strong>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs uppercase tracking-wider font-black text-[#9AA1AA]">Sequência do treino</h3>
                  <span className="text-[10px] text-[#707985]">DRILL → SKILL → GAME</span>
                </div>

                <div className="space-y-2">
                  {workoutForSelectedDay.exercises.map((item, idx) => {
                    const exercise = getExerciseById(item.exerciseId);
                    return (
                      <div key={`${item.exerciseId}-${idx}`} className="rounded-2xl bg-[#11151A] border border-[#1F2630] p-3.5 flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 flex items-center justify-center text-[11px] font-black shrink-0">{idx + 1}</span>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-white truncate">{exercise?.name || item.exerciseId}</h4>
                          <p className="text-[11px] text-[#707985] mt-0.5">
                            {item.customSets || 3} séries • {item.customReps || '15 reps'} • {item.restSeconds || 30}s descanso
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={() => startWorkout(workoutForSelectedDay)}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-heading uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B1A]/20"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Iniciar treino
                </button>
                <button
                  onClick={handleToggleComplete}
                  className={`px-5 py-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 ${
                    currentDayData.completed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-[#15191F] border-[#2B3542] text-white hover:bg-[#1B2129]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {currentDayData.completed ? 'Concluído' : 'Marcar como feito'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6">
              <div className="rounded-3xl bg-[#11151A] border border-[#1F2630] p-6 sm:p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#15191F] border border-[#1F2630] flex items-center justify-center mx-auto mb-4">
                  {React.createElement(selectedSessionMeta.icon, { className: `w-6 h-6 ${selectedSessionType === 'rest' ? 'text-amber-400' : 'text-[#FF6B1A]'}` })}
                </div>
                <h3 className="text-xl font-heading text-white">{selectedSessionMeta.label}</h3>
                <p className="text-sm text-[#9AA1AA] mt-2 max-w-lg mx-auto">
                  {selectedSessionType === 'rest'
                    ? 'Use o dia para recuperar. Mobilidade leve, sono e hidratação entram no plano tanto quanto os treinos.'
                    : 'Essa sessão fica registrada no seu plano como aplicação ou desenvolvimento físico. Você pode trocar por um treino técnico a qualquer momento.'}
                </p>
                <button onClick={handleToggleComplete} className="mt-5 px-5 py-3 rounded-xl bg-[#15191F] border border-[#2B3542] text-xs font-bold text-white inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {currentDayData.completed ? 'Sessão concluída' : 'Marcar como concluída'}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-[#1F2630] bg-[#0D1014] p-5">
            <span className="text-[10px] uppercase font-black tracking-wider text-[#707985]">Ações rápidas</span>
            <div className="mt-3 space-y-2">
              <button onClick={() => setIsEditOpen(true)} className="w-full p-3 rounded-xl bg-[#11151A] border border-[#1F2630] hover:border-[#343E4B] text-sm text-white flex items-center justify-between">
                <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4 text-[#FF6B1A]" /> Trocar sessão</span>
                <ChevronRight className="w-4 h-4 text-[#707985]" />
              </button>
              <button onClick={duplicateSelectedDayToNext} className="w-full p-3 rounded-xl bg-[#11151A] border border-[#1F2630] hover:border-[#343E4B] text-sm text-white flex items-center justify-between">
                <span className="flex items-center gap-2"><Copy className="w-4 h-4 text-[#FF6B1A]" /> Duplicar no próximo dia</span>
                <ChevronRight className="w-4 h-4 text-[#707985]" />
              </button>
              <button onClick={() => setPreset('rest')} className="w-full p-3 rounded-xl bg-[#11151A] border border-[#1F2630] hover:border-amber-500/30 text-sm text-white flex items-center justify-between">
                <span className="flex items-center gap-2"><Coffee className="w-4 h-4 text-amber-400" /> Marcar descanso</span>
                <ChevronRight className="w-4 h-4 text-[#707985]" />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#1F2630] bg-[#0D1014] p-5">
            <span className="text-[10px] uppercase font-black tracking-wider text-[#707985]">Última atividade</span>
            <div className="mt-3 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 flex items-center justify-center shrink-0">
                <HeartPulse className="w-4 h-4 text-[#FF6B1A]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{workoutLogs[0]?.workoutTitle || 'Nenhum treino registrado'}</p>
                {workoutLogs[0] && <p className="text-[11px] text-[#707985] mt-1">{workoutLogs[0].durationMinutes} min • {workoutLogs[0].exercisesCompleted} exercícios</p>}
              </div>
            </div>
          </div>
        </aside>
      </section>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-end sm:items-center justify-center animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl bg-[#0D1014] border border-[#1F2630] shadow-2xl">
            <div className="sticky top-0 z-10 bg-[#0D1014]/95 backdrop-blur border-b border-[#1F2630] p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-[#FF6B1A]">{currentDayData.dayName}</span>
                <h3 className="text-xl font-heading text-white">Editar sessão</h3>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="w-9 h-9 rounded-xl bg-[#15191F] border border-[#1F2630] text-[#9AA1AA] hover:text-white flex items-center justify-center" aria-label="Fechar edição">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-[#707985]">Tipo de sessão</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
                  {(['pickup', 'game', 'gym', 'rest'] as SessionPreset[]).map((type) => {
                    const meta = sessionMeta[type];
                    const Icon = meta.icon;
                    return (
                      <button key={type} onClick={() => setPreset(type)} className="p-3 rounded-2xl bg-[#11151A] hover:bg-[#15191F] border border-[#1F2630] hover:border-[#FF6B1A]/30 text-left">
                        <Icon className={`w-4 h-4 mb-2 ${type === 'rest' ? 'text-amber-400' : 'text-[#FF6B1A]'}`} />
                        <span className="text-xs font-bold text-white block">{meta.label}</span>
                      </button>
                    );
                  })}
                  <button onClick={() => currentDayData.workoutId ? setPreset('workout') : undefined} className="p-3 rounded-2xl bg-[#11151A] hover:bg-[#15191F] border border-[#1F2630] hover:border-[#FF6B1A]/30 text-left">
                    <Flame className="w-4 h-4 mb-2 text-[#FF6B1A]" />
                    <span className="text-xs font-bold text-white block">Treino técnico</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#707985]">Escolher treino técnico</span>
                  <span className="text-[10px] text-[#707985]">{WORKOUTS_DATA.length} disponíveis</span>
                </div>
                <div className="space-y-2 mt-3">
                  {WORKOUTS_DATA.map((workout) => (
                    <button key={workout.id} onClick={() => handleSwapWorkout(workout)} className="w-full rounded-2xl bg-[#11151A] hover:bg-[#15191F] border border-[#1F2630] hover:border-[#FF6B1A]/35 p-3.5 flex items-center justify-between gap-3 text-left group">
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-white group-hover:text-[#FF8D4D] transition-colors block truncate">{workout.title}</span>
                        <span className="text-[11px] text-[#707985]">{workout.estimatedMinutes} min • {workout.exercises.length} exercícios • {workout.level}</span>
                      </div>
                      <Plus className="w-4 h-4 text-[#FF6B1A] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
