import React, { useState } from 'react';
import {
  User,
  Award,
  Flame,
  CheckCircle2,
  Edit2,
  Save,
  Shield,
  Target,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const Profile: React.FC = () => {
  const { profile, updateProfile, xp, tier, currentStreakDays, longestStreakDays } = usePlayer();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    position: profile.position,
    dominantHand: profile.dominantHand,
    city: profile.city || 'São Paulo, SP',
    bio: profile.bio || ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      age: Number(formData.age),
      height: formData.height,
      weight: formData.weight,
      position: formData.position,
      dominantHand: formData.dominantHand,
      city: formData.city,
      bio: formData.bio
    });
    setIsEditing(false);
  };

  const nextTierXp = tier === 'Rookie' ? 600 : tier === 'Prospect' ? 1200 : tier === 'Starter' ? 1800 : tier === 'Sixth Man' ? 2500 : 3500;
  const currentTierBase = tier === 'Rookie' ? 0 : tier === 'Prospect' ? 600 : tier === 'Starter' ? 1200 : tier === 'Sixth Man' ? 1800 : 2500;
  const progressPercent = Math.min(100, Math.round(((xp - currentTierBase) / (nextTierXp - currentTierBase)) * 100));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
            Cartão de Atleta
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading text-white tracking-tight leading-tight">
            PERFIL DO JOGADOR
          </h1>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl bg-[#191E24] hover:bg-[#202730] border border-[#2B3542] text-xs font-bold uppercase tracking-wider text-white transition-colors flex items-center gap-2"
        >
          {isEditing ? <Save className="w-4 h-4 text-emerald-400" /> : <Edit2 className="w-4 h-4 text-[#FF6B1A]" />}
          {isEditing ? 'Cancelar Edição' : 'Editar Perfil'}
        </button>
      </div>

      {/* Main Player Card Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#191E24] via-[#12161C] to-[#0D1014] border border-[#1F2630] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#FF6B1A] to-[#FF8D4D] p-1 shadow-2xl shadow-[#FF6B1A]/20 flex-shrink-0">
            <div className="w-full h-full bg-[#080A0D] rounded-[14px] flex items-center justify-center text-3xl sm:text-4xl font-heading text-white">
              {profile.name.charAt(0)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-heading text-white tracking-tight">
                {profile.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono-num font-bold bg-[#FF6B1A] text-white">
                {profile.position}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#1F2630] text-[#9AA1AA] border border-[#2B3542]">
                {profile.level}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#9AA1AA] pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />
                {profile.city}
              </span>
              <span>•</span>
              <span>Mão Dominante: <strong className="text-white">{profile.dominantHand}</strong></span>
            </div>

            <p className="text-xs sm:text-sm text-[#9AA1AA] pt-2 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Bio Physical Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1F2630]">
          <div className="p-3.5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Idade</span>
            <span className="text-xl font-mono-num font-bold text-white mt-0.5 block">{profile.age} anos</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Altura</span>
            <span className="text-xl font-mono-num font-bold text-white mt-0.5 block">{profile.height}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Peso</span>
            <span className="text-xl font-mono-num font-bold text-white mt-0.5 block">{profile.weight}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0D1014] border border-[#1F2630]">
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Streak Record</span>
            <span className="text-xl font-mono-num font-bold text-emerald-400 mt-0.5 block">🔥 {longestStreakDays} dias</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-4">
          <h3 className="text-xl font-heading text-white">Editar Informações do Jogador</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1">Idade</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1">Posição</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1">Altura (ex: 1.88m)</label>
              <input
                type="text"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1">Peso (ex: 82kg)</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1">Cidade</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#9AA1AA] block mb-1">Bio / Foco de Carreira</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#15191F] border border-[#1F2630] text-sm text-white focus:outline-none focus:border-[#FF6B1A]"
            />
          </div>

          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#FF6B1A]/20"
          >
            Salvar Alterações
          </button>
        </form>
      )}

      {/* Tier & XP Progression Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block mb-1">
              Progressão de XP
            </span>
            <h3 className="text-2xl font-heading text-white">Nível Atual: {tier}</h3>
          </div>
          <span className="text-sm font-mono-num font-bold text-[#FF8D4D] bg-[#FF6B1A]/10 px-3 py-1 rounded-xl border border-[#FF6B1A]/30">
            {xp} XP
          </span>
        </div>

        <div className="w-full bg-[#11151A] rounded-full h-3 overflow-hidden border border-[#1F2630]">
          <div
            className="bg-gradient-to-r from-[#FF6B1A] to-[#FF8D4D] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono-num text-[#9AA1AA]">
          <span>{xp} XP</span>
          <span>Próximo nível: {nextTierXp} XP</span>
        </div>
      </div>
    </div>
  );
};
