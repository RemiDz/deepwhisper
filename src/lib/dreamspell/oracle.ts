import type { Kin, Oracle } from './types';
import { SEALS } from './seals';

/**
 * Guide seal offset table indexed by tone number (1-13).
 * The guide is always the same colour as the destiny seal.
 * Offsets are added to the seal index (mod 20) to find the guide seal.
 */
const GUIDE_OFFSETS: Record<number, number> = {
  1: 0,  6: 0,  11: 0,
  2: 12, 7: 12, 12: 12,
  3: 4,  8: 4,  13: 4,
  4: 16, 9: 16,
  5: 8,  10: 8,
};

/**
 * Calculate the Fifth Force Oracle for a given Kin.
 *
 * The oracle consists of 5 positions:
 * - Destiny (centre): The Kin itself
 * - Guide (top): Same colour as destiny, determined by tone
 * - Analog (right): Support — seal pairs sum to 17
 * - Antipode (left): Challenge — seal + 10
 * - Occult (bottom): Hidden power — seal pairs sum to 19
 *
 * Verified against lawoftime.org Fifth Force Oracle:
 * Dragon supported by Mirror, challenged by Monkey, hidden power from Sun.
 */
export function getOracle(kin: Kin): Oracle {
  const sealIndex = kin.seal.number; // 0-19
  const toneNumber = kin.tone.number; // 1-13

  // Analog (support): seal pairs that sum to 17
  // Dragon(0)↔Mirror(17), Wind(1)↔Earth(16), Night(2)↔Warrior(15),
  // Seed(3)↔Eagle(14), Serpent(4)↔Wizard(13), Worldbridger(5)↔Skywalker(12),
  // Hand(6)↔Human(11), Star(7)↔Monkey(10), Moon(8)↔Dog(9)
  const analogIndex = (17 - sealIndex + 20) % 20;

  // Antipode (challenge): seal + 10 (mod 20)
  const antipodeIndex = (sealIndex + 10) % 20;

  // Occult (hidden power): seal pairs that sum to 19
  // Dragon(0)↔Sun(19), Wind(1)↔Storm(18), Night(2)↔Mirror(17)... wait
  // Actually: Dragon(0)↔Sun(19), Wind(1)↔Storm(18), Night(2)↔Mirror(17),
  // Seed(3)↔Earth(16), Serpent(4)↔Warrior(15), Worldbridger(5)↔Eagle(14),
  // Hand(6)↔Wizard(13), Star(7)↔Skywalker(12), Moon(8)↔Human(11), Dog(9)↔Monkey(10)
  // Equivalently: occult Kin = 261 - kinNumber, and occult seal = seal of that Kin
  // The tones of destiny + occult always sum to 14.
  const occultIndex = (19 - sealIndex + 20) % 20;

  // Guide: determined by tone, same colour family as destiny
  const guideOffset = GUIDE_OFFSETS[toneNumber];
  const guideIndex = (sealIndex + guideOffset) % 20;

  return {
    destiny: kin,
    guide: SEALS[guideIndex],
    analog: SEALS[analogIndex],
    antipode: SEALS[antipodeIndex],
    occult: SEALS[occultIndex],
  };
}
