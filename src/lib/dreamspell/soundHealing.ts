export interface SealSoundProfile {
  sealIndex: number;
  frequency: number;
  note: string;
  chakra: string;
  chakraColour: string;
  instruments: string[];
  quality: string;
  duration: number;
  bodyArea: string;
}

export interface ToneSoundProfile {
  toneNumber: number;
  interval: string;
  ratio: string;
  quality: string;
  bowlNote: string;
}

export const SEAL_SOUND_PROFILES: SealSoundProfile[] = [
  { sealIndex: 0,  frequency: 396,    note: 'G4',   chakra: 'Root',          chakraColour: '#ef4444', instruments: ['Tibetan bowl', 'Drum'],          quality: 'Grounding, nurturing',       duration: 20, bodyArea: 'Lower body' },
  { sealIndex: 1,  frequency: 417,    note: 'G#4',  chakra: 'Throat',        chakraColour: '#3b82f6', instruments: ['Crystal bowl', 'Flute'],         quality: 'Clearing, communicating',     duration: 15, bodyArea: 'Throat & chest' },
  { sealIndex: 2,  frequency: 432,    note: 'A4',   chakra: 'Third Eye',     chakraColour: '#6366f1', instruments: ['Crystal bowl', 'Monochord'],     quality: 'Dreaming, intuiting',        duration: 25, bodyArea: 'Head' },
  { sealIndex: 3,  frequency: 444,    note: 'A4+',  chakra: 'Sacral',        chakraColour: '#f97316', instruments: ['Crystal bowl', 'Chimes'],        quality: 'Activating, targeting',      duration: 15, bodyArea: 'Lower abdomen' },
  { sealIndex: 4,  frequency: 528,    note: 'C5',   chakra: 'Root & Sacral', chakraColour: '#ef4444', instruments: ['Didgeridoo', 'Drum'],            quality: 'Vital, instinctive',         duration: 20, bodyArea: 'Spine' },
  { sealIndex: 5,  frequency: 285,    note: 'D4',   chakra: 'Heart',         chakraColour: '#22c55e', instruments: ['Gong', 'Tibetan bowl'],          quality: 'Releasing, equalising',      duration: 20, bodyArea: 'Heart centre' },
  { sealIndex: 6,  frequency: 174,    note: 'F3',   chakra: 'Root',          chakraColour: '#ef4444', instruments: ['Monochord', 'Tibetan bowl'],     quality: 'Healing, knowing',           duration: 30, bodyArea: 'Hands & arms' },
  { sealIndex: 7,  frequency: 639,    note: 'E5',   chakra: 'Heart',         chakraColour: '#22c55e', instruments: ['Crystal bowl', 'Harp'],          quality: 'Harmonising, beautifying',   duration: 20, bodyArea: 'Heart' },
  { sealIndex: 8,  frequency: 741,    note: 'F#5',  chakra: 'Throat',        chakraColour: '#3b82f6', instruments: ['Crystal bowl F#', 'Singing'],    quality: 'Purifying, flowing',         duration: 22, bodyArea: 'Throat & emotions' },
  { sealIndex: 9,  frequency: 852,    note: 'A5',   chakra: 'Heart',         chakraColour: '#ec4899', instruments: ['Crystal bowl', 'Voice'],         quality: 'Loving, opening',            duration: 15, bodyArea: 'Heart centre' },
  { sealIndex: 10, frequency: 963,    note: 'B5',   chakra: 'Crown',         chakraColour: '#a855f7', instruments: ['Crystal bowl', 'Bells'],         quality: 'Playful, awakening',         duration: 13, bodyArea: 'Crown' },
  { sealIndex: 11, frequency: 480,    note: 'B4',   chakra: 'Solar Plexus',  chakraColour: '#eab308', instruments: ['Monochord', 'Crystal bowl'],     quality: 'Empowering, free',           duration: 20, bodyArea: 'Solar plexus' },
  { sealIndex: 12, frequency: 512,    note: 'C5',   chakra: 'All',           chakraColour: '#e8e6df', instruments: ['Gong', 'Crystal bowl'],          quality: 'Expanding, exploring',       duration: 20, bodyArea: 'Full body' },
  { sealIndex: 13, frequency: 136.1,  note: 'C#3',  chakra: 'Third Eye',     chakraColour: '#6366f1', instruments: ['Monochord', 'Tibetan bowl'],     quality: 'Timeless, enchanting',       duration: 30, bodyArea: 'Pineal' },
  { sealIndex: 14, frequency: 448,    note: 'A4',   chakra: 'Third Eye',     chakraColour: '#6366f1', instruments: ['Crystal bowl', 'Flute'],         quality: 'Visionary, creating',        duration: 20, bodyArea: 'Eyes & head' },
  { sealIndex: 15, frequency: 256,    note: 'C4',   chakra: 'Solar Plexus',  chakraColour: '#eab308', instruments: ['Drum', 'Didgeridoo'],            quality: 'Questioning, strengthening', duration: 18, bodyArea: 'Core' },
  { sealIndex: 16, frequency: 7.83,   note: 'Schumann', chakra: 'Root',      chakraColour: '#ef4444', instruments: ['Drum', 'Monochord'],             quality: 'Grounding, navigating',      duration: 25, bodyArea: 'Feet & legs' },
  { sealIndex: 17, frequency: 384,    note: 'G4',   chakra: 'Third Eye',     chakraColour: '#c0c0c0', instruments: ['Crystal bowl', 'Gong'],          quality: 'Reflecting, clarifying',     duration: 20, bodyArea: 'Mind' },
  { sealIndex: 18, frequency: 768,    note: 'G5',   chakra: 'All',           chakraColour: '#a855f7', instruments: ['Gong', 'Drum'],                  quality: 'Catalysing, transforming',   duration: 15, bodyArea: 'Full body' },
  { sealIndex: 19, frequency: 126.22, note: 'C3',   chakra: 'Crown',         chakraColour: '#eab308', instruments: ['Crystal bowl', 'Gong'],          quality: 'Illuminating, enlightening', duration: 20, bodyArea: 'Crown' },
];

export const TONE_SOUND_PROFILES: ToneSoundProfile[] = [
  { toneNumber: 1,  interval: 'Unison',         ratio: '1:1',   quality: 'Unity, single point',             bowlNote: 'C' },
  { toneNumber: 2,  interval: 'Minor Second',    ratio: '16:15', quality: 'Tension, polarity',               bowlNote: 'C#' },
  { toneNumber: 3,  interval: 'Major Second',    ratio: '9:8',   quality: 'Activating, stepping',            bowlNote: 'D' },
  { toneNumber: 4,  interval: 'Minor Third',     ratio: '6:5',   quality: 'Structure, melancholy',           bowlNote: 'Eb' },
  { toneNumber: 5,  interval: 'Major Third',     ratio: '5:4',   quality: 'Radiant, commanding',             bowlNote: 'E' },
  { toneNumber: 6,  interval: 'Perfect Fourth',  ratio: '4:3',   quality: 'Balanced, stable',                bowlNote: 'F' },
  { toneNumber: 7,  interval: 'Tritone',         ratio: '45:32', quality: 'Tension, attunement',             bowlNote: 'F#' },
  { toneNumber: 8,  interval: 'Perfect Fifth',   ratio: '3:2',   quality: 'Harmony, integrity',              bowlNote: 'G' },
  { toneNumber: 9,  interval: 'Minor Sixth',     ratio: '8:5',   quality: 'Pulsing, yearning',               bowlNote: 'Ab' },
  { toneNumber: 10, interval: 'Major Sixth',     ratio: '5:3',   quality: 'Manifesting, warm',               bowlNote: 'A' },
  { toneNumber: 11, interval: 'Minor Seventh',   ratio: '16:9',  quality: 'Dissolving, releasing',           bowlNote: 'Bb' },
  { toneNumber: 12, interval: 'Major Seventh',   ratio: '15:8',  quality: 'Cooperating, almost resolved',    bowlNote: 'B' },
  { toneNumber: 13, interval: 'Octave',          ratio: '2:1',   quality: 'Transcendence, completion',       bowlNote: 'C' },
];

export function getSealSound(sealIndex: number): SealSoundProfile {
  return SEAL_SOUND_PROFILES[sealIndex];
}

export function getToneSound(toneNumber: number): ToneSoundProfile {
  return TONE_SOUND_PROFILES[toneNumber - 1];
}

/** Best time of day based on directional correspondence */
export function getBestTimeOfDay(direction: string): string {
  switch (direction) {
    case 'East': return 'Morning (sunrise)';
    case 'South': return 'Midday';
    case 'West': return 'Evening (sunset)';
    case 'North': return 'Night';
    default: return 'Any time';
  }
}
