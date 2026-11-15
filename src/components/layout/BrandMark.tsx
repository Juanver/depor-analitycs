import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BrandMarkProps {
  href?: string;
  showProTag?: boolean;
  className?: string;
}

export function BrandMark({
  href = '/',
  showProTag = true,
  className,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 group focus-visible:outline-none shrink-0',
        className
      )}
    >
      <div className="relative flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-stadium-elevated to-stadium-base border border-volt/50 shadow-volt-glow group-hover:scale-105 transition-transform">
        <Zap className="w-4 h-4 text-volt fill-volt/30" />
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-display font-black text-base sm:text-lg tracking-tight text-[var(--color-text-main)] uppercase">
          SPORT<span className="text-volt">INTELLIGENCE</span>
        </span>
        {showProTag && (
          <span className="hidden lg:inline-block text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
            PRO AI
          </span>
        )}
      </div>
    </Link>
  );
}
