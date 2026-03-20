'use client';

import type { Kin, Oracle } from '@/lib/dreamspell/types';
import type { MoonData } from '@/lib/dreamspell/types';
import SealRing from './SealRing';
import ToneRing from './ToneRing';
import OracleLines from './OracleLines';
import MoonPhase from './MoonPhase';
import SealGlyph from './SealGlyph';

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

        {/* Centre moon */}
        <g
          onClick={onCentreTap}
          className="cursor-pointer"
        >
          <MoonPhase
            moonData={moonData}
            size={moonSize}
            sealGlyph={<SealGlyph sealNumber={kin.seal.number} size={28} colour="rgba(255,255,255,0.6)" />}
          />
          {/* Position the moon in the centre — use foreignObject offset */}
          {/* Actually SVG nested positioning: translate to centre */}
        </g>
      </svg>

      {/* Overlay centred moon using absolute positioning for cleaner rendering */}
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
          sealGlyph={<SealGlyph sealNumber={kin.seal.number} size={28} colour="rgba(255,255,255,0.6)" />}
        />
      </div>
    </div>
  );
}
