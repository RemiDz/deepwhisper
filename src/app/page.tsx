'use client';

import { useMemo, useState, useCallback } from 'react';
import { getKinForDateFull } from '@/lib/dreamspell/kin';
import { getOracle } from '@/lib/dreamspell/oracle';
import { getMoonDate } from '@/lib/dreamspell/moons';
import { getMoonData } from '@/lib/astronomy/moon';
import { SEALS } from '@/lib/dreamspell/seals';
import GalacticCompass from '@/components/compass/GalacticCompass';
import KinStrip from '@/components/today/KinStrip';
import MicroDashboard from '@/components/today/MicroDashboard';
import MilestoneCard from '@/components/today/MilestoneCard';
import BottomSheet from '@/components/layout/BottomSheet';

export default function TodayPage() {
  const [sheetContent, setSheetContent] = useState<{ title: string; body: React.ReactNode } | null>(null);

  const today = useMemo(() => new Date(), []);
  const kin = useMemo(() => getKinForDateFull(today), [today]);
  const oracle = useMemo(() => kin ? getOracle(kin) : null, [kin]);
  const moonData = useMemo(() => getMoonData(today), [today]);
  const moonDate = useMemo(() => getMoonDate(today), [today]);

  const handleCentreTap = useCallback(() => {
    if (!kin || !oracle) return;
    setSheetContent({
      title: kin.title,
      body: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: kin.seal.colourHex }}>Kin {kin.number}</div>
            <div className="text-sm text-[var(--text-secondary)] mt-1">{kin.title}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoRow label="Tone" value={`${kin.tone.name} — ${kin.tone.action}`} />
            <InfoRow label="Seal" value={`${kin.seal.name} — ${kin.seal.action}`} />
            <InfoRow label="Power" value={kin.seal.power} />
            <InfoRow label="Essence" value={kin.seal.essence} />
            <InfoRow label="Direction" value={kin.seal.direction} />
            <InfoRow label="Wavespell" value={`${kin.wavespell}`} />
          </div>
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="text-xs text-[var(--text-tertiary)] mb-2">FIFTH FORCE ORACLE</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <OraclePill label="Guide" seal={oracle.guide.name} colour={oracle.guide.colourHex} />
              <OraclePill label="Analog" seal={oracle.analog.name} colour={oracle.analog.colourHex} />
              <OraclePill label="Antipode" seal={oracle.antipode.name} colour={oracle.antipode.colourHex} />
              <OraclePill label="Occult" seal={oracle.occult.name} colour={oracle.occult.colourHex} />
            </div>
          </div>
        </div>
      ),
    });
  }, [kin, oracle]);

  const handleSealTap = useCallback((sealNumber: number) => {
    const seal = SEALS[sealNumber];
    setSheetContent({
      title: seal.name,
      body: (
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-xl font-bold" style={{ color: seal.colourHex }}>{seal.name}</div>
            <div className="text-xs text-[var(--text-tertiary)]">Seal {seal.number + 1} of 20</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoRow label="Colour" value={seal.colour} />
            <InfoRow label="Direction" value={seal.direction} />
            <InfoRow label="Power" value={seal.power} />
            <InfoRow label="Action" value={seal.action} />
            <InfoRow label="Essence" value={seal.essence} />
          </div>
        </div>
      ),
    });
  }, []);

  if (!kin || !oracle) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-[var(--purple)] text-lg font-medium">0.0 Hunab Ku</div>
        <p className="text-[var(--text-secondary)] text-sm mt-2">
          Today is the Day Out of Time — a day of pure being, beyond the count of days.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 py-3">
      {/* Header */}
      <header className="text-center mb-1">
        <h1 className="text-[10px] font-semibold tracking-[0.25em] text-[var(--text-tertiary)] uppercase">
          Deep Whisper
        </h1>
        {moonDate.moon && (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {moonDate.moon.name} · Day {moonDate.moonDay}
          </p>
        )}
        {moonDate.isDayOutOfTime && (
          <p className="text-xs text-[var(--purple)]">Day Out of Time</p>
        )}
      </header>

      {/* Galactic Compass — main focal element */}
      <div className="flex-1 flex items-center justify-center min-h-0 -my-2">
        <GalacticCompass
          kin={kin}
          oracle={oracle}
          moonData={moonData}
          onCentreTap={handleCentreTap}
          onSealTap={handleSealTap}
        />
      </div>

      {/* Kin Strip */}
      <div className="space-y-3 pb-2">
        <KinStrip kin={kin} moonData={moonData} />
        <MicroDashboard kin={kin} />
        <MilestoneCard kin={kin} />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        open={!!sheetContent}
        onClose={() => setSheetContent(null)}
        title={sheetContent?.title}
      >
        {sheetContent?.body}
      </BottomSheet>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-[var(--text-tertiary)]">{label}</div>
      <div className="text-[var(--text-primary)]">{value}</div>
    </div>
  );
}

function OraclePill({ label, seal, colour }: { label: string; seal: string; colour: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-card)' }}>
      <div className="w-2 h-2 rounded-full" style={{ background: colour }} />
      <div>
        <div className="text-[9px] text-[var(--text-tertiary)]">{label}</div>
        <div className="text-xs" style={{ color: colour }}>{seal}</div>
      </div>
    </div>
  );
}
