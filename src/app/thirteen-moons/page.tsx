'use client';

import { useMemo, useState } from 'react';
import { MOONS, getMoonDate } from '@/lib/dreamspell/moons';
import { getKinNumber, buildKin } from '@/lib/dreamspell/kin';
import type { Moon13 } from '@/lib/dreamspell/types';
import SealGlyph from '@/components/compass/SealGlyph';

export default function ThirteenMoonsPage() {
  const today = useMemo(() => new Date(), []);
  const currentMoonDate = useMemo(() => getMoonDate(today), [today]);
  const [selectedMoonIndex, setSelectedMoonIndex] = useState(() => {
    return currentMoonDate.moon ? currentMoonDate.moon.number - 1 : 0;
  });

  const selectedMoon = MOONS[selectedMoonIndex];

  // Determine the 13 Moon year start (July 26)
  const moonYearStart = useMemo(() => {
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const y = today.getFullYear();
    return (m > 7 || (m === 7 && d >= 26)) ? y : y - 1;
  }, [today]);

  // Generate the 28 days for the selected moon
  const days = useMemo(() => {
    return generateMoonDays(selectedMoon, moonYearStart);
  }, [selectedMoon, moonYearStart]);

  const todayMoonDay = currentMoonDate.moon?.number === selectedMoon.number ? currentMoonDate.moonDay : null;

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 py-4">
      {/* Moon navigator */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setSelectedMoonIndex(Math.max(0, selectedMoonIndex - 1))}
          disabled={selectedMoonIndex === 0}
          className="w-8 h-8 flex items-center justify-center rounded-full border disabled:opacity-20"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <ChevronLeft />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-semibold text-[var(--purple)]">{selectedMoon.name}</h2>
          <p className="text-[10px] text-[var(--text-tertiary)]">
            {selectedMoon.question}
          </p>
        </div>
        <button
          onClick={() => setSelectedMoonIndex(Math.min(12, selectedMoonIndex + 1))}
          disabled={selectedMoonIndex === 12}
          className="w-8 h-8 flex items-center justify-center rounded-full border disabled:opacity-20"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Weekday headers (7 columns × 4 rows = 28 days) */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['D', 'S', 'G', 'K', 'A', 'L', 'C'].map((d) => (
          <div key={d} className="text-center text-[9px] text-[var(--text-tertiary)] font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* 28-day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayInfo, i) => {
          const isToday = dayInfo.moonDay === todayMoonDay;
          return (
            <div
              key={i}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-xs ${
                isToday ? 'ring-1 ring-[var(--purple)]' : ''
              }`}
              style={{ background: isToday ? 'var(--purple-dim)' : 'var(--bg-card)' }}
            >
              {dayInfo.kin && (
                <SealGlyph sealNumber={dayInfo.kin.seal.number} size={18} />
              )}
              <span className={`text-[9px] font-medium tabular-nums leading-none ${isToday ? 'text-[var(--purple)]' : 'text-[var(--text-primary)]'}`}>
                {dayInfo.moonDay}
              </span>
            </div>
          );
        })}
      </div>

      {/* Moon info */}
      <div className="mt-4 p-3 rounded-xl border space-y-1" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}>
        <div className="text-xs text-[var(--text-secondary)]">
          <span className="text-[var(--purple)]">{selectedMoon.tone.name}</span> Tone — {selectedMoon.tone.action} · {selectedMoon.tone.power} · {selectedMoon.tone.essence}
        </div>
        <div className="text-[10px] text-[var(--text-tertiary)]">
          {formatGregorianRange(selectedMoon)}
        </div>
      </div>
    </div>
  );
}

interface DayInfo {
  moonDay: number;
  kin: ReturnType<typeof buildKin> | null;
  gregorianDate: Date;
}

function generateMoonDays(moon: Moon13, moonYearStart: number): DayInfo[] {
  const days: DayInfo[] = [];
  // Find the Gregorian start date for this moon
  const { month: startMonth, day: startDay } = moon.gregorianStart;
  const startYear = startMonth >= 7 ? moonYearStart : moonYearStart + 1;
  let current = new Date(startYear, startMonth - 1, startDay);

  for (let d = 1; d <= 28; d++) {
    // Skip Feb 29
    while (current.getMonth() === 1 && current.getDate() === 29) {
      current.setDate(current.getDate() + 1);
    }
    // Skip July 25 (Day Out of Time)
    while (current.getMonth() === 6 && current.getDate() === 25) {
      current.setDate(current.getDate() + 1);
    }

    const y = current.getFullYear();
    const m = current.getMonth() + 1;
    const day = current.getDate();
    const kinNum = getKinNumber(y, m, day);
    const kin = kinNum > 0 ? buildKin(kinNum) : null;

    days.push({ moonDay: d, kin, gregorianDate: new Date(current) });
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function formatGregorianRange(moon: Moon13): string {
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[moon.gregorianStart.month]} ${moon.gregorianStart.day} — ${months[moon.gregorianEnd.month]} ${moon.gregorianEnd.day}`;
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
