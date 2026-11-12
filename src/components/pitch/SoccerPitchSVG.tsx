'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { ArrowRight, Shield, Target, Compass } from 'lucide-react';

export interface SoccerPitchSVGProps {
  className?: string;
  showAttackDirection?: boolean;
  attackDirectionText?: string;
  teamName?: string;
  opponentTeamName?: string;
  matchFormat?: string;
  children?: React.ReactNode;
}

/**
 * 2D Overhead Football Pitch rendered to standard FIFA proportions (100m length x 68m width).
 * Features high-contrast tactical telemetry lines, alternating mowing lawn bands,
 * and unmistakably distinct broadcast markings for ARCO PROPIO vs ARCO RIVAL.
 */
export function SoccerPitchSVG({
  className,
  showAttackDirection = true,
  attackDirectionText = 'DIRECCIÓN DE ATAQUE',
  teamName = 'DIBUJITOS FC',
  opponentTeamName = 'RIVAL',
  matchFormat,
  children,
}: SoccerPitchSVGProps) {
  // 10 mowing lawn stripes across length (100 units / 10 = 10 units each)
  const stripes = Array.from({ length: 10 }, (_, i) => i * 10);

  return (
    <div
      className={cn(
        'relative w-full aspect-[100/68] select-none overflow-hidden rounded-lg border border-stadium-border shadow-stadium flex flex-col bg-[#081C15]',
        className
      )}
    >
      {/* Top Broadcast HUD Telemetry Bar */}
      <div className="absolute top-2 inset-x-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left Indicator: ARCO PROPIO (DEFENSA) */}
        <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-stadium-base/90 border border-telemetry-cyan/50 text-telemetry-cyan shadow-cyan-glow backdrop-blur-md">
          <Shield className="w-3.5 h-3.5 text-telemetry-cyan fill-telemetry-cyan/20 shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="text-[9px] font-display uppercase tracking-widest font-black">
              ARCO PROPIO
            </span>
            <span className="text-[8px] font-mono text-slate-300">
              {teamName}
            </span>
          </div>
        </div>

        {/* Center: ATTACK DIRECTION & MATCH FORMAT */}
        <div className="hidden sm:flex items-center gap-2">
          {matchFormat && (
            <div className="px-2 py-1 rounded-xs bg-telemetry-cyan/15 border border-telemetry-cyan/40 text-[9px] font-display uppercase tracking-widest text-telemetry-cyan font-bold backdrop-blur-md">
              {matchFormat}
            </div>
          )}
          {showAttackDirection && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xs bg-stadium-base/85 border border-volt/40 text-[10px] font-display uppercase tracking-widest text-volt shadow-volt-glow backdrop-blur-md">
              <span>{attackDirectionText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-volt animate-pulse" />
            </div>
          )}
        </div>

        {/* Right Indicator: ARCO RIVAL (OBJETIVO) */}
        <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-stadium-base/90 border border-volt/60 text-volt shadow-volt-glow backdrop-blur-md">
          <div className="flex flex-col text-right leading-none">
            <span className="text-[9px] font-display uppercase tracking-widest font-black">
              ARCO RIVAL
            </span>
            <span className="text-[8px] font-mono text-slate-300">
              {opponentTeamName}
            </span>
          </div>
          <Target className="w-3.5 h-3.5 text-volt fill-volt/20 shrink-0 animate-pulse" />
        </div>
      </div>

      {/* SVG Canvas (100x68 Pitch) */}
      <svg
        viewBox="0 0 100 68"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Pitch background clipping */}
          <clipPath id="pitch-clip">
            <rect x="0" y="0" width="100" height="68" rx="1.5" />
          </clipPath>

          {/* Tactical grid overlay pattern */}
          <pattern id="tactical-mesh" width="10" height="6.8" patternUnits="userSpaceOnUse">
            <rect width="10" height="6.8" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.15" />
          </pattern>

          {/* Goal Net Hexagonal Pattern */}
          <pattern id="goal-net" width="0.8" height="0.8" patternUnits="userSpaceOnUse">
            <path d="M 0 0.8 L 0.8 0 M 0 0 L 0.8 0.8" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.1" />
          </pattern>
        </defs>

        <g clipPath="url(#pitch-clip)">
          {/* Alternating Grass Mowing Bands (#0A1F16 / #0D261B) */}
          {stripes.map((stripeX, idx) => (
            <rect
              key={`stripe-${idx}`}
              x={stripeX}
              y="0"
              width="10"
              height="68"
              fill={idx % 2 === 0 ? 'var(--color-pitch-dark)' : 'var(--color-pitch-light)'}
            />
          ))}

          {/* Subtle grid mesh */}
          <rect x="0" y="0" width="100" height="68" fill="url(#tactical-mesh)" />

          {/* Half-pitch Background Ambient Tints */}
          {/* Defensive Half (Cyan Tint) */}
          <rect x="2" y="2" width="48" height="64" fill="rgba(34, 211, 238, 0.015)" />
          {/* Offensive Half (Volt Tint) */}
          <rect x="50" y="2" width="48" height="64" fill="rgba(163, 230, 53, 0.025)" />

          {/* Tactical Pitch Markings (Crisp white lines with slight glow) */}
          <g
            stroke="var(--color-pitch-line)"
            strokeWidth="0.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer Boundary */}
            <rect x="2" y="2" width="96" height="64" />

            {/* Halfway Line */}
            <line x1="50" y1="2" x2="50" y2="66" />

            {/* Center Circle (Radius ~9.15m in 100x68 scale) */}
            <circle cx="50" cy="34" r="9.15" />

            {/* Center Spot */}
            <circle cx="50" cy="34" r="0.6" fill="var(--color-pitch-line)" />

            {/* Left Penalty Area (16.5m deep, 40.3m wide centered: y from 13.85 to 54.15) */}
            <rect x="2" y="13.85" width="16.5" height="40.3" />

            {/* Left Goal Area (5.5m deep, 18.32m wide centered: y from 24.84 to 43.16) */}
            <rect x="2" y="24.84" width="5.5" height="18.32" />

            {/* Left Penalty Spot (11m from goal line) */}
            <circle cx="13" cy="34" r="0.6" fill="var(--color-pitch-line)" />

            {/* Left Penalty Arc */}
            <path d="M 18.5 27.5 A 9.15 9.15 0 0 1 18.5 40.5" />

            {/* Right Penalty Area */}
            <rect x="81.5" y="13.85" width="16.5" height="40.3" />

            {/* Right Goal Area */}
            <rect x="92.5" y="24.84" width="5.5" height="18.32" />

            {/* Right Penalty Spot */}
            <circle cx="87" cy="34" r="0.6" fill="var(--color-pitch-line)" />

            {/* Right Penalty Arc */}
            <path d="M 81.5 27.5 A 9.15 9.15 0 0 0 81.5 40.5" />

            {/* Corner Arcs (1m radius) */}
            <path d="M 3 2 A 1 1 0 0 1 2 3" />
            <path d="M 2 65 A 1 1 0 0 1 3 66" />
            <path d="M 97 2 A 1 1 0 0 0 98 3" />
            <path d="M 98 65 A 1 1 0 0 0 97 66" />
          </g>

          {/* ============================================================== */}
          {/* HIGH IMPACT VISUAL MARKINGS: ARCO PROPIO vs ARCO RIVAL         */}
          {/* ============================================================== */}

          {/* Tactical Attack Vector Corridor (ARCO PROPIO -> DIRECCIÓN DE ATAQUE -> ARCO RIVAL) */}
          <g id="tactical-vector-corridor" opacity="0.65">
            {/* Subtle dashed arrow along central corridor */}
            <line
              x1="24"
              y1="5"
              x2="76"
              y2="5"
              stroke="rgba(163, 230, 53, 0.45)"
              strokeWidth="0.35"
              strokeDasharray="1.5 1.5"
            />
            <polygon
              points="76,4.2 78.5,5 76,5.8"
              fill="rgba(163, 230, 53, 0.75)"
            />
            <text
              x="50"
              y="5.3"
              fill="rgba(163, 230, 53, 0.75)"
              fontFamily="var(--font-display)"
              fontSize="1.3"
              fontWeight="800"
              textAnchor="middle"
              letterSpacing="0.1em"
            >
              DIRECCIÓN DE ATAQUE ►
            </text>
          </g>

          {/* LEFT GOAL: ARCO PROPIO (Cyan / Defensive Shield) */}
          <g id="left-goal-telemetry">
            {/* Goal Net fill with cyan glow */}
            <rect
              x="0.2"
              y="29.5"
              width="2"
              height="9"
              fill="url(#goal-net)"
              stroke="#22D3EE"
              strokeWidth="0.5"
            />
            <rect
              x="0.2"
              y="29.5"
              width="2"
              height="9"
              fill="rgba(34, 211, 238, 0.25)"
            />

            {/* Goal Line Glow Accent */}
            <line x1="2" y1="29.5" x2="2" y2="38.5" stroke="#22D3EE" strokeWidth="0.9" />

            {/* Pitch Grass Inscriptions (Large Tactical Watermark) */}
            <text
              x="8.5"
              y="32.5"
              fill="rgba(34, 211, 238, 0.55)"
              fontFamily="var(--font-display)"
              fontSize="2.4"
              fontWeight="900"
              textAnchor="middle"
              letterSpacing="0.08em"
            >
              🛡️ ARCO PROPIO
            </text>
            <text
              x="8.5"
              y="35.5"
              fill="rgba(255, 255, 255, 0.4)"
              fontFamily="var(--font-display)"
              fontSize="1.6"
              fontWeight="700"
              textAnchor="middle"
              letterSpacing="0.05em"
            >
              {teamName.toUpperCase()}
            </text>
            <text
              x="8.5"
              y="38"
              fill="rgba(34, 211, 238, 0.35)"
              fontFamily="var(--font-mono)"
              fontSize="1.2"
              textAnchor="middle"
            >
              [ZONA DEFENSIVA]
            </text>
          </g>

          {/* RIGHT GOAL: ARCO RIVAL (Volt / Offensive Target) */}
          <g id="right-goal-telemetry">
            {/* Goal Net fill with Volt glow */}
            <rect
              x="97.8"
              y="29.5"
              width="2"
              height="9"
              fill="url(#goal-net)"
              stroke="#A3E635"
              strokeWidth="0.5"
            />
            <rect
              x="97.8"
              y="29.5"
              width="2"
              height="9"
              fill="rgba(163, 230, 53, 0.35)"
            />

            {/* Goal Line Glow Accent */}
            <line x1="98" y1="29.5" x2="98" y2="38.5" stroke="#A3E635" strokeWidth="0.9" />

            {/* Target Reticle concentric pulses right in front of the goal */}
            <circle cx="95" cy="34" r="2.4" fill="none" stroke="rgba(163, 230, 53, 0.25)" strokeWidth="0.25" strokeDasharray="0.8 0.8" />
            <circle cx="95" cy="34" r="1.2" fill="none" stroke="rgba(163, 230, 53, 0.4)" strokeWidth="0.2" />

            {/* Pitch Grass Inscriptions (Large Tactical Watermark) */}
            <text
              x="91.5"
              y="32.5"
              fill="rgba(163, 230, 53, 0.85)"
              fontFamily="var(--font-display)"
              fontSize="2.4"
              fontWeight="900"
              textAnchor="middle"
              letterSpacing="0.08em"
            >
              🎯 ARCO RIVAL
            </text>
            <text
              x="91.5"
              y="35.5"
              fill="rgba(255, 255, 255, 0.6)"
              fontFamily="var(--font-display)"
              fontSize="1.6"
              fontWeight="700"
              textAnchor="middle"
              letterSpacing="0.05em"
            >
              {opponentTeamName.toUpperCase()}
            </text>
            <text
              x="91.5"
              y="38"
              fill="rgba(163, 230, 53, 0.6)"
              fontFamily="var(--font-mono)"
              fontSize="1.2"
              textAnchor="middle"
            >
              [OBJETIVO DE ATAQUE]
            </text>
          </g>

          {/* Pitch Field Halves Watermark Banners */}
          <text
            x="28"
            y="64.5"
            fill="rgba(34, 211, 238, 0.25)"
            fontFamily="var(--font-display)"
            fontSize="1.6"
            fontWeight="700"
            textAnchor="middle"
            letterSpacing="0.08em"
          >
            ◄ CAMPO PROPIO
          </text>
          <text
            x="72"
            y="64.5"
            fill="rgba(163, 230, 53, 0.35)"
            fontFamily="var(--font-display)"
            fontSize="1.6"
            fontWeight="700"
            textAnchor="middle"
            letterSpacing="0.08em"
          >
            CAMPO RIVAL (ATAQUE) ►
          </text>
        </g>

        {/* Dynamic Layers (Heatmap & Event Markers passed as children) */}
        {children}
      </svg>
    </div>
  );
}
