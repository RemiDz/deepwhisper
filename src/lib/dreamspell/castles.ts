import type { Castle } from './types';

export const CASTLES: Castle[] = [
  { number: 1, name: 'Red Eastern Castle of Turning',       colour: 'Red',    direction: 'East',    quality: 'Turning',     kinRange: [1, 52] },
  { number: 2, name: 'White Northern Castle of Crossing',   colour: 'White',  direction: 'North',   quality: 'Crossing',    kinRange: [53, 104] },
  { number: 3, name: 'Blue Western Castle of Burning',      colour: 'Blue',   direction: 'West',    quality: 'Burning',     kinRange: [105, 156] },
  { number: 4, name: 'Yellow Southern Castle of Giving',    colour: 'Yellow', direction: 'South',   quality: 'Giving',      kinRange: [157, 208] },
  { number: 5, name: 'Green Central Castle of Enchantment', colour: 'Green',  direction: 'Central', quality: 'Enchantment', kinRange: [209, 260] },
];

export function getCastleForKin(kinNumber: number): Castle {
  const castle = CASTLES.find(c => kinNumber >= c.kinRange[0] && kinNumber <= c.kinRange[1]);
  return castle ?? CASTLES[0];
}
