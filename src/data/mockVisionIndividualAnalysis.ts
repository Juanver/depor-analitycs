export const MOCK_VISION_INDIVIDUAL_RESPONSE = {
  modo: "individual" as const,
  matchContext: {
    formatoJuego: "Fútbol 7",
    sistemaTacticoNominal: "1-2-3-1",
    rival: "GGAM FC",
    duracionVideoSegundos: 121.0,
    duracionFormato: "02:01",
    tramoAnalizado: "00:00 - 02:01",
  },
  playerSummary: {
    nombre: "Verano",
    dorsal: "7",
    equipo: "Dibujitos FC",
    posicionInicial: "Back Central / Líbero",
    vestimenta: "Camiseta negra, short negro, calzado flúor",
    colorDetectadoIA: "negro",
    rolDetectado: "Líbero con proyección ofensiva (stopper)",
    ratingGlobal: 7.8,
    impactoTacticoBadge: "ALTO IMPACTO TÁCTICO",
    estiloJuego:
      "Defensor con despliegue de ruptura y criterio en la transición",
    dictamenTactico:
      "Defensor con despliegue de ruptura y criterio en la transición. Rol detectado: Líbero con proyección ofensiva (stopper) (Fútbol 7).",
    resumenTacticoCorto:
      "Despliegue integral de Verano: pilar en la última línea con 9 intercepciones, 83% de duelos ganados y salida limpia desde el fondo.",
    resumenEjecutivo:
      "Pilar defensivo en la última línea dentro del esquema 1-2-3-1 de Fútbol 7. Registró un 83% de precisión en salida limpia y 83% en duelos 1v1, destacando por su lectura anticipativa y conducción en transición. Mostró margen de mejora en la velocidad de repliegue tras proyectarse al tercio ofensivo.",
    radarMetrics: {
      defensa: 85,
      distribucion: 75,
      tactica: 80,
      intensidad: 70,
      ofensiva: 65,
    },
    radarPromedioPosicional: {
      defensa: 76,
      distribucion: 70,
      tactica: 74,
      intensidad: 72,
      ofensiva: 58,
    },
    fortalezas: [
      {
        titulo: "Cobertura en línea lateral",
        detalle:
          "Excelente desplazamiento inicial pegado a la banda para cerrar espacios, manteniendo control en t: 94.62",
        timestampSeconds: 94.62,
        badge: "RENDIMIENTO YOLOV8",
      },
      {
        titulo: "Conducción en transición",
        detalle:
          "Decisión correcta al romper líneas conduciendo hacia el sector ofensivo en t: 100.7",
        timestampSeconds: 100.7,
        badge: "RENDIMIENTO YOLOV8",
      },
    ],
    areasMejora: [
      {
        titulo: "Estabilidad en zona central",
        detalle:
          "Excesiva fluctuación en la ubicación defensiva entre t: 96.81 y t: 98.27 que compromete el equilibrio del equipo",
        timestampSeconds: 97.29,
        prioridad: "PRIORIDAD MODERADA",
        causaRaiz:
          "Desajuste posicional detectado en la secuencia de tracking.",
      },
      {
        titulo: "Repliegue tras ataque",
        detalle:
          "Lentitud en el re-posicionamiento defensivo tras alcanzar el tercio ofensivo en t: 102.4",
        timestampSeconds: 102.65,
        prioridad: "PRIORIDAD MODERADA",
        causaRaiz:
          "Desajuste posicional detectado en la secuencia de tracking.",
      },
    ],
    ejerciciosRecomendados: [
      {
        titulo: "Juego de posición y basculación",
        enfoque: "Comprensión táctica",
        duracion: "20 min",
        intensidad: "INTENSIDAD ALTA",
        descripcion:
          "Ejercicios de 3v3 con énfasis en mantener la línea de fondo de Fútbol 7 sin abandonar el eje central tras la pérdida.",
        pasos: [
          "Organizar dos equipos de 3 jugadores en zona defensiva reducida de Fútbol 7.",
          "Al perder el balón, el líbero debe cerrar el eje central en menos de 3 segundos antes de presionar.",
        ],
        material: ["Conos", "Balones", "Pecheras"],
      },
      {
        titulo: "Sprint de repliegue reactivo",
        enfoque: "Intensidad física",
        duracion: "15 min",
        intensidad: "INTENSIDAD ALTA",
        descripcion:
          "Circuito que simula la transición defensa-ataque-defensa para mejorar la velocidad de retorno a la posición de líbero.",
        pasos: [
          "Conducción progresiva de 15 metros superando línea media.",
          "Señal auditiva de pérdida y sprint inmediato de retorno perfilado hacia arco propio.",
        ],
        material: ["Conos", "Balones", "Vallas bajas"],
      },
    ],
    evaluacionPosicionamientoTactico: {
      cumplimientoPosicional: 82,
      criterios: [
        { label: "Ocupa correctamente su zona", porcentaje: 85 },
        { label: "Apoya la salida del balón", porcentaje: 90 },
        { label: "Mantiene equilibrio defensivo", porcentaje: 75 },
        { label: "Retorna a su posición", porcentaje: 78 },
      ],
      diagnostico:
        "Buena disciplina posicional en ataque, pero presenta dificultades para recuperar su ubicación defensiva después de perder el balón.",
    },
  },
  seguimientoTactico: {
    accionesClaveCount: 4,
    pasesExitoPct: 83,
    duelos1v1Pct: 83,
    cortesAnticipaciones: 9,
    resumenCorto:
      "Despliegue integral de Verano: pilar en la última línea con 9 intercepciones, 83% de duelos ganados y salida limpia desde el fondo.",
    jugadasReales: [
      {
        titulo: "Cobertura en línea lateral",
        detalle:
          "Excelente desplazamiento inicial pegado a la banda para cerrar espacios en t: 94.62",
        timestampSeconds: 94.62,
        timestampLabel: "01:35",
        estado: "COMPLETADO",
        x: 21.4,
        y: 98.9,
      },
      {
        titulo: "Estabilidad en zona central",
        detalle:
          "Excesiva fluctuación en la ubicación defensiva entre t: 96.81 y t: 98.27 que compromete el equilibrio del equipo",
        timestampSeconds: 97.29,
        timestampLabel: "01:37",
        estado: "AJUSTE TÁCTICO",
        x: 34.1,
        y: 72.9,
      },
      {
        titulo: "Conducción en transición",
        detalle:
          "Decisión correcta al romper líneas conduciendo hacia el sector ofensivo en t: 100.7",
        timestampSeconds: 100.7,
        timestampLabel: "01:41",
        estado: "COMPLETADO",
        x: 54.2,
        y: 72.1,
      },
      {
        titulo: "Repliegue tras ataque",
        detalle:
          "Lentitud en el re-posicionamiento defensivo tras alcanzar el tercio ofensivo en t: 102.4",
        timestampSeconds: 102.65,
        timestampLabel: "01:43",
        estado: "AJUSTE TÁCTICO",
        x: 68.4,
        y: 69.7,
      },
    ],
  },
  kpisCuantitativos: [
    {
      id: "pases",
      titulo: "PRECISIÓN DE PASES",
      valor: 83,
      unidad: "%",
      badge: "ESTÁNDAR",
      subtitulo: "Distribución y salida limpia",
      progreso: 83,
      promedioReferencia: "80%",
      valoracionPdf: "Superior",
    },
    {
      id: "duelos",
      titulo: "DUELOS GANADOS",
      valor: 83,
      unidad: "%",
      badge: "DOMINANTE",
      subtitulo: "Duelos 1v1 y choques directos",
      progreso: 83,
      promedioReferencia: "72%",
      valoracionPdf: "Óptima",
    },
    {
      id: "intercepciones",
      titulo: "INTERCEPCIONES & CORTES",
      valor: 9,
      unidad: "",
      badge: "ALTO IMPACTO",
      subtitulo: "Anticipación y lectura defensiva",
      progreso: 85,
      promedioReferencia: "6",
      valoracionPdf: "Óptima",
    },
    {
      id: "velocidad",
      titulo: "VELOCIDAD PUNTA",
      valor: 28.4,
      unidad: "km/h",
      badge: "SPRINT EXPLOSIVO",
      subtitulo: "Aceleración en repliegue",
      progreso: 88,
      promedioReferencia: "26.5 km/h",
      valoracionPdf: "Controlado",
    },
  ],
  evaluacionCualitativaKpis: [
    {
      titulo: "INTERCEPCIONES Y CORTES",
      badge: "ALTA EFECTIVIDAD",
      detalle:
        "Anticipa pases filtrados y balones divididos con notable lectura defensiva.",
    },
    {
      titulo: "PRECISIÓN EN SALIDA",
      badge: "SEGURA EN CORTO",
      detalle:
        "Seguro cuando conecta raso al pie; margen de mejora al rifar en largo bajo presión.",
    },
    {
      titulo: "PELOTA PARADA Y REMATES",
      badge: "PROYECCIÓN OFENSIVA",
      detalle:
        "Buena presencia en segunda jugada y criterio para sumarse al ataque.",
    },
    {
      titulo: "DUELOS FÍSICOS GANADOS",
      badge: "COMPETITIVO",
      detalle:
        "Solvente en el choque cuerpo a cuerpo sin conceder faltas innecesarias.",
    },
  ],
  rendimientoPorFases: {
    faseOfensiva: [
      {
        titulo: "Salida Limpia",
        detalle: "Conexión segura al pie bajo presión en campo propio.",
      },
      {
        titulo: "Progresión",
        detalle: "Conducción vertical rompiendo primera línea en t: 100.7.",
      },
      {
        titulo: "Área de Influencia",
        detalle: "Control del eje central y carril izquierdo.",
      },
    ],
    faseDefensiva: [
      {
        titulo: "Duelos Terrestres",
        detalle: "83% de efectividad en enfrentamientos 1v1.",
      },
      {
        titulo: "Recuperaciones",
        detalle: "9 intercepciones por anticipación en última línea.",
      },
      {
        titulo: "Punto de Ajuste",
        detalle: "Retorno más veloz tras proyectarse al tercio ofensivo.",
      },
    ],
  },
  evaluacionPosicionamientoTactico: {
    cumplimientoPosicional: 82,
    criterios: [
      { label: "Ocupa correctamente su zona", porcentaje: 85 },
      { label: "Apoya la salida del balón", porcentaje: 90 },
      { label: "Mantiene equilibrio defensivo", porcentaje: 75 },
      { label: "Retorna a su posición", porcentaje: 78 },
    ],
    diagnostico:
      "Buena disciplina posicional en ataque, pero presenta dificultades para recuperar su ubicación defensiva después de perder el balón.",
  },
  conclusionesPlanAccion: [
    {
      titulo: "Potenciar Virtud Principal",
      detalle:
        "Mantener la lectura anticipativa y la conducción progresiva para romper líneas desde el fondo.",
    },
    {
      titulo: "Dosificación y Repliegue",
      detalle:
        "Acelerar el retorno defensivo al eje central inmediatamente después de finalizar la proyección ofensiva.",
    },
    {
      titulo: "Trabajo Específico",
      detalle:
        "Ejecutar los drills de basculación 3v3 y sprint de repliegue reactivo en dimensiones de Fútbol 7.",
    },
  ],
  reportePdf: {
    filename: "informe_individual_verano.pdf",
    mimeType: "application/pdf",
    base64: "JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOSAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyAxMCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgOCAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0F1dGhvciAoXChhbm9ueW1vdXNcKSkgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MTExMzA1MDkxMC0wNScwMCcpIC9DcmVhdG9yIChcKHVuc3BlY2lmaWVkXCkpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MTExMzA1MDkxMC0wNScwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0IChcKHVuc3BlY2lmaWVkXCkpIC9UaXRsZSAoSW5mb3JtZSBFamVjdXRpdm8gZGUgUmVuZGltaWVudG8gLSBMb3MgT2pvcyBkZWwgRlwzNzJ0Ym9sKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjggMCBvYmoKPDwKL0NvdW50IDIgL0tpZHMgWyA0IDAgUiA1IDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKOSAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCA0MTY0Cj4+CnN0cmVhbQpHYiIuP0NOJjdDbltqOmkhNiQiIkxQbzFZNzZVKC5mNVw2KjMtIU1tO0FAMWc3OFwodEFdWklXQyVtKClCMS5XP0Q+QjxhKEZUZEw3ak51UWJgTUdXJSldbSNeVEA+TmJsQnElaVN1M2RgYVNdSGJjci5UJVxaLFNJLVhuS21yRDNVKCJlKFU0ODxuN28zPCxebVQ7Kz5dOUBkai9LbCxYNVFtRD05LG9faWtsYiYmPWxXXW5QRSpaQicsKDVHRUVFOTQ4ZTNIWEJBIjdVa3QmX3JgQTo0clJTbmNsXSpMRF5kKmlsJiVKJ2FeP0xaIUZTQU9DJG5HKVB0Olo3bWQmJV5ILUUqL1BbT3ArUEQyLU0+KCVSN2NUYiNjYjNIXFMiNkl1NSU2U3FaRlQwUlxOOjAxOFM8V0ZXXmgqNF5YbUw0REU3PVU7KWBtNDMpKig5bm5rLzhkTmpEREhCYkdfZz5YL0FtNiJMKkRZRCY+ZEpnXCdXKXMxTjNFUVAtLGEzLDZfZDtnajdwZiIxTSdTa0k/azFmNTI9dTdZP3U0V2c3LSRrNSRxUGY7bWxqSFxAVVFPXUYvQTY8JFtiJCE5UysqKzJpOG9ZVztcTlNvJFVhIk5OczUvYy43ZXF1Il9xRUBEWFlsZ0khL20tPj80UE0wSkFkI29NI3NIPHUmXTwnTipQOiloYFYhK0dtOD1lMyZdSkwvUjAxPCw0M0ZNNCtYbzwvYDI4VF4qMTBBQVw0biprTDgsJzZePlAnMXJmQ1labkVIanVFL2ZLV2Y8SzplWVxcXHRSW0tLNkQzUzswPmBySCFVUERhKyRlY2tcPj5nVDlKa3JTWyxaYD5MXEByckJZUFFXR2RkUSFlI0JxQzwlKiY4M01vIXI6SW0iZ2chKzUxIShVcjVWNmpkOileO0Q4NWdiMywzLjpVTDIvPWJhZSwvdEorQTNjKWQ5VzY6XW5wSz51Z0M/IU1EUW4uWmVJaVgxYUlOWnEsQVpOPCpvVUBPVV9RRkpcJzVuXj9wdUI+OEFIXlZsPSQkZCpZOiQyNilbZzQ9TFJDZlRRLmYkLVJvLUE9dDJTWloxMTlhRitMWkduZzA2Qi49VipySlA0MFRGZjU2JyxGaiVGJWopQlBgT2JbNnJbZ21WVXMyTjdCT3FWNmFsQCVHZEdRTUdcMUxkcCwvXmdROEw2LT5iSlBudDk7VF9uJVM7YmJEUnF1WVUodCU8RGBbKkEkcnVXMiljVjclcyI+RDJAPCQuTTdKVl1JNT08JjRtJ21KV2F1bTsjKFNASjpURmI6VWkxUDFiImQjWmw+VzhMQlF0VDNROERuPS0kKC5LVGI0Tjw7TW8oLFssbjlAQjFUPCtvTEkjVDZObE5ZbFEnPy0hS1o3VFRXNzdtVU9iVlBMN2g7XjUxYl8/ampAUnVFREQ+QSxIOCN0PFtQZyQ4X2Q+bnAubUYwUkc6T1kmYVNBO1BUQUY+XCMqcEYrQU00ZGJeTV8sbUE8aExPZF1zJiVmZUFXMHMxLVE0IjgzUVpXVnAyTm9SQGksYVVabyMqdUFoTlBZTG0iaDU6KDUsaEdkIyJUPWE+P01aUlpyMiMjLycmQGtrOW90MDo7WXJXclRSUFRAU0hmUiVUUm10MWQiV3VHZzBBbmVmKD1AVlhiS0RNZiRbLzEnZjcqNFEmWTlsS2ZKc01xbWgmLilYaGJ0LF9oZC5vZyo4VFxBdShmcWBUdEVTdWBgTUZyKHMnUUdfVW1oNidnPSgzPmplUDE8bjJZSWBiI1tsOmY1PlsvQSVGKTEwP2JCcjdaXEBdMVdHVj5rP0xsMzdJNEcucEFJdWc/UVxKTUVpLktbcE0xc0hmWENDJ1pJTWUsKUVhMlMjJ3Boa1tnMVhOYzZIMDsxXUVqbSQrYkVNOidzNksoMUFxWEstNExqLFpQTE1TJEcxKEsnOVVJR3FMWGYmJ2AiVHB0JXBnKEFxL2M5Oz9bIS08TERTLiFpXFZUcGckZW1RWC5tJWxkPE9BMCFwZUYnUicpV2kjcy5bPSdHI1oyXm1EWjsyIW0tXi9wW148Okg9bVllY1UuW2ktNzpPOWRiNmc3QXVzZVs7Yi5RW29gT28zWDRIU0twPjtuWS1fOyo3PWFZR2wkMDU0KWJWW2ZEZic6NWskLS5MMllbWCZxU287KlRHPV9wIjJmLmpeNUJeMF9QI20rKCRAR0o9LnJbYXFDRVFhPGojSm8lKkpCWUUwSSkrSll1WUlyJk1cNVVoQmdLT20rV2hLb2hKWmFQbWJkQTRzOU9GUkcsKWhjO0sqWiNiQEhjNUQoSCovLVEyQUchSGtBTzRzV1ElOlNQaSIwQl5rMzBKSU4zJFxbRkdoaEkqWUQ3KVJqVEEsMDhKVE5hJlNZKFFFYU5iLydfSFBfXk5fTUYtdStvLzY3aywiJ2NRYUtHZ3BDUj40RWo+aTNaNzRnJDlYN1NvQ2FxQTUiZkApNWpHa3FeYzRfVyR1ZmBBITNXRWVMQUxpIl9BRThDZiRZJ18rOltpb2E8OGkiayRvMCNNLTE2XllfRy90c1RyRCpFJEE3QT1uSmItXDJiLiokcC04MC1WQkUidXNCQzZxZVMoKyUrMWxyNHVTPnMnK3FlZjYsNHMhXFk7PkFOQ2lab3JCXVNiMUlTcDwuPVFvKz5gdVliNDlbOm45SzlSNVJsR1UzLWNQOClPazBKTjRecVdNTUZjbWtjWFsubzdzSHFzOipOMFMkcmFbciNBN0Y0MyVga2QjXCQ1bzU6NFpvPlJOOllmRnMpWE1JPTg6ZUlyPlJWbGhNZmlGMTNnXENKSks6cylwV1c0bz42ODsrYzZjLW1MU1lvdChsRFhrYFcrPkNbNlM6R2pcJyRSYDorPlBUTyZDUlhqXWJPVTJXI2deM2xOWi5ZXyhEaGQzR1NJYytzWk1ZdS4oZ3FNS3MrYUslVDE3cCEwM1VUWElnN11eWUA5ZE1JQ0AhMmBTX204UENzMVNCQGM7LiwzO0ElNFZOWjclUlcwMFQ6WydAU1UwVlMpMVM2LVlydDdbZUFmayo3W1BdVW5VbEdNPzVKRjdfXDlRZlQ9MS0saE1VNlBzYD0sQHVkSVM3Z1MqTU9VNS01L3VvUDVKOyUkJmNQUlpdNyYxZ049Riw7NThkU0FrXylsNFgtK1lZNGRtNWtnNkpyaj9pTSVKPlhjVlpRWjFjOzgsPmIqaFxbPGtZRmBBTWRbVzwlI18rWyksYEhgW3RrPWcoa1ZtUCoqNTVrQSFPKiRyZGcoWnUoNiJVUjM5LF5URW0yK1QrY19acEc2Ny8lW0k4YEEyPTZyQVwtRyJlSzQ6J1tBO1EjaiUsVUpBYSM9THFtUGJvQ15PU2FLaF1cajY7cWIqOjBiTVxDQD4sViReai9MVjxFN0RAQz1pQmEobStmazVHaGgobGlicD1qR3RDVldvIUBtVVJxU08iKmBVbVNvXk1fYjVUMGBCbTQsOnNYOTI8MWdwYFheOHNMOUw/J1owP01bbFY9KjNtLCVFX1JVKCQ1PzIrX0RxSUBcOUdIWkFsNFo5RHBDPm0iXWN1cFBCOWFVSWdAKUhoJTo3NSc9Tj0iMGoqIzVbMTVeQl4nOFNgOGNwRG4zbT5nJnAlLGVYN3Q/VCxYV0JmdGNzPDVHSkUmK28+JV9xWFRKR0JgbyhhKUtbTmZSJVRdZ0cnOS5OaS5NZmg4LVM5LileOStHOyFXZz81IUdAaEktKD0qMVBuVkY4ZkpbXDUvbWlfLjhyRVNpZmswRTc2cHU/R3BkcjAmamlZMkF1RjA3ZkNDMConM0UnWD8kWTNIVCouZDBbRGJALFQhOj9GRVBUb04yXiRRLmBrR3NeQTxfcWM9KmtpJEVFXHU/MC4kRjV0TkZcL0pTQzgkdClQZyJJLko8Sy5HLDRlSitKcTsxYCc6Zzc5LlYqZDEtOkpKPll1NzQtQW4vZ3RmJmBrMlVGam5bWldNRCJCLSxLZU9baGM2N2hQQG5dKSZeJlRFS2ImYixCVWJ1WTJQRUFhYVU7JCo+T1VJOz5PdC9PJ0J0QDY1IU9nKnBtPC5zKzlxQHM8Zmc2Jm8oV2UoK3FLc0tzI0xMPVU/WTswN1BXVUFpQW47dGZLLDw0OSlVOzleNy00SCtoL0tRaCNZcTduZVE7KGx0WmM9RlJOJztoQTQiRTBpPjcoZCJIaHBmTzRZJ25lMyg3TXJjW1JgJENOR0tfUGIsW0gmJDhbV0Q3SzNsOmpxbGM8Ri04KStjJ08/OFhuVm8qQHI9PmVrdTA9J0JCKjtKLlBqNnFhXGo6cDdGaTQ5Xy9tN2RNXy1pWjhTSmVUbXQjXmlhJzNwMj8+Oj8uZEBGJHRxbCo2c1U5U0tHWzhCSHNSLnMvSW1dU28jRGVOYl5dTj4qYWZFaz5POkUpYHRBPl1dP2Y8VlVuI0lXPFxyZjhFPG5MZT5qKyRBVD9wRzFgPm9pVVssJzgqR3NbPmdSWSpJW2F1ZW81ZmxQUlgwOiQhRjQjY3JnNm9XPypsWk1yNyZWO0ksTmkuKSUqczcjZmZWdS5PciExP2VMTlNdI11LJkBRXjZdPU5QM2JwbD1NR0c0UFhHRyVJWl5MMl88XkxnbzlxXllHOi5Mb3JhaWxLNkQvYCcsRWkwN05vQ05LTlFoVCU6QC88OC5bS3JWJkM5bSdxMThfRWk5YVckQTEqIlZOIjc7MWBDKWFFME1ZKTVcUTtiTltETS41TFdBPThkUnB0cSQ6TUZwYzpKRj9nJS5uLShnUTZZZGxEOWIraTlhMj5EbWw/PjdHQV9GKlwyKTFwaiZvaixIbUQqbSZsVWlmJSdCN1NwOSRNWzFuWmJgaTJXZyQ6S1puNyd0XWQpdS9NSDk8W1U6X1YwJl5GNTRAay1bQUpiJmZwRyNJK14rMUNhdXFvVlc+QCdwOTZnSyhcKys4T2A8cl1SKFMhVyg0RzxRUTwhPClqTz5rbiEtaWRJNE0/MERQcGBzLCpnJkU+Q3E+RDNecD02XXBJJmgyZGoqR10uKm0uOV1AalwqWzU+cVxHaV4rPGNDYDI5Sm5kZzNoNHIpc3RMWlRtWjImPDcjcVtCPWVMbWtfZFlTJmpCcXJxTFgvZlVudWw8QmJmWWgrLVQtWFRRQHAjZytjRWAzRiU8cjxxM0BJVmI7RztJJkIiSSVZJSpGPE9yU1xXQihlMStbcCFTOzZASmdaWywuZDteZV5BP0l1RSRkWDYwaixibl5iK2lvXmEhPV1AbUYxKCtzM1lENUxBcEhoZEk7cXVWOjFPUnNXNy1QKVFYdGNhNklBWkY3YVpbY1wxdW5VT2NackMybkpEZEReUUN0b0knLShcL0JIPSplSjp1Om86akVxOTxxcVVAdFk1K15uanJndVFZYWpCb10uO0NrbW8tN2I3PGxEQTlSbSNkXSQub0REKWdNdFtsJTYjbkRjMVImJ2xyQVkoY2ZQP3I9J2VJbygwJTguaTxlXTdXQ0dJKlIiQlZoXjM2MUA/USwrOjBgfj5lbmRzdHJlYW0KZW5kb2JqCjEwIDAgb2JqCjw8Ci9GaWx0ZXIgWyAvQVNDSUk4NURlY29kZSAvRmxhdGVEZWNvZGUgXSAvTGVuZ3RoIDYwMgo+PgpzdHJlYW0KR2F0JV5iQVEmZyY0UT9pTVJ0QG4vZj0yVjdzP0NzRzgkV3BCXiN0I2RmcDg9RjxycTlxWGtqWU5vTG1dWms+Yj1qTlA6bkxaRmlPYkdXYTJebT5mcTkrRVQkRFNbJmRCXmAwPU1dVywnbFZeXCNYSTIkPz5nWm51P0JvZDU8ajMzJE1bNi9JZTROP1NMNl0wRFFrITpXWDpiQT4vYDxUZlxeXTtjZWtbPlw7UF5KMidQNU1tUXJdWmdkLWt1VjU/MyNRJkxBa2IsaSpYMmg1KC8wcEc/XGteaUNfTzBzNEhqOHIqaGBFP3U+MUlkZEhuNExMcm4jcDhZSWRyRyMiTFxqOFBoO0QzZ2k/UiY+Zy8jOE4kV0c7Yy1DK1NSb0tKMyNIbylCTkJiKEA0NG11P2Q8SDBBSldab05rSUEnPkFhW0RIVEsnPnRnQWdwUV9NJSs7VUVJb0AzTEw9TDoocXVsYERuUyRaWUBLKCw/TFsuZ183U09OSUBiMkFwcUVjUEUsL2B1XiQuaCVIOGhdYi0zQ1N0RVVfOVwtR10haFhHXlJhRiEhS1FuUmFUdS9OQVYsJWBhamE0TDwibVxkZVdUOEhqYDZUM2UkTlExLjdOUTxuXENxaCoiNS5WNCUqRV1sWyc8YUVgbT1uUjlvLFhePVVbRmxvWUw0Y2heUDl0dEkkRXFHKmcjSkhoYlZ1UXIrXF4uYWMhWlVrYlptPilpXVw/LiszMiVNXlJZQUwlLEVYKWxRUzckYjwvW0VQSypMVVhTckJiKD9iWj0kNUM1VSVQJSFsfj5lbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCAxMQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwNjEgMDAwMDAgbiAKMDAwMDAwMDEwMiAwMDAwMCBuIAowMDAwMDAwMjA5IDAwMDAwIG4gCjAwMDAwMDAzMjEgMDAwMDAgbiAKMDAwMDAwMDUyNCAwMDAwMCBuIAowMDAwMDAwNzI4IDAwMDAwIG4gCjAwMDAwMDA3OTYgMDAwMDAgbiAKMDAwMDAwMTEyMCAwMDAwMCBuIAowMDAwMDAxMTg1IDAwMDAwIG4gCjAwMDAwMDU0NDAgMDAwMDAgbiAKdHJhaWxlcgo8PAovSUQgCls8ZGUxOGFjMDQzZTgyYjdiYjIzZmE4YjMxZTg3MGNkNjk+PGRlMThhYzA0M2U4MmI3YmIyM2ZhOGIzMWU4NzBjZDY5Pl0KJSBSZXBvcnRMYWIgZ2VuZXJhdGVkIFBERiBkb2N1bWVudCAtLSBkaWdlc3QgKG9wZW5zb3VyY2UpCgovSW5mbyA3IDAgUgovUm9vdCA2IDAgUgovU2l6ZSAxMQo+PgpzdGFydHhyZWYKNjEzMwolJUVPRgo=", // Contenido real del PDF en Base64 (~5.3 KB)
  },
  telemetry: {
    trackerIdSeleccionado: 21443,
    candidatosMismoEquipo: 80,
    totalJugadoresDetectados: 225,
    distanciaRelativa: 120.7,
    distanciaMetros: 58.4,
    velocidadPuntaKmh: 28.4,
    heatmapPoints: [
      { t: 93.16, x: 2.2, y: 97.8, intensity: 0.75 },
      { t: 93.4, x: 4.1, y: 98.2, intensity: 0.75 },
      { t: 93.65, x: 8.7, y: 99.1, intensity: 0.75 },
      { t: 93.89, x: 11.9, y: 98.4, intensity: 0.75 },
      { t: 94.13, x: 16.5, y: 99, intensity: 0.75 },
      { t: 94.62, x: 21.4, y: 98.9, intensity: 0.75 },
      { t: 94.86, x: 19.2, y: 98.9, intensity: 0.75 },
      { t: 95.1, x: 16.3, y: 99, intensity: 0.75 },
      { t: 95.35, x: 16.5, y: 99.6, intensity: 0.75 },
      { t: 95.59, x: 18.6, y: 96.6, intensity: 0.75 },
      { t: 95.83, x: 25.4, y: 87.3, intensity: 0.75 },
      { t: 96.08, x: 29.7, y: 80.7, intensity: 0.75 },
      { t: 96.32, x: 31.3, y: 78.4, intensity: 0.75 },
      { t: 96.56, x: 32.6, y: 76.1, intensity: 0.75 },
      { t: 96.81, x: 34.3, y: 73.9, intensity: 0.75 },
      { t: 97.05, x: 34.5, y: 73.1, intensity: 0.75 },
      { t: 97.29, x: 34.1, y: 72.9, intensity: 0.75 },
      { t: 97.54, x: 33.8, y: 72.8, intensity: 0.75 },
      { t: 97.78, x: 33.7, y: 72.9, intensity: 0.75 },
      { t: 98.02, x: 33.7, y: 72.9, intensity: 0.75 },
      { t: 98.27, x: 34.3, y: 72.9, intensity: 0.75 },
      { t: 98.51, x: 35.1, y: 72.7, intensity: 0.75 },
      { t: 98.75, x: 35, y: 72.7, intensity: 0.75 },
      { t: 99, x: 34.8, y: 72.8, intensity: 0.75 },
      { t: 99.24, x: 34.8, y: 72.7, intensity: 0.75 },
      { t: 99.48, x: 34.9, y: 72.7, intensity: 0.75 },
      { t: 99.73, x: 34.8, y: 72.7, intensity: 0.75 },
      { t: 99.97, x: 34.7, y: 72.7, intensity: 0.75 },
      { t: 100.21, x: 35.1, y: 73, intensity: 0.75 },
      { t: 100.46, x: 40.6, y: 72.7, intensity: 0.75 },
      { t: 100.7, x: 54.2, y: 72.1, intensity: 0.75 },
      { t: 100.94, x: 63.4, y: 72, intensity: 0.75 },
      { t: 101.19, x: 68.7, y: 71.6, intensity: 0.75 },
      { t: 101.43, x: 72.7, y: 71.5, intensity: 0.75 },
      { t: 101.67, x: 75.4, y: 70.8, intensity: 0.75 },
      { t: 101.92, x: 75.5, y: 70.9, intensity: 0.75 },
      { t: 102.16, x: 72.7, y: 70.2, intensity: 0.75 },
      { t: 102.4, x: 72, y: 70.1, intensity: 0.75 },
      { t: 102.65, x: 68.4, y: 69.7, intensity: 0.75 },
      { t: 102.89, x: 64.8, y: 68.6, intensity: 0.75 },
      { t: 103.13, x: 62.8, y: 68.1, intensity: 0.75 },
      { t: 103.37, x: 59, y: 67.9, intensity: 0.75 },
      { t: 103.62, x: 58.5, y: 65.5, intensity: 0.75 },
    ],
  },
};
