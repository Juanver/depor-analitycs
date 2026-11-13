'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Shield,
  Layers,
  Crosshair,
  Compass,
  Trophy,
  Activity,
  Maximize,
  Minimize,
  Sparkles,
  Video as VideoIcon,
} from 'lucide-react';
import { TeamBlockTacticalData } from '@/types/visionAnalysis';

export interface TeamScoutCardProps {
  teamName: string;
  opponentTeam?: string;
  matchFormat?: string;
  blockData?: TeamBlockTacticalData;
  clothingDesc?: string;
  overallRating?: number;
  identidadJuego?: string;
  distanciaLabel?: string;
  trackedEntitiesCount?: number;
  isVision?: boolean;
  videoFileName?: string;
  localVideoUrl?: string | null;
  className?: string;
}

export function TeamScoutCard({
  teamName,
  opponentTeam = 'Rival',
  matchFormat = 'Fútbol 7',
  blockData,
  clothingDesc,
  overallRating = 8.6,
  identidadJuego,
  distanciaLabel,
  trackedEntitiesCount,
  isVision = true,
  videoFileName,
  localVideoUrl,
  className,
}: TeamScoutCardProps) {
  const [displayRating, setDisplayRating] = useState(0);

  useEffect(() => {
    let current = 0;
    const target = overallRating;
    const duration = 900;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayRating(target);
        clearInterval(timer);
      } else {
        setDisplayRating(Number(current.toFixed(1)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [overallRating]);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayRating / 10) * circumference;

  const nominalSys = blockData?.sistemaNominal || '1-2-3-1';
  const detectedSys = blockData?.sistemaDetectado || '1-3-2-1 Asimétrico';
  const amplitud = blockData?.amplitud ?? 74;
  const profundidad = blockData?.profundidad ?? 48;
  const centroidX = blockData?.centroideBloque?.x?.toFixed(1) ?? '46.5';
  const centroidY = blockData?.centroideBloque?.y?.toFixed(1) ?? '33.8';

  return (
    <Card cornerAccents className={`overflow-hidden ${className || ''}`} variant="default">
      <div className="relative p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-gradient-to-r from-stadium-surface via-stadium-elevated to-stadium-surface border border-volt/30 shadow-2xl">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -left-12 -top-12 w-48 h-48 bg-volt/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -right-12 -bottom-12 w-48 h-48 bg-telemetry-cyan/10 rounded-full blur-3xl" />

        {/* Left: Team Crest, Titles & Vision Badges */}
        <div className="flex items-center gap-4 z-10 flex-wrap sm:flex-nowrap">
          {/* Team Crest Icon */}
          <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-stadium-elevated to-stadium-base border border-volt/40 shadow-volt-glow shrink-0">
            <Users className="w-8 h-8 sm:w-9 sm:h-9 text-volt" />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              {isVision ? (
                <span className="text-[10px] font-mono font-bold text-stadium-base bg-volt px-2.5 py-0.5 rounded-xs flex items-center gap-1 shadow-volt-glow uppercase tracking-wider">
                  <Crosshair className="w-3 h-3 text-stadium-base" />
                  TRACKING ÓPTICO COLECTIVO (YOLOv8)
                </span>
              ) : (
                <Badge variant="volt" size="sm">
                  ANÁLISIS COLECTIVO
                </Badge>
              )}

              <span className="text-[10px] font-display uppercase tracking-wider font-bold px-2 py-0.5 rounded-xs bg-telemetry-cyan/15 text-telemetry-cyan border border-telemetry-cyan/30">
                {matchFormat}
              </span>

              {localVideoUrl && (
                <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-xs flex items-center gap-1">
                  <VideoIcon className="w-3 h-3 text-volt" />
                  {videoFileName || 'Video Local MP4'}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-white leading-none">
              {teamName}
              <span className="text-slate-400 font-normal text-lg sm:text-xl ml-2">
                vs {opponentTeam}
              </span>
            </h1>

            {/* Tactical System & Clothing description */}
            <div className="flex items-center gap-3 text-xs flex-wrap text-slate-300">
              <span className="flex items-center gap-1 font-mono font-bold text-white">
                <Layers className="w-3.5 h-3.5 text-telemetry-cyan" />
                Nominal: {nominalSys}
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1 font-mono font-bold text-volt">
                <Crosshair className="w-3.5 h-3.5 text-volt" />
                Detectado: {detectedSys}
              </span>

              {clothingDesc && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="text-[11px] font-sans text-slate-400 truncate max-w-xs">
                    Kit: {clothingDesc}
                  </span>
                </>
              )}
            </div>

            {identidadJuego && (
              <p className="text-xs font-sans text-slate-300/90 max-w-2xl leading-relaxed mt-0.5">
                {identidadJuego}
              </p>
            )}
          </div>
        </div>

        {/* Right: Collective Metrics & Rating */}
        <div className="flex items-center gap-4 self-end md:self-center z-10 shrink-0 flex-wrap">
          {/* Spatial stats pill */}
          <div className="hidden sm:flex flex-col gap-1 text-right bg-stadium-base/70 px-3.5 py-2 rounded-lg border border-stadium-border">
            <div className="flex items-center justify-end gap-2 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400">Amplitud:</span>
              <span className="font-mono text-volt font-bold">{amplitud}%</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400">Profundidad:</span>
              <span className="font-mono text-telemetry-cyan font-bold">{profundidad}%</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 font-mono">
              <span>Centroide: [{centroidX}, {centroidY}]</span>
            </div>
            {(distanciaLabel || trackedEntitiesCount) && (
              <div className="flex items-center justify-end gap-2 text-[10px] text-slate-300 font-mono border-t border-white/10 pt-1 mt-0.5">
                {distanciaLabel && <span>{distanciaLabel}</span>}
                {trackedEntitiesCount && <span>• {trackedEntitiesCount} det.</span>}
              </div>
            )}
          </div>

          {/* Radial Team Rating */}
          <div className="flex items-center gap-3 bg-stadium-base/80 px-4 py-2.5 rounded-xl border border-stadium-border">
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-display uppercase tracking-widest text-slate-400 font-bold">
                SCORE COLECTIVO
              </span>
              <span className="text-xs font-display uppercase tracking-wider font-extrabold text-volt">
                DESEMPEÑO TÁCTICO
              </span>
            </div>

            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  stroke="#A3E635"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-black text-base text-volt tracking-tight">
                  {displayRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
