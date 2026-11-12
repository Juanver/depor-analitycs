import { HeatmapPoint } from '@/types/analysis';

/**
 * Standardizes pitch coordinates to ensure they stay strictly within 0-100 (x) and 0-68 (y)
 */
export function clampPitchCoords(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(68, y)),
  };
}

/**
 * Normalizes an array of heatmap points ensuring intensities are clamped between 0.1 and 1.0
 */
export function normalizeHeatmapPoints(points: HeatmapPoint[]): HeatmapPoint[] {
  if (!points || points.length === 0) return [];
  const maxIntensity = Math.max(...points.map((p) => p.intensity), 1);

  return points.map((p) => {
    const clamped = clampPitchCoords(p.x, p.y);
    return {
      x: clamped.x,
      y: clamped.y,
      intensity: Math.max(0.15, Math.min(1.0, p.intensity / maxIntensity)),
      label: p.label,
    };
  });
}

/**
 * Returns RGB components for a given intensity [0, 1] mapped to the tactical thermal spectrum:
 * 0.00-0.25: #0EA5E9 (Cyan / Low thermal)
 * 0.25-0.45: #10B981 (Emerald / Mild build-up)
 * 0.45-0.65: #FACC15 (Yellow / Frequent zone)
 * 0.65-0.85: #F97316 (Orange / High concentration)
 * 0.85-1.00: #EF4444 (Red / Hot focal point)
 */
export function getThermalColor(intensity: number, alpha: number = 0.65): string {
  const clamped = Math.max(0, Math.min(1, intensity));

  let r = 14;
  let g = 165;
  let b = 233;

  if (clamped <= 0.25) {
    const t = clamped / 0.25;
    r = Math.round(14 + t * (16 - 14));
    g = Math.round(165 + t * (185 - 165));
    b = Math.round(233 + t * (129 - 233));
  } else if (clamped <= 0.45) {
    const t = (clamped - 0.25) / 0.20;
    r = Math.round(16 + t * (250 - 16));
    g = Math.round(185 + t * (204 - 185));
    b = Math.round(129 + t * (21 - 129));
  } else if (clamped <= 0.65) {
    const t = (clamped - 0.45) / 0.20;
    r = Math.round(250 + t * (249 - 250));
    g = Math.round(204 + t * (115 - 204));
    b = Math.round(21 + t * (22 - 21));
  } else if (clamped <= 0.85) {
    const t = (clamped - 0.65) / 0.20;
    r = Math.round(249 + t * (239 - 249));
    g = Math.round(115 + t * (68 - 115));
    b = Math.round(22 + t * (68 - 22));
  } else {
    // 0.85 to 1.00 - Peak Thermal Red
    r = 239;
    g = 68;
    b = 68;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
