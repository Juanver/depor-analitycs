import { HeatmapPoint } from '@/types/analysis';
import { CameraVisibleZone } from '@/types/visionAnalysis';

export interface NormalizeHeatmapOptions {
  videoWidth?: number;
  videoHeight?: number;
  cameraZone?: CameraVisibleZone;
}

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
 * Normaliza y calibra los puntos de calor espaciales adaptándolos a la dimensión real
 * de la cancha 2D (100m largo x 68m ancho) y a la zona de campo visible por la cámara.
 *
 * Regla clave: No estira artificialmente (min-max) un clip corto a toda la cancha;
 * preserva la proporción real del encuadre de cámara (mitad izquierda, mitad derecha,
 * zona media o campo completo).
 */
export function normalizeHeatmapPoints(
  points: HeatmapPoint[],
  options: NormalizeHeatmapOptions = {}
): HeatmapPoint[] {
  if (!points || points.length === 0) return [];

  const videoWidth = options.videoWidth && options.videoWidth > 0 ? options.videoWidth : 1920;
  const videoHeight = options.videoHeight && options.videoHeight > 0 ? options.videoHeight : 1080;
  const cameraZone = options.cameraZone || 'campo_completo';

  const xValues = points.map((p) => Number(p.x) || 0);
  const yValues = points.map((p) => Number(p.y) || 0);
  const intensities = points.map((p) => Number(p.intensity) || 0.5);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues, 0.001);
  const maxY = Math.max(...yValues, 0.001);
  const maxIntensity = Math.max(...intensities, 0.1);

  // Caso 1: Coordenadas normalizadas [0.0 - 1.0]
  const isNormalizedZeroToOne = maxX <= 1.05 && maxY <= 1.05;

  // Caso 2: Coordenadas en píxeles de video (>105 en X o >75 en Y)
  const isVideoPixelCoords = maxX > 105 || maxY > 75;

  // Caso 3: Y está en porcentaje [0 - 100]
  const isYPercentage = !isVideoPixelCoords && !isNormalizedZeroToOne && maxY > 68 && maxY <= 100;

  // Si los puntos ya cubren más de medio campo en eje X, no comprimir a una sola mitad
  const spansFullPitch = !isVideoPixelCoords && !isNormalizedZeroToOne && maxX - minX > 50;

  const projected = points.map((p) => {
    let finalX = Number(p.x) || 0;
    let finalY = Number(p.y) || 0;

    if (isNormalizedZeroToOne) {
      finalX = finalX * 100;
      finalY = finalY * 68;
    } else if (isVideoPixelCoords) {
      // Proyectar usando la resolución real del video (sin estirar min-max a toda la cancha)
      const refW = Math.max(videoWidth, maxX);
      const refH = Math.max(videoHeight, maxY);
      finalX = (finalX / refW) * 100;
      finalY = (finalY / refH) * 68;
    } else if (isYPercentage) {
      finalY = (finalY / 100) * 68;
    }

    // Si la cámara enfoca una zona específica (ej. mitad izquierda o derecha) y los datos
    // no cubren ya el campo completo, proyectar al sector visible de la cancha.
    if (!spansFullPitch) {
      if (cameraZone === 'mitad_izquierda' && finalX > 50) {
        finalX = 4 + (finalX / 100) * 44;
      } else if (cameraZone === 'mitad_derecha' && finalX < 50) {
        finalX = 52 + (finalX / 100) * 44;
      } else if (cameraZone === 'zona_media') {
        finalX = 24 + (finalX / 100) * 52;
      }
    }

    finalX = Math.max(2, Math.min(98, finalX));
    finalY = Math.max(2, Math.min(66, finalY));

    let finalIntensity = Number(p.intensity) || 0.5;
    if (finalIntensity > 1.0) {
      finalIntensity = finalIntensity / maxIntensity;
    }
    finalIntensity = Math.max(0.2, Math.min(1.0, finalIntensity));

    return {
      x: finalX,
      y: finalY,
      intensity: finalIntensity,
      label: p.label,
    };
  });

  // Para nubes densas de tracking (ej. 184 puntos en 7 min), ponderar por densidad espacial
  // para distinguir zonas calientes de recorridos aislados cuando la intensidad cruda es uniforme.
  if (projected.length >= 25) {
    const sigmaSq2 = 2 * 7 * 7; // radio efectivo ~7m
    const densities = projected.map((pt, i) => {
      let sum = 0;
      for (let j = 0; j < projected.length; j++) {
        if (i === j) {
          sum += 1;
          continue;
        }
        const dx = pt.x - projected[j].x;
        const dy = pt.y - projected[j].y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 400) {
          sum += Math.exp(-distSq / sigmaSq2);
        }
      }
      return sum;
    });
    const maxDensity = Math.max(...densities, 1);
    const minDensity = Math.min(...densities, 0);
    const range = Math.max(maxDensity - minDensity, 0.001);

    return projected.map((pt, i) => {
      const normDensity = (densities[i] - minDensity) / range;
      const blended = Math.max(0.18, Math.min(1.0, 0.78 * normDensity + 0.22 * pt.intensity));
      return {
        x: Number(pt.x.toFixed(1)),
        y: Number(pt.y.toFixed(1)),
        intensity: Number(blended.toFixed(2)),
        label: pt.label,
      };
    });
  }

  return projected.map((pt) => ({
    x: Number(pt.x.toFixed(1)),
    y: Number(pt.y.toFixed(1)),
    intensity: Number(pt.intensity.toFixed(2)),
    label: pt.label,
  }));
}

/**
 * Returns RGB components for a given intensity [0, 1] mapped to the tactical thermal spectrum.
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
    r = 239;
    g = 68;
    b = 68;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
