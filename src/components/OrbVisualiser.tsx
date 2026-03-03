'use client';

import { useEffect, useRef } from 'react';

interface OrbVisualiserProps {
  size?: number;
  color?: string;
  pulseSpeed?: number;
  className?: string;
}

export default function OrbVisualiser({
  size = 300,
  color = '#C4A1FF',
  pulseSpeed = 4,
  className = '',
}: OrbVisualiserProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

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

    const drawFlowerOfLife = (cx: number, cy: number, radius: number, rotation: number, scale: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      const r = radius * 0.3;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.3;

      // Central circle
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      // 6 surrounding circles
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Outer ring of 6 circles
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + Math.PI / 6;
        const x = Math.cos(angle) * r * 1.732;
        const y = Math.sin(angle) * r * 1.732;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Another ring of 6
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * r * 2;
        const y = Math.sin(angle) * r * 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Enclosing circle
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.arc(0, 0, r * 3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const rotation = (frame * 0.1 * Math.PI) / 180;
      const pulsePhase = (frame / 60) * ((2 * Math.PI) / pulseSpeed);
      const scale = 0.98 + Math.sin(pulsePhase) * 0.02;

      // Glow behind
      const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.4);
      glowGrad.addColorStop(0, color + '15');
      glowGrad.addColorStop(0.5, color + '08');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, size, size);

      drawFlowerOfLife(cx, cy, size * 0.35, rotation, scale);

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [size, color, pulseSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
