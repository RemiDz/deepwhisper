# DeepWhisper Phase 3 FIX #3 — Five Specific Issues

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: gigathink

## Five Issues to Fix

---

### Issue 1: Tone symbols must be WHITE, not purple

The dot-and-bar tone symbols on the inner gear are currently purple (#c084fc). They need to be **white** for both active and inactive states so they stand out clearly against the dark background and don't merge with the purple gear teeth.

**Fix in GearWheel.tsx — in the drawRadialDotBar function:**

Change the colour logic from:
```typescript
const col = active ? '#c084fc' : isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.3)';
```

To:
```typescript
const col = active ? '#ffffff' : 'rgba(255,255,255,0.4)';
```

Active tone symbols = solid white (#ffffff).
Inactive tone symbols = white at 40% opacity.

This applies to BOTH the dots AND the bars within the drawRadialDotBar function.

---

### Issue 2: Tone dots must be HORIZONTAL, not vertical

The Dreamspell dot-and-bar notation has a specific layout: **bars are horizontal lines stacked vertically, and dots sit in a HORIZONTAL ROW beneath the bars** — not stacked vertically. We must not invent new symbols.

Currently dots are stacking vertically (one on top of another). They need to be laid out **side by side in a horizontal row**.

**Fix in drawRadialDotBar function — replace the dots drawing section:**

The bars still stack vertically (one above the other). But the dots must be drawn in a horizontal row centred below the last bar.

```typescript
function drawRadialDotBar(
  ctx: CanvasRenderingContext2D,
  tone: number,
  active: boolean,
  scale: number
) {
  const s = scale;
  const { bars, dots } = getDotBar(tone);
  const dotR = 2.5 * s;
  const barW = 12 * s;
  const barH = 2.5 * s;
  const vGap = 5 * s;      // vertical gap between bars, and between bars and dot row
  const dotGap = 5 * s;    // horizontal gap between dots

  // Calculate total height
  const barTotalH = bars > 0 ? bars * barH + (bars - 1) * vGap : 0;
  const dotRowH = dots > 0 ? dotR * 2 : 0;
  const gapBetween = (bars > 0 && dots > 0) ? vGap : 0;
  const totalH = barTotalH + gapBetween + dotRowH;

  let sy = -totalH / 2;

  const col = active ? '#ffffff' : 'rgba(255,255,255,0.4)';
  ctx.fillStyle = col;

  // Draw bars stacked vertically (each bar is a horizontal line)
  for (let b = 0; b < bars; b++) {
    ctx.fillRect(-barW / 2, sy, barW, barH);
    sy += barH + vGap;
  }

  // Draw dots in a HORIZONTAL ROW (side by side)
  if (dots > 0) {
    const dotRowY = sy + dotR; // centre Y of the dot row
    const dotRowW = dots * dotR * 2 + (dots - 1) * dotGap;
    let dx = -dotRowW / 2 + dotR; // start X (centre of first dot)

    for (let d = 0; d < dots; d++) {
      ctx.beginPath();
      ctx.arc(dx, dotRowY, dotR, 0, Math.PI * 2);
      ctx.fill();
      dx += dotR * 2 + dotGap;
    }
  }
}
```

**Visual verification:**
- Tone 3 (Electric): 3 dots in a horizontal row (no bars above)
- Tone 7 (Resonant): 1 bar on top, then 2 dots side by side below
- Tone 13 (Cosmic): 2 bars stacked, then 3 dots side by side below

---

### Issue 3: Zodiac sign name must show ABOVE the moon

When the moon phase is full/bright white, the zodiac name text becomes invisible because it's overlaid on the white moon.

**Fix:** Move the zodiac sign name text to display ABOVE the moon graphic, not on top of it. Find the component that renders the zodiac name (e.g. "Taurus") and the moon phase graphic. Reorder them so:

1. Zodiac name (top, above the moon)
2. Moon phase graphic (middle)
3. Phase description like "Waxing Crescent - 15%" (bottom, below the moon)

This is a layout change in the moon centre overlay component, NOT in GearWheel.tsx. Find the relevant JSX and reorder the elements.

---

### Issue 4: Today button text must ALWAYS say "Today"

Currently when the user presses the prev/next arrows to navigate to different days, the middle button's text changes to show the date (e.g. "Mar 22"). This is confusing because tapping the button always returns to today regardless of what date it shows.

**Fix:** The middle button must ALWAYS display the text "Today" — never a date. If you want to show the current date being viewed, display it as a separate label ABOVE or BELOW the navigation buttons, not inside the Today button itself.

```tsx
// The Today button — text is ALWAYS "Today"
<button onClick={() => setDayOffset(0)}>Today</button>

// Show the viewed date as a separate label below the buttons (only when offset !== 0)
{dayOffset !== 0 && (
  <span className="date-label">
    {viewedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
  </span>
)}
```

---

### Issue 5: Drag-to-spin the wheel is not working

The wheel should be interactive — when a user drags/swipes on the gear, it should rotate and change the day. This worked in the previous compass version.

**Fix:** Ensure the canvas has pointer event handlers for drag-to-spin:

```typescript
// State refs
const draggingRef = useRef(false);
const dragStartAngleRef = useRef(0);

// On pointer down — capture the starting angle
const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
  draggingRef.current = true;
  const rect = canvasRef.current!.getBoundingClientRect();
  const x = e.clientX - rect.left - cx;
  const y = e.clientY - rect.top - cy;
  dragStartAngleRef.current = Math.atan2(y, x);
  canvasRef.current!.setPointerCapture(e.pointerId);
};

// On pointer move — calculate angle delta, snap to seal steps
const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
  if (!draggingRef.current) return;
  const rect = canvasRef.current!.getBoundingClientRect();
  const x = e.clientX - rect.left - cx;
  const y = e.clientY - rect.top - cy;
  const angle = Math.atan2(y, x);
  const delta = angle - dragStartAngleRef.current;
  const sealStep = (Math.PI * 2) / 20;
  const steps = Math.round(delta / sealStep);
  if (steps !== 0) {
    // Each step = one day backward or forward
    onDayChange(-steps); // negative because dragging clockwise = forward
    dragStartAngleRef.current = angle;
  }
};

// On pointer up — release
const handlePointerUp = () => {
  draggingRef.current = false;
};
```

And on the canvas element:
```tsx
<canvas
  ref={canvasRef}
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onPointerCancel={handlePointerUp}
  style={{ cursor: 'grab', touchAction: 'none' }}
/>
```

**IMPORTANT:** The `onDayChange` callback should be passed as a prop from the parent page. It should update the `dayOffset` state, which triggers re-render and gear rotation animation.

Also ensure `cx` and `cy` (centre coordinates of the canvas) are accessible in these handlers — they should be stored in refs that update on resize.

---

## Summary of Files to Modify

1. **GearWheel.tsx** — Issues 1, 2, 5 (tone colours, dot layout, drag-to-spin)
2. **Moon centre component** (wherever zodiac name is rendered) — Issue 3 (move zodiac name above moon)
3. **page.tsx** (or wherever nav buttons live) — Issue 4 (Today button always says "Today")

## DO NOT

- Do NOT modify the Learn tab
- Do NOT modify the outer gear seal icons (they look correct)
- Do NOT change the overall page layout or component structure
- Do NOT remove any existing functionality

## Quality Checks

- [ ] Tone symbols are WHITE (not purple)
- [ ] Tone 3: 3 white dots in a horizontal row
- [ ] Tone 7: 1 white bar, 2 white dots side by side below
- [ ] Tone 13: 2 white bars stacked, 3 white dots side by side below
- [ ] Tone 5: 1 white bar only (no dots)
- [ ] Zodiac name visible above the moon (not overlapping it)
- [ ] Today button ALWAYS says "Today" regardless of navigation state
- [ ] Viewed date shown as separate label when navigating away from today
- [ ] Dragging on the wheel rotates gears and changes day
- [ ] Drag works on both desktop (mouse) and mobile (touch)
- [ ] `git push origin master:main` succeeds
