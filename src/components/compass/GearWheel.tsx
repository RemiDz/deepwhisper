'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { SEALS } from '@/lib/dreamspell/seals';
import MoonPhase from './MoonPhase';
import type { MoonData } from '@/lib/dreamspell/types';

const TAU = Math.PI * 2;

// Seal colour lookup by index
const SEAL_COLORS = SEALS.map(s => s.colourHex);

interface GearWheelProps {
  kinNumber: number;
  sealIndex: number;
  toneIndex: number;
  moonData: MoonData;
  onCentreTap?: () => void;
  onSealTap?: (sealNumber: number) => void;
  onDayChange?: (delta: number) => void;
}

export default function GearWheel({
  kinNumber, sealIndex, toneIndex, moonData,
  onCentreTap, onSealTap, onDayChange,
}: GearWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sealImages, setSealImages] = useState<(HTMLImageElement | null)[]>([]);

  // Animation state persisted across renders
  const animRef = useRef({
    outer: 0, inner: 0,
    targetOuter: 0, targetInner: 0,
    prevSeal: -1, prevTone: -1,
    initialized: false,
  });

  // Drag state
  const dragRef = useRef({ active: false, startAngle: 0, lastStep: 0 });

  // Keep latest values in refs for the animation loop
  const sealIndexRef = useRef(sealIndex);
  const toneIndexRef = useRef(toneIndex);
  const sealImagesRef = useRef(sealImages);
  sealIndexRef.current = sealIndex;
  toneIndexRef.current = toneIndex;
  sealImagesRef.current = sealImages;

  // --- Preload seal images ---
  useEffect(() => {
    const sealFiles = [
      '1_dragon', '2_wind', '3_night', '4_seed', '5_serpent',
      '6_worldbridger', '7_hand', '8_star', '9_moon', '10_dog',
      '11_monkey', '12_human', '13_skywalker', '14_wizard', '15_eagle',
      '16_warrior', '17_earth', '18_mirror', '19_storm', '20_sun',
    ];
    const imgs: (HTMLImageElement | null)[] = new Array(20).fill(null);
    let loaded = 0;
    sealFiles.forEach((name, i) => {
      const img = new Image();
      img.src = `/icons/${name}.png`;
      img.onload = () => { imgs[i] = img; loaded++; if (loaded === 20) setSealImages([...imgs]); };
      img.onerror = () => { loaded++; if (loaded === 20) setSealImages([...imgs]); };
    });
  }, []);

  // --- Update targets when seal/tone indices change ---
  useEffect(() => {
    const a = animRef.current;
    if (!a.initialized) {
      a.targetOuter = -(sealIndex / 20) * TAU;
      a.targetInner = -(toneIndex / 13) * TAU;
      a.outer = a.targetOuter;
      a.inner = a.targetInner;
      a.prevSeal = sealIndex;
      a.prevTone = toneIndex;
      a.initialized = true;
      return;
    }
    if (sealIndex !== a.prevSeal || toneIndex !== a.prevTone) {
      let sd = sealIndex - a.prevSeal;
      if (sd > 10) sd -= 20;
      if (sd < -10) sd += 20;
      a.targetOuter -= (sd / 20) * TAU;

      let td = toneIndex - a.prevTone;
      if (td > 6) td -= 13;
      if (td < -6) td += 13;
      a.targetInner -= (td / 13) * TAU;

      a.prevSeal = sealIndex;
      a.prevTone = toneIndex;
    }
  }, [sealIndex, toneIndex]);

  // --- Main animation loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    let running = true;

    function frame() {
      if (!running || !canvas || !container) return;
      const a = animRef.current;

      // Ease toward targets with shortest-path wrapping
      let dOuter = a.targetOuter - a.outer;
      let dInner = a.targetInner - a.inner;
      while (dOuter > Math.PI) dOuter -= TAU;
      while (dOuter < -Math.PI) dOuter += TAU;
      while (dInner > Math.PI) dInner -= TAU;
      while (dInner < -Math.PI) dInner += TAU;

      if (Math.abs(dOuter) > 0.0001) a.outer += dOuter * 0.1;
      else a.outer = a.targetOuter;
      if (Math.abs(dInner) > 0.0001) a.inner += dInner * 0.1;
      else a.inner = a.targetInner;

      // Handle canvas sizing
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const pw = Math.round(rect.width * dpr);
      const ph = Math.round(rect.height * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }

      const ctx = canvas.getContext('2d');
      if (ctx && rect.width > 0) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, rect.width, rect.height);
        drawGears(ctx, rect.width, rect.height, a.outer, a.inner,
          sealImagesRef.current, sealIndexRef.current, toneIndexRef.current);
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
    return () => { running = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Redraw when images load ---
  useEffect(() => {
    // images are read from ref inside animation loop
  }, [sealImages]);

  // --- Drag handlers ---
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const dist = Math.sqrt(x * x + y * y);
    const u = Math.min(rect.width, rect.height);
    if (dist < u * 0.15 || dist > u * 0.48) return;
    const angle = Math.atan2(y, x);
    dragRef.current = { active: true, startAngle: angle, lastStep: 0 };
    canvas.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);
    let delta = angle - dragRef.current.startAngle;
    delta = ((delta + Math.PI) % TAU + TAU) % TAU - Math.PI;
    const stepSize = TAU / 20;
    const steps = Math.round(delta / stepSize);
    if (steps !== dragRef.current.lastStep) {
      const dayDelta = -(steps - dragRef.current.lastStep);
      dragRef.current.lastStep = steps;
      onDayChange?.(dayDelta);
    }
  }, [onDayChange]);

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  // --- Seal tap detection ---
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (Math.abs(dragRef.current.lastStep) > 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const clickAngle = Math.atan2(y, x);
    const dist = Math.sqrt(x * x + y * y);
    const u = Math.min(rect.width, rect.height);
    const outerR = u * 0.37;
    const sealSz = u * 0.085;
    if (dist < outerR - sealSz * 0.8 || dist > outerR + sealSz * 0.8) return;
    const a = animRef.current;
    const sStep = TAU / 20;
    for (let i = 0; i < 20; i++) {
      const sAngle = a.outer + i * sStep - Math.PI / 2;
      let diff = clickAngle - sAngle;
      diff = ((diff + Math.PI) % TAU + TAU) % TAU - Math.PI;
      if (Math.abs(diff) < sStep / 2) {
        onSealTap?.(i);
        return;
      }
    }
  }, [onSealTap]);

  const moonSize = 86;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full"
      style={{ maxWidth: 350, aspectRatio: '1' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, touchAction: 'none', cursor: 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
      />

      {/* Centre moon — preserved exactly as-is */}
      <div
        className="absolute cursor-pointer"
        style={{
          width: moonSize,
          height: moonSize,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          borderRadius: '50%',
        }}
        onClick={onCentreTap}
      >
        <MoonPhase moonData={moonData} size={moonSize} zodiacSign={moonData.zodiacSign} />
      </div>

      {/* Moon info below centre */}
      <div
        className="absolute text-center pointer-events-none"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, 32px)', zIndex: 3 }}
      >
        <span className="text-[9px] text-[#9ca3af]">
          {moonData.phaseName} · {Math.round(moonData.illumination)}%
        </span>
      </div>

      {/* Zodiac name above centre — positioned above moon graphic */}
      {moonData.zodiacSign && (
        <div
          className="absolute text-center pointer-events-none"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -58px)', zIndex: 3 }}
        >
          <span className="text-[10px] text-[#a78bfa]" style={{ textShadow: '0 0 4px #080812, 0 0 8px #080812' }}>{moonData.zodiacSign}</span>
        </div>
      )}
    </div>
  );
}

// ===================== DRAWING FUNCTIONS =====================

function drawGears(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  outerAngle: number, innerAngle: number,
  sealImages: (HTMLImageElement | null)[],
  sealIndex: number, toneIndex: number,
) {
  const u = Math.min(W, H);
  const cx = W / 2;
  const cy = H / 2;

  const iconSz = u * 0.085;
  const outerR = u * 0.37;
  const gapB = u * 0.018;
  const innerOuterR = outerR - iconSz / 2 - gapB;
  const innerInnerR = innerOuterR - u * 0.12;
  const sStep = TAU / 20;
  const tStep = TAU / 13;
  const toneTeethR = (innerOuterR + innerInnerR) / 2;

  // --- Background glow ---
  const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR + iconSz);
  glowGrad.addColorStop(0, 'rgba(192,132,252,0.06)');
  glowGrad.addColorStop(0.4, 'rgba(30,30,60,0.04)');
  glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, W, H);

  // --- Ring guide lines ---
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.arc(cx, cy, innerOuterR, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, innerInnerR, 0, TAU); ctx.stroke();

  // --- Centre hub (subtle fill for moon area boundary) ---
  ctx.beginPath();
  ctx.arc(cx, cy, innerInnerR - 2, 0, TAU);
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.fill();

  // --- Inner gear teeth (13 tone positions) ---
  const toothOutR = innerOuterR;
  const toothInR = innerInnerR;
  const ta2 = tStep * 0.4;

  for (let i = 0; i < 13; i++) {
    const a = innerAngle + i * tStep - Math.PI / 2;
    const isActive = i === toneIndex;
    const g1 = a - tStep / 2;
    const g2 = a + tStep / 2;
    const b1 = a - ta2 / 2;
    const b2 = a + ta2 / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, toothInR, g1, b1);
    ctx.lineTo(cx + toothOutR * Math.cos(b1), cy + toothOutR * Math.sin(b1));
    ctx.arc(cx, cy, toothOutR, b1, b2);
    ctx.lineTo(cx + toothInR * Math.cos(b2), cy + toothInR * Math.sin(b2));
    ctx.arc(cx, cy, toothInR, b2, g2);
    ctx.closePath();

    ctx.fillStyle = '#c084fc';
    ctx.globalAlpha = isActive ? 0.2 : 0.04;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // --- Tone dot-and-bar symbols ---
  for (let i = 0; i < 13; i++) {
    const a = innerAngle + i * tStep - Math.PI / 2;
    const isActive = i === toneIndex;
    const tx = cx + toneTeethR * Math.cos(a);
    const ty = cy + toneTeethR * Math.sin(a);

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(a - Math.PI / 2);  // MINUS — bars face outward
    ctx.globalAlpha = isActive ? 1 : 0.5;
    drawRadialDotBar(ctx, i + 1, isActive, isActive ? 1.4 : 0.9);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // --- Mesh zone highlight ---
  const meshAngle = -Math.PI / 2;
  const activeCol = SEAL_COLORS[sealIndex] === '#e0ddd6' ? '#c084fc' : SEAL_COLORS[sealIndex];

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, outerR + iconSz / 2 + 4, meshAngle - 0.12, meshAngle + 0.12);
  ctx.arc(cx, cy, innerInnerR - 4, meshAngle + 0.12, meshAngle - 0.12, true);
  ctx.closePath();
  ctx.fillStyle = activeCol;
  ctx.globalAlpha = 0.15;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  // --- Pointer triangle ---
  const pY = cy - outerR - iconSz / 2 - 6;
  ctx.beginPath();
  ctx.moveTo(cx, pY);
  ctx.lineTo(cx - 5, pY - 10);
  ctx.lineTo(cx + 5, pY - 10);
  ctx.closePath();
  ctx.fillStyle = activeCol;
  ctx.globalAlpha = 0.7;
  ctx.fill();
  ctx.globalAlpha = 1;

  // --- Outer gear seal icons (20 positions) ---
  for (let i = 0; i < 20; i++) {
    const a = outerAngle + i * sStep - Math.PI / 2;
    const isActive = i === sealIndex;
    const ix = cx + outerR * Math.cos(a);
    const iy = cy + outerR * Math.sin(a);
    const sz = isActive ? iconSz * 1.12 : iconSz;

    ctx.save();
    ctx.translate(ix, iy);
    ctx.rotate(a + Math.PI / 2);

    // Rounded rectangle path
    const rd = sz * 0.18;
    ctx.beginPath();
    ctx.moveTo(-sz / 2 + rd, -sz / 2);
    ctx.lineTo(sz / 2 - rd, -sz / 2);
    ctx.quadraticCurveTo(sz / 2, -sz / 2, sz / 2, -sz / 2 + rd);
    ctx.lineTo(sz / 2, sz / 2 - rd);
    ctx.quadraticCurveTo(sz / 2, sz / 2, sz / 2 - rd, sz / 2);
    ctx.lineTo(-sz / 2 + rd, sz / 2);
    ctx.quadraticCurveTo(-sz / 2, sz / 2, -sz / 2, sz / 2 - rd);
    ctx.lineTo(-sz / 2, -sz / 2 + rd);
    ctx.quadraticCurveTo(-sz / 2, -sz / 2, -sz / 2 + rd, -sz / 2);
    ctx.closePath();

    // Clip and draw seal image
    ctx.save();
    ctx.clip();
    const img = sealImages[i];
    if (img && img.complete) {
      ctx.globalAlpha = isActive ? 1 : 0.3;
      ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
    } else {
      // Placeholder colour fill while loading
      ctx.globalAlpha = isActive ? 0.5 : 0.15;
      ctx.fillStyle = SEALS[i].bgHex;
      ctx.fill();
    }
    ctx.restore();

    // Active seal border highlight
    if (isActive) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 1;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // --- Vignette ---
  const vigGrad = ctx.createRadialGradient(cx, cy, u * 0.3, cx, cy, u * 0.52);
  vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
  vigGrad.addColorStop(1, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = vigGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, u * 0.52, 0, TAU);
  ctx.fill();
}

// ---------- Tone dot-and-bar helpers ----------

function getDotBar(tone: number): { bars: number; dots: number } {
  if (tone % 5 === 0) {
    return { bars: tone / 5, dots: 0 };
  }
  return { bars: Math.floor(tone / 5), dots: tone % 5 };
}

function drawRadialDotBar(
  ctx: CanvasRenderingContext2D,
  tone: number,
  active: boolean,
  scale: number,
) {
  const s = scale;
  const { bars, dots } = getDotBar(tone);
  const dotR = 2.5 * s;
  const barW = 12 * s;
  const barH = 2.5 * s;
  const vGap = 5 * s;
  const dotGap = 5 * s;

  // Calculate total height
  const barTotalH = bars > 0 ? bars * barH + (bars - 1) * vGap : 0;
  const dotRowH = dots > 0 ? dotR * 2 : 0;
  const gapBetween = (bars > 0 && dots > 0) ? vGap : 0;
  const totalH = barTotalH + gapBetween + dotRowH;

  let sy = -totalH / 2;

  const col = active ? '#ffffff' : 'rgba(255,255,255,0.4)';
  ctx.fillStyle = col;

  // Draw bars stacked vertically (each bar is a horizontal line)
  for (let b = 0; b < bars; b++) {
    ctx.fillRect(-barW / 2, sy, barW, barH);
    sy += barH + vGap;
  }

  // Draw dots in a HORIZONTAL ROW (side by side)
  if (dots > 0) {
    const dotRowY = sy + dotR;
    const dotRowW = dots * dotR * 2 + (dots - 1) * dotGap;
    let dx = -dotRowW / 2 + dotR;

    for (let d = 0; d < dots; d++) {
      ctx.beginPath();
      ctx.arc(dx, dotRowY, dotR, 0, TAU);
      ctx.fill();
      dx += dotR * 2 + dotGap;
    }
  }
}
