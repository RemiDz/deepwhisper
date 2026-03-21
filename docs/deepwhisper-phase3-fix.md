# DeepWhisper Phase 3 FIX — Gear Wheel Rendering & Styling Restoration

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: gigathink

## What Went Wrong

The Phase 3 build broke several things:

1. **Inner gear tone symbols are wrong** — they render as purple blobs instead of proper dot-and-bar Dreamspell tone glyphs. Each tone MUST show bars (horizontal lines) and dots (circles) stacked vertically, rotated radially to follow the gear tooth angle.
2. **Prev/Next/Today buttons lost their styling** — they're now generic unstyled arrows. Restore the previous styled buttons exactly as they were before Phase 3.
3. **Gear proportions may be off** — the outer seal icons look cramped and the inner gear band is too thin.

## CRITICAL RULES

- **DO NOT modify the moon centre component at all** — leave MoonPhase, zodiac sign, and phase info text exactly as they are
- **DO NOT change any page layout or component structure outside of GearWheel.tsx and the navigation buttons**
- **Restore the Prev/Today/Next button styling** to match exactly what existed before Phase 3
- The fix is ONLY about: (a) fixing the gear canvas rendering, (b) restoring button styles

---

## Fix 1: Exact Gear Rendering Logic

Replace the entire canvas drawing logic in `GearWheel.tsx` with the following reference implementation. This is the EXACT code that produces the correct visual result — do not simplify, optimise, or reinterpret it.

### Constants and Proportions

```typescript
// All proportions relative to u = Math.min(containerWidth, containerHeight)
const u = Math.min(W, H);
const iconSz = u * 0.085;          // seal icon tile size
const outerR = u * 0.37;           // radius to centre of seal icons
const gapB = u * 0.018;            // gap between outer and inner gear
const innerOuterR = outerR - iconSz / 2 - gapB;  // inner gear outer edge
const innerInnerR = innerOuterR - u * 0.12;       // inner gear inner edge
const sStep = Math.PI * 2 / 20;    // angle step for 20 seals
const tStep = Math.PI * 2 / 13;    // angle step for 13 tones
```

### Drawing the Outer Gear (20 Seal Icons)

Each seal is a rounded-square tile with the seal's PNG image, rotated to face outward from centre:

```typescript
for (let i = 0; i < 20; i++) {
  const a = outerAngle + i * sStep - Math.PI / 2;
  const isActive = i === sealIndex;
  const ix = cx + outerR * Math.cos(a);
  const iy = cy + outerR * Math.sin(a);
  const sz = isActive ? iconSz * 1.12 : iconSz;

  ctx.save();
  ctx.translate(ix, iy);
  ctx.rotate(a + Math.PI / 2);

  // Draw rounded rectangle
  const rd = sz * 0.18;
  ctx.beginPath();
  ctx.moveTo(-sz/2 + rd, -sz/2);
  ctx.lineTo(sz/2 - rd, -sz/2);
  ctx.quadraticCurveTo(sz/2, -sz/2, sz/2, -sz/2 + rd);
  ctx.lineTo(sz/2, sz/2 - rd);
  ctx.quadraticCurveTo(sz/2, sz/2, sz/2 - rd, sz/2);
  ctx.lineTo(-sz/2 + rd, sz/2);
  ctx.quadraticCurveTo(-sz/2, sz/2, -sz/2, sz/2 - rd);
  ctx.lineTo(-sz/2, -sz/2 + rd);
  ctx.quadraticCurveTo(-sz/2, -sz/2, -sz/2 + rd, -sz/2);
  ctx.closePath();

  // Clip and draw seal image
  ctx.save();
  ctx.clip();
  // Draw the seal image from /public/icons/{i+1}_{sealName}.png
  // Image should fill the entire rounded rect
  if (sealImages[i] && sealImages[i].complete) {
    ctx.globalAlpha = isActive ? 1 : 0.3;
    ctx.drawImage(sealImages[i], -sz/2, -sz/2, sz, sz);
  }
  ctx.restore();

  // Active seal border highlight
  if (isActive) {
    ctx.strokeStyle = isDark ? '#fff' : '#111';
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 1;
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}
```

### Drawing the Inner Gear Teeth (13 Tone Positions)

The inner gear has 13 teeth pointing outward. Each tooth is a trapezoidal shape:

```typescript
const toneTeethR = (innerOuterR + innerInnerR) / 2;
const toothOutR = innerOuterR;
const toothInR = innerInnerR;
const ta2 = tStep * 0.4; // tooth arc width

for (let i = 0; i < 13; i++) {
  const a = innerAngle + i * tStep - Math.PI / 2;
  const isActive = i === toneIndex;
  const g1 = a - tStep / 2;
  const g2 = a + tStep / 2;
  const b1 = a - ta2 / 2;
  const b2 = a + ta2 / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, toothInR, g1, b1);
  ctx.lineTo(cx + toothOutR * Math.cos(b1), cy + toothOutR * Math.sin(b1));
  ctx.arc(cx, cy, toothOutR, b1, b2);
  ctx.lineTo(cx + toothInR * Math.cos(b2), cy + toothInR * Math.sin(b2));
  ctx.arc(cx, cy, toothInR, b2, g2);
  ctx.closePath();

  ctx.fillStyle = '#c084fc';
  ctx.globalAlpha = isActive ? 0.85 : 0.12;
  ctx.fill();
  if (isActive) {
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 1;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
```

### Drawing the Tone Dot-and-Bar Symbols (CRITICAL FIX)

THIS IS THE PART THAT WAS BROKEN. Each tone symbol MUST be drawn as dots and bars, rotated radially to follow its gear tooth position. The drawing happens in local coordinates (translated and rotated to the tooth position), with bars as horizontal rectangles and dots as circles, stacked vertically (bars on top, dots below).

```typescript
function drawRadialDotBar(
  ctx: CanvasRenderingContext2D,
  tone: number,     // 1-13
  active: boolean,
  scale: number,    // e.g. 1.4 for active, 0.9 for inactive
  isDark: boolean
) {
  const s = scale;
  const bars = Math.floor((tone - 1) / 5);
  const dots = ((tone - 1) % 5) + 1;
  const dotR = 2.5 * s;
  const barW = 12 * s;
  const barH = 2.5 * s;
  const gap = 5 * s;
  const totalH = bars * (barH + gap) + dots * (dotR * 2 + gap) - gap;
  let sy = -totalH / 2;

  const col = active
    ? '#c084fc'
    : isDark
      ? 'rgba(255,255,255,0.4)'
      : 'rgba(0,0,0,0.25)';

  ctx.fillStyle = col;

  // Draw bars first (on top)
  for (let b = 0; b < bars; b++) {
    ctx.fillRect(-barW / 2, sy, barW, barH);
    sy += barH + gap;
  }

  // Then draw dots below
  for (let d = 0; d < dots; d++) {
    ctx.beginPath();
    ctx.arc(0, sy + dotR, dotR, 0, Math.PI * 2);
    ctx.fill();
    sy += dotR * 2 + gap;
  }
}

// Call it for each tone position:
for (let i = 0; i < 13; i++) {
  const a = innerAngle + i * tStep - Math.PI / 2;
  const isActive = i === toneIndex;
  const tx = cx + toneTeethR * Math.cos(a);
  const ty = cy + toneTeethR * Math.sin(a);

  ctx.save();
  ctx.translate(tx, ty);
  ctx.rotate(a + Math.PI / 2);  // rotate to follow gear tooth radially
  ctx.globalAlpha = isActive ? 1 : 0.5;
  drawRadialDotBar(ctx, i + 1, isActive, isActive ? 1.4 : 0.9, isDark);
  ctx.globalAlpha = 1;
  ctx.restore();
}
```

**Tone symbol examples for verification:**
- Tone 1 (Magnetic): 1 dot only
- Tone 5 (Overtone): 1 bar only (no dots)
- Tone 6 (Rhythmic): 1 bar on top, 1 dot below
- Tone 10 (Planetary): 2 bars only (no dots)
- Tone 13 (Cosmic): 2 bars on top, 3 dots below

### Drawing the Mesh Zone Highlight

```typescript
const meshAngle = -Math.PI / 2; // twelve o'clock
const activeCol = SEAL_COLORS[sealIndex] === '#e0ddd6' ? '#c084fc' : SEAL_COLORS[sealIndex];

ctx.save();
ctx.beginPath();
ctx.arc(cx, cy, outerR + iconSz / 2 + 4, meshAngle - 0.12, meshAngle + 0.12);
ctx.arc(cx, cy, innerInnerR - 4, meshAngle + 0.12, meshAngle - 0.12, true);
ctx.closePath();
ctx.fillStyle = activeCol;
ctx.globalAlpha = 0.15;
ctx.fill();
ctx.globalAlpha = 1;
ctx.restore();

// Pointer triangle
const pY = cy - outerR - iconSz / 2 - 6;
ctx.beginPath();
ctx.moveTo(cx, pY);
ctx.lineTo(cx - 5, pY - 10);
ctx.lineTo(cx + 5, pY - 10);
ctx.closePath();
ctx.fillStyle = activeCol;
ctx.globalAlpha = 0.7;
ctx.fill();
ctx.globalAlpha = 1;
```

### Drawing the Centre Hub

```typescript
// Leave the centre empty for the moon component to show through
// Just draw a subtle circle at innerInnerR as the boundary
ctx.beginPath();
ctx.arc(cx, cy, innerInnerR - 2, 0, Math.PI * 2);
ctx.fillStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
ctx.fill();
```

### Rotation Animation

```typescript
// In the animation frame:
const ease = 0.1;
let dOuter = targetOuterAngle - outerAngle;
let dInner = targetInnerAngle - innerAngle;

// Shortest path wrapping
while (dOuter > Math.PI) dOuter -= Math.PI * 2;
while (dOuter < -Math.PI) dOuter += Math.PI * 2;
while (dInner > Math.PI) dInner -= Math.PI * 2;
while (dInner < -Math.PI) dInner += Math.PI * 2;

outerAngle += dOuter * ease;
innerAngle += dInner * ease;
```

### Seal Image Preloading

Preload all 20 seal images on component mount:

```typescript
const sealFiles = [
  '1_dragon', '2_wind', '3_night', '4_seed', '5_serpent',
  '6_worldbridger', '7_hand', '8_star', '9_moon', '10_dog',
  '11_monkey', '12_human', '13_skywalker', '14_wizard', '15_eagle',
  '16_warrior', '17_earth', '18_mirror', '19_storm', '20_sun'
];

// In useEffect:
const images: HTMLImageElement[] = [];
sealFiles.forEach((name, i) => {
  const img = new Image();
  img.src = `/icons/${name}.png`;
  images.push(img);
});
// Store in ref, trigger redraw when all loaded
```

---

## Fix 2: Restore Prev/Today/Next Button Styling

The navigation buttons below the wheel lost their styling. Look at the git history for the previous button implementation and restore it exactly. The buttons should match the app's deep space dark aesthetic with the styled appearance they had before Phase 3 — not generic HTML buttons or unstyled arrow icons.

If the previous styling cannot be found in git history, use this specification:
- Prev and Next: circular buttons with a subtle border, containing left/right chevron icons
- Today: pill-shaped button with text "Today"
- All buttons should use the app's existing design system (glass morphism, dark backgrounds, subtle borders)
- Spacing: buttons centred horizontally below the wheel with appropriate gap

---

## Fix 3: Ring Guide Lines

Draw two subtle guide circles to define the gear bands:

```typescript
ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
ctx.lineWidth = 0.5;
ctx.beginPath(); ctx.arc(cx, cy, innerOuterR, 0, Math.PI * 2); ctx.stroke();
ctx.beginPath(); ctx.arc(cx, cy, innerInnerR, 0, Math.PI * 2); ctx.stroke();
```

---

## DO NOT

- Do NOT modify MoonPhase component or any centre element
- Do NOT change the Learn tab (it's fine)
- Do NOT restructure page.tsx layout beyond fixing the buttons
- Do NOT simplify the dot-and-bar drawing function — use it exactly as provided
- Do NOT change seal image paths (they are at `/public/icons/`)

## Quality Checks

- [ ] Each of the 13 inner gear teeth shows a distinct dot-and-bar pattern (not blobs)
- [ ] Tone 1 = 1 dot, Tone 5 = 1 bar, Tone 13 = 2 bars + 3 dots
- [ ] Tone symbols are rotated radially (following the gear tooth angle)
- [ ] Active tone is bright purple, inactive tones are dimmed but symbols visible
- [ ] Outer seal icons use actual PNG images from /public/icons/
- [ ] Active seal has border highlight, inactive seals dimmed to 30%
- [ ] Mesh zone highlight visible at twelve o'clock
- [ ] Pointer triangle at twelve o'clock
- [ ] Prev/Today/Next buttons are styled (not generic/unstyled)
- [ ] Moon centre is unchanged from before
- [ ] Drag-to-spin works on touch
- [ ] Gear rotation animates smoothly
- [ ] `git push origin master:main` succeeds
