'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TeamBlockTacticalData } from '@/types/visionAnalysis';
import { TeamBlockRadarChart } from '@/components/team/TeamBlockRadarChart';
import {
  Compass,
  Layers,
  Shield,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Dumbbell,
  Clock,
  Sparkles,
  Maximize,
  Minimize,
  Crosshair,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export interface TeamBlockTacticalCardProps {
  blockData: TeamBlockTacticalData;
  teamName: string;
  gameFormat?: string;
  onJumpToTimestamp?: (seconds: number) => void;
  className?: string;
}

export function TeamBlockTacticalCard({
  blockData,
  teamName,
  gameFormat = 'Fútbol 7',
  onJumpToTimestamp,
  className,
}: TeamBlockTacticalCardProps) {
  return (
    <div className={`flex flex-col gap-6 ${className || ''}`}>
      {/* 1. ESTRUCTURA Y COMPARATIVA DEL BLOQUE (Nominal vs Detectado) */}
      <Card cornerAccents variant="default" className="p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stadium-border pb-4">
            <SectionHeader
              tag="SISTEMA TÁCTICO & METRÍA DE BLOQUE"
              title={`Estructura Colectiva: ${teamName}`}
              subtitle="Comparativa de formación nominal vs distribución real detectada por YOLOv8"
              icon={<Compass className="w-5 h-5 text-volt" />}
              variant="volt"
            />

            <Badge variant="volt" size="sm" pulse>
              TRACKING ÓPTICO COLECTIVO
            </Badge>
          </div>

          {/* Comparativa Visual de Sistemas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sistema Nominal */}
            <div className="p-4 rounded-md bg-stadium-elevated border border-stadium-border flex flex-col gap-2">
              <span className="text-[10px] font-display uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                SISTEMA NOMINAL TEÓRICO
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-black text-white tracking-tight">
                  {blockData.sistemaNominal}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ({gameFormat})
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Formación declarada para el inicio del encuentro en fase estática.
              </p>
            </div>

            {/* Sistema Detectado */}
            <div className="p-4 rounded-md bg-volt/10 border border-volt/30 flex flex-col gap-2">
              <span className="text-[10px] font-display uppercase tracking-widest text-volt font-bold flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-volt" />
                SISTEMA REAL DETECTADO (AI + YOLOV8)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-black text-volt tracking-tight text-glow-volt">
                  {blockData.sistemaDetectado}
                </span>
                <span className="text-xs font-mono text-volt/80">
                  Detección Dinámica
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Mutación geométrica observada según la basculación y altura del bloque.
              </p>
            </div>
          </div>

          {/* Comparativa Nominal vs Real Texto */}
          <div className="p-4 rounded-md bg-stadium-elevated/70 border border-white/5 flex flex-col gap-2">
            <span className="text-xs font-display uppercase tracking-wider font-bold text-telemetry-cyan flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Comparativa Nominal vs Real
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
              {blockData.comparativaNominalVsReal}
            </p>
          </div>

          {/* Metría Espacial: Centroide, Amplitud y Profundidad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Centroide */}
            <div className="p-4 rounded-md bg-stadium-surface border border-stadium-border flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-display uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1">
                  <Crosshair className="w-3.5 h-3.5 text-volt" />
                  Centroide del Bloque
                </span>
                <span className="text-[10px] font-mono text-slate-400">(X, Y)</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-mono font-black text-white">
                  [{blockData.centroideBloque.x.toFixed(1)}, {blockData.centroideBloque.y.toFixed(1)}]
                </span>
                <span className="text-xs font-mono text-slate-500">m</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Punto baricéntrico promedio de los jugadores de campo en posesión.
              </p>
            </div>

            {/* Amplitud */}
            <div className="p-4 rounded-md bg-stadium-surface border border-stadium-border flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-display uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1">
                  <Maximize className="w-3.5 h-3.5 text-telemetry-cyan" />
                  Amplitud de Bloque
                </span>
                <span className="font-mono text-telemetry-cyan font-bold">{blockData.amplitud}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stadium-elevated overflow-hidden border border-white/5 my-2">
                <div
                  className="h-full bg-telemetry-cyan shadow-cyan-glow"
                  style={{ width: `${blockData.amplitud}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Porcentaje del ancho de cancha ocupado por los jugadores exteriores.
              </p>
            </div>

            {/* Profundidad */}
            <div className="p-4 rounded-md bg-stadium-surface border border-stadium-border flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-display uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1">
                  <Minimize className="w-3.5 h-3.5 text-emerald-400" />
                  Profundidad de Bloque
                </span>
                <span className="font-mono text-emerald-400 font-bold">{blockData.profundidad}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stadium-elevated overflow-hidden border border-white/5 my-2">
                <div
                  className="h-full bg-emerald-400 shadow-volt-glow"
                  style={{ width: `${blockData.profundidad}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Distancia longitudinal promedio entre la línea defensiva y atacantes.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. RADAR DE BLOQUE DE 5 EJES */}
      <TeamBlockRadarChart metrics={blockData.radarBloque} />

      {/* 3. FORTALEZAS COLECTIVAS, DEBILIDADES Y AJUSTES DE ENTRENAMIENTO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tarjeta de Fortalezas Colectivas */}
        <Card variant="default" className="p-5 flex flex-col gap-4 border-t-2 border-t-volt">
          <div className="flex items-center justify-between border-b border-stadium-border pb-3">
            <span className="font-display uppercase tracking-wider font-extrabold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-volt" />
              Fortalezas Colectivas
            </span>
            <span className="text-xs font-mono text-volt bg-volt/10 px-2 py-0.5 rounded-xs">
              {blockData.fortalezasColectivas.length} Pilares
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {blockData.fortalezasColectivas.map((f, idx) => (
              <div
                key={idx}
                className="p-3 rounded-md bg-stadium-elevated/80 border border-white/5 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-display uppercase tracking-wide font-bold text-white">
                    {f.title}
                  </h4>
                  {f.timestampSeconds !== undefined && onJumpToTimestamp && (
                    <button
                      type="button"
                      onClick={() => onJumpToTimestamp(f.timestampSeconds!)}
                      className="text-[10px] font-mono font-bold text-volt bg-volt/15 hover:bg-volt hover:text-stadium-base px-2 py-0.5 rounded-xs transition-colors cursor-pointer"
                      title="Ver jugada en video"
                    >
                      [{f.timestampDisplay || '00:00'}]
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Tarjeta de Debilidades Colectivas */}
        <Card variant="default" className="p-5 flex flex-col gap-4 border-t-2 border-t-rose-500">
          <div className="flex items-center justify-between border-b border-stadium-border pb-3">
            <span className="font-display uppercase tracking-wider font-extrabold text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Debilidades Colectivas
            </span>
            <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-xs">
              {blockData.debilidadesColectivas.length} Desajustes
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {blockData.debilidadesColectivas.map((d, idx) => (
              <div
                key={idx}
                className="p-3 rounded-md bg-stadium-elevated/80 border border-white/5 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-display uppercase tracking-wide font-bold text-white">
                    {d.title}
                  </h4>
                  {d.timestampSeconds !== undefined && onJumpToTimestamp && (
                    <button
                      type="button"
                      onClick={() => onJumpToTimestamp(d.timestampSeconds!)}
                      className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/15 hover:bg-rose-500 hover:text-white px-2 py-0.5 rounded-xs transition-colors cursor-pointer"
                      title="Ver desajuste en video"
                    >
                      [{d.timestampDisplay || '00:00'}]
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {d.diagnostic}
                </p>
                {d.rootCause && (
                  <div className="mt-1 pt-1.5 border-t border-white/5 text-[11px] font-mono text-rose-300/80">
                    <span className="text-slate-400">Causa Raíz:</span> {d.rootCause}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Tarjeta de Ajustes de Entrenamiento de Equipo */}
        <Card variant="default" className="p-5 flex flex-col gap-4 border-t-2 border-t-telemetry-cyan">
          <div className="flex items-center justify-between border-b border-stadium-border pb-3">
            <span className="font-display uppercase tracking-wider font-extrabold text-white text-sm flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-telemetry-cyan" />
              Ajustes de Entrenamiento
            </span>
            <span className="text-xs font-mono text-telemetry-cyan bg-telemetry-cyan/10 px-2 py-0.5 rounded-xs">
              Prescripción Táctica
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {blockData.ajustesEntrenamientoEquipo.map((adj, idx) => (
              <div
                key={idx}
                className="p-3 rounded-md bg-stadium-elevated/80 border border-white/5 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-display uppercase tracking-wide font-bold text-white">
                    {adj.name}
                  </h4>
                  <span className="text-[10px] font-mono text-telemetry-cyan">
                    {adj.durationMinutes} min • {adj.intensity}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans">
                  {adj.objective}
                </p>

                <div className="space-y-1 mt-1 pt-1.5 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Pautas Clave:
                  </span>
                  {adj.steps.map((st, sIdx) => (
                    <div key={sIdx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <span className="text-telemetry-cyan font-bold">•</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
