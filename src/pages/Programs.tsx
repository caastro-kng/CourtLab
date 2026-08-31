import React, { useMemo } from 'react';
import { Calendar, Award, Flame, ArrowRight, Route, Target, CheckCircle2, PlayCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PROGRAMS_DATA } from '../data/programs';
import { ProgramCard } from '../components/common/ProgramCard';
import { usePlayer } from '../context/PlayerContext';
import { rankPrograms } from '../utils/personalization';

export const Programs: React.FC = () => {
  const navigate = useNavigate();
  const { workoutLogs, profile, skillsRating, goals, mainFocusArea } = usePlayer();

  const programStats = useMemo(() => {
    const completedIds = new Set(workoutLogs.map((log) => log.workoutId));
    return PROGRAMS_DATA.map((program) => {
      const sessions = program.weeks.flatMap((week) => week.days.filter((day) => day.workoutId && !day.isRest));
      const completed = sessions.filter((day) => day.workoutId && completedIds.has(day.workoutId)).length;
      return {
        program,
        completed,
        total: sessions.length,
        percentage: sessions.length ? Math.round((completed / sessions.length) * 100) : 0
      };
    });
  }, [workoutLogs]);

  const rankedPrograms = useMemo(
    () => rankPrograms(PROGRAMS_DATA, profile, skillsRating, goals),
    [profile, skillsRating, goals]
  );

  const activeProgram = programStats.find((item) => item.completed > 0 && item.percentage < 100);
  const personalizedPick = rankedPrograms[0];
  const featured = activeProgram?.program || personalizedPick?.item || PROGRAMS_DATA[0];
  const featuredStats = programStats.find((item) => item.program.id === featured.id);
  const featuredRecommendation = rankedPrograms.find((item) => item.item.id === featured.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="max-w-3xl">
        <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">Trilhas de Desenvolvimento</span>
        <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">PROGRAMAS</h1>
        <p className="text-xs sm:text-sm text-[#9AA1AA] mt-2 leading-relaxed">
          Evolua por etapas, com semanas organizadas, sessões progressivas e transferência para jogo. As trilhas agora são priorizadas pelo seu perfil, metas e autoavaliação técnica.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-[#FF6B1A]/35 bg-[#0D1014] p-5 sm:p-7">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B1A]/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.5fr_.8fr] gap-6 items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF6B1A] text-white">
                {activeProgram ? 'Continuar programa' : 'Melhor encaixe para você'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase bg-[#15191F] text-[#9AA1AA] border border-[#1F2630]">{featured.level}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-heading text-white leading-tight">{featured.title}</h2>
            <p className="text-sm font-semibold text-[#FF8D4D] mt-1">{featured.subtitle}</p>
            <p className="text-xs sm:text-sm text-[#9AA1AA] mt-3 max-w-2xl leading-relaxed">{featured.description}</p>

            {!activeProgram && featuredRecommendation && (
              <div className="mt-4 max-w-2xl rounded-2xl border border-[#FF6B1A]/20 bg-[#FF6B1A]/[0.07] p-3.5 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#FF6B1A] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF8D4D]">Por que apareceu primeiro</span>
                  <p className="text-xs text-[#C7CDD4] mt-1 leading-relaxed">{featuredRecommendation.reason}</p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-5 text-xs text-white/90">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#FF6B1A]" />{featured.durationWeeks} semanas</span>
              <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-[#FF6B1A]" />{featured.workoutsPerWeek} treinos / semana</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-[#FF6B1A]" />+{featured.xpTotal} XP</span>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/programas/${featured.slug}`)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              {activeProgram ? <PlayCircle className="w-4 h-4" /> : <Route className="w-4 h-4" />}
              {activeProgram ? 'Continuar trilha' : 'Ver programa'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] p-4 sm:p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA]">Progresso da trilha</span>
                <span className="text-xl font-mono-num font-bold text-white">{featuredStats?.percentage || 0}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#080A0D] overflow-hidden">
                <div className="h-full bg-[#FF6B1A] rounded-full" style={{ width: `${featuredStats?.percentage || 0}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#0D1014] border border-[#1F2630]">
                <span className="text-[10px] uppercase text-[#9AA1AA] block">Sessões</span>
                <span className="text-lg font-heading text-white">{featuredStats?.completed || 0}/{featuredStats?.total || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1014] border border-[#1F2630]">
                <span className="text-[10px] uppercase text-[#9AA1AA] block">Foco detectado</span>
                <span className="text-sm font-bold text-[#FF8D4D] line-clamp-1">{mainFocusArea.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <Route className="w-5 h-5 text-[#FF6B1A] mb-3" />
          <h3 className="text-sm font-heading text-white">Progressão semanal</h3>
          <p className="text-xs text-[#9AA1AA] mt-1">Cada semana muda o estímulo e prepara a próxima etapa.</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <Target className="w-5 h-5 text-[#FF6B1A] mb-3" />
          <h3 className="text-sm font-heading text-white">Personalização real</h3>
          <p className="text-xs text-[#9AA1AA] mt-1">Metas, nível e pontos fracos mudam a ordem das recomendações.</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-3" />
          <h3 className="text-sm font-heading text-white">Progresso real</h3>
          <p className="text-xs text-[#9AA1AA] mt-1">Sessões concluídas alimentam o progresso automaticamente.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA]">Ordenado para o seu perfil</span>
          <h2 className="text-2xl font-heading text-white mt-1">Desenvolvimento por prioridade</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedPrograms.map((recommendation, index) => (
            <div key={recommendation.item.id} className="relative">
              {index < 3 && (
                <div className="absolute z-20 left-3 top-3 px-2.5 py-1 rounded-full bg-[#080A0D]/90 border border-[#FF6B1A]/40 text-[9px] font-bold uppercase tracking-wider text-[#FF8D4D] backdrop-blur-sm">
                  #{index + 1} para você
                </div>
              )}
              <ProgramCard program={recommendation.item} />
              <div className="mt-2 px-1 flex items-start gap-2 text-[11px] text-[#8F98A4] leading-relaxed">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A] mt-0.5 flex-shrink-0" />
                {recommendation.reason}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
