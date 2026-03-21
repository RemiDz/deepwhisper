# DeepWhisper — Compact Kin Detail Section

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: ultrathink

## Problem

The Kin number (e.g. "102") is displayed in a massive font size that dominates the page and pushes the energy intensity component and declaration section off screen. Too much vertical space is wasted on the Kin detail area between the navigation buttons and the energy intensity component.

## Fix

Redesign the Kin detail section to be **compact** — everything on fewer lines, no giant hero number. The wheel already communicates the Kin visually, so the text below just needs to be informative, not dramatic.

### New layout (top to bottom, compact):

```
Kin 102 · White Spectral Wind          <-- single line, Kin number + name together
Tone 11 · Spectral                      <-- smaller, muted
Dissolve · Release · Liberation         <-- action words, muted
[Taurus] [Waxing Crescent] [8%]        <-- tags row (keep as is)
```

### Specific changes:

1. **Remove the giant Kin number** — no more standalone "102" in 48px+ font
2. **Combine Kin number and name on one line**: "Kin 102 · White Spectral Wind" in ~18-20px font, the Kin name in the seal's Dreamspell colour
3. **Tone info line**: "Tone 11 · Spectral" with the tone icon, in ~13px muted text
4. **Action words line**: "Dissolve · Release · Liberation" in ~13px muted text
5. **Tags row**: keep the Taurus / Waxing Crescent / 8% tags as they are
6. **Remove any duplicate lines or excessive spacing**

The total vertical space for this section should be roughly **80-100px** instead of the current ~180-200px. This frees up screen real estate for the energy intensity component and declaration to be visible without scrolling.

### Spacing:
- Gap between nav buttons and Kin info: 12px
- Gap between lines within the Kin info: 4px
- Gap between Kin info and tags: 8px
- Gap between tags and energy intensity: 12px

## DO NOT

- Do NOT modify the wheel or gear components
- Do NOT modify the energy intensity component
- Do NOT modify the declaration section
- Do NOT modify the Learn tab or Daily tab
- Do NOT remove any information — just make it compact

## Quality Checks

- [ ] Kin number and name appear on one line (e.g. "Kin 102 · White Spectral Wind")
- [ ] No giant standalone number taking up vertical space
- [ ] Kin name text uses the seal's Dreamspell colour
- [ ] Tone info and action words visible on separate lines in smaller muted text
- [ ] Tags row still present
- [ ] Total Kin detail section height is ~80-100px
- [ ] Energy intensity glass tubes visible on screen without scrolling (on 667px viewport)
- [ ] `git push origin master:main` succeeds
