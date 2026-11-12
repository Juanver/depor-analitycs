import React from 'react';
import { cn } from '@/lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'volt' | 'cyan' | 'thermal' | 'warning' | 'muted' | 'outline';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export function Badge({
  className,
  variant = 'volt',
  size = 'md',
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center font-display uppercase tracking-wider font-semibold rounded-xs border select-none';

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    volt: 'bg-volt/10 text-volt border-volt/30 shadow-[0_0_10px_rgba(163,230,53,0.15)]',
    cyan: 'bg-telemetry-cyan/10 text-telemetry-cyan border-telemetry-cyan/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]',
    thermal: 'bg-thermal-high/15 text-thermal-high border-thermal-high/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    muted: 'bg-stadium-elevated text-slate-400 border-stadium-border',
    outline: 'bg-transparent text-[var(--color-text-main)] border-stadium-border',
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
