Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use the --yes flag wherever applicable.

---

# SUBLIMARA — Phase 1 MVP Build

## Project Context
Sublimara is a subliminal audio experience app — part of the Harmonic Waves ecosystem (harmonicwaves.app). It lets users create, visualise, and share personalised subliminal affirmation sessions layered with binaural beats, healing frequencies, and ambient soundscapes.

**Quality bar**: lunata.app, sonarus.app, lunar-practitioner.vercel.app — match or exceed.

**GitHub**: https://github.com/RemiDz/subliminal
**Local path**: C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\subliminal.app
**Domain**: TBD (deploy to Vercel, configure later)

---

## Stack
- Next.js 14+ (App Router, `src/app/` structure)
- TypeScript (strict mode)
- Tailwind CSS + CSS custom properties
- Framer Motion for UI animations
- HTML Canvas for orb visualiser
- Web Audio API for audio engine
- localStorage for session persistence
- Plausible analytics (script: `https://plausible.io/js/script.js`, domain TBD — add placeholder)
- PWA (manifest + service worker)

---

## Design System — "Liminal Veil"

### Colours (CSS custom properties in globals.css AND Tailwind theme extension)
```
--void:           #0A0A0F
--twilight:       #12101E
--veil:           #1A1528
--whisper:        #2D2545
--subliminal:     #7B5EA7
--conscious:      #C4A1FF
--awake:          #E8D5FF
--glow:           #FF6B9D
--theta:          #4ECDC4
--alpha:          #FFD93D
--text-primary:   #F0E6FF
--text-secondary: #8B7BA8
--glass:          rgba(26, 21, 40, 0.6)
--glass-border:   rgba(196, 161, 255, 0.08)
```

### Typography (Google Fonts)
- Display/Hero: "Cormorant Garamond" (weight 300, 400, 600; italic for hero moments)
- Headings + Body: "Outfit" (weight 300, 400, 500, 600)
- Monospace: "JetBrains Mono" (weight 400)

### Visual Rules
- Glass morphism cards: `backdrop-blur-xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl`
- All backgrounds: var(--void) base with subtle gradient meshes
- Smooth transitions: 300ms ease on all interactive elements
- No sharp corners — minimum rounded-xl
- Floating particles: luminous dots drifting slowly upward (CSS or Canvas)
- Text glow: subtle text-shadow on hero text using var(--conscious)
- Mobile-first: all layouts start mobile, scale up

---

## Phase 1 — Build EXACTLY These Pages

### 1. Landing Page (`/`)

**Full viewport hero:**
- Background: var(--void) with animated gradient mesh (CSS radial-gradient animation — 3 overlapping gradient circles slowly drifting, using --subliminal, --whisper, --twilight at ~0.3 opacity)
- Floating particles: CSS-only (20-30 small circles with @keyframes float, random delays, var(--conscious) at 0.2-0.5 opacity)
- Central orb: Canvas element, 300px mobile / 400px desktop
  - Draw Flower of Life sacred geometry using thin lines
  - Gentle rotation (0.1deg/frame)
  - Subtle pulse (scale 0.98-1.02, 4s cycle — theta rhythm)
  - Glow: radial gradient behind using var(--conscious) at low opacity
- Hero text (centred, above orb):
  - "What if your thoughts could hear whispers?" — Cormorant Garamond italic, text-4xl md:text-6xl, var(--text-primary), subtle text-shadow glow
  - Subtitle: "Subliminal audio. Beautifully crafted. Scientifically grounded." — Outfit 300, text-lg, var(--text-secondary)
- Two CTAs:
  - "Experience it" → /create — solid bg var(--glow), white text, rounded-full, px-8 py-4, hover scale + glow
  - "Learn how it works" → /learn — glass morphism, var(--conscious) text

**Below fold:**
- "What is Sublimara?" — 3 glass cards (row desktop, stack mobile)
  - "Whisper" — Your affirmations, beneath awareness
  - "Layer" — Binaural beats & healing frequencies
  - "Transform" — Repeated listening reshapes thought patterns
  - Framer Motion staggered fade-up on scroll
- "Part of Harmonic Waves" ecosystem badge → harmonicwaves.app
- Minimal footer

### 2. Learn Demo (`/learn`)

**THE viral moment. Build beautifully.**

- Header: "The Threshold of Perception" — Cormorant Garamond italic
- Two-panel layout (stack mobile, side-by-side desktop):
  - Left "Conscious": affirmation text fully visible, clear
  - Right "Subliminal": same text at 0.05-0.15 opacity, blurred, drifting
- **Centre slider**: custom range input
  - Gradient track from var(--awake) to var(--void)
  - Glowing orb thumb (var(--conscious) + box-shadow)
  - Dragging crossfades voice gain AND text opacity simultaneously
- Play button above panels
- Demo affirmations: "I am calm and centred", "My mind is clear", "I trust the process", "Peace flows through me"
- Voice: Web SpeechSynthesis API
- Ambient: Web Audio API soft drone (sine 174Hz + gentle filtered noise)
- Below demo: 3-step "How it works" cards + CTA → /create

### 3. Session Builder (`/create`)

**Multi-step with progress dots (5 steps)**

**Step 1 — Intention**: Grid of 9 category cards (glass morphism, icon, name, colour accent)
- Confidence & Self-Worth, Abundance & Prosperity, Health & Healing, Sleep & Relaxation, Focus & Clarity, Love & Relationships, Spiritual Growth, Creative Flow, Custom

**Step 2 — Affirmations**: Checkbox list of 8 pre-written per category + custom input
Hardcoded libraries:

Confidence: "I trust myself deeply and completely", "My voice matters and deserves to be heard", "I am worthy of all the good that comes to me", "Confidence flows through me naturally", "I embrace my unique strengths", "I release self-doubt with every breath", "I stand tall in my truth", "I am enough exactly as I am"

Abundance: "Wealth flows to me from expected and unexpected sources", "I am open to receiving abundance in all forms", "My work creates value and attracts prosperity", "I deserve financial freedom and security", "Opportunities are drawn to me effortlessly", "I am grateful for the abundance already in my life", "Money comes to me easily and frequently", "I release all resistance to wealth"

Health: "My body knows how to heal itself", "Every cell vibrates with health and energy", "I release what no longer serves my wellbeing", "I nourish my body with love and care", "Healing energy flows through every part of me", "I am strong, vital, and full of life", "My immune system is powerful and resilient", "I choose thoughts that support my health"

Sleep: "I release the day and welcome deep rest", "My mind is calm, my body is peaceful", "Sleep comes easily and naturally to me", "I drift into deep, restorative sleep", "My dreams are peaceful and healing", "I let go of all tension and worry", "Every breath takes me deeper into relaxation", "I deserve this rest"

Focus: "My mind is clear, sharp, and focused", "I direct my attention with ease and purpose", "Distractions dissolve as I centre my awareness", "I am fully present in this moment", "My concentration strengthens with every session", "I accomplish my goals with calm focus", "Clarity comes to me effortlessly", "I am in complete control of my attention"

Love: "I am worthy of deep, authentic love", "Love flows freely to me and through me", "I attract relationships that nourish my soul", "My heart is open to giving and receiving love", "I radiate warmth and compassion", "I forgive freely and love unconditionally", "I deserve healthy, loving connections", "Love is my natural state of being"

Spiritual: "I am connected to something greater than myself", "My intuition guides me with clarity", "I trust the journey of my soul", "I am aligned with my highest purpose", "The universe supports my growth", "I am a vessel for light and healing", "My spiritual practice deepens every day", "I am exactly where I need to be"

Creative: "Creative energy flows through me abundantly", "I trust my creative instincts", "Inspiration finds me in every moment", "I create without fear or judgement", "My unique expression matters", "I allow ideas to flow freely through me", "Creativity is my natural state", "I bring beauty into everything I do"

**Step 3 — Voice**: 3 radio cards (Whisper/Gentle/Record), speed toggle (Slow/Normal/Rapid), subliminal depth slider with live text opacity preview

**Step 4 — Soundscape**:
- Ambient: horizontal scroll cards (Rain, Ocean, Forest, Crystal Bowls, Deep Drone, Silence)
  - ALL procedurally generated via Web Audio API — no audio files:
    - Rain: bandpass-filtered white noise (800Hz, Q 0.5) + amplitude modulation
    - Ocean: brown noise + lowpass (400Hz) + slow sine LFO (0.08Hz) on gain
    - Forest: filtered noise + occasional sine pings
    - Crystal Bowls: sine 432Hz + harmonics + slow tremolo
    - Deep Drone: layered sines 68/136/204Hz with subtle detuning
- Binaural toggle: Off / Theta 6Hz / Alpha 10Hz / Delta 2Hz (carrier 200Hz)
- Healing freq toggle: Off / 432Hz / 528Hz / 396Hz / 639Hz

**Step 5 — Duration & Finish**:
- Duration pills: 5/10/15/20/30 min
- Auto name generation
- "Create Session" button → save localStorage → navigate /play/[id]

### 4. Immersive Player (`/play/[id]`)

**Fullscreen cinematic. The app's soul.**

- var(--void) background, full viewport
- **Central Orb** (Canvas, centred, 50vmin):
  - Flower of Life sacred geometry, thin lines, var(--conscious) at 0.3
  - Slow rotation, scale pulse synced to binaural freq
  - Radial glow behind
  - Colour shift per category
- **Whisper Wall** (behind orb):
  - Affirmations as ghostly text, random positions
  - Cormorant Garamond italic, 0.04-0.08 opacity
  - Slow drift (translateY+X, 30-60s), staggered appearance/fade
- **Particles**: 30-50 luminous dots, slow upward drift, 0.1-0.4 opacity
- **Progress ring**: SVG circle around orb, stroke-dashoffset animation
- **Controls** (bottom, auto-hide after 3s):
  - Play/Pause, volume, time remaining, exit (top-right), fullscreen toggle

**Audio Engine** (reusable `useAudioEngine` hook):
- AudioContext with layers:
  1. Subliminal voice via SpeechSynthesis at low utterance.volume (0.02-0.15)
  2. Ambient via Web Audio procedural generation
  3. Binaural: two oscillators L/R if enabled
  4. Healing freq: single oscillator if enabled
- SpeechSynthesis loops all affirmations continuously
- Rate mapping: slow=0.6, normal=0.85, rapid=1.2
- Pitch: whisper=0.8, gentle=0.95
- Fade in/out: linear gain ramp (10% of duration)
- CRITICAL: AudioContext.resume() on user gesture for iOS Safari

### 5. Shared Session (`/session/[shareId]`)

- Session config encoded as base64 in URL query params
- Beautiful card: session name, category, duration, affirmation count
- "Play" → save to localStorage → /play/[id]
- "Create your own" CTA → /create
- Dynamic og:image via `@vercel/og`: gradient bg, session name in Cormorant Garamond, sacred geometry element, "sublimara.app" branding

---

## File Structure
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── learn/page.tsx
│   ├── create/page.tsx
│   ├── play/[id]/page.tsx
│   └── session/[shareId]/
│       ├── page.tsx
│       └── opengraph-image.tsx
├── components/
│   ├── OrbVisualiser.tsx
│   ├── WhisperWall.tsx
│   ├── ParticleField.tsx
│   ├── GlassCard.tsx
│   ├── ThresholdSlider.tsx
│   ├── SessionBuilder/
│   │   ├── StepIndicator.tsx
│   │   ├── IntentionStep.tsx
│   │   ├── AffirmationsStep.tsx
│   │   ├── VoiceStep.tsx
│   │   ├── SoundscapeStep.tsx
│   │   └── DurationStep.tsx
│   ├── Player/
│   │   ├── PlayerControls.tsx
│   │   └── ProgressRing.tsx
│   └── EcosystemBadge.tsx
├── hooks/
│   ├── useAudioEngine.ts
│   ├── useSpeechSynthesis.ts
│   └── useSessionStorage.ts
├── lib/
│   ├── audio/
│   │   ├── ambients.ts
│   │   ├── binaural.ts
│   │   └── frequencies.ts
│   ├── sessions.ts
│   ├── affirmations.ts
│   └── categories.ts
├── types/
│   └── session.ts
└── public/
    ├── manifest.json
    └── icons/
```

---

## Key Implementation Notes

### Audio — No External Files
All audio procedurally generated. Key patterns:

```typescript
// White noise generator
function createWhiteNoise(ctx: AudioContext): AudioBufferSourceNode {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}
```

### SpeechSynthesis Subliminal
- SpeechSynthesis can't route through Web Audio API in most browsers
- Use `utterance.volume` directly for subliminal depth (0.02-0.15)
- Keep ambient/binaural in Web Audio at normal volume
- Loop affirmations: onend → speak next, after last → restart

### Session Sharing
```typescript
const shareSession = (session: Session) => {
  const config = { ...session, id: undefined, playCount: undefined };
  const encoded = btoa(JSON.stringify(config));
  return `${window.location.origin}/session/${session.shareId}?d=${encoded}`;
};
```

### iOS Safari Audio
- MUST call `audioContext.resume()` inside a user gesture handler (click/tap)
- Show a "Tap to begin" overlay if AudioContext state is 'suspended'

---

## Deploy Commands
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
npm install framer-motion nanoid
npm run build
git add -A && git commit -m "Phase 1 MVP — Sublimara" && git push -u origin main
```

Build the entire app now. Start with project setup, then globals.css, then shared components, then each page: landing → learn → create → play → session share. Make it extraordinary.
