'use client';

import { useMemo, useState, useCallback } from 'react';
import { MOONS, getMoonDate } from '@/lib/dreamspell/moons';
import { getKinNumber, buildKin } from '@/lib/dreamspell/kin';
import type { Moon13, Kin } from '@/lib/dreamspell/types';
import SealGlyph from '@/components/compass/SealGlyph';
import BottomSheet from '@/components/layout/BottomSheet';

export default function ThirteenMoonsPage() {
  const today = useMemo(() => new Date(), []);
  const currentMoonDate = useMemo(() => getMoonDate(today), [today]);
  const [selectedMoonIndex, setSelectedMoonIndex] = useState(() =>
    currentMoonDate.moon ? currentMoonDate.moon.number - 1 : 0
  );
  const [selectedDayKin, setSelectedDayKin] = useState<Kin | null>(null);

  const selectedMoon = MOONS[selectedMoonIndex];

  const moonYearStart = useMemo(() => {
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const y = today.getFullYear();
    return (m > 7 || (m === 7 && d >= 26)) ? y : y - 1;
  }, [today]);

  const days = useMemo(() => generateMoonDays(selectedMoon, moonYearStart), [selectedMoon, moonYearStart]);
  const todayMoonDay = currentMoonDate.moon?.number === selectedMoon.number ? currentMoonDate.moonDay : null;

  const handleDayTap = useCallback((kin: Kin | null) => {
    if (kin) setSelectedDayKin(kin);
  }, []);

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 py-3">
      {/* Moon navigator */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <button
          onClick={() => setSelectedMoonIndex(Math.max(0, selectedMoonIndex - 1))}
          disabled={selectedMoonIndex === 0}
          className="tap-feedback w-9 h-9 flex items-center justify-center rounded-[10px] disabled:opacity-20"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <Chevron dir="left" />
        </button>
        <div className="text-center flex-1 px-2">
          <h2 className="text-[16px] font-bold text-[var(--text-primary)]">{selectedMoon.name}</h2>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{selectedMoon.question}</p>
          <p className="text-[10px] text-[var(--text-dim)]">{formatGregorianRange(selectedMoon)}</p>
        </div>
        <button
          onClick={() => setSelectedMoonIndex(Math.min(12, selectedMoonIndex + 1))}
          disabled={selectedMoonIndex === 12}
          className="tap-feedback w-9 h-9 flex items-center justify-center rounded-[10px] disabled:opacity-20"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <Chevron dir="right" />
        </button>
      </div>

      {/* Moon progress bar — 13 segments, tappable */}
      <div className="flex gap-[2px] mb-3 shrink-0">
        {MOONS.map((m, i) => (
          <button
            key={i}
            onClick={() => setSelectedMoonIndex(i)}
            className="flex-1 h-[4px] rounded-full transition-opacity"
            style={{
              background: i === selectedMoonIndex ? 'var(--purple)' : (i < selectedMoonIndex ? 'rgba(192,132,252,0.35)' : 'rgba(255,255,255,0.06)'),
            }}
          />
        ))}
      </div>

      {/* Heptad day headers */}
      <div className="grid grid-cols-7 gap-[4px] mb-0.5 shrink-0 px-0">
        {['D', 'S', 'G', 'K', 'A', 'L', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[9px] text-[var(--text-secondary)] font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* 28-day grid — fills width, 4px gaps */}
      <div className="grid grid-cols-7 gap-[4px] px-0 shrink-0">
        {days.map((dayInfo, i) => {
          const isToday = dayInfo.moonDay === todayMoonDay;
          const sealBg = dayInfo.kin ? dayInfo.kin.seal.bgHex : '#1a1a2a';
          const sealColour = dayInfo.kin ? dayInfo.kin.seal.colourHex : '#888';

          return (
            <div
              key={i}
              onClick={() => handleDayTap(dayInfo.kin)}
              className="relative flex flex-col items-center justify-center cursor-pointer gap-[1px]"
              style={{
                background: isToday
                  ? 'rgba(192,132,252,0.18)'
                  : `color-mix(in srgb, ${sealBg} 40%, transparent)`,
                border: isToday
                  ? '1.5px solid rgba(192,132,252,0.65)'
                  : `0.5px solid color-mix(in srgb, ${sealColour} 20%, transparent)`,
                borderRadius: 8,
                aspectRatio: '1',
              }}
            >
              {dayInfo.kin && (
                <SealGlyph sealNumber={dayInfo.kin.seal.number} size={22} />
              )}
              <span className={`text-[10px] font-bold tabular-nums leading-none ${isToday ? 'text-[var(--purple)]' : 'text-white'}`}>
                {dayInfo.moonDay}
              </span>
              {dayInfo.kin && (
                <span className="text-[8px] font-medium tabular-nums leading-none" style={{ color: sealColour }}>
                  {dayInfo.kin.number}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Info bar */}
      <div className="mt-2 shrink-0 text-center text-[10px] text-[var(--text-tertiary)]">
        <span className="text-[var(--purple)]">{selectedMoon.tone.name}</span> — {selectedMoon.tone.action} · {selectedMoon.tone.power} · {selectedMoon.tone.essence}
      </div>

      {/* Day detail bottom sheet */}
      <BottomSheet
        open={!!selectedDayKin}
        onClose={() => setSelectedDayKin(null)}
        title={selectedDayKin?.title}
      >
        {selectedDayKin && (
          <div className="space-y-3 text-center">
            <SealGlyph sealNumber={selectedDayKin.seal.number} size={48} showBg />
            <div className="text-xl font-bold" style={{ color: selectedDayKin.seal.colourHex }}>
              Kin {selectedDayKin.number}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">{selectedDayKin.title}</div>
            <div className="text-xs text-[var(--text-tertiary)]">
              {selectedDayKin.tone.name} — {selectedDayKin.tone.action} · {selectedDayKin.tone.power} · {selectedDayKin.tone.essence}
            </div>
          </div>
        )}
      </BottomSheet>
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
  const { month: startMonth, day: startDay } = moon.gregorianStart;
  const startYear = startMonth >= 7 ? moonYearStart : moonYearStart + 1;
  const current = new Date(startYear, startMonth - 1, startDay);

  for (let d = 1; d <= 28; d++) {
    while (current.getMonth() === 1 && current.getDate() === 29) current.setDate(current.getDate() + 1);
    while (current.getMonth() === 6 && current.getDate() === 25) current.setDate(current.getDate() + 1);

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

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d={dir === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}
