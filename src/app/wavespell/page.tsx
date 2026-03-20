'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { getKinForDateFull, buildKin } from '@/lib/dreamspell/kin';
import { TONES } from '@/lib/dreamspell/tones';
import { getWavespellNumber, getWavespellSeal, getWavespellPosition } from '@/lib/dreamspell/wavespell';
import { getCastleForKin } from '@/lib/dreamspell/castles';
import SealGlyph from '@/components/compass/SealGlyph';

export default function WavespellPage() {
  const today = useMemo(() => new Date(), []);
  const todayKin = useMemo(() => getKinForDateFull(today), [today]);
  const [wsOffset, setWsOffset] = useState(0); // 0 = current wavespell

  const baseKin = todayKin ?? buildKin(1);
  const baseWs = getWavespellNumber(baseKin.number);
  const targetWs = ((baseWs - 1 + wsOffset + 20) % 20) + 1; // wrap 1-20
  const startKin = (targetWs - 1) * 13 + 1;
  const wavespellSeal = getWavespellSeal(startKin);
  const castle = getCastleForKin(startKin);
  const currentPos = todayKin && wsOffset === 0 ? getWavespellPosition(todayKin.number) : null;

  const wavespellKin = useMemo(
    () => Array.from({ length: 13 }, (_, i) => buildKin(startKin + i)),
    [startKin]
  );

  // Auto-scroll to today
  const todayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [wsOffset]);

  if (!todayKin) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--purple)]">
        0.0 Hunab Ku — Day Out of Time
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 py-3">
      {/* Header with nav arrows */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <button
          onClick={() => setWsOffset(wsOffset - 1)}
          className="tap-feedback w-9 h-9 flex items-center justify-center rounded-[10px]"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <ChevronIcon dir="left" />
        </button>
        <div className="text-center flex-1 px-2">
          <div className="flex items-center justify-center gap-2">
            <SealGlyph sealNumber={wavespellSeal.number} size={28} showBg />
            <div>
              <h1 className="text-[15px] font-semibold" style={{ color: wavespellSeal.colourHex }}>
                {wavespellSeal.name} Wavespell
              </h1>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                Wavespell {targetWs} of 20 · Power of {wavespellSeal.power}
              </p>
            </div>
          </div>
          <span
            className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '0.5px solid rgba(255,255,255,0.06)',
              color: 'var(--text-tertiary)',
            }}
          >
            {castle.name}
          </span>
        </div>
        <button
          onClick={() => setWsOffset(wsOffset + 1)}
          className="tap-feedback w-9 h-9 flex items-center justify-center rounded-[10px]"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <ChevronIcon dir="right" />
        </button>
      </div>

      {/* Vertical timeline — scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-1 pr-1">
        {wavespellKin.map((kin, i) => {
          const tone = TONES[i];
          const pos = i + 1;
          const isToday = currentPos === pos;
          const isPast = currentPos !== null && pos < currentPos;
          const isFuture = currentPos !== null && pos > currentPos;

          return (
            <div
              key={kin.number}
              ref={isToday ? todayRef : undefined}
              className="flex items-stretch gap-2"
            >
              {/* Timeline column: circles + connecting line */}
              <div className="flex flex-col items-center w-6 shrink-0">
                {/* Top connector */}
                {i > 0 && (
                  <div
                    className="w-[1.5px] flex-1 min-h-[4px]"
                    style={{
                      background: isPast || isToday ? 'var(--purple)' : 'rgba(255,255,255,0.06)',
                    }}
                  />
                )}
                {/* Tone circle */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold tabular-nums"
                  style={{
                    background: isToday
                      ? 'var(--purple)'
                      : isPast
                      ? 'rgba(192,132,252,0.35)'
                      : 'rgba(255,255,255,0.06)',
                    color: isToday ? 'var(--bg-primary)' : isPast ? 'var(--purple)' : 'var(--text-tertiary)',
                    boxShadow: isToday ? '0 0 10px rgba(192,132,252,0.5)' : 'none',
                  }}
                >
                  {tone.number}
                </div>
                {/* Bottom connector */}
                {i < 12 && (
                  <div
                    className="w-[1.5px] flex-1 min-h-[4px]"
                    style={{
                      background: isPast ? 'var(--purple)' : 'rgba(255,255,255,0.06)',
                    }}
                  />
                )}
              </div>

              {/* Card */}
              <div
                className={`flex items-center gap-2.5 flex-1 px-3 py-2 rounded-xl min-w-0 ${isToday ? '' : ''}`}
                style={{
                  background: isToday
                    ? 'rgba(192,132,252,0.06)'
                    : 'var(--bg-card)',
                  border: isToday
                    ? '1px solid rgba(192,132,252,0.25)'
                    : '0.5px solid rgba(255,255,255,0.04)',
                  opacity: isFuture ? 0.5 : isPast ? 0.7 : 1,
                }}
              >
                <SealGlyph sealNumber={kin.seal.number} size={34} showBg />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[13px] truncate ${isToday ? 'font-bold' : 'font-medium'}`}
                      style={{ color: kin.seal.colourHex }}
                    >
                      {kin.title}
                    </span>
                    {kin.isGAP && (
                      <span className="text-[7px] px-1 py-[1px] rounded bg-[rgba(234,179,8,0.12)] text-[var(--seal-yellow)] shrink-0 font-semibold">
                        GAP
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[var(--text-tertiary)]">
                    {tone.action} · {tone.power} · {tone.essence}
                  </div>
                </div>

                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-md tabular-nums shrink-0"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {kin.number}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Position indicator */}
      {currentPos && (
        <div className="mt-2 text-center text-[10px] text-[var(--text-tertiary)] shrink-0">
          Position {currentPos} of 13 · {todayKin.tone.name} tone
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d={dir === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}
