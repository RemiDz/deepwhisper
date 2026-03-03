'use client';

import { useState, useCallback } from 'react';
import { processAffirmations, concatenateBuffers } from '@/lib/audio/processor';
import { ProcessingTechnique } from '@/types';

export function useAudioProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedBuffer, setProcessedBuffer] = useState<AudioBuffer | null>(null);

  const process = useCallback(async (
    buffers: AudioBuffer[],
    techniques: ProcessingTechnique[],
    speedMultiplier: number,
    volumeDb: number,
    ultrasonicHz: number,
  ): Promise<AudioBuffer | null> => {
    if (buffers.length === 0) return null;
    setIsProcessing(true);
    try {
      // Concatenate all recording buffers
      const ctx = new AudioContext();
      const combined = concatenateBuffers(ctx, buffers);
      ctx.close();

      // Process
      const result = await processAffirmations(
        combined,
        new Set(techniques),
        speedMultiplier,
        volumeDb,
        ultrasonicHz,
      );

      setProcessedBuffer(result);
      return result;
    } catch (err) {
      console.error('Processing failed:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const previewProcessed = useCallback((buffer: AudioBuffer) => {
    const ctx = new AudioContext();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
    // Play 5 seconds max
    setTimeout(() => {
      try { source.stop(); } catch {}
      ctx.close();
    }, 5000);
  }, []);

  return { isProcessing, processedBuffer, process, previewProcessed };
}
