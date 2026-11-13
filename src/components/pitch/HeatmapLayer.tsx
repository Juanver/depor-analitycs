'use client';

import React, { useEffect, useState } from 'react';
import { HeatmapPoint } from '@/types/analysis';
import {
  PITCH_VIEWBOX_WIDTH,
  PITCH_VIEWBOX_HEIGHT,
  projectToPitch,
} from '@/lib/pitchCoordinates';

export interface HeatmapLayerProps {
  points: HeatmapPoint[];
  opacity?: number;
  visible?: boolean;
  showRawPoints?: boolean;
}

const CANVAS_SCALE = 0.5;
const CANVAS_W = Math.round(PITCH_VIEWBOX_WIDTH * CANVAS_SCALE); // 500
const CANVAS_H = Math.round(PITCH_VIEWBOX_HEIGHT * CANVAS_SCALE); // 340

interface ColorStop {
  pos: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

const THERMAL_STOPS: ColorStop[] = [
  { pos: 0.0, r: 14, g: 165, b: 233, a: 0 },     // Transparente
  { pos: 0.08, r: 14, g: 165, b: 233, a: 115 },  // Azul cielo / Cian suave
  { pos: 0.25, r: 16, g: 185, b: 129, a: 175 },  // Verde esmeralda
  { pos: 0.48, r: 250, g: 204, b: 21, a: 215 },  // Amarillo brillante
  { pos: 0.72, r: 249, g: 115, b: 22, a: 235 },  // Naranja intenso
  { pos: 0.90, r: 239, g: 68, b: 68, a: 248 },   // Rojo volcánico
  { pos: 1.0, r: 255, g: 235, b: 235, a: 255 },  // Núcleo caliente rojo-blanco
];

function buildThermalLut(): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256 * 4);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let s0 = THERMAL_STOPS[0];
    let s1 = THERMAL_STOPS[THERMAL_STOPS.length - 1];

    for (let j = 0; j < THERMAL_STOPS.length - 1; j++) {
      if (t >= THERMAL_STOPS[j].pos && t <= THERMAL_STOPS[j + 1].pos) {
        s0 = THERMAL_STOPS[j];
        s1 = THERMAL_STOPS[j + 1];
        break;
      }
    }

    const span = Math.max(0.0001, s1.pos - s0.pos);
    const localT = (t - s0.pos) / span;

    lut[i * 4] = Math.round(s0.r + (s1.r - s0.r) * localT);
    lut[i * 4 + 1] = Math.round(s0.g + (s1.g - s0.g) * localT);
    lut[i * 4 + 2] = Math.round(s0.b + (s1.b - s0.b) * localT);
    lut[i * 4 + 3] = Math.round(s0.a + (s1.a - s0.a) * localT);
  }
  return lut;
}

const THERMAL_LUT = buildThermalLut();

/**
 * Capa de Calor Térmico Real (Canvas 2D offscreen KDE + Paleta LUT Broadcast).
 * Renderiza la textura resultante como `<image>` SVG nativa para garantizar
 * compatibilidad total con WebKit en iOS (Chrome/Safari iPhone) y Android/Desktop.
 */
export function HeatmapLayer({
  points,
  opacity = 0.9,
  visible = true,
  showRawPoints = false,
}: HeatmapLayerProps) {
  const [heatmapDataUrl, setHeatmapDataUrl] = useState<string | null>(null);

  const projectedPoints = React.useMemo(
    () =>
      (points || []).map((pt) => {
        const { cx, cy } = projectToPitch(pt.x, pt.y);
        const intensity = Number.isFinite(pt.intensity)
          ? Math.max(0.2, Math.min(1, pt.intensity))
          : 0.75;
        return { cx, cy, intensity };
      }),
    [points]
  );

  useEffect(() => {
    if (!visible || projectedPoints.length === 0) {
      setHeatmapDataUrl(null);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Radio y peso por punto calibrados al tamaño de la nube para que puntos aislados
    // se vean azules/verdes y las acumulaciones reales brillen en naranja/rojo.
    const count = projectedPoints.length;
    const radius = count > 80 ? 27 : count > 25 ? 32 : 38;
    const baseWeight = count > 120 ? 0.16 : count > 40 ? 0.24 : 0.42;

    // Paso 1: Acumulación de densidad en canal alpha
    for (let i = 0; i < count; i++) {
      const pt = projectedPoints[i];
      const px = pt.cx * CANVAS_SCALE;
      const py = pt.cy * CANVAS_SCALE;
      const alpha = Math.min(0.85, baseWeight * (0.7 + pt.intensity * 0.5));

      const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
      grad.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
      grad.addColorStop(0.45, `rgba(0, 0, 0, ${alpha * 0.55})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Paso 2: Normalización al pico real y mapeo con LUT térmica
    const imgData = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
    const data = imgData.data;

    let maxAlpha = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > maxAlpha) {
        maxAlpha = data[i];
      }
    }

    if (maxAlpha === 0) {
      setHeatmapDataUrl(null);
      return;
    }
    const normPeak = Math.max(maxAlpha, 70);

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a <= 2) {
        data[i + 3] = 0;
        continue;
      }
      const lutIdx = Math.min(255, Math.round((a / normPeak) * 255)) * 4;
      data[i] = THERMAL_LUT[lutIdx];
      data[i + 1] = THERMAL_LUT[lutIdx + 1];
      data[i + 2] = THERMAL_LUT[lutIdx + 2];
      data[i + 3] = THERMAL_LUT[lutIdx + 3];
    }

    ctx.putImageData(imgData, 0, 0);
    setHeatmapDataUrl(canvas.toDataURL('image/png'));
  }, [projectedPoints, visible]);

  if (!visible || !points || points.length === 0) return null;

  return (
    <g>
      {heatmapDataUrl && (
        <image
          href={heatmapDataUrl}
          x={0}
          y={0}
          width={PITCH_VIEWBOX_WIDTH}
          height={PITCH_VIEWBOX_HEIGHT}
          preserveAspectRatio="none"
          opacity={opacity}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Control de Depuración Visual: Puntos Crudos (cx, cy) */}
      {showRawPoints && (
        <g className="pointer-events-none">
          {projectedPoints.map((pt, idx) => (
            <circle
              key={`raw-pt-${idx}`}
              cx={pt.cx}
              cy={pt.cy}
              r="3.2"
              fill="#22D3EE"
              stroke="#070B0E"
              strokeWidth="1"
              opacity="0.92"
            />
          ))}
        </g>
      )}
    </g>
  );
}
