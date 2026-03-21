# DeepWhisper Phase 4 — Daily Reading Tab ("Today's Energy")

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: gigathink

## Overview

Create a new **"Today's Energy"** tab (or replace the existing Today detail area below the wheel) that presents a flowing, article-style daily cosmic reading. This is NOT a card-based layout — it's a beautifully typeset, scrollable editorial page like a magazine article or newspaper feature.

The content is built from **pre-written templates already in the app's data** (from the Anton Kornblum Dreamspell trilogy books that were previously loaded). The 20 seal descriptions, 13 tone descriptions, 260 Galactic Prosperity Declarations, oracle relationships, and five phases of self-mastery are all available in the existing data files. Pull from these.

The reading combines dynamically based on today's Kin to produce a unique daily page for each of the 260 Kins.

---

## Design Philosophy

- **Newspaper/magazine article feel** — flowing prose, not cards or boxes
- **Dyslexia-friendly** — short paragraphs (2-3 sentences max), generous line height, clear visual breaks between sections
- **Dark aesthetic** matching the app — dark background, light text, seal colour accents
- **One continuous scroll** — no tabs or accordions within the page
- **Minimal UI chrome** — the content IS the design, accented by colour bars, the seal icon, and subtle section dividers
- **Simple language** — write for someone who's never heard of the Dreamspell but also deep enough for experienced practitioners

---

## Page Structure (top to bottom)

### 1. Headline Block

At the top, display:
- The seal icon (from `/public/icons/`) as a 48px rounded-square tile
- "KIN {number}" as a small label above
- "{Colour} {Tone} {Seal}" as the main headline (e.g. "White Spectral Wind")
- A thin horizontal accent line in the seal's Dreamspell colour below

### 2. Seal Energy Section

A 2-3 sentence paragraph explaining what this seal's energy means for today. Written in warm, accessible second person ("Today carries the energy of White Wind — the breath of spirit...").

**Content source:** Pull from the existing seal data in the app. Each of the 20 seals has:
- Action (what it does)
- Power (what it brings)
- Essence (what it embodies)
- A description from Book 2 of the trilogy

Weave these into natural prose. The paragraph should feel like it's speaking directly to the reader about what this energy means in their daily life.

Example tone (NOT the exact text to use — generate from the actual seal data):
> "Today carries the energy of White Wind — the breath of spirit, communication, and truth. Wind is the cosmic messenger. When this seal is active, ideas arrive as whispers. Pay attention to what comes through you today, not just what comes from you."

### 3. Tone Energy Section

A 2-3 sentence paragraph explaining what this tone's creative phase means. How does the tone shape and modify the seal energy?

**Content source:** Pull from the existing tone data. Each of the 13 tones has:
- Creative power/action
- Essence
- A description from Book 2 of the trilogy
- Position in the wavespell wave (beginning, middle, peak, dissolving, etc.)

Example tone:
> "The tone shaping this energy is Spectral — tone 11, the dissolving force. This is not a day for building. Spectral energy liberates. It asks you to release what no longer serves."

### 4. Declaration Quote

Display today's Galactic Prosperity Declaration in a styled blockquote with a left border in the seal's colour. These are the 260 unique declarations from Book 3.

**Content source:** The 260 declarations are already loaded in the app data. Each Kin has a unique declaration following the pattern:
> "I {tone action} in order to {seal action}. {Tone essence} {seal power}, I seal the {seal essence} of {seal power keyword} with the {tone name} tone of {tone essence}. I am guided by {guide power}."

Style: italic text, left border accent (3px) in the active seal's Dreamspell colour, subtle background.

### 5. Oracle Section

A flowing prose section explaining the four oracle powers for today's Kin. NO table or grid — write each oracle relationship as a short paragraph.

**Oracle calculation (algorithmic from Kin number):**

The Destiny Oracle has four powers beyond the main seal:
- **Guide** — calculated from the tone number and seal index
- **Analog (Support)** — fixed partner seal
- **Antipode (Challenge)** — fixed partner seal  
- **Occult (Hidden Power)** — fixed partner seal

Use the existing oracle calculation functions already in the app.

Write each oracle power as a 1-2 sentence paragraph with the seal name highlighted in its Dreamspell colour:

Section heading: "THE ORACLE" (small caps style, muted colour)

> "Your guide today is Wind itself — a doubled power. When a seal guides itself, the energy is amplified and undiluted."
>
> "Your support comes from Red Earth — grounding, navigation, synchronicity. Even as you release, Earth keeps your feet on the path."
>
> "Your challenge is Blue Storm — transformation, catalysis. Can you release gently rather than destructively?"
>
> "Your hidden power is Yellow Human — free will, wisdom. Beneath the dissolution, your inner wisdom grows."

### 6. Cycle Position Section

A compact reference showing where today sits in the larger cycles:

Section heading: "WHERE YOU ARE IN THE CYCLE" (small caps)

Three inline groups:
- **Wavespell:** name + "Day X of 13"
- **Castle:** name + position
- **Tzolkin:** "Kin X of 260" + percentage

Below these, a thin progress bar showing the Tzolkin position (kin/260) in purple.

### 7. Five Phases of Self-Mastery

From Anton's framework, show which of the five phases today's seal falls in:

The 20 seals map to 5 phases (4 seals each):
1. **Re-awakening** (Seals 1-4: Dragon, Wind, Night, Seed)
2. **Reconnecting** (Seals 5-8: Serpent, Worldbridger, Hand, Star)
3. **Integrating** (Seals 9-12: Moon, Dog, Monkey, Human)
4. **Expanding** (Seals 13-16: Skywalker, Wizard, Eagle, Warrior)
5. **Re-generating** (Seals 17-20: Earth, Mirror, Storm, Sun)

Show the current phase name with a 1-2 sentence description of what this phase means in the personal growth journey. Pull the descriptions from the Book 1 data already in the app.

### 8. Sound Healing Prescription

Section heading: "SOUND HEALING" (small caps)

A 2-3 sentence paragraph describing which instruments and techniques align with today's energy. This combines the seal (which instruments) with the tone (how to play them).

**Seal → Instrument Mapping:**

| Seal | Primary Instruments | Body/Chakra Focus |
|------|-------------------|-------------------|
| Dragon | Gong, frame drum | Root, primal |
| Wind | Didgeridoo, overtone singing | Throat, breath |
| Night | Crystal bowls (deep), ocean drum | Third eye, dreams |
| Seed | Tuning forks, chimes | Crown, intention |
| Serpent | Monochord (KOTAMO), body drums | Sacral, kundalini |
| Worldbridger | Tibetan singing bowls, bells | Heart, transition |
| Hand | Crystal bowls (hands-on), body work | Hands, healing |
| Star | Crystal bowls (high), kalimba | Solar plexus, harmony |
| Moon | Ocean drum, rain stick, water sounds | Sacral, emotions |
| Dog | Singing bowls (warm tones), harmonium | Heart, love |
| Monkey | Kalimba, tongue drum, playful percussion | Throat, play |
| Human | Voice/chanting, harmonium | All chakras, free will |
| Skywalker | Didgeridoo, drone instruments | Root to crown, expansion |
| Wizard | Crystal bowls, Tibetan bowls (layered) | Third eye, receptivity |
| Eagle | Flute, high overtones | Third eye, vision |
| Warrior | Frame drum, djembe, strong rhythm | Solar plexus, courage |
| Earth | Monochord, grounding tones | Root, Earth connection |
| Mirror | Crystal bowls (reflective), silence | Third eye, clarity |
| Storm | Gong (building), thunder drum | All chakras, transformation |
| Sun | Crystal bowls (all), full sound bath | Crown, enlightenment |

**Tone → Playing Style Mapping:**

| Tone | Playing Style |
|------|-------------|
| 1 Magnetic | Set a clear intention before playing. Single sustained tone to begin. |
| 2 Lunar | Play two contrasting sounds. Explore polarity — high/low, loud/soft. |
| 3 Electric | Activate with rhythm. Three strikes or pulses to awaken energy. |
| 4 Self-existing | Build a structured sound sequence. Four-part pattern, grounding. |
| 5 Overtone | Play with power and resonance. Let overtones ring fully. |
| 6 Rhythmic | Create balanced, rhythmic patterns. Equal time for sound and silence. |
| 7 Resonant | Channel and sustain. Let the vibration build and hold at the centre. |
| 8 Galactic | Layer harmonics. Combine multiple instruments or frequencies. |
| 9 Solar | Play with full intention and presence. Pulse nine times. |
| 10 Planetary | Perfect the tone. Aim for the purest, clearest sound possible. |
| 11 Spectral | Release and let go. Let notes decay naturally. Do not hold or control. |
| 12 Crystal | Share sound with others. Group practice or community sound bath. |
| 13 Cosmic | Transcend technique. Free improvisation, surrender to the sound. |

Below the paragraph, show instrument/technique tags as small pills.

### 9. Yoga Practice Prescription

Section heading: "YOGA PRACTICE" (small caps)

A 2-3 sentence paragraph describing the yoga practice that aligns with today's energy. Combines seal (body focus, pose types) with tone (intensity, style).

**Seal → Yoga Focus Mapping:**

| Seal | Yoga Focus | Key Poses/Flow |
|------|-----------|----------------|
| Dragon | Grounding, root connection | Child's pose, malasana, earth salutations |
| Wind | Breath-focused, pranayama | Nadi shodhana, ujjayi breathing, camel pose |
| Night | Restorative, dream-like | Yoga nidra, supported fish, legs up the wall |
| Seed | Intention setting, core | Seated meditation, boat pose, tree pose |
| Serpent | Kundalini, spine | Cat-cow, cobra, spinal twists |
| Worldbridger | Heart opening, release | Bridge, supported backbends, savasana |
| Hand | Healing, gentle flow | Slow vinyasa, hands-to-heart, healing mudras |
| Star | Balance, harmony | Dancer, half moon, star pose |
| Moon | Fluid, emotional release | Moon salutations, hip openers, pigeon |
| Dog | Heart-centred, devotion | Heart openers, puppy pose, camel |
| Monkey | Playful, creative | Arm balances, inversions, free movement |
| Human | Intuitive, self-guided | Free flow practice, follow your body |
| Skywalker | Expansive, reaching | Sun salutations (extended), warrior series |
| Wizard | Receptive, stillness | Long-hold yin poses, seated meditation |
| Eagle | Vision, focus | Eagle pose, gazing meditation, headstand |
| Warrior | Strong, courageous | Warrior I, II, III, power flow |
| Earth | Grounding, stability | Mountain, tree, standing balances |
| Mirror | Reflective, symmetry | Mirror-image flows, forward folds |
| Storm | Dynamic, transformative | Power vinyasa, breath of fire, dynamic flow |
| Sun | Full practice, illumination | Complete sun salutation sequence, full practice |

**Tone → Practice Intensity Mapping:**

| Tone | Practice Style |
|------|--------------|
| 1 Magnetic | Gentle start. Set intention with opening meditation. |
| 2 Lunar | Explore opposites — stretch left then right, forward then back. |
| 3 Electric | Energising practice. Move with purpose and activation. |
| 4 Self-existing | Structured sequence. Hold each pose for 4 breaths. |
| 5 Overtone | Build power. Focus on strength and resonance in each pose. |
| 6 Rhythmic | Balanced flow. Equal effort and rest. Rhythmic breathing. |
| 7 Resonant | Sustained holds. Find the centre point and stay there. |
| 8 Galactic | Layer practices — combine breath, movement, and sound. |
| 9 Solar | Full energy practice. Move with complete presence. |
| 10 Planetary | Perfect alignment. Focus on precision in each pose. |
| 11 Spectral | Yin/restorative. Let go. Surrender into each pose. |
| 12 Crystal | Partner or group yoga. Share the practice. |
| 13 Cosmic | Free movement. No structure. Let the body lead. |

Below the paragraph, show practice tags as small pills (same style as sound healing tags).

---

## Data Architecture

The daily reading page should:

1. **Calculate today's Kin** using the existing Kin calculation engine in the app
2. **Look up seal data** from the existing seal data files (loaded from the books)
3. **Look up tone data** from the existing tone data files
4. **Look up the declaration** from the existing 260 declarations data
5. **Calculate the oracle** using the existing oracle functions
6. **Calculate wavespell/castle position** using existing functions
7. **Look up the five-phase position** from the seal index (Math.floor((sealIndex) / 4))
8. **Build sound healing prescription** by combining the seal instrument map + tone style map (these are NEW data — add them as a data file)
9. **Build yoga prescription** by combining the seal yoga map + tone intensity map (these are NEW data — add them as a data file)

For items 8 and 9, create new data files:
- `src/data/soundHealing.ts` — exports seal instrument mappings and tone playing style mappings
- `src/data/yogaPractice.ts` — exports seal yoga focus mappings and tone intensity mappings

Each mapping should include:
```typescript
interface SealPrescription {
  instruments?: string[];  // for sound healing
  poses?: string[];        // for yoga
  bodyFocus: string;
  description: string;     // 1-2 sentences about this seal's relationship to the practice
}

interface TonePrescription {
  style: string;           // playing style or practice intensity
  description: string;     // 1-2 sentences about how this tone shapes the practice
}
```

The daily reading page combines: `sealPrescription.description + " " + tonePrescription.description` as the paragraph, and shows `sealPrescription.instruments` or `sealPrescription.poses` as pill tags below.

---

## Navigation

Add this as a new tab in the bottom navigation called **"Daily"** with a newspaper/article icon (a simple page/document SVG icon). It should link to `/daily`.

If there are already 5 tabs and space is tight, this could **replace** the current detail area below the wheel on the Today page — but ONLY if it makes more sense as an integrated scroll below the wheel rather than a separate tab. Use your judgement on which approach works better for the app's navigation flow.

---

## Styling Specifics

- **Body text:** 15-16px, line-height 1.7, colour: primary text colour from the app's theme
- **Section headings:** 12-13px, letter-spacing 1-2px, uppercase, muted colour — small caps newspaper style
- **Seal colour accent:** Use the Dreamspell colour of today's seal for:
  - The accent line below the headline
  - The left border of the declaration quote
  - Inline seal name highlights (coloured text with subtle coloured background)
- **Progress bar:** Purple (#c084fc) on dark background
- **Pill tags:** Small rounded pills with subtle coloured background (10% opacity of purple) and coloured text
- **Section dividers:** 1px line in border-tertiary colour, or just generous whitespace (2rem+)
- **Quote block:** Left border 3px in seal colour, italic text, slightly smaller font (14px), muted text colour

---

## Content Tone Guidelines

When generating the template text for each seal and tone:
- Write in warm, direct second person ("you", "your")
- Keep paragraphs to 2-3 sentences maximum
- Use simple, accessible language — no unexplained jargon
- Be specific and practical — "this is a day for..." rather than abstract philosophy
- Connect cosmic energy to everyday life — relationships, work, creativity, wellbeing
- The sound healing and yoga sections should give actionable guidance a practitioner can follow immediately

---

## Files to Create/Modify

1. **NEW: `src/app/daily/page.tsx`** — the daily reading page
2. **NEW: `src/data/soundHealing.ts`** — seal instrument + tone style mappings
3. **NEW: `src/data/yogaPractice.ts`** — seal yoga + tone intensity mappings
4. **MODIFY: `src/components/layout/TabBar.tsx`** — add Daily tab to navigation
5. **DO NOT modify** GearWheel.tsx, the moon centre, or the Learn tab

## Quality Checks

- [ ] Daily reading page renders with today's Kin data
- [ ] Seal icon displays correctly from /public/icons/
- [ ] Seal colour accent is used throughout (not hardcoded — dynamic per seal)
- [ ] Declaration displays correctly for today's Kin
- [ ] Oracle section shows all four powers with correct seal colour highlights
- [ ] Cycle position shows correct wavespell, castle, and Tzolkin data
- [ ] Five phases section shows the correct phase for today's seal
- [ ] Sound healing section shows instruments and playing style
- [ ] Yoga section shows poses/flow and practice intensity
- [ ] Pill tags render for both sound healing and yoga
- [ ] Page scrolls smoothly on mobile (375px)
- [ ] Dark aesthetic maintained
- [ ] No duplicate content with the Today page
- [ ] `git push origin master:main` succeeds
