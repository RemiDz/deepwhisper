'use client';

import type { MoonData } from '@/lib/dreamspell/types';

interface MoonPhaseProps {
  moonData: MoonData;
  size?: number;
  sealGlyph?: React.ReactNode;
}

export default function MoonPhase({ moonData, size = 86, sealGlyph }: MoonPhaseProps) {
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const phase = moonData.phase;

  // Build the lit portion path
  const litPath = buildLitPath(cx, cy, r, phase);

  // Determine highlight position (on lit side)
  const isWaxing = phase < 180;
  const hlX = isWaxing ? cx + r * 0.22 : cx - r * 0.22;

  // Maria (dark spots on lit side) — large subtle circles
  const maria = [
    { x: cx - r * 0.15, y: cy - r * 0.05, mr: r * 0.18 },
    { x: cx + r * 0.22, y: cy + r * 0.25, mr: r * 0.22 },
    { x: cx - r * 0.3, y: cy + r * 0.32, mr: r * 0.12 },
  ];

  // Craters — scattered across entire surface
  const craters = [
    { x: cx - r * 0.28, y: cy - r * 0.2, cr: r * 0.08 },
    { x: cx + r * 0.15, y: cy + r * 0.35, cr: r * 0.12 },
    { x: cx - r * 0.05, y: cy + r * 0.1, cr: r * 0.05 },
    { x: cx + r * 0.35, y: cy - r * 0.25, cr: r * 0.07 },
    { x: cx - r * 0.4, y: cy + r * 0.4, cr: r * 0.04 },
    { x: cx + r * 0.08, y: cy - r * 0.45, cr: r * 0.05 },
    { x: cx - r * 0.2, y: cy + r * 0.48, cr: r * 0.06 },
    { x: cx + r * 0.42, y: cy + r * 0.08, cr: r * 0.035 },
    { x: cx - r * 0.48, y: cy - r * 0.1, cr: r * 0.04 },
    { x: cx + r * 0.3, y: cy - r * 0.4, cr: r * 0.05 },
    { x: cx - r * 0.1, y: cy - r * 0.38, cr: r * 0.07 },
    { x: cx + r * 0.05, y: cy + r * 0.45, cr: r * 0.04 },
  ];

  const glyphSize = Math.round(size * 0.5);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <clipPath id="moon-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Moon base — shadow side with slight earthshine luminosity */}
      <circle cx={cx} cy={cy} r={r} fill="#0e0e1e" />

      {/* Lit portion */}
      {litPath && (
        <path d={litPath} fill="#e2ded4" clipPath="url(#moon-clip)" />
      )}

      {/* Maria (dark patches on lit area) */}
      {maria.map((m, i) => (
        <circle key={`m${i}`} cx={m.x} cy={m.y} r={m.mr} fill="rgba(160,155,140,0.12)" clipPath="url(#moon-clip)" />
      ))}

      {/* Highlight on lit side */}
      <ellipse cx={hlX} cy={cy - r * 0.15} rx={r * 0.25} ry={r * 0.4} fill="rgba(240,236,225,0.15)" clipPath="url(#moon-clip)" />

      {/* Craters on lit side (darker) */}
      {craters.map((c, i) => (
        <circle key={`cl${i}`} cx={c.x} cy={c.y} r={c.cr} fill="rgba(160,155,140,0.1)" stroke="rgba(140,135,120,0.08)" strokeWidth={0.3} clipPath="url(#moon-clip)" />
      ))}

      {/* Craters on dark side (very subtle) */}
      {craters.map((c, i) => (
        <circle key={`cd${i}`} cx={c.x} cy={c.y} r={c.cr * 0.8} fill="rgba(180,175,160,0.04)" clipPath="url(#moon-clip)" />
      ))}

      {/* Earthshine — faint glow on shadow edge */}
      <circle cx={cx} cy={cy} r={r - 0.5} fill="none" stroke="rgba(180,175,160,0.06)" strokeWidth={1} clipPath="url(#moon-clip)" />

      {/* Rim */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(200,196,184,0.12)" strokeWidth={0.8} />

      {/* Seal glyph overlay — opacity breathing only */}
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
