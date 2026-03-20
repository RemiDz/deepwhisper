# DeepWhisper — Compass 3D Depth Effect (megathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

After all changes, run npm run dev and WAIT for me to visually confirm at localhost:3000 before committing or pushing to git.

---

## ONE task: Add visual depth to the Galactic Compass so it feels like a layered cosmic instrument, not a flat 2D circle of icons.

All effects are CSS/SVG only — no WebGL, no R3F, no heavy libraries.

---

## Effect 1: Radial glow behind compass

Add a pseudo-element on the compass container div (the one wrapping the SVG):

```css
position: relative;

&::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 115%;
  height: 115%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(192, 132, 252, 0.07) 0%,
    rgba(30, 30, 60, 0.05) 35%,
    transparent 65%
  );
  pointer-events: none;
  z-index: 0;
}
```

If using Tailwind/inline styles, apply this as a separate absolutely-positioned div behind the SVG. This creates a subtle purple cosmic glow emanating from the centre.

---

## Effect 2: Concentric ring lines

Add 3 faint concentric circles as SVG `<circle>` elements BEHIND the seal icons (low z-order in the SVG). These create the illusion of looking into a layered tunnel:

- **Ring 1** (outermost, just behind seal ring): radius = seal ring radius + 10px, `stroke: rgba(255,255,255,0.05)`, `stroke-width: 1`, `fill: none`
- **Ring 2** (midway between moon and seals): radius = halfway between moon edge and seal ring, `stroke: rgba(255,255,255,0.04)`, `stroke-width: 0.8`, `fill: none`
- **Ring 3** (just outside moon): radius = moon radius + 15px, `stroke: rgba(255,255,255,0.03)`, `stroke-width: 0.6`, `fill: none`

Add these as the FIRST elements in the SVG (before seal icons) so they render behind everything.

---

## Effect 3: Drop shadows on seal icons

Each seal icon square should have a subtle drop shadow to make them float above the background:

For SVG `<image>` elements, add a filter:
```xml
<defs>
  <filter id="seal-shadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.5)" flood-opacity="0.5" />
  </filter>
</defs>
```

Apply `filter="url(#seal-shadow)"` to each seal `<g>` or `<image>` element.

For today's ACTIVE seal, use a stronger coloured glow:
```xml
<filter id="seal-active-shadow" x="-30%" y="-30%" width="160%" height="160%">
  <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="rgba(239,68,68,0.4)" flood-opacity="0.4" />
  <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.4)" flood-opacity="0.4" />
</filter>
```

The active seal's glow colour should match the seal's colour family:
- Red seal → `rgba(239,68,68,0.4)`
- White seal → `rgba(232,230,223,0.3)`
- Blue seal → `rgba(59,130,246,0.4)`
- Yellow seal → `rgba(234,179,8,0.4)`

---

## Effect 4: Subtle vignette on compass edges

Add a dark vignette around the compass edges to draw the eye inward toward the moon centre:

```css
&::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    transparent 45%,
    rgba(0, 0, 0, 0.25) 100%
  );
  pointer-events: none;
  z-index: 3;
}
```

IMPORTANT: The vignette must NOT block tap events on the seal icons. Use `pointer-events: none`.

Also IMPORTANT: The vignette z-index must be BELOW the seal icons if they use HTML elements, or the vignette should be an SVG element rendered before the seals. Test that all seal taps still work after adding the vignette.

---

## Effect 5: Oracle connection lines with depth

The dashed lines connecting the moon centre to the 4 oracle seals (guide, analog, antipode, occult) should have a gradient opacity — brighter near the seal, fading toward the centre:

```xml
<defs>
  <linearGradient id="oracle-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="white" stop-opacity="0.02" />
    <stop offset="100%" stop-color="white" stop-opacity="0.12" />
  </linearGradient>
</defs>

<line
  x1={moonCentreX} y1={moonCentreY}
  x2={sealX} y2={sealY}
  stroke="url(#oracle-line-grad)"
  stroke-width="0.8"
  stroke-dasharray="4 3"
/>
```

If gradient on lines is too complex, just use `stroke: rgba(255,255,255,0.08)` and `stroke-width: 0.6`. Keep them very subtle — they should be barely noticeable, just enough to hint at the oracle connections.

---

## What NOT to change

- Seal ring positions, sizes, icons — do not move
- Moon centre (zodiac symbol, phase rendering) — do not touch
- Tone symbol — do not touch
- Kin info below compass — do not touch
- Declaration card — do not touch
- Bottom sheets — do not touch
- Moon info text — do not touch
- Other views — do not touch
- Engine/tests — do not touch

---

## Checklist

- [ ] Radial purple glow visible behind the compass
- [ ] 3 faint concentric ring lines visible (very subtle, not overpowering)
- [ ] Seal icons have drop shadows (floating effect)
- [ ] Today's active seal has a coloured glow matching its seal colour
- [ ] Subtle dark vignette around compass edges
- [ ] Oracle connection lines visible as faint dashed lines
- [ ] ALL seal taps still work (vignette doesn't block clicks)
- [ ] Moon centre tap still works
- [ ] No visual elements overflow the compass area
- [ ] Looks good on 375px viewport
- [ ] `npm run build` — zero errors
- [ ] `npm run test` — 92/92 pass
