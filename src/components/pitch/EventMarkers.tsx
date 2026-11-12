'use client';

import React from 'react';
import { TacticalEvent, TacticalEventType } from '@/types/analysis';
import {
  Shuffle,
  Target,
  Shield,
  Zap,
  AlertTriangle,
  ArrowUpRight,
  Play,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export interface EventMarkersProps {
  events: TacticalEvent[];
  visible?: boolean;
  onSelectEvent?: (event: TacticalEvent) => void;
  onHoverEvent?: (event: TacticalEvent | null) => void;
  hoveredEventId?: string | null;
  activeEventId?: string | null;
}

export const EVENT_CONFIG: Record<
  TacticalEventType,
  { label: string; color: string; bgClass: string; icon: React.ReactNode }
> = {
  pass: {
    label: 'Pase',
    color: 'var(--color-telemetry-cyan)',
    bgClass: 'bg-telemetry-cyan',
    icon: <Shuffle className="w-2.5 h-2.5" />,
  },
  shot: {
    label: 'Tiro',
    color: 'var(--color-volt)',
    bgClass: 'bg-volt',
    icon: <Target className="w-2.5 h-2.5" />,
  },
  tackle: {
    label: 'Entrada',
    color: '#3B82F6',
    bgClass: 'bg-blue-500',
    icon: <Shield className="w-2.5 h-2.5" />,
  },
  interception: {
    label: 'Intercepción',
    color: '#10B981',
    bgClass: 'bg-emerald-500',
    icon: <Zap className="w-2.5 h-2.5" />,
  },
  recovery: {
    label: 'Recuperación',
    color: '#06B6D4',
    bgClass: 'bg-cyan-500',
    icon: <Shield className="w-2.5 h-2.5" />,
  },
  turnover: {
    label: 'Pérdida',
    color: 'var(--color-thermal-high)',
    bgClass: 'bg-thermal-high',
    icon: <AlertTriangle className="w-2.5 h-2.5" />,
  },
  aerial_duel: {
    label: 'Duelo Aéreo',
    color: '#A855F7',
    bgClass: 'bg-purple-500',
    icon: <Shield className="w-2.5 h-2.5" />,
  },
  cross: {
    label: 'Centro',
    color: 'var(--color-volt)',
    bgClass: 'bg-volt',
    icon: <ArrowUpRight className="w-2.5 h-2.5" />,
  },
  dribble: {
    label: 'Regate',
    color: 'var(--color-volt)',
    bgClass: 'bg-volt',
    icon: <Zap className="w-2.5 h-2.5" />,
  },
};

/**
 * Renders SVG event markers on the pitch with pulsing radar waves.
 * Tooltips are rendered as crisp HTML overlays outside the SVG viewBox matrix.
 */
export function EventMarkers({
  events,
  visible = true,
  onSelectEvent,
  onHoverEvent,
  hoveredEventId,
  activeEventId,
}: EventMarkersProps) {
  if (!visible || !events || events.length === 0) return null;

  return (
    <g className="event-markers-layer">
      {events.map((ev) => {
        const config = EVENT_CONFIG[ev.type] || EVENT_CONFIG.pass;
        const isSelected = activeEventId === ev.id || hoveredEventId === ev.id;

        return (
          <g
            key={ev.id}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEvent?.(ev);
            }}
            onMouseEnter={() => onHoverEvent?.(ev)}
            onMouseLeave={() => onHoverEvent?.(null)}
          >
            {/* Outer glowing white telemetry ring */}
            <circle
              cx={ev.x}
              cy={ev.y}
              r={isSelected ? 4.2 : 2.8}
              fill="none"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="0.35"
              opacity={isSelected ? 0.95 : 0.6}
            >
              <animate
                attributeName="r"
                values={`${isSelected ? 3.8 : 2.4};${isSelected ? 6.2 : 4.6};${isSelected ? 3.8 : 2.4}`}
                dur="2.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9;0.15;0.9"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Event core pin with crisp white glowing border */}
            <circle
              cx={ev.x}
              cy={ev.y}
              r={isSelected ? 2.3 : 1.7}
              fill={ev.success ? config.color : 'var(--color-thermal-high)'}
              stroke="#FFFFFF"
              strokeWidth="0.45"
              style={{
                filter: isSelected
                  ? 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))'
                  : 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))',
              }}
            />
          </g>
        );
      })}
    </g>
  );
}

/**
 * Proportional HTML Tooltip Card rendered in standard CSS pixels.
 * Completely immune to SVG viewBox scaling bugs!
 */
export function EventTooltipCard({
  event,
  onSelectEvent,
}: {
  event: TacticalEvent;
  onSelectEvent?: (event: TacticalEvent) => void;
}) {
  return (
    <div
      className="absolute z-30 pointer-events-auto transition-all duration-150 animate-in fade-in zoom-in-95"
      style={{
        left: `${Math.max(12, Math.min(88, event.x))}%`,
        top: `${Math.max(12, Math.min(85, (event.y / 68) * 100))}%`,
        transform:
          event.y < 34
            ? 'translate(-50%, 14px)'
            : 'translate(-50%, -100%) translateY(-14px)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-60 sm:w-64 p-3 rounded-md bg-stadium-elevated/95 border border-stadium-border-strong text-white shadow-2xl backdrop-blur-md flex flex-col gap-2">
        {/* Header: Timestamp + Success badge */}
        <div className="flex items-center justify-between gap-1 border-b border-white/10 pb-1.5">
          <span className="font-mono text-volt font-bold text-xs flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-volt" />
            [{event.timestampDisplay}]
          </span>
          <span
            className={cn(
              'px-1.5 py-0.5 rounded-xs font-display uppercase tracking-widest text-[9px] font-bold flex items-center gap-1',
              event.success
                ? 'bg-volt/15 text-volt border border-volt/30'
                : 'bg-thermal-high/15 text-thermal-high border border-thermal-high/30'
            )}
          >
            {event.success ? (
              <CheckCircle2 className="w-2.5 h-2.5" />
            ) : (
              <XCircle className="w-2.5 h-2.5" />
            )}
            {event.success ? 'Completado' : 'Pérdida'}
          </span>
        </div>

        {/* Title */}
        <div className="font-display uppercase tracking-wide font-bold text-xs text-white leading-tight">
          {event.title}
        </div>

        {/* Tactical Description */}
        <p className="text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-3">
          {event.description}
        </p>

        {/* Seek action CTA */}
        <button
          onClick={() => onSelectEvent?.(event)}
          className="mt-1 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xs bg-volt/15 text-volt hover:bg-volt hover:text-stadium-base font-display uppercase tracking-wider font-bold text-[10px] transition-colors cursor-pointer"
        >
          <span>Ver jugada [{event.timestampDisplay}]</span>
          <Play className="w-2.5 h-2.5 fill-current" />
        </button>
      </div>
    </div>
  );
}
