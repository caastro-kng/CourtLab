import React, { useMemo, useState } from 'react';
import {
  Target,
  Plus,
  Flame,
  Award,
  CheckCircle2,
  Trophy,
  Sparkles,
  TrendingUp,
  X,
  CalendarDays,
  Clock3,
  Crosshair,
  Dumbbell,
  ArrowRight,
  Lightbulb,
  Gauge,
  CircleDot,
  TimerReset
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { Goal } from '../types';

type GoalCategory = Goal['category'];

type GoalSuggestion = {
  title: string;
  category: GoalCategory;
  targetValue: number;
  unit: string;
  iconName: string;
  reason: string;
};

const CATEGORY_OPTIONS: { value: GoalCategory; label: string; unit: string }[] = [
  { value: 'treinos', label: 'Sessões', unit: 'treinos' },
  { value: 'tempo', label: 'Tempo de treino', unit: 'minutos' },
  { value: 'arremessos', label: 'Arremessos', unit: 'arremessos' },
  { value: 'repeticoes', label: 'Repetições', unit: 'repetições' },
  { value: 'fundamento', label: 'Fundamento', unit: 'treinos' },
  { value: 'sequencia', label: 'Sequência', unit: 'dias' },
  { value: 'custom', label: 'Personalizada', unit: 'unidades' }
];

const formatDate = (date?: string) => {
  if (!date) return 'Sem prazo';
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

export const Goals: React.FC = () => {
  const {
    goals,
    addGoal,
    updateGoalProgress,
    workoutLogs,
    mainFocusArea,
    currentStreakDays,
    longestStreakDays,
    xp,
    tier
  } = usePlayer();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('treinos');
  const [newTarget, setNewTarget] = useState<number>(4);
  const [newUnit, setNewUnit] = useState('treinos');
  const [newDeadline, setNewDeadline] = useState('');

  const now = new Date();
  const startOfWeek = new Date(now);
  const weekday = now.getDay() === 0 ? 7 : now.getDay();
  startOfWeek.setDate(now.getDate() - weekday + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekLogs = useMemo(
    () => workoutLogs.filter((log) => new Date(log.completedAt) >= startOfWeek),
    [workoutLogs]
  );

  const weeklyMetrics = useMemo(() => ({
    workouts: weekLogs.length,
    minutes: weekLogs.reduce((sum, log) => sum + log.durationMinutes, 0),
    shots: weekLogs.reduce((sum, log) => sum + (log.shotsMade || 0), 0),
    reps: weekLogs.reduce((sum, log) => sum + (log.totalReps || 0), 0)
  }), [weekLogs]);

  const getAutomaticProgress = (goal: Goal) => {
    if (goal.category === 'treinos') return Math.max(goal.currentValue, weeklyMetrics.workouts);
    if (goal.category === 'tempo') return Math.max(goal.currentValue, weeklyMetrics.minutes);
    if (goal.category === 'arremessos' && goal.unit.toLowerCase().includes('arrem')) {
      return Math.max(goal.currentValue, weeklyMetrics.shots);
    }
    if (goal.category === 'repeticoes') return Math.max(goal.currentValue, weeklyMetrics.reps);
    if (goal.category === 'sequencia') return Math.max(goal.currentValue, currentStreakDays);
    return goal.currentValue;
  };

  const enrichedGoals = useMemo(() => goals.map((goal) => {
    const currentValue = getAutomaticProgress(goal);
    return {
      ...goal,
      effectiveCurrent: currentValue,
      effectiveCompleted: goal.completed || currentValue >= goal.targetValue
    };
  }), [goals, weeklyMetrics, currentStreakDays]);

  const activeGoals = enrichedGoals.filter((goal) => !goal.effectiveCompleted);
  const completedGoals = enrichedGoals.filter((goal) => goal.effectiveCompleted);
  const overallProgress = enrichedGoals.length
    ? Math.round(enrichedGoals.reduce((sum, goal) => sum + Math.min(1, goal.effectiveCurrent / goal.targetValue), 0) / enrichedGoals.length * 100)
    : 0;

  const suggestion: GoalSuggestion = useMemo(() => {
    const focus = mainFocusArea.name.toLowerCase();
    if (focus.includes('arremesso') || focus.includes('3 pontos') || focus.includes('mid')) {
      return { title: 'Converter 300 arremessos esta semana', category: 'arremessos', targetValue: 300, unit: 'arremessos', iconName: 'Target', reason: `Seu foco atual é ${mainFocusArea.name}. Mais volume técnico ajuda a criar consistência.` };
    }
    if (focus.includes('pick') || focus.includes('visão') || focus.includes('sem bola')) {
      return { title: `Fazer 3 sessões focadas em ${mainFocusArea.name}`, category: 'fundamento', targetValue: 3, unit: 'treinos', iconName: 'Award', reason: `${mainFocusArea.name} aparece como principal área a desenvolver na sua autoavaliação.` };
    }
    if (focus.includes('condicion') || focus.includes('defesa') || focus.includes('explos')) {
      return { title: 'Acumular 150 minutos de treino na semana', category: 'tempo', targetValue: 150, unit: 'minutos', iconName: 'Flame', reason: `Seu foco atual é ${mainFocusArea.name}. Consistência de volume é o primeiro passo para evoluir.` };
    }
    return { title: `Fazer 3 sessões focadas em ${mainFocusArea.name}`, category: 'fundamento', targetValue: 3, unit: 'treinos', iconName: 'Award', reason: `${mainFocusArea.name} é hoje seu principal ponto a desenvolver.` };
  }, [mainFocusArea]);

  const applySuggestion = () => {
    setNewTitle(suggestion.title);
    setNewCategory(suggestion.category);
    setNewTarget(suggestion.targetValue);
    setNewUnit(suggestion.unit);
    setIsModalOpen(true);
  };

  const handleCategoryChange = (category: GoalCategory) => {
    setNewCategory(category);
    const preset = CATEGORY_OPTIONS.find((item) => item.value === category);
    if (preset) setNewUnit(preset.unit);
    if (category === 'treinos') setNewTarget(4);
    if (category === 'tempo') setNewTarget(150);
    if (category === 'arremessos') setNewTarget(300);
    if (category === 'repeticoes') setNewTarget(500);
    if (category === 'sequencia') setNewTarget(5);
  };

  const handleCreateGoal = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTitle.trim() || newTarget <= 0) return;

    let initialProgress = 0;
    if (newCategory === 'treinos') initialProgress = weeklyMetrics.workouts;
    if (newCategory === 'tempo') initialProgress = weeklyMetrics.minutes;
    if (newCategory === 'arremessos' && newUnit.toLowerCase().includes('arrem')) initialProgress = weeklyMetrics.shots;
    if (newCategory === 'repeticoes') initialProgress = weeklyMetrics.reps;
    if (newCategory === 'sequencia') initialProgress = currentStreakDays;

    addGoal({
      title: newTitle.trim(),
      category: newCategory,
      targetValue: newTarget,
      currentValue: initialProgress,
      unit: newUnit.trim() || 'unidades',
      deadline: newDeadline || undefined,
      iconName: newCategory === 'arremessos' ? 'Target' : newCategory === 'treinos' ? 'Flame' : 'Award'
    });

    setNewTitle('');
    setNewCategory('treinos');
    setNewTarget(4);
    setNewUnit('treinos');
    setNewDeadline('');
    setIsModalOpen(false);
  };

  const achievements = useMemo(() => [
    { title: 'Primeiro Passo', desc: 'Complete sua primeira sessão no CourtLab', icon: '🏀', unlocked: workoutLogs.length >= 1 },
    { title: 'Chama Acesa', desc: 'Mantenha 4 dias consecutivos de treino', icon: '🔥', unlocked: currentStreakDays >= 4 },
    { title: 'Volume de Arremesso', desc: 'Registre 300 arremessos convertidos', icon: '🎯', unlocked: workoutLogs.reduce((sum, log) => sum + (log.shotsMade || 0), 0) >= 300 },
    { title: 'Rotina Sólida', desc: 'Complete 10 sessões de treino', icon: '💪', unlocked: workoutLogs.length >= 10 },
    { title: 'Semana Forte', desc: 'Acumule 180 minutos em uma semana', icon: '⏱️', unlocked: weeklyMetrics.minutes >= 180 },
    { title: 'All-Star Tier', desc: 'Alcance 2.500 XP na plataforma', icon: '⭐', unlocked: xp >= 2500 }
  ], [workoutLogs, currentStreakDays, weeklyMetrics.minutes, xp]);

  const automaticCategories = new Set<GoalCategory>(['treinos', 'tempo', 'arremessos', 'repeticoes', 'sequencia']);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">Direção de Desenvolvimento</span>
          <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">METAS</h1>
          <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1 max-w-2xl">
            Transforme seu treino em objetivos mensuráveis. Metas compatíveis com os registros da plataforma avançam automaticamente conforme você treina.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="py-3 px-5 rounded-2xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#FF6B1A]/20 flex items-center justify-center gap-2 self-start lg:self-auto">
          <Plus className="w-4 h-4" /> Nova meta
        </button>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Metas ativas</span>
          <strong className="text-2xl sm:text-3xl font-mono-num text-white block mt-1">{activeGoals.length}</strong>
          <span className="text-[11px] text-[#9AA1AA]">{completedGoals.length} concluídas</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Progresso geral</span>
          <strong className="text-2xl sm:text-3xl font-mono-num text-[#FF6B1A] block mt-1">{overallProgress}%</strong>
          <span className="text-[11px] text-[#9AA1AA]">dos alvos atuais</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Esta semana</span>
          <strong className="text-2xl sm:text-3xl font-mono-num text-white block mt-1">{weeklyMetrics.workouts}</strong>
          <span className="text-[11px] text-[#9AA1AA]">sessões • {weeklyMetrics.minutes} min</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Sequência</span>
          <strong className="text-2xl sm:text-3xl font-mono-num text-white block mt-1">{currentStreakDays} dias</strong>
          <span className="text-[11px] text-[#9AA1AA]">recorde: {longestStreakDays}</span>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-[#FF6B1A]/30 bg-[#12161C] p-5 sm:p-6">
        <div className="absolute -right-12 -top-16 w-44 h-44 rounded-full bg-[#FF6B1A]/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF8D4D] flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Meta sugerida pelo seu diagnóstico</span>
            <h2 className="text-xl sm:text-2xl font-heading text-white mt-2">{suggestion.title}</h2>
            <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1 leading-relaxed">{suggestion.reason}</p>
          </div>
          <button onClick={applySuggestion} className="px-4 py-3 rounded-xl border border-[#FF6B1A]/40 bg-[#FF6B1A]/10 hover:bg-[#FF6B1A] text-[#FF8D4D] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors whitespace-nowrap">
            Usar esta meta <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A]">Em andamento</span>
            <h2 className="text-xl sm:text-2xl font-heading text-white">Seus alvos atuais</h2>
          </div>
          {completedGoals.length > 0 && (
            <button onClick={() => setShowCompleted((value) => !value)} className="text-xs font-bold text-[#9AA1AA] hover:text-white transition-colors">
              {showCompleted ? 'Ocultar concluídas' : `Ver concluídas (${completedGoals.length})`}
            </button>
          )}
        </div>

        {activeGoals.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-[#2B3542] bg-[#0D1014] text-center">
            <Trophy className="w-9 h-9 text-[#FF6B1A] mx-auto mb-3" />
            <h3 className="font-heading text-xl text-white">Nenhuma meta ativa</h3>
            <p className="text-xs text-[#9AA1AA] mt-1">Crie um novo objetivo ou use a sugestão acima para direcionar sua próxima semana.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.map((goal) => {
              const percentage = Math.min(100, Math.round((goal.effectiveCurrent / goal.targetValue) * 100));
              const remaining = Math.max(0, goal.targetValue - goal.effectiveCurrent);
              const autoTracked = automaticCategories.has(goal.category) && !(goal.category === 'arremessos' && !goal.unit.toLowerCase().includes('arrem'));
              return (
                <article key={goal.id} className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF8D4D] bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 rounded-md px-2 py-0.5">{CATEGORY_OPTIONS.find((item) => item.value === goal.category)?.label || 'Meta'}</span>
                        {autoTracked && <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-400/10 rounded-md px-2 py-0.5">automática</span>}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{goal.title}</h3>
                    </div>
                    <span className="text-sm font-mono-num font-bold text-[#FF6B1A]">{percentage}%</span>
                  </div>

                  <div>
                    <div className="w-full bg-[#11151A] rounded-full h-2 overflow-hidden border border-[#1F2630]">
                      <div className="h-full rounded-full bg-[#FF6B1A] transition-all duration-500" style={{ width: `${percentage}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#9AA1AA] mt-2">
                      <span><strong className="text-white font-mono-num">{goal.effectiveCurrent}</strong> / {goal.targetValue} {goal.unit}</span>
                      <span>faltam <strong className="text-white">{remaining}</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1F2630] flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[#9AA1AA] flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(goal.deadline)}</span>
                    {!autoTracked && (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateGoalProgress(goal.id, goal.unit === 'treinos' ? 1 : 10)} className="px-2.5 py-1.5 rounded-lg bg-[#15191F] border border-[#2B3542] text-xs font-mono-num font-bold text-white hover:border-[#FF6B1A]/50">+{goal.unit === 'treinos' ? 1 : 10}</button>
                        <button onClick={() => updateGoalProgress(goal.id, goal.unit === 'treinos' ? 2 : 25)} className="px-2.5 py-1.5 rounded-lg bg-[#FF6B1A]/15 border border-[#FF6B1A]/30 text-xs font-mono-num font-bold text-[#FF8D4D] hover:bg-[#FF6B1A] hover:text-white">+{goal.unit === 'treinos' ? 2 : 25}</button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {showCompleted && completedGoals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="p-4 rounded-2xl bg-[#11151A] border border-emerald-500/20 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{goal.title}</h4>
                  <span className="text-[11px] text-emerald-400">Meta concluída • {goal.targetValue} {goal.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A]">Semana atual</span>
              <h2 className="text-xl font-heading text-white">O que seus treinos já registraram</h2>
            </div>
            <TrendingUp className="w-5 h-5 text-[#FF6B1A]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#15191F] border border-[#1F2630]"><Dumbbell className="w-4 h-4 text-[#FF6B1A] mb-2" /><strong className="font-mono-num text-xl text-white block">{weeklyMetrics.workouts}</strong><span className="text-[10px] text-[#9AA1AA] uppercase">Treinos</span></div>
            <div className="p-3 rounded-xl bg-[#15191F] border border-[#1F2630]"><Clock3 className="w-4 h-4 text-[#FF6B1A] mb-2" /><strong className="font-mono-num text-xl text-white block">{weeklyMetrics.minutes}</strong><span className="text-[10px] text-[#9AA1AA] uppercase">Minutos</span></div>
            <div className="p-3 rounded-xl bg-[#15191F] border border-[#1F2630]"><Crosshair className="w-4 h-4 text-[#FF6B1A] mb-2" /><strong className="font-mono-num text-xl text-white block">{weeklyMetrics.shots}</strong><span className="text-[10px] text-[#9AA1AA] uppercase">Arremessos</span></div>
            <div className="p-3 rounded-xl bg-[#15191F] border border-[#1F2630]"><CircleDot className="w-4 h-4 text-[#FF6B1A] mb-2" /><strong className="font-mono-num text-xl text-white block">{weeklyMetrics.reps}</strong><span className="text-[10px] text-[#9AA1AA] uppercase">Repetições</span></div>
          </div>
        </div>

        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A]">Nível do atleta</span>
          <div className="flex items-end justify-between mt-2 gap-3">
            <div><h2 className="text-3xl font-heading text-white">{tier}</h2><span className="text-xs font-mono-num text-[#9AA1AA]">{xp} XP acumulado</span></div>
            <Gauge className="w-8 h-8 text-[#FF6B1A]" />
          </div>
          <div className="mt-5 p-3 rounded-xl bg-[#15191F] border border-[#1F2630]">
            <span className="text-[10px] uppercase text-[#9AA1AA]">Foco técnico atual</span>
            <strong className="text-sm text-[#FF8D4D] block mt-1">{mainFocusArea.name} • {mainFocusArea.score.toFixed(1)}/10</strong>
          </div>
        </div>
      </section>

      <section className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-5">
        <div>
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A]">Conquistas reais</span>
          <h2 className="text-xl sm:text-2xl font-heading text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-[#FF8D4D]" /> Marcos do atleta</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((item) => (
            <div key={item.title} className={`p-4 rounded-2xl border flex items-center gap-3 ${item.unlocked ? 'bg-[#15191F] border-emerald-500/25' : 'bg-[#11151A] border-[#1F2630] opacity-50'}`}>
              <div className="w-11 h-11 rounded-xl bg-[#0D1014] border border-[#2B3542] flex items-center justify-center text-xl">{item.icon}</div>
              <div><div className="flex items-center gap-1.5"><h4 className="text-sm font-bold text-white">{item.title}</h4>{item.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}</div><p className="text-[11px] text-[#9AA1AA] mt-0.5">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150" onClick={() => setIsModalOpen(false)}>
          <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-[#0D1014] border border-[#1F2630] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-5" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-[#1F2630] pb-4">
              <div><span className="text-[10px] uppercase tracking-widest font-bold text-[#FF6B1A]">Novo objetivo</span><h3 className="text-xl font-heading text-white">Criar meta</h3></div>
              <button aria-label="Fechar" onClick={() => setIsModalOpen(false)} className="p-2 rounded-full text-[#9AA1AA] hover:text-white hover:bg-[#15191F]"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1.5">Título da meta</label>
                <input type="text" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Ex: Fazer 4 treinos esta semana" required className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white placeholder-[#6F7782] focus:outline-none focus:border-[#FF6B1A]" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1.5">Tipo de objetivo</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORY_OPTIONS.map((option) => (
                    <button key={option.value} type="button" onClick={() => handleCategoryChange(option.value)} className={`px-3 py-2.5 rounded-xl border text-[11px] font-bold text-left transition-colors ${newCategory === option.value ? 'bg-[#FF6B1A]/15 border-[#FF6B1A] text-white' : 'bg-[#15191F] border-[#1F2630] text-[#9AA1AA]'}`}>{option.label}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1.5">Alvo</label><input type="number" min="1" value={newTarget} onChange={(event) => setNewTarget(Number(event.target.value))} required className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]" /></div>
                <div><label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1.5">Unidade</label><input type="text" value={newUnit} onChange={(event) => setNewUnit(event.target.value)} required className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]" /></div>
              </div>

              <div><label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1.5">Prazo <span className="normal-case font-normal">(opcional)</span></label><input type="date" value={newDeadline} onChange={(event) => setNewDeadline(event.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]" /></div>

              <div className="p-3 rounded-xl bg-[#11151A] border border-[#1F2630] text-[11px] text-[#9AA1AA] flex items-start gap-2"><Lightbulb className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" /><span>Metas de treinos, minutos, arremessos, repetições e sequência usam seus registros para atualizar o progresso automaticamente.</span></div>

              <button type="submit" className="w-full py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#FF6B1A]/20">Criar meta</button>
              <p className="text-[10px] text-center text-[#6F7782]">Criar uma meta rende +25 XP. Concluir rende +50 XP quando registrado pelo sistema.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
