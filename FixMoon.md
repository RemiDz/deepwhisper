Two fixes on the moon:

1. Remove ALL moon surface texture elements from MoonPhase.tsx: delete the maria circles (rgba(160,155,140,0.12)), the highlight ellipse (rgba(240,236,225,0.15)), the lit-side craters (rgba(160,155,140,0.1)), the dark-side craters (rgba(180,175,160,0.04)), and the earthshine ring (rgba(180,175,160,0.06)). Keep ONLY the base circle, the lit crescent path, and the rim stroke. The moon should be clean and smooth — just a dark circle with a lit crescent, no surface details.

2. The zodiac icon has a purple background square behind it. Remove any background, rect, container, backgroundColor, or wrapper that creates a coloured box behind the zodiac SVG glyph. The zodiac symbol should be white/light coloured with NO background box, floating directly on the moon surface.

Do not change anything else. Run npm run dev and wait.