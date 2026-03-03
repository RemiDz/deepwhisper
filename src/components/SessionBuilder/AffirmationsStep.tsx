'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IntentionCategory } from '@/types/session';
import { affirmationLibrary, MIN_AFFIRMATIONS, MAX_AFFIRMATIONS } from '@/lib/affirmations';
import { getCategoryDef } from '@/lib/categories';

interface AffirmationsStepProps {
  category: IntentionCategory;
  selected: string[];
  customAffirmations: string[];
  onToggle: (affirmation: string) => void;
  onAddCustom: (affirmation: string) => void;
  onRemoveCustom: (affirmation: string) => void;
}

export default function AffirmationsStep({
  category,
  selected,
  customAffirmations,
  onToggle,
  onAddCustom,
  onRemoveCustom,
}: AffirmationsStepProps) {
  const [customInput, setCustomInput] = useState('');
  const library = category !== 'custom' ? affirmationLibrary[category] : [];
  const catDef = getCategoryDef(category);
  const totalSelected = selected.length;
  const canAdd = totalSelected < MAX_AFFIRMATIONS;

  const handleAddCustom = () => {
    if (customInput.trim() && canAdd) {
      onAddCustom(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div>
      <h2
        className="text-2xl md:text-3xl text-center mb-2"
        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-primary)' }}
      >
        Choose your affirmations
      </h2>
      <p className="text-center mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
        {catDef.icon} {catDef.name}
      </p>
      <p className="text-center mb-8 text-sm" style={{ color: totalSelected < MIN_AFFIRMATIONS ? 'var(--glow)' : 'var(--text-secondary)' }}>
        {totalSelected} of {library.length + customAffirmations.length} selected
        {totalSelected < MIN_AFFIRMATIONS && ` (minimum ${MIN_AFFIRMATIONS} required)`}
      </p>

      <div className="max-w-2xl mx-auto space-y-3">
        {library.map((affirmation, i) => {
          const isSelected = selected.includes(affirmation);
          return (
            <motion.label
              key={affirmation}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="flex items-center gap-3 glass-card p-4 cursor-pointer"
              style={{
                borderColor: isSelected ? 'rgba(196, 161, 255, 0.25)' : undefined,
                background: isSelected ? 'rgba(196, 161, 255, 0.05)' : undefined,
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {
                  if (!isSelected && !canAdd) return;
                  onToggle(affirmation);
                }}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-300"
                style={{
                  borderColor: isSelected ? 'var(--conscious)' : 'var(--whisper)',
                  background: isSelected ? 'var(--conscious)' : 'transparent',
                }}
              >
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="var(--void)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
                {affirmation}
              </span>
            </motion.label>
          );
        })}

        {/* Custom affirmations */}
        {customAffirmations.map((aff) => (
          <div key={aff} className="flex items-center gap-3 glass-card p-4" style={{ borderColor: 'rgba(196, 161, 255, 0.25)', background: 'rgba(196, 161, 255, 0.05)' }}>
            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: 'var(--conscious)' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="var(--void)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{aff}</span>
            <button onClick={() => onRemoveCustom(aff)} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--text-secondary)' }}>
              Remove
            </button>
          </div>
        ))}

        {/* Add custom */}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
            placeholder="Add your own affirmation..."
            className="flex-1 glass-card px-4 py-3 text-sm outline-none rounded-xl"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass)',
            }}
          />
          <button
            onClick={handleAddCustom}
            disabled={!canAdd || !customInput.trim()}
            className="btn-glass px-4 py-3 text-sm rounded-xl disabled:opacity-30"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
