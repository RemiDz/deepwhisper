# DeepWhisper — Replace SVG Glyphs with Dreamspell PNG Icons (megathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

---

## Context

The app currently renders solar seal glyphs as inline SVG paths that look generic and nothing like the traditional Dreamspell iconography. We now have the actual 20 Dreamspell solar seal glyph images as PNGs in `/public/icons/`. These must replace all SVG glyph rendering throughout the entire app.

## The 20 seal PNG files

Located in `/public/icons/`:

```
1_dragon.png
2_wind.png
3_night.png
4_seed.png
5_serpent.png
6_worldbridger.png
7_hand.png
8_star.png
9_moon.png
10_dog.png
11_monkey.png
12_human.png
13_skywalker.png
14_wizard.png
15_eagle.png
16_warrior.png
17_earth.png
18_mirror.png
19_storm.png
20_sun.png
```

The numbering matches the seal order (1-indexed): Dragon=1, Wind=2, ... Sun=20.

---

## Changes required

### 1. Update the seal data model

In `src/lib/dreamspell/seals.ts`:

- Remove or deprecate the `glyphPath` property (SVG path string)
- Add an `iconPath` property to each seal pointing to its PNG file
- Dragon (index 0, seal number 1) → `/icons/1_dragon.png`
- Wind (index 1, seal number 2) → `/icons/2_wind.png`
- ... and so on for all 20 seals
- Sun (index 19, seal number 20) → `/icons/20_sun.png`
- Update the TypeScript interface in `types.ts` accordingly

### 2. Create a reusable SealIcon component

Create or update `src/components/compass/SealGlyph.tsx` (or create `SealIcon.tsx`) as a reusable component:

```tsx
// Props: seal (SolarSeal), size (number), className (optional)
// Renders: Next.js Image or img tag with the seal's PNG
// - Sized to the given size (square)
// - border-radius: 4-6px to soften edges
// - Optional coloured background square behind the icon
// - alt text: seal name for accessibility
```

Use standard `<img>` tags rather than Next.js `<Image>` if the Image component causes layout issues at small sizes. The PNGs are tiny (8-27KB) so optimisation is not critical.

### 3. Replace ALL glyph rendering throughout the app

Search the entire codebase for any SVG path rendering of seal glyphs and replace with the new SealIcon component. Every place a seal glyph appears must use the PNG image. This includes but is not limited to:

**Galactic Compass (Today view):**
- Outer ring: 20 seal icons in coloured squares (~26-30px)
- Centre moon overlay: Today's seal icon (~40-48px, semi-transparent overlay on moon)
- Oracle connection target highlights

**Kin Strip (Today view):**
- If the seal glyph appears next to the Kin name

**My Kin calculator:**
- Signature card: Large seal icon at top (~64-72px)
- Oracle grid: 4 oracle seal icons (~32-40px each)
- Input state: If any seal preview is shown

**13 Moons calendar:**
- Day grid cells: Small seal icon per day (~18-22px)

**Wavespell explorer:**
- Timeline items: Seal icon per tone/day (~32-36px)
- Wavespell header: Initiating seal icon (~32px)

**Bottom sheets / detail views:**
- Any expanded seal detail: Larger icon (~48-56px)

**Any other component** that currently renders an `<svg>` or `<path>` element for a seal glyph.

### 4. Styling rules for seal icons

- Icons should sit inside their seal colour background square (the existing `bgHex` colour from the seal data)
- Background square: `border-radius: 6-8px`
- Icon image: `border-radius: 4px` to slightly soften PNG edges
- On the compass, today's active seal should be brighter/more opaque than inactive seals (same as current behaviour, just with PNGs instead of SVG paths)
- Oracle-connected seals should be more visible than non-oracle seals
- Inactive/dimmed seals: use CSS `opacity: 0.3-0.5` on the image
- The seal glyph overlay on the centre moon should use `mix-blend-mode: screen` or `opacity: 0.4-0.5` to create the watermark effect on the moon surface

### 5. Do NOT change

- Any calculation logic (Kin engine, oracle, wavespell, etc.)
- Page layouts or navigation structure
- The moon phase rendering
- The tone ring (bar-dot notation)
- The micro dashboard, milestone cards, or cycle context
- Any test files

### 6. Verify

After all changes:

```bash
npm run build
```

Must complete with zero TypeScript errors. Visually verify that all 20 seal icons render correctly at each size across all four views (Today, My Kin, 13 Moons, Wavespell).
