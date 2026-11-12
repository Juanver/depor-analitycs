'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatSecondsToMMSS, extractYouTubeId } from '@/lib/formatTimestamp';
import {
  RotateCcw,
  RotateCw,
  Maximize2,
  Tv,
  Sparkles,
  Play,
  Volume2,
} from 'lucide-react';

export interface SyncedVideoPlayerProps {
  youtubeId?: string;
  videoUrl?: string;
  targetSeconds?: number | null;
  onTargetConsumed?: () => void;
  className?: string;
}

export function SyncedVideoPlayer({
  youtubeId,
  videoUrl,
  targetSeconds,
  onTargetConsumed,
  className,
}: SyncedVideoPlayerProps) {
  const effectiveYoutubeId =
    youtubeId || (videoUrl ? extractYouTubeId(videoUrl) : null) || '-eI9ZUNdxgw';

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentPlayhead, setCurrentPlayhead] = useState(0);
  const [isIframeReady, setIsIframeReady] = useState(false);
  const [isStickyMobile, setIsStickyMobile] = useState(false);
  const pendingSeekRef = useRef<number | null>(null);

  // Send command to YouTube iframe via standard postMessage API
  const sendCommand = useCallback((func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args,
          }),
          '*'
        );
      } catch (e) {
        console.warn('YouTube postMessage error:', e);
      }
    }
  }, []);

  // Smoothly seek video to target seconds without reloading the iframe
  const seekToSecond = useCallback(
    (seconds: number) => {
      setCurrentPlayhead(seconds);
      sendCommand('seekTo', [seconds, true]);
      sendCommand('playVideo', []);
    },
    [sendCommand]
  );

  // Listen to iframe load event to handshake with YouTube API
  const handleIframeLoad = () => {
    setIsIframeReady(true);
    // Handshake: tell YouTube this parent window is listening
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      );
    }
    // If user clicked a timestamp before the iframe finished loading, execute it now
    if (pendingSeekRef.current !== null) {
      seekToSecond(pendingSeekRef.current);
      pendingSeekRef.current = null;
    }
  };

  // Listen to message events from YouTube iframe to track currentTime in real time
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data !== 'string') return;
        const payload = JSON.parse(event.data);
        if (payload.event === 'infoDelivery' && payload.info) {
          if (typeof payload.info.currentTime === 'number') {
            setCurrentPlayhead(Math.floor(payload.info.currentTime));
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // When targetSeconds changes from outside (event marker click, timestamp chip)
  useEffect(() => {
    if (targetSeconds !== undefined && targetSeconds !== null) {
      seekToSecond(targetSeconds);
      onTargetConsumed?.();
    }
  }, [targetSeconds, seekToSecond, onTargetConsumed]);

  // Relative seek controls (-5s, +5s)
  const handleRelativeSeek = (delta: number) => {
    const target = Math.max(0, currentPlayhead + delta);
    seekToSecond(target);
  };

  // The embed URL is 100% FIXED and STABLE.
  // It NEVER changes when seeking, preventing any iframe reloads or black screens.
  const embedUrl = `https://www.youtube.com/embed/${effectiveYoutubeId}?enablejsapi=1&playsinline=1&rel=0&modestbranding=1`;

  return (
    <Card
      cornerAccents
      variant="default"
      className={`overflow-hidden flex flex-col ${
        isStickyMobile
          ? 'fixed bottom-16 right-4 w-72 z-50 shadow-2xl border-volt'
          : ''
      } ${className}`}
    >
      {/* Broadcast Header Strip */}
      <div className="flex items-center justify-between px-3 py-2 bg-stadium-elevated border-b border-stadium-border text-xs">
        <div className="flex items-center gap-2">
          <Badge variant="volt" size="sm" pulse>
            LIVE SYNC
          </Badge>
          <span className="font-display uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-telemetry-cyan" />
            Cámara Táctica Cenital
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-volt font-bold text-xs bg-stadium-base px-2 py-0.5 rounded-xs border border-volt/20">
            [{formatSecondsToMMSS(currentPlayhead)}]
          </span>
          <button
            onClick={() => setIsStickyMobile(!isStickyMobile)}
            className="md:hidden text-slate-400 hover:text-white p-1"
            title="Fijar mini reproductor"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video Container (16:9 aspect ratio) */}
      <div className="relative w-full aspect-video bg-black">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="Video de Análisis Táctico - Pandass Cup"
          className="absolute inset-0 w-full h-full border-0 block"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          onLoad={handleIframeLoad}
        />

        {/* Telemetry watermark overlay */}
        <div className="pointer-events-none absolute bottom-2 right-2 px-2 py-0.5 rounded-xs bg-stadium-base/80 border border-stadium-border text-[9px] font-display uppercase tracking-widest text-slate-400 backdrop-blur-sm z-10">
          DEPOR-ANALYTICS SYNC
        </div>
      </div>

      {/* Quick Playback Seek Controls */}
      <div className="p-2.5 bg-stadium-elevated/70 flex items-center justify-between gap-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleRelativeSeek(-5)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xs bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
            title="Retroceder 5 segundos"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            -5s
          </button>

          <button
            onClick={() => handleRelativeSeek(5)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xs bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
            title="Avanzar 5 segundos"
          >
            +5s
            <RotateCw className="w-3 h-3 text-slate-400" />
          </button>

          <button
            onClick={() => sendCommand('playVideo')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xs bg-volt/15 hover:bg-volt text-volt hover:text-stadium-base text-xs font-display uppercase tracking-wider font-bold transition-colors cursor-pointer ml-1"
            title="Reproducir video"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Play</span>
          </button>
        </div>

        <div className="text-[10px] text-slate-400 font-sans hidden sm:flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-volt" />
          Toca cualquier [MM:SS] para saltar a la jugada
        </div>
      </div>
    </Card>
  );
}
