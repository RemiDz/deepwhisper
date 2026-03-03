'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoHide } from '@/hooks/useAutoHide';

interface PlayerControlsProps {
  sessionName: string;
  isPlaying: boolean;
  timeRemaining: string;
  onPlayPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  onFullscreen: () => void;
}

export default function PlayerControls({
  sessionName,
  isPlaying,
  timeRemaining,
  onPlayPause,
  onStop,
  onVolumeChange,
  onFullscreen,
}: PlayerControlsProps) {
  const visible = useAutoHide(3000);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);

  const handleVolume = (val: number) => {
    setVolume(val);
    onVolumeChange(val);
  };

  return (
    <>
      {/* Fullscreen toggle — top-left */}
      <button
        onClick={onFullscreen}
        className="fixed top-6 left-6 z-50 glass-card p-3 rounded-full transition-opacity duration-300"
        style={{ opacity: visible ? 0.8 : 0.3, cursor: 'pointer' }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 6V2H6M12 2H16V6M16 12V16H12M6 16H2V12" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Exit button — top-right, always slightly visible */}
      <button
        onClick={onStop}
        className="fixed top-6 right-6 z-50 glass-card p-3 rounded-full transition-opacity duration-300"
        style={{ opacity: visible ? 0.8 : 0.3, cursor: 'pointer' }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 4L14 14M14 4L4 14" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Volume popup */}
      <AnimatePresence>
        {showVolume && visible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-3 rounded-2xl"
          >
            <input
              type="range"
              min={0}
              max={100}
              value={volume * 100}
              onChange={e => handleVolume(Number(e.target.value) / 100)}
              className="w-40"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-4 rounded-2xl flex items-center gap-6"
          >
            {/* Session name */}
            <span
              className="text-sm max-w-32 truncate hidden sm:block"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              {sessionName}
            </span>

            {/* Volume icon */}
            <button onClick={() => setShowVolume(v => !v)} className="transition-transform duration-300 hover:scale-110">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 7H5L9 3V15L5 11H2V7Z" fill="var(--text-secondary)" />
                {volume > 0 && <path d="M12 6C13.3 7.3 13.3 10.7 12 12" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" />}
              </svg>
            </button>

            {/* Play/Pause — centre, large */}
            <button
              onClick={onPlayPause}
              className="w-14 h-14 rounded-full glass-card flex items-center justify-center transition-transform duration-300 hover:scale-105"
              style={{ border: '1px solid rgba(196, 161, 255, 0.15)' }}
            >
              {isPlaying ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="5" y="3" width="4" height="16" rx="1" fill="var(--text-primary)" />
                  <rect x="13" y="3" width="4" height="16" rx="1" fill="var(--text-primary)" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M6 3L19 11L6 19V3Z" fill="var(--text-primary)" />
                </svg>
              )}
            </button>

            {/* Time remaining */}
            <span
              className="text-sm tabular-nums min-w-16 text-right"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
            >
              {timeRemaining}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
