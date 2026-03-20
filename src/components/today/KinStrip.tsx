'use client';

import type { Kin } from '@/lib/dreamspell/types';
import type { MoonData } from '@/lib/dreamspell/types';

interface KinStripProps {
  kin: Kin;
  moonData: MoonData;
}

export default function KinStrip({ kin, moonData }: KinStripProps) {
  return (
    <div className="text-center space-y-1 overflow-visible w-full px-4">
      {/* Kin number — large, bold, separate line */}
      <div className="text-[32px] font-bold tabular-nums leading-none text-white">
        {kin.number}
      </div>

      {/* Full title — seal colour, separate line */}
      <div className="text-[17px] font-semibold leading-tight" style={{ color: kin.seal.colourHex }}>
        {kin.title}
        {kin.isGAP && (
          <span className="ml-2 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[var(--purple-dim)] text-[var(--purple)] align-middle">
            GAP
          </span>
        )}
      </div>

      {/* Tone — bar-dot glyph + name + keywords */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
        <ToneBarDot tone={kin.tone.number} />
        <span>Tone {kin.tone.number} · {kin.tone.name}</span>
      </div>
      <div className="text-[11px] text-[var(--text-secondary)]">
        {kin.tone.action} · {kin.tone.power} · {kin.tone.essence}
      </div>

      {/* Info pills */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap pt-0.5">
        <Pill label={moonData.zodiacSign} colour="var(--seal-blue)" />
        <Pill label={moonData.phaseName} />
        <Pill label={`${moonData.illumination}%`} />
      </div>
    </div>
  );
}

function Pill({ label, colour }: { label: string; colour?: string }) {
  return (
    <span
      className="text-[10px] px-2.5 py-[3px] rounded-[10px]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '0.5px solid rgba(255,255,255,0.06)',
        color: colour ?? 'var(--text-secondary)',
      }}
    >
      {label}
    </span>
  );
}

/** Inline Mayan bar-dot glyph for a tone (1-13), rendered as a small SVG. */
function ToneBarDot({ tone }: { tone: number }) {
  const bars = Math.floor(tone / 5);
  const dots = tone % 5;
  const colour = '#c084fc';

  const dotR = 2;
  const dotSpacing = 5;
  const barW = 14;
  const barH = 3;
  const barGap = 4.5;
  const sectionGap = 3.5;

  const dotsRowH = dots > 0 ? dotR * 2 : 0;
  const barsH = bars > 0 ? (bars - 1) * barGap + barH : 0;
  const gapH = dots > 0 && bars > 0 ? sectionGap : 0;
  const totalH = dotsRowH + gapH + barsH;

  const dotsWidth = dots > 0 ? (dots - 1) * dotSpacing + dotR * 2 : 0;
  const svgW = Math.max(barW, dotsWidth) + 2;
  const svgH = Math.max(totalH, 4) + 2;
  const midX = svgW / 2;

  const elements: React.ReactNode[] = [];

  // Dots row (top)
  if (dots > 0) {
    const rowW = (dots - 1) * dotSpacing;
    const startX = midX - rowW / 2;
    const dotCY = 1 + dotR;
    for (let d = 0; d < dots; d++) {
      elements.push(<circle key={`d${d}`} cx={startX + d * dotSpacing} cy={dotCY} r={dotR} fill={colour} />);
    }
  }

  // Bars (bottom)
  if (bars > 0) {
    const firstBarY = 1 + dotsRowH + gapH;
    for (let b = 0; b < bars; b++) {
      const barY = firstBarY + b * barGap;
      elements.push(<rect key={`b${b}`} x={midX - barW / 2} y={barY} width={barW} height={barH} rx={1.5} fill={colour} />);
    }
  }

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="inline-block align-middle">
      {elements}
    </svg>
  );
}
