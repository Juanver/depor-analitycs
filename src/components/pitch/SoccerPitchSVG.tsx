'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { ArrowRight, Shield, Target } from 'lucide-react';
import {
  PITCH_VIEWBOX_WIDTH,
  PITCH_VIEWBOX_HEIGHT,
  FIELD_X,
  FIELD_Y,
  FIELD_WIDTH,
  FIELD_HEIGHT,
  projectToPitch,
} from '@/lib/pitchCoordinates';

export {
  PITCH_VIEWBOX_WIDTH,
  PITCH_VIEWBOX_HEIGHT,
  FIELD_X,
  FIELD_Y,
  FIELD_WIDTH,
  FIELD_HEIGHT,
  projectToPitch,
};

export interface SoccerPitchSVGProps {
  className?: string;
  showAttackDirection?: boolean;
  attackDirectionText?: string;
  teamName?: string;
  opponentTeamName?: string;
  matchFormat?: string;
  centroid?: { x: number; y: number } | null;
  children?: React.ReactNode;
}

/**
 * Cancha 2D Cenital con Sistema de Coordenadas Unificado (viewBox="0 0 1000 680").
 * Rectángulo de juego: FIELD_X=40, FIELD_Y=30, FIELD_WIDTH=920, FIELD_HEIGHT=620.
 * Trazado dinámico adaptado a Fútbol 5/7 (área única) o Fútbol 9/11 (área grande + chica).
 */
export function SoccerPitchSVG({
  className,
  showAttackDirection = true,
  attackDirectionText = 'DIRECCIÓN DE ATAQUE',
  teamName = 'DIBUJITOS FC',
  opponentTeamName = 'RIVAL',
  matchFormat = 'Fútbol 7',
  centroid,
  children,
}: SoccerPitchSVGProps) {
  // 10 franjas verticales alternadas sobre el largo del campo (1000 / 10 = 100px cada una)
  const stripes = Array.from({ length: 10 }, (_, i) => i * 100);

  const normalizedFormat = (matchFormat || '').toLowerCase();
  const isSmallSided =
    normalizedFormat.includes('5') || normalizedFormat.includes('7');

  const midX = FIELD_X + FIELD_WIDTH / 2; // 500
  const midY = FIELD_Y + FIELD_HEIGHT / 2; // 340

  // Dimensiones proporcionales según modalidad
  const centerCircleRadius = isSmallSided ? 64 : 88;
  const penWidth = isSmallSided ? 128 : 152;
  const penHeight = isSmallSided ? 310 : 372;
  const penTopY = midY - penHeight / 2;
  const penSpotOffset = isSmallSided ? 88 : 102;
  const goalWidth = 18;
  const goalHeight = isSmallSided ? 96 : 112;
  const goalTopY = midY - goalHeight / 2;

  const projectedCentroid = centroid
    ? projectToPitch(centroid.x, centroid.y)
    : null;

  return (
    <div
      className={cn(
        'relative w-full aspect-[1000/680] select-none overflow-hidden rounded-lg border border-stadium-border shadow-stadium flex flex-col bg-[#081C15]',
        className
      )}
    >
      {/* Top Broadcast HUD Telemetry Bar */}
      <div className="absolute top-2 inset-x-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left Indicator: ARCO PROPIO (DEFENSA) */}
        <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-stadium-base/90 border border-telemetry-cyan/50 text-telemetry-cyan shadow-cyan-glow">
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
            <div className="px-2 py-1 rounded-xs bg-telemetry-cyan/15 border border-telemetry-cyan/40 text-[9px] font-display uppercase tracking-widest text-telemetry-cyan font-bold">
              {matchFormat}
            </div>
          )}
          {showAttackDirection && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xs bg-stadium-base/85 border border-volt/40 text-[10px] font-display uppercase tracking-widest text-volt shadow-volt-glow">
              <span>{attackDirectionText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-volt animate-pulse" />
            </div>
          )}
        </div>

        {/* Right Indicator: ARCO RIVAL (OBJETIVO) */}
        <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-stadium-base/90 border border-volt/60 text-volt shadow-volt-glow">
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

      {/* SVG Canvas (1000 x 680 Unified Coordinate Space) */}
      <svg
        viewBox={`0 0 ${PITCH_VIEWBOX_WIDTH} ${PITCH_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Clipping del lienzo completo */}
          <clipPath id="pitch-canvas-clip">
            <rect
              x="0"
              y="0"
              width={PITCH_VIEWBOX_WIDTH}
              height={PITCH_VIEWBOX_HEIGHT}
              rx="12"
            />
          </clipPath>

          {/* Clipping estricto al interior de las líneas de cal para capas de datos */}
          <clipPath id="field-interior-clip">
            <rect
              x={FIELD_X - 8}
              y={FIELD_Y - 8}
              width={FIELD_WIDTH + 16}
              height={FIELD_HEIGHT + 16}
            />
          </clipPath>

          {/* Grilla táctica sutil */}
          <pattern
            id="tactical-mesh"
            width="92"
            height="62"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="92"
              height="62"
              fill="none"
              stroke="rgba(255, 255, 255, 0.025)"
              strokeWidth="1"
            />
          </pattern>

          {/* Red de portería */}
          <pattern
            id="goal-net"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 6 L 6 0 M 0 0 L 6 6"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>

        <g clipPath="url(#pitch-canvas-clip)">
          {/* Césped nocturno #081C15 con 10 franjas verticales alternadas #0B241B */}
          {stripes.map((stripeX, idx) => (
            <rect
              key={`stripe-${idx}`}
              x={stripeX}
              y="0"
              width="100"
              height={PITCH_VIEWBOX_HEIGHT}
              fill={idx % 2 === 0 ? '#081C15' : '#0B241B'}
            />
          ))}

          {/* Grilla táctica sutil */}
          <rect
            x={FIELD_X}
            y={FIELD_Y}
            width={FIELD_WIDTH}
            height={FIELD_HEIGHT}
            fill="url(#tactical-mesh)"
          />

          {/* Tintes ambientales sutiles por mitad de campo */}
          <rect
            x={FIELD_X}
            y={FIELD_Y}
            width={FIELD_WIDTH / 2}
            height={FIELD_HEIGHT}
            fill="rgba(34, 211, 238, 0.015)"
          />
          <rect
            x={midX}
            y={FIELD_Y}
            width={FIELD_WIDTH / 2}
            height={FIELD_HEIGHT}
            fill="rgba(163, 230, 53, 0.02)"
          />

          {/* Líneas de Cal Reglamentarias */}
          <g
            stroke="rgba(255, 255, 255, 0.78)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Rectángulo Exterior de Juego */}
            <rect
              x={FIELD_X}
              y={FIELD_Y}
              width={FIELD_WIDTH}
              height={FIELD_HEIGHT}
            />

            {/* Línea Media */}
            <line
              x1={midX}
              y1={FIELD_Y}
              x2={midX}
              y2={FIELD_Y + FIELD_HEIGHT}
            />

            {/* Círculo Central */}
            <circle cx={midX} cy={midY} r={centerCircleRadius} />
            <circle
              cx={midX}
              cy={midY}
              r="4.5"
              fill="rgba(255, 255, 255, 0.85)"
            />

            {/* Área Penal Izquierda (Arco Propio) */}
            <rect
              x={FIELD_X}
              y={penTopY}
              width={penWidth}
              height={penHeight}
            />
            <circle
              cx={FIELD_X + penSpotOffset}
              cy={midY}
              r="4"
              fill="rgba(255, 255, 255, 0.85)"
            />

            {/* Área Penal Derecha (Arco Rival) */}
            <rect
              x={FIELD_X + FIELD_WIDTH - penWidth}
              y={penTopY}
              width={penWidth}
              height={penHeight}
            />
            <circle
              cx={FIELD_X + FIELD_WIDTH - penSpotOffset}
              cy={midY}
              r="4"
              fill="rgba(255, 255, 255, 0.85)"
            />

            {/* Trazado exclusivo Fútbol 9 / Fútbol 11: Área Chica + Semicírculos Penales */}
            {!isSmallSided && (
              <>
                {/* Área Chica Izquierda */}
                <rect
                  x={FIELD_X}
                  y={midY - 84}
                  width="52"
                  height="168"
                />
                {/* Área Chica Derecha */}
                <rect
                  x={FIELD_X + FIELD_WIDTH - 52}
                  y={midY - 84}
                  width="52"
                  height="168"
                />
                {/* Semicírculo Penal Izquierdo */}
                <path
                  d={`M ${FIELD_X + penWidth} ${midY - 68} A 82 82 0 0 1 ${FIELD_X + penWidth} ${midY + 68}`}
                />
                {/* Semicírculo Penal Derecho */}
                <path
                  d={`M ${FIELD_X + FIELD_WIDTH - penWidth} ${midY - 68} A 82 82 0 0 0 ${FIELD_X + FIELD_WIDTH - penWidth} ${midY + 68}`}
                />
              </>
            )}

            {/* Arcos de Córner */}
            <path d={`M ${FIELD_X} ${FIELD_Y + 14} A 14 14 0 0 0 ${FIELD_X + 14} ${FIELD_Y}`} />
            <path d={`M ${FIELD_X + FIELD_WIDTH - 14} ${FIELD_Y} A 14 14 0 0 0 ${FIELD_X + FIELD_WIDTH} ${FIELD_Y + 14}`} />
            <path d={`M ${FIELD_X} ${FIELD_Y + FIELD_HEIGHT - 14} A 14 14 0 0 1 ${FIELD_X + 14} ${FIELD_Y + FIELD_HEIGHT}`} />
            <path d={`M ${FIELD_X + FIELD_WIDTH - 14} ${FIELD_Y + FIELD_HEIGHT} A 14 14 0 0 1 ${FIELD_X + FIELD_WIDTH} ${FIELD_Y + FIELD_HEIGHT - 14}`} />
          </g>

          {/* Portería Izquierda (Arco Propio - Cian) */}
          <g>
            <rect
              x={FIELD_X - goalWidth}
              y={goalTopY}
              width={goalWidth}
              height={goalHeight}
              fill="url(#goal-net)"
              stroke="#22D3EE"
              strokeWidth="2.5"
            />
          </g>

          {/* Portería Derecha (Arco Rival - Volt) */}
          <g>
            <rect
              x={FIELD_X + FIELD_WIDTH}
              y={goalTopY}
              width={goalWidth}
              height={goalHeight}
              fill="url(#goal-net)"
              stroke="#A3E635"
              strokeWidth="2.5"
            />
          </g>

          {/* Capas Hijas (Mapa de Calor + Marcadores de Eventos) */}
          <g clipPath="url(#field-interior-clip)">{children}</g>

          {/* Marcador Táctico de Centroide Colectivo (Modo Equipo) */}
          {projectedCentroid && centroid && (
            <g className="pointer-events-none">
              <circle
                cx={projectedCentroid.cx}
                cy={projectedCentroid.cy}
                r="22"
                fill="rgba(34, 211, 238, 0.14)"
                stroke="#22D3EE"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
              <line
                x1={projectedCentroid.cx - 12}
                y1={projectedCentroid.cy}
                x2={projectedCentroid.cx + 12}
                y2={projectedCentroid.cy}
                stroke="#22D3EE"
                strokeWidth="2"
              />
              <line
                x1={projectedCentroid.cx}
                y1={projectedCentroid.cy - 12}
                x2={projectedCentroid.cx}
                y2={projectedCentroid.cy + 12}
                stroke="#22D3EE"
                strokeWidth="2"
              />
              <circle
                cx={projectedCentroid.cx}
                cy={projectedCentroid.cy}
                r="6"
                fill="#22D3EE"
                stroke="#070B0E"
                strokeWidth="2"
              />

              {/* Etiqueta flotante del Centroide */}
              <g
                transform={`translate(${Math.min(
                  FIELD_X + FIELD_WIDTH - 210,
                  Math.max(FIELD_X + 10, projectedCentroid.cx - 100)
                )}, ${
                  projectedCentroid.cy < 95
                    ? projectedCentroid.cy + 28
                    : projectedCentroid.cy - 48
                })`}
              >
                <rect
                  x="0"
                  y="0"
                  width="200"
                  height="24"
                  rx="4"
                  fill="rgba(7, 11, 14, 0.92)"
                  stroke="#22D3EE"
                  strokeWidth="1.2"
                />
                <text
                  x="100"
                  y="15.5"
                  textAnchor="middle"
                  fill="#22D3EE"
                  fontSize="10.5"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  {`CENTROIDE BLOQUE (${centroid.x.toFixed(1)}, ${centroid.y.toFixed(1)})`}
                </text>
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
