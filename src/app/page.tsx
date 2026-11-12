'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TacticalScanModal } from '@/components/analytics/TacticalScanModal';
import { MatchSetupFormInput, MatchFormat } from '@/types/analysis';
import { TeamSetupForm } from '@/components/team/TeamSetupForm';
import {
  Zap,
  PlaySquare,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  Flame,
  CheckCircle2,
  Tv,
  Upload,
  Link2,
  Sliders,
  Footprints,
  Layers,
  Users,
  Share2,
  Compass,
} from 'lucide-react';

const PRESET_POSITIONS = [
  'Back Central (Fútbol 7)',
  'Volante / Mediocentro (Fútbol 7)',
  'Delantero / Pivote (Fútbol 7)',
  'Defensa Central (DFC)',
  'Lateral Derecho (LD)',
  'Lateral Izquierdo (LI)',
  'Pivote Defensivo (MCD)',
  'Mediocentro Mixto (MC)',
  'Mediapunta (MCO)',
  'Extremo Derecho (ED)',
  'Extremo Izquierdo (EI)',
  'Delantero Centro (DC)',
];

const PRESET_COLORS = [
  { label: 'Negro', hex: '#0F172A' },
  { label: 'Volt', hex: '#A3E635' },
  { label: 'Blanco', hex: '#F8FAFC' },
  { label: 'Azul', hex: '#2563EB' },
  { label: 'Rojo', hex: '#DC2626' },
  { label: 'Amarillo', hex: '#EAB308' },
];

const PRESET_BOOT_COLORS = [
  { label: 'Naranja Flúor', hex: '#F97316' },
  { label: 'Volt / Verde', hex: '#A3E635' },
  { label: 'Blanco', hex: '#F8FAFC' },
  { label: 'Negro', hex: '#0F172A' },
  { label: 'Azul Cyan', hex: '#06B6D4' },
  { label: 'Rosa / Fucsia', hex: '#EC4899' },
];

export default function HomePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<MatchSetupFormInput>({
    videoUrl: 'https://www.youtube.com/watch?v=-eI9ZUNdxgw',
    dorsal: 7,
    playerName: 'Verano',
    shirtColor: '#0F172A',
    shortColor: '#0F172A',
    socksColor: '#0F172A',
    bootsColor: '#F97316',
    matchFormat: 'Fútbol 7',
    teamName: 'Dibujitos FC',
    initialPosition: 'Back Central (Fútbol 7)',
  });

  const [analysisMode, setAnalysisMode] = useState<'player' | 'team'>('player');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);

    try {
      // Call analyze API
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      // Wait a moment so the scanner modal animation looks complete
      setTimeout(() => {
        setIsScanning(false);
        if (json.success && json.data) {
          const analysisId = json.data.playerSummary.id || `custom-${Date.now()}`;
          sessionStorage.setItem('customAnalysis', JSON.stringify(json.data));
          sessionStorage.setItem(`analysis_${analysisId}`, JSON.stringify(json.data));
          router.push(`/analisis/${analysisId}`);
        } else {
          router.push('/analisis/verano-7-demo');
        }
      }, 3200);
    } catch (err) {
      console.error('Scan error:', err);
      setTimeout(() => {
        setIsScanning(false);
        router.push('/analisis/verano-7-demo');
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-start pt-8 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* HERO HEADER */}
        <section className="text-center max-w-3xl mx-auto mb-10 flex flex-col items-center">
          <Badge variant="volt" size="md" pulse className="mb-4">
            SPORTS DATA VISUALIZATION & AI TRACKING
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
            Análisis Táctico <span className="text-volt text-glow-volt">Pro Broadcast</span> por Video
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl">
            Telemetría de élite para <strong>jugadores individuales</strong> y <strong>equipos completos</strong> con seguimiento de indumentaria, redes de pase y mapas térmicos en <strong>Fútbol 7 y Fútbol 11</strong>. Potenciado 100% por <strong>Gemini 2.5</strong> sin backends en Python.
          </p>

          {/* CRITICAL DEMO ACCESS BUTTONS (PLAYER & FULL TEAM) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link href="/analisis/verano-7-demo" className="w-full sm:w-auto">
              <Button
                variant="volt"
                size="lg"
                icon={<PlaySquare className="w-5 h-5 fill-stadium-base" />}
                className="w-full sm:w-auto text-sm sm:text-base shadow-volt-glow font-black"
              >
                Demo Jugador: Verano #7 (Dibujitos FC)
              </Button>
            </Link>

            <Link href="/analisis-equipo/dibujitos-fc-team-demo" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                icon={<Sparkles className="w-5 h-5 text-telemetry-cyan" />}
                className="w-full sm:w-auto text-sm sm:text-base border-telemetry-cyan/50 text-telemetry-cyan hover:bg-telemetry-cyan/15 font-black"
              >
                Demo Equipo: Dibujitos FC vs Good Game
              </Button>
            </Link>
          </div>
        </section>

        {/* DUAL MODE SELECTOR: JUGADOR vs EQUIPO COMPLETO */}
        <section id="match-setup" className="w-full max-w-4xl mx-auto scroll-mt-24">
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => setAnalysisMode('player')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-display uppercase tracking-wider font-extrabold text-sm transition-all border ${
                analysisMode === 'player'
                  ? 'bg-volt text-stadium-base border-volt shadow-volt-glow'
                  : 'bg-stadium-surface text-slate-400 border-stadium-border hover:text-[var(--color-text-main)]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Evaluar Jugador Individual</span>
            </button>

            <button
              type="button"
              onClick={() => setAnalysisMode('team')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-display uppercase tracking-wider font-extrabold text-sm transition-all border ${
                analysisMode === 'team'
                  ? 'bg-telemetry-cyan text-stadium-base border-telemetry-cyan shadow-cyan-glow'
                  : 'bg-stadium-surface text-slate-400 border-stadium-border hover:text-[var(--color-text-main)]'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Evaluar Equipo Completo</span>
            </button>
          </div>

          {analysisMode === 'team' ? (
            <TeamSetupForm />
          ) : (
            <Card
              cornerAccents
              variant="default"
              className="p-6 sm:p-8 border-volt/30 shadow-2xl relative"
            >
              {/* Form Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-stadium-border mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-md bg-volt/15 text-volt border border-volt/30">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight text-white">
                    Match Setup <span className="text-volt">& Tracking Visual IA</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                    Ingresa el formato, video e indumentaria completa para un rastreo preciso sin confusiones
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-telemetry-cyan bg-telemetry-cyan/10 px-2.5 py-1 rounded-xs border border-telemetry-cyan/20 shrink-0">
                GEMINI 2.5 VISION
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 0: Formato de Partido (Fútbol 7 vs Fútbol 11) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-volt" />
                    Tipo / Formato de Fútbol
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    Define dimensiones espaciales y ritmo táctico
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {(['Fútbol 7', 'Fútbol 11'] as MatchFormat[]).map((format) => {
                    const isSelected = formData.matchFormat === format;
                    return (
                      <button
                        key={format}
                        type="button"
                        onClick={() => setFormData({ ...formData, matchFormat: format })}
                        className={`py-2.5 px-4 rounded-md font-display uppercase tracking-wider font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                          isSelected
                            ? 'bg-volt text-stadium-base border-volt shadow-volt-glow'
                            : 'bg-stadium-elevated text-slate-300 border-stadium-border hover:border-slate-500'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        <span>{format}</span>
                        {format === 'Fútbol 7' && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-xs font-mono ${
                            isSelected ? 'bg-stadium-base text-volt' : 'bg-white/10 text-slate-400'
                          }`}>
                            Pandas Cup
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 1: Video Source */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-volt" />
                    URL del Video (YouTube o Transmisión Oficial)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1080p / 60fps recomendado</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 rounded-md bg-stadium-elevated border border-stadium-border text-white text-sm font-sans focus:outline-none focus:border-volt focus:ring-1 focus:ring-volt transition-colors"
                  />
                  <div className="absolute right-3 top-3 text-xs text-slate-400 flex items-center gap-1">
                    <Tv className="w-3.5 h-3.5 text-telemetry-cyan" />
                    <span>YouTube Sync</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Player & Team Names */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200">
                    Nombre o Apodo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.playerName}
                    onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                    placeholder="Ej. Verano"
                    className="w-full px-4 py-2.5 rounded-md bg-stadium-elevated border border-stadium-border text-white text-sm font-sans focus:outline-none focus:border-volt focus:ring-1 focus:ring-volt transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200">
                    Dorsal (#)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    required
                    value={formData.dorsal}
                    onChange={(e) => setFormData({ ...formData, dorsal: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-md bg-stadium-elevated border border-stadium-border text-white text-sm font-mono font-bold focus:outline-none focus:border-volt focus:ring-1 focus:ring-volt transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200">
                    Equipo del Jugador
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    placeholder="Ej. Dibujitos FC"
                    className="w-full px-4 py-2.5 rounded-md bg-stadium-elevated border border-stadium-border text-white text-sm font-sans focus:outline-none focus:border-volt focus:ring-1 focus:ring-volt transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Posición Inicial */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200">
                  Posición Inicial / Rol en Cancha
                </label>
                <select
                  value={formData.initialPosition}
                  onChange={(e) => setFormData({ ...formData, initialPosition: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-md bg-stadium-elevated border border-stadium-border text-white text-xs font-sans focus:outline-none focus:border-volt focus:ring-1 focus:ring-volt transition-colors"
                >
                  {PRESET_POSITIONS.map((pos) => (
                    <option key={pos} value={pos} className="bg-stadium-base text-white">
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 4: CARACTERÍSTICAS VISUALES DE IDENTIFICACIÓN (Camiseta, Short, Zapatillas, Medias) */}
              <div className="p-4 rounded-md bg-stadium-base/80 border border-stadium-border flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-display uppercase tracking-wider font-bold text-volt flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-volt" />
                    Kit Completo para Identificación Visual de la IA
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                    Permite a la IA no confundir jugadores con dorsales similares
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Color de Camiseta */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-display uppercase tracking-wider font-bold text-slate-300">
                      Color de Camiseta
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.shirtColor}
                        onChange={(e) => setFormData({ ...formData, shirtColor: e.target.value })}
                        className="w-9 h-9 rounded-md bg-stadium-elevated border border-stadium-border cursor-pointer p-0.5"
                      />
                      <div className="flex items-center gap-1 overflow-x-auto py-1">
                        {PRESET_COLORS.map((col) => (
                          <button
                            key={col.hex}
                            type="button"
                            onClick={() => setFormData({ ...formData, shirtColor: col.hex })}
                            className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                              formData.shirtColor === col.hex ? 'border-volt scale-110' : 'border-white/20'
                            }`}
                            style={{ backgroundColor: col.hex }}
                            title={col.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Color del Short */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-display uppercase tracking-wider font-bold text-slate-300">
                      Color del Short
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.shortColor}
                        onChange={(e) => setFormData({ ...formData, shortColor: e.target.value })}
                        className="w-9 h-9 rounded-md bg-stadium-elevated border border-stadium-border cursor-pointer p-0.5"
                      />
                      <div className="flex items-center gap-1 overflow-x-auto py-1">
                        {PRESET_COLORS.map((col) => (
                          <button
                            key={col.hex}
                            type="button"
                            onClick={() => setFormData({ ...formData, shortColor: col.hex })}
                            className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                              formData.shortColor === col.hex ? 'border-volt scale-110' : 'border-white/20'
                            }`}
                            style={{ backgroundColor: col.hex }}
                            title={col.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Color de Zapatillas (CRÍTICO PARA TRACKING) */}
                  <div className="flex flex-col gap-1.5 p-2 rounded-md bg-orange-500/10 border border-orange-500/30">
                    <label className="text-[11px] font-display uppercase tracking-wider font-extrabold text-orange-400 flex items-center gap-1">
                      <Footprints className="w-3.5 h-3.5" />
                      Color de Zapatillas (Calzado)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.bootsColor}
                        onChange={(e) => setFormData({ ...formData, bootsColor: e.target.value })}
                        className="w-9 h-9 rounded-md bg-stadium-elevated border border-orange-500/50 cursor-pointer p-0.5"
                      />
                      <div className="flex items-center gap-1 overflow-x-auto py-1">
                        {PRESET_BOOT_COLORS.map((col) => (
                          <button
                            key={col.hex}
                            type="button"
                            onClick={() => setFormData({ ...formData, bootsColor: col.hex })}
                            className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                              formData.bootsColor === col.hex ? 'border-volt scale-110' : 'border-white/20'
                            }`}
                            style={{ backgroundColor: col.hex }}
                            title={col.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stadium-border">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-volt" />
                  <span>Seguimiento biométrico F7 con zapatillas naranjas y dorsal activo.</span>
                </div>

                <Button
                  type="submit"
                  variant="volt"
                  size="lg"
                  icon={<Sparkles className="w-4 h-4" />}
                  className="w-full sm:w-auto shadow-volt-glow font-black"
                >
                  Iniciar Escaneo Táctico con IA
                </Button>
              </div>
            </form>
          </Card>
          )}
        </section>

        {/* 4 VALUE PILLARS / BROADCAST CAPABILITIES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl mx-auto mt-16">
          <Card variant="default" className="p-5 flex flex-col gap-3 border-t-2 border-t-volt">
            <div className="p-2.5 rounded-md bg-volt/15 text-volt w-fit border border-volt/30">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-white">
              Red de Pases de Equipo
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Centroides posicionales de cada jugador y líneas de conexión ponderadas por volumen de circulación.
            </p>
          </Card>

          <Card variant="default" className="p-5 flex flex-col gap-3 border-t-2 border-t-telemetry-cyan">
            <div className="p-2.5 rounded-md bg-telemetry-cyan/15 text-telemetry-cyan w-fit border border-telemetry-cyan/30">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-white">
              Mapa de Calor 2D Cenital
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Cancha proporcional FIFA con dinámica adaptada a Fútbol 7 o Fútbol 11 y gradiente térmico gaussiano orgánico.
            </p>
          </Card>

          <Card variant="default" className="p-5 flex flex-col gap-3 border-t-2 border-t-emerald-400">
            <div className="p-2.5 rounded-md bg-emerald-400/15 text-emerald-400 w-fit border border-emerald-400/30">
              <Tv className="w-5 h-5" />
            </div>
            <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-white">
              Sincronización a [MM:SS]
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Haz clic en cualquier jugada individual o colectiva y el reproductor de YouTube saltará al segundo exacto.
            </p>
          </Card>

          <Card variant="default" className="p-5 flex flex-col gap-3 border-t-2 border-t-amber-400">
            <div className="p-2.5 rounded-md bg-amber-400/15 text-amber-400 w-fit border border-amber-400/30">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-white">
              Análisis de las 4 Fases
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Evaluación metodológica de iniciación, progresión, bloque defensivo y transiciones con prescripción de drills grupales.
            </p>
          </Card>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-stadium-surface border-t border-stadium-border py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <p>
          DEPOR-ANALYTICS © 2026 • Broadcast Sports Telemetry & Tactical Intelligence • Powered by Gemini 2.5
        </p>
      </footer>

      {/* TACTICAL SCAN MODAL */}
      <TacticalScanModal
        isOpen={isScanning}
        playerName={formData.playerName}
        dorsal={formData.dorsal}
      />
    </div>
  );
}
