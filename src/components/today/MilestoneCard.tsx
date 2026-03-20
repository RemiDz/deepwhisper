'use client';

import type { Kin } from '@/lib/dreamspell/types';

interface MilestoneCardProps {
  kin: Kin;
}

export default function MilestoneCard({ kin }: MilestoneCardProps) {
  const milestones: { label: string; daysAway: number }[] = [];

  const posInWavespell = ((kin.number - 1) % 13) + 1;
  if (posInWavespell >= 11) {
    milestones.push({ label: 'New Wavespell', daysAway: 14 - posInWavespell });
  }

  const castleEnd = kin.castle.kinRange[1];
  const daysToNewCastle = castleEnd - kin.number + 1;
  if (daysToNewCastle <= 3 && daysToNewCastle > 0) {
    milestones.push({ label: 'New Castle', daysAway: daysToNewCastle });
  }

  const daysToSpinReset = 260 - kin.number + 1;
  if (daysToSpinReset <= 3 && daysToSpinReset > 0) {
    milestones.push({ label: 'Galactic Spin Reset', daysAway: daysToSpinReset });
  }

  if (milestones.length === 0) return null;

  return (
    <div
      className="mx-4 px-3 py-2 rounded-lg"
      style={{
        border: '0.5px solid rgba(234,179,8,0.2)',
        background: 'rgba(234,179,8,0.03)',
      }}
    >
      <div className="text-[8px] font-semibold tracking-[0.1em] text-[var(--seal-yellow)] mb-1">MILESTONE</div>
      {milestones.map((m, i) => (
        <div key={i} className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--text-secondary)]">{m.label}</span>
          <span className="text-[var(--text-tertiary)]">
            {m.daysAway === 1 ? 'Tomorrow' : `in ${m.daysAway} days`}
          </span>
        </div>
      ))}
    </div>
  );
}
