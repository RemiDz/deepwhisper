'use client';

import type { Oracle } from '@/lib/dreamspell/types';

interface OracleLinesProps {
  oracle: Oracle;
  cx: number;
  cy: number;
  sealRingRadius: number;
}

const ORACLE_COLOURS = {
  guide: 'var(--purple)',
  analog: 'var(--seal-white)',
  antipode: 'var(--seal-blue)',
  occult: 'var(--seal-yellow)',
};

export default function OracleLines({ oracle, cx, cy, sealRingRadius }: OracleLinesProps) {
  const getPos = (sealNumber: number) => {
    const angle = ((sealNumber / 20) * 360 - 90) * (Math.PI / 180);
    return {
      x: cx + Math.cos(angle) * sealRingRadius,
      y: cy + Math.sin(angle) * sealRingRadius,
    };
  };

  const lines = [
    { key: 'guide', seal: oracle.guide, colour: ORACLE_COLOURS.guide },
    { key: 'analog', seal: oracle.analog, colour: ORACLE_COLOURS.analog },
    { key: 'antipode', seal: oracle.antipode, colour: ORACLE_COLOURS.antipode },
    { key: 'occult', seal: oracle.occult, colour: ORACLE_COLOURS.occult },
  ];

  return (
    <g>
      {lines.map(({ key, seal, colour }) => {
        const pos = getPos(seal.number);
        return (
          <line
            key={key}
            x1={cx}
            y1={cy}
            x2={pos.x}
            y2={pos.y}
            stroke={colour}
            strokeWidth={1}
            opacity={0.3}
            strokeDasharray="4 3"
          />
        );
      })}
    </g>
  );
}
