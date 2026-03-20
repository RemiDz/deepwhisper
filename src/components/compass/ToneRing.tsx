'use client';

import { TONES } from '@/lib/dreamspell/tones';

interface ToneRingProps {
  activeTone: number; // 1-13
  cx: number;
  cy: number;
  radius: number;
}

/**
 * Render Dreamspell bar-dot tone notation.
 * Dots (1) and bars (5): Tone 1 = 1 dot, Tone 5 = 1 bar, Tone 6 = 1 bar + 1 dot, etc.
 * Tone 13 = 2 bars + 3 dots.
 */
function ToneNotation({ tone, x, y, size, active }: { tone: number; x: number; y: number; size: number; active: boolean }) {
  const bars = Math.floor(tone / 5);
  const dots = tone % 5;
  const colour = active ? 'var(--purple)' : 'rgba(255,255,255,0.15)';
  const dotR = size * 0.12;
  const barW = size * 0.7;
  const barH = size * 0.1;
  const spacing = size * 0.22;

  const totalHeight = bars * spacing + dots * spacing;
  const startY = y + totalHeight / 2;

  const elements: React.ReactNode[] = [];
  let currentY = startY;

  // Draw dots first (top), then bars (bottom)
  for (let d = 0; d < dots; d++) {
    elements.push(
      <circle key={`d${d}`} cx={x} cy={currentY} r={dotR} fill={colour} />
    );
    currentY -= spacing;
  }
  for (let b = 0; b < bars; b++) {
    elements.push(
      <rect key={`b${b}`} x={x - barW / 2} y={currentY - barH / 2} width={barW} height={barH} rx={barH / 2} fill={colour} />
    );
    currentY -= spacing;
  }

  return <g>{elements}</g>;
}

export default function ToneRing({ activeTone, cx, cy, radius }: ToneRingProps) {
  return (
    <g>
      {TONES.map((tone, i) => {
        const angle = ((i / 13) * 360 - 90) * (Math.PI / 180);
        const tx = cx + Math.cos(angle) * radius;
        const ty = cy + Math.sin(angle) * radius;
        const active = tone.number === activeTone;

        return (
          <g key={tone.number}>
            {active && (
              <circle cx={tx} cy={ty} r={12} fill="var(--purple-dim)" className="animate-glow" style={{ color: 'var(--purple)' }} />
            )}
            <ToneNotation tone={tone.number} x={tx} y={ty} size={22} active={active} />
          </g>
        );
      })}
    </g>
  );
}
