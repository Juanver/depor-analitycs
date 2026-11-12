'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TeamSetupFormInput } from '@/types/teamAnalysis';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Users,
  Tv,
  Sparkles,
  Play,
  Layers,
  Compass,
  ArrowRight,
  Shield,
  Loader2,
} from 'lucide-react';

export interface TeamSetupFormProps {
  onSuccess?: (analysisId: string) => void;
  className?: string;
}

export function TeamSetupForm({ onSuccess, className }: TeamSetupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TeamSetupFormInput>({
    videoUrl: 'https://www.youtube.com/watch?v=-eI9ZUNdxgw',
    teamName: 'Dibujitos FC',
    opponentTeam: 'Good Game United',
    matchFormat: 'Fútbol 7',
    shirtColor: '#0F172A',
    opponentShirtColor: '#E2E8F0',
    formationNominal: '2-3-1 (Fútbol 7)',
    tacticalFocus: 'Amplitud con carrileros, salida de fondo con pivote y presión tras pérdida',
  });

  const handleLoadDemo = () => {
    setFormData({
      videoUrl: 'https://www.youtube.com/watch?v=-eI9ZUNdxgw',
      teamName: 'Dibujitos FC',
      opponentTeam: 'Good Game United',
      matchFormat: 'Fútbol 7',
      shirtColor: '#0F172A',
      opponentShirtColor: '#E2E8F0',
      formationNominal: '2-3-1 (Fútbol 7)',
      tacticalFocus: 'Amplitud con carrileros, salida de fondo con pivote y presión tras pérdida',
    });
    router.push('/analisis-equipo/demo-dibujitos-fc');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al procesar el análisis de equipo');
      }

      const generatedId = json.data.teamProfile.id || `team-${Date.now()}`;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`team_analysis_${generatedId}`, JSON.stringify(json.data));
      }

      if (onSuccess) {
        onSuccess(generatedId);
      } else {
        router.push(`/analisis-equipo/${generatedId}`);
      }
    } catch (err) {
      console.error('Error submitting team analysis:', err);
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card cornerAccents variant="default" className={`p-6 ${className || ''}`}>
      <div className="flex flex-col gap-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-volt/15 border border-volt/30 text-volt">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-display uppercase tracking-widest text-volt font-bold">
                MÓDULO DE SCOUTING COLECTIVO
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold uppercase tracking-tight text-white">
                Analizar Equipo Completo con IA
              </h2>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLoadDemo}
            className="border-volt/40 text-volt hover:bg-volt/15 font-display uppercase tracking-wider text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-volt" />
            Cargar Demo: Dibujitos FC
          </Button>
        </div>

        {error && (
          <div className="p-3 rounded-xs bg-thermal-high/15 border border-thermal-high/40 text-thermal-high text-xs font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* URL de Video */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-telemetry-cyan" />
              URL de Video de YouTube del Partido Completo
            </label>
            <input
              type="url"
              required
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2.5 rounded-xs bg-stadium-elevated border border-stadium-border text-white text-xs font-mono focus:border-volt focus:outline-none transition-colors"
            />
          </div>

          {/* Equipos y Formato */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-300">
                Equipo a Evaluar
              </label>
              <input
                type="text"
                required
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="Ej. Dibujitos FC"
                className="w-full px-3 py-2 rounded-xs bg-stadium-elevated border border-stadium-border text-white text-xs font-sans focus:border-volt focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-300">
                Equipo Rival
              </label>
              <input
                type="text"
                required
                value={formData.opponentTeam}
                onChange={(e) => setFormData({ ...formData, opponentTeam: e.target.value })}
                placeholder="Ej. Good Game United"
                className="w-full px-3 py-2 rounded-xs bg-stadium-elevated border border-stadium-border text-white text-xs font-sans focus:border-volt focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-300">
                Formato de Juego
              </label>
              <select
                value={formData.matchFormat}
                onChange={(e) => setFormData({ ...formData, matchFormat: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xs bg-stadium-elevated border border-stadium-border text-white text-xs font-display uppercase tracking-wider focus:border-volt focus:outline-none"
              >
                <option value="Fútbol 7">Fútbol 7</option>
                <option value="Fútbol 11">Fútbol 11</option>
              </select>
            </div>
          </div>

          {/* Colores de Camiseta y Formación */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-300">
                Camiseta de tu Equipo
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.shirtColor}
                  onChange={(e) => setFormData({ ...formData, shirtColor: e.target.value })}
                  className="w-8 h-8 rounded-xs cursor-pointer bg-transparent border border-white/20"
                />
                <input
                  type="text"
                  value={formData.shirtColor}
                  onChange={(e) => setFormData({ ...formData, shirtColor: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xs bg-stadium-elevated border border-stadium-border text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-300">
                Camiseta del Rival
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.opponentShirtColor || '#E2E8F0'}
                  onChange={(e) => setFormData({ ...formData, opponentShirtColor: e.target.value })}
                  className="w-8 h-8 rounded-xs cursor-pointer bg-transparent border border-white/20"
                />
                <input
                  type="text"
                  value={formData.opponentShirtColor}
                  onChange={(e) => setFormData({ ...formData, opponentShirtColor: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xs bg-stadium-elevated border border-stadium-border text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-300">
                Sistema Táctico Nominal
              </label>
              <input
                type="text"
                value={formData.formationNominal}
                onChange={(e) => setFormData({ ...formData, formationNominal: e.target.value })}
                placeholder="Ej. 2-3-1 en F7 ó 4-3-3"
                className="w-full px-3 py-2 rounded-xs bg-stadium-elevated border border-stadium-border text-white text-xs font-sans focus:border-volt focus:outline-none"
              />
            </div>
          </div>

          {/* Características a Evaluar (Tactical Focus) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-volt" />
                Características Tácticas a Evaluar en el Equipo
              </span>
              <span className="text-[10px] text-slate-500 font-sans">Prioridad de Análisis IA</span>
            </label>
            <textarea
              rows={3}
              value={formData.tacticalFocus}
              onChange={(e) => setFormData({ ...formData, tacticalFocus: e.target.value })}
              placeholder="Ej. Evaluar la compacidad del bloque medio, desbordes por bandas de los extremos, eficacia en presión tras pérdida y transiciones rápidas hacia el punta."
              className="w-full px-3 py-2 rounded-xs bg-stadium-elevated border border-stadium-border text-white text-xs font-sans focus:border-volt focus:outline-none transition-colors"
            />
          </div>

          {/* CTA Submit */}
          <Button
            type="submit"
            variant="volt"
            size="lg"
            disabled={isLoading}
            className="w-full font-display font-extrabold uppercase tracking-wider text-sm mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analizando Equipo Completo con Gemini 2.5 Pro...</span>
              </>
            ) : (
              <>
                <span>Generar Evaluación Táctica Colectiva</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}
