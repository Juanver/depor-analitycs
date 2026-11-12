'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimeSegmentId } from '@/types/analysis';
import { Flame, Target, Clock } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/cn';

export interface TimelineScrubberProps {
  activeSegment: TimeSegmentId;
  onChangeSegment: (segment: TimeSegmentId) => void;
  showHeatmap: boolean;
  onToggleHeatmap: (show: boolean) => void;
  showEvents: boolean;
  onToggleEvents: (show: boolean) => void;
  segmentEventCounts?: Record<TimeSegmentId, number>;
  className?: string;
}

const SEGMENT_OPTIONS: { id: TimeSegmentId; label: string; range: string }[] = [
  { id: '0-10', label: '0-10 min', range: '00:00 - 10:00' },
  { id: '10-20', label: '10-20 min', range: '10:00 - 20:00' },
  { id: '20-end', label: '20-Fin', range: '20:00 - 28:00' },
  { id: 'full', label: 'Partido Completo', range: 'Todo el encuentro' },
];

export function TimelineScrubber({
  activeSegment,
  onChangeSegment,
  showHeatmap,
  onToggleHeatmap,
  showEvents,
  onToggleEvents,
  segmentEventCounts,
  className,
}: TimelineScrubberProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-md bg-stadium-surface/90 border border-stadium-border backdrop-blur-md shadow-stadium',
        className
      )}
    >
      {/* Time Segments Buttons */}
      <div className="flex items-center gap-1.5 p-1 rounded-sm bg-stadium-base/90 border border-white/5 overflow-x-auto no-scrollbar">
        {SEGMENT_OPTIONS.map((seg) => {
          const isActive = activeSegment === seg.id;
          const count = segmentEventCounts?.[seg.id] ?? 0;

          return (
            <button
              key={seg.id}
              onClick={() => onChangeSegment(seg.id)}
              className={cn(
                'relative flex items-center gap-2 px-3 py-2 rounded-xs font-display uppercase tracking-wider text-xs font-bold transition-all whitespace-nowrap min-h-[38px]',
                isActive ? 'text-stadium-base' : 'text-slate-400 hover:text-white'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="timelineSegmentIndicator"
                  className="absolute inset-0 bg-volt rounded-xs shadow-volt-glow -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}

              <Clock className={cn('w-3.5 h-3.5', isActive ? 'text-stadium-base' : 'text-slate-500')} />
              <span>{seg.label}</span>

              {count > 0 && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold',
                    isActive ? 'bg-stadium-base text-volt' : 'bg-white/10 text-slate-300'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Layer Toggles (Heatmap & Key Events) */}
      <div className="flex items-center justify-end gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
        <Toggle
          checked={showHeatmap}
          onChange={onToggleHeatmap}
          label="Mapa de Calor"
          icon={<Flame className="w-3.5 h-3.5" />}
          variant="volt"
        />

        <Toggle
          checked={showEvents}
          onChange={onToggleEvents}
          label="Eventos Clave"
          icon={<Target className="w-3.5 h-3.5" />}
          variant="cyan"
        />
      </div>
    </div>
  );
}
