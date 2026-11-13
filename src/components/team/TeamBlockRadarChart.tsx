'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { TeamBlockRadarMetrics } from '@/types/visionAnalysis';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ShieldAlert, Activity } from 'lucide-react';

export interface TeamBlockRadarChartProps {
  metrics: TeamBlockRadarMetrics;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      subject: string;
      value: number;
      benchmark: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2.5 rounded-md bg-stadium-elevated border border-stadium-border text-white shadow-xl backdrop-blur-md text-xs font-mono">
        <div className="font-display uppercase tracking-wider text-volt font-bold text-sm">
          {data.subject}
        </div>
        <div className="flex items-center justify-between gap-4 mt-1">
          <span className="text-slate-400">Score Bloque:</span>
          <span className="font-bold text-volt">{data.value} / 100</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">Benchmark Táctico:</span>
          <span className="text-slate-400">{data.benchmark} / 100</span>
        </div>
      </div>
    );
  }
  return null;
};

export function TeamBlockRadarChart({ metrics, className }: TeamBlockRadarChartProps) {
  const chartData = [
    { subject: 'Solidez Defensiva', value: metrics.solidezDefensiva, benchmark: 72, fullMark: 100 },
    { subject: 'Presión tras Pérdida', value: metrics.presionTrasPerdida, benchmark: 70, fullMark: 100 },
    { subject: 'Amplitud de Bandas', value: metrics.amplitudBandas, benchmark: 68, fullMark: 100 },
    { subject: 'Transición Ofensiva', value: metrics.transicionOfensiva, benchmark: 75, fullMark: 100 },
    { subject: 'Compactación', value: metrics.compactacion, benchmark: 74, fullMark: 100 },
  ];

  return (
    <Card className={className} variant="default">
      <div className="p-5 flex flex-col h-full">
        <SectionHeader
          tag="RADAR TÁCTICO DE BLOQUE (5 EJES)"
          title="Métricas Estructurales de Equipo"
          subtitle="Evaluación de compactación, solidez y amplitud espacial"
          icon={<Activity className="w-5 h-5 text-volt" />}
          variant="volt"
        />

        <div className="w-full h-[280px] sm:h-[320px] relative mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />

              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: '#94A3B8',
                  fontSize: 10,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              />

              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Benchmark colectivo */}
              <Radar
                name="Promedio de Competencia"
                dataKey="benchmark"
                stroke="rgba(148, 163, 184, 0.4)"
                fill="#64748B"
                fillOpacity={0.15}
                strokeWidth={1}
                strokeDasharray="4 4"
              />

              {/* Score del Bloque */}
              <Radar
                name="Métricas de Bloque"
                dataKey="value"
                stroke="#A3E635"
                fill="#A3E635"
                fillOpacity={0.35}
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: '#070B0E',
                  stroke: '#A3E635',
                  strokeWidth: 2,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-2 pt-3 border-t border-stadium-border text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-volt shadow-volt-glow" />
            <span className="text-white font-bold">Bloque Analizado (YOLOv8)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
            <span className="text-slate-400">Benchmark Élite (72 pts)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
