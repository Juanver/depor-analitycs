'use client';

import React from 'react';
import { TeamTacticalEvent } from '@/types/teamAnalysis';
import { Play, Trophy, Shield, Zap, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface TeamCollectiveEventMarkersProps {
  events: TeamTacticalEvent[];
  visible?: boolean;
  onSelectEvent?: (event: TeamTacticalEvent) => void;
  hoveredEventId?: string | null;
  onHoverEvent?: (event: TeamTacticalEvent | null) => void;
  activeEventId?: string | null;
}

export function TeamCollectiveEventMarkers({
  events,
  visible = true,
  onSelectEvent,
  hoveredEventId,
  onHoverEvent,
  activeEventId,
}: TeamCollectiveEventMarkersProps) {
  if (!visible || !events || events.length === 0) return null;

  return (
    <g className="team-collective-events-layer">
      {events.map((ev) => {
        const isSelected = activeEventId === ev.id || hoveredEventId === ev.id;
        const isGoal = ev.type === 'goal';

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
            {/* Pulsing ring */}
            <circle
              cx={ev.x}
              cy={ev.y}
              r={isSelected ? 4.5 : 3.0}
              fill="none"
              stroke={isGoal ? 'var(--color-volt)' : 'var(--color-telemetry-cyan)'}
              strokeWidth="0.35"
              opacity="0.8"
            >
              <animate
                attributeName="r"
                values={`${isSelected ? 4 : 2.5};${isSelected ? 6.5 : 4.8};${isSelected ? 4 : 2.5}`}
                dur="2.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9;0.1;0.9"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Core Pin */}
            <circle
              cx={ev.x}
              cy={ev.y}
              r={isSelected ? 2.4 : 1.8}
              fill={isGoal ? 'var(--color-volt)' : 'var(--color-telemetry-cyan)'}
              stroke="#FFFFFF"
              strokeWidth="0.45"
              style={{
                filter: isGoal
                  ? 'drop-shadow(0 0 4px rgba(163, 230, 53, 0.9))'
                  : 'drop-shadow(0 0 3px rgba(34, 211, 238, 0.8))',
              }}
            />
          </g>
        );
      })}
    </g>
  );
}

/**
 * Proportional HTML Tooltip Card for collective team events
 */
export function TeamEventTooltipCard({
  event,
  onSelectEvent,
}: {
  event: TeamTacticalEvent;
  onSelectEvent?: (event: TeamTacticalEvent) => void;
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
      <div className="w-64 p-3 rounded-md bg-stadium-elevated/95 border border-stadium-border-strong text-white shadow-2xl backdrop-blur-md flex flex-col gap-2">
        <div className="flex items-center justify-between gap-1 border-b border-white/10 pb-1.5">
          <span className="font-mono text-volt font-bold text-xs flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-volt" />
            [{event.timestampDisplay}]
          </span>
          <span className="px-1.5 py-0.5 rounded-xs font-display uppercase tracking-widest text-[9px] font-bold bg-volt/15 text-volt border border-volt/30">
            {event.type.replace('_', ' ')}
          </span>
        </div>

        <div className="font-display uppercase tracking-wide font-bold text-xs text-white leading-tight">
          {event.title}
        </div>

        <p className="text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-3">
          {event.description}
        </p>

        <button
          onClick={() => onSelectEvent?.(event)}
          className="mt-1 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xs bg-volt/15 text-volt hover:bg-volt hover:text-stadium-base font-display uppercase tracking-wider font-bold text-[10px] transition-colors cursor-pointer"
        >
          <span>Ver jugada de equipo [{event.timestampDisplay}]</span>
          <Play className="w-2.5 h-2.5 fill-current" />
        </button>
      </div>
    </div>
  );
}
