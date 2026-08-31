import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Play,
  Sparkles,
  Target,
  TimerReset,
  Zap
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { WORKOUTS_DATA } from '../data/workouts';
import { FUNDAMENTALS_DATA } from '../data/fundamentals';
import { WorkoutCard } from '../components/common/WorkoutCard';
import { RadarSkillChart } from '../components/common/RadarSkillChart';
import { rankWorkouts } from '../utils/personalization';

const formatMinutes = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
};

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

  const navigate = useNavigate();
  const today = new Date();
  const todayDayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
  const todayPlan = weeklyPlan.find((day) => day.dayOfWeek === todayDayOfWeek);
  const scheduledWorkout = todayPlan?.isRest
    ? undefined
    : WORKOUTS_DATA.find((workout) => workout.id === todayPlan?.workoutId);

  const rankedWorkouts = useMemo(
    () => rankWorkouts(WORKOUTS_DATA, profile, skillsRating, goals, workoutLogs),
    [profile, skillsRating, goals, workoutLogs]
  );

  const topRecommendation = rankedWorkouts[0];
  const heroWorkout = scheduledWorkout || topRecommendation?.item || WORKOUTS_DATA[0];
  const heroReason = scheduledWorkout
    ? 'Sessão definida no seu plano semanal.'
    : topRecommendation?.reason || 'Sessão sugerida para manter sua evolução equilibrada.';

  const recentStats = useMemo(() => {
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - 6);

    const recentLogs = workoutLogs.filter((log) => new Date(log.completedAt) >= cutoff);
    return {
      workouts: recentLogs.length,
      minutes: recentLogs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0),
      exercises: recentLogs.reduce((sum, log) => sum + (log.exercisesCompleted || 0), 0),
      shots: recentLogs.reduce((sum, log) => sum + (log.shotsMade || 0), 0)
    };
  }, [workoutLogs]);

  const weeklyTarget = weeklyPlan.filter((day) => !day.isRest).length;
  const weeklyCompleted = weeklyPlan.filter((day) => !day.isRest && day.completed).length;
  const weeklyPercent = weeklyTarget ? Math.min(100, Math.round((weeklyCompleted / weeklyTarget) * 100)) : 0;

  const recommendedWorkouts = useMemo(
    () => rankedWorkouts.filter(({ item }) => item.id !== scheduledWorkout?.id).slice(0, 2),
    [rankedWorkouts, scheduledWorkout?.id]
  );

  const activeGoals = goals.filter((goal) => !goal.completed).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-7 sm:space-y-8 animate-in fade-in duration-300">
      <section className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#FF8D4D]">
            <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Plano ativo</span>
            <span className="text-[#4E5865]">/</span>
            <span className="text-[#7F8995]">Temporada {today.getFullYear()}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading tracking-tight text-white leading-[0.95]">
            Bora evoluir hoje, <span className="text-[#FF6B1A]">{profile.name}</span>?
          </h1>
          <p className="mt-3 text-sm text-[#8F98A4] max-w-2xl leading-relaxed">
            Seu foco atual é <strong className="text-white font-semibold">{mainFocusArea.name}</strong>. As recomendações agora cruzam sua avaliação, objetivos, metas, nível, posição e histórico recente.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#242B34] bg-[#10141A] px-3 py-2">
            <Flame className="w-4 h-4 text-[#FF6B1A] fill-[#FF6B1A]" />
            <div className="leading-tight"><span className="block text-[9px] uppercase tracking-wider font-bold text-[#727C88]">Sequência</span><span className="text-sm font-bold text-white">{currentStreakDays} dias</span></div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#242B34] bg-[#10141A] px-3 py-2">
            <Award className="w-4 h-4 text-[#FF8D4D]" />
            <div className="leading-tight"><span className="block text-[9px] uppercase tracking-wider font-bold text-[#727C88]">{tier}</span><span className="text-sm font-bold text-white">{xp} XP</span></div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-[#FF6B1A]/35 bg-[#0E1217] min-h-[330px] sm:min-h-[360px]">
        <div className="absolute inset-0">
          <img src={heroWorkout.thumbnail} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-35 grayscale" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E12] via-[#0B0E12]/95 to-[#0B0E12]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E12] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-10 max-w-3xl">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6B1A] text-white text-[10px] font-bold uppercase tracking-wider">
                {todayPlan?.isRest ? <Sparkles className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                {todayPlan?.isRest ? 'Recuperação programada' : scheduledWorkout ? 'Treino de hoje' : 'Recomendado para hoje'}
              </span>
              <span className="px-3 py-1.5 rounded-full border border-white/10 bg-black/30 text-[10px] font-bold uppercase tracking-wider text-white/75">{heroWorkout.categoryLabel}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading tracking-tight leading-[0.92] text-white max-w-2xl">{todayPlan?.isRest ? 'Dia de recuperação' : heroWorkout.title}</h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#A3ABB5] max-w-xl">
              {todayPlan?.isRest ? 'Seu plano marcou hoje para recuperar. Se quiser ir à quadra, prefira uma sessão curta e de baixa carga.' : heroWorkout.description}
            </p>
            {!todayPlan?.isRest && <p className="mt-3 text-xs text-[#FFB17F] max-w-xl">{heroReason}</p>}

            {!todayPlan?.isRest && (
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-xs sm:text-sm text-white/85">
                <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4 text-[#FF6B1A]" />{heroWorkout.estimatedMinutes} min</span>
                <span className="inline-flex items-center gap-2"><Dumbbell className="w-4 h-4 text-[#FF6B1A]" />{heroWorkout.exercises.length} exercícios</span>
                <span className="inline-flex items-center gap-2"><Target className="w-4 h-4 text-[#FF6B1A]" />{heroWorkout.level}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {todayPlan?.isRest ? (
              <button onClick={() => navigate('/treinar?quick=15')} className="min-h-12 px-6 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-bold text-sm transition-colors inline-flex items-center justify-center gap-2">
                <TimerReset className="w-4 h-4" /> Ver sessão leve
              </button>
            ) : (
              <button onClick={() => startWorkout(heroWorkout)} className="min-h-12 px-6 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-bold text-sm transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B1A]/20">
                <Play className="w-4 h-4 fill-current" /> Começar treino <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => navigate('/treinar')} className="min-h-12 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-colors">Escolher outro treino</button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Treinos', value: `${recentStats.workouts}`, detail: 'últimos 7 dias', icon: CheckCircle2 },
          { label: 'Tempo em quadra', value: formatMinutes(recentStats.minutes), detail: 'treino registrado', icon: Clock },
          { label: 'Exercícios', value: `${recentStats.exercises}`, detail: 'concluídos', icon: Dumbbell },
          { label: 'Arremessos', value: `${recentStats.shots}`, detail: 'convertidos registrados', icon: Target }
        ].map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-[#1E252D] bg-[#0D1116] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-5"><span className="text-[10px] uppercase tracking-wider font-bold text-[#737D88]">{label}</span><Icon className="w-4 h-4 text-[#FF6B1A]" /></div>
            <div className="text-2xl sm:text-3xl font-heading text-white leading-none">{value}</div><div className="text-[10px] sm:text-xs text-[#68727E] mt-2">{detail}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.55fr_0.85fr] gap-6">
        <div className="rounded-[24px] border border-[#1E252D] bg-[#0D1116] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-5"><div><span className="text-[10px] uppercase tracking-wider font-bold text-[#737D88]">Sua semana</span><h3 className="text-xl sm:text-2xl font-heading text-white mt-0.5">Plano de treino</h3></div><Link to="/plano" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B1A] hover:text-[#FF8D4D]">Abrir plano <ChevronRight className="w-4 h-4" /></Link></div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weeklyPlan.map((day) => {
              const isToday = day.dayOfWeek === todayDayOfWeek;
              return <div key={day.dayOfWeek} className={`min-w-0 rounded-xl sm:rounded-2xl border px-1.5 sm:px-2 py-3 text-center ${isToday ? 'border-[#FF6B1A] bg-[#FF6B1A]/10' : day.completed ? 'border-emerald-500/25 bg-emerald-500/[0.06]' : 'border-[#202731] bg-[#11161C]'}`}>
                <span className={`text-[9px] sm:text-[10px] font-bold uppercase ${isToday ? 'text-[#FF8D4D]' : 'text-[#6F7985]'}`}>{day.dayName}</span>
                <div className="h-8 flex items-center justify-center my-1.5">{day.completed ? <span className="w-7 h-7 rounded-full inline-flex items-center justify-center bg-emerald-500/15 text-emerald-400"><Check className="w-4 h-4" /></span> : day.isRest ? <span className="text-[9px] font-bold text-[#626C77]">OFF</span> : isToday ? <span className="w-7 h-7 rounded-full inline-flex items-center justify-center bg-[#FF6B1A] text-white"><Flame className="w-3.5 h-3.5 fill-current" /></span> : <span className="w-2 h-2 rounded-full bg-[#39424D]" />}</div>
                <span className="block truncate text-[8px] sm:text-[9px] font-semibold text-[#A7AFB8]">{day.isRest ? 'Descanso' : day.customTitle?.split(' ')[0] || 'Treino'}</span>
              </div>;
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-[#1D242C] flex items-center gap-4"><div className="flex-1 h-2 rounded-full bg-[#161C23] overflow-hidden"><div className="h-full rounded-full bg-[#FF6B1A] transition-all" style={{ width: `${weeklyPercent}%` }} /></div><span className="text-xs font-bold text-white whitespace-nowrap">{weeklyCompleted}/{weeklyTarget} treinos</span></div>
        </div>

        <div className="rounded-[24px] border border-[#FF6B1A]/20 bg-gradient-to-br from-[#15191F] to-[#0D1116] p-5 sm:p-6 flex flex-col justify-between">
          <div><span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-[#FF8D4D]"><Zap className="w-3.5 h-3.5" /> Treino rápido</span><h3 className="mt-2 text-2xl sm:text-3xl font-heading text-white leading-tight">Quanto tempo você tem?</h3><p className="mt-2 text-xs sm:text-sm text-[#858F9B] leading-relaxed">O Hub usa o mesmo ranking do seu perfil para escolher uma sessão curta.</p></div>
          <div className="grid grid-cols-4 gap-2 my-5">{[15, 30, 45, 60].map((minutes) => <button key={minutes} onClick={() => navigate(`/treinar?quick=${minutes}`)} className="rounded-xl border border-[#29313B] bg-[#11161C] hover:border-[#FF6B1A]/60 hover:bg-[#FF6B1A]/5 py-3 text-center transition-colors"><span className="block text-lg font-heading text-white">{minutes}</span><span className="text-[9px] uppercase font-bold text-[#6F7985]">min</span></button>)}</div>
          <button onClick={() => navigate('/treinar')} className="w-full min-h-11 rounded-xl bg-white text-[#0B0E12] hover:bg-[#ECEFF2] font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"><TimerReset className="w-4 h-4" />Montar treino rápido</button>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-6">
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4"><div><span className="text-[10px] uppercase tracking-wider font-bold text-[#737D88]">Motor CourtLab</span><h3 className="text-xl sm:text-2xl font-heading text-white">Recomendado para você</h3><p className="text-xs text-[#737D88] mt-1">Mesmo ranking usado em Treinar, Biblioteca e Programas.</p></div><Link to="/treinar" className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#FF6B1A]">Ver treinos <ChevronRight className="w-4 h-4" /></Link></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{recommendedWorkouts.map(({ item, reason }, index) => <div key={item.id} className="space-y-2"><div className="flex items-center justify-between gap-2 px-1"><span className="text-[10px] uppercase font-bold text-[#FF8D4D]">#{index + 1} para você</span><span className="text-[10px] text-[#737D88] line-clamp-1 text-right">{reason}</span></div><WorkoutCard workout={item} onStart={startWorkout} /></div>)}</div>
        </div>

        <div className="rounded-[24px] border border-[#1E252D] bg-[#0D1116] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3"><div><span className="text-[10px] uppercase tracking-wider font-bold text-[#737D88]">Diagnóstico técnico</span><h3 className="text-xl font-heading text-white mt-0.5">Seu jogo agora</h3></div><Link to="/progresso" className="text-xs font-bold text-[#FF6B1A]">Detalhes</Link></div>
          <div className="flex justify-center py-3 overflow-hidden"><RadarSkillChart skills={skillsRating.slice(0, 8)} size={250} /></div>
          <div className="grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#11161C] border border-[#202731] p-3"><span className="text-[9px] uppercase font-bold text-[#6F7985]">Ponto forte</span><span className="block mt-1 text-xs font-semibold text-white truncate">{topStrength.name}</span><span className="text-sm font-heading text-emerald-400">{topStrength.score.toFixed(1)}</span></div><div className="rounded-xl bg-[#11161C] border border-[#202731] p-3"><span className="text-[9px] uppercase font-bold text-[#6F7985]">Foco atual</span><span className="block mt-1 text-xs font-semibold text-white truncate">{mainFocusArea.name}</span><span className="text-sm font-heading text-[#FF8D4D]">{mainFocusArea.score.toFixed(1)}</span></div></div>
        </div>
      </section>

      <section className="space-y-4"><div className="flex items-end justify-between gap-4"><div><span className="text-[10px] uppercase tracking-wider font-bold text-[#737D88]">Explore seu jogo</span><h3 className="text-xl sm:text-2xl font-heading text-white">Treine por fundamento</h3></div><Link to="/biblioteca" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B1A]">Biblioteca <ArrowRight className="w-4 h-4" /></Link></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{FUNDAMENTALS_DATA.slice(0, 8).map((item, index) => <Link key={item.id} to={`/biblioteca?category=${item.id}`} className="group rounded-2xl border border-[#1E252D] bg-[#0D1116] hover:border-[#FF6B1A]/45 p-4 transition-colors"><div className="flex items-center justify-between mb-5"><span className="text-[10px] font-mono-num font-bold text-[#4E5965]">0{index + 1}</span><ChevronRight className="w-4 h-4 text-[#4E5965] group-hover:text-[#FF6B1A] transition-colors" /></div><span className="block text-sm font-heading text-white group-hover:text-[#FF8D4D] transition-colors truncate">{item.name}</span><span className="block mt-1 text-[10px] text-[#68727E]">{item.subcategories.length} tópicos</span></Link>)}</div>
      </section>

      <section className="rounded-[24px] border border-[#1E252D] bg-[#0D1116] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-5"><div><span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-[#737D88]"><Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" /> Disciplina</span><h3 className="text-xl sm:text-2xl font-heading text-white mt-0.5">Metas em andamento</h3></div><Link to="/metas" className="text-xs font-bold text-[#FF6B1A]">Gerenciar</Link></div>
        {activeGoals.length ? <div className="grid grid-cols-1 md:grid-cols-3 gap-3">{activeGoals.map((goal) => { const percentage = goal.targetValue > 0 ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0; return <div key={goal.id} className="rounded-2xl border border-[#202731] bg-[#11161C] p-4"><div className="flex items-start justify-between gap-3"><span className="text-xs font-semibold text-white leading-snug">{goal.title}</span><span className="text-xs font-bold text-[#FF6B1A]">{percentage}%</span></div><div className="h-1.5 bg-[#202731] rounded-full overflow-hidden mt-4"><div className="h-full bg-[#FF6B1A] rounded-full" style={{ width: `${percentage}%` }} /></div><div className="flex items-center justify-between mt-2 text-[10px] text-[#6D7783]"><span>{goal.currentValue} {goal.unit}</span><span>Meta {goal.targetValue}</span></div></div>; })}</div> : <p className="text-sm text-[#7D8792]">Nenhuma meta ativa no momento.</p>}
      </section>
    </div>
  );
};
