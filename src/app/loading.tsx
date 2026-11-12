import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { Zap } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-16 flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <Skeleton variant="rectangular" className="w-32 h-6" />
        <Skeleton variant="rectangular" className="w-80 h-10" />
        <Skeleton variant="rectangular" className="w-96 h-5" />
      </div>

      <Card variant="default" className="w-full p-8">
        <div className="space-y-6">
          <Skeleton variant="rectangular" className="w-full h-12" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton variant="rectangular" className="h-10" />
            <Skeleton variant="rectangular" className="h-10" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton variant="rectangular" className="h-10" />
            <Skeleton variant="rectangular" className="h-10" />
            <Skeleton variant="rectangular" className="h-10" />
          </div>
        </div>
      </Card>
    </div>
  );
}
