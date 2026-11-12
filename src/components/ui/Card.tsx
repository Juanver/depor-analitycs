'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'voltGlow' | 'cyanGlow' | 'transparent';
  hoverEffect?: boolean;
  cornerAccents?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      hoverEffect = false,
      cornerAccents = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative rounded-lg backdrop-blur-md overflow-hidden transition-all duration-300';

    const variantStyles = {
      default:
        'bg-stadium-surface/90 border border-stadium-border shadow-stadium',
      elevated:
        'bg-stadium-elevated/95 border border-stadium-border-strong shadow-xl',
      voltGlow:
        'bg-stadium-surface/90 border border-volt/40 shadow-volt-glow',
      cyanGlow:
        'bg-stadium-surface/90 border border-telemetry-cyan/40 shadow-cyan-glow',
      transparent:
        'bg-stadium-surface/40 border border-white/5',
    };

    const hoverStyles = hoverEffect
      ? 'hover:border-volt/50 hover:shadow-volt-glow hover:-translate-y-0.5'
      : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], hoverStyles, className)}
        {...props}
      >
        {/* Subtle tactical top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Optional Tactical HUD corner accents */}
        {cornerAccents && (
          <>
            <div className="pointer-events-none absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-volt/60" />
            <div className="pointer-events-none absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-volt/60" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-volt/60" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-volt/60" />
          </>
        )}

        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
