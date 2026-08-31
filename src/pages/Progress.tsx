import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Flame,
  Clock,
  Dumbbell,
  Target,
  Activity,
  Sliders,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { RadarSkillChart } from '../components/common/RadarSkillChart';

export const Progress: React.FC = () => {
  const {
    skillsRating,
    updateSkillRating,
    topStrength,
    mainFocusArea,
    skillProgressList,
    workoutLogs,
    xp,
    tier,
    currentStreakDays,
    longestStreakDays
  } = usePlayer();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'Técnica' | 'Tática' | 'Física' | 'Mental'>('all');

  const filteredSkills = activeCategoryFilter === 'all'
    ? skillsRating
    : skillsRating.filter((s) => s.category === activeCategoryFilter);

  // Total metrics calculations
  const totalWorkouts = workoutLogs.length + 12; // Baseline + logs
  const totalMinutes = workoutLogs.reduce((acc, l) => acc + l.durationMinutes, 155);
  const totalShots = workoutLogs.reduce((acc, l) => acc + (l.shotsMade || 0), 480);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
          Estatísticas & Evolução
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">
          ACOMPANHAMENTO DO ATLETA
        </h1>
        <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1 max-w-2xl">
          Visualize seu mapa de habilidades em 16 atributos técnicos, calibro seu diagnóstico e acompanhe o histórico completo de treinos.
        </p>
      </div>

      {/* Top Cumulative Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
          <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Total de Treinos</span>
          <span className="text-2xl sm:text-3xl font-mono-num font-bold text-white mt-1 block">
            {totalWorkouts}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            🔥 {currentStreakDays} dias de streak
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
          <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Tempo em Quadra</span>
          <span className="text-2xl sm:text-3xl font-mono-num font-bold text-white mt-1 block">
            {Math.floor(totalMinutes / 60)}h{totalMinutes % 60}m
          </span>
          <span className="text-[11px] text-[#9AA1AA] mt-1 block">
            Consistência semanal
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
          <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Arremessos Convertidos</span>
          <span className="text-2xl sm:text-3xl font-mono-num font-bold text-[#FF6B1A] mt-1 block">
            {totalShots}
          </span>
          <span className="text-[11px] text-[#9AA1AA] mt-1 block">
            Registrados em treinos
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
          <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Classificação</span>
          <span className="text-2xl sm:text-3xl font-heading text-[#FF8D4D] mt-1 block">
            {tier}
          </span>
          <span className="text-[11px] font-mono-num text-[#9AA1AA] mt-1 block">
            {xp} XP Acumulado
          </span>
        </div>
      </div>

      {/* Radar Skill Diagnosis & Interactive Attribute Calibration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Radar Visual Representation */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#0D1014] border border-[#1F2630] flex flex-col items-center justify-between space-y-6">
          <div className="w-full">
            <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
              Diagnóstico Visual
            </span>
            <h2 className="text-2xl font-heading text-white">Radar de 16 Atributos</h2>
            <p className="text-xs text-[#9AA1AA] mt-1">
              Avaliação multidimensional de técnica, física, tática e mental.
            </p>
          </div>

          <div className="py-2 scale-95 sm:scale-100">
            <RadarSkillChart skills={skillsRating} size={360} />
          </div>

          {/* Strength vs Focus Highlight */}
          <div className="w-full space-y-2 pt-4 border-t border-[#1F2630]">
            <div className="p-3 rounded-xl bg-[#15191F] border border-[#1F2630] flex items-center justify-between text-xs">
              <span className="text-[#9AA1AA] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B1A]" />
                Ponto Mais Forte:
              </span>
              <strong className="text-white font-mono-num text-sm">{topStrength.name} ({topStrength.score.toFixed(1)})</strong>
            </div>

            <div className="p-3 rounded-xl bg-[#15191F] border border-[#1F2630] flex items-center justify-between text-xs">
              <span className="text-[#9AA1AA] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Principal Foco a Desenvolver:
              </span>
              <strong className="text-[#FF8D4D] font-mono-num text-sm">{mainFocusArea.name} ({mainFocusArea.score.toFixed(1)})</strong>
            </div>
          </div>
        </div>

        {/* Right: Interactive Calibration Sliders */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
                Autoavaliação & Calibração
              </span>
              <h2 className="text-2xl font-heading text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#FF6B1A]" />
                Calibrar Habilidades (0 - 10)
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#11151A] rounded-xl border border-[#1F2630]">
              {(['all', 'Técnica', 'Tática', 'Física', 'Mental'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                    activeCategoryFilter === cat
                      ? 'bg-[#FF6B1A] text-white'
                      : 'text-[#9AA1AA] hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1">
            {filteredSkills.map((skill) => (
              <div
                key={skill.key}
                className="p-3.5 rounded-2xl bg-[#15191F] border border-[#1F2630] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{skill.name}</span>
                  <span className="text-xs font-mono-num font-bold text-[#FF6B1A] bg-[#FF6B1A]/10 px-2 py-0.5 rounded">
                    {skill.score.toFixed(1)} / 10
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={skill.score}
                  onChange={(e) => updateSkillRating(skill.key, parseFloat(e.target.value))}
                  className="w-full accent-[#FF6B1A] cursor-pointer"
                />

                <div className="flex items-center justify-between text-[9px] font-mono-num text-[#9AA1AA]">
                  <span>Iniciante (0)</span>
                  <span className="text-white/60 uppercase">{skill.category}</span>
                  <span>Elite (10)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Progress Across Pillars */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-4">
        <h2 className="text-2xl font-heading text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#FF6B1A]" />
          Progresso de Domínio dos Fundamentos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillProgressList.map((prog) => (
            <div
              key={prog.category}
              className="p-4 rounded-2xl bg-[#15191F] border border-[#1F2630] space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{prog.label}</span>
                <span className="font-mono-num font-bold text-[#FF6B1A]">{prog.percentage}%</span>
              </div>

              <div className="w-full bg-[#11151A] rounded-full h-2 overflow-hidden border border-[#1F2630]">
                <div
                  className="bg-gradient-to-r from-[#FF6B1A] to-[#FF8D4D] h-full rounded-full transition-all duration-500"
                  style={{ width: `${prog.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono-num text-[#9AA1AA]">
                <span>{prog.completedDrillsCount} de {prog.totalDrillsCount} Drills Dominados</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout History Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF6B1A]" />
            Histórico Recente de Treinos
          </h2>
          <span className="text-xs text-[#9AA1AA] font-mono-num">
            {workoutLogs.length} sessões registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1F2630] text-[#9AA1AA] uppercase font-mono-num font-bold">
                <th className="pb-3 px-3">Treino</th>
                <th className="pb-3 px-3">Data</th>
                <th className="pb-3 px-3">Duração</th>
                <th className="pb-3 px-3">Drills</th>
                <th className="pb-3 px-3">Arremessos</th>
                <th className="pb-3 px-3">Intensidade</th>
                <th className="pb-3 px-3">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2630]/60">
              {workoutLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#15191F] transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {log.workoutTitle}
                  </td>
                  <td className="py-3 px-3 text-[#9AA1AA] font-mono-num">
                    {new Date(log.completedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 text-white font-mono-num">
                    {log.durationMinutes} min
                  </td>
                  <td className="py-3 px-3 text-[#9AA1AA] font-mono-num">
                    {log.exercisesCompleted}
                  </td>
                  <td className="py-3 px-3 text-[#FF6B1A] font-mono-num font-bold">
                    {log.shotsMade || '-'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#11151A] text-white font-semibold border border-[#1F2630]">
                      {log.perceivedDifficulty}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono-num font-bold text-emerald-400">
                    +{log.xpEarned} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
