'use client';

import type { Kin } from '@/lib/dreamspell/types';

interface MilestoneCardProps {
  kin: Kin;
}

export default function MilestoneCard({ kin }: MilestoneCardProps) {
  const milestones: { label: string; daysAway: number }[] = [];

  // Check if approaching wavespell boundary
  const posInWavespell = ((kin.number - 1) % 13) + 1;
  if (posInWavespell >= 11) {
    milestones.push({ label: 'New Wavespell', daysAway: 14 - posInWavespell });
  }

  // Check if approaching castle boundary
  const castleEnd = kin.castle.kinRange[1];
  const daysToNewCastle = castleEnd - kin.number + 1;
  if (daysToNewCastle <= 5 && daysToNewCastle > 0) {
    milestones.push({ label: 'New Castle', daysAway: daysToNewCastle });
  }

  // Check if approaching spin reset
  const daysToSpinReset = 260 - kin.number + 1;
  if (daysToSpinReset <= 5 && daysToSpinReset > 0) {
    milestones.push({ label: 'Galactic Spin Reset', daysAway: daysToSpinReset });
  }

  if (milestones.length === 0) return null;

  return (
    <div className="mx-4 px-3 py-2 rounded-lg border"
         style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}>
      {milestones.map((m, i) => (
        <div key={i} className="flex items-center justify-between text-xs">
          <span className="text-[var(--purple)]">{m.label}</span>
          <span className="text-[var(--text-tertiary)]">
            {m.daysAway === 1 ? 'Tomorrow' : `in ${m.daysAway} days`}
          </span>
        </div>
      ))}
    </div>
  );
}
