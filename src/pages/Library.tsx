import React, { useState, useMemo } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  Target,
  SlidersHorizontal,
  Dumbbell,
  Sparkles,
  MapPin
} from 'lucide-react';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseCard } from '../components/common/ExerciseCard';
import { Exercise } from '../types';

export const Library: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const { onSelectExercise } = useOutletContext<{ onSelectExercise: (e: Exercise) => void }>();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSpace, setSelectedSpace] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos os Fundamentos' },
    { id: 'ball-handle', label: 'Controle de Bola' },
    { id: 'shooting', label: 'Arremesso' },
    { id: 'finishing', label: 'Finalização' },
    { id: 'footwork', label: 'Footwork' },
    { id: 'passing', label: 'Passe' },
    { id: 'pick-and-roll', label: 'Pick and Roll' },
    { id: 'defense', label: 'Defesa' },
    { id: 'athletic', label: 'Físico / Pliometria' }
  ];

  const difficulties = ['all', 'Iniciante', 'Intermediário', 'Avançado', 'Competitivo'];
  const spaces = ['all', 'Meia quadra', 'Garrafão', 'Espaço reduzido', 'Quadra inteira', 'Parede'];
  const equipments = ['all', '1 Bola', '2 Bolas', 'Cones', 'Tabela', 'Bola de tênis'];

  // Filter Logic
  const filteredExercises = useMemo(() => {
    return EXERCISES_DATA.filter((exercise) => {
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          exercise.name.toLowerCase().includes(q) ||
          exercise.subcategory.toLowerCase().includes(q) ||
          exercise.description.toLowerCase().includes(q) ||
          exercise.categoryLabel.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Category match
      if (selectedCategory !== 'all' && exercise.category !== selectedCategory) {
        return false;
      }

      // Difficulty match
      if (selectedDifficulty !== 'all' && exercise.difficulty !== selectedDifficulty) {
        return false;
      }

      // Space match
      if (selectedSpace !== 'all' && !exercise.space.toLowerCase().includes(selectedSpace.toLowerCase())) {
        return false;
      }

      // Equipment match
      if (selectedEquipment !== 'all') {
        const hasEquip = exercise.equipment.some((eq) =>
          eq.toLowerCase().includes(selectedEquipment.toLowerCase().replace('1 bola', 'bola'))
        );
        if (!hasEquip) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedSpace, selectedEquipment]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedDifficulty !== 'all' ? 1 : 0) +
    (selectedSpace !== 'all' ? 1 : 0) +
    (selectedEquipment !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedSpace('all');
    setSelectedEquipment('all');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
          Base de Conhecimento Técnico
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">
          BIBLIOTECA DE EXERCÍCIOS
        </h1>
        <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1 max-w-2xl">
          Mais de 30 exercícios profissionais detalhados com biomecânica, pontos-chave, erros comuns e aplicação tática direta (DRILL → SKILL → GAME).
        </p>
      </div>

      {/* Filter Control Center */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-4 shadow-xl">
        {/* Search Bar & Clear Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#FF6B1A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, subcategoria ou fundamento (ex: Crossover, Floater, PnR)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-xs sm:text-sm text-white placeholder-[#9AA1AA] focus:outline-none focus:border-[#FF6B1A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#9AA1AA] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-3 rounded-xl bg-[#191E24] hover:bg-[#202730] text-xs font-bold uppercase tracking-wider text-white border border-[#2B3542] transition-colors flex items-center gap-1.5 whitespace-nowrap self-stretch sm:self-auto justify-center"
            >
              <X className="w-3.5 h-3.5 text-red-400" />
              Limpar Filtros ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-[#FF6B1A] text-white border-[#FF6B1A] shadow-md shadow-[#FF6B1A]/20'
                  : 'bg-[#15191F] border-[#1F2630] text-[#9AA1AA] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary Select Dropdowns (Difficulty, Space, Equipment) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#1F2630]">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#9AA1AA] block mb-1">
              Dificuldade
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#15191F] border border-[#1F2630] text-xs text-white focus:outline-none focus:border-[#FF6B1A]"
            >
              <option value="all">Todas as Dificuldades</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
              <option value="Competitivo">Competitivo</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#9AA1AA] block mb-1">
              Espaço Disponível
            </label>
            <select
              value={selectedSpace}
              onChange={(e) => setSelectedSpace(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#15191F] border border-[#1F2630] text-xs text-white focus:outline-none focus:border-[#FF6B1A]"
            >
              <option value="all">Qualquer Espaço</option>
              <option value="Meia quadra">Meia Quadra</option>
              <option value="Garrafão">Garrafão</option>
              <option value="Espaço reduzido">Espaço Reduzido (Garagem/Quarto)</option>
              <option value="Quadra inteira">Quadra Inteira</option>
              <option value="Parede">Parede de Rebote</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#9AA1AA] block mb-1">
              Equipamento
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#15191F] border border-[#1F2630] text-xs text-white focus:outline-none focus:border-[#FF6B1A]"
            >
              <option value="all">Qualquer Equipamento</option>
              <option value="1 Bola">1 Bola de Basquete</option>
              <option value="2 Bolas">2 Bolas Simultâneas</option>
              <option value="Cones">Com Cones</option>
              <option value="Tabela">Com Tabela / Aro</option>
              <option value="Bola de tênis">Bola de Tênis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono-num text-[#9AA1AA]">
          Mostrando <strong className="text-white font-bold">{filteredExercises.length}</strong> exercícios
        </span>
      </div>

      {/* Exercises Grid */}
      {filteredExercises.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[#1F2630] rounded-3xl space-y-3 bg-[#0D1014]">
          <Target className="w-10 h-10 text-[#FF6B1A] mx-auto opacity-50" />
          <h3 className="text-lg font-heading text-white">Nenhum exercício encontrado</h3>
          <p className="text-xs text-[#9AA1AA] max-w-sm mx-auto">
            Tente ajustar os filtros de busca ou limpar as seleções para ver mais resultados.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-[#FF6B1A] text-white text-xs font-bold uppercase tracking-wider"
          >
            Resetar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelect={onSelectExercise}
            />
          ))}
        </div>
      )}
    </div>
  );
};
