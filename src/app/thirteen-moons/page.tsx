'use client';

import { useMemo, useState, useCallback } from 'react';
import { MOONS, getMoonDate } from '@/lib/dreamspell/moons';
import { getKinNumber, buildKin } from '@/lib/dreamspell/kin';
import { getWavespellPosition, getWavespellSeal } from '@/lib/dreamspell/wavespell';
import { MOON_TEACHINGS } from '@/lib/dreamspell/moon-teachings';
import type { Moon13, Kin } from '@/lib/dreamspell/types';
import SealGlyph from '@/components/compass/SealGlyph';
import BottomSheet from '@/components/layout/BottomSheet';
import { getDeclaration } from '@/lib/galactic-content';

export default function ThirteenMoonsPage() {
  const today = useMemo(() => new Date(), []);
  const currentMoonDate = useMemo(() => getMoonDate(today), [today]);
  const [selectedMoonIndex, setSelectedMoonIndex] = useState(() =>
    currentMoonDate.moon ? currentMoonDate.moon.number - 1 : 0
  );
  const [selectedDayKin, setSelectedDayKin] = useState<Kin | null>(null);
  const [explainerOpen, setExplainerOpen] = useState(false);

  const selectedMoon = MOONS[selectedMoonIndex];

  const moonYearStart = useMemo(() => {
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const y = today.getFullYear();
    return (m > 7 || (m === 7 && d >= 26)) ? y : y - 1;
  }, [today]);

  const days = useMemo(() => generateMoonDays(selectedMoon, moonYearStart), [selectedMoon, moonYearStart]);
  const todayMoonDay = currentMoonDate.moon?.number === selectedMoon.number ? currentMoonDate.moonDay : null;

  const teaching = MOON_TEACHINGS[selectedMoon.number];

  const upcomingEvents = useMemo(() => {
    const events: { moonDay: number; date: Date; type: string; label: string; description: string }[] = [];
    const castleStarts = new Set([1, 53, 105, 157, 209]);

    for (const dayInfo of days) {
      if (!dayInfo.kin) continue;

      if (dayInfo.kin.isGAP) {
        events.push({ moonDay: dayInfo.moonDay, date: dayInfo.gregorianDate, type: 'gap', label: 'GAP Day', description: 'Portal of intensified energy' });
      }

      if (getWavespellPosition(dayInfo.kin.number) === 1) {
        const seal = getWavespellSeal(dayInfo.kin.number);
        events.push({ moonDay: dayInfo.moonDay, date: dayInfo.gregorianDate, type: 'wavespell', label: 'Wavespell Shift', description: `${seal.colour} ${seal.name} wavespell begins` });
      }

      if (castleStarts.has(dayInfo.kin.number)) {
        events.push({ moonDay: dayInfo.moonDay, date: dayInfo.gregorianDate, type: 'castle', label: 'Castle Shift', description: `${dayInfo.kin.castle.name} begins` });
      }

      if (dayInfo.gregorianDate.getMonth() === 6 && dayInfo.gregorianDate.getDate() === 25) {
        events.push({ moonDay: dayInfo.moonDay, date: dayInfo.gregorianDate, type: 'dot', label: 'Day Out of Time', description: 'Celebration of freedom and forgiveness' });
      }
    }

    return events;
  }, [days]);

  const handleDayTap = useCallback((kin: Kin | null) => {
    if (kin) setSelectedDayKin(kin);
  }, []);

  return (
    <div className="flex flex-col max-w-md mx-auto px-4 py-3">
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

      {/* Section 1: About This Moon */}
      {teaching && (
        <div className="mt-6 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">🌙</span>
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">About the {selectedMoon.name}</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] italic mb-3">&ldquo;{selectedMoon.question}&rdquo;</p>

          <div className="text-[9px] font-semibold tracking-[0.1em] text-[var(--purple)] uppercase mb-1">Theme</div>
          <p className="text-[12px] text-[var(--text-secondary)] mb-3">{teaching.theme}</p>

          <p className="text-[12px] leading-[1.6] text-[#b8b5ad] mb-3">{teaching.guidance}</p>

          <div className="text-[9px] font-semibold tracking-[0.1em] text-[var(--purple)] uppercase mb-1">Daily Practice</div>
          <p className="text-[12px] leading-[1.6] text-[#b8b5ad]">{teaching.practice}</p>
        </div>
      )}

      {/* Section 2: What's Coming Up */}
      <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">⚡</span>
          <span className="text-[13px] font-semibold text-[var(--text-primary)]">What&apos;s Coming Up</span>
        </div>

        {upcomingEvents.length === 0 ? (
          <p className="text-[12px] text-[var(--text-tertiary)]">No major galactic events remaining this moon.</p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((ev, i) => (
              <div key={i}>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">Day {ev.moonDay}</span>
                  {' '}({formatShortDate(ev.date)}) · <span className="text-[var(--purple)]">{ev.label}</span>
                </div>
                <p className="text-[11px] text-[var(--text-tertiary)]">{ev.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: New to 13 Moon Calendar? collapsible */}
      <div className="mt-4 mb-24">
        <button
          onClick={() => setExplainerOpen(!explainerOpen)}
          className="flex items-center gap-2 w-full text-left py-2"
        >
          <span className="text-sm">ℹ️</span>
          <span className="text-[12px] text-[var(--text-secondary)]">New to the 13 Moon Calendar?</span>
          <span className="text-[10px] text-[var(--text-tertiary)] ml-auto">{explainerOpen ? '˄' : '˅'}</span>
        </button>

        {explainerOpen && (
          <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-[12px] leading-[1.6] text-[#b8b5ad]">
              The 13 Moon calendar is a natural time system based on the moon&apos;s 28-day cycle.
              Unlike the Gregorian calendar with its irregular months (28–31 days), each of the 13
              Moons has exactly 28 days — 4 perfect weeks.
            </p>
            <p className="text-[12px] leading-[1.6] text-[#b8b5ad]">
              Combined with the 260-day Tzolkin (galactic spin), each day carries a unique energy
              called a Kin. Your daily Kin is shown in each cell above — the coloured icon is the
              Solar Seal and the number is the Kin number.
            </p>
            <div className="text-[12px] leading-[1.6] text-[#b8b5ad]">
              The 13 Moon calendar helps you:
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Sync with natural cycles instead of artificial time</li>
                <li>Track your personal energy patterns across the year</li>
                <li>Connect with a global community of practitioners</li>
              </ul>
            </div>
            <p className="text-[12px] leading-[1.6] text-[#b8b5ad]">
              The current moon&apos;s question (shown at the top) is your guiding theme for these 28 days.
            </p>
          </div>
        )}
      </div>

      {/* Day detail bottom sheet */}
      <BottomSheet
        open={!!selectedDayKin}
        onClose={() => setSelectedDayKin(null)}
        title={selectedDayKin?.title}
      >
        {selectedDayKin && (
          <DayKinDetail kin={selectedDayKin} />
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

function DayKinDetail({ kin }: { kin: Kin }) {
  const decl = getDeclaration(kin.number);
  const preview = decl?.declaration.split('\n').filter(l => l.trim()).slice(0, 2).join(' · ') ?? '';

  return (
    <div className="space-y-3 text-center">
      <div className="flex justify-center">
        <SealGlyph sealNumber={kin.seal.number} size={48} showBg />
      </div>
      <div>
        <div className="text-[11px] text-[var(--text-tertiary)]">
          Kin {kin.number} ·{' '}
          <span className="inline-block w-2 h-2 rounded-full align-middle" style={{ background: kin.seal.colourHex }} />
        </div>
        <div className="text-lg font-bold" style={{ color: kin.seal.colourHex }}>
          {kin.title}
        </div>
      </div>
      <div className="text-xs text-[var(--text-tertiary)]">
        {kin.tone.name} — {kin.tone.action} · {kin.tone.power} · {kin.tone.essence}
      </div>
      {preview && (
        <div className="text-left pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="text-[9px] font-semibold tracking-[0.1em] text-[var(--text-tertiary)] uppercase mb-1">Declaration</div>
          <p className="text-[12px] leading-[1.5] text-[#b8b5ad]">{preview}</p>
        </div>
      )}
    </div>
  );
}

function formatShortDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d={dir === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}
