'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Compass,
  FileText,
  Flame,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { UnifiedVisionAnalysisData } from '@/types/visionAnalysis';

export interface VisionTacticalReportSectionsProps {
  data: Partial<UnifiedVisionAnalysisData>;
}

/**
 * Renderiza dinámicamente las secciones enriquecidas del response de Visión Artificial
 * (Dictamen Ejecutivo, KPIs Cuantitativos/Cualitativos, Rendimiento por Fases,
 * Evaluación de Posicionamiento Táctico y Plan de Acción) sin textos en duro.
 */
export function VisionTacticalReportSections({
  data,
}: VisionTacticalReportSectionsProps) {
  const {
    impactoTacticoBadge,
    dictamenTactico,
    resumenEjecutivo,
    kpisCuantitativos,
    evaluacionCualitativaKpis,
    rendimientoPorFases,
    evaluacionPosicionamientoTactico,
    conclusionesPlanAccion,
  } = data;

  const hasAnySection = Boolean(
    dictamenTactico ||
      resumenEjecutivo ||
      (kpisCuantitativos && kpisCuantitativos.length > 0) ||
      (evaluacionCualitativaKpis && evaluacionCualitativaKpis.length > 0) ||
      rendimientoPorFases ||
      evaluacionPosicionamientoTactico ||
      (conclusionesPlanAccion && conclusionesPlanAccion.length > 0)
  );

  if (!hasAnySection) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. DICTAMEN TÁCTICO Y RESUMEN EJECUTIVO */}
      {(dictamenTactico || resumenEjecutivo) && (
        <Card cornerAccents variant="default" className="p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stadium-border pb-3">
              <SectionHeader
                tag="INFORME EJECUTIVO IA"
                title="Dictamen Táctico & Lectura Global"
                subtitle={
                  data.tramoAnalizado
                    ? `Tramo evaluado: ${data.tramoAnalizado}`
                    : 'Diagnóstico generado por el motor de visión artificial'
                }
                icon={<FileText className="w-5 h-5 text-volt" />}
                variant="volt"
              />
              {impactoTacticoBadge && (
                <Badge variant="volt" size="sm" pulse>
                  {impactoTacticoBadge}
                </Badge>
              )}
            </div>

            {dictamenTactico && (
              <div className="p-3.5 rounded-md bg-volt/10 border border-volt/30 text-sm font-sans text-white font-medium leading-relaxed">
                {dictamenTactico}
              </div>
            )}

            {resumenEjecutivo && (
              <p className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
                {resumenEjecutivo}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* 2. KPIs CUANTITATIVOS DINÁMICOS */}
      {kpisCuantitativos && kpisCuantitativos.length > 0 && (
        <Card variant="default" className="p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <SectionHeader
              tag="MÉTRICAS DE RENDIMIENTO"
              title="KPIs Cuantitativos vs Referencia"
              subtitle="Comparativa automática frente al estándar de la categoría"
              icon={<BarChart3 className="w-5 h-5 text-telemetry-cyan" />}
              variant="cyan"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpisCuantitativos.map((kpi) => (
                <div
                  key={kpi.id}
                  className="p-4 rounded-md bg-stadium-elevated border border-stadium-border flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 font-bold">
                      {kpi.titulo}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-volt/15 text-volt border border-volt/30 font-bold">
                      {kpi.badge}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-display font-black text-white">
                      {kpi.valor}
                    </span>
                    {kpi.unidad && (
                      <span className="text-xs font-mono text-telemetry-cyan font-bold">
                        {kpi.unidad}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] font-sans text-slate-400">
                    {kpi.subtitulo}
                  </p>

                  <div className="w-full h-1.5 rounded-full bg-stadium-base overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-telemetry-cyan to-volt rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(5, Math.min(100, kpi.progreso))}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                    <span>Ref: {kpi.promedioReferencia}</span>
                    <span className="text-volt font-bold">{kpi.valoracionPdf}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* 3. EVALUACIÓN CUALITATIVA DE KPIs */}
      {evaluacionCualitativaKpis && evaluacionCualitativaKpis.length > 0 && (
        <Card variant="default" className="p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <SectionHeader
              tag="LECTURA CUALITATIVA"
              title="Evaluación por Área de Juego"
              subtitle="Interpretación contextual de comportamientos detectados"
              icon={<Sparkles className="w-5 h-5 text-volt" />}
              variant="volt"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {evaluacionCualitativaKpis.map((item, idx) => (
                <div
                  key={`qual-kpi-${idx}`}
                  className="p-4 rounded-md bg-stadium-elevated border border-stadium-border flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-display font-bold uppercase tracking-wide text-white">
                      {item.titulo}
                    </span>
                    <Badge variant="cyan" size="sm">
                      {item.badge}
                    </Badge>
                  </div>
                  <p className="text-xs font-sans text-slate-300 leading-relaxed">
                    {item.detalle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* 4. RENDIMIENTO POR FASES (OFENSIVA / DEFENSIVA) */}
      {rendimientoPorFases && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="default" className="p-5 flex flex-col gap-3.5">
            <SectionHeader
              tag="FASE CON BALÓN"
              title="Rendimiento en Fase Ofensiva"
              subtitle="Salida, progresión y zona de influencia"
              icon={<Flame className="w-5 h-5 text-volt" />}
              variant="volt"
            />
            <div className="flex flex-col gap-2.5">
              {rendimientoPorFases.faseOfensiva?.map((f, idx) => (
                <div
                  key={`off-${idx}`}
                  className="p-3 rounded-md bg-stadium-elevated border border-volt/20 flex flex-col gap-1"
                >
                  <span className="text-xs font-display font-bold uppercase text-volt">
                    {f.titulo}
                  </span>
                  <p className="text-xs font-sans text-slate-300 leading-relaxed">
                    {f.detalle}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="default" className="p-5 flex flex-col gap-3.5">
            <SectionHeader
              tag="FASE SIN BALÓN"
              title="Rendimiento en Fase Defensiva"
              subtitle="Duelos, cobertura y ajustes de retorno"
              icon={<Shield className="w-5 h-5 text-telemetry-cyan" />}
              variant="cyan"
            />
            <div className="flex flex-col gap-2.5">
              {rendimientoPorFases.faseDefensiva?.map((f, idx) => (
                <div
                  key={`def-${idx}`}
                  className="p-3 rounded-md bg-stadium-elevated border border-telemetry-cyan/20 flex flex-col gap-1"
                >
                  <span className="text-xs font-display font-bold uppercase text-telemetry-cyan">
                    {f.titulo}
                  </span>
                  <p className="text-xs font-sans text-slate-300 leading-relaxed">
                    {f.detalle}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 5. POSICIONAMIENTO TÁCTICO + PLAN DE ACCIÓN */}
      {(evaluacionPosicionamientoTactico ||
        (conclusionesPlanAccion && conclusionesPlanAccion.length > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {evaluacionPosicionamientoTactico && (
            <Card
              variant="default"
              className="lg:col-span-6 p-5 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-2">
                <SectionHeader
                  tag="DISCIPLINA ESPACIAL"
                  title="Posicionamiento Táctico"
                  subtitle="Evaluación posicional observada en cancha"
                  icon={<Compass className="w-5 h-5 text-telemetry-cyan" />}
                  variant="cyan"
                />
                <div className="px-3 py-1.5 rounded-md bg-telemetry-cyan/15 border border-telemetry-cyan/40 text-right shrink-0">
                  <span className="block text-[9px] font-mono uppercase text-telemetry-cyan">
                    Cumplimiento
                  </span>
                  <span className="text-lg font-display font-black text-white">
                    {evaluacionPosicionamientoTactico.cumplimientoPosicional}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {evaluacionPosicionamientoTactico.criterios?.map((c, idx) => (
                  <div key={`crit-${idx}`} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans text-slate-300">{c.label}</span>
                      <span className="font-mono font-bold text-volt">
                        {c.porcentaje}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stadium-base overflow-hidden">
                      <div
                        className="h-full bg-volt rounded-full"
                        style={{
                          width: `${Math.max(5, Math.min(100, c.porcentaje))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {evaluacionPosicionamientoTactico.diagnostico && (
                <p className="text-xs font-sans text-slate-300 bg-stadium-elevated p-3 rounded-md border border-white/5 leading-relaxed">
                  {evaluacionPosicionamientoTactico.diagnostico}
                </p>
              )}
            </Card>
          )}

          {conclusionesPlanAccion && conclusionesPlanAccion.length > 0 && (
            <Card
              variant="default"
              className={`${
                evaluacionPosicionamientoTactico
                  ? 'lg:col-span-6'
                  : 'lg:col-span-12'
              } p-5 flex flex-col gap-4`}
            >
              <SectionHeader
                tag="HOJA DE RUTA"
                title="Conclusiones & Plan de Acción"
                subtitle="Recomendaciones prioritarias para la siguiente sesión"
                icon={<Target className="w-5 h-5 text-volt" />}
                variant="volt"
              />

              <div className="flex flex-col gap-3">
                {conclusionesPlanAccion.map((c, idx) => (
                  <div
                    key={`conc-${idx}`}
                    className="p-3.5 rounded-md bg-stadium-elevated border border-volt/25 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-volt shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-display font-bold uppercase text-white">
                        {c.titulo}
                      </span>
                      <p className="text-xs font-sans text-slate-300 leading-relaxed">
                        {c.detalle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
