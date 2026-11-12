import React from 'react';
import { RecommendedDrill } from '@/types/analysis';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, Dumbbell, Target, CheckSquare, Layers } from 'lucide-react';

export interface DrillCardProps {
  drill: RecommendedDrill;
  className?: string;
}

export function DrillCard({ drill, className }: DrillCardProps) {
  return (
    <Card
      cornerAccents
      variant="default"
      className={`p-4 flex flex-col justify-between gap-4 border-l-4 border-l-volt ${className}`}
    >
      {/* Header: Title + Intensity + Duration */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant={drill.intensity === 'Alta' ? 'volt' : 'cyan'}
            size="sm"
          >
            Intensidad {drill.intensity}
          </Badge>

          <span className="flex items-center gap-1 font-mono text-xs text-slate-300 font-bold bg-stadium-elevated px-2 py-0.5 rounded-xs border border-white/5">
            <Clock className="w-3 h-3 text-volt" />
            {drill.durationMinutes} min
          </span>
        </div>

        <h3 className="font-display font-extrabold text-base md:text-lg uppercase tracking-tight text-white leading-snug">
          {drill.name}
        </h3>

        {/* Target skill & Objective */}
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-start gap-1.5 text-slate-300">
            <Target className="w-3.5 h-3.5 text-volt shrink-0 mt-0.5" />
            <span>
              <strong className="text-white font-display uppercase tracking-wide">Habilidad:</strong>{' '}
              {drill.targetSkill}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-sans italic bg-white/[0.02] p-2 rounded-xs border border-white/5">
            &ldquo;{drill.objective}&rdquo;
          </p>
        </div>
      </div>

      {/* Step by Step Instructions */}
      <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
        <span className="text-[10px] font-display uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1">
          <CheckSquare className="w-3 h-3 text-telemetry-cyan" />
          Ejecución Paso a Paso:
        </span>

        <div className="space-y-1.5">
          {drill.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <span className="font-mono text-[10px] font-bold text-volt px-1.5 py-0.2 rounded-xs bg-volt/10 shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <span className="font-sans text-[11px] leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Badges */}
      {drill.equipment && drill.equipment.length > 0 && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/5 flex-wrap">
          <span className="text-[9px] font-display uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Layers className="w-2.5 h-2.5" /> Material:
          </span>
          {drill.equipment.map((item, idx) => (
            <span
              key={idx}
              className="text-[10px] px-1.5 py-0.5 rounded-xs bg-stadium-elevated text-slate-300 font-sans border border-white/5"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
