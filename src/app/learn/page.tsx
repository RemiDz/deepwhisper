'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ParticleField from '@/components/ParticleField';
import GradientMesh from '@/components/GradientMesh';
import ThresholdSlider from '@/components/ThresholdSlider';
import GlassCard from '@/components/GlassCard';

const demoAffirmations = [
  'I am calm and centred',
  'My mind is clear',
  'I trust the process',
  'Peace flows through me',
];

const howItWorks = [
  {
    step: '01',
    title: 'Choose your affirmations',
    description: 'Select from curated libraries or write your own. Each affirmation becomes a subliminal whisper.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="var(--conscious)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Layer beneath beautiful soundscapes',
    description: 'Add binaural beats, healing frequencies, and ambient sounds to create your perfect environment.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="4" rx="1" stroke="var(--theta)" strokeWidth="1.5" />
        <rect x="3" y="10" width="18" height="4" rx="1" stroke="var(--theta)" strokeWidth="1.5" opacity="0.6" />
        <rect x="3" y="17" width="18" height="4" rx="1" stroke="var(--theta)" strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Listen and let your subconscious absorb',
    description: 'Play your session daily. The subliminal affirmations work beneath conscious awareness to reshape thought patterns.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="var(--glow)" strokeWidth="1.5" opacity="0.3" />
        <circle cx="12" cy="12" r="5" stroke="var(--glow)" strokeWidth="1.5" opacity="0.6" />
        <circle cx="12" cy="12" r="1.5" fill="var(--glow)" />
      </svg>
    ),
  },
];

export default function LearnPage() {
  const [threshold, setThreshold] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const noiseRef = useRef<AudioBufferSourceNode | null>(null);
  const speechActiveRef = useRef(false);

  const conscOpacity = 1 - threshold / 100;
  const sublimOpacity = 0.05 + (threshold / 100) * 0.1;
  const voiceVolume = Math.max(0.02, 1 - threshold / 100);

  const speakNext = useCallback((idx: number) => {
    if (!speechActiveRef.current) return;
    const text = demoAffirmations[idx % demoAffirmations.length];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = voiceVolume;
    utterance.rate = 0.85;
    utterance.pitch = 0.95;
    utterance.onend = () => {
      const next = (idx + 1) % demoAffirmations.length;
      setCurrentIdx(next);
      setTimeout(() => speakNext(next), 800);
    };
    utterance.onerror = () => {
      const next = (idx + 1) % demoAffirmations.length;
      setTimeout(() => speakNext(next), 1200);
    };
    window.speechSynthesis.speak(utterance);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      speechActiveRef.current = false;
      window.speechSynthesis.cancel();
      if (oscRef.current) { try { oscRef.current.stop(); } catch {} oscRef.current = null; }
      if (noiseRef.current) { try { noiseRef.current.stop(); } catch {} noiseRef.current = null; }
      if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
      setIsPlaying(false);
      return;
    }

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // 174Hz sine drone
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 174;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.08;
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start();
    oscRef.current = osc;

    // Gentle filtered noise
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 300;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;
    noise.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();
    noiseRef.current = noise;

    speechActiveRef.current = true;
    setCurrentIdx(0);
    speakNext(0);
    setIsPlaying(true);
  }, [isPlaying, speakNext]);

  useEffect(() => {
    return () => {
      speechActiveRef.current = false;
      window.speechSynthesis.cancel();
      if (oscRef.current) try { oscRef.current.stop(); } catch {}
      if (noiseRef.current) try { noiseRef.current.stop(); } catch {}
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);

  return (
    <main className="relative min-h-screen">
      <GradientMesh />
      <ParticleField count={15} />

      <nav className="relative z-10 flex items-center justify-between p-6">
        <Link href="/" className="text-sm no-underline" style={{ color: 'var(--text-secondary)' }}>← Back</Link>
      </nav>

      <section className="relative z-10 px-6 pt-4 pb-24 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl text-center mb-3 text-glow"
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, color: 'var(--text-primary)' }}
        >
          The Threshold of Perception
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
        >
          Experience the boundary between conscious and subliminal
        </motion.p>

        {/* Play button */}
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="w-16 h-16 rounded-full glass-card flex items-center justify-center"
            style={{ border: '1px solid rgba(196, 161, 255, 0.15)' }}
          >
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="5" y="3" width="4" height="16" rx="1" fill="var(--conscious)" />
                <rect x="13" y="3" width="4" height="16" rx="1" fill="var(--conscious)" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M6 3L19 11L6 19V3Z" fill="var(--conscious)" />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Two panel demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-8">
            <h3 className="text-xs font-medium mb-4 uppercase tracking-widest" style={{ color: 'var(--awake)' }}>Conscious</h3>
            <div className="space-y-3">
              {demoAffirmations.map((aff, i) => (
                <p
                  key={aff}
                  className="text-lg transition-all duration-500"
                  style={{
                    fontFamily: 'var(--font-display)', fontStyle: 'italic',
                    color: 'var(--text-primary)', opacity: conscOpacity,
                    fontWeight: i === currentIdx && isPlaying ? 400 : 300,
                  }}
                >{aff}</p>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-8">
            <h3 className="text-xs font-medium mb-4 uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Subliminal</h3>
            <div className="space-y-3">
              {demoAffirmations.map((aff) => (
                <p
                  key={aff}
                  className="text-lg transition-all duration-500"
                  style={{
                    fontFamily: 'var(--font-display)', fontStyle: 'italic',
                    color: 'var(--text-primary)', opacity: sublimOpacity,
                    filter: `blur(${threshold / 30}px)`,
                  }}
                >{aff}</p>
              ))}
            </div>
          </motion.div>
        </div>

        <ThresholdSlider value={threshold} onChange={setThreshold} className="mb-20" />

        {/* How it works */}
        <h2 className="text-2xl md:text-3xl text-center mb-12" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-primary)' }}>
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {howItWorks.map((item, i) => (
            <GlassCard key={item.step} delay={i * 0.15} hoverable={false}>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl font-bold" style={{ color: 'var(--conscious)', opacity: 0.3, fontFamily: 'var(--font-mono)' }}>{item.step}</div>
                {item.icon}
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
            </GlassCard>
          ))}
        </div>

        <div className="text-center">
          <Link href="/create" className="btn-primary text-lg px-10 py-4 no-underline inline-block">
            Create your first session
          </Link>
        </div>
      </section>
    </main>
  );
}
