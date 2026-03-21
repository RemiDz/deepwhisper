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

      {/* Tone tiles */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {TONES.map((tone) => {
          const bars = tone.number % 5 === 0 ? tone.number / 5 : Math.floor(tone.number / 5);
          const dots = tone.number % 5;
          return (
            <div
              key={tone.number}
              className="flex flex-col items-center gap-1 p-1.5 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                minWidth: 42,
              }}
            >
              <ToneGlyph bars={bars} dots={dots} size={16} />
              <span className="text-[9px] font-bold text-white">{tone.number}</span>
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
  const DAY_FULL_NAMES = ['Dali', 'Seli', 'Gamma', 'Kali', 'Alpha', 'Limi', 'Silio'];

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
          {/* Headers — full day names */}
          {DAY_FULL_NAMES.map((name, i) => (
            <div key={`h${i}`} className="text-center text-[7px] font-bold text-[#c084fc] pb-0.5 leading-tight">{name}</div>
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
  const castleColors = ['#ef4444', '#d4d0c8', '#3b82f6', '#eab308', '#22c55e'];

  // Column-first: each column = one seal, each row = one tone
  // Kin = col * 13 + row + 1; castle colour by column group (4 cols each)
  const grid = useMemo(() => {
    const cells: { kin: number; seal: number; tone: number; colour: string; castleColour: string }[] = [];
    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 20; col++) {
        const kin = col * 13 + row + 1;
        const sealColour = SEALS[col].colourHex;
        const castleColour = castleColors[Math.floor(col / 4)];
        cells.push({ kin, seal: col, tone: row, colour: sealColour, castleColour });
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
                  : cell.castleColour + 'B3',
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
            <div className="w-2 h-2 rounded-sm" style={{ background: c.colour + 'B3' }} />
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
      {/* Two interlocking gears */}
      <div className="relative mx-auto" style={{ width: 220, height: 130 }}>
        <svg viewBox="0 0 220 130" className="w-full h-full">
          <defs>
            <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#c084fc" stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* Left gear (20-tooth) — larger */}
          {(() => {
            const cx = 78, cy = 65, r = 42, teeth = 20, toothH = 8, toothW = 0.09;
            return (
              <>
                <circle cx={cx} cy={cy} r={r} fill="rgba(239,68,68,0.06)" stroke="#ef4444" strokeWidth={1} opacity={0.5} />
                {Array.from({ length: teeth }, (_, i) => {
                  const a = (i / teeth) * Math.PI * 2 - Math.PI / 2;
                  const a1 = a - toothW, a2 = a + toothW;
                  const ix1 = cx + Math.cos(a1) * r, iy1 = cy + Math.sin(a1) * r;
                  const ix2 = cx + Math.cos(a2) * r, iy2 = cy + Math.sin(a2) * r;
                  const ox1 = cx + Math.cos(a1) * (r + toothH), oy1 = cy + Math.sin(a1) * (r + toothH);
                  const ox2 = cx + Math.cos(a2) * (r + toothH), oy2 = cy + Math.sin(a2) * (r + toothH);
                  return (
                    <polygon
                      key={`lt${i}`}
                      points={`${ix1},${iy1} ${ox1},${oy1} ${ox2},${oy2} ${ix2},${iy2}`}
                      fill="#ef4444"
                      opacity={0.55}
                    />
                  );
                })}
                <text x={cx} y={cy - 4} textAnchor="middle" fill="#ef4444" fontSize={13} fontWeight="bold">20</text>
                <text x={cx} y={cy + 10} textAnchor="middle" fill="#ef4444" fontSize={8} opacity={0.7}>seals</text>
              </>
            );
          })()}

          {/* Right gear (13-tooth) — smaller */}
          {(() => {
            const cx = 145, cy = 65, r = 28, teeth = 13, toothH = 8, toothW = 0.13;
            return (
              <>
                <circle cx={cx} cy={cy} r={r} fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth={1} opacity={0.5} />
                {Array.from({ length: teeth }, (_, i) => {
                  const a = (i / teeth) * Math.PI * 2 - Math.PI / 2;
                  const a1 = a - toothW, a2 = a + toothW;
                  const ix1 = cx + Math.cos(a1) * r, iy1 = cy + Math.sin(a1) * r;
                  const ix2 = cx + Math.cos(a2) * r, iy2 = cy + Math.sin(a2) * r;
                  const ox1 = cx + Math.cos(a1) * (r + toothH), oy1 = cy + Math.sin(a1) * (r + toothH);
                  const ox2 = cx + Math.cos(a2) * (r + toothH), oy2 = cy + Math.sin(a2) * (r + toothH);
                  return (
                    <polygon
                      key={`rt${i}`}
                      points={`${ix1},${iy1} ${ox1},${oy1} ${ox2},${oy2} ${ix2},${iy2}`}
                      fill="#3b82f6"
                      opacity={0.55}
                    />
                  );
                })}
                <text x={cx} y={cy - 4} textAnchor="middle" fill="#3b82f6" fontSize={13} fontWeight="bold">13</text>
                <text x={cx} y={cy + 10} textAnchor="middle" fill="#3b82f6" fontSize={8} opacity={0.7}>tones</text>
              </>
            );
          })()}

          {/* Mesh point glow where gears touch */}
          <circle cx={114} cy={65} r={10} fill="url(#meshGlow)" />
          <line x1={114} y1={55} x2={114} y2={75} stroke="#c084fc" strokeWidth={0.5} opacity={0.4} strokeDasharray="2 2" />
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
  const colour = '#e8e6df'; // white
  const dotR = size * 0.12;
  const dotSpacing = size * 0.28;
  const barW = size * 0.7;
  const barH = size * 0.14;
  const barGap = size * 0.22;
  const sectionGap = size * 0.15;

  const dotsH = dots > 0 ? dotR * 2 : 0;
  const barsH = bars > 0 ? (bars - 1) * barGap + barH : 0;
  const gapH = dots > 0 && bars > 0 ? sectionGap : 0;
  const totalH = barsH + gapH + dotsH;
  const svgH = Math.max(totalH, size * 0.2) + 2;
  const svgW = Math.max(barW, dots > 0 ? (dots - 1) * dotSpacing + dotR * 2 : 0) + 2;
  const midX = svgW / 2;

  const elements: React.ReactNode[] = [];
  let curY = 1;

  // Bars on top
  if (bars > 0) {
    for (let b = 0; b < bars; b++) {
      elements.push(
        <rect key={`b${b}`} x={midX - barW / 2} y={curY} width={barW} height={barH} rx={barH * 0.3} fill={colour} />
      );
      curY += barGap;
    }
    if (dots > 0) curY += sectionGap - barGap + (bars > 0 ? 0 : 0);
  }
  // Dots below (horizontal row)
  if (dots > 0) {
    const dotsW = (dots - 1) * dotSpacing;
    const startX = midX - dotsW / 2;
    const dotCY = bars > 0 ? barsH + sectionGap + 1 + dotR : 1 + dotR;
    for (let d = 0; d < dots; d++) {
      elements.push(<circle key={`d${d}`} cx={startX + d * dotSpacing} cy={dotCY} r={dotR} fill={colour} />);
    }
  }

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="inline-block">
      {elements}
    </svg>
  );
}
