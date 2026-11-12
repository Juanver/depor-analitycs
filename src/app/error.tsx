'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card variant="voltGlow" className="max-w-md w-full p-6 text-center flex flex-col items-center gap-4">
        <AlertTriangle className="w-10 h-10 text-thermal-high" />
        <h2 className="text-xl font-display uppercase tracking-tight font-black text-white">
          Ocurrió un error inesperado
        </h2>
        <p className="text-xs text-slate-300 font-sans">
          {error.message || 'No se pudo inicializar el entorno táctico de la aplicación.'}
        </p>
        <div className="flex gap-3 w-full mt-2">
          <Button onClick={() => reset()} variant="volt" size="md" className="flex-1">
            Reintentar
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" size="md" className="w-full">
              Inicio
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
