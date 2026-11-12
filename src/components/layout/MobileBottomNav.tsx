'use client';

import React from 'react';
import { LayoutGrid, Tv, Activity, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface MobileBottomNavProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

export function MobileBottomNav({
  activeSection,
  onSelectSection,
}: MobileBottomNavProps) {
  const navItems = [
    { id: 'section-pitch', label: 'Cancha', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'section-metrics', label: 'Métricas', icon: <Activity className="w-4 h-4" /> },
    { id: 'section-video', label: 'Video', icon: <Tv className="w-4 h-4" /> },
    { id: 'section-coach', label: 'Coach IA', icon: <Dumbbell className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-stadium-base/95 border-t border-stadium-border backdrop-blur-xl px-2 py-1 shadow-2xl">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-1.5 rounded-sm transition-all text-[10px] font-display uppercase tracking-wider font-bold min-h-[44px]',
                isActive
                  ? 'text-volt bg-volt/10 border border-volt/30 shadow-volt-glow'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <span className={isActive ? 'text-volt' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
