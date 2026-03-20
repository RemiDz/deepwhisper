'use client';

import { SEALS } from '@/lib/dreamspell/seals';
import type { Oracle } from '@/lib/dreamspell/types';

interface SealRingProps {
  activeSealNumber: number;
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

  const sq = 30;
  const iconSz = sq - 4;

  return (
    <g>
      {SEALS.map((seal, i) => {
        const angle = ((i / 20) * 360 - 90) * (Math.PI / 180);
        const sx = cx + Math.cos(angle) * radius;
        const sy = cy + Math.sin(angle) * radius;
        const isActive = seal.number === activeSealNumber;
        const isOracle = oracleSeals.has(seal.number);

        // Background opacity — MUCH brighter
        const bgOpacity = isActive ? 0.9 : isOracle ? 0.7 : 0.45;
        // Border
        const borderW = isActive ? 1.5 : isOracle ? 1 : 0.7;
        const borderOpacity = isActive ? 0.7 : isOracle ? 0.5 : 0.3;

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
              opacity={bgOpacity}
            />
            {/* Border */}
            <rect
              x={sx - sq / 2}
              y={sy - sq / 2}
              width={sq}
              height={sq}
              rx={6}
              fill="none"
              stroke={seal.colourHex}
              strokeWidth={borderW}
              opacity={borderOpacity}
              className={isActive ? 'animate-border-glow' : ''}
            />
            {/* PNG icon — NEVER dimmed, always full opacity */}
            <image
              href={seal.iconPath}
              x={sx - iconSz / 2}
              y={sy - iconSz / 2}
              width={iconSz}
              height={iconSz}
            />
          </g>
        );
      })}
    </g>
  );
}
