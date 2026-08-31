import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Flame,
  Plus,
  Zap,
  Dumbbell,
  Clock,
  Trash2,
  CheckCircle2,
  Search,
  ArrowUpDown,
  Sparkles,
  Layers,
  Target
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { WORKOUTS_DATA } from '../data/workouts';
import { EXERCISES_DATA } from '../data/exercises';
import { WorkoutCard } from '../components/common/WorkoutCard';
import { Workout, Exercise } from '../types';

export const TrainHub: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'builder' ? 'builder' : 'workouts';

  const [activeTab, setActiveTab] = useState<'workouts' | 'builder' | 'quick'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { startWorkout, customWorkouts, saveCustomWorkout } = usePlayer();

  // Custom Workout Builder State
  const [builderTitle, setBuilderTitle] = useState('');
  const [builderDescription, setBuilderDescription] = useState('');
  const [builderCategory, setBuilderCategory] = useState<'shooting' | 'ball-handle' | 'finishing' | 'complete'>('shooting');
  const [builderItems, setBuilderItems] = useState<{ exerciseId: string; customSets: number; customReps: string; restSeconds: number }[]>([
    { exerciseId: 'bh-01', customSets: 3, customReps: '20 reps', restSeconds: 30 },
    { exerciseId: 'sh-02', customSets: 3, customReps: '10 cada lado', restSeconds: 30 }
  ]);
  const [drillSearchQuery, setDrillSearchQuery] = useState('');

  // Handle category filtering
  const allWorkouts = [...customWorkouts, ...WORKOUTS_DATA];
  const filteredWorkouts = selectedCategory === 'all'
    ? allWorkouts
    : allWorkouts.filter((w) => w.category === selectedCategory);

  const quickWorkouts = allWorkouts.filter((w) => w.estimatedMinutes <= 30);

  const handleAddDrillToBuilder = (exercise: Exercise) => {
    setBuilderItems((prev) => [
      ...prev,
      { exerciseId: exercise.id, customSets: exercise.sets || 3, customReps: exercise.reps || '15 reps', restSeconds: 30 }
    ]);
  };

  const handleRemoveBuilderItem = (index: number) => {
    setBuilderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCustomWorkout = () => {
    if (!builderTitle.trim() || builderItems.length === 0) return;

    const newWorkout: Workout = {
      id: 'custom-' + Date.now(),
      title: builderTitle.trim(),
      slug: builderTitle.toLowerCase().replace(/\s+/g, '-'),
      description: builderDescription.trim() || 'Treino personalizado montado no Court Lab Builder.',
      category: builderCategory,
      categoryLabel: builderCategory === 'shooting' ? 'Arremesso' : builderCategory === 'ball-handle' ? 'Controle de Bola' : 'Finalização',
      level: 'Intermediário',
      estimatedMinutes: builderItems.length * 5 + 10,
      xpReward: builderItems.length * 15 + 40,
      tags: ['Personalizado', 'Custom Lab'],
      thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
      exercises: builderItems
    };

    saveCustomWorkout(newWorkout);
    setActiveTab('workouts');
    setBuilderTitle('');
  };

  const filteredDrillsForBuilder = drillSearchQuery
    ? EXERCISES_DATA.filter((e) =>
        e.name.toLowerCase().includes(drillSearchQuery.toLowerCase()) ||
        e.categoryLabel.toLowerCase().includes(drillSearchQuery.toLowerCase())
      )
    : EXERCISES_DATA.slice(0, 6);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 1. Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
            Centro de Treinamento
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">
            ÁREA DE TREINO
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1">
            Escolha uma rotina pronta, crie seu próprio treino personalizado ou execute uma sessão expressa.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 bg-[#11151A] rounded-2xl border border-[#1F2630] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('workouts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'workouts'
                ? 'bg-[#FF6B1A] text-white shadow-md'
                : 'text-[#9AA1AA] hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Treinos Prontos
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'builder'
                ? 'bg-[#FF6B1A] text-white shadow-md'
                : 'text-[#9AA1AA] hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Montar Treino
          </button>
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? 'bg-[#FF6B1A] text-white shadow-md'
                : 'text-[#9AA1AA] hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Treino Rápido
          </button>
        </div>
      </div>

      {/* 2. TAB: Treinos Prontos */}
      {activeTab === 'workouts' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'Todos os Treinos' },
              { id: 'shooting', label: 'Arremesso' },
              { id: 'ball-handle', label: 'Controle de Bola' },
              { id: 'finishing', label: 'Finalização' },
              { id: 'pick-and-roll', label: 'Pick and Roll' },
              { id: 'defense', label: 'Defesa' },
              { id: 'complete', label: 'Completo' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF6B1A]/20 border-[#FF6B1A] text-white'
                    : 'bg-[#15191F] border-[#1F2630] text-[#9AA1AA] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Workouts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onStart={startWorkout}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB: Montar Treino (Custom Workout Builder) */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Workout Details & Sequence Builder */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-6">
            <div>
              <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
                Custom Lab Builder
              </span>
              <h2 className="text-2xl font-heading text-white">Configurar Sequência</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1.5">
                  Nome do Treino
                </label>
                <input
                  type="text"
                  value={builderTitle}
                  onChange={(e) => setBuilderTitle(e.target.value)}
                  placeholder="Ex: Minha Rotina Matinal de Arremesso"
                  className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white placeholder-[#9AA1AA] focus:outline-none focus:border-[#FF6B1A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1.5">
                    Categoria Principal
                  </label>
                  <select
                    value={builderCategory}
                    onChange={(e) => setBuilderCategory(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]"
                  >
                    <option value="shooting">Arremesso</option>
                    <option value="ball-handle">Controle de Bola</option>
                    <option value="finishing">Finalização</option>
                    <option value="complete">Completo</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1.5">
                    Descrição do Foco
                  </label>
                  <input
                    type="text"
                    value={builderDescription}
                    onChange={(e) => setBuilderDescription(e.target.value)}
                    placeholder="Ex: Foco em 1-dribble pull-ups e floaters"
                    className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white placeholder-[#9AA1AA] focus:outline-none focus:border-[#FF6B1A]"
                  />
                </div>
              </div>
            </div>

            {/* Sequence Drills List */}
            <div className="space-y-3 pt-4 border-t border-[#1F2630]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-[#FF6B1A]" />
                  Sequência de Exercícios ({builderItems.length})
                </h3>
                <span className="text-xs text-[#9AA1AA]">
                  Tempo Estimado: ~{builderItems.length * 5 + 10} min
                </span>
              </div>

              {builderItems.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-[#1F2630] rounded-2xl text-[#9AA1AA]">
                  <p className="text-sm">Nenhum exercício adicionado ainda.</p>
                  <p className="text-xs mt-1">Selecione exercícios da biblioteca ao lado para montar sua rotina.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {builderItems.map((item, index) => {
                    const drill = EXERCISES_DATA.find((e) => e.id === item.exerciseId);

                    return (
                      <div
                        key={index}
                        className="p-3.5 rounded-xl bg-[#15191F] border border-[#1F2630] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#FF6B1A]/20 text-[#FF6B1A] font-mono-num font-bold text-xs flex items-center justify-center border border-[#FF6B1A]/30">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-white">
                              {drill?.name || item.exerciseId}
                            </h4>
                            <span className="text-[11px] text-[#9AA1AA]">
                              {drill?.subcategory || 'Drill Técnico'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="flex items-center gap-1.5 text-xs text-[#9AA1AA]">
                            <span>Séries:</span>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={item.customSets}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setBuilderItems((prev) =>
                                  prev.map((it, idx) => (idx === index ? { ...it, customSets: val } : it))
                                );
                              }}
                              className="w-12 px-2 py-1 rounded bg-[#0D1014] border border-[#2B3542] text-white font-mono-num text-center text-xs"
                            />
                          </div>

                          <button
                            onClick={() => handleRemoveBuilderItem(index)}
                            className="p-1.5 text-[#9AA1AA] hover:text-red-400 transition-colors"
                            aria-label="Remover exercício"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Save & Launch Button */}
            <div className="pt-4 border-t border-[#1F2630] flex items-center gap-3">
              <button
                onClick={handleSaveCustomWorkout}
                disabled={!builderTitle.trim() || builderItems.length === 0}
                className="py-3.5 px-6 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] disabled:opacity-30 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-lg shadow-[#FF6B1A]/20 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Salvar & Adicionar aos Meus Treinos (+50 XP)
              </button>
            </div>
          </div>

          {/* Right Col: Exercise Picker Library */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-4">
            <h3 className="text-lg font-heading text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-[#FF6B1A]" />
              Adicionar Drills da Biblioteca
            </h3>

            <input
              type="text"
              value={drillSearchQuery}
              onChange={(e) => setDrillSearchQuery(e.target.value)}
              placeholder="Buscar drill para incluir..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-xs text-white placeholder-[#9AA1AA] focus:outline-none focus:border-[#FF6B1A]"
            />

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredDrillsForBuilder.map((drill) => (
                <div
                  key={drill.id}
                  className="p-3 rounded-xl bg-[#15191F] border border-[#1F2630] flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{drill.name}</span>
                    <span className="text-[10px] text-[#9AA1AA]">
                      {drill.categoryLabel} • {drill.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddDrillToBuilder(drill)}
                    className="p-2 rounded-lg bg-[#FF6B1A]/10 hover:bg-[#FF6B1A] text-[#FF6B1A] hover:text-white transition-colors"
                    aria-label="Adicionar"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: Treino Rápido (Express Micro-Sessions) */}
      {activeTab === 'quick' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#191E24] via-[#12161C] to-[#0D1014] border border-[#1F2630]">
            <div className="flex items-center gap-2 text-xs font-mono-num font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Zap className="w-4 h-4" />
              <span>Sessões Expressas (Até 30 minutos)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading text-white">
              Treinos Rápidos de Alta Intensidade
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1 max-w-xl">
              Pouco tempo antes da aula, trabalho ou rachão? Essas rotinas de 20 a 30 minutos mantêm sua consistência e toque de bola sempre afiados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onStart={startWorkout}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
