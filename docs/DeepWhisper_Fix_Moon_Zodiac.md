# DeepWhisper — Fix Moon Zodiac Symbol & Remove Smudge (megathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

After all changes, run npm run dev and WAIT for me to visually confirm at localhost:3000 before committing or pushing to git.

---

## Fix 1: Remove grey smudge on moon

There is still a grey/white blurry element behind the zodiac symbol on the moon. Find ALL of these and DELETE them:
- Any `<img>` element overlaying the moon (old seal PNG overlay)
- Any `<foreignObject>` with a background colour
- Any element with `mix-blend-mode: screen` on the moon
- Any element with low opacity creating a grey/white haze
- Any `<rect>` or background shape behind the zodiac symbol

The ONLY things rendered on the moon should be:
1. The moon phase crescent (the existing lit/dark path rendering)
2. The zodiac text symbol
3. Nothing else

---

## Fix 2: Zodiac symbol styling

The zodiac symbol currently looks generic with a purple/grey background box. Remove the box and make it a clean premium glyph:

- Remove ANY background rectangle, container, box, or wrapper around the symbol
- Remove any `backgroundColor`, `background`, `fill` on a rect behind it
- The symbol is a plain SVG `<text>` element sitting directly on the moon surface

Exact styles:
```
font-size: 30px
font-family: Georgia, Times New Roman, serif
fill: white
opacity: 0.85
filter: drop-shadow(0 2px 3px rgba(0,0,0,0.5))
text-anchor: middle
dominant-baseline: central
```

NO background box. NO rect. NO foreignObject wrapper with background. NO purple tint behind it.

The symbol should look like a clean white glyph floating elegantly on the moon surface — same quality as the zodiac signs in the Astrara app.

---

## What NOT to change

- Seal ring — do not touch
- Tone symbol — do not touch  
- Moon info text (Aries above, Waxing Crescent below) — do not touch
- Kin info below compass — do not touch
- Bottom sheets — do not touch
- Other views — do not touch
- Engine/tests — do not touch

---

## Checklist

- [ ] No grey/white smudge on the moon
- [ ] No background box behind the zodiac symbol
- [ ] Zodiac symbol is clean white with subtle shadow, no container
- [ ] Moon phase crescent still renders correctly
- [ ] `npm run build` — zero errors
- [ ] `npm run test` — all pass
