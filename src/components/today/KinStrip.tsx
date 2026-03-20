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

      {/* Tone keywords — muted, smallest */}
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
