# DeepWhisper Phase 3 — Galactic Content Integration (megathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

DeepWhisper (deepwhisper.app) is a 13 Moon Galactic Calendar app built with Next.js 14, TypeScript, and Tailwind CSS. Phases 1 and 2 are complete — the app has a Galactic Compass (Today view), My Kin calculator, 13 Moons calendar, and Wavespell explorer.

This phase adds rich content from "The Mayan-Galactic Codes" trilogy by Anton Kornblum — 260 daily declarations, 20 seal descriptions, and 13 tone descriptions. This content transforms the app from a calendar tool into a daily practice companion.

**Design aesthetic:** Deep space dark (#080812 background). Seal colours: red #ef4444, white #e8e6df, blue #3b82f6, yellow #eab308. Purple #c084fc for tones/UI accents. Mobile-first (375px primary).

---

## Step 1: Add the Galactic Content data file

Create `src/data/galactic-content.ts` with the contents of the attached `galactic-content.ts` file. This file contains:

- `SEAL_DESCRIPTIONS` — Record<string, string> with paragraph descriptions for all 20 solar seals
- `TONE_DESCRIPTIONS` — Record<number, string> with paragraph descriptions for all 13 galactic tones  
- `DECLARATIONS` — Array of 260 `GalacticDeclaration` objects, each with kin, tone, seal, declaration text, and guide power
- Helper functions: `getDeclaration(kin)`, `getSealDescription(seal)`, `getToneDescription(tone)`

**IMPORTANT:** Copy the entire file exactly. Do NOT truncate, summarise, or abbreviate any content. Every word matters — these are the complete affirmation texts.

---

## Step 2: Daily Declaration Card on Today View

Add a tappable "Daily Declaration" card below the Galactic Compass on the home/Today view.

### Collapsed state (default):
- Small card with subtle glow border matching today's seal colour
- Shows: "TODAY'S DECLARATION" label in 10px uppercase letter-spaced text
- First line of the declaration text (the "I am..." BE phrase) as a preview, 13px, colour matching seal colour
- Subtle down-chevron icon to indicate expandability

### Expanded state (on tap):
- Card expands smoothly (300ms ease-out transition)
- Full declaration text displayed with this visual structure:
  - **BE section** (lines starting with "I am..."): Seal colour, 14px, slightly bold
  - **DO section** (lines with action verbs — "I invoke/sustain/ignite/formulate/anchor/optimise/attune/formalise/engage/fulfill/liberate/refine/celebrate..."): White #e8e6df, 13px
  - **HAVE section** (lines starting with "in order to..."): Muted purple #a78bfa, 13px
  - **Guide power** (last line "I am guided by..."): Gold #eab308, 12px, italic
- Tap again to collapse
- Subtle divider line between BE/DO/HAVE sections (rgba white 0.06)

### Data flow:
- Use the existing Kin calculation to get today's Kin number
- Call `getDeclaration(kinNumber)` to get the declaration
- Parse the declaration text by line to identify BE/DO/HAVE/GUIDE sections

---

## Step 3: Seal Description in My Kin Result

On the My Kin calculator result view (the Galactic Signature card), add a "Soul Essence" section below the Fifth Force Oracle grid.

### Design:
- Section header: "SOUL ESSENCE" in 10px uppercase letter-spaced text, muted
- The seal description paragraph from `getSealDescription(sealName)`
- Text: 13px, line-height 1.6, colour #b8b5ad (warm grey)
- Maximum 6 lines visible initially, with a "Read more" fade-to-transparent gradient and tap to expand
- Card background: rgba(255,255,255,0.02) with subtle rounded border

### Also add seal description as a bottom sheet:
- When the user taps the central seal icon in the Fifth Force Oracle, open a bottom sheet with:
  - Seal glyph icon (large, 64px) 
  - Seal name and colour label
  - Full description text
  - Scrollable if content exceeds viewport

---

## Step 4: Tone Description in Wavespell View

On the Wavespell explorer, when the user taps any tone row in the 13-tone timeline:

### Bottom sheet / expandable panel:
- Tone number and Dreamspell name (e.g., "10 — Planetary")
- Tone keywords (existing: Perfect · Produce · Manifestation)
- Full tone description paragraph from `getToneDescription(toneNumber)`
- Text: 13px, line-height 1.6, colour #b8b5ad
- Smooth expand animation (200ms)
- The currently active tone (today's position) should have a subtle purple left border indicator

---

## Step 5: Declaration on My Kin Result

When someone calculates their Kin on the My Kin page, also show their personal life declaration below the Soul Essence section.

### Design:
- Section header: "YOUR GALACTIC DECLARATION" in 10px uppercase
- Full declaration text with the same BE/DO/HAVE colour coding as the Today view
- This is the user's personal life affirmation — present it with visual weight and importance
- Consider a subtle background gradient or border treatment to make it feel special/sacred

---

## Step 6: Seal Description in 13 Moons Grid

When the user taps a day cell in the 13 Moons calendar grid, show a compact bottom sheet with:

- Kin number and full name (e.g., "Kin 101 · Red Planetary Dragon")
- The seal's colour indicator dot
- First 2 lines of the day's declaration as a preview
- "View full declaration" link/button that scrolls to the expanded view
- If the day is today, highlight with a subtle glow

---

## Step 7: iOS Safari compatibility

For any date/time inputs, apply these styles to prevent overflow on mobile Safari:

```css
input[type="date"], input[type="time"] {
  -webkit-appearance: none;
  appearance: none;
  min-width: 0;
}
```

---

## Step 8: Verify and deploy

### Verification checklist:
- [ ] Today view shows the daily declaration card — collapsed and expanded states work
- [ ] Declaration text correctly parses into BE (coloured), DO (white), HAVE (purple), GUIDE (gold) sections
- [ ] My Kin result shows Soul Essence description for the calculated seal
- [ ] My Kin result shows personal Galactic Declaration with colour coding
- [ ] Wavespell tones are tappable and show full tone descriptions
- [ ] 13 Moons day cells show declaration preview on tap
- [ ] Kin 1 (Red Magnetic Dragon) declaration starts with "I am source, creator, author"
- [ ] Kin 143 (Blue Cosmic Night) declaration includes "I am guided by the power of healing"
- [ ] Kin 260 (Yellow Cosmic Sun) declaration includes "I AM SOURCE"
- [ ] All 260 declarations are present in the data file (no truncation)
- [ ] All 20 seal descriptions are present and complete
- [ ] All 13 tone descriptions are present and complete
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] `npm run build` succeeds
- [ ] Mobile viewport (375px) — all new content fits without horizontal scroll
- [ ] Animations are smooth (no jank on expand/collapse)

### Deploy:
```bash
git add -A
git commit -m "Phase 3: Galactic content — 260 declarations, seal & tone descriptions"
git push origin master:main
```
