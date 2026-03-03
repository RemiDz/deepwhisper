'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WallpaperStyle, WallpaperSize } from '@/types';
import WallpaperPreview from '@/components/WallpaperPreview';

const styles: { id: WallpaperStyle; name: string; description: string }[] = [
  { id: 'sacred-geometry', name: 'Sacred Geometry', description: 'Flower of Life pattern with text woven into circular paths' },
  { id: 'mandala', name: 'Mandala', description: 'Radial mandala with text spiralling from centre outward' },
  { id: 'cosmic', name: 'Cosmic', description: 'Deep space with scattered text at random angles and sizes' },
  { id: 'minimal', name: 'Minimal', description: 'Hundreds of tiny repetitions forming a subtle texture' },
];

const sizes: { id: WallpaperSize; name: string }[] = [
  { id: 'phone', name: 'Phone' },
  { id: 'desktop', name: 'Desktop' },
  { id: 'tablet', name: 'Tablet' },
];

export default function WallpaperPage() {
  const [affirmation, setAffirmation] = useState('');
  const [style, setStyle] = useState<WallpaperStyle>('sacred-geometry');
  const [size, setSize] = useState<WallpaperSize>('phone');
  const [reveal, setReveal] = useState(false);

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm no-underline mb-8 inline-block" style={{ color: 'var(--text-dim)' }}>
          ← Back
        </Link>

        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Subliminal Wallpaper
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-secondary)' }}>
          Embed hidden affirmations into sacred geometry art.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Controls */}
          <div className="space-y-6">
            {/* Affirmation input */}
            <div>
              <label className="text-xs font-medium mb-2 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                Your Affirmation
              </label>
              <input
                type="text"
                value={affirmation}
                onChange={e => setAffirmation(e.target.value)}
                placeholder="I am worthy of love and abundance"
                maxLength={60}
              />
              <div className="text-xs mt-1 text-right" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {affirmation.length}/60
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="text-xs font-medium mb-3 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                Style
              </label>
              <div className="space-y-2">
                {styles.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`w-full text-left studio-card p-3 transition-all ${style === s.id ? 'studio-card-selected' : ''}`}
                  >
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="text-xs font-medium mb-3 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                Size
              </label>
              <div className="pill-group">
                {sizes.map(s => (
                  <button
                    key={s.id}
                    className={`pill ${size === s.id ? 'pill-active' : ''}`}
                    onClick={() => setSize(s.id)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Reveal toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>Reveal hidden text</div>
                <div className="text-xs" style={{ color: 'var(--text-dim)' }}>See where the affirmation is embedded</div>
              </div>
              <button
                onClick={() => setReveal(!reveal)}
                className="w-12 h-6 rounded-full transition-all duration-200 relative"
                style={{
                  background: reveal ? 'var(--accent)' : 'var(--bg-surface)',
                  border: `1px solid ${reveal ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full absolute top-0.5 transition-all duration-200"
                  style={{
                    background: reveal ? 'white' : 'var(--text-dim)',
                    left: reveal ? 26 : 2,
                  }}
                />
              </button>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="text-xs font-medium mb-3 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
              Preview
            </label>
            <WallpaperPreview
              style={style}
              affirmation={affirmation}
              size={size}
              reveal={reveal}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
