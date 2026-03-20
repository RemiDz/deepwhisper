import type { Moon13 } from './types';
import { TONES } from './tones';

export const MOONS: Moon13[] = [
  { number: 1,  name: 'Magnetic Moon',      tone: TONES[0],  gregorianStart: { month: 7, day: 26 }, gregorianEnd: { month: 8, day: 22 },  question: 'What is my purpose?' },
  { number: 2,  name: 'Lunar Moon',         tone: TONES[1],  gregorianStart: { month: 8, day: 23 }, gregorianEnd: { month: 9, day: 19 },  question: 'What is my challenge?' },
  { number: 3,  name: 'Electric Moon',      tone: TONES[2],  gregorianStart: { month: 9, day: 20 }, gregorianEnd: { month: 10, day: 17 }, question: 'How can I best serve?' },
  { number: 4,  name: 'Self-existing Moon',  tone: TONES[3],  gregorianStart: { month: 10, day: 18 }, gregorianEnd: { month: 11, day: 14 }, question: 'What is the form of my service?' },
  { number: 5,  name: 'Overtone Moon',      tone: TONES[4],  gregorianStart: { month: 11, day: 15 }, gregorianEnd: { month: 12, day: 12 }, question: 'How can I best empower myself?' },
  { number: 6,  name: 'Rhythmic Moon',      tone: TONES[5],  gregorianStart: { month: 12, day: 13 }, gregorianEnd: { month: 1, day: 9 },  question: 'How can I extend my equality to others?' },
  { number: 7,  name: 'Resonant Moon',      tone: TONES[6],  gregorianStart: { month: 1, day: 10 }, gregorianEnd: { month: 2, day: 6 },  question: 'How can I attune my service to others?' },
  { number: 8,  name: 'Galactic Moon',      tone: TONES[7],  gregorianStart: { month: 2, day: 7 },  gregorianEnd: { month: 3, day: 6 },  question: 'Do I live what I believe?' },
  { number: 9,  name: 'Solar Moon',         tone: TONES[8],  gregorianStart: { month: 3, day: 7 },  gregorianEnd: { month: 4, day: 3 },  question: 'How do I attain my purpose?' },
  { number: 10, name: 'Planetary Moon',     tone: TONES[9],  gregorianStart: { month: 4, day: 4 },  gregorianEnd: { month: 5, day: 1 },  question: 'How do I perfect what I do?' },
  { number: 11, name: 'Spectral Moon',      tone: TONES[10], gregorianStart: { month: 5, day: 2 },  gregorianEnd: { month: 5, day: 29 }, question: 'How do I release and let go?' },
  { number: 12, name: 'Crystal Moon',       tone: TONES[11], gregorianStart: { month: 5, day: 30 }, gregorianEnd: { month: 6, day: 26 }, question: 'How can I dedicate myself to all that lives?' },
  { number: 13, name: 'Cosmic Moon',        tone: TONES[12], gregorianStart: { month: 6, day: 27 }, gregorianEnd: { month: 7, day: 24 }, question: 'How can I expand my joy and love?' },
];

/**
 * Get the 13 Moon date for a Gregorian date.
 * Returns the Moon and the day within that Moon (1-28).
 * July 25 = Day Out of Time (returns moon 0, day 0).
 * Feb 29 = 0.0 Hunab Ku (returns moon 0, day 0).
 */
export function getMoonDate(inputDate: Date): { moon: Moon13 | null; moonDay: number; isDayOutOfTime: boolean; isHunabKu: boolean } {
  // Normalize to midnight so time-of-day doesn't affect the day count
  const date = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const year = date.getFullYear();

  // Check Feb 29
  if (month === 2 && day === 29) {
    return { moon: null, moonDay: 0, isDayOutOfTime: false, isHunabKu: true };
  }

  // Check Day Out of Time (July 25)
  if (month === 7 && day === 25) {
    return { moon: null, moonDay: 0, isDayOutOfTime: true, isHunabKu: false };
  }

  // Calculate day of the 13 Moon year
  // The 13 Moon year starts on July 26
  // We need to figure out which "13 Moon year" this date falls in
  // and then count days from July 26 of that year (skipping leap days and Day Out of Time)

  // Determine the 13 Moon year start
  const moonYearStart = month >= 7 && (month > 7 || day >= 26)
    ? new Date(year, 6, 26)
    : new Date(year - 1, 6, 26);

  // Count days from moon year start, skipping Feb 29 and July 25
  let dayCount = 0;
  const current = new Date(moonYearStart);

  while (current < date) {
    current.setDate(current.getDate() + 1);
    const m = current.getMonth() + 1;
    const d = current.getDate();

    // Skip Feb 29 and July 25 in the count
    if (m === 2 && d === 29) continue;
    if (m === 7 && d === 25) continue;

    dayCount++;

    if (current.getTime() === date.getTime()) break;
  }

  // dayCount is the 0-based offset from July 26.
  // dayCount 0 = Jul 26 (Moon 1 Day 1), dayCount 1 = Jul 27 (Moon 1 Day 2), etc.
  const moonIndex = Math.floor(dayCount / 28);
  const moonDay = (dayCount % 28) + 1;

  if (moonIndex >= 0 && moonIndex < 13) {
    return { moon: MOONS[moonIndex], moonDay, isDayOutOfTime: false, isHunabKu: false };
  }

  // Shouldn't happen for valid dates
  return { moon: MOONS[0], moonDay: 1, isDayOutOfTime: false, isHunabKu: false };
}
