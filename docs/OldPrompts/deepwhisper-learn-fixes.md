# DeepWhisper — Learn Tab Fixes (4 Issues)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: gigathink

## All fixes are in the Learn tab page ONLY (src/app/learn/page.tsx or equivalent)

---

### Issue 1: Step 3 "13 tones" — too much purple, looks ugly

The tone display is all purple and looks flat/ugly. Each tone should be displayed with more visual variety and clarity.

**Fix:**
- The dot-and-bar symbols should be rendered in WHITE (not purple) on a subtle dark card background
- The tone number should be prominent
- The tone name should be below in muted text
- Use a subtle card/tile for each tone with a very faint purple tint on the ACTIVE/highlighted one only
- The overall feel should match the elegant dark aesthetic of the app, not a wall of purple

Each tone tile should look like:
```
[dot-and-bar symbol in white]
[number in white, e.g. "5"]
[name in muted text, e.g. "Overtone"]
```

Tile background: rgba(255,255,255,0.04) with 0.5px border rgba(255,255,255,0.08), border-radius 8px.

The dot-and-bar notation must be correct:
- Tone 1: 1 dot
- Tone 2: 2 dots (horizontal row)
- Tone 3: 3 dots (horizontal row)
- Tone 4: 4 dots (horizontal row)
- Tone 5: 1 bar (NO dots)
- Tone 6: 1 bar + 1 dot below
- Tone 7: 1 bar + 2 dots below (horizontal row)
- Tone 8: 1 bar + 3 dots below (horizontal row)
- Tone 9: 1 bar + 4 dots below (horizontal row)
- Tone 10: 2 bars (NO dots)
- Tone 11: 2 bars + 1 dot below
- Tone 12: 2 bars + 2 dots below (horizontal row)
- Tone 13: 2 bars + 3 dots below (horizontal row)

Formula:
```typescript
function getDotBar(tone: number): { bars: number; dots: number } {
  if (tone % 5 === 0) return { bars: tone / 5, dots: 0 };
  return { bars: Math.floor(tone / 5), dots: tone % 5 };
}
```

Bars are horizontal lines. Dots sit in a HORIZONTAL ROW below the bars. Not vertical stacking of dots.

---

### Issue 2: Step 4 "13 moons" — day name letters not explained

The 28-day grid shows column headers D, S, G, K, A, L, S but doesn't explain what these letters mean. Users will have no idea.

**Fix:** Add a small explanation below or above the grid headers:

```
Dreamspell week day names:
D = Dali · S = Seli · G = Gamma · K = Kali · A = Alpha · L = Limi · S = Silio
```

This can be a single line of small muted text (11-12px) above the grid, or a row of labels below the header where each letter is followed by its full name in even smaller text.

A simpler approach: replace the single-letter headers with slightly longer abbreviations:
```
Dali  Seli  Gamma  Kali  Alpha  Limi  Silio
```

Or keep the single letters but add a footnote line below the grid:
```
D=Dali · S=Seli · G=Gamma · K=Kali · A=Alpha · L=Limi · S=Silio
```

Choose whichever approach fits the layout best, but the user MUST be able to understand what the letters mean.

---

### Issue 3: Step 5 "260 Kin grid" — diagonal pattern is incorrect

The 260 Kin grid (Tzolkin matrix) is rendering with a diagonal colour pattern that makes no sense. The correct layout is:

- **13 rows** (one per tone, top to bottom: tone 1 at top, tone 13 at bottom)
- **20 columns** (one per seal, left to right: Dragon, Wind, Night... through Sun)
- Each cell represents one Kin (1-260)
- Kin numbers fill LEFT TO RIGHT, TOP TO BOTTOM: Kin 1 is top-left (tone 1, seal 1), Kin 2 is row 1 col 2 (tone 1, seal 2), etc.

Wait — actually the Tzolkin traditionally fills COLUMN by COLUMN, not row by row:
- Column 1 (Dragon): Kin 1 (tone 1), Kin 2 (tone 2), ... Kin 13 (tone 13)
- Column 2 (Wind): Kin 14 (tone 1), Kin 15 (tone 2), ... Kin 26 (tone 13)
- etc.

So: `kin = (column * 13) + row + 1` where column is 0-19 and row is 0-12.

**Colour coding by CASTLE (groups of 4 columns = 52 Kins):**
- Columns 0-3 (seals 1-4): RED castle — cell colour #ef4444
- Columns 4-7 (seals 5-8): WHITE castle — cell colour #d4d0c8
- Columns 8-11 (seals 9-12): BLUE castle — cell colour #3b82f6
- Columns 12-15 (seals 13-16): YELLOW castle — cell colour #eab308
- Columns 16-19 (seals 17-20): GREEN castle — cell colour #22c55e

Each cell should be a small coloured square (the castle colour at ~40-50% opacity). When tapped/hovered, show the Kin name (e.g. "Kin 102: Spectral Wind").

**The grid should NOT have any diagonal pattern.** Each column is one solid colour (its castle colour). The result looks like 5 vertical colour bands of 4 columns each.

Correct implementation:
```typescript
// Generate 260 Kin grid: 13 rows × 20 columns
// Column-first ordering
for (let row = 0; row < 13; row++) {
  for (let col = 0; col < 20; col++) {
    const kin = col * 13 + row + 1;
    const sealIndex = col; // 0-19
    const toneIndex = row; // 0-12
    const castleIndex = Math.floor(col / 4); // 0-4
    // Use castle colour for this cell
  }
}
```

Castle colours:
```typescript
const castleColors = ['#ef4444', '#d4d0c8', '#3b82f6', '#eab308', '#22c55e'];
```

---

### Issue 4: Step 6 "How it fits" — gears visual looks disconnected

The two gear circles don't look like they're properly meshing/connected. They should clearly interlock.

**Fix:** Draw the two gears so they:
1. Are different sizes (outer = larger with 20 notches, inner = smaller with 13 notches)
2. Are positioned so their edges OVERLAP or TOUCH at a clear contact point
3. Have visible teeth/notches around their circumference
4. Have a visual indicator at the mesh point (a small highlight or glow)

The simplest fix: draw them as two dashed circles of different sizes that overlap at one point, with the numbers "20" and "13" inside each circle, and a small "mesh" indicator where they touch.

Alternatively, use the same gear tooth drawing approach as the main wheel — draw actual gear teeth shapes on both circles so they clearly interlock.

The key is that looking at the image, users should immediately understand "these two things are connected and spin together."

If the current SVG/canvas approach isn't producing good results, a simpler approach works: two overlapping circles with dashed borders and clear "20 seals" and "13 tones" labels, connected by a visual link at the touch point. Below: "260 unique combinations."

---

## DO NOT

- Do NOT modify the Today page, wheel, energy intensity, or declaration
- Do NOT modify steps 1 ("The big idea") or 2 ("20 seals") — they're fine
- Only modify steps 3, 4, 5, and 6 of the Learn tab

## Quality Checks

- [ ] Step 3: Tone symbols are WHITE on dark tiles (not all purple)
- [ ] Step 3: Dot-and-bar notation is correct (tone 5 = 1 bar, tone 10 = 2 bars, no dots for multiples of 5)
- [ ] Step 3: Dots are in horizontal rows, not vertically stacked
- [ ] Step 4: Day name letters are explained (full names visible)
- [ ] Step 5: Tzolkin grid shows 5 vertical colour bands (not diagonal)
- [ ] Step 5: Column order is Dragon through Sun (seals 1-20)
- [ ] Step 5: Tapping a cell shows its Kin name
- [ ] Step 6: Two gears clearly look connected/meshing
- [ ] All changes only in the Learn tab
- [ ] `git push origin master:main` succeeds
