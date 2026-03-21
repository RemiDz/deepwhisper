# DeepWhisper Phase 1 — Foundation Build (gigathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable (e.g., `npx create-next-app --yes`). Do NOT stop to ask questions — make the best decision and continue.

---

## Project context

DeepWhisper (deepwhisper.app) is a 13 Moon Galactic Calendar app — part of the Harmonic Waves ecosystem. It combines José Argüelles' Dreamspell system with live astronomical moon data. The existing repo contains an old subliminal creation app that has been deleted. The `.git` folder remains with the GitHub remote intact.

**Quality benchmark:** This app must match the polish of lunata.app and astrara.app. Every pixel matters.

**Design:** Deep space dark aesthetic (#080812 background), vibrant seal colours (red #ef4444, white #e8e6df, blue #3b82f6, yellow #eab308), purple (#c084fc) for tones and UI accents. Subtle star particles in background. Mobile-first (375px primary target).

---

## Step 1: Scaffold Next.js project

Initialise a new Next.js 14+ project with App Router, TypeScript, and Tailwind CSS in the current directory.

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --yes
```

Install additional dependencies:

```bash
npm install astronomy-engine
```

Set up the basic folder structure:

```
src/
  app/
    layout.tsx          # Root layout with dark theme, fonts, metadata
    page.tsx            # Today view (home)
    my-kin/page.tsx     # My Kin calculator
    thirteen-moons/page.tsx  # 13 Moons calendar
    wavespell/page.tsx  # Wavespell explorer
    globals.css         # Global styles, dark theme, no scrollbars
  lib/
    dreamspell/
      kin.ts            # Kin calculation engine (THE critical module)
      kin.test.ts       # Comprehensive test suite
      seals.ts          # 20 solar seals data
      tones.ts          # 13 galactic tones data
      moons.ts          # 13 Moon months data
      castles.ts        # 5 castles data
      oracle.ts         # Oracle calculation (guide, analog, antipode, occult)
      wavespell.ts      # Wavespell utilities
      types.ts          # TypeScript interfaces
    astronomy/
      moon.ts           # Real-time moon phase, sign, illumination via astronomy-engine
  components/
    layout/
      TabBar.tsx        # Fixed bottom tab bar
      BottomSheet.tsx   # Reusable bottom sheet component
      StarField.tsx     # Animated star particle background
    compass/
      GalacticCompass.tsx  # The main compass SVG component
      MoonPhase.tsx     # Realistic moon rendering
      SealGlyph.tsx     # Individual seal glyph SVG paths
      SealRing.tsx      # Outer ring of 20 seals
      ToneRing.tsx      # Inner ring of 13 tones (bar-dot notation)
      OracleLines.tsx   # Connection lines from centre to oracle seals
    today/
      KinStrip.tsx      # Kin number, name, tone below compass
      MicroDashboard.tsx # Wavespell, castle, spin progress bars
      MilestoneCard.tsx # Approaching milestone alert
    my-kin/
      DateInput.tsx     # Birth date input form
      SignatureCard.tsx  # The shareable galactic signature card
    calendar/
      MoonNavigator.tsx # Month navigation header
      DayGrid.tsx       # 28-day grid
    wavespell/
      WavespellTimeline.tsx # 13-tone vertical timeline
```

---

## Step 2: Dreamspell data model

### src/lib/dreamspell/types.ts

Define all TypeScript interfaces:

```typescript
export interface SolarSeal {
  number: number;        // 0-19 (internal), displayed as 1-20
  name: string;          // 'Dragon', 'Wind', etc.
  colour: 'Red' | 'White' | 'Blue' | 'Yellow';
  colourHex: string;     // #ef4444, #e8e6df, #3b82f6, #eab308
  bgHex: string;         // Darker shade for backgrounds
  direction: 'East' | 'North' | 'West' | 'South';
  power: string;         // 'Birth', 'Spirit', etc.
  action: string;        // 'Nurtures', 'Communicates', etc.
  essence: string;       // 'Being', 'Breath', etc.
  glyphPath: string;     // SVG path data
}

export interface GalacticTone {
  number: number;        // 1-13
  name: string;          // 'Magnetic', 'Lunar', etc.
  action: string;        // 'Unify', 'Polarise', etc.
  power: string;         // 'Attract', 'Stabilise', etc.
  essence: string;       // 'Purpose', 'Challenge', etc.
}

export interface Kin {
  number: number;        // 1-260
  seal: SolarSeal;
  tone: GalacticTone;
  title: string;         // 'Red Spectral Moon'
  wavespell: number;     // 1-20
  castle: Castle;
  harmonic: number;      // 1-65
  isGAP: boolean;        // Galactic Activation Portal
}

export interface Oracle {
  destiny: Kin;          // The Kin itself
  guide: SolarSeal;
  analog: SolarSeal;
  antipode: SolarSeal;
  occult: SolarSeal;
}

export interface Castle {
  number: number;        // 1-5
  name: string;          // 'Red Eastern', etc.
  colour: string;
  direction: string;
  quality: string;       // 'Turning', 'Crossing', etc.
  kinRange: [number, number]; // [1, 52], [53, 104], etc.
}

export interface Moon13 {
  number: number;        // 1-13
  name: string;          // 'Magnetic Moon', etc.
  tone: GalacticTone;
  gregorianStart: { month: number; day: number };
  gregorianEnd: { month: number; day: number };
  question: string;      // 'What is my purpose?', etc.
}

export interface DreamspellDate {
  kin: Kin;
  moon: Moon13;
  moonDay: number;       // 1-28
  dayOfYear: number;     // 1-365
  yearBearer: Kin;
  isDayOutOfTime: boolean;
  isHunabKu: boolean;    // Feb 29
}
```

### src/lib/dreamspell/seals.ts

Create the full 20 seals array with all attributes. Include SVG glyph path data for each seal. The colours cycle: Red (0,4,8,12,16), White (1,5,9,13,17), Blue (2,6,10,14,18), Yellow (3,7,11,15,19).

```
Seal data to include:
0: Red Dragon — East — Birth — Nurtures
1: White Wind — North — Spirit — Communicates
2: Blue Night — West — Abundance — Dreams
3: Yellow Seed — South — Flowering — Targets
4: Red Serpent — East — Life Force — Survives
5: White Worldbridger — North — Death — Equalises
6: Blue Hand — West — Accomplishment — Knows
7: Yellow Star — South — Elegance — Beautifies
8: Red Moon — East — Universal Water — Purifies
9: White Dog — North — Heart — Loves
10: Blue Monkey — West — Magic — Plays
11: Yellow Human — South — Free Will — Influences
12: Red Skywalker — East — Space — Explores
13: White Wizard — North — Timelessness — Enchants
14: Blue Eagle — West — Vision — Creates
15: Yellow Warrior — South — Intelligence — Questions
16: Red Earth — East — Navigation — Evolves
17: White Mirror — North — Endlessness — Reflects
18: Blue Storm — West — Self-generation — Catalyses
19: Yellow Sun — South — Universal Fire — Enlightens
```

For SVG glyph paths: Create simplified but recognisable line-art glyphs for each of the 20 seals. Each glyph should be defined in a viewBox of -14 -14 28 28, using stroke-only paths (no fill). These are stylised representations, not exact copies of traditional glyphs. Each should be distinct and recognisable at small sizes (22px squares).

### src/lib/dreamspell/tones.ts

Create the full 13 tones array:

```
1: Magnetic — Unify — Attract — Purpose
2: Lunar — Polarise — Stabilise — Challenge
3: Electric — Activate — Bond — Service
4: Self-existing — Define — Measure — Form
5: Overtone — Empower — Command — Radiance
6: Rhythmic — Organise — Balance — Equality
7: Resonant — Channel — Inspire — Attunement
8: Galactic — Harmonise — Model — Integrity
9: Solar — Pulse — Realise — Intention
10: Planetary — Perfect — Produce — Manifestation
11: Spectral — Dissolve — Release — Liberation
12: Crystal — Dedicate — Cooperate — Universalise
13: Cosmic — Endure — Transcend — Presence
```

### src/lib/dreamspell/moons.ts

Create the 13 Moon months array with Gregorian date ranges:

```
1: Magnetic Moon — Jul 26 – Aug 22 — "What is my purpose?"
2: Lunar Moon — Aug 23 – Sep 19 — "What is my challenge?"
3: Electric Moon — Sep 20 – Oct 17 — "How can I best serve?"
4: Self-existing Moon — Oct 18 – Nov 14 — "What is the form of my service?"
5: Overtone Moon — Nov 15 – Dec 12 — "How can I best empower myself?"
6: Rhythmic Moon — Dec 13 – Jan 9 — "How can I extend my equality to others?"
7: Resonant Moon — Jan 10 – Feb 6 — "How can I attune my service to others?"
8: Galactic Moon — Feb 7 – Mar 6 — "Do I live what I believe?"
9: Solar Moon — Mar 7 – Apr 3 — "How do I attain my purpose?"
10: Planetary Moon — Apr 4 – May 1 — "How do I perfect what I do?"
11: Spectral Moon — May 2 – May 29 — "How do I release and let go?"
12: Crystal Moon — May 30 – Jun 26 — "How can I dedicate myself to all that lives?"
13: Cosmic Moon — Jun 27 – Jul 24 — "How can I expand my joy and love?"
```

Special days: July 25 = Day Out of Time. February 29 (leap years) = 0.0 Hunab Ku.

### src/lib/dreamspell/castles.ts

```
1: Red Eastern Castle of Turning — Kin 1–52
2: White Northern Castle of Crossing — Kin 53–104
3: Blue Western Castle of Burning — Kin 105–156
4: Yellow Southern Castle of Giving — Kin 157–208
5: Green Central Castle of Enchantment — Kin 209–260
```

---

## Step 3: Kin calculation engine (CRITICAL — must be 100% accurate)

### src/lib/dreamspell/kin.ts

This is the most important module in the entire app. The calculation MUST match lawoftime.org and the 13:20 Sync app exactly.

**The core Dreamspell rules:**

1. The Tzolkin is a 260-day cycle: 20 seals × 13 tones
2. Kin numbers range from 1 to 260 (NEVER 0)
3. Seal index = (kin - 1) % 20
4. Tone index = (kin - 1) % 13
5. **CRITICAL: February 29 (leap day) is SKIPPED.** It is designated "0.0 Hunab Ku" and has NO Kin. The count freezes and resumes the next day.

**Algorithm:**

```typescript
// Reference anchor: July 26, 2013 = Kin 164
const REFERENCE_DATE = new Date(2013, 6, 26); // months are 0-indexed
const REFERENCE_KIN = 164;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function isFebruary29(date: Date): boolean {
  return date.getMonth() === 1 && date.getDate() === 29;
}

function countLeapDaysBetween(startDate: Date, endDate: Date): number {
  // Count all February 29 dates that fall BETWEEN startDate and endDate (exclusive of start, inclusive of end — or whichever convention you use, but be consistent)
  // This is the critical function. Get it wrong and every Kin is off.
  // Iterate year by year, check if Feb 29 exists and falls within range.
  let count = 0;
  const start = startDate < endDate ? startDate : endDate;
  const end = startDate < endDate ? endDate : startDate;
  
  for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
    if (isLeapYear(year)) {
      const feb29 = new Date(year, 1, 29);
      // Check if feb29 is strictly between start and end dates
      if (feb29 > start && feb29 <= end) {
        count++;
      }
    }
  }
  
  return startDate < endDate ? count : -count;
}

function gregorianDaysBetween(date1: Date, date2: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  // Use UTC to avoid timezone issues
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / msPerDay);
}

export function getKinForDate(date: Date): number {
  // Handle Feb 29 — no Kin
  if (isFebruary29(date)) {
    return 0; // Special: 0.0 Hunab Ku — caller must handle this
  }
  
  const gregorianDays = gregorianDaysBetween(REFERENCE_DATE, date);
  const leapDays = countLeapDaysBetween(REFERENCE_DATE, date);
  const adjustedDays = gregorianDays - leapDays;
  
  let kin = ((REFERENCE_KIN - 1 + adjustedDays) % 260 + 260) % 260 + 1;
  return kin;
}
```

**IMPORTANT:** The above is pseudocode to convey the logic. The actual implementation must be carefully tested. The tricky parts are:

1. The direction of counting (forward and backward from reference date)
2. Whether Feb 29 itself is included or excluded from the leap day count
3. Handling dates before the reference date (negative adjusted days)
4. Edge cases around Feb 28 and Mar 1 in leap years

### src/lib/dreamspell/oracle.ts

Calculate the Fifth Force Oracle for any Kin:

```typescript
export function getOracle(kin: Kin): Oracle {
  const sealIndex = (kin.number - 1) % 20;
  const toneNumber = ((kin.number - 1) % 13) + 1;
  
  // Analog: seals that sum to 19
  const analogIndex = (19 - sealIndex + 20) % 20;
  
  // Antipode: seal + 10 (mod 20)
  const antipodeIndex = (sealIndex + 10) % 20;
  
  // Occult: seals that sum to 19 (same as analog formula but using complement)
  const occultIndex = (19 - sealIndex + 20) % 20;
  // NOTE: Occult uses a different lookup — verify against reference calculators
  // The actual occult partner pairs are:
  // 0↔19, 1↔18, 2↔17, 3↔16, 4↔15, 5↔14, 6↔13, 7↔12, 8↔11, 9↔10
  
  // Guide: Depends on the tone number. The guide is always the same colour as the destiny seal.
  // Guide seal is determined by tone:
  // Tones 1,6,11 → guide = destiny seal itself
  // Tones 2,7,12 → guide = destiny seal + 12 (mod 20)
  // Tones 3,8,13 → guide = destiny seal + 4 (mod 20)  
  // Tones 4,9     → guide = destiny seal + 16 (mod 20)
  // Tones 5,10    → guide = destiny seal + 8 (mod 20)
  const guideOffsets: Record<number, number> = {
    1: 0, 6: 0, 11: 0,
    2: 12, 7: 12, 12: 12,
    3: 4, 8: 4, 13: 4,
    4: 16, 9: 16,
    5: 8, 10: 8,
  };
  const guideIndex = (sealIndex + guideOffsets[toneNumber]) % 20;
  
  return {
    destiny: kin,
    guide: seals[guideIndex],
    analog: seals[analogIndex],
    antipode: seals[antipodeIndex],
    occult: seals[occultIndex],
  };
}
```

**IMPORTANT:** The oracle calculations above need to be verified against lawoftime.org for at least 10 known Kin. The guide calculation by tone is the most complex — verify the offset table.

---

## Step 4: Test suite (MANDATORY — run before anything else)

### src/lib/dreamspell/kin.test.ts

Create a comprehensive test file using Jest or Vitest. **All tests must pass before proceeding to UI work.**

Test cases to verify against lawoftime.org and 13:20 Sync app:

```typescript
// Known Kin dates (verify ALL of these against lawoftime.org before coding)
const TEST_CASES = [
  // Reference date
  { date: '2013-07-26', expectedKin: 164, name: 'Reference: Yellow Galactic Seed' },
  
  // Dreamspell initiation
  { date: '1987-07-26', expectedKin: 34, name: 'Dreamspell initiation: White Galactic Wizard' },
  
  // Recent dates (verify these against lawoftime.org manually)
  { date: '2026-03-20', expectedKin: null, name: 'Today — verify against lawoftime.org' },
  
  // Leap year edge cases
  { date: '2024-02-28', expectedKin: null, name: 'Day before leap day 2024' },
  { date: '2024-02-29', expectedKin: 0, name: 'Leap day 2024 — 0.0 Hunab Ku (no Kin)' },
  { date: '2024-03-01', expectedKin: null, name: 'Day after leap day 2024' },
  
  { date: '2020-02-28', expectedKin: null, name: 'Day before leap day 2020' },
  { date: '2020-02-29', expectedKin: 0, name: 'Leap day 2020 — 0.0 Hunab Ku' },
  { date: '2020-03-01', expectedKin: null, name: 'Day after leap day 2020' },
  
  // Non-leap year Feb boundary
  { date: '2023-02-28', expectedKin: null, name: 'Feb 28 non-leap year' },
  { date: '2023-03-01', expectedKin: null, name: 'Mar 1 non-leap year' },
  
  // Year boundaries
  { date: '2025-12-31', expectedKin: null, name: 'New Year Eve 2025' },
  { date: '2026-01-01', expectedKin: null, name: 'New Year 2026' },
  
  // Day Out of Time
  { date: '2025-07-25', expectedKin: null, name: 'Day Out of Time 2025' },
  { date: '2025-07-26', expectedKin: null, name: '13 Moon New Year 2025' },
  
  // Historical dates
  { date: '1990-01-01', expectedKin: null, name: 'Jan 1 1990' },
  { date: '2000-02-29', expectedKin: 0, name: 'Leap day Y2K' },
  { date: '1969-07-20', expectedKin: null, name: 'Moon landing' },
  { date: '2012-12-21', expectedKin: null, name: 'End of 13th Baktun' },
];

// NOTE TO CLAUDE CODE: Before running tests, you MUST look up the actual Kin numbers
// for all null entries above using this approach:
// 1. Use the reference date July 26, 2013 = Kin 164
// 2. Apply the algorithm carefully
// 3. Cross-reference at least 5 dates against an online calculator
// 4. Fill in all expectedKin values
// 5. Then run the tests
```

Also test:
- Oracle calculations for at least 5 known Kin
- Seal/tone extraction from Kin numbers
- Wavespell determination
- Castle determination
- 13 Moon date conversion (Gregorian → Moon + day)

Install test runner:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Add to package.json scripts: `"test": "vitest run", "test:watch": "vitest"`

---

## Step 5: Astronomy engine integration

### src/lib/astronomy/moon.ts

Use astronomy-engine to calculate real-time moon data:

```typescript
import * as Astronomy from 'astronomy-engine';

export interface MoonData {
  phase: number;              // 0-360 (0=new, 90=first quarter, 180=full, 270=last quarter)
  illumination: number;       // 0-100 percentage
  phaseName: string;          // 'New Moon', 'Waxing Crescent', etc.
  zodiacSign: string;         // 'Aries', 'Taurus', etc.
  zodiacDegree: number;       // 0-29 within sign
}

export function getMoonData(date: Date): MoonData {
  // Use Astronomy.MoonPhase() for phase angle
  // Use Astronomy.Illumination() for illumination
  // Use Astronomy.EclipticGeoMoon() for ecliptic longitude → zodiac sign
  // Phase names: New Moon (0±15), Waxing Crescent (15-75), First Quarter (75-105), 
  //   Waxing Gibbous (105-165), Full Moon (165-195), Waning Gibbous (195-255),
  //   Last Quarter (255-285), Waning Crescent (285-345)
  // Zodiac: divide ecliptic longitude by 30 to get sign index
}
```

---

## Step 6: Global styles and layout

### src/app/globals.css

```css
/* Deep space dark theme */
:root {
  --bg-primary: #080812;
  --bg-secondary: #0e0e1c;
  --bg-card: rgba(255, 255, 255, 0.02);
  --border-subtle: rgba(255, 255, 255, 0.06);
  --text-primary: #e8e6df;
  --text-secondary: #88867e;
  --text-tertiary: #48463e;
  --text-dim: #28281e;
  --purple: #c084fc;
  --purple-dim: rgba(192, 132, 252, 0.15);
  --seal-red: #ef4444;
  --seal-white: #e8e6df;
  --seal-blue: #3b82f6;
  --seal-yellow: #eab308;
  --bg-seal-red: #7f1d1d;
  --bg-seal-white: #2a2a2a;
  --bg-seal-blue: #1e3a5f;
  --bg-seal-yellow: #713f12;
}

/* No scrollbars anywhere */
* { scrollbar-width: none; -ms-overflow-style: none; }
*::-webkit-scrollbar { display: none; }

/* iOS Safari input fixes */
input[type="date"], input[type="time"], input[type="number"], select {
  -webkit-appearance: none;
  appearance: none;
  min-width: 0;
}

/* Tap highlight removal */
* { -webkit-tap-highlight-color: transparent; }

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  overflow: hidden;
  height: 100dvh;
}
```

### src/app/layout.tsx

Root layout with:
- Metadata: title "Deep Whisper — 13 Moon Galactic Calendar", description, og tags
- Dark theme meta tag
- viewport: width=device-width, initial-scale=1, viewport-fit=cover
- The TabBar component rendered at the bottom
- Main content area takes remaining height between status area and tab bar

### src/components/layout/TabBar.tsx

Fixed bottom tab bar with 4 tabs:
- Today (clock icon), My Kin (person icon), 13 Moons (calendar icon), Wavespell (concentric circles icon)
- Active tab: purple icon and label
- Inactive: dim grey
- Uses Next.js Link for navigation
- Height: 72px with safe-area-inset-bottom padding
- Backdrop blur background

---

## Step 7: Today view (home page)

### src/app/page.tsx

The Today view is a single-screen layout (no scroll required for essential content). Build with flexbox column filling the available height.

Layout from top to bottom:
1. **Header**: "DEEP WHISPER" in small caps, moon name + day below
2. **Galactic Compass** (~55% of remaining space): The SVG compass component
3. **Kin Strip**: Kin number (large) + seal name + tone + moon data pills
4. **Micro Dashboard**: Three compact progress indicators (wavespell, castle, spin)
5. **Milestone Card** (conditional): Only when a milestone is approaching

All data computed from today's date using the Kin calculation engine + astronomy engine.

### src/components/compass/GalacticCompass.tsx

SVG-based compass with:
- Outer ring: 20 seal glyphs in coloured squares, today's seal pulsing
- Inner ring: 13 tones in bar-dot notation, today's tone glowing purple
- Centre: Realistic moon phase with seal glyph overlay
- Oracle lines: 4 coloured lines from centre to oracle seal positions
- Oracle seals brighter than inactive seals
- Tap interactions: tap centre → bottom sheet, tap seal → bottom sheet

### src/components/compass/MoonPhase.tsx

Renders a realistic shaded moon:
- Uses astronomy-engine data for accurate phase
- Lit/shadow terminator calculated from illumination percentage
- Subtle crater texture (circle elements at low opacity)
- Today's seal glyph overlaid semi-transparent with gentle pulse animation
- Rim stroke at low opacity

---

## Step 8: My Kin calculator page

### src/app/my-kin/page.tsx

Two states:
1. **Input**: Date picker (day/month/year fields), "Reveal my Kin" button
2. **Result**: Shareable signature card

The signature card includes:
- Gradient background based on seal colour
- Large glyph, Kin number, full title
- Tone description with keywords
- Direction, Earth family, castle pill tags
- 2×2 oracle grid
- "deepwhisper.app" watermark
- "Share my Kin" + "Galactic Blueprint" action buttons

Handle February 29: Show message explaining 0.0 Hunab Ku with choice buttons for Feb 28 or Mar 1.

---

## Step 9: Deploy

After all components are built and tests pass:

```bash
# Commit everything
git add -A
git commit -m "DeepWhisper Phase 1: Foundation - 13 Moon Galactic Calendar

- Next.js 14 with TypeScript, Tailwind, App Router
- Complete Dreamspell data model (20 seals, 13 tones, 13 moons, 5 castles)
- Accurate Kin calculation engine with Feb 29 leap day handling
- Astronomy engine integration for real-time moon phase and sign
- Today view with Galactic Compass, Kin strip, micro dashboard
- My Kin calculator with shareable signature card
- Fixed bottom tab bar navigation
- Deep space dark aesthetic, mobile-first design"

# Push (force needed since we're replacing the old project)
git push origin master:main --force
```

Verify deployment at deepwhisper.app on Vercel.

---

## Quality checklist (verify before finishing)

- [ ] `npm run test` passes ALL Kin calculation tests
- [ ] Kin for today matches lawoftime.org
- [ ] Feb 29 dates return 0.0 Hunab Ku (no Kin)
- [ ] Feb 28 and Mar 1 in leap years have correct sequential Kin
- [ ] Oracle calculation matches for at least 5 known Kin
- [ ] Moon phase visually matches actual moon tonight
- [ ] Moon zodiac sign matches an astronomy reference
- [ ] Today view fits in single mobile screen (375×660px usable)
- [ ] No scrollbar visible anywhere
- [ ] Tab bar navigation works between all 4 pages
- [ ] Bottom sheets open/close on tap
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] `npm run build` succeeds
- [ ] App loads and renders correctly on mobile viewport
