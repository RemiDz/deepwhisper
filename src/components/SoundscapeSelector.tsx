'use client';

import { useRef, useCallback } from 'react';
import { AmbientType, BinauralPreset, HealingFrequency } from '@/types';
import { previewAmbient } from '@/lib/audio/ambients';

interface SoundscapeSelectorProps {
  ambient: AmbientType;
  binaural: BinauralPreset;
  carrierFreq: number;
  healingFreq: HealingFrequency;
  onAmbientChange: (a: AmbientType) => void;
  onBinauralChange: (b: BinauralPreset) => void;
  onCarrierChange: (f: number) => void;
  onHealingChange: (f: HealingFrequency) => void;
}

const ambients: { id: AmbientType; name: string; icon: string }[] = [
  { id: 'rain', name: 'Rain', icon: '🌧️' },
  { id: 'ocean', name: 'Ocean', icon: '🌊' },
  { id: 'forest', name: 'Forest', icon: '🌲' },
  { id: 'bowls', name: 'Bowls', icon: '🔮' },
  { id: 'drone', name: 'Drone', icon: '🕉️' },
  { id: 'pink-noise', name: 'Pink Noise', icon: '🎀' },
  { id: 'brown-noise', name: 'Brown Noise', icon: '🟤' },
  { id: 'silence', name: 'Silence', icon: '🤫' },
];

const binauralPresets: { id: BinauralPreset; name: string }[] = [
  { id: 'off', name: 'Off' },
  { id: 'theta', name: 'Theta 6Hz' },
  { id: 'alpha', name: 'Alpha 10Hz' },
  { id: 'delta', name: 'Delta 2Hz' },
];

const healingPresets: { freq: HealingFrequency; name: string }[] = [
  { freq: 0, name: 'Off' },
  { freq: 432, name: '432Hz' },
  { freq: 528, name: '528Hz' },
  { freq: 396, name: '396Hz' },
  { freq: 639, name: '639Hz' },
];

export default function SoundscapeSelector({
  ambient,
  binaural,
  carrierFreq,
  healingFreq,
  onAmbientChange,
  onBinauralChange,
  onCarrierChange,
  onHealingChange,
}: SoundscapeSelectorProps) {
  const stopPreviewRef = useRef<(() => void) | null>(null);

  const handleAmbientClick = useCallback((type: AmbientType) => {
    onAmbientChange(type);
    // Preview on select
    if (stopPreviewRef.current) stopPreviewRef.current();
    const stop = previewAmbient(type);
    stopPreviewRef.current = stop;
  }, [onAmbientChange]);

  return (
    <div className="space-y-6">
      {/* Ambient */}
      <div>
        <h4 className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Ambient</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {ambients.map(a => (
            <button
              key={a.id}
              onClick={() => handleAmbientClick(a.id)}
              className="shrink-0 px-4 py-3 rounded-xl text-center transition-all duration-200"
              style={{
                background: ambient === a.id ? 'var(--accent-soft)' : 'var(--bg-surface)',
                border: `1px solid ${ambient === a.id ? 'var(--accent)' : 'var(--border)'}`,
                minWidth: 80,
              }}
            >
              <div className="text-xl mb-1">{a.icon}</div>
              <div className="text-xs" style={{ color: ambient === a.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {a.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Binaural */}
      <div>
        <h4 className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
          Binaural Beats {binaural !== 'off' && <span style={{ color: 'var(--accent)' }}>🎧</span>}
        </h4>
        <div className="pill-group">
          {binauralPresets.map(b => (
            <button
              key={b.id}
              className={`pill ${binaural === b.id ? 'pill-active' : ''}`}
              onClick={() => onBinauralChange(b.id)}
            >
              {b.name}
            </button>
          ))}
        </div>
        {binaural !== 'off' && (
          <div className="mt-3">
            <label className="text-xs" style={{ color: 'var(--text-dim)' }}>
              Carrier: <span style={{ fontFamily: 'var(--font-mono)' }}>{carrierFreq}Hz</span>
            </label>
            <input
              type="range"
              min={100}
              max={400}
              value={carrierFreq}
              onChange={e => onCarrierChange(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Healing frequency */}
      <div>
        <h4 className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Healing Frequency</h4>
        <div className="pill-group">
          {healingPresets.map(h => (
            <button
              key={h.freq}
              className={`pill ${healingFreq === h.freq ? 'pill-active' : ''}`}
              onClick={() => onHealingChange(h.freq)}
            >
              {h.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
