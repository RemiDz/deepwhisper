# DeepWhisper — Fix Tone Ring Visibility & Alignment (megathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

---

## ONE task: Make the 13 tone bar-dot glyphs VISIBLE and ALIGNED with their seal icons.

The tone glyphs were added in the last build but they have two problems:
1. They are nearly invisible — opacity is way too low
2. They are misaligned — not positioned between the moon and their corresponding seal

---

## Fix 1: VISIBILITY

Find every place in the code where tone glyph opacity is set. This includes:
- Inline styles on SVG elements (`opacity: ...`)
- CSS classes applied to tone elements
- SVG `fill-opacity` or `stroke-opacity` attributes
- Any parent container opacity that affects the tones

**Set these exact values:**

For the ACTIVE tone (today's tone):
```
fill: #c084fc
opacity: 1.0
filter: drop-shadow(0 0 6px rgba(192, 132, 252, 0.7))
```

For ALL OTHER 12 tones:
```
fill: #c084fc
opacity: 0.5
```

**0.5 is the MINIMUM opacity for inactive tones. Do NOT use any value below 0.5.**

Also check:
- The dots (`<circle>` elements) must have `fill="#c084fc"` NOT `stroke` only. They should be FILLED circles, not outlines.
- The bars (`<rect>` elements) must have `fill="#c084fc"` NOT `stroke` only. They should be FILLED rectangles, not outlines.
- If any element uses `fill="none"` with only a stroke, change it to a solid fill.

**Size check:**
- Dots: radius `r="2.5"` minimum (if smaller, increase to 2.5)
- Bars: width `16px` minimum, height `3.5px` minimum, `rx="1.5"` for rounded ends

---

## Fix 2: ALIGNMENT

The compass has 20 seal icons in the outer ring. The 13 tone glyphs sit in an inner ring. The problem is that tones and seals are on DIFFERENT cycles (13 vs 20), so they should NOT be paired 1-to-1 with specific seals.

The correct layout:
- **20 seals** are evenly spaced in a circle at radius R_seal (the current outer ring radius — do not change this)
- **13 tones** are evenly spaced in their OWN circle at radius R_tone, where R_tone = R_seal × 0.55 (roughly halfway between moon centre and seal ring)

Each tone's position:
```javascript
for (let i = 0; i < 13; i++) {
  const angle = (i / 13) * Math.PI * 2 - Math.PI / 2; // start from top (12 o'clock), go clockwise
  const tx = centreX + Math.cos(angle) * R_tone;
  const ty = centreY + Math.sin(angle) * R_tone;
  // render tone glyph centred at (tx, ty)
}
```

This ensures:
- All 13 tones are evenly spaced in a perfect circle
- The tone ring is clearly inside the seal ring with visible separation
- No tone overlaps a seal icon (different radii)
- The tone ring is centred on the same point as the seal ring and moon

**Do NOT try to align each tone with a specific seal icon.** They are independent rings.

---

## Mayan bar-dot reference (same as before, for completeness)

```
Tone 1  = 0 bars, 1 dot
Tone 2  = 0 bars, 2 dots
Tone 3  = 0 bars, 3 dots
Tone 4  = 0 bars, 4 dots
Tone 5  = 1 bar,  0 dots
Tone 6  = 1 bar,  1 dot
Tone 7  = 1 bar,  2 dots
Tone 8  = 1 bar,  3 dots
Tone 9  = 1 bar,  4 dots
Tone 10 = 2 bars, 0 dots
Tone 11 = 2 bars, 1 dot
Tone 12 = 2 bars, 2 dots
Tone 13 = 2 bars, 3 dots
```

Formula:
```javascript
const bars = Math.floor(toneNumber / 5);  // 5→1, 10→2
const dots = toneNumber % 5;               // remainder
// Special case: if dots === 0 and bars > 0, that's correct (tone 5 = 1 bar, 0 dots)
```

Wait — correction. The formula above gives tone 5 = bars:1, dots:0 which is correct. But tone 10 = bars:2, dots:0 which is also correct. Let me verify all:

```
Tone 1:  floor(1/5)=0 bars, 1%5=1 dot   ✓
Tone 2:  floor(2/5)=0 bars, 2%5=2 dots  ✓
Tone 3:  floor(3/5)=0 bars, 3%5=3 dots  ✓
Tone 4:  floor(4/5)=0 bars, 4%5=4 dots  ✓
Tone 5:  floor(5/5)=1 bar,  5%5=0 dots  ✓
Tone 6:  floor(6/5)=1 bar,  6%5=1 dot   ✓
Tone 7:  floor(7/5)=1 bar,  7%5=2 dots  ✓
Tone 8:  floor(8/5)=1 bar,  8%5=3 dots  ✓
Tone 9:  floor(9/5)=1 bar,  9%5=4 dots  ✓
Tone 10: floor(10/5)=2 bars, 10%5=0 dots ✓
Tone 11: floor(11/5)=2 bars, 11%5=1 dot  ✓
Tone 12: floor(12/5)=2 bars, 12%5=2 dots ✓
Tone 13: floor(13/5)=2 bars, 13%5=3 dots ✓
```

All correct.

Rendering each glyph centred at (cx, cy):
```
- Total glyph height: (number of bar rows × 5) + (dot row exists ? 5 : 0)
- Start Y at: cy - totalHeight/2
- Dot row Y: startY + dotRadius  (dots centred on this Y)
- Bar rows Y: below dot row, each spaced 5px apart

Dots: spread horizontally, centred on cx
  - Spacing between dot centres: 6px
  - First dot X: cx - ((numDots - 1) * 6) / 2
  
Bars: centred on cx
  - Bar width: 16px, height: 3.5px, rx: 1.5
  - Bar X: cx - 8 (half of 16px width)
  - Spacing between bars: 5px (centre to centre)
```

---

## What NOT to change

- Seal ring (outer ring) — do not touch positions, sizes, icons, or opacity
- Moon centre — do not touch
- Oracle connection lines — do not touch
- Everything below the compass (Kin info, declaration, progress bars) — do not touch
- Other views — do not touch
- Dreamspell engine — do not touch
- Test files — do not touch

---

## Before pushing: local visual check

Before committing, run `npm run dev` and visually confirm in the browser at localhost:
1. Can you clearly see all 13 tone glyphs? (They should be obvious purple dot/bar symbols)
2. Are they arranged in a clean circle inside the seal ring?
3. Does tone 1 (top, 12 o'clock position) show exactly 1 dot?
4. Does tone 5 show exactly 1 bar?
5. Does tone 10 show exactly 2 bars?
6. Does tone 13 show 3 dots above 2 bars?
7. Is today's active tone noticeably brighter than the others?

If ANY of these checks fail, fix before committing.

```bash
npm run build
npm run test
```

Both must pass with zero errors.
