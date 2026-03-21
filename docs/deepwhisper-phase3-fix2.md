# DeepWhisper Phase 3 FIX #2 — Tone Symbol Orientation, Colour Separation & Accuracy

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: gigathink

## What's Wrong (3 issues in GearWheel.tsx only)

### Issue 1: Tone dot-and-bar symbols are upside down

The tone symbols on the inner gear are rendered inverted. When a tone symbol sits at the twelve o'clock position, the **bars should be at the TOP** (outer edge, away from centre) and **dots at the BOTTOM** (toward the centre hub). Currently they render the wrong way round.

**Fix:** In the drawRadialDotBar function (or wherever the tone symbols are drawn), the rotation applied before drawing must be `a - Math.PI / 2` instead of `a + Math.PI / 2`. This flips the symbol so bars face outward and dots face inward.

Change this:
```typescript
ctx.rotate(a + Math.PI / 2);
```
To this:
```typescript
ctx.rotate(a - Math.PI / 2);
```

**Verification after fix:**
- Tone 11 (Spectral) at twelve o'clock: 2 horizontal bars at the TOP (outer edge), 1 dot at the BOTTOM (toward centre)
- Tone 1 (Magnetic) at any position: single dot should be toward the centre side
- Tone 5 (Overtone) at any position: single bar should be toward the outer edge side

### Issue 2: Too much purple — gear teeth and symbols bleed together

The inner gear tooth backgrounds AND the tone symbols are both purple (#c084fc), making them look muddy and merged. The tooth shapes need to be much more subtle so only the tone symbols carry the colour.

**Fix:** Change the inner gear tooth fill colours:

For INACTIVE teeth:
- Change `ctx.globalAlpha = 0.12` to `ctx.globalAlpha = 0.04` (almost invisible)
- This makes inactive teeth barely visible — just a hint of structure

For ACTIVE tooth:
- Change `ctx.globalAlpha = 0.85` to `ctx.globalAlpha = 0.2` (subtle background, not competing with the symbol)
- Remove the active tooth stroke entirely (delete the `if (isActive)` stroke block for the tooth shape)

The tone DOT-AND-BAR SYMBOLS should remain at their current opacity (active = 1.0, inactive = 0.5). This creates clear separation: the symbols are the main visual element, the tooth shapes are just subtle structural hints.

### Issue 3: Tone symbol accuracy verification

After fixing orientation, verify these specific tones render correctly:

| Tone | Name | Bars (top/outer) | Dots (bottom/inner) |
|------|------|----------|------|
| 1 | Magnetic | 0 | 1 |
| 2 | Lunar | 0 | 2 |
| 3 | Electric | 0 | 3 |
| 4 | Self-existing | 0 | 4 |
| 5 | Overtone | 1 | 0 |
| 6 | Rhythmic | 1 | 1 |
| 7 | Resonant | 1 | 2 |
| 8 | Galactic | 1 | 3 |
| 9 | Solar | 1 | 4 |
| 10 | Planetary | 2 | 0 |
| 11 | Spectral | 2 | 1 |
| 12 | Crystal | 2 | 2 |
| 13 | Cosmic | 2 | 3 |

The formula is:
```typescript
const bars = Math.floor((tone - 1) / 5);
const dots = ((tone - 1) % 5) + 1;
```

**WAIT — this formula gives Tone 5 = 0 bars + 5 dots, which is WRONG.** Tone 5 should be 1 bar + 0 dots.

The correct formula for Dreamspell dot-and-bar notation:
```typescript
function getDotBar(tone: number): { bars: number; dots: number } {
  if (tone % 5 === 0) {
    return { bars: tone / 5, dots: 0 };
  }
  return { bars: Math.floor(tone / 5), dots: tone % 5 };
}
```

**Verify:** getDotBar(5) = { bars: 1, dots: 0 }. getDotBar(10) = { bars: 2, dots: 0 }. getDotBar(11) = { bars: 2, dots: 1 }. getDotBar(13) = { bars: 2, dots: 3 }.

Replace whatever formula is currently used with this corrected version.

---

## Updated drawRadialDotBar Function (complete replacement)

```typescript
function getDotBar(tone: number): { bars: number; dots: number } {
  if (tone % 5 === 0) {
    return { bars: tone / 5, dots: 0 };
  }
  return { bars: Math.floor(tone / 5), dots: tone % 5 };
}

function drawRadialDotBar(
  ctx: CanvasRenderingContext2D,
  tone: number,
  active: boolean,
  scale: number,
  isDark: boolean
) {
  const s = scale;
  const { bars, dots } = getDotBar(tone);
  const dotR = 2.5 * s;
  const barW = 12 * s;
  const barH = 2.5 * s;
  const gap = 5 * s;

  // Calculate total height of the symbol
  const barTotalH = bars > 0 ? bars * barH + (bars - 1) * gap : 0;
  const dotTotalH = dots > 0 ? dots * dotR * 2 + (dots - 1) * gap : 0;
  const gapBetween = (bars > 0 && dots > 0) ? gap : 0;
  const totalH = barTotalH + gapBetween + dotTotalH;

  // Start from top (outer edge after rotation)
  let sy = -totalH / 2;

  const col = active
    ? '#c084fc'
    : isDark
      ? 'rgba(255,255,255,0.45)'
      : 'rgba(0,0,0,0.3)';

  ctx.fillStyle = col;

  // Draw bars first (at the top = outer edge after rotation)
  for (let b = 0; b < bars; b++) {
    ctx.fillRect(-barW / 2, sy, barW, barH);
    sy += barH + gap;
  }

  // Then draw dots (at the bottom = inner edge after rotation)
  if (bars > 0 && dots > 0) {
    sy = -totalH / 2 + barTotalH + gapBetween;
  }
  for (let d = 0; d < dots; d++) {
    ctx.beginPath();
    ctx.arc(0, sy + dotR, dotR, 0, Math.PI * 2);
    ctx.fill();
    sy += dotR * 2 + gap;
  }
}
```

And the call site — note the rotation direction change:

```typescript
const toneTeethR = (innerOuterR + innerInnerR) / 2;

for (let i = 0; i < 13; i++) {
  const a = innerAngle + i * tStep - Math.PI / 2;
  const isActive = i === toneIndex;
  const tx = cx + toneTeethR * Math.cos(a);
  const ty = cy + toneTeethR * Math.sin(a);

  ctx.save();
  ctx.translate(tx, ty);
  ctx.rotate(a - Math.PI / 2);  // MINUS not PLUS — bars face outward
  ctx.globalAlpha = isActive ? 1 : 0.5;
  drawRadialDotBar(ctx, i + 1, isActive, isActive ? 1.4 : 0.9, isDark);
  ctx.globalAlpha = 1;
  ctx.restore();
}
```

---

## Summary of Changes (GearWheel.tsx ONLY)

1. Fix rotation from `a + Math.PI / 2` to `a - Math.PI / 2` when drawing tone symbols
2. Replace the bars/dots formula with the corrected `getDotBar()` function
3. Reduce inactive tooth fill alpha from 0.12 to 0.04
4. Reduce active tooth fill alpha from 0.85 to 0.2
5. Remove active tooth stroke
6. Replace entire drawRadialDotBar with the corrected version above

## DO NOT

- Do NOT modify the moon centre
- Do NOT modify the Learn tab
- Do NOT modify the outer gear (seal icons) — they look fine
- Do NOT modify the button styling — it's been fixed
- Do NOT change anything outside GearWheel.tsx

## Quality Checks

- [ ] Tone 11 (Spectral) at twelve o'clock: 2 bars at TOP, 1 dot at BOTTOM
- [ ] Tone 5 (Overtone): 1 bar only, no dots
- [ ] Tone 10 (Planetary): 2 bars only, no dots  
- [ ] Tone 1 (Magnetic): 1 dot only, no bars
- [ ] Tone symbols are clearly distinct from gear tooth backgrounds (not muddy/merged)
- [ ] Inactive gear teeth are barely visible (alpha 0.04)
- [ ] Active gear tooth has subtle background (alpha 0.2) without stroke
- [ ] Overall inner gear looks clean, not "dirty purple"
- [ ] `git push origin master:main` succeeds
