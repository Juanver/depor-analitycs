'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { BrandMark } from './BrandMark';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Users,
  Plus,
  LogOut,
} from 'lucide-react';

export interface NavbarProps {
  breadcrumbs?: BreadcrumbItem[];
  currentMatchTitle?: string;
  activeMode?: 'individual' | 'equipo' | 'player' | 'team';
  rightAction?: React.ReactNode;
}

export function Navbar({ breadcrumbs, activeMode, rightAction }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
      router.push('/login');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

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
    <header className="sticky top-0 z-40 w-full bg-stadium-base/90 border-b border-stadium-border">
      {/* Main Row: Mobile (Logo + Actions) | Tablet & Desktop (Logo + Mode Switcher + Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 md:gap-4">
        {/* Left: Brand Identity + Desktop Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <BrandMark href="/" />

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

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="relative w-8 h-8 sm:w-auto sm:px-2.5 rounded-md bg-stadium-surface hover:bg-stadium-elevated border border-stadium-border flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-slate-300 hover:text-thermal-high disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline font-display text-[11px] uppercase tracking-wider font-bold">
              Salir
            </span>
          </button>
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
