import {
  HeatmapPoint,
  MatchFormat,
  PlayerScoutProfile,
  RadarMetrics,
  CoachStrength,
  CoachWeakness,
  RecommendedDrill,
  TimeSegment,
  TimeSegmentId,
  TacticalEvent,
} from './analysis';

export type VisionAnalysisMode = 'individual' | 'equipo';

export type VisionGameFormat = 'Fútbol 5' | 'Fútbol 7' | 'Fútbol 9' | 'Fútbol 11';

export type CameraVisibleZone =
  | 'campo_completo'
  | 'mitad_izquierda'
  | 'mitad_derecha'
  | 'zona_media';

export interface VisionFormData {
  video: File;
  modo_analisis: VisionAnalysisMode;
  formato_juego: VisionGameFormat | string;
  sistema_tactico_nominal: string;
  nombre_jugador?: string;
  dorsal?: string;
  posicion?: string;
  nombre_equipo: string;
  descripcion_vestimenta: string;
  videoDurationSeconds?: number;
  videoWidth?: number;
  videoHeight?: number;
  cameraZone?: CameraVisibleZone;
  useMock?: boolean;
}

export interface VisionTelemetry {
  heatmapPoints: HeatmapPoint[];
  distanciaRelativa?: string; // e.g. "4.85 km" o "3.420 m"
  distanciaAcumulada?: number;
  jugadoresRastreadosEquipo?: number;
  topSpeedKmh?: number;
  totalFramesAnalyzed?: number;
  fpsAnalyzed?: number;
  trackedEntitiesCount?: number;
  confidenceScore?: number;
}

export interface TeamBlockRadarMetrics {
  solidezDefensiva: number; // 0-100
  presionTrasPerdida: number; // 0-100
  amplitudBandas: number; // 0-100
  transicionOfensiva: number; // 0-100
  compactacion: number; // 0-100
}

export interface CollectiveStrength {
  title: string;
  description: string;
  timestampSeconds?: number;
  timestampDisplay?: string;
  category?: string;
}

export interface CollectiveWeakness {
  title: string;
  diagnostic: string;
  rootCause?: string;
  timestampSeconds?: number;
  timestampDisplay?: string;
  severity?: 'critical' | 'moderate' | 'minor';
}

export interface TeamTrainingAdjustment {
  name: string;
  objective: string;
  durationMinutes: number;
  intensity: 'Alta' | 'Media' | 'Baja';
  steps: string[];
  equipment?: string[];
}

export interface TeamBlockTacticalData {
  sistemaNominal: string; // e.g. "1-2-3-1" o "1-4-3-3"
  sistemaDetectado: string; // e.g. "1-3-2-1 Asimétrico"
  comparativaNominalVsReal: string; // Detalle de la mutación del bloque en cancha
  centroideBloque: {
    x: number; // 0-100
    y: number; // 0-68
  };
  amplitud: number; // Porcentaje de amplitud ocupada de la cancha (0-100%)
  profundidad: number; // Porcentaje de profundidad ocupada de la cancha (0-100%)
  radarBloque: TeamBlockRadarMetrics;
  fortalezasColectivas: CollectiveStrength[];
  debilidadesColectivas: CollectiveWeakness[];
  ajustesEntrenamientoEquipo: TeamTrainingAdjustment[];
}

export interface VisionHighlightPlay {
  id: string;
  title: string;
  timestampSeconds: number;
  timestampDisplay: string;
  description: string;
  phase?: string;
  impact?: 'high' | 'medium' | 'low';
  estado?: string;
  x?: number;
  y?: number;
}

export interface VisionSeguimientoPlay {
  titulo: string;
  detalle: string;
  timestampSeconds: number;
  timestampLabel: string;
  estado: string;
  x: number;
  y: number;
}

export interface VisionSeguimientoTactico {
  accionesClaveCount: number;
  pasesExitoPct: number;
  duelos1v1Pct: number;
  cortesAnticipaciones: number;
  resumenCorto: string;
  jugadasReales: VisionSeguimientoPlay[];
}

export interface VisionKpiCuantitativo {
  id: string;
  titulo: string;
  valor: number;
  unidad: string;
  badge: string;
  subtitulo: string;
  progreso: number;
  promedioReferencia: string;
  valoracionPdf: string;
}

export interface VisionKpiCualitativo {
  titulo: string;
  badge: string;
  detalle: string;
}

export interface VisionFaseItem {
  titulo: string;
  detalle: string;
}

export interface VisionRendimientoPorFases {
  faseOfensiva: VisionFaseItem[];
  faseDefensiva: VisionFaseItem[];
}

export interface VisionPosicionamientoCriterio {
  label: string;
  porcentaje: number;
}

export interface VisionEvaluacionPosicionamiento {
  cumplimientoPosicional: number;
  criterios: VisionPosicionamientoCriterio[];
  diagnostico: string;
}

export interface VisionConclusionPlanAccion {
  titulo: string;
  detalle: string;
}

export interface VisionReportePdf {
  filename: string;
  mimeType: string;
  base64: string;
}

/**
 * Respuesta consolidada que devuelve el endpoint Python /api/vision/analyze
 * o que mapea el frontend para el Dashboard /analisis/[id].
 */
export interface UnifiedVisionAnalysisData {
  id: string;
  modo: VisionAnalysisMode;
  isVisionAnalysis: true;
  formatoJuego: string;
  sistemaTacticoNominal: string;
  rival?: string;
  duracionVideoSegundos?: number;
  duracionFormato?: string;
  tramoAnalizado?: string;
  nombreEquipo: string;
  descripcionVestimenta: string;
  videoFileName?: string;
  localVideoUrl?: string; // blob: url or local object url
  videoDurationSeconds?: number;
  cameraZone?: CameraVisibleZone;
  telemetry: VisionTelemetry;

  // Reporte PDF generado por el backend
  reportePdf?: VisionReportePdf;

  // Secciones enriquecidas compartidas (Individual y Equipo)
  impactoTacticoBadge?: string;
  dictamenTactico?: string;
  resumenTacticoCorto?: string;
  resumenEjecutivo?: string;
  seguimientoTactico?: VisionSeguimientoTactico;
  kpisCuantitativos?: VisionKpiCuantitativo[];
  evaluacionCualitativaKpis?: VisionKpiCualitativo[];
  rendimientoPorFases?: VisionRendimientoPorFases;
  evaluacionPosicionamientoTactico?: VisionEvaluacionPosicionamiento;
  conclusionesPlanAccion?: VisionConclusionPlanAccion[];

  // Si modo === "individual"
  playerSummary?: PlayerScoutProfile;
  radarMetrics?: RadarMetrics;
  radarPromedioPosicional?: RadarMetrics;
  timeSegments?: Record<TimeSegmentId, TimeSegment>;
  strengths?: CoachStrength[];
  weaknesses?: CoachWeakness[];
  recommendedDrills?: RecommendedDrill[];
  tacticalSummaryNotes?: string;

  // Si modo === "equipo"
  ratingColectivo?: number;
  identidadJuego?: string;
  metricasBloqueReferencia?: TeamBlockRadarMetrics;
  blockData?: TeamBlockTacticalData;
  jugadasDestacadas?: VisionHighlightPlay[];
  masterCoachNotes?: string;
}

export interface RawHeatmapPoint extends HeatmapPoint {
  t?: number;
}

export interface RawRadarInput {
  defensa?: number;
  defense?: number;
  defending?: number;
  distribucion?: number;
  distribution?: number;
  tactica?: number;
  tacticalSense?: number;
  intensidad?: number;
  physicalIntensity?: number;
  ofensiva?: number;
  offensiveImpact?: number;
}

export interface RawTeamRadarInput {
  solidezDefensiva?: number;
  solidez_defensiva?: number;
  presionTrasPerdida?: number;
  presion_tras_perdida?: number;
  amplitudBandas?: number;
  amplitud_bandas?: number;
  transicionOfensiva?: number;
  transicion_ofensiva?: number;
  compactacion?: number;
}

export interface RawTacticalItemInput {
  id?: string;
  title?: string;
  titulo?: string;
  description?: string;
  descripcion?: string;
  detalle?: string;
  diagnostic?: string;
  rootCause?: string;
  causaRaiz?: string;
  severity?: 'critical' | 'moderate' | 'minor';
  category?: string;
  timestampSeconds?: number;
  timestamp_seconds?: number;
}

export interface RawDrillInput {
  id?: string;
  name?: string;
  titulo?: string;
  targetSkill?: string;
  enfoque?: string;
  objective?: string;
  descripcion?: string;
  durationMinutes?: number;
  duracion?: string | number;
  intensity?: 'Alta' | 'Media' | 'Baja';
  steps?: string[];
  equipment?: string[];
}

export interface RawHighlightPlayInput {
  id?: string;
  title?: string;
  titulo?: string;
  description?: string;
  descripcion?: string;
  detalle?: string;
  timestampSeconds?: number;
  timestamp_seconds?: number;
  second?: number;
  timestampLabel?: string;
  phase?: string;
  fase?: string;
  impact?: 'high' | 'medium' | 'low';
  impacto?: 'high' | 'medium' | 'low';
  estado?: string;
  x?: number;
  y?: number;
}

export interface RawBlockDataInput {
  sistemaNominal?: string;
  sistema_nominal?: string;
  sistemaDetectado?: string;
  sistema_detectado?: string;
  comparativaNominalVsReal?: string;
  comparativa_nominal_vs_real?: string;
  comparativa?: string;
  centroideBloque?: { x?: number; y?: number };
  centroide_bloque?: { x?: number; y?: number };
  centroide?: { x?: number; y?: number };
  amplitud?: number;
  profundidad?: number;
  radarBloque?: RawTeamRadarInput;
  radar_bloque?: RawTeamRadarInput;
  fortalezasColectivas?: RawTacticalItemInput[];
  fortalezas_colectivas?: RawTacticalItemInput[];
  debilidadesColectivas?: RawTacticalItemInput[];
  debilidades_colectivas?: RawTacticalItemInput[];
  ajustesEntrenamientoEquipo?: RawDrillInput[];
  ajustes_entrenamiento_equipo?: RawDrillInput[];
}

export interface RawPlayerSummaryInput {
  nombre?: string;
  name?: string;
  dorsal?: number | string;
  equipo?: string;
  team?: string;
  matchFormat?: string;
  opponentTeam?: string;
  posicionInicial?: string;
  initialPosition?: string;
  rolDetectado?: string;
  detectedRealRole?: string;
  ratingGlobal?: number;
  overallRating?: number;
  estiloJuego?: string;
  playStyle?: string;
  vestimenta?: string;
  colorDetectadoIA?: string;
  radarMetrics?: RawRadarInput;
  radarPromedioPosicional?: RawRadarInput;
  impactoTacticoBadge?: string;
  dictamenTactico?: string;
  resumenTacticoCorto?: string;
  resumenEjecutivo?: string;
  evaluacionPosicionamientoTactico?: VisionEvaluacionPosicionamiento;
  fortalezas?: RawTacticalItemInput[];
  areasMejora?: RawTacticalItemInput[];
  ejerciciosRecomendados?: RawDrillInput[];
  videoUrl?: string;
  youtubeId?: string;
  kitDescription?: string;
}

export interface RawTeamSummaryInput {
  nombreEquipo?: string;
  sistemaTacticoNominal?: string;
  sistemaTacticoDetectado?: string;
  comparativaNominalVsReal?: string;
  vestimenta?: string;
  ratingColectivo?: number;
  identidadJuego?: string;
  radarBloque?: RawTeamRadarInput;
  metricasBloque?: RawTeamRadarInput;
  metricasBloqueReferencia?: RawTeamRadarInput;
  fortalezasColectivas?: RawTacticalItemInput[];
  debilidadesColectivas?: RawTacticalItemInput[];
  ajustesEntrenamientoEquipo?: RawDrillInput[];
  impactoTacticoBadge?: string;
  dictamenTactico?: string;
  resumenTacticoCorto?: string;
  resumenEjecutivo?: string;
  evaluacionPosicionamientoTactico?: VisionEvaluacionPosicionamiento;
}

export interface RawMatchContextInput {
  rival?: string;
  formatoJuego?: string;
  sistemaTacticoNominal?: string;
  duracionVideoSegundos?: number;
  duracionFormato?: string;
  tramoAnalizado?: string;
}

export interface RawTelemetryInput {
  heatmapPoints?: RawHeatmapPoint[];
  heatmap_points?: RawHeatmapPoint[];
  distanciaRelativa?: string | number;
  distancia_relativa?: string | number;
  distanciaAcumulada?: number;
  jugadoresRastreadosEquipo?: number;
  topSpeedKmh?: number;
  top_speed_kmh?: number;
  totalFramesAnalyzed?: number;
  total_frames_analyzed?: number;
  fpsAnalyzed?: number;
  fps_analyzed?: number;
  trackedEntitiesCount?: number;
  tracked_entities_count?: number;
  confidenceScore?: number;
  confidence_score?: number;
  centroideBloque?: { x?: number; y?: number };
  amplitudPorcentaje?: number;
  profundidadPorcentaje?: number;
  totalJugadoresDetectados?: number;
}

export interface RawVisionResponse {
  id?: string;
  modo?: VisionAnalysisMode;
  modo_analisis?: VisionAnalysisMode;
  tipo_analisis?: string;
  analysisMode?: string;
  isVisionAnalysis?: boolean;
  youtubeId?: string;
  videoUrl?: string;
  formatoJuego?: string;
  formato_juego?: string;
  sistemaTacticoNominal?: string;
  sistema_tactico_nominal?: string;
  comparativaNominalVsReal?: string;
  comparativa_nominal_vs_real?: string;
  nombreEquipo?: string;
  nombre_equipo?: string;
  teamName?: string;
  opponentTeam?: string;
  rival?: string;
  descripcionVestimenta?: string;
  descripcion_vestimenta?: string;
  videoFileName?: string;
  localVideoUrl?: string;
  local_video_url?: string;
  videoDurationSeconds?: number;
  duracion_segundos?: number;
  duracionVideoSegundos?: number;
  duracionFormato?: string;
  tramoAnalizado?: string;
  cameraZone?: CameraVisibleZone;
  camera_zone?: CameraVisibleZone;
  ratingColectivo?: number;
  overallRating?: number;
  identidadJuego?: string;
  impactoTacticoBadge?: string;
  dictamenTactico?: string;
  resumenTacticoCorto?: string;
  resumenEjecutivo?: string;
  tacticalSummaryNotes?: string;
  resumen_tactico?: string;
  masterCoachNotes?: string;
  notas_entrenador?: string;
  centroide?: { x?: number; y?: number };
  amplitud?: number;
  profundidad?: number;
  reportePdf?: VisionReportePdf;
  telemetry?: RawTelemetryInput;
  teamHeatmapPoints?: RawHeatmapPoint[];
  matchContext?: RawMatchContextInput;
  match_context?: RawMatchContextInput;
  playerSummary?: RawPlayerSummaryInput;
  player_summary?: RawPlayerSummaryInput;
  teamSummary?: RawTeamSummaryInput;
  team_summary?: RawTeamSummaryInput;
  teamProfile?: {
    teamName?: string;
    opponentTeam?: string;
    matchFormat?: string;
    overallRating?: number;
    tacticalIdentity?: string;
    formationUsed?: string;
    detectedFormation?: string;
    coachSummary?: string;
    playerCount?: number;
    youtubeId?: string;
    videoUrl?: string;
  };
  radarMetrics?: RawRadarInput;
  radar_metrics?: RawRadarInput;
  radarBloque?: RawTeamRadarInput;
  radar_bloque?: RawTeamRadarInput;
  radarPromedioPosicional?: RawRadarInput;
  metricasBloqueReferencia?: RawTeamRadarInput;
  blockData?: RawBlockDataInput;
  block_data?: RawBlockDataInput;
  fortalezasColectivas?: RawTacticalItemInput[];
  fortalezas_colectivas?: RawTacticalItemInput[];
  debilidadesColectivas?: RawTacticalItemInput[];
  debilidades_colectivas?: RawTacticalItemInput[];
  ajustesEntrenamientoEquipo?: RawDrillInput[];
  ajustes_entrenamiento_equipo?: RawDrillInput[];
  jugadasDestacadas?: RawHighlightPlayInput[];
  jugadas_destacadas?: RawHighlightPlayInput[];
  collectiveEvents?: RawHighlightPlayInput[];
  collective_events?: RawHighlightPlayInput[];
  events?: RawHighlightPlayInput[];
  seguimientoTactico?: VisionSeguimientoTactico;
  kpisCuantitativos?: VisionKpiCuantitativo[];
  evaluacionCualitativaKpis?: VisionKpiCualitativo[];
  rendimientoPorFases?: VisionRendimientoPorFases;
  evaluacionPosicionamientoTactico?: VisionEvaluacionPosicionamiento;
  conclusionesPlanAccion?: VisionConclusionPlanAccion[];
  strengths?: RawTacticalItemInput[];
  fortalezas?: RawTacticalItemInput[];
  weaknesses?: RawTacticalItemInput[];
  debilidades?: RawTacticalItemInput[];
  recommendedDrills?: RawDrillInput[];
  drills?: RawDrillInput[];
  timeSegments?: Record<TimeSegmentId, TimeSegment>;
  time_segments?: Record<TimeSegmentId, TimeSegment>;
  tacticalRadar?: RadarMetrics;
  matchFormat?: MatchFormat;
}
