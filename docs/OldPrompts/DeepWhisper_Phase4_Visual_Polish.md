# DeepWhisper Phase 4 — Visual Polish & Bug Fixes (ultrathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

---

## Context

DeepWhisper is a 13 Moon / Dreamspell calendar app built with Next.js 14, TypeScript, and Tailwind. Phases 1–3 are complete: the Dreamspell engine, all 4 views (Today, My Kin, 13 Moons, Wavespell), authentic PNG seal icons, galactic content (declarations, seal descriptions, tone descriptions), and astronomical moon data are all working. 52/52 tests pass, zero TypeScript errors.

However, the Today view has several visual bugs and the overall compass quality doesn't match the intended design. This phase is purely visual — NO changes to calculation logic, data model, tests, or route structure.

---

## Bug 1: Seal icon drifting animation

**Problem:** The today's seal icon (red Dragon in the current example) at the top of the compass ring AND the seal overlay in the centre of the moon have an unwanted CSS animation — they drift/slide to the left and back repeatedly.

**Fix:**
- Find the CSS animation or `@keyframes` rule applied to today's active seal glyph in the outer ring. Remove or replace the horizontal translate/movement animation. The active seal should ONLY have a subtle pulsing glow (`opacity` or `box-shadow` pulse), NOT a position shift.
- Find the animation on the centre moon seal overlay. Same fix — remove horizontal drift. The centre seal should be static, sitting inside the moon at `opacity: 0.4–0.5` with `mix-blend-mode: screen`. No movement.
- Search the entire codebase for any `translateX`, `translateY`, `left`, `right`, or `transform` animations on seal icons and remove horizontal/positional movement. Only allow opacity or glow animations.

---

## Bug 2: Kin title text overlapping / clipping

**Problem:** The Kin title below the compass reads "101 ed etary Dragon" instead of "Red Planetary Dragon". The text is overlapping or getting clipped behind the large Kin number "101".

**Fix:**
- The Kin number and Kin name must be on separate lines, not overlapping.
- Layout should be:
  ```
  101
  Red Planetary Dragon
  Perfect · Produce · Manifestation
  ```
- The Kin number should be large and bold (e.g., `text-3xl` or `text-4xl`, `font-bold`)
- The seal colour name + tone name + seal name should be directly below, slightly smaller (`text-lg` or `text-xl`), in the seal's colour
- The tone keywords should be below that, smallest (`text-sm`), muted colour
- All three lines: centred, no overlap, adequate vertical spacing (`gap-1` or `space-y-1`)
- Make sure the text container has `overflow: visible` and no `max-width` that would cause clipping
- Check if the Kin number has an absolutely positioned element that overlaps the name — if so, switch to a simple flex column layout

---

## Bug 3: Top header truncated

**Problem:** The header at the very top of the Today view shows "EP" and "ar Moon · Day" instead of the full 13 Moon date (e.g., "DEEP WHISPER · Solar Moon · Day 14" or similar).

**Fix:**
- The header text is being clipped on the left side. Check for:
  - `overflow: hidden` on the header container
  - Negative margins or padding pushing text off-screen
  - A fixed-width container that's too narrow
  - An absolutely positioned element overlapping the left side of the header
- The header should display the full app name and 13 Moon date, centred, with no clipping
- Ensure the header has `width: 100%`, `text-align: center`, and no horizontal overflow issues
- If there's a back button or icon on the left pushing the text, ensure proper flex layout with the text in a `flex-1` centre section

---

## Step 4: Compass layout polish

The Galactic Compass on the Today view needs to feel tighter, cleaner, and more intentional. Apply these improvements:

### 4a. Seal ring (outer)
- All 20 seal icons must be evenly distributed in a perfect circle
- Each seal sits in a coloured background square (using the seal's `bgHex` colour): Red, White, Blue, Yellow
- Square size: 28–32px with `border-radius: 6px`
- Icon inside: 22–26px, centred within the square
- Today's active seal: full opacity (1.0), subtle pulsing glow animation (box-shadow pulse using the seal colour, NOT a position animation)
- Oracle-connected seals (guide, analog, antipode, occult): `opacity: 0.7`
- All other seals: `opacity: 0.35`
- The ring radius should be sized so seals don't overlap and there's ~4–6px gap between adjacent seal squares

### 4b. Tone ring (inner)
- 13 tones in a smaller concentric circle inside the seal ring
- Tones 1–3: traditional dot notation (1 dot, 2 dots, 3 dots)
- Tones 4–5: bar notation (1 bar, 1 bar + 1 dot)
- Tones 6–13: display as numbers
- Today's active tone: bright purple `#c084fc`, `opacity: 1.0`, subtle glow
- Other tones: `opacity: 0.25`
- Even spacing around the circle

### 4c. Moon centre
- Realistic shaded moon (already implemented) — keep as-is
- Today's seal glyph overlaid at centre: `opacity: 0.4`, `mix-blend-mode: screen`, static (NO animation)
- Moon size: approximately 50–55px radius

### 4d. Oracle connection lines
- Thin dashed lines (`stroke-dasharray: 4 3`, `stroke-width: 0.8`) from the centre to the 4 oracle seals (guide, analog, antipode, occult)
- Line colour: white at `opacity: 0.15` — very subtle, not visually cluttered
- Lines should connect from the moon edge to the seal square edge, not overlapping either element
- If the current lines look messy or cluttered, reduce their opacity further or remove them entirely and rely on the seal opacity hierarchy (bright = oracle, dim = non-oracle) to communicate the relationship

### 4e. Overall compass container
- The entire compass should be vertically centred in the available space between the header and the Kin info below
- No elements should overflow or clip
- The compass should feel like a single cohesive circular instrument, not scattered elements

---

## Step 5: Kin info strip below compass

Below the compass, display:

```
[Kin Number - large, bold]
[Colour + Tone Name + Seal Name - in seal colour]
[Tone action · Tone power · Tone essence - muted, small]

[Moon phase badge]  [Moon sign badge]  [Illumination % badge]
```

- The three badges (Aries, Waxing Crescent, 4%) are already working — keep them as pill/chip style
- Ensure adequate spacing between the compass bottom and this info strip
- All text centred

---

## Step 6: Declaration card spacing

The "TODAY'S DECLARATION" card looks good but check:
- There should be at least `16px` padding between the illumination badges and the top of the declaration card
- The card should have consistent left/right padding (`px-4` or `px-5`)
- The expand/collapse chevron should be vertically centred with the label

---

## Step 7: Bottom progress bars

The Wavespell, Castle, and Spin progress bars at the bottom of the Today view — verify:
- Labels and values on opposite ends (left-aligned label, right-aligned info)
- Progress bar colours match the current castle/wavespell colour
- Adequate spacing between bars (`gap-2` or `space-y-2`)
- No text overflow or wrapping

---

## Step 8: Global checks

After all fixes:

1. **Mobile viewport test** — render at 375×812 (iPhone) and 390×844 (iPhone 14). Everything must fit without horizontal scrollbar.
2. **No scrollbar visible** on the Today view — if content overflows vertically, it should scroll naturally but the scrollbar itself should be hidden (`scrollbar-width: none`, `-webkit-scrollbar: display: none`)
3. **Tab bar** — the bottom tab bar (Today, My Kin, 13 Moons, Wavespell) should remain fixed at the bottom, not overlapping content
4. **Star particle background** — should render behind everything, no z-index conflicts
5. **iOS Safari** — verify all `-webkit-appearance: none`, `appearance: none`, `min-width: 0` rules are in place for any input elements

---

## What NOT to change

- Dreamspell calculation engine (kin, oracle, wavespell, castle, GAP)
- Galactic content data (declarations, seal descriptions, tone descriptions)
- Test files
- Route structure (/, /my-kin, /thirteen-moons, /wavespell)
- My Kin view (Image 2 looks good already)
- 13 Moons grid view
- Wavespell timeline view
- Moon phase calculation logic
- The PNG icon files in `/public/icons/`

---

## Quality checklist (verify before finishing)

- [ ] No seal icons have horizontal drift/slide animations — only glow/opacity pulses allowed
- [ ] Kin title reads full name clearly: "Red Planetary Dragon" (no clipping, no overlap with Kin number)
- [ ] Top header shows full 13 Moon date with no truncation
- [ ] All 20 seal icons are evenly spaced in a perfect circle
- [ ] Today's active seal has a glow pulse, oracle seals are medium opacity, others are dim
- [ ] Compass feels like one cohesive circular element, not scattered pieces
- [ ] Moon badges (phase, sign, illumination) display correctly below Kin info
- [ ] Declaration card has proper spacing from elements above
- [ ] Bottom progress bars render cleanly with no text overflow
- [ ] No horizontal scrollbar on 375px wide viewport
- [ ] Bottom tab bar doesn't overlap content
- [ ] `npm run build` succeeds with zero TypeScript errors
- [ ] `npm run test` — all tests still pass (52/52)
- [ ] No console errors
