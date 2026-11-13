'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Sparkles,
  Maximize,
  Minimize,
  Crosshair,
  Shield,
  Layers,
  Activity,
  Play,
} from 'lucide-react';
import {
  TeamBlockTacticalData,
  VisionHighlightPlay,
  VisionSeguimientoTactico,
} from '@/types/visionAnalysis';

export interface TeamSegmentTrackingCardProps {
  teamName: string;
  matchFormat?: string;
  blockData?: TeamBlockTacticalData;
  jugadasDestacadas?: VisionHighlightPlay[];
  seguimientoTactico?: VisionSeguimientoTactico;
  onSelectPlay?: (play: VisionHighlightPlay) => void;
  className?: string;
}

export function TeamSegmentTrackingCard({
  teamName,
  matchFormat = 'Fútbol 7',
  blockData,
  jugadasDestacadas = [],
  seguimientoTactico,
  onSelectPlay,
  className,
}: TeamSegmentTrackingCardProps) {
  const amplitud = blockData?.amplitud ?? 74;
  const profundidad = blockData?.profundidad ?? 48;
  const solidez = blockData?.radarBloque?.solidezDefensiva ?? 85;
  const compactacion = blockData?.radarBloque?.compactacion ?? 88;
  const nominalSys = blockData?.sistemaNominal ?? '1-2-3-1';
  const detectedSys = blockData?.sistemaDetectado ?? '1-3-2-1 Asimétrico';

  return (
    <Card variant="default" className={`p-4 flex flex-col gap-3.5 ${className || ''}`}>
      {/* Header: Team Collective Tracking Focus */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          {/* Team Crest */}
          <div className="w-9 h-9 rounded-md bg-stadium-elevated border border-telemetry-cyan/40 flex items-center justify-center shrink-0 shadow-cyan-glow">
            <Users className="w-5 h-5 text-telemetry-cyan" />
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-display uppercase tracking-widest text-volt font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-volt" />
                SEGUIMIENTO TÁCTICO DE BLOQUE
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-[10px] font-mono text-telemetry-cyan font-semibold">
                {matchFormat}
              </span>
            </div>
            <h3 className="font-display font-black text-sm uppercase tracking-wide text-white">
              {teamName}
            </h3>
          </div>
        </div>

        {/* Formation pill */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-xs bg-stadium-base border border-stadium-border text-[9px] font-mono text-slate-300 shrink-0">
          <Layers className="w-3 h-3 text-volt shrink-0" />
          <span>{nominalSys} → {detectedSys}</span>
        </div>
      </div>

      {/* Segment Performance Micro-KPIs for this Team */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 rounded-xs bg-stadium-elevated border border-white/5 flex flex-col">
          <span className="text-[8px] font-display uppercase tracking-wider text-slate-400">
            Acciones Clave
          </span>
          <span className="font-display font-black text-base text-white">
            {seguimientoTactico?.accionesClaveCount ?? (jugadasDestacadas.length || 4)}
          </span>
        </div>

        <div className="p-2 rounded-xs bg-stadium-elevated border border-white/5 flex flex-col">
          <span className="text-[8px] font-display uppercase tracking-wider text-telemetry-cyan">
            {seguimientoTactico ? 'Pases Éxito' : 'Amplitud'}
          </span>
          <span className="font-display font-black text-base text-telemetry-cyan">
            {seguimientoTactico ? `${seguimientoTactico.pasesExitoPct}%` : `${amplitud}%`}
          </span>
        </div>

        <div className="p-2 rounded-xs bg-stadium-elevated border border-white/5 flex flex-col">
          <span className="text-[8px] font-display uppercase tracking-wider text-emerald-400">
            {seguimientoTactico ? 'Duelos 1v1' : 'Profundidad'}
          </span>
          <span className="font-display font-black text-base text-emerald-400">
            {seguimientoTactico ? `${seguimientoTactico.duelos1v1Pct}%` : `${profundidad}%`}
          </span>
        </div>

        <div className="p-2 rounded-xs bg-stadium-elevated border border-white/5 flex flex-col">
          <span className="text-[8px] font-display uppercase tracking-wider text-volt">
            {seguimientoTactico ? 'Recuperaciones' : 'Solidez'}
          </span>
          <span className="font-display font-black text-base text-volt">
            {seguimientoTactico ? seguimientoTactico.cortesAnticipaciones : `${solidez}/100`}
          </span>
        </div>
      </div>

      {/* Narrative Synthesis */}
      <div className="p-2.5 rounded-xs bg-stadium-base/60 border border-white/5 text-xs text-slate-300 font-sans leading-relaxed">
        <span className="text-volt font-bold uppercase text-[10px] block mb-0.5">
          Diagnóstico de Bloque en Video:
        </span>
        {seguimientoTactico?.resumenCorto ||
          blockData?.comparativaNominalVsReal ||
          `El bloque colectivo de ${teamName} mantiene una ocupación territorial equilibrada con ${amplitud}% de amplitud y ${profundidad}% de profundidad entre líneas.`}
      </div>

      {/* Interactive Key Collective Events List */}
      <div className="flex flex-col gap-2 pt-1 border-t border-white/5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>JUGADAS COLECTIVAS DESTACADAS</span>
          <span className="text-volt font-bold">{jugadasDestacadas.length} Eventos</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {jugadasDestacadas.map((play) => (
            <div
              key={play.id}
              onClick={() => onSelectPlay?.(play)}
              className="p-2 rounded-xs bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between gap-2 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-mono text-volt text-[11px] font-bold bg-volt/10 group-hover:bg-volt group-hover:text-stadium-base px-1.5 py-0.5 rounded-xs transition-colors shrink-0">
                  [{play.timestampDisplay}]
                </span>
                <span className="text-xs text-slate-200 group-hover:text-white font-sans truncate">
                  {play.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {play.phase && (
                  <span className="text-[8px] px-1.5 py-0.2 rounded-xs font-mono uppercase bg-telemetry-cyan/15 text-telemetry-cyan border border-telemetry-cyan/30">
                    {play.phase}
                  </span>
                )}
                <Play className="w-3 h-3 text-slate-400 group-hover:text-volt transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
