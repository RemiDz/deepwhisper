'use client';

import { motion } from 'framer-motion';

export default function EcosystemBadge() {
  return (
    <motion.a
      href="https://harmonicwaves.app"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-3 glass-card px-5 py-3 rounded-full no-underline"
      style={{ cursor: 'pointer' }}
    >
      <span className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
        Part of
      </span>
      <span className="text-sm font-medium" style={{ color: 'var(--conscious)', fontFamily: 'var(--font-body)' }}>
        Harmonic Waves
      </span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }} />
      </svg>
    </motion.a>
  );
}
