import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Flame,
  Compass,
  TrendingUp
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center min-w-0 flex-1 h-full text-[10px] font-semibold transition-colors ${
      isActive ? 'text-[#FF6B1A]' : 'text-[#8B949F] hover:text-white'
    }`;

  return (
    <nav
      aria-label="Navegação mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[68px] bg-[#0B0E12]/96 backdrop-blur-xl border-t border-[#1F2630] px-2 flex items-center justify-between pb-[env(safe-area-inset-bottom)]"
    >
      <NavLink to="/" end className={itemClass}>
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Início</span>
      </NavLink>

      <NavLink to="/plano" className={itemClass}>
        <CalendarDays className="w-5 h-5 mb-0.5" />
        <span>Plano</span>
      </NavLink>

      <NavLink
        to="/treinar"
        className={({ isActive }) =>
          `relative -top-3 flex flex-col items-center justify-center flex-1 min-w-0 ${
            isActive ? 'text-[#FF6B1A]' : 'text-white'
          }`
        }
        aria-label="Abrir área de treino"
      >
        {({ isActive }) => (
          <>
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-[#080A0D] transition-all ${
                isActive
                  ? 'bg-[#FF6B1A] shadow-lg shadow-[#FF6B1A]/35 scale-105'
                  : 'bg-[#F15F12] shadow-md shadow-[#FF6B1A]/25'
              }`}
            >
              <Flame className="w-6 h-6 fill-current text-white" />
            </div>
            <span className="text-[10px] font-bold mt-1">Treinar</span>
          </>
        )}
      </NavLink>

      <NavLink to="/biblioteca" className={itemClass}>
        <Compass className="w-5 h-5 mb-0.5" />
        <span>Explorar</span>
      </NavLink>

      <NavLink to="/progresso" className={itemClass}>
        <TrendingUp className="w-5 h-5 mb-0.5" />
        <span>Progresso</span>
      </NavLink>
    </nav>
  );
};
