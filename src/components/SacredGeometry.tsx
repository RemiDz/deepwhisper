'use client';

import { useEffect, useRef } from 'react';
import { drawFlowerOfLife } from '@/lib/canvas/sacred-geometry';

interface SacredGeometryProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function SacredGeometry({ size = 200, color = 'rgba(196, 161, 255, 0.06)', className = '' }: SacredGeometryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((frame * 0.02 * Math.PI) / 180);
      ctx.translate(-size / 2, -size / 2);
      drawFlowerOfLife(ctx, size / 2, size / 2, size * 0.15, color, 0.5);
      ctx.restore();
      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [size, color]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
