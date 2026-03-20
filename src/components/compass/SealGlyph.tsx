'use client';

import { SEALS } from '@/lib/dreamspell/seals';

interface SealGlyphProps {
  sealNumber: number;
  size?: number;
  colour?: string;
  className?: string;
}

export default function SealGlyph({ sealNumber, size = 22, colour, className }: SealGlyphProps) {
  const seal = SEALS[sealNumber];
  const c = colour ?? seal.colourHex;

  return (
    <svg
      width={size}
      height={size}
      viewBox="-14 -14 28 28"
      className={className}
      aria-label={seal.name}
    >
      <path
        d={seal.glyphPath}
        fill="none"
        stroke={c}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
