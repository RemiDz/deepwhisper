# DeepWhisper — Critical Visual Bug Fixes (ultrathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

---

## IMPORTANT: This prompt fixes exactly 4 visual bugs. Do NOT refactor, restructure, or "improve" anything else. Only touch the code necessary to fix these 4 issues.

---

## Bug 1: Header text clipped on the left

**Current behaviour:** The header at the top of the Today view (`/` route) shows "EP WHISPE" and "Solar Moon · Day 15" — the left side of the text is cut off. "DEEP WHISPER" should be fully visible.

**Root cause to investigate:** Something is pushing the header text off the left edge. Likely causes:
- An absolutely positioned element (logo, icon, back button) is overlapping the text from the left
- The header text container has `padding-left` or `margin-left` that's too large
- The header container has `overflow: hidden` combined with content that's wider than the viewport
- There's a negative `left` or `translateX` on the header

**Required fix:**
1. Open the Today page component (likely `src/app/page.tsx` or a Header component)
2. Find the header/top bar element that contains the app name and 13 Moon date
3. Ensure the text is centred with `text-align: center` and the container spans `width: 100%`
4. Remove any `overflow: hidden` from the header container
5. If there's an icon or logo on the left side that's overlapping, ensure the text is in a flex child with `flex: 1` and `text-align: center`, or remove the overlapping element
6. Test: The full text "DEEP WHISPER · Solar Moon · Day 15" (or similar) must be fully visible and centred at the top of the screen on a 375px wide viewport

---

## Bug 2: Kin number overlapping the Kin name

**Current behaviour:** Below the compass, the display shows:
```
101
Red Plan[hidden]y Dragon
```
The large "101" Kin number is visually overlapping or covering part of the word "Planetary" in "Red Planetary Dragon".

**Root cause to investigate:** The Kin number and Kin name are likely positioned with `absolute` or have overlapping vertical space. They might both be in the same container without proper stacking.

**Required fix:**
1. Find the component that renders the Kin number and Kin name below the compass (likely in the Today page or a KinInfo/KinStrip component)
2. Replace whatever layout is currently used with a simple vertical flex column:

```tsx
<div className="flex flex-col items-center gap-1">
  {/* Kin number */}
  <span className="text-4xl font-bold text-white">{kinNumber}</span>
  
  {/* Full Kin name: colour + tone + seal */}
  <span className="text-xl" style={{ color: sealColour }}>
    {colourName} {toneName} {sealName}
  </span>
  
  {/* Tone keywords */}
  <span className="text-sm text-gray-400">
    {toneAction} · {tonePower} · {toneEssence}
  </span>
</div>
```

3. Make absolutely sure:
   - NO `position: absolute` on either the number or the name
   - NO negative margins pulling elements together
   - NO `max-width` or `overflow: hidden` on the text elements
   - The Kin name text has `white-space: nowrap` or enough width to display "Red Planetary Dragon" without wrapping into the number
   - Each element is a separate block/flex-child that stacks vertically with clear spacing

4. Test: "Red Planetary Dragon" must be fully readable with no characters hidden behind "101"

---

## Bug 3: Declaration card expansion pushes compass off screen

**Current behaviour:** When the user taps "TODAY'S DECLARATION" to expand it on the Today view, the expanded content pushes the entire page content upward, shoving the Galactic Compass off the top of the screen.

**Root cause to investigate:** The page layout is likely using a fixed-height viewport (`h-screen` or `100vh`) with `overflow: hidden`, and the declaration card is inside this container. When it expands, the content grows taller than the viewport but can't scroll, so it pushes everything up.

**Required fix:**
1. Find the Today page's main container layout
2. The page MUST be scrollable when content exceeds the viewport height. Change the layout approach:

```tsx
{/* Main scrollable container */}
<div className="min-h-screen pb-20 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
  {/* Header */}
  {/* Compass */}
  {/* Kin info */}
  {/* Moon badges */}
  {/* Declaration card (expandable) */}
  {/* Progress bars */}
</div>

{/* Fixed tab bar at bottom */}
<nav className="fixed bottom-0 left-0 right-0 z-50 ...">
  {/* tabs */}
</nav>
```

3. Key rules:
   - The main content area must use `overflow-y: auto` (NOT `overflow: hidden`)
   - Use `min-h-screen` instead of `h-screen` so the container grows with content
   - The bottom tab bar must be `fixed` (position: fixed) so it stays visible regardless of scroll position
   - Add `pb-20` (or equivalent ~80px bottom padding) to the main content to prevent the tab bar from covering the last elements
   - Hide the scrollbar visually but allow scrolling:
     ```css
     .scrollbar-hide::-webkit-scrollbar { display: none; }
     .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
     ```
   - When the declaration card is collapsed, the content should ideally fit in one screen. When expanded, the user scrolls to see the full declaration and the progress bars below.

4. Test: Expand the declaration card → the compass stays in place at the top, the page becomes scrollable, and the user can scroll down to see the full declaration and progress bars. The tab bar remains fixed at the bottom throughout.

---

## Bug 4: Kin number cut off on My Kin signature card

**Current behaviour:** On the My Kin view (`/my-kin`), the Galactic Signature card shows the seal icon and "GALACTIC SIGNATURE" label, but the Kin number "143" is cut off at the bottom edge of the card — only the top portions of the digits are visible.

**Root cause to investigate:** The card container likely has a fixed height or `overflow: hidden` that clips the Kin number which sits at or near the bottom of the card.

**Required fix:**
1. Find the Galactic Signature card component (likely in `src/app/my-kin/page.tsx` or a SignatureCard component)
2. The card must NOT have a fixed height that clips content. Use `height: auto` or `min-height` instead of a fixed `height`
3. Remove `overflow: hidden` from the card container, or ensure the content fits within the card
4. The card layout should be:
   ```
   [Seal icon - 64-72px, centred]
   [gap]
   GALACTIC SIGNATURE
   [gap]
   143
   [gap]
   Blue Cosmic Night
   ```
5. All content must be fully visible within the card boundaries
6. If the card has a gradient or background, extend it to cover all content including the Kin number
7. Test: The full Kin number "143" must be completely visible inside the signature card, not clipped at the bottom

---

## After ALL fixes

Run:
```bash
npm run build
npm run test
```

Both must pass with zero errors. Do NOT change any calculation logic, data model, route structure, or test files.

## Verification checklist

- [ ] Header shows full "DEEP WHISPER · Solar Moon · Day 15" text, nothing clipped
- [ ] Kin name "Red Planetary Dragon" is fully visible below "101", no overlap
- [ ] Expanding the declaration card allows scrolling — compass stays visible at top
- [ ] Tab bar stays fixed at bottom during scroll
- [ ] My Kin signature card shows the complete Kin number (e.g., "143") — not cut off
- [ ] `npm run build` — zero errors
- [ ] `npm run test` — 52/52 pass
- [ ] No console errors
