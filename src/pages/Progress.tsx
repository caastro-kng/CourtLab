import React, { useMemo, useState } from 'react';
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Flame,
  Minus,
  SlidersHorizontal,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { RadarSkillChart } from '../components/common/RadarSkillChart';
import { getCategoryVisual } from '../utils/categoryVisual';

const PERIOD_OPTIONS = [
  { id: '7', label: '7 dias', days: 7 },
  { id: '30', label: '30 dias', days: 30 },
  { id: 'all', label: 'Tudo', days: null }
] as const;

const formatDuration = (minutes: number) => minutes < 60
  ? `${minutes} min`
  : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ''}`;

const change = (current: number, previous: number) => previous === 0
  ? (current > 0 ? 100 : 0)
  : Math.round(((current - previous) / previous) * 100);

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
  const [showCalibration, setShowCalibration] = useState(false);
  const selected = PERIOD_OPTIONS.find((item) => item.id === period)!;

  const filteredLogs = useMemo(() => {
    if (!selected.days) return [...workoutLogs].sort((a, b) => +new Date(b.completedAt) - +new Date(a.completedAt));
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - selected.days + 1);
    return workoutLogs
      .filter((log) => new Date(log.completedAt) >= cutoff)
      .sort((a, b) => +new Date(b.completedAt) - +new Date(a.completedAt));
  }, [workoutLogs, selected.days]);

  const previousLogs = useMemo(() => {
    if (!selected.days) return [];
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() - selected.days + 1);
    const start = new Date(end);
    start.setDate(start.getDate() - selected.days);
    return workoutLogs.filter((log) => new Date(log.completedAt) >= start && new Date(log.completedAt) < end);
  }, [workoutLogs, selected.days]);

  const metrics = useMemo(() => {
    const minutes = filteredLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
    const shots = filteredLogs.reduce((sum, log) => sum + (log.shotsMade || 0), 0);
    const previousMinutes = previousLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
    const previousShots = previousLogs.reduce((sum, log) => sum + (log.shotsMade || 0), 0);
    const activeDays = new Set(filteredLogs.map((log) => new Date(log.completedAt).toDateString())).size;

    return {
      sessions: filteredLogs.length,
      minutes,
      shots,
      activeDays,
      avgMinutes: filteredLogs.length ? Math.round(minutes / filteredLogs.length) : 0,
      xpEarned: filteredLogs.reduce((sum, log) => sum + log.xpEarned, 0),
      sessionsChange: change(filteredLogs.length, previousLogs.length),
      minutesChange: change(minutes, previousMinutes),
      shotsChange: change(shots, previousShots)
    };
  }, [filteredLogs, previousLogs]);

  const weeklyBars = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const logs = workoutLogs.filter((log) => new Date(log.completedAt) >= date && new Date(log.completedAt) < next);
    return {
      label: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').slice(0, 3).toUpperCase(),
      fullLabel: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      minutes: logs.reduce((sum, log) => sum + log.durationMinutes, 0),
      sessions: logs.length
    };
  }), [workoutLogs]);

  const maxDay = Math.max(...weeklyBars.map((item) => item.minutes), 1);

  const consistencyDays = useMemo(() => Array.from({ length: 28 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (27 - index));
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const logs = workoutLogs.filter((log) => new Date(log.completedAt) >= date && new Date(log.completedAt) < next);
    const minutes = logs.reduce((sum, log) => sum + log.durationMinutes, 0);
    return { date, minutes, sessions: logs.length };
  }), [workoutLogs]);

  const consistencyCount = consistencyDays.filter((day) => day.sessions > 0).length;

  const categoryVolume = useMemo(() => {
    const map = new Map<string, { key: string; label: string; minutes: number; sessions: number }>();
    filteredLogs.forEach((log) => {
      const workout = getWorkoutById(log.workoutId);
      const key = workout?.category || 'complete';
      const current = map.get(key) || {
        key,
        label: workout?.categoryLabel || 'Completo',
        minutes: 0,
        sessions: 0
      };
      current.minutes += log.durationMinutes;
      current.sessions += 1;
      map.set(key, current);
    });
    return [...map.values()].sort((a, b) => b.minutes - a.minutes);
  }, [filteredLogs, getWorkoutById]);

  const maxCategory = Math.max(...categoryVolume.map((item) => item.minutes), 1);
  const mainCategory = categoryVolume[0];
  const activeGoals = goals.filter((goal) => !goal.completed).slice(0, 3);
  const recentSessions = filteredLogs.slice(0, 5);

  const periodLabel = selected.days ? `últimos ${selected.days} dias` : 'histórico completo';
  const consistencyLabel = consistencyCount >= 12
    ? 'Rotina forte'
    : consistencyCount >= 7
      ? 'Ritmo consistente'
      : consistencyCount >= 3
        ? 'Ritmo em construção'
        : 'Começando a sequência';

  const ChangeIndicator = ({ value }: { value: number }) => {
    if (!selected.days) return <span className="cl-copy-small text-[#707985]">histórico total</span>;
    if (value > 0) return <span className="cl-copy-small text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" />+{value}%</span>;
    if (value < 0) return <span className="cl-copy-small text-amber-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" />{value}%</span>;
    return <span className="cl-copy-small text-[#707985] flex items-center gap-1"><Minus className="w-3 h-3" />estável</span>;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-10 cl-view-enter">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-white/[0.06]">
        <div className="max-w-3xl">
          <span className="cl-eyebrow text-[#FF6B1A]">Performance do atleta</span>
          <h1 className="cl-page-title text-white mt-1">SUA EVOLUÇÃO</h1>
          <p className="cl-copy mt-3 max-w-2xl">Veja seu desenvolvimento como atleta: consistência, volume de quadra, foco técnico e sessões que estão construindo o seu jogo.</p>
        </div>
        <div className="flex gap-1 border-b border-white/[0.08] self-start lg:self-auto">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setPeriod(option.id)}
              className={`px-4 py-2 cl-button-text border-b-2 ${period === option.id ? 'border-[#FF6B1A] text-white' : 'border-transparent text-[#7D8792] hover:text-white'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <section className="relative overflow-hidden border-y border-white/[0.07] py-6 sm:py-8">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#FF6B1A]/[0.06] to-transparent pointer-events-none" />
        <div className="relative grid lg:grid-cols-[1.25fr_0.75fr] gap-8 lg:gap-12 items-end">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="cl-label text-[#7E8995]">Pulso de desenvolvimento · {periodLabel}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading leading-[0.92] text-white max-w-3xl">
              {metrics.sessions > 0 ? consistencyLabel.toUpperCase() : 'SEU PRÓXIMO TREINO COMEÇA A HISTÓRIA'}
            </h2>
            <p className="cl-copy mt-4 max-w-2xl">
              {metrics.sessions > 0
                ? `${metrics.sessions} sessões, ${formatDuration(metrics.minutes)} de quadra e média de ${metrics.avgMinutes} min por treino. ${mainCategory ? `${mainCategory.label} foi seu principal foco neste período.` : ''}`
                : 'Conclua uma sessão no Modo Quadra para começar a transformar treino em histórico de evolução.'}
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/[0.07] border-l border-white/[0.07]">
            <div className="px-4 sm:px-5">
              <span className="cl-label text-[#707985] block">Dias ativos</span>
              <strong className="cl-metric text-white block mt-2">{metrics.activeDays}</strong>
            </div>
            <div className="px-4 sm:px-5">
              <span className="cl-label text-[#707985] block">Sequência</span>
              <strong className="cl-metric text-white block mt-2">{currentStreakDays}</strong>
              <span className="cl-copy-small text-[#707985]">dias</span>
            </div>
            <div className="px-4 sm:px-5">
              <span className="cl-label text-[#707985] block">XP período</span>
              <strong className="cl-metric text-[#FF8D4D] block mt-2">+{metrics.xpEarned}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 border-y border-white/[0.06] lg:divide-x divide-white/[0.06]">
        {[
          ['Sessões', metrics.sessions, <ChangeIndicator value={metrics.sessionsChange} />],
          ['Tempo treinado', formatDuration(metrics.minutes), <ChangeIndicator value={metrics.minutesChange} />],
          ['Arremessos', metrics.shots, <ChangeIndicator value={metrics.shotsChange} />],
          ['Recorde', `${longestStreakDays} dias`, <span className="cl-copy-small text-[#707985]">maior sequência</span>]
        ].map(([label, value, detail]) => (
          <div key={String(label)} className="p-4 sm:p-5 first:pl-0 even:lg:px-5 border-b lg:border-b-0 border-white/[0.06]">
            <span className="cl-label text-[#737D88]">{label}</span>
            <strong className="cl-metric text-white block mt-2">{value}</strong>
            <div className="mt-1">{detail}</div>
          </div>
        ))}
      </section>

      <section className="grid xl:grid-cols-[1.35fr_0.65fr] gap-8 xl:gap-12">
        <div>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <span className="cl-eyebrow text-[#FF6B1A]">Ritmo de quadra</span>
              <h2 className="cl-section-title text-white">ÚLTIMOS 7 DIAS</h2>
            </div>
            <span className="cl-copy-small text-[#7D8792]">{weeklyBars.filter((day) => day.minutes > 0).length}/7 dias ativos</span>
          </div>

          <div className="h-64 flex items-end gap-2 sm:gap-4 border-b border-white/[0.08] pb-7">
            {weeklyBars.map((day) => (
              <div key={day.fullLabel} className="flex-1 min-w-0 flex flex-col items-center justify-end h-full gap-2 group">
                <span className={`cl-copy-small font-mono-num ${day.minutes ? 'text-white' : 'text-[#4E5863]'}`}>{day.minutes ? `${day.minutes}m` : '—'}</span>
                <div className="relative w-full max-w-14 h-full flex items-end justify-center">
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${day.minutes ? 'bg-[#FF6B1A] group-hover:bg-[#FF7A2E]' : 'bg-white/[0.035]'}`}
                    style={{ height: day.minutes ? `${Math.max(8, day.minutes / maxDay * 100)}%` : '4%' }}
                    title={`${day.fullLabel}: ${day.minutes} min`}
                  />
                </div>
                <span className="cl-label text-[#707985]">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:border-l xl:border-white/[0.07] xl:pl-8">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <span className="cl-eyebrow text-[#FF6B1A]">Consistência</span>
              <h2 className="cl-section-title text-white">28 DIAS</h2>
            </div>
            <div className="text-right">
              <strong className="cl-metric text-white block">{consistencyCount}</strong>
              <span className="cl-copy-small text-[#707985]">dias com treino</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2" aria-label="Mapa de consistência dos últimos 28 dias">
            {consistencyDays.map((day) => {
              const intensity = day.minutes >= 60 ? 1 : day.minutes >= 35 ? 0.75 : day.minutes > 0 ? 0.45 : 0;
              return (
                <div
                  key={day.date.toISOString()}
                  className="aspect-square rounded-md border border-white/[0.04]"
                  style={{ backgroundColor: intensity ? `rgba(255, 107, 26, ${intensity})` : 'rgba(255,255,255,0.035)' }}
                  title={`${day.date.toLocaleDateString('pt-BR')}: ${day.minutes} min`}
                />
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between cl-copy-small text-[#707985]">
            <span>4 semanas atrás</span>
            <span>Hoje</span>
          </div>
          <p className="cl-copy-small mt-5">Consistência importa mais que picos isolados. O objetivo visual aqui é construir uma sequência sustentável de dias em quadra.</p>
        </div>
      </section>

      {filteredLogs.length === 0 ? (
        <section className="py-14 text-center border-y border-dashed border-white/[0.08]">
          <Activity className="w-9 h-9 text-[#FF6B1A] mx-auto" />
          <h2 className="cl-section-title text-white mt-3">SEU HISTÓRICO COMEÇA NO PRÓXIMO TREINO</h2>
          <p className="cl-copy mt-2">Conclua uma sessão no Modo Quadra para alimentar esta tela.</p>
        </section>
      ) : (
        <section className="grid lg:grid-cols-[0.72fr_1.28fr] gap-8 lg:gap-12 pt-6 border-t border-white/[0.06]">
          <div>
            <span className="cl-eyebrow text-[#FF6B1A]">Distribuição técnica</span>
            <h2 className="cl-section-title text-white mb-2">ONDE VOCÊ INVESTIU TEMPO</h2>
            <p className="cl-copy-small mb-6">A cor identifica o fundamento; o comprimento mostra quanto do seu período foi dedicado a ele.</p>
            <div className="space-y-5">
              {categoryVolume.map((item) => {
                const visual = getCategoryVisual(item.key as any);
                return (
                  <div key={item.key}>
                    <div className="flex justify-between items-end gap-3 mb-2">
                      <div>
                        <span className="cl-label" style={{ color: visual.accent }}>{visual.label}</span>
                        <span className="cl-copy-small text-white block mt-0.5">{item.label}</span>
                      </div>
                      <span className="cl-copy-small font-mono-num text-[#A5AEB8]">{formatDuration(item.minutes)}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.max(6, item.minutes / maxCategory * 100)}%`, backgroundColor: visual.accent }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-3 mb-5">
              <div>
                <span className="cl-eyebrow text-[#FF6B1A]">Mapa técnico</span>
                <h2 className="cl-section-title text-white">SEU JOGO HOJE</h2>
              </div>
              <button onClick={() => setShowCalibration((value) => !value)} className="cl-button-text text-[#FF8D4D] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />{showCalibration ? 'Fechar' : 'Calibrar'}
              </button>
            </div>

            <div className="grid md:grid-cols-[1fr_0.9fr] gap-7 items-center">
              <div className="flex justify-center overflow-hidden"><RadarSkillChart skills={skillsRating} size={330} /></div>
              <div className="space-y-6">
                <div className="border-l-2 border-emerald-400 pl-4">
                  <span className="cl-label text-[#737D88]">Maior força</span>
                  <strong className="text-2xl font-heading text-white block mt-1">{topStrength.name}</strong>
                  <span className="cl-number text-emerald-400">{topStrength.score.toFixed(1)} / 10</span>
                </div>
                <div className="border-l-2 border-[#FF6B1A] pl-4">
                  <span className="cl-label text-[#737D88]">Próximo foco</span>
                  <strong className="text-2xl font-heading text-white block mt-1">{mainFocusArea.name}</strong>
                  <span className="cl-number text-[#FF8D4D]">{mainFocusArea.score.toFixed(1)} / 10</span>
                </div>
              </div>
            </div>

            {showCalibration && (
              <div className="mt-7 pt-6 border-t border-white/[0.06] grid sm:grid-cols-2 gap-x-6 gap-y-5 cl-view-enter">
                {skillsRating.map((skill) => (
                  <label key={skill.key}>
                    <div className="flex justify-between cl-copy-small mb-1.5">
                      <span className="text-white">{skill.name}</span>
                      <span className="text-[#FF8D4D] font-mono-num">{skill.score.toFixed(1)}</span>
                    </div>
                    <input type="range" min="0" max="10" step="0.1" value={skill.score} onChange={(event) => updateSkillRating(skill.key, Number(event.target.value))} className="w-full accent-[#FF6B1A]" />
                  </label>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="grid xl:grid-cols-[1.35fr_0.65fr] gap-8 xl:gap-12 pt-7 border-t border-white/[0.06]">
        <div>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <span className="cl-eyebrow text-[#FF6B1A]">Linha de evolução</span>
              <h2 className="cl-section-title text-white">SESSÕES RECENTES</h2>
            </div>
            <span className="cl-copy-small text-[#7D8792]">{filteredLogs.length} no período</span>
          </div>

          <div className="relative ml-2">
            <div className="absolute left-[7px] top-3 bottom-4 w-px bg-white/[0.08]" />
            <div className="space-y-0">
              {recentSessions.map((log, index) => {
                const workout = getWorkoutById(log.workoutId);
                const visual = getCategoryVisual((workout?.category || 'complete') as any);
                return (
                  <article key={log.id} className="relative pl-8 py-4 border-b border-white/[0.05] last:border-b-0">
                    <span className="absolute left-0 top-6 w-[15px] h-[15px] rounded-full border-[3px] border-[#080A0D]" style={{ backgroundColor: visual.accent }} />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="cl-label" style={{ color: visual.accent }}>{workout?.categoryLabel || 'Treino'} · {new Date(log.completedAt).toLocaleDateString('pt-BR')}</span>
                        <h3 className="cl-card-title text-white mt-1">{log.workoutTitle}</h3>
                        <p className="cl-copy-small mt-1">{log.exercisesCompleted} exercícios · {log.totalSets} séries · {log.perceivedDifficulty}</p>
                      </div>
                      <div className="flex items-center gap-5 shrink-0">
                        <span className="cl-copy-small"><b className="cl-number text-white">{log.durationMinutes}</b> min</span>
                        <span className="cl-copy-small text-emerald-400 font-mono-num">+{log.xpEarned} XP</span>
                      </div>
                    </div>
                    {index === 0 && <span className="inline-flex items-center gap-1 mt-2 cl-label text-[#7D8792]"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />Sessão mais recente</span>}
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="xl:border-l xl:border-white/[0.07] xl:pl-8 space-y-7">
          <div className="pb-6 border-b border-white/[0.06]">
            <span className="cl-label text-[#737D88]">Nível CourtLab</span>
            <div className="flex items-end justify-between mt-2">
              <div>
                <h3 className="text-3xl font-heading text-white">{tier}</h3>
                <span className="cl-copy-small">{xp} XP acumulado</span>
              </div>
              <Trophy className="w-7 h-7 text-[#FF6B1A]" />
            </div>
            <span className="cl-copy-small text-emerald-400 block mt-3">+{metrics.xpEarned} XP no período</span>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="cl-label text-[#737D88]">Metas ativas</span>
                <h3 className="text-xl font-heading text-white mt-1">PRÓXIMOS MARCOS</h3>
              </div>
              <Target className="w-5 h-5 text-[#FF6B1A]" />
            </div>
            <div className="space-y-5 mt-4">
              {activeGoals.length ? activeGoals.map((goal) => {
                const progress = Math.min(100, Math.round(goal.currentValue / Math.max(1, goal.targetValue) * 100));
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between gap-3 cl-copy-small">
                      <span className="text-white line-clamp-1">{goal.title}</span>
                      <span className="text-[#FF8D4D] font-mono-num">{progress}%</span>
                    </div>
                    <div className="h-1 bg-white/[0.06] mt-2 overflow-hidden">
                      <div className="h-full bg-[#FF6B1A]" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                );
              }) : <span className="cl-copy-small">Nenhuma meta ativa.</span>}
            </div>
          </div>

          <div className="pt-5 border-t border-white/[0.06] flex items-start gap-3">
            <CalendarDays className="w-5 h-5 text-[#FF8D4D] mt-0.5 shrink-0" />
            <div>
              <span className="cl-label text-[#737D88]">Leitura do período</span>
              <p className="cl-copy-small mt-1">{metrics.sessions ? `Você treinou em ${metrics.activeDays} dias e acumulou ${formatDuration(metrics.minutes)} de prática. Use o mapa técnico para decidir onde colocar a próxima sessão.` : 'Comece registrando uma sessão completa para receber uma leitura real do período.'}</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
