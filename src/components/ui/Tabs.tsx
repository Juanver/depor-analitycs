'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pills' | 'segmented' | 'underline';
}

export function Tabs({
  items,
  activeId,
  onChange,
  className,
  variant = 'segmented',
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'relative flex items-center p-1 rounded-md bg-stadium-base/80 border border-stadium-border backdrop-blur-sm',
        className
      )}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs md:text-sm font-display uppercase tracking-wider font-bold transition-colors z-10 min-h-[40px]',
              isActive ? 'text-stadium-base' : 'text-slate-400 hover:text-white'
            )}
          >
            {/* Sliding background pill */}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-volt rounded-sm shadow-volt-glow -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                  isActive ? 'bg-stadium-base text-volt font-bold' : 'bg-white/10 text-slate-300'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
