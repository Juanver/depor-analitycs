'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw, Home, PlaySquare } from 'lucide-react';

export default function AnalysisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Analysis page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card
        cornerAccents
        variant="voltGlow"
        className="max-w-md w-full p-6 md:p-8 flex flex-col items-center text-center gap-5"
      >
        <div className="p-3 rounded-full bg-thermal-high/15 text-thermal-high border border-thermal-high/30">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-display uppercase tracking-widest text-thermal-high font-bold">
            ERROR DE TELEMETRÍA
          </span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-white uppercase tracking-tight">
            No se pudo cargar el análisis
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-1">
            {error.message ||
              'Ocurrió una interrupción al decodificar las coordenadas o sincronizar los fotogramas del partido.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
          <Button
            onClick={() => reset()}
            variant="volt"
            size="md"
            icon={<RefreshCw className="w-4 h-4" />}
            className="w-full"
          >
            Reintentar
          </Button>

          <Link href="/analisis/verano-7-demo" className="w-full">
            <Button
              variant="outline"
              size="md"
              icon={<PlaySquare className="w-4 h-4 text-telemetry-cyan" />}
              className="w-full"
            >
              Cargar Demo #7
            </Button>
          </Link>
        </div>

        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-sans transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          Volver a la pantalla de inicio
        </Link>
      </Card>
    </div>
  );
}
