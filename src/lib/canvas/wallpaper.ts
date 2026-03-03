import { WallpaperStyle, WALLPAPER_SIZES, WallpaperSize } from '@/types';
import { drawFlowerOfLife, drawMandala, renderTextAlongCircle } from './sacred-geometry';

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function renderWallpaper(
  ctx: CanvasRenderingContext2D,
  style: WallpaperStyle,
  text: string,
  size: WallpaperSize,
  reveal: boolean,
) {
  const { width, height } = WALLPAPER_SIZES[size];
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  switch (style) {
    case 'sacred-geometry':
      renderSacredGeometry(ctx, text, width, height, reveal);
      break;
    case 'mandala':
      renderMandalaStyle(ctx, text, width, height, reveal);
      break;
    case 'cosmic':
      renderCosmic(ctx, text, width, height, reveal);
      break;
    case 'minimal':
      renderMinimal(ctx, text, width, height, reveal);
      break;
  }
}

function renderSacredGeometry(ctx: CanvasRenderingContext2D, text: string, w: number, h: number, reveal: boolean) {
  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0A0820');
  grad.addColorStop(1, '#050510');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const radius = w * 0.25;

  // Draw Flower of Life
  drawFlowerOfLife(ctx, cx, cy, radius, reveal ? 'rgba(196, 161, 255, 0.3)' : 'rgba(196, 161, 255, 0.08)', 1);

  // Embed text along geometry paths
  const textColor = reveal ? 'rgba(232, 230, 240, 0.5)' : 'rgba(232, 230, 240, 0.035)';
  for (let ring = 1; ring <= 6; ring++) {
    const ringRadius = radius * ring * 0.5;
    renderTextAlongCircle(ctx, text, cx, cy, ringRadius, 14, textColor);
  }
}

function renderMandalaStyle(ctx: CanvasRenderingContext2D, text: string, w: number, h: number, reveal: boolean) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#041A1A');
  grad.addColorStop(1, '#050510');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.min(w, h) * 0.4;

  drawMandala(ctx, cx, cy, maxRadius, reveal ? 'rgba(196, 161, 255, 0.25)' : 'rgba(196, 161, 255, 0.06)', 1);

  // Spiral text from centre outward
  const textColor = reveal ? 'rgba(232, 230, 240, 0.5)' : 'rgba(232, 230, 240, 0.03)';
  ctx.font = '14px "DM Sans", sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fullText = (text + ' ').repeat(100);
  let charIdx = 0;
  for (let a = 0; a < Math.PI * 20 && charIdx < fullText.length; a += 0.08) {
    const r = 30 + a * maxRadius / (Math.PI * 20);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    const fontSize = Math.max(8, 16 - a * 0.3);
    ctx.font = `${fontSize}px "DM Sans", sans-serif`;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(fullText[charIdx], 0, 0);
    ctx.restore();
    charIdx++;
  }
}

function renderCosmic(ctx: CanvasRenderingContext2D, text: string, w: number, h: number, reveal: boolean) {
  // Deep space background
  ctx.fillStyle = '#030308';
  ctx.fillRect(0, 0, w, h);

  // Stars
  for (let i = 0; i < 300; i++) {
    const x = seededRandom(i * 3) * w;
    const y = seededRandom(i * 3 + 1) * h;
    const r = seededRandom(i * 3 + 2) * 1.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + seededRandom(i * 3 + 3) * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nebula cloud
  const nebula = ctx.createRadialGradient(w * 0.4, h * 0.4, 0, w * 0.4, h * 0.4, w * 0.5);
  nebula.addColorStop(0, 'rgba(100, 40, 150, 0.06)');
  nebula.addColorStop(0.5, 'rgba(40, 60, 140, 0.04)');
  nebula.addColorStop(1, 'transparent');
  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, w, h);

  // Scattered text at random angles and sizes
  const textColor = reveal ? 'rgba(232, 230, 240, 0.4)' : 'rgba(232, 230, 240, 0.03)';
  ctx.fillStyle = textColor;

  for (let i = 0; i < 60; i++) {
    const x = seededRandom(i * 5 + 100) * w;
    const y = seededRandom(i * 5 + 101) * h;
    const angle = (seededRandom(i * 5 + 102) - 0.5) * Math.PI * 0.5;
    const fontSize = 10 + seededRandom(i * 5 + 103) * 40;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = `${fontSize}px "DM Sans", sans-serif`;
    ctx.globalAlpha = reveal ? 0.4 : 0.02 + seededRandom(i * 5 + 104) * 0.02;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function renderMinimal(ctx: CanvasRenderingContext2D, text: string, w: number, h: number, reveal: boolean) {
  ctx.fillStyle = '#0A0A0E';
  ctx.fillRect(0, 0, w, h);

  const fontSize = 8;
  ctx.font = `${fontSize}px "DM Sans", sans-serif`;
  ctx.fillStyle = reveal ? 'rgba(232, 230, 240, 0.4)' : 'rgba(232, 230, 240, 0.02)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const lineHeight = fontSize * 1.8;
  const charWidth = fontSize * 0.55;
  const cols = Math.floor(w / (text.length * charWidth + 40));
  const rows = Math.floor(h / lineHeight);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * (text.length * charWidth + 40) + 20;
      const y = row * lineHeight + 10;
      ctx.fillText(text, x, y);
    }
  }
}
