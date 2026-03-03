'use client';

import { useState } from 'react';

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

// Seeded pseudo-random for deterministic output
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function ParticleField({ count = 25, className = '' }: ParticleFieldProps) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: seededRandom(i * 7 + 1) * 100,
      size: 2 + seededRandom(i * 7 + 2) * 3,
      opacity: 0.15 + seededRandom(i * 7 + 3) * 0.35,
      duration: 20 + seededRandom(i * 7 + 4) * 30,
      delay: seededRandom(i * 7 + 5) * 20,
      driftX: -30 + seededRandom(i * 7 + 6) * 60,
    }))
  );

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`} style={{ zIndex: 1 }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            '--particle-opacity': p.opacity,
            '--drift-x': `${p.driftX}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
