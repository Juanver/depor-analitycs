export type TacticalEventType =
  | 'pass'
  | 'shot'
  | 'tackle'
  | 'interception'
  | 'recovery'
  | 'turnover'
  | 'aerial_duel'
  | 'cross'
  | 'dribble';

export type EventCategory = 'offensive' | 'defensive' | 'distribution' | 'transition';

export type TacticalImpact = 'high' | 'medium' | 'low';

export interface HeatmapPoint {
  t?: number; // timestamp in seconds
  x: number; // 0 to 100 (% of pitch length)
  y: number; // 0 to 100 (% of pitch width)
  intensity: number; // 0.1 to 1.0 (density factor)
  label?: string;
}

export interface TacticalEvent {
  id: string;
  type: TacticalEventType;
  title: string;
  timestampSeconds: number;
  timestampDisplay: string; // e.g. "04:18"
  x: number; // 0 to 100
  y: number; // 0 to 68
  success: boolean;
  description: string;
  category: EventCategory;
  tacticalImpact: TacticalImpact;
}

export type TimeSegmentId = '0-10' | '10-20' | '20-end' | 'full';

export interface TacticalKpiContext {
  title: string;
  evaluation: string;
  detail: string;
  status: 'positive' | 'neutral' | 'warning';
}

export interface SegmentKpis {
  passAccuracy: number; // Percentage 0-100
  duelsWonRate: number; // Percentage 0-100
  interceptions: number;
  recoveries: number;
  riskyTurnovers: number;
  distanceCoveredKm: number;
  topSpeedKmh: number;
  tacticalKpis?: TacticalKpiContext[];
}

export interface TimeSegment {
  id: TimeSegmentId;
  label: string;
  timeRange: string;
  heatmapPoints: HeatmapPoint[];
  events: TacticalEvent[];
  kpis: SegmentKpis;
}

export interface RadarMetrics {
  defense: number; // 0-100
  distribution: number; // 0-100
  tacticalSense: number; // 0-100
  physicalIntensity: number; // 0-100
  offensiveImpact: number; // 0-100
}

export type MatchFormat = 'Fútbol 7' | 'Fútbol 11';

export interface PlayerScoutProfile {
  id: string;
  name: string;
  dorsal: number;
  team: string;
  opponentTeam?: string;
  shirtColor: string;
  shortColor?: string;
  socksColor?: string;
  bootsColor?: string;
  kitDescription?: string;
  detectedColor?: string;
  matchFormat?: MatchFormat;
  initialPosition: string;
  detectedRealRole: string;
  playStyle?: string;
  minutesAnalyzed: number;
  overallRating: number; // 0.0 to 10.0
  matchDate?: string;
  competition?: string;
  videoUrl: string;
  youtubeId?: string;
}

export interface CoachStrength {
  id: string;
  title: string;
  description: string;
  timestampSeconds: number;
  timestampDisplay: string;
  category: string;
}

export interface CoachWeakness {
  id: string;
  title: string;
  diagnostic: string;
  rootCause: string;
  timestampSeconds: number;
  timestampDisplay: string;
  severity: 'critical' | 'moderate' | 'minor';
}

export interface RecommendedDrill {
  id: string;
  name: string;
  targetSkill: string;
  objective: string;
  durationMinutes: number;
  intensity: 'Alta' | 'Media' | 'Baja';
  steps: string[];
  equipment: string[];
}

export interface TacticalAnalysisData {
  playerSummary: PlayerScoutProfile;
  radarMetrics: RadarMetrics;
  timeSegments: Record<TimeSegmentId, TimeSegment>;
  strengths: CoachStrength[];
  weaknesses: CoachWeakness[];
  recommendedDrills: RecommendedDrill[];
  tacticalSummaryNotes: string;
}

export interface MatchSetupFormInput {
  videoUrl: string;
  dorsal: number;
  playerName: string;
  shirtColor: string;
  shortColor: string;
  socksColor?: string;
  bootsColor: string;
  matchFormat: MatchFormat;
  teamName: string;
  initialPosition: string;
  videoFile?: File | null;
}

export interface VisionMatchContext {
  formatoJuego: string;
  sistemaTacticoNominal: string;
}

export interface VisionTeamBlockMetrics {
  solidezDefensiva: number;
  presionTrasPerdida: number;
  amplitudBandas: number;
  transicionOfensiva: number;
  compactacion: number;
}

export interface VisionTeamFinding {
  titulo: string;
  detalle: string;
  timestampSeconds: number;
}

export interface VisionTeamTrainingDrill {
  titulo: string;
  enfoque: string;
  duracion: string;
  descripcion: string;
}

export interface VisionTeamSummary {
  nombreEquipo: string;
  vestimenta: string;
  colorFiltroAplicado?: string;
  sistemaTacticoNominal: string;
  sistemaTacticoDetectado: string;
  comparativaNominalVsReal: string;
  ratingColectivo: number;
  identidadJuego: string;
  metricasBloque: VisionTeamBlockMetrics;
  fortalezasColectivas: VisionTeamFinding[];
  debilidadesColectivas: VisionTeamFinding[];
  ajustesEntrenamientoEquipo: VisionTeamTrainingDrill[];
}

export interface VisionTeamTelemetry {
  jugadoresRastreadosEquipo: number;
  centroideBloque: { x: number; y: number };
  amplitudPorcentaje: number;
  profundidadPorcentaje: number;
  distanciaAcumulada: number;
  heatmapPoints: HeatmapPoint[];
}

export interface VisionTeamResponse {
  modo: 'equipo';
  matchContext: VisionMatchContext;
  teamSummary: VisionTeamSummary;
  telemetry: VisionTeamTelemetry;
}

export interface VisionIndividualResponse {
  modo: 'individual';
  matchContext?: VisionMatchContext;
  playerSummary: PlayerScoutProfile;
  telemetry: {
    distanciaRelativa?: string;
    heatmapPoints: HeatmapPoint[];
  };
}

export type VisionAnalysisPayload = VisionTeamResponse | VisionIndividualResponse;
