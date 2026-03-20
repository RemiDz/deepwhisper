'use client';

import { TONES } from '@/lib/dreamspell/tones';

interface ToneRingProps {
  activeTone: number; // 1-13
  cx: number;
  cy: number;
  radius: number;
}

/**
 * Mayan bar-dot notation for tones 1–13.
 * bars = floor(tone / 5), dots = tone % 5.
 * Dots above bars. All elements are solid-filled circles/rects.
 */
function ToneGlyph({ tone, x, y }: { tone: number; x: number; y: number }) {
  const bars = Math.floor(tone / 5);
  const dots = tone % 5;

  const dotR = 2.5;
  const dotSpacing = 6;
  const barW = 16;
  const barH = 3.5;
  const barGap = 5;
  const sectionGap = 5;

  const dotsRowH = dots > 0 ? dotR * 2 : 0;
  const barsH = bars > 0 ? (bars - 1) * barGap + barH : 0;
  const gapH = (dots > 0 && bars > 0) ? sectionGap : 0;
  const totalH = dotsRowH + gapH + barsH;
  const topY = y - totalH / 2;

  const elements: React.ReactNode[] = [];

  // Dots row (top) — horizontal, centred on x
  if (dots > 0) {
    const dotsWidth = (dots - 1) * dotSpacing;
    const dotStartX = x - dotsWidth / 2;
    const dotCY = topY + dotR;
    for (let d = 0; d < dots; d++) {
      elements.push(
        <circle key={`d${d}`} cx={dotStartX + d * dotSpacing} cy={dotCY} r={dotR} fill="#c084fc" />
      );
    }
  }

  // Bars (bottom) — stacked vertically, centred on x
  if (bars > 0) {
    const firstBarY = topY + dotsRowH + gapH;
    for (let b = 0; b < bars; b++) {
      const barY = firstBarY + b * barGap;
      elements.push(
        <rect key={`b${b}`} x={x - barW / 2} y={barY} width={barW} height={barH} rx={1.5} fill="#c084fc" />
      );
    }
  }

  return <g>{elements}</g>;
}

export default function ToneRing({ activeTone, cx, cy, radius }: ToneRingProps) {
  return (
    <g>
      {TONES.map((tone, i) => {
        const angle = ((i / 13) * Math.PI * 2) - Math.PI / 2;
        const tx = cx + Math.cos(angle) * radius;
        const ty = cy + Math.sin(angle) * radius;
        const active = tone.number === activeTone;

        return (
          <g key={tone.number} opacity={active ? 1.0 : 0.5}>
            {/* Glow behind active tone */}
            {active && (
              <circle cx={tx} cy={ty} r={14} fill="rgba(192,132,252,0.2)" />
            )}
            <ToneGlyph tone={tone.number} x={tx} y={ty} />
            {/* Drop-shadow glow for active */}
            {active && (
              <g style={{ filter: 'drop-shadow(0 0 6px rgba(192,132,252,0.7))' }}>
                <ToneGlyph tone={tone.number} x={tx} y={ty} />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}
