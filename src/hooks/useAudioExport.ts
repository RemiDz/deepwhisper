'use client';

import { useState, useCallback } from 'react';
import { AmbientType, BinauralPreset, HealingFrequency } from '@/types';
import { createNoise, NoiseType } from '@/lib/audio/noise';
import { encodeWAV, downloadBlob } from '@/lib/audio/wav-encoder';

interface ExportConfig {
  processedBuffer: AudioBuffer;
  ambient: AmbientType;
  binaural: BinauralPreset;
  carrierFreq: number;
  healingFreq: HealingFrequency;
  durationSeconds: number;
  sessionName: string;
}

export function useAudioExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportAudio = useCallback(async (config: ExportConfig) => {
    setIsExporting(true);
    setProgress(0);

    try {
      const sampleRate = config.processedBuffer.sampleRate;
      const totalSamples = sampleRate * config.durationSeconds;
      const offCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

      setProgress(10);

      // 1. Loop processed affirmations for full duration
      const affSource = offCtx.createBufferSource();
      affSource.buffer = config.processedBuffer;
      affSource.loop = true;
      const affGain = offCtx.createGain();
      affGain.gain.value = 1.0;
      affSource.connect(affGain);
      affGain.connect(offCtx.destination);
      affSource.start();

      setProgress(20);

      // 2. Generate soundscape
      if (config.ambient !== 'silence') {
        const ambientGain = offCtx.createGain();
        ambientGain.connect(offCtx.destination);

        const noiseTypeMap: Record<string, NoiseType | null> = {
          rain: 'white', ocean: 'brown', forest: 'pink', 'pink-noise': 'pink', 'brown-noise': 'brown',
          bowls: null, drone: null,
        };

        const noiseType = noiseTypeMap[config.ambient];
        if (noiseType) {
          const noise = createNoise(offCtx, noiseType);
          const filter = offCtx.createBiquadFilter();

          switch (config.ambient) {
            case 'rain':
              filter.type = 'bandpass';
              filter.frequency.value = 800;
              filter.Q.value = 0.5;
              noise.connect(filter);
              filter.connect(ambientGain);
              ambientGain.gain.value = 0.3;
              break;
            case 'ocean':
              filter.type = 'lowpass';
              filter.frequency.value = 400;
              noise.connect(filter);
              filter.connect(ambientGain);
              ambientGain.gain.value = 0.4;
              break;
            case 'forest':
              filter.type = 'bandpass';
              filter.frequency.value = 1000;
              filter.Q.value = 0.5;
              noise.connect(filter);
              filter.connect(ambientGain);
              ambientGain.gain.value = 0.2;
              break;
            default:
              noise.connect(ambientGain);
              ambientGain.gain.value = 0.25;
          }
          noise.start();
        } else if (config.ambient === 'bowls') {
          const freqs = [432, 864, 1296];
          const gains = [0.15, 0.05, 0.02];
          freqs.forEach((freq, idx) => {
            const osc = offCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = offCtx.createGain();
            g.gain.value = gains[idx];
            osc.connect(g);
            g.connect(ambientGain);
            osc.start();
          });
          ambientGain.gain.value = 0.3;
        } else if (config.ambient === 'drone') {
          const freqs = [68, 136, 204];
          const gains = [0.2, 0.12, 0.08];
          freqs.forEach((freq, idx) => {
            const osc = offCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = offCtx.createGain();
            g.gain.value = gains[idx];
            osc.connect(g);
            g.connect(ambientGain);
            osc.start();
          });
          ambientGain.gain.value = 0.35;
        }
      }

      setProgress(40);

      // 3. Binaural beats
      if (config.binaural !== 'off') {
        const binauralFreqs = { theta: 6, alpha: 10, delta: 2 };
        const beatFreq = binauralFreqs[config.binaural];
        const merger = offCtx.createChannelMerger(2);
        const binGain = offCtx.createGain();
        binGain.gain.value = 0.12;
        merger.connect(binGain);
        binGain.connect(offCtx.destination);

        const left = offCtx.createOscillator();
        left.type = 'sine';
        left.frequency.value = config.carrierFreq;
        left.connect(merger, 0, 0);
        left.start();

        const right = offCtx.createOscillator();
        right.type = 'sine';
        right.frequency.value = config.carrierFreq + beatFreq;
        right.connect(merger, 0, 1);
        right.start();
      }

      setProgress(50);

      // 4. Healing frequency
      if (config.healingFreq > 0) {
        const healOsc = offCtx.createOscillator();
        healOsc.type = 'sine';
        healOsc.frequency.value = config.healingFreq;
        const healGain = offCtx.createGain();
        healGain.gain.value = 0.06;
        healOsc.connect(healGain);
        healGain.connect(offCtx.destination);
        healOsc.start();
      }

      setProgress(60);

      // 5. Fade in/out on the master
      // We apply fade to the affirmation gain since we can't easily fade the master of an OfflineAudioContext
      const fadeIn = Math.min(5, config.durationSeconds * 0.1);
      const fadeOut = Math.min(10, config.durationSeconds * 0.1);
      // Fade in for all
      affGain.gain.setValueAtTime(0, 0);
      affGain.gain.linearRampToValueAtTime(1.0, fadeIn);
      // Fade out
      affGain.gain.setValueAtTime(1.0, config.durationSeconds - fadeOut);
      affGain.gain.linearRampToValueAtTime(0, config.durationSeconds);

      setProgress(70);

      // 6. Render
      const renderedBuffer = await offCtx.startRendering();

      setProgress(90);

      // 7. Encode and download
      const wavBlob = encodeWAV(renderedBuffer);
      downloadBlob(wavBlob, `${config.sessionName}.wav`);

      setProgress(100);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { isExporting, progress, exportAudio };
}
