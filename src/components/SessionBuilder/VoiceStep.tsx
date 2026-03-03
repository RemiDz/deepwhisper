'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { VoiceType, VoiceSpeed } from '@/types/session';

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface VoiceStepProps {
  voiceType: VoiceType;
  voiceSpeed: VoiceSpeed;
  subliminalDepth: number;
  recordedAudioUrl?: string;
  onTypeChange: (type: VoiceType) => void;
  onSpeedChange: (speed: VoiceSpeed) => void;
  onDepthChange: (depth: number) => void;
  onRecordedAudioChange: (url: string | undefined) => void;
}

const voiceTypes: { id: VoiceType; name: string; icon: string; description: string; badge?: string }[] = [
  { id: 'whisper', name: 'Whisper', icon: '🤫', description: 'Soft, barely perceptible — the classic subliminal approach', badge: 'Recommended' },
  { id: 'gentle', name: 'Gentle', icon: '🕊️', description: 'Softly spoken, slightly more present' },
  { id: 'recorded', name: 'Record Your Own', icon: '🎙️', description: 'Your own voice is most powerful for self-programming' },
];

const speeds: { id: VoiceSpeed; name: string }[] = [
  { id: 'slow', name: 'Slow' },
  { id: 'normal', name: 'Normal' },
  { id: 'rapid', name: 'Rapid' },
];

export default function VoiceStep({
  voiceType,
  voiceSpeed,
  subliminalDepth,
  recordedAudioUrl,
  onTypeChange,
  onSpeedChange,
  onDepthChange,
  onRecordedAudioChange,
}: VoiceStepProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(!!recordedAudioUrl);
  const [micDenied, setMicDenied] = useState(false);
  const [waveformBars] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      height: 20 + seededRandom(i * 3 + 1) * 80,
      duration: 0.5 + seededRandom(i * 3 + 2),
    }))
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const depthPercent = Math.round(((subliminalDepth - 0.02) / 0.13) * 100);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        onRecordedAudioChange(url);
        setHasRecording(true);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setMicDenied(false);
    } catch {
      setMicDenied(true);
    }
  }, [onRecordedAudioChange]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const playRecording = useCallback(() => {
    if (recordedAudioUrl) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(recordedAudioUrl);
      audioRef.current.play();
    }
  }, [recordedAudioUrl]);

  const reRecord = useCallback(() => {
    if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    onRecordedAudioChange(undefined);
    setHasRecording(false);
  }, [recordedAudioUrl, onRecordedAudioChange]);

  return (
    <div className="max-w-xl mx-auto">
      <h2
        className="text-2xl md:text-3xl text-center mb-2"
        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-primary)' }}
      >
        How should your affirmations be delivered?
      </h2>
      <p className="text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
        Choose voice, speed, and subliminal depth
      </p>

      {/* Voice Type */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Voice Type</h3>
        <div className="space-y-3">
          {voiceTypes.map((vt, i) => (
            <motion.button
              key={vt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onTypeChange(vt.id)}
              className="w-full glass-card p-4 text-left flex items-start gap-4"
              style={{
                borderColor: voiceType === vt.id ? 'rgba(196, 161, 255, 0.3)' : undefined,
                background: voiceType === vt.id ? 'rgba(196, 161, 255, 0.05)' : undefined,
              }}
            >
              <span className="text-2xl shrink-0">{vt.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{vt.name}</span>
                  {vt.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--subliminal)', color: 'var(--awake)' }}>
                      {vt.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{vt.description}</span>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                style={{ borderColor: voiceType === vt.id ? 'var(--conscious)' : 'var(--whisper)' }}
              >
                {voiceType === vt.id && (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--conscious)' }} />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Recording UI */}
        {voiceType === 'recorded' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 glass-card p-6"
          >
            {!hasRecording ? (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isRecording ? '#ef4444' : 'rgba(239, 68, 68, 0.2)',
                    border: `2px solid ${isRecording ? '#ef4444' : 'rgba(239, 68, 68, 0.5)'}`,
                    boxShadow: isRecording ? '0 0 24px rgba(239, 68, 68, 0.4)' : 'none',
                    animation: isRecording ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  }}
                >
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: isRecording ? 16 : 20,
                      height: isRecording ? 16 : 20,
                      borderRadius: isRecording ? 3 : '50%',
                      background: isRecording ? 'white' : '#ef4444',
                    }}
                  />
                </button>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {isRecording ? 'Recording... tap to stop' : 'Tap to record your affirmations'}
                </p>
                {micDenied && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                    Microphone access denied. Please allow microphone access in your browser settings.
                  </p>
                )}
                {/* Waveform placeholder */}
                {isRecording && (
                  <div className="flex items-center gap-1 h-8">
                    {waveformBars.map((bar, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full"
                        style={{
                          background: 'var(--conscious)',
                          height: `${bar.height}%`,
                          animation: `pulse ${bar.duration}s ease-in-out infinite`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <button onClick={playRecording} className="btn-glass px-4 py-2 text-sm rounded-xl">
                  ▶ Play
                </button>
                <button onClick={reRecord} className="btn-glass px-4 py-2 text-sm rounded-xl">
                  🔄 Re-record
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Speed */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Speed</h3>
        <div className="flex gap-2">
          {speeds.map(s => (
            <button
              key={s.id}
              onClick={() => onSpeedChange(s.id)}
              className="flex-1 py-2.5 rounded-full text-sm transition-all duration-300"
              style={{
                background: voiceSpeed === s.id ? 'var(--conscious)' : 'var(--glass)',
                color: voiceSpeed === s.id ? 'var(--void)' : 'var(--text-secondary)',
                border: `1px solid ${voiceSpeed === s.id ? 'var(--conscious)' : 'var(--glass-border)'}`,
                fontWeight: voiceSpeed === s.id ? 600 : 400,
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subliminal Depth */}
      <div>
        <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          How deep beneath awareness?
        </h3>
        <input
          type="range"
          min={2}
          max={15}
          value={subliminalDepth * 100}
          onChange={e => onDepthChange(Number(e.target.value) / 100)}
          className="w-full mt-3"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Barely perceptible</span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{depthPercent}%</span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Fully hidden</span>
        </div>
        {/* Live preview */}
        <p
          className="text-center mt-6 text-lg transition-opacity duration-500"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            color: 'var(--text-primary)',
            opacity: subliminalDepth,
          }}
        >
          I am calm and centred
        </p>
        <p className="text-center text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          This is how visible your affirmations will be
        </p>
      </div>
    </div>
  );
}
