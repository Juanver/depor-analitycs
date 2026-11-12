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
}

export function Navbar({ breadcrumbs }: NavbarProps) {
  const pathname = usePathname();
  const isPlayerActive = pathname.startsWith('/analisis') && !pathname.startsWith('/analisis-equipo');
  const isTeamActive = pathname.startsWith('/analisis-equipo');

  return (
    <header className="sticky top-0 z-40 w-full bg-stadium-base/90 border-b border-stadium-border backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-stadium-elevated to-stadium-base border border-volt/50 shadow-volt-glow group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-volt fill-volt/30" />
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-lg tracking-tight text-[var(--color-text-main)] uppercase">
                DEPOR<span className="text-volt">ANALYTICS</span>
              </span>
              <span className="hidden md:inline-block text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                PRO AI
              </span>
            </div>
          </Link>

          {/* Contextual Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="hidden lg:flex items-center pl-3 border-l border-white/10 text-xs">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
        </div>

        {/* Center: Clean Segmented Mode Navigator */}
        <nav className="flex items-center p-0.5 rounded-full bg-stadium-surface border border-stadium-border text-xs">
          <Link
            href="/analisis/verano-7-demo"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-display uppercase tracking-wider text-[11px] font-bold transition-all ${
              isPlayerActive
                ? 'bg-volt text-stadium-base shadow-volt-glow'
                : 'text-slate-400 hover:text-[var(--color-text-main)]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Jugador</span>
          </Link>

          <Link
            href="/analisis-equipo/dibujitos-fc-team-demo"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-display uppercase tracking-wider text-[11px] font-bold transition-all ${
              isTeamActive
                ? 'bg-telemetry-cyan text-stadium-base shadow-cyan-glow'
                : 'text-slate-400 hover:text-[var(--color-text-main)]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Equipo</span>
          </Link>
        </nav>

        {/* Right: Compact Theme Switcher + New Analysis CTA */}
        <div className="flex items-center gap-2.5">
          {/* Minimal Icon-based Light / Dark mode switch */}
          <ThemeToggle />

          {/* New Analysis Button */}
          <Link href="/#match-setup">
            <Button
              variant="volt"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs font-display uppercase tracking-wider font-extrabold px-3 py-1.5"
            >
              <span className="hidden sm:inline">Nuevo Análisis</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
