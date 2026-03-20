import { SEALS } from './seals';
import { TONES } from './tones';
import type { SolarSeal, GalacticTone } from './types';

/**
 * Get the wavespell number for a given Kin (1-20).
 * Each wavespell is 13 Kin long. Wavespell 1 = Kin 1-13, Wavespell 2 = Kin 14-26, etc.
 */
export function getWavespellNumber(kinNumber: number): number {
  return Math.floor((kinNumber - 1) / 13) + 1;
}

/**
 * Get the seal that initiates the wavespell the given Kin belongs to.
 */
export function getWavespellSeal(kinNumber: number): SolarSeal {
  const wavespellStartKin = (getWavespellNumber(kinNumber) - 1) * 13 + 1;
  const sealIndex = (wavespellStartKin - 1) % 20;
  return SEALS[sealIndex];
}

/**
 * Get the tone within the current wavespell (1-13).
 */
export function getWavespellPosition(kinNumber: number): number {
  return ((kinNumber - 1) % 13) + 1;
}

/**
 * Get the harmonic number (1-65) for a Kin.
 * Each harmonic is 4 consecutive Kin.
 */
export function getHarmonicNumber(kinNumber: number): number {
  return Math.floor((kinNumber - 1) / 4) + 1;
}

/**
 * Galactic Activation Portal days — 52 Kin forming the "Loom of the Maya"
 * DNA double-helix pattern on the Tzolkin grid.
 *
 * Pattern: two interlocking diamonds (outer cols 0-4/8-12, inner cols 2-4/8-10)
 * plus two solid GAP columns (col 5: Kin 106-115, col 7: Kin 146-155).
 * The Mystic Column (col 6: Kin 121-140) is NOT part of the GAP pattern.
 */
const GAP_KIN = new Set([
  // Outer diamond (left half, cols 0-4)
  1, 20, 22, 39, 43, 58, 64, 77, 85, 96,
  // Solid column 5 (rows 5-14): 10 consecutive GAP days
  106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
  // Solid column 7 (rows 5-14): 10 consecutive GAP days
  146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
  // Outer diamond (right half, cols 8-12)
  165, 176, 184, 197, 203, 218, 222, 239, 241, 260,
  // Inner diamond (cols 2-4 left, cols 8-10 right)
  50, 51, 69, 72, 88, 93, 168, 173, 189, 192, 210, 211,
]);

export function isGAPKin(kinNumber: number): boolean {
  return GAP_KIN.has(kinNumber);
}
