'use client';

import { SEALS } from '@/lib/dreamspell/seals';
import type { Oracle } from '@/lib/dreamspell/types';

interface SealRingProps {
  activeSealNumber: number; // 0-19
  oracle?: Oracle;
  cx: number;
  cy: number;
  radius: number;
  onSealTap?: (sealNumber: number) => void;
}

export default function SealRing({ activeSealNumber, oracle, cx, cy, radius, onSealTap }: SealRingProps) {
  const oracleSeals = oracle
    ? new Set([oracle.guide.number, oracle.analog.number, oracle.antipode.number, oracle.occult.number])
    : new Set<number>();

  const sq = 29;
  const iconSz = sq - 5;

  return (
    <g>
      {SEALS.map((seal, i) => {
        const angle = ((i / 20) * 360 - 90) * (Math.PI / 180);
        const sx = cx + Math.cos(angle) * radius;
        const sy = cy + Math.sin(angle) * radius;
        const isActive = seal.number === activeSealNumber;
        const isOracle = oracleSeals.has(seal.number);
        const opacity = isActive ? 1 : isOracle ? 0.65 : 0.32;
        const borderW = isActive ? 1.5 : isOracle ? 0.8 : 0.5;
        const borderOpacity = isActive ? undefined : (isOracle ? 0.35 : 0.12);

        return (
          <g
            key={seal.number}
            onClick={() => onSealTap?.(seal.number)}
            className="cursor-pointer"
          >
            {/* Background square */}
            <rect
              x={sx - sq / 2}
              y={sy - sq / 2}
              width={sq}
              height={sq}
              rx={6}
              fill={seal.bgHex}
              opacity={opacity}
            />
            {/* Subtle border */}
            <rect
              x={sx - sq / 2}
              y={sy - sq / 2}
              width={sq}
              height={sq}
              rx={6}
              fill="none"
              stroke={isActive ? seal.colourHex : seal.colourHex}
              strokeWidth={borderW}
              opacity={borderOpacity}
              className={isActive ? 'animate-border-glow' : ''}
            />
            {/* PNG icon — completely static, no animation */}
            <image
              href={seal.iconPath}
              x={sx - iconSz / 2}
              y={sy - iconSz / 2}
              width={iconSz}
              height={iconSz}
              opacity={opacity}
            />
          </g>
        );
      })}
    </g>
  );
}
