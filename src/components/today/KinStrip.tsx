'use client';

import type { Kin } from '@/lib/dreamspell/types';
import type { MoonData } from '@/lib/dreamspell/types';

interface KinStripProps {
  kin: Kin;
  moonData: MoonData;
}

export default function KinStrip({ kin, moonData }: KinStripProps) {
  return (
    <div className="text-center space-y-2">
      {/* Kin number + title */}
      <div>
        <div className="flex items-center justify-center gap-2">
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color: kin.seal.colourHex }}
          >
            {kin.number}
          </span>
          {kin.isGAP && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--purple-dim)] text-[var(--purple)]">
              GAP
            </span>
          )}
        </div>
        <h2 className="text-lg font-medium mt-0.5" style={{ color: kin.seal.colourHex }}>
          {kin.title}
        </h2>
      </div>

      {/* Info pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Pill label={moonData.phaseName} />
        <Pill label={`${moonData.zodiacSign} ${moonData.zodiacDegree}°`} />
        <Pill label={`${moonData.illumination}% lit`} />
      </div>
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full border text-[var(--text-secondary)]"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}>
      {label}
    </span>
  );
}
