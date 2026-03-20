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
 * Each dot = 1, each bar = 5. Dots above bars.
 *
 * 1=●  2=●●  3=●●●  4=●●●●  5=▬
 * 6=● over ▬   7=●● over ▬   8=●●● over ▬   9=●●●● over ▬
 * 10=▬▬  11=● over ▬▬  12=●● over ▬▬  13=●●● over ▬▬
 */
function ToneGlyph({ tone, x, y, active }: { tone: number; x: number; y: number; active: boolean }) {
  const colour = active ? '#c084fc' : 'rgba(192,132,252,0.25)';

  const bars = Math.floor(tone / 5);  // 0,0,0,0,1,1,1,1,1,2,2,2,2
  const dots = tone - bars * 5;        // 1,2,3,4,0,1,2,3,4,0,1,2,3

  const dotR = 2;
  const dotSpacing = 5;   // horizontal gap between dot centres
  const barW = 14;
  const barH = 3;
  const barGap = 5;       // vertical gap between bar centres
  const sectionGap = 4;   // vertical gap between dot row and first bar

  // Calculate total height to centre the glyph vertically on (x, y)
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
        <circle key={`d${d}`} cx={dotStartX + d * dotSpacing} cy={dotCY} r={dotR} fill={colour} />
      );
    }
  }

  // Bars (bottom) — stacked vertically, centred on x
  if (bars > 0) {
    const firstBarY = topY + dotsRowH + gapH;
    for (let b = 0; b < bars; b++) {
      const barY = firstBarY + b * barGap;
      elements.push(
        <rect key={`b${b}`} x={x - barW / 2} y={barY} width={barW} height={barH} rx={1.5} fill={colour} />
      );
    }
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
          <g key={tone.number} opacity={active ? 1 : 0.25}>
            {/* Subtle glow behind active tone */}
            {active && (
              <circle
                cx={tx}
                cy={ty}
                r={12}
                fill="rgba(192,132,252,0.15)"
                filter="url(#tone-glow)"
              />
            )}
            <ToneGlyph tone={tone.number} x={tx} y={ty} active={active} />
          </g>
        );
      })}
      {/* SVG filter for active tone glow */}
      <defs>
        <filter id="tone-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>
    </g>
  );
}
