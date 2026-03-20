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

  const squareSize = 28;
  const iconSize = squareSize - 4;

  return (
    <g>
      {SEALS.map((seal, i) => {
        const angle = ((i / 20) * 360 - 90) * (Math.PI / 180);
        const sx = cx + Math.cos(angle) * radius;
        const sy = cy + Math.sin(angle) * radius;
        const isActive = seal.number === activeSealNumber;
        const isOracle = oracleSeals.has(seal.number);
        const opacity = isActive ? 1 : isOracle ? 0.8 : 0.35;

        return (
          <g
            key={seal.number}
            onClick={() => onSealTap?.(seal.number)}
            className="cursor-pointer"
            opacity={opacity}
          >
            {/* Background square */}
            <rect
              x={sx - squareSize / 2}
              y={sy - squareSize / 2}
              width={squareSize}
              height={squareSize}
              rx={6}
              fill={seal.bgHex}
            />
            {/* PNG icon */}
            <image
              href={seal.iconPath}
              x={sx - iconSize / 2}
              y={sy - iconSize / 2}
              width={iconSize}
              height={iconSize}
              className={isActive ? 'animate-pulse-gentle' : ''}
            />
          </g>
        );
      })}
    </g>
  );
}
