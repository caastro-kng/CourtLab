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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-9 animate-in fade-in duration-300">
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.18em] text-[#FF6B1A] mb-2">
            <CalendarDays className="w-4 h-4" />
            Semana de desenvolvimento
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-white leading-none tracking-tight">MEU PLANO</h1>
          <p className="text-sm text-[#9AA1AA] mt-2 max-w-2xl">Sua rotina semanal em um formato mais direto: o que fazer, quando fazer e o que já foi concluído.</p>
        </div>

        <div className="grid grid-cols-4 gap-0 w-full xl:w-auto border-y xl:border-y-0 border-white/[0.06] divide-x divide-white/[0.06]">
          {[
            ['Planejados', summary.planned, 'text-white'],
            ['Concluídos', summary.completed, 'text-emerald-400'],
            ['Recuperação', summary.rest, 'text-white'],
            ['Volume', `${summary.estimatedMinutes}m`, 'text-white']
          ].map(([label, value, color]) => (
            <div key={String(label)} className="px-3 sm:px-5 py-3 xl:py-0 min-w-0">
              <span className="text-[9px] uppercase font-bold text-[#707985] block truncate">{label}</span>
              <strong className={`text-xl font-mono-num ${color}`}>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#707985]">Sua semana</span>
            <h2 className="text-2xl font-heading text-white">AGENDA DE ATLETA</h2>
          </div>
          <span className="hidden sm:inline text-xs text-[#707985]">Selecione um dia para abrir os detalhes</span>
        </div>

        <div className="border-y border-white/[0.06] divide-y divide-white/[0.06]">
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
                className={`w-full grid grid-cols-[52px_36px_1fr_auto] sm:grid-cols-[72px_40px_1fr_110px_90px] gap-3 items-center py-3.5 text-left transition-colors ${isSelected ? 'bg-[#FF6B1A]/[0.06]' : 'hover:bg-white/[0.02]'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-wider ${isToday ? 'text-[#FF8D4D]' : 'text-[#7D8792]'}`}>{day.dayName}</span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#FF6B1A] text-white' : 'bg-white/[0.04] text-[#FF6B1A]'}`}><Icon className="w-4 h-4" /></span>
                <span className="min-w-0">
                  <span className="text-sm font-semibold text-white truncate block">{day.customTitle}</span>
                  <span className="text-[10px] text-[#707985] block mt-0.5">{meta.label}</span>
                </span>
                <span className="hidden sm:block text-[11px] text-[#8C96A1]">{workout ? `${workout.estimatedMinutes} min` : type === 'rest' ? 'OFF' : 'Sessão livre'}</span>
                <span className={`text-[10px] font-bold uppercase text-right ${day.completed ? 'text-emerald-400' : isToday ? 'text-[#FF8D4D]' : 'text-[#68727E]'}`}>{day.completed ? 'Feito' : isToday ? 'Hoje' : 'Planejado'}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 lg:gap-10 pt-2 border-t border-white/[0.06]">
        <div className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FF6B1A]">{currentDayData.dayName}</span>
                {currentDayData.dayOfWeek === today && <span className="text-[9px] uppercase font-black text-[#FF8D4D]">Hoje</span>}
                {currentDayData.completed && <span className="text-[9px] uppercase font-black text-emerald-400">Concluído</span>}
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading text-white leading-none">{currentDayData.customTitle}</h2>
              <p className="text-xs sm:text-sm text-[#9AA1AA] mt-2">{selectedSessionMeta.detail}</p>
            </div>

            <button onClick={() => setIsEditOpen(true)} className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-xs font-bold text-white flex items-center justify-center gap-2">
              <Pencil className="w-4 h-4 text-[#FF6B1A]" /> Editar sessão
            </button>
          </div>

          {workoutForSelectedDay ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-y border-white/[0.06] py-4">
                <div className="pr-4"><Clock className="w-4 h-4 text-[#FF6B1A] mb-2" /><span className="text-[9px] uppercase font-bold text-[#707985] block">Duração</span><strong className="text-lg text-white font-mono-num">{workoutForSelectedDay.estimatedMinutes} min</strong></div>
                <div className="px-4"><Activity className="w-4 h-4 text-[#FF6B1A] mb-2" /><span className="text-[9px] uppercase font-bold text-[#707985] block">Drills</span><strong className="text-lg text-white font-mono-num">{workoutForSelectedDay.exercises.length}</strong></div>
                <div className="pl-4"><Zap className="w-4 h-4 text-[#FF6B1A] mb-2" /><span className="text-[9px] uppercase font-bold text-[#707985] block">XP</span><strong className="text-lg text-[#FF8D4D] font-mono-num">+{workoutForSelectedDay.xpReward}</strong></div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3"><h3 className="text-xs uppercase tracking-[0.14em] font-black text-[#9AA1AA]">Sequência do treino</h3><span className="text-[10px] text-[#707985]">DRILL → SKILL → GAME</span></div>
                <div className="border-y border-white/[0.06] divide-y divide-white/[0.06]">
                  {workoutForSelectedDay.exercises.map((item, idx) => {
                    const exercise = getExerciseById(item.exerciseId);
                    return (
                      <div key={`${item.exerciseId}-${idx}`} className="grid grid-cols-[28px_1fr_auto] gap-3 items-center py-3.5">
                        <span className="text-[11px] font-black text-[#FF6B1A]">{String(idx + 1).padStart(2, '0')}</span>
                        <div className="min-w-0"><h4 className="text-sm font-semibold text-white truncate">{exercise?.name || item.exerciseId}</h4><p className="text-[11px] text-[#707985] mt-0.5">{item.customSets || 3} séries • {item.customReps || '15 reps'} • {item.restSeconds || 30}s descanso</p></div>
                        <ChevronRight className="w-4 h-4 text-[#4E5965]" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => startWorkout(workoutForSelectedDay)} className="px-7 py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-heading uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B1A]/20"><Play className="w-4 h-4 fill-current" />Iniciar treino</button>
                <button onClick={handleToggleComplete} className={`px-5 py-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${currentDayData.completed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'border-white/[0.08] text-white hover:bg-white/[0.03]'}`}><CheckCircle2 className="w-4 h-4" />{currentDayData.completed ? 'Concluído' : 'Marcar como feito'}</button>
              </div>
            </div>
          ) : (
            <div className="py-8 border-y border-white/[0.06]">
              <div className="flex items-start gap-4 max-w-2xl">
                <div className="w-11 h-11 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0">{React.createElement(selectedSessionMeta.icon, { className: `w-5 h-5 ${selectedSessionType === 'rest' ? 'text-amber-400' : 'text-[#FF6B1A]'}` })}</div>
                <div><h3 className="text-xl font-heading text-white">{selectedSessionMeta.label}</h3><p className="text-sm text-[#9AA1AA] mt-2 leading-relaxed">{selectedSessionType === 'rest' ? 'Recuperação também faz parte do desenvolvimento. Mobilidade leve, sono e hidratação entram no plano.' : 'Essa sessão representa aplicação em jogo ou desenvolvimento físico. Você pode trocar por um treino técnico quando quiser.'}</p><button onClick={handleToggleComplete} className="mt-4 text-xs font-bold text-[#FF8D4D] inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{currentDayData.completed ? 'Sessão concluída' : 'Marcar como concluída'}</button></div>
              </div>
            </div>
          )}
        </div>

        <aside className="pt-6 lg:border-l lg:border-white/[0.06] lg:pl-8 space-y-7">
          <div>
            <span className="text-[10px] uppercase font-black tracking-[0.14em] text-[#707985]">Ações rápidas</span>
            <div className="mt-3 divide-y divide-white/[0.06] border-y border-white/[0.06]">
              <button onClick={() => setIsEditOpen(true)} className="w-full py-3.5 text-sm text-white flex items-center justify-between"><span className="flex items-center gap-2"><RotateCcw className="w-4 h-4 text-[#FF6B1A]" />Trocar sessão</span><ChevronRight className="w-4 h-4 text-[#707985]" /></button>
              <button onClick={duplicateSelectedDayToNext} className="w-full py-3.5 text-sm text-white flex items-center justify-between"><span className="flex items-center gap-2"><Copy className="w-4 h-4 text-[#FF6B1A]" />Duplicar no próximo dia</span><ChevronRight className="w-4 h-4 text-[#707985]" /></button>
              <button onClick={() => setPreset('rest')} className="w-full py-3.5 text-sm text-white flex items-center justify-between"><span className="flex items-center gap-2"><Coffee className="w-4 h-4 text-amber-400" />Marcar descanso</span><ChevronRight className="w-4 h-4 text-[#707985]" /></button>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-black tracking-[0.14em] text-[#707985]">Última atividade</span>
            <div className="mt-3 flex items-start gap-3"><HeartPulse className="w-5 h-5 text-[#FF6B1A] shrink-0 mt-0.5" /><div><p className="text-sm font-semibold text-white">{workoutLogs[0]?.workoutTitle || 'Nenhum treino registrado'}</p>{workoutLogs[0] && <p className="text-[11px] text-[#707985] mt-1">{workoutLogs[0].durationMinutes} min • {workoutLogs[0].exercisesCompleted} exercícios</p>}</div></div>
          </div>
        </aside>
      </section>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-end sm:items-center justify-center animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl bg-[#0D1014] border border-[#1F2630] shadow-2xl">
            <div className="sticky top-0 z-10 bg-[#0D1014]/95 backdrop-blur border-b border-[#1F2630] p-5 flex items-center justify-between">
              <div><span className="text-[10px] uppercase font-black tracking-wider text-[#FF6B1A]">{currentDayData.dayName}</span><h3 className="text-xl font-heading text-white">Editar sessão</h3></div>
              <button onClick={() => setIsEditOpen(false)} className="w-9 h-9 rounded-xl bg-[#15191F] border border-[#1F2630] text-[#9AA1AA] hover:text-white flex items-center justify-center" aria-label="Fechar edição"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-[#707985]">Tipo de sessão</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
                  {(['pickup', 'game', 'gym', 'rest'] as SessionPreset[]).map((type) => {
                    const meta = sessionMeta[type];
                    const Icon = meta.icon;
                    return <button key={type} onClick={() => setPreset(type)} className="p-3 rounded-2xl bg-[#11151A] hover:bg-[#15191F] border border-[#1F2630] hover:border-[#FF6B1A]/30 text-left"><Icon className={`w-4 h-4 mb-2 ${type === 'rest' ? 'text-amber-400' : 'text-[#FF6B1A]'}`} /><span className="text-xs font-bold text-white block">{meta.label}</span></button>;
                  })}
                  <button onClick={() => currentDayData.workoutId ? setPreset('workout') : undefined} className="p-3 rounded-2xl bg-[#11151A] hover:bg-[#15191F] border border-[#1F2630] hover:border-[#FF6B1A]/30 text-left"><Flame className="w-4 h-4 mb-2 text-[#FF6B1A]" /><span className="text-xs font-bold text-white block">Treino técnico</span></button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between"><span className="text-[10px] uppercase font-black tracking-wider text-[#707985]">Escolher treino técnico</span><span className="text-[10px] text-[#707985]">{WORKOUTS_DATA.length} disponíveis</span></div>
                <div className="space-y-2 mt-3">
                  {WORKOUTS_DATA.map((workout) => <button key={workout.id} onClick={() => handleSwapWorkout(workout)} className="w-full rounded-2xl bg-[#11151A] hover:bg-[#15191F] border border-[#1F2630] hover:border-[#FF6B1A]/35 p-3.5 flex items-center justify-between gap-3 text-left group"><div className="min-w-0"><span className="text-sm font-semibold text-white group-hover:text-[#FF8D4D] transition-colors block truncate">{workout.title}</span><span className="text-[11px] text-[#707985]">{workout.estimatedMinutes} min • {workout.exercises.length} exercícios • {workout.level}</span></div><Plus className="w-4 h-4 text-[#FF6B1A] shrink-0" /></button>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
