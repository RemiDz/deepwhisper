'use client';

import { motion } from 'framer-motion';
import { IntentionCategory } from '@/types/session';
import { categories } from '@/lib/categories';

interface IntentionStepProps {
  selected: IntentionCategory | null;
  onSelect: (category: IntentionCategory) => void;
}

export default function IntentionStep({ selected, onSelect }: IntentionStepProps) {
  return (
    <div>
      <h2
        className="text-2xl md:text-3xl text-center mb-2"
        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-primary)' }}
      >
        What would you like to focus on?
      </h2>
      <p className="text-center mb-8" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
        Choose the area of your life to transform
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            onClick={() => onSelect(cat.key)}
            className="glass-card p-5 text-left transition-all duration-300 relative overflow-hidden"
            style={{
              borderColor: selected === cat.key ? cat.accent + '50' : undefined,
              background: selected === cat.key ? cat.accent + '08' : undefined,
              borderLeftWidth: '3px',
              borderLeftColor: selected === cat.key ? cat.accent : 'transparent',
            }}
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <div className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
              {cat.name}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {cat.description}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
