# DeepWhisper /promo — Remove Unsafe Frequency Prescriptions from TikTok Caption Generator

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

**Thinking level: ultrathink**

---

## Context

The voiceover script generator on `/promo` was already fixed to never suggest specific Hz frequencies or instrument names. However, the **TikTok caption generator** (the content cards with TITLE / CAPTION_LINES / DESCRIPTION) still has the same problem — it generates lines like "try 1185 Hz on a Tibetan singing bowl" which is unsafe and irrelevant to TikTok audiences.

This prompt applies the exact same safety constraint to the caption generation system.

---

## Step 1: Find the TikTok caption generator code

Search the DeepWhisper codebase for the Claude API call that generates the TikTok content cards (not the voiceover scripts — that's already fixed). Look for:
- The system prompt that produces TITLE / CAPTION_LINES / DESCRIPTION JSON
- The user message template that assembles Dreamspell data for caption generation
- Any references to the `SOUND HEALING` data block being passed to this prompt
- The "Generate" button for TikTok captions (separate from the voiceover generator)

---

## Step 2: Add frequency/instrument constraint to the caption system prompt

Find the system prompt for TikTok caption generation. Add this constraint block (same as the voiceover fix):

```
SOUND HEALING REFERENCES — STRICT RULES:
- You must NEVER suggest specific frequencies (e.g. "try 432 Hz", "listen to 1185 Hz").
- You must NEVER recommend specific instruments (e.g. "use a Tibetan singing bowl", "try a crystal bowl", "play a gong").
- You must NEVER prescribe sound healing protocols or tools. Our audience is TikTok — most viewers do not own instruments.
- Instead, reference EXPERIENTIAL qualities of the daily energy: how it feels in the body, what emotions might surface, what dreams might carry, what intentions align with today's Kin.
- You MAY use poetic/metaphorical sound language like "today carries a low hum of transformation" or "this energy vibrates with clarity" — but NEVER specific Hz values or instrument names.
- If sound healing data is provided in the Dreamspell data block, use it ONLY to inform the FEELING and QUALITY of your writing — never to make direct tool recommendations to viewers.
```

---

## Step 3: Update the user message template for captions

Find where the Dreamspell data is assembled into the user message for caption generation. If it includes a SOUND HEALING block like:

```
SOUND HEALING:
- Frequency: {tone_frequency} Hz ({solfeggio_note})
- Instrument: {seal_instrument}
- Approach: {instrument_approach}
- Quality: {frequency_quality}
```

Either:
- **Option A (preferred):** Keep the block but wrap it with: `SOUND HEALING (FOR TONAL/EMOTIONAL CONTEXT ONLY — do NOT mention these values directly in captions):`
- **Option B:** Remove the block entirely from the caption user message.

---

## Step 4: Verify

Generate a test set of TikTok captions and confirm:
- ZERO Hz frequency values appear in any TITLE, CAPTION_LINE, or DESCRIPTION
- ZERO instrument names appear as recommendations (singing bowl, gong, crystal bowl, monochord, etc.)
- The content still references the Dreamspell energy in an experiential, feeling-based way
- Hashtags like #soundhealing and #cosmicfrequency are still fine — those are discovery tags, not prescriptions

---

## Summary

1. ✅ Caption system prompt: Add strict "no frequencies, no instruments" constraint block
2. ✅ Caption user message: Wrap or remove SOUND HEALING data block
3. ✅ Verify: No unsafe content in generated captions
