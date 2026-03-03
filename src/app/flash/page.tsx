'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { FlashConfig, FlashBackground } from '@/types';
import { useFlashSession } from '@/hooks/useFlashSession';
import { useFullscreen } from '@/hooks/useFullscreen';
import FlashCanvas from '@/components/FlashCanvas';
import { formatTime } from '@/lib/utils';

const DEFAULT_AFFIRMATIONS = [
  'I am powerful beyond measure',
  'Abundance flows to me effortlessly',
  'I trust my journey completely',
  'My mind is sharp and focused',
  'I am worthy of everything I desire',
];

const backgrounds: { id: FlashBackground; name: string }[] = [
  { id: 'dark', name: 'Dark Void' },
  { id: 'sacred-geometry', name: 'Sacred Geometry' },
  { id: 'colour-pulse', name: 'Colour Pulse' },
  { id: 'custom', name: 'Custom Colour' },
];

const textSizes = { small: 'text-lg md:text-xl', medium: 'text-2xl md:text-4xl', large: 'text-4xl md:text-6xl' };

const durations = [5, 10, 15, 20, 30];

export default function FlashPage() {
  const [affirmationText, setAffirmationText] = useState(DEFAULT_AFFIRMATIONS.join('\n'));
  const [flashDuration, setFlashDuration] = useState(50);
  const [interval, setInterval] = useState(5);
  const [opacity, setOpacity] = useState(0.3);
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [position, setPosition] = useState<'centre' | 'random'>('random');
  const [background, setBackground] = useState<FlashBackground>('dark');
  const [customColour, setCustomColour] = useState('#1a0030');
  const [sessionDuration, setSessionDuration] = useState(10);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const flash = useFlashSession();
  const fullscreen = useFullscreen();

  const handleStart = useCallback(() => {
    const affirmations = affirmationText.split('\n').map(s => s.trim()).filter(Boolean);
    if (affirmations.length === 0) return;

    const config: FlashConfig = {
      affirmations,
      flashDuration,
      interval,
      opacity,
      textSize,
      position,
      background,
      customBgColour: customColour,
      sessionDuration: sessionDuration * 60,
      soundEnabled,
    };

    flash.start(config);
    fullscreen.enterFullscreen();
  }, [affirmationText, flashDuration, interval, opacity, textSize, position, background, customColour, sessionDuration, soundEnabled, flash, fullscreen]);

  const handleExit = useCallback(() => {
    flash.stop();
    fullscreen.exitFullscreen();
  }, [flash, fullscreen]);

  // Flash mode — fullscreen experience
  if (flash.state.isRunning || (flash.state.flashCount > 0 && !flash.state.isRunning)) {
    const sessionComplete = !flash.state.isRunning && flash.state.flashCount > 0;

    return (
      <div
        className="fixed inset-0 z-50"
        onClick={() => setShowControls(prev => !prev)}
        style={{ cursor: 'default' }}
      >
        <FlashCanvas background={background} customBgColour={customColour} />

        {/* Flash text */}
        {flash.state.currentText && (
          <div
            className={`fixed font-bold ${textSizes[textSize]} pointer-events-none`}
            style={{
              color: 'var(--flash)',
              opacity: opacity,
              left: `${flash.state.position.x}%`,
              top: `${flash.state.position.y}%`,
              transform: position === 'centre' ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)',
              fontFamily: 'var(--font-body)',
              textShadow: '0 0 30px rgba(255,255,255,0.2)',
              zIndex: 60,
            }}
          >
            {flash.state.currentText}
          </div>
        )}

        {/* Flash counter */}
        <div className="fixed bottom-4 right-4 text-xs z-40" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          {flash.state.flashCount}/{flash.state.totalFlashes} flashes
        </div>

        {/* Controls overlay */}
        {showControls && !sessionComplete && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-60 flex items-center gap-4" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => flash.state.isPaused ? flash.resume() : flash.pause()}
              className="btn-ghost px-6 py-2 text-sm"
            >
              {flash.state.isPaused ? 'Resume' : 'Pause'}
            </button>
            <span className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              {formatTime(Math.max(0, (sessionDuration * 60) - flash.state.elapsedSeconds))}
            </span>
            <button onClick={handleExit} className="btn-ghost px-6 py-2 text-sm">
              Exit
            </button>
          </div>
        )}

        {/* Session complete overlay */}
        {sessionComplete && (
          <div className="fixed inset-0 z-70 flex items-center justify-center" style={{ background: 'rgba(8, 8, 12, 0.95)' }}>
            <div className="text-center">
              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Session complete.
              </h2>
              <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {flash.state.flashCount} subliminal flashes delivered in {Math.round(flash.state.elapsedSeconds / 60)} minutes.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={handleExit} className="btn-primary px-8 py-3 text-sm">New Session</button>
                <button onClick={handleExit} className="btn-ghost px-8 py-3 text-sm">Exit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Setup panel
  return (
    <main className="min-h-screen px-6 py-12" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm no-underline mb-8 inline-block" style={{ color: 'var(--text-dim)' }}>
          ← Back
        </Link>

        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Visual Flash
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-secondary)' }}>
          Flash affirmations on screen at subliminal speeds.
        </p>

        <div className="space-y-8">
          {/* Affirmations */}
          <div>
            <label className="text-xs font-medium mb-2 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
              Affirmations (one per line)
            </label>
            <textarea
              value={affirmationText}
              onChange={e => setAffirmationText(e.target.value)}
              placeholder={"I am powerful beyond measure\nAbundance flows to me\nI trust my journey"}
              rows={5}
            />
          </div>

          {/* Settings grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Flash duration */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-dim)' }}>
                Flash Duration: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{flashDuration}ms</span>
              </label>
              <input type="range" min={10} max={200} value={flashDuration} onChange={e => setFlashDuration(Number(e.target.value))} />
              <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Below 50ms is truly subliminal</p>
            </div>

            {/* Interval */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-dim)' }}>
                Interval: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{interval}s</span>
              </label>
              <input type="range" min={2} max={15} value={interval} onChange={e => setInterval(Number(e.target.value))} />
            </div>

            {/* Opacity */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-dim)' }}>
                Flash Opacity: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{opacity.toFixed(1)}</span>
              </label>
              <input type="range" min={10} max={100} value={opacity * 100} onChange={e => setOpacity(Number(e.target.value) / 100)} />
            </div>

            {/* Text size */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-dim)' }}>Text Size</label>
              <div className="pill-group">
                {(['small', 'medium', 'large'] as const).map(s => (
                  <button key={s} className={`pill ${textSize === s ? 'pill-active' : ''}`} onClick={() => setTextSize(s)}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-dim)' }}>Position</label>
              <div className="pill-group">
                {(['centre', 'random'] as const).map(p => (
                  <button key={p} className={`pill ${position === p ? 'pill-active' : ''}`} onClick={() => setPosition(p)}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>Flash sound effect</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-10 h-5 rounded-full transition-all duration-200 relative"
                style={{
                  background: soundEnabled ? 'var(--accent)' : 'var(--bg-surface)',
                  border: `1px solid ${soundEnabled ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full absolute top-[1px] transition-all"
                  style={{ background: soundEnabled ? 'white' : 'var(--text-dim)', left: soundEnabled ? 21 : 2 }}
                />
              </button>
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="text-xs font-medium mb-3 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Background</label>
            <div className="flex gap-2 flex-wrap">
              {backgrounds.map(b => (
                <button
                  key={b.id}
                  className={`px-4 py-2 rounded-lg text-xs transition-all ${background === b.id ? '' : ''}`}
                  style={{
                    background: background === b.id ? 'var(--accent-soft)' : 'var(--bg-surface)',
                    border: `1px solid ${background === b.id ? 'var(--accent)' : 'var(--border)'}`,
                    color: background === b.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                  onClick={() => setBackground(b.id)}
                >
                  {b.name}
                </button>
              ))}
            </div>
            {background === 'custom' && (
              <input
                type="color"
                value={customColour}
                onChange={e => setCustomColour(e.target.value)}
                className="mt-3 w-12 h-8 rounded border-0 cursor-pointer"
              />
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-medium mb-3 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Session Duration</label>
            <div className="pill-group">
              {durations.map(d => (
                <button
                  key={d}
                  className={`pill ${sessionDuration === d ? 'pill-active' : ''}`}
                  onClick={() => setSessionDuration(d)}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* Start */}
          <button onClick={handleStart} className="btn-primary w-full py-4 text-base font-medium">
            Begin Session
          </button>
        </div>
      </div>
    </main>
  );
}
