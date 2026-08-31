import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Flame,
  Library,
  Layers,
  TrendingUp,
  Target,
  User,
  Award
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const Sidebar: React.FC = () => {
  const { xp, tier } = usePlayer();

  const navGroups = [
    {
      label: 'Principal',
      items: [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { to: '/plano', label: 'Meu Plano', icon: CalendarDays },
        { to: '/treinar', label: 'Treinar', icon: Flame, badge: 'Hub' }
      ]
    },
    {
      label: 'Desenvolvimento',
      items: [
        { to: '/biblioteca', label: 'Biblioteca', icon: Library },
        { to: '/programas', label: 'Programas', icon: Layers },
        { to: '/progresso', label: 'Progresso', icon: TrendingUp }
      ]
    },
    {
      label: 'Conta',
      items: [
        { to: '/metas', label: 'Metas', icon: Target },
        { to: '/perfil', label: 'Perfil', icon: User }
      ]
    }
  ];

  const nextTierXp = tier === 'Rookie' ? 600 : tier === 'Prospect' ? 1200 : tier === 'Starter' ? 1800 : tier === 'Sixth Man' ? 2500 : 3500;
  const currentTierBase = tier === 'Rookie' ? 0 : tier === 'Prospect' ? 600 : tier === 'Starter' ? 1200 : tier === 'Sixth Man' ? 1800 : 2500;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((xp - currentTierBase) / (nextTierXp - currentTierBase)) * 100)));

  return (
    <aside className="hidden md:flex flex-col justify-between w-60 lg:w-64 bg-[#0D1014] border-r border-[#1F2630] px-3 py-5 flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <nav aria-label="Navegação principal" className="space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-2 text-[9px] uppercase font-bold tracking-[0.18em] text-[#646D78]">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#171C22] text-white'
                          : 'text-[#8B949F] hover:text-white hover:bg-[#12171D]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-[#FF6B1A]" />}
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#FF6B1A]' : 'text-[#727B86] group-hover:text-[#FF8D4D]'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-md bg-[#FF6B1A]/12 border border-[#FF6B1A]/25 text-[#FF8D4D] text-[8px] font-bold uppercase tracking-wider">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3.5 rounded-2xl bg-[#11161C] border border-[#1F2630]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#707985] block">Nível atual</span>
            <span className="text-sm font-heading text-white">{tier}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#FF6B1A]/10 border border-[#FF6B1A]/25 flex items-center justify-center">
            <Award className="w-4 h-4 text-[#FF6B1A]" />
          </div>
        </div>

        <div className="w-full bg-[#080A0D] rounded-full h-1.5 overflow-hidden mb-2">
          <div
            className="bg-[#FF6B1A] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono-num text-[#707985]">
          <span>{xp} XP</span>
          <span>{nextTierXp} XP</span>
        </div>
      </div>
    </aside>
  );
};
