'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import {
  Zap,
  User,
  Users,
  Plus,
} from 'lucide-react';

export interface NavbarProps {
  breadcrumbs?: BreadcrumbItem[];
  currentMatchTitle?: string;
  activeMode?: 'individual' | 'equipo' | 'player' | 'team';
  rightAction?: React.ReactNode;
}

export function Navbar({ breadcrumbs, activeMode, rightAction }: NavbarProps) {
  const pathname = usePathname();

  // Si se provee activeMode explícitamente (ej. desde /analisis/[id]), respetarlo
  let isPlayerActive = false;
  let isTeamActive = false;

  if (activeMode) {
    isPlayerActive = activeMode === 'individual' || activeMode === 'player';
    isTeamActive = activeMode === 'equipo' || activeMode === 'team';
  } else {
    isPlayerActive = pathname.startsWith('/analisis') && !pathname.startsWith('/analisis-equipo');
    isTeamActive = pathname.startsWith('/analisis-equipo');
  }

  const modeLinks = (
    <>
      <Link
        href="/analisis/verano-7-demo"
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-1 rounded-full font-display uppercase tracking-wider text-[11px] font-bold transition-all ${
          isPlayerActive
            ? 'bg-volt text-stadium-base shadow-volt-glow'
            : 'text-slate-400 hover:text-[var(--color-text-main)]'
        }`}
      >
        <User className="w-3.5 h-3.5 shrink-0" />
        <span>Jugador</span>
      </Link>

      <Link
        href="/analisis-equipo/dibujitos-fc-team-demo"
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-1 rounded-full font-display uppercase tracking-wider text-[11px] font-bold transition-all ${
          isTeamActive
            ? 'bg-telemetry-cyan text-stadium-base shadow-cyan-glow'
            : 'text-slate-400 hover:text-[var(--color-text-main)]'
        }`}
      >
        <Users className="w-3.5 h-3.5 shrink-0" />
        <span>Equipo</span>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-stadium-base/90 border-b border-stadium-border backdrop-blur-xl">
      {/* Main Row: Mobile (Logo + Actions) | Tablet & Desktop (Logo + Mode Switcher + Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 md:gap-4">
        {/* Left: Brand Identity + Desktop Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none shrink-0"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-stadium-elevated to-stadium-base border border-volt/50 shadow-volt-glow group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-volt fill-volt/30" />
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-[var(--color-text-main)] uppercase">
                SPORT<span className="text-volt">INTELLIGENCE</span>
              </span>
              <span className="hidden lg:inline-block text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                PRO AI
              </span>
            </div>
          </Link>

          {/* Contextual Breadcrumbs (Desktop) */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="hidden lg:flex items-center pl-3 border-l border-stadium-border text-xs min-w-0">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
        </div>

        {/* Center: Segmented Mode Navigator (Tablet & Desktop) */}
        <nav
          aria-label="Modo de análisis"
          className="hidden sm:flex items-center p-0.5 rounded-full bg-stadium-surface border border-stadium-border text-xs shrink-0"
        >
          {modeLinks}
        </nav>

        {/* Right: Optional Contextual Action + Compact Theme Switcher + New Analysis CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {rightAction && <div className="hidden md:flex">{rightAction}</div>}

          <ThemeToggle />

          <Link href="/#match-setup">
            <Button
              variant="volt"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs font-display uppercase tracking-wider font-extrabold px-2.5 sm:px-3 py-1.5"
            >
              <span className="hidden md:inline">Nuevo Análisis</span>
              <span className="md:hidden">Nuevo</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Secondary Bar: Full-width Segmented Mode Navigator */}
      <div className="sm:hidden border-t border-stadium-border-subtle bg-stadium-surface/60 px-4 py-2">
        <nav
          aria-label="Modo de análisis móvil"
          className="grid grid-cols-2 gap-1 p-0.5 rounded-full bg-stadium-base/80 border border-stadium-border"
        >
          {modeLinks}
        </nav>
      </div>
    </header>
  );
}
