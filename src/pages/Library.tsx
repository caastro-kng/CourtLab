import React, { useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  Target,
  SlidersHorizontal,
  Dumbbell,
  MapPin,
  Clock3,
  WandSparkles,
  CircleDot,
  House,
  Trophy,
  Sparkles
} from 'lucide-react';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseCard } from '../components/common/ExerciseCard';
import { Exercise } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { rankExercises } from '../utils/personalization';

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Todos' },
  { id: 'ball-handle', label: 'Ball Handle' },
  { id: 'shooting', label: 'Arremesso' },
  { id: 'finishing', label: 'Finalização' },
  { id: 'footwork', label: 'Footwork' },
  { id: 'passing', label: 'Passe' },
  { id: 'pick-and-roll', label: 'Pick and Roll' },
  { id: 'defense', label: 'Defesa' },
  { id: 'off-ball', label: 'Sem Bola' },
  { id: 'athletic', label: 'Físico' }
];

const QUICK_CONTEXTS = [
  { id: 'one-ball', label: 'Só 1 bola', icon: CircleDot },
  { id: 'small-space', label: 'Pouco espaço', icon: House },
  { id: 'half-court', label: 'Meia quadra', icon: MapPin },
  { id: 'no-equipment', label: 'Sem equipamento', icon: Dumbbell }
] as const;

const TIME_OPTIONS = [0, 10, 15, 20, 30];

export const Library: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const { onSelectExercise } = useOutletContext<{ onSelectExercise: (e: Exercise) => void }>();
  const { profile, skillsRating, goals, mainFocusArea } = usePlayer();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSpace, setSelectedSpace] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [selectedTime, setSelectedTime] = useState(0);
  const [quickContext, setQuickContext] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const personalizedExercises = useMemo(
    () => rankExercises(EXERCISES_DATA, profile, skillsRating, goals).slice(0, 3),
    [profile, skillsRating, goals]
  );

  const filteredExercises = useMemo(() => {
    return EXERCISES_DATA.filter((exercise) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchable = [
          exercise.name,
          exercise.subcategory,
          exercise.description,
          exercise.categoryLabel,
          exercise.gameTransfer.skill,
          exercise.gameTransfer.gameSituation,
          exercise.gameTransfer.objective,
          ...exercise.equipment
        ]
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      if (selectedCategory !== 'all' && exercise.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'all' && exercise.difficulty !== selectedDifficulty) return false;
      if (selectedSpace !== 'all' && exercise.space !== selectedSpace) return false;
      if (selectedTime > 0 && exercise.durationMinutes > selectedTime) return false;

      if (selectedEquipment !== 'all') {
        const equipmentMatch = exercise.equipment.some((item) => item.toLowerCase() === selectedEquipment.toLowerCase());
        if (!equipmentMatch) return false;
      }

      if (quickContext === 'one-ball') {
        const allowed = exercise.equipment.every((item) => ['1 bola', 'Sem equipamento'].includes(item));
        if (!allowed) return false;
      }
      if (quickContext === 'small-space' && !['Casa', 'Área pequena'].includes(exercise.space)) return false;
      if (quickContext === 'half-court' && exercise.space !== 'Meia quadra') return false;
      if (quickContext === 'no-equipment' && !exercise.equipment.includes('Sem equipamento')) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedSpace, selectedEquipment, selectedTime, quickContext]);

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedDifficulty !== 'all',
    selectedSpace !== 'all',
    selectedEquipment !== 'all',
    selectedTime > 0,
    !!quickContext,
    !!searchQuery.trim()
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedSpace('all');
    setSelectedEquipment('all');
    setSelectedTime(0);
    setQuickContext(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-7 animate-in fade-in duration-300">
      <section className="relative overflow-hidden rounded-3xl border border-[#1F2630] bg-[#0D1014] p-5 sm:p-7">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#FF6B1A]/10 blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-[0.2em] text-[#FF6B1A] block mb-2">
            Skill Development Library
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading text-white tracking-tight leading-none">
            O QUE VOCÊ CONSEGUE TREINAR AGORA?
          </h1>
          <p className="text-sm text-[#9AA1AA] mt-3 max-w-2xl leading-relaxed">
            Encontre exercícios pelo que você quer desenvolver, pelo espaço que tem e pelo equipamento disponível. Cada exercício conecta <strong className="text-white">DRILL → SKILL → GAME</strong>.
          </p>
        </div>
      </section>

      {selectedCategory === 'all' && !searchQuery && !quickContext && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF8D4D] flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Para você agora</span>
              <h2 className="text-xl sm:text-2xl font-heading text-white mt-1">Prioridades para {mainFocusArea.name}</h2>
            </div>
            <span className="text-[11px] text-[#7F8995]">Perfil + metas + autoavaliação</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personalizedExercises.map((recommendation, index) => (
              <button
                key={recommendation.item.id}
                type="button"
                onClick={() => onSelectExercise(recommendation.item)}
                className="rounded-2xl border border-[#FF6B1A]/25 bg-[#11151A] hover:border-[#FF6B1A]/60 p-4 text-left transition-all group"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-[#FF6B1A]/10 text-[#FF6B1A] flex items-center justify-center text-xs font-black">#{index + 1}</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#8F98A4]">{recommendation.item.categoryLabel}</span>
                </div>
                <h3 className="text-base font-heading text-white group-hover:text-[#FF8D4D] transition-colors">{recommendation.item.name}</h3>
                <p className="text-[11px] text-[#8F98A4] mt-2 leading-relaxed">{recommendation.reason}</p>
                <div className="flex items-center gap-3 mt-4 text-[10px] text-[#ADB5BE]">
                  <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5 text-[#FF6B1A]" />{recommendation.item.durationMinutes} min</span>
                  <span>{recommendation.item.difficulty}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA]">Estou na quadra agora</span>
          <h2 className="text-xl font-heading text-white">Filtrar pelo meu contexto</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_CONTEXTS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setQuickContext((current) => (current === id ? null : id))}
              className={`p-4 rounded-2xl border text-left transition-all ${
                quickContext === id
                  ? 'bg-[#FF6B1A]/12 border-[#FF6B1A] shadow-lg shadow-[#FF6B1A]/10'
                  : 'bg-[#11151A] border-[#1F2630] hover:border-[#394452]'
              }`}
            >
              <Icon className={`w-5 h-5 mb-3 ${quickContext === id ? 'text-[#FF6B1A]' : 'text-[#9AA1AA]'}`} />
              <span className="text-sm font-bold text-white block">{label}</span>
              <span className="text-[11px] text-[#9AA1AA] mt-1 block">
                {id === 'one-ball' && 'Exercícios que exigem no máximo uma bola'}
                {id === 'small-space' && 'Casa, garagem ou área reduzida'}
                {id === 'half-court' && 'Treinos que cabem em meia quadra'}
                {id === 'no-equipment' && 'Movimentos sem material adicional'}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[#0D1014] border border-[#1F2630] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#FF6B1A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar Crossover, Floater, weak hand, closeout, PnR..."
              className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white placeholder:text-[#737A84] focus:outline-none focus:border-[#FF6B1A]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9AA1AA] hover:text-white" aria-label="Limpar busca">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowAdvancedFilters((value) => !value)}
            className={`px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
              showAdvancedFilters ? 'bg-[#FF6B1A]/10 border-[#FF6B1A] text-white' : 'bg-[#15191F] border-[#1F2630] text-[#9AA1AA] hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Mais filtros
          </button>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-xs font-bold text-white hover:border-red-400/50 flex items-center justify-center gap-2">
              <X className="w-4 h-4 text-red-400" />
              Limpar ({activeFiltersCount})
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white'
                  : 'bg-[#15191F] border-[#1F2630] text-[#9AA1AA] hover:text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="pt-3 border-t border-[#1F2630]">
          <div className="flex items-center gap-2 mb-2">
            <Clock3 className="w-4 h-4 text-[#FF6B1A]" />
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Quanto tempo tenho?</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {TIME_OPTIONS.map((minutes) => (
              <button
                key={minutes}
                onClick={() => setSelectedTime(minutes)}
                className={`min-w-[64px] px-3 py-2 rounded-xl border text-xs font-mono-num font-bold transition-colors ${
                  selectedTime === minutes ? 'bg-white text-black border-white' : 'bg-[#15191F] border-[#1F2630] text-[#9AA1AA] hover:text-white'
                }`}
              >
                {minutes === 0 ? 'QUALQUER' : `≤ ${minutes} MIN`}
              </button>
            ))}
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#1F2630] animate-in fade-in duration-200">
            <label className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Nível</span>
              <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-xs text-white focus:outline-none focus:border-[#FF6B1A]">
                <option value="all">Todos os níveis</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Competitivo">Competitivo</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Espaço</span>
              <select value={selectedSpace} onChange={(e) => setSelectedSpace(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-xs text-white focus:outline-none focus:border-[#FF6B1A]">
                <option value="all">Qualquer espaço</option>
                <option value="Casa">Casa</option>
                <option value="Área pequena">Área pequena</option>
                <option value="Meia quadra">Meia quadra</option>
                <option value="Quadra inteira">Quadra inteira</option>
                <option value="Academia">Academia</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Equipamento</span>
              <select value={selectedEquipment} onChange={(e) => setSelectedEquipment(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-xs text-white focus:outline-none focus:border-[#FF6B1A]">
                <option value="all">Qualquer equipamento</option>
                <option value="Sem equipamento">Sem equipamento</option>
                <option value="1 bola">1 bola</option>
                <option value="2 bolas">2 bolas</option>
                <option value="Cones">Cones</option>
                <option value="Cadeira">Cadeira</option>
                <option value="Parede">Parede</option>
                <option value="Elástico">Elástico</option>
                <option value="Bola de tênis">Bola de tênis</option>
                <option value="Parceiro">Parceiro</option>
              </select>
            </label>
          </div>
        )}
      </section>

      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9AA1AA]">Resultados</span>
          <h2 className="text-xl sm:text-2xl font-heading text-white">
            {filteredExercises.length} {filteredExercises.length === 1 ? 'exercício encontrado' : 'exercícios encontrados'}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#9AA1AA]">
          <WandSparkles className="w-4 h-4 text-[#FF6B1A]" />
          Abra um exercício para ver execução e aplicação no jogo
        </div>
      </section>

      {filteredExercises.length === 0 ? (
        <section className="p-10 text-center border-2 border-dashed border-[#1F2630] rounded-3xl bg-[#0D1014]">
          <Target className="w-10 h-10 text-[#FF6B1A] mx-auto mb-3" />
          <h3 className="text-xl font-heading text-white">Nenhum exercício cabe nesses filtros</h3>
          <p className="text-sm text-[#9AA1AA] max-w-md mx-auto mt-2">
            Remova um filtro de espaço, tempo ou equipamento para ampliar as opções disponíveis.
          </p>
          <button onClick={clearFilters} className="mt-5 px-5 py-2.5 rounded-xl bg-[#FF6B1A] text-white text-xs font-bold uppercase tracking-wider">
            Mostrar toda a biblioteca
          </button>
        </section>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} onSelect={onSelectExercise} />
          ))}
        </div>
      )}

      <section className="rounded-3xl border border-[#1F2630] bg-[#11151A] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B1A]/10 text-[#FF6B1A] flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA]">Método CourtLab</span>
            <h3 className="text-lg font-heading text-white">Não colecione drills. Desenvolva habilidades que aparecem no jogo.</h3>
            <p className="text-xs text-[#9AA1AA] mt-1">Cada exercício explica o movimento, a habilidade treinada e a situação em que ela deve ser aplicada.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
