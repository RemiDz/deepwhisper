# DeepWhisper Phase 2 — Premium Features, Content & Infrastructure (gigathink)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

Phase 1 is complete: the app has a working Dreamspell engine (52/52 tests pass), four views (Today, My Kin, 13 Moons, Wavespell), authentic seal PNG icons, real-time moon data, and a deep space dark aesthetic deployed at deepwhisper.app.

Phase 2 adds the features that make this a real product: the premium PDF, the TikTok content studio, sound healing data, bilingual support, and production infrastructure.

---

## Step 1: Sound healing frequency mapping data

### src/lib/dreamspell/soundHealing.ts

Create the sound healing data layer. This maps frequencies, instruments, and healing protocols to each seal and tone. This data is NOT displayed prominently — it appears in detail views and powers the premium PDF.

```typescript
export interface SealSoundProfile {
  sealIndex: number;           // 0-19
  frequency: number;           // Hz — primary resonant frequency
  note: string;                // Musical note (e.g., 'C#4', 'F3')
  chakra: string;              // Associated chakra
  chakraColour: string;        // Chakra colour hex
  instruments: string[];       // Recommended instruments
  quality: string;             // Sound quality description (e.g., 'Flowing, purifying')
  duration: number;            // Suggested session duration in minutes
  bodyArea: string;            // Body area focus
}

export interface ToneSoundProfile {
  toneNumber: number;          // 1-13
  interval: string;            // Musical interval (e.g., 'Unison', 'Perfect Fifth')
  ratio: string;               // Frequency ratio (e.g., '1:1', '3:2')
  quality: string;             // Sound quality description
  bowlNote: string;            // Suggested crystal bowl note
}
```

Create the full mapping for all 20 seals. Use these associations (based on sound healing traditions and chakra correspondences):

```
Dragon (0):    396 Hz, G4, Root, Red, [Tibetan bowl, Drum], 'Grounding, nurturing', 20 min, Lower body
Wind (1):      417 Hz, G#4, Throat, Blue, [Crystal bowl, Flute], 'Clearing, communicating', 15 min, Throat/chest
Night (2):     432 Hz, A4, Third Eye, Indigo, [Crystal bowl, Monochord], 'Dreaming, intuiting', 25 min, Head
Seed (3):      444 Hz, A4+, Sacral, Orange, [Crystal bowl, Chimes], 'Activating, targeting', 15 min, Lower abdomen
Serpent (4):   528 Hz, C5, Root/Sacral, Red-Orange, [Didgeridoo, Drum], 'Vital, instinctive', 20 min, Spine
Worldbridger (5): 285 Hz, D4, Heart, Green-White, [Gong, Tibetan bowl], 'Releasing, equalising', 20 min, Heart centre
Hand (6):      174 Hz, F3, Root, Red, [Monochord, Tibetan bowl], 'Healing, knowing', 30 min, Hands/arms
Star (7):      639 Hz, E5, Heart, Green, [Crystal bowl, Harp], 'Harmonising, beautifying', 20 min, Heart
Moon (8):      741 Hz, F#5, Throat, Blue, [Crystal bowl F#, Singing], 'Purifying, flowing', 22 min, Throat/emotions
Dog (9):       852 Hz, A5, Heart, Pink-Green, [Crystal bowl, Voice], 'Loving, opening', 15 min, Heart centre
Monkey (10):   963 Hz, B5, Crown, Violet, [Crystal bowl, Bells], 'Playful, awakening', 13 min, Crown
Human (11):    480 Hz, B4, Solar Plexus, Yellow, [Monochord, Crystal bowl], 'Empowering, free', 20 min, Solar plexus
Skywalker (12): 512 Hz, C5, All, White, [Gong, Crystal bowl], 'Expanding, exploring', 20 min, Full body
Wizard (13):   136.1 Hz, C#3, Third Eye, Indigo, [Monochord, Tibetan bowl], 'Timeless, enchanting', 30 min, Pineal
Eagle (14):    448 Hz, A4, Third Eye, Indigo, [Crystal bowl, Flute], 'Visionary, creating', 20 min, Eyes/head
Warrior (15):  256 Hz, C4, Solar Plexus, Yellow, [Drum, Didgeridoo], 'Questioning, strengthening', 18 min, Core
Earth (16):    7.83 Hz, Schumann, Root, Red-Brown, [Drum, Monochord], 'Grounding, navigating', 25 min, Feet/legs
Mirror (17):   384 Hz, G4, Third Eye, Silver, [Crystal bowl, Gong], 'Reflecting, clarifying', 20 min, Mind
Storm (18):    768 Hz, G5, All, Violet-Blue, [Gong, Drum], 'Catalysing, transforming', 15 min, Full body
Sun (19):      126.22 Hz, C3, Crown, Gold, [Crystal bowl, Gong], 'Illuminating, enlightening', 20 min, Crown
```

Create the 13 tone interval mappings:

```
Tone 1 (Magnetic):     Unison (1:1), 'Unity, single point', C
Tone 2 (Lunar):        Minor Second (16:15), 'Tension, polarity', C#
Tone 3 (Electric):     Major Second (9:8), 'Activating, stepping', D
Tone 4 (Self-existing): Minor Third (6:5), 'Structure, melancholy', Eb
Tone 5 (Overtone):     Major Third (5:4), 'Radiant, commanding', E
Tone 6 (Rhythmic):     Perfect Fourth (4:3), 'Balanced, stable', F
Tone 7 (Resonant):     Tritone (45:32), 'Tension, attunement', F#
Tone 8 (Galactic):     Perfect Fifth (3:2), 'Harmony, integrity', G
Tone 9 (Solar):        Minor Sixth (8:5), 'Pulsing, yearning', Ab
Tone 10 (Planetary):   Major Sixth (5:3), 'Manifesting, warm', A
Tone 11 (Spectral):    Minor Seventh (16:9), 'Dissolving, releasing', Bb
Tone 12 (Crystal):     Major Seventh (15:8), 'Cooperating, almost resolved', B
Tone 13 (Cosmic):      Octave (2:1), 'Transcendence, completion', C (octave)
```

### Update bottom sheet detail views

When a user taps on a Kin detail (in any view), the bottom sheet should include an expandable "Sonic prescription" section at the bottom:

- Collapsed by default — shows just a small music note icon and "Sonic prescription" text
- Tap to expand: shows frequency, note, instrument suggestions, duration, and body area
- Styled subtly — this is secondary information, not the main focus
- Uses the sound healing data from the module above

---

## Step 2: Premium Galactic Blueprint PDF

### Install dependencies

```bash
npm install jspdf --save
```

### src/lib/pdf/galacticBlueprint.ts

Create a PDF generation function that produces a premium personalised report. The PDF should be 15-25 pages with:

**Page 1: Cover**
- "GALACTIC BLUEPRINT" title
- Person's Kin number (large)
- Full galactic title (e.g., "Blue Cosmic Night")
- Seal icon (embed the PNG)
- "deepwhisper.app" branding
- Generation date

**Page 2-3: Your galactic signature**
- Full description of the person's solar seal (power, action, essence, meaning)
- Full description of their galactic tone (action, power, essence)
- Their colour family and what it means
- Their direction and its significance

**Page 4-5: Your destiny oracle**
- Guide seal: full description and what it means as a guide
- Analog seal: full description as supportive energy
- Antipode seal: full description as challenge/growth
- Occult seal: full description as hidden power
- How the oracle works together

**Page 6-7: Your wavespell**
- Which wavespell they belong to
- The 13-day journey description
- Their position in the wavespell
- What the initiating seal means for their cycle

**Page 8: Your castle**
- Which castle their Kin falls in
- Castle meaning and direction
- How the castle frames their life energy

**Page 9: Your Earth family**
- Which of the 5 Earth families they belong to (Gateway, Polar, Cardinal, Core, Signal)
- The 4 seals in their family
- What the family role means

**Page 10-11: Your colour family**
- Red, White, Blue, or Yellow
- The 5 seals of their colour
- The directional meaning

**Page 12-13: Your sonic healing protocol (THE DIFFERENTIATOR)**
- Based on the sound healing data
- Their seal's frequency, note, and instruments
- Their tone's musical interval
- A suggested daily sound healing practice:
  - Duration (from seal data)
  - Frequency to use
  - Instrument recommendations
  - Body area focus
  - Best time of day (morning for Eastern/Red, midday for Southern/Yellow, evening for Western/Blue, night for Northern/White)
- "Combine your seal frequency ([X] Hz) with your tone interval ([interval]) for your personal galactic resonance"

**Page 14-15: Your galactic year**
- Current 13 Moon year bearer
- What year energy they're in
- The 13-year cycle position

**Final page: About**
- "Generated by Deep Whisper — 13 Moon Galactic Calendar"
- "deepwhisper.app"
- "Part of the Harmonic Waves ecosystem"
- Date generated

### PDF styling
- Dark theme matching the app (dark backgrounds, light text)
- Use the seal colours for accents
- Clean, premium feel — generous whitespace, clear typography
- Embed seal PNG icons where relevant
- Page numbers at bottom

### PDF generation route

Create `src/app/api/generate-blueprint/route.ts` as a Next.js API route:

- Accepts POST with `{ birthDate: string }` (ISO date)
- Calculates full Kin data, oracle, wavespell, castle, etc.
- Generates PDF using jsPDF
- Returns the PDF as a blob for download

### Wire up the "Galactic Blueprint" button on My Kin page

- When user taps "Galactic Blueprint" on their signature card:
  - Show a loading state ("Generating your blueprint...")
  - Call the API route
  - Download the PDF
  - For now this is FREE — payment integration comes later
  - Add a note: "Preview — full premium version coming soon"

---

## Step 3: /promo — Social content studio

### src/app/promo/page.tsx

Hidden route (not in navigation) for generating TikTok/Instagram content. This is Remi's content creation tool.

**Daily Kin Card Generator:**
- Shows today's Kin as a beautiful shareable card (optimised for 1080×1920 TikTok/story or 1080×1080 square)
- Card includes: Kin number, seal name + icon, tone, oracle cross, moon phase + sign, the affirmation text
- "deepwhisper.app" watermark
- Export button that captures the card as a PNG image (use html2canvas or similar)
- Option to switch between story format (9:16) and square format (1:1)

**TikTok caption generator:**
- Auto-generates a caption for today's Kin
- Factual data focus (Remi's preference — planetary positions, transits, not poetic/promotional)
- Format:
  ```
  🌀 Kin [number] — [Full title]
  
  Tone [n] [name]: [action] · [power] · [essence]
  Seal: [name] — [power] · [action]
  
  🌙 Moon: [phase name] in [zodiac sign] ([illumination]%)
  📅 [Moon name] · Day [n] of 28
  🏰 [Castle name] — [quality]
  
  Oracle: Guide [seal] · Analog [seal] · Antipode [seal] · Occult [seal]
  
  #dreamspell #13mooncalendar #galacticsignature #kin[number] #[sealname] #deepwhisper
  ```
- Copy button to clipboard

**Weekly Kin Preview:**
- Shows the next 7 days of Kin data as a compact list
- Each day: date, Kin number, title, tone keywords
- Export as image for carousel posts

### Install html2canvas for card export

```bash
npm install html2canvas-pro --save
```

Use `html2canvas-pro` (the maintained fork) for capturing DOM elements as images.

---

## Step 4: /sell — Sales playbook route

### src/app/sell/page.tsx

Hidden route with sales information and talking points for the Galactic Blueprint product.

Content sections:

**Product overview:**
- What the Galactic Blueprint is (personalised 15-25 page PDF)
- What's included (seal analysis, oracle deep-dive, sonic healing protocol)
- Why it's unique (sound healing + Dreamspell — no one else does this)

**Pricing:**
- Placeholder: "Price TBD — currently in preview"
- Suggested pricing tiers to consider:
  - Basic Blueprint: £9.99 (Kin analysis + oracle)
  - Full Blueprint with Sonic Healing: £19.99 (everything including sound protocol)
  - Couples/Combined Kin Blueprint: £29.99 (two people + relationship analysis)

**Talking points for TikTok sales:**
- "Did you know your birthday gives you a galactic signature?"
- "Your Kin has a personal sound healing frequency"
- "The Dreamspell calendar reveals your cosmic identity"
- "Get your personalised Galactic Blueprint at deepwhisper.app"

**Testimonial placeholders:**
- Space for future testimonials once sales begin

Style this page cleanly — it's a reference for Remi, not a public-facing page.

---

## Step 5: EN/LT bilingual support

### src/lib/i18n/translations.ts

Create a translation system with English and Lithuanian. Use a simple key-value approach:

```typescript
export type Locale = 'en' | 'lt';

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    'app.name': 'Deep Whisper',
    'app.subtitle': '13 Moon Galactic Calendar',
    'nav.today': 'Today',
    'nav.myKin': 'My Kin',
    'nav.moons': '13 Moons',
    'nav.wavespell': 'Wavespell',
    'today.solarMoon': 'Solar Moon',
    'today.day': 'Day',
    'today.wavespell': 'Wavespell',
    'today.castle': 'Castle',
    'today.spin': 'Spin',
    'today.milestone': 'Milestone',
    'today.tapOracle': 'Tap for today\'s oracle',
    'myKin.title': 'Discover your Kin',
    'myKin.subtitle': 'Enter your birth date to reveal your galactic signature',
    'myKin.reveal': 'Reveal my Kin',
    'myKin.share': 'Share my Kin',
    'myKin.blueprint': 'Galactic Blueprint',
    'myKin.another': 'Calculate another',
    'myKin.signature': 'Galactic Signature',
    'myKin.feb29.title': '0.0 Hunab Ku',
    'myKin.feb29.message': 'In the Dreamspell system, February 29 has no Kin. Choose your galactic birthday:',
    'myKin.feb29.option1': 'Use February 28',
    'myKin.feb29.option2': 'Use March 1',
    'moons.question': 'How do I attain my purpose?',
    'wavespell.power': 'Power of',
    'wavespell.of': 'of',
    'oracle.guide': 'Guide',
    'oracle.analog': 'Analog',
    'oracle.antipode': 'Antipode',
    'oracle.occult': 'Occult',
    'oracle.destiny': 'Destiny',
    'sound.title': 'Sonic prescription',
    'sound.frequency': 'Frequency',
    'sound.instruments': 'Instruments',
    'sound.duration': 'Duration',
    'sound.bodyArea': 'Body focus',
    'moon.phase': 'Moon phase',
    'moon.sign': 'Moon sign',
    'moon.illumination': 'Illumination',
    // ... add all UI strings
  },
  lt: {
    'app.name': 'Deep Whisper',
    'app.subtitle': '13 Mėnulių Galaktinis Kalendorius',
    'nav.today': 'Šiandien',
    'nav.myKin': 'Mano Kin',
    'nav.moons': '13 Mėnulių',
    'nav.wavespell': 'Bangų Burtai',
    'today.solarMoon': 'Saulės Mėnulis',
    'today.day': 'Diena',
    'today.wavespell': 'Bangų Burtai',
    'today.castle': 'Pilis',
    'today.spin': 'Sukimasis',
    'today.milestone': 'Etapas',
    'today.tapOracle': 'Palieskite orakulą',
    'myKin.title': 'Atraskite savo Kin',
    'myKin.subtitle': 'Įveskite gimimo datą ir sužinokite savo galaktinį parašą',
    'myKin.reveal': 'Atskleisti mano Kin',
    'myKin.share': 'Dalintis mano Kin',
    'myKin.blueprint': 'Galaktinis Planas',
    'myKin.another': 'Skaičiuoti kitą',
    'myKin.signature': 'Galaktinis Parašas',
    'myKin.feb29.title': '0.0 Hunab Ku',
    'myKin.feb29.message': 'Dreamspell sistemoje vasario 29 d. neturi Kin. Pasirinkite savo galaktinę gimimo dieną:',
    'myKin.feb29.option1': 'Naudoti vasario 28 d.',
    'myKin.feb29.option2': 'Naudoti kovo 1 d.',
    'moons.question': 'Kaip pasiekti savo tikslą?',
    'wavespell.power': 'Galia',
    'wavespell.of': 'iš',
    'oracle.guide': 'Vedlys',
    'oracle.analog': 'Analogas',
    'oracle.antipode': 'Antipodas',
    'oracle.occult': 'Okultinis',
    'oracle.destiny': 'Likimas',
    'sound.title': 'Garso receptas',
    'sound.frequency': 'Dažnis',
    'sound.instruments': 'Instrumentai',
    'sound.duration': 'Trukmė',
    'sound.bodyArea': 'Kūno zona',
    'moon.phase': 'Mėnulio fazė',
    'moon.sign': 'Mėnulio ženklas',
    'moon.illumination': 'Apšvietimas',
    // ... mirror all EN keys
  }
};
```

### src/lib/i18n/useTranslation.ts

Create a React hook:

```typescript
// Uses localStorage to persist language preference
// Returns { t: (key: string) => string, locale: Locale, setLocale: (locale: Locale) => void }
// Falls back to English if key not found
```

### Language toggle

Add a small language toggle to the app header or settings:
- Two-letter pills: "EN | LT"
- Tapping switches language
- Persist in localStorage
- Position: top-right corner of the header area, small and unobtrusive

### Apply translations

Replace all hardcoded UI strings across all components with `t('key')` calls. The Dreamspell-specific terms (seal names, tone names, etc.) can remain in English as they are proper nouns in the system. Translate:
- All navigation labels
- All section headings
- All button labels
- All explanatory text
- All placeholder text
- Moon phase names
- Castle names and qualities
- Earth family names

The seal names (Dragon, Wind, etc.), tone names (Magnetic, Lunar, etc.), and Kin titles stay in English — these are Dreamspell terminology.

---

## Step 6: PWA manifest and meta

### public/manifest.json

```json
{
  "name": "Deep Whisper — 13 Moon Galactic Calendar",
  "short_name": "DeepWhisper",
  "description": "Your daily galactic signature. Dreamspell 13 Moon calendar with real-time moon data.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#080812",
  "theme_color": "#080812",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Generate app icons

Create simple app icons using the Dragon seal (Kin 1) or a stylised moon/compass symbol:
- Use a deep purple (#1a1a2e) background with the compass or moon in the centre
- Generate at 192px and 512px sizes
- Create maskable versions with extra padding (safe zone)
- Save to /public/

### Update layout.tsx metadata

```typescript
export const metadata: Metadata = {
  title: 'Deep Whisper — 13 Moon Galactic Calendar',
  description: 'Your daily galactic signature. Dreamspell 13 Moon calendar with real-time moon phase, zodiac sign, and personalised sound healing.',
  manifest: '/manifest.json',
  themeColor: '#080812',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DeepWhisper',
  },
  openGraph: {
    title: 'Deep Whisper — 13 Moon Galactic Calendar',
    description: 'Discover your galactic signature. Dreamspell calendar with real-time moon data and sound healing.',
    url: 'https://deepwhisper.app',
    siteName: 'Deep Whisper',
    type: 'website',
  },
};
```

### Add apple-touch-icon to head

```html
<link rel="apple-touch-icon" href="/icon-192.png" />
```

---

## Step 7: Plausible analytics

### Add Plausible script to layout.tsx

Add to the `<head>` section:

```html
<script defer data-domain="deepwhisper.app" src="https://plausible.io/js/script.js"></script>
```

### Track key events

Add Plausible custom event tracking for:
- `kin-calculated` — when someone calculates their Kin on the My Kin page
- `blueprint-generated` — when someone generates a Galactic Blueprint PDF
- `share-kin` — when someone taps the Share button
- `view-promo` — when someone accesses the /promo page

Use `window.plausible` function call:
```typescript
if (typeof window !== 'undefined' && (window as any).plausible) {
  (window as any).plausible('kin-calculated', { props: { kin: kinNumber } });
}
```

---

## Step 8: Deploy and verify

```bash
git add -A
git commit -m "DeepWhisper Phase 2: Galactic Blueprint PDF, promo studio, sound healing, EN/LT, PWA

- Sound healing frequency mapping for all 20 seals and 13 tones
- Galactic Blueprint PDF generation (jsPDF) with sonic healing protocol
- /promo TikTok content studio with daily Kin card export and caption generator
- /sell sales playbook route
- Full EN/LT bilingual support with language toggle
- PWA manifest with app icons
- Plausible analytics integration with custom events
- Sonic prescription expandable section in Kin detail views"

git push origin master:main
```

## Quality checklist

- [ ] `npm run build` — zero errors
- [ ] All 52 existing tests still pass
- [ ] Galactic Blueprint PDF generates and downloads correctly
- [ ] PDF contains all sections (cover, seal, tone, oracle, wavespell, castle, sound healing, year)
- [ ] PDF seal icons render (PNGs embedded)
- [ ] /promo page loads with daily Kin card
- [ ] /promo card exports as PNG image
- [ ] /promo caption generator produces correct data
- [ ] /sell page loads with all content sections
- [ ] Language toggle switches between EN and LT
- [ ] All UI strings translate correctly
- [ ] PWA manifest is valid (check in Chrome DevTools → Application)
- [ ] App can be installed to home screen on mobile
- [ ] Plausible script loads (check network tab)
- [ ] Sound healing data appears in Kin detail bottom sheets
- [ ] No new TypeScript errors
- [ ] No console errors
- [ ] Existing views (Today, My Kin, 13 Moons, Wavespell) still work correctly
