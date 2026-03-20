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
  const size = 350;
  const cx = size / 2;
  const cy = size / 2;

  // Ring radii — proportionally larger
  const moonSize = 86;
  const moonRadius = moonSize / 2 - 2;
  const sealRadius = 150;
  const sealSquareSize = 30;
  const toneRadius = Math.round(sealRadius * 0.55); // ~82, halfway between moon and seals

  const sealOverlay = (
    <img
      src={kin.seal.iconPath}
      alt={kin.seal.name}
      width={42}
      height={42}
      style={{ borderRadius: 4, mixBlendMode: 'screen' as const, display: 'block' }}
      draggable={false}
    />
  );

  return (
    <div className="relative flex items-center justify-center w-full" style={{ maxWidth: size, aspectRatio: '1' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-full max-h-full"
      >
        {/* Structural ring guides */}
        <circle cx={cx} cy={cy} r={sealRadius + sealSquareSize / 2 + 3} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={toneRadius + 18} fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={toneRadius - 18} fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth={0.5} />

        {/* Oracle connection lines */}
        <OracleLines
          oracle={oracle}
          cx={cx}
          cy={cy}
          moonRadius={moonRadius}
          sealRingRadius={sealRadius}
          sealSquareSize={sealSquareSize}
        />

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

      {/* Centre moon */}
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
