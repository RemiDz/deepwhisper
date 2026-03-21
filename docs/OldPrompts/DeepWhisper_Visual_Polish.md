# DeepWhisper — Full Visual Polish Pass (gigathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

---

## Context

The app is functionally complete (Phase 1) with authentic Dreamspell PNG seal icons. However, the visual execution does not yet match the design standard required. This prompt is a comprehensive visual polish pass covering bugs, layout, aesthetics, and interactions across all four views.

**Quality benchmark:** The finished result must feel like a premium native app — comparable to lunata.app and astrara.app in polish. Every pixel matters. Test everything on a 375px mobile viewport.

**Design language:** Deep space dark (#080812 background), subtle star particles, vibrant seal colours (red #ef4444, white #e8e6df, blue #3b82f6, yellow #eab308), purple (#c084fc) for tones and UI accents. Glass-morphism cards where appropriate. No visible scrollbars anywhere.

---

## CRITICAL BUG FIXES (do these first)

### 1. Fix the moving/bouncing seal icon animation

The Dragon seal icon (position 0, top of compass) and the centre moon seal overlay are animating incorrectly — they shift left and back in a loop. This is likely a CSS animation or SVG transform that was applied to the old SVG `<path>` elements and is now incorrectly affecting `<image>` or `<img>` elements. Find and fix:

- Remove or correct any CSS `@keyframes` animation applied to seal icons on the compass ring
- The centre moon seal overlay should have a subtle opacity pulse (breathing effect) ONLY — no position/transform animation
- Seal icons on the outer ring should be completely static (no animation at all)
- Only the "active today" seal should have a pulsing BORDER or GLOW — the icon itself does not move

### 2. Fix any other animation artifacts

Check all views for similar animation bugs where old SVG-targeted animations are now incorrectly affecting PNG images.

---

## TODAY VIEW — Galactic Compass

The compass is the hero element and currently does not match the design intent. Apply ALL of the following:

### Compass layout and proportions

- The compass must be centred horizontally on the page
- Size: approximately 300-320px diameter on a 375px viewport, leaving breathing room on sides
- The compass should NOT touch or overflow the edges of the screen
- All 20 seal icons must be evenly spaced around the outer ring with consistent distance from centre
- No seal icon should overlap another or extend beyond the compass boundary

### Ring structure (inside → out)

1. **Centre: Realistic moon phase** — This is the most important visual element
   - Render a realistic shaded moon, not just a circle with a dividing line
   - The lit portion should have a warm off-white colour (#dedad0 to #e8e4d8)
   - The shadow portion should be very dark (#14142a)
   - Add subtle crater texture: 5-8 small circles at very low opacity (0.03-0.05) randomly placed within the moon radius
   - Add a subtle highlight on the lit side (ellipse at 0.1 opacity)
   - Add a thin rim stroke around the moon (rgba(200,196,184,0.1), 0.7px)
   - The moon should be approximately 70-80px diameter
   - Today's seal icon overlaid on the moon at opacity 0.4-0.5 with `mix-blend-mode: screen` and a gentle opacity pulse animation (NOT a position animation)

2. **Inner ring: 13 galactic tones** — Using bar-and-dot Mayan notation
   - Dots for 1-4 (small circles, 2px radius)
   - Bar for 5 (horizontal line, 10px wide)
   - Combinations for 6-13 (e.g., 6 = one bar + one dot, 13 = two bars + three dots)
   - Today's tone: full purple opacity (0.8) with a subtle circular glow behind it
   - Other tones: dim purple (0.12-0.15 opacity)
   - Positioned on a ring approximately 95-105px radius from centre

3. **Outer ring: 20 solar seal PNG icons**
   - Each icon sits in a coloured background square (using the seal's bgHex colour)
   - Square size: 28-30px with border-radius: 6px
   - Square has a subtle border in the seal's colour (0.5px, low opacity)
   - Today's active seal: full opacity, thicker border (1.5px), pulsing glow border animation
   - Oracle-connected seals (guide, analog, antipode, occult): medium opacity (0.6-0.7), slightly thicker border (0.8px)
   - Inactive seals: low opacity (0.3-0.35)
   - Positioned on a ring approximately 125-135px radius from centre
   - Icons must NOT move or animate — only the border/glow pulses

4. **Oracle connection lines**
   - Four lines from the centre moon edge to the four oracle seal positions
   - Guide line: yellow/gold (#eab308), solid, 0.8px
   - Analog line: white (#e8e6df), solid, 0.7px
   - Antipode line: blue (#3b82f6), solid, 0.7px
   - Occult line: purple (#a855f7), solid, 0.7px
   - All lines at opacity 0.2-0.25
   - Small midpoint dot on each line (2px circle, same colour, 0.3 opacity)
   - Lines should go FROM the moon edge TO the seal square edge — not through other elements

5. **Structural ring circles**
   - Thin concentric circles at very low opacity (0.03-0.05) to define the ring boundaries
   - These are decorative guide lines, barely visible

### Kin info strip (below compass)

- Kin number: large (34px), bold, white (#e8e6df)
- Positioned next to (not below) the seal name
- Layout: `[Kin number]  [Seal name + tone]` in a horizontal row, centred
- Seal name in its colour (e.g., "Red Planetary Dragon" in #ef4444)
- Tone description: smaller text (11px), secondary colour (#88867e)
- Below that: three pill tags in a row — Moon sign (blue text), phase name, illumination %
- Pill styling: background rgba(255,255,255,0.03), border 0.5px rgba(255,255,255,0.06), border-radius 10px, font-size 10px, padding 3px 10px

### Micro dashboard

Three compact horizontal progress indicators:

**Wavespell bar:**
- Label "Wavespell" on the left (tiny, secondary colour)
- 13 small segments in a row (filled purple for past, glowing for today, dim for future)
- Wavespell name and "day X of 13" below

**Castle bar:**
- Label "Castle" on the left
- 5 colour blocks (red, white, blue, yellow, green) — active one at full opacity, others at 0.15
- Castle name and meaning below

**Spin bar:**
- Label "Spin" on the left
- Gradient progress bar (purple to blue) showing day X of 260
- "Day X of 260 — XX%" below

All three should be compact — each taking about 40-50px height maximum.

### Milestone card

- Only appears when a milestone is approaching (within 3 days)
- Warm golden border (0.5px, rgba(234,179,8,0.2))
- Background: rgba(234,179,8,0.03)
- "MILESTONE" label in yellow (#eab308), tiny caps
- Description text in secondary colour
- Compact — no taller than 50px

### Single-screen requirement

**CRITICAL:** The entire Today view (compass + kin strip + micro dashboard + milestone) MUST fit within one mobile screen (375×660px usable area between header and tab bar). No scrolling required. If content doesn't fit, reduce spacing and sizing proportionally. Test this at 375px width.

---

## TODAY VIEW — Interactions

### Tap compass centre (moon area)
- Opens a bottom sheet sliding up from above the tab bar
- Shows: Full Kin title, Kin affirmation text, the four oracle Kin as tappable cards
- Bottom sheet has: drag handle (36px wide, 4px tall, rounded), backdrop blur, rounded top corners (16px)
- "Tap to close" text at bottom, or tap outside to dismiss

### Tap any seal icon on compass
- Opens bottom sheet showing that seal's info: name, colour, direction, power, action, essence
- Shows the seal icon large (48px)

### Tap oracle card in bottom sheet
- Could navigate or show deeper info — for now just show the seal detail

---

## MY KIN VIEW

### Input state
- Clean centred layout
- "Discover your Kin" heading (16px, white)
- Subtext explaining what this does (12px, secondary)
- Day / Month / Year input fields in a horizontal row
- Day: number input (width 60px)
- Month: dropdown select (width 100px)
- Year: number input (width 76px)
- All inputs: dark background (rgba(255,255,255,0.04)), subtle border, white text, rounded (10px)
- "Reveal my Kin" button: purple accent (rgba(192,132,252,0.15) bg, purple text, rounded 24px, large padding)

### Signature card (result state)
- This card must be SCREENSHOT WORTHY — it's the viral element
- Card background: subtle gradient using the seal's colour family
- Large seal icon at top: 72px on its coloured background square
- Kin number: huge (48-56px), white
- "Galactic signature" tiny label above the number
- Full title: "Blue Cosmic Night" in the seal's colour, 20px
- Tone description with keywords, secondary text
- Three pill tags: direction, Earth family, castle
- Oracle cross layout: Guide (top), Destiny (centre), Analog (right), Antipode (left), Occult (bottom)
- Each oracle position shows the seal icon (24-32px) with name and role label
- "deepwhisper.app" watermark at bottom (very dim)
- "Share my Kin" button (purple) + "Galactic Blueprint" button (golden)
- "Calculate another" link below

---

## 13 MOONS VIEW

### Moon navigator header
- Left/right arrow buttons (36px square, subtle background, rounded 10px)
- Centre: Moon name large (16px, white, bold), question below (12px, secondary), Gregorian date range (10px, dim)
- Moon-tone progress bar below: 13 small segments showing all moons, tappable to jump to any moon

### Heptad day headers
- D, S, G, K, A, L, S (Dali, Seli, Gamma, Kali, Alpha, Limi, Silio)
- Very dim text (9px, tertiary colour)

### 28-day grid
- Perfect 4×7 rectangle filling available width
- Each cell shows: day number (12px, bold for today), seal icon (18-20px), Kin number (8px, in seal colour)
- Cell background: seal's bgHex colour at LOW opacity (0.15-0.25) — this gives each day a subtle colour tint
- Cell border: 0.5px in seal colour at very low opacity (0.06-0.1)
- Cell border-radius: 8px
- Today's cell: purple border (1.5px, 0.6 opacity), brighter background
- Tapping a cell opens bottom sheet with that day's full Kin detail

### Info bar
- Below the grid
- Shows the current moon's tone quality and Gregorian range
- Compact, one line

---

## WAVESPELL VIEW

### Header
- Nav arrows left/right
- Wavespell name (15px, white)
- "Wavespell X of 20 — Power of [keyword]" (11px, secondary)
- Initiating seal icon (32px) with "X seal initiates this cycle" text
- Castle tag pill

### 13-tone vertical timeline
- Scrollable, today auto-centred
- Left column: tone numbers 1-13 as small circles (20px) connected by a vertical line
  - Past: filled purple circles, purple line
  - Today: bright glowing circle, transitional line
  - Future: dim circles, dim line
- Right column: cards for each day
  - Seal icon (32-36px) in coloured background square
  - Full Kin name (13px, bold for today)
  - Tone verb + keywords (10px, secondary)
  - Action keyword as a pill tag
  - Kin number on the right side
  - Today's card: purple accent background (rgba(192,132,252,0.06)), purple border
  - Past cards: slightly dimmed
  - Future cards: more dimmed
- GAP Kin badge: small "GAP" pill in yellow if that Kin is a Galactic Activation Portal

---

## GLOBAL STYLES

### Star field background
- Subtle animated star particles across all views
- 40-60 small dots (1-2px), very low opacity (0.05-0.3)
- Positioned randomly, static (no movement animation — saves performance)
- Applied to the root layout so it's consistent across tab switches

### Tab bar
- Fixed at bottom, 72px height (plus safe-area-inset-bottom)
- Background: rgba(8,8,18,0.95) with backdrop-filter: blur(12px)
- Top border: 0.5px rgba(255,255,255,0.06)
- Four tabs with SVG icons (22px) and labels (9px)
- Active tab: purple icon + purple label
- Inactive: dim grey (#48463e)
- Tap feedback: scale(0.95) on :active

### Bottom sheets
- Slide up from above the tab bar
- Background: rgba(14,14,28,0.97) with backdrop blur
- Top border: 0.5px rgba(255,255,255,0.08)
- Rounded top corners: 16px
- Drag handle: 36px wide, 4px tall, rounded, centred
- Dismiss: tap outside or tap "close" text

### Typography
- All text uses the system sans-serif font stack
- Primary text: #e8e6df
- Secondary: #88867e
- Tertiary: #48463e
- Dim: #28281e
- No text should ever be invisible against the dark background

### No scrollbars
```css
* { scrollbar-width: none; -ms-overflow-style: none; }
*::-webkit-scrollbar { display: none; }
```

---

## VERIFICATION

After all changes:

1. `npm run build` — zero errors
2. Check Today view fits in one screen at 375px viewport (no scroll needed)
3. Check no animation bugs (no icons moving/bouncing)
4. Check all 20 seal icons render correctly on compass
5. Check oracle lines connect properly to the correct 4 seals
6. Check 13 Moons grid has coloured cell backgrounds
7. Check Wavespell timeline scrolls with today centred
8. Check My Kin calculator produces a beautiful signature card
9. Check bottom sheets open and close properly on tap
10. Check tab bar navigation works between all 4 views
11. Check no visible scrollbars anywhere
12. Check star background is visible but subtle across all views
