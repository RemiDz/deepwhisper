'use client';

import type { Kin } from '@/lib/dreamspell/types';
import { getWavespellSeal, getWavespellPosition } from '@/lib/dreamspell/wavespell';

interface MicroDashboardProps {
  kin: Kin;
}

export default function MicroDashboard({ kin }: MicroDashboardProps) {
  const wavespellSeal = getWavespellSeal(kin.number);
  const wavespellPos = getWavespellPosition(kin.number);
  const wavespellProgress = wavespellPos / 13;

  const castleStart = kin.castle.kinRange[0];
  const castleEnd = kin.castle.kinRange[1];
  const castleProgress = (kin.number - castleStart + 1) / (castleEnd - castleStart + 1);

  const spinProgress = kin.number / 260;

  return (
    <div className="grid grid-cols-3 gap-3 px-4">
      <ProgressBar
        label={`${wavespellSeal.name} WS`}
        value={wavespellProgress}
        sublabel={`${wavespellPos}/13`}
        colour="var(--purple)"
      />
      <ProgressBar
        label={kin.castle.quality}
        value={castleProgress}
        sublabel={`Kin ${kin.number - castleStart + 1}/52`}
        colour={kin.castle.colour === 'Green' ? '#22c55e' : `var(--seal-${kin.castle.colour.toLowerCase()})`}
      />
      <ProgressBar
        label="Spin"
        value={spinProgress}
        sublabel={`${kin.number}/260`}
        colour="var(--text-secondary)"
      />
    </div>
  );
}

function ProgressBar({ label, value, sublabel, colour }: { label: string; value: number; sublabel: string; colour: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-secondary)] truncate">{label}</span>
        <span className="text-[9px] text-[var(--text-tertiary)] tabular-nums">{sublabel}</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(value * 100, 2)}%`, background: colour }}
        />
      </div>
    </div>
  );
}
