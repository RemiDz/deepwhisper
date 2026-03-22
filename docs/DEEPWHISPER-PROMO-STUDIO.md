# DeepWhisper — /promo Content Studio (TikTok + Voiceover Generator)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Overview

Build a hidden `/promo` page on `deepwhisper.app` — a personal content studio for generating TikTok captions and ElevenLabs voiceover scripts based on the daily Dreamspell / 13 Moon calendar data.

This page mirrors the exact same pattern already working on `lunata.app/promo` — same UI structure, same card format, same copy buttons, same voiceover generator with styles. The only difference is the DATA SOURCE: instead of planetary positions / lunar data, this uses the Dreamspell Kin system (daily Kin, tone, seal, wavespell, castle, and 13 Moon date).

The `/promo` route should NOT appear in any navigation, sitemap, or be discoverable by users.

---

## DATA SOURCE — Dreamspell / 13 Moon Calendar

Use the existing Kin calculation engine already built in the DeepWhisper app. Before calling the Claude API, compute and assemble the following data for TODAY:

### Daily Kin Data:
```
- Kin number (1–260)
- Solar Seal name (e.g. "Red Dragon", "White Wind", "Blue Night", etc.)
- Solar Seal number (1–20)
- Tone number (1–13) + Tone name (e.g. "Magnetic", "Lunar", "Electric", etc.)
- Tone keywords (Purpose / Challenge / Action — e.g. "Purpose: Unify · Attract · Purpose")
- Seal keywords (e.g. "Nurtures · Birth · Being")
- Seal colour (Red / White / Blue / Yellow)
- Guide Kin (today's guide power — seal + tone)
- Antipode Kin (challenge/strengthening)
- Analog Kin (support)
- Occult Kin (hidden power)
- Current Wavespell (which seal powers the current 13-day wavespell + what day of the wavespell is it)
- Current Castle (which of the 5 castles are we in + what day of the castle)
- Earth Family (Gateway / Polar / Core / Cardinal / Signal)
```

### 13 Moon Date:
```
- Moon name + number (e.g. "Lunar Moon" = Moon 2 of 13)
- Day of the Moon (1–28)
- 13 Moon date formatted (e.g. "Lunar Moon Day 14")
- Gregorian date for reference
```

### Upcoming Events (next 14 days):
```
- Days until next Wavespell change (+ which seal takes over)
- Days until next Castle change (if within range)
- Days until Galactic New Year (July 26) if within 30 days
- Any notable Kin coming up (e.g. Kin 1 Red Magnetic Dragon, portal days, galactic activation portals)
- Is today a Galactic Activation Portal day? (flag if yes)
```

### Sound Healing Connection (DeepWhisper's differentiator):
```
- Recommended frequency for today's tone (map from existing tone-frequency data)
- Recommended instrument for today's seal (map from existing seal-instrument data)
- Sound healing suggestion (e.g. "Tone 6: Rhythmic — 396 Hz — Singing Bowl — grounding pulse")
```

If any of these mappings don't exist yet in the codebase, create a simple data file with reasonable defaults:

**Tone → Frequency mapping (13 tones):**
```typescript
const TONE_FREQUENCIES: Record<number, { hz: number; solfeggio: string; quality: string }> = {
  1:  { hz: 174, solfeggio: "—", quality: "Foundation" },
  2:  { hz: 285, solfeggio: "—", quality: "Polarity" },
  3:  { hz: 396, solfeggio: "UT", quality: "Activation" },
  4:  { hz: 417, solfeggio: "RE", quality: "Definition" },
  5:  { hz: 432, solfeggio: "—", quality: "Centre" },
  6:  { hz: 528, solfeggio: "MI", quality: "Balance" },
  7:  { hz: 639, solfeggio: "FA", quality: "Resonance" },
  8:  { hz: 741, solfeggio: "SOL", quality: "Integration" },
  9:  { hz: 852, solfeggio: "LA", quality: "Intention" },
  10: { hz: 963, solfeggio: "TI", quality: "Manifestation" },
  11: { hz: 1074, solfeggio: "—", quality: "Liberation" },
  12: { hz: 1185, solfeggio: "—", quality: "Cooperation" },
  13: { hz: 1296, solfeggio: "—", quality: "Transcendence" },
}
```

**Seal → Instrument mapping (20 seals):**
```typescript
const SEAL_INSTRUMENTS: Record<number, { instrument: string; element: string; approach: string }> = {
  1:  { instrument: "Monochord", element: "Water", approach: "Deep sustained drone" },
  2:  { instrument: "Crystal Singing Bowl", element: "Air", approach: "Breath-synced toning" },
  3:  { instrument: "Tibetan Singing Bowl", element: "Water", approach: "Dream induction" },
  4:  { instrument: "Tuning Fork", element: "Fire", approach: "Seed point activation" },
  5:  { instrument: "Didgeridoo", element: "Earth", approach: "Serpent breath grounding" },
  6:  { instrument: "Gong", element: "Water", approach: "Surrender wash" },
  7:  { instrument: "Crystal Singing Bowl", element: "Fire", approach: "Accomplishment tones" },
  8:  { instrument: "Monochord", element: "Air", approach: "Harmonic layering" },
  9:  { instrument: "Tibetan Singing Bowl", element: "Water", approach: "Purification pulses" },
  10: { instrument: "Gong", element: "Earth", approach: "Manifestation crescendo" },
  11: { instrument: "Crystal Singing Bowl", element: "Air", approach: "Clarity frequencies" },
  12: { instrument: "Tuning Fork", element: "Water", approach: "Complex harmonic weaving" },
  13: { instrument: "Didgeridoo", element: "Earth", approach: "Navigation rhythm" },
  14: { instrument: "Monochord", element: "Air", approach: "Wisdom drone meditation" },
  15: { instrument: "Gong", element: "Fire", approach: "Vision quest crescendo" },
  16: { instrument: "Tibetan Singing Bowl", element: "Earth", approach: "Warrior pulse rhythm" },
  17: { instrument: "Crystal Singing Bowl", element: "Water", approach: "Earth attunement" },
  18: { instrument: "Tuning Fork", element: "Air", approach: "Mirror frequency reflection" },
  19: { instrument: "Gong", element: "Fire", approach: "Storm release crescendo" },
  20: { instrument: "Monochord", element: "Fire", approach: "Solar illumination drone" },
}
```

NOTE: These are starter mappings. Remi (the creator) will refine them later. For now, use these as defaults.

---

## SECTION 1: TikTok Caption Generator

### UI Layout

Same card-based layout as `lunata.app/promo`:

```
┌──────────────────────────────────────────┐
│  🌀 DeepWhisper — Galactic TikTok Content │
│                                           │
│  Today: Kin 142 — Blue Crystal Wind       │
│  Tone 12: Crystal · Cooperation · Dedicate│
│  Wavespell: Blue Monkey (Day 12 of 13)    │
│  Castle: Blue Western Castle of Burning   │
│  13 Moon: Lunar Moon Day 14               │
│  🔮 Galactic Activation Portal: YES       │
│  🔊 Sound: 1185 Hz · Crystal Singing Bowl │
│                                           │
│  [ 🌀 GENERATE DEEPWHISPER CONTENT ]      │
│                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │ Var. 1  │ │ Var. 2  │ │ Var. 3  │     │
│  │         │ │         │ │         │     │
│  │ Title   │ │ Title   │ │ Title   │     │
│  │ Lines   │ │ Lines   │ │ Lines   │     │
│  │ Desc    │ │ Desc    │ │ Desc    │     │
│  │         │ │         │ │         │     │
│  │[Copy T] │ │[Copy T] │ │[Copy T] │     │
│  │[Copy L] │ │[Copy L] │ │[Copy L] │     │
│  │[Copy D] │ │[Copy D] │ │[Copy D] │     │
│  │[Copy A] │ │[Copy A] │ │[Copy A] │     │
│  └─────────┘ └─────────┘ └─────────┘     │
└──────────────────────────────────────────┘
```

### Claude API System Prompt for TikTok Captions:

```
You are a grounded Dreamspell / 13 Moon calendar content writer for TikTok. You write SHORT, punchy, factual content that connects the daily Kin energy to collective human experience and personal growth.

Your tone is calm, observational, and slightly mystical but always GROUNDED — never fluffy, never generic new-age language. You speak as someone who understands the system deeply and translates it for curious newcomers.

ASTRONOMICAL ACCURACY — HIGHEST PRIORITY RULE:
You are provided with computed Dreamspell data. This data is the SINGLE SOURCE OF TRUTH. Every claim you make about Kin numbers, seal names, tone names, wavespells, and castles must match the provided data exactly. Do NOT guess or approximate any Dreamspell values.

Style reference:
"Kin 142. Blue Crystal Wind. The 12th tone asks: what have you dedicated yourself to? Wind carries the answer."
"Day 12 of the Blue Monkey wavespell. The trickster is almost done teaching. Tomorrow, a new cycle begins."

Rules:
- Lead with the most compelling Kin data point (the seal + tone combination, where we are in the wavespell, GAP day status)
- Connect the daily energy to something people FEEL — restlessness, clarity, resistance, breakthroughs
- Always include the Kin number, seal name, and tone name
- If it's a Galactic Activation Portal day, lead with that — it's a big deal
- If approaching a Wavespell or Castle change, build anticipation
- Include the sound healing connection naturally (frequency, instrument) as a unique angle — this is what NO other Dreamspell account offers
- Use emoji sparingly (🌀 for Kin, 🔮 for GAP days, 🔊 for sound healing)
- Never mention any app or product. Pure awareness content.
- No "manifesting" or "abundance" language. Keep it real.

Include 8-12 relevant hashtags at the end of the description. Include: #dreamspell #13mooncalendar #galactickin #kin[NUMBER] #[sealname] #[tonename] #soundhealing #cosmicfrequency #galactictime #naturaltime
```

### Claude API User Message Format:

```
Today is {gregorian_date}. Here is the current Dreamspell data:

KIN: {kin_number} — {seal_colour} {tone_name} {seal_name}
TONE: {tone_number} — {tone_name} — Keywords: {tone_keywords}
SEAL: {seal_number} — {seal_name} — Keywords: {seal_keywords}
COLOUR: {seal_colour}
GUIDE: {guide_kin}
ANTIPODE: {antipode_kin}
ANALOG: {analog_kin}
OCCULT: {occult_kin}

WAVESPELL: {wavespell_seal} Wavespell — Day {day_of_wavespell} of 13
CASTLE: {castle_name} — Day {day_of_castle} of 52
EARTH FAMILY: {earth_family}
13 MOON DATE: {moon_name} Day {day_of_moon}
GALACTIC ACTIVATION PORTAL: {yes/no}

SOUND HEALING:
- Frequency: {tone_frequency} Hz ({solfeggio_note})
- Instrument: {seal_instrument}
- Approach: {instrument_approach}
- Quality: {frequency_quality}

UPCOMING:
- Next Wavespell: {seal_name} Wavespell starts in {X} days
- Next Castle: {castle_name} starts in {X} days (if within 14 days)
- Galactic New Year: {days_until} days away (if within 30 days)
- Next GAP day: in {X} days

Generate 3 variations of TikTok content. Each variation must include:

1. TITLE: A single punchy hook line (max 15 words). Large text overlay for top of video. ALL CAPS.

2. CAPTION_LINES: 3-5 short lines (each max 12 words). Bottom overlay text, revealed one at a time. Use emoji sparingly.

3. DESCRIPTION: A 3-5 sentence TikTok description paragraph that expands on the Kin energy, connects it to collective experience, and includes the sound healing angle. Include 8-12 relevant hashtags at the end.

Format your response as JSON:
{
  "variations": [
    {
      "title": "...",
      "caption_lines": ["line 1", "line 2", "line 3"],
      "description": "... #hashtag1 #hashtag2"
    }
  ]
}

Respond ONLY with the JSON. No preamble, no markdown backticks.
```

---

## SECTION 2: Voiceover Script Generator (ElevenLabs)

### UI Layout

Place this below the TikTok caption section. Same layout as the Astrara voiceover generator:

```
┌──────────────────────────────────────────┐
│  🎙️ DeepWhisper — Voiceover Script       │
│                                           │
│  STYLE:                                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │  Story  │ │  Alert  │ │ Insight │     │
│  └─────────┘ └─────────┘ └─────────┘     │
│                                           │
│  ○ Start with attention hook              │
│                                           │
│  [ 🎙️ GENERATE VOICEOVER SCRIPT ]        │
│                                           │
│  ┌────────────────────────────────────┐   │
│  │                                    │   │
│  │  Here's what the sky is doing.     │   │
│  │  [Generated script body...]        │   │
│  │  Stay aligned.                     │   │
│  │                                    │   │
│  │  94 words · ~36s                   │   │
│  │                                    │   │
│  │  [Copy Script]    [Regenerate]     │   │
│  └────────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

### Claude API System Prompt for Voiceover Scripts:

```
You are a grounded Dreamspell narrator for TikTok voiceovers. You write scripts that sound natural when spoken aloud — conversational, flowing, with strategic pauses (marked with "...").

SIGNATURE HOOK — MANDATORY ON EVERY SCRIPT:
- The script MUST always begin with exactly: "Here's what the sky is doing."
- The script MUST always end with exactly: "Stay aligned."
- These two lines are the channel's sonic branding. They never change regardless of style or topic.
- The word count target (~90 words, ~35 seconds) INCLUDES these two signature lines.
- The body content between the opening and closing should be ~80 words to keep total length at ~90 words.

ASTRONOMICAL ACCURACY — HIGHEST PRIORITY:
You are provided with computed Dreamspell data. This is the SINGLE SOURCE OF TRUTH. Every Kin number, seal name, tone name, wavespell, and castle claim must match the provided data exactly.

STYLES:

Story: Weave the daily Kin into a narrative. "Today the Blue Crystal Wind is asking you to dedicate your words to something real..." Personal, flowing, uses "you" language. Connect the Kin energy to something the listener might be experiencing.

Alert: Urgent, punchy, news-style. "Kin 142. Blue Crystal Wind. Tone 12 just activated." Short sentences. Data-forward. State what's happening, what it means, what's coming next. Hit hard, hit fast.

Insight: Reflective, thoughtful. "There's a reason today feels like you need to talk things through..." Start with the feeling, then reveal the Dreamspell data behind it. End with a sound healing recommendation — "528 Hz on a crystal singing bowl would ground this energy."

ATTENTION HOOK (when toggle is ON):
After "Here's what the sky is doing." add ONE punchy hook sentence before the main body. Examples:
- "Today's Kin hasn't appeared since 260 days ago."
- "We're on day 12 of a 13-day cycle. The finale is tomorrow."
- "This is a Galactic Activation Portal day. The veil is thin."
Reduce body to ~70 words to stay within ~90 word total.

Rules:
- Include the Kin number, seal name, and tone name
- Reference where we are in the wavespell (day X of 13)
- Include the sound healing angle when it fits naturally (frequency + instrument)
- Use pauses (...) for dramatic effect — these scripts are SPOKEN
- Never mention any app or product
- No "manifesting" or "abundance" language
```

### Claude API User Message Format:

```
Today is {gregorian_date}. Here is the current Dreamspell data:

[SAME DATA BLOCK AS TIKTOK SECTION]

Generate a voiceover script in {STYLE} style.
Attention hook: {ON/OFF}

The script must:
- Open with "Here's what the sky is doing."
- Close with "Stay aligned."
- Be approximately 90 words (~35 seconds spoken)
- Sound natural when read aloud
- Use "..." for natural pauses

Respond with ONLY the script text. No JSON, no formatting, no preamble.
```

---

## API ROUTE

Create a Next.js API route at `/api/generate-content` (or add to existing API route pattern used in the app):

```typescript
// /api/generate-content/route.ts (App Router) or /pages/api/generate-content.ts (Pages Router)

// Match whichever router pattern the DeepWhisper app already uses.

// Accept POST with:
// {
//   type: "tiktok" | "voiceover",
//   style?: "story" | "alert" | "insight",  // voiceover only
//   hook?: boolean,                           // voiceover only
//   kinData: { ... all the computed Dreamspell data }
// }

// Call Claude API (Anthropic) with the appropriate system prompt + user message
// API key should be in environment variable: ANTHROPIC_API_KEY (or CLAUDE_API_KEY — match existing convention)
// Model: claude-sonnet-4-20250514
// Max tokens: 1024

// Return the response to the client
```

Check if the app already has a Claude API route (from the Galactic Blueprint PDF or other features). If so, extend it rather than creating a duplicate.

---

## STYLING

- Match the existing DeepWhisper app theme exactly (dark background, accent colours from the app)
- Section headers: use the app's accent colour (check existing CSS variables)
- Cards: dark glass/card style consistent with the rest of the app
- Generate buttons: prominent, accent colour
- Loading state: spinner or skeleton while waiting for API response
- Error state: retry button with error message
- Copy buttons: show "Copied ✓" feedback for 2 seconds
- Responsive: 3 cards side by side on desktop, stack vertically on mobile

---

## iOS SAFARI FIX

For any date/time inputs (if used), add these CSS rules:
```css
input[type="date"], input[type="time"] {
  -webkit-appearance: none;
  appearance: none;
  min-width: 0;
}
```

---

## BUILD AND DEPLOY

```bash
npm run build
git add -A
git commit -m "feat: add /promo content studio — TikTok captions + voiceover script generator with Dreamspell data and sound healing"
git push origin master:main
```

---

## TESTING CHECKLIST

- [ ] `/promo` route loads without errors
- [ ] Main app routes still work (no breaking changes)
- [ ] Today's Kin data displays correctly in the summary header
- [ ] Sound healing frequency + instrument display correctly
- [ ] TikTok generator produces 3 variations with title, lines, and description
- [ ] All Copy buttons work (Copy Title, Copy Lines, Copy Desc, Copy All)
- [ ] Voiceover generator produces scripts in all 3 styles (Story, Alert, Insight)
- [ ] Every voiceover script starts with "Here's what the sky is doing."
- [ ] Every voiceover script ends with "Stay aligned."
- [ ] Attention hook toggle works (ON adds hook sentence, OFF goes straight to body)
- [ ] Word count displays correctly and stays in 85–95 range
- [ ] Copy Script button works
- [ ] Regenerate button produces a new script
- [ ] GAP day status is flagged correctly
- [ ] Kin number, seal, and tone match the actual Dreamspell date
- [ ] No console errors
- [ ] Works on mobile Safari
- [ ] `/promo` is NOT linked from any navigation

---

## NOTES

- Do NOT modify any existing pages or features in the app
- The `/promo` page is a NEW route added alongside existing routes
- Use the existing Kin calculation engine — do NOT rebuild the Dreamspell math
- The tone-frequency and seal-instrument mappings are STARTER data. Create them as a separate data file that's easy to edit later.
- If the app already has a Claude API integration, reuse the same pattern and API key env variable
