'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ParticleField from '@/components/ParticleField';
import GradientMesh from '@/components/GradientMesh';
import StepIndicator from '@/components/SessionBuilder/StepIndicator';
import IntentionStep from '@/components/SessionBuilder/IntentionStep';
import AffirmationsStep from '@/components/SessionBuilder/AffirmationsStep';
import VoiceStep from '@/components/SessionBuilder/VoiceStep';
import SoundscapeStep from '@/components/SessionBuilder/SoundscapeStep';
import DurationStep from '@/components/SessionBuilder/DurationStep';
import { SessionBuilderState, IntentionCategory } from '@/types/session';
import { saveSession, generateSessionName } from '@/lib/sessions';
import { affirmationLibrary, DEFAULT_SELECTED_COUNT, MIN_AFFIRMATIONS } from '@/lib/affirmations';

const TOTAL_STEPS = 5;

const initialState: SessionBuilderState = {
  step: 0,
  category: null,
  affirmations: [],
  customAffirmations: [],
  voiceType: 'whisper',
  voiceSpeed: 'normal',
  subliminalDepth: 0.08,
  ambient: 'rain',
  binauralEnabled: false,
  binauralPreset: 'theta',
  binauralFreq: 6,
  carrierFreq: 200,
  healingFreqEnabled: false,
  healingFreq: 432,
  duration: 900, // 15 minutes in seconds
  name: '',
};

export default function CreatePage() {
  const router = useRouter();
  const [state, setState] = useState<SessionBuilderState>(initialState);
  const [saved, setSaved] = useState(false);

  const updateState = useCallback(<K extends keyof SessionBuilderState>(key: K, value: SessionBuilderState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const next = useCallback(() => {
    setState(prev => {
      const nextStep = Math.min(prev.step + 1, TOTAL_STEPS - 1);
      const updates: Partial<SessionBuilderState> = { step: nextStep };
      if (nextStep === 4 && !prev.name && prev.category) {
        updates.name = generateSessionName(prev.category);
      }
      return { ...prev, ...updates };
    });
  }, []);

  const prev = useCallback(() => {
    setState(p => ({ ...p, step: Math.max(p.step - 1, 0) }));
  }, []);

  const handleCategorySelect = useCallback((cat: IntentionCategory) => {
    setState(prev => {
      // Pre-select first 5 affirmations for non-custom categories
      let preSelected: string[] = [];
      if (cat !== 'custom') {
        preSelected = affirmationLibrary[cat].slice(0, DEFAULT_SELECTED_COUNT);
      }
      return {
        ...prev,
        category: cat,
        affirmations: preSelected,
        customAffirmations: [],
        step: prev.step + 1,
      };
    });
  }, []);

  const toggleAffirmation = useCallback((aff: string) => {
    setState(p => ({
      ...p,
      affirmations: p.affirmations.includes(aff)
        ? p.affirmations.filter(a => a !== aff)
        : [...p.affirmations, aff],
    }));
  }, []);

  const addCustomAffirmation = useCallback((aff: string) => {
    setState(p => ({
      ...p,
      customAffirmations: [...p.customAffirmations, aff],
      affirmations: [...p.affirmations, aff],
    }));
  }, []);

  const removeCustomAffirmation = useCallback((aff: string) => {
    setState(p => ({
      ...p,
      customAffirmations: p.customAffirmations.filter(a => a !== aff),
      affirmations: p.affirmations.filter(a => a !== aff),
    }));
  }, []);

  const buildSession = useCallback(() => {
    if (!state.category || state.affirmations.length < MIN_AFFIRMATIONS) return null;
    return saveSession({
      name: state.name || generateSessionName(state.category),
      category: state.category,
      affirmations: state.affirmations,
      voice: {
        type: state.voiceType,
        speed: state.voiceSpeed,
        subliminalDepth: state.subliminalDepth,
        recordedAudioUrl: state.recordedAudioUrl,
      },
      soundscape: {
        ambient: state.ambient,
        binauralEnabled: state.binauralEnabled,
        binauralFreq: state.binauralFreq,
        carrierFreq: state.carrierFreq,
        healingFreqEnabled: state.healingFreqEnabled,
        healingFreq: state.healingFreq,
      },
      duration: state.duration,
    });
  }, [state]);

  const handleFinish = useCallback(() => {
    const session = buildSession();
    if (session) router.push(`/play/${session.id}`);
  }, [buildSession, router]);

  const handleSaveForLater = useCallback(() => {
    const session = buildSession();
    if (session) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }, [buildSession]);

  const canAdvance = () => {
    switch (state.step) {
      case 0: return state.category !== null;
      case 1: return state.affirmations.length >= MIN_AFFIRMATIONS;
      default: return true;
    }
  };

  const isReady = state.category !== null && state.affirmations.length >= MIN_AFFIRMATIONS;

  return (
    <main className="relative min-h-screen">
      <GradientMesh />
      <ParticleField count={10} />

      <nav className="relative z-10 flex items-center justify-between p-6">
        <Link href="/" className="text-sm no-underline" style={{ color: 'var(--text-secondary)' }}>← Back</Link>
      </nav>

      <div className="relative z-10 px-6 pb-24 max-w-4xl mx-auto">
        <StepIndicator currentStep={state.step} totalSteps={TOTAL_STEPS} />

        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {state.step === 0 && (
              <IntentionStep selected={state.category} onSelect={handleCategorySelect} />
            )}
            {state.step === 1 && state.category && (
              <AffirmationsStep
                category={state.category}
                selected={state.affirmations}
                customAffirmations={state.customAffirmations}
                onToggle={toggleAffirmation}
                onAddCustom={addCustomAffirmation}
                onRemoveCustom={removeCustomAffirmation}
              />
            )}
            {state.step === 2 && (
              <VoiceStep
                voiceType={state.voiceType}
                voiceSpeed={state.voiceSpeed}
                subliminalDepth={state.subliminalDepth}
                recordedAudioUrl={state.recordedAudioUrl}
                onTypeChange={v => updateState('voiceType', v)}
                onSpeedChange={v => updateState('voiceSpeed', v)}
                onDepthChange={v => updateState('subliminalDepth', v)}
                onRecordedAudioChange={v => updateState('recordedAudioUrl', v)}
              />
            )}
            {state.step === 3 && (
              <SoundscapeStep
                ambient={state.ambient}
                binauralEnabled={state.binauralEnabled}
                binauralPreset={state.binauralPreset}
                binauralFreq={state.binauralFreq}
                carrierFreq={state.carrierFreq}
                healingFreqEnabled={state.healingFreqEnabled}
                healingFreq={state.healingFreq}
                onAmbientChange={v => updateState('ambient', v)}
                onBinauralEnabledChange={v => updateState('binauralEnabled', v)}
                onBinauralPresetChange={v => updateState('binauralPreset', v)}
                onBinauralFreqChange={v => updateState('binauralFreq', v)}
                onCarrierFreqChange={v => updateState('carrierFreq', v)}
                onHealingFreqEnabledChange={v => updateState('healingFreqEnabled', v)}
                onHealingFreqChange={v => updateState('healingFreq', v)}
              />
            )}
            {state.step === 4 && (
              <DurationStep
                state={state}
                onDurationChange={v => updateState('duration', v)}
                onNameChange={v => updateState('name', v)}
                onFinish={handleFinish}
                onSaveForLater={handleSaveForLater}
                isReady={isReady}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {state.step > 0 && state.step < 4 && (
          <div className="flex justify-between mt-12 max-w-2xl mx-auto">
            <button onClick={prev} className="btn-glass px-6 py-3 text-sm">Back</button>
            {canAdvance() && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={next} className="btn-primary px-6 py-3 text-sm">
                Next
              </motion.button>
            )}
          </div>
        )}

        {/* Saved confirmation */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-3 rounded-full"
            >
              <span className="text-sm" style={{ color: 'var(--conscious)' }}>Session saved!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
