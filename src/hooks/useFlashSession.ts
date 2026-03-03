'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FlashConfig } from '@/types';

interface FlashState {
  isRunning: boolean;
  isPaused: boolean;
  currentText: string | null;
  flashCount: number;
  totalFlashes: number;
  elapsedSeconds: number;
  position: { x: number; y: number };
}

export function useFlashSession() {
  const [state, setState] = useState<FlashState>({
    isRunning: false,
    isPaused: false,
    currentText: null,
    flashCount: 0,
    totalFlashes: 0,
    elapsedSeconds: 0,
    position: { x: 50, y: 50 },
  });

  const configRef = useRef<FlashConfig | null>(null);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const pausedAtRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const doFlashRef = useRef<() => void>(() => {});
  const stopRef = useRef<() => void>(() => {});

  const playFlashSound = useCallback(() => {
    if (!configRef.current?.soundEnabled) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }, []);

  const doFlash = useCallback(() => {
    const config = configRef.current;
    if (!config || config.affirmations.length === 0) return;

    const text = config.affirmations[indexRef.current % config.affirmations.length];
    indexRef.current++;

    const position = config.position === 'random'
      ? { x: 10 + Math.random() * 80, y: 20 + Math.random() * 60 }
      : { x: 50, y: 50 };

    setState(prev => ({
      ...prev,
      currentText: text,
      flashCount: prev.flashCount + 1,
      position,
    }));

    playFlashSound();

    // Hide after flash duration
    flashTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, currentText: null }));
    }, config.flashDuration);

    // Schedule next flash via ref
    intervalRef.current = setTimeout(() => doFlashRef.current(), config.interval * 1000);
  }, [playFlashSound]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setState(prev => ({ ...prev, isRunning: false, isPaused: false, currentText: null }));
  }, []);

  useEffect(() => {
    doFlashRef.current = doFlash;
    stopRef.current = stop;
  }, [doFlash, stop]);

  const start = useCallback((config: FlashConfig) => {
    configRef.current = config;
    indexRef.current = 0;

    const totalFlashes = Math.floor(config.sessionDuration / config.interval);

    startTimeRef.current = Date.now();
    setState({
      isRunning: true,
      isPaused: false,
      currentText: null,
      flashCount: 0,
      totalFlashes,
      elapsedSeconds: 0,
      position: { x: 50, y: 50 },
    });

    // Start elapsed timer
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setState(prev => {
        if (elapsed >= config.sessionDuration) {
          return { ...prev, elapsedSeconds: config.sessionDuration, isRunning: false };
        }
        return { ...prev, elapsedSeconds: elapsed };
      });

      if (elapsed >= config.sessionDuration) {
        stopRef.current();
      }
    }, 1000);

    // First flash after initial interval
    intervalRef.current = setTimeout(() => doFlashRef.current(), config.interval * 1000);
  }, []);

  const pause = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    pausedAtRef.current = Date.now();
    setState(prev => ({ ...prev, isPaused: true, currentText: null }));
  }, []);

  const resume = useCallback(() => {
    const pauseDuration = Date.now() - pausedAtRef.current;
    startTimeRef.current += pauseDuration;

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const config = configRef.current;
      setState(prev => {
        if (config && elapsed >= config.sessionDuration) {
          return { ...prev, elapsedSeconds: config.sessionDuration, isRunning: false };
        }
        return { ...prev, elapsedSeconds: elapsed };
      });
    }, 1000);

    intervalRef.current = setTimeout(() => doFlashRef.current(), (configRef.current?.interval ?? 5) * 1000);
    setState(prev => ({ ...prev, isPaused: false }));
  }, []);

  return { state, start, stop, pause, resume };
}
