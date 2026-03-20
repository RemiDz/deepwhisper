import type { Kin } from './types';
import { SEALS } from './seals';
import { TONES } from './tones';
import { getCastleForKin } from './castles';
import { getWavespellNumber, getHarmonicNumber, isGAPKin } from './wavespell';

// Reference anchor: July 26, 2013 = Kin 164 (Yellow Galactic Seed)
const REFERENCE_YEAR = 2013;
const REFERENCE_MONTH = 7; // July (1-indexed)
const REFERENCE_DAY = 26;
const REFERENCE_KIN = 164;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function isFebruary29(date: Date): boolean {
  return date.getMonth() === 1 && date.getDate() === 29;
}

/**
 * Count Gregorian days between two dates (UTC-based to avoid timezone issues).
 * Returns positive if date2 > date1.
 */
function gregorianDaysBetween(d1Year: number, d1Month: number, d1Day: number, d2Year: number, d2Month: number, d2Day: number): number {
  const utc1 = Date.UTC(d1Year, d1Month - 1, d1Day);
  const utc2 = Date.UTC(d2Year, d2Month - 1, d2Day);
  return Math.round((utc2 - utc1) / (24 * 60 * 60 * 1000));
}

/**
 * Count the number of February 29 dates that occur strictly between the
 * reference date (exclusive) and the target date (inclusive).
 * When target is before reference, the result is negative.
 */
function countLeapDaysBetween(refYear: number, refMonth: number, refDay: number, targetYear: number, targetMonth: number, targetDay: number): number {
  // Determine direction
  const forward = gregorianDaysBetween(refYear, refMonth, refDay, targetYear, targetMonth, targetDay) >= 0;

  const startY = forward ? refYear : targetYear;
  const startM = forward ? refMonth : targetMonth;
  const startD = forward ? refDay : targetDay;
  const endY = forward ? targetYear : refYear;
  const endM = forward ? targetMonth : refMonth;
  const endD = forward ? targetDay : refDay;

  let count = 0;

  for (let year = startY; year <= endY; year++) {
    if (!isLeapYear(year)) continue;

    // Check if Feb 29 of this year falls strictly after (startY/startM/startD)
    // and on or before (endY/endM/endD)
    const feb29Cmp = compareDates(year, 2, 29, startY, startM, startD);
    if (feb29Cmp <= 0) continue; // Feb 29 is on or before start, skip

    const feb29CmpEnd = compareDates(year, 2, 29, endY, endM, endD);
    if (feb29CmpEnd > 0) continue; // Feb 29 is after end, skip

    count++;
  }

  return forward ? count : -count;
}

/**
 * Compare two dates. Returns negative if a < b, 0 if equal, positive if a > b.
 */
function compareDates(aY: number, aM: number, aD: number, bY: number, bM: number, bD: number): number {
  if (aY !== bY) return aY - bY;
  if (aM !== bM) return aM - bM;
  return aD - bD;
}

/**
 * Get the Kin number for a given Gregorian date.
 * Returns 0 for February 29 (0.0 Hunab Ku — no Kin assigned).
 * Returns 1-260 for all other dates.
 */
export function getKinNumber(year: number, month: number, day: number): number {
  // February 29 has no Kin
  if (month === 2 && day === 29) {
    return 0;
  }

  const gregorianDays = gregorianDaysBetween(
    REFERENCE_YEAR, REFERENCE_MONTH, REFERENCE_DAY,
    year, month, day
  );

  const leapDays = countLeapDaysBetween(
    REFERENCE_YEAR, REFERENCE_MONTH, REFERENCE_DAY,
    year, month, day
  );

  const adjustedDays = gregorianDays - leapDays;

  // Modular arithmetic to get Kin 1-260
  let kin = ((REFERENCE_KIN - 1 + adjustedDays) % 260 + 260) % 260 + 1;
  return kin;
}

/**
 * Get the Kin number from a Date object.
 */
export function getKinForDate(date: Date): number {
  return getKinNumber(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}

/**
 * Build a full Kin object from a Kin number (1-260).
 */
export function buildKin(kinNumber: number): Kin {
  const sealIndex = (kinNumber - 1) % 20;
  const toneIndex = (kinNumber - 1) % 13;
  const seal = SEALS[sealIndex];
  const tone = TONES[toneIndex];

  return {
    number: kinNumber,
    seal,
    tone,
    title: `${seal.colour} ${tone.name} ${seal.name}`,
    wavespell: getWavespellNumber(kinNumber),
    castle: getCastleForKin(kinNumber),
    harmonic: getHarmonicNumber(kinNumber),
    isGAP: isGAPKin(kinNumber),
  };
}

/**
 * Get a full Kin object for a given date.
 * Returns null for February 29.
 */
export function getKinForDateFull(date: Date): Kin | null {
  const kinNumber = getKinForDate(date);
  if (kinNumber === 0) return null;
  return buildKin(kinNumber);
}
