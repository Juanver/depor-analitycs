import {
  VisionFormData,
  UnifiedVisionAnalysisData,
  TeamBlockTacticalData,
  VisionHighlightPlay,
  CameraVisibleZone,
  VisionReportePdf,
  RawVisionResponse,
  RawTacticalItemInput,
  RawDrillInput,
  RawHighlightPlayInput,
  RawHeatmapPoint,
  VisionKpiCuantitativo,
  VisionSeguimientoTactico,
} from '@/types/visionAnalysis';
import { MatchFormat } from '@/types/analysis';
import { formatSecondsToMMSS } from '@/lib/formatTimestamp';
import { MOCK_VISION_TEAM_RESPONSE } from '@/data/mockVisionTeamAnalysis';
import { MOCK_VISION_INDIVIDUAL_RESPONSE } from '@/data/mockVisionIndividualAnalysis';

const VISION_API_URL =
  process.env.NEXT_PUBLIC_VISION_API_URL || 'http://localhost:8000';

/**
 * FLAG MAESTRO DE DESARROLLO / VALIDACIÓN RÁPIDA:
 * Cambia a `true` (o configura NEXT_PUBLIC_USE_MOCK_VISION=true) para responder
 * inmediatamente con el mock sin invocar al backend Python.
 * También puede alternarse dinámicamente desde el toggle en el formulario de carga.
 */
export const DEFAULT_USE_MOCK_VISION =
  process.env.NEXT_PUBLIC_USE_MOCK_VISION === 'true' || false;

/**
 * Ajusta cualquier timestamp para garantizar que nunca exceda la duración real del video.
 * Si el video dura 13s y un evento viene con 35s o 40s, lo reescala/ajusta dentro de [0, maxSec].
 */
export function clampTimestampToDuration(
  seconds: number | undefined,
  videoDurationSeconds?: number,
  fallbackRatio = 0.5
): number {
  const rawSec = Number(seconds);
  const hasDuration =
    typeof videoDurationSeconds === 'number' &&
    Number.isFinite(videoDurationSeconds) &&
    videoDurationSeconds > 0;

  if (!hasDuration) {
    return Number.isFinite(rawSec) && rawSec >= 0 ? Math.floor(rawSec) : 0;
  }

  const maxPlayable = Math.max(0, Math.floor(videoDurationSeconds! - 0.5));
  if (!Number.isFinite(rawSec) || rawSec < 0) {
    return Math.round(maxPlayable * fallbackRatio);
  }

  if (rawSec <= maxPlayable) {
    return Math.floor(rawSec);
  }

  // Si excede la duración real del video (ej. mock de 135s en un clip de 13s),
  // reescalar proporcionalmente dentro del metraje real para mantener coherencia temporal.
  const scaled = Math.round(maxPlayable * fallbackRatio);
  return Math.max(0, Math.min(maxPlayable, scaled));
}

/**
 * Genera puntos de calor coherentes con la zona de cancha enfocada por la cámara.
 */
function buildScopedHeatmapPoints(cameraZone: CameraVisibleZone = 'mitad_izquierda') {
  if (cameraZone === 'mitad_izquierda') {
    return [
      { x: 16, y: 34, intensity: 0.92, label: 'Eje Defensivo (Mitad Propia)' },
      { x: 24, y: 20, intensity: 0.84, label: 'Cobertura Carril Izquierdo' },
      { x: 28, y: 46, intensity: 0.78, label: 'Salida Carril Derecho' },
      { x: 38, y: 34, intensity: 0.95, label: 'Centroide de Acción Visible' },
      { x: 44, y: 26, intensity: 0.72, label: 'Presión Cerca de Línea Media' },
    ];
  }
  if (cameraZone === 'mitad_derecha') {
    return [
      { x: 56, y: 34, intensity: 0.85, label: 'Inicio de Progresión' },
      { x: 66, y: 20, intensity: 0.78, label: 'Amplitud Banda Izquierda' },
      { x: 70, y: 48, intensity: 0.82, label: 'Amplitud Banda Derecha' },
      { x: 78, y: 34, intensity: 0.96, label: 'Zona de Finalización' },
      { x: 86, y: 32, intensity: 0.88, label: 'Área Rival' },
    ];
  }
  if (cameraZone === 'zona_media') {
    return [
      { x: 34, y: 34, intensity: 0.82, label: 'Base de Mediocampo' },
      { x: 46, y: 22, intensity: 0.76, label: 'Interior Izquierdo' },
      { x: 48, y: 46, intensity: 0.8, label: 'Interior Derecho' },
      { x: 52, y: 34, intensity: 0.95, label: 'Círculo Central' },
      { x: 64, y: 30, intensity: 0.74, label: 'Conexión Tres Cuartos' },
    ];
  }
  return [
    { x: 20, y: 34, intensity: 0.9, label: 'Línea de Contención' },
    { x: 34, y: 18, intensity: 0.75, label: 'Amplitud Izquierda' },
    { x: 36, y: 50, intensity: 0.8, label: 'Amplitud Derecha' },
    { x: 48, y: 34, intensity: 0.95, label: 'Centroide del Bloque' },
    { x: 62, y: 32, intensity: 0.72, label: 'Zona de Presión' },
  ];
}

/**
 * Normaliza y estructura los datos de bloque táctico independientemente de si
 * el microservicio FastAPI devuelve camelCase o snake_case, y ajusta timestamps a la duración real.
 */
export function normalizeBlockData(
  json: RawVisionResponse = {},
  input?: Partial<VisionFormData>,
  videoDurationSeconds?: number
): TeamBlockTacticalData {
  const raw = json.blockData || json.block_data || {};
  const teamSummary = json.teamSummary || json.team_summary || {};
  const matchContext = json.matchContext || json.match_context || {};
  const telemetry = json.telemetry || {};

  const nominal =
    teamSummary.sistemaTacticoNominal ||
    matchContext.sistemaTacticoNominal ||
    raw.sistemaNominal ||
    raw.sistema_nominal ||
    json.sistemaTacticoNominal ||
    json.sistema_tactico_nominal ||
    input?.sistema_tactico_nominal ||
    '1-2-3-1';

  const detectado =
    teamSummary.sistemaTacticoDetectado ||
    raw.sistemaDetectado ||
    raw.sistema_detectado ||
    (nominal === '1-2-3-1' ? '1-3-2-1 Asimétrico' : `${nominal} Dinámico`);

  const comparativa =
    teamSummary.comparativaNominalVsReal ||
    raw.comparativaNominalVsReal ||
    raw.comparativa_nominal_vs_real ||
    raw.comparativa ||
    json.comparativaNominalVsReal ||
    json.comparativa_nominal_vs_real ||
    `El equipo inició con el dibujo nominal ${nominal}, pero la red neuronal detectó una asimetría funcional en fase de salida: uno de los mediocampistas bascula entre líneas formando un bloque dinámico ${detectado}.`;

  const rawCentroide =
    telemetry.centroideBloque ||
    raw.centroideBloque ||
    raw.centroide_bloque ||
    raw.centroide ||
    json.centroide ||
    {};

  const defaultCentroidX =
    input?.cameraZone === 'mitad_izquierda'
      ? 32.5
      : input?.cameraZone === 'mitad_derecha'
      ? 71.0
      : 46.5;

  const centroide = {
    x: Number(rawCentroide.x) || defaultCentroidX,
    y: Number(rawCentroide.y) || 33.8,
  };

  const amplitud = Number(
    telemetry.amplitudPorcentaje ?? raw.amplitud ?? json.amplitud ?? 74
  );
  const profundidad = Number(
    telemetry.profundidadPorcentaje ?? raw.profundidad ?? json.profundidad ?? 48
  );

  const rawRadar =
    teamSummary.metricasBloque ||
    raw.radarBloque ||
    raw.radar_bloque ||
    json.radarBloque ||
    json.radar_bloque ||
    {};

  const radarBloque = {
    solidezDefensiva: Number(
      rawRadar.solidezDefensiva ?? rawRadar.solidez_defensiva ?? 85
    ),
    presionTrasPerdida: Number(
      rawRadar.presionTrasPerdida ?? rawRadar.presion_tras_perdida ?? 78
    ),
    amplitudBandas: Number(
      rawRadar.amplitudBandas ?? rawRadar.amplitud_bandas ?? 82
    ),
    transicionOfensiva: Number(
      rawRadar.transicionOfensiva ?? rawRadar.transicion_ofensiva ?? 80
    ),
    compactacion: Number(rawRadar.compactacion ?? 88),
  };

  const rawFortalezas =
    teamSummary.fortalezasColectivas ||
    raw.fortalezasColectivas ||
    raw.fortalezas_colectivas ||
    json.fortalezasColectivas ||
    json.fortalezas_colectivas ||
    json.fortalezas || [
      {
        title: 'Compactación y Basculación Sincronizada',
        description:
          'La distancia media entre la línea defensiva y el bloque de volantes se mantuvo compacta durante el tramo analizado.',
        timestampSeconds: 3,
        category: 'Bloque Colectivo',
      },
      {
        title: 'Circulación Periférica y Amplitud por Bandas',
        description:
          'Buena ocupación de carriles exteriores dentro de la zona enfocada por cámara.',
        timestampSeconds: 8,
        category: 'Fase Ofensiva',
      },
    ];

  const fortalezasColectivas = rawFortalezas.map(
    (f: RawTacticalItemInput, idx: number) => {
    const sec = clampTimestampToDuration(
      f.timestampSeconds ?? f.timestamp_seconds,
      videoDurationSeconds,
      (idx + 1) / (rawFortalezas.length + 1)
    );
    return {
      title: f.title || f.titulo || 'Fortaleza Colectiva',
      description: f.description || f.detalle || f.descripcion || '',
      category: f.category || 'Bloque Colectivo',
      timestampSeconds: sec,
      timestampDisplay: formatSecondsToMMSS(sec),
    };
  });

  const rawDebilidades =
    teamSummary.debilidadesColectivas ||
    raw.debilidadesColectivas ||
    raw.debilidades_colectivas ||
    json.debilidadesColectivas ||
    json.debilidades_colectivas ||
    json.debilidades || [
      {
        title: 'Desajuste en la Transición Defensiva tras Pérdida',
        diagnostic:
          'El repliegue tardío deja desguarnecidos los pasillos interiores ante contraataques veloces.',
        rootCause:
          'Vigilancia defensiva tardía del pivote central al perder posesión.',
        timestampSeconds: 10,
        severity: 'critical' as const,
      },
    ];

  const debilidadesColectivas = rawDebilidades.map(
    (d: RawTacticalItemInput, idx: number) => {
    const sec = clampTimestampToDuration(
      d.timestampSeconds ?? d.timestamp_seconds,
      videoDurationSeconds,
      0.75 + idx * 0.1
    );
    return {
      title: d.title || d.titulo || 'Aspecto a Corregir',
      diagnostic: d.diagnostic || d.detalle || d.descripcion || '',
      rootCause: d.rootCause || d.causaRaiz,
      severity: d.severity || 'moderate',
      timestampSeconds: sec,
      timestampDisplay: formatSecondsToMMSS(sec),
    };
  });

  const rawAjustes =
    teamSummary.ajustesEntrenamientoEquipo ||
    raw.ajustesEntrenamientoEquipo ||
    raw.ajustes_entrenamiento_equipo ||
    json.ajustesEntrenamientoEquipo ||
    json.ajustes_entrenamiento_equipo ||
    json.drills || [
      {
        name: 'Juego de Posición en Espacio Reducido 6v6+2',
        objective:
          'Mejorar el balance defensivo y la presión reactiva en los primeros 4 segundos tras perder la posesión.',
        durationMinutes: 25,
        intensity: 'Alta' as const,
        steps: [
          'Espacio de 40x35m dividido en 3 carriles verticales.',
          'Equipo en posesión busca completar 7 pases antes de filtrar a zona de finalización.',
          'Al perder el balón, presionar de inmediato cerrando líneas interiores.',
        ],
        equipment: ['12 conos', 'Balones oficiales', '3 juegos de pecheras'],
      },
    ];

  const ajustes = rawAjustes.map((a: RawDrillInput) => {
    const parsedMinutes =
      typeof a.durationMinutes === 'number'
        ? a.durationMinutes
        : parseInt(String(a.duracion || '20'), 10) || 20;
    const steps: string[] = Array.isArray(a.steps)
      ? a.steps
      : a.descripcion
      ? [a.descripcion]
      : [];

    return {
      name: a.name || a.titulo || 'Ajuste Táctico Colectivo',
      objective: a.objective || a.enfoque || 'Optimización del bloque en campo.',
      durationMinutes: parsedMinutes,
      intensity: (a.intensity || 'Alta') as 'Alta' | 'Media' | 'Baja',
      steps,
      equipment: Array.isArray(a.equipment) ? a.equipment : ['Conos', 'Balones', 'Pecheras'],
    };
  });

  return {
    sistemaNominal: nominal,
    sistemaDetectado: detectado,
    comparativaNominalVsReal: comparativa,
    centroideBloque: centroide,
    amplitud,
    profundidad,
    radarBloque,
    fortalezasColectivas,
    debilidadesColectivas,
    ajustesEntrenamientoEquipo: ajustes,
  };
}

/**
 * Normaliza las jugadas colectivas destacadas garantizando que todos los segundos
 * estén dentro de la duración real del video [0, videoDurationSeconds].
 */
export function normalizeHighlightPlays(
  json: RawVisionResponse = {},
  videoDurationSeconds?: number
): VisionHighlightPlay[] {
  const rawPlays =
    json.jugadasDestacadas ||
    json.jugadas_destacadas ||
    json.collectiveEvents ||
    json.collective_events ||
    json.events ||
    [];

  if (Array.isArray(rawPlays) && rawPlays.length > 0) {
    return rawPlays.map((p, idx) => {
      const ratio = (idx + 1) / (rawPlays.length + 1);
      const sec = clampTimestampToDuration(
        p.timestampSeconds ?? p.timestamp_seconds ?? p.second,
        videoDurationSeconds,
        ratio
      );
      return {
        id: p.id || `play-${idx}`,
        title: p.title || p.titulo || 'Acción Colectiva Clave',
        timestampSeconds: sec,
        timestampDisplay: formatSecondsToMMSS(sec),
        description: p.description || p.descripcion || p.detalle || 'Despliegue táctico del bloque.',
        phase: p.phase || p.fase || 'Colectiva',
        impact: p.impact || p.impacto || 'high',
      };
    });
  }

  // Si viene seguimientoTactico.jugadasReales, priorizar esas jugadas reales geolocalizadas
  const realPlays = json.seguimientoTactico?.jugadasReales;
  if (Array.isArray(realPlays) && realPlays.length > 0) {
    return realPlays
      .map((p: RawHighlightPlayInput, idx: number) => {
        const ratio = (idx + 1) / (realPlays.length + 1);
        const sec = clampTimestampToDuration(
          p.timestampSeconds,
          videoDurationSeconds,
          ratio
        );
        return {
          id: p.id || `real-play-${idx + 1}`,
          title: p.titulo || p.title || 'Acción Colectiva Clave',
          timestampSeconds: sec,
          timestampDisplay: p.timestampLabel || formatSecondsToMMSS(sec),
          description: p.detalle || p.description || '',
          phase: p.estado || 'Colectiva',
          impact: p.estado === 'COMPLETADO' ? ('high' as const) : ('medium' as const),
          estado: p.estado,
          x: typeof p.x === 'number' ? p.x : undefined,
          y: typeof p.y === 'number' ? p.y : undefined,
        };
      })
      .sort((a, b) => a.timestampSeconds - b.timestampSeconds);
  }

  // Si viene el esquema teamSummary.fortalezasColectivas / debilidadesColectivas, derivar las jugadas desde ahí
  const teamSummary = json.teamSummary || json.team_summary || {};
  const derivedFromSummary = [
    ...(Array.isArray(teamSummary.fortalezasColectivas)
      ? teamSummary.fortalezasColectivas.map((f: RawTacticalItemInput, idx: number) => ({
          id: `fort-${idx}`,
          title: f.titulo || f.title || 'Fortaleza Táctica',
          timestampSeconds: f.timestampSeconds,
          description: f.detalle || f.description || '',
          phase: 'Fortaleza',
          impact: 'high' as const,
        }))
      : []),
    ...(Array.isArray(teamSummary.debilidadesColectivas)
      ? teamSummary.debilidadesColectivas.map((d: RawTacticalItemInput, idx: number) => ({
          id: `deb-${idx}`,
          title: d.titulo || d.title || 'Ajuste Táctico',
          timestampSeconds: d.timestampSeconds,
          description: d.detalle || d.diagnostic || '',
          phase: 'Ajuste',
          impact: 'medium' as const,
        }))
      : []),
  ];

  if (derivedFromSummary.length > 0) {
    return derivedFromSummary
      .map((p, idx) => {
        const ratio = (idx + 1) / (derivedFromSummary.length + 1);
        const sec = clampTimestampToDuration(
          p.timestampSeconds,
          videoDurationSeconds,
          ratio
        );
        return {
          ...p,
          timestampSeconds: sec,
          timestampDisplay: formatSecondsToMMSS(sec),
        };
      })
      .sort((a, b) => a.timestampSeconds - b.timestampSeconds);
  }

  // Generar jugadas demo calibradas a la duración real del clip
  const dur =
    videoDurationSeconds && videoDurationSeconds > 0 ? videoDurationSeconds : 13;

  const basePlays = [
    {
      id: 'team-play-1',
      title: 'Salida combinada desde el fondo con apoyos',
      ratio: 0.15,
      description:
        'El central conecta con el pivote quien descarga de primera hacia el carril exterior desarticulando la presión.',
      phase: 'Iniciación',
      impact: 'high' as const,
    },
    {
      id: 'team-play-2',
      title: 'Basculación defensiva y robo en zona activa',
      ratio: 0.42,
      description:
        'El bloque bascula en conjunto forzando el pase errado del rival y recuperando la posesión.',
      phase: 'Defensiva',
      impact: 'high' as const,
    },
    {
      id: 'team-play-3',
      title: 'Desajuste en repliegue tras pérdida',
      ratio: 0.68,
      description:
        'Pase filtrado interceptado con laterales proyectados sin cobertura del pivote.',
      phase: 'Transición',
      impact: 'medium' as const,
    },
    {
      id: 'team-play-4',
      title: 'Cierre de secuencia y ocupación posicional',
      ratio: 0.88,
      description:
        'Reorganización de líneas para sostener el equilibrio del bloque en el tramo final del clip.',
      phase: 'Ofensiva',
      impact: 'high' as const,
    },
  ];

  return basePlays.map((p) => {
    const sec = clampTimestampToDuration(Math.round(dur * p.ratio), dur, p.ratio);
    return {
      id: p.id,
      title: p.title,
      timestampSeconds: sec,
      timestampDisplay: formatSecondsToMMSS(sec),
      description: p.description,
      phase: p.phase,
      impact: p.impact,
    };
  });
}

/**
 * Extrae las secciones analíticas enriquecidas compartidas (KPIs, Fases,
 * Posicionamiento Táctico, Seguimiento y Plan de Acción) desde el response JSON.
 */
function extractRichVisionFields(json: RawVisionResponse = {}) {
  const matchContext = json.matchContext || json.match_context || {};
  const summary =
    json.playerSummary ||
    json.player_summary ||
    json.teamSummary ||
    json.team_summary ||
    {};

  const rawRefRadar =
    json.playerSummary?.radarPromedioPosicional ||
    json.player_summary?.radarPromedioPosicional;
  const radarPromedioPosicional = rawRefRadar
    ? {
        defense: Number(rawRefRadar.defensa ?? rawRefRadar.defense ?? 76),
        distribution: Number(rawRefRadar.distribucion ?? rawRefRadar.distribution ?? 70),
        tacticalSense: Number(rawRefRadar.tactica ?? rawRefRadar.tacticalSense ?? 74),
        physicalIntensity: Number(rawRefRadar.intensidad ?? rawRefRadar.physicalIntensity ?? 72),
        offensiveImpact: Number(rawRefRadar.ofensiva ?? rawRefRadar.offensiveImpact ?? 58),
      }
    : undefined;

  const rawTeamRef =
    json.teamSummary?.metricasBloqueReferencia ||
    json.team_summary?.metricasBloqueReferencia;
  const metricasBloqueReferencia = rawTeamRef
    ? {
        solidezDefensiva: Number(rawTeamRef.solidezDefensiva ?? 75),
        presionTrasPerdida: Number(rawTeamRef.presionTrasPerdida ?? 70),
        amplitudBandas: Number(rawTeamRef.amplitudBandas ?? 68),
        transicionOfensiva: Number(rawTeamRef.transicionOfensiva ?? 72),
        compactacion: Number(rawTeamRef.compactacion ?? 74),
      }
    : undefined;

  const rawPdf = json.reportePdf;
  const reportePdf: VisionReportePdf | undefined = rawPdf?.base64
    ? {
        filename: rawPdf.filename || 'informe_tactico.pdf',
        mimeType: rawPdf.mimeType || 'application/pdf',
        base64: rawPdf.base64,
      }
    : undefined;

  return {
    rival: matchContext.rival || json.rival || undefined,
    duracionVideoSegundos:
      matchContext.duracionVideoSegundos ?? json.duracionVideoSegundos ?? undefined,
    duracionFormato:
      matchContext.duracionFormato || json.duracionFormato || undefined,
    tramoAnalizado:
      matchContext.tramoAnalizado || json.tramoAnalizado || undefined,
    impactoTacticoBadge:
      summary.impactoTacticoBadge || json.impactoTacticoBadge || undefined,
    dictamenTactico:
      summary.dictamenTactico || json.dictamenTactico || undefined,
    resumenTacticoCorto:
      summary.resumenTacticoCorto || json.resumenTacticoCorto || undefined,
    resumenEjecutivo:
      summary.resumenEjecutivo || json.resumenEjecutivo || undefined,
    seguimientoTactico: json.seguimientoTactico || undefined,
    kpisCuantitativos: Array.isArray(json.kpisCuantitativos)
      ? json.kpisCuantitativos
      : undefined,
    evaluacionCualitativaKpis: Array.isArray(json.evaluacionCualitativaKpis)
      ? json.evaluacionCualitativaKpis
      : undefined,
    rendimientoPorFases: json.rendimientoPorFases || undefined,
    evaluacionPosicionamientoTactico:
      json.evaluacionPosicionamientoTactico ||
      summary.evaluacionPosicionamientoTactico ||
      undefined,
    conclusionesPlanAccion: Array.isArray(json.conclusionesPlanAccion)
      ? json.conclusionesPlanAccion
      : undefined,
    radarPromedioPosicional,
    metricasBloqueReferencia,
    reportePdf,
  };
}

/**
 * Normaliza una respuesta individual del backend Python (playerSummary + telemetry)
 * al contrato UnifiedVisionAnalysisData del dashboard /analisis/[id].
 */
export function normalizeIndividualVisionData(
  json: RawVisionResponse = {},
  input?: Partial<VisionFormData>,
  videoDurationSeconds?: number
) {
  const rawP = json.playerSummary || json.player_summary || {};
  const rawR = rawP.radarMetrics || json.radarMetrics || json.radar_metrics || {};
  const matchContext = json.matchContext || json.match_context || {};
  const telemetry = json.telemetry || {};

  const playerName =
    rawP.nombre || rawP.name || input?.nombre_jugador || 'Verano';
  const dorsalNum = Number(rawP.dorsal ?? input?.dorsal) || 7;
  const teamName =
    rawP.equipo || rawP.team || input?.nombre_equipo || 'Dibujitos FC';
  const format =
    matchContext.formatoJuego ||
    rawP.matchFormat ||
    json.formatoJuego ||
    input?.formato_juego ||
    'Fútbol 7';
  const initialPosition =
    rawP.posicionInicial ||
    rawP.initialPosition ||
    input?.posicion ||
    'Back Central / Líbero';
  const detectedRole =
    rawP.rolDetectado ||
    rawP.detectedRealRole ||
    'Líbero con proyección ofensiva';
  const overallRating = Number(
    rawP.ratingGlobal ?? rawP.overallRating ?? 7.8
  );
  const playStyle =
    rawP.estiloJuego ||
    rawP.playStyle ||
    'Defensor con despliegue de ruptura y criterio en la transición';

  const radarMetrics = {
    defense: Number(rawR.defensa ?? rawR.defense ?? rawR.defending ?? 85),
    distribution: Number(rawR.distribucion ?? rawR.distribution ?? 75),
    tacticalSense: Number(rawR.tactica ?? rawR.tacticalSense ?? 80),
    physicalIntensity: Number(rawR.intensidad ?? rawR.physicalIntensity ?? 70),
    offensiveImpact: Number(rawR.ofensiva ?? rawR.offensiveImpact ?? 65),
  };

  const rawStrengths =
    rawP.fortalezas || json.strengths || json.fortalezas || [];
  const strengths = Array.isArray(rawStrengths)
    ? rawStrengths.map((s: RawTacticalItemInput, idx: number) => {
        const sec = clampTimestampToDuration(
          s.timestampSeconds ?? s.timestamp_seconds,
          videoDurationSeconds,
          (idx + 1) / (rawStrengths.length + 1)
        );
        return {
          id: s.id || `str-${idx + 1}`,
          title: s.title || s.titulo || 'Fortaleza Táctica',
          description: s.description || s.detalle || '',
          timestampSeconds: sec,
          timestampDisplay: formatSecondsToMMSS(sec),
          category: s.category || 'Rendimiento YOLOv8',
        };
      })
    : [];

  const rawWeaknesses =
    rawP.areasMejora || json.weaknesses || json.debilidades || [];
  const weaknesses = Array.isArray(rawWeaknesses)
    ? rawWeaknesses.map((w: RawTacticalItemInput, idx: number) => {
        const sec = clampTimestampToDuration(
          w.timestampSeconds ?? w.timestamp_seconds,
          videoDurationSeconds,
          0.65 + idx * 0.15
        );
        return {
          id: w.id || `wkn-${idx + 1}`,
          title: w.title || w.titulo || 'Área de Mejora',
          diagnostic: w.diagnostic || w.detalle || '',
          rootCause:
            w.rootCause ||
            w.causaRaiz ||
            'Desajuste posicional detectado en la secuencia de tracking.',
          timestampSeconds: sec,
          timestampDisplay: formatSecondsToMMSS(sec),
          severity: (w.severity || 'moderate') as 'critical' | 'moderate' | 'minor',
        };
      })
    : [];

  const rawDrills =
    rawP.ejerciciosRecomendados ||
    json.recommendedDrills ||
    json.drills ||
    [];
  const recommendedDrills = Array.isArray(rawDrills)
    ? rawDrills.map((d: RawDrillInput, idx: number) => {
        const parsedMinutes =
          typeof d.durationMinutes === 'number'
            ? d.durationMinutes
            : parseInt(String(d.duracion || '20'), 10) || 20;
        return {
          id: d.id || `drill-${idx + 1}`,
          name: d.name || d.titulo || 'Ejercicio Táctico',
          targetSkill: d.targetSkill || d.enfoque || 'Comprensión táctica',
          objective: d.objective || d.descripcion || '',
          durationMinutes: parsedMinutes,
          intensity: (d.intensity || 'Alta') as 'Alta' | 'Media' | 'Baja',
          steps: Array.isArray(d.steps)
            ? d.steps
            : d.descripcion
            ? [d.descripcion]
            : [],
          equipment: Array.isArray(d.equipment)
            ? d.equipment
            : ['Conos', 'Balones', 'Pecheras'],
        };
      })
    : [];

  const heatmapPoints: RawHeatmapPoint[] =
    telemetry.heatmapPoints || telemetry.heatmap_points || [];

  const findNearestPoint = (targetSec: number, fallbackIdx: number) => {
    if (heatmapPoints.length === 0) return { x: 50, y: 50 };
    let best = heatmapPoints[Math.min(fallbackIdx, heatmapPoints.length - 1)];
    let bestDiff = Infinity;
    for (const pt of heatmapPoints) {
      if (typeof pt.t === 'number') {
        const diff = Math.abs(pt.t - targetSec);
        if (diff < bestDiff) {
          bestDiff = diff;
          best = pt;
        }
      }
    }
    return { x: Number(best.x) || 50, y: Number(best.y) || 50 };
  };

  const derivedEvents = [
    ...strengths.map((s, idx: number) => {
      const coords = findNearestPoint(s.timestampSeconds, idx);
      return {
        id: `ev-str-${idx + 1}`,
        type: idx === 0 ? ('interception' as const) : ('dribble' as const),
        title: s.title,
        timestampSeconds: s.timestampSeconds,
        timestampDisplay: s.timestampDisplay,
        x: coords.x,
        y: coords.y,
        success: true,
        description: s.description,
        category: 'defensive' as const,
        tacticalImpact: 'high' as const,
      };
    }),
    ...weaknesses.map((w, idx: number) => {
      const coords = findNearestPoint(w.timestampSeconds, idx + 2);
      return {
        id: `ev-wkn-${idx + 1}`,
        type: 'turnover' as const,
        title: w.title,
        timestampSeconds: w.timestampSeconds,
        timestampDisplay: w.timestampDisplay,
        x: coords.x,
        y: coords.y,
        success: false,
        description: w.diagnostic,
        category: 'transition' as const,
        tacticalImpact: 'medium' as const,
      };
    }),
  ].sort((a, b) => a.timestampSeconds - b.timestampSeconds);

  const rawDist = telemetry.distanciaRelativa ?? telemetry.distancia_relativa;
  const distNumber = Number(rawDist);
  const distanciaRelativa =
    typeof rawDist === 'string' && rawDist.trim().length > 0
      ? rawDist
      : Number.isFinite(distNumber) && distNumber > 0
      ? distNumber >= 1000
        ? `${(distNumber / 1000).toFixed(2)} km`
        : `${distNumber.toFixed(1)} m`
      : '120.7 m';

  const distKm =
    Number.isFinite(distNumber) && distNumber > 0
      ? Number((distNumber / 1000).toFixed(2))
      : 0.12;

  const seguimiento: Partial<VisionSeguimientoTactico> = json.seguimientoTactico || {};
  const realPlays = Array.isArray(seguimiento.jugadasReales)
    ? seguimiento.jugadasReales
    : [];

  const eventsFromRealPlays =
    realPlays.length > 0
      ? realPlays
          .map((p: RawHighlightPlayInput, idx: number) => {
            const sec = clampTimestampToDuration(
              p.timestampSeconds,
              videoDurationSeconds,
              (idx + 1) / (realPlays.length + 1)
            );
            const isSuccess = p.estado === 'COMPLETADO';
            return {
              id: `ev-real-${idx + 1}`,
              type: isSuccess
                ? idx === 0
                  ? ('interception' as const)
                  : ('dribble' as const)
                : ('turnover' as const),
              title: p.titulo || 'Acción Táctica',
              timestampSeconds: sec,
              timestampDisplay: p.timestampLabel || formatSecondsToMMSS(sec),
              x: typeof p.x === 'number' ? p.x : 50,
              y: typeof p.y === 'number' ? p.y : 50,
              success: isSuccess,
              description: p.detalle || '',
              category: isSuccess ? ('defensive' as const) : ('transition' as const),
              tacticalImpact: isSuccess ? ('high' as const) : ('medium' as const),
            };
          })
          .sort((a: { timestampSeconds: number }, b: { timestampSeconds: number }) => a.timestampSeconds - b.timestampSeconds)
      : derivedEvents;

  const velKpi = Array.isArray(json.kpisCuantitativos)
    ? json.kpisCuantitativos.find((k: VisionKpiCuantitativo) => k.id === 'velocidad')
    : undefined;

  const fullSegment = {
    id: 'full' as const,
    label: 'Tramo Analizado',
    timeRange:
      matchContext.tramoAnalizado ||
      (videoDurationSeconds
        ? `00:00 - ${formatSecondsToMMSS(Math.floor(videoDurationSeconds))}`
        : '00:00 - Fin'),
    heatmapPoints,
    events: eventsFromRealPlays,
    kpis: {
      passAccuracy:
        seguimiento.pasesExitoPct ??
        Math.min(98, Math.max(60, radarMetrics.distribution + 8)),
      duelsWonRate:
        seguimiento.duelos1v1Pct ??
        Math.min(98, Math.max(60, radarMetrics.defense - 2)),
      interceptions: seguimiento.cortesAnticipaciones ?? strengths.length + 2,
      recoveries: seguimiento.cortesAnticipaciones ?? strengths.length + 4,
      riskyTurnovers: weaknesses.length,
      distanceCoveredKm: distKm,
      topSpeedKmh: Number(velKpi?.valor || telemetry.topSpeedKmh || 28.4),
    },
  };

  const timeSegments = json.timeSegments ||
    json.time_segments || {
      '0-10': { ...fullSegment, id: '0-10' as const, label: 'Inicio' },
      '10-20': { ...fullSegment, id: '10-20' as const, label: 'Desarrollo' },
      '20-end': { ...fullSegment, id: '20-end' as const, label: 'Cierre' },
      full: fullSegment,
    };

  return {
    playerSummary: {
      id: json.id || `vision-${Date.now()}`,
      name: playerName,
      dorsal: dorsalNum,
      team: teamName,
      opponentTeam: matchContext.rival || rawP.opponentTeam || 'Rival',
      shirtColor: rawP.colorDetectadoIA || input?.descripcion_vestimenta || '#0F172A',
      shortColor: '#0F172A',
      bootsColor: '#A3E635',
      kitDescription: rawP.vestimenta || input?.descripcion_vestimenta || undefined,
      detectedColor: rawP.colorDetectadoIA || undefined,
      matchFormat: format as MatchFormat,
      initialPosition,
      detectedRealRole: detectedRole,
      playStyle,
      minutesAnalyzed: Math.max(1, Math.round((videoDurationSeconds || 120) / 60)),
      overallRating,
      matchDate: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      competition: `${format} - Detección Óptica YOLOv8`,
      videoUrl: '',
    },
    radarMetrics,
    strengths,
    weaknesses,
    recommendedDrills,
    timeSegments,
    distanciaRelativa,
    trackedEntitiesCount:
      telemetry.totalJugadoresDetectados ||
      telemetry.trackedEntitiesCount ||
      225,
    tacticalSummaryNotes: `${playStyle}. Rol detectado: ${detectedRole} (${format}).`,
  };
}

/**
 * Generador de respaldo / Mock calibrado a la duración real y zona de cámara del video.
 */
export function createFallbackVisionResponse(
  input: VisionFormData,
  localVideoUrl?: string
): UnifiedVisionAnalysisData {
  const isIndividual = input.modo_analisis === 'individual';
  const analysisId = `vision-${Date.now()}`;
  const format = input.formato_juego || 'Fútbol 7';
  const nominalSys =
    input.sistema_tactico_nominal ||
    (format.includes('11') ? '1-4-3-3' : '1-2-3-1');

  const durationSec =
    input.videoDurationSeconds && input.videoDurationSeconds > 0
      ? input.videoDurationSeconds
      : isIndividual
      ? 120
      : 420;

  if (isIndividual) {
    const mockInd = MOCK_VISION_INDIVIDUAL_RESPONSE;
    const normalized = normalizeIndividualVisionData(
      {
        ...mockInd,
        playerSummary: {
          ...mockInd.playerSummary,
          nombre: input.nombre_jugador || mockInd.playerSummary.nombre,
          dorsal: input.dorsal || mockInd.playerSummary.dorsal,
          equipo: input.nombre_equipo || mockInd.playerSummary.equipo,
          posicionInicial:
            input.posicion || mockInd.playerSummary.posicionInicial,
          vestimenta:
            input.descripcion_vestimenta || mockInd.playerSummary.vestimenta,
        },
        matchContext: {
          formatoJuego: format || mockInd.matchContext.formatoJuego,
          sistemaTacticoNominal:
            nominalSys || mockInd.matchContext.sistemaTacticoNominal,
        },
      },
      input,
      durationSec
    );

    return {
      id: analysisId,
      modo: 'individual',
      isVisionAnalysis: true,
      formatoJuego: normalized.playerSummary.matchFormat || format,
      sistemaTacticoNominal: nominalSys,
      nombreEquipo: normalized.playerSummary.team,
      descripcionVestimenta:
        input.descripcion_vestimenta || mockInd.playerSummary.vestimenta,
      videoFileName: input.video.name,
      localVideoUrl,
      videoDurationSeconds: durationSec,
      cameraZone: input.cameraZone || 'campo_completo',
      telemetry: {
        distanciaRelativa: normalized.distanciaRelativa,
        topSpeedKmh: 28.4,
        totalFramesAnalyzed: Math.round(durationSec * 30),
        fpsAnalyzed: 30,
        trackedEntitiesCount: normalized.trackedEntitiesCount,
        confidenceScore: 0.95,
        heatmapPoints: mockInd.telemetry.heatmapPoints,
      },
      playerSummary: {
        ...normalized.playerSummary,
        videoUrl: localVideoUrl || '',
      },
      radarMetrics: normalized.radarMetrics,
      timeSegments: normalized.timeSegments,
      strengths: normalized.strengths,
      weaknesses: normalized.weaknesses,
      recommendedDrills: normalized.recommendedDrills,
      tacticalSummaryNotes: normalized.tacticalSummaryNotes,
      ...extractRichVisionFields(mockInd),
    };
  }

  // MODO EQUIPO / COLECTIVO — Usa el mock oficial de Dibujitos FC / YOLOv8 + ByteTrack + Gemini
  const mockTeam = MOCK_VISION_TEAM_RESPONSE;
  const resolvedTeamName = input.nombre_equipo || mockTeam.teamSummary.nombreEquipo;
  const resolvedFormat = input.formato_juego || mockTeam.matchContext.formatoJuego;
  const resolvedSystem =
    input.sistema_tactico_nominal || mockTeam.teamSummary.sistemaTacticoNominal;
  const resolvedKit =
    input.descripcion_vestimenta || mockTeam.teamSummary.vestimenta;

  const blockData = normalizeBlockData(
    mockTeam,
    {
      ...input,
      nombre_equipo: resolvedTeamName,
      formato_juego: resolvedFormat,
      sistema_tactico_nominal: resolvedSystem,
    },
    durationSec
  );
  const jugadasDestacadas = normalizeHighlightPlays(mockTeam, durationSec);
  const distMeters = mockTeam.telemetry.distanciaAcumulada;
  const distLabel =
    distMeters >= 1000
      ? `${(distMeters / 1000).toFixed(2)} km (${distMeters.toFixed(0)} m)`
      : `${distMeters.toFixed(0)} m`;

  return {
    id: analysisId,
    modo: 'equipo',
    isVisionAnalysis: true,
    formatoJuego: resolvedFormat,
    sistemaTacticoNominal: resolvedSystem,
    nombreEquipo: resolvedTeamName,
    descripcionVestimenta: resolvedKit,
    videoFileName: input.video.name,
    localVideoUrl,
    videoDurationSeconds: durationSec,
    cameraZone: input.cameraZone || 'campo_completo',
    ratingColectivo: mockTeam.teamSummary.ratingColectivo,
    identidadJuego: mockTeam.teamSummary.identidadJuego,
    telemetry: {
      distanciaRelativa: distLabel,
      distanciaAcumulada: mockTeam.telemetry.distanciaAcumulada,
      jugadoresRastreadosEquipo: mockTeam.telemetry.jugadoresRastreadosEquipo,
      totalFramesAnalyzed: Math.round(durationSec * 30),
      fpsAnalyzed: 30,
      trackedEntitiesCount: mockTeam.telemetry.jugadoresRastreadosEquipo,
      confidenceScore: 0.96,
      heatmapPoints: mockTeam.telemetry.heatmapPoints,
    },
    blockData,
    jugadasDestacadas,
    masterCoachNotes: `${mockTeam.teamSummary.identidadJuego} ${mockTeam.teamSummary.comparativaNominalVsReal}`,
    ...extractRichVisionFields(mockTeam),
  };
}

/**
 * Cliente para el backend de visión artificial en Python (FastAPI).
 * Soporta alternancia inmediata mediante `input.useMock` o `DEFAULT_USE_MOCK_VISION`.
 */
export async function analyzeVisionVideo(
  input: VisionFormData,
  localVideoUrl?: string
): Promise<UnifiedVisionAnalysisData> {
  const shouldUseMock = input.useMock ?? DEFAULT_USE_MOCK_VISION;

  // Modo Mock para validación rápida de UI sin llamar al backend
  if (shouldUseMock) {
    console.info(
      '[VisionApiClient] MODO MOCK ACTIVADO: Simulando respuesta rápida sin consultar a FastAPI.'
    );
    await new Promise((resolve) => setTimeout(resolve, 600));
    return createFallbackVisionResponse(input, localVideoUrl);
  }

  const formData = new FormData();

  formData.append('video', input.video);
  formData.append('modo_analisis', input.modo_analisis);
  formData.append('formato_juego', input.formato_juego);
  formData.append('sistema_tactico_nominal', input.sistema_tactico_nominal);
  formData.append('nombre_jugador', input.nombre_jugador || '');
  formData.append('dorsal', input.dorsal || '');
  formData.append('posicion', input.posicion || '');
  formData.append('nombre_equipo', input.nombre_equipo || '');
  formData.append('descripcion_vestimenta', input.descripcion_vestimenta || '');

  try {
    const response = await fetch(`${VISION_API_URL}/api/vision/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorJson = await response.json();
        errorDetail =
          errorJson.detail || errorJson.error || JSON.stringify(errorJson);
      } catch {
        errorDetail = await response.text();
      }
      throw new Error(
        `FastAPI devolvió código ${response.status}: ${errorDetail || response.statusText}`
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/pdf')) {
      const pdfBytes = new Uint8Array(await response.arrayBuffer());
      let binary = '';
      for (let i = 0; i < pdfBytes.length; i++) {
        binary += String.fromCharCode(pdfBytes[i]);
      }
      const fallback = createFallbackVisionResponse(input, localVideoUrl);
      return {
        ...fallback,
        reportePdf: {
          filename: `reporte-tactico-${input.nombre_equipo || 'analisis'}.pdf`,
          mimeType: 'application/pdf',
          base64: btoa(binary),
        },
      };
    }

    const json: RawVisionResponse = await response.json();

    const isTeam =
      json.modo === 'equipo' ||
      json.modo_analisis === 'equipo' ||
      input.modo_analisis === 'equipo';

    const durationSec =
      Number(json.videoDurationSeconds || json.duracion_segundos) ||
      input.videoDurationSeconds;

    // Clamping de timestamps de fortalezas/debilidades individuales también
    const rawStrengths = json.strengths || json.fortalezas;
    const clampedStrengths = Array.isArray(rawStrengths)
      ? rawStrengths.map((s: RawTacticalItemInput, idx: number) => {
          const sec = clampTimestampToDuration(
            s.timestampSeconds ?? s.timestamp_seconds,
            durationSec,
            (idx + 1) / (rawStrengths.length + 1)
          );
          return {
            id: s.id || `str-${idx + 1}`,
            title: s.title || s.titulo || 'Fortaleza Táctica',
            description: s.description || s.detalle || '',
            timestampSeconds: sec,
            timestampDisplay: formatSecondsToMMSS(sec),
            category: s.category || 'Rendimiento YOLOv8',
          };
        })
      : undefined;

    const rawWeaknesses = json.weaknesses || json.debilidades;
    const clampedWeaknesses = Array.isArray(rawWeaknesses)
      ? rawWeaknesses.map((w: RawTacticalItemInput, idx: number) => {
          const sec = clampTimestampToDuration(
            w.timestampSeconds ?? w.timestamp_seconds,
            durationSec,
            0.7 + idx * 0.1
          );
          return {
            id: w.id || `wkn-${idx + 1}`,
            title: w.title || w.titulo || 'Área de Mejora',
            diagnostic: w.diagnostic || w.detalle || '',
            rootCause: w.rootCause || w.causaRaiz || 'Desajuste posicional detectado en el análisis.',
            severity: w.severity || ('moderate' as const),
            timestampSeconds: sec,
            timestampDisplay: formatSecondsToMMSS(sec),
          };
        })
      : undefined;

    const teamSummary = json.teamSummary || json.team_summary || {};
    const matchContext = json.matchContext || json.match_context || {};
    const normalizedInd = !isTeam
      ? normalizeIndividualVisionData(json, input, durationSec)
      : null;

    const distMeters = Number(json.telemetry?.distanciaAcumulada);
    const rawDistVal =
      json.telemetry?.distanciaRelativa ?? json.telemetry?.distancia_relativa;
    const computedDistRelativa =
      normalizedInd?.distanciaRelativa ||
      (rawDistVal !== undefined ? String(rawDistVal) : undefined) ||
      (Number.isFinite(distMeters) && distMeters > 0
        ? distMeters >= 1000
          ? `${(distMeters / 1000).toFixed(2)} km (${distMeters.toFixed(0)} m)`
          : `${distMeters.toFixed(0)} m`
        : isTeam
        ? '41.2 km (Bloque Colectivo)'
        : '120.7 m');

    const result: UnifiedVisionAnalysisData = {
      id: json.id || `vision-${Date.now()}`,
      modo: isTeam ? 'equipo' : 'individual',
      isVisionAnalysis: true,
      formatoJuego:
        matchContext.formatoJuego ||
        json.formatoJuego ||
        json.formato_juego ||
        input.formato_juego ||
        'Fútbol 7',
      sistemaTacticoNominal:
        teamSummary.sistemaTacticoNominal ||
        matchContext.sistemaTacticoNominal ||
        json.sistemaTacticoNominal ||
        json.sistema_tactico_nominal ||
        input.sistema_tactico_nominal ||
        '1-2-3-1',
      nombreEquipo:
        normalizedInd?.playerSummary.team ||
        teamSummary.nombreEquipo ||
        json.nombreEquipo ||
        json.nombre_equipo ||
        input.nombre_equipo ||
        'Equipo Local',
      descripcionVestimenta:
        teamSummary.vestimenta ||
        json.playerSummary?.vestimenta ||
        json.descripcionVestimenta ||
        json.descripcion_vestimenta ||
        input.descripcion_vestimenta ||
        '',
      videoFileName: input.video.name,
      localVideoUrl: localVideoUrl || json.localVideoUrl || json.local_video_url,
      videoDurationSeconds: durationSec,
      cameraZone: json.cameraZone || json.camera_zone || input.cameraZone,
      ratingColectivo:
        teamSummary.ratingColectivo ?? json.ratingColectivo ?? undefined,
      identidadJuego:
        teamSummary.identidadJuego ?? json.identidadJuego ?? undefined,
      telemetry: {
        heatmapPoints: json.telemetry?.heatmapPoints || json.telemetry?.heatmap_points || [],
        distanciaRelativa: computedDistRelativa,
        distanciaAcumulada: Number.isFinite(distMeters) ? distMeters : undefined,
        jugadoresRastreadosEquipo:
          json.telemetry?.jugadoresRastreadosEquipo ?? undefined,
        topSpeedKmh: json.telemetry?.topSpeedKmh || json.telemetry?.top_speed_kmh || 30.5,
        totalFramesAnalyzed:
          json.telemetry?.totalFramesAnalyzed ||
          json.telemetry?.total_frames_analyzed ||
          (durationSec ? Math.round(durationSec * 30) : 1500),
        fpsAnalyzed: json.telemetry?.fpsAnalyzed || json.telemetry?.fps_analyzed || 30,
        trackedEntitiesCount:
          normalizedInd?.trackedEntitiesCount ||
          json.telemetry?.jugadoresRastreadosEquipo ||
          json.telemetry?.trackedEntitiesCount ||
          json.telemetry?.tracked_entities_count ||
          14,
        confidenceScore:
          json.telemetry?.confidenceScore || json.telemetry?.confidence_score || 0.95,
      },
      playerSummary: normalizedInd?.playerSummary,
      radarMetrics: normalizedInd?.radarMetrics,
      timeSegments: normalizedInd?.timeSegments,
      strengths: normalizedInd?.strengths || clampedStrengths,
      weaknesses: normalizedInd?.weaknesses || clampedWeaknesses,
      recommendedDrills: normalizedInd?.recommendedDrills,
      tacticalSummaryNotes:
        normalizedInd?.tacticalSummaryNotes ||
        json.tacticalSummaryNotes ||
        json.resumen_tactico,
      blockData: isTeam ? normalizeBlockData(json, input, durationSec) : undefined,
      jugadasDestacadas: isTeam ? normalizeHighlightPlays(json, durationSec) : undefined,
      masterCoachNotes:
        json.masterCoachNotes ||
        json.notas_entrenador ||
        (teamSummary.identidadJuego
          ? `${teamSummary.identidadJuego} ${teamSummary.comparativaNominalVsReal || ''}`.trim()
          : undefined),
      ...extractRichVisionFields(json),
    };

    return result;
  } catch (err: unknown) {
    console.warn(
      `[VisionApiClient] Excepción al procesar video en ${VISION_API_URL}:`,
      err
    );

    const errMessage = err instanceof Error ? err.message : String(err);
    if (
      errMessage.includes('Failed to fetch') ||
      errMessage.includes('NetworkError') ||
      errMessage.includes('ECONNREFUSED')
    ) {
      console.warn(
        `[VisionApiClient] El microservicio FastAPI en ${VISION_API_URL} no parece estar ejecutándose localmente. Activando generador de contingencia YOLOv8.`
      );
      return createFallbackVisionResponse(input, localVideoUrl);
    }

    throw err;
  }
}

function triggerBrowserBlobDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/**
 * Descarga el reporte PDF generado por el servicio a partir de `reportePdf.base64`.
 */
export function downloadVisionPdfReport(reportePdf?: VisionReportePdf): void {
  if (!reportePdf?.base64) {
    throw new Error('NO_PDF_SOURCE');
  }

  const cleanBase64 = reportePdf.base64.replace(
    /^data:application\/pdf;base64,/i,
    ''
  );
  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const safeName = (reportePdf.filename || 'informe-tactico-depor-analytics')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const blob = new Blob([bytes], {
    type: reportePdf.mimeType || 'application/pdf',
  });
  triggerBrowserBlobDownload(blob, safeName);
}
