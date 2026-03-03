'use client';

import { motion } from 'framer-motion';
import { SessionBuilderState, HealingFrequency } from '@/types/session';
import { getCategoryDef } from '@/lib/categories';
import { healingFreqDescriptions } from '@/lib/audio/frequencies';

interface DurationStepProps {
  state: SessionBuilderState;
  onDurationChange: (duration: number) => void;
  onNameChange: (name: string) => void;
  onFinish: () => void;
  onSaveForLater: () => void;
  isReady: boolean;
}

const durations = [5, 10, 15, 20, 30]; // minutes

const speedLabel = { slow: 'Slow', normal: 'Normal', rapid: 'Rapid' };
const voiceLabel = { whisper: 'Whisper', gentle: 'Gentle', recorded: 'Recorded' };
const ambientLabel: Record<string, string> = {
  rain: 'Rain 🌧️', ocean: 'Ocean 🌊', forest: 'Forest 🌲',
  bowls: 'Crystal Bowls 🔮', drone: 'Deep Drone 🕉️', silence: 'Silence 🤫',
};

export default function DurationStep({
  state, onDurationChange, onNameChange, onFinish, onSaveForLater, isReady,
}: DurationStepProps) {
  const durationMinutes = state.duration / 60;
  const catDef = state.category ? getCategoryDef(state.category) : null;

  return (
    <div className="max-w-md mx-auto">
      <h2
        className="text-2xl md:text-3xl text-center mb-2"
        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-primary)' }}
      >
        Set your session
      </h2>
      <p className="text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
        Choose duration and name your session
      </p>

      {/* Duration pills */}
      <div className="flex justify-center gap-3 mb-8">
        {durations.map((d, i) => (
          <motion.button
            key={d}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onDurationChange(d * 60)}
            className="w-14 h-14 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              background: durationMinutes === d ? 'var(--conscious)' : 'var(--glass)',
              color: durationMinutes === d ? 'var(--void)' : 'var(--text-secondary)',
              border: `1px solid ${durationMinutes === d ? 'var(--conscious)' : 'var(--glass-border)'}`,
              boxShadow: durationMinutes === d ? '0 0 20px rgba(196, 161, 255, 0.3)' : 'none',
            }}
          >
            {d}m
          </motion.button>
        ))}
      </div>

      {/* Session name */}
      <div className="mb-6">
        <input
          type="text"
          value={state.name}
          onChange={e => onNameChange(e.target.value)}
          placeholder="Session name..."
          className="w-full text-center glass-card px-6 py-4 text-lg outline-none rounded-2xl"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
          }}
        />
      </div>

      {/* Session Summary */}
      <div className="glass-card p-5 mb-8 space-y-3">
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Session Summary</h3>
        {catDef && (
          <div className="flex items-center gap-2">
            <span>{catDef.icon}</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{catDef.name}</span>
          </div>
        )}
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {state.affirmations.length} affirmations
        </div>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {voiceLabel[state.voiceType]} voice · {speedLabel[state.voiceSpeed]} speed
        </div>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {ambientLabel[state.ambient] || state.ambient}
        </div>
        {state.binauralEnabled && (
          <div className="text-sm" style={{ color: 'var(--theta)' }}>
            Binaural: {state.binauralFreq}Hz beats · {state.carrierFreq}Hz carrier
          </div>
        )}
        {state.healingFreqEnabled && (
          <div className="text-sm" style={{ color: 'var(--alpha)' }}>
            Healing: {state.healingFreq}Hz — {healingFreqDescriptions[state.healingFreq as HealingFrequency]}
          </div>
        )}
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Duration: {durationMinutes} minutes
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onFinish}
          disabled={!isReady}
          className="btn-primary w-full text-lg py-4 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Create & Play
        </motion.button>
        <button
          onClick={onSaveForLater}
          disabled={!isReady}
          className="btn-glass w-full py-3 text-sm disabled:opacity-30"
        >
          Save for Later
        </button>
      </div>
    </div>
  );
}
