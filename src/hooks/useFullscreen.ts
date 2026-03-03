'use client';

import { useState, useCallback, useEffect } from 'react';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const enterFullscreen = useCallback(async (element?: HTMLElement) => {
    const el = element || document.documentElement;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      }
    } catch {
      // Fullscreen not supported (e.g., iOS Safari) — use CSS fallback
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {}
  }, []);

  const toggle = useCallback(async (element?: HTMLElement) => {
    if (isFullscreen) await exitFullscreen();
    else await enterFullscreen(element);
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return { isFullscreen, enterFullscreen, exitFullscreen, toggle };
}
