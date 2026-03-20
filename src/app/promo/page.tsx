'use client';

import { useMemo, useState, useRef, useCallback } from 'react';
import { getKinForDateFull, buildKin, getKinNumber } from '@/lib/dreamspell/kin';
import { getOracle } from '@/lib/dreamspell/oracle';
import { getMoonDate } from '@/lib/dreamspell/moons';
import { getMoonData } from '@/lib/astronomy/moon';
import { getWavespellNumber, getWavespellSeal } from '@/lib/dreamspell/wavespell';
import SealGlyph from '@/components/compass/SealGlyph';
import { trackEvent } from '@/lib/analytics';

type CardFormat = '9:16' | '1:1';

export default function PromoPage() {
  const [format, setFormat] = useState<CardFormat>('9:16');
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'card' | 'caption' | 'weekly'>('card');
  const cardRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => new Date(), []);
  const kin = useMemo(() => getKinForDateFull(today), [today]);
  const oracle = useMemo(() => kin ? getOracle(kin) : null, [kin]);
  const moonData = useMemo(() => getMoonData(today), [today]);
  const moonDate = useMemo(() => getMoonDate(today), [today]);

  trackEvent('view-promo');

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return;
    const { default: html2canvas } = await import('html2canvas-pro');
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#080812',
      scale: 2,
      useCORS: true,
    });
    const link = document.createElement('a');
    link.download = `deepwhisper-kin-${kin?.number ?? 'today'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [kin]);

  const caption = useMemo(() => {
    if (!kin || !oracle || !moonDate.moon) return '';
    const ws = getWavespellSeal(kin.number);
    return [
      `🌀 Kin ${kin.number} — ${kin.title}`,
      '',
      `Tone ${kin.tone.number} ${kin.tone.name}: ${kin.tone.action} · ${kin.tone.power} · ${kin.tone.essence}`,
      `Seal: ${kin.seal.name} — ${kin.seal.power} · ${kin.seal.action}`,
      '',
      `🌙 Moon: ${moonData.phaseName} in ${moonData.zodiacSign} (${moonData.illumination}%)`,
      `📅 ${moonDate.moon.name} · Day ${moonDate.moonDay} of 28`,
      `🏰 ${kin.castle.name} — ${kin.castle.quality}`,
      '',
      `Oracle: Guide ${oracle.guide.name} · Analog ${oracle.analog.name} · Antipode ${oracle.antipode.name} · Occult ${oracle.occult.name}`,
      '',
      `#dreamspell #13mooncalendar #galacticsignature #kin${kin.number} #${kin.seal.name.toLowerCase()} #deepwhisper`,
    ].join('\n');
  }, [kin, oracle, moonData, moonDate]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [caption]);

  // Weekly preview data
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const day = d.getDate();
      const kn = getKinNumber(y, m, day);
      const k = kn > 0 ? buildKin(kn) : null;
      days.push({ date: d, kin: k });
    }
    return days;
  }, [today]);

  if (!kin || !oracle) return <div className="flex items-center justify-center h-full text-[var(--purple)]">No Kin today</div>;

  const cardW = format === '9:16' ? 270 : 270;
  const cardH = format === '9:16' ? 480 : 270;

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-3 py-3 overflow-y-auto">
      <h1 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Content Studio</h1>

      {/* Tab bar */}
      <div className="flex gap-1 mb-3 shrink-0">
        {(['card', 'caption', 'weekly'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 h-8 rounded-lg text-[11px] font-medium"
            style={{
              background: tab === t ? 'var(--purple-dim)' : 'var(--bg-card)',
              color: tab === t ? 'var(--purple)' : 'var(--text-tertiary)',
            }}
          >
            {t === 'card' ? 'Daily Card' : t === 'caption' ? 'Caption' : 'Weekly'}
          </button>
        ))}
      </div>

      {/* Daily Card */}
      {tab === 'card' && (
        <div className="space-y-3">
          {/* Format toggle */}
          <div className="flex gap-2 justify-center">
            <button onClick={() => setFormat('9:16')} className={`text-[10px] px-3 py-1 rounded-full ${format === '9:16' ? 'bg-[var(--purple-dim)] text-[var(--purple)]' : 'text-[var(--text-tertiary)]'}`}>9:16 Story</button>
            <button onClick={() => setFormat('1:1')} className={`text-[10px] px-3 py-1 rounded-full ${format === '1:1' ? 'bg-[var(--purple-dim)] text-[var(--purple)]' : 'text-[var(--text-tertiary)]'}`}>1:1 Square</button>
          </div>

          {/* Card preview */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="relative overflow-hidden rounded-xl"
              style={{ width: cardW, height: cardH, background: `linear-gradient(160deg, ${kin.seal.bgHex}, #080812 50%)` }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <div className="text-[8px] tracking-[0.3em] text-[var(--text-tertiary)] uppercase mb-2">
                  {moonDate.moon?.name} · Day {moonDate.moonDay}
                </div>
                <SealGlyph sealNumber={kin.seal.number} size={format === '9:16' ? 72 : 48} showBg />
                <div className="text-[36px] font-bold text-white mt-2 leading-none">{kin.number}</div>
                <div className="text-[16px] font-semibold mt-1" style={{ color: kin.seal.colourHex }}>{kin.title}</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-2">
                  {kin.tone.action} · {kin.tone.power} · {kin.tone.essence}
                </div>
                <div className="text-[9px] text-[var(--text-tertiary)] mt-3">
                  🌙 {moonData.phaseName} in {moonData.zodiacSign} · {moonData.illumination}%
                </div>
                {format === '9:16' && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {[oracle.guide, oracle.analog, oracle.antipode, oracle.occult].map((s, i) => (
                      <div key={i} className="text-center">
                        <SealGlyph sealNumber={s.number} size={24} showBg />
                        <div className="text-[7px] mt-0.5" style={{ color: s.colourHex }}>{s.name}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="absolute bottom-3 text-[7px] text-[var(--text-dim)]">deepwhisper.app</div>
              </div>
            </div>
          </div>

          <button onClick={handleExport} className="w-full h-10 rounded-xl bg-[var(--purple-dim)] text-[var(--purple)] text-sm font-medium">
            Export as PNG
          </button>
        </div>
      )}

      {/* Caption */}
      {tab === 'caption' && (
        <div className="space-y-3">
          <pre className="text-[11px] text-[var(--text-primary)] whitespace-pre-wrap p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-subtle)' }}>
            {caption}
          </pre>
          <button onClick={handleCopy} className="w-full h-10 rounded-xl bg-[var(--purple-dim)] text-[var(--purple)] text-sm font-medium">
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
        </div>
      )}

      {/* Weekly preview */}
      {tab === 'weekly' && (
        <div className="space-y-1">
          {weeklyData.map(({ date, kin: k }, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: i === 0 ? 'var(--purple-dim)' : 'var(--bg-card)' }}>
              <span className="text-[10px] text-[var(--text-tertiary)] w-16 shrink-0">
                {date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
              {k && (
                <>
                  <SealGlyph sealNumber={k.seal.number} size={22} showBg />
                  <span className="text-[11px] font-medium flex-1" style={{ color: k.seal.colourHex }}>{k.title}</span>
                  <span className="text-[9px] text-[var(--text-tertiary)] tabular-nums">{k.number}</span>
                </>
              )}
              {!k && <span className="text-[11px] text-[var(--purple)]">Hunab Ku</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
