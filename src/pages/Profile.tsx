import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Check,
  ChevronRight,
  Clock3,
  Dumbbell,
  Edit2,
  Flame,
  MapPin,
  Save,
  ShieldCheck,
  Target,
  X,
  Zap
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { DifficultyLevel, PlayerPosition } from '../types';

const POSITION_OPTIONS: PlayerPosition[] = ['PG','SG','SF','PF','C','SG / PG','SF / SG','PF / C'];
const LEVEL_OPTIONS: DifficultyLevel[] = ['Iniciante','Intermediário','Avançado','Competitivo'];
const HAND_OPTIONS = ['Direita','Esquerda','Ambidestro'] as const;
const GOAL_OPTIONS = ['Melhorar arremesso','Melhorar controle de bola','Criar espaço','Melhorar finalização','Pick and Roll','Melhorar defesa','Movimentação sem bola','Condicionamento','Confiança','Mão fraca'];

const getPlayerRole = (position: PlayerPosition) => {
  if (position.includes('PG') || position.includes('SG')) return 'Guard';
  if (position.includes('SF')) return 'Wing';
  return 'Frontcourt';
};

export const Profile: React.FC = () => {
  const { profile, updateProfile, xp, tier, currentStreakDays, longestStreakDays, skillsRating, topStrength, mainFocusArea, workoutLogs } = usePlayer();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: profile.name, age: profile.age, height: profile.height, weight: profile.weight, position: profile.position, dominantHand: profile.dominantHand, level: profile.level, city: profile.city || '', bio: profile.bio || '', primaryGoals: profile.primaryGoals || [] });

  const nextTierXp = tier === 'Rookie' ? 600 : tier === 'Prospect' ? 1200 : tier === 'Starter' ? 1800 : tier === 'Sixth Man' ? 2500 : tier === 'All-Star' ? 3500 : 3500;
  const tierBase = tier === 'Rookie' ? 0 : tier === 'Prospect' ? 600 : tier === 'Starter' ? 1200 : tier === 'Sixth Man' ? 1800 : tier === 'All-Star' ? 2500 : 3500;
  const tierProgress = tier === 'Elite' ? 100 : Math.min(100, Math.max(0, Math.round((xp - tierBase) / Math.max(1, nextTierXp - tierBase) * 100)));
  const categoryAverages = useMemo(() => ['Técnica','Tática','Física','Mental'].map((category) => {
    const items = skillsRating.filter((skill) => skill.category === category);
    return { category, average: items.length ? items.reduce((sum, item) => sum + item.score, 0) / items.length : 0 };
  }), [skillsRating]);
  const totalMinutes = workoutLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
  const totalShots = workoutLogs.reduce((sum, log) => sum + (log.shotsMade || 0), 0);
  const technicalIndex = Math.round((skillsRating.reduce((sum, skill) => sum + skill.score, 0) / Math.max(1, skillsRating.length)) * 10);
  const playerRole = getPlayerRole(profile.position);
  const initials = profile.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'CL';

  const resetForm = () => setFormData({ name: profile.name, age: profile.age, height: profile.height, weight: profile.weight, position: profile.position, dominantHand: profile.dominantHand, level: profile.level, city: profile.city || '', bio: profile.bio || '', primaryGoals: profile.primaryGoals || [] });
  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile({ ...formData, name: formData.name.trim() || profile.name, age: Number(formData.age), height: formData.height.trim(), weight: formData.weight.trim(), city: formData.city.trim(), bio: formData.bio.trim() });
    setIsEditing(false);
  };
  const cancel = () => { resetForm(); setIsEditing(false); };
  const toggleGoal = (goal: string) => setFormData((prev) => ({ ...prev, primaryGoals: prev.primaryGoals.includes(goal) ? prev.primaryGoals.filter((item) => item !== goal) : [...prev.primaryGoals, goal].slice(0, 5) }));

  return <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 cl-view-enter">
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
      <div>
        <span className="cl-eyebrow text-[#FF6B1A]">CourtLab athlete</span>
        <h1 className="cl-page-title text-white mt-1">PLAYER CARD</h1>
        <p className="cl-copy mt-3 max-w-2xl">Sua identidade como atleta reúne perfil, atributos, histórico e direção de desenvolvimento em uma única leitura.</p>
      </div>
      {!isEditing && <button onClick={() => setIsEditing(true)} className="min-h-11 px-4 rounded-xl border border-white/[0.08] hover:border-white/[0.16] text-white cl-button-text flex items-center justify-center gap-2"><Edit2 className="w-4 h-4 text-[#FF6B1A]" />Editar perfil</button>}
    </header>

    <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0B0F14] min-h-[360px]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-10 -top-16 text-[220px] sm:text-[300px] font-heading leading-none text-white/[0.018] select-none">{initials}</div>
        <div className="absolute inset-y-0 left-0 w-1 bg-[#FF6B1A]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,107,26,0.11),transparent_34%)]" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 min-h-[360px] flex flex-col justify-between gap-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex flex-col sm:flex-row gap-5 sm:items-center min-w-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[26px] border border-[#FF6B1A]/45 bg-[#FF6B1A]/10 flex items-center justify-center shrink-0 shadow-[0_20px_60px_rgba(255,107,26,0.08)]">
              <span className="text-4xl sm:text-5xl font-heading text-white">{initials}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="cl-label text-[#FF8D4D]">{playerRole}</span>
                <span className="text-white/20">/</span>
                <span className="cl-label text-[#818C98]">{profile.level}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-white leading-[0.9] break-words">{profile.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2 cl-copy-small mt-4">
                {profile.city && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />{profile.city}</span>}
                <span>Posição <b className="text-white font-semibold">{profile.position}</b></span>
                <span>Mão <b className="text-white font-semibold">{profile.dominantHand}</b></span>
                <span>{profile.height} · {profile.weight} · {profile.age} anos</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 lg:text-right shrink-0">
            <div><span className="cl-label text-[#697481] block">Índice técnico</span><strong className="text-3xl sm:text-4xl font-mono-num text-white leading-none">{technicalIndex}</strong><span className="text-[10px] text-[#68727E]">/ 100</span></div>
            <div><span className="cl-label text-[#697481] block">Tier</span><strong className="text-xl font-heading text-white block">{tier}</strong><span className="cl-copy-small text-[#FF8D4D]">{xp} XP</span></div>
            <div><span className="cl-label text-[#697481] block">Streak</span><strong className="text-xl font-heading text-white block">{currentStreakDays} dias</strong><span className="cl-copy-small">recorde {longestStreakDays}</span></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto] gap-6 lg:items-end border-t border-white/[0.07] pt-6">
          <p className="cl-copy text-[#A5ADB6] max-w-2xl">{profile.bio || 'Defina seu estilo de jogo, contexto e objetivos para deixar as recomendações do CourtLab cada vez mais alinhadas ao seu perfil.'}</p>
          <div className="flex items-center gap-6">
            <div><span className="cl-label text-[#68727E] block">Maior força</span><strong className="text-sm text-emerald-400">{topStrength.name}</strong></div>
            <div className="w-px h-9 bg-white/[0.08]" />
            <div><span className="cl-label text-[#68727E] block">Foco atual</span><strong className="text-sm text-[#FF8D4D]">{mainFocusArea.name}</strong></div>
          </div>
        </div>
      </div>
    </section>

    {isEditing && <form onSubmit={handleSave} className="py-6 border-y border-[#FF6B1A]/25 space-y-5 cl-pop">
      <div className="flex justify-between gap-4">
        <div><span className="cl-eyebrow text-[#FF6B1A]">Configuração do atleta</span><h3 className="cl-section-title text-white">Atualizar perfil</h3></div>
        <button type="button" onClick={cancel} className="w-11 h-11 rounded-xl border border-white/[0.08] flex items-center justify-center" aria-label="Fechar edição"><X className="w-5 h-5 text-[#9AA1AA]" /></button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {([['Nome','name'],['Altura','height'],['Peso','weight'],['Cidade','city']] as const).map(([label,key]) => <label key={key}><span className="cl-label text-[#8F98A4]">{label}</span><input value={String(formData[key])} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="w-full mt-1 px-3 py-3 bg-[#11161C] border border-white/[0.07] rounded-xl text-white" /></label>)}
        <label><span className="cl-label text-[#8F98A4]">Idade</span><input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })} className="w-full mt-1 px-3 py-3 bg-[#11161C] border border-white/[0.07] rounded-xl text-white" /></label>
        <label><span className="cl-label text-[#8F98A4]">Posição</span><select value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value as PlayerPosition })} className="w-full mt-1 px-3 py-3 bg-[#11161C] border border-white/[0.07] rounded-xl text-white">{POSITION_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span className="cl-label text-[#8F98A4]">Mão</span><select value={formData.dominantHand} onChange={(e) => setFormData({ ...formData, dominantHand: e.target.value as typeof formData.dominantHand })} className="w-full mt-1 px-3 py-3 bg-[#11161C] border border-white/[0.07] rounded-xl text-white">{HAND_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span className="cl-label text-[#8F98A4]">Nível</span><select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as DifficultyLevel })} className="w-full mt-1 px-3 py-3 bg-[#11161C] border border-white/[0.07] rounded-xl text-white">{LEVEL_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <textarea rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Como você joga e o que busca..." className="w-full px-3 py-3 bg-[#11161C] border border-white/[0.07] rounded-xl text-white" />
      <div><div className="flex justify-between mb-2"><span className="cl-label text-[#8F98A4]">Objetivos principais</span><span className="text-[10px] text-[#737D88]">até 5</span></div><div className="flex flex-wrap gap-2">{GOAL_OPTIONS.map((goal) => { const active = formData.primaryGoals.includes(goal); return <button type="button" key={goal} onClick={() => toggleGoal(goal)} className={`px-3 py-2 rounded-full text-xs border ${active ? 'border-[#FF6B1A] text-[#FF8D4D] bg-[#FF6B1A]/6' : 'border-white/[0.08] text-[#9AA1AA]'}`}>{active && <Check className="inline w-3 h-3 mr-1" />}{goal}</button>; })}</div></div>
      <div className="flex justify-end gap-2"><button type="button" onClick={cancel} className="px-5 py-3 text-xs text-white">Cancelar</button><button type="submit" className="px-5 py-3 rounded-xl bg-[#FF6B1A] text-white cl-button-text flex items-center gap-2"><Save className="w-4 h-4" />Salvar</button></div>
    </form>}

    <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10">
      <div>
        <div className="flex items-end justify-between gap-4 mb-6">
          <div><span className="cl-eyebrow text-[#FF6B1A]">Identidade técnica</span><h3 className="cl-section-title text-white">SEU JOGO HOJE</h3></div>
          <Link to="/progresso" className="cl-button-text text-[#FF8D4D] inline-flex items-center gap-1">Calibrar <ChevronRight className="w-3.5 h-3.5" /></Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 pb-6 border-b border-white/[0.06]">
          <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5" /></div><div><span className="cl-label text-[#737D88]">Maior força</span><strong className="text-xl text-white block">{topStrength.name}</strong><span className="text-emerald-400 font-mono-num">{topStrength.score.toFixed(1)}/10</span></div></div>
          <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-[#FF6B1A]/10 text-[#FF8D4D] flex items-center justify-center shrink-0"><Zap className="w-5 h-5" /></div><div><span className="cl-label text-[#737D88]">Prioridade atual</span><strong className="text-xl text-white block">{mainFocusArea.name}</strong><span className="text-[#FF8D4D] font-mono-num">{mainFocusArea.score.toFixed(1)}/10</span></div></div>
        </div>

        <div className="mt-6 space-y-5">{categoryAverages.map((item) => <div key={item.category} className="grid grid-cols-[72px_1fr_42px] items-center gap-3"><span className="cl-label text-[#9AA4AF]">{item.category}</span><div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden"><div className="h-full bg-[#FF6B1A] rounded-full transition-all" style={{ width: `${item.average * 10}%` }} /></div><span className="text-xs font-mono-num text-white text-right">{item.average.toFixed(1)}</span></div>)}</div>
      </div>

      <aside className="lg:border-l lg:border-white/[0.06] lg:pl-8 space-y-8">
        <div>
          <span className="cl-eyebrow text-[#737D88]">Objetivos do jogador</span>
          <div className="space-y-3 mt-4">{profile.primaryGoals.length ? profile.primaryGoals.map((goal, index) => <div key={goal} className="flex items-center gap-3 py-2 border-b border-white/[0.05] last:border-0"><span className="w-6 font-mono-num text-[10px] text-[#505A65]">0{index + 1}</span><Target className="w-4 h-4 text-[#FF6B1A] shrink-0" /><span className="text-sm text-white">{goal}</span></div>) : <span className="cl-copy-small">Nenhum objetivo definido.</span>}</div>
          <Link to="/metas" className="cl-button-text text-[#FF8D4D] inline-flex items-center gap-1 mt-4">Transformar em metas <ChevronRight className="w-3.5 h-3.5" /></Link>
        </div>

        <div className="pt-6 border-t border-white/[0.06]">
          <span className="cl-eyebrow text-[#737D88]">Career stats</span>
          <div className="grid grid-cols-3 mt-4 divide-x divide-white/[0.06]">
            <div className="pr-3"><Dumbbell className="w-4 h-4 text-[#FF6B1A] mb-2" /><strong className="text-2xl font-mono-num text-white block">{workoutLogs.length}</strong><span className="cl-label text-[#737D88]">Sessões</span></div>
            <div className="px-3"><Clock3 className="w-4 h-4 text-[#FF6B1A] mb-2" /><strong className="text-2xl font-mono-num text-white block">{Math.round(totalMinutes / 60)}</strong><span className="cl-label text-[#737D88]">Horas</span></div>
            <div className="pl-3"><Target className="w-4 h-4 text-[#FF6B1A] mb-2" /><strong className="text-2xl font-mono-num text-white block">{totalShots}</strong><span className="cl-label text-[#737D88]">Cestas</span></div>
          </div>
        </div>
      </aside>
    </section>

    <section className="pt-7 border-t border-white/[0.06] grid lg:grid-cols-[1fr_auto] gap-6 lg:items-end">
      <div>
        <div className="flex items-center gap-2 mb-2"><Award className="w-4 h-4 text-[#FF6B1A]" /><span className="cl-eyebrow text-[#737D88]">Progressão CourtLab</span></div>
        <div className="flex items-end gap-3"><h3 className="text-3xl sm:text-4xl font-heading text-white leading-none">{tier}</h3><span className="text-sm font-mono-num text-[#FF8D4D]">{xp} XP</span></div>
        <div className="h-2 bg-white/[0.06] mt-5 max-w-3xl rounded-full overflow-hidden cl-progress-track"><div className="h-full bg-[#FF6B1A] rounded-full" style={{ width: `${tierProgress}%` }} /></div>
        <div className="flex justify-between cl-copy-small mt-2 max-w-3xl"><span>{tier === 'Elite' ? 'Nível máximo atual' : `${tierProgress}% deste nível`}</span><span>{tier === 'Elite' ? 'Elite' : `Próximo: ${nextTierXp} XP`}</span></div>
      </div>
      <div className="flex items-center gap-2 text-xs text-[#8F98A4]"><Flame className="w-4 h-4 text-[#FF6B1A]" /><span>Maior sequência: <b className="text-white">{longestStreakDays} dias</b></span></div>
    </section>
  </div>;
};
