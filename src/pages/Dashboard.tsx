import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Play,
  Sparkles,
  Target,
  TimerReset
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8 space-y-10 animate-in fade-in duration-300">
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 pb-6 border-b border-white/[0.06]">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#FF8D4D]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Plano ativo
            <span className="text-[#4E5865]">/</span>
            <span className="text-[#7F8995]">Temporada {today.getFullYear()}</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-heading tracking-tight text-white leading-[0.95]">
            HOJE É DIA DE <span className="text-[#FF6B1A]">EVOLUIR</span>
          </h1>
          <p className="mt-3 text-sm text-[#8F98A4] max-w-2xl leading-relaxed">
            {profile.name}, seu foco atual é <strong className="text-white font-semibold">{mainFocusArea.name}</strong>. O CourtLab usa seu nível, posição, metas e histórico para priorizar o que mais pode levar para o jogo.
          </p>
        </div>

        <div className="flex items-center gap-6 sm:gap-8">
          <div>
            <span className="text-[9px] uppercase tracking-[0.16em] font-bold text-[#727C88] block">Sequência</span>
            <span className="mt-1 inline-flex items-center gap-1.5 text-xl font-heading text-white"><Flame className="w-4 h-4 text-[#FF6B1A] fill-[#FF6B1A]" />{currentStreakDays} dias</span>
          </div>
          <div className="w-px h-9 bg-white/[0.08]" />
          <div>
            <span className="text-[9px] uppercase tracking-[0.16em] font-bold text-[#727C88] block">{tier}</span>
            <span className="mt-1 inline-flex items-center gap-1.5 text-xl font-heading text-white"><Award className="w-4 h-4 text-[#FF8D4D]" />{xp} XP</span>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] min-h-[390px] sm:min-h-[420px] border border-white/[0.08] bg-[#0A0D11]">
        <div className="absolute inset-0">
          <img src={heroWorkout.thumbnail} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-40 grayscale" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080A0D] via-[#080A0D]/92 to-[#080A0D]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080A0D] via-transparent to-black/10" />
          <div className="absolute right-5 top-5 sm:right-8 sm:top-8 text-[10px] font-black tracking-[0.24em] text-white/20">COURT LAB / TODAY</div>
        </div>

        <div className="relative z-10 min-h-[390px] sm:min-h-[420px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-10 max-w-4xl">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#FF8D4D]">
                {todayPlan?.isRest ? <Sparkles className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                {todayPlan?.isRest ? 'Recuperação programada' : scheduledWorkout ? 'Treino de hoje' : 'Recomendado para hoje'}
              </span>
              <span className="text-white/20">—</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">{heroWorkout.categoryLabel}</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-heading tracking-tight leading-[0.88] text-white max-w-3xl">
              {todayPlan?.isRest ? 'RECUPERE PARA VOLTAR MELHOR' : heroWorkout.title.toUpperCase()}
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#A3ABB5] max-w-xl">
              {todayPlan?.isRest
                ? 'Seu plano marcou hoje para recuperar. Se quiser ir à quadra, prefira uma sessão curta, técnica e de baixa carga.'
                : heroWorkout.description}
            </p>
            {!todayPlan?.isRest && <p className="mt-3 text-xs text-[#FFB17F] max-w-xl">{heroReason}</p>}

            {!todayPlan?.isRest && (
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-7 text-xs sm:text-sm text-white/85">
                <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4 text-[#FF6B1A]" />{heroWorkout.estimatedMinutes} min</span>
                <span className="inline-flex items-center gap-2"><Dumbbell className="w-4 h-4 text-[#FF6B1A]" />{heroWorkout.exercises.length} drills</span>
                <span className="inline-flex items-center gap-2"><Target className="w-4 h-4 text-[#FF6B1A]" />{heroWorkout.level}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {todayPlan?.isRest ? (
              <button onClick={() => navigate('/treinar?quick=15')} className="min-h-13 px-7 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-bold text-sm transition-colors inline-flex items-center justify-center gap-2">
                <TimerReset className="w-4 h-4" /> Ver sessão leve
              </button>
            ) : (
              <button onClick={() => startWorkout(heroWorkout)} className="min-h-13 px-7 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-black text-sm uppercase tracking-[0.08em] transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B1A]/20">
                <Play className="w-4 h-4 fill-current" /> Começar treino <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => navigate('/treinar')} className="min-h-13 px-5 text-white/80 hover:text-white font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2">Escolher outro treino <ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 border-y border-white/[0.06] divide-x divide-white/[0.06]">
        {[
          ['Treinos', `${recentStats.workouts}`, 'últimos 7 dias'],
          ['Tempo em quadra', formatMinutes(recentStats.minutes), 'treino registrado'],
          ['Drills', `${recentStats.exercises}`, 'concluídos'],
          ['Arremessos', `${recentStats.shots}`, 'convertidos registrados']
        ].map(([label, value, detail]) => (
          <div key={label} className="px-3 sm:px-5 py-5 sm:py-6 min-w-0">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.14em] font-bold text-[#737D88] block">{label}</span>
            <span className="mt-2 text-2xl sm:text-3xl font-heading text-white leading-none block truncate">{value}</span>
            <span className="text-[10px] sm:text-xs text-[#68727E] mt-2 block truncate">{detail}</span>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.55fr_0.75fr] gap-8 xl:gap-10">
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#737D88]">Sua semana</span>
              <h3 className="text-2xl font-heading text-white mt-0.5">PLANO DE TREINO</h3>
            </div>
            <Link to="/plano" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B1A] hover:text-[#FF8D4D]">Abrir plano <ChevronRight className="w-4 h-4" /></Link>
          </div>

          <div className="border-t border-white/[0.07]">
            {weeklyPlan.map((day) => {
              const isToday = day.dayOfWeek === todayDayOfWeek;
              return (
                <div key={day.dayOfWeek} className={`grid grid-cols-[52px_1fr_auto] sm:grid-cols-[70px_1fr_auto_auto] items-center gap-3 py-3.5 border-b border-white/[0.06] ${isToday ? 'text-white' : 'text-[#A7AFB8]'}`}>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isToday ? 'text-[#FF8D4D]' : 'text-[#6F7985]'}`}>{day.dayName}</span>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold truncate">{day.isRest ? 'Descanso e recuperação' : day.customTitle || 'Treino planejado'}</span>
                    <span className="text-[10px] text-[#65707C]">{day.isRest ? 'OFF' : 'Sessão planejada'}</span>
                  </div>
                  <div className="hidden sm:block text-[10px] uppercase font-bold text-[#68727E]">{isToday ? 'Hoje' : day.completed ? 'Feito' : 'Planejado'}</div>
                  <div className="w-7 h-7 flex items-center justify-center">
                    {day.completed ? <span className="w-7 h-7 rounded-full inline-flex items-center justify-center bg-emerald-500/12 text-emerald-400"><Check className="w-4 h-4" /></span> : isToday && !day.isRest ? <span className="w-7 h-7 rounded-full inline-flex items-center justify-center bg-[#FF6B1A] text-white"><Flame className="w-3.5 h-3.5 fill-current" /></span> : <span className="w-2 h-2 rounded-full bg-[#39424D]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-1.5 rounded-full bg-[#161C23] overflow-hidden"><div className="h-full rounded-full bg-[#FF6B1A] transition-all" style={{ width: `${weeklyPercent}%` }} /></div>
            <span className="text-xs font-bold text-white whitespace-nowrap">{weeklyCompleted}/{weeklyTarget} treinos</span>
          </div>
        </div>

        <div className="xl:border-l xl:border-white/[0.07] xl:pl-8">
          <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#FF8D4D]">Treino rápido</span>
          <h3 className="mt-2 text-3xl font-heading text-white leading-tight">QUANTO TEMPO VOCÊ TEM?</h3>
          <p className="mt-2 text-sm text-[#858F9B] leading-relaxed">Escolha o tempo. O motor usa seu perfil e o foco atual para montar a sessão.</p>
          <div className="grid grid-cols-4 gap-2 my-6">
            {[15, 30, 45, 60].map((minutes) => (
              <button key={minutes} onClick={() => navigate(`/treinar?quick=${minutes}`)} className="py-3 text-center border-b border-white/[0.08] hover:border-[#FF6B1A] transition-colors">
                <span className="block text-xl font-heading text-white">{minutes}</span>
                <span className="text-[9px] uppercase font-bold text-[#6F7985]">min</span>
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/treinar')} className="w-full min-h-12 rounded-xl bg-white text-[#0B0E12] hover:bg-[#ECEFF2] font-black text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"><TimerReset className="w-4 h-4" />Montar treino</button>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.8fr] gap-8 xl:gap-10 pt-2 border-t border-white/[0.06]">
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4 pt-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#737D88]">Motor CourtLab</span>
              <h3 className="text-2xl font-heading text-white">RECOMENDADO PARA VOCÊ</h3>
              <p className="text-xs text-[#737D88] mt-1">Prioridade definida pelo seu perfil e histórico recente.</p>
            </div>
            <Link to="/treinar" className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#FF6B1A]">Ver treinos <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedWorkouts.map(({ item, reason }, index) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between gap-2 px-1"><span className="text-[10px] uppercase font-bold text-[#FF8D4D]">#{index + 1} para você</span><span className="text-[10px] text-[#737D88] line-clamp-1 text-right">{reason}</span></div>
                <WorkoutCard workout={item} onStart={startWorkout} />
              </div>
            ))}
          </div>
        </div>

        <div className="xl:border-l xl:border-white/[0.07] xl:pl-8 pt-6">
          <div className="flex items-start justify-between gap-3">
            <div><span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#737D88]">Diagnóstico técnico</span><h3 className="text-2xl font-heading text-white mt-0.5">SEU JOGO AGORA</h3></div>
            <Link to="/progresso" className="text-xs font-bold text-[#FF6B1A]">Detalhes</Link>
          </div>
          <div className="flex justify-center py-4 overflow-hidden"><RadarSkillChart skills={skillsRating.slice(0, 8)} size={250} /></div>
          <div className="grid grid-cols-2 divide-x divide-white/[0.07] border-t border-white/[0.07] pt-4">
            <div className="pr-4"><span className="text-[9px] uppercase font-bold text-[#6F7985]">Ponto forte</span><span className="block mt-1 text-sm font-semibold text-white truncate">{topStrength.name}</span><span className="text-xl font-heading text-emerald-400">{topStrength.score.toFixed(1)}</span></div>
            <div className="pl-4"><span className="text-[9px] uppercase font-bold text-[#6F7985]">Foco atual</span><span className="block mt-1 text-sm font-semibold text-white truncate">{mainFocusArea.name}</span><span className="text-xl font-heading text-[#FF8D4D]">{mainFocusArea.score.toFixed(1)}</span></div>
          </div>
        </div>
      </section>

      <section className="pt-6 border-t border-white/[0.06]">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div><span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#737D88]">Explore seu jogo</span><h3 className="text-2xl font-heading text-white">TREINE POR FUNDAMENTO</h3></div>
          <Link to="/biblioteca" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B1A]">Biblioteca <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-white/[0.06]">
          {FUNDAMENTALS_DATA.slice(0, 8).map((item, index) => (
            <Link key={item.id} to={`/biblioteca?category=${item.id}`} className="group p-4 sm:p-5 border-b sm:border-b-0 border-r border-white/[0.06] hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center justify-between mb-6"><span className="text-[10px] font-mono-num font-bold text-[#4E5965]">0{index + 1}</span><ChevronRight className="w-4 h-4 text-[#4E5965] group-hover:text-[#FF6B1A] transition-colors" /></div>
              <span className="block text-sm font-heading text-white group-hover:text-[#FF8D4D] transition-colors truncate">{item.name}</span>
              <span className="block mt-1 text-[10px] text-[#68727E]">{item.subcategories.length} tópicos</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-6 border-t border-white/[0.06]">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div><span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-bold text-[#737D88]"><Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" /> Disciplina</span><h3 className="text-2xl font-heading text-white mt-0.5">METAS EM ANDAMENTO</h3></div>
          <Link to="/metas" className="text-xs font-bold text-[#FF6B1A]">Gerenciar</Link>
        </div>
        {activeGoals.length ? (
          <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {activeGoals.map((goal) => {
              const percentage = goal.targetValue > 0 ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0;
              return (
                <div key={goal.id} className="grid grid-cols-[1fr_auto] gap-4 py-4 items-center">
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-white truncate">{goal.title}</span><span className="text-[10px] text-[#6D7783] whitespace-nowrap">{goal.currentValue}/{goal.targetValue} {goal.unit}</span></div>
                    <div className="h-1 bg-[#202731] rounded-full overflow-hidden mt-3"><div className="h-full bg-[#FF6B1A] rounded-full" style={{ width: `${percentage}%` }} /></div>
                  </div>
                  <span className="text-lg font-heading text-[#FF6B1A]">{percentage}%</span>
                </div>
              );
            })}
          </div>
        ) : <p className="text-sm text-[#7D8792]">Nenhuma meta ativa no momento.</p>}
      </section>
    </div>
  );
};
