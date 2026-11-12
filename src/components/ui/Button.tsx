'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'volt' | 'cyan' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'volt',
      size = 'md',
      icon,
      iconPosition = 'left',
      children,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-display uppercase tracking-wider font-bold transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-base disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] min-h-[44px] min-w-[44px] cursor-pointer';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm rounded-md gap-2',
      lg: 'px-7 py-3.5 text-base rounded-md gap-3',
    };

    const variantStyles = {
      volt: 'bg-volt text-stadium-base hover:bg-volt-hover hover:shadow-volt-glow active:bg-volt-active shadow-sm',
      cyan: 'bg-telemetry-cyan text-stadium-base hover:bg-telemetry-cyan-hover hover:shadow-cyan-glow active:bg-[#06B6D4] shadow-sm',
      outline:
        'bg-stadium-surface/80 text-[var(--color-text-main)] border border-stadium-border hover:border-volt hover:text-volt hover:bg-volt/5',
      ghost:
        'bg-transparent text-slate-400 hover:text-[var(--color-text-main)] hover:bg-stadium-elevated',
      danger:
        'bg-thermal-high text-white hover:bg-red-600 hover:shadow-thermal-glow',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
