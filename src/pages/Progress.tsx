import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Gauge,
  Minus,
  SlidersHorizontal,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { RadarSkillChart } from '../components/common/RadarSkillChart';

const PERIOD_OPTIONS = [
  { id: '7', label: '7 dias', days: 7 },
  { id: '30', label: '30 dias', days: 30 },
  { id: 'all', label: 'Tudo', days: null }
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  'ball-handle': 'Ball Handle',
  shooting: 'Arremesso',
  finishing: 'Finalização',
  footwork: 'Footwork',
  passing: 'Passe',
  'pick-and-roll': 'Pick and Roll',
  defense: 'Defesa',
  'off-ball': 'Sem Bola',
  'post-game': 'Post Game',
  athletic: 'Físico',
  complete: 'Completo'
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
};

const formatPercentChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const Progress: React.FC = () => {
  const {
    skillsRating,
    updateSkillRating,
    topStrength,
    mainFocusArea,
    workoutLogs,
    xp,
    tier,
    currentStreakDays,
    longestStreakDays,
    getWorkoutById,
    goals
  } = usePlayer();

  const [period, setPeriod] = useState<'7' | '30' | 'all'>('7');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'Técnica' | 'Tática' | 'Física' | 'Mental'>('all');
  const [showCalibration, setShowCalibration] = useState(false);

  const now = new Date();
  const selectedPeriod = PERIOD_OPTIONS.find((option) => option.id === period)!;

  const filteredLogs = useMemo(() => {
    if (!selectedPeriod.days) return [...workoutLogs].sort((a, b) => +new Date(b.completedAt) - +new Date(a.completedAt));
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - selectedPeriod.days);
    return workoutLogs
      .filter((log) => new Date(log.completedAt) >= cutoff)
      .sort((a, b) => +new Date(b.completedAt) - +new Date(a.completedAt));
  }, [workoutLogs, selectedPeriod.days]);

  const previousPeriodLogs = useMemo(() => {
    if (!selectedPeriod.days) return [];
    const end = new Date(now);
    end.setDate(end.getDate() - selectedPeriod.days);
    const start = new Date(end);
    start.setDate(start.getDate() - selectedPeriod.days);
    return workoutLogs.filter((log) => {
      const date = new Date(log.completedAt);
      return date >= start && date < end;
    });
  }, [workoutLogs, selectedPeriod.days]);

  const metrics = useMemo(() => {
    const totalMinutes = filteredLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
    const totalShots = filteredLogs.reduce((sum, log) => sum + (log.shotsMade || 0), 0);
    const totalXp = filteredLogs.reduce((sum, log) => sum + log.xpEarned, 0);
    const uniqueDays = new Set(filteredLogs.map((log) => new Date(log.completedAt).toDateString())).size;

    const previousMinutes = previousPeriodLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
    const previousShots = previousPeriodLogs.reduce((sum, log) => sum + (log.shotsMade || 0), 0);

    return {
      sessions: filteredLogs.length,
      minutes: totalMinutes,
      shots: totalShots,
      xpEarned: totalXp,
      uniqueDays,
      sessionsChange: formatPercentChange(filteredLogs.length, previousPeriodLogs.length),
      minutesChange: formatPercentChange(totalMinutes, previousMinutes),
      shotsChange: formatPercentChange(totalShots, previousShots)
    };
  }, [filteredLogs, previousPeriodLogs]);

  const categoryVolume = useMemo(() => {
    const totals = new Map<string, { label: string; minutes: number; sessions: number }>();

    filteredLogs.forEach((log) => {
      const workout = getWorkoutById(log.workoutId);
      const category = workout?.category || 'complete';
      const label = workout?.categoryLabel || CATEGORY_LABELS[category] || 'Completo';
      const current = totals.get(category) || { label, minutes: 0, sessions: 0 };
      current.minutes += log.durationMinutes;
      current.sessions += 1;
      totals.set(category, current);
    });

    return [...totals.entries()]
      .map(([category, value]) => ({ category, ...value }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [filteredLogs, getWorkoutById]);

  const weeklyBars = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      const logs = workoutLogs.filter((log) => {
        const completed = new Date(log.completedAt);
        return completed >= date && completed < next;
      });
      return {
        date,
        label: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').slice(0, 3).toUpperCase(),
        minutes: logs.reduce((sum, log) => sum + log.durationMinutes, 0),
        sessions: logs.length
      };
    });
    const maxMinutes = Math.max(...days.map((day) => day.minutes), 1);
    return days.map((day) => ({ ...day, height: Math.max(day.minutes ? (day.minutes / maxMinutes) * 100 : 4, 4) }));
  }, [workoutLogs]);

  const filteredSkills = activeCategoryFilter === 'all'
    ? skillsRating
    : skillsRating.filter((skill) => skill.category === activeCategoryFilter);

  const skillAverages = useMemo(() => {
    const categories = ['Técnica', 'Tática', 'Física', 'Mental'];
    return categories.map((category) => {
      const entries = skillsRating.filter((skill) => skill.category === category);
      const average = entries.length ? entries.reduce((sum, skill) => sum + skill.score, 0) / entries.length : 0;
      return { category, average };
    });
  }, [skillsRating]);

  const activeGoals = goals.filter((goal) => !goal.completed).slice(0, 3);
  const maxCategoryMinutes = Math.max(...categoryVolume.map((item) => item.minutes), 1);

  const ChangeIndicator = ({ value }: { value: number }) => {
    if (!selectedPeriod.days) return <span className="text-[11px] text-[#707985]">histórico total</span>;
    if (value > 0) {
      return (
        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> +{value}% vs período anterior
        </span>
      );
    }
    if (value < 0) {
      return (
        <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
          <TrendingDown className="w-3 h-3" /> {value}% vs período anterior
        </span>
      );
    }
    return (
      <span className="text-[11px] text-[#707985] flex items-center gap-1">
        <Minus className="w-3 h-3" /> mesmo volume
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-7 animate-in fade-in duration-300">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
            Performance & Consistência
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">
            SUA EVOLUÇÃO
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1 max-w-2xl">
            Acompanhe o que você realmente treinou, onde investiu tempo e quais áreas do seu jogo precisam do próximo bloco de trabalho.
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-[#11151A] border border-[#1F2630] self-start lg:self-auto">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setPeriod(option.id)}
              className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-colors ${
                period === option.id ? 'bg-[#FF6B1A] text-white' : 'text-[#9AA1AA] hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Sessões</span>
            <CheckCircle2 className="w-4 h-4 text-[#FF6B1A]" />
          </div>
          <span className="text-2xl sm:text-3xl font-mono-num font-bold text-white block">{metrics.sessions}</span>
          <div className="mt-1"><ChangeIndicator value={metrics.sessionsChange} /></div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Tempo treinado</span>
            <Clock3 className="w-4 h-4 text-[#FF6B1A]" />
          </div>
          <span className="text-2xl sm:text-3xl font-mono-num font-bold text-white block">{formatDuration(metrics.minutes)}</span>
          <div className="mt-1"><ChangeIndicator value={metrics.minutesChange} /></div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Arremessos</span>
            <Target className="w-4 h-4 text-[#FF6B1A]" />
          </div>
          <span className="text-2xl sm:text-3xl font-mono-num font-bold text-white block">{metrics.shots}</span>
          <div className="mt-1"><ChangeIndicator value={metrics.shotsChange} /></div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Sequência</span>
            <Flame className="w-4 h-4 text-[#FF6B1A]" />
          </div>
          <span className="text-2xl sm:text-3xl font-mono-num font-bold text-white block">{currentStreakDays} dias</span>
          <span className="text-[11px] text-[#707985]">recorde: {longestStreakDays} dias</span>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="p-8 sm:p-10 rounded-3xl border border-dashed border-[#2B3542] bg-[#0D1014] text-center">
          <Activity className="w-9 h-9 text-[#FF6B1A] mx-auto mb-3" />
          <h2 className="text-xl font-heading text-white">Ainda não há sessões neste período</h2>
          <p className="text-xs text-[#9AA1AA] mt-1 max-w-md mx-auto">
            Conclua um treino no modo quadra para começar a construir seu histórico de performance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A]">Últimos 7 dias</span>
                <h2 className="text-xl sm:text-2xl font-heading text-white">Ritmo de treino</h2>
              </div>
              <span className="text-xs text-[#9AA1AA]">{weeklyBars.filter((day) => day.sessions > 0).length}/7 dias ativos</span>
            </div>

            <div className="h-52 flex items-end gap-2 sm:gap-3">
              {weeklyBars.map((day) => (
                <div key={day.date.toISOString()} className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-mono-num text-[#9AA1AA]">{day.minutes ? `${day.minutes}m` : ''}</span>
                  <div className="w-full h-36 flex items-end rounded-xl bg-[#11151A] border border-[#1F2630] overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all ${day.minutes ? 'bg-[#FF6B1A]' : 'bg-[#191E24]'}`}
                      style={{ height: `${day.height}%` }}
                      title={`${day.minutes} minutos`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#707985]">{day.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
            <div className="mb-5">
              <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A]">Distribuição</span>
              <h2 className="text-xl sm:text-2xl font-heading text-white">Onde você investiu tempo</h2>
            </div>

            <div className="space-y-4">
              {categoryVolume.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
                    <span className="font-semibold text-white truncate">{item.label}</span>
                    <span className="font-mono-num text-[#9AA1AA] whitespace-nowrap">{formatDuration(item.minutes)} · {item.sessions}x</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#15191F] overflow-hidden">
                    <div className="h-full rounded-full bg-[#FF6B1A]" style={{ width: `${Math.max((item.minutes / maxCategoryMinutes) * 100, 6)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7 p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A]">Mapa técnico</span>
              <h2 className="text-xl sm:text-2xl font-heading text-white">Seu jogo hoje</h2>
            </div>
            <button
              onClick={() => setShowCalibration((value) => !value)}
              className="px-3 py-2 rounded-xl border border-[#2B3542] bg-[#15191F] text-xs font-bold text-white flex items-center justify-center gap-2 hover:border-[#FF6B1A]/50"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#FF6B1A]" />
              {showCalibration ? 'Fechar calibração' : 'Calibrar autoavaliação'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <div className="overflow-hidden flex justify-center">
              <RadarSkillChart skills={skillsRating} size={330} />
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#15191F] border border-[#1F2630]">
                <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Maior força</span>
                <div className="flex items-end justify-between gap-3 mt-1">
                  <span className="text-lg font-heading text-white">{topStrength.name}</span>
                  <span className="text-xl font-mono-num font-bold text-emerald-400">{topStrength.score.toFixed(1)}</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#17140F] border border-amber-800/30">
                <span className="text-[10px] uppercase font-bold text-amber-400">Próximo foco</span>
                <div className="flex items-end justify-between gap-3 mt-1">
                  <span className="text-lg font-heading text-white">{mainFocusArea.name}</span>
                  <span className="text-xl font-mono-num font-bold text-[#FF8D4D]">{mainFocusArea.score.toFixed(1)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {skillAverages.map((item) => (
                  <div key={item.category} className="p-3 rounded-xl bg-[#11151A] border border-[#1F2630]">
                    <span className="text-[9px] uppercase font-bold text-[#707985]">{item.category}</span>
                    <span className="text-lg font-mono-num font-bold text-white block">{item.average.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {showCalibration && (
            <div className="mt-6 pt-6 border-t border-[#1F2630] animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none">
                {(['all', 'Técnica', 'Tática', 'Física', 'Mental'] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategoryFilter(category)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase whitespace-nowrap ${
                      activeCategoryFilter === category ? 'bg-[#FF6B1A] text-white' : 'bg-[#15191F] text-[#9AA1AA] border border-[#1F2630]'
                    }`}
                  >
                    {category === 'all' ? 'Todos' : category}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-[#707985] mb-4">
                Estes valores são sua autoavaliação. Use-os como referência pessoal, não como medição científica de performance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[430px] overflow-y-auto pr-1">
                {filteredSkills.map((skill) => (
                  <label key={skill.key} className="p-3 rounded-xl bg-[#15191F] border border-[#1F2630]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-white">{skill.name}</span>
                      <span className="text-xs font-mono-num font-bold text-[#FF6B1A]">{skill.score.toFixed(1)}</span>
                    </div>
                    <input
                      aria-label={`Autoavaliação de ${skill.name}`}
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={skill.score}
                      onChange={(event) => updateSkillRating(skill.key, parseFloat(event.target.value))}
                      className="w-full accent-[#FF6B1A] cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-5 space-y-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A]">Nível CourtLab</span>
                <h2 className="text-xl font-heading text-white">{tier}</h2>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#FF6B1A]" />
              </div>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <span className="text-2xl font-mono-num font-bold text-white">{xp.toLocaleString('pt-BR')}</span>
                <span className="text-xs text-[#9AA1AA] ml-1">XP acumulado</span>
              </div>
              <span className="text-xs font-mono-num font-bold text-emerald-400">+{metrics.xpEarned} no período</span>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A]">Metas ativas</span>
                <h2 className="text-xl font-heading text-white">Próximos marcos</h2>
              </div>
              <Gauge className="w-5 h-5 text-[#FF6B1A]" />
            </div>

            {activeGoals.length ? (
              <div className="space-y-4">
                {activeGoals.map((goal) => {
                  const progress = Math.min(100, Math.round((goal.currentValue / Math.max(goal.targetValue, 1)) * 100));
                  return (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
                        <span className="font-semibold text-white line-clamp-1">{goal.title}</span>
                        <span className="font-mono-num text-[#FF8D4D]">{progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#15191F] overflow-hidden">
                        <div className="h-full rounded-full bg-[#FF6B1A]" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#9AA1AA]">Nenhuma meta ativa no momento.</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A]">Histórico</span>
            <h2 className="text-xl sm:text-2xl font-heading text-white">Sessões registradas</h2>
          </div>
          <span className="text-xs text-[#9AA1AA]">{filteredLogs.length} neste período</span>
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-xs text-[#9AA1AA]">Nenhuma sessão registrada para o filtro selecionado.</p>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => {
              const workout = getWorkoutById(log.workoutId);
              return (
                <div key={log.id} className="p-4 rounded-2xl bg-[#11151A] border border-[#1F2630] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[9px] uppercase font-bold tracking-wide text-[#FF8D4D]">{workout?.categoryLabel || 'Treino'}</span>
                      <span className="text-[10px] text-[#707985]">{new Date(log.completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-heading text-white truncate">{log.workoutTitle}</h3>
                    <p className="text-[11px] text-[#9AA1AA] mt-1">
                      {log.exercisesCompleted} exercícios · {log.totalSets} séries{log.shotsMade ? ` · ${log.shotsMade} arremessos` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 md:justify-end flex-shrink-0">
                    <div>
                      <span className="text-[9px] uppercase text-[#707985] block">Tempo</span>
                      <span className="text-sm font-mono-num font-bold text-white">{log.durationMinutes} min</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-[#707985] block">Intensidade</span>
                      <span className="text-xs font-semibold text-white">{log.perceivedDifficulty}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-[#707985] block">XP</span>
                      <span className="text-sm font-mono-num font-bold text-emerald-400">+{log.xpEarned}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-5 rounded-2xl bg-[#11151A] border border-[#1F2630] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF6B1A]/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-[#FF6B1A]" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Leitura CourtLab</span>
            <p className="text-[11px] text-[#9AA1AA] mt-0.5">
              Frequência e volume mostram o que você praticou. A autoavaliação ajuda a decidir o próximo foco; evolução real precisa aparecer também no jogo.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono-num text-[#707985] whitespace-nowrap">{metrics.uniqueDays} dias ativos</span>
      </div>
    </div>
  );
};
