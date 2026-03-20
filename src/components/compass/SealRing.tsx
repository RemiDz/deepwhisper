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

  return (
    <g>
      {SEALS.map((seal, i) => {
        const angle = ((i / 20) * 360 - 90) * (Math.PI / 180);
        const sx = cx + Math.cos(angle) * radius;
        const sy = cy + Math.sin(angle) * radius;
        const isActive = seal.number === activeSealNumber;
        const isOracle = oracleSeals.has(seal.number);
        const opacity = isActive ? 1 : isOracle ? 0.8 : 0.25;
        const squareSize = 22;

        return (
          <g
            key={seal.number}
            onClick={() => onSealTap?.(seal.number)}
            className="cursor-pointer"
          >
            {/* Background square */}
            <rect
              x={sx - squareSize / 2}
              y={sy - squareSize / 2}
              width={squareSize}
              height={squareSize}
              rx={3}
              fill={seal.bgHex}
              opacity={opacity}
            />
            {/* Glyph */}
            <g
              transform={`translate(${sx}, ${sy})`}
              opacity={opacity}
              className={isActive ? 'animate-pulse-gentle' : ''}
            >
              <svg viewBox="-14 -14 28 28" width={squareSize - 4} height={squareSize - 4} x={-(squareSize - 4) / 2} y={-(squareSize - 4) / 2}>
                <path
                  d={seal.glyphPath}
                  fill="none"
                  stroke={seal.colourHex}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </g>
          </g>
        );
      })}
    </g>
  );
}
