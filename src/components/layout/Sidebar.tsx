import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Flame,
  Library,
  Layers,
  Activity,
  TrendingUp,
  Target,
  User,
  Award
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const Sidebar: React.FC = () => {
  const { profile, xp, tier } = usePlayer();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/plano', label: 'Meu Plano', icon: CalendarDays },
    { to: '/treinar', label: 'Treinar', icon: Flame, badge: 'Hub' },
    { to: '/biblioteca', label: 'Biblioteca', icon: Library },
    { to: '/programas', label: 'Programas', icon: Layers },
    { to: '/fundamentos', label: 'Fundamentos', icon: Activity },
    { to: '/progresso', label: 'Progresso', icon: TrendingUp },
    { to: '/metas', label: 'Metas', icon: Target },
    { to: '/perfil', label: 'Perfil', icon: User }
  ];

  // XP Tier bounds calculation
  const nextTierXp = tier === 'Rookie' ? 600 : tier === 'Prospect' ? 1200 : tier === 'Starter' ? 1800 : tier === 'Sixth Man' ? 2500 : 3500;
  const currentTierBase = tier === 'Rookie' ? 0 : tier === 'Prospect' ? 600 : tier === 'Starter' ? 1200 : tier === 'Sixth Man' ? 1800 : 2500;
  const progressPercent = Math.min(100, Math.round(((xp - currentTierBase) / (nextTierXp - currentTierBase)) * 100));

  return (
    <aside className="hidden md:flex flex-col justify-between w-60 lg:w-64 bg-[#0D1014] border-r border-[#1F2630] p-4 flex-shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation List */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-[#9AA1AA]">
          Menu Principal
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#FF6B1A]/10 text-white border border-[#FF6B1A]/40'
                    : 'text-[#9AA1AA] hover:text-white hover:bg-[#15191F]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-[#FF6B1A]" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded bg-[#FF6B1A] text-white text-[9px] font-bold uppercase">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Player Card Level Footer */}
      <div className="p-3.5 rounded-2xl bg-[#15191F] border border-[#1F2630]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Ranking Atual</span>
            <span className="text-sm font-heading text-white">{tier}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 flex items-center justify-center">
            <Award className="w-4 h-4 text-[#FF6B1A]" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#11151A] rounded-full h-2 overflow-hidden mb-1.5 border border-[#1F2630]">
          <div
            className="bg-gradient-to-r from-[#FF6B1A] to-[#FF8D4D] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono-num text-[#9AA1AA]">
          <span>{xp} XP</span>
          <span>{nextTierXp} XP</span>
        </div>
      </div>
    </aside>
  );
};
