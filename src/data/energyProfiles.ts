// [Communication, Creativity, Physical, Emotional, Intuition, Transformation, Connection, Grounding]
export const sealProfiles: Record<number, number[]> = {
  0:  [4, 5, 7, 6, 5, 4, 5, 9],  // Dragon — nurturing, primal, grounded
  1:  [9, 6, 3, 5, 7, 5, 6, 3],  // Wind — communication, spirit, breath
  2:  [3, 8, 3, 6, 9, 4, 4, 5],  // Night — dreams, intuition, abundance
  3:  [5, 6, 4, 4, 5, 3, 5, 8],  // Seed — intention, targeting, grounding
  4:  [4, 4, 9, 7, 6, 7, 5, 6],  // Serpent — life force, physical, kundalini
  5:  [5, 3, 4, 7, 6, 8, 7, 4],  // Worldbridger — transition, surrender, connection
  6:  [5, 6, 6, 5, 5, 5, 7, 6],  // Hand — healing, accomplishment, knowing
  7:  [6, 9, 5, 6, 6, 4, 7, 5],  // Star — harmony, beauty, creativity
  8:  [5, 6, 4, 9, 7, 5, 6, 5],  // Moon — emotions, flow, purification
  9:  [6, 5, 5, 8, 5, 4, 9, 6],  // Dog — love, loyalty, heart, connection
  10: [7, 9, 5, 6, 5, 5, 8, 3],  // Monkey — play, magic, creativity, illusion
  11: [7, 6, 5, 5, 8, 5, 7, 5],  // Human — free will, wisdom, influence
  12: [6, 5, 5, 4, 6, 6, 5, 4],  // Skywalker — exploration, space, expansion
  13: [4, 5, 3, 5, 9, 6, 4, 5],  // Wizard — receptivity, enchantment, timelessness
  14: [5, 7, 4, 4, 9, 5, 5, 4],  // Eagle — vision, mind, creativity
  15: [6, 4, 8, 5, 5, 6, 5, 7],  // Warrior — intelligence, fearlessness, questioning
  16: [5, 5, 6, 5, 6, 5, 6, 9],  // Earth — navigation, synchronicity, grounding
  17: [4, 5, 3, 5, 8, 6, 4, 5],  // Mirror — reflection, order, clarity
  18: [5, 7, 7, 6, 5, 9, 5, 4],  // Storm — catalysis, energy, transformation
  19: [7, 7, 6, 6, 7, 5, 7, 7],  // Sun — enlightenment, universal fire, wholeness
};

export const toneModifiers: Record<number, number> = {
  0:  0.7,   // Magnetic — gathering, low intensity, setting purpose
  1:  0.75,  // Lunar — polarising, identifying challenge
  2:  0.85,  // Electric — activating, bonding service
  3:  0.8,   // Self-existing — defining, measuring form
  4:  0.95,  // Overtone — empowering, commanding radiance
  5:  0.9,   // Rhythmic — organising, balancing equality
  6:  1.0,   // Resonant — channelling, centre point, attunement
  7:  1.05,  // Galactic — harmonising, modelling integrity
  8:  1.2,   // Solar — pulsing, intention, realising
  9:  1.15,  // Planetary — perfecting, producing manifestation
  10: 1.1,   // Spectral — dissolving, releasing, liberation
  11: 1.0,   // Crystal — dedicating, cooperating, universalising
  12: 1.3,   // Cosmic — transcending, enduring, presence (peak)
};

export function getEnergyProfile(sealIndex: number, toneIndex: number): {
  values: number[];
  overall: number;
} {
  const base = sealProfiles[sealIndex];
  const modifier = toneModifiers[toneIndex];
  const values = base.map(v => Math.min(10, Math.max(1, Math.round(v * modifier))));
  const overall = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  return { values, overall };
}
