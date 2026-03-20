'use client';

import { SEALS } from '@/lib/dreamspell/seals';

interface SealGlyphProps {
  sealNumber: number;
  size?: number;
  className?: string;
  opacity?: number;
  showBg?: boolean;
  moonOverlay?: boolean;
}

/**
 * Renders a solar seal as a PNG icon image.
 * Used in HTML contexts (pages, cards, bottom sheets).
 * For SVG contexts (SealRing), use the SVG <image> element directly.
 */
export default function SealGlyph({
  sealNumber,
  size = 22,
  className,
  opacity = 1,
  showBg = false,
  moonOverlay = false,
}: SealGlyphProps) {
  const seal = SEALS[sealNumber];

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        borderRadius: showBg ? Math.max(6, size * 0.15) : 4,
        background: showBg ? seal.bgHex : 'transparent',
        opacity,
        ...(moonOverlay ? { mixBlendMode: 'screen' as const } : {}),
      }}
    >
      <img
        src={seal.iconPath}
        alt={seal.name}
        width={showBg ? size * 0.8 : size}
        height={showBg ? size * 0.8 : size}
        style={{
          borderRadius: 4,
          display: 'block',
          pointerEvents: 'none',
        }}
        draggable={false}
      />
    </div>
  );
}
