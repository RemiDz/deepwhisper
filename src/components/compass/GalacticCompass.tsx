'use client';

import type { Kin, Oracle } from '@/lib/dreamspell/types';
import type { MoonData } from '@/lib/dreamspell/types';
import SealRing from './SealRing';
import ToneRing from './ToneRing';
import OracleLines from './OracleLines';
import MoonPhase from './MoonPhase';

interface GalacticCompassProps {
  kin: Kin;
  oracle: Oracle;
  moonData: MoonData;
  onCentreTap?: () => void;
  onSealTap?: (sealNumber: number) => void;
}

export default function GalacticCompass({ kin, oracle, moonData, onCentreTap, onSealTap }: GalacticCompassProps) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const sealRadius = size / 2 - 18;
  const toneRadius = size / 2 - 48;
  const moonSize = 68;

  const sealOverlay = (
    <img
      src={kin.seal.iconPath}
      alt={kin.seal.name}
      width={32}
      height={32}
      style={{ borderRadius: 4, opacity: 0.45, mixBlendMode: 'screen' }}
      draggable={false}
    />
  );

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-full"
      >
        {/* Subtle background rings */}
        <circle cx={cx} cy={cy} r={sealRadius + 4} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={toneRadius - 4} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={1} />

        {/* Oracle connection lines */}
        <OracleLines oracle={oracle} cx={cx} cy={cy} sealRingRadius={sealRadius} />

        {/* Seal ring (outer) */}
        <SealRing
          activeSealNumber={kin.seal.number}
          oracle={oracle}
          cx={cx}
          cy={cy}
          radius={sealRadius}
          onSealTap={onSealTap}
        />

        {/* Tone ring (inner) */}
        <ToneRing
          activeTone={kin.tone.number}
          cx={cx}
          cy={cy}
          radius={toneRadius}
        />
      </svg>

      {/* Overlay centred moon using absolute positioning */}
      <div
        className="absolute cursor-pointer"
        style={{
          width: moonSize,
          height: moonSize,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        onClick={onCentreTap}
      >
        <MoonPhase
          moonData={moonData}
          size={moonSize}
          sealGlyph={sealOverlay}
        />
      </div>
    </div>
  );
}
