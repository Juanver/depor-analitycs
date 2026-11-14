'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VisionProgressModal } from '@/components/analytics/VisionProgressModal';
import {
  VisionAnalysisMode,
  VisionGameFormat,
  VisionFormData,
  CameraVisibleZone,
} from '@/types/visionAnalysis';
import {
  analyzeVisionVideo,
  DEFAULT_USE_MOCK_VISION,
} from '@/lib/visionApiClient';
import { videoStore, extractVideoMetadata } from '@/lib/videoStore';
import { formatSecondsToMMSS } from '@/lib/formatTimestamp';
import {
  Upload,
  Video as VideoIcon,
  Users,
  User,
  Crosshair,
  Shield,
  Layers,
  Sparkles,
  FileCheck,
  X,
  AlertCircle,
  Footprints,
  Compass,
  FlaskConical,
  Cpu,
  Camera,
} from 'lucide-react';

const GAME_FORMATS: VisionGameFormat[] = [
  'Fútbol 5',
  'Fútbol 7',
  'Fútbol 9',
  'Fútbol 11',
];

const NOMINAL_SYSTEMS_BY_FORMAT: Record<VisionGameFormat, string[]> = {
  'Fútbol 5': ['1-2-1', '1-1-2-1', '2-2', '1-3'],
  'Fútbol 7': ['1-2-3-1', '1-3-2-1', '1-2-2-2', '1-3-1-2'],
  'Fútbol 9': ['1-3-3-2', '1-3-2-3', '1-4-3-1', '1-2-4-2'],
  'Fútbol 11': ['1-4-3-3', '1-4-4-2', '1-3-5-2', '1-4-2-3-1'],
};

const DEFAULT_POSITIONS = [
  'Back Central / Líbero',
  'Lateral Derecho',
  'Lateral Izquierdo',
  'Mediocentro Defensivo (Pivote)',
  'Mediocentro Organizador',
  'Extremo / Carillero',
  'Mediapunta / Enganche',
  'Delantero Centro',
];

export function LocalVisionSetupForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDurationSec, setVideoDurationSec] = useState<number>(0);
  const [videoDims, setVideoDims] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  });
  const [cameraZone, setCameraZone] = useState<CameraVisibleZone>('campo_completo');
  const [useMockMode, setUseMockMode] = useState<boolean>(DEFAULT_USE_MOCK_VISION);

  const [isDragging, setIsDragging] = useState(false);
  const [analysisType, setAnalysisType] = useState<VisionAnalysisMode>('individual');
  const [gameFormat, setGameFormat] = useState<VisionGameFormat>('Fútbol 7');
  const [nominalSystem, setNominalSystem] = useState<string>('1-2-3-1');

  // Individual fields
  const [playerName, setPlayerName] = useState('Alexis "Verano" Gómez');
  const [dorsal, setDorsal] = useState('7');
  const [position, setPosition] = useState('Back Central / Líbero');

  // Shared fields
  const [teamName, setTeamName] = useState('Dibujitos FC');
  const [clothingDesc, setClothingDesc] = useState('Camiseta negra, short negro, calzado flúor');

  // Loading & Progress Modal state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extrae metadatos reales (duración en segundos, resolución) al seleccionar archivo
  const processSelectedFile = async (file: File) => {
    setVideoFile(file);
    setErrorMessage(null);
    const objUrl = videoStore.setVideo(file);
    const meta = await extractVideoMetadata(objUrl);
    videoStore.setMetadata(meta);
    setVideoDurationSec(meta.durationSeconds);
    setVideoDims({ width: meta.width, height: meta.height });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.mp4') || file.type.includes('mp4')) {
        void processSelectedFile(file);
      } else {
        setErrorMessage('Por favor sube un archivo de video en formato .mp4');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.mp4') || file.type.includes('mp4')) {
        void processSelectedFile(file);
      } else {
        setErrorMessage('Por favor sube un archivo de video en formato .mp4');
      }
    }
  };

  const handleRemoveFile = () => {
    setVideoFile(null);
    setVideoDurationSec(0);
    setVideoDims({ width: 1920, height: 1080 });
    videoStore.clear();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormatChange = (fmt: VisionGameFormat) => {
    setGameFormat(fmt);
    const available = NOMINAL_SYSTEMS_BY_FORMAT[fmt];
    if (available && available.length > 0) {
      setNominalSystem(available[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    let fileToUse = videoFile;
    let currentDuration = videoDurationSec;
    let currentDims = videoDims;
    let localVideoUrl: string | undefined;

    if (fileToUse) {
      // Siempre reemplazar el video en memoria con el archivo recién subido
      localVideoUrl = videoStore.setVideo(fileToUse);
      if (currentDuration <= 0) {
        const meta = await extractVideoMetadata(localVideoUrl);
        currentDuration = meta.durationSeconds;
        currentDims = { width: meta.width, height: meta.height };
        setVideoDurationSec(meta.durationSeconds);
        setVideoDims(currentDims);
      }
      videoStore.setMetadata({
        durationSeconds: currentDuration,
        width: currentDims.width,
        height: currentDims.height,
      });
    } else {
      // Si no se subió archivo real, limpiar cualquier video anterior en memoria
      videoStore.clear();
      const dummyBlob = new Blob(['sample-mp4-stream'], { type: 'video/mp4' });
      fileToUse = new File([dummyBlob], 'partido-vision-local.mp4', {
        type: 'video/mp4',
      });
      currentDuration = analysisType === 'equipo' ? 420 : 120;
      localVideoUrl = undefined;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('customAnalysis');
    }
    if (currentDuration > 0) {
      videoStore.setMetadata({
        durationSeconds: currentDuration,
        width: currentDims.width,
        height: currentDims.height,
      });
    }

    setIsProcessing(true);

    const inputData: VisionFormData = {
      video: fileToUse,
      modo_analisis: analysisType,
      formato_juego: gameFormat,
      sistema_tactico_nominal: nominalSystem,
      nombre_jugador: analysisType === 'individual' ? playerName : undefined,
      dorsal: analysisType === 'individual' ? dorsal : undefined,
      posicion: analysisType === 'individual' ? position : undefined,
      nombre_equipo: teamName,
      descripcion_vestimenta: clothingDesc,
      videoDurationSeconds: currentDuration > 0 ? currentDuration : undefined,
      videoWidth: currentDims.width,
      videoHeight: currentDims.height,
      cameraZone,
      useMock: useMockMode,
    };

    try {
      // Disparar cliente de visión artificial a FastAPI (espera libre y continua)
      const result = await analyzeVisionVideo(inputData, localVideoUrl);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('customAnalysis', JSON.stringify(result));
        sessionStorage.setItem(`analysis_${result.id}`, JSON.stringify(result));
        if (analysisType === 'equipo') {
          sessionStorage.setItem(`team_analysis_${result.id}`, JSON.stringify(result));
        }
      }

      setIsProcessing(false);
      router.push(`/analisis/${result.id}`);
    } catch (err: unknown) {
      console.error('Error en análisis de visión:', err);
      setIsProcessing(false);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Error al conectar con el backend de visión artificial'
      );
    }
  };

  return (
    <Card
      cornerAccents
      variant="default"
      className="p-6 sm:p-8 border-volt/30 shadow-2xl relative bg-stadium-surface"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stadium-border mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-volt/15 text-volt border border-volt/30">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight text-white flex items-center gap-2">
              Análisis de Video <span className="text-volt">con IA</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Sube tu video del partido y obtén estadísticas, mapa de calor y jugadas clave al instante
            </p>
          </div>
        </div>

        <Badge variant="volt" size="md" pulse className="self-start sm:self-auto">
          ANÁLISIS INTELIGENTE
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. SELECCIÓN DE TIPO DE ANÁLISIS: INDIVIDUAL vs EQUIPO */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-volt" />
              Tipo de Análisis de Visión
            </span>
            <span className="text-[10px] text-slate-400 font-sans">
              Define el algoritmo de segmentación en FastAPI
            </span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAnalysisType('individual')}
              className={`py-3 px-4 rounded-md font-display uppercase tracking-wider font-extrabold text-sm transition-all flex items-center justify-center gap-2 border ${
                analysisType === 'individual'
                  ? 'bg-volt text-stadium-base border-volt shadow-volt-glow'
                  : 'bg-stadium-elevated text-slate-300 border-stadium-border hover:border-slate-500'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Individual (Jugador)</span>
            </button>

            <button
              type="button"
              onClick={() => setAnalysisType('equipo')}
              className={`py-3 px-4 rounded-md font-display uppercase tracking-wider font-extrabold text-sm transition-all flex items-center justify-center gap-2 border ${
                analysisType === 'equipo'
                  ? 'bg-telemetry-cyan text-stadium-base border-telemetry-cyan shadow-cyan-glow'
                  : 'bg-stadium-elevated text-slate-300 border-stadium-border hover:border-slate-500'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Colectivo / Equipo</span>
            </button>
          </div>
        </div>

        {/* 2. DRAG & DROP / SUBIDA DE ARCHIVO DE VIDEO .MP4 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <VideoIcon className="w-3.5 h-3.5 text-volt" />
              Archivo de Video Local (.mp4)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Resolución recomendada: 720p/1080p a 30 o 60 FPS
            </span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".mp4,video/mp4"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {!videoFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-md border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                isDragging
                  ? 'border-volt bg-volt/10 scale-[1.01]'
                  : 'border-stadium-border hover:border-volt/50 bg-stadium-elevated/50 hover:bg-stadium-elevated'
              }`}
            >
              <div className="p-3.5 rounded-full bg-volt/15 text-volt mb-3 border border-volt/20">
                <Upload className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-sm font-display font-bold uppercase tracking-wider text-white">
                Arrastra tu video .mp4 aquí o haz clic para explorar
              </h4>
              <p className="text-xs text-slate-400 font-sans mt-1 max-w-md">
                Soporta grabaciones de dron, cámara táctica lateral o transmisiones directas.
              </p>
              <span className="mt-3 text-[11px] font-mono text-volt bg-volt/10 px-3 py-1 rounded-full border border-volt/20">
                Seleccionar archivo .mp4
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-md bg-stadium-elevated border border-volt/40 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2.5 rounded-md bg-volt/20 text-volt border border-volt/30 shrink-0">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className="text-xs font-mono font-bold text-white truncate block w-full"
                    title={videoFile.name}
                  >
                    {videoFile.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans truncate">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    {videoDurationSec > 0 && (
                      <>
                        {' '}• Duración:{' '}
                        <strong className="text-volt font-mono">
                          {formatSecondsToMMSS(Math.round(videoDurationSec))} ({Math.round(videoDurationSec)}s)
                        </strong>
                        {' '}• {videoDims.width}x{videoDims.height}
                      </>
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                title="Quitar video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-sans flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* 3. SELECTORES DE FORMATO DE JUEGO & SISTEMA TÁCTICO NOMINAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-md bg-stadium-base/70 border border-stadium-border">
          {/* Formato de Juego */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-volt" />
              Formato de Juego
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GAME_FORMATS.map((fmt) => {
                const isSelected = gameFormat === fmt;
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleFormatChange(fmt)}
                    className={`py-2 px-3 rounded-md font-display uppercase tracking-wider font-bold text-xs transition-all border ${
                      isSelected
                        ? 'bg-volt text-stadium-base border-volt shadow-volt-glow'
                        : 'bg-stadium-elevated text-slate-300 border-stadium-border hover:border-slate-500'
                    }`}
                  >
                    {fmt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sistema Táctico Nominal */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-telemetry-cyan" />
              Sistema Táctico Nominal
            </label>
            <div className="flex flex-wrap gap-1.5">
              {NOMINAL_SYSTEMS_BY_FORMAT[gameFormat].map((sys) => {
                const isSelected = nominalSystem === sys;
                return (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => setNominalSystem(sys)}
                    className={`py-1.5 px-3 rounded-md font-mono text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-telemetry-cyan text-stadium-base border-telemetry-cyan shadow-cyan-glow'
                        : 'bg-stadium-elevated text-slate-300 border-stadium-border hover:border-slate-500'
                    }`}
                  >
                    {sys}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={nominalSystem}
              onChange={(e) => setNominalSystem(e.target.value)}
              placeholder="Ej. 1-4-3-3 o dibujo personalizado"
              className="mt-1 w-full px-3 py-1.5 rounded-md bg-stadium-elevated border border-stadium-border text-white text-xs font-mono focus:outline-none focus:border-telemetry-cyan"
            />
          </div>
        </div>

        {/* 4. CAMPOS CONDICIONALES SEGÚN TIPO DE ANÁLISIS */}
        {analysisType === 'individual' ? (
          /* MODO INDIVIDUAL */
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Nombre del Jugador */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200">
                  Nombre del Jugador
                </label>
                <input
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Ej. Alexis Verano"
                  className="w-full px-3 py-2 rounded-md bg-stadium-elevated border border-stadium-border text-white text-xs font-sans focus:outline-none focus:border-volt"
                />
              </div>

              {/* Dorsal */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200">
                  Dorsal (#)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={99}
                  value={dorsal}
                  onChange={(e) => setDorsal(e.target.value)}
                  placeholder="7"
                  className="w-full px-3 py-2 rounded-md bg-stadium-elevated border border-stadium-border text-white text-xs font-mono font-bold focus:outline-none focus:border-volt"
                />
              </div>

              {/* Posición */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200">
                  Posición
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-stadium-elevated border border-stadium-border text-white text-xs font-sans focus:outline-none focus:border-volt"
                >
                  {DEFAULT_POSITIONS.map((pos) => (
                    <option key={pos} value={pos} className="bg-stadium-base text-white">
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre del Equipo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200">
                  Nombre del Equipo
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Ej. Dibujitos FC"
                  className="w-full px-3 py-2 rounded-md bg-stadium-elevated border border-stadium-border text-white text-xs font-sans focus:outline-none focus:border-volt"
                />
              </div>

              {/* Descripción de Vestimenta */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200 flex items-center justify-between">
                  <span>Descripción de Vestimenta</span>
                  <span className="text-[10px] text-volt font-mono font-normal">Ayuda a identificarlo en el video</span>
                </label>
                <input
                  type="text"
                  required
                  value={clothingDesc}
                  onChange={(e) => setClothingDesc(e.target.value)}
                  placeholder='Ej. "Camiseta negra, short negro, calzado flúor"'
                  className="w-full px-3 py-2 rounded-md bg-stadium-elevated border border-stadium-border text-white text-xs font-sans focus:outline-none focus:border-volt"
                />
              </div>
            </div>
          </div>
        ) : (
          /* MODO COLECTIVO / EQUIPO */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre del Equipo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200">
                Nombre del Equipo
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ej. Dibujitos FC"
                className="w-full px-3 py-2 rounded-md bg-stadium-elevated border border-stadium-border text-white text-xs font-sans focus:outline-none focus:border-telemetry-cyan"
              />
            </div>

            {/* Descripción de Vestimenta */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200 flex items-center justify-between">
                <span>Descripción de Vestimenta del Equipo</span>
                <span className="text-[10px] text-telemetry-cyan font-mono font-normal">Filtro de Color HSV</span>
              </label>
              <input
                type="text"
                required
                value={clothingDesc}
                onChange={(e) => setClothingDesc(e.target.value)}
                placeholder='Ej. "Camiseta negra con vivos blancos, short negro"'
                className="w-full px-3 py-2 rounded-md bg-stadium-elevated border border-stadium-border text-white text-xs font-sans focus:outline-none focus:border-telemetry-cyan"
              />
            </div>
          </div>
        )}

        {/* 5. ENCUADRE DE CÁMARA & FLAG DE VALIDACIÓN RÁPIDA (MOCK vs IA REAL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-md bg-stadium-base/70 border border-stadium-border">
          {/* Zona Visible del Campo */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-telemetry-cyan" />
                Zona Enfocada por la Cámara
              </span>
              <span className="text-[10px] text-slate-400 font-sans">Ajusta el Mapa de Calor</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'mitad_izquierda', label: 'Mitad Izquierda' },
                  { id: 'mitad_derecha', label: 'Mitad Derecha' },
                  { id: 'zona_media', label: 'Zona Media' },
                  { id: 'campo_completo', label: 'Campo Completo' },
                ] as const
              ).map((zone) => {
                const isSelected = cameraZone === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setCameraZone(zone.id)}
                    className={`py-1.5 px-2.5 rounded-md font-display uppercase tracking-wider font-bold text-[11px] transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-telemetry-cyan text-stadium-base border-telemetry-cyan shadow-cyan-glow'
                        : 'bg-stadium-elevated text-slate-300 border-stadium-border hover:border-slate-500'
                    }`}
                  >
                    {zone.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flag Switch: IA Real vs Mock Response */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-display uppercase tracking-wider font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-volt" />
                Modo de Ejecución (Flag)
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {useMockMode ? 'MOCK ACTIVO' : 'BACKEND REAL'}
              </span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUseMockMode(false)}
                className={`py-2 px-3 rounded-md font-display uppercase tracking-wider font-bold text-xs transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                  !useMockMode
                    ? 'bg-volt text-stadium-base border-volt shadow-volt-glow'
                    : 'bg-stadium-elevated text-slate-300 border-stadium-border hover:border-slate-500'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>IA Real (FastAPI)</span>
              </button>

              <button
                type="button"
                onClick={() => setUseMockMode(true)}
                className={`py-2 px-3 rounded-md font-display uppercase tracking-wider font-bold text-xs transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                  useMockMode
                    ? 'bg-amber-400 text-stadium-base border-amber-400 shadow-lg'
                    : 'bg-stadium-elevated text-slate-300 border-stadium-border hover:border-slate-500'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Mock Rápido</span>
              </button>
            </div>
            <span className="text-[10px] text-slate-400 font-sans">
              {useMockMode
                ? 'Modo Mock: Responde al instante sin llamar a Python (ideal para validar UI).'
                : 'Modo Real: Envía el video a FastAPI y espera el procesamiento completo.'}
            </span>
          </div>
        </div>

        {/* SUBMIT BUTTON & STATUS STRIP */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stadium-border">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <Crosshair className="w-4 h-4 text-volt" />
            <span>
              {useMockMode ? (
                <>
                  Respuesta simulada calibrada a{' '}
                  <strong className="text-amber-400 font-mono">
                    {videoDurationSec > 0 ? `${Math.round(videoDurationSec)}s` : 'duración real'}
                  </strong>
                </>
              ) : (
                <>
                  Microservicio en{' '}
                  <code className="text-volt font-mono">http://localhost:8000/api/vision/analyze</code>
                </>
              )}
            </span>
          </div>

          <Button
            type="submit"
            variant="volt"
            size="lg"
            isLoading={isProcessing && useMockMode}
            icon={<Sparkles className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-volt-glow font-black text-sm"
          >
            {useMockMode
              ? 'Validar con Mock Rápido'
              : 'Iniciar Análisis con Visión Artificial'}
          </Button>
        </div>
      </form>

      {/* MODAL DE PROGRESO INMERSIVO (solo cuando procesa IA real) */}
      <VisionProgressModal
        isOpen={isProcessing && !useMockMode}
        modo={analysisType}
        targetName={analysisType === 'individual' ? playerName : teamName}
        dorsal={analysisType === 'individual' ? dorsal : undefined}
        gameFormat={gameFormat}
        nominalSystem={nominalSystem}
      />
    </Card>
  );
}
