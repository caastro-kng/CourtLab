import React, { useMemo, useState } from 'react';
import { Activity, Clock3, Flame, Minus, SlidersHorizontal, Target, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { RadarSkillChart } from '../components/common/RadarSkillChart';

const PERIOD_OPTIONS = [
  { id: '7', label: '7 dias', days: 7 },
  { id: '30', label: '30 dias', days: 30 },
  { id: 'all', label: 'Tudo', days: null }
] as const;

const formatDuration = (minutes: number) => minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ''}`;
const change = (current: number, previous: number) => previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100);

export const Progress: React.FC = () => {
  const { skillsRating, updateSkillRating, topStrength, mainFocusArea, workoutLogs, xp, tier, currentStreakDays, longestStreakDays, getWorkoutById, goals } = usePlayer();
  const [period, setPeriod] = useState<'7' | '30' | 'all'>('7');
  const [showCalibration, setShowCalibration] = useState(false);
  const selected = PERIOD_OPTIONS.find((item) => item.id === period)!;

  const filteredLogs = useMemo(() => {
    if (!selected.days) return [...workoutLogs].sort((a, b) => +new Date(b.completedAt) - +new Date(a.completedAt));
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - selected.days);
    return workoutLogs.filter((log) => new Date(log.completedAt) >= cutoff).sort((a, b) => +new Date(b.completedAt) - +new Date(a.completedAt));
  }, [workoutLogs, selected.days]);

  const previousLogs = useMemo(() => {
    if (!selected.days) return [];
    const end = new Date(); end.setDate(end.getDate() - selected.days);
    const start = new Date(end); start.setDate(start.getDate() - selected.days);
    return workoutLogs.filter((log) => new Date(log.completedAt) >= start && new Date(log.completedAt) < end);
  }, [workoutLogs, selected.days]);

  const metrics = useMemo(() => {
    const minutes = filteredLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
    const shots = filteredLogs.reduce((sum, log) => sum + (log.shotsMade || 0), 0);
    const previousMinutes = previousLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
    const previousShots = previousLogs.reduce((sum, log) => sum + (log.shotsMade || 0), 0);
    return { sessions: filteredLogs.length, minutes, shots, xpEarned: filteredLogs.reduce((sum, log) => sum + log.xpEarned, 0), sessionsChange: change(filteredLogs.length, previousLogs.length), minutesChange: change(minutes, previousMinutes), shotsChange: change(shots, previousShots) };
  }, [filteredLogs, previousLogs]);

  const weeklyBars = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - index));
    const next = new Date(date); next.setDate(next.getDate() + 1);
    const logs = workoutLogs.filter((log) => new Date(log.completedAt) >= date && new Date(log.completedAt) < next);
    return { label: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').slice(0, 3).toUpperCase(), minutes: logs.reduce((sum, log) => sum + log.durationMinutes, 0) };
  }), [workoutLogs]);
  const maxDay = Math.max(...weeklyBars.map((item) => item.minutes), 1);

  const categoryVolume = useMemo(() => {
    const map = new Map<string, { label: string; minutes: number }>();
    filteredLogs.forEach((log) => {
      const workout = getWorkoutById(log.workoutId);
      const key = workout?.category || 'complete';
      const current = map.get(key) || { label: workout?.categoryLabel || 'Completo', minutes: 0 };
      current.minutes += log.durationMinutes;
      map.set(key, current);
    });
    return [...map.values()].sort((a, b) => b.minutes - a.minutes);
  }, [filteredLogs, getWorkoutById]);
  const maxCategory = Math.max(...categoryVolume.map((item) => item.minutes), 1);
  const activeGoals = goals.filter((goal) => !goal.completed).slice(0, 3);

  const ChangeIndicator = ({ value }: { value: number }) => {
    if (!selected.days) return <span className="text-[11px] text-[#707985]">histórico total</span>;
    if (value > 0) return <span className="text-[11px] text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" />+{value}%</span>;
    if (value < 0) return <span className="text-[11px] text-amber-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" />{value}%</span>;
    return <span className="text-[11px] text-[#707985] flex items-center gap-1"><Minus className="w-3 h-3" />estável</span>;
  };

  return <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
      <div><span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FF6B1A]">Performance do atleta</span><h1 className="text-4xl sm:text-5xl font-heading text-white leading-none mt-1">SUA EVOLUÇÃO</h1><p className="text-sm text-[#909AA6] mt-3 max-w-2xl">Volume, consistência e mapa técnico em uma leitura contínua, sem transformar seu treino em um painel cheio de caixas.</p></div>
      <div className="flex gap-1 border-b border-white/[0.08]">{PERIOD_OPTIONS.map((option) => <button key={option.id} onClick={() => setPeriod(option.id)} className={`px-4 py-2 text-xs font-bold uppercase border-b-2 ${period === option.id ? 'border-[#FF6B1A] text-white' : 'border-transparent text-[#7D8792]'}`}>{option.label}</button>)}</div>
    </header>

    <section className="grid grid-cols-2 lg:grid-cols-4 border-y border-white/[0.06] lg:divide-x divide-white/[0.06]">
      {[
        ['Sessões', metrics.sessions, <ChangeIndicator value={metrics.sessionsChange} />],
        ['Tempo treinado', formatDuration(metrics.minutes), <ChangeIndicator value={metrics.minutesChange} />],
        ['Arremessos', metrics.shots, <ChangeIndicator value={metrics.shotsChange} />],
        ['Sequência', `${currentStreakDays} dias`, <span className="text-[11px] text-[#707985]">recorde {longestStreakDays}</span>]
      ].map(([label, value, detail]) => <div key={String(label)} className="p-4 sm:p-5 first:pl-0 even:lg:px-5 border-b lg:border-b-0 border-white/[0.06]"><span className="text-[10px] uppercase font-bold text-[#737D88]">{label}</span><strong className="text-2xl sm:text-3xl font-heading text-white block mt-2">{value}</strong><div className="mt-1">{detail}</div></div>)}
    </section>

    {filteredLogs.length === 0 ? <section className="py-14 text-center border-y border-dashed border-white/[0.08]"><Activity className="w-9 h-9 text-[#FF6B1A] mx-auto" /><h2 className="text-xl font-heading text-white mt-3">Seu histórico começa no próximo treino</h2><p className="text-sm text-[#8F98A4] mt-2">Conclua uma sessão no Modo Quadra para alimentar esta tela.</p></section> : <section className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 py-2">
      <div><div className="flex items-end justify-between mb-5"><div><span className="text-[10px] uppercase font-bold text-[#FF6B1A]">Últimos 7 dias</span><h2 className="text-2xl font-heading text-white">Ritmo de treino</h2></div><span className="text-xs text-[#7D8792]">{weeklyBars.filter((d) => d.minutes > 0).length}/7 dias ativos</span></div><div className="h-52 flex items-end gap-3 border-b border-white/[0.08] pb-6">{weeklyBars.map((day) => <div key={day.label} className="flex-1 flex flex-col items-center justify-end h-full gap-2"><span className="text-[10px] text-[#7D8792]">{day.minutes ? `${day.minutes}m` : ''}</span><div className="w-full max-w-12 bg-[#FF6B1A] rounded-t-md min-h-1" style={{ height: `${Math.max(4, day.minutes / maxDay * 100)}%` }} /><span className="text-[10px] font-bold text-[#707985]">{day.label}</span></div>)}</div></div>
      <div><span className="text-[10px] uppercase font-bold text-[#FF6B1A]">Distribuição</span><h2 className="text-2xl font-heading text-white mb-5">Onde você treinou</h2><div className="space-y-4">{categoryVolume.map((item) => <div key={item.label}><div className="flex justify-between text-xs mb-1.5"><span className="font-semibold text-white">{item.label}</span><span className="text-[#8F98A4]">{formatDuration(item.minutes)}</span></div><div className="h-1.5 bg-white/[0.06] rounded-full"><div className="h-full bg-[#FF6B1A] rounded-full" style={{ width: `${Math.max(6, item.minutes / maxCategory * 100)}%` }} /></div></div>)}</div></div>
    </section>}

    <section className="grid xl:grid-cols-[1.25fr_0.75fr] gap-8 pt-4 border-t border-white/[0.06]">
      <div><div className="flex items-end justify-between gap-3 mb-4"><div><span className="text-[10px] uppercase font-bold text-[#FF6B1A]">Mapa técnico</span><h2 className="text-2xl font-heading text-white">Seu jogo hoje</h2></div><button onClick={() => setShowCalibration((v) => !v)} className="text-xs font-bold text-[#FF8D4D] flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" />{showCalibration ? 'Fechar' : 'Calibrar'}</button></div><div className="grid md:grid-cols-2 gap-6 items-center"><div className="flex justify-center overflow-hidden"><RadarSkillChart skills={skillsRating} size={320} /></div><div className="space-y-5"><div className="border-l-2 border-emerald-400 pl-4"><span className="text-[10px] uppercase text-[#737D88]">Maior força</span><strong className="text-xl text-white block">{topStrength.name}</strong><span className="text-emerald-400 font-mono-num">{topStrength.score.toFixed(1)}</span></div><div className="border-l-2 border-[#FF6B1A] pl-4"><span className="text-[10px] uppercase text-[#737D88]">Próximo foco</span><strong className="text-xl text-white block">{mainFocusArea.name}</strong><span className="text-[#FF8D4D] font-mono-num">{mainFocusArea.score.toFixed(1)}</span></div></div></div>{showCalibration && <div className="mt-6 pt-5 border-t border-white/[0.06] grid sm:grid-cols-2 gap-x-5 gap-y-4">{skillsRating.map((skill) => <label key={skill.key}><div className="flex justify-between text-xs mb-1"><span className="text-white">{skill.name}</span><span className="text-[#FF8D4D] font-mono-num">{skill.score.toFixed(1)}</span></div><input type="range" min="0" max="10" step="0.1" value={skill.score} onChange={(e) => updateSkillRating(skill.key, Number(e.target.value))} className="w-full accent-[#FF6B1A]" /></label>)}</div>}</div>
      <aside className="space-y-6"><div className="border-b border-white/[0.06] pb-5"><span className="text-[10px] uppercase text-[#737D88]">Nível CourtLab</span><div className="flex items-end justify-between"><div><h3 className="text-3xl font-heading text-white">{tier}</h3><span className="text-xs text-[#8F98A4]">{xp} XP acumulado</span></div><Trophy className="w-7 h-7 text-[#FF6B1A]" /></div><span className="text-xs text-emerald-400 block mt-2">+{metrics.xpEarned} XP no período</span></div><div><span className="text-[10px] uppercase text-[#737D88]">Metas ativas</span><div className="space-y-4 mt-3">{activeGoals.length ? activeGoals.map((goal) => { const p = Math.min(100, Math.round(goal.currentValue / Math.max(1, goal.targetValue) * 100)); return <div key={goal.id}><div className="flex justify-between text-xs"><span className="text-white line-clamp-1">{goal.title}</span><span className="text-[#FF8D4D]">{p}%</span></div><div className="h-1 bg-white/[0.06] mt-2"><div className="h-full bg-[#FF6B1A]" style={{ width: `${p}%` }} /></div></div>; }) : <span className="text-xs text-[#8F98A4]">Nenhuma meta ativa.</span>}</div></div></aside>
    </section>

    <section className="pt-6 border-t border-white/[0.06]"><div className="flex items-end justify-between mb-4"><div><span className="text-[10px] uppercase font-bold text-[#FF6B1A]">Histórico</span><h2 className="text-2xl font-heading text-white">Sessões registradas</h2></div><span className="text-xs text-[#7D8792]">{filteredLogs.length} no período</span></div><div className="divide-y divide-white/[0.06]">{filteredLogs.map((log) => <div key={log.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3"><div><span className="text-[10px] uppercase text-[#FF8D4D]">{getWorkoutById(log.workoutId)?.categoryLabel || 'Treino'} · {new Date(log.completedAt).toLocaleDateString('pt-BR')}</span><h3 className="text-base font-heading text-white mt-1">{log.workoutTitle}</h3><p className="text-[11px] text-[#7D8792]">{log.exercisesCompleted} exercícios · {log.totalSets} séries</p></div><div className="flex gap-5 text-xs"><span><b className="text-white">{log.durationMinutes}</b> min</span><span className="text-[#9AA1AA]">{log.perceivedDifficulty}</span><span className="text-emerald-400">+{log.xpEarned} XP</span></div></div>)}</div></section>
  </div>;
};
