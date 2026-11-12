'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Scan,
  Cpu,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

export interface TacticalScanModalProps {
  isOpen: boolean;
  playerName: string;
  dorsal: number;
  onComplete?: () => void;
}

const SCAN_STEPS = [
  'Iniciando ingestión y preprocesamiento de video broadcast...',
  'Segmentando dorsal y tracking espacial en cuadrícula 100x68...',
  'Interpolando mapa de densidad térmica por cuartos temporales...',
  'Detectando secuencias de pases, duelos y pérdidas en zona de riesgo...',
  'Sintetizando telemetría y plan de mejora con Gemini 2.5 Flash...',
  'Análisis táctico completado con éxito.',
];

export function TacticalScanModal({
  isOpen,
  playerName,
  dorsal,
  onComplete,
}: TacticalScanModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(5);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8 + 4);
        const step = Math.min(
          SCAN_STEPS.length - 1,
          Math.floor((next / 100) * SCAN_STEPS.length)
        );
        setCurrentStepIndex(step);
        return Math.min(next, 98);
      });
    }, 380);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stadium-base/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg"
      >
        <Card
          cornerAccents
          variant="voltGlow"
          className="p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden bg-stadium-surface/95"
        >
          {/* Scanning Beam Keyframe */}
          <div className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-volt to-transparent animate-scan-line opacity-75" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-stadium-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-md bg-volt/15 border border-volt/30 text-volt">
                <Scan className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-display uppercase tracking-widest text-volt font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-volt" /> ESCANEO TÁCTICO EN PROGRESO
                </span>
                <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                  {playerName} <span className="text-volt">#{dorsal}</span>
                </h3>
              </div>
            </div>

            <Badge variant="volt" size="sm" pulse>
              GEMINI 2.5
            </Badge>
          </div>

          {/* Graphic Telemetry Radar Animation */}
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            {/* Concentric circles */}
            <div className="absolute inset-0 rounded-full border border-volt/20" />
            <div className="absolute inset-4 rounded-full border border-volt/30" />
            <div className="absolute inset-8 rounded-full border border-telemetry-cyan/40" />

            {/* Sweep hand */}
            <div className="absolute inset-0 rounded-full animate-radar-sweep border-t-2 border-volt/80 bg-gradient-to-tr from-volt/10 to-transparent" />

            {/* Center Core */}
            <div className="relative flex flex-col items-center justify-center text-center z-10">
              <span className="font-display font-black text-3xl text-volt tracking-tight leading-none">
                {progress}%
              </span>
              <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">
                TELEMETRÍA
              </span>
            </div>
          </div>

          {/* Current Step Description */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">FASE ACTIVA:</span>
              <span className="text-telemetry-cyan font-bold">
                {currentStepIndex + 1} / {SCAN_STEPS.length}
              </span>
            </div>

            <div className="p-3 rounded-md bg-stadium-elevated border border-stadium-border text-xs text-slate-200 font-sans min-h-[48px] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-volt shrink-0 animate-spin" />
              <span>{SCAN_STEPS[currentStepIndex]}</span>
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-stadium-elevated overflow-hidden border border-white/5 mt-1">
              <motion.div
                className="h-full bg-gradient-to-r from-lime-500 via-volt to-telemetry-cyan shadow-volt-glow"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Subtext info */}
          <p className="text-[11px] text-center text-slate-400 font-sans">
            Impulsado 100% por Gemini API con Structured Outputs y visión biomecánica de élite.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
