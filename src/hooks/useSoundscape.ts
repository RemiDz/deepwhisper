'use client';

import { useCallback, useRef } from 'react';
import { AmbientType, BinauralPreset, HealingFrequency } from '@/types';
import { createAmbient, AmbientNodes } from '@/lib/audio/ambients';
import { createBinaural, BinauralNodes } from '@/lib/audio/binaural';

export function useSoundscape() {
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<AmbientNodes | null>(null);
  const binauralRef = useRef<BinauralNodes | null>(null);
  const healingRef = useRef<OscillatorNode | null>(null);
  const healingGainRef = useRef<GainNode | null>(null);

  const stopAll = useCallback(() => {
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
    if (healingRef.current) {
      try { healingRef.current.stop(); } catch {}
      healingRef.current = null;
      healingGainRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    }
  }, []);

  const preview = useCallback((
    ambient: AmbientType,
    binaural: BinauralPreset,
    carrierFreq: number,
    healingFreq: HealingFrequency,
    processedBuffer?: AudioBuffer | null,
  ) => {
    stopAll();

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // Ambient
    const ambientNodes = createAmbient(ctx, ambient);
    ambientRef.current = ambientNodes;

    // Binaural
    if (binaural !== 'off') {
      const bin = createBinaural(ctx, binaural, carrierFreq);
      binauralRef.current = bin;
    }

    // Healing freq
    if (healingFreq > 0) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = healingFreq;
      const gain = ctx.createGain();
      gain.gain.value = 0.06;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      healingRef.current = osc;
      healingGainRef.current = gain;
    }

    // Processed subliminal layer
    if (processedBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = processedBuffer;
      source.loop = true;
      source.connect(ctx.destination);
      source.start();
    }

    // Auto-stop after 10 seconds
    setTimeout(() => {
      stopAll();
    }, 10000);
  }, [stopAll]);

  return { preview, stopAll };
}
