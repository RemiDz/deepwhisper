# DeepWhisper — Integrate Energy Intensity Component

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: megathink

## Overview

Add an **Energy Intensity** component to the main Today view page. It sits between the Kin detail card (the big number, seal name, tone info, action words, tags) and the Today's Declaration section. It shows today's cosmic energy profile across 8 life dimensions.

This is NOT a separate tab — it's integrated directly into the Today page scroll.

---

## Component Design

The component has two parts stacked vertically:

### Part 1: Overall Intensity Bar (dashed segments)

A horizontal bar of 10 segments (matching the visual style of the existing Wavespell/Castle/Spin progress bars already in the app).

- Header row: "Energy intensity" label on the left, score value on the right (e.g. "6.4 / 10")
- 10 segments in a row with small gaps between them
- Filled segments use colour coding: segments 1-3 = blue (#60a5fa), segments 4-5 = green (#4ade80), segments 6-7 = amber (#fbbf24), segments 8-10 = red (#f87171)
- Unfilled segments = very subtle (rgba(255,255,255,0.06))
- The score text colour matches the overall level colour

### Part 2: Eight Glass Tube Columns

Eight vertical glass-effect tubes, one per dimension, with full word labels below.

**Dimensions (in order, left to right):**
1. Communication
2. Creativity
3. Physical
4. Emotional
5. Intuition
6. Transformation
7. Connection
8. Grounding

**Tube styling:**
- Outer tube: 18px wide, 90px tall, border-radius 9px (pill shape)
- Background: rgba(255,255,255,0.04)
- Border: 0.5px solid rgba(255,255,255,0.08)
- Fill: rises from bottom, height = (value/10 * 100)%, border-radius 7.5px
- Glass shine effect: a 2.5px wide, full-height strip on the left at rgba(255,255,255,0.06)
- Value number above each tube in the matching colour
- Full dimension name below each tube in small muted text (8-9px, rgba(255,255,255,0.45))

**Colour coding for tube fills (same blue→green→amber→red scale):**
- Value 1-3: fill rgba(96,165,250,0.7), text #93bbfd (calm / blue)
- Value 4-5: fill rgba(74,222,128,0.65), text #86efac (balanced / green)
- Value 6-7: fill rgba(251,191,36,0.65), text #fcd34d (elevated / amber)
- Value 8-10: fill rgba(248,113,113,0.7), text #fca5a5 (intense / red)

**Legend row below tubes:**
Four small items: blue square "calm", green square "balanced", amber square "elevated", red square "intense"
Font size 8px, very subtle.

### Separator

A 1px horizontal line (rgba(255,255,255,0.06)) between the overall bar and the tubes section.

---

## Data: Energy Profiles

Create a new data file `src/data/energyProfiles.ts` that maps each seal to an energy profile and each tone to an intensity modifier.

### Seal Base Profiles (8 values, each 1-10)

```typescript
// [Communication, Creativity, Physical, Emotional, Intuition, Transformation, Connection, Grounding]
export const sealProfiles: Record<number, number[]> = {
  0:  [4, 5, 7, 6, 5, 4, 5, 9],  // Dragon — nurturing, primal, grounded
  1:  [9, 6, 3, 5, 7, 5, 6, 3],  // Wind — communication, spirit, breath
  2:  [3, 8, 3, 6, 9, 4, 4, 5],  // Night — dreams, intuition, abundance
  3:  [5, 6, 4, 4, 5, 3, 5, 8],  // Seed — intention, targeting, grounding
  4:  [4, 4, 9, 7, 6, 7, 5, 6],  // Serpent — life force, physical, kundalini
  5:  [5, 3, 4, 7, 6, 8, 7, 4],  // Worldbridger — transition, surrender, connection
  6:  [5, 6, 6, 5, 5, 5, 7, 6],  // Hand — healing, accomplishment, knowing
  7:  [6, 9, 5, 6, 6, 4, 7, 5],  // Star — harmony, beauty, creativity
  8:  [5, 6, 4, 9, 7, 5, 6, 5],  // Moon — emotions, flow, purification
  9:  [6, 5, 5, 8, 5, 4, 9, 6],  // Dog — love, loyalty, heart, connection
  10: [7, 9, 5, 6, 5, 5, 8, 3],  // Monkey — play, magic, creativity, illusion
  11: [7, 6, 5, 5, 8, 5, 7, 5],  // Human — free will, wisdom, influence
  12: [6, 5, 5, 4, 6, 6, 5, 4],  // Skywalker — exploration, space, expansion
  13: [4, 5, 3, 5, 9, 6, 4, 5],  // Wizard — receptivity, enchantment, timelessness
  14: [5, 7, 4, 4, 9, 5, 5, 4],  // Eagle — vision, mind, creativity
  15: [6, 4, 8, 5, 5, 6, 5, 7],  // Warrior — intelligence, fearlessness, questioning
  16: [5, 5, 6, 5, 6, 5, 6, 9],  // Earth — navigation, synchronicity, grounding
  17: [4, 5, 3, 5, 8, 6, 4, 5],  // Mirror — reflection, order, clarity
  18: [5, 7, 7, 6, 5, 9, 5, 4],  // Storm — catalysis, energy, transformation
  19: [7, 7, 6, 6, 7, 5, 7, 7],  // Sun — enlightenment, universal fire, wholeness
};
```

### Tone Intensity Modifiers

Each tone has a multiplier (0.6 to 1.4) that scales the base profile values. This represents how the tone amplifies or softens the seal energy.

```typescript
export const toneModifiers: Record<number, number> = {
  0:  0.7,   // Magnetic — gathering, low intensity, setting purpose
  1:  0.75,  // Lunar — polarising, identifying challenge
  2:  0.85,  // Electric — activating, bonding service
  3:  0.8,   // Self-existing — defining, measuring form
  4:  0.95,  // Overtone — empowering, commanding radiance
  5:  0.9,   // Rhythmic — organising, balancing equality
  6:  1.0,   // Resonant — channelling, centre point, attunement
  7:  1.05,  // Galactic — harmonising, modelling integrity
  8:  1.2,   // Solar — pulsing, intention, realising
  9:  1.15,  // Planetary — perfecting, producing manifestation
  10: 1.1,   // Spectral — dissolving, releasing, liberation
  11: 1.0,   // Crystal — dedicating, cooperating, universalising
  12: 1.3,   // Cosmic — transcending, enduring, presence (peak)
};
```

### Calculating Today's Profile

```typescript
export function getEnergyProfile(sealIndex: number, toneIndex: number): {
  values: number[];
  overall: number;
} {
  const base = sealProfiles[sealIndex];
  const modifier = toneModifiers[toneIndex];
  const values = base.map(v => Math.min(10, Math.max(1, Math.round(v * modifier))));
  const overall = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  return { values, overall };
}
```

---

## Component File

Create `src/components/energy/EnergyIntensity.tsx`

Props:
```typescript
interface EnergyIntensityProps {
  sealIndex: number;  // 0-19
  toneIndex: number;  // 0-12
}
```

The component:
1. Calls `getEnergyProfile(sealIndex, toneIndex)` to get the 8 values and overall
2. Renders the dashed overall bar
3. Renders the 8 glass tubes with labels
4. Renders the colour legend

All rendering is standard React/JSX with inline styles or Tailwind classes matching the app's existing style system. No canvas needed — this is pure DOM elements.

---

## Integration in page.tsx

Place the `<EnergyIntensity>` component in the Today page between:
- The Kin detail section (big number, name, tone, actions, tags) — ABOVE
- The Today's Declaration section — BELOW

Pass the current day's sealIndex and toneIndex as props.

When the user navigates to a different day (prev/next), the energy profile updates accordingly.

---

## DO NOT

- Do NOT modify GearWheel.tsx
- Do NOT modify the moon centre
- Do NOT modify the Learn tab
- Do NOT modify the navigation buttons
- Do NOT modify any existing styling or components beyond adding the EnergyIntensity component in the right position

## Quality Checks

- [ ] Energy intensity component renders on the Today page
- [ ] Positioned between Kin detail card and Today's Declaration
- [ ] Overall dashed bar shows correct number of filled segments
- [ ] Dashed bar colour transitions: blue→green→amber→red
- [ ] 8 glass tubes render with correct heights proportional to values
- [ ] Tube colours follow blue(1-3)→green(4-5)→amber(6-7)→red(8-10) scale
- [ ] Glass shine effect visible on each tube
- [ ] Full dimension names displayed below tubes (Communication, Creativity, etc.)
- [ ] Value numbers displayed above tubes in matching colours
- [ ] Legend shows 4 colour levels: calm, balanced, elevated, intense
- [ ] Profile changes when navigating to different days
- [ ] Component looks good on mobile (375px width)
- [ ] Matches app's dark aesthetic
- [ ] `git push origin master:main` succeeds
