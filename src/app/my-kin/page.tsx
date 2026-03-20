'use client';

import { useState, useMemo } from 'react';
import { getKinNumber, buildKin } from '@/lib/dreamspell/kin';
import { getOracle } from '@/lib/dreamspell/oracle';
import SealGlyph from '@/components/compass/SealGlyph';

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
    const y = parseInt(year);
    if (!d || !m || !y) return;

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

  if (showResult && kin && oracle) {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto px-4 py-6 overflow-y-auto">
        {/* Signature Card */}
        <div
          className="rounded-2xl p-6 space-y-5 relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${kin.seal.bgHex}, var(--bg-secondary))`,
            border: `1px solid ${kin.seal.colourHex}20`,
          }}
        >
          {/* Glyph + Kin */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <SealGlyph sealNumber={kin.seal.number} size={64} />
            </div>
            <div className="text-4xl font-bold tabular-nums" style={{ color: kin.seal.colourHex }}>
              Kin {kin.number}
            </div>
            <div className="text-lg font-medium" style={{ color: kin.seal.colourHex }}>
              {kin.title}
            </div>
          </div>

          {/* Tone keywords */}
          <div className="text-center text-sm text-[var(--text-secondary)]">
            <span className="text-[var(--purple)]">{kin.tone.name}</span>
            {' — '}{kin.tone.action} · {kin.tone.power} · {kin.tone.essence}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2">
            <Tag label={kin.seal.direction} />
            <Tag label={kin.castle.quality} />
            <Tag label={`Wavespell ${kin.wavespell}`} />
            {kin.isGAP && <Tag label="GAP" highlight />}
          </div>

          {/* Oracle Grid */}
          <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="text-[10px] text-center text-[var(--text-tertiary)] mb-3 tracking-wider">FIFTH FORCE ORACLE</div>
            <div className="grid grid-cols-3 gap-2">
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
          <div className="text-center text-[9px] text-[var(--text-dim)] pt-2">deepwhisper.app</div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleReset}
            className="flex-1 h-11 rounded-xl border text-sm font-medium text-[var(--text-secondary)]"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            Calculate Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto px-6">
      <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-1">My Galactic Kin</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8 text-center">
        Enter your birth date to reveal your Galactic Signature
      </p>

      {/* Date inputs */}
      <div className="flex gap-3 w-full max-w-xs mb-6">
        <input
          type="number"
          placeholder="DD"
          min={1}
          max={31}
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="flex-1 h-12 rounded-xl bg-[var(--bg-card)] border text-center text-lg font-medium focus:outline-none focus:border-[var(--purple)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        />
        <input
          type="number"
          placeholder="MM"
          min={1}
          max={12}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="flex-1 h-12 rounded-xl bg-[var(--bg-card)] border text-center text-lg font-medium focus:outline-none focus:border-[var(--purple)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        />
        <input
          type="number"
          placeholder="YYYY"
          min={1900}
          max={2100}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="flex-[1.5] h-12 rounded-xl bg-[var(--bg-card)] border text-center text-lg font-medium focus:outline-none focus:border-[var(--purple)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        />
      </div>

      <button
        onClick={handleReveal}
        disabled={!day || !month || !year}
        className="w-full max-w-xs h-12 rounded-xl bg-[var(--purple)] text-[var(--bg-primary)] font-semibold text-sm transition-opacity disabled:opacity-30"
      >
        Reveal my Kin
      </button>

      {/* Hunab Ku message */}
      {isHunabKu && (
        <div className="mt-6 p-4 rounded-xl border text-center space-y-3" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}>
          <div className="text-[var(--purple)] font-medium">0.0 Hunab Ku</div>
          <p className="text-xs text-[var(--text-secondary)]">
            February 29 exists outside the Dreamspell count. It is a day of pure galactic freedom.
            Choose the nearest date for your signature:
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleAlt('feb28')}
              className="flex-1 h-10 rounded-lg border text-xs font-medium text-[var(--text-primary)]"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              Feb 28
            </button>
            <button
              onClick={() => handleAlt('mar1')}
              className="flex-1 h-10 rounded-lg border text-xs font-medium text-[var(--text-primary)]"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              Mar 1
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Tag({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full border"
      style={{
        borderColor: highlight ? 'var(--purple)' : 'var(--border-subtle)',
        color: highlight ? 'var(--purple)' : 'var(--text-secondary)',
        background: highlight ? 'var(--purple-dim)' : 'var(--bg-card)',
      }}
    >
      {label}
    </span>
  );
}

function OracleCell({ label, seal, highlight }: { label: string; seal: { name: string; colourHex: string; number: number }; highlight?: boolean }) {
  return (
    <div
      className="flex flex-col items-center gap-1 p-2 rounded-lg"
      style={{ background: highlight ? 'rgba(255,255,255,0.04)' : 'transparent' }}
    >
      <SealGlyph sealNumber={seal.number} size={24} />
      <div className="text-[10px]" style={{ color: seal.colourHex }}>{seal.name}</div>
      <div className="text-[8px] text-[var(--text-tertiary)]">{label}</div>
    </div>
  );
}
