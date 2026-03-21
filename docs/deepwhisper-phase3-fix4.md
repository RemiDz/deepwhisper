# DeepWhisper Phase 3 FIX #4 — Brighten Wheel + Remove Duplicate Info

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: ultrathink

## Two Issues to Fix

---

### Issue 1: The wheel is too dim — brighten inactive elements

The wheel is the main visual selling point of the app. Currently inactive seals and tones are too dimmed, making the whole wheel look washed out and dull. Only the active Kin shows bright, which steals the visual impact.

**Fix in GearWheel.tsx:**

**Outer gear (seal icons):**
- Change INACTIVE seal opacity from `0.3` to `0.7`
- Keep active seal at `1.0`
- This makes all 20 seals clearly visible and colourful, with the active one just slightly brighter

Find the line that sets globalAlpha for inactive seals (something like `ctx.globalAlpha = isActive ? 1 : 0.3`) and change it to:
```typescript
ctx.globalAlpha = isActive ? 1 : 0.7;
```

**Inner gear (tone symbols):**
- Change INACTIVE tone symbol opacity from `0.4` or `0.5` to `0.65`
- Keep active tone symbol at `1.0`

Find the line that sets globalAlpha for inactive tone symbols and change it to:
```typescript
ctx.globalAlpha = isActive ? 1 : 0.65;
```

**Inner gear teeth (background shapes):**
- Change INACTIVE tooth fill opacity from `0.04` to `0.08` (just slightly more visible)
- Keep active tooth at `0.2`

**Inactive tone symbol colour:**
- Change from `'rgba(255,255,255,0.4)'` to `'rgba(255,255,255,0.7)'`
- Active stays `'#ffffff'`

The goal: the entire wheel should look vibrant and colourful at all times. The active Kin position should stand out slightly more than the rest, but the rest should NOT look faded or washed out.

---

### Issue 2: Remove duplicate Kin information below the wheel

Below the wheel, the Kin name and details are displayed TWICE:
1. First as plain text (e.g. "White Spectral Wind", "Kin 102 · Tone 11 · Seal 2", and the affirmation)
2. Then again as a styled card (big "102", "White Spectral Wind", tone icon, action words)

The first plain text block is redundant and wastes screen space. **Remove it entirely.**

**Fix in page.tsx (or wherever the Today view is rendered):**

Find and DELETE the section that renders:
- The Kin name text (e.g. "White Spectral Wind") that appears directly below the navigation buttons
- The "Kin 102 · Tone 11 · Seal 2" line below it
- The affirmation text in italics below that

Keep ONLY the styled Kin detail card that shows:
- The big Kin number (102)
- The Kin name (White Spectral Wind)
- The tone icon and name
- The action words (Dissolve · Release · Liberation)
- The zodiac/moon phase tags
- Today's Declaration section

The navigation buttons (< Today >) should sit directly above the styled Kin detail card with no repeated text in between.

---

## Summary of Files to Modify

1. **GearWheel.tsx** — Issue 1 only (increase opacity values for inactive elements)
2. **page.tsx** (or Today view component) — Issue 2 only (remove duplicate Kin text block)

## DO NOT

- Do NOT modify the moon centre
- Do NOT modify the Learn tab
- Do NOT modify the gear mechanics or tone symbol rendering
- Do NOT modify the drag-to-spin functionality
- Do NOT modify the Today button behaviour
- Do NOT change any other styling or layout

## Quality Checks

- [ ] All 20 seal icons on the outer gear are clearly visible and colourful (not washed out)
- [ ] Active seal is slightly brighter than inactive seals (but inactive are still ~70% visible)
- [ ] All 13 tone symbols on inner gear are clearly visible white symbols
- [ ] Kin information appears only ONCE below the wheel (the styled card only)
- [ ] No duplicate text between navigation buttons and the Kin detail card
- [ ] Screen space is used efficiently with no repeated content
- [ ] `git push origin master:main` succeeds
