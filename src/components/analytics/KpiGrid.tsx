'use client';

import React from 'react';
import { SegmentKpis } from '@/types/analysis';
import { Card } from '@/components/ui/Card';
import { StatBar } from '@/components/ui/StatBar';
import {
  Share2,
  Swords,
  ShieldAlert,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Crosshair,
} from 'lucide-react';

export interface KpiGridProps {
  kpis: SegmentKpis;
  className?: string;
}

export function KpiGrid({ kpis, className }: KpiGridProps) {
  const cards = [
    {
      label: 'Precisión de Pases',
      value: kpis.passAccuracy,
      unit: '%',
      benchmark: 80,
      icon: <Share2 className="w-4 h-4 text-telemetry-cyan" />,
      variant: 'cyan' as const,
      status: kpis.passAccuracy >= 85 ? 'Élite' : 'Estándar',
      note: 'Distribución y salida limpia',
    },
    {
      label: 'Duelos Ganados',
      value: kpis.duelsWonRate,
      unit: '%',
      benchmark: 55,
      icon: <Swords className="w-4 h-4 text-volt" />,
      variant: 'volt' as const,
      status: kpis.duelsWonRate >= 65 ? 'Dominante' : 'Disputado',
      note: 'Duelos 1v1 y choques directos',
    },
    {
      label: 'Intercepciones & Cortes',
      value: kpis.interceptions + (kpis.recoveries ? Math.min(kpis.recoveries, 5) : 0),
      unit: '',
      benchmark: 5,
      icon: <ShieldAlert className="w-4 h-4 text-emerald-400" />,
      variant: 'volt' as const,
      status: 'Alto Impacto',
      note: 'Anticipación y lectura defensiva',
    },
    {
      label: 'Velocidad Punta',
      value: kpis.topSpeedKmh,
      unit: 'km/h',
      benchmark: 30,
      icon: <Gauge className="w-4 h-4 text-telemetry-cyan" />,
      variant: 'cyan' as const,
      status: 'Sprint Explosivo',
      note: 'Aceleración en repliegue',
    },
  ];

  const tacticalContextList = kpis.tacticalKpis || [
    {
      title: 'Intercepciones y Cortes',
      evaluation: 'Alta Efectividad',
      detail: 'Anticipa pases filtrados y balones aéreos con notable lectura defensiva.',
      status: 'positive' as const,
    },
    {
      title: 'Precisión en Salida',
      evaluation: 'Segura en Corto',
      detail: 'Seguro cuando conecta raso al pie; irregular al rifar en largo bajo presión.',
      status: 'neutral' as const,
    },
    {
      title: 'Pelota Parada y Remates',
      evaluation: '1 Disparo al Travesaño',
      detail: 'Remate potente de media distancia y lanzador de tiros de esquina.',
      status: 'positive' as const,
    },
    {
      title: 'Duelos Físicos Ganados',
      evaluation: 'Competitivo',
      detail: 'Solvente en el choque cuerpo a cuerpo sin conceder faltas innecesarias.',
      status: 'positive' as const,
    },
  ];

  return (
    <div className={`flex flex-col gap-3.5 ${className || ''}`}>
      {/* 4 Clean Quantitative Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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

            <StatBar
              label=""
              value={typeof card.value === 'number' ? (card.unit === '%' ? card.value : card.value * 10) : 50}
              max={100}
              showNumbers={false}
              variant={card.variant}
            />

            <span className="text-[10px] text-slate-500 font-sans line-clamp-1">
              {card.note}
            </span>
          </Card>
        ))}
      </div>

      {/* Qualitative Tactical Context Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {tacticalContextList.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg bg-stadium-surface border border-stadium-border flex flex-col justify-between gap-1.5 hover:border-volt/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5">
              <span className="font-display uppercase tracking-wider font-bold text-[11px] text-[var(--color-text-main)]">
                {item.title}
              </span>
              <span
                className={`text-[8px] font-display uppercase tracking-widest px-1.5 py-0.2 rounded-xs font-bold flex items-center gap-1 ${
                  item.status === 'positive'
                    ? 'bg-volt/15 text-volt border border-volt/30'
                    : item.status === 'warning'
                    ? 'bg-thermal-high/15 text-thermal-high border border-thermal-high/30'
                    : 'bg-telemetry-cyan/15 text-telemetry-cyan border border-telemetry-cyan/30'
                }`}
              >
                {item.status === 'positive' ? (
                  <CheckCircle2 className="w-2.5 h-2.5" />
                ) : item.status === 'warning' ? (
                  <AlertTriangle className="w-2.5 h-2.5" />
                ) : (
                  <Crosshair className="w-2.5 h-2.5" />
                )}
                {item.evaluation}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
