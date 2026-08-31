import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Flame,
  Library,
  User,
  Activity
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0D1014]/95 backdrop-blur-lg border-t border-[#1F2630] px-2 flex items-center justify-around">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-14 h-full text-[10px] font-semibold transition-colors ${
            isActive ? 'text-[#FF6B1A]' : 'text-[#9AA1AA] hover:text-white'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Início</span>
      </NavLink>

      <NavLink
        to="/plano"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-14 h-full text-[10px] font-semibold transition-colors ${
            isActive ? 'text-[#FF6B1A]' : 'text-[#9AA1AA] hover:text-white'
          }`
        }
      >
        <CalendarDays className="w-5 h-5 mb-0.5" />
        <span>Plano</span>
      </NavLink>

      {/* Floating Main Action Button */}
      <NavLink
        to="/treinar"
        className="relative -top-3 flex flex-col items-center justify-center"
      >
        <div className="w-12 h-12 rounded-full bg-[#FF6B1A] text-white flex items-center justify-center shadow-lg shadow-[#FF6B1A]/40 border-2 border-[#080A0D]">
          <Flame className="w-6 h-6 fill-current" />
        </div>
        <span className="text-[10px] font-bold text-white mt-0.5">Treinar</span>
      </NavLink>

      <NavLink
        to="/biblioteca"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-14 h-full text-[10px] font-semibold transition-colors ${
            isActive ? 'text-[#FF6B1A]' : 'text-[#9AA1AA] hover:text-white'
          }`
        }
      >
        <Library className="w-5 h-5 mb-0.5" />
        <span>Drills</span>
      </NavLink>

      <NavLink
        to="/perfil"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-14 h-full text-[10px] font-semibold transition-colors ${
            isActive ? 'text-[#FF6B1A]' : 'text-[#9AA1AA] hover:text-white'
          }`
        }
      >
        <User className="w-5 h-5 mb-0.5" />
        <span>Perfil</span>
      </NavLink>
    </nav>
  );
};
