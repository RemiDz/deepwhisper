'use client';

import { useMemo, useState, useCallback } from 'react';
import { getKinForDateFull, buildKin, getKinNumber } from '@/lib/dreamspell/kin';
import { getOracle } from '@/lib/dreamspell/oracle';
import { getMoonDate } from '@/lib/dreamspell/moons';
import { getWavespellSeal, getWavespellPosition } from '@/lib/dreamspell/wavespell';
import { getEarthFamily } from '@/lib/dreamspell/earthFamilies';
import { CASTLES } from '@/lib/dreamspell/castles';
import { isGAPKin } from '@/lib/dreamspell/wavespell';
import { TONE_FREQUENCIES, SEAL_INSTRUMENTS } from '@/data/promoSoundMappings';
import SealGlyph from '@/components/compass/SealGlyph';

// ─── Types ──────────────────────────────────────────────────────────────

interface TikTokVariation {
  title: string;
  caption_lines: string[];
  description: string;
}

type VoiceoverStyle = 'story' | 'alert' | 'insight';

// ─── Helper: compute upcoming events ────────────────────────────────────

function computeUpcoming(kinNumber: number, today: Date) {
  const wavespellPos = getWavespellPosition(kinNumber);
  const daysUntilNextWavespell = 14 - wavespellPos; // days until next wavespell starts

  // Next wavespell seal
  const nextWsStartKin = kinNumber + daysUntilNextWavespell;
  const nextWsSeal = nextWsStartKin <= 260
    ? buildKin(nextWsStartKin).seal.name
    : buildKin(nextWsStartKin - 260).seal.name;

  // Castle position
  const castle = CASTLES.find(c => kinNumber >= c.kinRange[0] && kinNumber <= c.kinRange[1])!;
  const dayOfCastle = kinNumber - castle.kinRange[0] + 1;
  const daysUntilNextCastle = 53 - dayOfCastle;

  // Next castle
  const nextCastleIndex = castle.number < 5 ? castle.number : 0;
  const nextCastleName = CASTLES[nextCastleIndex].name;

  // Days until Galactic New Year (July 26)
  const galNewYear = new Date(today.getFullYear(), 6, 26);
  if (galNewYear <= today) galNewYear.setFullYear(galNewYear.getFullYear() + 1);
  const msPerDay = 86400000;
  const daysUntilGNY = Math.round((galNewYear.getTime() - today.getTime()) / msPerDay);

  // Next GAP day
  let daysUntilNextGAP = 0;
  for (let i = 1; i <= 260; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const kn = getKinNumber(d.getFullYear(), d.getMonth() + 1, d.getDate());
    if (kn > 0 && isGAPKin(kn)) {
      daysUntilNextGAP = i;
      break;
    }
  }

  return {
    dayOfCastle,
    daysUntilNextWavespell: daysUntilNextWavespell <= 0 ? 13 : daysUntilNextWavespell,
    nextWavespell: nextWsSeal,
    daysUntilNextCastle,
    nextCastle: nextCastleName,
    daysUntilGalacticNewYear: daysUntilGNY <= 30 ? daysUntilGNY : null,
    daysUntilNextGAP,
  };
}

// ─── Helper: build kinData payload for API ──────────────────────────────

function buildKinDataPayload(today: Date) {
  const kin = getKinForDateFull(today);
  if (!kin) return null;

  const oracle = getOracle(kin);
  const moonDate = getMoonDate(today);
  const wavespellSeal = getWavespellSeal(kin.number);
  const wavespellPos = getWavespellPosition(kin.number);
  const earthFamily = getEarthFamily(kin.seal.number);
  const toneFreq = TONE_FREQUENCIES[kin.tone.number];
  const sealInstr = SEAL_INSTRUMENTS[kin.seal.number];
  const upcoming = computeUpcoming(kin.number, today);

  const gregorianDate = today.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return {
    kin,
    oracle,
    moonDate,
    wavespellSeal,
    wavespellPos,
    earthFamily,
    toneFreq,
    sealInstr,
    upcoming,
    payload: {
      kinNumber: kin.number,
      sealColour: kin.seal.colour,
      toneName: kin.tone.name,
      sealName: kin.seal.name,
      toneNumber: kin.tone.number,
      toneKeywords: `${kin.tone.action} · ${kin.tone.power} · ${kin.tone.essence}`,
      sealNumber: kin.seal.number + 1,
      sealKeywords: `${kin.seal.action} · ${kin.seal.power} · ${kin.seal.essence}`,
      guideKin: oracle.guide.name,
      antipodeKin: oracle.antipode.name,
      analogKin: oracle.analog.name,
      occultKin: oracle.occult.name,
      wavespellSeal: wavespellSeal.name,
      dayOfWavespell: wavespellPos,
      castleName: kin.castle.name,
      dayOfCastle: upcoming.dayOfCastle,
      earthFamily: earthFamily.name,
      moonName: moonDate.moon?.name ?? 'Day Out of Time',
      dayOfMoon: moonDate.moonDay,
      gregorianDate,
      isGAP: kin.isGAP,
      toneFrequency: toneFreq.hz,
      solfeggioNote: toneFreq.solfeggio,
      sealInstrument: sealInstr.instrument,
      instrumentApproach: sealInstr.approach,
      frequencyQuality: toneFreq.quality,
      upcoming: {
        nextWavespell: upcoming.nextWavespell,
        daysUntilNextWavespell: upcoming.daysUntilNextWavespell,
        nextCastle: upcoming.nextCastle,
        daysUntilNextCastle: upcoming.daysUntilNextCastle,
        daysUntilGalacticNewYear: upcoming.daysUntilGalacticNewYear,
        daysUntilNextGAP: upcoming.daysUntilNextGAP,
      },
    },
  };
}

// ─── Copy helper ────────────────────────────────────────────────────────

function useCopyState() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);
  return { copiedKey, copy };
}

// ─── Card styles ────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '0.5px solid var(--border-subtle)',
  borderRadius: '12px',
};

const btnStyle: React.CSSProperties = {
  background: 'rgba(192,132,252,0.12)',
  color: '#c084fc',
  border: '0.5px solid rgba(192,132,252,0.2)',
  borderRadius: '24px',
};

const btnSmStyle: React.CSSProperties = {
  ...btnStyle,
  fontSize: '10px',
  padding: '4px 10px',
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════

export default function PromoPage() {
  const today = useMemo(() => new Date(), []);
  const data = useMemo(() => buildKinDataPayload(today), [today]);

  // TikTok state
  const [tiktokVariations, setTiktokVariations] = useState<TikTokVariation[] | null>(null);
  const [tiktokLoading, setTiktokLoading] = useState(false);
  const [tiktokError, setTiktokError] = useState<string | null>(null);

  // Voiceover state
  const [voStyle, setVoStyle] = useState<VoiceoverStyle>('story');
  const [voHook, setVoHook] = useState(false);
  const [voScript, setVoScript] = useState<string | null>(null);
  const [voWordCount, setVoWordCount] = useState(0);
  const [voSeconds, setVoSeconds] = useState(0);
  const [voLoading, setVoLoading] = useState(false);
  const [voError, setVoError] = useState<string | null>(null);

  const { copiedKey, copy } = useCopyState();

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--purple)]">
        No Kin today (Hunab Ku / Day Out of Time)
      </div>
    );
  }

  const { kin, oracle, moonDate, wavespellSeal, wavespellPos, toneFreq, sealInstr, upcoming } = data;

  // ─── Generate TikTok Content ────────────────────────────────────────

  const generateTikTok = async () => {
    setTiktokLoading(true);
    setTiktokError(null);
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'tiktok', kinData: data.payload }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate');
      }
      const json = await res.json();
      setTiktokVariations(json.variations);
    } catch (e: unknown) {
      setTiktokError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setTiktokLoading(false);
    }
  };

  // ─── Generate Voiceover Script ──────────────────────────────────────

  const generateVoiceover = async () => {
    setVoLoading(true);
    setVoError(null);
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'voiceover', style: voStyle, hook: voHook, kinData: data.payload }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate');
      }
      const json = await res.json();
      setVoScript(json.script);
      setVoWordCount(json.wordCount);
      setVoSeconds(json.estimatedSeconds);
    } catch (e: unknown) {
      setVoError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setVoLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto px-4 py-4 pb-28 space-y-6">

      {/* ═══ HEADER — Daily Kin Summary ═══ */}
      <div style={cardStyle} className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌀</span>
          <h1 className="text-sm font-semibold text-[var(--text-primary)]">
            DeepWhisper — Galactic Content Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <SealGlyph sealNumber={kin.seal.number} size={48} showBg />
          <div>
            <div className="text-base font-bold text-white">
              Kin {kin.number} — {kin.title}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Tone {kin.tone.number}: {kin.tone.name} · {kin.tone.action} · {kin.tone.power} · {kin.tone.essence}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          <div className="text-[var(--text-secondary)]">
            Wavespell: <span className="text-[var(--text-primary)]">{wavespellSeal.colour} {wavespellSeal.name} (Day {wavespellPos} of 13)</span>
          </div>
          <div className="text-[var(--text-secondary)]">
            Castle: <span className="text-[var(--text-primary)]">{kin.castle.name}</span>
          </div>
          <div className="text-[var(--text-secondary)]">
            13 Moon: <span className="text-[var(--text-primary)]">{moonDate.moon?.name ?? 'N/A'} Day {moonDate.moonDay}</span>
          </div>
          <div className="text-[var(--text-secondary)]">
            Oracle: <span className="text-[var(--text-primary)]">{oracle.guide.name} · {oracle.analog.name} · {oracle.antipode.name} · {oracle.occult.name}</span>
          </div>
        </div>

        {kin.isGAP && (
          <div className="text-[11px] font-medium text-[#a855f7]">
            🔮 Galactic Activation Portal Day
          </div>
        )}

        <div className="text-[11px] text-[var(--text-secondary)]">
          🔊 Sound: {toneFreq.hz} Hz ({toneFreq.solfeggio}) · {sealInstr.instrument} · {sealInstr.approach}
        </div>
      </div>

      {/* ═══ SECTION 1 — TikTok Caption Generator ═══ */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--purple)]">TikTok Caption Generator</h2>

        <button
          onClick={generateTikTok}
          disabled={tiktokLoading}
          className="w-full h-11 rounded-xl text-sm font-medium transition-opacity disabled:opacity-50"
          style={{ background: 'rgba(192,132,252,0.15)', color: '#c084fc', border: '0.5px solid rgba(192,132,252,0.3)' }}
        >
          {tiktokLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner /> Generating...
            </span>
          ) : (
            '🌀 GENERATE DEEPWHISPER CONTENT'
          )}
        </button>

        {tiktokError && (
          <div className="text-[11px] text-red-400 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
            {tiktokError}
            <button onClick={generateTikTok} className="ml-2 underline">Retry</button>
          </div>
        )}

        {tiktokVariations && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tiktokVariations.map((v, i) => (
              <TikTokCard
                key={i}
                variation={v}
                index={i}
                copiedKey={copiedKey}
                onCopy={copy}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══ SECTION 2 — Voiceover Script Generator ═══ */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--purple)]">🎙️ Voiceover Script Generator</h2>

        {/* Style selector */}
        <div className="flex gap-2">
          {(['story', 'alert', 'insight'] as const).map(s => (
            <button
              key={s}
              onClick={() => setVoStyle(s)}
              className="flex-1 h-9 rounded-lg text-[11px] font-medium capitalize"
              style={{
                background: voStyle === s ? 'var(--purple-dim)' : 'var(--bg-card)',
                color: voStyle === s ? 'var(--purple)' : 'var(--text-tertiary)',
                border: voStyle === s ? '0.5px solid rgba(192,132,252,0.3)' : '0.5px solid var(--border-subtle)',
              }}
            >
              {s === 'story' ? 'Story' : s === 'alert' ? 'Alert' : 'Insight'}
            </button>
          ))}
        </div>

        {/* Hook toggle */}
        <label className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={voHook}
            onChange={e => setVoHook(e.target.checked)}
            className="accent-[#c084fc]"
          />
          Start with attention hook
        </label>

        <button
          onClick={generateVoiceover}
          disabled={voLoading}
          className="w-full h-11 rounded-xl text-sm font-medium transition-opacity disabled:opacity-50"
          style={{ background: 'rgba(192,132,252,0.15)', color: '#c084fc', border: '0.5px solid rgba(192,132,252,0.3)' }}
        >
          {voLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner /> Generating...
            </span>
          ) : (
            '🎙️ GENERATE VOICEOVER SCRIPT'
          )}
        </button>

        {voError && (
          <div className="text-[11px] text-red-400 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
            {voError}
            <button onClick={generateVoiceover} className="ml-2 underline">Retry</button>
          </div>
        )}

        {voScript && (
          <div style={cardStyle} className="p-4 space-y-3">
            <pre className="text-[12px] text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed font-[var(--font-geist-sans)]">
              {voScript}
            </pre>
            <div className="text-[10px] text-[var(--text-tertiary)]">
              {voWordCount} words · ~{voSeconds}s
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copy(voScript, 'vo-script')}
                style={btnSmStyle}
              >
                {copiedKey === 'vo-script' ? 'Copied ✓' : 'Copy Script'}
              </button>
              <button
                onClick={generateVoiceover}
                disabled={voLoading}
                style={btnSmStyle}
              >
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══ UPCOMING EVENTS ═══ */}
      <div style={cardStyle} className="p-4 space-y-1">
        <h3 className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Upcoming</h3>
        <div className="text-[11px] text-[var(--text-primary)]">
          Next Wavespell: {upcoming.nextWavespell} in {upcoming.daysUntilNextWavespell} day{upcoming.daysUntilNextWavespell !== 1 ? 's' : ''}
        </div>
        {upcoming.daysUntilNextCastle <= 14 && (
          <div className="text-[11px] text-[var(--text-primary)]">
            Next Castle: {upcoming.nextCastle} in {upcoming.daysUntilNextCastle} day{upcoming.daysUntilNextCastle !== 1 ? 's' : ''}
          </div>
        )}
        {upcoming.daysUntilGalacticNewYear !== null && (
          <div className="text-[11px] text-[var(--text-primary)]">
            Galactic New Year: {upcoming.daysUntilGalacticNewYear} day{upcoming.daysUntilGalacticNewYear !== 1 ? 's' : ''} away
          </div>
        )}
        <div className="text-[11px] text-[var(--text-primary)]">
          Next GAP day: in {upcoming.daysUntilNextGAP} day{upcoming.daysUntilNextGAP !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function TikTokCard({
  variation,
  index,
  copiedKey,
  onCopy,
}: {
  variation: TikTokVariation;
  index: number;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  const linesText = variation.caption_lines.join('\n');
  const allText = [variation.title, '', ...variation.caption_lines, '', variation.description].join('\n');

  return (
    <div style={cardStyle} className="p-3 space-y-2">
      <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
        Variation {index + 1}
      </div>

      {/* Title */}
      <div className="text-[13px] font-bold text-white leading-tight">
        {variation.title}
      </div>

      {/* Caption lines */}
      <div className="space-y-0.5">
        {variation.caption_lines.map((line, j) => (
          <div key={j} className="text-[11px] text-[var(--text-secondary)]">
            {line}
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="text-[10px] text-[var(--text-tertiary)] leading-relaxed">
        {variation.description}
      </div>

      {/* Copy buttons */}
      <div className="flex flex-wrap gap-1 pt-1">
        <CopyBtn label="Title" text={variation.title} k={`tt-${index}-title`} copiedKey={copiedKey} onCopy={onCopy} />
        <CopyBtn label="Lines" text={linesText} k={`tt-${index}-lines`} copiedKey={copiedKey} onCopy={onCopy} />
        <CopyBtn label="Desc" text={variation.description} k={`tt-${index}-desc`} copiedKey={copiedKey} onCopy={onCopy} />
        <CopyBtn label="All" text={allText} k={`tt-${index}-all`} copiedKey={copiedKey} onCopy={onCopy} />
      </div>
    </div>
  );
}

function CopyBtn({
  label,
  text,
  k,
  copiedKey,
  onCopy,
}: {
  label: string;
  text: string;
  k: string;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <button
      onClick={() => onCopy(text, k)}
      style={{
        background: copiedKey === k ? 'rgba(34,197,94,0.15)' : 'rgba(192,132,252,0.08)',
        color: copiedKey === k ? '#22c55e' : '#c084fc',
        border: '0.5px solid',
        borderColor: copiedKey === k ? 'rgba(34,197,94,0.3)' : 'rgba(192,132,252,0.15)',
        borderRadius: '16px',
        fontSize: '9px',
        padding: '2px 8px',
      }}
    >
      {copiedKey === k ? '✓' : label}
    </button>
  );
}
