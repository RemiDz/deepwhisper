'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OrbVisualiser from '@/components/OrbVisualiser';
import WhisperWall from '@/components/WhisperWall';
import ParticleField from '@/components/ParticleField';
import ProgressRing from '@/components/Player/ProgressRing';
import PlayerControls from '@/components/Player/PlayerControls';
import SessionComplete from '@/components/Player/SessionComplete';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { getSession, incrementPlayCount } from '@/lib/sessions';
import { getCategoryAccent } from '@/lib/categories';
import { SubliminalSession } from '@/types/session';

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [session, setSession] = useState<SubliminalSession | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('--:--');
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [tapToBegin, setTapToBegin] = useState(true);
  const [orbSize, setOrbSize] = useState(300);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const affirmationCountRef = useRef(0);
  const engine = useAudioEngine();

  useEffect(() => {
    const s = getSession(id);
    if (s) {
      setSession(s);
      const min = Math.floor(s.duration / 60);
      const sec = s.duration % 60;
      setTimeRemaining(`${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`);
    } else {
      router.push('/create');
    }
  }, [id, router]);

  useEffect(() => {
    const updateSize = () => {
      setOrbSize(Math.min(window.innerWidth, window.innerHeight) * 0.5);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const updateProgress = useCallback(() => {
    if (!session) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const prog = Math.min(elapsed / session.duration, 1);
    setProgress(prog);

    const remaining = Math.max(0, session.duration - elapsed);
    const min = Math.floor(remaining / 60);
    const sec = Math.floor(remaining % 60);
    setTimeRemaining(`${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`);

    // Estimate affirmations delivered (~1 every 5s)
    affirmationCountRef.current = Math.floor(elapsed / 5);
  }, [session]);

  const beginSession = useCallback(() => {
    if (!session) return;
    setTapToBegin(false);
    setStarted(true);
    startTimeRef.current = Date.now();
    incrementPlayCount(id);

    engine.play(session, () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(1);
      setTimeRemaining('00:00');
      setCompleted(true);
    });

    timerRef.current = setInterval(updateProgress, 1000);
  }, [session, engine, id, updateProgress]);

  const handlePlayPause = useCallback(() => {
    if (engine.isPlaying) engine.pause();
    else engine.resume();
  }, [engine]);

  const handleStop = useCallback(() => {
    engine.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    router.push('/create');
  }, [engine, router]);

  const handleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }, []);

  const handlePlayAgain = useCallback(() => {
    setCompleted(false);
    setProgress(0);
    setStarted(false);
    setTapToBegin(true);
  }, []);

  useEffect(() => {
    return () => {
      engine.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--void)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--conscious)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const orbColor = getCategoryAccent(session.category);
  const binauralHz = session.soundscape.binauralEnabled ? session.soundscape.binauralFreq : 0;
  const pulseSpeed = binauralHz > 0 ? binauralHz : 4;

  return (
    <main
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: 'var(--void)' }}
      onClick={tapToBegin ? beginSession : undefined}
    >
      <ParticleField count={45} />

      {started && <WhisperWall affirmations={session.affirmations} />}

      {/* Orb + Progress Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: orbSize * 1.5,
            height: orbSize * 1.5,
            background: `radial-gradient(circle, ${orbColor}15 0%, transparent 70%)`,
          }}
        />
        <div className="relative">
          <OrbVisualiser size={orbSize} color={orbColor} pulseSpeed={pulseSpeed} />
          {started && (
            <ProgressRing progress={progress} size={orbSize + 40} strokeWidth={2} color={orbColor} />
          )}
        </div>
      </div>

      {/* Tap to begin */}
      {tapToBegin && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center cursor-pointer">
          <p className="text-2xl md:text-3xl mb-2" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            {session.name}
          </p>
          <p className="text-sm animate-pulse" style={{ color: 'var(--text-secondary)' }}>
            Tap to begin
          </p>
        </div>
      )}

      {/* Controls */}
      {started && !completed && (
        <PlayerControls
          sessionName={session.name}
          isPlaying={engine.isPlaying}
          timeRemaining={timeRemaining}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
          onVolumeChange={engine.setVolume}
          onFullscreen={handleFullscreen}
        />
      )}

      {/* Session Complete Overlay */}
      {completed && (
        <SessionComplete
          session={session}
          affirmationsDelivered={affirmationCountRef.current}
          onPlayAgain={handlePlayAgain}
          onCreateAnother={() => { engine.stop(); router.push('/create'); }}
        />
      )}
    </main>
  );
}
