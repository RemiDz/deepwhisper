# DeepWhisper — Visibility, Layout & Moon Fix (gigathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

---

## Overview

Four critical issues need fixing across the entire app:

1. **Everything is too dark** — icons, text, and seal backgrounds are barely visible. The app needs more contrast and vibrancy.
2. **Wasted space everywhere** — the compass is too small relative to the screen, and all views have large empty areas.
3. **The moon doesn't look like a moon** — it looks like a broken circle. It needs to be obviously recognisable as a moon phase.
4. **My Kin and 13 Moons have poor space usage** — too much padding, too small content.

---

## Issue 1: BRIGHTNESS AND CONTRAST (apply across entire app)

The deep space aesthetic does NOT mean everything should be invisible. The background is dark so that the CONTENT pops. Right now the content is also dark, which defeats the purpose.

### Seal icon squares — MUCH brighter
- Active/today seal: background opacity should be 0.85-0.9 (currently feels like 0.3-0.4)
- Oracle-connected seals: 0.65-0.75 opacity
- Inactive seals on compass: 0.4-0.5 opacity (not 0.2-0.3)
- The seal PNG icons themselves should NEVER have opacity applied to the img element — only the background square gets dimmed
- The border on each seal square should be more visible: 1px at opacity 0.3 minimum for inactive, 0.5 for oracle, 0.7 for active

### Text contrast
- Primary text (#e8e6df) is fine but check it's actually being used — some text appears to be using tertiary colour where it should be primary
- Kin numbers should be fully WHITE (#ffffff or #f0eee8), not the muted off-white
- Seal names should be BRIGHT in their colour — not dimmed. Red (#ef4444) should look vivid red, not dark maroon
- The micro dashboard labels (Wavespell, Castle, Spin) need to be readable — at least secondary colour (#a8a6a0), not tertiary

### Progress bars
- The wavespell, castle, and spin bars need more colour saturation
- Purple segments should be visible purple, not barely-there dark blobs
- The active castle block should be vivid (full colour), inactive blocks at 0.25-0.3 (not 0.1)

### Oracle connection lines
- Increase opacity from 0.2 to 0.35-0.4 — they should be clearly visible as connecting lines
- Midpoint dots: increase to 0.5 opacity

### 13 Moons grid cells
- Cell backgrounds need MORE colour — use the seal's bgHex at 0.35-0.45 opacity (not 0.15-0.2)
- Cell borders at 0.2 opacity minimum
- Kin numbers inside cells should be in the seal's bright colour at full opacity
- Day numbers should be white/bright

### Wavespell timeline
- Past cards should still be clearly readable, not ghostly dim
- Seal icons in cards should be at full brightness
- Kin names should be at primary text colour even for past items (just slightly muted, not invisible)

---

## Issue 2: SPACE USAGE — FILL THE SCREEN

### Today view compass
- The compass is currently about 310px but it's positioned with too much space above and below
- Make the compass LARGER — use approximately 340-360px diameter on a 375px screen
- Reduce top padding above "DEEP WHISPER" header — it doesn't need 20px, use 8-10px
- Reduce gap between compass and Kin strip — 8px is enough
- Reduce gap between Kin strip and micro dashboard — 6-8px
- The compass should feel like it FILLS the upper portion of the screen
- Outer seal ring radius should increase proportionally so seal icons are further apart and easier to tap (44px minimum tap target including the background square)

### My Kin view
- The input section has too much vertical padding — reduce it
- The signature card should be WIDER — use full width minus 16px padding on each side (not 24px)
- The oracle cross should be larger with more space between elements
- The seal icon at top should be 80px (not 72px, fill the space)
- Kin number should be even bigger (56-64px)
- Reduce padding inside the card — the content should breathe but not float in a void
- "Share my Kin" and "Galactic Blueprint" buttons should be full width, stacked or side by side filling the available space

### 13 Moons grid
- The grid cells are currently too small with too much space between rows
- The grid should FILL the available width (full width minus 16px padding each side)
- Cells should be larger — the grid should span nearly the full screen width
- Reduce the gap between cells to 4-5px (not 8px+)
- Each cell should be roughly 44-46px wide (to fill 375px - 32px padding = 343px / 7 columns ≈ 44px each with 4px gaps)
- The seal icon inside each cell can be larger (22-24px)
- Remove excessive vertical spacing between the grid rows
- The moon progress bar at the top should be more compact

### Wavespell view
- Timeline cards should use more horizontal space — full width minus 16px each side
- The left timeline column (tone numbers) can be narrower (32px instead of 40px)
- Cards should have more internal content (seal icon larger, text more prominent)

---

## Issue 3: THE MOON MUST LOOK LIKE A MOON

The centre moon in the compass currently looks like a circle with a line through it. Users should INSTANTLY recognise it as a moon phase. Reference: how lunata.app renders its moon — realistic, beautiful, unmistakable.

### Realistic moon rendering requirements:

**Size:** The moon should be 80-90px diameter in the compass centre — big enough to be the obvious focal point.

**Lit side (illuminated crescent/gibbous):**
- Use a warm off-white to cream colour: #e8e4d8 to #dedad0
- The lit area should have subtle surface texture — NOT flat colour
- Add 2-3 very subtle darker spots/circles within the lit area to suggest maria (the dark patches you see on the real moon) — use rgba(160,155,140,0.15), circles of 5-12px radius
- Add a subtle brighter highlight on the upper-right of the lit area (small ellipse at opacity 0.15)

**Shadow side (dark):**
- Very dark: #0e0e1e to #14142a
- Should NOT be pure black — it should have a very slight luminosity (earthshine effect)
- Add a faint edge glow on the shadow side to suggest earthshine: a thin arc (1px) at rgba(180,175,160,0.06)

**Terminator (the line between light and dark):**
- This should be a SMOOTH curve, not a straight line
- Use a quadratic bezier path that creates the characteristic crescent/gibbous shape
- The terminator position and curve should be calculated from the actual illumination percentage
- For a waxing crescent (current ~3%), almost all of the moon should be dark with just a thin lit sliver on the right

**Crater texture:**
- Add 8-12 small circles scattered across the ENTIRE moon surface (both lit and dark sides)
- On the lit side: subtle dark circles (rgba(160,155,140,0.08-0.12))
- On the dark side: even more subtle (rgba(180,175,160,0.03-0.05))
- Vary sizes from 3px to 10px radius
- This gives the moon a textured, realistic feel

**Rim/limb:**
- Very subtle circular border around the entire moon: 0.8px at rgba(200,196,184,0.12)
- This defines the moon's edge against the dark background

**The seal glyph overlay:**
- Today's seal PNG overlaid at centre of the moon
- Size: about 40-45px
- Opacity: 0.35-0.45 with mix-blend-mode: screen
- Gentle opacity breathing animation (0.35 → 0.5 → 0.35, 3 second cycle)
- This creates the effect of the glyph being "etched" into the moon's surface

**IMPORTANT:** Use the astronomy-engine data already in the app to calculate the correct phase. A 3% illuminated waxing crescent should show almost entirely dark with a thin bright sliver on the right edge. The current rendering does not reflect this correctly.

---

## Issue 4: MY KIN CARD NEEDS TO FEEL PREMIUM

The signature card is the viral sharing element. It must look stunning on a screenshot.

### Card improvements:
- The card background gradient should be MORE visible — use the seal's colour more prominently
- Example for Blue Night: gradient from rgba(30,58,95,0.5) to rgba(8,8,18,0.9) — the blue should be NOTICEABLE
- Add a very subtle noise/grain texture overlay if possible (or a radial glow in the seal colour at top)
- The "GALACTIC SIGNATURE" label should be in a slightly brighter colour, with wider letter-spacing (3-4px)
- The Kin number should be the LARGEST element — 56-64px, pure white, bold
- The oracle cross layout needs more visual weight:
  - Guide (top): slightly larger icon (36px)
  - Destiny (centre): largest icon (44px) with a visible border matching seal colour
  - Analog, Antipode (sides): 32px
  - Occult (bottom): 32px
  - Labels (Guide, Analog, etc.) in a dim colour, seal names in their bright colour

---

## Verification

After all changes:

1. `npm run build` — zero errors
2. Open at 375px viewport width:
   - Today view: ALL content visible and readable, compass fills upper screen, no scroll needed for essential content
   - My Kin: Signature card fills width, looks premium, large readable text
   - 13 Moons: Grid cells fill the width, coloured, readable Kin numbers
   - Wavespell: Timeline fills width, today visible and prominent
3. Moon in compass centre is INSTANTLY recognisable as a moon phase
4. No text or icons are hard to read against the dark background
5. Seal colours are VIVID — red looks red, blue looks blue, yellow looks yellow
6. No wasted empty space in any view
