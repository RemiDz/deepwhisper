'use client';

import { useState, useMemo } from 'react';
import { SEALS } from '@/lib/dreamspell/seals';
import { TONES } from '@/lib/dreamspell/tones';
import { buildKin } from '@/lib/dreamspell/kin';

const STEP_LABELS = ['The big idea', '20 seals', '13 tones', '13 moons', '260 Kin grid', 'How it fits'];

export default function LearnPage() {
  const [step, setStep] = useState(0);
  const [hoveredKin, setHoveredKin] = useState<number | null>(null);

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 overflow-y-auto h-full" style={{ WebkitOverflowScrolling: 'touch' }}>
      <header className="text-center mb-3">
        <h1 className="text-[10px] font-semibold tracking-[0.2em] text-[var(--text-tertiary)] uppercase">
          Learn
        </h1>
        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
          The Dreamspell 13 &times; 20 system
        </p>
      </header>

      {/* Step pills */}
      <div className="flex gap-1.5 justify-center mb-4 flex-wrap">
        {STEP_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className="tap-feedback px-3 py-1 rounded-full text-[10px] font-medium transition-colors"
            style={{
              background: step === i ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.04)',
              color: step === i ? '#c084fc' : 'var(--text-tertiary)',
              border: '0.5px solid ' + (step === i ? 'rgba(192,132,252,0.25)' : 'rgba(255,255,255,0.06)'),
            }}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)' }}>
        {step === 0 && <StepBigIdea />}
        {step === 1 && <StepSeals />}
        {step === 2 && <StepTones />}
        {step === 3 && <StepMoons />}
        {step === 4 && <StepTzolkin hoveredKin={hoveredKin} setHoveredKin={setHoveredKin} />}
        {step === 5 && <StepHowItFits />}
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between mt-3">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="tap-feedback px-4 py-1.5 rounded-full text-[11px] font-medium disabled:opacity-20"
          style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)' }}
        >
          ◀ Prev
        </button>
        <button
          onClick={() => setStep(Math.min(5, step + 1))}
          disabled={step === 5}
          className="tap-feedback px-4 py-1.5 rounded-full text-[11px] font-medium disabled:opacity-20"
          style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)' }}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

// ===================== Step 1: The Big Idea =====================

function StepBigIdea() {
  return (
    <div className="space-y-4 text-center">
      {/* Equation */}
      <div className="flex items-center justify-center gap-2 text-2xl font-bold">
        <span className="px-3 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>20</span>
        <span className="text-[var(--text-tertiary)]">&times;</span>
        <span className="px-3 py-1 rounded-lg" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>13</span>
        <span className="text-[var(--text-tertiary)]">=</span>
        <span className="px-3 py-1 rounded-lg" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>260</span>
      </div>

      <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-[300px] mx-auto">
        Think of it like a combination lock. Each day has one <strong style={{ color: '#ef4444' }}>seal</strong> (what kind
        of energy) + one <strong style={{ color: '#3b82f6' }}>tone</strong> (how strong / what phase).
      </p>

      {/* Flow diagram */}
      <div className="flex items-center justify-center gap-2 text-[11px] font-medium">
        <div className="px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
          <div className="text-[9px] text-[var(--text-tertiary)] mb-0.5">SEAL</div>
          WHAT
        </div>
        <span className="text-[var(--text-tertiary)]">+</span>
        <div className="px-3 py-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
          <div className="text-[9px] text-[var(--text-tertiary)] mb-0.5">TONE</div>
          HOW
        </div>
        <span className="text-[var(--text-tertiary)]">=</span>
        <div className="px-3 py-2 rounded-lg" style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>
          <div className="text-[9px] text-[var(--text-tertiary)] mb-0.5">KIN</div>
          YOUR DAY
        </div>
      </div>

      <p className="text-xs text-[var(--text-tertiary)] italic">
        260 unique combinations before the cycle repeats.
      </p>
    </div>
  );
}

// ===================== Step 2: 20 Seals =====================

function StepSeals() {
  const COLOUR_MEANINGS: Record<string, string> = {
    Red: 'Initiate',
    White: 'Refine',
    Blue: 'Transform',
    Yellow: 'Ripen',
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--text-secondary)] text-center leading-relaxed">
        20 types of cosmic energy. They cycle in order every 20 days.
      </p>

      {/* 5x4 grid */}
      <div className="grid grid-cols-5 gap-2">
        {SEALS.map((seal) => (
          <div
            key={seal.number}
            className="flex flex-col items-center gap-1 p-1.5 rounded-lg cursor-pointer tap-feedback"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <img
              src={seal.iconPath}
              alt={seal.name}
              className="w-8 h-8"
              style={{ filter: `drop-shadow(0 0 4px ${seal.colourHex}40)` }}
            />
            <span className="text-[8px] font-medium leading-tight text-center" style={{ color: seal.colourHex }}>
              {seal.name}
            </span>
          </div>
        ))}
      </div>

      {/* Colour legend */}
      <div className="flex justify-center gap-3 text-[10px]">
        {Object.entries(COLOUR_MEANINGS).map(([colour, meaning]) => {
          const hex = colour === 'Red' ? '#ef4444' : colour === 'White' ? '#e0ddd6' : colour === 'Blue' ? '#3b82f6' : '#eab308';
          return (
            <div key={colour} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: hex }} />
              <span style={{ color: hex }}>{colour}</span>
              <span className="text-[var(--text-tertiary)]">= {meaning}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================== Step 3: 13 Tones =====================

function StepTones() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--text-secondary)] text-center leading-relaxed">
        13 levels of creative power, running 1 to 13 then restarting.
      </p>

      {/* Tone row with dot-and-bar */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {TONES.map((tone) => {
          const bars = Math.floor(tone.number / 5);
          const dots = tone.number % 5;
          return (
            <div
              key={tone.number}
              className="flex flex-col items-center gap-1 p-1.5 rounded-lg"
              style={{ background: 'rgba(192,132,252,0.06)', minWidth: 42 }}
            >
              <ToneGlyph bars={bars} dots={dots} size={16} />
              <span className="text-[9px] font-bold text-[#c084fc]">{tone.number}</span>
              <span className="text-[7px] text-[var(--text-tertiary)] leading-tight text-center">{tone.name}</span>
            </div>
          );
        })}
      </div>

      {/* Wave curve */}
      <div className="mt-2">
        <svg viewBox="0 0 260 60" className="w-full" style={{ maxHeight: 50 }}>
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c084fc" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#c084fc" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#c084fc" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#waveGrad)"
            strokeWidth={2}
            points={Array.from({ length: 13 }, (_, i) => {
              const x = 10 + i * 20;
              // Wave shape: rises to peak, dips at 7, rises, ends
              const heights = [50, 42, 34, 26, 18, 14, 10, 18, 14, 10, 22, 30, 8];
              return `${x},${heights[i]}`;
            }).join(' ')}
          />
          {Array.from({ length: 13 }, (_, i) => {
            const x = 10 + i * 20;
            const heights = [50, 42, 34, 26, 18, 14, 10, 18, 14, 10, 22, 30, 8];
            return (
              <circle key={i} cx={x} cy={heights[i]} r={3} fill="#c084fc" opacity={0.8} />
            );
          })}
        </svg>
        <div className="flex justify-between text-[8px] text-[var(--text-tertiary)] px-2">
          <span>1 Magnetic</span>
          <span>7 Resonant</span>
          <span>13 Cosmic</span>
        </div>
      </div>
    </div>
  );
}

// ===================== Step 4: 13 Moons =====================

function StepMoons() {
  const DAY_NAMES = ['D', 'S', 'G', 'K', 'A', 'L', 'S'];

  return (
    <div className="space-y-3">
      {/* Equation */}
      <div className="flex items-center justify-center gap-2 text-lg font-bold">
        <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(192,132,252,0.12)', color: '#c084fc' }}>13</span>
        <span className="text-[var(--text-tertiary)]">&times;</span>
        <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(192,132,252,0.12)', color: '#c084fc' }}>28</span>
        <span className="text-[var(--text-tertiary)]">=</span>
        <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(234,179,8,0.12)', color: '#eab308' }}>364</span>
        <span className="text-[var(--text-tertiary)]">+ 1</span>
      </div>

      <p className="text-sm text-[var(--text-secondary)] text-center leading-relaxed">
        13 Moons and 13 Tones are separate systems running at the same time.
      </p>

      {/* 4x7 grid */}
      <div className="mx-auto" style={{ maxWidth: 260 }}>
        <div className="text-[9px] text-[var(--text-tertiary)] text-center mb-1">Sample Moon (28 days)</div>
        <div className="grid grid-cols-7 gap-0.5">
          {/* Headers */}
          {DAY_NAMES.map((d, i) => (
            <div key={`h${i}`} className="text-center text-[8px] font-bold text-[#c084fc] pb-0.5">{d}</div>
          ))}
          {/* Days 1-28 */}
          {Array.from({ length: 28 }, (_, i) => (
            <div
              key={i}
              className="text-center text-[10px] py-1 rounded"
              style={{
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--text-secondary)',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="text-[8px] text-[var(--text-tertiary)] text-center mt-1">
          Perfect 4 &times; 7 grid — every Moon is identical
        </div>
      </div>
    </div>
  );
}

// ===================== Step 5: 260 Kin Grid =====================

function StepTzolkin({ hoveredKin, setHoveredKin }: { hoveredKin: number | null; setHoveredKin: (k: number | null) => void }) {
  // CRT: kin = 1 + (221*s + 40*t) % 260
  const grid = useMemo(() => {
    const cells: { kin: number; seal: number; tone: number; colour: string; castleColour: string }[] = [];
    for (let t = 0; t < 13; t++) {
      for (let s = 0; s < 20; s++) {
        const kin = 1 + (221 * s + 40 * t) % 260;
        const sealColour = SEALS[s].colourHex;
        let castleColour: string;
        if (kin <= 52) castleColour = '#ef4444';
        else if (kin <= 104) castleColour = '#e0ddd6';
        else if (kin <= 156) castleColour = '#3b82f6';
        else if (kin <= 208) castleColour = '#eab308';
        else castleColour = '#22c55e';
        cells.push({ kin, seal: s, tone: t, colour: sealColour, castleColour });
      }
    }
    return cells;
  }, []);

  const hoveredInfo = useMemo(() => {
    if (hoveredKin === null) return null;
    const k = buildKin(hoveredKin);
    return k;
  }, [hoveredKin]);

  return (
    <div className="space-y-2">
      <p className="text-sm text-[var(--text-secondary)] text-center leading-relaxed">
        Each column = one seal. Each row = one tone. Tap any cell.
      </p>

      {/* Hovered info */}
      <div className="text-center h-6">
        {hoveredInfo ? (
          <span className="text-[11px] font-medium" style={{ color: hoveredInfo.seal.colourHex }}>
            Kin {hoveredInfo.number} — {hoveredInfo.title}
          </span>
        ) : (
          <span className="text-[10px] text-[var(--text-tertiary)]">Tap a cell to see its Kin</span>
        )}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="grid gap-px" style={{ gridTemplateColumns: 'repeat(20, 1fr)', minWidth: 280 }}>
          {grid.map((cell, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-sm cursor-pointer"
              style={{
                background: hoveredKin === cell.kin
                  ? cell.colour
                  : cell.castleColour + '20',
                border: hoveredKin === cell.kin ? `1px solid ${cell.colour}` : '0.5px solid rgba(255,255,255,0.04)',
                minWidth: 12,
                minHeight: 12,
              }}
              onClick={() => setHoveredKin(hoveredKin === cell.kin ? null : cell.kin)}
            />
          ))}
        </div>
      </div>

      {/* Castle legend */}
      <div className="flex justify-center gap-2 text-[8px] flex-wrap">
        {[
          { name: 'Red', colour: '#ef4444' },
          { name: 'White', colour: '#e0ddd6' },
          { name: 'Blue', colour: '#3b82f6' },
          { name: 'Yellow', colour: '#eab308' },
          { name: 'Green', colour: '#22c55e' },
        ].map(c => (
          <div key={c.name} className="flex items-center gap-0.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: c.colour + '40' }} />
            <span className="text-[var(--text-tertiary)]">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== Step 6: How It Fits =====================

function StepHowItFits() {
  return (
    <div className="space-y-4 text-center">
      {/* Two interlocking gears conceptual */}
      <div className="relative mx-auto" style={{ width: 200, height: 120 }}>
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* Outer gear (20-tooth) */}
          <circle cx={80} cy={60} r={45} fill="none" stroke="#ef4444" strokeWidth={1.5} opacity={0.4} />
          {Array.from({ length: 20 }, (_, i) => {
            const a = (i / 20) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={`o${i}`}
                x1={80 + Math.cos(a) * 42}
                y1={60 + Math.sin(a) * 42}
                x2={80 + Math.cos(a) * 50}
                y2={60 + Math.sin(a) * 50}
                stroke="#ef4444"
                strokeWidth={2}
                opacity={0.5}
              />
            );
          })}
          <text x={80} y={63} textAnchor="middle" fill="#ef4444" fontSize={11} fontWeight="bold">20</text>

          {/* Inner gear (13-tooth) */}
          <circle cx={135} cy={60} r={30} fill="none" stroke="#3b82f6" strokeWidth={1.5} opacity={0.4} />
          {Array.from({ length: 13 }, (_, i) => {
            const a = (i / 13) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={`i${i}`}
                x1={135 + Math.cos(a) * 27}
                y1={60 + Math.sin(a) * 27}
                x2={135 + Math.cos(a) * 34}
                y2={60 + Math.sin(a) * 34}
                stroke="#3b82f6"
                strokeWidth={2}
                opacity={0.5}
              />
            );
          })}
          <text x={135} y={63} textAnchor="middle" fill="#3b82f6" fontSize={11} fontWeight="bold">13</text>
        </svg>
      </div>

      <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-[300px] mx-auto">
        Two gears spinning at different speeds. Because 13 and 20 share no common factor, it takes
        <strong className="text-[#eab308]"> 260 days </strong>
        before the same combination appears again.
      </p>

      {/* Flow */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium flex-wrap">
        <span className="px-2 py-1 rounded" style={{ background: 'rgba(192,132,252,0.1)', color: '#c084fc' }}>260-day Tzolkin</span>
        <span className="text-[var(--text-tertiary)]">+</span>
        <span className="px-2 py-1 rounded" style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>365-day year</span>
        <span className="text-[var(--text-tertiary)]">=</span>
        <span className="px-2 py-1 rounded" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>52-year cycle</span>
      </div>

      <div className="text-xs text-[var(--text-tertiary)] leading-relaxed max-w-[280px] mx-auto pt-2" style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
        Open app &rarr; see today&apos;s seal + tone &rarr; get your sound healing prescription &rarr; practice.
      </div>
    </div>
  );
}

// ===================== Shared Components =====================

function ToneGlyph({ bars, dots, size }: { bars: number; dots: number; size: number }) {
  const colour = '#c084fc';
  const dotR = size * 0.12;
  const dotSpacing = size * 0.28;
  const barW = size * 0.7;
  const barH = size * 0.14;
  const barGap = size * 0.22;
  const sectionGap = size * 0.15;

  const dotsH = dots > 0 ? dotR * 2 : 0;
  const barsH = bars > 0 ? (bars - 1) * barGap + barH : 0;
  const gapH = dots > 0 && bars > 0 ? sectionGap : 0;
  const totalH = dotsH + gapH + barsH;
  const svgH = Math.max(totalH, size * 0.2) + 2;
  const svgW = Math.max(barW, dots > 0 ? (dots - 1) * dotSpacing + dotR * 2 : 0) + 2;
  const midX = svgW / 2;

  const elements: React.ReactNode[] = [];
  let curY = 1;

  if (dots > 0) {
    const dotsW = (dots - 1) * dotSpacing;
    const startX = midX - dotsW / 2;
    for (let d = 0; d < dots; d++) {
      elements.push(<circle key={`d${d}`} cx={startX + d * dotSpacing} cy={curY + dotR} r={dotR} fill={colour} />);
    }
    curY += dotsH + gapH;
  }
  if (bars > 0) {
    for (let b = 0; b < bars; b++) {
      elements.push(
        <rect key={`b${b}`} x={midX - barW / 2} y={curY} width={barW} height={barH} rx={barH * 0.3} fill={colour} />
      );
      curY += barGap;
    }
  }

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="inline-block">
      {elements}
    </svg>
  );
}
