import React from 'react';
import { cn } from '@/lib/cn';

export interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  variant?: 'volt' | 'cyan' | 'default';
}

export function SectionHeader({
  tag,
  title,
  subtitle,
  icon,
  action,
  className,
  variant = 'default',
}: SectionHeaderProps) {
  const tagColor =
    variant === 'volt'
      ? 'text-volt bg-volt/10 border-volt/30'
      : variant === 'cyan'
      ? 'text-telemetry-cyan bg-telemetry-cyan/10 border-telemetry-cyan/30'
      : 'text-slate-300 bg-white/5 border-white/10';

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stadium-border/60',
        className
      )}
    >
      <div className="flex flex-col gap-1">
        {tag && (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-[10px] font-display uppercase tracking-widest px-2 py-0.5 rounded-xs border font-bold',
                tagColor
              )}
            >
              {tag}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-volt shrink-0">{icon}</span>}
          <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight font-extrabold text-white">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 font-sans">{subtitle}</p>
        )}
      </div>

      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}
