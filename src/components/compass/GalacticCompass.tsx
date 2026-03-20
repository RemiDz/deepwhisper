'use client';

import type { Kin, Oracle } from '@/lib/dreamspell/types';
import type { MoonData } from '@/lib/dreamspell/types';
import SealRing from './SealRing';
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

  // Active tone glyph position — same angle as active seal, 20px inside
  const activeSealAngle = ((kin.seal.number / 20) * 360 - 90) * (Math.PI / 180);
  const toneGlyphRadius = sealRadius - 20;
  const toneX = cx + Math.cos(activeSealAngle) * toneGlyphRadius;
  const toneY = cy + Math.sin(activeSealAngle) * toneGlyphRadius;

  // Depth ring radii
  const depthRing1 = sealRadius + sealSquareSize / 2 + 8;
  const depthRing2 = (sealRadius + moonRadius) / 2;
  const depthRing3 = moonRadius + 20;

  return (
    <div className="relative flex items-center justify-center w-full" style={{ maxWidth: size, aspectRatio: '1' }}>
      {/* 2a. Background glow behind compass */}
      <div
        className="absolute"
        style={{
          width: '110%',
          height: '110%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.06) 0%, rgba(30,30,60,0.08) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-full max-h-full relative"
        style={{ zIndex: 1 }}
      >
        {/* 2b. Concentric depth rings */}
        <circle cx={cx} cy={cy} r={depthRing1} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={depthRing2} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={depthRing3} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth={0.5} />

        {/* Structural ring guide */}
        <circle cx={cx} cy={cy} r={sealRadius + sealSquareSize / 2 + 3} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />

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

        {/* Active tone bar-dot glyph — one symbol, inside seal ring at active seal angle */}
        <ActiveToneGlyph tone={kin.tone.number} x={toneX} y={toneY} />

        {/* Zodiac sign name above moon */}
        {moonData.zodiacSign && (
          <text
            x={cx}
            y={cy - moonRadius - 8}
            textAnchor="middle"
            fill="#a78bfa"
            fontSize={10}
            pointerEvents="none"
          >
            {moonData.zodiacSign}
          </text>
        )}

        {/* Moon info text elements */}
        <text
          x={cx}
          y={cy + moonRadius + 14}
          textAnchor="middle"
          fill="#9ca3af"
          fontSize={9}
          pointerEvents="none"
        >
          {moonData.phaseName} · {Math.round(moonData.illumination)}%
        </text>
      </svg>

      {/* Centre moon with 2d depth styling */}
      <div
        className="absolute cursor-pointer"
        style={{
          width: moonSize,
          height: moonSize,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          borderRadius: '50%',
        }}
        onClick={onCentreTap}
      >
        <MoonPhase
          moonData={moonData}
          size={moonSize}
          zodiacSign={moonData.zodiacSign}
        />
      </div>

      {/* 2e. Vignette on compass edges */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.3) 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
    </div>
  );
}

/** Mayan bar-dot glyph for the active tone on the compass. */
function ActiveToneGlyph({ tone, x, y }: { tone: number; x: number; y: number }) {
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
  const topY = y - totalH / 2;

  const elements: React.ReactNode[] = [];

  if (dots > 0) {
    const dotsWidth = (dots - 1) * dotSpacing;
    const dotStartX = x - dotsWidth / 2;
    const dotCY = topY + dotR;
    for (let d = 0; d < dots; d++) {
      elements.push(<circle key={`d${d}`} cx={dotStartX + d * dotSpacing} cy={dotCY} r={dotR} fill={colour} />);
    }
  }

  if (bars > 0) {
    const firstBarY = topY + dotsRowH + gapH;
    for (let b = 0; b < bars; b++) {
      const barY = firstBarY + b * barGap;
      elements.push(<rect key={`b${b}`} x={x - barW / 2} y={barY} width={barW} height={barH} rx={1.5} fill={colour} />);
    }
  }

  return (
    <g style={{ filter: 'drop-shadow(0 0 4px rgba(192,132,252,0.5))' }} pointerEvents="none">
      {elements}
    </g>
  );
}
