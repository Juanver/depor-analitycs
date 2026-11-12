'use client';

import React from 'react';
import { TeamCollectiveAnalysisData } from '@/types/teamAnalysis';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, AlertTriangle, Shield, Zap, ArrowRight, Activity } from 'lucide-react';

export interface TeamPhasesPanelProps {
  phases: TeamCollectiveAnalysisData['phasesAnalysis'];
  className?: string;
}

export function TeamPhasesPanel({ phases, className }: TeamPhasesPanelProps) {
  const phaseList = [
    { key: 'iniciacion', data: phases.iniciacion, icon: <ArrowRight className="w-4 h-4 text-telemetry-cyan" /> },
    { key: 'progresion', data: phases.progresion, icon: <Zap className="w-4 h-4 text-volt" /> },
    { key: 'bloqueDefensivo', data: phases.bloqueDefensivo, icon: <Shield className="w-4 h-4 text-emerald-400" /> },
    { key: 'transiciones', data: phases.transiciones, icon: <Activity className="w-4 h-4 text-orange-400" /> },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className || ''}`}>
      {phaseList.map(({ key, data, icon }) => (
        <Card key={key} variant="default" className="p-4 flex flex-col justify-between gap-3 border-l-4 border-l-volt">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xs bg-white/5 border border-white/10 shrink-0">
                {icon}
              </div>
              <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-white">
                {data.phaseName}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-volt font-bold text-sm">
                {data.effectivenessRate}%
              </span>
              <span className="text-[9px] font-display uppercase tracking-widest px-2 py-0.5 rounded-xs bg-volt/15 text-volt font-bold border border-volt/30">
                {data.rating}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {data.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
            {/* Fortalezas */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-display uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Puntos Fuertes:
              </span>
              <ul className="space-y-1 text-slate-300">
                {data.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-volt font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vulnerabilidades */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-display uppercase tracking-wider text-thermal-high font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Vulnerabilidades:
              </span>
              <ul className="space-y-1 text-slate-400">
                {data.vulnerabilities.map((v, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-thermal-high font-bold">•</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
