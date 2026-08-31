import React from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import {
  Flame,
  Clock,
  Dumbbell,
  Target,
  Award,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Activity,
  Shield,
  Layers,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { WORKOUTS_DATA } from '../data/workouts';
import { FUNDAMENTALS_DATA } from '../data/fundamentals';
import { WorkoutCard } from '../components/common/WorkoutCard';
import { ExerciseCard } from '../components/common/ExerciseCard';
import { RadarSkillChart } from '../components/common/RadarSkillChart';
import { Exercise, Workout } from '../types';

export const Dashboard: React.FC = () => {
  const {
    profile,
    xp,
    tier,
    currentStreakDays,
    weeklyPlan,
    goals,
    workoutLogs,
    skillsRating,
    topStrength,
    mainFocusArea,
    startWorkout
  } = usePlayer();

  const { onSelectExercise } = useOutletContext<{ onSelectExercise: (e: Exercise) => void }>();
  const navigate = useNavigate();

  // Today's featured workout (Shot Creation or Ball Handle)
  const todayWorkout = WORKOUTS_DATA[0]; // Shot Creation

  // Recommended workouts based on profile goals
  const recommendedWorkouts = WORKOUTS_DATA.slice(1, 4);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 1. Welcome & Player Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-num font-bold uppercase tracking-wider text-[#FF8D4D] mb-1">
            <span>Temporada 2026</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Plano Ativo
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-none">
            E aí, <span className="text-[#FF6B1A]">{profile.name}</span>! Bora pra quadra?
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1">
            Posição: <strong className="text-white">{profile.position}</strong> • Foco principal:{' '}
            <strong className="text-white">{mainFocusArea.name}</strong>
          </p>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3.5 py-2 rounded-xl bg-[#15191F] border border-[#1F2630] flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-[#FF6B1A] fill-[#FF6B1A]" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block leading-tight">Sequência</span>
              <span className="text-sm font-mono-num font-bold text-white leading-none">{currentStreakDays} Dias Seguidos</span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#15191F] border border-[#1F2630] flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#FF8D4D]" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block leading-tight">Nível</span>
              <span className="text-sm font-heading text-[#FF6B1A] leading-none">{tier} ({xp} XP)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Card: "TREINO DE HOJE" (Section 22) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#191E24] via-[#15191F] to-[#0D1014] border border-[#FF6B1A]/40 shadow-2xl shadow-[#FF6B1A]/10">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 hidden md:block overflow-hidden">
          <img
            src={todayWorkout.thumbnail}
            alt={todayWorkout.title}
            className="w-full h-full object-cover mix-blend-luminosity filter contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#15191F] via-[#15191F]/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 md:max-w-2xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF6B1A] text-white">
                Treino de Hoje
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase bg-black/50 text-[#9AA1AA] border border-white/10">
                {todayWorkout.categoryLabel}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono-num font-bold text-[#FF8D4D] bg-[#FF6B1A]/10 border border-[#FF6B1A]/30">
                +{todayWorkout.xpReward} XP
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-white tracking-tight leading-tight">
              {todayWorkout.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#9AA1AA] mt-2 leading-relaxed">
              {todayWorkout.description}
            </p>

            {/* Quick drill preview badges */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-white/90">
              <span className="flex items-center gap-1.5 font-mono-num">
                <Clock className="w-4 h-4 text-[#FF6B1A]" />
                {todayWorkout.estimatedMinutes} minutos
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Dumbbell className="w-4 h-4 text-[#FF6B1A]" />
                {todayWorkout.exercises.length} exercícios
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Target className="w-4 h-4" />
                Nível {todayWorkout.level}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => startWorkout(todayWorkout)}
              className="py-3.5 px-8 rounded-2xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-heading text-base uppercase tracking-wider transition-all shadow-lg shadow-[#FF6B1A]/30 flex items-center justify-center gap-2 group"
            >
              <Flame className="w-5 h-5 fill-current" />
              <span>Começar Treino</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/plano')}
              className="py-3.5 px-5 rounded-2xl bg-[#15191F] hover:bg-[#1E242D] border border-[#2B3542] text-xs font-bold uppercase tracking-wider text-white transition-colors text-center"
            >
              Ver Cronograma
            </button>
          </div>
        </div>
      </div>

      {/* 3. Weekly Streak Strip & Weekly Summary Grid (Sections 23 & 24) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Calendar Strip (SEG - DOM) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA] block">
                Planejamento Semanal
              </span>
              <h3 className="text-lg sm:text-xl font-heading text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF6B1A]" />
                Sequência de Treinos da Semana
              </h3>
            </div>
            <Link to="/plano" className="text-xs font-bold text-[#FF6B1A] hover:underline flex items-center gap-1">
              Ver Plano Completo
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {weeklyPlan.map((day, idx) => {
              const isToday = day.dayOfWeek === 4; // Thursday

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-between p-2 sm:p-3 rounded-2xl border transition-all text-center ${
                    isToday
                      ? 'bg-[#FF6B1A]/10 border-[#FF6B1A] shadow-md shadow-[#FF6B1A]/10'
                      : day.completed
                      ? 'bg-[#15191F] border-emerald-500/40 text-white'
                      : day.isRest
                      ? 'bg-[#11151A] border-[#1F2630] opacity-60'
                      : 'bg-[#11151A] border-[#1F2630]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">{day.dayName}</span>

                  <div className="my-2">
                    {day.completed ? (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : day.isRest ? (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1F2630] text-[#9AA1AA] flex items-center justify-center text-[10px] font-bold">
                        OFF
                      </div>
                    ) : isToday ? (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF6B1A] text-white flex items-center justify-center shadow-lg shadow-[#FF6B1A]/40 animate-pulse">
                        <Flame className="w-4 h-4 fill-current" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#15191F] border border-[#2B3542] text-[#9AA1AA] flex items-center justify-center text-[10px] font-mono-num font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] sm:text-[10px] font-semibold line-clamp-1 text-white/90">
                    {day.isRest ? 'Descanso' : day.customTitle.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumo da Semana (Section 24) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630] flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA] block">Métricas</span>
            <h3 className="text-lg sm:text-xl font-heading text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF8D4D]" />
              Resumo da Semana
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#15191F] border border-[#1F2630]">
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Treinos Concluídos</span>
              <span className="text-2xl font-mono-num font-bold text-white">3 / 4</span>
              <div className="w-full bg-[#11151A] rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-[#FF6B1A] h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#15191F] border border-[#1F2630]">
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Tempo em Quadra</span>
              <span className="text-2xl font-mono-num font-bold text-white">2h35</span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">+20m vs semana passada</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#15191F] border border-[#1F2630]">
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Exercícios</span>
              <span className="text-2xl font-mono-num font-bold text-white">26</span>
              <span className="text-[10px] text-[#9AA1AA] block mt-1">100% mecânica correta</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#15191F] border border-[#1F2630]">
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Arremessos Convertidos</span>
              <span className="text-2xl font-mono-num font-bold text-[#FF6B1A]">320</span>
              <span className="text-[10px] text-[#9AA1AA] block mt-1">Meta: 500 / sem</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Fundamental Skill Launchpad (Section 26) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA] block">
              Explorar Fundamentos
            </span>
            <h3 className="text-xl sm:text-2xl font-heading text-white">
              Acesso Rápido por Fundamento
            </h3>
          </div>
          <Link to="/fundamentos" className="text-xs font-bold text-[#FF6B1A] hover:underline flex items-center gap-1">
            Ver Todos (8 Fundamentos)
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {FUNDAMENTALS_DATA.map((item) => (
            <Link
              key={item.id}
              to={`/biblioteca?category=${item.id}`}
              className="p-3.5 rounded-2xl bg-[#15191F] hover:bg-[#191E24] border border-[#1F2630] hover:border-[#FF6B1A]/60 transition-all text-center group flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0D1014] text-[#FF6B1A] group-hover:scale-110 group-hover:bg-[#FF6B1A] group-hover:text-white transition-all flex items-center justify-center border border-[#1F2630]">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs font-heading text-white line-clamp-1 group-hover:text-[#FF6B1A] transition-colors">
                {item.name}
              </span>
              <span className="text-[10px] font-mono-num text-[#9AA1AA]">
                {item.subcategories.length} tópicos
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Recommended Workouts & Radar Skill Focus (Section 25) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Workouts Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA] block">
                Personalizado
              </span>
              <h3 className="text-xl sm:text-2xl font-heading text-white">
                Recomendado para Você
              </h3>
            </div>
            <Link to="/treinar" className="text-xs font-bold text-[#FF6B1A] hover:underline flex items-center gap-1">
              Ver Todos os Treinos
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onStart={startWorkout}
              />
            ))}
          </div>
        </div>

        {/* Player Radar & Focus Area Snapshot */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA]">
                Perfil de Habilidades
              </span>
              <Link to="/progresso" className="text-xs font-bold text-[#FF6B1A] hover:underline">
                Ajustar Radar
              </Link>
            </div>
            <h3 className="text-lg sm:text-xl font-heading text-white">
              Seu Diagnóstico Técnico
            </h3>
          </div>

          {/* Mini Radar Visual */}
          <div className="flex items-center justify-center my-2 scale-90 sm:scale-100">
            <RadarSkillChart skills={skillsRating.slice(0, 10)} size={280} />
          </div>

          {/* Strength vs Focus box */}
          <div className="space-y-2 pt-2 border-t border-[#1F2630]">
            <div className="p-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] flex items-center justify-between text-xs">
              <span className="text-[#9AA1AA] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B1A]" />
                Maior Ponto Forte:
              </span>
              <strong className="text-white font-mono-num">{topStrength.name} ({topStrength.score.toFixed(1)})</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] flex items-center justify-between text-xs">
              <span className="text-[#9AA1AA] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Principal Foco a Desenvolver:
              </span>
              <strong className="text-[#FF8D4D] font-mono-num">{mainFocusArea.name} ({mainFocusArea.score.toFixed(1)})</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Active Weekly Goals & Challenge Progress (Section 27) */}
      <div className="p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA] block">
              Gamificação & Disciplina
            </span>
            <h3 className="text-xl sm:text-2xl font-heading text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FF6B1A]" />
              Metas da Semana
            </h3>
          </div>
          <Link to="/metas" className="text-xs font-bold text-[#FF6B1A] hover:underline flex items-center gap-1">
            Gerenciar Metas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

            return (
              <div
                key={goal.id}
                className="p-4 rounded-2xl bg-[#15191F] border border-[#1F2630] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white line-clamp-1">{goal.title}</span>
                    <span className="font-mono-num font-bold text-[#FF6B1A]">{percentage}%</span>
                  </div>
                  <div className="w-full bg-[#11151A] rounded-full h-2 overflow-hidden border border-[#1F2630]">
                    <div
                      className="bg-[#FF6B1A] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono-num text-[#9AA1AA] pt-1">
                  <span>{goal.currentValue} {goal.unit}</span>
                  <span>Meta: {goal.targetValue}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
