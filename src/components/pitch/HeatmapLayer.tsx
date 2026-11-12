'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeatmapPoint } from '@/types/analysis';
import { getThermalColor, normalizeHeatmapPoints } from '@/lib/normalizeHeatmapData';

export interface HeatmapLayerProps {
  points: HeatmapPoint[];
  opacity?: number;
  visible?: boolean;
}

/**
 * High-performance tactical Gaussian Heatmap layer.
 * Implements feGaussianBlur with stdDeviation=5.5 and organic thermal transitions
 * (#0EA5E9 -> #10B981 -> #FACC15 -> #EF4444).
 */
export function HeatmapLayer({
  points,
  opacity = 0.88,
  visible = true,
}: HeatmapLayerProps) {
  if (!visible || !points || points.length === 0) return null;

  const normalized = normalizeHeatmapPoints(points);

  return (
    <AnimatePresence mode="wait">
      <motion.g
        key={`heatmap-group-${points.length}-${points[0]?.x ?? 0}-${points[points.length - 1]?.x ?? 0}`}
        initial={{ opacity: 0 }}
        animate={{ opacity }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ mixBlendMode: 'screen' }}
        className="transition-all duration-500 ease-out"
      >
        <defs>
          {/* Gaussian blur for organic thermal dispersion */}
          <filter id="heatmap-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5.5" result="blur" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -4"
            />
          </filter>

          {/* Gradients for each point based on thermal intensity */}
          {normalized.map((pt, idx) => {
            const coreColor = getThermalColor(pt.intensity, 0.95);
            const midColor = getThermalColor(pt.intensity * 0.65, 0.65);
            const outerColor = getThermalColor(pt.intensity * 0.25, 0.15);

            return (
              <radialGradient
                key={`thermal-grad-${idx}`}
                id={`thermal-grad-${idx}`}
                cx="50%"
                cy="50%"
                r="50%"
              >
                <stop offset="0%" stopColor={coreColor} />
                <stop offset="45%" stopColor={midColor} />
                <stop offset="75%" stopColor={outerColor} />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            );
          })}
        </defs>

        {/* Soft thermal diffusion circles */}
        <g filter="url(#heatmap-blur)">
          {normalized.map((pt, idx) => {
            // Radius scales dynamically with intensity (between 10 and 20 pitch units)
            const radius = 10 + pt.intensity * 9;

            return (
              <circle
                key={`heat-circle-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={radius}
                fill={`url(#thermal-grad-${idx})`}
                className="transition-all duration-500 ease-out"
              />
            );
          })}
        </g>
      </motion.g>
    </AnimatePresence>
  );
}
