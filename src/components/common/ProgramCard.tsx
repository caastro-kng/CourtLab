import React, { useMemo } from 'react';
import { Calendar, Award, Flame, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { Program } from '../../types';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const navigate = useNavigate();
  const { workoutLogs } = usePlayer();

  const progress = useMemo(() => {
    const workoutIds = program.weeks.flatMap((week) =>
      week.days.filter((day) => day.workoutId && !day.isRest).map((day) => day.workoutId as string)
    );
    const completedIds = new Set(workoutLogs.map((log) => log.workoutId));
    const completed = workoutIds.filter((id) => completedIds.has(id)).length;
    const total = workoutIds.length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [program, workoutLogs]);

  return (
    <button
      type="button"
      onClick={() => navigate(`/programas/${program.slug}`)}
      className="group relative text-left bg-[#15191F] hover:bg-[#191E24] border border-[#1F2630] hover:border-[#FF6B1A]/70 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
      aria-label={`Abrir programa ${program.title}`}
    >
      <div className="relative h-44 w-full overflow-hidden bg-[#0D1014]">
        <img
          src={program.thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 mix-blend-luminosity brightness-75"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15191F] via-[#15191F]/35 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#FF6B1A] text-white">{program.categoryLabel}</span>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-black/60 text-white border border-white/10">{program.level}</span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono-num font-bold bg-black/65 text-[#FF8D4D] border border-white/10 flex items-center gap-1">
            <Award className="w-3 h-3" /> +{program.xpTotal} XP
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between w-full">
        <div>
          <h3 className="text-xl font-heading text-white tracking-tight group-hover:text-[#FF6B1A] transition-colors">{program.title}</h3>
          <p className="text-xs font-semibold text-[#FF8D4D] uppercase tracking-wider mt-1">{program.subtitle}</p>
          <p className="text-xs sm:text-sm text-[#9AA1AA] line-clamp-2 mt-2 leading-relaxed">{program.description}</p>

          <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-[#9AA1AA]">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#FF6B1A]" />{program.durationWeeks} semanas</span>
            <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-[#FF6B1A]" />{program.workoutsPerWeek}x / semana</span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider mb-1.5">
              <span className="text-[#9AA1AA]">Progresso</span>
              <span className={progress.percentage === 100 ? 'text-emerald-400' : 'text-white'}>{progress.completed}/{progress.total} sessões</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#0D1014] overflow-hidden">
              <div className="h-full rounded-full bg-[#FF6B1A] transition-all" style={{ width: `${progress.percentage}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#1F2630] flex items-center justify-between">
          <span className="text-xs text-[#9AA1AA] flex items-center gap-1">
            {progress.percentage === 100 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5 text-[#FF6B1A]" />}
            {progress.percentage === 100 ? 'Programa concluído' : progress.completed > 0 ? 'Continuar trilha' : 'Ver trilha completa'}
          </span>
          <span className="text-xs font-bold text-[#FF6B1A] group-hover:translate-x-1 transition-transform flex items-center gap-1">Acessar <ArrowRight className="w-3.5 h-3.5" /></span>
        </div>
      </div>
    </button>
  );
};
