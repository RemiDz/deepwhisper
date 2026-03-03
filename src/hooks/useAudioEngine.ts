'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SubliminalSession } from '@/types/session';
import { createAmbient, AmbientNodes } from '@/lib/audio/ambients';
import { createBinaural, BinauralNodes } from '@/lib/audio/binaural';
import { createHealingFrequency, FrequencyNodes } from '@/lib/audio/frequencies';

const SPEED_MAP = { slow: 0.6, normal: 0.85, rapid: 1.2 };
const PITCH_MAP = { whisper: 0.7, gentle: 0.95, recorded: 1 };

export interface AudioEngineState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isReady: boolean;
  needsGesture: boolean;
}

export function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<AmbientNodes | null>(null);
  const binauralRef = useRef<BinauralNodes | null>(null);
  const freqRef = useRef<FrequencyNodes | null>(null);
  const utteranceIdxRef = useRef(0);
  const speakingRef = useRef(false);
  const sessionRef = useRef<SubliminalSession | null>(null);
  const startedAtRef = useRef(0);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const durationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const recordedGainRef = useRef<GainNode | null>(null);
  const stopRef = useRef<() => void>(() => {});
  const speakNextRef = useRef<() => void>(() => {});
  const baseGainsRef = useRef({ ambient: 0.3, binaural: 0.15, healing: 0.08 });

  const [isPlaying, setIsPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);

  const speakNext = useCallback(() => {
    const session = sessionRef.current;
    if (!session || !speakingRef.current) return;
    if (session.affirmations.length === 0) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const idx = utteranceIdxRef.current % session.affirmations.length;
    const text = session.affirmations[idx];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = session.voice.subliminalDepth;
    utterance.rate = SPEED_MAP[session.voice.speed];
    utterance.pitch = PITCH_MAP[session.voice.type];
    utterance.onend = () => {
      utteranceIdxRef.current++;
      if (speakingRef.current) {
        const pause = 1000 + Math.random() * 1000; // 1-2s pause
        setTimeout(() => speakNextRef.current(), pause);
      }
    };
    utterance.onerror = () => {
      utteranceIdxRef.current++;
      if (speakingRef.current) {
        setTimeout(() => speakNextRef.current(), 1500);
      }
    };
    window.speechSynthesis.speak(utterance);
  }, []);

  const startRecordedAudio = useCallback(async (ctx: AudioContext, url: string, depth: number) => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = depth;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      recordedSourceRef.current = source;
      recordedGainRef.current = gain;
    } catch {
      // Fallback to speech synthesis if recorded audio fails
      speakingRef.current = true;
      utteranceIdxRef.current = 0;
      speakNext();
    }
  }, [speakNext]);

  const play = useCallback((session: SubliminalSession, onEnd?: () => void) => {
    sessionRef.current = session;
    startedAtRef.current = Date.now();

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    if (ctx.state === 'suspended') {
      setNeedsGesture(true);
      ctx.resume().then(() => setNeedsGesture(false)).catch(() => {});
    }

    const fadeIn = Math.max(5, session.duration * 0.1);
    const fadeOut = Math.max(5, session.duration * 0.1);

    // Ambient
    const ambient = createAmbient(ctx, session.soundscape.ambient);
    ambientRef.current = ambient;
    if (ambient) {
      const targetGain = ambient.gain.gain.value || 0.3;
      baseGainsRef.current.ambient = targetGain;
      ambient.gain.gain.setValueAtTime(0, ctx.currentTime);
      ambient.gain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + fadeIn);
    }

    // Binaural
    if (session.soundscape.binauralEnabled) {
      const binaural = createBinaural(ctx, session.soundscape.binauralFreq, session.soundscape.carrierFreq);
      binauralRef.current = binaural;
      baseGainsRef.current.binaural = 0.15;
      binaural.masterGain.gain.setValueAtTime(0, ctx.currentTime);
      binaural.masterGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + fadeIn);
    }

    // Healing frequency
    if (session.soundscape.healingFreqEnabled) {
      const freq = createHealingFrequency(ctx, session.soundscape.healingFreq);
      freqRef.current = freq;
      baseGainsRef.current.healing = 0.08;
      freq.gain.gain.setValueAtTime(0, ctx.currentTime);
      freq.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + fadeIn);
    }

    // Voice
    if (session.voice.type === 'recorded' && session.voice.recordedAudioUrl) {
      startRecordedAudio(ctx, session.voice.recordedAudioUrl, session.voice.subliminalDepth);
    } else {
      speakingRef.current = true;
      utteranceIdxRef.current = 0;
      speakNext();
    }

    setIsPlaying(true);

    // Schedule fade out
    const fadeOutStart = session.duration - fadeOut;
    fadeTimerRef.current = setTimeout(() => {
      const now = ctx.currentTime;
      if (ambient) ambient.gain.gain.linearRampToValueAtTime(0, now + fadeOut);
      if (binauralRef.current) binauralRef.current.masterGain.gain.linearRampToValueAtTime(0, now + fadeOut);
      if (freqRef.current) freqRef.current.gain.gain.linearRampToValueAtTime(0, now + fadeOut);
      if (recordedGainRef.current) recordedGainRef.current.gain.linearRampToValueAtTime(0, now + fadeOut);
    }, fadeOutStart * 1000);

    // Schedule end
    durationTimerRef.current = setTimeout(() => {
      stopRef.current();
      onEnd?.();
    }, session.duration * 1000);
  }, [speakNext, startRecordedAudio]);

  const stop = useCallback(() => {
    speakingRef.current = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();

    if (ambientRef.current) {
      ambientRef.current.sources.forEach(s => { try { s.stop(); } catch {} });
      ambientRef.current.oscillators.forEach(o => { try { o.stop(); } catch {} });
      ambientRef.current = null;
    }
    if (binauralRef.current) {
      try { binauralRef.current.left.stop(); } catch {}
      try { binauralRef.current.right.stop(); } catch {}
      binauralRef.current = null;
    }
    if (freqRef.current) {
      try { freqRef.current.oscillator.stop(); } catch {}
      try { freqRef.current.tremoloOsc.stop(); } catch {}
      freqRef.current = null;
    }
    if (recordedSourceRef.current) {
      try { recordedSourceRef.current.stop(); } catch {}
      recordedSourceRef.current = null;
      recordedGainRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (durationTimerRef.current) clearTimeout(durationTimerRef.current);

    setIsPlaying(false);
  }, []);

  useEffect(() => {
    stopRef.current = stop;
    speakNextRef.current = speakNext;
  }, [stop, speakNext]);

  const pause = useCallback(() => {
    if (ctxRef.current?.state === 'running') {
      ctxRef.current.suspend();
      speakingRef.current = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
      if (sessionRef.current?.voice.type !== 'recorded') {
        speakingRef.current = true;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.resume();
      }
      setIsPlaying(true);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (ambientRef.current) {
      ambientRef.current.gain.gain.value = baseGainsRef.current.ambient * volume;
    }
    if (binauralRef.current) binauralRef.current.masterGain.gain.value = baseGainsRef.current.binaural * volume;
    if (freqRef.current) freqRef.current.gain.gain.value = baseGainsRef.current.healing * volume;
    if (recordedGainRef.current && sessionRef.current) {
      recordedGainRef.current.gain.value = sessionRef.current.voice.subliminalDepth * volume;
    }
  }, []);

  const getElapsed = useCallback((): number => {
    if (!startedAtRef.current) return 0;
    return (Date.now() - startedAtRef.current) / 1000;
  }, []);

  return { play, stop, pause, resume, isPlaying, needsGesture, setVolume, getElapsed };
}
