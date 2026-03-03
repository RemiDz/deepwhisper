'use client';

import { useState, useRef, useCallback } from 'react';
import WaveformVisualiser from './WaveformVisualiser';

interface AudioPlayerProps {
  url: string;
  buffer: AudioBuffer | null;
  duration: number;
  label?: string;
  onDelete?: () => void;
}

export default function AudioPlayer({ url, buffer, duration, label, onDelete }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying, url]);

  const formatDuration = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="studio-card flex items-center gap-3 p-3">
      <button
        onClick={togglePlay}
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
      >
        {isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="1" y="1" width="3" height="10" rx="1" />
            <rect x="8" y="1" width="3" height="10" rx="1" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2 1l9 5-9 5V1z" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        {label && <div className="text-xs mb-1 truncate" style={{ color: 'var(--text-secondary)' }}>{label}</div>}
        <WaveformVisualiser buffer={buffer} width={200} height={30} />
      </div>
      <span className="text-xs shrink-0" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
        {formatDuration(duration)}
      </span>
      {onDelete && (
        <button
          onClick={onDelete}
          className="shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors"
          style={{ color: 'var(--text-dim)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      )}
    </div>
  );
}
