import React, { useState } from 'react';
import {
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  Dumbbell,
  Play,
  RotateCcw,
  Plus,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Coffee
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { WORKOUTS_DATA } from '../data/workouts';
import { PROGRAMS_DATA } from '../data/programs';
import { Workout } from '../types';

export const MyPlan: React.FC = () => {
  const { weeklyPlan, updateDayPlan, startWorkout, getWorkoutById } = usePlayer();
  const [selectedDay, setSelectedDay] = useState<number>(4); // Thursday default (Hoje)
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  const activeProgram = PROGRAMS_DATA[0]; // COMPLETE GUARD
  const currentDayData = weeklyPlan.find((d) => d.dayOfWeek === selectedDay) || weeklyPlan[0];
  const workoutForSelectedDay: Workout | undefined = currentDayData.workoutId
    ? getWorkoutById(currentDayData.workoutId)
    : undefined;

  const handleSwapWorkout = (newWorkoutId: string, title: string) => {
    updateDayPlan(selectedDay, {
      workoutId: newWorkoutId,
      customTitle: title,
      isRest: false
    });
    setIsSwapModalOpen(false);
  };

  const handleSetRestDay = () => {
    updateDayPlan(selectedDay, {
      workoutId: undefined,
      customTitle: 'Descanso Ativo e Recuperação',
      isRest: true
    });
    setIsSwapModalOpen(false);
  };

  const handleToggleDayComplete = (dayOfWeek: number, currentStatus: boolean) => {
    updateDayPlan(dayOfWeek, {
      completed: !currentStatus,
      completedAt: !currentStatus ? new Date().toISOString() : undefined
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 1. Header with Active Program Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#191E24] via-[#12161C] to-[#0D1014] border border-[#1F2630] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-num font-bold uppercase tracking-wider text-[#FF6B1A] mb-1">
            <Layers className="w-4 h-4" />
            <span>Programa em Andamento</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">
            {activeProgram.title} — <span className="text-[#FF8D4D]">Semana 1 de {activeProgram.durationWeeks}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1 max-w-xl">
            {activeProgram.subtitle} Meta da semana: Fundamentos + Controle de Bola Estacionário.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="p-3 rounded-2xl bg-[#0D1014] border border-[#1F2630] text-center min-w-[100px]">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Frequência</span>
            <span className="text-xl font-mono-num font-bold text-white">4x / semana</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#0D1014] border border-[#1F2630] text-center min-w-[100px]">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Concluídos</span>
            <span className="text-xl font-mono-num font-bold text-emerald-400">3 / 4 dias</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive 7-Day Calendar Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-heading text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF6B1A]" />
            Cronograma da Semana
          </h2>
          <span className="text-xs text-[#9AA1AA]">Clique em um dia para ver os detalhes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weeklyPlan.map((day) => {
            const isSelected = day.dayOfWeek === selectedDay;
            const isToday = day.dayOfWeek === 4;

            return (
              <div
                key={day.dayOfWeek}
                onClick={() => setSelectedDay(day.dayOfWeek)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-36 ${
                  isSelected
                    ? 'bg-[#FF6B1A]/15 border-[#FF6B1A] shadow-xl shadow-[#FF6B1A]/10 scale-102'
                    : day.completed
                    ? 'bg-[#15191F] border-emerald-500/40 hover:border-emerald-500'
                    : day.isRest
                    ? 'bg-[#0D1014] border-[#1F2630] opacity-70 hover:opacity-100'
                    : 'bg-[#11151A] border-[#1F2630] hover:border-[#2B3542]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#9AA1AA]">{day.dayName}</span>
                  {isToday && (
                    <span className="px-1.5 py-0.5 rounded bg-[#FF6B1A] text-white text-[9px] font-black uppercase">
                      Hoje
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-heading text-white line-clamp-2 leading-tight">
                    {day.isRest ? 'Descanso Ativo' : day.customTitle}
                  </h3>
                  <span className="text-[11px] text-[#9AA1AA] block mt-0.5">
                    {day.isRest ? 'Alongamento' : 'Treino de Quadra'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1F2630]/60">
                  {day.completed ? (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Feito
                    </span>
                  ) : day.isRest ? (
                    <span className="text-[11px] text-[#9AA1AA] flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-amber-400" />
                      OFF
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#FF8D4D] flex items-center gap-1 font-semibold">
                      <Flame className="w-3.5 h-3.5 text-[#FF6B1A]" />
                      Planejado
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Day Detailed Inspector */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2630] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono-num font-bold uppercase tracking-widest text-[#FF6B1A]">
                {currentDayData.dayName} — Detalhes do Treino
              </span>
              {currentDayData.dayOfWeek === 4 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FF6B1A]/20 text-[#FF8D4D] text-[10px] font-bold uppercase">
                  Dia Atual
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading text-white tracking-tight">
              {currentDayData.isRest ? 'Dia de Recuperação e Mobilidade' : currentDayData.customTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleDayComplete(selectedDay, !!currentDayData.completed)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                currentDayData.completed
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                  : 'bg-[#15191F] text-white border-[#2B3542] hover:bg-[#1E242D]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {currentDayData.completed ? 'Marcado como Feito' : 'Marcar como Concluído'}
            </button>

            <button
              onClick={() => setIsSwapModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#191E24] hover:bg-[#202730] border border-[#2B3542] text-xs font-bold uppercase tracking-wider text-white transition-colors"
            >
              Trocar Treino
            </button>
          </div>
        </div>

        {/* Workout or Rest Breakdown */}
        {workoutForSelectedDay ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#15191F] border border-[#1F2630]">
                <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Tempo Estimado</span>
                <span className="text-xl font-mono-num font-bold text-white flex items-center gap-1.5 mt-1">
                  <Clock className="w-4 h-4 text-[#FF6B1A]" />
                  {workoutForSelectedDay.estimatedMinutes} minutos
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#15191F] border border-[#1F2630]">
                <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Volume</span>
                <span className="text-xl font-mono-num font-bold text-white flex items-center gap-1.5 mt-1">
                  <Dumbbell className="w-4 h-4 text-[#FF6B1A]" />
                  {workoutForSelectedDay.exercises.length} Drills
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#15191F] border border-[#1F2630]">
                <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Recompensa</span>
                <span className="text-xl font-mono-num font-bold text-[#FF6B1A] flex items-center gap-1.5 mt-1">
                  +{workoutForSelectedDay.xpReward} XP
                </span>
              </div>
            </div>

            {/* List of Drills inside this day's workout */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#9AA1AA] mb-3">
                Exercícios Programados Para Este Treino
              </h3>
              <div className="space-y-2">
                {workoutForSelectedDay.exercises.map((item, idx) => {
                  const drill = WORKOUTS_DATA.flatMap((w) => w.exercises).find((e) => e.exerciseId === item.exerciseId);
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#15191F] border border-[#1F2630] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#FF6B1A]/20 text-[#FF6B1A] font-mono-num font-bold text-xs flex items-center justify-center border border-[#FF6B1A]/30">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            {item.exerciseId.toUpperCase()} — Drill Específico
                          </h4>
                          <span className="text-xs text-[#9AA1AA]">
                            {item.customSets || 3} Séries • {item.customReps || '15 reps'} • Descanso: {item.restSeconds || 30}s
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => startWorkout(workoutForSelectedDay)}
                className="py-4 px-8 rounded-2xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-heading text-base uppercase tracking-wider transition-all shadow-xl shadow-[#FF6B1A]/30 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Flame className="w-5 h-5 fill-current" />
                Iniciar Treino de {currentDayData.dayName}
              </button>
            </div>
          </div>
        ) : (
          /* Rest Day Guidance */
          <div className="p-8 rounded-2xl bg-[#15191F] border border-[#1F2630] text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#1F2630] text-amber-400 mx-auto flex items-center justify-center">
              <Coffee className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-heading text-white">Dia de Recuperação Ativa</h3>
            <p className="text-xs sm:text-sm text-[#9AA1AA] leading-relaxed">
              O descanso é onde a hipertrofia e a consolidação neural dos movimentos acontecem.
              Recomendamos 15 minutos de liberação miofascial, alongamento estático de isquiotibiais e tornozelos, e boa hidratação.
            </p>
          </div>
        )}
      </div>

      {/* 4. Swap Workout Modal */}
      {isSwapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#0D1014] border border-[#1F2630] rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1F2630] pb-4">
              <h3 className="text-xl font-heading text-white">
                Trocar Treino de {currentDayData.dayName}
              </h3>
              <button
                onClick={() => setIsSwapModalOpen(false)}
                className="text-xs text-[#9AA1AA] hover:text-white"
              >
                Cancelar
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleSetRestDay}
                className="w-full p-3.5 rounded-xl bg-[#15191F] hover:bg-[#1C222B] border border-amber-500/30 text-left flex items-center justify-between text-amber-400 font-semibold text-xs sm:text-sm transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  Definir como Dia de Descanso (OFF)
                </span>
                <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Selecionar</span>
              </button>

              {WORKOUTS_DATA.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleSwapWorkout(w.id, w.title)}
                  className="w-full p-3.5 rounded-xl bg-[#15191F] hover:bg-[#1C222B] border border-[#1F2630] hover:border-[#FF6B1A]/60 text-left flex items-center justify-between transition-colors group"
                >
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF6B1A] transition-colors block">
                      {w.title}
                    </span>
                    <span className="text-[11px] text-[#9AA1AA]">
                      {w.estimatedMinutes} min • {w.exercises.length} drills • {w.level}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9AA1AA] group-hover:text-[#FF6B1A] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
