/**
 * Tone → Frequency mapping (13 tones)
 * Starter data — Remi will refine later.
 */
export const TONE_FREQUENCIES: Record<number, { hz: number; solfeggio: string; quality: string }> = {
  1:  { hz: 174,  solfeggio: '—',   quality: 'Foundation' },
  2:  { hz: 285,  solfeggio: '—',   quality: 'Polarity' },
  3:  { hz: 396,  solfeggio: 'UT',  quality: 'Activation' },
  4:  { hz: 417,  solfeggio: 'RE',  quality: 'Definition' },
  5:  { hz: 432,  solfeggio: '—',   quality: 'Centre' },
  6:  { hz: 528,  solfeggio: 'MI',  quality: 'Balance' },
  7:  { hz: 639,  solfeggio: 'FA',  quality: 'Resonance' },
  8:  { hz: 741,  solfeggio: 'SOL', quality: 'Integration' },
  9:  { hz: 852,  solfeggio: 'LA',  quality: 'Intention' },
  10: { hz: 963,  solfeggio: 'TI',  quality: 'Manifestation' },
  11: { hz: 1074, solfeggio: '—',   quality: 'Liberation' },
  12: { hz: 1185, solfeggio: '—',   quality: 'Cooperation' },
  13: { hz: 1296, solfeggio: '—',   quality: 'Transcendence' },
};

/**
 * Seal → Instrument mapping (20 seals)
 * Starter data — Remi will refine later.
 */
export const SEAL_INSTRUMENTS: Record<number, { instrument: string; element: string; approach: string }> = {
  0:  { instrument: 'Monochord',              element: 'Water', approach: 'Deep sustained drone' },
  1:  { instrument: 'Crystal Singing Bowl',   element: 'Air',   approach: 'Breath-synced toning' },
  2:  { instrument: 'Tibetan Singing Bowl',   element: 'Water', approach: 'Dream induction' },
  3:  { instrument: 'Tuning Fork',            element: 'Fire',  approach: 'Seed point activation' },
  4:  { instrument: 'Didgeridoo',             element: 'Earth', approach: 'Serpent breath grounding' },
  5:  { instrument: 'Gong',                   element: 'Water', approach: 'Surrender wash' },
  6:  { instrument: 'Crystal Singing Bowl',   element: 'Fire',  approach: 'Accomplishment tones' },
  7:  { instrument: 'Monochord',              element: 'Air',   approach: 'Harmonic layering' },
  8:  { instrument: 'Tibetan Singing Bowl',   element: 'Water', approach: 'Purification pulses' },
  9:  { instrument: 'Gong',                   element: 'Earth', approach: 'Manifestation crescendo' },
  10: { instrument: 'Crystal Singing Bowl',   element: 'Air',   approach: 'Clarity frequencies' },
  11: { instrument: 'Tuning Fork',            element: 'Water', approach: 'Complex harmonic weaving' },
  12: { instrument: 'Didgeridoo',             element: 'Earth', approach: 'Navigation rhythm' },
  13: { instrument: 'Monochord',              element: 'Air',   approach: 'Wisdom drone meditation' },
  14: { instrument: 'Gong',                   element: 'Fire',  approach: 'Vision quest crescendo' },
  15: { instrument: 'Tibetan Singing Bowl',   element: 'Earth', approach: 'Warrior pulse rhythm' },
  16: { instrument: 'Crystal Singing Bowl',   element: 'Water', approach: 'Earth attunement' },
  17: { instrument: 'Tuning Fork',            element: 'Air',   approach: 'Mirror frequency reflection' },
  18: { instrument: 'Gong',                   element: 'Fire',  approach: 'Storm release crescendo' },
  19: { instrument: 'Monochord',              element: 'Fire',  approach: 'Solar illumination drone' },
};
