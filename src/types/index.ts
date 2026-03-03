export type ProcessingTechnique = 'speed' | 'volume' | 'reverse' | 'ultrasonic';

export interface ProcessingConfig {
  techniques: ProcessingTechnique[];
  speedMultiplier: number;        // 2-8, default 4
  volumeReduction: number;        // -20 to -35 dB, default -25
  ultrasonicCarrier: number;      // Hz, default 17500
}

export type AmbientType = 'rain' | 'ocean' | 'forest' | 'bowls' | 'drone' | 'pink-noise' | 'brown-noise' | 'silence';
export type BinauralPreset = 'off' | 'theta' | 'alpha' | 'delta';
export type HealingFrequency = 0 | 432 | 528 | 396 | 639;

export interface SoundscapeConfig {
  ambient: AmbientType;
  binaural: BinauralPreset;
  carrierFreq: number;
  healingFreq: HealingFrequency;
}

export interface AudioSession {
  id: string;
  name: string;
  affirmations: string[];
  recordings: string[];
  processing: ProcessingConfig;
  soundscape: SoundscapeConfig;
  duration: number;
  createdAt: string;
}

export type FlashPosition = 'centre' | 'random';
export type FlashBackground = 'dark' | 'sacred-geometry' | 'colour-pulse' | 'custom';

export interface FlashConfig {
  affirmations: string[];
  flashDuration: number;          // ms (10-200)
  interval: number;               // seconds (2-15)
  opacity: number;                // 0.1-1.0
  textSize: 'small' | 'medium' | 'large';
  position: FlashPosition;
  background: FlashBackground;
  customBgColour?: string;
  sessionDuration: number;        // seconds
  soundEnabled: boolean;
}

export type WallpaperStyle = 'sacred-geometry' | 'mandala' | 'cosmic' | 'minimal';
export type WallpaperSize = 'phone' | 'desktop' | 'tablet';

export interface WallpaperConfig {
  affirmation: string;
  style: WallpaperStyle;
  size: WallpaperSize;
  reveal: boolean;
}

export const WALLPAPER_SIZES = {
  phone: { width: 1170, height: 2532 },
  desktop: { width: 2560, height: 1440 },
  tablet: { width: 2048, height: 2732 },
} as const;
