'use client';

import { useEffect, useRef } from 'react';
import { WallpaperStyle, WallpaperSize, WALLPAPER_SIZES } from '@/types';
import { renderWallpaper } from '@/lib/canvas/wallpaper';

interface WallpaperPreviewProps {
  style: WallpaperStyle;
  affirmation: string;
  size: WallpaperSize;
  reveal: boolean;
  className?: string;
}

export default function WallpaperPreview({ style, affirmation, size, reveal, className = '' }: WallpaperPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !affirmation.trim()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderWallpaper(ctx, style, affirmation, size, reveal);
  }, [style, affirmation, size, reveal]);

  const dims = WALLPAPER_SIZES[size];

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deep-whisper-wallpaper.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className={className}>
      <div
        className="relative mx-auto overflow-hidden rounded-xl"
        style={{
          maxWidth: 300,
          border: '1px solid var(--border)',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: `${dims.width} / ${dims.height}`,
            display: 'block',
          }}
        />
        {!affirmation.trim() && (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm"
            style={{ color: 'var(--text-dim)', background: 'var(--bg-card)' }}
          >
            Type an affirmation to preview
          </div>
        )}
      </div>
      {affirmation.trim() && (
        <button
          onClick={handleDownload}
          className="btn-primary w-full py-3 mt-4 text-sm"
        >
          Download Wallpaper
        </button>
      )}
      <p className="text-xs text-center mt-2" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
        {dims.width} x {dims.height}px
      </p>
    </div>
  );
}
