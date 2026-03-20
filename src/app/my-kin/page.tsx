'use client';

import { useState, useMemo } from 'react';
import { getKinNumber, buildKin } from '@/lib/dreamspell/kin';
import { getOracle } from '@/lib/dreamspell/oracle';
import SealGlyph from '@/components/compass/SealGlyph';

const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function MyKinPage() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isHunabKu, setIsHunabKu] = useState(false);
  const [useAlt, setUseAlt] = useState<'feb28' | 'mar1' | null>(null);

  const kinNumber = useMemo(() => {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    if (!d || !m || !y || y < 1900 || y > 2100) return null;
    if (useAlt === 'feb28') return getKinNumber(y, 2, 28);
    if (useAlt === 'mar1') return getKinNumber(y, 3, 1);
    return getKinNumber(y, m, d);
  }, [day, month, year, useAlt]);

  const kin = useMemo(() => kinNumber && kinNumber > 0 ? buildKin(kinNumber) : null, [kinNumber]);
  const oracle = useMemo(() => kin ? getOracle(kin) : null, [kin]);

  const handleReveal = () => {
    const d = parseInt(day);
    const m = parseInt(month);
    if (m === 2 && d === 29) {
      setIsHunabKu(true);
      setShowResult(false);
      return;
    }
    setIsHunabKu(false);
    setUseAlt(null);
    setShowResult(true);
  };

  const handleAlt = (choice: 'feb28' | 'mar1') => {
    setUseAlt(choice);
    setIsHunabKu(false);
    setShowResult(true);
  };

  const handleReset = () => {
    setShowResult(false);
    setIsHunabKu(false);
    setUseAlt(null);
    setDay('');
    setMonth('');
    setYear('');
  };

  // ── Result state: Signature Card ──
  if (showResult && kin && oracle) {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto px-4 py-4 overflow-y-auto">
        <div
          className="rounded-2xl p-5 space-y-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(155deg, ${kin.seal.bgHex}cc, var(--bg-secondary) 60%)`,
            border: `1px solid ${kin.seal.colourHex}18`,
          }}
        >
          {/* Seal icon + Kin number */}
          <div className="text-center space-y-1.5">
            <div className="flex justify-center">
              <SealGlyph sealNumber={kin.seal.number} size={72} showBg />
            </div>
            <div className="text-[9px] tracking-[0.15em] text-[var(--text-tertiary)] uppercase">Galactic Signature</div>
            <div className="text-[48px] font-bold tabular-nums leading-none text-[var(--text-primary)]">
              {kin.number}
            </div>
            <div className="text-[20px] font-medium" style={{ color: kin.seal.colourHex }}>
              {kin.title}
            </div>
          </div>

          {/* Tone keywords */}
          <div className="text-center text-[12px] text-[var(--text-secondary)]">
            <span className="text-[var(--purple)]">{kin.tone.name}</span>
            {' — '}{kin.tone.action} · {kin.tone.power} · {kin.tone.essence}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-1.5">
            <Tag label={kin.seal.direction} />
            <Tag label={kin.castle.quality} />
            <Tag label={`Wavespell ${kin.wavespell}`} />
            {kin.isGAP && <Tag label="GAP" highlight />}
          </div>

          {/* Oracle cross layout */}
          <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="text-[9px] text-center text-[var(--text-tertiary)] mb-3 tracking-[0.1em]">FIFTH FORCE ORACLE</div>
            <div className="grid grid-cols-3 gap-1.5">
              <div />
              <OracleCell label="Guide" seal={oracle.guide} />
              <div />
              <OracleCell label="Antipode" seal={oracle.antipode} />
              <OracleCell label="Destiny" seal={kin.seal} highlight />
              <OracleCell label="Analog" seal={oracle.analog} />
              <div />
              <OracleCell label="Occult" seal={oracle.occult} />
              <div />
            </div>
          </div>

          {/* Watermark */}
          <div className="text-center text-[8px] text-[var(--text-dim)] pt-1">deepwhisper.app</div>
        </div>

        {/* Actions */}
        <div className="mt-4 text-center">
          <button
            onClick={handleReset}
            className="text-[12px] text-[var(--text-tertiary)] underline underline-offset-2"
          >
            Calculate another
          </button>
        </div>
      </div>
    );
  }

  // ── Input state ──
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto px-6">
      <h1 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">Discover your Kin</h1>
      <p className="text-[12px] text-[var(--text-secondary)] mb-8 text-center max-w-[260px]">
        Enter your birth date to reveal your Galactic Signature in the Dreamspell calendar
      </p>

      {/* Date inputs */}
      <div className="flex gap-2.5 w-full max-w-xs mb-6">
        <input
          type="number"
          placeholder="DD"
          min={1}
          max={31}
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="w-[60px] h-12 rounded-[10px] bg-[rgba(255,255,255,0.04)] border text-center text-lg font-medium focus:outline-none focus:border-[var(--purple)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="flex-1 h-12 rounded-[10px] bg-[rgba(255,255,255,0.04)] border px-3 text-sm font-medium focus:outline-none focus:border-[var(--purple)]"
          style={{ borderColor: 'var(--border-subtle)', color: month ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
        >
          <option value="" disabled>Month</option>
          {MONTHS.slice(1).map((name, i) => (
            <option key={i + 1} value={i + 1}>{name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="YYYY"
          min={1900}
          max={2100}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-[76px] h-12 rounded-[10px] bg-[rgba(255,255,255,0.04)] border text-center text-lg font-medium focus:outline-none focus:border-[var(--purple)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        />
      </div>

      <button
        onClick={handleReveal}
        disabled={!day || !month || !year}
        className="w-full max-w-xs h-12 rounded-[24px] font-semibold text-sm transition-opacity disabled:opacity-25"
        style={{
          background: 'var(--purple-dim)',
          color: 'var(--purple)',
        }}
      >
        Reveal my Kin
      </button>

      {/* Hunab Ku message */}
      {isHunabKu && (
        <div className="mt-6 p-4 rounded-xl text-center space-y-3" style={{ border: '0.5px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
          <div className="text-[var(--purple)] font-medium">0.0 Hunab Ku</div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            February 29 exists outside the Dreamspell count. It is a day of pure galactic freedom.
            Choose the nearest date for your signature:
          </p>
          <div className="flex gap-3">
            <button onClick={() => handleAlt('feb28')} className="flex-1 h-10 rounded-lg border text-xs font-medium text-[var(--text-primary)]" style={{ borderColor: 'var(--border-subtle)' }}>Feb 28</button>
            <button onClick={() => handleAlt('mar1')} className="flex-1 h-10 rounded-lg border text-xs font-medium text-[var(--text-primary)]" style={{ borderColor: 'var(--border-subtle)' }}>Mar 1</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Tag({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full"
      style={{
        border: `0.5px solid ${highlight ? 'rgba(192,132,252,0.3)' : 'rgba(255,255,255,0.06)'}`,
        color: highlight ? 'var(--purple)' : 'var(--text-secondary)',
        background: highlight ? 'var(--purple-dim)' : 'rgba(255,255,255,0.03)',
      }}
    >
      {label}
    </span>
  );
}

function OracleCell({ label, seal, highlight }: { label: string; seal: { name: string; colourHex: string; number: number }; highlight?: boolean }) {
  return (
    <div
      className="flex flex-col items-center gap-1 py-2 rounded-lg"
      style={{ background: highlight ? 'rgba(255,255,255,0.04)' : 'transparent' }}
    >
      <SealGlyph sealNumber={seal.number} size={32} showBg />
      <div className="text-[10px] font-medium" style={{ color: seal.colourHex }}>{seal.name}</div>
      <div className="text-[8px] text-[var(--text-tertiary)]">{label}</div>
    </div>
  );
}
