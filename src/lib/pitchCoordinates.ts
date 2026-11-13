/**
 * Sistema de Coordenadas Unificado para la Cancha 2D (viewBox="0 0 1000 680").
 * Proyecta coordenadas normalizadas (0..100 en X, 0..100 en Y) al interior exacto
 * del rectángulo de juego delimitado por las líneas blancas de cal.
 */

export const PITCH_VIEWBOX_WIDTH = 1000;
export const PITCH_VIEWBOX_HEIGHT = 680;

export const FIELD_X = 40; // Borde izquierdo / arco propio
export const FIELD_Y = 30; // Borde superior / banda izquierda
export const FIELD_WIDTH = 920; // Largo total de juego (hasta x = 960)
export const FIELD_HEIGHT = 620; // Ancho total de juego (hasta y = 650)

export interface ProjectedPitchPoint {
  cx: number;
  cy: number;
}

/**
 * Convierte coordenadas normalizadas [0..100, 0..100] al espacio SVG [1000 x 680]
 * dentro del rectángulo de juego (40..960 en X, 30..650 en Y).
 */
export function projectToPitch(normX: number, normY: number): ProjectedPitchPoint {
  const safeX = Number.isFinite(normX) ? normX : 50;
  const safeY = Number.isFinite(normY) ? normY : 50;

  const cx = FIELD_X + (Math.max(0, Math.min(100, safeX)) / 100) * FIELD_WIDTH;
  const cy = FIELD_Y + (Math.max(0, Math.min(100, safeY)) / 100) * FIELD_HEIGHT;

  return { cx, cy };
}
