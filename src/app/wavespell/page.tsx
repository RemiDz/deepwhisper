'use client';

import { useMemo } from 'react';
import { getKinForDateFull, buildKin } from '@/lib/dreamspell/kin';
import { TONES } from '@/lib/dreamspell/tones';
import { getWavespellNumber, getWavespellSeal, getWavespellPosition } from '@/lib/dreamspell/wavespell';
import SealGlyph from '@/components/compass/SealGlyph';

export default function WavespellPage() {
  const today = useMemo(() => new Date(), []);
  const todayKin = useMemo(() => getKinForDateFull(today), [today]);

  if (!todayKin) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--purple)]">
        0.0 Hunab Ku — Day Out of Time
      </div>
    );
  }

  const wavespellNum = getWavespellNumber(todayKin.number);
  const wavespellSeal = getWavespellSeal(todayKin.number);
  const currentPos = getWavespellPosition(todayKin.number);
  const startKin = (wavespellNum - 1) * 13 + 1;

  // Build all 13 kin in this wavespell
  const wavespellKin = Array.from({ length: 13 }, (_, i) => buildKin(startKin + i));

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 py-4 overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-sm font-semibold" style={{ color: wavespellSeal.colourHex }}>
          {wavespellSeal.name} Wavespell
        </h1>
        <p className="text-[10px] text-[var(--text-tertiary)]">
          Power of {wavespellSeal.power} · Wavespell {wavespellNum} of 20
        </p>
      </div>

      {/* Vertical timeline */}
      <div className="space-y-1">
        {wavespellKin.map((kin, i) => {
          const tone = TONES[i];
          const isToday = kin.number === todayKin.number;

          return (
            <div
              key={kin.number}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                isToday ? 'ring-1 ring-[var(--purple)]' : ''
              }`}
              style={{
                background: isToday ? 'var(--purple-dim)' : 'var(--bg-card)',
              }}
            >
              {/* Tone number */}
              <div className="w-6 text-center">
                <span className={`text-sm font-bold tabular-nums ${isToday ? 'text-[var(--purple)]' : 'text-[var(--text-tertiary)]'}`}>
                  {tone.number}
                </span>
              </div>

              {/* Seal icon */}
              <SealGlyph sealNumber={kin.seal.number} size={32} showBg />

              {/* Kin info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate" style={{ color: kin.seal.colourHex }}>
                    {kin.title}
                  </span>
                  {kin.isGAP && (
                    <span className="text-[8px] px-1 py-0.5 rounded bg-[var(--purple-dim)] text-[var(--purple)] shrink-0">
                      GAP
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)]">
                  {tone.action} · {tone.power} · {tone.essence}
                </div>
              </div>

              {/* Kin number */}
              <div className="text-xs tabular-nums text-[var(--text-tertiary)]">
                {kin.number}
              </div>
            </div>
          );
        })}
      </div>

      {/* Position indicator */}
      <div className="mt-4 text-center text-[10px] text-[var(--text-tertiary)]">
        Position {currentPos} of 13 · {todayKin.tone.name} tone
      </div>
    </div>
  );
}
