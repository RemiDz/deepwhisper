'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AmbientType, BinauralPreset, HealingFrequency } from '@/types/session';
import { previewAmbient } from '@/lib/audio/ambients';
import { healingFreqDescriptions } from '@/lib/audio/frequencies';
import { binauralPresets } from '@/lib/audio/binaural';

interface SoundscapeStepProps {
  ambient: AmbientType;
  binauralEnabled: boolean;
  binauralPreset: BinauralPreset;
  binauralFreq: number;
  carrierFreq: number;
  healingFreqEnabled: boolean;
  healingFreq: HealingFrequency;
  onAmbientChange: (ambient: AmbientType) => void;
  onBinauralEnabledChange: (enabled: boolean) => void;
  onBinauralPresetChange: (preset: BinauralPreset) => void;
  onBinauralFreqChange: (freq: number) => void;
  onCarrierFreqChange: (freq: number) => void;
  onHealingFreqEnabledChange: (enabled: boolean) => void;
  onHealingFreqChange: (freq: HealingFrequency) => void;
}

const ambients: { id: AmbientType; name: string; icon: string; desc: string }[] = [
  { id: 'rain', name: 'Rain', icon: '🌧️', desc: 'Gentle rainfall' },
  { id: 'ocean', name: 'Ocean', icon: '🌊', desc: 'Rolling waves' },
  { id: 'forest', name: 'Forest', icon: '🌲', desc: 'Woodland ambience' },
  { id: 'bowls', name: 'Crystal Bowls', icon: '🔮', desc: '432Hz singing bowls' },
  { id: 'drone', name: 'Deep Drone', icon: '🕉️', desc: 'Meditative resonance' },
  { id: 'silence', name: 'Silence', icon: '🤫', desc: 'Subliminal voice only' },
];

const binauralOptions: { id: BinauralPreset; name: string; freq?: number }[] = [
  { id: 'theta', name: 'Theta 6Hz', freq: 6 },
  { id: 'alpha', name: 'Alpha 10Hz', freq: 10 },
  { id: 'delta', name: 'Delta 2Hz', freq: 2 },
  { id: 'custom', name: 'Custom' },
];

const healingFreqs: HealingFrequency[] = [432, 528, 396, 639];

export default function SoundscapeStep({
  ambient, binauralEnabled, binauralPreset, binauralFreq, carrierFreq,
  healingFreqEnabled, healingFreq,
  onAmbientChange, onBinauralEnabledChange, onBinauralPresetChange,
  onBinauralFreqChange, onCarrierFreqChange,
  onHealingFreqEnabledChange, onHealingFreqChange,
}: SoundscapeStepProps) {
  const [binauralOpen, setBinauralOpen] = useState(binauralEnabled);
  const [healingOpen, setHealingOpen] = useState(healingFreqEnabled);
  const previewStopRef = useRef<(() => void) | null>(null);

  const handleAmbientSelect = useCallback((type: AmbientType) => {
    // Stop any existing preview
    if (previewStopRef.current) {
      previewStopRef.current();
      previewStopRef.current = null;
    }
    onAmbientChange(type);
    // Play 3-second preview
    const stop = previewAmbient(type);
    previewStopRef.current = stop;
  }, [onAmbientChange]);

  const handleBinauralPreset = useCallback((preset: BinauralPreset) => {
    onBinauralPresetChange(preset);
    if (preset !== 'custom' && binauralPresets[preset]) {
      onBinauralFreqChange(binauralPresets[preset]);
    }
  }, [onBinauralPresetChange, onBinauralFreqChange]);

  return (
    <div className="max-w-2xl mx-auto">
      <h2
        className="text-2xl md:text-3xl text-center mb-2"
        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-primary)' }}
      >
        Choose your soundscape
      </h2>
      <p className="text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
        Layer ambient sounds, binaural beats, and healing frequencies
      </p>

      {/* Ambient */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Ambient Sound</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
          {ambients.map((amb, i) => (
            <motion.button
              key={amb.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleAmbientSelect(amb.id)}
              className="glass-card p-4 text-center shrink-0 w-28"
              style={{
                borderColor: ambient === amb.id ? 'rgba(196, 161, 255, 0.3)' : undefined,
                background: ambient === amb.id ? 'rgba(196, 161, 255, 0.05)' : undefined,
              }}
            >
              <div className="text-2xl mb-2">{amb.icon}</div>
              <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>{amb.name}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{amb.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Binaural Beats — Collapsible */}
      <div className="mb-6 glass-card overflow-hidden">
        <button
          className="w-full p-4 flex items-center justify-between"
          onClick={() => {
            const next = !binauralOpen;
            setBinauralOpen(next);
            onBinauralEnabledChange(next);
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Binaural Beats</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>🎧 Headphones recommended</span>
          </div>
          <div
            className="w-10 h-5 rounded-full relative transition-all duration-300"
            style={{ background: binauralEnabled ? 'var(--conscious)' : 'var(--whisper)' }}
          >
            <div
              className="w-4 h-4 rounded-full absolute top-0.5 transition-all duration-300"
              style={{
                background: 'white',
                left: binauralEnabled ? 22 : 2,
              }}
            />
          </div>
        </button>
        {binauralOpen && binauralEnabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 pb-4 space-y-3"
          >
            <div className="flex flex-wrap gap-2">
              {binauralOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleBinauralPreset(opt.id)}
                  className="px-4 py-2 rounded-full text-sm transition-all duration-300"
                  style={{
                    background: binauralPreset === opt.id ? 'var(--theta)' : 'var(--glass)',
                    color: binauralPreset === opt.id ? 'var(--void)' : 'var(--text-secondary)',
                    border: `1px solid ${binauralPreset === opt.id ? 'var(--theta)' : 'var(--glass-border)'}`,
                  }}
                >
                  {opt.name}
                </button>
              ))}
            </div>
            {binauralPreset === 'custom' && (
              <div className="flex items-center gap-3">
                <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Beat Hz:</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={binauralFreq}
                  onChange={e => onBinauralFreqChange(Number(e.target.value))}
                  className="w-20 glass-card px-3 py-1.5 text-sm rounded-lg outline-none"
                  style={{ color: 'var(--text-primary)', background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Carrier: {carrierFreq}Hz</label>
              <input
                type="number"
                min={100}
                max={500}
                value={carrierFreq}
                onChange={e => onCarrierFreqChange(Number(e.target.value))}
                className="w-20 glass-card px-3 py-1.5 text-sm rounded-lg outline-none"
                style={{ color: 'var(--text-primary)', background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Healing Frequency — Collapsible */}
      <div className="glass-card overflow-hidden">
        <button
          className="w-full p-4 flex items-center justify-between"
          onClick={() => {
            const next = !healingOpen;
            setHealingOpen(next);
            onHealingFreqEnabledChange(next);
          }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Healing Frequency</span>
          <div
            className="w-10 h-5 rounded-full relative transition-all duration-300"
            style={{ background: healingFreqEnabled ? 'var(--alpha)' : 'var(--whisper)' }}
          >
            <div
              className="w-4 h-4 rounded-full absolute top-0.5 transition-all duration-300"
              style={{
                background: 'white',
                left: healingFreqEnabled ? 22 : 2,
              }}
            />
          </div>
        </button>
        {healingOpen && healingFreqEnabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 pb-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {healingFreqs.map(f => (
                <button
                  key={f}
                  onClick={() => onHealingFreqChange(f)}
                  className="glass-card p-3 text-center rounded-xl"
                  style={{
                    borderColor: healingFreq === f ? 'rgba(255, 217, 61, 0.3)' : undefined,
                    background: healingFreq === f ? 'rgba(255, 217, 61, 0.05)' : undefined,
                  }}
                >
                  <div className="text-sm font-medium mb-0.5" style={{ color: healingFreq === f ? 'var(--alpha)' : 'var(--text-primary)' }}>
                    {f} Hz
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {healingFreqDescriptions[f]}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
