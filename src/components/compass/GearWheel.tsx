'use client';

import { useRef, useEffect, useLayoutEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { SEALS } from '@/lib/dreamspell/seals';
import MoonPhase from './MoonPhase';
import type { MoonData } from '@/lib/dreamspell/types';

const TAU = Math.PI * 2;

// Seal colour lookup by index
const SEAL_COLORS = SEALS.map(s => s.colourHex);

/* ================================================================
   Cinematic gear-wheel load animation
   Pre-calculated approach-from-behind: each gear starts several
   rotations away from its target and eases toward it in ONE
   direction only — no reversal possible.
   ================================================================ */

const CIN_DURATION = 4000;      // angle interpolation duration (ms)
const CIN_ENGAGE_START = 3600;  // mesh zone pulse start
const CIN_ENGAGE_DUR = 400;     // mesh zone pulse duration
const CIN_TOTAL = 4000;         // total animation including engage

/**
 * Smooth ease-in-out: f(t) = t - sin(2πt) / (2π)
 * Derivative f'(t) = 1 - cos(2πt), which is always >= 0.
 * Speed: 0 at t=0, peaks at t=0.5, returns to 0 at t=1.
 * Mathematically cannot speed up after the midpoint.
 */
function smoothEase(t: number): number {
  return t - Math.sin(t * Math.PI * 2) / (Math.PI * 2);
}

/* ---- draw-time animation parameters ---- */

interface AnimDrawParams {
  fadeOuter: number;
  fadeInner: number;
  visibleSeals: boolean[];
  visibleTones: boolean[];
  sealScales: number[];
  meshAlpha: number;
  pointerAlpha: number;
}

/* ================================================================
   Component
   ================================================================ */

interface GearWheelProps {
  kinNumber: number;
  sealIndex: number;
  toneIndex: number;
  moonData: MoonData;
  onCentreTap?: () => void;
  onSealTap?: (sealNumber: number) => void;
  onDayChange?: (delta: number) => void;
  onAnimPhaseChange?: (phase: 'idle' | 'running' | 'complete') => void;
}

export interface GearWheelHandle {
  startAnimation: (targetSealIndex?: number, targetToneIndex?: number) => void;
}

export default forwardRef<GearWheelHandle, GearWheelProps>(function GearWheel(
  { kinNumber, sealIndex, toneIndex, moonData, onCentreTap, onSealTap, onDayChange, onAnimPhaseChange },
  ref,
) {
  void kinNumber; // listed in props interface but not used internally

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

  // --- Cinematic animation state ---
  const [cinPhase, setCinPhase] = useState<'idle' | 'running' | 'complete'>('idle');
  const cinRef = useRef({
    phase: 'idle' as 'idle' | 'running' | 'complete',
    startTime: 0,
    innerStart: 0,
    innerEnd: 0,
    outerStart: 0,
    outerEnd: 0,
    visibleSeals: new Array(20).fill(false) as boolean[],
    visibleTones: new Array(13).fill(false) as boolean[],
    sealAppearTime: new Array(20).fill(0) as number[],
    toneAppearTime: new Array(13).fill(0) as number[],
  });

  const onAnimPhaseChangeRef = useRef(onAnimPhaseChange);
  onAnimPhaseChangeRef.current = onAnimPhaseChange;

  // DOM refs for direct opacity manipulation (avoids React style conflicts)
  const moonContainerRef = useRef<HTMLDivElement>(null);
  const moonInfoRef = useRef<HTMLDivElement>(null);
  const zodiacRef = useRef<HTMLDivElement>(null);

  // --- Start / replay animation ---
  // Optional params allow caller to pass correct indices (avoids stale ref issue on Today press)
  const startAnimation = useCallback((targetSealIndex?: number, targetToneIndex?: number) => {
    const c = cinRef.current;
    c.phase = 'running';
    c.startTime = performance.now();

    // Use provided indices or fall back to current refs
    const si = targetSealIndex ?? sealIndexRef.current;
    const ti = targetToneIndex ?? toneIndexRef.current;
    const innerTarget = -(ti / 13) * TAU;
    const outerTarget = -(si / 20) * TAU;

    // Inner gear: 2 full rotations of clockwise approach (angle decreases)
    c.innerStart = innerTarget + TAU * 2;
    c.innerEnd = innerTarget;

    // Outer gear: 2 full rotations of counter-clockwise approach (angle increases)
    c.outerStart = outerTarget - TAU * 2;
    c.outerEnd = outerTarget;

    c.visibleSeals.fill(false);
    c.visibleTones.fill(false);
    c.sealAppearTime.fill(0);
    c.toneAppearTime.fill(0);

    // Immediately hide moon DOM overlays
    if (moonContainerRef.current) moonContainerRef.current.style.opacity = '0';
    if (moonInfoRef.current) moonInfoRef.current.style.opacity = '0';
    if (zodiacRef.current) zodiacRef.current.style.opacity = '0';
    setCinPhase('running');
    onAnimPhaseChangeRef.current?.('running');
  }, []);

  useImperativeHandle(ref, () => ({ startAnimation }), [startAnimation]);

  // Auto-start animation on mount
  useEffect(() => {
    const timer = setTimeout(() => startAnimation(), 300);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Hide moon overlays before first paint (opacity controlled entirely via refs)
  useLayoutEffect(() => {
    if (moonContainerRef.current) moonContainerRef.current.style.opacity = '0';
    if (moonInfoRef.current) moonInfoRef.current.style.opacity = '0';
    if (zodiacRef.current) zodiacRef.current.style.opacity = '0';
  }, []);

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

    function frame(timestamp: number) {
      if (!running || !canvas || !container) return;
      const a = animRef.current;
      const c = cinRef.current;

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
      if (!ctx || rect.width <= 0) {
        requestAnimationFrame(frame);
        return;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      // --- Idle: blank canvas, moon hidden ---
      if (c.phase === 'idle') {
        requestAnimationFrame(frame);
        return;
      }

      // --- Cinematic animation ---
      if (c.phase === 'running') {
        const elapsed = timestamp - c.startTime;

        // Angle interpolation: smoothEase over entire duration
        // Speed: 0 → peak at midpoint → 0. Cannot speed up after halfway.
        const t = Math.min(1, elapsed / CIN_DURATION);
        const eased = smoothEase(t);
        const drawInner = c.innerStart + (c.innerEnd - c.innerStart) * eased;
        const drawOuter = c.outerStart + (c.outerEnd - c.outerStart) * eased;

        // Gear fade-in (inner 200-800ms, outer 400-1000ms)
        const fadeInner = Math.min(1, Math.max(0, (elapsed - 200) / 600));
        const fadeOuter = Math.min(1, Math.max(0, (elapsed - 400) / 600));

        // Progressive reveal: seals/tones during first 55% of duration
        const revealEnd = CIN_DURATION * 0.55;
        if (elapsed < revealEnd) {
          const rp = elapsed / revealEnd;
          const tonesToShow = Math.floor(rp * 13);
          const sealsToShow = Math.floor(rp * 20);
          for (let i = 0; i < tonesToShow; i++) {
            if (!c.visibleTones[i]) { c.visibleTones[i] = true; c.toneAppearTime[i] = elapsed; }
          }
          for (let i = 0; i < sealsToShow; i++) {
            if (!c.visibleSeals[i]) { c.visibleSeals[i] = true; c.sealAppearTime[i] = elapsed; }
          }
        } else {
          for (let i = 0; i < 13; i++) {
            if (!c.visibleTones[i]) { c.visibleTones[i] = true; c.toneAppearTime[i] = elapsed; }
          }
          for (let i = 0; i < 20; i++) {
            if (!c.visibleSeals[i]) { c.visibleSeals[i] = true; c.sealAppearTime[i] = elapsed; }
          }
        }

        // Per-seal scale (pop-in: 0.5 → 1.0 over 200ms)
        const sealScales = new Array(20).fill(0);
        for (let i = 0; i < 20; i++) {
          if (c.visibleSeals[i]) {
            const dt = elapsed - c.sealAppearTime[i];
            sealScales[i] = 0.5 + 0.5 * Math.min(1, dt / 200);
          }
        }

        // Mesh zone pulse & pointer reveal
        let meshAlpha: number;
        let pointerAlpha: number;
        if (elapsed < CIN_ENGAGE_START) {
          meshAlpha = 0;
          pointerAlpha = 0;
        } else if (elapsed < CIN_ENGAGE_START + CIN_ENGAGE_DUR) {
          const et = (elapsed - CIN_ENGAGE_START) / CIN_ENGAGE_DUR;
          meshAlpha = Math.sin(et * Math.PI) * 0.3 + 0.15;
          pointerAlpha = Math.min(1, et * 2.5) * 0.7;
        } else {
          meshAlpha = 0.15;
          pointerAlpha = 0.7;
        }

        // Moon DOM opacity (fade in over 600ms)
        const moonOpacity = Math.min(1, Math.max(0, elapsed / 600));
        const moonTextOpacity = Math.min(1, Math.max(0, (elapsed - 200) / 600));
        if (moonContainerRef.current) moonContainerRef.current.style.opacity = String(moonOpacity);
        if (moonInfoRef.current) moonInfoRef.current.style.opacity = String(moonTextOpacity);
        if (zodiacRef.current) zodiacRef.current.style.opacity = String(moonTextOpacity);

        // Draw animated frame
        drawGears(ctx, rect.width, rect.height, drawOuter, drawInner,
          sealImagesRef.current, sealIndexRef.current, toneIndexRef.current, {
            fadeOuter, fadeInner,
            visibleSeals: c.visibleSeals,
            visibleTones: c.visibleTones,
            sealScales,
            meshAlpha,
            pointerAlpha,
          });

        // Check completion
        if (elapsed >= CIN_TOTAL) {
          c.phase = 'complete';
          // Sync normal animation state for seamless handoff
          a.outer = c.outerEnd;
          a.inner = c.innerEnd;
          a.targetOuter = c.outerEnd;
          a.targetInner = c.innerEnd;
          a.prevSeal = sealIndexRef.current;
          a.prevTone = toneIndexRef.current;
          // Ensure moon overlays are fully visible
          if (moonContainerRef.current) moonContainerRef.current.style.opacity = '1';
          if (moonInfoRef.current) moonInfoRef.current.style.opacity = '1';
          if (zodiacRef.current) zodiacRef.current.style.opacity = '1';
          setCinPhase('complete');
          onAnimPhaseChangeRef.current?.('complete');
        }
      } else {
        // --- Normal easing (complete phase) ---
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

        drawGears(ctx, rect.width, rect.height, a.outer, a.inner,
          sealImagesRef.current, sealIndexRef.current, toneIndexRef.current, null);
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

  // --- Drag handlers (disabled during animation) ---
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (cinRef.current.phase === 'running') return;
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

  // --- Seal tap detection (disabled during animation) ---
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (cinRef.current.phase === 'running') return;
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
        style={{ zIndex: 1, touchAction: 'none', cursor: cinPhase === 'running' ? 'default' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
      />

      {/* Centre moon — opacity controlled by animation loop via ref */}
      <div
        ref={moonContainerRef}
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
        ref={moonInfoRef}
        className="absolute text-center pointer-events-none"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, 32px)', zIndex: 3 }}
      >
        <span className="text-[9px] text-[#9ca3af]">
          {moonData.phaseName} · {Math.round(moonData.illumination)}%
        </span>
      </div>

      {/* Zodiac name above centre */}
      <div
        ref={zodiacRef}
        className="absolute text-center pointer-events-none"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -58px)', zIndex: 3 }}
      >
        {moonData.zodiacSign && (
          <span className="text-[10px] text-[#a78bfa]" style={{ textShadow: '0 0 4px #080812, 0 0 8px #080812' }}>{moonData.zodiacSign}</span>
        )}
      </div>
    </div>
  );
});

// ===================== DRAWING FUNCTIONS =====================

function drawGears(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  outerAngle: number, innerAngle: number,
  sealImages: (HTMLImageElement | null)[],
  sealIndex: number, toneIndex: number,
  anim: AnimDrawParams | null,
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
  const innerAlpha = anim ? anim.fadeInner : 1;

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
    ctx.globalAlpha = (isActive ? 0.2 : 0.08) * innerAlpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // --- Tone dot-and-bar symbols ---
  for (let i = 0; i < 13; i++) {
    if (anim && !anim.visibleTones[i]) continue;
    const a = innerAngle + i * tStep - Math.PI / 2;
    const isActive = i === toneIndex;
    const tx = cx + toneTeethR * Math.cos(a);
    const ty = cy + toneTeethR * Math.sin(a);

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(a - Math.PI / 2);  // MINUS — bars face outward
    ctx.globalAlpha = (isActive ? 1 : 0.65) * innerAlpha;
    drawRadialDotBar(ctx, i + 1, isActive, isActive ? 1.4 : 0.9);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // --- Mesh zone highlight ---
  const meshAlphaVal = anim !== null ? anim.meshAlpha : 0.15;
  if (meshAlphaVal > 0.001) {
    const meshAngle = -Math.PI / 2;
    const activeCol = SEAL_COLORS[sealIndex] === '#e0ddd6' ? '#c084fc' : SEAL_COLORS[sealIndex];

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, outerR + iconSz / 2 + 4, meshAngle - 0.12, meshAngle + 0.12);
    ctx.arc(cx, cy, innerInnerR - 4, meshAngle + 0.12, meshAngle - 0.12, true);
    ctx.closePath();
    ctx.fillStyle = activeCol;
    ctx.globalAlpha = meshAlphaVal;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // --- Pointer triangle ---
  const ptrAlpha = anim !== null ? anim.pointerAlpha : 0.7;
  if (ptrAlpha > 0.001) {
    const activeCol = SEAL_COLORS[sealIndex] === '#e0ddd6' ? '#c084fc' : SEAL_COLORS[sealIndex];
    const pY = cy - outerR - iconSz / 2 - 6;
    ctx.beginPath();
    ctx.moveTo(cx, pY);
    ctx.lineTo(cx - 5, pY - 10);
    ctx.lineTo(cx + 5, pY - 10);
    ctx.closePath();
    ctx.fillStyle = activeCol;
    ctx.globalAlpha = ptrAlpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // --- Outer gear seal icons (20 positions) ---
  const outerAlpha = anim ? anim.fadeOuter : 1;
  for (let i = 0; i < 20; i++) {
    if (anim && !anim.visibleSeals[i]) continue;
    const a = outerAngle + i * sStep - Math.PI / 2;
    const isActive = i === sealIndex;
    const sealScale = anim ? anim.sealScales[i] : 1;
    const baseSz = isActive ? iconSz * 1.12 : iconSz;
    const sz = baseSz * sealScale;
    const ix = cx + outerR * Math.cos(a);
    const iy = cy + outerR * Math.sin(a);

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
      ctx.globalAlpha = (isActive ? 1 : 0.7) * outerAlpha;
      ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
    } else {
      // Placeholder colour fill while loading
      ctx.globalAlpha = (isActive ? 0.5 : 0.35) * outerAlpha;
      ctx.fillStyle = SEALS[i].bgHex;
      ctx.fill();
    }
    ctx.restore();

    // Active seal border highlight
    if (isActive && outerAlpha > 0.5) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = outerAlpha;
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

  const col = active ? '#ffffff' : 'rgba(255,255,255,0.7)';
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
