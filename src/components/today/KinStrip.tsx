'use client';

import type { Kin } from '@/lib/dreamspell/types';
import type { MoonData } from '@/lib/dreamspell/types';

interface KinStripProps {
  kin: Kin;
  moonData: MoonData;
}

export default function KinStrip({ kin, moonData }: KinStripProps) {
  return (
    <div className="text-center space-y-1.5">
      {/* Kin number + title in a horizontal row */}
      <div className="flex items-baseline justify-center gap-2.5">
        <span className="text-[34px] font-bold tabular-nums leading-none text-[var(--text-primary)]">
          {kin.number}
        </span>
        <div className="text-left">
          <div className="text-[15px] font-medium leading-tight" style={{ color: kin.seal.colourHex }}>
            {kin.title}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] leading-tight">
            {kin.tone.action} · {kin.tone.power} · {kin.tone.essence}
          </div>
        </div>
        {kin.isGAP && (
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[var(--purple-dim)] text-[var(--purple)] self-center">
            GAP
          </span>
        )}
      </div>

      {/* Info pills */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
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
