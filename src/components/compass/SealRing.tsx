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

        const bgOpacity = isActive ? 0.9 : isOracle ? 0.7 : 0.35;
        const borderW = isActive ? 2 : isOracle ? 1 : 0.5;
        const borderOpacity = isActive ? 0.8 : isOracle ? 0.5 : 0.2;

        return (
          <g
            key={seal.number}
            onClick={() => onSealTap?.(seal.number)}
            className="cursor-pointer"
          >
            {/* Static glow behind active seal — no animation */}
            {isActive && (
              <rect
                x={sx - sq / 2 - 3}
                y={sy - sq / 2 - 3}
                width={sq + 6}
                height={sq + 6}
                rx={8}
                fill="none"
                stroke={seal.colourHex}
                strokeWidth={1}
                opacity={0.25}
              />
            )}
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
            {/* Border — static, no animation */}
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
            />
            {/* PNG icon — static, full opacity, no animation */}
            <image
              href={seal.iconPath}
              x={sx - iconSz / 2}
              y={sy - iconSz / 2}
              width={iconSz}
              height={iconSz}
              pointerEvents="all"
              style={{ filter: isActive
                ? `drop-shadow(0 0 8px ${seal.colourHex}80) drop-shadow(0 2px 4px rgba(0,0,0,0.5))`
                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
              }}
            />
          </g>
        );
      })}
    </g>
  );
}
