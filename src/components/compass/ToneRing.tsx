'use client';

import { TONES } from '@/lib/dreamspell/tones';

interface ToneRingProps {
  activeTone: number; // 1-13
  cx: number;
  cy: number;
  radius: number;
}

/**
 * Tone notation:
 * 1-3: dot notation (1, 2, 3 dots)
 * 4-5: bar notation (1 bar, 1 bar + 1 dot for 5... actually 4=4 dots, 5=1 bar)
 * Per spec: tones 1-3 dots, 4-5 bars, 6-13 numbers.
 */
function ToneSymbol({ tone, x, y, active }: { tone: number; x: number; y: number; active: boolean }) {
  const colour = active ? '#c084fc' : 'rgba(192,132,252,0.25)';

  if (tone <= 3) {
    // Dots
    const dotR = 1.8;
    const gap = 4.5;
    const startY = y + ((tone - 1) * gap) / 2;
    return (
      <g>
        {Array.from({ length: tone }, (_, i) => (
          <circle key={i} cx={x} cy={startY - i * gap} r={dotR} fill={colour} />
        ))}
      </g>
    );
  }

  if (tone <= 5) {
    // Bars (4 = 4 dots arranged 2x2, but spec says bar notation)
    // 4 = 1 bar (representing 4 as "one bar minus one")... actually let's do:
    // 4 = 4 dots, 5 = 1 bar per traditional Mayan notation
    if (tone === 4) {
      const dotR = 1.5;
      return (
        <g>
          <circle cx={x - 2.5} cy={y - 2.5} r={dotR} fill={colour} />
          <circle cx={x + 2.5} cy={y - 2.5} r={dotR} fill={colour} />
          <circle cx={x - 2.5} cy={y + 2.5} r={dotR} fill={colour} />
          <circle cx={x + 2.5} cy={y + 2.5} r={dotR} fill={colour} />
        </g>
      );
    }
    // tone 5 = 1 bar
    return (
      <rect x={x - 5} y={y - 1} width={10} height={2} rx={1} fill={colour} />
    );
  }

  // Tones 6-13: display as numbers
  return (
    <text
      x={x}
      y={y + 1}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={8}
      fontWeight={active ? 700 : 400}
      fill={colour}
    >
      {tone}
    </text>
  );
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
            {/* Static glow behind active tone — no animation */}
            {active && (
              <circle
                cx={tx}
                cy={ty}
                r={10}
                fill="rgba(192,132,252,0.15)"
              />
            )}
            <ToneSymbol tone={tone.number} x={tx} y={ty} active={active} />
          </g>
        );
      })}
    </g>
  );
}
