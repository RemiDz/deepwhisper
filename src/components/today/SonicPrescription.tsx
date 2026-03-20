'use client';

import { useState } from 'react';
import { getSealSound, getToneSound, getBestTimeOfDay } from '@/lib/dreamspell/soundHealing';
import type { Kin } from '@/lib/dreamspell/types';

interface SonicPrescriptionProps {
  kin: Kin;
}

export default function SonicPrescription({ kin }: SonicPrescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const sealSound = getSealSound(kin.seal.number);
  const toneSound = getToneSound(kin.tone.number);

  return (
    <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left py-1"
      >
        <span className="text-sm">♪</span>
        <span className="text-[11px] text-[var(--text-secondary)]">Sonic prescription</span>
        <span className="text-[10px] text-[var(--text-tertiary)] ml-auto">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="mt-2 space-y-1.5 text-[11px]">
          <Row label="Frequency" value={`${sealSound.frequency} Hz`} />
          <Row label="Note" value={sealSound.note} />
          <Row label="Chakra" value={sealSound.chakra} colour={sealSound.chakraColour} />
          <Row label="Quality" value={sealSound.quality} />
          <Row label="Instruments" value={sealSound.instruments.join(', ')} />
          <Row label="Duration" value={`${sealSound.duration} min`} />
          <Row label="Body focus" value={sealSound.bodyArea} />
          <Row label="Best time" value={getBestTimeOfDay(kin.seal.direction)} />
          <div className="h-px my-1" style={{ background: 'var(--border-subtle)' }} />
          <Row label="Tone interval" value={`${toneSound.interval} (${toneSound.ratio})`} />
          <Row label="Bowl note" value={toneSound.bowlNote} />
          <p className="text-[10px] text-[var(--purple)] mt-2">
            Combine {sealSound.frequency} Hz with the {toneSound.interval} ({toneSound.ratio}) for your galactic resonance.
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, colour }: { label: string; value: string; colour?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--text-tertiary)]">{label}</span>
      <span className="text-[var(--text-primary)]" style={colour ? { color: colour } : undefined}>{value}</span>
    </div>
  );
}
