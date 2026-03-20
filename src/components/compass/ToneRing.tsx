'use client';

import { TONES } from '@/lib/dreamspell/tones';

interface ToneRingProps {
  activeTone: number; // 1-13
  cx: number;
  cy: number;
  radius: number;
}

/**
 * Bar-dot Mayan notation for tones 1-13.
 * Dots (circles) for 1-4, Bar (line) for 5.
 * 6 = bar + 1 dot, 13 = 2 bars + 3 dots.
 */
function ToneNotation({ tone, x, y, active }: { tone: number; x: number; y: number; active: boolean }) {
  const bars = Math.floor(tone / 5);
  const dots = tone % 5;
  const colour = active ? 'var(--purple)' : 'rgba(192,132,252,0.13)';
  const dotR = 2;
  const barW = 10;
  const barH = 2;
  const gap = 5;

  // Stack bottom-up: dots at top, bars below
  const totalItems = bars + dots;
  const totalH = totalItems * gap;
  let cy0 = y + totalH / 2;

  const elements: React.ReactNode[] = [];

  for (let d = 0; d < dots; d++) {
    elements.push(<circle key={`d${d}`} cx={x} cy={cy0} r={dotR} fill={colour} />);
    cy0 -= gap;
  }
  for (let b = 0; b < bars; b++) {
    elements.push(
      <rect key={`b${b}`} x={x - barW / 2} y={cy0 - barH / 2} width={barW} height={barH} rx={1} fill={colour} />
    );
    cy0 -= gap;
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
            {/* Glow behind active tone */}
            {active && (
              <circle
                cx={tx}
                cy={ty}
                r={11}
                fill="rgba(192,132,252,0.12)"
                className="animate-glow"
                style={{ color: 'var(--purple)' }}
              />
            )}
            <ToneNotation tone={tone.number} x={tx} y={ty} active={active} />
          </g>
        );
      })}
    </g>
  );
}
