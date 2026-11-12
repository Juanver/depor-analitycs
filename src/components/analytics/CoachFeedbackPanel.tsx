'use client';

import React from 'react';
import { CoachStrength, CoachWeakness, RecommendedDrill } from '@/types/analysis';
import { Card } from '@/components/ui/Card';
import { DrillCard } from './DrillCard';
import {
  CheckCircle2,
  AlertTriangle,
  Dumbbell,
  Play,
  Flame,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CoachFeedbackPanelProps {
  strengths: CoachStrength[];
  weaknesses: CoachWeakness[];
  drills: RecommendedDrill[];
  tacticalNotes?: string;
  onJumpToTimestamp?: (seconds: number) => void;
  className?: string;
}

export function CoachFeedbackPanel({
  strengths,
  weaknesses,
  drills,
  tacticalNotes,
  onJumpToTimestamp,
  className,
}: CoachFeedbackPanelProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Tactical Master Notes Banner */}
      {tacticalNotes && (
        <Card variant="default" className="p-4 border-l-4 border-l-telemetry-cyan bg-stadium-elevated/80">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xs bg-telemetry-cyan/10 text-telemetry-cyan shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-display uppercase tracking-widest text-telemetry-cyan font-bold">
                DICTAMEN TÁCTICO DEL ENTRENADOR IA
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                {tacticalNotes}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 3-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Fortalezas (Mantener) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-volt/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xs bg-volt/15 text-volt border border-volt/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-white">
                Fortalezas <span className="text-volt">(Mantener)</span>
              </h3>
            </div>
            <span className="text-[10px] font-mono text-volt bg-volt/10 px-2 py-0.5 rounded-xs border border-volt/20">
              {strengths.length} PATRONES
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {strengths.map((item) => (
              <Card
                key={item.id}
                variant="default"
                className="p-4 border-l-2 border-l-volt hover:border-volt/60 transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-display uppercase tracking-widest text-volt font-bold">
                      {item.category}
                    </span>

                    {/* Clickable timestamp chip */}
                    <button
                      onClick={() => onJumpToTimestamp?.(item.timestampSeconds)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-volt/15 hover:bg-volt text-volt hover:text-stadium-base font-mono font-bold text-xs transition-colors cursor-pointer"
                      title="Saltar a este segundo en el video"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>[{item.timestampDisplay}]</span>
                    </button>
                  </div>

                  <h4 className="font-display font-bold text-sm text-[var(--color-text-main)] uppercase tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 2: Aspectos a Corregir (Mejorar) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-thermal-high/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xs bg-thermal-high/15 text-thermal-high border border-thermal-high/30">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-white">
                A Corregir <span className="text-thermal-high">(Mejorar)</span>
              </h3>
            </div>
            <span className="text-[10px] font-mono text-thermal-high bg-thermal-high/10 px-2 py-0.5 rounded-xs border border-thermal-high/20">
              {weaknesses.length} ALERTAS
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {weaknesses.map((item) => (
              <Card
                key={item.id}
                variant="default"
                className="p-4 border-l-2 border-l-thermal-high hover:border-thermal-high/60 transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[9px] font-display uppercase tracking-widest px-1.5 py-0.2 rounded-xs font-bold ${
                        item.severity === 'critical'
                          ? 'bg-thermal-high/20 text-thermal-high border border-thermal-high/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      Prioridad {item.severity === 'critical' ? 'Crítica' : 'Moderada'}
                    </span>

                    {/* Clickable timestamp chip */}
                    <button
                      onClick={() => onJumpToTimestamp?.(item.timestampSeconds)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-thermal-high/15 hover:bg-thermal-high text-thermal-high hover:text-white font-mono font-bold text-xs transition-colors cursor-pointer"
                      title="Ver error en el reproductor de video"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>[{item.timestampDisplay}]</span>
                    </button>
                  </div>

                  <h4 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {item.diagnostic}
                  </p>
                </div>

                {/* Root Cause Diagnostic Box */}
                <div className="p-2.5 rounded-xs bg-black/40 border border-thermal-high/25 flex flex-col gap-1">
                  <span className="text-[10px] font-display uppercase tracking-wider text-thermal-mid-3 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-thermal-high" /> Causa Raíz Detectada:
                  </span>
                  <span className="text-[11px] text-slate-200 font-sans font-medium">
                    {item.rootCause}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 3: Ejercicios Recomendados (DrillCard) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-telemetry-cyan/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xs bg-telemetry-cyan/15 text-telemetry-cyan border border-telemetry-cyan/30">
                <Dumbbell className="w-4 h-4" />
              </div>
              <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-white">
                Plan de Mejora <span className="text-telemetry-cyan">(Drills)</span>
              </h3>
            </div>
            <span className="text-[10px] font-mono text-telemetry-cyan bg-telemetry-cyan/10 px-2 py-0.5 rounded-xs border border-telemetry-cyan/20">
              {drills.length} SESIONES
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {drills.map((drill) => (
              <DrillCard key={drill.id} drill={drill} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
