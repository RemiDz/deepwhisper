'use client';

import type { Oracle } from '@/lib/dreamspell/types';

interface OracleLinesProps {
  oracle: Oracle;
  cx: number;
  cy: number;
  moonRadius: number;
  sealRingRadius: number;
  sealSquareSize: number;
}

const ORACLE_STYLES = {
  guide:    { colour: '#eab308', width: 0.8 },
  analog:   { colour: '#e8e6df', width: 0.7 },
  antipode: { colour: '#3b82f6', width: 0.7 },
  occult:   { colour: '#a855f7', width: 0.7 },
};

export default function OracleLines({ oracle, cx, cy, moonRadius, sealRingRadius, sealSquareSize }: OracleLinesProps) {
  const halfSq = sealSquareSize / 2;

  const getEndpoints = (sealNumber: number) => {
    const angle = ((sealNumber / 20) * 360 - 90) * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    // Start from moon edge
    const x1 = cx + cos * moonRadius;
    const y1 = cy + sin * moonRadius;
    // End at seal square edge
    const x2 = cx + cos * (sealRingRadius - halfSq);
    const y2 = cy + sin * (sealRingRadius - halfSq);
    // Midpoint
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return { x1, y1, x2, y2, mx, my };
  };

  const lines = [
    { key: 'guide', seal: oracle.guide, style: ORACLE_STYLES.guide },
    { key: 'analog', seal: oracle.analog, style: ORACLE_STYLES.analog },
    { key: 'antipode', seal: oracle.antipode, style: ORACLE_STYLES.antipode },
    { key: 'occult', seal: oracle.occult, style: ORACLE_STYLES.occult },
  ];

  return (
    <g>
      <defs>
        {lines.map(({ key, seal, style }) => {
          const { x1, y1, x2, y2 } = getEndpoints(seal.number);
          return (
            <linearGradient key={`grad-${key}`} id={`oracle-grad-${key}`} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={style.colour} stopOpacity={0.02} />
              <stop offset="100%" stopColor={style.colour} stopOpacity={0.15} />
            </linearGradient>
          );
        })}
      </defs>
      {lines.map(({ key, seal, style }) => {
        const { x1, y1, x2, y2, mx, my } = getEndpoints(seal.number);
        return (
          <g key={key}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={`url(#oracle-grad-${key})`}
              strokeWidth={0.8}
              strokeDasharray="4 3"
            />
            {/* Midpoint dot */}
            <circle cx={mx} cy={my} r={1.5} fill={style.colour} opacity={0.25} />
          </g>
        );
      })}
    </g>
  );
}
