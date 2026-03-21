'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { getKinForDateFull, buildKin } from '@/lib/dreamspell/kin';
import { getOracle } from '@/lib/dreamspell/oracle';
import { getMoonDate } from '@/lib/dreamspell/moons';
import { getMoonData } from '@/lib/astronomy/moon';
import { SEALS } from '@/lib/dreamspell/seals';
import { getSealDescription, getToneDescription, getDeclaration } from '@/lib/galactic-content';
import GearWheel from '@/components/compass/GearWheel';
import type { GearWheelHandle } from '@/components/compass/GearWheel';
import KinStrip from '@/components/today/KinStrip';
import MicroDashboard from '@/components/today/MicroDashboard';
import MilestoneCard from '@/components/today/MilestoneCard';
import BottomSheet from '@/components/layout/BottomSheet';
import SealGlyph from '@/components/compass/SealGlyph';
import SonicPrescription from '@/components/today/SonicPrescription';
import DeclarationCard from '@/components/today/DeclarationCard';
import EnergyIntensity from '@/components/energy/EnergyIntensity';

export default function TodayPage() {
  const [sheetContent, setSheetContent] = useState<{ title: string; body: React.ReactNode } | null>(null);
  const [dayOffset, setDayOffset] = useState(0);
  const [cinPhase, setCinPhase] = useState<'idle' | 'running' | 'complete'>('idle');
  const gearRef = useRef<GearWheelHandle>(null);

  // Compute target date from offset
  const targetDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [dayOffset]);

  const kin = useMemo(() => getKinForDateFull(targetDate), [targetDate]);
  const oracle = useMemo(() => kin ? getOracle(kin) : null, [kin]);
  const moonData = useMemo(() => getMoonData(targetDate), [targetDate]);
  const moonDate = useMemo(() => getMoonDate(targetDate), [targetDate]);

  const sealIndex = kin ? (kin.number - 1) % 20 : 0;
  const toneIndex = kin ? (kin.number - 1) % 13 : 0;

  const handleDayChange = useCallback((delta: number) => {
    setDayOffset(prev => prev + delta);
  }, []);

  const handleAnimPhaseChange = useCallback((phase: 'idle' | 'running' | 'complete') => {
    setCinPhase(phase);
  }, []);

  const handleCentreTap = useCallback(() => {
    if (!kin || !oracle) return;
    const declaration = getDeclaration(kin.number);
    const sealDescKey = kin.seal.name === 'Worldbridger' ? 'World-Bridger' : kin.seal.name;
    const sealDesc = getSealDescription(sealDescKey);
    const toneDesc = getToneDescription(kin.tone.number);
    setSheetContent({
      title: kin.title,
      body: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <SealGlyph sealNumber={kin.seal.number} size={48} showBg />
            </div>
            <div className="text-2xl font-bold" style={{ color: kin.seal.colourHex }}>Kin {kin.number}</div>
            <div className="text-sm text-[var(--text-secondary)] mt-1">{kin.title}</div>
            {kin.isGAP && <div className="text-xs text-[#a78bfa] mt-1">✦ Galactic Activation Portal</div>}
          </div>
          {declaration && (
            <div>
              <div className="text-[10px] text-[var(--text-tertiary)] mb-2 tracking-wider">DECLARATION</div>
              <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{declaration.declaration}</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoRow label="Tone" value={`${kin.tone.name} — ${kin.tone.action}`} />
            <InfoRow label="Seal" value={`${kin.seal.name} — ${kin.seal.action}`} />
            <InfoRow label="Power" value={kin.seal.power} />
            <InfoRow label="Essence" value={kin.seal.essence} />
            <InfoRow label="Direction" value={kin.seal.direction} />
            <InfoRow label="Wavespell" value={`${kin.wavespell}`} />
            <InfoRow label="Castle" value={kin.castle.name} />
          </div>
          {sealDesc && (
            <div>
              <div className="text-[10px] text-[var(--text-tertiary)] mb-2 tracking-wider">SEAL ESSENCE</div>
              <div className="text-xs text-[var(--text-secondary)] leading-relaxed">{sealDesc}</div>
            </div>
          )}
          {toneDesc && (
            <div>
              <div className="text-[10px] text-[var(--text-tertiary)] mb-2 tracking-wider">TONE ESSENCE</div>
              <div className="text-xs text-[var(--text-secondary)] leading-relaxed">{toneDesc}</div>
            </div>
          )}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="text-[10px] text-[var(--text-tertiary)] mb-2 tracking-wider">FIFTH FORCE ORACLE</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <OraclePill label="Guide" sealNumber={oracle.guide.number} seal={oracle.guide.name} colour={oracle.guide.colourHex} />
              <OraclePill label="Analog" sealNumber={oracle.analog.number} seal={oracle.analog.name} colour={oracle.analog.colourHex} />
              <OraclePill label="Antipode" sealNumber={oracle.antipode.number} seal={oracle.antipode.name} colour={oracle.antipode.colourHex} />
              <OraclePill label="Occult" sealNumber={oracle.occult.number} seal={oracle.occult.name} colour={oracle.occult.colourHex} />
            </div>
          </div>
          <SonicPrescription kin={kin} />
        </div>
      ),
    });
  }, [kin, oracle]);

  const handleSealTap = useCallback((sealNumber: number) => {
    const seal = SEALS[sealNumber];
    const descKey = seal.name === 'Worldbridger' ? 'World-Bridger' : seal.name;
    const description = getSealDescription(descKey);
    const DIRECTION_ELEMENTS: Record<string, string> = { East: 'Fire', North: 'Air', West: 'Water', South: 'Earth' };
    const element = DIRECTION_ELEMENTS[seal.direction] || '';
    const analogSeal = SEALS[(17 - seal.number + 20) % 20];
    const antipodeSeal = SEALS[(seal.number + 10) % 20];
    const occultSeal = SEALS[(19 - seal.number + 20) % 20];
    const isActive = kin ? sealNumber === kin.seal.number : false;
    const sealKins = Array.from({ length: 13 }, (_, i) => seal.number + i * 20 + 1);
    setSheetContent({
      title: `Solar Seal: ${seal.colour} ${seal.name}`,
      body: (
        <div className="space-y-3">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <SealGlyph sealNumber={seal.number} size={48} showBg />
            </div>
            <div className="text-xl font-bold" style={{ color: seal.colourHex }}>{seal.colour} {seal.name}</div>
            <div className="text-[11px] text-[var(--text-tertiary)]">Seal {seal.number + 1} of 20</div>
            <div className="text-[10px] text-[var(--text-tertiary)] mt-1">
              This seal appears in 13 Kins ({sealKins.slice(0, 3).map(k => `Kin ${k}`).join(', ')}... etc) — each paired with a different tone.
            </div>
          </div>
          {isActive && kin && (
            <div className="px-3 py-2.5 rounded-lg" style={{ background: 'rgba(192,132,252,0.08)', border: '0.5px solid rgba(192,132,252,0.15)' }}>
              <div className="text-[10px] text-[var(--text-tertiary)] mb-1.5 tracking-wider">TODAY&apos;S KIN</div>
              <div className="text-sm font-medium" style={{ color: kin.seal.colourHex }}>Kin {kin.number} — {kin.title}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <ToneBarDotSheet tone={kin.tone.number} />
                <div>
                  <div className="text-sm" style={{ color: '#c084fc' }}>Tone {kin.tone.number} · {kin.tone.name}</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">{kin.tone.action} · {kin.tone.power} · {kin.tone.essence}</div>
                </div>
              </div>
            </div>
          )}
          {description && (
            <div>
              <div className="text-[10px] text-[var(--text-tertiary)] mb-2 tracking-wider">SEAL ESSENCE</div>
              <div className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</div>
            </div>
          )}
          <div>
            <div className="text-[10px] text-[var(--text-tertiary)] mb-2 tracking-wider">ATTRIBUTES</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoRow label="Colour" value={seal.colour} />
              <InfoRow label="Direction" value={seal.direction} />
              <InfoRow label="Element" value={element} />
              <InfoRow label="Action" value={seal.action} />
              <InfoRow label="Power" value={seal.power} />
              <InfoRow label="Essence" value={seal.essence} />
            </div>
          </div>
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="text-[10px] text-[var(--text-tertiary)] mb-2 tracking-wider">ORACLE FAMILY</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <OraclePill label="Analog" sealNumber={analogSeal.number} seal={analogSeal.name} colour={analogSeal.colourHex} />
              <OraclePill label="Antipode" sealNumber={antipodeSeal.number} seal={antipodeSeal.name} colour={antipodeSeal.colourHex} />
              <OraclePill label="Occult" sealNumber={occultSeal.number} seal={occultSeal.name} colour={occultSeal.colourHex} />
            </div>
            <div className="text-[10px] text-[var(--text-tertiary)] mt-2 italic">Guide varies by tone</div>
          </div>
          {!isActive && (
            <div className="text-center pt-1">
              <a href="/my-kin" className="text-[11px] text-[#a78bfa] underline underline-offset-2">
                Calculate your personal {seal.name} Kin on the My Kin page
              </a>
            </div>
          )}
        </div>
      ),
    });
  }, [kin]);

  // Format the viewed date (shown separately when navigating away from today)
  const viewedDateLabel = useMemo(() => {
    if (dayOffset === 0) return '';
    const opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return targetDate.toLocaleDateString('en-GB', opts);
  }, [dayOffset, targetDate]);

  if (!kin || !oracle) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-[var(--purple)] text-lg font-medium">0.0 Hunab Ku</div>
        <p className="text-[var(--text-secondary)] text-sm mt-2">
          Today is the Day Out of Time — a day of pure being, beyond the count of days.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => handleDayChange(-1)}
            className="tap-feedback flex items-center justify-center w-9 h-9 rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            onClick={() => setDayOffset(0)}
            className="tap-feedback px-5 py-1.5 rounded-full text-[11px] font-medium"
            style={{ background: 'rgba(192,132,252,0.12)', color: '#c084fc', border: '0.5px solid rgba(192,132,252,0.2)' }}
          >
            Today
          </button>
          <button
            onClick={() => handleDayChange(1)}
            className="tap-feedback flex items-center justify-center w-9 h-9 rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-md mx-auto px-3 pt-2 pb-20 overflow-y-auto h-full" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Header */}
        <header className="text-center w-full">
          <h1 className="text-[10px] font-semibold tracking-[0.2em] text-[var(--text-tertiary)] uppercase">
            Deep Whisper
          </h1>
          {moonDate.moon && (
            <p className="text-[11px] text-[var(--text-secondary)]">
              {moonDate.moon.name} · Day {moonDate.moonDay}
            </p>
          )}
          {moonDate.isDayOutOfTime && (
            <p className="text-[11px] text-[var(--purple)]">Day Out of Time</p>
          )}
        </header>

        {/* Gear Wheel */}
        <div className="flex items-center justify-center py-2">
          <GearWheel
            ref={gearRef}
            kinNumber={kin.number}
            sealIndex={sealIndex}
            toneIndex={toneIndex}
            moonData={moonData}
            onCentreTap={handleCentreTap}
            onSealTap={handleSealTap}
            onDayChange={handleDayChange}
            onAnimPhaseChange={handleAnimPhaseChange}
          />
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col items-center -mt-1 mb-2 gap-1">
          <div
            className="flex items-center gap-3"
            style={{
              opacity: cinPhase === 'running' ? 0.3 : 1,
              transition: 'opacity 0.3s',
              pointerEvents: cinPhase === 'running' ? 'none' : 'auto',
            }}
          >
            <button
              onClick={() => handleDayChange(-1)}
              className="tap-feedback flex items-center justify-center w-9 h-9 rounded-full transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => {
                setDayOffset(0);
                // Compute today's indices directly to avoid stale state
                const todayKin = getKinForDateFull(new Date());
                if (todayKin) {
                  const todaySeal = (todayKin.number - 1) % 20;
                  const todayTone = (todayKin.number - 1) % 13;
                  gearRef.current?.startAnimation(todaySeal, todayTone);
                } else {
                  gearRef.current?.startAnimation();
                }
              }}
              className="tap-feedback px-5 py-1.5 rounded-full text-[11px] font-medium transition-colors"
              style={{
                background: dayOffset !== 0 ? 'rgba(192,132,252,0.12)' : 'rgba(255,255,255,0.04)',
                color: dayOffset !== 0 ? '#c084fc' : 'var(--text-secondary)',
                border: '0.5px solid ' + (dayOffset !== 0 ? 'rgba(192,132,252,0.2)' : 'rgba(255,255,255,0.08)'),
                backdropFilter: 'blur(8px)',
              }}
            >
              Today
            </button>
            <button
              onClick={() => handleDayChange(1)}
              className="tap-feedback flex items-center justify-center w-9 h-9 rounded-full transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
          {dayOffset !== 0 && (
            <span className="text-[10px] text-[var(--text-tertiary)]">{viewedDateLabel}</span>
          )}
        </div>

        {/* Info below wheel — fades in after cinematic animation */}
        <div
          className="space-y-3"
          style={{
            opacity: cinPhase === 'complete' ? 1 : 0,
            transition: cinPhase === 'complete' ? 'opacity 0.4s ease-out' : 'none',
          }}
        >
          <KinStrip kin={kin} moonData={moonData} />
          <EnergyIntensity sealIndex={sealIndex} toneIndex={toneIndex} />
          <DeclarationCard kinNumber={kin.number} sealColourHex={kin.seal.colourHex} />
          <MicroDashboard kin={kin} />
          <MilestoneCard kin={kin} />
        </div>
      </div>

      <BottomSheet
        open={!!sheetContent}
        onClose={() => setSheetContent(null)}
        title={sheetContent?.title}
      >
        {sheetContent?.body}
      </BottomSheet>
    </>
  );
}

// ---------- Sub-components ----------

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-[var(--text-tertiary)]">{label}</div>
      <div className="text-[var(--text-primary)]">{value}</div>
    </div>
  );
}

function ToneBarDotSheet({ tone }: { tone: number }) {
  const bars = Math.floor(tone / 5);
  const dots = tone % 5;
  const colour = '#c084fc';
  const dotR = 2.5;
  const dotSpacing = 6;
  const barW = 14;
  const barH = 3.5;
  const barGap = 5;
  const sectionGap = 4;
  const dotsRowH = dots > 0 ? dotR * 2 : 0;
  const barsH = bars > 0 ? (bars - 1) * barGap + barH : 0;
  const gapH = dots > 0 && bars > 0 ? sectionGap : 0;
  const totalH = dotsRowH + gapH + barsH;
  const dotsWidth = dots > 0 ? (dots - 1) * dotSpacing + dotR * 2 : 0;
  const svgW = Math.max(barW, dotsWidth) + 2;
  const svgH = Math.max(totalH, 4) + 2;
  const midX = svgW / 2;
  const elements: React.ReactNode[] = [];
  if (dots > 0) {
    const rowW = (dots - 1) * dotSpacing;
    const startX = midX - rowW / 2;
    const dotCY = 1 + dotR;
    for (let d = 0; d < dots; d++) {
      elements.push(<circle key={`d${d}`} cx={startX + d * dotSpacing} cy={dotCY} r={dotR} fill={colour} />);
    }
  }
  if (bars > 0) {
    const firstBarY = 1 + dotsRowH + gapH;
    for (let b = 0; b < bars; b++) {
      elements.push(<rect key={`b${b}`} x={midX - barW / 2} y={firstBarY + b * barGap} width={barW} height={barH} rx={1.5} fill={colour} />);
    }
  }
  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="inline-block shrink-0">
      {elements}
    </svg>
  );
}

function OraclePill({ label, seal, colour, sealNumber }: { label: string; seal: string; colour: string; sealNumber: number }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-card)' }}>
      <SealGlyph sealNumber={sealNumber} size={20} showBg />
      <div>
        <div className="text-[9px] text-[var(--text-tertiary)]">{label}</div>
        <div className="text-xs" style={{ color: colour }}>{seal}</div>
      </div>
    </div>
  );
}
