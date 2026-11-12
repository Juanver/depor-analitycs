'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DEMO_ANALYSIS_DATA } from '@/data/mockAnalysis';
import {
  TacticalAnalysisData,
  TimeSegmentId,
  TacticalEvent,
} from '@/types/analysis';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { PlayerScoutCard } from '@/components/analytics/PlayerScoutCard';
import { SoccerPitchSVG } from '@/components/pitch/SoccerPitchSVG';
import { HeatmapLayer } from '@/components/pitch/HeatmapLayer';
import { EventMarkers, EventTooltipCard } from '@/components/pitch/EventMarkers';
import { TimelineScrubber } from '@/components/pitch/TimelineScrubber';
import { SyncedVideoPlayer } from '@/components/analytics/SyncedVideoPlayer';
import { TacticalRadarChart } from '@/components/analytics/TacticalRadarChart';
import { KpiGrid } from '@/components/analytics/KpiGrid';
import { CoachFeedbackPanel } from '@/components/analytics/CoachFeedbackPanel';
import { PlayerSegmentTrackingCard } from '@/components/analytics/PlayerSegmentTrackingCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  LayoutGrid,
  Activity,
  Tv,
  Dumbbell,
  Share2,
  Download,
  Flame,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AnalysisDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<TacticalAnalysisData>(DEMO_ANALYSIS_DATA);
  const [activeSegment, setActiveSegment] = useState<TimeSegmentId>('full');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [videoTargetSeconds, setVideoTargetSeconds] = useState<number | null>(null);
  const [activeMobileSection, setActiveMobileSection] = useState('section-pitch');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<TacticalEvent | null>(null);

  // Load either custom analysis from sessionStorage or demo
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (id === 'verano-7-demo') {
      setData(DEMO_ANALYSIS_DATA);
      return;
    }

    const storedById = sessionStorage.getItem(`analysis_${id}`);
    const storedCustom = sessionStorage.getItem('customAnalysis');
    const raw = storedById || storedCustom;

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as TacticalAnalysisData;
        if (parsed && parsed.playerSummary && parsed.timeSegments) {
          setData(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse cached analysis:', e);
      }
    }
  }, [id]);

  const currentSegmentData = data.timeSegments[activeSegment] || data.timeSegments['full'];

  // Handle jump to timestamp from anywhere (pines, coach cards, drill references)
  const handleJumpToTimestamp = (seconds: number) => {
    setVideoTargetSeconds(seconds);
    // Smooth scroll to video section if on mobile
    if (window.innerWidth < 768) {
      const el = document.getElementById('section-video');
      el?.scrollIntoView({ behavior: 'smooth' });
      setActiveMobileSection('section-video');
    }
  };

  const handleSelectEvent = (event: TacticalEvent) => {
    setSelectedEventId(event.id);
    handleJumpToTimestamp(event.timestampSeconds);
  };

  const handleMobileNavClick = (sectionId: string) => {
    setActiveMobileSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Event counts for scrubber badges
  const segmentEventCounts: Record<TimeSegmentId, number> = {
    '0-10': data.timeSegments['0-10']?.events?.length || 0,
    '10-20': data.timeSegments['10-20']?.events?.length || 0,
    '20-end': data.timeSegments['20-end']?.events?.length || 0,
    'full': data.timeSegments['full']?.events?.length || 0,
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-12">
      {/* Top Navbar */}
      <Navbar
        breadcrumbs={[
          { label: 'Análisis Táctico', href: '/' },
          { label: `${data.playerSummary.name} #${data.playerSummary.dorsal}`, active: true },
        ]}
        currentMatchTitle={`${data.playerSummary.team} vs ${data.playerSummary.opponentTeam || 'Rival'}`}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col gap-6">
        {/* PLAYER SCOUT HEADER */}
        <section id="section-scout">
          <PlayerScoutCard player={data.playerSummary} />
        </section>

        {/* 12-COLUMN ASYMMETRIC BENTO GRID: PITCH & SYNCED VIDEO */}
        <section
          id="section-pitch"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-20"
        >
          {/* Left Side (7 Cols on desktop): Interactive 2D Pitch + Timeline Scrubber */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Card variant="default" className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <SectionHeader
                  tag="CANCHA 2D CENITAL"
                  title="Telemetría Espacial"
                  subtitle="Mapeo de calor e intervenciones en tiempo real"
                  icon={<LayoutGrid className="w-5 h-5 text-volt" />}
                  variant="volt"
                />

                <div className="hidden sm:flex items-center gap-2">
                  <Badge variant="volt" size="sm">
                    {currentSegmentData.label}
                  </Badge>
                </div>
              </div>

              {/* 2D Pitch SVG with Heatmap and Event Markers */}
              <div className="relative w-full aspect-[100/68] bg-stadium-base rounded-md overflow-hidden">
                <SoccerPitchSVG
                  teamName={data.playerSummary.team}
                  opponentTeamName={data.playerSummary.opponentTeam || 'GOOD GAME UNITED'}
                  matchFormat={data.playerSummary.matchFormat || 'Fútbol 7'}
                >
                  {/* Layer 1: Heatmap Density */}
                  <HeatmapLayer
                    points={currentSegmentData.heatmapPoints}
                    visible={showHeatmap}
                  />

                  {/* Layer 2: Key Event Markers */}
                  <EventMarkers
                    events={currentSegmentData.events}
                    visible={showEvents}
                    onSelectEvent={handleSelectEvent}
                    onHoverEvent={setHoveredEvent}
                    hoveredEventId={hoveredEvent?.id}
                    activeEventId={selectedEventId}
                  />
                </SoccerPitchSVG>

                {/* Proportional HTML Tooltip Overlay (Immune to SVG scaling) */}
                {hoveredEvent && (
                  <EventTooltipCard
                    event={hoveredEvent}
                    onSelectEvent={(ev) => {
                      handleSelectEvent(ev);
                      setHoveredEvent(null);
                    }}
                  />
                )}
              </div>

              {/* Timeline Scrubber & Layer Toggles */}
              <TimelineScrubber
                activeSegment={activeSegment}
                onChangeSegment={setActiveSegment}
                showHeatmap={showHeatmap}
                onToggleHeatmap={setShowHeatmap}
                showEvents={showEvents}
                onToggleEvents={setShowEvents}
                segmentEventCounts={segmentEventCounts}
              />
            </Card>
          </div>

          {/* Right Side (5 Cols on desktop): Synced Video Player & Live Playhead */}
          <div
            id="section-video"
            className="lg:col-span-5 flex flex-col gap-4 scroll-mt-20"
          >
            <SyncedVideoPlayer
              youtubeId={data.playerSummary.youtubeId || '-eI9ZUNdxgw'}
              videoUrl={data.playerSummary.videoUrl}
              targetSeconds={videoTargetSeconds}
              onTargetConsumed={() => setVideoTargetSeconds(null)}
            />

            {/* Tracked Player Active Segment Telemetry Card */}
            <PlayerSegmentTrackingCard
              player={data.playerSummary}
              segment={currentSegmentData}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        </section>

        {/* QUANTITATIVE METRICS: RADAR & KPI GRID */}
        <section id="section-metrics" className="flex flex-col gap-4 scroll-mt-20">
          <SectionHeader
            tag="RENDIMIENTO CUANTITATIVO"
            title="Telemetría & Indicadores Clave (KPIs)"
            subtitle="Métricas segmentadas del jugador para el tramo actual"
            icon={<Activity className="w-5 h-5 text-volt" />}
            variant="volt"
          />

          {/* KPIs Grid */}
          <KpiGrid kpis={currentSegmentData.kpis} />

          {/* 5-Axis Radar Chart */}
          <div className="w-full">
            <TacticalRadarChart metrics={data.radarMetrics} />
          </div>
        </section>

        {/* COACH DIAGNOSTIC & IMPROVEMENT PLAN (3 COLUMNS) */}
        <section id="section-coach" className="flex flex-col gap-4 pt-4 scroll-mt-20">
          <SectionHeader
            tag="NIKE FOOTBALL LABS & BROADCAST COACH"
            title="Diagnóstico del Entrenador & Plan de Mejora"
            subtitle="Análisis biomecánico, causas raíz de pérdidas y ejercicios prescritos"
            icon={<Dumbbell className="w-5 h-5 text-volt" />}
            variant="volt"
          />

          <CoachFeedbackPanel
            strengths={data.strengths}
            weaknesses={data.weaknesses}
            drills={data.recommendedDrills}
            tacticalNotes={data.tacticalSummaryNotes}
            onJumpToTimestamp={handleJumpToTimestamp}
          />
        </section>
      </main>

      {/* MOBILE BOTTOM DOCKED NAV (<768px) */}
      <MobileBottomNav
        activeSection={activeMobileSection}
        onSelectSection={handleMobileNavClick}
      />
    </div>
  );
}
