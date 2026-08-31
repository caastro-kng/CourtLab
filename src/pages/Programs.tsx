import React from 'react';
import { Layers, Sparkles, CheckCircle2, Calendar, Award, Flame } from 'lucide-react';
import { PROGRAMS_DATA } from '../data/programs';
import { ProgramCard } from '../components/common/ProgramCard';

export const Programs: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
          Currículos Estruturados
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">
          PROGRAMAS DE DESENVOLVIMENTO
        </h1>
        <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1 max-w-2xl">
          Periodizações completas de 3 a 8 semanas com progressão pedagógica rigorosa. Da biomecânica básica à simulação sob pressão de jogo real.
        </p>
      </div>

      {/* Featured Banner: COMPLETE GUARD */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#191E24] via-[#12161C] to-[#0D1014] border border-[#FF6B1A]/40 p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF6B1A] text-white">
              Programa em Destaque
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase bg-black/50 text-[#9AA1AA] border border-white/10">
              8 Semanas
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">
            COMPLETE GUARD: O Armador Moderno
          </h2>

          <p className="text-xs sm:text-sm text-[#9AA1AA] leading-relaxed">
            Desenvolvido para armadores e alas que precisam de domínio absoluto da bola, tomada de decisão veloz no Pick and Roll, desaceleração para pull-up e liderança vocal na quadra.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/90 pt-2">
            <span className="flex items-center gap-1 font-semibold">
              <Calendar className="w-4 h-4 text-[#FF6B1A]" />
              8 Semanas de Duração
            </span>
            <span className="flex items-center gap-1 font-semibold">
              <Flame className="w-4 h-4 text-[#FF6B1A]" />
              4 Treinos por Semana
            </span>
            <span className="flex items-center gap-1 font-bold text-[#FF8D4D]">
              <Award className="w-4 h-4" />
              +1200 XP Total
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROGRAMS_DATA.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
};
