import React from 'react';
import { cn } from '@/lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'card';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  ...props
}: SkeletonProps) {
  const base =
    'relative overflow-hidden bg-stadium-elevated/70 border border-stadium-border/40';

  const variantStyles = {
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    card: 'rounded-lg p-6 min-h-[140px]',
  };

  return (
    <div
      className={cn(base, variantStyles[variant], className)}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}
