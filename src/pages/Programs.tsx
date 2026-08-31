import React, { useMemo } from 'react';
import { Calendar, Award, Flame, ArrowRight, Route, Target, CheckCircle2, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PROGRAMS_DATA } from '../data/programs';
import { ProgramCard } from '../components/common/ProgramCard';
import { usePlayer } from '../context/PlayerContext';

export const Programs: React.FC = () => {
  const navigate = useNavigate();
  const { workoutLogs } = usePlayer();

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

  const activeProgram = programStats.find((item) => item.completed > 0 && item.percentage < 100);
  const featured = activeProgram?.program || PROGRAMS_DATA.find((program) => program.category === 'complete') || PROGRAMS_DATA[0];
  const featuredStats = programStats.find((item) => item.program.id === featured.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="max-w-3xl">
        <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">Trilhas de Desenvolvimento</span>
        <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">PROGRAMAS</h1>
        <p className="text-xs sm:text-sm text-[#9AA1AA] mt-2 leading-relaxed">
          Evolua por etapas, com semanas organizadas, sessões progressivas e transferência para jogo. Aqui o objetivo não é fazer drills soltos: é construir uma skill até ela aparecer na partida.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-[#FF6B1A]/35 bg-[#0D1014] p-5 sm:p-7">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B1A]/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.5fr_.8fr] gap-6 items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF6B1A] text-white">
                {activeProgram ? 'Continuar programa' : 'Programa recomendado'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase bg-[#15191F] text-[#9AA1AA] border border-[#1F2630]">{featured.level}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-heading text-white leading-tight">{featured.title}</h2>
            <p className="text-sm font-semibold text-[#FF8D4D] mt-1">{featured.subtitle}</p>
            <p className="text-xs sm:text-sm text-[#9AA1AA] mt-3 max-w-2xl leading-relaxed">{featured.description}</p>

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

          <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA]">Progresso da trilha</span>
              <span className="text-xl font-mono-num font-bold text-white">{featuredStats?.percentage || 0}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#080A0D] overflow-hidden mb-4">
              <div className="h-full bg-[#FF6B1A] rounded-full" style={{ width: `${featuredStats?.percentage || 0}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#0D1014] border border-[#1F2630]">
                <span className="text-[10px] uppercase text-[#9AA1AA] block">Sessões</span>
                <span className="text-lg font-heading text-white">{featuredStats?.completed || 0}/{featuredStats?.total || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1014] border border-[#1F2630]">
                <span className="text-[10px] uppercase text-[#9AA1AA] block">Método</span>
                <span className="text-sm font-bold text-emerald-400">Drill → Skill → Game</span>
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
          <h3 className="text-sm font-heading text-white">Objetivo claro</h3>
          <p className="text-xs text-[#9AA1AA] mt-1">Você sabe qual skill está construindo e onde ela entra no jogo.</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-3" />
          <h3 className="text-sm font-heading text-white">Progresso real</h3>
          <p className="text-xs text-[#9AA1AA] mt-1">Sessões concluídas alimentam o progresso automaticamente.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA]">Escolha sua trilha</span>
          <h2 className="text-2xl font-heading text-white mt-1">Desenvolvimento por objetivo</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS_DATA.map((program) => <ProgramCard key={program.id} program={program} />)}
        </div>
      </section>
    </div>
  );
};
