# DeepWhisper — Compass Interactivity, 3D Depth, Moon Centre & Moon Info (ultrathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

---

## Context

The Galactic Compass on the Today view has 4 issues that need fixing in this prompt. The app has a rich content library in `src/lib/galactic-content.ts` containing:
- 20 full seal descriptions (paragraphs of text per seal)
- 13 full tone descriptions
- 260 daily declarations (BE-DO-HAVE structure)
- Helper functions: `getDeclaration()`, `getSealDescription()`, `getToneDescription()`

The Dreamspell engine in `src/lib/dreamspell/` has full Kin data: seal, tone, colour, oracle (guide, analog, antipode, occult), wavespell, castle, GAP status, and 13 Moon date conversion.

The astronomy engine provides: moon phase name, illumination percentage, and moon zodiac sign.

---

## Issue 1: Seal icons on the wheel must respond to tap

**Current behaviour:** Tapping any of the 20 seal icons on the outer ring does nothing.

**Required behaviour:** Tapping any seal icon opens a bottom sheet / modal overlay with detailed information about that seal's Kin for today's date context.

### What the bottom sheet must show when a seal is tapped:

```
┌─────────────────────────────────────┐
│  [Seal PNG icon 48px]               │
│  [Seal name in seal colour]         │
│  e.g. "Red Dragon"                  │
│                                     │
│  SEAL ESSENCE                       │
│  [Full seal description from        │
│   galactic-content.ts —             │
│   getSealDescription(sealIndex)]    │
│                                     │
│  ATTRIBUTES                         │
│  Colour: Red                        │
│  Direction: East                    │
│  Element: Fire                      │
│  Action: [seal action]              │
│  Power: [seal power]                │
│  Essence: [seal essence]            │
│                                     │
│  ORACLE FAMILY                      │
│  Analog: [seal name + icon 24px]    │
│  Antipode: [seal name + icon 24px]  │
│  Occult: [seal name + icon 24px]    │
│  Guide: varies by tone              │
│                                     │
└─────────────────────────────────────┘
```

### Implementation:

1. Find the seal ring component (likely `SealRing.tsx` or within `GalacticCompass.tsx`) where the 20 seal icons are rendered
2. Each seal icon element MUST have a click/tap handler. If they are SVG `<image>` or `<g>` elements, add an `onClick` handler and `cursor: pointer` / `style={{ cursor: 'pointer' }}`
3. For SVG elements, also add `pointerEvents="all"` to ensure taps register on the image
4. The tap handler should call a function like `onSealTap(sealIndex: number)` that's passed up to the page component
5. The page component opens a bottom sheet (reuse the existing bottom sheet component if one exists, or create a simple slide-up overlay)
6. The bottom sheet content is populated using:
   - Seal data from `src/lib/dreamspell/seals.ts` (name, colour, action, power, essence, icon path)
   - Seal description from `getSealDescription(sealIndex)` in `galactic-content.ts`
   - Oracle relationships calculated for that seal
7. The bottom sheet must have:
   - A drag handle at the top (small grey bar)
   - Ability to close by tapping outside or swiping down
   - Dark background matching the app theme (`bg-[#0a0a1a]` or similar with `bg-opacity-95`)
   - Scrollable content if the description is long
   - Smooth slide-up animation (CSS transition: `transform 0.3s ease-out`)

### Also restore tap on the moon centre:

Tapping the moon centre (the main Kin area) should open a similar bottom sheet but showing TODAY'S FULL KIN information:
- Today's Kin number, seal, tone, colour
- Full declaration (BE-DO-HAVE)
- Full seal description
- Full tone description
- Oracle grid (guide, analog, antipode, occult — each with icon + name)
- Wavespell position
- Castle position
- GAP day status (if applicable)

---

## Issue 2: Compass needs 3D depth effect

**Current behaviour:** The compass looks flat — a simple 2D circle of icons on a dark background.

**Required behaviour:** The compass should have visual depth — as if you're looking into a cosmic portal or instrument with layers at different depths.

### How to achieve this WITHOUT WebGL or R3F:

Apply these CSS/SVG effects to create a layered 3D illusion:

#### 2a. Background glow behind the compass
Add a radial gradient glow behind the entire compass area:
```css
.compass-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110%;
  height: 110%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(192, 132, 252, 0.06) 0%,    /* faint purple core */
    rgba(30, 30, 60, 0.08) 40%,       /* dark blue mid */
    transparent 70%                     /* fade to nothing */
  );
  pointer-events: none;
  z-index: 0;
}
```

#### 2b. Concentric ring borders
Add faint concentric circles to give depth (like looking into a tunnel):
- Ring 1 (outermost, behind seal ring): `border: 1px solid rgba(255,255,255,0.04)`, circle at seal ring radius + 8px
- Ring 2 (between seal and tone ring): `border: 1px solid rgba(255,255,255,0.03)`, circle at midpoint between rings
- Ring 3 (inside tone ring): `border: 1px solid rgba(255,255,255,0.02)`, circle at tone ring radius - 8px

These are SVG `<circle>` elements with `fill="none"` and very faint white strokes. They create the illusion of a receding tunnel.

#### 2c. Shadow under seal icons
Each seal icon square gets a subtle drop shadow to make them "float":
```css
filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
```
Today's active seal gets a stronger coloured glow:
```css
filter: drop-shadow(0 0 8px rgba(sealColour, 0.5)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
```

#### 2d. Moon centre depth
The moon centre should have a pronounced circular shadow/glow creating the illusion that it's recessed (sitting deeper than the rings):
```css
.moon-centre {
  box-shadow: 
    inset 0 0 15px rgba(0, 0, 0, 0.5),     /* inner shadow for depth */
    0 0 20px rgba(192, 132, 252, 0.1),       /* outer purple glow */
    0 0 40px rgba(30, 30, 80, 0.15);          /* wider ambient glow */
}
```

#### 2e. Vignette on compass edges
A subtle dark vignette around the compass edges makes the centre feel brighter and draws the eye inward:
```css
.compass-container::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    transparent 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  pointer-events: none;
  z-index: 10;
}
```

---

## Issue 3: Moon centre seal icon is blurry/invisible

**Current behaviour:** The seal icon overlaid on the moon centre is barely visible — it appears as a vague white blurry shape.

**Required fix:**

1. Find the seal icon rendered in the moon centre (likely in `GalacticCompass.tsx`)
2. The icon should be the ACTUAL seal PNG (`/icons/{n}_{name}.png`), not a blurred version
3. Set these properties:
   - Size: 36-40px (large enough to be recognisable)
   - Opacity: 0.6 (NOT 0.1 or 0.2 — it must be clearly visible as a seal glyph)
   - `mix-blend-mode: screen` (this makes it glow on the moon surface)
   - NO blur filter (`filter: blur(...)` must be removed if present)
   - Position: centred exactly on the moon
4. The seal icon should be clearly identifiable — a user should be able to tell which of the 20 seals it is

---

## Issue 4: Moon information display

**Current behaviour:** The moon in the centre shows nothing around it — no phase name, no zodiac sign, no illumination.

**Required behaviour:** Show key moon information in a subtle arc or positioned around the moon, similar to Lunata's approach.

### Layout:

```
         [Moon zodiac sign]
              ↓
    ┌─────────────────┐
    │                  │
    │    🌒 MOON       │
    │   with seal      │
    │   glyph inside   │
    │                  │
    └─────────────────┘
       ↓           ↓
  [Phase name]  [Illum %]
```

Specifically:
- **Moon zodiac sign** — positioned ABOVE the moon, centred. Small text (`text-xs`), colour `#a78bfa` (light purple). Example: "♈ Aries" or just "Aries"
- **Moon phase name** — positioned BELOW the moon, left of centre. Small text (`text-xs`), colour `#9ca3af` (grey). Example: "Waxing Crescent"
- **Illumination %** — positioned BELOW the moon, right of centre. Small text (`text-xs`), colour `#9ca3af`. Example: "4%"

These text elements should be:
- SVG `<text>` elements positioned within the compass SVG (so they move with the compass and don't conflict with HTML layout)
- `font-size: 9px` or `10px` — small enough not to clash with the tone ring
- `text-anchor: middle` for centred text
- `pointer-events: none` so they don't interfere with tap targets

**Positioning (relative to moon centre cx, cy):**
- Zodiac sign: `(cx, cy - moonRadius - 10)` — 10px above the moon edge
- Phase name: `(cx - 20, cy + moonRadius + 12)` — below moon, slightly left
- Illumination: `(cx + 20, cy + moonRadius + 12)` — below moon, slightly right

If the space between the moon and tone ring is too tight, reduce the values or put phase + illumination on the same line below:
- `(cx, cy + moonRadius + 12)` — centred: "Waxing Crescent · 4%"

---

## What NOT to change

- Seal ring positions and seal PNG icons — do not move or resize
- Tone ring (dots and bars) — do not touch (being fixed in a separate prompt)
- Declaration card — do not touch
- Kin info strip below compass — do not touch
- Progress bars — do not touch
- Other views (My Kin, 13 Moons, Wavespell) — do not touch
- Dreamspell calculation engine — do not touch
- Galactic content data — do not touch (only READ from it)
- Test files — do not touch

---

## After all changes

Run `npm run dev` first and visually check:
1. Tap a seal icon — does the bottom sheet appear with seal info?
2. Tap the moon centre — does the full Kin info sheet appear?
3. Does the compass have visible depth (glow, shadows, rings)?
4. Is the seal icon in the moon centre clearly visible (not blurry)?
5. Can you see the moon zodiac sign, phase name, and illumination around the moon?

Only after visual confirmation:
```bash
npm run build
npm run test
```

Both must pass with zero errors.

## Verification checklist

- [ ] Tapping any seal icon opens a bottom sheet with seal name, description, attributes, and oracle family
- [ ] Tapping moon centre opens a bottom sheet with full Kin info (declaration, descriptions, oracle grid)
- [ ] Bottom sheets slide up smoothly and can be closed by tapping outside
- [ ] Compass has visible depth: radial glow, concentric ring lines, drop shadows on seals
- [ ] Moon centre has inset shadow creating recessed depth illusion
- [ ] Seal icon on moon centre is clearly visible (opacity 0.6, no blur, actual PNG)
- [ ] Moon zodiac sign visible above the moon (e.g., "Aries")
- [ ] Moon phase name and illumination visible below the moon (e.g., "Waxing Crescent · 4%")
- [ ] All text around moon is small, subtle, and doesn't overlap the tone ring
- [ ] `npm run build` — zero errors
- [ ] `npm run test` — all pass
- [ ] No console errors
