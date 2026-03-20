'use client';

import type { MoonData } from '@/lib/dreamspell/types';

interface MoonPhaseProps {
  moonData: MoonData;
  size?: number;
  sealGlyph?: React.ReactNode;
}

export default function MoonPhase({ moonData, size = 100, sealGlyph }: MoonPhaseProps) {
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  // Calculate terminator for moon phase rendering
  // phase: 0 = new, 90 = first quarter, 180 = full, 270 = last quarter
  const phase = moonData.phase;
  const illuminationFraction = moonData.illumination / 100;

  // Determine which side is lit
  const isWaxing = phase < 180;

  // Calculate the terminator ellipse
  // The terminator curve is an ellipse whose x-radius varies with phase
  const phaseAngle = (phase % 180) * (Math.PI / 180);
  const terminatorX = Math.cos(phaseAngle) * r;

  // Build the moon path
  // Light side is a semicircle, terminator is an ellipse
  const lightSide = isWaxing ? 'right' : 'left';

  // Semicircle arc for the lit edge
  const semiArcFlag = lightSide === 'right' ? '0' : '1';

  const moonPath = `
    M ${cx} ${cy - r}
    A ${r} ${r} 0 0 ${semiArcFlag} ${cx} ${cy + r}
    A ${Math.abs(terminatorX)} ${r} 0 0 ${phase > 90 && phase < 270 ? (isWaxing ? '0' : '1') : (isWaxing ? '1' : '0')} ${cx} ${cy - r}
    Z
  `;

  // Crater positions (subtle texture)
  const craters = [
    { cx: cx - r * 0.3, cy: cy - r * 0.2, r: r * 0.12 },
    { cx: cx + r * 0.15, cy: cy + r * 0.35, r: r * 0.18 },
    { cx: cx - r * 0.1, cy: cy + r * 0.15, r: r * 0.08 },
    { cx: cx + r * 0.35, cy: cy - r * 0.3, r: r * 0.1 },
    { cx: cx - r * 0.4, cy: cy + r * 0.4, r: r * 0.06 },
  ];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Moon base (dark) */}
      <circle cx={cx} cy={cy} r={r} fill="#1a1a2e" />

      {/* Lit portion */}
      <path d={moonPath} fill="#d4d0c8" opacity={0.9} />

      {/* Crater texture */}
      {craters.map((crater, i) => (
        <circle
          key={i}
          cx={crater.cx}
          cy={crater.cy}
          r={crater.r}
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth={0.5}
        />
      ))}

      {/* Rim */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

      {/* Seal glyph overlay in centre */}
      {sealGlyph && (
        <g opacity={0.4} className="animate-pulse-gentle">
          <foreignObject x={cx - 16} y={cy - 16} width={32} height={32}>
            <div className="flex items-center justify-center w-full h-full">
              {sealGlyph}
            </div>
          </foreignObject>
        </g>
      )}
    </svg>
  );
}
