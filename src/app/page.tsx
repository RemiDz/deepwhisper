'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import OrbVisualiser from '@/components/OrbVisualiser';
import ParticleField from '@/components/ParticleField';
import GradientMesh from '@/components/GradientMesh';
import GlassCard from '@/components/GlassCard';
import EcosystemBadge from '@/components/EcosystemBadge';

const features = [
  {
    title: 'Whisper',
    description: 'Your affirmations, delivered beneath conscious awareness',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" stroke="var(--conscious)" strokeWidth="1.5" opacity="0.5" />
        <path d="M12 16c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" stroke="var(--conscious)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Layer',
    description: 'Binaural beats & healing frequencies deepen the experience',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8 16h3M13 10h3v12h-3zM18 13h3v6h-3zM23 8h3v16h-3z" stroke="var(--theta)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Transform',
    description: 'Repeated listening reshapes your thought patterns',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 6v20M6 16h20" stroke="var(--glow)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="16" r="10" stroke="var(--glow)" strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <GradientMesh />
      <ParticleField count={25} />

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl mb-4 text-glow max-w-3xl"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}
        >
          What if your thoughts could hear whispers?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg mb-10 max-w-xl"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            color: 'var(--text-secondary)',
          }}
        >
          Subliminal audio. Beautifully crafted. Scientifically grounded.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-10"
        >
          <OrbVisualiser size={300} className="md:hidden" />
          <OrbVisualiser size={400} className="hidden md:block" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/create" className="btn-primary text-lg px-8 py-4 no-underline inline-block text-center">
            Experience it
          </Link>
          <Link href="/learn" className="btn-glass text-lg px-8 py-4 no-underline inline-block text-center">
            Learn how it works
          </Link>
        </motion.div>
      </section>

      {/* What is Deep Whisper */}
      <section className="relative z-10 py-24 px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl text-center mb-16"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'var(--text-primary)',
          }}
        >
          What is Deep Whisper?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <GlassCard key={feature.title} delay={i * 0.15} hoverable={false}>
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Ecosystem */}
      <section className="relative z-10 py-16 px-6 text-center">
        <EcosystemBadge />
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 text-center border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
          Built with 🔮 by{' '}
          <a href="https://harmonicwaves.app" target="_blank" rel="noopener noreferrer" className="no-underline" style={{ color: 'var(--conscious)' }}>
            Harmonic Waves
          </a>
        </p>
        <div className="flex items-center justify-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <a href="https://deepwhisper.app" className="no-underline" style={{ color: 'var(--text-secondary)' }}>deepwhisper.app</a>
          <span>·</span>
          <a href="https://harmonicwaves.app" target="_blank" rel="noopener noreferrer" className="no-underline" style={{ color: 'var(--text-secondary)' }}>Harmonic Waves</a>
        </div>
      </footer>
    </main>
  );
}
