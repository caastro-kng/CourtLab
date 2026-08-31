import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Award,
  Check,
  Edit2,
  Flame,
  MapPin,
  Save,
  Target,
  TrendingUp,
  UserRound,
  X
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { DifficultyLevel, PlayerPosition } from '../types';

const POSITION_OPTIONS: PlayerPosition[] = ['PG', 'SG', 'SF', 'PF', 'C', 'SG / PG', 'SF / SG', 'PF / C'];
const LEVEL_OPTIONS: DifficultyLevel[] = ['Iniciante', 'Intermediário', 'Avançado', 'Competitivo'];
const HAND_OPTIONS = ['Direita', 'Esquerda', 'Ambidestro'] as const;
const GOAL_OPTIONS = [
  'Melhorar arremesso',
  'Melhorar controle de bola',
  'Criar espaço',
  'Melhorar finalização',
  'Pick and Roll',
  'Melhorar defesa',
  'Movimentação sem bola',
  'Condicionamento',
  'Confiança',
  'Mão fraca'
];

export const Profile: React.FC = () => {
  const {
    profile,
    updateProfile,
    xp,
    tier,
    currentStreakDays,
    longestStreakDays,
    skillsRating,
    topStrength,
    mainFocusArea,
    workoutLogs
  } = usePlayer();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    position: profile.position,
    dominantHand: profile.dominantHand,
    level: profile.level,
    city: profile.city || '',
    bio: profile.bio || '',
    primaryGoals: profile.primaryGoals || []
  });

  const nextTierXp = tier === 'Rookie' ? 600 : tier === 'Prospect' ? 1200 : tier === 'Starter' ? 1800 : tier === 'Sixth Man' ? 2500 : tier === 'All-Star' ? 3500 : 3500;
  const currentTierBase = tier === 'Rookie' ? 0 : tier === 'Prospect' ? 600 : tier === 'Starter' ? 1200 : tier === 'Sixth Man' ? 1800 : tier === 'All-Star' ? 2500 : 3500;
  const progressPercent = tier === 'Elite' ? 100 : Math.min(100, Math.max(0, Math.round(((xp - currentTierBase) / Math.max(1, nextTierXp - currentTierBase)) * 100)));

  const categoryAverages = useMemo(() => {
    const categories = ['Técnica', 'Tática', 'Física', 'Mental'];
    return categories.map((category) => {
      const items = skillsRating.filter((skill) => skill.category === category);
      const average = items.length ? items.reduce((sum, skill) => sum + skill.score, 0) / items.length : 0;
      return { category, average };
    });
  }, [skillsRating]);

  const totalMinutes = workoutLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
  const totalShots = workoutLogs.reduce((sum, log) => sum + (log.shotsMade || 0), 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name.trim() || profile.name,
      age: Number(formData.age),
      height: formData.height.trim(),
      weight: formData.weight.trim(),
      position: formData.position,
      dominantHand: formData.dominantHand,
      level: formData.level,
      city: formData.city.trim(),
      bio: formData.bio.trim(),
      primaryGoals: formData.primaryGoals
    });
    setIsEditing(false);
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter((item) => item !== goal)
        : [...prev.primaryGoals, goal].slice(0, 5)
    }));
  };

  const cancelEdit = () => {
    setFormData({
      name: profile.name,
      age: profile.age,
      height: profile.height,
      weight: profile.weight,
      position: profile.position,
      dominantHand: profile.dominantHand,
      level: profile.level,
      city: profile.city || '',
      bio: profile.bio || '',
      primaryGoals: profile.primaryGoals || []
    });
    setIsEditing(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-7 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">Identidade do atleta</span>
          <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">SEU JOGO COMEÇA AQUI</h1>
          <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1 max-w-2xl">
            Perfil, objetivos e autoavaliação alimentam as recomendações de treino do CourtLab.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2.5 rounded-xl bg-[#191E24] hover:bg-[#202730] border border-[#2B3542] text-xs font-bold uppercase tracking-wider text-white transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Edit2 className="w-4 h-4 text-[#FF6B1A]" />
            Editar perfil
          </button>
        )}
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#191E24] via-[#11151A] to-[#0A0C0F] border border-[#1F2630] p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full border border-[#FF6B1A]/10" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-7">
          <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FF6B1A] p-1 shadow-xl shadow-[#FF6B1A]/15 flex-shrink-0">
              <div className="w-full h-full bg-[#080A0D] rounded-[14px] flex items-center justify-center text-3xl sm:text-4xl font-heading text-white">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-3xl sm:text-4xl font-heading text-white tracking-tight">{profile.name}</h2>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FF6B1A] text-white">{profile.position}</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1F2630] text-[#B7BDC5] border border-[#2B3542]">{profile.level}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9AA1AA] mt-2">
                {profile.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />{profile.city}</span>}
                <span>Mão dominante: <strong className="text-white">{profile.dominantHand}</strong></span>
              </div>
              <p className="text-sm text-[#9AA1AA] mt-3 max-w-2xl leading-relaxed">
                {profile.bio || 'Defina seu estilo de jogo e o que você quer desenvolver para melhorar as recomendações do CourtLab.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 min-w-full lg:min-w-[300px]">
            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-[#7F8791]">Idade</span>
              <strong className="text-xl font-mono-num text-white block mt-0.5">{profile.age}</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-[#7F8791]">Altura / Peso</span>
              <strong className="text-lg font-mono-num text-white block mt-0.5">{profile.height} · {profile.weight}</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-[#7F8791]">Streak atual</span>
              <strong className="text-lg font-mono-num text-[#FF8D4D] block mt-0.5">{currentStreakDays} dias</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-[#7F8791]">Recorde</span>
              <strong className="text-lg font-mono-num text-white block mt-0.5">{longestStreakDays} dias</strong>
            </div>
          </div>
        </div>
      </section>

      {isEditing && (
        <form onSubmit={handleSave} className="p-5 sm:p-7 rounded-3xl bg-[#0D1014] border border-[#FF6B1A]/30 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B1A]">Configuração do atleta</span>
              <h3 className="text-xl sm:text-2xl font-heading text-white">Atualize o que orienta seu plano</h3>
            </div>
            <button type="button" onClick={cancelEdit} aria-label="Cancelar edição" className="p-2 rounded-xl text-[#9AA1AA] hover:text-white hover:bg-[#15191F]"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="space-y-1.5"><span className="text-xs font-bold uppercase text-[#9AA1AA]">Nome</span><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3.5 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]" /></label>
            <label className="space-y-1.5"><span className="text-xs font-bold uppercase text-[#9AA1AA]">Idade</span><input type="number" min="10" max="80" value={formData.age} onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })} className="w-full px-3.5 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]" /></label>
            <label className="space-y-1.5"><span className="text-xs font-bold uppercase text-[#9AA1AA]">Altura</span><input value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} placeholder="1.80m" className="w-full px-3.5 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]" /></label>
            <label className="space-y-1.5"><span className="text-xs font-bold uppercase text-[#9AA1AA]">Peso</span><input value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="75kg" className="w-full px-3.5 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]" /></label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="space-y-1.5"><span className="text-xs font-bold uppercase text-[#9AA1AA]">Posição</span><select value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value as PlayerPosition })} className="w-full px-3.5 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]">{POSITION_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="space-y-1.5"><span className="text-xs font-bold uppercase text-[#9AA1AA]">Mão dominante</span><select value={formData.dominantHand} onChange={(e) => setFormData({ ...formData, dominantHand: e.target.value as typeof formData.dominantHand })} className="w-full px-3.5 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]">{HAND_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="space-y-1.5"><span className="text-xs font-bold uppercase text-[#9AA1AA]">Nível</span><select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as DifficultyLevel })} className="w-full px-3.5 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]">{LEVEL_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="space-y-1.5"><span className="text-xs font-bold uppercase text-[#9AA1AA]">Cidade</span><input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3.5 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]" /></label>
          </div>

          <label className="space-y-1.5 block"><span className="text-xs font-bold uppercase text-[#9AA1AA]">Como você joga / o que busca</span><textarea rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Ex: guard que gosta de atacar em velocidade e quer melhorar leitura de PnR..." className="w-full px-3.5 py-3 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]" /></label>

          <div>
            <div className="flex items-center justify-between gap-3 mb-3"><span className="text-xs font-bold uppercase text-[#9AA1AA]">Objetivos principais</span><span className="text-[11px] text-[#7F8791]">Escolha até 5</span></div>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((goal) => {
                const active = formData.primaryGoals.includes(goal);
                return <button key={goal} type="button" onClick={() => toggleGoal(goal)} className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${active ? 'bg-[#FF6B1A]/15 border-[#FF6B1A]/60 text-[#FF8D4D]' : 'bg-[#15191F] border-[#1F2630] text-[#9AA1AA] hover:text-white'}`}>{active && <Check className="inline w-3.5 h-3.5 mr-1" />}{goal}</button>;
              })}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <button type="button" onClick={cancelEdit} className="px-5 py-3 rounded-xl bg-[#15191F] border border-[#2B3542] text-xs font-bold uppercase text-white">Cancelar</button>
            <button type="submit" className="px-5 py-3 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"><Save className="w-4 h-4" />Salvar perfil</button>
          </div>
        </form>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div><span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B1A]">Identidade técnica</span><h3 className="text-2xl font-heading text-white mt-0.5">Seu mapa de desenvolvimento</h3></div>
            <Link to="/progresso" className="text-xs font-bold text-[#FF8D4D] hover:text-white">Calibrar avaliação →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="p-4 rounded-2xl bg-[#15191F] border border-[#1F2630]"><span className="text-[10px] uppercase font-bold text-[#7F8791]">Maior força</span><strong className="text-lg text-white block mt-1">{topStrength.name}</strong><span className="text-sm font-mono-num text-emerald-400">{topStrength.score.toFixed(1)} / 10</span></div>
            <div className="p-4 rounded-2xl bg-[#15191F] border border-[#FF6B1A]/25"><span className="text-[10px] uppercase font-bold text-[#FF8D4D]">Prioridade atual</span><strong className="text-lg text-white block mt-1">{mainFocusArea.name}</strong><span className="text-sm font-mono-num text-[#FF8D4D]">{mainFocusArea.score.toFixed(1)} / 10</span></div>
          </div>

          <div className="space-y-3">
            {categoryAverages.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-xs mb-1.5"><span className="font-semibold text-white">{item.category}</span><span className="font-mono-num text-[#9AA1AA]">{item.average.toFixed(1)}</span></div>
                <div className="h-2 rounded-full bg-[#15191F] overflow-hidden border border-[#1F2630]"><div className="h-full bg-[#FF6B1A] rounded-full" style={{ width: `${item.average * 10}%` }} /></div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#68717C] mt-4">Os valores acima vêm da sua autoavaliação e servem para personalizar o treino; não são uma avaliação biomecânica ou clínica.</p>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B1A]">Objetivos do jogador</span>
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.primaryGoals.length ? profile.primaryGoals.map((goal) => <span key={goal} className="px-3 py-2 rounded-xl bg-[#15191F] border border-[#1F2630] text-xs text-white flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-[#FF6B1A]" />{goal}</span>) : <p className="text-sm text-[#9AA1AA]">Adicione objetivos para melhorar suas recomendações.</p>}
            </div>
            <Link to="/metas" className="inline-flex mt-4 text-xs font-bold text-[#FF8D4D] hover:text-white">Transformar objetivos em metas →</Link>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
            <div className="flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-[#FF6B1A]" /><h3 className="text-xl font-heading text-white">Histórico do atleta</h3></div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 rounded-2xl bg-[#15191F]"><strong className="text-xl font-mono-num text-white block">{workoutLogs.length}</strong><span className="text-[10px] uppercase text-[#7F8791]">Sessões</span></div>
              <div className="text-center p-3 rounded-2xl bg-[#15191F]"><strong className="text-xl font-mono-num text-white block">{Math.round(totalMinutes / 60)}h</strong><span className="text-[10px] uppercase text-[#7F8791]">Treino</span></div>
              <div className="text-center p-3 rounded-2xl bg-[#15191F]"><strong className="text-xl font-mono-num text-[#FF8D4D] block">{totalShots}</strong><span className="text-[10px] uppercase text-[#7F8791]">Cestas</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="p-5 sm:p-6 rounded-3xl bg-[#0D1014] border border-[#1F2630]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div><span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B1A]">Progressão CourtLab</span><h3 className="text-2xl font-heading text-white">{tier}</h3></div>
          <div className="flex items-center gap-2 text-sm"><Award className="w-4 h-4 text-[#FF8D4D]" /><strong className="font-mono-num text-[#FF8D4D]">{xp} XP</strong></div>
        </div>
        <div className="h-3 rounded-full bg-[#11151A] border border-[#1F2630] overflow-hidden"><div className="h-full bg-[#FF6B1A] rounded-full transition-all" style={{ width: `${progressPercent}%` }} /></div>
        <div className="flex items-center justify-between text-[11px] text-[#7F8791] mt-2"><span>{tier === 'Elite' ? 'Nível máximo atual' : `${progressPercent}% deste nível`}</span><span>{tier === 'Elite' ? 'Elite' : `Próximo: ${nextTierXp} XP`}</span></div>
      </section>
    </div>
  );
};
