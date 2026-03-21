# DeepWhisper — Moon Centre 3D Zodiac Symbol (megathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

After all changes, run npm run dev and WAIT for me to visually confirm at localhost:3000 before committing or pushing to git.

---

## ONE task: Replace the blurry seal overlay on the moon with a 3D zodiac sign symbol.

---

## Step 1: Remove the seal PNG overlay

Find the seal image/img element rendered on top of the moon centre in `GalacticCompass.tsx` or `MoonPhase.tsx`. It currently shows as a blurry white smudge using `mix-blend-mode: screen` at low opacity. DELETE it entirely — the seal PNG should NOT appear on the moon at all.

---

## Step 2: Add zodiac constellation symbol

Render the current moon zodiac sign as a symbol centred on the moon. The zodiac sign data already exists from the astronomy engine (`moonData.zodiacSign` or similar field).

Map each sign to its unicode symbol:

```typescript
const ZODIAC_SYMBOLS: Record<string, string> = {
  'Aries': '♈',
  'Taurus': '♉',
  'Gemini': '♊',
  'Cancer': '♋',
  'Leo': '♌',
  'Virgo': '♍',
  'Libra': '♎',
  'Scorpio': '♏',
  'Sagittarius': '♐',
  'Capricorn': '♑',
  'Aquarius': '♒',
  'Pisces': '♓',
};
```

Render as an SVG `<text>` element centred on the moon:

```xml
<text
  x="[moon centre X]"
  y="[moon centre Y]"
  text-anchor="middle"
  dominant-baseline="central"
  font-size="28"
  fill="rgba(255, 255, 255, 0.7)"
  filter="url(#zodiac-3d)"
>
  ♈
</text>
```

---

## Step 3: Create 3D embossed effect

Add an SVG `<filter>` definition inside the compass SVG `<defs>` to create a 3D embossed look — as if the zodiac symbol is pressed into the moon surface:

```xml
<filter id="zodiac-3d" x="-20%" y="-20%" width="140%" height="140%">
  <!-- Dark shadow below/right for depth -->
  <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.6)" flood-opacity="0.6" />
  <!-- Light highlight above for emboss effect -->
  <feDropShadow dx="0" dy="-1" stdDeviation="1" flood-color="rgba(255,255,255,0.25)" flood-opacity="0.25" />
  <!-- Purple ambient glow -->
  <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="rgba(192,132,252,0.3)" flood-opacity="0.3" />
</filter>
```

If the SVG `<filter>` with multiple `feDropShadow` doesn't chain properly, use a simpler approach with CSS filter on a foreignObject or just use a single `feDropShadow` for the main shadow + set the text fill to a slight gradient:

```
fill: rgba(220, 220, 240, 0.75)
filter: drop-shadow(0 2px 3px rgba(0,0,0,0.6)) drop-shadow(0 0 8px rgba(192,132,252,0.3))
```

The key requirement: the symbol must look **3D and embossed**, not flat text. It should feel like it's carved into or glowing from within the moon surface.

---

## Step 4: Keep existing moon info text

Do NOT change:
- "Aries" text above the moon — keep as is
- "Waxing Crescent · 4%" text below the moon — keep as is
- The moon phase rendering itself (the lit/dark crescent) — keep as is

---

## What NOT to change

- Seal ring — do not touch
- Tone symbol on compass — do not touch
- Kin info below compass — do not touch
- Declaration card — do not touch
- Bottom sheet modals — do not touch
- Other views — do not touch
- Engine/tests — do not touch

---

## Verification checklist

- [ ] No blurry white smudge on the moon (seal overlay removed)
- [ ] Zodiac symbol visible and centred on the moon (e.g., ♈ for Aries)
- [ ] Symbol has 3D embossed appearance (shadow + highlight + glow)
- [ ] Symbol is clearly readable against the moon surface
- [ ] Moon phase crescent still renders correctly behind the symbol
- [ ] "Aries" text above and "Waxing Crescent · 4%" below still showing
- [ ] `npm run build` — zero errors
- [ ] `npm run test` — all pass
