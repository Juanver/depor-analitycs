import React from 'react';
import { cn } from '@/lib/cn';

export interface StatBarProps {
  label: string;
  value: number; // e.g. 84
  max?: number; // e.g. 100
  unit?: string; // e.g. "%" or "km/h"
  benchmark?: number; // target benchmark line (e.g. 75)
  variant?: 'volt' | 'cyan' | 'thermal';
  className?: string;
  showNumbers?: boolean;
}

export function StatBar({
  label,
  value,
  max = 100,
  unit = '%',
  benchmark,
  variant = 'volt',
  className,
  showNumbers = true,
}: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantBarClasses = {
    volt: 'bg-gradient-to-r from-lime-600 via-volt to-volt-hover shadow-volt-glow',
    cyan: 'bg-gradient-to-r from-cyan-600 via-telemetry-cyan to-cyan-300 shadow-cyan-glow',
    thermal: 'bg-gradient-to-r from-thermal-low via-thermal-mid-2 to-thermal-high',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-display uppercase tracking-wider font-bold text-slate-300">
          {label}
        </span>
        {showNumbers && (
          <span className="font-mono text-sm font-semibold tabular-nums text-white">
            {value}
            <span className="text-[10px] text-slate-400 ml-0.5">{unit}</span>
          </span>
        )}
      </div>

      <div className="relative w-full h-2 rounded-full bg-stadium-elevated overflow-hidden border border-white/5">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', variantBarClasses[variant])}
          style={{ width: `${percentage}%` }}
        />

        {benchmark !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-10 opacity-70"
            style={{ left: `${(benchmark / max) * 100}%` }}
            title={`Benchmark: ${benchmark}${unit}`}
          />
        )}
      </div>
    </div>
  );
}
