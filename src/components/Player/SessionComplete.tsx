'use client';

import { motion } from 'framer-motion';
import { SubliminalSession } from '@/types/session';
import { shareSessionUrl } from '@/lib/sessions';

interface SessionCompleteProps {
  session: SubliminalSession;
  affirmationsDelivered: number;
  onPlayAgain: () => void;
  onCreateAnother: () => void;
}

export default function SessionComplete({
  session,
  affirmationsDelivered,
  onPlayAgain,
  onCreateAnother,
}: SessionCompleteProps) {
  const durationMinutes = Math.round(session.duration / 60);

  const handleShare = async () => {
    const url = shareSessionUrl(session);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copy this share link:', url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(10, 10, 15, 0.95)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 md:p-12 max-w-sm w-full text-center"
      >
        <h2
          className="text-3xl md:text-4xl mb-2 text-glow"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            color: 'var(--text-primary)',
          }}
        >
          Session Complete
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--conscious)', fontFamily: 'var(--font-body)' }}>
          Deep Whisper
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div>
            <div className="text-2xl font-medium" style={{ color: 'var(--conscious)', fontFamily: 'var(--font-mono)' }}>
              {durationMinutes}m
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Duration</div>
          </div>
          <div>
            <div className="text-2xl font-medium" style={{ color: 'var(--conscious)', fontFamily: 'var(--font-mono)' }}>
              {affirmationsDelivered}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Affirmations delivered</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button onClick={handleShare} className="btn-glass w-full py-3 text-sm">
            Share this session
          </button>
          <button onClick={onPlayAgain} className="btn-primary w-full py-3 text-sm">
            Play again
          </button>
          <button onClick={onCreateAnother} className="btn-glass w-full py-3 text-sm">
            Create another
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
