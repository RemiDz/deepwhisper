export type IntentionCategory =
  | 'confidence'
  | 'abundance'
  | 'health'
  | 'sleep'
  | 'focus'
  | 'love'
  | 'spiritual'
  | 'creative'
  | 'custom';

export type VoiceType = 'whisper' | 'gentle' | 'recorded';
export type VoiceSpeed = 'slow' | 'normal' | 'rapid';
export type AmbientType = 'rain' | 'ocean' | 'forest' | 'bowls' | 'drone' | 'silence';
export type BinauralPreset = 'theta' | 'alpha' | 'delta' | 'custom';
export type HealingFrequency = 432 | 528 | 396 | 639;

export interface SubliminalSession {
  id: string;
  shareId: string;
  name: string;
  category: IntentionCategory;
  affirmations: string[];
  voice: {
    type: VoiceType;
    speed: VoiceSpeed;
    subliminalDepth: number; // 0.02 - 0.15
    recordedAudioUrl?: string;
  };
  soundscape: {
    ambient: AmbientType;
    binauralEnabled: boolean;
    binauralFreq: number; // Hz (beat frequency)
    carrierFreq: number; // Hz (default 200)
    healingFreqEnabled: boolean;
    healingFreq: HealingFrequency;
  };
  duration: number; // seconds
  createdAt: string; // ISO date
  playCount: number;
}

export interface CategoryDefinition {
  key: IntentionCategory;
  name: string;
  icon: string;
  accent: string; // CSS colour
  description: string;
}

export interface SessionBuilderState {
  step: number;
  category: IntentionCategory | null;
  affirmations: string[];
  customAffirmations: string[];
  voiceType: VoiceType;
  voiceSpeed: VoiceSpeed;
  subliminalDepth: number;
  recordedAudioUrl?: string;
  ambient: AmbientType;
  binauralEnabled: boolean;
  binauralFreq: number;
  binauralPreset: BinauralPreset;
  carrierFreq: number;
  healingFreqEnabled: boolean;
  healingFreq: HealingFrequency;
  duration: number; // seconds
  name: string;
}
