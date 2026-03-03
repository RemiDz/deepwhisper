'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSpeechSynthesisOptions {
  volume?: number;
  rate?: number;
  pitch?: number;
}

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const idxRef = useRef(0);
  const activeRef = useRef(false);
  const textsRef = useRef<string[]>([]);
  const speakTextRef = useRef<(text: string) => void>(() => {});

  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = options.volume ?? 0.08;
    utterance.rate = options.rate ?? 0.85;
    utterance.pitch = options.pitch ?? 0.95;
    utterance.onend = () => {
      if (activeRef.current && textsRef.current.length > 0) {
        idxRef.current = (idxRef.current + 1) % textsRef.current.length;
        const pause = 1000 + Math.random() * 1000;
        setTimeout(() => {
          if (activeRef.current) speakTextRef.current(textsRef.current[idxRef.current]);
        }, pause);
      }
    };
    utterance.onerror = () => {
      if (activeRef.current) {
        idxRef.current = (idxRef.current + 1) % textsRef.current.length;
        setTimeout(() => {
          if (activeRef.current) speakTextRef.current(textsRef.current[idxRef.current]);
        }, 1500);
      }
    };
    window.speechSynthesis.speak(utterance);
  }, [options.volume, options.rate, options.pitch]);

  useEffect(() => {
    speakTextRef.current = speakText;
  }, [speakText]);

  const startLoop = useCallback((texts: string[]) => {
    if (texts.length === 0) return;
    textsRef.current = texts;
    idxRef.current = 0;
    activeRef.current = true;
    setIsSpeaking(true);
    speakTextRef.current(texts[0]);
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { startLoop, stop, isSpeaking };
}
