# DeepWhisper Phase 3 — Nested Gear Hero Wheel + Tutorial Tab

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Overview

Rebuild the DeepWhisper hero wheel on the main Today view. Replace the current compass/wheel visualisation with a **nested gear mechanism** — a larger outer gear (20 teeth, one per solar seal) containing a smaller inner gear (13 teeth, one per galactic tone). Both gears rotate when navigating between days. The existing moon visualisation in the centre hub must be **preserved exactly as it is** — do not modify it.

Additionally, add a new **Learn** tab with a step-through tutorial explaining the 13×20 Dreamspell system, designed for visual/dyslexic-friendly users.

## Thinking Level: megathink

---

## Part 1: Nested Gear Hero Wheel

### Architecture

The gear mechanism is rendered on an HTML `<canvas>` element layered behind/around the existing moon centre. The canvas handles:

1. **Outer gear ring** — 20 seal icon images arranged as gear teeth
2. **Inner gear ring** — 13 tone dot-and-bar symbols rendered as gear teeth
3. **Mesh zone** — a highlighted contact area at twelve o'clock where outer and inner gears interlock
4. **Pointer** — a small triangle at twelve o'clock marking the active mesh point
5. **Centre hub** — the existing moon visualisation (DO NOT TOUCH)

### Outer Gear (20 Seals)

- Use the 20 seal PNG icons located at `/public/seals/1_dragon.png` through `/public/seals/20_sun.png`
- Copy the uploaded seal icons from the project root to `/public/seals/` if not already there
- Each icon is displayed as a rounded-square tile rotated radially (facing outward from centre)
- The active seal (today's Kin seal) is slightly larger (1.12×) with a border highlight
- Inactive seals are dimmed to 30% opacity
- Seals use the Dreamspell colour coding:
  - Red (#ef4444): Dragon, Serpent, Moon, Skywalker, Earth (indices 0, 4, 8, 12, 16)
  - White (#e0ddd6): Wind, Worldbridger, Dog, Wizard, Mirror (indices 1, 5, 9, 13, 17)
  - Blue (#3b82f6): Night, Hand, Monkey, Eagle, Storm (indices 2, 6, 10, 14, 18)
  - Yellow (#eab308): Seed, Star, Human, Warrior, Sun (indices 3, 7, 11, 15, 19)

### Inner Gear (13 Tones)

- Each tone is represented by its **dot-and-bar symbol** drawn directly on canvas
- Symbols are **rotated radially** to follow the gear tooth they sit on (NOT horizontal — they follow the curve of the gear naturally, like markings stamped into a cog)
- Dot-and-bar notation:
  - Tone 1 (Magnetic): 1 dot
  - Tone 2 (Lunar): 2 dots
  - Tone 3 (Electric): 3 dots
  - Tone 4 (Self-existing): 4 dots
  - Tone 5 (Overtone): 1 bar (bar = 5 dots)
  - Tone 6 (Rhythmic): 1 bar + 1 dot
  - Tone 7 (Resonant): 1 bar + 2 dots
  - Tone 8 (Galactic): 1 bar + 3 dots
  - Tone 9 (Solar): 1 bar + 4 dots
  - Tone 10 (Planetary): 2 bars
  - Tone 11 (Spectral): 2 bars + 1 dot
  - Tone 12 (Crystal): 2 bars + 2 dots
  - Tone 13 (Cosmic): 2 bars + 3 dots
- Bars are horizontal lines, dots are circles — stacked vertically within each tooth (bars on top, dots below)
- The active tone tooth is highlighted purple (#c084fc) at full opacity
- Inactive tones are dimmed to ~12% opacity with symbols at ~50%
- The inner gear teeth point outward; the outer gear teeth point inward — they mesh in the gap between

### Mesh Zone

- At twelve o'clock (angle = -π/2), draw a subtle radial highlight strip spanning from the outer gear to inner gear
- Use the active seal's colour at ~15% opacity
- Add a small downward-pointing triangle above the outer gear as a pointer marker

### Rotation & Animation

- When the user navigates to a different day (via buttons or drag):
  - Calculate the new seal index: `(kin - 1) % 20`
  - Calculate the new tone index: `(kin - 1) % 13`
  - Set target angles: `targetOuter = -(sealIndex / 20) * 2π`, `targetInner = -(toneIndex / 13) * 2π`
  - Animate both angles toward targets using easing factor 0.1 per frame
- The two gears rotate at different rates because 20 and 13 are coprime — this IS the mechanism that produces 260 unique combinations

### Interaction

- **Drag to spin**: pointer down captures angle, pointer move calculates delta, snaps to nearest seal step (2π/20), advances/retreats days accordingly
- **Previous/Today/Next buttons**: step currentDay by -1, reset to 0, or +1
- Display below the wheel:
  - Kin name (e.g. "Spectral Wind") in the seal's colour
  - Kin number, tone number, seal number
  - Affirmation snippet (e.g. "I dissolve in order to wind")

### Preserving the Moon Centre

- The existing moon visualisation in the centre of the wheel **must not be modified**
- The canvas gear rendering should leave the centre area transparent/empty so the moon shows through
- If the current implementation uses a separate element for the moon, ensure it layers correctly (moon on top of or integrated with the gear canvas)
- The inner gear's innermost radius should be sized to frame the moon without overlapping it

### Proportions (relative to container width `u = min(width, height)`)

- Outer gear radius (centre of seal icons): `u * 0.37`
- Seal icon size: `u * 0.085` (active: `u * 0.095`)
- Gap between outer and inner gear: `u * 0.018`
- Inner gear outer edge: `outerR - iconSize/2 - gap`
- Inner gear band width: `u * 0.12`
- Inner gear inner edge: `innerOuterR - u * 0.12`
- Centre hub (moon area): everything inside `innerInnerR`

### Kin Calculation

Use the existing Kin calculation engine already in the app. Reference date: 15 January 2026 = Kin 37. The Dreamspell system does NOT count leap days (Feb 29 is "Day Out of Time" and shares the same Kin as Feb 28).

```
function getTzolkinKin(date) {
  const refDate = new Date(2026, 0, 15); // Jan 15, 2026
  const refKin = 37;
  const diffDays = Math.floor((date - refDate) / (1000 * 60 * 60 * 24));
  // Count leap days between ref and target, subtract them
  const leapDays = countLeapDaysBetween(refDate, date);
  const adjDiff = diffDays - leapDays;
  let k = refKin + adjDiff;
  k = ((k - 1) % 260 + 260) % 260 + 1;
  return k;
}
```

---

## Part 2: Learn Tab (Tutorial/Explainer)

Add a new tab called **Learn** to the bottom navigation. When tapped, it shows a step-through visual explainer of the 13×20 Dreamspell system.

### Design Principles
- Dyslexia-friendly: minimal text, lots of colour, one concept per step
- Step-through navigation with pill buttons at the top
- Deep space dark aesthetic matching the app

### Steps (6 total)

**Step 1: "The big idea"**
- Show the equation: 20 seals × 13 tones = 260 Kin
- Each number in a coloured box (seals = red, tones = blue, kin = yellow)
- Simple text: "Think of it like a combination lock. Each day has one seal (what kind of energy) + one tone (how strong/what phase)."
- Flow diagram: Seal = WHAT + Tone = HOW = Your daily Kin

**Step 2: "20 seals"**
- 5×4 grid of all 20 seals with their colour coding
- Colour legend: Red = initiate, White = refine, Blue = transform, Yellow = ripen
- Each seal tappable (triggers sendPrompt to ask about that seal)
- Simple text: "20 types of cosmic energy. They cycle in order every 20 days."

**Step 3: "13 tones"**
- Row of 13 tone numbers with dot-and-bar symbols
- Wave curve visualisation showing the 13-tone creative wave (rises from 1 to peak, dips at 7, rises again, ends at 13)
- Simple text: "13 levels of creative power, running 1 to 13 then restarting."

**Step 4: "13 moons"**
- Equation: 13 moons × 28 days = 364 + 1
- Perfect 4×7 grid showing a sample moon month
- Day name headers: D, S, G, K, A, L, S (Dreamspell day names)
- Simple text: "13 Moons and 13 Tones are separate systems running at the same time."

**Step 5: "260 Kin grid"**
- Full 13×20 Tzolkin matrix as tiny coloured cells
- Hover/tap any cell to see its Kin number and name
- 5 castle colour bands visible (Red, White, Blue, Yellow, Green)
- Simple text: "Each column = one seal. Each row = one tone."

**Step 6: "How it fits"**
- Two interlocking circle diagram (20-tooth and 13-tooth, conceptual)
- Text: "Two gears spinning at different speeds. Because 13 and 20 share no common factor, it takes 260 days before the same combination appears again."
- Flow: 260-day Tzolkin + 365-day year = 52-year cycle
- Closing: "Open app → see today's seal + tone → get your sound healing prescription → practice."

---

## File Changes Summary

1. **Copy seal icons** to `/public/seals/` (1_dragon.png through 20_sun.png)
2. **Create/modify the gear wheel component** — canvas-based, wrapping around existing moon centre
3. **Create the Learn tab component** with 6 step-through panels
4. **Add Learn to bottom navigation** alongside Today, My Kin, 13 Moons, Wavespell
5. **Ensure deep space dark aesthetic** consistent with app's chosen palette
6. **Test on mobile viewport** (375px width) — ensure seal icons and tone symbols are readable

---

## Quality Checks

- [ ] Gear rotates smoothly when stepping through days
- [ ] Drag-to-spin works on touch devices
- [ ] Moon centre is completely unchanged
- [ ] All 20 seal PNG icons display correctly
- [ ] All 13 tone dot-and-bar symbols render correctly (radially oriented)
- [ ] Mesh zone highlight visible at twelve o'clock
- [ ] Learn tab accessible from navigation
- [ ] All 6 tutorial steps render with correct content
- [ ] Works on mobile (375px) and desktop
- [ ] Deep space dark aesthetic maintained throughout
- [ ] No console errors
- [ ] `git push origin master:main` succeeds
