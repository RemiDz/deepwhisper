# SUBLIMARA — Subliminal Intelligence for the Conscious Mind

## Harmonic Waves Ecosystem · sublimara.app (domain TBD)

---

## 1. VISION & POSITIONING

### Elevator Pitch
Sublimara is the world's most beautiful subliminal audio experience — a cinematic, TikTok-viral web app that lets anyone create, visualise, and share personalised subliminal affirmation sessions layered with binaural beats, healing frequencies, and ambient soundscapes. Built for the manifestation generation, designed for sound healing practitioners.

### Why This Is the Ecosystem Magnet
- **TikTok-first design**: Every screen is screen-recording-worthy. Mesmerising visuals that make people ask "what app is that?"
- **Zero friction**: No signup to try. PWA. Works everywhere.
- **Shareability**: Every session generates a unique shareable link with og:image preview
- **Education-first**: Teaches what subliminals actually are with interactive demos
- **Gateway**: Pulls new audiences into Harmonic Waves (Binara, Lunata, Sonarus, World Pulse)

### Market Gap
Existing apps (Subly, VibeSesh, Sublimind, ReliefMix, Powerful Subliminals) are all:
- Visually dated / generic mobile UI
- Consumer self-help only — no practitioner angle
- No ecosystem integration or real-world data connection
- No educational layer
- All native iOS — no premium web PWA exists
- No social/viral sharing mechanics

### Naming
Working name: **Sublimara** (subliminal + ara suffix from ecosystem)
Element: **Ether** (thought, consciousness, the invisible)

---

## 2. DESIGN SYSTEM — "Liminal Veil"

### Concept
The threshold between conscious and subconscious. The moment between waking and sleeping, twilight, where whispers become thoughts.

### Colour Palette
```
--void:           #0A0A0F        /* Deep void black */
--twilight:       #12101E        /* Dark purple-black */
--veil:           #1A1528        /* Slightly lifted purple */
--whisper:        #2D2545        /* Muted violet */
--subliminal:     #7B5EA7        /* Core brand purple */
--conscious:      #C4A1FF        /* Light lavender - primary accent */
--awake:          #E8D5FF        /* Near-white lavender */
--glow:           #FF6B9D        /* Pink accent for CTAs */
--theta:          #4ECDC4        /* Teal - binaural accent */
--alpha:          #FFD93D        /* Gold - recording states */
--text-primary:   #F0E6FF
--text-secondary: #8B7BA8
--glass:          rgba(26, 21, 40, 0.6)
--glass-border:   rgba(196, 161, 255, 0.08)
```

### Typography
- Display: Cormorant Garamond (italic for hero moments)
- Headings/Body: Outfit
- Monospace: JetBrains Mono

---

## 3. INFORMATION ARCHITECTURE

```
/                       → Landing / Hero
/learn                  → Interactive threshold demo
/create                 → Session builder (5-step)
/play/[id]              → Immersive cinematic player
/session/[shareId]      → Shared session page
/explore                → Community gallery (Phase 2)
/practitioner           → Practitioner tools (Phase 3)
/promo                  → Hidden social content studio (Phase 2)
/sell                   → Hidden sales playbook (Phase 3)
```

---

## 4. CORE USER FLOWS

### Flow 1: TikTok Discovery
TikTok video → sublimara.app → Hero with instant demo → "Try it now" → Quick preset session → Mind blown → Share → Create account

### Flow 2: Education First
Landing → /learn → Threshold demo → A/B comparison → "Create your first session" → /create

### Flow 3: Session Creation
/create → Choose intention → Select affirmations → Configure voice → Choose soundscape → Set duration → Create → /play

### Flow 4: Practitioner (Phase 3)
/practitioner → Create programme → Set affirmation sequence → Generate client link → Client listens between sessions

---

## 5. FEATURE DEEP DIVE

### 5.1 The Threshold Demo (/learn) — THE Viral Moment
- Split panel: "Conscious" vs "Subliminal"
- Crossfade slider controlling voice gain AND text opacity simultaneously
- User physically experiences what subliminal means
- This single feature is the TikTok content engine

### 5.2 Session Builder (/create) — 5 Steps
1. **Intention**: 9 category cards with unique colour accents
2. **Affirmations**: Curated library (8 per category) + custom input
3. **Voice**: Whisper/Gentle/Record + speed + subliminal depth
4. **Soundscape**: Procedural ambients + binaural beats + healing frequencies
5. **Duration**: 5-30 min + auto naming

### 5.3 Immersive Player (/play) — The Soul
- Sacred geometry orb that breathes with the audio
- Whisper Wall: ghostly affirmation text drifting at threshold opacity
- Particle field
- Progress ring
- Auto-hiding controls
- Fullscreen cinematic experience

### 5.4 Audio Engine (All Procedural — No Audio Files)
- Subliminal voice via Web SpeechSynthesis at low volume
- Ambient soundscapes generated with Web Audio API
- Binaural beat oscillators (Theta/Alpha/Delta)
- Healing frequency tones (432/528/396/639Hz)
- Proper fade in/out
- iOS Safari AudioContext handling

---

## 6. ECOSYSTEM INTEGRATION

| From Sublimara | To | Integration |
|---|---|---|
| Binaural engine | Binara | Shared architecture, "Open in Binara" |
| Lunar timing | Lunata | Best time for intention based on moon phase |
| Voice baseline | Sonarus | Before/after 21-day voice comparison |
| Schumann data | World Pulse | Adapt frequency to planetary resonance |
| Air quality | Airas | Breathwork + subliminals pairing |
| Vocal biomarkers | Voxara | Session voice analysis |

Hub element: **Ether** · Card tint: #C4A1FF · Icon: Third eye / awareness

---

## 7. BUILD PHASES

### Phase 1 — MVP (TikTok Magnet) ← NOW
- Landing page with orb visualiser
- /learn threshold demo (viral core)
- Session builder (9 categories, curated affirmations)
- Audio engine (procedural, all Web Audio API)
- Immersive player with orb + whisper wall
- localStorage persistence
- URL session sharing + og:image
- PWA + Plausible

### Phase 2 — Content & Community
- Full affirmation library (200+)
- Voice recording (MediaRecorder)
- /explore community gallery
- Session remixing
- Listening streaks
- Full /learn content
- /promo studio

### Phase 3 — Practitioner & Premium
- /practitioner mode + client programmes
- Supabase backend
- User accounts
- Premium voice packs
- MP3/WAV download
- /sell playbook

### Phase 4 — AI & Integration
- AI affirmation generation (Anthropic API)
- AI voice (ElevenLabs)
- Live Lunata/World Pulse/Sonarus integration
- Session analytics

---

## 8. MONETISATION (Future)

**Free**: Create & play, 5 saved sessions, sharing, education, SpeechSynthesis voices
**Premium** ($4.99/mo or $29.99/yr): Unlimited sessions, AI affirmations, premium voices, downloads, practitioner mode, analytics

---

## 9. TIKTOK CONTENT IDEAS

1. "This is what subliminal messages actually look like" — threshold demo
2. "I built an app that whispers into your subconscious" — creation flow
3. "POV: Your subconscious is being reprogrammed" — fullscreen orb
4. "The difference between hearing and truly hearing" — slider demo
5. "432Hz + subliminal affirmations + sacred geometry" — pure visual ASMR
6. "Sound healers are adding this to their practice" — practitioner flow

### Hashtags
#subliminal #subliminalmessages #manifestation #binauralbeats #soundhealing #432hz #sacredgeometry #healingfrequencies #affirmations #spiritualtiktok

---

## 10. COMPETITIVE ADVANTAGE MATRIX

| Feature | Sublimara | Subly | VibeSesh | Sublimind | ReliefMix |
|---|---|---|---|---|---|
| Web PWA | ✅ | ❌ | ❌ | ❌ | ❌ |
| Cinematic visuals | ✅ | ❌ | ❌ | ❌ | ❌ |
| Interactive education | ✅ | ❌ | ❌ | ❌ | ❌ |
| Sacred geometry | ✅ | ❌ | ❌ | ❌ | ❌ |
| Binaural beats | ✅ | ❌ | ❌ | ❌ | ✅ |
| Healing frequencies | ✅ | ❌ | ❌ | ❌ | ✅ |
| Practitioner mode | ✅ | ❌ | ❌ | ❌ | ❌ |
| Shareable sessions | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ecosystem | ✅ | ❌ | ❌ | ❌ | ❌ |
| Free tier | ✅ | ❌ | ❌ | ❌ | ✅ |

---

*Version 1.0 · March 2026 · Noa x Remi · harmonicwaves.app*
