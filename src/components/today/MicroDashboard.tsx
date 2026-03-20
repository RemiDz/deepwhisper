'use client';

import type { Kin } from '@/lib/dreamspell/types';
import { getWavespellSeal, getWavespellPosition } from '@/lib/dreamspell/wavespell';
import { CASTLES } from '@/lib/dreamspell/castles';

interface MicroDashboardProps {
  kin: Kin;
}

export default function MicroDashboard({ kin }: MicroDashboardProps) {
  const wavespellSeal = getWavespellSeal(kin.number);
  const wavespellPos = getWavespellPosition(kin.number);

  const castleStart = kin.castle.kinRange[0];
  const castleEnd = kin.castle.kinRange[1];
  const castleDay = kin.number - castleStart + 1;

  const spinPct = Math.round((kin.number / 260) * 100);

  return (
    <div className="space-y-2.5 px-4">
      {/* Wavespell: 13 segments */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#a8a6a0]">Wavespell</span>
          <span className="text-[9px] text-[var(--text-secondary)]">{wavespellSeal.name} · day {wavespellPos} of 13</span>
        </div>
        <div className="flex gap-[2px]">
          {Array.from({ length: 13 }, (_, i) => {
            const pos = i + 1;
            const isPast = pos < wavespellPos;
            const isToday = pos === wavespellPos;
            return (
              <div
                key={i}
                className="flex-1 h-[5px] rounded-full"
                style={{
                  background: isToday
                    ? 'var(--purple)'
                    : isPast
                    ? 'rgba(192,132,252,0.55)'
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: isToday ? '0 0 6px rgba(192,132,252,0.5)' : 'none',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Castle: 5 colour blocks */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#a8a6a0]">Castle</span>
          <span className="text-[9px] text-[var(--text-secondary)]">{kin.castle.quality} · Kin {castleDay}/52</span>
        </div>
        <div className="flex gap-[3px]">
          {CASTLES.map((c) => {
            const isActive = c.number === kin.castle.number;
            const colours: Record<string, string> = { Red: '#ef4444', White: '#e8e6df', Blue: '#3b82f6', Yellow: '#eab308', Green: '#22c55e' };
            return (
              <div
                key={c.number}
                className="flex-1 h-[5px] rounded-full"
                style={{
                  background: colours[c.colour] ?? '#888',
                  opacity: isActive ? 1 : 0.28,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Spin: gradient progress */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#a8a6a0]">Spin</span>
          <span className="text-[9px] text-[var(--text-secondary)]">Day {kin.number} of 260 — {spinPct}%</span>
        </div>
        <div className="h-[5px] rounded-full bg-white/[0.04] overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(spinPct, 1)}%`,
              background: 'linear-gradient(90deg, var(--purple), var(--seal-blue))',
            }}
          />
        </div>
      </div>
    </div>
  );
}
