import { describe, it, expect } from 'vitest';
import { getKinNumber, getKinForDate, buildKin, getKinForDateFull } from './kin';
import { getOracle } from './oracle';
import { getWavespellNumber, isGAPKin } from './wavespell';
import { getCastleForKin } from './castles';
import { getMoonDate } from './moons';
import { SEALS } from './seals';

// ─── Kin calculation tests ────────────────────────────────────────────────
// Verified against lawoftime.org, starroot.com, spacestationplaza.com, timewaves.org

const KIN_TEST_CASES = [
  // Reference date
  { date: '2013-07-26', expectedKin: 164, name: 'Reference: Yellow Galactic Seed' },

  // Dreamspell initiation
  { date: '1987-07-26', expectedKin: 34, name: 'Dreamspell initiation: White Galactic Wizard' },

  // Today (verified via starroot.com)
  { date: '2026-03-20', expectedKin: 101, name: 'Red Planetary Dragon' },

  // End of 13th Baktun (verified via timewaves.org)
  { date: '2012-12-21', expectedKin: 207, name: 'Blue Crystal Hand' },

  // Leap year edge cases — 2024
  { date: '2024-02-28', expectedKin: 131, name: 'Day before leap day 2024: Blue Magnetic Monkey' },
  { date: '2024-02-29', expectedKin: 0, name: 'Leap day 2024 — 0.0 Hunab Ku (no Kin)' },
  { date: '2024-03-01', expectedKin: 132, name: 'Day after leap day 2024: Yellow Lunar Human' },

  // Leap year edge cases — 2020
  { date: '2020-02-28', expectedKin: 231, name: 'Day before leap day 2020: Blue Planetary Monkey' },
  { date: '2020-02-29', expectedKin: 0, name: 'Leap day 2020 — 0.0 Hunab Ku' },
  { date: '2020-03-01', expectedKin: 232, name: 'Day after leap day 2020: Yellow Spectral Human' },

  // Non-leap year Feb boundary
  { date: '2023-02-28', expectedKin: 26, name: 'Feb 28 non-leap year: White Cosmic Worldbridger' },
  { date: '2023-03-01', expectedKin: 27, name: 'Mar 1 non-leap year: Blue Magnetic Hand' },

  // Year boundaries
  { date: '2025-12-31', expectedKin: 22, name: 'New Year Eve 2025: White Solar Wind' },
  { date: '2026-01-01', expectedKin: 23, name: 'New Year 2026: Blue Planetary Night' },

  // Day Out of Time / 13 Moon New Year
  { date: '2025-07-25', expectedKin: 123, name: 'Day Out of Time 2025: Blue Rhythmic Night' },
  { date: '2025-07-26', expectedKin: 124, name: '13 Moon New Year 2025: Yellow Resonant Seed' },

  // Historical dates
  { date: '1990-01-01', expectedKin: 143, name: 'Jan 1 1990: Blue Cosmic Night' },
  { date: '2000-02-29', expectedKin: 0, name: 'Leap day Y2K: 0.0 Hunab Ku' },
  { date: '1969-07-20', expectedKin: 218, name: 'Moon landing: White Planetary Mirror' },
];

describe('Kin calculation', () => {
  for (const tc of KIN_TEST_CASES) {
    it(`${tc.date} → Kin ${tc.expectedKin} (${tc.name})`, () => {
      const [y, m, d] = tc.date.split('-').map(Number);
      expect(getKinNumber(y, m, d)).toBe(tc.expectedKin);
    });
  }

  it('getKinForDate works with Date objects', () => {
    const date = new Date(2013, 6, 26); // July 26, 2013
    expect(getKinForDate(date)).toBe(164);
  });

  it('Feb 29 dates always return 0', () => {
    const leapYears = [2000, 2004, 2008, 2012, 2016, 2020, 2024];
    for (const y of leapYears) {
      expect(getKinNumber(y, 2, 29)).toBe(0);
    }
  });

  it('Feb 28 and Mar 1 are always sequential in leap years', () => {
    const leapYears = [2000, 2004, 2008, 2012, 2016, 2020, 2024];
    for (const y of leapYears) {
      const feb28 = getKinNumber(y, 2, 28);
      const mar1 = getKinNumber(y, 3, 1);
      // They should be consecutive (mod 260)
      const expected = feb28 === 260 ? 1 : feb28 + 1;
      expect(mar1).toBe(expected);
    }
  });

  it('consecutive days always increment by 1 (mod 260), skipping Feb 29', () => {
    // Check a range of dates
    let prevKin = getKinNumber(2025, 1, 1);
    const start = new Date(2025, 0, 2); // Jan 2
    for (let i = 0; i < 365; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const day = d.getDate();
      const kin = getKinNumber(y, m, day);
      if (kin === 0) continue; // skip Hunab Ku
      const expected = prevKin === 260 ? 1 : prevKin + 1;
      expect(kin).toBe(expected);
      prevKin = kin;
    }
  });
});

// ─── Seal / Tone extraction ──────────────────────────────────────────────

describe('Seal and tone extraction', () => {
  it('Kin 164 is Yellow Galactic Seed', () => {
    const kin = buildKin(164);
    expect(kin.seal.name).toBe('Seed');
    expect(kin.seal.colour).toBe('Yellow');
    expect(kin.tone.name).toBe('Galactic');
    expect(kin.tone.number).toBe(8);
    expect(kin.title).toBe('Yellow Galactic Seed');
  });

  it('Kin 1 is Red Magnetic Dragon', () => {
    const kin = buildKin(1);
    expect(kin.seal.name).toBe('Dragon');
    expect(kin.seal.colour).toBe('Red');
    expect(kin.tone.name).toBe('Magnetic');
  });

  it('Kin 260 is Yellow Cosmic Sun', () => {
    const kin = buildKin(260);
    expect(kin.seal.name).toBe('Sun');
    expect(kin.seal.colour).toBe('Yellow');
    expect(kin.tone.name).toBe('Cosmic');
  });

  it('Kin 101 is Red Planetary Dragon', () => {
    const kin = buildKin(101);
    expect(kin.seal.name).toBe('Dragon');
    expect(kin.tone.name).toBe('Planetary');
  });
});

// ─── Oracle tests ────────────────────────────────────────────────────────
// Verified against lawoftime.org Fifth Force Oracle

describe('Oracle calculation', () => {
  it('Kin 1 (Red Magnetic Dragon) oracle', () => {
    const kin = buildKin(1);
    const oracle = getOracle(kin);
    // Guide: Dragon (tone 1 → offset 0, same seal)
    expect(oracle.guide.name).toBe('Dragon');
    // Analog: Mirror (0+17=17, sum to 17)
    expect(oracle.analog.name).toBe('Mirror');
    // Antipode: Monkey (0+10=10)
    expect(oracle.antipode.name).toBe('Monkey');
    // Occult: Sun (0+19=19, sum to 19)
    expect(oracle.occult.name).toBe('Sun');
  });

  it('Kin 164 (Yellow Galactic Seed) oracle', () => {
    const kin = buildKin(164);
    const oracle = getOracle(kin);
    // Guide: Star (tone 8 → offset 4, seal 3+4=7)
    expect(oracle.guide.name).toBe('Star');
    expect(oracle.guide.colour).toBe('Yellow'); // same colour as destiny
    // Analog: Eagle (17-3=14)
    expect(oracle.analog.name).toBe('Eagle');
    // Antipode: Wizard (3+10=13)
    expect(oracle.antipode.name).toBe('Wizard');
    // Occult: Earth (19-3=16)
    expect(oracle.occult.name).toBe('Earth');
  });

  it('Kin 101 (Red Planetary Dragon) oracle', () => {
    const kin = buildKin(101);
    const oracle = getOracle(kin);
    // Guide: Moon (tone 10 → offset 8, seal 0+8=8) — Red, same colour
    expect(oracle.guide.name).toBe('Moon');
    expect(oracle.guide.colour).toBe('Red');
    // Analog: Mirror (17-0=17)
    expect(oracle.analog.name).toBe('Mirror');
    // Antipode: Monkey (0+10=10)
    expect(oracle.antipode.name).toBe('Monkey');
    // Occult: Sun (19-0=19)
    expect(oracle.occult.name).toBe('Sun');
  });

  it('Guide is always same colour as destiny', () => {
    for (let k = 1; k <= 260; k++) {
      const kin = buildKin(k);
      const oracle = getOracle(kin);
      expect(oracle.guide.colour).toBe(kin.seal.colour);
    }
  });

  it('Oracle positions are always distinct seals', () => {
    for (let k = 1; k <= 260; k++) {
      const kin = buildKin(k);
      const oracle = getOracle(kin);
      const sealNumbers = new Set([
        oracle.analog.number,
        oracle.antipode.number,
        oracle.occult.number,
      ]);
      // analog, antipode, occult should all be distinct
      expect(sealNumbers.size).toBe(3);
    }
  });
});

// ─── Wavespell / Castle tests ────────────────────────────────────────────

describe('Wavespell', () => {
  it('Kin 1 is in Wavespell 1', () => {
    expect(getWavespellNumber(1)).toBe(1);
  });

  it('Kin 13 is in Wavespell 1', () => {
    expect(getWavespellNumber(13)).toBe(1);
  });

  it('Kin 14 is in Wavespell 2', () => {
    expect(getWavespellNumber(14)).toBe(2);
  });

  it('Kin 260 is in Wavespell 20', () => {
    expect(getWavespellNumber(260)).toBe(20);
  });
});

describe('Castle', () => {
  it('Kin 1 is in Red Eastern Castle', () => {
    expect(getCastleForKin(1).name).toContain('Red Eastern');
  });

  it('Kin 52 is in Red Eastern Castle', () => {
    expect(getCastleForKin(52).number).toBe(1);
  });

  it('Kin 53 is in White Northern Castle', () => {
    expect(getCastleForKin(53).number).toBe(2);
  });

  it('Kin 260 is in Green Central Castle', () => {
    expect(getCastleForKin(260).number).toBe(5);
  });
});

// ─── GAP Kin tests ───────────────────────────────────────────────────────

describe('GAP Kin', () => {
  it('Kin 1 is a GAP day', () => {
    expect(isGAPKin(1)).toBe(true);
  });

  it('Kin 260 is a GAP day', () => {
    expect(isGAPKin(260)).toBe(true);
  });

  it('Kin 106-115 are all GAP days (solid column)', () => {
    for (let k = 106; k <= 115; k++) {
      expect(isGAPKin(k)).toBe(true);
    }
  });

  it('Kin 146-155 are all GAP days (solid column)', () => {
    for (let k = 146; k <= 155; k++) {
      expect(isGAPKin(k)).toBe(true);
    }
  });

  it('Mystic Column (Kin 121-140) are NOT GAP days', () => {
    for (let k = 121; k <= 140; k++) {
      expect(isGAPKin(k)).toBe(false);
    }
  });

  it('There are exactly 52 GAP Kin', () => {
    let count = 0;
    for (let k = 1; k <= 260; k++) {
      if (isGAPKin(k)) count++;
    }
    expect(count).toBe(52);
  });
});

// ─── 13 Moon date tests ─────────────────────────────────────────────────

describe('13 Moon date', () => {
  it('July 26 is Moon 1, Day 1', () => {
    const result = getMoonDate(new Date(2025, 6, 26));
    expect(result.moon?.number).toBe(1);
    expect(result.moonDay).toBe(1);
  });

  it('July 25 is Day Out of Time', () => {
    const result = getMoonDate(new Date(2025, 6, 25));
    expect(result.isDayOutOfTime).toBe(true);
    expect(result.moon).toBeNull();
  });

  it('Feb 29 is Hunab Ku', () => {
    const result = getMoonDate(new Date(2024, 1, 29));
    expect(result.isHunabKu).toBe(true);
    expect(result.moon).toBeNull();
  });

  it('March 20, 2026 is Moon 9, Day 14', () => {
    // Verified via starroot.com
    const result = getMoonDate(new Date(2026, 2, 20));
    expect(result.moon?.number).toBe(9);
    expect(result.moonDay).toBe(14);
  });

  it('Aug 22 is Moon 1, Day 28', () => {
    const result = getMoonDate(new Date(2025, 7, 22));
    expect(result.moon?.number).toBe(1);
    expect(result.moonDay).toBe(28);
  });

  it('Aug 23 is Moon 2, Day 1', () => {
    const result = getMoonDate(new Date(2025, 7, 23));
    expect(result.moon?.number).toBe(2);
    expect(result.moonDay).toBe(1);
  });
});
