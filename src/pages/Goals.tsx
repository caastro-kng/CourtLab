import React, { useState } from 'react';
import {
  Target,
  Plus,
  Flame,
  Award,
  CheckCircle2,
  Trophy,
  Sparkles,
  Zap,
  TrendingUp,
  X
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { Goal } from '../types';

export const Goals: React.FC = () => {
  const { goals, addGoal, updateGoalProgress, xp, tier } = usePlayer();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Goal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'arremessos' | 'treinos' | 'fundamento' | 'frequencia'>('arremessos');
  const [newTarget, setNewTarget] = useState<number>(100);
  const [newUnit, setNewUnit] = useState('arremessos');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newTarget <= 0) return;

    addGoal({
      title: newTitle.trim(),
      category: newCategory,
      targetValue: newTarget,
      currentValue: 0,
      unit: newUnit.trim() || 'unidades',
      iconName: newCategory === 'arremessos' ? 'Target' : newCategory === 'treinos' ? 'Flame' : 'Award'
    });

    setNewTitle('');
    setIsModalOpen(false);
  };

  const achievements = [
    { title: 'Primeiro Passo', desc: 'Completou o primeiro treino no Court Lab', icon: '🏀', unlocked: true },
    { title: 'Chama Acesa', desc: 'Manteve 4 dias consecutivos de treinos', icon: '🔥', unlocked: true },
    { title: 'Atirador de Elite', desc: 'Converteu mais de 300 arremessos na semana', icon: '🎯', unlocked: true },
    { title: 'Sem Mão Fraca', desc: 'Completou 3 treinos focados na mão não dominante', icon: '🖐️', unlocked: false },
    { title: 'Mestre do PnR', desc: 'Completou o módulo completo de Pick and Roll', icon: '🧠', unlocked: false },
    { title: 'All-Star Tier', desc: 'Alcançou 2.500 XP na plataforma', icon: '⭐', unlocked: false }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
            Disciplina & Desafios
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">
            METAS & CONQUISTAS
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1">
            Defina seus alvos semanais, registre o progresso e desbloqueie insígnias de prestígio.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-3 px-5 rounded-2xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#FF6B1A]/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nova Meta Semanal
        </button>
      </div>

      {/* Active Goals Grid */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-heading text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-[#FF6B1A]" />
          Metas em Andamento
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

            return (
              <div
                key={goal.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  goal.completed
                    ? 'bg-[#15191F] border-emerald-500/50 shadow-md shadow-emerald-500/5'
                    : 'bg-[#0D1014] border-[#1F2630]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      {goal.completed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {goal.title}
                    </span>
                    <span
                      className={`text-xs font-mono-num font-bold px-2 py-0.5 rounded ${
                        goal.completed
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-[#FF6B1A]/20 text-[#FF8D4D]'
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#11151A] rounded-full h-2.5 overflow-hidden border border-[#1F2630] my-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.completed ? 'bg-emerald-400' : 'bg-gradient-to-r from-[#FF6B1A] to-[#FF8D4D]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono-num text-[#9AA1AA]">
                    <span>
                      Atual: <strong className="text-white">{goal.currentValue}</strong> {goal.unit}
                    </span>
                    <span>
                      Alvo: <strong className="text-white">{goal.targetValue}</strong> {goal.unit}
                    </span>
                  </div>
                </div>

                {/* Quick Incremental Buttons */}
                {!goal.completed && (
                  <div className="pt-3 border-t border-[#1F2630] flex items-center justify-between">
                    <span className="text-[11px] text-[#9AA1AA]">Registrar progresso rápido:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateGoalProgress(goal.id, goal.unit === 'treinos' ? 1 : 10)}
                        className="px-2.5 py-1 rounded-lg bg-[#15191F] hover:bg-[#1E242D] border border-[#2B3542] text-xs font-mono-num font-bold text-white transition-colors"
                      >
                        +{goal.unit === 'treinos' ? '1' : '10'}
                      </button>
                      <button
                        onClick={() => updateGoalProgress(goal.id, goal.unit === 'treinos' ? 2 : 25)}
                        className="px-2.5 py-1 rounded-lg bg-[#FF6B1A]/20 hover:bg-[#FF6B1A] text-[#FF8D4D] hover:text-white border border-[#FF6B1A]/30 text-xs font-mono-num font-bold transition-colors"
                      >
                        +{goal.unit === 'treinos' ? '2' : '25'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements Section (Section 38) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-6">
        <div>
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
            Galeria de Conquistas
          </span>
          <h2 className="text-2xl font-heading text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FF8D4D]" />
            Insígnias & Medalhas de Atleta
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-center gap-4 transition-colors ${
                item.unlocked
                  ? 'bg-[#15191F] border-emerald-500/30'
                  : 'bg-[#11151A] border-[#1F2630] opacity-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                  item.unlocked
                    ? 'bg-[#1F2630] border-emerald-500/50 shadow-md'
                    : 'bg-[#0D1014] border-[#1F2630]'
                }`}
              >
                {item.icon}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  {item.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <p className="text-xs text-[#9AA1AA] mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0D1014] border border-[#1F2630] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2630] pb-4">
              <h3 className="text-xl font-heading text-white">Criar Nova Meta</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#9AA1AA] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1">
                  Título da Meta
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Fazer 200 lances livres"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1">
                    Valor Alvo
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1">
                    Unidade
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="arremessos, treinos..."
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#FF6B1A]/20"
              >
                Salvar Meta (+25 XP)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
