'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DEMO_TEAM_ANALYSIS_DATA } from '@/data/mockTeamAnalysis';
import {
  TeamCollectiveAnalysisData,
  TeamTacticalEvent,
} from '@/types/teamAnalysis';
import { Navbar } from '@/components/layout/Navbar';
import { SoccerPitchSVG } from '@/components/pitch/SoccerPitchSVG';
import { HeatmapLayer } from '@/components/pitch/HeatmapLayer';
import { SyncedVideoPlayer } from '@/components/analytics/SyncedVideoPlayer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TeamScoutHeader } from '@/components/team/TeamScoutHeader';
import { TeamKpiGrid } from '@/components/team/TeamKpiGrid';
import { TeamPitchPassingNetwork } from '@/components/team/TeamPitchPassingNetwork';
import {
  TeamCollectiveEventMarkers,
  TeamEventTooltipCard,
} from '@/components/team/TeamCollectiveEventMarkers';
import { TeamPhasesPanel } from '@/components/team/TeamPhasesPanel';
import { TeamCoachFeedback } from '@/components/team/TeamCoachFeedback';
import {
  Users,
  Share2,
  Flame,
  Target,
  LayoutGrid,
  Activity,
  Tv,
  Compass,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export default function TeamAnalysisDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<TeamCollectiveAnalysisData>(DEMO_TEAM_ANALYSIS_DATA);
  const [activeLayer, setActiveLayer] = useState<'network' | 'heatmap' | 'events'>('network');
  const [videoTargetSeconds, setVideoTargetSeconds] = useState<number | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<TeamTacticalEvent | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Load from sessionStorage if customized from setup form
  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      try {
        const stored = sessionStorage.getItem(`team_analysis_${id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setData(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse cached team analysis:', e);
      }
    }
  }, [id]);

  const handleJumpToTimestamp = (seconds: number) => {
    setVideoTargetSeconds(seconds);
    const el = document.getElementById('section-video');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectEvent = (event: TeamTacticalEvent) => {
    setSelectedEventId(event.id);
    handleJumpToTimestamp(event.timestampSeconds);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-12 bg-[var(--color-stadium-base)] text-[var(--color-text-main)]">
      {/* Navbar */}
      <Navbar
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: `Equipo: ${data.teamProfile.teamName}`, active: true },
        ]}
        currentMatchTitle={`${data.teamProfile.teamName} vs ${data.teamProfile.opponentTeam}`}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col gap-6">
        {/* TEAM HEADER CARD */}
        <section id="section-team-scout">
          <TeamScoutHeader profile={data.teamProfile} />
        </section>

        {/* 12-COL ASYMMETRIC GRID: 2D PITCH (PASSING NETWORK) + SYNCED VIDEO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-20">
          {/* Left Side (7 Cols): 2D Interactive Collective Pitch */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Card variant="default" className="p-4 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <SectionHeader
                  tag="TELEMETRÍA COLECTIVA CENITAL"
                  title="Cancha Táctica 2D de Equipo"
                  subtitle="Red de pases, centroides medios y eventos colectivos"
                  icon={<LayoutGrid className="w-5 h-5 text-volt" />}
                  variant="volt"
                />

                {/* Layer Toggle Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-xs bg-stadium-elevated border border-stadium-border self-start sm:self-auto">
                  <button
                    onClick={() => setActiveLayer('network')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xs font-display uppercase tracking-wider text-[10px] font-bold transition-colors ${
                      activeLayer === 'network'
                        ? 'bg-volt text-stadium-base shadow-volt-glow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Red de Pases</span>
                  </button>

                  <button
                    onClick={() => setActiveLayer('heatmap')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xs font-display uppercase tracking-wider text-[10px] font-bold transition-colors ${
                      activeLayer === 'heatmap'
                        ? 'bg-volt text-stadium-base shadow-volt-glow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flame className="w-3 h-3" />
                    <span>Calor Colectivo</span>
                  </button>

                  <button
                    onClick={() => setActiveLayer('events')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xs font-display uppercase tracking-wider text-[10px] font-bold transition-colors ${
                      activeLayer === 'events'
                        ? 'bg-volt text-stadium-base shadow-volt-glow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Target className="w-3 h-3" />
                    <span>Jugadas</span>
                  </button>
                </div>
              </div>

              {/* Soccer Pitch Canvas */}
              <div className="relative w-full aspect-[100/68] bg-[#081C15] rounded-md overflow-hidden">
                <SoccerPitchSVG
                  teamName={data.teamProfile.teamName}
                  opponentTeamName={data.teamProfile.opponentTeam}
                  matchFormat={data.teamProfile.matchFormat}
                >
                  {/* Layer 1: Passing Network */}
                  <TeamPitchPassingNetwork
                    nodes={data.passingNetwork.nodes}
                    connections={data.passingNetwork.connections}
                    shirtColor={data.teamProfile.shirtColor}
                    visible={activeLayer === 'network'}
                  />

                  {/* Layer 2: Collective Heatmap */}
                  <HeatmapLayer
                    points={data.teamHeatmapPoints}
                    visible={activeLayer === 'heatmap'}
                  />

                  {/* Layer 3: Collective Event Markers */}
                  <TeamCollectiveEventMarkers
                    events={data.collectiveEvents}
                    visible={activeLayer === 'events'}
                    onSelectEvent={handleSelectEvent}
                    onHoverEvent={setHoveredEvent}
                    hoveredEventId={hoveredEvent?.id}
                    activeEventId={selectedEventId}
                  />
                </SoccerPitchSVG>

                {hoveredEvent && (
                  <TeamEventTooltipCard
                    event={hoveredEvent}
                    onSelectEvent={(ev) => {
                      handleSelectEvent(ev);
                      setHoveredEvent(null);
                    }}
                  />
                )}
              </div>

              {/* Passing Network Legend Bar */}
              {activeLayer === 'network' && (
                <div className="flex items-center justify-between text-[10px] font-sans text-slate-400 px-2 py-1.5 rounded-xs bg-stadium-elevated border border-white/5 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-0.5 bg-telemetry-cyan" />
                    <span>Líneas de conexión (el grosor representa el volumen de pases entre líneas)</span>
                  </div>
                  <span className="text-volt font-mono font-bold">
                    {data.passingNetwork.connections.length} Circuitos Clave
                  </span>
                </div>
              )}
            </Card>
          </div>

          {/* Right Side (5 Cols): Synced Video Player & Collective Feed */}
          <div id="section-video" className="lg:col-span-5 flex flex-col gap-4 scroll-mt-20">
            <SyncedVideoPlayer
              youtubeId={data.teamProfile.youtubeId || '-eI9ZUNdxgw'}
              videoUrl={data.teamProfile.videoUrl}
              targetSeconds={videoTargetSeconds}
              onTargetConsumed={() => setVideoTargetSeconds(null)}
            />

            {/* Collective Highlights Feed Card */}
            <Card variant="default" className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="font-display uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-volt" />
                  Acciones Colectivas Clave del Partido
                </span>
                <span className="font-mono text-volt font-bold">
                  {data.collectiveEvents.length} Jugadas
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {data.collectiveEvents.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => handleSelectEvent(ev)}
                    className="p-2.5 rounded-xs bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col gap-1 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-volt text-xs font-bold bg-volt/10 group-hover:bg-volt group-hover:text-stadium-base px-2 py-0.5 rounded-xs transition-colors">
                        [{ev.timestampDisplay}]
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-xs font-display uppercase tracking-widest font-bold bg-telemetry-cyan/15 text-telemetry-cyan border border-telemetry-cyan/30">
                        {ev.phase}
                      </span>
                    </div>

                    <h4 className="text-xs text-white font-display uppercase tracking-wide font-bold line-clamp-1 group-hover:text-volt transition-colors">
                      {ev.title}
                    </h4>

                    <p className="text-[11px] text-slate-300 font-sans leading-tight line-clamp-2">
                      {ev.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* COLLECTIVE KPIS GRID */}
        <section className="flex flex-col gap-4 scroll-mt-20">
          <SectionHeader
            tag="RENDIMIENTO COLECTIVO"
            title="Telemetría & KPIs del Equipo"
            subtitle="Posesión, PPDA, compacidad entre líneas y precisión colectiva"
            icon={<Activity className="w-5 h-5 text-volt" />}
            variant="volt"
          />
          <TeamKpiGrid kpis={data.collectiveKpis} />
        </section>

        {/* 4 PHASES OF PLAY */}
        <section className="flex flex-col gap-4 scroll-mt-20">
          <SectionHeader
            tag="METODOLOGÍA DE JUEGO"
            title="Análisis de las 4 Fases Tácticas"
            subtitle="Efectividad en iniciación, progresión, bloque defensivo y transiciones"
            icon={<Compass className="w-5 h-5 text-telemetry-cyan" />}
            variant="cyan"
          />
          <TeamPhasesPanel phases={data.phasesAnalysis} />
        </section>

        {/* COACH DIAGNOSTIC & TEAM DRILLS */}
        <section className="flex flex-col gap-4 scroll-mt-20">
          <SectionHeader
            tag="DIRECTOR TÉCNICO & PLANTEAMIENTO"
            title="Diagnóstico Colectivo & Ejercicios de Equipo"
            subtitle="Fortalezas consolidadas, desajustes estructurales y sesiones grupales prescritas"
            icon={<Users className="w-5 h-5 text-volt" />}
            variant="volt"
          />
          <TeamCoachFeedback
            strengths={data.collectiveStrengths}
            weaknesses={data.collectiveWeaknesses}
            drills={data.teamRecommendedDrills}
            masterNotes={data.masterCoachNotes}
            onJumpToTimestamp={handleJumpToTimestamp}
          />
        </section>
      </main>
    </div>
  );
}
