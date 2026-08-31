import React from 'react';
import { Calendar, Award, Flame, ArrowRight, Layers } from 'lucide-react';
import { Program } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/programas/${program.slug}`)}
      className="group relative bg-[#15191F] hover:bg-[#191E24] border border-[#1F2630] hover:border-[#FF6B1A]/70 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div className="relative h-48 w-full overflow-hidden bg-[#0D1014]">
        <img
          src={program.thumbnail}
          alt={program.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 mix-blend-luminosity brightness-75"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15191F] via-[#15191F]/40 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#FF6B1A] text-white">
            {program.categoryLabel}
          </span>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-black/60 text-white border border-white/10">
            {program.level}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono-num font-bold bg-[#FF6B1A]/20 text-[#FF8D4D] border border-[#FF6B1A]/30 flex items-center gap-1">
            <Award className="w-3 h-3" />
            +{program.xpTotal} XP
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
          <span className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm font-semibold border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-[#FF6B1A]" />
            {program.durationWeeks} semanas
          </span>
          <span className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm font-semibold border border-white/10">
            <Flame className="w-3.5 h-3.5 text-[#FF6B1A]" />
            {program.workoutsPerWeek}x / semana
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xl font-heading text-white tracking-tight group-hover:text-[#FF6B1A] transition-colors">
            {program.title}
          </h3>
          <p className="text-xs font-semibold text-[#FF8D4D] uppercase tracking-wider mt-1">
            {program.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-[#9AA1AA] line-clamp-2 mt-2 leading-relaxed">
            {program.description}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-[#1F2630] flex items-center justify-between">
          <span className="text-xs text-[#9AA1AA] flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#FF6B1A]" />
            Ver currículo completo
          </span>
          <span className="text-xs font-bold text-[#FF6B1A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Acessar
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
