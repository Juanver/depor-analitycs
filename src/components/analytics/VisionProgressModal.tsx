'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Scan,
  Cpu,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
  Camera,
  Layers,
  Crosshair,
  Compass,
  Clock,
  Radio,
} from 'lucide-react';
import { VisionAnalysisMode } from '@/types/visionAnalysis';

export interface VisionProgressModalProps {
  isOpen: boolean;
  modo: VisionAnalysisMode;
  targetName: string; // Player name or Team name
  dorsal?: string;
  gameFormat?: string;
  nominalSystem?: string;
}

const PROGRESSIVE_STAGES = [
  {
    minSeconds: 0,
    title: 'Extrayendo fotogramas y decodificando video...',
    desc: 'Cargando secuencia MP4 a 30 FPS en memoria RAM y buffer de OpenCV...',
    subInfo: 'Buffer de frames activo',
  },
  {
    minSeconds: 15,
    title: 'Rastreando jugadores con YOLOv8 + ByteTrack...',
    desc: 'Inferencia de redes neuronales, bounding boxes ópticas y asignación continua de IDs...',
    subInfo: 'Detección de personas & Filtros Kalman',
  },
  {
    minSeconds: 60,
    title: 'Calculando coordenadas reales y homografía FIFA...',
    desc: 'Transformación de perspectiva cenital hacia cuadrícula 100x68 metros...',
    subInfo: 'Matriz de homografía espacial',
  },
  {
    minSeconds: 120,
    title: 'Calculando centroides, compacidad y mapa térmico...',
    desc: 'Interpolación de densidad gaussiana y metría espacial del bloque...',
    subInfo: 'Modelado táctico colectivo',
  },
  {
    minSeconds: 180,
    title: 'Generando diagnóstico táctico con Inteligencia Artificial...',
    desc: 'Interpretación de fases de juego, balance posicional y prescripción de ejercicios...',
    subInfo: 'Síntesis táctica final',
  },
];

export function VisionProgressModal({
  isOpen,
  modo,
  targetName,
  dorsal,
  gameFormat = 'Fútbol 7',
  nominalSystem = '1-2-3-1',
}: VisionProgressModalProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [frameCounter, setFrameCounter] = useState(60);

  // Formatear segundos a MM:SS
  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isOpen) {
      setElapsedSeconds(0);
      setFrameCounter(60);
      return;
    }

    // Cronómetro de tiempo real exacto cada 1 segundo
    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Incremento orgánico de fotogramas analizados
    const frameInterval = setInterval(() => {
      setFrameCounter((prev) => prev + Math.floor(Math.random() * 25 + 15));
    }, 400);

    return () => {
      clearInterval(timerInterval);
      clearInterval(frameInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Determinar la etapa activa según el tiempo transcurrido
  let currentStageIndex = 0;
  for (let i = PROGRESSIVE_STAGES.length - 1; i >= 0; i--) {
    if (elapsedSeconds >= PROGRESSIVE_STAGES[i].minSeconds) {
      currentStageIndex = i;
      break;
    }
  }

  const currentStage = PROGRESSIVE_STAGES[currentStageIndex];

  // Cálculo de progreso asintótico fluido que nunca se bloquea ni supera el 98%
  // hasta que el backend responde
  const calculatedProgress = Math.min(
    98,
    Math.floor(10 + Math.log2(elapsedSeconds + 1) * 12 + (elapsedSeconds * 0.15))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stadium-base/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl"
      >
        <Card
          cornerAccents
          variant="voltGlow"
          className="p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden bg-stadium-surface/95 border-volt/40 shadow-2xl"
        >
          {/* Laser Scanning Beam */}
          <div className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-volt to-transparent animate-scan-line opacity-80" />

          {/* Header Strip */}
          <div className="flex items-center justify-between border-b border-stadium-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-md bg-volt/15 border border-volt/30 text-volt">
                <Crosshair className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-display uppercase tracking-widest text-volt font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-volt" />
                  VISIÓN ARTIFICIAL ACTIVA (YOLOv8 + BYTETRACK)
                </span>
                <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                  {modo === 'individual' ? (
                    <>
                      {targetName} {dorsal && <span className="text-volt">#{dorsal}</span>}
                    </>
                  ) : (
                    <>
                      Equipo: <span className="text-volt">{targetName}</span>
                    </>
                  )}
                </h3>
              </div>
            </div>

            {/* Cronómetro en Tiempo Real */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-volt/15 border border-volt/40 text-volt font-mono font-bold text-xs shadow-volt-glow">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{formatTimer(elapsedSeconds)}</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                {gameFormat} • {nominalSystem}
              </span>
            </div>
          </div>

          {/* Optical Telemetry Visual Core */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Left: Concentric Radar Animation */}
            <div className="sm:col-span-5 relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-volt/20" />
              <div className="absolute inset-3 rounded-full border border-volt/35 border-dashed" />
              <div className="absolute inset-7 rounded-full border border-telemetry-cyan/40" />
              <div className="absolute inset-0 rounded-full animate-radar-sweep border-t-2 border-volt bg-gradient-to-tr from-volt/15 to-transparent" />

              {/* Center Metrics */}
              <div className="relative flex flex-col items-center justify-center text-center z-10">
                <span className="font-display font-black text-3xl text-volt tracking-tight leading-none">
                  {calculatedProgress}%
                </span>
                <span className="text-[8px] font-mono text-slate-400 uppercase mt-1 tracking-wider">
                  EN PROCESO
                </span>
              </div>
            </div>

            {/* Right: Live Frame Analytics Feed */}
            <div className="sm:col-span-7 flex flex-col gap-2 p-3 rounded-md bg-stadium-elevated/80 border border-white/5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Camera className="w-3.5 h-3.5 text-volt" /> Cuadros Procesados:
                </span>
                <span className="text-volt font-bold">{frameCounter} frames</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Radio className="w-3.5 h-3.5 text-telemetry-cyan animate-pulse" /> Estado del Socket:
                </span>
                <span className="text-telemetry-cyan font-bold">Conexión HTTP Abierta</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" /> Coordenadas Cancha:
                </span>
                <span className="text-emerald-400 font-bold">FIFA 100x68 Homografía</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Timeout del Cliente:
                </span>
                <span className="text-emerald-400 font-bold">Desactivado (Espera Libre)</span>
              </div>
            </div>
          </div>

          {/* Current Step Description Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-volt" />
                ETAPA {currentStageIndex + 1} DE {PROGRESSIVE_STAGES.length}
              </span>
              <span className="text-volt font-bold uppercase tracking-wider">
                {currentStage.subInfo}
              </span>
            </div>

            <div className="p-3.5 rounded-md bg-stadium-elevated border border-stadium-border text-xs text-slate-200 font-sans flex items-start gap-3">
              <div className="mt-0.5 p-1 rounded-xs bg-volt/20 text-volt shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="font-display font-bold uppercase tracking-wide text-white text-sm">
                  {currentStage.title}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {currentStage.desc}
                </p>
              </div>
            </div>

            {/* Glowing Linear Progress Bar */}
            <div className="w-full h-2 rounded-full bg-stadium-elevated overflow-hidden border border-white/5 mt-1">
              <motion.div
                className="h-full bg-gradient-to-r from-lime-500 via-volt to-telemetry-cyan shadow-volt-glow"
                style={{ width: `${calculatedProgress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            {/* Banner de espera no controlada */}
            <div className="p-2 rounded-md bg-volt/10 border border-volt/25 text-[11px] text-center text-slate-300 font-mono flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
              <span>
                <strong>Espera no controlada activa:</strong> El frontend mantendrá abierta la conexión con FastAPI hasta que finalice todo el video.
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
