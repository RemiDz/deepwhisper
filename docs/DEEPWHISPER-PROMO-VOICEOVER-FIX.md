# DeepWhisper /promo — Voiceover Script Generator Fixes

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

**Thinking level: megathink**

---

## Context

The voiceover script generator on `deepwhisper.app/promo` has three issues that need fixing:

1. **SAFETY: The AI hallucinates dangerous frequency/instrument prescriptions.** It generates lines like "try 1185 Hz on a Tibetan singing bowl before bed" — this is unsafe (most Tibetan bowls are 100–900 Hz range), irresponsible, and makes us look unprofessional to practitioners who know better. The sound healing frequency/instrument data in the system prompt is aspirational — the proper mapping tables don't exist yet. Until they do, the AI must NOT prescribe specific frequencies or instruments.

2. **AUDIENCE MISMATCH: The scripts prescribe instruments that TikTok viewers don't own.** Only a tiny percentage of TikTok users have singing bowls. Telling them to "try X Hz on a Tibetan singing bowl" adds zero value. The scripts should speak to *experience* — how the energy feels, what to notice, what intentions to set — not prescribe specific tools.

3. **MISSING DURATION SELECTOR: The voiceover generator is locked to ~40 seconds.** The Lunata promo page (`lunata.app/promo`) has a duration selector with options: 15s (~35-40 words), 20s (~50-55 words), 30s (~75-80 words), 45s (~110-120 words), 60s (~155-165 words). DeepWhisper's promo page needs the same selector.

---

## Step 1: Find the voiceover generator code

Search the DeepWhisper codebase for:
- The `/promo` page component
- The voiceover script generator section
- The Claude API call (system prompt + user message)
- The Style selector (Story / Alert / Insight)
- The "Start with attention hook" toggle
- The "GENERATE VOICEOVER SCRIPT" button

The codebase is at the project root. The promo page is likely at `src/app/promo/page.tsx` or similar.

---

## Step 2: Remove ALL frequency and instrument prescriptions from the system prompt

Find the Claude API system prompt used for voiceover script generation. Remove or rewrite any instructions that tell the AI to:
- Suggest specific Hz frequencies
- Recommend specific instruments (singing bowls, gongs, monochords, etc.)
- Prescribe sound healing protocols or tools
- Reference the `SOUND HEALING` data block in any way that leads to tool prescriptions

### Replace with this constraint block (add to the system prompt):

```
SOUND HEALING REFERENCES — STRICT RULES:
- You must NEVER suggest specific frequencies (e.g. "try 432 Hz", "listen to 1185 Hz").
- You must NEVER recommend specific instruments (e.g. "use a Tibetan singing bowl", "try a crystal bowl").
- You must NEVER prescribe sound healing protocols or tools. Our audience is TikTok — most viewers do not own instruments.
- Instead, reference EXPERIENTIAL qualities of the daily energy: how it feels in the body, what emotions might surface, what dreams might carry, what intentions align with today's Kin.
- You MAY use poetic/metaphorical sound language like "today carries a low hum of transformation" or "this energy vibrates with clarity" — but NEVER specific Hz values or instrument names.
- If sound healing data is provided in the Dreamspell data block, use it only to inform the FEELING and QUALITY of your writing — never to make direct tool recommendations.
```

### Also remove or comment out the SOUND HEALING block from the user message template

Find where the user message is assembled before being sent to the Claude API. It likely includes a block like:

```
SOUND HEALING:
- Frequency: {tone_frequency} Hz ({solfeggio_note})
- Instrument: {seal_instrument}
- Approach: {instrument_approach}
- Quality: {frequency_quality}
```

**Do NOT delete this data entirely** — it may be used elsewhere on the promo page (e.g. TikTok caption generation where it's shown as data, not as advice). Instead, either:
- Remove it from the voiceover script user message only, OR
- Keep it but add a wrapper instruction: `(FOR TONAL CONTEXT ONLY — do NOT mention these values directly in the script)`

---

## Step 3: Add duration selector UI

Add a duration selector to the voiceover script generator section, matching the Lunata promo page pattern exactly.

### Reference: Lunata's duration selector

Look at `lunata.app`'s promo page source code if available in a sibling directory (likely `../lunata.app/` or similar). The Lunata duration selector looks like this:

```
DURATION
┌──────────────────┐ ┌──────────────────┐
│ 15s (~35-40 words)│ │ 20s (~50-55 words)│  ← selected by default
└──────────────────┘ └──────────────────┘
┌──────────────────┐ ┌──────────────────┐
│ 30s (~75-80 words)│ │ 45s (~110-120 words)│
└──────────────────┘ └──────────────────┘
┌──────────────────────┐
│ 60s (~155-165 words) │
└──────────────────────┘
```

### Implementation

1. Add a `DURATION` label and button group above the Style selector (or below it — match Lunata's layout order).

2. Duration options (pill/chip buttons, single-select):

| Label | Words | Default |
|-------|-------|---------|
| `15s (~35-40 words)` | 35-40 | |
| `20s (~50-55 words)` | 50-55 | ✅ default |
| `30s (~75-80 words)` | 75-80 | |
| `45s (~110-120 words)` | 110-120 | |
| `60s (~155-165 words)` | 155-165 | |

3. Store the selected duration in component state.

4. Pass the selected word count range into the Claude API user message. Update the prompt to include:

```
TARGET LENGTH: Write approximately {min_words}-{max_words} words (~{duration} seconds when spoken aloud). The word count INCLUDES the signature opening ("Here's what the sky is doing.") and closing ("Stay aligned.") lines — adjust the body content length accordingly.
```

5. Update the word count / duration display below the generated script to reflect the selected duration target.

### Styling

- Match the existing Style selector (Story/Alert/Insight) button styling — same border radius, colours, hover states, selected state.
- Use the same chip/pill pattern already in the component.
- The `DURATION` label should match the `STYLE` label formatting.

---

## Step 4: Update the word count display

The script output currently shows something like `99 words · ~40s`. Update this to:
- Still show actual word count
- Show actual estimated duration (words ÷ 2.5 = seconds, roughly)
- Optionally show the target: e.g. `99 words · ~40s (target: 20s)`

---

## Step 5: Verify the signature hook still works

After all changes, verify that:
- Every generated script still opens with "Here's what the sky is doing."
- Every generated script still closes with "Stay aligned."
- The signature lines are included in the word count
- The duration selector correctly adjusts the output length
- No frequency values (Hz) appear anywhere in generated scripts
- No instrument names appear as recommendations in generated scripts

---

## Step 6: Test all combinations

Generate a test script for each combination to verify:
- 3 styles × 5 durations × 2 hook states = 30 combinations

You don't need to test all 30 — but at minimum test:
- Each duration at least once (verify word count matches target)
- Each style at least once (verify tone is correct)
- Hook ON vs OFF (verify hook behaviour)
- Confirm ZERO frequency/instrument prescriptions in ALL outputs

---

## Summary of changes

1. ✅ System prompt: Add strict "no frequencies, no instruments" constraint block
2. ✅ User message: Remove or contextualise the SOUND HEALING data block for voiceover scripts
3. ✅ UI: Add duration selector (15s/20s/30s/45s/60s) matching Lunata's pattern
4. ✅ API call: Pass selected duration/word count into the prompt
5. ✅ Output display: Update word count to reflect duration target
6. ✅ Verify: Signature hooks intact, no unsafe content, correct lengths
