'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ProcessingTechnique, AmbientType, BinauralPreset, HealingFrequency } from '@/types';
import { useAudioRecorder, Recording } from '@/hooks/useAudioRecorder';
import { useAudioProcessor } from '@/hooks/useAudioProcessor';
import { useAudioExport } from '@/hooks/useAudioExport';
import { useSoundscape } from '@/hooks/useSoundscape';
import RecordButton from '@/components/RecordButton';
import AudioPlayer from '@/components/AudioPlayer';
import TechniqueCard from '@/components/TechniqueCard';
import SoundscapeSelector from '@/components/SoundscapeSelector';
import ExportProgress from '@/components/ExportProgress';
import WaveformVisualiser from '@/components/WaveformVisualiser';
import { formatTime } from '@/lib/utils';
import { speakPreview, getAvailableVoices } from '@/lib/audio/speech';

const durationOptions = [5, 10, 15, 20, 30, 60];

export default function AudioLabPage() {
  // --- Tab state ---
  const [inputTab, setInputTab] = useState<'record' | 'type'>('record');

  // --- Recording state ---
  const recorder = useAudioRecorder();
  const [recordings, setRecordings] = useState<Recording[]>([]);

  // --- Type & Speak state ---
  const [typedText, setTypedText] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedVoiceIdx, setSelectedVoiceIdx] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // --- Processing ---
  const processor = useAudioProcessor();
  const [techniques, setTechniques] = useState<Set<ProcessingTechnique>>(new Set(['speed']));
  const [speedMultiplier, setSpeedMultiplier] = useState(4);
  const [volumeDb, setVolumeDb] = useState(-25);
  const [ultrasonicHz, setUltrasonicHz] = useState(17500);

  // --- Soundscape ---
  const [ambient, setAmbient] = useState<AmbientType>('rain');
  const [binaural, setBinaural] = useState<BinauralPreset>('off');
  const [carrierFreq, setCarrierFreq] = useState(200);
  const [healingFreq, setHealingFreq] = useState<HealingFrequency>(0);
  const soundscape = useSoundscape();

  // --- Export ---
  const exporter = useAudioExport();
  const [duration, setDuration] = useState(600); // 10 min
  const [sessionName, setSessionName] = useState(`Deep Whisper Session — ${new Date().toLocaleDateString()}`);

  // Load voices
  const loadVoices = useCallback(() => {
    if (voicesLoaded) return;
    const v = getAvailableVoices();
    if (v.length > 0) {
      setVoices(v);
      setVoicesLoaded(true);
    } else {
      // Voices may load async
      setTimeout(() => {
        const v2 = getAvailableVoices();
        setVoices(v2);
        setVoicesLoaded(true);
      }, 500);
    }
  }, [voicesLoaded]);

  // Recording handlers
  const handleRecordToggle = useCallback(async () => {
    if (recorder.isRecording) {
      const rec = await recorder.stopRecording();
      if (rec) setRecordings(prev => [...prev, rec]);
    } else {
      await recorder.startRecording();
    }
  }, [recorder]);

  const handleDeleteRecording = useCallback((id: string) => {
    setRecordings(prev => {
      const rec = prev.find(r => r.id === id);
      if (rec) URL.revokeObjectURL(rec.url);
      return prev.filter(r => r.id !== id);
    });
  }, []);

  // Processing
  const handleProcess = useCallback(async () => {
    const buffers = recordings.map(r => r.buffer).filter((b): b is AudioBuffer => b !== null);
    if (buffers.length === 0) return;
    await processor.process(buffers, Array.from(techniques), speedMultiplier, volumeDb, ultrasonicHz);
  }, [recordings, processor, techniques, speedMultiplier, volumeDb, ultrasonicHz]);

  const toggleTechnique = (t: ProcessingTechnique) => {
    setTechniques(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  // Mix preview
  const handleMixPreview = useCallback(() => {
    soundscape.preview(ambient, binaural, carrierFreq, healingFreq, processor.processedBuffer);
  }, [soundscape, ambient, binaural, carrierFreq, healingFreq, processor.processedBuffer]);

  // Export
  const handleExport = useCallback(async () => {
    if (!processor.processedBuffer) return;
    await exporter.exportAudio({
      processedBuffer: processor.processedBuffer,
      ambient,
      binaural,
      carrierFreq,
      healingFreq,
      durationSeconds: duration,
      sessionName,
    });
  }, [processor.processedBuffer, exporter, ambient, binaural, carrierFreq, healingFreq, duration, sessionName]);

  const hasRecordings = recordings.length > 0;

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
          Audio Lab
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-secondary)' }}>
          Record, process, and export real subliminal audio.
        </p>

        {/* ============ SECTION A: Record / Upload ============ */}
        <section className="mb-12">
          <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Your Affirmations
          </h2>

          {/* Tab toggle */}
          <div className="pill-group mb-6">
            <button className={`pill ${inputTab === 'record' ? 'pill-active' : ''}`} onClick={() => setInputTab('record')}>
              Record
            </button>
            <button className={`pill ${inputTab === 'type' ? 'pill-active' : ''}`} onClick={() => { setInputTab('type'); loadVoices(); }}>
              Type & Speak
            </button>
          </div>

          {inputTab === 'record' ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-6">
                <RecordButton isRecording={recorder.isRecording} onClick={handleRecordToggle} />
                {recorder.isRecording && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--danger)' }} />
                    <span className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--danger)' }}>
                      {formatTime(recorder.recordingTime)}
                    </span>
                  </div>
                )}
                {!recorder.isRecording && !hasRecordings && (
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Tap to record your affirmations
                  </p>
                )}
                {recorder.micDenied && (
                  <p className="text-xs" style={{ color: 'var(--danger)' }}>
                    Microphone access denied. Please allow access in browser settings.
                  </p>
                )}
              </div>

              {/* Recordings list */}
              {recordings.length > 0 && (
                <div className="space-y-2">
                  {recordings.map((rec, idx) => (
                    <AudioPlayer
                      key={rec.id}
                      url={rec.url}
                      buffer={rec.buffer}
                      duration={rec.duration}
                      label={`Recording ${idx + 1}`}
                      onDelete={() => handleDeleteRecording(rec.id)}
                    />
                  ))}
                  <button onClick={handleRecordToggle} className="btn-ghost w-full py-2 text-sm">
                    + Add another recording
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={typedText}
                onChange={e => setTypedText(e.target.value)}
                placeholder={"I am confident and powerful\nI attract abundance effortlessly\nMy mind is sharp and focused"}
                rows={5}
              />
              {voices.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-dim)' }}>Voice</label>
                    <select value={selectedVoiceIdx} onChange={e => setSelectedVoiceIdx(Number(e.target.value))}>
                      {voices.map((v, i) => (
                        <option key={i} value={i}>{v.name} ({v.lang})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-dim)' }}>
                      Rate: <span style={{ fontFamily: 'var(--font-mono)' }}>{speechRate.toFixed(1)}x</span>
                    </label>
                    <input type="range" min={50} max={200} value={speechRate * 100} onChange={e => setSpeechRate(Number(e.target.value) / 100)} />
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const lines = typedText.split('\n').filter(Boolean);
                    if (lines.length > 0) speakPreview(lines[0], voices[selectedVoiceIdx], speechRate);
                  }}
                  className="btn-ghost px-4 py-2 text-sm"
                >
                  Preview Voice
                </button>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                For downloadable subliminals, please use the Record tab to capture your voice. Type & Speak is for real-time preview only.
              </p>
            </div>
          )}
        </section>

        {/* ============ SECTION B: Processing ============ */}
        <section className="mb-12">
          <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Processing
          </h2>

          <div className="space-y-3">
            <TechniqueCard
              technique="speed"
              title="Speed Layer"
              description="Speeds up your affirmations 2-8x. Too fast for conscious mind to decode, but your subconscious processes every word."
              icon={<span>⏩</span>}
              selected={techniques.has('speed')}
              recommended
              onToggle={() => toggleTechnique('speed')}
            >
              <div>
                <label className="text-xs mb-2 block" style={{ color: 'var(--text-dim)' }}>
                  Speed: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{speedMultiplier}x</span>
                </label>
                <div className="pill-group">
                  {[2, 3, 4, 6, 8].map(s => (
                    <button key={s} className={`pill ${speedMultiplier === s ? 'pill-active' : ''}`} onClick={() => setSpeedMultiplier(s)}>
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </TechniqueCard>

            <TechniqueCard
              technique="volume"
              title="Volume Whisper"
              description="Reduces affirmation volume to -20dB to -35dB beneath the soundscape. Present but imperceptible."
              icon={<span>🔈</span>}
              selected={techniques.has('volume')}
              onToggle={() => toggleTechnique('volume')}
            >
              <div>
                <label className="text-xs mb-2 block" style={{ color: 'var(--text-dim)' }}>
                  Depth: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{volumeDb}dB</span>
                </label>
                <input type="range" min={-35} max={-20} value={volumeDb} onChange={e => setVolumeDb(Number(e.target.value))} />
              </div>
            </TechniqueCard>

            <TechniqueCard
              technique="reverse"
              title="Reverse Layer"
              description="Plays affirmations backwards. A classic subliminal technique — your subconscious doesn't need words in order."
              icon={<span>🔄</span>}
              selected={techniques.has('reverse')}
              onToggle={() => toggleTechnique('reverse')}
            />

            <TechniqueCard
              technique="ultrasonic"
              title="Silent Subliminal"
              description="Shifts affirmations above 17kHz — completely inaudible to the conscious ear. Pioneered by Bud Lowery in 1989."
              icon={<span>🔇</span>}
              selected={techniques.has('ultrasonic')}
              onToggle={() => toggleTechnique('ultrasonic')}
            >
              <div>
                <label className="text-xs mb-2 block" style={{ color: 'var(--text-dim)' }}>
                  Carrier: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{ultrasonicHz.toLocaleString()}Hz</span>
                </label>
                <input type="range" min={15000} max={20000} step={500} value={ultrasonicHz} onChange={e => setUltrasonicHz(Number(e.target.value))} />
                <p className="text-xs mt-2" style={{ color: 'var(--warning)' }}>
                  May not work on all speakers. Best with quality headphones.
                </p>
              </div>
            </TechniqueCard>
          </div>

          {hasRecordings && (
            <div className="mt-6 space-y-3">
              <button
                onClick={handleProcess}
                disabled={processor.isProcessing}
                className="btn-primary w-full py-3 text-sm"
              >
                {processor.isProcessing ? 'Processing...' : 'Process Affirmations'}
              </button>
              {processor.processedBuffer && (
                <div className="studio-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: 'var(--text-dim)' }}>Processed result</span>
                    <button onClick={() => processor.previewProcessed(processor.processedBuffer!)} className="btn-ghost px-3 py-1 text-xs">
                      Preview 5s
                    </button>
                  </div>
                  <WaveformVisualiser buffer={processor.processedBuffer} width={500} height={40} />
                </div>
              )}
            </div>
          )}
        </section>

        {/* ============ SECTION C: Soundscape ============ */}
        <section className="mb-12">
          <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Soundscape
          </h2>

          <SoundscapeSelector
            ambient={ambient}
            binaural={binaural}
            carrierFreq={carrierFreq}
            healingFreq={healingFreq}
            onAmbientChange={setAmbient}
            onBinauralChange={setBinaural}
            onCarrierChange={setCarrierFreq}
            onHealingChange={setHealingFreq}
          />

          {processor.processedBuffer && (
            <button onClick={handleMixPreview} className="btn-ghost w-full py-3 text-sm mt-6">
              Preview Full Mix (10s)
            </button>
          )}
        </section>

        {/* ============ SECTION D: Export ============ */}
        <section className="mb-12">
          <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Export
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-medium mb-3 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                Duration
              </label>
              <div className="pill-group">
                {durationOptions.map(d => (
                  <button
                    key={d}
                    className={`pill ${duration === d * 60 ? 'pill-active' : ''}`}
                    onClick={() => setDuration(d * 60)}
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium mb-2 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                Session Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={e => setSessionName(e.target.value)}
              />
            </div>

            <ExportProgress progress={exporter.progress} isExporting={exporter.isExporting} />

            <button
              onClick={handleExport}
              disabled={!processor.processedBuffer || exporter.isExporting}
              className="btn-primary w-full py-4 text-base font-medium"
            >
              {exporter.isExporting ? `Rendering... ${Math.round(exporter.progress)}%` : 'Generate & Download'}
            </button>

            {!processor.processedBuffer && hasRecordings && (
              <p className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>
                Process your affirmations first before exporting
              </p>
            )}
            {!hasRecordings && (
              <p className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>
                Record your affirmations to get started
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
