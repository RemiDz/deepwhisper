'use client';

import { useState, useEffect, useRef } from 'react';

interface WhisperWallProps {
  affirmations: string[];
  className?: string;
}

interface Whisper {
  id: number;
  text: string;
  x: number;
  opacity: number;
  duration: number;
  delay: number;
  size: number;
}

// Seeded pseudo-random for deterministic initial render
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function WhisperWall({ affirmations, className = '' }: WhisperWallProps) {
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const maxVisible = isMobile ? 5 : 8;
  const counterRef = useRef(maxVisible);

  // Compute initial whispers deterministically in state initializer (no useEffect needed)
  const [activeWhispers, setActiveWhispers] = useState<Whisper[]>(() => {
    if (affirmations.length === 0) return [];
    const initial: Whisper[] = [];
    for (let i = 0; i < maxVisible; i++) {
      initial.push({
        id: i,
        text: affirmations[i % affirmations.length],
        x: 10 + seededRandom(i * 5 + 1) * 80,
        opacity: 0.03 + seededRandom(i * 5 + 2) * 0.05,
        duration: 30 + seededRandom(i * 5 + 3) * 30,
        delay: i * (3 + seededRandom(i * 5 + 4) * 2),
        size: isMobile ? 16 + seededRandom(i * 5 + 5) * 6 : 20 + seededRandom(i * 5 + 5) * 14,
      });
    }
    return initial;
  });

  // Continuously cycle new whispers
  useEffect(() => {
    if (affirmations.length === 0) return;

    const interval = setInterval(() => {
      const c = counterRef.current++;
      setActiveWhispers(prev => {
        const newWhisper: Whisper = {
          id: c,
          text: affirmations[c % affirmations.length],
          x: 10 + Math.random() * 80,
          opacity: 0.03 + Math.random() * 0.05,
          duration: 30 + Math.random() * 30,
          delay: 0,
          size: isMobile ? 16 + Math.random() * 6 : 20 + Math.random() * 14,
        };
        const kept = prev.length >= maxVisible * 2 ? prev.slice(-maxVisible) : prev;
        return [...kept, newWhisper];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [affirmations, isMobile, maxVisible]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`} style={{ zIndex: 2 }}>
      {activeWhispers.map((w) => (
        <span
          key={w.id}
          className="absolute whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: w.size,
            color: 'var(--text-primary)',
            opacity: w.opacity,
            left: `${w.x}%`,
            bottom: '-5%',
            animation: `whisper-rise ${w.duration}s linear ${w.delay}s forwards`,
          }}
        >
          {w.text}
        </span>
      ))}
      <style jsx>{`
        @keyframes whisper-rise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          5% {
            opacity: 0.05;
          }
          95% {
            opacity: 0.05;
          }
          100% {
            transform: translateY(-120vh) translateX(${isMobile ? 30 : 50}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
