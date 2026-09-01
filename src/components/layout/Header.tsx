import React from 'react';
import { Search, Flame, Award } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Link } from 'react-router-dom';
import { AthleteAvatar } from '../profile/AthleteAvatar';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { profile, xp, tier, currentStreakDays } = usePlayer();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#080A0D]/92 backdrop-blur-xl border-b border-[#1F2630] px-3 sm:px-5 lg:px-6 flex items-center justify-between">
      <Link
        to="/"
        className="flex items-center gap-2.5 group min-w-0"
        aria-label="Ir para o início do CourtLab"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-[#FF6B1A]/25 shadow-sm shadow-[#FF6B1A]/10 group-hover:border-[#FF6B1A]/50 group-hover:scale-[1.03] transition-all flex-shrink-0">
          <img
            src="/court-lab-mark.svg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-white whitespace-nowrap">
          COURT <span className="text-[#FF6B1A]">LAB</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center flex-1 max-w-lg mx-6 lg:mx-10">
        <button
          onClick={onOpenSearch}
          className="w-full h-9 px-3.5 rounded-xl bg-[#101419] hover:bg-[#15191F] border border-[#1F2630] hover:border-[#2B3542] text-xs text-[#9AA1AA] flex items-center justify-between transition-colors"
          aria-label="Abrir busca global"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-[#FF6B1A] flex-shrink-0" />
            <span className="truncate">Buscar exercícios, treinos e fundamentos...</span>
          </span>
          <kbd className="ml-3 px-1.5 py-0.5 rounded-md bg-[#1A2027] font-mono-num text-[10px] text-[#7F8894] border border-[#2B3542]">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <button
          onClick={onOpenSearch}
          className="md:hidden w-9 h-9 rounded-xl bg-[#101419] text-[#9AA1AA] hover:text-white border border-[#1F2630] flex items-center justify-center transition-colors"
          aria-label="Buscar"
        >
          <Search className="w-4 h-4" />
        </button>

        <div
          className="h-9 px-2.5 sm:px-3 rounded-xl bg-[#101419] border border-[#1F2630] flex items-center gap-1.5 text-xs"
          title={`${currentStreakDays} dias de sequência`}
        >
          <Flame className="w-4 h-4 text-[#FF6B1A] fill-[#FF6B1A]" />
          <span className="font-mono-num font-bold text-white">{currentStreakDays}</span>
          <span className="hidden lg:inline text-[9px] uppercase tracking-wider text-[#7F8894]">dias</span>
        </div>

        <div className="hidden sm:flex h-9 items-center gap-2 px-3 rounded-xl bg-[#101419] border border-[#1F2630] text-xs">
          <Award className="w-3.5 h-3.5 text-[#FF8D4D]" />
          <span className="font-mono-num font-bold text-white">{xp} XP</span>
          <span className="hidden lg:inline text-[9px] font-bold uppercase tracking-wider text-[#FF6B1A]">
            {tier}
          </span>
        </div>

        <Link
          to="/perfil"
          aria-label="Abrir perfil"
          className="h-9 flex items-center gap-2 pl-1.5 pr-1.5 sm:pl-2.5 sm:pr-1.5 rounded-xl hover:bg-[#11161C] border border-transparent hover:border-[#1F2630] transition-colors"
        >
          <div className="hidden lg:block text-right">
            <span className="text-[11px] font-bold text-white block leading-tight">{profile.name}</span>
            <span className="text-[9px] text-[#7F8894] leading-none">{profile.position}</span>
          </div>
          <AthleteAvatar
            name={profile.name}
            src={profile.avatarUrl}
            className="w-8 h-8 rounded-lg bg-[#171C22] border border-[#2B3542]"
            fallbackClassName="text-xs font-bold text-white"
          />
        </Link>
      </div>
    </header>
  );
};
