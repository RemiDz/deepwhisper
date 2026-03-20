# DeepWhisper — PDF Fix: Oracle Text Clipping & Icon Backgrounds (megathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

---

## Two targeted fixes in src/lib/pdf/galacticBlueprint.ts

### Fix 1: Oracle description text clipping

The oracle description lines are cutting off the last character of seal names. Examples:
- "Yellow Warrior" renders as "Yellow Warrio"
- "White Mirror" renders as "White Mirro"
- "Red Skywalker" renders as "Red Skywalke"
- "Blue Hand" renders as "Blue Hand" (short names might be fine, but check all)

The root cause is the coloured bold text width calculation — when the code positions the plain description text after the bold coloured seal name, it underestimates the width of the bold text, causing overlap or truncation.

**Fix approach — choose the most reliable option:**

Option A (preferred): Render the role label, seal name, and description on separate lines instead of trying to fit them inline:
```
Guide: Blue Hand
Shows you the way forward — the directing power above you.
```
This avoids width calculation entirely and is more readable.

Option B: If keeping inline, add a generous width buffer (at least 8-10mm extra) when measuring the bold coloured text width before positioning the following plain text. Use jsPDF's `getTextWidth()` method on the bold text and add the buffer.

**Test with these seal names specifically** (they're the longest):
- "Red Skywalker" (14 chars)
- "White Worldbridger" (18 chars — the longest seal name)
- "Yellow Warrior" (14 chars)
- "White Mirror" (12 chars)

Verify NONE of them get clipped.

### Fix 2: Seal icon dark backgrounds on white PDF

The seal PNG icons were designed for the app's dark theme — they have dark/black background squares baked into the image. On the white PDF pages, these dark squares look terrible and out of place.

**Fix:** For EVERY seal icon rendered anywhere in the PDF, draw a light coloured rounded rectangle BEHIND the icon before placing the image. The background colour should be a light tint of the seal's colour family:

```typescript
// Light background colours for PDF (by seal colour)
const pdfIconBg: Record<string, string> = {
  Red: '#fee2e2',      // Light red / rose
  White: '#f1f0ed',    // Light warm grey
  Blue: '#dbeafe',     // Light blue
  Yellow: '#fef9c3',   // Light yellow / cream
};
```

For each icon placement:
1. Determine the seal's colour family (Red, White, Blue, Yellow)
2. Draw a filled rounded rectangle at the icon position using the light background colour
3. Draw a border on the rectangle: 0.5pt stroke in the seal's main colour hex at 30% opacity
4. Round corners: radius 2-3mm (use `doc.roundedRect()`)
5. Place the PNG icon on top with `doc.addImage()`

**Apply this to ALL seal icon locations in the PDF:**
- Cover page: main seal icon (large)
- Solar Seal page: section heading icon
- Oracle cross: all 5 seal icons (destiny + 4 oracle)
- Wavespell list: all 13 seal icons in the timeline
- Earth Family: all 4 family member seal icons
- Any other seal icon appearances

The rounded rectangle should be slightly larger than the icon (1-2mm padding on each side) so the icon doesn't touch the edges.

---

## Do NOT change
- Any PDF content text, section structure, or page layout
- Any app components or calculation logic
- Any other files

## Verify
1. `npm run build` — zero errors
2. Generate blueprint for Kin 143 — check oracle descriptions are NOT clipped
3. Generate blueprint for Kin 45 (Red Rhythmic Serpent) — this oracle includes "White Worldbridger" (longest name) — verify no clipping
4. Check all seal icons have light coloured backgrounds on every page
5. Icons should look clean and polished on the white PDF background
