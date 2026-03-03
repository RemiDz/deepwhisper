'use client';

import { useRef, useEffect } from 'react';
import { FlashBackground } from '@/types';
import { drawMetatronsCube } from '@/lib/canvas/sacred-geometry';

interface FlashCanvasProps {
  background: FlashBackground;
  customBgColour?: string;
}

export default function FlashCanvas({ background, customBgColour }: FlashCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (background !== 'sacred-geometry' && background !== 'colour-pulse') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      frameRef.current++;
      const w = canvas.width;
      const h = canvas.height;

      if (background === 'sacred-geometry') {
        ctx.fillStyle = '#08080C';
        ctx.fillRect(0, 0, w, h);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate((frameRef.current * 0.02 * Math.PI) / 180);
        ctx.translate(-w / 2, -h / 2);
        drawMetatronsCube(ctx, w / 2, h / 2, Math.min(w, h) * 0.2, 'rgba(196, 161, 255, 0.08)', 0.5);
        ctx.restore();
      } else if (background === 'colour-pulse') {
        const hue = (frameRef.current * 0.3) % 360;
        ctx.fillStyle = `hsl(${hue}, 15%, 5%)`;
        ctx.fillRect(0, 0, w, h);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [background]);

  if (background === 'dark') {
    return <div className="fixed inset-0" style={{ background: 'var(--bg-deep)' }} />;
  }

  if (background === 'custom') {
    return <div className="fixed inset-0" style={{ background: customBgColour || '#000' }} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
