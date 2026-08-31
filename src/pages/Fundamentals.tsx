import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Target,
  Flame,
  Footprints,
  Send,
  Layers,
  Shield,
  Compass,
  ArrowRight,
  Sparkles,
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react';
import { FUNDAMENTALS_DATA, FundamentalCategory } from '../data/fundamentals';

export const Fundamentals: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(FUNDAMENTALS_DATA[0].id);
  const navigate = useNavigate();

  const selectedCategory: FundamentalCategory =
    FUNDAMENTALS_DATA.find((f) => f.id === selectedCategoryId) || FUNDAMENTALS_DATA[0];

  const getIcon = (id: string) => {
    switch (id) {
      case 'ball-handle':
        return Activity;
      case 'shooting':
        return Target;
      case 'finishing':
        return Flame;
      case 'footwork':
        return Footprints;
      case 'passing':
        return Send;
      case 'pick-and-roll':
        return Layers;
      case 'defense':
        return Shield;
      case 'off-ball':
        return Compass;
      default:
        return Activity;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
          Enciclopédia de Skill Development
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">
          ÁRVORE DE FUNDAMENTOS
        </h1>
        <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1 max-w-2xl">
          A anatomia completa do basquete moderno dividida em 8 pilares fundamentais e mais de 100 subcategorias técnicas detalhadas.
        </p>
      </div>

      {/* 8 Core Fundamental Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {FUNDAMENTALS_DATA.map((item) => {
          const Icon = getIcon(item.id);
          const isSelected = item.id === selectedCategoryId;

          return (
            <button
              key={item.id}
              onClick={() => setSelectedCategoryId(item.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[110px] ${
                isSelected
                  ? 'bg-[#FF6B1A]/20 border-[#FF6B1A] shadow-lg shadow-[#FF6B1A]/20 scale-102'
                  : 'bg-[#15191F] border-[#1F2630] hover:border-[#2B3542] hover:bg-[#1C222B]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-[#FF6B1A] text-white' : 'bg-[#0D1014] text-[#FF6B1A]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <span className="text-xs font-heading text-white block line-clamp-1 leading-tight">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono-num text-[#9AA1AA]">
                  {item.subcategories.length} tópicos
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Pillar Technical Deep-Dive Inspector */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2630] pb-6">
          <div>
            <span className="text-xs font-mono-num font-bold uppercase tracking-widest text-[#FF6B1A] block mb-1">
              Pilar Técnico
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading text-white tracking-tight">
              {selectedCategory.name}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#FF8D4D] mt-1">
              "{selectedCategory.tagline}"
            </p>
            <p className="text-xs sm:text-sm text-[#9AA1AA] mt-2 max-w-2xl leading-relaxed">
              {selectedCategory.description}
            </p>
          </div>

          <button
            onClick={() => navigate(`/biblioteca?category=${selectedCategory.id}`)}
            className="py-3.5 px-6 rounded-2xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#FF6B1A]/20 flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-center"
          >
            <BookOpen className="w-4 h-4" />
            Ver Todos os Drills de {selectedCategory.name}
          </button>
        </div>

        {/* Subcategories Skill Tree Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-heading text-white">
              Subcategorias Técnicas & Progressão
            </h3>
            <span className="text-xs text-[#9AA1AA] font-mono-num">
              {selectedCategory.subcategories.length} Especializações
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCategory.subcategories.map((sub, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-[#15191F] border border-[#1F2630] hover:border-[#FF6B1A]/40 transition-colors flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-heading text-white line-clamp-1">
                      {sub.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        sub.difficulty === 'Iniciante'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : sub.difficulty === 'Intermediário'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : sub.difficulty === 'Avançado'
                          ? 'bg-[#FF6B1A]/10 text-[#FF8D4D] border border-[#FF6B1A]/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {sub.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-[#9AA1AA] leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1F2630] flex items-center justify-between">
                  <span className="text-[11px] font-mono-num text-[#9AA1AA]">
                    {sub.drillsCount} Drills Práticos
                  </span>
                  <button
                    onClick={() => navigate(`/biblioteca?category=${selectedCategory.id}`)}
                    className="text-xs font-bold text-[#FF6B1A] hover:underline flex items-center gap-1"
                  >
                    Treinar
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
