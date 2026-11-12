'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TeamTacticalProfile } from '@/types/teamAnalysis';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, Trophy, Compass } from 'lucide-react';

export interface TeamScoutHeaderProps {
  profile: TeamTacticalProfile;
  className?: string;
}

export function TeamScoutHeader({ profile, className }: TeamScoutHeaderProps) {
  const [displayRating, setDisplayRating] = useState(0);

  useEffect(() => {
    let current = 0;
    const target = profile.overallRating;
    const duration = 1000;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayRating(target);
        clearInterval(timer);
      } else {
        setDisplayRating(Number(current.toFixed(1)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [profile.overallRating]);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayRating / 10) * circumference;

  return (
    <Card cornerAccents className={className} variant="default">
      <div className="relative p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 overflow-hidden">
        {/* Left: Team Crest & Identity */}
        <div className="flex items-center gap-4 z-10 flex-wrap sm:flex-nowrap">
          <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-stadium-elevated to-stadium-base border border-volt/40 shadow-volt-glow shrink-0">
            <Users className="w-8 h-8 text-volt" />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="volt" size="sm">
                {profile.teamName}
              </Badge>

              <span className="text-[10px] font-display uppercase tracking-wider font-bold px-2 py-0.5 rounded-xs bg-telemetry-cyan/15 text-telemetry-cyan border border-telemetry-cyan/30">
                {profile.matchFormat}
              </span>

              {profile.finalScore && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Score: {profile.finalScore}
                </span>
              )}

              {profile.competition && (
                <span className="text-xs text-slate-400 font-sans hidden sm:inline-block">
                  • {profile.competition}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight text-[var(--color-text-main)] leading-none mt-0.5">
              {profile.teamName} <span className="text-slate-400 font-normal text-xl">vs</span> {profile.opponentTeam}
            </h1>

            {/* Tactical Formation & Style */}
            <div className="flex items-center gap-2 text-xs flex-wrap mt-0.5">
              <span className="font-display font-bold text-slate-300 uppercase">
                {profile.tacticalFormation}
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-sans text-volt font-semibold flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-volt" />
                {profile.collectiveStyle}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Radial Team Rating */}
        <div className="flex items-center gap-3.5 self-end md:self-center z-10 shrink-0 bg-stadium-base/70 px-4 py-2.5 rounded-xl border border-stadium-border">
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-display uppercase tracking-widest text-slate-400">
              VALORACIÓN
            </span>
            <span className="text-xs font-display uppercase tracking-wider font-extrabold text-volt">
              TEAM RATING
            </span>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 72 72"
              width="64"
              height="64"
              className="w-16 h-16 -rotate-90 block shrink-0"
            >
              <circle
                cx="36"
                cy="36"
                r={radius}
                className="stroke-stadium-elevated fill-none"
                strokeWidth="5"
              />
              <motion.circle
                cx="36"
                cy="36"
                r={radius}
                className="stroke-volt fill-none transition-all duration-300"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(163, 230, 53, 0.5))',
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-display font-black text-xl text-[var(--color-text-main)] tracking-tight leading-none">
                {displayRating.toFixed(1)}
              </span>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5">/ 10</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
