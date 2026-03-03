'use client';

import { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ParticleField from '@/components/ParticleField';
import GradientMesh from '@/components/GradientMesh';
import OrbVisualiser from '@/components/OrbVisualiser';
import { decodeSharedSession, importSession } from '@/lib/sessions';
import { getCategoryDef, getCategoryAccent } from '@/lib/categories';

const ambientLabels: Record<string, string> = {
  rain: '🌧️ Rain', ocean: '🌊 Ocean', forest: '🌲 Forest',
  bowls: '🔮 Crystal Bowls', drone: '🕉️ Deep Drone', silence: '🤫 Silence',
};

export default function SharedSessionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { session, error } = useMemo(() => {
    const data = searchParams.get('d');
    if (data) {
      const decoded = decodeSharedSession(data);
      if (decoded) return { session: decoded, error: false };
      return { session: null, error: true };
    }
    return { session: null, error: true };
  }, [searchParams]);

  const handlePlay = () => {
    if (!session) return;
    const imported = importSession(session);
    router.push(`/play/${imported.id}`);
  };

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'var(--void)' }}>
        <h1 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Session not found</h1>
        <Link href="/create" className="btn-primary px-8 py-3 no-underline">Create your own</Link>
      </main>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--void)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--conscious)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const catDef = getCategoryDef(session.category);
  const color = getCategoryAccent(session.category);
  const durationMinutes = Math.round(session.duration / 60);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <GradientMesh />
      <ParticleField count={20} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 glass-card p-8 md:p-12 max-w-md w-full text-center"
      >
        {/* Logo */}
        <p className="text-sm mb-4" style={{ color: 'var(--conscious)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
          Deep Whisper
        </p>

        <div className="mb-6 flex justify-center">
          <OrbVisualiser size={120} color={color} />
        </div>

        <h1 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-primary)' }}>
          {session.name}
        </h1>

        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-lg">{catDef.icon}</span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{catDef.name}</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <span className="glass-card px-3 py-1 rounded-full text-xs" style={{ color: 'var(--text-secondary)' }}>
            {durationMinutes} min
          </span>
          <span className="glass-card px-3 py-1 rounded-full text-xs" style={{ color: 'var(--text-secondary)' }}>
            {session.affirmations.length} affirmations
          </span>
          <span className="glass-card px-3 py-1 rounded-full text-xs" style={{ color: 'var(--text-secondary)' }}>
            {ambientLabels[session.soundscape.ambient] || session.soundscape.ambient}
          </span>
          {session.soundscape.binauralEnabled && (
            <span className="glass-card px-3 py-1 rounded-full text-xs" style={{ color: 'var(--theta)' }}>
              {session.soundscape.binauralFreq}Hz binaural
            </span>
          )}
          {session.soundscape.healingFreqEnabled && (
            <span className="glass-card px-3 py-1 rounded-full text-xs" style={{ color: 'var(--alpha)' }}>
              {session.soundscape.healingFreq}Hz healing
            </span>
          )}
        </div>

        <div className="space-y-3">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={handlePlay} className="btn-primary w-full py-4 text-base">
            Play This Session
          </motion.button>
          <Link href="/create" className="btn-glass w-full py-3 text-sm no-underline block">
            Create Your Own
          </Link>
        </div>
      </motion.div>

      {/* Branding */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--conscious)' }}>Deep Whisper</span>
          {' '}— Subliminal audio intelligence
        </p>
        <a href="https://deepwhisper.app" className="text-xs no-underline mt-1 inline-block" style={{ color: 'var(--text-secondary)' }}>
          deepwhisper.app
        </a>
      </div>
    </main>
  );
}
