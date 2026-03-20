'use client';

import type { MoonData } from '@/lib/dreamspell/types';

interface MoonPhaseProps {
  moonData: MoonData;
  size?: number;
  sealGlyph?: React.ReactNode;
}

export default function MoonPhase({ moonData, size = 76, sealGlyph }: MoonPhaseProps) {
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const phase = moonData.phase;
  const isWaxing = phase < 180;
  const phaseAngle = (phase % 180) * (Math.PI / 180);
  const terminatorX = Math.cos(phaseAngle) * r;
  const semiArcFlag = isWaxing ? '0' : '1';

  const moonPath = `
    M ${cx} ${cy - r}
    A ${r} ${r} 0 0 ${semiArcFlag} ${cx} ${cy + r}
    A ${Math.abs(terminatorX)} ${r} 0 0 ${phase > 90 && phase < 270 ? (isWaxing ? '0' : '1') : (isWaxing ? '1' : '0')} ${cx} ${cy - r}
    Z
  `;

  // Crater positions for texture
  const craters = [
    { x: cx - r * 0.28, y: cy - r * 0.18, cr: r * 0.11 },
    { x: cx + r * 0.18, y: cy + r * 0.32, cr: r * 0.16 },
    { x: cx - r * 0.08, y: cy + r * 0.12, cr: r * 0.07 },
    { x: cx + r * 0.32, y: cy - r * 0.28, cr: r * 0.09 },
    { x: cx - r * 0.38, y: cy + r * 0.38, cr: r * 0.05 },
    { x: cx + r * 0.05, y: cy - r * 0.42, cr: r * 0.06 },
    { x: cx - r * 0.2, y: cy + r * 0.45, cr: r * 0.08 },
    { x: cx + r * 0.4, y: cy + r * 0.1, cr: r * 0.04 },
  ];

  // Highlight ellipse position (on lit side)
  const highlightX = isWaxing ? cx + r * 0.2 : cx - r * 0.2;

  const glyphSize = Math.round(size * 0.44);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Moon base (shadow) */}
      <circle cx={cx} cy={cy} r={r} fill="#14142a" />

      {/* Lit portion */}
      <path d={moonPath} fill="#dedad0" opacity={0.92} />

      {/* Subtle highlight on lit side */}
      <ellipse cx={highlightX} cy={cy - r * 0.1} rx={r * 0.3} ry={r * 0.5} fill="#e8e4d8" opacity={0.1} />

      {/* Crater texture */}
      {craters.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={c.cr} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={0.4} />
      ))}

      {/* Rim */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(200,196,184,0.1)" strokeWidth={0.7} />

      {/* Seal overlay — opacity pulse only, NO position animation */}
      {sealGlyph && (
        <foreignObject
          x={cx - glyphSize / 2}
          y={cy - glyphSize / 2}
          width={glyphSize}
          height={glyphSize}
          className="animate-breathe"
        >
          <div className="flex items-center justify-center w-full h-full">
            {sealGlyph}
          </div>
        </foreignObject>
      )}
    </svg>
  );
}
