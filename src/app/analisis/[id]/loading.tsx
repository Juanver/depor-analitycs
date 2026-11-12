import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { Scan, Activity, Zap } from 'lucide-react';

export default function AnalysisLoading() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      {/* Top Banner Skeleton */}
      <Card variant="default" className="p-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <Skeleton variant="rectangular" className="w-20 h-20" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton variant="rectangular" className="w-48 h-6" />
            <Skeleton variant="rectangular" className="w-32 h-4" />
            <Skeleton variant="rectangular" className="w-64 h-3" />
          </div>
          <Skeleton variant="circular" className="w-20 h-20 shrink-0" />
        </div>
      </Card>

      {/* Grid: Pitch Skeleton & Video Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Card variant="default" className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Skeleton variant="rectangular" className="w-40 h-5" />
              <Skeleton variant="rectangular" className="w-24 h-4" />
            </div>
            <Skeleton variant="rectangular" className="w-full aspect-[100/68]" />
            <Skeleton variant="rectangular" className="w-full h-12" />
          </Card>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card variant="default" className="p-4 flex flex-col gap-4">
            <Skeleton variant="rectangular" className="w-full aspect-video" />
            <Skeleton variant="rectangular" className="w-full h-24" />
          </Card>
        </div>
      </div>

      {/* KPIs Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} variant="rectangular" className="h-28" />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-mono text-volt py-4">
        <Scan className="w-4 h-4 animate-spin" />
        <span>Sincronizando telemetría del partido...</span>
      </div>
    </div>
  );
}
