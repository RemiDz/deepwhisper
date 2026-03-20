import * as Astronomy from 'astronomy-engine';
import type { MoonData } from '../dreamspell/types';

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const PHASE_NAMES: [number, string][] = [
  [15, 'New Moon'],
  [75, 'Waxing Crescent'],
  [105, 'First Quarter'],
  [165, 'Waxing Gibbous'],
  [195, 'Full Moon'],
  [255, 'Waning Gibbous'],
  [285, 'Last Quarter'],
  [345, 'Waning Crescent'],
  [360, 'New Moon'],
];

function getPhaseName(phase: number): string {
  for (const [threshold, name] of PHASE_NAMES) {
    if (phase < threshold) return name;
  }
  return 'New Moon';
}

export function getMoonData(date: Date): MoonData {
  const astroDate = Astronomy.MakeTime(date);

  // Moon phase angle (0-360)
  const phase = Astronomy.MoonPhase(astroDate);

  // Illumination percentage
  const illum = Astronomy.Illumination(Astronomy.Body.Moon, astroDate);
  const illumination = Math.round(illum.phase_fraction * 100);

  // Ecliptic longitude for zodiac sign
  const ecliptic = Astronomy.EclipticGeoMoon(astroDate);
  const longitude = ecliptic.lon;
  const signIndex = Math.floor(longitude / 30) % 12;
  const zodiacDegree = Math.floor(longitude % 30);

  return {
    phase,
    illumination,
    phaseName: getPhaseName(phase),
    zodiacSign: ZODIAC_SIGNS[signIndex],
    zodiacDegree,
  };
}
