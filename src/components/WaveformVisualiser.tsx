'use client';

import { useEffect, useRef } from 'react';
import { drawWaveform } from '@/lib/canvas/waveform';

interface WaveformVisualiserProps {
  buffer: AudioBuffer | null;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function WaveformVisualiser({
  buffer,
  width = 400,
  height = 60,
  color = 'var(--waveform)',
  className = '',
}: WaveformVisualiserProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !buffer) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Resolve CSS variable to actual colour
    const resolvedColor = color.startsWith('var(')
      ? getComputedStyle(document.documentElement).getPropertyValue(color.slice(4, -1)).trim() || '#4A3AFF'
      : color;

    drawWaveform(ctx, buffer, width, height, resolvedColor);
  }, [buffer, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, borderRadius: 6 }}
    />
  );
}
