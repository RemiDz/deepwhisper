# DeepWhisper — 13 Moons Below-Grid Content (ultrathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

After all changes, run npm run dev and WAIT for me to visually confirm at localhost:3000 before committing or pushing to git.

---

## Task: Fill the empty space below the 28-day calendar grid with educational and practical content about the current 13 Moon month.

The content should help newcomers understand what the calendar is showing and why it matters to their daily life. Write in warm, accessible language — not academic or overly mystical. Think of it as a knowledgeable friend explaining the cosmic weather.

---

## Section 1: "About This Moon" card

A glass-morphism card with the current moon's deeper meaning:

### Header:
- Moon icon (small) + "About the [Moon Name]" (e.g. "About the Solar Moon")
- Subtitle: The moon's question (already shown at top, e.g. "How do I attain my purpose?")

### Content (generate dynamically based on current moon data):

Each of the 13 Moons has a unique theme. Use this data to populate the content:

```typescript
const MOON_TEACHINGS: Record<number, { theme: string; guidance: string; practice: string }> = {
  1:  { theme: "Purpose & Unity", guidance: "The Magnetic Moon opens the galactic year. This is a time for setting intentions and clarifying your purpose. What do you want to attract into your life this year?", practice: "Set one clear intention for the 28-day cycle. Write it down and revisit it daily." },
  2:  { theme: "Challenge & Polarity", guidance: "The Lunar Moon reveals duality and contrast. What obstacles stand between you and your purpose? This moon asks you to identify the challenge so you can stabilize your path.", practice: "Journal about what feels in tension or opposition in your life right now." },
  3:  { theme: "Service & Activation", guidance: "The Electric Moon is about bonding through service. How can your gifts serve others? This is a time of activation — the spark that ignites your purpose into action.", practice: "Offer your skills or time in service to someone or something you believe in." },
  4:  { theme: "Form & Definition", guidance: "The Self-Existing Moon asks: what form will your purpose take? This is a time for planning, measuring, and defining the structure that will carry your vision.", practice: "Create a concrete plan or framework for your intention." },
  5:  { theme: "Radiance & Empowerment", guidance: "The Overtone Moon is about stepping into your power. Command your resources and radiate your purpose outward. You have everything you need.", practice: "Take bold action. Share your work, speak your truth, lead by example." },
  6:  { theme: "Balance & Organisation", guidance: "The Rhythmic Moon brings equality and organic balance. Organise your life so that all parts receive attention — body, mind, spirit, relationships, work.", practice: "Reorganise one area of your life that feels out of balance." },
  7:  { theme: "Attunement & Channeling", guidance: "The Resonant Moon is mystical — it asks you to listen deeply. Channel inspiration from within. This is a time for meditation, creativity, and aligning with your inner voice.", practice: "Spend time in silence daily. Let insights come to you rather than chasing them." },
  8:  { theme: "Integrity & Harmony", guidance: "The Galactic Moon asks: are you living in alignment with what you believe? Model integrity. Harmonise your actions with your values.", practice: "Examine where your actions don't match your beliefs. Adjust one thing." },
  9:  { theme: "Intention & Realisation", guidance: "The Solar Moon pulses with the power to realise your vision. Your intention from Moon 1 is now ready to manifest. This is the time of greater light and mobilising energy.", practice: "Take decisive action toward your biggest goal. The energy supports manifestation now." },
  10: { theme: "Manifestation & Perfection", guidance: "The Planetary Moon is about producing results. What have you manifested? This moon asks you to perfect your creations and bring them into the world.", practice: "Complete a project. Finish what you started. Share your results." },
  11: { theme: "Liberation & Release", guidance: "The Spectral Moon dissolves what no longer serves you. Release attachments, habits, relationships, or beliefs that block your growth. Freedom comes through letting go.", practice: "Identify one thing to release. Let it go consciously and ceremonially." },
  12: { theme: "Cooperation & Dedication", guidance: "The Crystal Moon is about community and collaboration. Dedicate yourself to shared purpose. Cooperate, communicate, and universalise your gifts.", practice: "Gather with others. Share ideas, collaborate on a project, strengthen community bonds." },
  13: { theme: "Presence & Transcendence", guidance: "The Cosmic Moon completes the cycle. Endure, transcend, and be fully present. You have traveled the full 13-moon journey. What wisdom have you gained?", practice: "Reflect on the entire year's journey. Celebrate your growth and prepare for renewal." },
};
```

### Layout:
```
┌─────────────────────────────────────┐
│  🌙 About the Solar Moon            │
│  "How do I attain my purpose?"      │
│                                     │
│  THEME: Intention & Realisation     │
│                                     │
│  The Solar Moon pulses with the     │
│  power to realise your vision...    │
│  [2-3 sentences of guidance]        │
│                                     │
│  DAILY PRACTICE                     │
│  Take decisive action toward your   │
│  biggest goal...                    │
│                                     │
└─────────────────────────────────────┘
```

Card styling: dark glass-morphism (`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4`)

---

## Section 2: "What's Coming Up" card

A card showing notable upcoming dates within this 28-day moon:

### Content to calculate dynamically:
- **GAP days** (Galactic Activation Portals) — highlight which days in this moon are GAP days. Show as: "Day 5 (Mar 11) — GAP Day: Portal of intensified energy"
- **Wavespell transitions** — when a new wavespell begins during this moon: "Day 12 (Mar 18) — New Wavespell: Yellow Seed begins"
- **Castle transitions** — if the current moon spans a castle boundary
- **Day Out of Time** — if this moon includes July 25th

### Layout:
```
┌─────────────────────────────────────┐
│  ⚡ What's Coming Up                │
│                                     │
│  Day 18 (Mar 23) · GAP Day          │
│  Portal of intensified energy       │
│                                     │
│  Day 21 (Mar 26) · Wavespell Shift  │
│  Red Earth wavespell begins         │
│                                     │
│  Day 25 (Mar 30) · GAP Day          │
│  Portal of intensified energy       │
│                                     │
└─────────────────────────────────────┘
```

If there are no notable dates remaining in this moon, show: "No major galactic events remaining this moon."

---

## Section 3: "Understanding the 13 Moon Calendar" — collapsible explainer

A small expandable section for newcomers:

### Collapsed state:
```
ℹ️ New to the 13 Moon Calendar?  ˅
```

### Expanded content (static text):
```
The 13 Moon calendar is a natural time system based on
the moon's 28-day cycle. Unlike the Gregorian calendar
with its irregular months (28-31 days), each of the 13
Moons has exactly 28 days — 4 perfect weeks.

Combined with the 260-day Tzolkin (galactic spin), each
day carries a unique energy called a Kin. Your daily Kin
is shown in each cell above — the coloured icon is the
Solar Seal and the number is the Kin number.

The 13 Moon calendar helps you:
• Sync with natural cycles instead of artificial time
• Track your personal energy patterns across the year
• Connect with a global community of practitioners

The current moon's question (shown at the top) is your
guiding theme for these 28 days.
```

---

## Spacing and order

Below the existing "Solar · Pulse · Realise · Intention" tone text:

1. About This Moon card — `mt-6`
2. What's Coming Up card — `mt-4`
3. New to 13 Moon Calendar? collapsible — `mt-4 mb-24`

The `mb-24` ensures content doesn't get hidden behind the tab bar.

---

## What NOT to change

- The 28-day grid above — do not touch
- Moon navigator (arrows, name, dates) — do not touch
- The tone colour bar — do not touch
- Other views — do not touch
- Engine/tests — do not touch

---

## Checklist

- [ ] "About This Moon" card shows with correct moon theme and guidance
- [ ] Content changes when navigating to different moons (arrow buttons)
- [ ] "What's Coming Up" shows real GAP days and wavespell transitions for this moon
- [ ] "New to 13 Moon Calendar" section expands/collapses on tap
- [ ] Content is readable and doesn't overflow on 375px viewport
- [ ] Bottom tab bar doesn't cover any content
- [ ] `npm run build` — zero errors
- [ ] `npm run test` — all pass
