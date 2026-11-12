import { MatchFormat, TacticalImpact, TimeSegmentId } from './analysis';

export interface PassingNetworkNode {
  playerId: string;
  name: string;
  dorsal: number;
  nominalPosition: string;
  averageX: number; // 0 to 100
  averageY: number; // 0 to 68
  passCount: number;
}

export interface PassingConnection {
  fromPlayerId: string;
  toPlayerId: string;
  count: number;
  weight: number; // 1 to 5 for visual thickness
}

export interface TeamTacticalEvent {
  id: string;
  title: string;
  timestampSeconds: number;
  timestampDisplay: string;
  x: number;
  y: number;
  type: 'goal' | 'high_press' | 'buildup' | 'counter_attack' | 'set_piece' | 'defensive_block' | 'turnover';
  description: string;
  phase: 'ofensiva' | 'defensiva' | 'transicion' | 'balon_parado' | 'iniciacion';
  impact: TacticalImpact;
}

export interface TeamPhaseMetric {
  phaseName: string;
  effectivenessRate: number; // 0 to 100
  rating: string; // e.g. "Sobresaliente", "Sólido", "Ajustar"
  summary: string;
  strengths: string[];
  vulnerabilities: string[];
}

export interface TeamCollectiveKpis {
  possessionPercentage: number;
  totalPasses: number;
  passAccuracyPercentage: number;
  totalShots: number;
  shotsOnTarget: number;
  interceptionsAndTackles: number;
  recoveriesOpponentHalf: number;
  ppda: number; // Passes per Defensive Action (lower = more aggressive press)
  teamCompactnessMeters: number; // Avg distance between defensive line and attackers
  duelsWonPercentage: number;
}

export interface TeamTacticalProfile {
  id: string;
  teamName: string;
  opponentTeam: string;
  competition: string;
  matchDate: string;
  matchFormat: MatchFormat;
  shirtColor: string;
  opponentShirtColor: string;
  tacticalFormation: string; // e.g. "2-3-1 (Fútbol 7)" or "4-3-3"
  collectiveStyle: string; // e.g. "Presión Alta y Salida Combinativa"
  overallRating: number; // 0.0 to 10.0
  finalScore: string; // e.g. "4 - 2"
  videoUrl: string;
  youtubeId?: string;
  tacticalFocusAnalyzed?: string; // e.g. "Amplitud por bandas y bloque medio"
}

export interface TeamDrill {
  id: string;
  name: string;
  objective: string;
  targetPhase: string;
  durationMinutes: number;
  intensity: 'Alta' | 'Media' | 'Baja';
  playerCount: string;
  steps: string[];
  equipment: string[];
}

export interface TeamCollectiveAnalysisData {
  teamProfile: TeamTacticalProfile;
  collectiveKpis: TeamCollectiveKpis;
  passingNetwork: {
    nodes: PassingNetworkNode[];
    connections: PassingConnection[];
  };
  teamHeatmapPoints: {
    x: number;
    y: number;
    intensity: number;
    label?: string;
  }[];
  collectiveEvents: TeamTacticalEvent[];
  phasesAnalysis: {
    iniciacion: TeamPhaseMetric;
    progresion: TeamPhaseMetric;
    bloqueDefensivo: TeamPhaseMetric;
    transiciones: TeamPhaseMetric;
  };
  collectiveStrengths: {
    title: string;
    description: string;
    timestampSeconds: number;
    timestampDisplay: string;
    category: string;
  }[];
  collectiveWeaknesses: {
    title: string;
    diagnostic: string;
    rootCause: string;
    timestampSeconds: number;
    timestampDisplay: string;
    severity: 'critical' | 'moderate' | 'minor';
  }[];
  teamRecommendedDrills: TeamDrill[];
  masterCoachNotes: string;
}

export interface TeamSetupFormInput {
  videoUrl: string;
  teamName: string;
  opponentTeam: string;
  matchFormat: MatchFormat;
  shirtColor: string;
  opponentShirtColor?: string;
  tacticalFocus?: string;
  formationNominal?: string;
}
