# DeepWhisper — CRITICAL Accuracy Audit (gigathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

After all changes, run npm run dev and WAIT for me to visually confirm at localhost:3000 before committing or pushing to git.

---

## CONTEXT: This is a CRITICAL accuracy audit. Calendar apps live or die on data accuracy. One wrong Kin, one wrong day number, one mismatched oracle — and practitioners will never trust the app again. Every single calculation must be verified.

---

## KNOWN BUG: Off-by-one between Today view and 13 Moons grid

The Today view header says "Solar Moon · Day 15" and shows Kin 101 (Red Planetary Dragon). But in the 13 Moons grid, Kin 101 appears on Day 14, not Day 15. These MUST match.

### To fix:
1. Find the 13 Moon day-of-month calculation in BOTH views
2. Check for 0-indexed vs 1-indexed mismatch
3. Verify against https://lawoftime.org for today's actual date
4. Fix whichever view is wrong
5. Test with multiple dates to confirm consistency

---

## FULL AUDIT: Verify ALL calculations against external references

### Audit 1: Kin Number Calculation

Go to https://lawoftime.org or use the known reference points below. For EACH of these dates, calculate the Kin number using the app's engine and verify it matches:

| Date | Expected Kin | Seal | Tone |
|------|-------------|------|------|
| June 15, 1981 | 143 | Blue Night | 13 Cosmic |
| July 26, 2025 | 1 | Red Magnetic Dragon | 1 Magnetic |
| December 21, 2012 | 207 | Blue Crystal Hand | 12 Crystal |
| March 20, 2026 | 101 | Red Planetary Dragon | 10 Planetary |
| March 21, 2026 | 102 | White Spectral Wind | 11 Spectral |
| January 1, 2000 | 11 | Blue Spectral Monkey | 11 Spectral |
| February 28, 2024 | should have a Kin | verify | verify |
| February 29, 2024 | 0.0 Hunab Ku (NO Kin) | skipped | skipped |
| March 1, 2024 | should be Feb 28 Kin + 1 | verify | verify |

Write a test or script that checks ALL of these. If ANY do not match, fix the calculation engine.

### Audit 2: 13 Moon Date Calculation

Verify the 13 Moon date conversion for these dates:

| Gregorian Date | Expected 13 Moon Date |
|----------------|----------------------|
| July 26, 2025 | Magnetic Moon, Day 1 (first day of new galactic year) |
| July 25, 2025 | Day Out of Time |
| August 22, 2025 | Magnetic Moon, Day 28 (last day of Moon 1) |
| August 23, 2025 | Lunar Moon, Day 1 (first day of Moon 2) |
| March 20, 2026 | Solar Moon, Day ? (verify which day) |

Key rules:
- Each Moon is exactly 28 days
- Moon 1 (Magnetic) starts July 26
- July 25 is Day Out of Time (not part of any moon)
- February 29 in leap years is NOT counted in 13 Moon system (Hunab Ku day)
- There are 13 Moons × 28 days = 364 days + 1 Day Out of Time = 365

Check that the day number shown on the Today view MATCHES the day position in the 13 Moons grid for the same date.

### Audit 3: Fifth Force Oracle

For Kin 143 (Blue Cosmic Night), verify the oracle:
- Guide: depends on tone (Tone 13 → guide formula gives specific seal)
- Analog: Night (3) + 10 = 13 → Skywalker? Verify against reference
- Antipode: Night (3) + 10 = 13 → Skywalker? No — Antipode is +10 mod 20. Verify.
- Occult: 19 - 3 = 16 → Warrior? Verify against reference.

For Kin 101 (Red Planetary Dragon, today), verify oracle:
- Calculate all 4 oracle positions
- Cross-check against lawoftime.org or starroot.com

Fix any oracle calculation errors found.

### Audit 4: Wavespell and Castle

- Kin 1-13 = Wavespell 1 (Red Dragon)
- Kin 14-26 = Wavespell 2 (White Wizard)
- Verify the wavespell shown for Kin 101: should be Wavespell 8 (Human), day 10 of 13
- Verify the castle: Kin 53-104 = White Northern Castle of Crossing
- Kin 101 should show "Crossing · Kin 49/52" — verify the castle position number

### Audit 5: GAP Days (Galactic Activation Portals)

There are exactly 52 GAP days in the 260-day Tzolkin. Verify:
- The app has exactly 52 GAP days marked
- Spot check at least 5 known GAP days:
  - Kin 1 = GAP
  - Kin 20 = GAP
  - Kin 22 = GAP
  - Kin 39 = GAP
  - Kin 131 = GAP
- Verify against the Loom of the Maya pattern

### Audit 6: Cross-View Consistency

Navigate between all 4 views and verify they show consistent data for TODAY:

1. **Today view**: Note the Kin number, seal, tone, moon name, day number
2. **My Kin view**: Enter today's date — result must match Today view exactly
3. **13 Moons view**: Navigate to current moon, find today's day — Kin must match
4. **Wavespell view**: Today's position in the wavespell must match

ALL four views must agree on every data point. If any view shows different data for the same date, fix it.

### Audit 7: Seal Bottom Sheet Data

Tap 3 different seal icons on the compass and verify:
- Seal name is correct for that position (Dragon at 0, Wind at 1, Night at 2... Sun at 19)
- Seal description matches galactic-content.ts
- Oracle family (Analog, Antipode, Occult) is correct for that seal
- Attributes (colour, action, power, essence) match the data model

---

## Output

After completing the audit, provide a FULL REPORT listing:
1. Every check performed
2. PASS or FAIL for each
3. What was fixed (if anything)
4. Any remaining concerns

Then run:
```bash
npm run build
npm run test
```

Both must pass with zero errors. All existing 52 tests must still pass. Add new test cases for any bugs found during audit.

---

## IMPORTANT

Do NOT skip any audit step. Do NOT assume things are correct without checking. This is the most important prompt in the entire build — if the data is wrong, nothing else matters.
