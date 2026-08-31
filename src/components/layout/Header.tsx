import React from 'react';
import { Search, Flame, Award, Plus, User, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { profile, xp, tier, currentStreakDays } = usePlayer();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#080A0D]/90 backdrop-blur-md border-b border-[#1F2630] px-4 sm:px-6 flex items-center justify-between">
      {/* Brand & Mobile Title */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#FF6B1A] flex items-center justify-center font-heading font-black text-white text-lg tracking-wider group-hover:scale-105 transition-transform shadow-md shadow-[#FF6B1A]/30">
            CL
          </div>
          <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
            COURT <span className="text-[#FF6B1A]">LAB</span>
          </span>
        </Link>
      </div>

      {/* Global Search Bar (Trigger for Modal) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full h-9 px-3.5 rounded-xl bg-[#11151A] hover:bg-[#15191F] border border-[#1F2630] text-xs text-[#9AA1AA] flex items-center justify-between transition-colors shadow-inner"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span>Buscar exercícios, treinos, fundamentos...</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#1F2630] font-mono-num text-[10px] text-[#9AA1AA]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Gamification, Streak & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-xl bg-[#11151A] text-[#9AA1AA] hover:text-white border border-[#1F2630]"
          aria-label="Buscar"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 text-white text-xs font-mono-num font-bold">
          <Flame className="w-4 h-4 text-[#FF6B1A] fill-[#FF6B1A]" />
          <span>{currentStreakDays}</span>
          <span className="hidden sm:inline text-[10px] text-[#9AA1AA] font-normal">DIAS</span>
        </div>

        {/* XP & Tier Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#11151A] border border-[#1F2630] text-xs">
          <Award className="w-3.5 h-3.5 text-[#FF8D4D]" />
          <span className="font-mono-num font-bold text-white">{xp} XP</span>
          <span className="text-[10px] font-semibold uppercase text-[#FF6B1A] bg-[#FF6B1A]/10 px-1.5 py-0.5 rounded">
            {tier}
          </span>
        </div>

        {/* Build Custom Workout CTA */}
        <button
          onClick={() => navigate('/treinar?tab=builder')}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#191E24] hover:bg-[#202730] border border-[#2B3542] text-xs font-bold uppercase tracking-wider text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#FF6B1A]" />
          <span>Montar Treino</span>
        </button>

        {/* Profile Avatar */}
        <Link
          to="/perfil"
          className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-[#11151A] hover:bg-[#15191F] border border-[#1F2630] transition-colors"
        >
          <div className="hidden sm:block text-right">
            <span className="text-xs font-bold text-white block leading-tight">{profile.name}</span>
            <span className="text-[10px] font-mono-num text-[#9AA1AA] leading-none">{profile.position}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1F2630] to-[#2B3542] border border-white/10 flex items-center justify-center text-xs font-bold text-white">
            {profile.name.charAt(0)}
          </div>
        </Link>
      </div>
    </header>
  );
};
