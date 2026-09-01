import React, { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, Flame, Plus, Sparkles, Target, Trophy, X } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { Goal } from '../types';

type GoalCategory = Goal['category'];
const CATEGORY_OPTIONS: { value: GoalCategory; label: string; unit: string }[] = [
  { value: 'treinos', label: 'Sessões', unit: 'treinos' },
  { value: 'tempo', label: 'Tempo', unit: 'minutos' },
  { value: 'arremessos', label: 'Arremessos', unit: 'arremessos' },
  { value: 'repeticoes', label: 'Repetições', unit: 'repetições' },
  { value: 'fundamento', label: 'Fundamento', unit: 'treinos' },
  { value: 'sequencia', label: 'Sequência', unit: 'dias' },
  { value: 'custom', label: 'Personalizada', unit: 'unidades' }
];

const formatDate = (date?: string) => date ? new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'Sem prazo';

export const Goals: React.FC = () => {
  const { goals, addGoal, updateGoalProgress, workoutLogs, mainFocusArea, currentStreakDays, longestStreakDays, xp, tier } = usePlayer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('treinos');
  const [newTarget, setNewTarget] = useState(4);
  const [newUnit, setNewUnit] = useState('treinos');
  const [newDeadline, setNewDeadline] = useState('');

  const startOfWeek = useMemo(() => { const now = new Date(); const day = now.getDay() === 0 ? 7 : now.getDay(); now.setDate(now.getDate() - day + 1); now.setHours(0,0,0,0); return now; }, []);
  const weekLogs = useMemo(() => workoutLogs.filter((log) => new Date(log.completedAt) >= startOfWeek), [workoutLogs, startOfWeek]);
  const weekly = useMemo(() => ({ workouts: weekLogs.length, minutes: weekLogs.reduce((s,l)=>s+l.durationMinutes,0), shots: weekLogs.reduce((s,l)=>s+(l.shotsMade||0),0), reps: weekLogs.reduce((s,l)=>s+(l.totalReps||0),0) }), [weekLogs]);

  const automaticValue = (goal: Goal) => {
    if (goal.category === 'treinos') return Math.max(goal.currentValue, weekly.workouts);
    if (goal.category === 'tempo') return Math.max(goal.currentValue, weekly.minutes);
    if (goal.category === 'arremessos') return Math.max(goal.currentValue, weekly.shots);
    if (goal.category === 'repeticoes') return Math.max(goal.currentValue, weekly.reps);
    if (goal.category === 'sequencia') return Math.max(goal.currentValue, currentStreakDays);
    return goal.currentValue;
  };

  const enriched = goals.map((goal) => { const value = automaticValue(goal); return { ...goal, effectiveCurrent: value, effectiveCompleted: goal.completed || value >= goal.targetValue }; });
  const active = enriched.filter((goal) => !goal.effectiveCompleted);
  const completed = enriched.filter((goal) => goal.effectiveCompleted);
  const overall = enriched.length ? Math.round(enriched.reduce((sum, goal) => sum + Math.min(1, goal.effectiveCurrent / Math.max(1, goal.targetValue)), 0) / enriched.length * 100) : 0;
  const automaticCategories = new Set<GoalCategory>(['treinos','tempo','arremessos','repeticoes','sequencia']);

  const suggestion = useMemo(() => {
    const focus = mainFocusArea.name.toLowerCase();
    if (focus.includes('arrem')) return { title: 'Converter 300 arremessos esta semana', category: 'arremessos' as GoalCategory, target: 300, unit: 'arremessos' };
    if (focus.includes('condicion') || focus.includes('defesa') || focus.includes('explos')) return { title: 'Acumular 150 minutos de treino', category: 'tempo' as GoalCategory, target: 150, unit: 'minutos' };
    return { title: `Fazer 3 sessões focadas em ${mainFocusArea.name}`, category: 'fundamento' as GoalCategory, target: 3, unit: 'treinos' };
  }, [mainFocusArea]);

  const applySuggestion = () => { setNewTitle(suggestion.title); setNewCategory(suggestion.category); setNewTarget(suggestion.target); setNewUnit(suggestion.unit); setIsModalOpen(true); };
  const handleCategoryChange = (category: GoalCategory) => { setNewCategory(category); const option = CATEGORY_OPTIONS.find((item) => item.value === category); if (option) setNewUnit(option.unit); };
  const handleCreate = (event: React.FormEvent) => { event.preventDefault(); if (!newTitle.trim() || newTarget <= 0) return; addGoal({ title: newTitle.trim(), category: newCategory, targetValue: newTarget, currentValue: 0, unit: newUnit.trim() || 'unidades', deadline: newDeadline || undefined, iconName: newCategory === 'arremessos' ? 'Target' : 'Award' }); setNewTitle(''); setNewCategory('treinos'); setNewTarget(4); setNewUnit('treinos'); setNewDeadline(''); setIsModalOpen(false); };

  return <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]"><div><span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FF6B1A]">Direção de desenvolvimento</span><h1 className="text-4xl sm:text-5xl font-heading text-white leading-none mt-1">METAS</h1><p className="text-sm text-[#909AA6] mt-3 max-w-2xl">Objetivos claros, progresso visível e menos ruído visual. O foco é saber o que falta fazer e qual alvo vem depois.</p></div><button onClick={() => setIsModalOpen(true)} className="min-h-11 px-5 rounded-xl bg-[#FF6B1A] text-white text-xs font-bold uppercase flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Nova meta</button></header>

    <section className="grid grid-cols-2 lg:grid-cols-4 border-y border-white/[0.06] lg:divide-x divide-white/[0.06]">{[
      ['Metas ativas', active.length, `${completed.length} concluídas`],
      ['Progresso geral', `${overall}%`, 'dos alvos atuais'],
      ['Esta semana', weekly.workouts, `${weekly.minutes} min treinados`],
      ['Sequência', `${currentStreakDays} dias`, `recorde ${longestStreakDays}`]
    ].map(([label,value,detail]) => <div key={String(label)} className="p-4 sm:p-5"><span className="text-[10px] uppercase font-bold text-[#737D88]">{label}</span><strong className={`text-2xl sm:text-3xl font-heading block mt-2 ${label === 'Progresso geral' ? 'text-[#FF6B1A]' : 'text-white'}`}>{value}</strong><span className="text-[11px] text-[#707985]">{detail}</span></div>)}</section>

    <section className="py-5 border-y border-[#FF6B1A]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-5"><div className="max-w-2xl"><span className="text-[10px] uppercase font-bold tracking-wider text-[#FF8D4D] flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />Meta sugerida pelo diagnóstico</span><h2 className="text-2xl font-heading text-white mt-1">{suggestion.title}</h2><p className="text-sm text-[#8F98A4] mt-1">Seu foco atual é {mainFocusArea.name}. Essa meta cria um alvo simples para transformar diagnóstico em rotina.</p></div><button onClick={applySuggestion} className="text-xs font-bold text-[#FF8D4D] flex items-center gap-2">Usar esta meta <ArrowRight className="w-4 h-4" /></button></section>

    <section><div className="flex items-end justify-between gap-3 mb-4"><div><span className="text-[10px] uppercase font-bold text-[#FF6B1A]">Em andamento</span><h2 className="text-2xl font-heading text-white">Seus alvos atuais</h2></div>{completed.length > 0 && <button onClick={() => setShowCompleted((v)=>!v)} className="text-xs font-bold text-[#8F98A4]">{showCompleted ? 'Ocultar concluídas' : `Ver concluídas (${completed.length})`}</button>}</div>
      {active.length === 0 ? <div className="py-12 text-center border-y border-dashed border-white/[0.08]"><Trophy className="w-8 h-8 text-[#FF6B1A] mx-auto" /><h3 className="text-xl font-heading text-white mt-3">Nenhuma meta ativa</h3></div> : <div className="divide-y divide-white/[0.06]">{active.map((goal) => { const p = Math.min(100, Math.round(goal.effectiveCurrent / Math.max(1, goal.targetValue) * 100)); const auto = automaticCategories.has(goal.category); return <article key={goal.id} className="py-5 grid md:grid-cols-[1fr_220px_auto] gap-4 items-center"><div><div className="flex items-center gap-2"><span className="text-[10px] uppercase font-bold text-[#FF8D4D]">{CATEGORY_OPTIONS.find((item)=>item.value===goal.category)?.label || 'Meta'}</span>{auto && <span className="text-[9px] uppercase text-emerald-400">automática</span>}</div><h3 className="text-lg font-semibold text-white mt-1">{goal.title}</h3><span className="text-[11px] text-[#7D8792] flex items-center gap-1 mt-1"><CalendarDays className="w-3.5 h-3.5" />{formatDate(goal.deadline)}</span></div><div><div className="flex justify-between text-xs"><span className="text-[#9AA1AA]">{goal.effectiveCurrent} / {goal.targetValue} {goal.unit}</span><span className="text-[#FF8D4D]">{p}%</span></div><div className="h-1.5 bg-white/[0.06] mt-2 rounded-full"><div className="h-full bg-[#FF6B1A] rounded-full" style={{width:`${p}%`}} /></div></div>{!auto && <div className="flex gap-1.5"><button onClick={()=>updateGoalProgress(goal.id, goal.unit==='treinos'?1:10)} className="px-3 py-2 text-xs border border-white/[0.08] rounded-lg text-white">+{goal.unit==='treinos'?1:10}</button><button onClick={()=>updateGoalProgress(goal.id, goal.unit==='treinos'?2:25)} className="px-3 py-2 text-xs bg-[#FF6B1A]/10 rounded-lg text-[#FF8D4D]">+{goal.unit==='treinos'?2:25}</button></div>}</article>; })}</div>}
      {showCompleted && <div className="mt-6 divide-y divide-white/[0.06] border-t border-white/[0.06]">{completed.map((goal)=><div key={goal.id} className="py-4 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><div><h4 className="text-sm font-semibold text-white">{goal.title}</h4><span className="text-[11px] text-emerald-400">Meta concluída</span></div></div>)}</div>}
    </section>

    <section className="grid lg:grid-cols-[1fr_0.6fr] gap-8 pt-6 border-t border-white/[0.06]"><div><span className="text-[10px] uppercase text-[#737D88]">Semana atual</span><div className="grid grid-cols-4 divide-x divide-white/[0.06] mt-3">{[['Treinos',weekly.workouts],['Minutos',weekly.minutes],['Arremessos',weekly.shots],['Repetições',weekly.reps]].map(([l,v])=><div key={String(l)} className="px-3 first:pl-0"><strong className="text-2xl font-heading text-white block">{v}</strong><span className="text-[10px] uppercase text-[#737D88]">{l}</span></div>)}</div></div><div className="border-l border-white/[0.06] lg:pl-8"><span className="text-[10px] uppercase text-[#737D88]">Nível do atleta</span><h3 className="text-3xl font-heading text-white mt-1">{tier}</h3><span className="text-xs text-[#8F98A4]">{xp} XP acumulado</span><p className="text-sm text-[#FF8D4D] mt-4">Foco atual: {mainFocusArea.name}</p></div></section>

    {isModalOpen && <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4" onClick={()=>setIsModalOpen(false)}><form onSubmit={handleCreate} onClick={(e)=>e.stopPropagation()} className="w-full sm:max-w-lg bg-[#0D1014] border border-[#1F2630] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-4"><div className="flex items-center justify-between"><div><span className="text-[10px] uppercase text-[#FF6B1A]">Novo objetivo</span><h3 className="text-2xl font-heading text-white">Criar meta</h3></div><button type="button" onClick={()=>setIsModalOpen(false)}><X className="w-5 h-5 text-[#9AA1AA]" /></button></div><input value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="Ex: Fazer 4 treinos esta semana" className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-white" required /><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{CATEGORY_OPTIONS.map((option)=><button type="button" key={option.value} onClick={()=>handleCategoryChange(option.value)} className={`px-3 py-2.5 rounded-xl border text-xs text-left ${newCategory===option.value?'border-[#FF6B1A] text-white bg-[#FF6B1A]/10':'border-[#1F2630] text-[#9AA1AA]'}`}>{option.label}</button>)}</div><div className="grid grid-cols-2 gap-3"><input type="number" min="1" value={newTarget} onChange={(e)=>setNewTarget(Number(e.target.value))} className="px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-white" /><input value={newUnit} onChange={(e)=>setNewUnit(e.target.value)} className="px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-white" /></div><input type="date" value={newDeadline} onChange={(e)=>setNewDeadline(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-white" /><button type="submit" className="w-full py-3.5 rounded-xl bg-[#FF6B1A] text-white font-bold uppercase text-xs">Criar meta</button></form></div>}
  </div>;
};
