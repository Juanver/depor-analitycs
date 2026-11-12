'use client';

import React from 'react';
import { PlayerScoutProfile, TimeSegment, TacticalEvent } from '@/types/analysis';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  Footprints,
  Shield,
  Share2,
  Swords,
  Crosshair,
} from 'lucide-react';

export interface PlayerSegmentTrackingCardProps {
  player: PlayerScoutProfile;
  segment: TimeSegment;
  onSelectEvent: (event: TacticalEvent) => void;
  className?: string;
}

export function PlayerSegmentTrackingCard({
  player,
  segment,
  onSelectEvent,
  className,
}: PlayerSegmentTrackingCardProps) {
  // Qualitative tactical summary tailored by segment for the tracked player
  const getSegmentNarrative = (segmentId: string) => {
    switch (segmentId) {
      case '0-10':
        return `Inicio dominante de ${player.name} en el fondo: bloqueó el remate a quemarropa de Jorge al [03:40], ejecutó el córner derecho cerrado al [02:02] y neutralizó la contra rival con barrida de líbero al [08:14].`;
      case '10-20':
        return `Fase de contención y temple. Tras el 1-0 encajado en transición al [11:51], ${player.name} reorganizó la última línea, aguantó la presión física del Tanque Jorge y aseguró la posesión aérea al [19:41].`;
      case '20-end':
        return `Cierre de partido de jerarquía. Condujo la salida limpia al [23:05] filtrando el pase que habilitó a El Parce para liquidar el triunfo 4-2 de Dibujitos FC.`;
      default:
        return `Despliegue integral de ${player.name}: pilar en la última línea con 10 intercepciones, 85% de duelos ganados, bloqueo heroico al [03:40] y ejecutor de pelota parada.`;
    }
  };

  return (
    <Card variant="default" className={`p-4 flex flex-col gap-3.5 ${className || ''}`}>
      {/* Header: Player Tracking Focus & Active Segment */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          {/* Dorsal Crest */}
          <div className="w-9 h-9 rounded-md bg-stadium-elevated border border-volt/40 flex items-center justify-center shrink-0 shadow-volt-glow">
            <span className="font-display font-black text-volt text-base">
              #{player.dorsal}
            </span>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-display uppercase tracking-widest text-volt font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-volt" />
                SEGUIMIENTO TÁCTICO
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-[10px] font-mono text-telemetry-cyan font-semibold">
                {segment.timeRange}
              </span>
            </div>
            <h3 className="font-display font-black text-sm uppercase tracking-wide text-white">
              {player.name}
            </h3>
          </div>
        </div>

        {/* Visual Kit Tracking Pill */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-xs bg-stadium-base border border-stadium-border text-[9px] font-display uppercase tracking-wider text-slate-300 shrink-0">
          <Footprints className="w-3 h-3 text-orange-400 shrink-0" />
          <span className="text-slate-400">Kit:</span>
          <span className="text-white font-bold">Zapatillas Naranja</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Camiseta Negra</span>
        </div>
      </div>

      {/* Segment Performance Micro-KPIs for this Player */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 rounded-xs bg-stadium-elevated border border-white/5 flex flex-col">
          <span className="text-[8px] font-display uppercase tracking-wider text-slate-400">
            Acciones Clave
          </span>
          <span className="font-display font-black text-base text-white">
            {segment.events.length}
          </span>
        </div>

        <div className="p-2 rounded-xs bg-stadium-elevated border border-white/5 flex flex-col">
          <span className="text-[8px] font-display uppercase tracking-wider text-telemetry-cyan">
            Pases Éxito
          </span>
          <span className="font-display font-black text-base text-telemetry-cyan">
            {segment.kpis.passAccuracy}%
          </span>
        </div>

        <div className="p-2 rounded-xs bg-stadium-elevated border border-white/5 flex flex-col">
          <span className="text-[8px] font-display uppercase tracking-wider text-volt">
            Duelos 1v1
          </span>
          <span className="font-display font-black text-base text-volt">
            {segment.kpis.duelsWonRate}%
          </span>
        </div>

        <div className="p-2 rounded-xs bg-stadium-elevated border border-white/5 flex flex-col">
          <span className="text-[8px] font-display uppercase tracking-wider text-emerald-400">
            Cortes / Anticip.
          </span>
          <span className="font-display font-black text-base text-emerald-400">
            {segment.kpis.interceptions + segment.kpis.recoveries}
          </span>
        </div>
      </div>

      {/* Segment Tactical Evaluation of the Player */}
      <div className="p-2.5 rounded-xs bg-white/[0.03] border-l-2 border-l-volt text-[11px] text-slate-200 font-sans leading-relaxed">
        {getSegmentNarrative(segment.id)}
      </div>

      {/* Actionable Verified Events of the Player in this Segment */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-display uppercase tracking-wider text-slate-400 font-bold">
          <span>Jugadas Reales en Video ({segment.events.length})</span>
          <span className="text-volt text-[9px] font-mono">Haz clic para ver jugada</span>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {segment.events.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              className="p-2 rounded-xs bg-stadium-elevated/70 hover:bg-stadium-elevated border border-white/5 hover:border-volt/40 flex flex-col gap-1 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1 font-mono text-volt group-hover:text-volt font-bold text-xs bg-volt/10 group-hover:bg-volt group-hover:text-stadium-base px-2 py-0.5 rounded-xs transition-colors shrink-0"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>[{ev.timestampDisplay}]</span>
                </button>

                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-xs font-display uppercase tracking-widest shrink-0 font-bold ${
                    ev.success
                      ? 'bg-volt/15 text-volt border border-volt/30'
                      : 'bg-thermal-high/15 text-thermal-high border border-thermal-high/30'
                  }`}
                >
                  {ev.success ? 'Completado' : 'Ajuste Táctico'}
                </span>
              </div>

              <span className="text-xs text-white font-display uppercase tracking-wide font-bold line-clamp-1 group-hover:text-volt transition-colors">
                {ev.title}
              </span>

              <p className="text-[10px] text-slate-400 font-sans leading-tight line-clamp-2">
                {ev.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
