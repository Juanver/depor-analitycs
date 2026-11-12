'use client';

import React from 'react';
import { TeamCollectiveKpis } from '@/types/teamAnalysis';
import { Card } from '@/components/ui/Card';
import { StatBar } from '@/components/ui/StatBar';
import {
  PieChart,
  Share2,
  Flame,
  Layers,
} from 'lucide-react';

export interface TeamKpiGridProps {
  kpis: TeamCollectiveKpis;
  className?: string;
}

export function TeamKpiGrid({ kpis, className }: TeamKpiGridProps) {
  const cards = [
    {
      label: 'Posesión Colectiva',
      value: kpis.possessionPercentage,
      unit: '%',
      icon: <PieChart className="w-4 h-4 text-volt" />,
      variant: 'volt' as const,
      status: kpis.possessionPercentage >= 50 ? 'Control de Balón' : 'Fase Reactiva',
      note: 'Dominio territorial de tiempo',
    },
    {
      label: 'Precisión de Pases',
      value: kpis.passAccuracyPercentage,
      unit: '%',
      icon: <Share2 className="w-4 h-4 text-telemetry-cyan" />,
      variant: 'cyan' as const,
      status: kpis.passAccuracyPercentage >= 80 ? 'Circulación Élite' : 'Regular',
      note: `${kpis.totalPasses} pases completados`,
    },
    {
      label: 'Índice PPDA (Presión)',
      value: kpis.ppda,
      unit: '',
      icon: <Flame className="w-4 h-4 text-orange-400" />,
      variant: 'thermal' as const,
      status: kpis.ppda <= 8.5 ? 'Presión Activa' : 'Bloque Cauteloso',
      note: 'Pases rivales antes de cortar',
    },
    {
      label: 'Compacidad de Líneas',
      value: kpis.teamCompactnessMeters,
      unit: 'm',
      icon: <Layers className="w-4 h-4 text-volt" />,
      variant: 'volt' as const,
      status: 'Bloque Compacto',
      note: 'Distancia media zaga-delantero',
    },
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${className || ''}`}>
      {cards.map((card, idx) => (
        <Card
          key={idx}
          variant="default"
          className="p-4 flex flex-col justify-between gap-2.5 group hover:border-volt/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-1.5 rounded-md bg-white/5 border border-white/10 shrink-0">
              {card.icon}
            </div>
            <span className="text-[9px] font-display uppercase tracking-widest px-1.5 py-0.5 rounded-xs font-bold bg-white/5 text-slate-300">
              {card.status}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-2xl md:text-3xl text-[var(--color-text-main)] tracking-tight leading-none">
                {card.value}
              </span>
              {card.unit && (
                <span className="font-mono text-xs text-slate-400 font-semibold">
                  {card.unit}
                </span>
              )}
            </div>
            <span className="text-xs font-display uppercase tracking-wide font-bold text-slate-300 mt-1">
              {card.label}
            </span>
          </div>

          {typeof card.value === 'number' && (
            <StatBar
              label=""
              value={card.unit === '%' ? card.value : card.value * 10}
              max={100}
              showNumbers={false}
              variant={card.variant}
            />
          )}

          <span className="text-[10px] text-slate-500 font-sans line-clamp-1">
            {card.note}
          </span>
        </Card>
      ))}
    </div>
  );
}
