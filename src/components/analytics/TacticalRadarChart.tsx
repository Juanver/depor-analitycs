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
import { RadarMetrics } from '@/types/analysis';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Activity } from 'lucide-react';

export interface TacticalRadarChartProps {
  metrics: RadarMetrics;
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
      <div className="p-2.5 rounded-md bg-stadium-elevated border border-stadium-border text-white shadow-xl text-xs font-mono">
        <div className="font-display uppercase tracking-wider text-volt font-bold text-sm">
          {data.subject}
        </div>
        <div className="flex items-center justify-between gap-4 mt-1">
          <span className="text-slate-400">Score Jugador:</span>
          <span className="font-bold text-white">{data.value} / 100</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">Promedio Liga:</span>
          <span className="text-slate-400">{data.benchmark} / 100</span>
        </div>
      </div>
    );
  }
  return null;
};

export function TacticalRadarChart({ metrics, className }: TacticalRadarChartProps) {
  const chartData = [
    { subject: 'Defensa', value: metrics.defense, benchmark: 65, fullMark: 100 },
    { subject: 'Distribución', value: metrics.distribution, benchmark: 72, fullMark: 100 },
    { subject: 'Táctica', value: metrics.tacticalSense, benchmark: 70, fullMark: 100 },
    { subject: 'Intensidad Física', value: metrics.physicalIntensity, benchmark: 74, fullMark: 100 },
    { subject: 'Aporte Ofensivo', value: metrics.offensiveImpact, benchmark: 68, fullMark: 100 },
  ];

  return (
    <Card className={className} variant="default">
      <div className="p-5 flex flex-col h-full">
        <SectionHeader
          tag="RADAR DE 5 EJES"
          title="Perfil Biomecánico & Táctico"
          subtitle="Comparativa de percentiles vs estándar de la competencia"
          icon={<Activity className="w-5 h-5 text-volt" />}
          variant="volt"
        />

        <div className="w-full h-[280px] sm:h-[320px] relative mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              {/* Radar Polar Grid */}
              <PolarGrid stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />

              {/* Angle Axis (5 Dimensions) */}
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: '#94A3B8',
                  fontSize: 11,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              />

              {/* Radius Axis (0 to 100 scale) */}
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Benchmark Radar (Ghosted background) */}
              <Radar
                name="Promedio Liga"
                dataKey="benchmark"
                stroke="rgba(255, 255, 255, 0.25)"
                fill="rgba(255, 255, 255, 0.05)"
                fillOpacity={0.2}
              />

              {/* Player Radar (Volt Glow) */}
              <Radar
                name="Jugador"
                dataKey="value"
                stroke="var(--color-volt)"
                strokeWidth={2.5}
                fill="var(--color-volt)"
                fillOpacity={0.28}
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Quick Legend */}
          <div className="flex items-center justify-center gap-6 mt-1 text-[11px] font-display uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-volt rounded-full shadow-volt-glow" />
              <span className="text-white font-bold">Rendimiento Jugador</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-white/30 rounded-full" />
              <span className="text-slate-400">Promedio Posicional</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
