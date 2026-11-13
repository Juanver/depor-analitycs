'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DEMO_ANALYSIS_DATA } from '@/data/mockAnalysis';
import { DEMO_TEAM_ANALYSIS_DATA } from '@/data/mockTeamAnalysis';
import {
  TacticalAnalysisData,
  TimeSegmentId,
  TacticalEvent,
  PlayerScoutProfile,
  RadarMetrics,
} from '@/types/analysis';
import {
  UnifiedVisionAnalysisData,
  VisionAnalysisMode,
  VisionHighlightPlay,
  TeamBlockTacticalData,
  RawVisionResponse,
  RawHeatmapPoint,
  RawTelemetryInput,
} from '@/types/visionAnalysis';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { PlayerScoutCard } from '@/components/analytics/PlayerScoutCard';
import { TeamScoutCard } from '@/components/team/TeamScoutCard';
import { SoccerPitchSVG } from '@/components/pitch/SoccerPitchSVG';
import { HeatmapLayer } from '@/components/pitch/HeatmapLayer';
import { EventMarkers, EventTooltipCard } from '@/components/pitch/EventMarkers';
import { TimelineScrubber } from '@/components/pitch/TimelineScrubber';
import { SyncedVideoPlayer } from '@/components/analytics/SyncedVideoPlayer';
import { TacticalRadarChart } from '@/components/analytics/TacticalRadarChart';
import { KpiGrid } from '@/components/analytics/KpiGrid';
import { CoachFeedbackPanel } from '@/components/analytics/CoachFeedbackPanel';
import { PlayerSegmentTrackingCard } from '@/components/analytics/PlayerSegmentTrackingCard';
import { TeamSegmentTrackingCard } from '@/components/team/TeamSegmentTrackingCard';
import { TeamBlockTacticalCard } from '@/components/team/TeamBlockTacticalCard';
import { VisionTacticalReportSections } from '@/components/analytics/VisionTacticalReportSections';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { videoStore } from '@/lib/videoStore';
import {
  normalizeBlockData,
  normalizeHighlightPlays,
  clampTimestampToDuration,
  downloadVisionPdfReport,
} from '@/lib/visionApiClient';
import { formatSecondsToMMSS } from '@/lib/formatTimestamp';
import {
  LayoutGrid,
  Activity,
  Dumbbell,
  Download,
  Crosshair,
  Footprints,
} from 'lucide-react';

type AnalysisDashboardData = Partial<UnifiedVisionAnalysisData> &
  Partial<TacticalAnalysisData> &
  Pick<
    RawVisionResponse,
    | 'modo_analisis'
    | 'tipo_analisis'
    | 'analysisMode'
    | 'nombre_equipo'
    | 'formato_juego'
    | 'duracion_segundos'
    | 'descripcion_vestimenta'
    | 'overallRating'
    | 'teamName'
    | 'opponentTeam'
    | 'youtubeId'
    | 'videoUrl'
    | 'block_data'
    | 'teamProfile'
    | 'teamHeatmapPoints'
    | 'matchContext'
  > & {
    telemetry?: Partial<UnifiedVisionAnalysisData['telemetry']> & RawTelemetryInput;
    teamSummary?: { nombreEquipo?: string; identidadJuego?: string };
  };

export default function AnalysisDashboardPage() {
  const params = useParams();
  const id = params?.id as string;

  // Analysis state
  const [data, setData] = useState<AnalysisDashboardData>(DEMO_ANALYSIS_DATA);
  const [analysisMode, setAnalysisMode] = useState<VisionAnalysisMode>('individual');
  const [isVision, setIsVision] = useState(false);

  // Local video state
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [detectedDuration, setDetectedDuration] = useState<number | undefined>(undefined);
  const [videoDims, setVideoDims] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  });

  // Interactive controls state
  const [activeSegment, setActiveSegment] = useState<TimeSegmentId>('full');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRawPoints, setShowRawPoints] = useState(false);
  const [showEvents, setShowEvents] = useState(true);
  const [videoTargetSeconds, setVideoTargetSeconds] = useState<number | null>(null);
  const [activeMobileSection, setActiveMobileSection] = useState('section-pitch');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<TacticalEvent | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const reportePdf = data?.reportePdf;
  const hasServicePdf = Boolean(reportePdf?.base64);

  const handleDownloadPdfReport = () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      downloadVisionPdfReport(reportePdf);
    } catch (err) {
      console.warn('[PDF Download] Fallback a impresión del navegador:', err);
      if (typeof window !== 'undefined') {
        window.print();
      }
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const reportActionBar = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-lg bg-stadium-surface/80 border border-stadium-border">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="inline-flex items-center px-2 py-0.5 rounded-xs bg-telemetry-cyan/15 border border-telemetry-cyan/30 text-[10px] font-mono font-bold uppercase tracking-wider text-telemetry-cyan shrink-0">
          Informe PDF
        </span>
        <span className="text-xs text-slate-300 font-sans truncate">
          {hasServicePdf
            ? `Informe generado por el servicio${reportePdf?.filename ? ` · ${reportePdf.filename}` : ''}`
            : 'Exporta o imprime el informe táctico completo de esta sesión.'}
        </span>
      </div>

      <Button
        variant="cyan"
        size="sm"
        isLoading={isDownloadingPdf}
        onClick={handleDownloadPdfReport}
        title={reportePdf?.filename || 'Descargar Informe PDF'}
        icon={<Download className="w-4 h-4" />}
        className="text-xs font-display uppercase tracking-wider font-extrabold px-4 py-2 shrink-0 self-start sm:self-auto"
      >
        {isDownloadingPdf ? 'Descargando PDF...' : 'Descargar Informe PDF'}
      </Button>
    </div>
  );

  // Load analysis dataset
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Resetear estado local de video y reproducción al cambiar de análisis (evita arrastrar datos previos)
    setLocalVideoUrl(null);
    setDetectedDuration(undefined);
    setVideoDims({ width: 1920, height: 1080 });
    setVideoTargetSeconds(null);
    setSelectedEventId(null);
    setHoveredEvent(null);
    setIsVision(false);
    setActiveSegment('full');
    setShowRawPoints(false);

    // Default demo routes
    if (id === 'verano-7-demo') {
      setData(DEMO_ANALYSIS_DATA);
      setAnalysisMode('individual');
      return;
    }

    if (id === 'dibujitos-fc-team-demo' || id === 'demo-dibujitos-fc') {
      setData(DEMO_TEAM_ANALYSIS_DATA);
      setAnalysisMode('equipo');
      return;
    }

    // Check sessionStorage
    const storedById = sessionStorage.getItem(`analysis_${id}`);
    const storedTeam = sessionStorage.getItem(`team_analysis_${id}`);
    const storedCustom = sessionStorage.getItem('customAnalysis');
    const raw = storedById || storedTeam || storedCustom;

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed) {
          setData(parsed);

          // Detect mode with maximum robustness (supports snake_case and camelCase)
          const isTeam =
            parsed.modo === 'equipo' ||
            parsed.modo_analisis === 'equipo' ||
            parsed.tipo_analisis === 'equipo' ||
            parsed.analysisMode === 'team' ||
            Boolean(parsed.blockData) ||
            Boolean(parsed.block_data) ||
            Boolean(parsed.teamProfile) ||
            id?.includes('team');

          if (isTeam) {
            setAnalysisMode('equipo');
          } else {
            setAnalysisMode('individual');
          }

          const isVisionRun = Boolean(
            parsed.isVisionAnalysis ||
              parsed.telemetry?.confidenceScore ||
              parsed.videoFileName
          );
          if (isVisionRun) {
            setIsVision(true);
            const meta = videoStore.getMetadata();
            if (parsed.videoDurationSeconds && parsed.videoDurationSeconds > 0) {
              setDetectedDuration(parsed.videoDurationSeconds);
            } else if (meta.durationSeconds > 0) {
              setDetectedDuration(meta.durationSeconds);
            }
            if (meta.width || meta.height) {
              setVideoDims({ width: meta.width, height: meta.height });
            }
          }

          if (parsed.localVideoUrl) {
            setLocalVideoUrl(parsed.localVideoUrl);
          } else if (isVisionRun) {
            const storedVideoUrl = videoStore.getVideoUrl();
            if (storedVideoUrl) {
              setLocalVideoUrl(storedVideoUrl);
            }
          }
          return;
        }
      } catch (e) {
        console.error('Failed to parse cached analysis:', e);
      }
    }
  }, [id]);

  // Jump to timestamp in video
  const handleJumpToTimestamp = (seconds: number) => {
    setVideoTargetSeconds(seconds);
    const el = document.getElementById('section-video');
    el?.scrollIntoView({ behavior: 'smooth' });
    if (window.innerWidth < 768) {
      setActiveMobileSection('section-video');
    }
  };

  const handleSelectEvent = (event: TacticalEvent) => {
    setSelectedEventId(event.id);
    handleJumpToTimestamp(event.timestampSeconds);
  };

  const handleSelectHighlightPlay = (play: VisionHighlightPlay) => {
    handleJumpToTimestamp(play.timestampSeconds);
  };

  const handleMobileNavClick = (sectionId: string) => {
    setActiveMobileSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Determine whether this analysis is for TEAM or INDIVIDUAL
  const isTeamMode =
    analysisMode === 'equipo' ||
    data.modo === 'equipo' ||
    data.modo_analisis === 'equipo' ||
    Boolean(data.blockData) ||
    Boolean(data.block_data) ||
    Boolean(data.teamProfile) ||
    id?.includes('team');

  // ==========================================================================
  // RENDER: VISTA DE ANÁLISIS DE EQUIPO (COLECTIVO)
  // ==========================================================================
  if (isTeamMode) {
    const teamName =
      data.nombreEquipo ||
      data.nombre_equipo ||
      data.teamProfile?.teamName ||
      data.teamName ||
      'Dibujitos FC';

    const opponentTeam =
      data.rival ||
      data.matchContext?.rival ||
      data.opponentTeam ||
      data.teamProfile?.opponentTeam ||
      'Rival';

    const gameFormat =
      data.formatoJuego ||
      data.formato_juego ||
      data.teamProfile?.matchFormat ||
      'Fútbol 7';

    const effectiveDuration =
      detectedDuration ||
      Number(data.videoDurationSeconds || data.duracion_segundos) ||
      undefined;

    const blockData: TeamBlockTacticalData =
      data.isVisionAnalysis && data.blockData
        ? data.blockData
        : normalizeBlockData(
            data as RawVisionResponse,
            { cameraZone: data.cameraZone },
            effectiveDuration
          );
    const jugadas: VisionHighlightPlay[] =
      data.isVisionAnalysis &&
      Array.isArray(data.jugadasDestacadas) &&
      data.jugadasDestacadas.length > 0
        ? data.jugadasDestacadas
        : normalizeHighlightPlays(data as RawVisionResponse, effectiveDuration);

    // Puntos de calor colectivos en escala estricta [0..100, 0..100]
    const rawTeamHeatmap =
      data.telemetry?.heatmapPoints ||
      data.telemetry?.heatmap_points ||
      data.teamHeatmapPoints || [
        { x: 16, y: 50, intensity: 0.92, label: 'Eje Defensivo' },
        { x: 24, y: 30, intensity: 0.84, label: 'Cobertura Izquierda' },
        { x: 28, y: 68, intensity: 0.78, label: 'Salida Derecha' },
        { x: 51.9, y: 55, intensity: 0.95, label: 'Centroide del Bloque' },
        { x: 74, y: 42, intensity: 0.72, label: 'Presión en Zona Activa' },
      ];

    const teamHeatmapPoints = isVision
      ? rawTeamHeatmap
      : rawTeamHeatmap.map((p: RawHeatmapPoint) => ({
          ...p,
          y: Number(p.y) <= 68 ? (Number(p.y) / 68) * 100 : Number(p.y),
        }));

    return (
      <div
        key={`team-${id}`}
        className="flex flex-col min-h-screen pb-20 md:pb-12 bg-stadium-base"
      >
        {/* Navbar con pill "Equipo" activo */}
        <Navbar
          breadcrumbs={[
            { label: 'Análisis Táctico', href: '/' },
            { label: `Equipo: ${teamName}`, active: true },
          ]}
          currentMatchTitle={`Análisis Colectivo • ${teamName} (${gameFormat})`}
          activeMode="equipo"
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col gap-6">
          {reportActionBar}

          {/* HEADER SCOUT EXCLUSIVO DE EQUIPO (TeamScoutCard) */}
          <section id="section-scout">
            <TeamScoutCard
              teamName={teamName}
              opponentTeam={opponentTeam}
              matchFormat={gameFormat}
              blockData={blockData}
              clothingDesc={data.descripcionVestimenta || data.descripcion_vestimenta}
              overallRating={
                data.ratingColectivo ||
                data.overallRating ||
                data.teamProfile?.overallRating ||
                8.6
              }
              identidadJuego={data.identidadJuego || data.teamSummary?.identidadJuego}
              distanciaLabel={data.telemetry?.distanciaRelativa}
              trackedEntitiesCount={
                data.telemetry?.jugadoresRastreadosEquipo ||
                data.telemetry?.trackedEntitiesCount
              }
              isVision={isVision}
              videoFileName={data.videoFileName}
              localVideoUrl={localVideoUrl}
            />
          </section>

          {/* 12-COL ASYMMETRIC GRID: CANCHA 2D COLECTIVA + VIDEO PLAYER SINCRONIZADO */}
          <section
            id="section-pitch"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-20"
          >
            {/* Izquierda (7 Cols): Cancha 2D Cenital con Mapa de Calor Colectivo */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <Card variant="default" className="p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <SectionHeader
                    tag="MAPA DE CANCHA"
                    title="Zonas de Mayor Presencia del Equipo"
                    subtitle={`Distribución del equipo en cancha de ${gameFormat}`}
                    icon={<LayoutGrid className="w-5 h-5 text-volt" />}
                    variant="volt"
                  />

                  <Badge variant="volt" size="sm">
                    {teamHeatmapPoints.length} Puntos de Calor
                  </Badge>
                </div>

                <div className="relative w-full aspect-[1000/680] bg-[#081C15] rounded-md overflow-hidden border border-volt/20">
                  <SoccerPitchSVG
                    teamName={teamName}
                    opponentTeamName={opponentTeam}
                    matchFormat={gameFormat}
                    centroid={blockData.centroideBloque}
                  >
                    {/* Capa de Calor Colectiva proyectada con projectToPitch(0..100, 0..100) */}
                    <HeatmapLayer
                      points={teamHeatmapPoints}
                      visible={showHeatmap}
                      showRawPoints={showRawPoints}
                    />
                  </SoccerPitchSVG>

                  {/* Watermark de Telemetría Homográfica */}
                  <div className="pointer-events-none absolute bottom-2 left-2 px-2.5 py-1 rounded-xs bg-stadium-base/90 border border-stadium-border text-[9px] font-mono text-volt uppercase backdrop-blur-sm flex items-center gap-1.5">
                    <Crosshair className="w-3 h-3 text-volt" />
                    <span>Centroide: [{blockData.centroideBloque.x.toFixed(1)}, {blockData.centroideBloque.y.toFixed(1)}]</span>
                  </div>

                  {/* Toggle de Depuración Visual: Ver Puntos Crudos */}
                  <button
                    type="button"
                    onClick={() => setShowRawPoints((prev) => !prev)}
                    className={`absolute bottom-2 right-2 z-20 px-2.5 py-1 rounded-xs border text-[10px] font-mono uppercase font-bold backdrop-blur-md transition-colors cursor-pointer ${
                      showRawPoints
                        ? 'bg-telemetry-cyan/25 border-telemetry-cyan text-telemetry-cyan'
                        : 'bg-stadium-base/90 border-stadium-border text-slate-300 hover:text-white'
                    }`}
                  >
                    {showRawPoints ? 'Ocultar Puntos Exactos' : 'Ver Puntos Exactos'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2 py-1.5 rounded-md bg-stadium-elevated border border-white/5 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-volt shadow-volt-glow" />
                    <span>Densidad espacial de bloque colectivo detectada mediante YOLOv8</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className="text-xs font-bold text-volt hover:underline cursor-pointer"
                  >
                    {showHeatmap ? 'Ocultar Capa Térmica' : 'Mostrar Capa Térmica'}
                  </button>
                </div>
              </Card>
            </div>

            {/* Derecha (5 Cols): Video Sincronizado + TeamSegmentTrackingCard */}
            <div id="section-video" className="lg:col-span-5 flex flex-col gap-4 scroll-mt-20">
              <SyncedVideoPlayer
                localVideoUrl={localVideoUrl}
                youtubeId={data.youtubeId || data.teamProfile?.youtubeId || '-eI9ZUNdxgw'}
                videoUrl={data.videoUrl || data.teamProfile?.videoUrl}
                isOpticalTracking={isVision}
                targetSeconds={videoTargetSeconds}
                onTargetConsumed={() => setVideoTargetSeconds(null)}
                onDurationDetected={(dur) => setDetectedDuration(dur)}
              />

              {/* TARJETA DE SEGUIMIENTO TÁCTICO DE EQUIPO (TeamSegmentTrackingCard) */}
              <TeamSegmentTrackingCard
                teamName={teamName}
                matchFormat={gameFormat}
                blockData={blockData}
                jugadasDestacadas={jugadas}
                seguimientoTactico={data.seguimientoTactico}
                onSelectPlay={handleSelectHighlightPlay}
              />
            </div>
          </section>

          {/* TARJETA TÁCTICA DEL BLOQUE (Nominal vs Detectado, Radar de Bloque, Fortalezas y Ejercicios) */}
          <section id="section-metrics" className="scroll-mt-20">
            <TeamBlockTacticalCard
              blockData={blockData}
              teamName={teamName}
              gameFormat={gameFormat}
              onJumpToTimestamp={handleJumpToTimestamp}
            />
          </section>

          {/* SECCIONES DINÁMICAS DE INFORME IA (KPIs, Fases, Posicionamiento y Plan de Acción) */}
          <VisionTacticalReportSections data={data} />
        </main>

        <MobileBottomNav
          activeSection={activeMobileSection}
          onSelectSection={handleMobileNavClick}
        />
      </div>
    );
  }

  // ==========================================================================
  // RENDER: VISTA DE ANÁLISIS INDIVIDUAL (JUGADOR)
  // ==========================================================================
  const player: PlayerScoutProfile = data.playerSummary || {
    id: 'demo-player',
    name: 'Alexis "Verano" Gómez',
    dorsal: 7,
    team: 'Dibujitos FC',
    opponentTeam: 'Rival',
    shirtColor: '#0B1F44',
    shortColor: '#0B1F44',
    bootsColor: '#A6FF00',
    matchFormat: 'Fútbol 7',
    initialPosition: 'Back Central',
    detectedRealRole: 'Líbero con Salida Limpia',
    playStyle: 'Defensor con proyección ofensiva',
    minutesAnalyzed: 60,
    overallRating: 8.4,
    matchDate: '',
    videoUrl: '',
  };

  const currentSegmentData =
    data.timeSegments?.[activeSegment] ||
    data.timeSegments?.['full'] || {
      id: 'full',
      label: 'Tramo Completo',
      timeRange: '00:00 - Fin',
      heatmapPoints: data.telemetry?.heatmapPoints || [],
      events: [],
      kpis: {
        passAccuracy: 88,
        duelsWonRate: 82,
        interceptions: 6,
        recoveries: 8,
        riskyTurnovers: 1,
        distanceCoveredKm:
          parseFloat(String(data.telemetry?.distanciaRelativa || '4.5')) || 4.5,
        topSpeedKmh: data.telemetry?.topSpeedKmh || 30.5,
      },
    };

  const effectiveIndividualDuration =
    detectedDuration ||
    Number(data.videoDurationSeconds || data.duracion_segundos) ||
    undefined;

  const rawHeatmap = currentSegmentData.heatmapPoints || [];
  const playerHeatmapPoints = isVision
    ? rawHeatmap
    : rawHeatmap.map((p: RawHeatmapPoint) => ({
        ...p,
        y: Number(p.y) <= 68 ? (Number(p.y) / 68) * 100 : Number(p.y),
      }));

  // Asegurar que ningún evento de jugador exceda la duración real del video
  const rawEvents: TacticalEvent[] = (currentSegmentData.events || []).map((ev: TacticalEvent) => ({
    ...ev,
    y: !isVision && ev.y <= 68 ? (ev.y / 68) * 100 : ev.y,
  }));
  const clampedEvents: TacticalEvent[] = effectiveIndividualDuration
    ? rawEvents.map((ev, idx) => {
        const sec = clampTimestampToDuration(
          ev.timestampSeconds,
          effectiveIndividualDuration,
          (idx + 1) / (rawEvents.length + 1)
        );
        return {
          ...ev,
          timestampSeconds: sec,
          timestampDisplay: formatSecondsToMMSS(sec),
        };
      })
    : rawEvents;

  const clampedSegmentData = {
    ...currentSegmentData,
    events: clampedEvents,
  };

  const segmentEventCounts: Record<TimeSegmentId, number> = {
    '0-10': data.timeSegments?.['0-10']?.events?.length || 0,
    '10-20': data.timeSegments?.['10-20']?.events?.length || 0,
    '20-end': data.timeSegments?.['20-end']?.events?.length || 0,
    full: data.timeSegments?.['full']?.events?.length || 0,
  };

  const distanciaRelativa =
    data.telemetry?.distanciaRelativa ||
    (currentSegmentData.kpis?.distanceCoveredKm
      ? `${currentSegmentData.kpis.distanceCoveredKm} km`
      : '4.85 km');

  const radarMetrics = data.radarMetrics || {
    defense: 86,
    distribution: 82,
    tacticalSense: 85,
    physicalIntensity: 80,
    offensiveImpact: 76,
  };

  return (
    <div
      key={`player-${id}`}
      className="flex flex-col min-h-screen pb-20 md:pb-12 bg-stadium-base"
    >
      {/* Navbar con pill "Jugador" activo */}
      <Navbar
        breadcrumbs={[
          { label: 'Análisis Táctico', href: '/' },
          { label: `${player.name} #${player.dorsal}`, active: true },
        ]}
        currentMatchTitle={`${player.team} vs ${player.opponentTeam || 'Rival'}`}
        activeMode="individual"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col gap-6">
        {reportActionBar}

        {/* BANNER DESTACADO PARA TRACKING ÓPTICO REAL (YOLOv8) */}
        {isVision && (
          <div className="p-3.5 sm:p-4 rounded-lg bg-gradient-to-r from-stadium-surface via-stadium-elevated to-stadium-surface border border-volt/40 shadow-volt-glow flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-md bg-volt/20 text-volt border border-volt/40">
                <Crosshair className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Badge variant="volt" size="sm" pulse>
                    TRACKING ÓPTICO REAL (YOLOv8)
                  </Badge>
                  <span className="text-xs font-mono text-telemetry-cyan font-bold">
                    ByteTrack + OpenCV + Gemini
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  Resumen físico y posicionamiento en cancha de {player.name} #{player.dorsal}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto bg-stadium-base px-3.5 py-1.5 rounded-md border border-volt/30">
              <Footprints className="w-4 h-4 text-volt" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase text-slate-400">
                  Distancia Relativa
                </span>
                <span className="text-sm font-mono font-black text-volt text-glow-volt">
                  {distanciaRelativa}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PLAYER SCOUT HEADER */}
        <section id="section-scout">
          <PlayerScoutCard player={player} />
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
                  tag="MAPA DE CANCHA"
                  title="Mapa de Calor y Jugadas"
                  subtitle="Recorrido del jugador y momentos clave del partido"
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
              <div className="relative w-full aspect-[1000/680] bg-stadium-base rounded-md overflow-hidden">
                <SoccerPitchSVG
                  teamName={player.team}
                  opponentTeamName={player.opponentTeam || data.rival || data.matchContext?.rival || 'Rival'}
                  matchFormat={player.matchFormat || 'Fútbol 7'}
                >
                  {/* Layer 1: Heatmap Density proyectado */}
                  <HeatmapLayer
                    points={playerHeatmapPoints}
                    visible={showHeatmap}
                    showRawPoints={showRawPoints}
                  />

                  {/* Layer 2: Key Event Markers */}
                  <EventMarkers
                    events={clampedEvents}
                    visible={showEvents}
                    onSelectEvent={handleSelectEvent}
                    onHoverEvent={setHoveredEvent}
                    hoveredEventId={hoveredEvent?.id}
                    activeEventId={selectedEventId}
                  />
                </SoccerPitchSVG>

                {/* Toggle de Depuración Visual: Ver Puntos Crudos */}
                <button
                  type="button"
                  onClick={() => setShowRawPoints((prev) => !prev)}
                  className={`absolute bottom-2 right-2 z-20 px-2.5 py-1 rounded-xs border text-[10px] font-mono uppercase font-bold backdrop-blur-md transition-colors cursor-pointer ${
                    showRawPoints
                      ? 'bg-telemetry-cyan/25 border-telemetry-cyan text-telemetry-cyan'
                      : 'bg-stadium-base/90 border-stadium-border text-slate-300 hover:text-white'
                  }`}
                >
                  {showRawPoints ? 'Ocultar Puntos Exactos' : 'Ver Puntos Exactos'}
                </button>

                {/* Proportional HTML Tooltip Overlay */}
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
              localVideoUrl={localVideoUrl}
              youtubeId={player.youtubeId || '-eI9ZUNdxgw'}
              videoUrl={player.videoUrl}
              isOpticalTracking={isVision}
              targetSeconds={videoTargetSeconds}
              onTargetConsumed={() => setVideoTargetSeconds(null)}
              onDurationDetected={(dur) => setDetectedDuration(dur)}
            />

            {/* Tracked Player Active Segment Telemetry Card */}
            <PlayerSegmentTrackingCard
              player={player}
              segment={clampedSegmentData}
              onSelectEvent={handleSelectEvent}
              seguimientoTactico={data.seguimientoTactico}
              kitDescription={
                data.descripcionVestimenta || data.playerSummary?.kitDescription
              }
              resumenTacticoCorto={data.resumenTacticoCorto}
            />
          </div>
        </section>

        {/* QUANTITATIVE METRICS: RADAR & KPI GRID */}
        <section id="section-metrics" className="flex flex-col gap-4 scroll-mt-20">
          <SectionHeader
            tag="NÚMEROS DEL PARTIDO"
            title="Estadísticas Clave"
            subtitle="Rendimiento del jugador en el tramo seleccionado"
            icon={<Activity className="w-5 h-5 text-volt" />}
            variant="volt"
          />

          <KpiGrid kpis={currentSegmentData.kpis} />

          <div className="w-full">
            <TacticalRadarChart metrics={radarMetrics} />
          </div>
        </section>

        {/* COACH DIAGNOSTIC & IMPROVEMENT PLAN */}
        <section id="section-coach" className="flex flex-col gap-4 pt-4 scroll-mt-20">
          <SectionHeader
            tag="EVALUACIÓN TÉCNICA"
            title="Análisis del Entrenador y Plan de Mejora"
            subtitle="Puntos fuertes, aspectos a mejorar y ejercicios recomendados"
            icon={<Dumbbell className="w-5 h-5 text-volt" />}
            variant="volt"
          />

          <CoachFeedbackPanel
            strengths={data.strengths || []}
            weaknesses={data.weaknesses || []}
            drills={data.recommendedDrills || []}
            tacticalNotes={data.tacticalSummaryNotes || ''}
            onJumpToTimestamp={handleJumpToTimestamp}
          />
        </section>

        {/* SECCIONES DINÁMICAS DE INFORME IA (KPIs, Fases, Posicionamiento y Plan de Acción) */}
        <VisionTacticalReportSections data={data} />
      </main>

      <MobileBottomNav
        activeSection={activeMobileSection}
        onSelectSection={handleMobileNavClick}
      />
    </div>
  );
}
