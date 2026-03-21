# DeepWhisper — Fix Galactic Tone Ring (megathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

---

## IMPORTANT: This prompt fixes exactly ONE thing — the 13 galactic tone indicators on the inner ring of the Galactic Compass. Do NOT change anything else.

---

## Problem

The inner ring of the Galactic Compass shows the 13 galactic tones, but they are broken:
- Some tones render as dot/bar patterns, others as plain numbers (e.g., "10", "13")
- The notation is inconsistent and incorrect
- Positioning relative to the outer seal ring is uneven

ALL 13 tones must use the traditional Mayan bar-dot notation. No numbers. No text. Only dots and bars.

---

## Mayan Bar-Dot Notation Reference

This is the ONLY correct representation. A dot = a small filled circle. A bar = a short horizontal line. Dots sit ABOVE bars. Multiple dots in a row are spaced horizontally. Multiple bars stack vertically.

```
Tone 1  = ●                         (1 dot)
Tone 2  = ● ●                       (2 dots side by side)
Tone 3  = ● ● ●                     (3 dots side by side)
Tone 4  = ● ● ● ●                   (4 dots side by side)
Tone 5  = ▬▬▬▬                      (1 bar)
Tone 6  = ●                         (1 dot above 1 bar)
          ▬▬▬▬
Tone 7  = ● ●                       (2 dots above 1 bar)
          ▬▬▬▬
Tone 8  = ● ● ●                     (3 dots above 1 bar)
          ▬▬▬▬
Tone 9  = ● ● ● ●                   (4 dots above 1 bar)
          ▬▬▬▬
Tone 10 = ▬▬▬▬                      (2 bars stacked)
          ▬▬▬▬
Tone 11 = ●                         (1 dot above 2 bars)
          ▬▬▬▬
          ▬▬▬▬
Tone 12 = ● ●                       (2 dots above 2 bars)
          ▬▬▬▬
          ▬▬▬▬
Tone 13 = ● ● ●                     (3 dots above 2 bars)
          ▬▬▬▬
          ▬▬▬▬
```

Key rules:
- Dots are always on TOP, bars are always on BOTTOM
- Each bar represents 5, each dot represents 1
- Dots are arranged horizontally in a single row
- Bars are stacked vertically
- The whole symbol is vertically compact (dots row, then bar rows)

---

## Implementation

### Step 1: Create a ToneGlyph SVG renderer

Create a new component or utility function that renders any tone (1–13) as an SVG using ONLY dots and bars. This should be a pure SVG rendering function since the tones sit inside the compass SVG.

```tsx
// Function to render tone as SVG group at a given position
// Parameters: toneNumber (1-13), cx, cy (centre position), scale (size multiplier)

function renderToneGlyph(toneNumber: number): { dots: number; bars: number } {
  // Calculate how many bars and dots
  const bars = Math.floor((toneNumber) / 5);      // 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2
  const dots = toneNumber - (bars * 5);            // 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3
  return { dots, bars };
}
```

For SVG rendering within the compass:

```
Dot: <circle> with r="2" (small filled circle)
Bar: <rect> with width="14" height="3" rx="1.5" (rounded horizontal bar)

Layout within the tone glyph group:
- Total width: ~18px (bars are 14px, dots spread within this width)
- Dots row: centred horizontally, spaced 4px apart
- Bar rows: centred horizontally, spaced 4px apart vertically
- Dots sit above bars
- Everything centred around the (cx, cy) anchor point

Colour: #c084fc (purple) for all dots and bars
- Today's active tone: opacity 1.0, with subtle glow filter
- Other tones: opacity 0.25
```

### Step 2: Replace current tone rendering in the compass

Find the code in the Galactic Compass component (likely `GalacticCompass.tsx` or `SealRing.tsx` or similar) where the 13 tones are rendered in the inner ring.

**Remove** all current tone rendering code — whether it's rendering numbers, text, or partial dot patterns.

**Replace** with the new bar-dot SVG renderer for all 13 tones. Each tone should be:
- Positioned in a perfect circle (the inner ring, smaller radius than the seal ring)
- Evenly spaced: `angle = (index / 13) * 2π - π/2` (starting from top, going clockwise)
- The bar-dot glyph centred at each position
- Ring radius should be about 60–65% of the seal ring radius (so there's clear space between the tone ring and the seal ring)

### Step 3: Verify all 13 tones render correctly

After implementing, visually verify each tone:

| Tone | Expected | Check |
|------|----------|-------|
| 1    | 1 dot | ● |
| 2    | 2 dots | ● ● |
| 3    | 3 dots | ● ● ● |
| 4    | 4 dots | ● ● ● ● |
| 5    | 1 bar | ▬ |
| 6    | 1 dot + 1 bar | |
| 7    | 2 dots + 1 bar | |
| 8    | 3 dots + 1 bar | |
| 9    | 4 dots + 1 bar | |
| 10   | 2 bars | |
| 11   | 1 dot + 2 bars | |
| 12   | 2 dots + 2 bars | |
| 13   | 3 dots + 2 bars | |

NONE of these should show as a plain number. ALL must be dots and bars only.

### Step 4: Today's active tone highlight

- Today's active tone glyph: full opacity (1.0), colour `#c084fc`, optional subtle purple glow (`filter: drop-shadow(0 0 4px rgba(192, 132, 252, 0.6))`)
- All other 12 tones: opacity `0.25`, same colour, no glow

---

## What NOT to change

- Seal ring (outer ring with PNG icons) — do not touch
- Moon centre — do not touch
- Oracle connection lines — do not touch
- Kin info strip below compass — do not touch
- Declaration card — do not touch
- Any other view (My Kin, 13 Moons, Wavespell) — do not touch
- Dreamspell calculation engine — do not touch
- Test files — do not touch

---

## After fix

```bash
npm run build
npm run test
```

Both must pass with zero errors.

## Verification checklist

- [ ] All 13 tones use bar-dot notation ONLY — no numbers, no text
- [ ] Tone 1 shows 1 dot
- [ ] Tone 5 shows 1 bar (no dots)
- [ ] Tone 10 shows 2 bars (no dots)
- [ ] Tone 13 shows 3 dots above 2 bars
- [ ] Dots are always above bars
- [ ] Today's active tone is bright purple with glow
- [ ] Other 12 tones are dimmed (opacity 0.25)
- [ ] All 13 tones are evenly spaced in a circle inside the seal ring
- [ ] No tone glyph overlaps a seal icon
- [ ] `npm run build` — zero errors
- [ ] `npm run test` — all pass
