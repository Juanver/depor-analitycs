'use client';

import React from 'react';
import { TeamCollectiveAnalysisData, TeamDrill } from '@/types/teamAnalysis';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, AlertTriangle, Users, Clock, Play, Dumbbell, Target, Layers } from 'lucide-react';

export interface TeamCoachFeedbackProps {
  strengths: TeamCollectiveAnalysisData['collectiveStrengths'];
  weaknesses: TeamCollectiveAnalysisData['collectiveWeaknesses'];
  drills: TeamDrill[];
  masterNotes?: string;
  onJumpToTimestamp?: (seconds: number) => void;
  className?: string;
}

export function TeamCoachFeedback({
  strengths,
  weaknesses,
  drills,
  masterNotes,
  onJumpToTimestamp,
  className,
}: TeamCoachFeedbackProps) {
  return (
    <div className={`flex flex-col gap-6 ${className || ''}`}>
      {/* Master Coach Notes */}
      {masterNotes && (
        <Card variant="default" className="p-4 border-l-4 border-l-telemetry-cyan bg-stadium-elevated/80">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-display uppercase tracking-widest text-telemetry-cyan font-bold">
              DICTAMEN METODOLÓGICO DEL DIRECTOR TÉCNICO IA
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
              {masterNotes}
            </p>
          </div>
        </Card>
      )}

      {/* 3 Columns: Fortalezas, Debilidades, Drills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Fortalezas Colectivas */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-volt/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xs bg-volt/15 text-volt border border-volt/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-white">
                Fortalezas <span className="text-volt">(Equipo)</span>
              </h3>
            </div>
            <span className="text-[10px] font-mono text-volt bg-volt/10 px-2 py-0.5 rounded-xs border border-volt/20">
              {strengths.length} PATRONES
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {strengths.map((item, idx) => (
              <Card
                key={idx}
                variant="default"
                className="p-4 border-l-2 border-l-volt hover:border-volt/60 transition-all flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-display uppercase tracking-widest text-volt font-bold">
                    {item.category}
                  </span>
                  <button
                    onClick={() => onJumpToTimestamp?.(item.timestampSeconds)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-volt/15 hover:bg-volt text-volt hover:text-stadium-base font-mono font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>[{item.timestampDisplay}]</span>
                  </button>
                </div>
                <h4 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 2: Debilidades y Desajustes Colectivos */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-thermal-high/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xs bg-thermal-high/15 text-thermal-high border border-thermal-high/30">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-white">
                Vulnerabilidades <span className="text-thermal-high">(Corregir)</span>
              </h3>
            </div>
            <span className="text-[10px] font-mono text-thermal-high bg-thermal-high/10 px-2 py-0.5 rounded-xs border border-thermal-high/20">
              {weaknesses.length} ALERTAS
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {weaknesses.map((item, idx) => (
              <Card
                key={idx}
                variant="default"
                className="p-4 border-l-2 border-l-thermal-high hover:border-thermal-high/60 transition-all flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-display uppercase tracking-widest text-thermal-high font-bold px-1.5 py-0.5 rounded-xs bg-thermal-high/10 border border-thermal-high/20">
                    {item.severity.toUpperCase()}
                  </span>
                  <button
                    onClick={() => onJumpToTimestamp?.(item.timestampSeconds)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-thermal-high/15 hover:bg-thermal-high text-thermal-high hover:text-white font-mono font-bold text-xs transition-colors cursor-pointer"
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
                <div className="p-2 rounded-xs bg-white/[0.02] border border-white/5 text-[11px] text-slate-400">
                  <strong className="text-slate-300 font-display uppercase">Causa Raíz Colectiva:</strong> {item.rootCause}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 3: Drills de Entrenamiento de Equipo */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-telemetry-cyan/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xs bg-telemetry-cyan/15 text-telemetry-cyan border border-telemetry-cyan/30">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-white">
                Drills <span className="text-telemetry-cyan">(Grupales)</span>
              </h3>
            </div>
            <span className="text-[10px] font-mono text-telemetry-cyan bg-telemetry-cyan/10 px-2 py-0.5 rounded-xs border border-telemetry-cyan/20">
              {drills.length} SESIONES
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {drills.map((drill) => (
              <Card
                key={drill.id}
                variant="default"
                className="p-4 border-l-2 border-l-telemetry-cyan flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="cyan" size="sm">
                    {drill.targetPhase}
                  </Badge>
                  <span className="flex items-center gap-1 font-mono text-xs text-slate-300 font-bold bg-stadium-elevated px-2 py-0.5 rounded-xs">
                    <Clock className="w-3 h-3 text-telemetry-cyan" />
                    {drill.durationMinutes} min
                  </span>
                </div>

                <h4 className="font-display font-extrabold text-base uppercase tracking-tight text-white">
                  {drill.name}
                </h4>

                <p className="text-xs text-slate-400 font-sans italic">
                  &ldquo;{drill.objective}&rdquo;
                </p>

                <div className="space-y-1 text-xs text-slate-300 pt-1 border-t border-white/5">
                  <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 font-bold">
                    Instrucciones Clave:
                  </span>
                  {drill.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-telemetry-cyan font-bold font-mono">0{i + 1}.</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
