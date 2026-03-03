Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use the --yes flag wherever applicable.

---

# DEEP WHISPER — Phase 1 MVP Build

## Project Context
Deep Whisper is a subliminal audio experience app — part of the Harmonic Waves ecosystem (harmonicwaves.app). It lets users create, visualise, and share personalised subliminal affirmation sessions layered with binaural beats, healing frequencies, and ambient soundscapes. The most beautiful subliminal audio tool on the web — designed to be TikTok-viral.

**Quality bar**: lunata.app, sonarus.app, lunar-practitioner.vercel.app — match or exceed.

**GitHub**: https://github.com/RemiDz/deepwhisper
**Domain**: deepwhisper.app
**Plausible domain**: deepwhisper.app

---

## Stack
- Next.js 14+ (App Router, `src/app/` structure)
- TypeScript (strict mode)
- Tailwind CSS + CSS custom properties
- Framer Motion for UI animations
- HTML Canvas for orb visualiser
- Web Audio API for audio engine
- localStorage for session persistence
- Plausible analytics (script: `https://plausible.io/js/script.js`, data-domain: `deepwhisper.app`)
- PWA (manifest + service worker)

---

## Branding

**App name**: Deep Whisper
**Tagline**: "Whisper your intentions into being"
**Description**: Subliminal audio intelligence — create, visualise, and share personalised subliminal affirmation sessions
**Element** (in Harmonic Waves ecosystem): Ether — thought, consciousness, the invisible
**Tone**: Mystical but grounded. Beautiful but honest. Premium but accessible.

All instances of "Sublimara" in the codebase should be replaced with "Deep Whisper". The brand name is two words, capitalised: "Deep Whisper" (not "DeepWhisper" or "Deepwhisper"). Domain and repo use single word: deepwhisper.

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
- "What is Deep Whisper?" — 3 glass cards (row desktop, stack mobile)
  - "Whisper" — Your affirmations, delivered beneath conscious awareness
  - "Layer" — Binaural beats & healing frequencies deepen the experience
  - "Transform" — Repeated listening reshapes your thought patterns
  - Framer Motion staggered fade-up on scroll
- "Part of Harmonic Waves" ecosystem badge → harmonicwaves.app
- Minimal footer with "Built with 🔮 by Harmonic Waves" and links

### 2. Learn Demo (`/learn`)

**THE viral moment. Build beautifully.**

- Header: "The Threshold of Perception" — Cormorant Garamond italic, centred
- Subheader: "Experience the boundary between conscious and subliminal" — Outfit 300

**Interactive Demo Area (centrepiece):**
- Two-panel layout (stack mobile, side-by-side desktop):
  - Left "Conscious": glass card, affirmation text fully visible, clear white text, normal opacity
  - Right "Subliminal": glass card, same text at 0.05-0.15 opacity, blurred slightly, drifting with slow CSS animation
- **Centre slider**: custom range input
  - Gradient track from var(--awake) to var(--void)
  - Glowing orb thumb (var(--conscious) with box-shadow glow)
  - Dragging crossfades voice gain AND text opacity simultaneously
  - Label left: "Conscious" / Label right: "Subliminal"
- **Play button**: Large, centred above the panels. Circular, glass morphism, play icon. Tap to start the demo audio. Toggles to pause icon when playing.
- Demo affirmations (hardcoded): "I am calm and centred", "My mind is clear", "I trust the process", "Peace flows through me"
- Voice: Web SpeechSynthesis API — speak affirmations in sequence, loop
- Ambient: Web Audio API soft drone (sine 174Hz at low gain + gentle filtered noise)
- When slider moves: voice utterance.volume interpolates, text panels crossfade opacity

**Below the demo:**
- "How it works" — 3 numbered glass cards with icons:
  1. "Choose your affirmations" — pencil icon
  2. "Layer beneath beautiful soundscapes" — layers icon
  3. "Listen and let your subconscious absorb" — brain/mind icon
- CTA: "Create your first session" → /create — var(--glow) button

### 3. Session Builder (`/create`)

**Multi-step with progress dots at top (5 filled/unfilled circles showing current step)**
**Step transitions: Framer Motion slide left/right**

**Step 1 — Intention**
- Heading: "What would you like to focus on?"
- Grid of 9 category cards (3 columns desktop, 2 mobile):
  - Confidence & Self-Worth — icon: ✨ — accent: warm gold
  - Abundance & Prosperity — icon: 💎 — accent: green-gold
  - Health & Healing — icon: 🌿 — accent: emerald-teal
  - Sleep & Relaxation — icon: 🌙 — accent: deep indigo-blue
  - Focus & Clarity — icon: 🎯 — accent: cyan-white
  - Love & Relationships — icon: 💜 — accent: rose-pink
  - Spiritual Growth — icon: 🕉️ — accent: violet-purple
  - Creative Flow — icon: 🎨 — accent: orange-amber
  - Custom — icon: ⚡ — accent: var(--conscious) lavender
- Each card: glass morphism, emoji icon, category name, subtle coloured border-left or border-bottom accent
- Tap to select (highlight with accent glow) → "Next" button appears → advance to step 2

**Step 2 — Affirmations**
- Heading: "Choose your affirmations" with category name shown
- List of 8 pre-written affirmations as checkbox items (glass card style, tap to toggle)
- Pre-select first 5 by default
- "Add your own" text input at bottom with + button (adds custom affirmation as new checkbox item)
- Selected count shown: "5 of 8 selected"
- Minimum 3 required, maximum 15
- Navigation: Back / Next buttons

Affirmation libraries (hardcode ALL of these):

**Confidence**: "I trust myself deeply and completely", "My voice matters and deserves to be heard", "I am worthy of all the good that comes to me", "Confidence flows through me naturally", "I embrace my unique strengths", "I release self-doubt with every breath", "I stand tall in my truth", "I am enough exactly as I am"

**Abundance**: "Wealth flows to me from expected and unexpected sources", "I am open to receiving abundance in all forms", "My work creates value and attracts prosperity", "I deserve financial freedom and security", "Opportunities are drawn to me effortlessly", "I am grateful for the abundance already in my life", "Money comes to me easily and frequently", "I release all resistance to wealth"

**Health**: "My body knows how to heal itself", "Every cell vibrates with health and energy", "I release what no longer serves my wellbeing", "I nourish my body with love and care", "Healing energy flows through every part of me", "I am strong, vital, and full of life", "My immune system is powerful and resilient", "I choose thoughts that support my health"

**Sleep**: "I release the day and welcome deep rest", "My mind is calm, my body is peaceful", "Sleep comes easily and naturally to me", "I drift into deep, restorative sleep", "My dreams are peaceful and healing", "I let go of all tension and worry", "Every breath takes me deeper into relaxation", "I deserve this rest"

**Focus**: "My mind is clear, sharp, and focused", "I direct my attention with ease and purpose", "Distractions dissolve as I centre my awareness", "I am fully present in this moment", "My concentration strengthens with every session", "I accomplish my goals with calm focus", "Clarity comes to me effortlessly", "I am in complete control of my attention"

**Love**: "I am worthy of deep, authentic love", "Love flows freely to me and through me", "I attract relationships that nourish my soul", "My heart is open to giving and receiving love", "I radiate warmth and compassion", "I forgive freely and love unconditionally", "I deserve healthy, loving connections", "Love is my natural state of being"

**Spiritual**: "I am connected to something greater than myself", "My intuition guides me with clarity", "I trust the journey of my soul", "I am aligned with my highest purpose", "The universe supports my growth", "I am a vessel for light and healing", "My spiritual practice deepens every day", "I am exactly where I need to be"

**Creative**: "Creative energy flows through me abundantly", "I trust my creative instincts", "Inspiration finds me in every moment", "I create without fear or judgement", "My unique expression matters", "I allow ideas to flow freely through me", "Creativity is my natural state", "I bring beauty into everything I do"

**Custom**: Start with empty list, user must add at least 3 custom affirmations

**Step 3 — Voice & Delivery**
- Heading: "How should your affirmations be delivered?"
- Voice type: 3 glass cards (radio-style, single select):
  - **Whisper** (recommended badge) — icon: 🤫 — "Soft, barely perceptible — the classic subliminal approach"
  - **Gentle** — icon: 🕊️ — "Softly spoken, slightly more present"
  - **Record Your Own** — icon: 🎙️ — "Your own voice is most powerful for self-programming"
    - When selected: show recording UI — large red record button, waveform visualisation placeholder, playback button, re-record button
    - Use MediaRecorder API to capture audio
    - Store as blob URL
- Speed: 3-option pill toggle — Slow / Normal / Rapid
- Subliminal depth: custom range slider
  - Label: "How deep beneath awareness?"
  - Left label: "Barely perceptible" / Right label: "Fully hidden"
  - Maps to voice volume: 0.15 → 0.02
  - **Live preview**: show a sample affirmation text whose opacity mirrors the slider value (fades as you go deeper) — this visually demonstrates what "subliminal depth" means
- Navigation: Back / Next

**Step 4 — Soundscape**
- Heading: "Choose your soundscape"
- **Ambient layer**: horizontal scrollable card row
  - Rain 🌧️ — "Gentle rainfall"
  - Ocean 🌊 — "Rolling waves"
  - Forest 🌲 — "Woodland ambience"
  - Crystal Bowls 🔮 — "432Hz singing bowls"
  - Deep Drone 🕉️ — "Meditative resonance"
  - Silence 🤫 — "Subliminal voice only"
  - Each card: glass morphism, emoji, name, short description
  - Tap to select (single selection, highlight with border glow)
  - **Audio preview**: tapping a card plays a 3-second preview of that ambient (generate procedurally, same as player)

- **Binaural beats** (collapsible section, default collapsed):
  - Toggle: on/off
  - When on: 4 pill options — Theta 6Hz / Alpha 10Hz / Delta 2Hz / Custom
  - Custom: number input for Hz value
  - Carrier frequency: 200Hz default (show as subtle text, editable)
  - Note: "🎧 Headphones recommended for binaural beats"

- **Healing frequency** (collapsible section, default collapsed):
  - Toggle: on/off
  - When on: 4 pill options — 432Hz / 528Hz / 396Hz / 639Hz
  - Description text for each:
    - 432Hz — "Natural tuning, harmony"
    - 528Hz — "Transformation, DNA repair"
    - 396Hz — "Liberation from fear"
    - 639Hz — "Connection, relationships"

- Navigation: Back / Next

**Step 5 — Duration & Finish**
- Heading: "Set your session"
- Duration: pill buttons — 5 / 10 / 15 / 20 / 30 min (default: 15)
- Session name: text input with auto-generated default: "[Category] Session" (e.g., "Confidence Session")
- **Session summary card** (glass morphism, showing all choices):
  - Category + icon
  - Number of affirmations
  - Voice type + speed
  - Soundscape
  - Binaural/healing freq if enabled
  - Duration
- "Create & Play" button — var(--glow), large, full-width on mobile
  - On tap: generate nanoid for session ID, save to localStorage, navigate to /play/[id]
- "Save for Later" secondary button — saves but stays on page, shows confirmation

### 4. Immersive Player (`/play/[id]`)

**Fullscreen cinematic. The app's soul. Must be breathtaking.**

- Load session from localStorage by ID
- If not found: show "Session not found" with link back to /create
- Background: var(--void), full viewport, overflow hidden

**Central Orb** (Canvas, centred, 50vmin size):
- Sacred geometry: Flower of Life pattern
  - Draw using concentric overlapping circles (7 circles in classic pattern)
  - Thin lines: var(--conscious) at 0.2-0.3 opacity
  - Or use category-specific sacred geometry:
    - Default: Flower of Life
    - Sleep: crescent/moon geometry
    - Spiritual: Sri Yantra
    - (Keep Flower of Life for MVP, vary in Phase 2)
- Animation:
  - Slow continuous rotation (0.05-0.1 deg/frame)
  - Scale pulse synced to binaural frequency if enabled (e.g., 6Hz theta = gentle pulse at ~0.17Hz visible rhythm, which is 6Hz scaled down to visible range)
  - If no binaural: pulse at 0.25Hz (4-second cycle, theta-like)
  - Radial glow behind orb: CSS or canvas radial gradient, var(--conscious) at 0.15 opacity, 150% of orb size
- Colour: tint based on session category accent colour

**Whisper Wall** (positioned behind/around orb, CSS layer):
- Container: full viewport, pointer-events none, overflow hidden
- Affirmation text elements:
  - Each affirmation rendered as a `<span>` with absolute positioning
  - Font: Cormorant Garamond italic, text-xl to text-3xl (random sizes)
  - Colour: var(--text-primary) at 0.03-0.08 opacity (barely visible — this IS the subliminal visual metaphor)
  - Position: random X (10-90vw), start below viewport
  - Animation: CSS @keyframes — translateY from 100vh to -20vh over 30-60s (random duration per element)
  - Also slight translateX drift (±50px sine motion)
  - Staggered: new affirmation appears every 3-5 seconds
  - 6-8 affirmations visible at any time, cycling through the full list
  - On mobile: fewer simultaneous (4-5), smaller text

**Particle Field** (CSS or Canvas layer, behind whisper wall):
- 30-50 small circles
- Size: 2-4px
- Colour: var(--conscious) at 0.1-0.4 opacity (random per particle)
- Animation: slow upward drift (translateY, 20-40s cycle) + slight horizontal wobble
- Random initial positions, random delays
- CSS-only preferred for performance

**Progress Ring** (SVG, overlaid on orb):
- Circle with stroke-dasharray/stroke-dashoffset animation
- Radius: slightly larger than orb (55vmin)
- Stroke: var(--conscious) at 0.3 opacity, 2px width
- Fills clockwise as session progresses
- Shows elapsed time as percentage of total duration

**Controls** (fixed bottom, glass morphism bar):
- Auto-hide: visible initially, fade out after 3 seconds of no mouse/touch activity
- Show on hover/tap anywhere on screen
- Layout (centred row):
  - Session name (left-aligned, Outfit 400, var(--text-secondary), truncated)
  - Play/Pause button (centre, large, 56px, circular glass button with icon)
  - Time remaining (right-aligned, JetBrains Mono, var(--text-secondary), format: "12:34")
- Volume slider: appears above controls bar when expanded (tap volume icon)
- **Exit button**: top-right corner, fixed, small "✕" in glass circle, always visible at low opacity (0.3), full opacity on hover
- **Fullscreen toggle**: top-left corner, same style as exit

**Session End**:
- At duration end: fade out all audio over fadeOut period (10% of duration, minimum 5s)
- Show completion overlay:
  - "Session Complete" — Cormorant Garamond italic
  - "Deep Whisper" branding
  - Session stats: duration, affirmations delivered (count × loops)
  - "Share this session" button → generate share URL
  - "Create another" → /create
  - "Play again" → restart

**Audio Engine** (build as reusable hook: `useAudioEngine`):
```typescript
interface AudioEngineConfig {
  affirmations: string[];
  voiceType: 'whisper' | 'gentle' | 'recorded';
  voiceSpeed: 'slow' | 'normal' | 'rapid';
  subliminalDepth: number; // 0.02-0.15
  recordedAudioUrl?: string;
  ambient: string;
  binauralEnabled: boolean;
  binauralFreq: number;
  carrierFreq: number;
  healingFreqEnabled: boolean;
  healingFreq: number;
  duration: number; // seconds
  fadeIn: number; // seconds
  fadeOut: number; // seconds
}

// Returns: { play, pause, stop, isPlaying, currentTime, duration, isReady }
```

**Audio layers (all Web Audio API, no external files):**

1. **Subliminal voice**:
   - For whisper/gentle: SpeechSynthesis API
     - Queue affirmations, speak one at a time
     - utterance.rate: slow=0.6, normal=0.85, rapid=1.2
     - utterance.pitch: whisper=0.7, gentle=0.95
     - utterance.volume: set to subliminalDepth value (0.02-0.15)
     - On utterance end → 1-2 second pause → next affirmation
     - After all affirmations → loop from beginning
   - For recorded: load blob URL into AudioBuffer, play through GainNode at subliminalDepth

2. **Ambient soundscape** (procedural — NO audio files):
   - **Rain**: White noise → BandpassFilter (centre 800Hz, Q 0.5) → GainNode
     - Add secondary noise through HighpassFilter (3000Hz) for "sizzle"
     - Subtle random amplitude modulation for natural patter
     - Master gain: 0.4
   - **Ocean**: Brown noise → LowpassFilter (400Hz) → GainNode modulated by LFO
     - LFO: sine oscillator at 0.08Hz controlling gain (0.2-0.6 range)
     - Creates natural wave swell rhythm
     - Master gain: 0.5
   - **Forest**: Filtered pink noise (bandpass 200-2000Hz, low gain 0.15)
     - Plus: occasional sine pings at random frequencies (2000-5000Hz)
     - Pings: short duration (0.1s), random intervals (3-8s), very low gain (0.05)
     - Simulates distant bird-like sounds
     - Master gain: 0.3
   - **Crystal Bowls**: Sine wave at 432Hz
     - Plus harmonics: 864Hz (gain 0.3), 1296Hz (gain 0.15)
     - Slow tremolo via gain LFO at 0.3Hz (depth 0.3)
     - Slight detune wobble: ±2Hz via frequency LFO at 0.1Hz
     - Master gain: 0.35
   - **Deep Drone**: Layered sines at 68Hz, 136Hz, 204Hz
     - Each with slight random detuning (±0.5Hz)
     - Very slow gain LFO (0.02Hz) for breathing effect
     - Master gain: 0.4
   - **Silence**: no ambient nodes created

   **White/Brown/Pink noise generation**:
   ```typescript
   function createNoise(ctx: AudioContext, type: 'white' | 'brown' | 'pink'): AudioBufferSourceNode {
     const bufferSize = 2 * ctx.sampleRate;
     const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
     const data = buffer.getChannelData(0);
     
     if (type === 'white') {
       for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
     } else if (type === 'brown') {
       let last = 0;
       for (let i = 0; i < bufferSize; i++) {
         const white = Math.random() * 2 - 1;
         data[i] = (last + 0.02 * white) / 1.02;
         last = data[i];
       }
     }
     // Pink noise: use white noise through a pinking filter
     
     const source = ctx.createBufferSource();
     source.buffer = buffer;
     source.loop = true;
     return source;
   }
   ```

3. **Binaural beats** (if enabled):
   - Left oscillator: sine wave at carrierFreq
   - Right oscillator: sine wave at carrierFreq + binauralFreq
   - Each routed to respective stereo channel via ChannelMergerNode
   - Gain: 0.15
   - MUST use stereo separation — this is what creates the binaural effect

4. **Healing frequency** (if enabled):
   - Single sine oscillator at healingFreq
   - Very subtle gain: 0.08
   - Slight tremolo LFO (0.2Hz, depth 0.1) for warmth

5. **Master gain + fade**:
   - All layers merge to master GainNode → destination
   - Fade in: linearRampToValueAtTime from 0 to 1 over fadeIn seconds
   - Fade out: linearRampToValueAtTime from 1 to 0, starting at (duration - fadeOut)
   - Session timer: requestAnimationFrame loop tracking currentTime

**CRITICAL iOS Safari handling**:
- AudioContext starts in 'suspended' state
- On first user interaction (play button tap): call audioContext.resume()
- Show "Tap to begin" overlay if context is suspended
- SpeechSynthesis on iOS also requires user gesture — trigger first utterance on play tap

### 5. Shared Session (`/session/[shareId]`)

**Session sharing mechanism**:
- When user taps "Share": encode session config as base64 JSON in URL query param
- URL format: `https://deepwhisper.app/session/[shareId]?d=[base64data]`
- Keep payload lean: category key, affirmation indices (not full text for presets), voice/soundscape/freq settings, duration
- For custom affirmations: include full text (URL may be longer)

**Share page layout**:
- Background: var(--void) with gradient mesh (same as landing)
- Centred glass card:
  - "Deep Whisper" logo/text at top
  - Session name (large, Cormorant Garamond)
  - Category icon + name
  - Duration badge
  - Affirmation count: "8 affirmations"
  - Soundscape + frequency badges
  - "Play This Session" button (var(--glow), large)
    - On tap: decode session from URL, save to localStorage with new ID, navigate to /play/[id]
  - "Create Your Own" secondary button → /create
- Below card: "Deep Whisper — Subliminal audio intelligence" + link to deepwhisper.app

**Dynamic OG image** (`/session/[shareId]/opengraph-image.tsx`):
- Use `@vercel/og` (ImageResponse)
- Size: 1200x630
- Background: gradient from --void to --subliminal
- Centre: Session name in large serif font (Cormorant Garamond style — use Google Fonts fetch)
- Below: category + duration + "deepwhisper.app"
- Subtle sacred geometry decorative lines in corners
- This is what shows when someone shares on social media — make it gorgeous

---

## File Structure
```
src/
├── app/
│   ├── layout.tsx           # Root layout: fonts (Cormorant Garamond, Outfit, JetBrains Mono), metadata (title: "Deep Whisper — Subliminal Audio Intelligence", description), Plausible script
│   ├── page.tsx             # Landing page
│   ├── globals.css          # CSS custom properties, gradient mesh keyframes, particle keyframes, base styles
│   ├── learn/
│   │   └── page.tsx         # Interactive threshold demo
│   ├── create/
│   │   └── page.tsx         # Session builder (5-step)
│   ├── play/
│   │   └── [id]/
│   │       └── page.tsx     # Immersive player
│   └── session/
│       └── [shareId]/
│           ├── page.tsx     # Shared session page
│           └── opengraph-image.tsx  # Dynamic OG image
├── components/
│   ├── OrbVisualiser.tsx    # Canvas sacred geometry orb with rotation, pulse, glow
│   ├── WhisperWall.tsx      # Floating affirmation text at threshold opacity
│   ├── ParticleField.tsx    # CSS floating particles
│   ├── GlassCard.tsx        # Reusable glass morphism card component
│   ├── GradientMesh.tsx     # Animated background gradient mesh
│   ├── ThresholdSlider.tsx  # Custom range slider for /learn demo
│   ├── EcosystemBadge.tsx   # "Part of Harmonic Waves" link component
│   ├── SessionBuilder/
│   │   ├── StepIndicator.tsx    # 5 dots progress indicator
│   │   ├── IntentionStep.tsx    # Category grid
│   │   ├── AffirmationsStep.tsx # Checkbox affirmation list + custom input
│   │   ├── VoiceStep.tsx        # Voice type + speed + depth
│   │   ├── SoundscapeStep.tsx   # Ambient + binaural + healing freq
│   │   └── DurationStep.tsx     # Duration + name + summary + create
│   └── Player/
│       ├── PlayerControls.tsx   # Play/pause, volume, time, auto-hide
│       ├── ProgressRing.tsx     # SVG circular progress
│       └── SessionComplete.tsx  # End-of-session overlay
├── hooks/
│   ├── useAudioEngine.ts       # Core audio engine — all layers, fade, timer
│   ├── useSpeechSynthesis.ts   # TTS wrapper: queue, loop, rate/pitch control
│   ├── useSessionStorage.ts    # localStorage CRUD: save, load, list, delete sessions
│   └── useAutoHide.ts          # Controls auto-hide after inactivity
├── lib/
│   ├── audio/
│   │   ├── noise.ts            # White/brown/pink noise buffer generators
│   │   ├── ambients.ts         # Procedural ambient sound generators (rain, ocean, forest, bowls, drone)
│   │   ├── binaural.ts         # Binaural beat stereo oscillator setup
│   │   └── frequencies.ts      # Healing frequency oscillator setup
│   ├── sessions.ts             # Session model: create, serialise, deserialise, share URL generation
│   ├── affirmations.ts         # Full affirmation library data (all 9 categories × 8 affirmations)
│   └── categories.ts           # Category definitions: key, name, icon, accent colour, description
├── types/
│   └── session.ts              # TypeScript interfaces for Session, AudioEngineConfig, Category
└── public/
    ├── manifest.json           # PWA manifest: "Deep Whisper", theme #7B5EA7, bg #0A0A0F
    └── icons/                  # PWA icons: 192x192, 512x512 (generate simple purple gradient circles with DW text)
```

---

## TypeScript Interfaces

```typescript
// types/session.ts

export type IntentionCategory =
  | 'confidence'
  | 'abundance'
  | 'health'
  | 'sleep'
  | 'focus'
  | 'love'
  | 'spiritual'
  | 'creative'
  | 'custom';

export type VoiceType = 'whisper' | 'gentle' | 'recorded';
export type VoiceSpeed = 'slow' | 'normal' | 'rapid';
export type AmbientType = 'rain' | 'ocean' | 'forest' | 'bowls' | 'drone' | 'silence';
export type BinauralPreset = 'theta' | 'alpha' | 'delta' | 'custom';
export type HealingFrequency = 432 | 528 | 396 | 639;

export interface SubliminalSession {
  id: string;
  shareId: string;
  name: string;
  category: IntentionCategory;
  affirmations: string[];
  voice: {
    type: VoiceType;
    speed: VoiceSpeed;
    subliminalDepth: number;       // 0.02 - 0.15
    recordedAudioUrl?: string;
  };
  soundscape: {
    ambient: AmbientType;
    binauralEnabled: boolean;
    binauralFreq: number;          // Hz (beat frequency)
    carrierFreq: number;           // Hz (default 200)
    healingFreqEnabled: boolean;
    healingFreq: HealingFrequency;
  };
  duration: number;                // seconds
  createdAt: string;               // ISO date
  playCount: number;
}

export interface CategoryDefinition {
  key: IntentionCategory;
  name: string;
  icon: string;
  accent: string;                  // CSS colour
  description: string;
}
```

---

## Metadata & SEO

```typescript
// app/layout.tsx metadata
export const metadata: Metadata = {
  title: 'Deep Whisper — Subliminal Audio Intelligence',
  description: 'Create, visualise, and share personalised subliminal affirmation sessions with binaural beats, healing frequencies, and sacred geometry. Free web app by Harmonic Waves.',
  keywords: ['subliminal messages', 'subliminal audio', 'affirmations', 'binaural beats', 'healing frequencies', 'sound healing', 'manifestation', 'subconscious mind'],
  authors: [{ name: 'Harmonic Waves' }],
  openGraph: {
    title: 'Deep Whisper — Subliminal Audio Intelligence',
    description: 'Whisper your intentions into being. Create personalised subliminal sessions with binaural beats and sacred geometry.',
    url: 'https://deepwhisper.app',
    siteName: 'Deep Whisper',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deep Whisper — Subliminal Audio Intelligence',
    description: 'Whisper your intentions into being.',
  },
  manifest: '/manifest.json',
  themeColor: '#7B5EA7',
};
```

---

## Final Quality Checklist
- [ ] Beautiful on mobile (iPhone SE through iPhone 15 Pro Max)
- [ ] Responsive desktop (1024px+)
- [ ] All text uses correct fonts (Cormorant Garamond for display, Outfit for body)
- [ ] Glass morphism consistent across all cards
- [ ] Gradient mesh background animates smoothly
- [ ] Particles float naturally
- [ ] Orb renders correctly on Canvas, pulses organically
- [ ] Threshold slider on /learn crossfades audio AND visual simultaneously
- [ ] Session builder flows smoothly through all 5 steps
- [ ] Audio engine produces clean sound on Chrome + Safari
- [ ] iOS Safari: AudioContext resumes on user gesture
- [ ] SpeechSynthesis works (graceful fallback if unavailable)
- [ ] Binaural beats produce proper stereo separation
- [ ] Sessions persist in localStorage across browser refresh
- [ ] Share URLs encode/decode correctly
- [ ] OG image generates properly for shared sessions
- [ ] Plausible script present with data-domain="deepwhisper.app"
- [ ] PWA manifest with correct name/colours/icons
- [ ] No console errors or warnings
- [ ] Vercel build succeeds: `npm run build` passes
- [ ] Smooth 60fps on player visualisations
- [ ] All "Deep Whisper" branding consistent (two words, capitalised)

---

## Deploy
```bash
cd C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\subliminal.app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
npm install framer-motion nanoid
# Build all pages and components as specified above
npm run build
git init
git remote add origin https://github.com/RemiDz/deepwhisper.git
git add -A
git commit -m "Deep Whisper — Phase 1 MVP"
git push -u origin main
# Deploy via Vercel: connect GitHub repo, auto-deploy on push
```

Build the entire app now. Start with project setup, then globals.css with the full design system, then types, then lib (categories, affirmations, audio), then hooks, then shared components, then each page in order: landing → learn → create → play → session share. Make it extraordinary. This is the app that brings people into the Harmonic Waves ecosystem — it has to be visually stunning.
