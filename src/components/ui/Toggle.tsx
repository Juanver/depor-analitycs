'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: 'volt' | 'cyan';
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  icon,
  disabled = false,
  className,
  variant = 'volt',
}: ToggleProps) {
  const activeColor = variant === 'volt' ? 'bg-volt' : 'bg-telemetry-cyan';
  const glowColor = variant === 'volt' ? 'shadow-volt-glow' : 'shadow-cyan-glow';

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer select-none group',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
      />
      <div
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors duration-200 border',
          checked
            ? `${activeColor} ${glowColor} border-transparent`
            : 'bg-stadium-elevated border-stadium-border group-hover:border-slate-500'
        )}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-colors',
            checked ? 'bg-stadium-base' : 'bg-slate-300'
          )}
        />
      </div>

      {(label || icon) && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-display uppercase tracking-wider font-bold text-slate-200 group-hover:text-white transition-colors">
            {icon && <span className="text-volt">{icon}</span>}
            <span>{label}</span>
          </div>
          {description && (
            <span className="text-[11px] text-slate-400 font-sans">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}
