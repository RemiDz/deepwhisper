'use client';

import { useState, useEffect } from 'react';
import type { MoonData } from '@/lib/dreamspell/types';

interface MoonPhaseProps {
  moonData: MoonData;
  size?: number;
  zodiacSign?: string;
}

const ZODIAC_SYMBOLS: Record<string, string> = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

const DEFAULT_PHASE = 0;

export default function MoonPhase({ moonData, size = 86, zodiacSign }: MoonPhaseProps) {
  const [phase, setPhase] = useState(DEFAULT_PHASE);

  useEffect(() => {
    setPhase(moonData.phase);
  }, [moonData.phase]);

  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  // Build the lit portion path
  const litPath = buildLitPath(cx, cy, r, phase);

  // Append text variation selector to force monochrome text rendering (no emoji background)
  const zodiacSymbol = zodiacSign ? ((ZODIAC_SYMBOLS[zodiacSign] || '') + '\uFE0E') : '';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <clipPath id="moon-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Moon base — shadow side with slight earthshine luminosity */}
      <circle cx={cx} cy={cy} r={r} fill="#080812" />

      {/* Lit portion */}
      {litPath && (
        <path d={litPath} fill="#e2ded4" clipPath="url(#moon-clip)" />
      )}

      {/* Rim */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(200,196,184,0.12)" strokeWidth={0.8} />

      {/* Zodiac symbol — light purple glyph with dark outline for contrast */}
      {zodiacSymbol && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={30}
          fontFamily="Georgia, 'Times New Roman', serif"
          fill="#c084fc"
          stroke="#080812"
          strokeWidth={2}
          paintOrder="stroke"
          opacity={0.85}
          pointerEvents="none"
        >
          {zodiacSymbol}
        </text>
      )}
    </svg>
  );
}

/**
 * Build SVG path for the illuminated portion of the moon.
 * phase: 0 = new, 90 = first quarter, 180 = full, 270 = last quarter
 */
function buildLitPath(cx: number, cy: number, r: number, phase: number): string | null {
  // Handle edge cases
  if (phase < 2 || phase > 358) return null; // new moon — no light
  if (phase > 178 && phase < 182) {
    // Full moon — full circle
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
  }

  const isWaxing = phase < 180;
  const phaseRad = phase * Math.PI / 180;
  const tX = Math.max(r * Math.abs(Math.cos(phaseRad)), 0.01);

  const top = `${cx} ${cy - r}`;
  const bottom = `${cx} ${cy + r}`;

  if (isWaxing) {
    // Lit on right
    const limbSweep = 1; // clockwise semicircle
    const termSweep = phase < 90 ? 0 : 1;
    return `M ${top} A ${r} ${r} 0 0 ${limbSweep} ${bottom} A ${tX} ${r} 0 0 ${termSweep} ${top} Z`;
  } else {
    // Lit on left
    const limbSweep = 0; // counterclockwise semicircle
    const termSweep = phase < 270 ? 0 : 1;
    return `M ${top} A ${r} ${r} 0 0 ${limbSweep} ${bottom} A ${tX} ${r} 0 0 ${termSweep} ${top} Z`;
  }
}
