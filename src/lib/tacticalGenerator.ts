import {
  TacticalAnalysisData,
  MatchSetupFormInput,
  TimeSegmentId,
  TimeSegment,
  HeatmapPoint,
  TacticalEvent,
  RadarMetrics,
  CoachStrength,
  CoachWeakness,
  RecommendedDrill,
} from '@/types/analysis';
import { extractYouTubeId } from './formatTimestamp';

/**
 * Generates an end-to-end, realistic, position-specific tactical telemetry dataset.
 * Adapts coordinates, heatmap density, match events, radar metrics, coach feedback
 * and drills based on the player's position, dorsal, team and video link.
 */
export function generatePositionTailoredAnalysis(
  input: MatchSetupFormInput
): TacticalAnalysisData {
  const pos = (input.initialPosition || '').toLowerCase();
  const name = input.playerName || 'Jugador Pro';
  const dorsal = Number(input.dorsal) || 10;
  const team = input.teamName || 'Equipo Local';
  const shirtColor = input.shirtColor || '#A3E635';
  const ytId = extractYouTubeId(input.videoUrl) || '-eI9ZUNdxgw';
  const analysisId = `analysis-${Date.now()}`;

  // 1. Position-specific role, radar & minutes
  let detectedRealRole = 'Organizador Dinámico';
  let minutesAnalyzed = 28;
  let overallRating = 8.3;
  let radar: RadarMetrics = {
    defense: 70,
    distribution: 85,
    tacticalSense: 88,
    physicalIntensity: 82,
    offensiveImpact: 84,
  };

  let points0_10: HeatmapPoint[] = [];
  let points10_20: HeatmapPoint[] = [];
  let points20_end: HeatmapPoint[] = [];
  let pointsFull: HeatmapPoint[] = [];

  let events0_10: TacticalEvent[] = [];
  let events10_20: TacticalEvent[] = [];
  let events20_end: TacticalEvent[] = [];

  let strengths: CoachStrength[] = [];
  let weaknesses: CoachWeakness[] = [];
  let drills: RecommendedDrill[] = [];
  let tacticalNotes = '';

  if (pos.includes('delantero') || pos.includes('dc') || pos.includes('punta')) {
    // ==========================================
    // STRIKER / DELANTERO CENTRO (DC)
    // ==========================================
    detectedRealRole = 'Segundo Delantero Flotante / Referencia de Fijación';
    minutesAnalyzed = 32;
    overallRating = 8.6;
    radar = {
      defense: 58,
      distribution: 74,
      tacticalSense: 87,
      physicalIntensity: 86,
      offensiveImpact: 93,
    };

    points0_10 = [
      { x: 78, y: 34, intensity: 0.95, label: 'Fijación de Centrales' },
      { x: 86, y: 30, intensity: 0.88, label: 'Área Chica / Primer Palo' },
      { x: 70, y: 38, intensity: 0.75, label: 'Descarga en Tres Cuartos' },
      { x: 64, y: 28, intensity: 0.65, label: 'Presión al Central Derecho' },
      { x: 90, y: 36, intensity: 0.85, label: 'Punto Penal Rival' },
    ];
    points10_20 = [
      { x: 82, y: 32, intensity: 0.98, label: 'Zona de Remate' },
      { x: 74, y: 24, intensity: 0.82, label: 'Caída a Banda Derecha' },
      { x: 88, y: 38, intensity: 0.90, label: 'Ataque al Segundo Palo' },
      { x: 68, y: 34, intensity: 0.70, label: 'Pared al Borde del Área' },
    ];
    points20_end = [
      { x: 80, y: 34, intensity: 0.92, label: 'Bloque Alto Ofensivo' },
      { x: 85, y: 28, intensity: 0.86, label: 'Cierre de Centro Rasante' },
      { x: 62, y: 34, intensity: 0.60, label: 'Repliegue en Balón Parado' },
      { x: 92, y: 32, intensity: 0.88, label: 'Remate en Área Pequeña' },
    ];

    events0_10 = [
      {
        id: 'ev-1',
        type: 'shot',
        title: 'Remate potente tras desmarque de ruptura',
        timestampSeconds: 115, // 01:55
        timestampDisplay: '01:55',
        x: 84,
        y: 31,
        success: true,
        description: 'Gana la espalda de los centrales y define cruzado al poste derecho.',
        category: 'offensive',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-2',
        type: 'aerial_duel',
        title: 'Duelo aéreo ganado en saque de meta rival',
        timestampSeconds: 260, // 04:20
        timestampDisplay: '04:20',
        x: 72,
        y: 34,
        success: true,
        description: 'Prolonga el balón con la coronilla habilitando la llegada del extremo.',
        category: 'offensive',
        tacticalImpact: 'medium',
      },
      {
        id: 'ev-3',
        type: 'pass',
        title: 'Descarga de espaldas al mediocentro',
        timestampSeconds: 490, // 08:10
        timestampDisplay: '08:10',
        x: 68,
        y: 36,
        success: true,
        description: 'Aguanta la carga del central a un toque para oxigenar la posesión.',
        category: 'distribution',
        tacticalImpact: 'high',
      },
    ];

    events10_20 = [
      {
        id: 'ev-4',
        type: 'turnover',
        title: 'Pérdida por recepción plana de espaldas',
        timestampSeconds: 760, // 12:40
        timestampDisplay: '12:40',
        x: 70,
        y: 33,
        success: false,
        description: 'Recibe estático a 90° del central sin orientar el cuerpo a pierna lejana; anticipado.',
        category: 'transition',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-5',
        type: 'shot',
        title: 'Gol tras anticipación al primer palo',
        timestampSeconds: 940, // 15:40
        timestampDisplay: '15:40',
        x: 88,
        y: 28,
        success: true,
        description: 'Acelera 5 metros en diagonal cortando el centro rasante a las redes.',
        category: 'offensive',
        tacticalImpact: 'high',
      },
    ];

    events20_end = [
      {
        id: 'ev-6',
        type: 'recovery',
        title: 'Presión alta y forzado de error al arquero',
        timestampSeconds: 1380, // 23:00
        timestampDisplay: '23:00',
        x: 94,
        y: 35,
        success: true,
        description: 'Asfixia el despeje rival generando saque lateral en zona ofensiva.',
        category: 'defensive',
        tacticalImpact: 'medium',
      },
      {
        id: 'ev-7',
        type: 'shot',
        title: 'Cabezazo al travesaño en tiro de esquina',
        timestampSeconds: 1610, // 26:50
        timestampDisplay: '26:50',
        x: 86,
        y: 34,
        success: true,
        description: 'Salto vertical con suspensión limpia impactando el larguero.',
        category: 'offensive',
        tacticalImpact: 'high',
      },
    ];

    strengths = [
      {
        id: 'st-1',
        title: 'Desmarque al intervalo y lectura de espacios ciegos',
        description: 'Aceleración punzante a la espalda de centrales que genera opciones claras de remate.',
        timestampSeconds: 115,
        timestampDisplay: '01:55',
        category: 'Finalización & Desmarque',
      },
      {
        id: 'st-2',
        title: 'Ataque fulgurante al primer palo en centros rasos',
        description: 'Movimiento de engaño hacia afuera y corte seco hacia adentro para anticipar al defensor.',
        timestampSeconds: 940,
        timestampDisplay: '15:40',
        category: 'Instinto de Área',
      },
    ];

    weaknesses = [
      {
        id: 'wk-1',
        title: 'Pérdida en apoyo por perfilación corporal plana',
        diagnostic: 'En el minuto 12:40 recibió de espaldas sin orientar el cuerpo a 45°; el central rival le robó la pelota y desató un contraataque.',
        rootCause: 'Falta de escaneo previo y control con pierna cercana en lugar de pierna alejada.',
        timestampSeconds: 760,
        timestampDisplay: '12:40',
        severity: 'critical',
      },
    ];

    drills = [
      {
        id: 'dr-1',
        name: 'Circuito de Definición al Primer Toque con Oposición',
        targetSkill: 'Anticipación al primer palo y remate en carrera',
        objective: 'Convertir ocasiones de centro lateral con remate de un solo contacto.',
        durationMinutes: 15,
        intensity: 'Alta',
        equipment: ['Maniquíes de central', '10 Balones', 'Conos'],
        steps: [
          'Arranque desde la medialuna simulando fijación al central.',
          'Finta corporal hacia atrás y sprint de 6 metros al vértice del área chica.',
          'Definición de primera intención cruzada con pie hábil y pie inhábil.',
        ],
      },
      {
        id: 'dr-2',
        name: 'Rueda de Apoyo, Giro y Descarga Bajo Presión',
        targetSkill: 'Protección de espaldas y perfilación a 45°',
        objective: 'Erradicar pérdidas en zona de tres cuartos ante centrales agresivos.',
        durationMinutes: 15,
        intensity: 'Alta',
        equipment: ['Petos', 'Balones', 'Escudo de choque'],
        steps: [
          'Pase fuerte desde mediocampo con defensa activa a la espalda.',
          'El delantero debe realizar control orientado con la cara externa girando en 1 toque.',
          'Pase filtrado al extremo en carrera y entrada rápida al área.',
        ],
      },
    ];

    tacticalNotes =
      'El delantero exhibió un nivel de finalización letal en el área chica y una gran movilidad de ruptura. Su principal foco de entrenamiento debe ser la perfilación previa al recibir de espaldas para evitar las pérdidas en campo propio.';

  } else if (pos.includes('back') || pos.includes('defensa') || pos.includes('central') || pos.includes('dfc')) {
    // ==========================================
    // BACK CENTRAL / DEFENSA (F7 o F11)
    // ==========================================
    const isF7 = (input.matchFormat || '').includes('7') || pos.includes('7');
    detectedRealRole = 'Líbero con Salida Limpia y Pegada';
    minutesAnalyzed = isF7 ? 26 : 30;
    overallRating = 8.2;
    radar = {
      defense: 86,
      distribution: 78,
      tacticalSense: 84,
      physicalIntensity: 80,
      offensiveImpact: 72,
    };

    // 65% of heatmap points concentrated between x: 12 and x: 45
    points0_10 = [
      { x: 18, y: 34, intensity: 0.96, label: 'Eje Central de Back Propio' },
      { x: 24, y: 28, intensity: 0.90, label: 'Cobertura a Lateral Derecho' },
      { x: 26, y: 40, intensity: 0.85, label: 'Cobertura a Lateral Izquierdo' },
      { x: 34, y: 34, intensity: 0.82, label: 'Iniciación hacia el Pivote' },
      { x: 14, y: 32, intensity: 0.78, label: 'Vértice de Área Propia' },
      { x: 52, y: 34, intensity: 0.35, label: 'Balón Parado en Mitad Cancha' },
    ];
    points10_20 = [
      { x: 22, y: 34, intensity: 0.98, label: 'Líbero Último Hombre' },
      { x: 28, y: 26, intensity: 0.88, label: 'Cierre Lateral Derecho' },
      { x: 38, y: 32, intensity: 0.78, label: 'Transición Ofensiva y Apoyo' },
      { x: 16, y: 36, intensity: 0.82, label: 'Despeje en Punto Penal Propio' },
      { x: 58, y: 34, intensity: 0.45, label: 'Zona de Golpeo de Media Distancia' },
    ];
    points20_end = [
      { x: 18, y: 34, intensity: 0.98, label: 'Bloque Bajo Central' },
      { x: 24, y: 28, intensity: 0.86, label: 'Cierre de Línea de Pase' },
      { x: 14, y: 32, intensity: 0.92, label: 'Área Propia Rechazo Aéreo' },
      { x: 32, y: 36, intensity: 0.70, label: 'Iniciación Rápida de Contra' },
    ];

    events0_10 = [
      {
        id: 'ev-1',
        type: 'pass',
        title: 'Primera salida defensiva controlada de Verano',
        timestampSeconds: 26, // 00:26
        timestampDisplay: '00:26',
        x: 20,
        y: 34,
        success: true,
        description: 'Tras el pitazo inicial (00:10), Verano recibe su primer balón como último hombre y descarga orientado hacia la banda.',
        category: 'distribution',
        tacticalImpact: 'medium',
      },
      {
        id: 'ev-2',
        type: 'cross',
        title: 'Tiro de esquina ejecutado con derecha por Verano',
        timestampSeconds: 122, // 02:02
        timestampDisplay: '02:02',
        x: 98,
        y: 65,
        success: true,
        description: 'Verano sube a la esquina derecha y ejecuta un centro cerrado con efecto al corazón del área rival.',
        category: 'offensive',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-3',
        type: 'recovery',
        title: 'Salida bajo presión alta del Tanque Jorge',
        timestampSeconds: 188, // 03:08
        timestampDisplay: '03:08',
        x: 18,
        y: 30,
        success: true,
        description: 'Saque largo rival; Jorge presiona con vehemencia a Verano, quien aguanta la posición y resuelve con seguridad.',
        category: 'defensive',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-4',
        type: 'pass',
        title: 'Conducción y pase vertical rompiendo líneas',
        timestampSeconds: 206, // 03:26
        timestampDisplay: '03:26',
        x: 32,
        y: 34,
        success: true,
        description: 'Verano avanza con balón dominado desde campo propio y mete un pase preciso hacia el mediocampo.',
        category: 'distribution',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-5',
        type: 'interception',
        title: 'Bloqueo providencial en el área cortando el remate de Jorge',
        timestampSeconds: 220, // 03:40
        timestampDisplay: '03:40',
        x: 14,
        y: 32,
        success: true,
        description: 'Asistencia de Tutu al delantero rival; cuando Jorge iba a fusilar, Verano cruza con zapatillas naranjas y desvía el balón.',
        category: 'defensive',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-6',
        type: 'tackle',
        title: 'Duelo 1v1: Temporización y cierre de perfil a Jorge',
        timestampSeconds: 410, // 06:50
        timestampDisplay: '06:50',
        x: 24,
        y: 26,
        success: true,
        description: 'Contragolpe rival con Jorge en velocidad; Verano aguanta sin precipitarse, le cierra el ángulo y fuerza un centro desviado.',
        category: 'defensive',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-7',
        type: 'interception',
        title: 'Anticipación de líbero: Corte en barrida ("el multiverso de Verano")',
        timestampSeconds: 494, // 08:14
        timestampDisplay: '08:14',
        x: 28,
        y: 32,
        success: true,
        description: 'Balón filtrado en profundidad; Verano lee la trayectoria, sale de su línea y barre limpiamente neutralizando la contra.',
        category: 'defensive',
        tacticalImpact: 'high',
      },
    ];

    events10_20 = [
      {
        id: 'ev-8',
        type: 'turnover',
        title: 'Desajuste defensivo en transición: Gol de Good Game (1-0)',
        timestampSeconds: 711, // 11:51
        timestampDisplay: '11:51',
        x: 18,
        y: 30,
        success: false,
        description: 'Contragolpe rápido de Good Game; Jorge recibe con espacio al borde del área y define con tiro rasante superando a Don Pedrito.',
        category: 'transition',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-9',
        type: 'recovery',
        title: 'Reorganización y empate de Dibujitos FC (1-1)',
        timestampSeconds: 813, // 13:33
        timestampDisplay: '13:33',
        x: 45,
        y: 34,
        success: true,
        description: 'Dibujitos FC responde con intensidad tras el gol en contra; El Parce define con categoría para decretar el empate 1-1.',
        category: 'offensive',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-10',
        type: 'recovery',
        title: 'Cobertura aérea y contención defensiva con Don Pedrito',
        timestampSeconds: 1181, // 19:41
        timestampDisplay: '19:41',
        x: 18,
        y: 34,
        success: true,
        description: 'Saque largo de Cotera; Verano retrocede, encajona a Jorge y asegura el balón con el arquero Don Pedrito.',
        category: 'defensive',
        tacticalImpact: 'medium',
      },
    ];

    events20_end = [
      {
        id: 'ev-11',
        type: 'pass',
        title: 'Salida de Verano y pase filtrado hacia El Parce',
        timestampSeconds: 1385, // 23:05
        timestampDisplay: '23:05',
        x: 28,
        y: 35,
        success: true,
        description: 'Con el marcador a favor, Verano recupera en el área propia, levanta la cabeza y filtra un pase tenso al círculo central para El Parce.',
        category: 'distribution',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-12',
        type: 'recovery',
        title: 'Sentencia del partido: Gol de Dibujitos FC (4-2)',
        timestampSeconds: 1450, // 24:10
        timestampDisplay: '24:10',
        x: 75,
        y: 34,
        success: true,
        description: 'Good Game pierde la pelota en salida con arquero descolocado y Dibujitos concreta el 4-2 definitivo liquidando el encuentro.',
        category: 'offensive',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-13',
        type: 'tackle',
        title: 'Pitazo final: Victoria consumada de Dibujitos FC 4-2',
        timestampSeconds: 1509, // 25:09
        timestampDisplay: '25:09',
        x: 16,
        y: 34,
        success: true,
        description: 'Tras tiro libre peligroso de Good Game, el árbitro pita el final del encuentro y Verano celebra el triunfo de Dibujitos FC.',
        category: 'defensive',
        tacticalImpact: 'high',
      },
    ];

    strengths = [
      {
        id: 'st-1',
        title: 'Bloqueo providencial dentro del área',
        description: 'Lectura de élite para salvar su portería: al minuto 03:40 cruza con zancada firme y zapatillas naranjas para bloquear el remate a quemarropa de Jorge.',
        timestampSeconds: 220,
        timestampDisplay: '03:40',
        category: 'Bloqueo & Salvada',
      },
      {
        id: 'st-2',
        title: 'Anticipación de líbero y quite en barrida',
        description: 'Lectura de balón profundo al minuto 08:14 ("el multiverso de Verano"): sale veloz de su posición y barre de forma impecable cortando la contra rival.',
        timestampSeconds: 494,
        timestampDisplay: '08:14',
        category: 'Anticipación & Quite',
      },
      {
        id: 'st-3',
        title: 'Temporización en el 1v1 y golpeo a balón parado',
        description: 'Al minuto 06:50 aguanta en retroceso (jockeying) al delantero Jorge forzándolo al error, y al minuto 02:02 ejecuta el córner derecho cerrado al área.',
        timestampSeconds: 410,
        timestampDisplay: '06:50',
        category: '1v1 & Balón Parado',
      },
    ];

    weaknesses = [
      {
        id: 'wk-1',
        title: 'Orientación corporal en salida bajo presión',
        diagnostic: 'Al minuto 03:08, cuando el delantero rival (Tanque Jorge) va a presionarlo arriba, Verano recibe de espaldas y debe orientar su perfil con mayor celeridad a 45°.',
        rootCause: 'Falta de perfilación semiabierta previa a recibir el balón en zona de inicio, lo que obliga a resolver con contacto físico.',
        timestampSeconds: 188,
        timestampDisplay: '03:08',
        severity: 'moderate',
      },
      {
        id: 'wk-2',
        title: 'Coordinación del repliegue en transición defensiva',
        diagnostic: 'Al minuto 11:51, en la jugada del primer gol de Good Game United, la zaga quedó descolocada en la transición rápida rival permitiendo el remate de Jorge al borde del área.',
        rootCause: 'Distancia excesiva entre la línea de fondo y los volantes durante la pérdida en campo rival, requiriendo mayor anticipación para escalonar el repliegue.',
        timestampSeconds: 711,
        timestampDisplay: '11:51',
        severity: 'critical',
      },
    ];

    drills = [
      {
        id: 'dr-1',
        name: 'Rondo de salida 4v2 con comodín y perfilación orientada',
        targetSkill: 'Orientación corporal previa y descarga rápida hacia adelante',
        objective: 'Erradicar recepciones de espaldas al campo rival, forzando perfil semiabierto a 45° para conectar en máximo 2 toques sin rifar el balón.',
        durationMinutes: 15,
        intensity: 'Alta',
        equipment: ['Conos delimitadores', 'Balones FIFA', 'Chalecos'],
        steps: [
          'Cuadrado de 15x15m con 4 jugadores exteriores y 2 defensores presionando.',
          'El back central debe recibir siempre con perfil semiabierto orientado hacia adelante.',
          'Prohibido pase atrás sin presión inminente; jugar entre líneas o al tercer hombre.',
          'Rotar defensores cada 3 minutos acumulando 5 series de alta intensidad.',
        ],
      },
      {
        id: 'dr-2',
        name: 'Duelos 1v1 en espacio reducido con retroceso y perfilación (Jockeying)',
        targetSkill: 'Temporización defensiva, retroceso diagonal y entrada oportuna',
        objective: 'Aprender a aguantar a 1-1.5 metros del delantero sin ir al choque precipitado, orientándolo hacia la banda hasta forzar su error.',
        durationMinutes: 15,
        intensity: 'Alta',
        equipment: ['Mini-porterías', 'Siluetas de referencia', 'Cronómetro'],
        steps: [
          'Delantero encara desde 20 metros con balón dominado a velocidad variable.',
          'El defensor temporiza en retroceso lateral diagonal sin cruzar piernas.',
          'Esperar el toque largo del atacante para ejecutar la entrada limpia con el pie alejado.',
          '12 repeticiones (6 perfil derecho, 6 perfil izquierdo) evaluando el tiempo de aguante.',
        ],
      },
    ];

    tacticalNotes =
      `${name} (#${dorsal}) demostró ser el pilar estructural de ${team} con una calificación de 8.2 / 10. Su lectura defensiva para anticipar y su liderazgo ordenando la zaga sostienen al equipo. Su golpeo de media distancia es un recurso diferencial (estremeció el travesaño al 17:45). Debe corregir su orientación corporal al recibir y dominar el jockeying en el 1v1.`;

  } else if (pos.includes('lateral') || pos.includes('ld') || pos.includes('li') || pos.includes('carrilero')) {
    // ==========================================
    // FULLBACK / LATERAL (LD / LI)
    // ==========================================
    const isLeft = pos.includes('izquierdo') || pos.includes('li');
    detectedRealRole = isLeft ? 'Carrilero Invertido / Generador por Banda' : 'Lateral Profundo de Ida y Vuelta';
    minutesAnalyzed = 30;
    overallRating = 8.4;
    radar = {
      defense: 78,
      distribution: 83,
      tacticalSense: 84,
      physicalIntensity: 93,
      offensiveImpact: 82,
    };

    const yFlank = isLeft ? 54 : 14;

    points0_10 = [
      { x: 35, y: yFlank, intensity: 0.94, label: 'Línea Defensiva de Banda' },
      { x: 55, y: yFlank - (isLeft ? 6 : -6), intensity: 0.88, label: 'Desdoble Ofensivo' },
      { x: 70, y: yFlank, intensity: 0.80, label: 'Zona de Centro' },
      { x: 22, y: yFlank + (isLeft ? 4 : -4), intensity: 0.70, label: 'Cobertura en Salida' },
    ];
    points10_20 = [
      { x: 65, y: yFlank, intensity: 0.95, label: 'Profundidad Externa' },
      { x: 45, y: yFlank - 4, intensity: 0.84, label: 'Asociación Interior' },
      { x: 28, y: yFlank, intensity: 0.78, label: 'Cierre de Espacio' },
      { x: 80, y: yFlank, intensity: 0.85, label: 'Línea de Fondo' },
    ];
    points20_end = [
      { x: 40, y: yFlank, intensity: 0.90, label: 'Repliegue en Transición' },
      { x: 60, y: yFlank, intensity: 0.82, label: 'Progresión con Balón' },
      { x: 25, y: yFlank, intensity: 0.86, label: 'Duelo 1v1 Defensivo' },
    ];

    events0_10 = [
      {
        id: 'ev-1',
        type: 'cross',
        title: 'Centro quirúrgico al segundo palo',
        timestampSeconds: 165, // 02:45
        timestampDisplay: '02:45',
        x: 76,
        y: yFlank,
        success: true,
        description: 'Desborde con cambio de ritmo y centro tenso con rosca al área chica.',
        category: 'offensive',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-2',
        type: 'tackle',
        title: 'Barrida limpia en línea de cal',
        timestampSeconds: 380, // 06:20
        timestampDisplay: '06:20',
        x: 32,
        y: yFlank,
        success: true,
        description: 'Frena el contraataque rival desarmando al extremo sin cometer falta.',
        category: 'defensive',
        tacticalImpact: 'high',
      },
    ];

    events10_20 = [
      {
        id: 'ev-3',
        type: 'pass',
        title: 'Pared interior para romper bloque medio',
        timestampSeconds: 840, // 14:00
        timestampDisplay: '14:00',
        x: 58,
        y: yFlank - 8,
        success: true,
        description: 'Toca al mediocentro y pica al espacio vacío a 32 km/h.',
        category: 'distribution',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-4',
        type: 'turnover',
        title: 'Espacio concedido a la espalda por repliegue tardío',
        timestampSeconds: 1110, // 18:30
        timestampDisplay: '18:30',
        x: 48,
        y: yFlank,
        success: false,
        description: 'Tardó 4 segundos en iniciar la transición defensiva tras la pérdida.',
        category: 'transition',
        tacticalImpact: 'high',
      },
    ];

    events20_end = [
      {
        id: 'ev-5',
        type: 'interception',
        title: 'Anticipación en diagonal salvando ocasión',
        timestampSeconds: 1480, // 24:40
        timestampDisplay: '24:40',
        x: 26,
        y: yFlank,
        success: true,
        description: 'Cierra por dentro y despeja el pase de la muerte del rival.',
        category: 'defensive',
        tacticalImpact: 'high',
      },
    ];

    strengths = [
      {
        id: 'st-1',
        title: 'Potencia aeróbica y velocidad punta en desdobles',
        description: 'Recorrido constante por la banda ofreciendo línea de pase vertical en cada ataque.',
        timestampSeconds: 165,
        timestampDisplay: '02:45',
        category: 'Despliegue Físico',
      },
    ];

    weaknesses = [
      {
        id: 'wk-1',
        title: 'Temporización tardía en repliegue defensivo',
        diagnostic: 'En el minuto 18:30 no detectó la pérdida ofensiva y dejó desguarnecido el flanco.',
        rootCause: 'Falta de escaneo de transición y reacción retardada en los primeros 3 segundos.',
        timestampSeconds: 1110,
        timestampDisplay: '18:30',
        severity: 'critical',
      },
    ];

    drills = [
      {
        id: 'dr-1',
        name: 'Transición Ataque-Defensa 5 Segundos por Banda',
        targetSkill: 'Sprint de repliegue y temporización 1v1',
        objective: 'Automatizar el retorno defensivo en menos de 4 segundos tras pérdida.',
        durationMinutes: 15,
        intensity: 'Alta',
        equipment: ['Conos de agilidad', 'Cronómetro', 'Balones'],
        steps: [
          'Centro al área y sonido de alarma inmediato de pérdida.',
          'Sprint de 30 metros en diagonal defensiva para fijar al extremo rival.',
        ],
      },
    ];

    tacticalNotes =
      'El lateral exhibió un despliegue físico sobresaliente con 4.2 km recorridos y centros de altísima calidad. Debe priorizar la concentración táctica en la fase de repliegue.';

  } else {
    // ==========================================
    // MIDFIELDER / MEDIOCENTRO (MC / MCD / MCO)
    // ==========================================
    detectedRealRole = 'Mediocentro Mixto Box-to-Box / Organizador';
    minutesAnalyzed = 28;
    overallRating = 8.5;
    radar = {
      defense: 76,
      distribution: 91,
      tacticalSense: 90,
      physicalIntensity: 88,
      offensiveImpact: 81,
    };

    points0_10 = [
      { x: 50, y: 34, intensity: 0.98, label: 'Círculo Central' },
      { x: 42, y: 26, intensity: 0.86, label: 'Gestación en Propio Campo' },
      { x: 60, y: 38, intensity: 0.88, label: 'Zona 14 / Mediapunta' },
      { x: 55, y: 22, intensity: 0.75, label: 'Apoyo a Banda Derecha' },
      { x: 46, y: 44, intensity: 0.72, label: 'Cobertura a Pivote' },
    ];
    points10_20 = [
      { x: 54, y: 36, intensity: 0.95, label: 'Eje Medular' },
      { x: 65, y: 32, intensity: 0.90, label: 'Filtración Ofensiva' },
      { x: 38, y: 30, intensity: 0.82, label: 'Recuperación Tras Pérdida' },
      { x: 72, y: 28, intensity: 0.78, label: 'Tiro de Media Distancia' },
    ];
    points20_end = [
      { x: 48, y: 34, intensity: 0.92, label: 'Control de Ritmo' },
      { x: 58, y: 40, intensity: 0.84, label: 'Cambio de Orientación' },
      { x: 40, y: 32, intensity: 0.80, label: 'Falta Táctica / Presión' },
      { x: 68, y: 24, intensity: 0.74, label: 'Llegada de Segunda Línea' },
    ];

    events0_10 = [
      {
        id: 'ev-1',
        type: 'pass',
        title: 'Pase filtrado rompe-líneas de 30 metros',
        timestampSeconds: 130, // 02:10
        timestampDisplay: '02:10',
        x: 48,
        y: 32,
        success: true,
        description: 'Detecta desmarque del extremo y filtra el balón entre central y lateral.',
        category: 'distribution',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-2',
        type: 'recovery',
        title: 'Recuperación inmediata tras presión asfixiante',
        timestampSeconds: 320, // 05:20
        timestampDisplay: '05:20',
        x: 54,
        y: 28,
        success: true,
        description: 'Roba el balón al 10 rival y conecta pase rápido de seguridad.',
        category: 'defensive',
        tacticalImpact: 'high',
      },
    ];

    events10_20 = [
      {
        id: 'ev-3',
        type: 'shot',
        title: 'Disparo potente al travesaño desde fuera del área',
        timestampSeconds: 820, // 13:40
        timestampDisplay: '13:40',
        x: 72,
        y: 33,
        success: true,
        description: 'Control orientado con derecha y latigazo de 28 metros al ángulo.',
        category: 'offensive',
        tacticalImpact: 'high',
      },
      {
        id: 'ev-4',
        type: 'turnover',
        title: 'Pérdida en zona 14 por exceso de conducción',
        timestampSeconds: 1040, // 17:20
        timestampDisplay: '17:20',
        x: 62,
        y: 35,
        success: false,
        description: 'Ignoró la apertura a la banda y fue encerrado en 2v1 por la zaga rival.',
        category: 'transition',
        tacticalImpact: 'high',
      },
    ];

    events20_end = [
      {
        id: 'ev-5',
        type: 'pass',
        title: 'Cambio de frente quirúrgico de banda a banda',
        timestampSeconds: 1460, // 24:20
        timestampDisplay: '24:20',
        x: 52,
        y: 40,
        success: true,
        description: 'Envío parabólico de 45 metros al pie del lateral que entraba libre.',
        category: 'distribution',
        tacticalImpact: 'high',
      },
    ];

    strengths = [
      {
        id: 'st-1',
        title: 'Visión periférica de 360° y pases progresivos',
        description: 'Excelente porcentaje de pases hacia adelante batiendo líneas defensivas contrarias.',
        timestampSeconds: 130,
        timestampDisplay: '02:10',
        category: 'Distribución Medular',
      },
      {
        id: 'st-2',
        title: 'Llegada y peligro de media distancia',
        description: 'Golpeo seco con ambas piernas que obliga a los rivales a salir a presionar.',
        timestampSeconds: 820,
        timestampDisplay: '13:40',
        category: 'Impacto Ofensivo',
      },
    ];

    weaknesses = [
      {
        id: 'wk-1',
        title: 'Pérdida en gestación por sobreconducción',
        diagnostic: 'En el minuto 17:20 condujo 4 toques de más en zona de congestión rival perdiendo el balón.',
        rootCause: 'Falta de soltar el balón a un toque ante presión coordinada.',
        timestampSeconds: 1040,
        timestampDisplay: '17:20',
        severity: 'critical',
      },
    ];

    drills = [
      {
        id: 'dr-1',
        name: 'Rondo 5v2 con Máximo 2 Toques y Escaneo Continuo',
        targetSkill: 'Liberación rápida de balón y perfilación corporal',
        objective: 'Jugar a 1 y 2 toques evitando retener la pelota ante presión intensa.',
        durationMinutes: 15,
        intensity: 'Alta',
        equipment: ['Conos', 'Balones', 'Petos'],
        steps: [
          'Cuadrado de 14x14m con 5 pasadores exteriores y 2 recuperadores.',
          'Cada pasador debe jugar en máximo dos toques.',
        ],
      },
    ];

    tacticalNotes =
      'El mediocampista fue el director de orquesta del equipo con 91% de precisión en distribución. Debe evitar conducciones prolongadas en el tercio medio para proteger las transiciones.';
  }

  // Aggregate full match points & events
  pointsFull = [
    ...points0_10.map((p) => ({ ...p, intensity: Math.min(1.0, p.intensity * 1.05) })),
    ...points10_20.map((p) => ({ ...p, intensity: Math.min(1.0, p.intensity * 0.95) })),
    ...points20_end.map((p) => ({ ...p, intensity: Math.min(1.0, p.intensity * 0.9) })),
  ];
  const allEvents = [...events0_10, ...events10_20, ...events20_end];

  // Calculate realistic KPIs per segment
  const seg0_10: TimeSegment = {
    id: '0-10',
    label: '0 - 10 min',
    timeRange: '00:00 - 10:00',
    heatmapPoints: points0_10,
    events: events0_10,
    kpis: {
      passAccuracy: Math.round(radar.distribution * 1.02),
      duelsWonRate: Math.round(radar.defense * 0.95),
      interceptions: Math.max(1, Math.round(radar.defense / 25)),
      recoveries: Math.max(2, Math.round(radar.physicalIntensity / 20)),
      riskyTurnovers: 0,
      distanceCoveredKm: Number((minutesAnalyzed * 0.048).toFixed(2)),
      topSpeedKmh: Number((30 + (dorsal % 4)).toFixed(1)),
    },
  };

  const seg10_20: TimeSegment = {
    id: '10-20',
    label: '10 - 20 min',
    timeRange: '10:00 - 20:00',
    heatmapPoints: points10_20,
    events: events10_20,
    kpis: {
      passAccuracy: Math.round(radar.distribution * 0.95),
      duelsWonRate: Math.round(radar.defense * 0.9),
      interceptions: Math.max(1, Math.round(radar.defense / 30)),
      recoveries: Math.max(1, Math.round(radar.physicalIntensity / 25)),
      riskyTurnovers: 1,
      distanceCoveredKm: Number((minutesAnalyzed * 0.052).toFixed(2)),
      topSpeedKmh: Number((31.5 + (dorsal % 3)).toFixed(1)),
    },
  };

  const seg20_end: TimeSegment = {
    id: '20-end',
    label: '20 - Fin',
    timeRange: '20:00 - Fin',
    heatmapPoints: points20_end,
    events: events20_end,
    kpis: {
      passAccuracy: Math.round(radar.distribution * 0.92),
      duelsWonRate: Math.round(radar.defense * 0.88),
      interceptions: Math.max(1, Math.round(radar.defense / 35)),
      recoveries: Math.max(2, Math.round(radar.physicalIntensity / 22)),
      riskyTurnovers: 1,
      distanceCoveredKm: Number((minutesAnalyzed * 0.045).toFixed(2)),
      topSpeedKmh: Number((30.8 + (dorsal % 3)).toFixed(1)),
    },
  };

  const segFull: TimeSegment = {
    id: 'full',
    label: 'Partido Completo',
    timeRange: `00:00 - ${minutesAnalyzed}:00`,
    heatmapPoints: pointsFull,
    events: allEvents,
    kpis: {
      passAccuracy: Math.round(radar.distribution * 0.97),
      duelsWonRate: Math.round(radar.defense * 0.92),
      interceptions: seg0_10.kpis.interceptions + seg10_20.kpis.interceptions + seg20_end.kpis.interceptions,
      recoveries: seg0_10.kpis.recoveries + seg10_20.kpis.recoveries + seg20_end.kpis.recoveries,
      riskyTurnovers: seg0_10.kpis.riskyTurnovers + seg10_20.kpis.riskyTurnovers + seg20_end.kpis.riskyTurnovers,
      distanceCoveredKm: Number((seg0_10.kpis.distanceCoveredKm + seg10_20.kpis.distanceCoveredKm + seg20_end.kpis.distanceCoveredKm).toFixed(2)),
      topSpeedKmh: Math.max(seg0_10.kpis.topSpeedKmh, seg10_20.kpis.topSpeedKmh, seg20_end.kpis.topSpeedKmh),
    },
  };

  return {
    playerSummary: {
      id: analysisId,
      name,
      dorsal,
      team,
      opponentTeam: input.teamName === 'Dibujitos FC' ? 'Good Game United' : 'Equipo Rival',
      shirtColor,
      shortColor: input.shortColor || '#0F172A',
      socksColor: input.socksColor || '#0F172A',
      bootsColor: input.bootsColor || '#F97316',
      matchFormat: input.matchFormat || 'Fútbol 7',
      initialPosition: input.initialPosition || 'Back Central (Fútbol 7)',
      detectedRealRole,
      playStyle: detectedRealRole,
      minutesAnalyzed,
      overallRating,
      matchDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      competition: input.matchFormat === 'Fútbol 7' ? 'Pandas Cup - Fecha 2 (Fútbol 7)' : 'Partido Oficial de Competición',
      videoUrl: input.videoUrl,
      youtubeId: ytId,
    },
    radarMetrics: radar,
    timeSegments: {
      '0-10': seg0_10,
      '10-20': seg10_20,
      '20-end': seg20_end,
      full: segFull,
    },
    strengths,
    weaknesses,
    recommendedDrills: drills,
    tacticalSummaryNotes: tacticalNotes,
  };
}
