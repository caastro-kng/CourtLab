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
  { id: 'one-ball', label: 'Só 1 bola', description: 'No máximo uma bola', icon: CircleDot },
  { id: 'small-space', label: 'Pouco espaço', description: 'Casa ou área reduzida', icon: House },
  { id: 'half-court', label: 'Meia quadra', description: 'Treinos de meia quadra', icon: MapPin },
  { id: 'no-equipment', label: 'Sem equipamento', description: 'Sem material adicional', icon: Dumbbell }
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
        ].join(' ').toLowerCase();
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <header className="relative overflow-hidden pb-6 border-b border-white/[0.06]">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#FF6B1A]/8 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl">
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-[0.2em] text-[#FF6B1A] block mb-2">Skill Development Library</span>
          <h1 className="text-3xl sm:text-5xl font-heading text-white tracking-tight leading-none">O QUE VOCÊ CONSEGUE TREINAR AGORA?</h1>
          <p className="text-sm text-[#909AA6] mt-3 max-w-2xl leading-relaxed">
            Encontre exercícios pelo que quer desenvolver, espaço e equipamento. Cada exercício conecta <strong className="text-white">DRILL → SKILL → GAME</strong>.
          </p>
        </div>
      </header>

      {selectedCategory === 'all' && !searchQuery && !quickContext && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF8D4D] flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Para você agora</span>
              <h2 className="text-xl sm:text-2xl font-heading text-white mt-1">Prioridades para {mainFocusArea.name}</h2>
            </div>
            <span className="text-[11px] text-[#707B87]">Perfil + metas + autoavaliação</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-y border-white/[0.06] md:divide-x divide-white/[0.06]">
            {personalizedExercises.map((recommendation, index) => (
              <button
                key={recommendation.item.id}
                type="button"
                onClick={() => onSelectExercise(recommendation.item)}
                className="group text-left px-1 py-5 md:px-5 first:md:pl-0 last:md:pr-0 border-b last:border-b-0 md:border-b-0 border-white/[0.06] hover:bg-white/[0.015] transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black text-[#FF6B1A]">#{index + 1}</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#74808C]">{recommendation.item.categoryLabel}</span>
                </div>
                <h3 className="text-base font-heading text-white group-hover:text-[#FF8D4D] transition-colors">{recommendation.item.name}</h3>
                <p className="text-[11px] text-[#89939E] mt-2 leading-relaxed">{recommendation.reason}</p>
                <div className="flex items-center gap-3 mt-4 text-[10px] text-[#AAB2BC]">
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
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D8792]">Estou na quadra agora</span>
          <h2 className="text-xl font-heading text-white">Filtrar pelo meu contexto</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 border-y border-white/[0.06] py-2">
          {QUICK_CONTEXTS.map(({ id, label, description, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setQuickContext((current) => (current === id ? null : id))}
              className={`min-h-20 px-3 py-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                quickContext === id ? 'bg-[#FF6B1A]/10 text-white' : 'hover:bg-white/[0.025] text-[#A3ACB6]'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${quickContext === id ? 'text-[#FF6B1A]' : 'text-[#737E8A]'}`} />
              <span className="min-w-0">
                <span className="text-sm font-bold text-white block">{label}</span>
                <span className="text-[10px] text-[#7E8893] mt-0.5 block">{description}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4 py-1">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#FF6B1A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar Crossover, Floater, weak hand, closeout, PnR..."
              className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-[#10151B] border border-white/[0.07] text-sm text-white placeholder:text-[#66717C] focus:outline-none focus:border-[#FF6B1A]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8D97A2] hover:text-white" aria-label="Limpar busca"><X className="w-4 h-4" /></button>
            )}
          </div>
          <button
            onClick={() => setShowAdvancedFilters((value) => !value)}
            className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
              showAdvancedFilters ? 'bg-[#FF6B1A]/10 text-white' : 'bg-[#10151B] text-[#9AA1AA] hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Mais filtros
          </button>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="px-4 py-3 rounded-xl bg-transparent text-xs font-bold text-[#AAB2BC] hover:text-white flex items-center justify-center gap-2">
              <X className="w-4 h-4 text-red-400" /> Limpar ({activeFiltersCount})
            </button>
          )}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-white/[0.06] pb-3">
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === category.id ? 'bg-[#FF6B1A] text-white' : 'text-[#8F99A4] hover:text-white hover:bg-white/[0.035]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Clock3 className="w-4 h-4 text-[#FF6B1A]" />
            <span className="text-[10px] uppercase font-bold text-[#808A95]">Tempo</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {TIME_OPTIONS.map((minutes) => (
              <button
                key={minutes}
                onClick={() => setSelectedTime(minutes)}
                className={`min-w-[64px] px-3 py-2 rounded-full text-xs font-mono-num font-bold transition-colors ${
                  selectedTime === minutes ? 'bg-white text-black' : 'text-[#8F99A4] hover:text-white hover:bg-white/[0.035]'
                }`}
              >
                {minutes === 0 ? 'QUALQUER' : `≤ ${minutes} MIN`}
              </button>
            ))}
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/[0.06] animate-in fade-in duration-200">
            <FilterSelect label="Nível" value={selectedDifficulty} onChange={setSelectedDifficulty} options={['Todos os níveis', 'Iniciante', 'Intermediário', 'Avançado', 'Competitivo']} values={['all', 'Iniciante', 'Intermediário', 'Avançado', 'Competitivo']} />
            <FilterSelect label="Espaço" value={selectedSpace} onChange={setSelectedSpace} options={['Qualquer espaço', 'Casa', 'Área pequena', 'Meia quadra', 'Quadra inteira', 'Academia']} values={['all', 'Casa', 'Área pequena', 'Meia quadra', 'Quadra inteira', 'Academia']} />
            <FilterSelect label="Equipamento" value={selectedEquipment} onChange={setSelectedEquipment} options={['Qualquer equipamento', 'Sem equipamento', '1 bola', '2 bolas', 'Cones', 'Cadeira', 'Parede', 'Elástico', 'Bola de tênis', 'Parceiro']} values={['all', 'Sem equipamento', '1 bola', '2 bolas', 'Cones', 'Cadeira', 'Parede', 'Elástico', 'Bola de tênis', 'Parceiro']} />
          </div>
        )}
      </section>

      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#7C8792]">Resultados</span>
          <h2 className="text-xl sm:text-2xl font-heading text-white">{filteredExercises.length} {filteredExercises.length === 1 ? 'exercício encontrado' : 'exercícios encontrados'}</h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#8A949F]"><WandSparkles className="w-4 h-4 text-[#FF6B1A]" /> Abra um exercício para ver execução e aplicação no jogo</div>
      </section>

      {filteredExercises.length === 0 ? (
        <section className="py-14 text-center border-y border-dashed border-white/[0.08]">
          <Target className="w-10 h-10 text-[#FF6B1A] mx-auto mb-3" />
          <h3 className="text-xl font-heading text-white">Nenhum exercício cabe nesses filtros</h3>
          <p className="text-sm text-[#8F98A4] max-w-md mx-auto mt-2">Remova um filtro de espaço, tempo ou equipamento para ampliar as opções.</p>
          <button onClick={clearFilters} className="mt-5 px-5 py-2.5 rounded-xl bg-[#FF6B1A] text-white text-xs font-bold uppercase tracking-wider">Mostrar toda a biblioteca</button>
        </section>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredExercises.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} onSelect={onSelectExercise} />)}
        </div>
      )}

      <section className="py-6 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Trophy className="w-5 h-5 text-[#FF6B1A] flex-shrink-0 mt-1" />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#7C8792]">Método CourtLab</span>
            <h3 className="text-lg font-heading text-white">Não colecione drills. Desenvolva habilidades que aparecem no jogo.</h3>
            <p className="text-xs text-[#8F98A4] mt-1">Cada exercício explica o movimento, a habilidade treinada e a situação em que ela deve ser aplicada.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  values: string[];
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, onChange, options, values }) => (
  <label className="space-y-1.5">
    <span className="text-[10px] uppercase font-bold text-[#808A95]">{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-[#10151B] border border-white/[0.07] text-xs text-white focus:outline-none focus:border-[#FF6B1A]">
      {options.map((option, index) => <option key={values[index]} value={values[index]}>{option}</option>)}
    </select>
  </label>
);
