import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-xs font-display uppercase tracking-wider', className)}
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-slate-400 hover:text-volt transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Inicio</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          {item.href && !item.active ? (
            <Link
              href={item.href}
              className="text-slate-400 hover:text-volt transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                'font-bold',
                item.active ? 'text-volt font-black' : 'text-slate-300'
              )}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
