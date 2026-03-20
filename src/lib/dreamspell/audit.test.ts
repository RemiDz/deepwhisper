import { describe, it, expect } from 'vitest';
import { getKinNumber, buildKin } from './kin';
import { getMoonDate, MOONS } from './moons';
import { getOracle } from './oracle';
import { getWavespellNumber, getWavespellPosition, getWavespellSeal, isGAPKin } from './wavespell';
import { getCastleForKin } from './castles';
import { SEALS } from './seals';

// ─── AUDIT 1: Kin Number Calculation ────────────────────────────────────────

describe('Audit 1: Kin number calculation', () => {
  const kinCases: [string, number, number, number, number, string, string][] = [
    // [label, year, month, day, expectedKin, expectedSeal, expectedTone]
    ['June 15, 1981', 1981, 6, 15, 143, 'Night', 'Cosmic'],
    ['July 26, 2025 (Galactic New Year)', 2025, 7, 26, 124, 'Seed', 'Resonant'],
    ['December 21, 2012 (end of 13th Baktun)', 2012, 12, 21, 207, 'Hand', 'Crystal'],
    ['March 20, 2026', 2026, 3, 20, 101, 'Dragon', 'Planetary'],
    ['March 21, 2026', 2026, 3, 21, 102, 'Wind', 'Spectral'],
    ['January 1, 2000', 2000, 1, 1, 153, 'Skywalker', 'Planetary'],
    ['Reference anchor: July 26, 2013', 2013, 7, 26, 164, 'Seed', 'Galactic'],
  ];

  for (const [label, y, m, d, expectedKin, expectedSeal, expectedTone] of kinCases) {
    it(`${label} → Kin ${expectedKin} (${expectedTone} ${expectedSeal})`, () => {
      const kin = getKinNumber(y, m, d);
      expect(kin).toBe(expectedKin);
      const k = buildKin(kin);
      expect(k.seal.name).toBe(expectedSeal);
      expect(k.tone.name).toBe(expectedTone);
    });
  }

  it('February 29, 2024 → Kin 0 (Hunab Ku, no Kin)', () => {
    expect(getKinNumber(2024, 2, 29)).toBe(0);
  });

  it('Feb 28 → Mar 1 2024 continuity (leap day skipped)', () => {
    const feb28 = getKinNumber(2024, 2, 28);
    const mar1 = getKinNumber(2024, 3, 1);
    expect(feb28).toBeGreaterThan(0);
    expect(mar1).toBeGreaterThan(0);
    // Mar 1 should be exactly feb28 + 1, wrapping 260→1
    const expected = feb28 === 260 ? 1 : feb28 + 1;
    expect(mar1).toBe(expected);
  });
});

// ─── AUDIT 2: 13 Moon Date Calculation ──────────────────────────────────────

describe('Audit 2: 13 Moon date calculation', () => {
  it('July 26, 2025 → Magnetic Moon, Day 1', () => {
    const r = getMoonDate(new Date(2025, 6, 26));
    expect(r.moon?.number).toBe(1);
    expect(r.moon?.name).toBe('Magnetic Moon');
    expect(r.moonDay).toBe(1);
  });

  it('July 25, 2025 → Day Out of Time', () => {
    const r = getMoonDate(new Date(2025, 6, 25));
    expect(r.isDayOutOfTime).toBe(true);
    expect(r.moon).toBeNull();
  });

  it('August 22, 2025 → Magnetic Moon, Day 28', () => {
    const r = getMoonDate(new Date(2025, 7, 22));
    expect(r.moon?.number).toBe(1);
    expect(r.moonDay).toBe(28);
  });

  it('August 23, 2025 → Lunar Moon, Day 1', () => {
    const r = getMoonDate(new Date(2025, 7, 23));
    expect(r.moon?.number).toBe(2);
    expect(r.moon?.name).toBe('Lunar Moon');
    expect(r.moonDay).toBe(1);
  });

  it('March 20, 2026 → Solar Moon, Day 14', () => {
    const r = getMoonDate(new Date(2026, 2, 20));
    expect(r.moon?.number).toBe(9);
    expect(r.moon?.name).toBe('Solar Moon');
    expect(r.moonDay).toBe(14);
  });

  it('March 7, 2026 → Solar Moon, Day 1', () => {
    const r = getMoonDate(new Date(2026, 2, 7));
    expect(r.moon?.number).toBe(9);
    expect(r.moonDay).toBe(1);
  });

  it('February 29, 2024 → Hunab Ku', () => {
    const r = getMoonDate(new Date(2024, 1, 29));
    expect(r.isHunabKu).toBe(true);
    expect(r.moon).toBeNull();
  });

  it('time-of-day does not affect moon day (off-by-one regression)', () => {
    const midnight = getMoonDate(new Date(2026, 2, 20, 0, 0, 0));
    const afternoon = getMoonDate(new Date(2026, 2, 20, 15, 30, 0));
    const lateNight = getMoonDate(new Date(2026, 2, 20, 23, 59, 59));
    expect(midnight.moonDay).toBe(14);
    expect(afternoon.moonDay).toBe(14);
    expect(lateNight.moonDay).toBe(14);
  });
});

// ─── AUDIT 3: Fifth Force Oracle ────────────────────────────────────────────

describe('Audit 3: Fifth Force Oracle', () => {
  it('Kin 143 (Blue Cosmic Night): Guide=Hand, Analog=Warrior, Antipode=Skywalker, Occult=Mirror', () => {
    const kin = buildKin(143);
    expect(kin.seal.name).toBe('Night');
    expect(kin.tone.name).toBe('Cosmic');

    const oracle = getOracle(kin);
    // Night(2), tone 13: guide offset=4 → (2+4)%20=6 → Hand (Blue, same colour)
    expect(oracle.guide.name).toBe('Hand');
    expect(oracle.guide.colour).toBe(kin.seal.colour); // Blue
    // Analog: (17-2)%20 = 15 → Warrior
    expect(oracle.analog.name).toBe('Warrior');
    // Antipode: (2+10)%20 = 12 → Skywalker
    expect(oracle.antipode.name).toBe('Skywalker');
    // Occult: (19-2)%20 = 17 → Mirror
    expect(oracle.occult.name).toBe('Mirror');
  });

  it('Kin 101 (Red Planetary Dragon): Guide=Moon, Analog=Mirror, Antipode=Monkey, Occult=Sun', () => {
    const kin = buildKin(101);
    expect(kin.seal.name).toBe('Dragon');
    expect(kin.tone.name).toBe('Planetary');

    const oracle = getOracle(kin);
    // Dragon(0), tone 10: guide offset=8 → (0+8)%20=8 → Moon (Red, same colour)
    expect(oracle.guide.name).toBe('Moon');
    expect(oracle.guide.colour).toBe('Red');
    // Analog: (17-0)%20 = 17 → Mirror
    expect(oracle.analog.name).toBe('Mirror');
    // Antipode: (0+10)%20 = 10 → Monkey
    expect(oracle.antipode.name).toBe('Monkey');
    // Occult: (19-0)%20 = 19 → Sun
    expect(oracle.occult.name).toBe('Sun');
  });

  it('Kin 1 (Red Magnetic Dragon): Guide=Dragon (self-guided)', () => {
    const kin = buildKin(1);
    const oracle = getOracle(kin);
    // Tone 1: offset=0 → guide = Dragon itself
    expect(oracle.guide.name).toBe('Dragon');
    expect(oracle.analog.name).toBe('Mirror');
    expect(oracle.antipode.name).toBe('Monkey');
    expect(oracle.occult.name).toBe('Sun');
  });

  it('Guide colour always matches destiny colour for all 260 Kin', () => {
    for (let k = 1; k <= 260; k++) {
      const kin = buildKin(k);
      const oracle = getOracle(kin);
      expect(oracle.guide.colour).toBe(kin.seal.colour);
    }
  });
});

// ─── AUDIT 4: Wavespell and Castle ──────────────────────────────────────────

describe('Audit 4: Wavespell and Castle', () => {
  it('Kin 101 → Wavespell 8 (Yellow Human), position 10/13', () => {
    expect(getWavespellNumber(101)).toBe(8);
    expect(getWavespellPosition(101)).toBe(10);
    expect(getWavespellSeal(101).name).toBe('Human');
  });

  it('Kin 101 → White Northern Castle of Crossing, position 49/52', () => {
    const castle = getCastleForKin(101);
    expect(castle.name).toContain('White');
    expect(castle.name).toContain('Crossing');
    expect(castle.kinRange[0]).toBe(53);
    expect(castle.kinRange[1]).toBe(104);
    // Castle position
    expect(101 - castle.kinRange[0] + 1).toBe(49);
  });

  it('Wavespell boundaries are correct', () => {
    expect(getWavespellNumber(1)).toBe(1);
    expect(getWavespellNumber(13)).toBe(1);
    expect(getWavespellNumber(14)).toBe(2);
    expect(getWavespellNumber(26)).toBe(2);
    expect(getWavespellNumber(260)).toBe(20);
    expect(getWavespellNumber(248)).toBe(20);
  });

  it('Castle boundaries are correct', () => {
    expect(getCastleForKin(1).number).toBe(1);
    expect(getCastleForKin(52).number).toBe(1);
    expect(getCastleForKin(53).number).toBe(2);
    expect(getCastleForKin(104).number).toBe(2);
    expect(getCastleForKin(105).number).toBe(3);
    expect(getCastleForKin(156).number).toBe(3);
    expect(getCastleForKin(157).number).toBe(4);
    expect(getCastleForKin(208).number).toBe(4);
    expect(getCastleForKin(209).number).toBe(5);
    expect(getCastleForKin(260).number).toBe(5);
  });
});

// ─── AUDIT 5: GAP Days ─────────────────────────────────────────────────────

describe('Audit 5: GAP days', () => {
  it('Exactly 52 GAP days in the 260-day Tzolkin', () => {
    let count = 0;
    for (let k = 1; k <= 260; k++) {
      if (isGAPKin(k)) count++;
    }
    expect(count).toBe(52);
  });

  const knownGAPs = [1, 20, 22, 39, 43, 58, 64, 77, 85, 96,
    106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
    146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
    165, 176, 184, 197, 203, 218, 222, 239, 241, 260,
    50, 51, 69, 72, 88, 93, 168, 173, 189, 192, 210, 211];

  it('All 52 known GAP Kin are marked', () => {
    for (const k of knownGAPs) {
      expect(isGAPKin(k)).toBe(true);
    }
    expect(knownGAPs.length).toBe(52);
  });

  it('Mystic Column (Kin 121-140) is NOT GAP', () => {
    for (let k = 121; k <= 140; k++) {
      expect(isGAPKin(k)).toBe(false);
    }
  });
});

// ─── AUDIT 6: Cross-View Consistency ────────────────────────────────────────

describe('Audit 6: Cross-view consistency for March 20, 2026', () => {
  const date = new Date(2026, 2, 20);
  const kinNumber = getKinNumber(2026, 3, 20);
  const kin = buildKin(kinNumber);
  const moonDate = getMoonDate(date);

  it('Kin number is 101', () => {
    expect(kinNumber).toBe(101);
  });

  it('Seal is Red Dragon', () => {
    expect(kin.seal.name).toBe('Dragon');
    expect(kin.seal.colour).toBe('Red');
  });

  it('Tone is 10 Planetary', () => {
    expect(kin.tone.number).toBe(10);
    expect(kin.tone.name).toBe('Planetary');
  });

  it('Title is "Red Planetary Dragon"', () => {
    expect(kin.title).toBe('Red Planetary Dragon');
  });

  it('Moon is Solar Moon, Day 14', () => {
    expect(moonDate.moon?.name).toBe('Solar Moon');
    expect(moonDate.moonDay).toBe(14);
  });

  it('Wavespell is 8 (Human), position 10', () => {
    expect(kin.wavespell).toBe(8);
    expect(getWavespellPosition(101)).toBe(10);
  });

  it('Castle is White Northern (Crossing)', () => {
    expect(kin.castle.name).toContain('Crossing');
  });

  it('isGAP is false (Kin 101 is not a GAP day)', () => {
    expect(kin.isGAP).toBe(false);
  });
});

// ─── AUDIT 7: Seal Data Integrity ──────────────────────────────────────────

describe('Audit 7: Seal data integrity', () => {
  it('20 seals numbered 0-19', () => {
    expect(SEALS.length).toBe(20);
    for (let i = 0; i < 20; i++) {
      expect(SEALS[i].number).toBe(i);
    }
  });

  it('Seal 0 = Dragon (Red), Seal 1 = Wind (White), Seal 2 = Night (Blue), Seal 19 = Sun (Yellow)', () => {
    expect(SEALS[0].name).toBe('Dragon');
    expect(SEALS[0].colour).toBe('Red');
    expect(SEALS[1].name).toBe('Wind');
    expect(SEALS[1].colour).toBe('White');
    expect(SEALS[2].name).toBe('Night');
    expect(SEALS[2].colour).toBe('Blue');
    expect(SEALS[19].name).toBe('Sun');
    expect(SEALS[19].colour).toBe('Yellow');
  });

  it('Colour cycle repeats: Red, White, Blue, Yellow', () => {
    const expectedColours = ['Red', 'White', 'Blue', 'Yellow'];
    for (let i = 0; i < 20; i++) {
      expect(SEALS[i].colour).toBe(expectedColours[i % 4]);
    }
  });

  it('All seals have icon paths', () => {
    for (const seal of SEALS) {
      expect(seal.iconPath).toBeTruthy();
    }
  });
});
