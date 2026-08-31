import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Flame,
  Plus,
  Zap,
  Dumbbell,
  Clock,
  Trash2,
  CheckCircle2,
  Search,
  Sparkles,
  Target,
  ArrowRight,
  Play,
  Gauge,
  CalendarDays,
  RotateCcw,
  ChevronRight,
  Timer,
  Trophy,
  Layers3
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { WORKOUTS_DATA } from '../data/workouts';
import { EXERCISES_DATA } from '../data/exercises';
import { WorkoutCard } from '../components/common/WorkoutCard';
import { Workout, Exercise } from '../types';

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Todos' },
  { id: 'shooting', label: 'Arremesso' },
  { id: 'ball-handle', label: 'Controle de Bola' },
  { id: 'finishing', label: 'Finalização' },
  { id: 'pick-and-roll', label: 'Pick and Roll' },
  { id: 'defense', label: 'Defesa' },
  { id: 'complete', label: 'Completo' }
];

const QUICK_DURATIONS = [15, 30, 45, 60];

export const TrainHub: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'builder' ? 'builder' : 'hub';

  const [activeTab, setActiveTab] = useState<'hub' | 'workouts' | 'builder'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quickDuration, setQuickDuration] = useState(30);
  const [quickCategory, setQuickCategory] = useState('complete');

  const {
    startWorkout,
    customWorkouts,
    saveCustomWorkout,
    activeWorkout,
    weeklyPlan,
    getWorkoutById,
    mainFocusArea,
    currentStreakDays
  } = usePlayer();

  const [builderTitle, setBuilderTitle] = useState('');
  const [builderDescription, setBuilderDescription] = useState('');
  const [builderCategory, setBuilderCategory] = useState<'shooting' | 'ball-handle' | 'finishing' | 'complete'>('shooting');
  const [builderItems, setBuilderItems] = useState<{ exerciseId: string; customSets: number; customReps: string; restSeconds: number }[]>([
    { exerciseId: 'bh-01', customSets: 3, customReps: '20 reps', restSeconds: 30 },
    { exerciseId: 'sh-02', customSets: 3, customReps: '10 cada lado', restSeconds: 30 }
  ]);
  const [drillSearchQuery, setDrillSearchQuery] = useState('');

  const allWorkouts = useMemo(() => [...customWorkouts, ...WORKOUTS_DATA], [customWorkouts]);
  const filteredWorkouts = selectedCategory === 'all'
    ? allWorkouts
    : allWorkouts.filter((w) => w.category === selectedCategory);

  const currentDay = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const todayPlan = weeklyPlan.find((day) => day.dayOfWeek === currentDay);
  const todayWorkout = todayPlan?.workoutId ? getWorkoutById(todayPlan.workoutId) : undefined;

  const focusKey = mainFocusArea.name.toLowerCase();
  const focusWorkout = allWorkouts.find((workout) => {
    const haystack = `${workout.title} ${workout.categoryLabel} ${workout.description}`.toLowerCase();
    if (focusKey.includes('pick')) return haystack.includes('pick') || workout.category === 'pick-and-roll';
    if (focusKey.includes('arremesso') || focusKey.includes('3 pontos')) return workout.category === 'shooting';
    if (focusKey.includes('controle') || focusKey.includes('ritmo')) return workout.category === 'ball-handle';
    if (focusKey.includes('final')) return workout.category === 'finishing';
    if (focusKey.includes('defesa')) return workout.category === 'defense';
    return false;
  }) || WORKOUTS_DATA[0];

  const quickWorkout = useMemo(() => {
    const categoryPool = quickCategory === 'complete'
      ? allWorkouts
      : allWorkouts.filter((w) => w.category === quickCategory);
    const pool = categoryPool.length ? categoryPool : allWorkouts;
    return [...pool].sort((a, b) =>
      Math.abs(a.estimatedMinutes - quickDuration) - Math.abs(b.estimatedMinutes - quickDuration)
    )[0];
  }, [allWorkouts, quickCategory, quickDuration]);

  const handleTabChange = (tab: 'hub' | 'workouts' | 'builder') => {
    setActiveTab(tab);
    if (tab === 'builder') setSearchParams({ tab: 'builder' });
    else setSearchParams({});
  };

  const handleAddDrillToBuilder = (exercise: Exercise) => {
    setBuilderItems((prev) => [
      ...prev,
      { exerciseId: exercise.id, customSets: exercise.sets || 3, customReps: exercise.reps || '15 reps', restSeconds: 30 }
    ]);
  };

  const handleRemoveBuilderItem = (index: number) => {
    setBuilderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCustomWorkout = () => {
    if (!builderTitle.trim() || builderItems.length === 0) return;

    const categoryLabel = builderCategory === 'shooting'
      ? 'Arremesso'
      : builderCategory === 'ball-handle'
      ? 'Controle de Bola'
      : builderCategory === 'finishing'
      ? 'Finalização'
      : 'Treino Completo';

    const newWorkout: Workout = {
      id: 'custom-' + Date.now(),
      title: builderTitle.trim(),
      slug: builderTitle.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, ''),
      description: builderDescription.trim() || 'Treino personalizado montado no CourtLab.',
      category: builderCategory,
      categoryLabel,
      level: 'Intermediário',
      estimatedMinutes: builderItems.length * 5 + 10,
      xpReward: builderItems.length * 15 + 40,
      tags: ['Personalizado', 'CourtLab'],
      thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
      exercises: builderItems
    };

    saveCustomWorkout(newWorkout);
    setBuilderTitle('');
    setBuilderDescription('');
    setActiveTab('workouts');
    setSearchParams({});
  };

  const filteredDrillsForBuilder = drillSearchQuery
    ? EXERCISES_DATA.filter((e) =>
        e.name.toLowerCase().includes(drillSearchQuery.toLowerCase()) ||
        e.categoryLabel.toLowerCase().includes(drillSearchQuery.toLowerCase()) ||
        e.subcategory.toLowerCase().includes(drillSearchQuery.toLowerCase())
      )
    : EXERCISES_DATA.slice(0, 8);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-7 animate-in fade-in duration-300">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div>
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-[0.2em] text-[#FF6B1A] block mb-1">
            CourtLab Training Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-none">
            TREINAR
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA1AA] mt-2 max-w-2xl">
            Entre na quadra com um plano: siga a sessão de hoje, escolha um foco, monte seu treino ou encaixe uma sessão rápida.
          </p>
        </div>

        <div className="flex p-1 bg-[#0D1014] rounded-2xl border border-[#1F2630] overflow-x-auto">
          {[
            { id: 'hub', label: 'Central', icon: Flame },
            { id: 'workouts', label: 'Treinos', icon: Layers3 },
            { id: 'builder', label: 'Montar', icon: Plus }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as 'hub' | 'workouts' | 'builder')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-[#FF6B1A] text-white shadow-lg shadow-[#FF6B1A]/20' : 'text-[#9AA1AA] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'hub' && (
        <div className="space-y-7">
          {activeWorkout && (
            <button
              onClick={() => startWorkout(activeWorkout)}
              className="w-full p-4 sm:p-5 rounded-2xl bg-[#FF6B1A]/10 border border-[#FF6B1A]/35 hover:border-[#FF6B1A] transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#FF6B1A] text-white flex items-center justify-center shadow-lg shadow-[#FF6B1A]/25">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF8D4D]">Treino em andamento</span>
                  <h2 className="text-lg font-heading text-white">Continuar {activeWorkout.title}</h2>
                </div>
              </div>
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                Voltar ao treino <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className="xl:col-span-2 relative overflow-hidden rounded-3xl border border-[#FF6B1A]/35 bg-[#11151A] min-h-[330px]">
              {todayWorkout?.thumbnail && (
                <div className="absolute inset-y-0 right-0 w-full md:w-1/2 opacity-35">
                  <img src={todayWorkout.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#11151A] via-[#11151A]/75 to-[#11151A]/20" />
                </div>
              )}
              <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-between gap-8 md:max-w-[70%]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#FF6B1A] text-white text-[10px] uppercase font-black tracking-wider">Treino de hoje</span>
                    <span className="px-2.5 py-1 rounded-full bg-black/30 border border-white/10 text-[#B8BFC8] text-[10px] uppercase font-bold">{todayPlan?.dayName || 'Hoje'}</span>
                  </div>
                  {todayWorkout ? (
                    <>
                      <h2 className="text-3xl sm:text-4xl font-heading text-white leading-tight">{todayWorkout.title}</h2>
                      <p className="text-sm text-[#9AA1AA] mt-2 leading-relaxed max-w-xl">{todayWorkout.description}</p>
                      <div className="flex flex-wrap gap-4 mt-5 text-xs text-[#D6DBE1]">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#FF6B1A]" /> {todayWorkout.estimatedMinutes} min</span>
                        <span className="flex items-center gap-1.5"><Dumbbell className="w-4 h-4 text-[#FF6B1A]" /> {todayWorkout.exercises.length} exercícios</span>
                        <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-[#FF8D4D]" /> +{todayWorkout.xpReward} XP</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl sm:text-4xl font-heading text-white leading-tight">{todayPlan?.isRest ? 'Recuperação programada' : 'Dia livre para treinar'}</h2>
                      <p className="text-sm text-[#9AA1AA] mt-2 leading-relaxed max-w-xl">
                        {todayPlan?.isRest
                          ? 'Seu plano marcou hoje como recuperação. Se estiver se sentindo bem, faça apenas uma sessão curta e leve.'
                          : 'Não há um treino técnico agendado hoje. Use o Treino Rápido ou escolha um foco abaixo.'}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {todayWorkout ? (
                    <button
                      onClick={() => startWorkout(todayWorkout)}
                      className="px-6 py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-heading uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B1A]/25"
                    >
                      <Play className="w-4 h-4 fill-current" /> Começar sessão
                    </button>
                  ) : (
                    <button
                      onClick={() => quickWorkout && startWorkout(quickWorkout)}
                      className="px-6 py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-heading uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" /> Fazer treino rápido
                    </button>
                  )}
                  <button
                    onClick={() => handleTabChange('workouts')}
                    className="px-5 py-3.5 rounded-xl bg-[#191E24] hover:bg-[#202730] border border-[#2B3542] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Escolher outro treino
                  </button>
                </div>
              </div>
            </section>

            <aside className="rounded-3xl bg-[#0D1014] border border-[#1F2630] p-5 sm:p-6 flex flex-col justify-between gap-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#9AA1AA]">Seu momento</span>
                <h3 className="text-xl font-heading text-white mt-1">Próximo passo</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#15191F] border border-[#1F2630]">
                  <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Foco principal</span>
                  <div className="flex items-center gap-2 mt-1"><Target className="w-4 h-4 text-[#FF6B1A]" /><strong className="text-white text-sm">{mainFocusArea.name}</strong></div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#15191F] border border-[#1F2630]">
                  <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Sequência atual</span>
                  <div className="flex items-center gap-2 mt-1"><Flame className="w-4 h-4 text-[#FF6B1A] fill-[#FF6B1A]" /><strong className="text-white text-sm">{currentStreakDays} dias</strong></div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#FF6B1A]/8 border border-[#FF6B1A]/25">
                <span className="text-[10px] uppercase font-bold text-[#FF8D4D]">Sugestão CourtLab</span>
                <h4 className="text-sm font-bold text-white mt-1">{focusWorkout.title}</h4>
                <p className="text-[11px] text-[#9AA1AA] mt-1">Selecionado por combinar com seu principal ponto a desenvolver.</p>
                <button onClick={() => startWorkout(focusWorkout)} className="mt-3 text-xs font-bold text-[#FF6B1A] flex items-center gap-1 hover:text-[#FF8D4D]">
                  Iniciar recomendado <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </aside>
          </div>

          <section className="rounded-3xl bg-[#0D1014] border border-[#1F2630] p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Treino Rápido</span>
                <h2 className="text-2xl font-heading text-white">Quanto tempo você tem?</h2>
                <p className="text-xs text-[#9AA1AA] mt-1">Escolha tempo e foco. O CourtLab encontra a sessão mais próxima para você começar agora.</p>
              </div>
              {quickWorkout && <span className="text-xs text-[#9AA1AA]">Sugestão: <strong className="text-white">{quickWorkout.title}</strong></span>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-4 lg:items-center">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {QUICK_DURATIONS.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setQuickDuration(duration)}
                    className={`min-w-[66px] px-3 py-3 rounded-xl border text-sm font-mono-num font-black transition-colors ${quickDuration === duration ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white' : 'bg-[#15191F] border-[#1F2630] text-[#B2BAC4] hover:text-white'}`}
                  >
                    {duration}m
                  </button>
                ))}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'complete', label: 'Completo' },
                  { id: 'ball-handle', label: 'Ball Handle' },
                  { id: 'shooting', label: 'Shooting' },
                  { id: 'finishing', label: 'Finishing' },
                  { id: 'defense', label: 'Defesa' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setQuickCategory(item.id)}
                    className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-colors ${quickCategory === item.id ? 'bg-[#FF6B1A]/15 border-[#FF6B1A] text-white' : 'bg-[#11151A] border-[#1F2630] text-[#9AA1AA] hover:text-white'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                disabled={!quickWorkout}
                onClick={() => quickWorkout && startWorkout(quickWorkout)}
                className="px-5 py-3 rounded-xl bg-white text-[#0A0C0F] hover:bg-[#ECEFF2] disabled:opacity-40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" /> Começar agora
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9AA1AA]">Escolha pelo objetivo</span>
              <h2 className="text-2xl font-heading text-white">O que você quer trabalhar hoje?</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {CATEGORY_OPTIONS.filter((item) => item.id !== 'all').map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedCategory(item.id); handleTabChange('workouts'); }}
                  className="p-4 min-h-[112px] rounded-2xl bg-[#11151A] border border-[#1F2630] hover:border-[#FF6B1A]/60 hover:bg-[#15191F] transition-all text-left group flex flex-col justify-between"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FF6B1A]/10 text-[#FF6B1A] flex items-center justify-center group-hover:bg-[#FF6B1A] group-hover:text-white transition-colors">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-heading text-white">{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => handleTabChange('builder')} className="p-5 rounded-3xl bg-[#0D1014] border border-[#1F2630] hover:border-[#FF6B1A]/40 transition-all text-left flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-[#FF6B1A] text-white flex items-center justify-center"><Plus className="w-5 h-5" /></div><div><span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Personalizado</span><h3 className="text-lg font-heading text-white">Montar meu treino</h3><p className="text-xs text-[#9AA1AA] mt-1">Escolha exercícios, séries e ordem.</p></div></div><ArrowRight className="w-5 h-5 text-[#626B76] group-hover:text-[#FF6B1A] group-hover:translate-x-1 transition-all" />
            </button>
            <button onClick={() => handleTabChange('workouts')} className="p-5 rounded-3xl bg-[#0D1014] border border-[#1F2630] hover:border-[#FF6B1A]/40 transition-all text-left flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-[#15191F] border border-[#2B3542] text-[#FF6B1A] flex items-center justify-center"><CalendarDays className="w-5 h-5" /></div><div><span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Biblioteca de sessões</span><h3 className="text-lg font-heading text-white">Ver todos os treinos</h3><p className="text-xs text-[#9AA1AA] mt-1">Explore por fundamento e nível.</p></div></div><ArrowRight className="w-5 h-5 text-[#626B76] group-hover:text-[#FF6B1A] group-hover:translate-x-1 transition-all" />
            </button>
          </section>
        </div>
      )}

      {activeTab === 'workouts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9AA1AA]">Treinos prontos</span>
              <h2 className="text-2xl font-heading text-white">Escolha sua sessão</h2>
            </div>
            <span className="text-xs text-[#9AA1AA]">{filteredWorkouts.length} treinos disponíveis</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border ${selectedCategory === cat.id ? 'bg-[#FF6B1A]/15 border-[#FF6B1A] text-white' : 'bg-[#15191F] border-[#1F2630] text-[#9AA1AA] hover:text-white'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {filteredWorkouts.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredWorkouts.map((workout) => <WorkoutCard key={workout.id} workout={workout} onStart={startWorkout} />)}
            </div>
          ) : (
            <div className="p-10 rounded-3xl border border-dashed border-[#2B3542] bg-[#0D1014] text-center">
              <Dumbbell className="w-8 h-8 text-[#FF6B1A] mx-auto" />
              <h3 className="text-lg font-heading text-white mt-3">Nenhum treino nessa categoria</h3>
              <p className="text-xs text-[#9AA1AA] mt-1">Escolha outro fundamento ou monte uma sessão personalizada.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-5 sm:p-7 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-6">
            <div>
              <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A]">CourtLab Builder</span>
              <h2 className="text-2xl font-heading text-white mt-1">Monte sua sessão</h2>
              <p className="text-xs text-[#9AA1AA] mt-1">Defina o foco e organize os exercícios na ordem em que quer executar.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1.5">Nome do treino</label>
                <input value={builderTitle} onChange={(e) => setBuilderTitle(e.target.value)} placeholder="Ex: Handle + Pull-up de quarta" className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white placeholder-[#707985] focus:outline-none focus:border-[#FF6B1A]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1.5">Categoria principal</label>
                  <select value={builderCategory} onChange={(e) => setBuilderCategory(e.target.value as typeof builderCategory)} className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]">
                    <option value="shooting">Arremesso</option><option value="ball-handle">Controle de Bola</option><option value="finishing">Finalização</option><option value="complete">Completo</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1.5">Foco da sessão</label>
                  <input value={builderDescription} onChange={(e) => setBuilderDescription(e.target.value)} placeholder="Ex: 1-dribble pull-up e mudança de ritmo" className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white placeholder-[#707985] focus:outline-none focus:border-[#FF6B1A]" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1F2630] space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2"><Dumbbell className="w-4 h-4 text-[#FF6B1A]" /> Sequência ({builderItems.length})</h3>
                <span className="text-xs text-[#9AA1AA] flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> ~{builderItems.length * 5 + 10} min</span>
              </div>

              {builderItems.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-[#1F2630] rounded-2xl text-[#9AA1AA]"><p className="text-sm">Nenhum exercício adicionado.</p><p className="text-xs mt-1">Use a biblioteca ao lado para começar.</p></div>
              ) : (
                <div className="space-y-2.5">
                  {builderItems.map((item, index) => {
                    const drill = EXERCISES_DATA.find((e) => e.id === item.exerciseId);
                    return (
                      <div key={`${item.exerciseId}-${index}`} className="p-3.5 rounded-xl bg-[#15191F] border border-[#1F2630] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-[#FF6B1A]/15 text-[#FF6B1A] font-mono-num font-bold text-xs flex items-center justify-center border border-[#FF6B1A]/25">{index + 1}</span><div><h4 className="text-sm font-bold text-white">{drill?.name || item.exerciseId}</h4><span className="text-[11px] text-[#9AA1AA]">{drill?.subcategory || 'Exercício técnico'} • {item.customReps}</span></div></div>
                        <div className="flex items-center gap-3 self-end sm:self-center"><label className="flex items-center gap-1.5 text-xs text-[#9AA1AA]">Séries <input type="number" min="1" max="10" value={item.customSets} onChange={(e) => { const val = Number(e.target.value); setBuilderItems((prev) => prev.map((it, idx) => idx === index ? { ...it, customSets: val } : it)); }} className="w-12 px-2 py-1.5 rounded bg-[#0D1014] border border-[#2B3542] text-white font-mono-num text-center text-xs" /></label><button onClick={() => handleRemoveBuilderItem(index)} className="p-2 text-[#9AA1AA] hover:text-red-400" aria-label={`Remover ${drill?.name || 'exercício'}`}><Trash2 className="w-4 h-4" /></button></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#1F2630] flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-xs text-[#9AA1AA]"><strong className="text-white">{builderItems.length}</strong> exercícios • ~<strong className="text-white">{builderItems.length * 5 + 10} min</strong></div>
              <button onClick={handleSaveCustomWorkout} disabled={!builderTitle.trim() || builderItems.length === 0} className="py-3.5 px-6 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] disabled:opacity-30 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Salvar treino</button>
            </div>
          </div>

          <aside className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div><span className="text-[10px] uppercase font-bold tracking-widest text-[#9AA1AA]">Biblioteca</span><h3 className="text-lg font-heading text-white flex items-center gap-2 mt-1"><Search className="w-4 h-4 text-[#FF6B1A]" /> Adicionar exercícios</h3></div>
            <input value={drillSearchQuery} onChange={(e) => setDrillSearchQuery(e.target.value)} placeholder="Buscar crossover, floater, shooting..." className="w-full px-3.5 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-xs text-white placeholder-[#707985] focus:outline-none focus:border-[#FF6B1A]" />
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredDrillsForBuilder.map((drill) => (
                <div key={drill.id} className="p-3 rounded-xl bg-[#15191F] border border-[#1F2630] flex items-center justify-between gap-2"><div><span className="text-xs font-bold text-white block">{drill.name}</span><span className="text-[10px] text-[#9AA1AA]">{drill.categoryLabel} • {drill.difficulty}</span></div><button onClick={() => handleAddDrillToBuilder(drill)} className="p-2 rounded-lg bg-[#FF6B1A]/10 hover:bg-[#FF6B1A] text-[#FF6B1A] hover:text-white transition-colors" aria-label={`Adicionar ${drill.name}`}><Plus className="w-4 h-4" /></button></div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
