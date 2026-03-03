Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use the --yes flag wherever applicable.

---

# DEEP WHISPER v2 — Complete Rebuild

## ⚠️ IMPORTANT: This is a FULL REBUILD — delete ALL existing source code in `src/` before starting. Keep only config files (package.json, tsconfig, tailwind, next.config, etc). This is a fundamentally different app.

## What Deep Whisper Actually Is Now
Deep Whisper is a **subliminal creation studio** — NOT an affirmation player. It's a tool that lets people create real subliminal audio, visual flash experiences, and subliminal wallpaper images. Think of it like Audacity meets sacred geometry meets TikTok — but beautiful, zero-friction, and runs entirely in the browser.

**The three core tools:**
1. **Audio Lab** — Record/upload affirmations → process through real subliminal techniques (speed up, volume reduce, reverse, ultrasonic shift) → layer under soundscapes → export as audio file
2. **Visual Flash** — Type affirmations → flash them on screen at subliminal speeds (10-100ms) over beautiful animated backgrounds → the TikTok content machine
3. **Subliminal Wallpaper** — Type affirmation → embed as near-invisible text woven into sacred geometry artwork → download as phone wallpaper

**GitHub**: https://github.com/RemiDz/deepwhisper
**Domain**: deepwhisper.app
**Quality bar**: lunata.app, sonarus.app — match or exceed. NOT generic AI aesthetic.

---

## Stack
- Next.js 14+ (App Router, `src/app/`)
- TypeScript strict
- Tailwind CSS + CSS custom properties
- Framer Motion for UI transitions
- HTML Canvas for wallpaper generation + visual effects
- Web Audio API + OfflineAudioContext for audio processing
- MediaRecorder API for voice recording
- Plausible analytics (data-domain: deepwhisper.app)
- PWA manifest

---

## Design System — "Dark Studio"

### Concept
This is a CREATION TOOL, not a meditation app. The aesthetic should feel like a premium music production studio meets occult grimoire. Dark, precise, powerful. Think Ableton Live meets mystical. NOT the generic purple glass morphism meditation app look.

### Colour Palette
```css
--bg-deep:        #08080C;     /* Near-black with blue undertone */
--bg-surface:     #111118;     /* Elevated surface */
--bg-card:        #18181F;     /* Card background */
--bg-hover:       #1F1F28;     /* Hover state */
--border:         #2A2A35;     /* Subtle borders */
--border-focus:   #4A3AFF;     /* Focus/active border — electric indigo */
--accent:         #4A3AFF;     /* Primary accent — electric indigo */
--accent-glow:    #6B5BFF;     /* Lighter accent for glows */
--accent-soft:    rgba(74, 58, 255, 0.15); /* Accent background tint */
--text-primary:   #E8E6F0;     /* Primary text */
--text-secondary: #7A7888;     /* Muted text */
--text-dim:       #4A4858;     /* Very muted */
--success:        #22C55E;     /* Green for recording/active */
--warning:        #F59E0B;     /* Amber for processing */
--danger:         #EF4444;     /* Red for recording indicator */
--flash:          #FFFFFF;     /* Pure white for subliminal flashes */
--sacred:         #C4A1FF;     /* Lavender for sacred geometry elements */
--waveform:       #4A3AFF;     /* Waveform visualisation colour */
```

### Typography
- **Display**: "Instrument Serif" — editorial, distinctive, NOT the overused Cormorant
- **Headings/UI**: "DM Sans" — clean, modern, slightly geometric
- **Mono/Data**: "IBM Plex Mono" — for Hz values, timers, technical readouts
- Load from Google Fonts

### Visual Rules
- **Dark studio aesthetic** — like a music production app. Clean, minimal, functional.
- Cards: `bg-[var(--bg-card)] border border-[var(--border)] rounded-xl` — NO glass morphism, no blur. Clean solid surfaces.
- Active/selected states: `border-[var(--accent)] bg-[var(--accent-soft)]`
- Subtle grain texture overlay on main background (CSS noise or tiny repeated SVG pattern at very low opacity)
- Waveform visualisations for audio — these are the visual centrepiece, not orbs
- Accent colour used sparingly — mostly for interactive elements, active states, and the waveform
- Generous spacing. Let the interface breathe.
- Mobile-first but this is primarily a creation tool — desktop experience matters equally
- NO floating particles, NO gradient meshes, NO glass morphism — this is a STUDIO, not a spa
- Hide all scrollbars globally:
```css
* { scrollbar-width: none; -ms-overflow-style: none; }
*::-webkit-scrollbar { display: none; }
```

---

## Route Structure
```
/                    → Landing page
/audio               → Audio Lab (record/process/export subliminal audio)
/flash               → Visual Flash (subliminal text flashing experience)
/wallpaper           → Subliminal Wallpaper generator
/learn               → How subliminals work (education)
```

---

## Page Specifications

### 1. Landing Page (`/`)

**Hero — full viewport, centred content:**
- Background: var(--bg-deep) with very subtle grain texture
- Large heading: "Create real subliminals." — Instrument Serif, text-5xl md:text-7xl, var(--text-primary)
- Subtitle: "Record. Process. Programme your subconscious." — DM Sans, text-lg, var(--text-secondary)
- Below: three tool cards in a row (stack on mobile):

**Tool Card 1: Audio Lab**
- Icon: waveform visualisation (inline SVG — draw a stylised audio waveform)
- Title: "Audio Lab"
- Description: "Record affirmations in your voice. Speed them up, layer beneath soundscapes, shift to ultrasonic. Export real subliminal audio."
- CTA: "Open Audio Lab →" link to /audio
- Left border accent: var(--accent)

**Tool Card 2: Visual Flash**
- Icon: flashing rectangle (inline SVG — a screen with a flash burst)
- Title: "Visual Flash"
- Description: "Flash affirmations on screen faster than you can read. Your subconscious catches every word."
- CTA: "Open Visual Flash →" link to /flash
- Left border accent: var(--success)

**Tool Card 3: Wallpaper**
- Icon: phone outline with hidden text pattern (inline SVG)
- Title: "Subliminal Wallpaper"
- Description: "Embed hidden affirmations into sacred geometry art. Download as your phone wallpaper."
- CTA: "Create Wallpaper →" link to /wallpaper
- Left border accent: var(--sacred)

**Below tools:**
- "How do subliminals work?" link → /learn
- "Part of Harmonic Waves" → harmonicwaves.app
- Minimal footer

**Animation:** Cards stagger in on load (Framer Motion, 100ms delay each, fade up + slight translateY)

---

### 2. Audio Lab (`/audio`)

**This is the centrepiece of the app. A real subliminal audio creation studio.**

**Layout: single page, vertical flow. No multi-step wizard — everything visible and adjustable.**

#### Section A: Record / Upload Affirmations
- **Heading**: "Your Affirmations" — Instrument Serif
- **Two input modes** (tab toggle):

**Tab 1: Record** (default)
- Large circular record button (64px, red when recording, pulse animation)
- Recording state: show live timer (MM:SS), pulsing red dot indicator
- When recorded: show waveform visualisation of the recording
  - Draw with Canvas: horizontal waveform bars, var(--waveform) colour
  - Show duration
  - Playback button (play/pause)
  - "Re-record" button (clears and starts over)
  - "Add another" button (to record multiple affirmations)
- Use MediaRecorder API → store as AudioBuffer
- Multiple recordings supported — show as a numbered list with individual playback + delete

**Tab 2: Type & Speak**
- Textarea: "Type your affirmations (one per line)"
- Placeholder text: "I am confident and powerful\nI attract abundance effortlessly\nMy mind is sharp and focused"
- Below textarea: voice selector
  - Use SpeechSynthesis to list available system voices in a dropdown
  - Rate slider (0.5-2.0, default 1.0)
  - "Preview" button — speaks the first affirmation
  - Note: "For best results, record in your own voice — it's more powerful for subconscious programming"
- "Generate Audio" button → renders all affirmations through SpeechSynthesis into an AudioBuffer using OfflineAudioContext
  - This is a fallback for people who can't/won't record — NOT the primary flow

**Below both tabs:**
- Show recorded/generated affirmation list with individual waveforms
- "Listen to originals" — plays all affirmations at normal speed/volume (this is the "reveal" — user knows exactly what's being programmed)

#### Section B: Processing — "Make it Subliminal"
- **Heading**: "Processing" — Instrument Serif
- **Technique selector** — 4 options as cards (multi-select, can combine):

**Card 1: Speed Layer** (recommended, pre-selected)
- Icon: fast-forward arrows
- Title: "Speed Layer"
- Description: "Speeds up your affirmations 2-8x. Too fast for conscious mind to decode, but your subconscious processes every word."
- When selected, show speed slider: 2x / 3x / 4x / 6x / 8x (pill toggle)
- Default: 4x
- Technical: use OfflineAudioContext to resample the AudioBuffer at higher playback rate

**Card 2: Volume Whisper**
- Icon: volume down icon
- Title: "Volume Whisper"
- Description: "Reduces affirmation volume to -20dB to -35dB beneath the soundscape. Present but imperceptible."
- When selected, show depth slider: -20dB to -35dB (default: -25dB)
- Visual: dB meter showing relative level
- Technical: apply gain reduction to affirmation buffer

**Card 3: Reverse Layer**
- Icon: reverse/mirror arrows
- Title: "Reverse Layer"
- Description: "Plays affirmations backwards. A classic subliminal technique — your subconscious doesn't need words in order."
- No additional settings
- Technical: reverse the AudioBuffer data (copy buffer, iterate backwards)

**Card 4: Ultrasonic (Silent)**
- Icon: ear with X / silent icon
- Title: "Silent Subliminal"
- Description: "Shifts affirmations above 17kHz — completely inaudible to the conscious ear. Pioneered by Bud Lowery in 1989."
- When selected, show carrier frequency: 17.5kHz (default, editable)
- Warning: "May not work on all speakers/headphones. Best with quality headphones."
- Technical: AM modulation — multiply affirmation signal by high-frequency carrier sine wave using OfflineAudioContext

**Processing preview:**
- "Preview processed audio" button — plays a 5-second snippet of the processed result
- Show before/after waveform comparison (original vs processed — smaller, side by side)

#### Section C: Soundscape Layer
- **Heading**: "Soundscape" — Instrument Serif
- **Ambient selection** — horizontal scroll cards (same procedural Web Audio as before):
  - Rain 🌧️, Ocean 🌊, Forest 🌲, Crystal Bowls 🔮, Deep Drone 🕉️, Pink Noise, Brown Noise, Silence
  - Each card: tap to select (single), tap to preview (3-second audio preview)
  - Selected card: border var(--accent)

- **Binaural layer** (toggle):
  - Off / Theta 6Hz / Alpha 10Hz / Delta 2Hz
  - Carrier: 200Hz default
  - 🎧 badge when enabled

- **Healing frequency** (toggle):
  - Off / 432Hz / 528Hz / 396Hz / 639Hz

- **Master mix preview**: 
  - "Preview full mix" button — plays 10 seconds of soundscape + processed subliminal layered together
  - Visual: dual waveform showing soundscape (dim) and subliminal (accent colour) layers

#### Section D: Export
- **Heading**: "Export" — Instrument Serif
- **Duration**: 5 / 10 / 15 / 20 / 30 / 60 min (pills)
  - The subliminal affirmation loop repeats throughout the duration
  - Soundscape generates for full duration
- **Session name**: text input (auto-default: "Deep Whisper Session — [date]")
- **Export button**: "Generate & Download" — large, var(--accent) bg, white text
  - On click: show progress bar ("Rendering audio... 34%")
  - Use OfflineAudioContext to render the full-duration audio
  - Mix all layers: processed affirmations (looped) + soundscape + binaural + healing freq
  - Apply fade in (5s) and fade out (10s)
  - Encode as WAV (or MP3 if using a library — WAV is simpler and lossless)
  - Trigger browser download
  - WAV encoding: write PCM data to ArrayBuffer with proper WAV header
- **Share**: generate shareable link with session config (same as v1 — base64 in URL)

#### Audio Processing Technical Details

**OfflineAudioContext rendering approach:**
All processing happens offline (not real-time) for export quality:

```typescript
// Create offline context matching target duration
const offlineCtx = new OfflineAudioContext(
  2, // stereo
  sampleRate * durationSeconds,
  sampleRate
);

// 1. Create processed affirmation buffer
// Speed: resample buffer at new rate
// Volume: apply gain
// Reverse: copy buffer data backwards
// Ultrasonic: AM modulate with carrier

// 2. Loop processed affirmations for full duration
const affirmationSource = offlineCtx.createBufferSource();
affirmationSource.buffer = processedBuffer;
affirmationSource.loop = true;
affirmationSource.connect(affirmationGain);

// 3. Generate soundscape for full duration
// Use same procedural generators but render into offline context

// 4. Add binaural + healing freq oscillators

// 5. Render
const renderedBuffer = await offlineCtx.startRendering();

// 6. Encode to WAV and download
const wavBlob = encodeWAV(renderedBuffer);
downloadBlob(wavBlob, `${sessionName}.wav`);
```

**WAV encoding function:**
```typescript
function encodeWAV(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = buffer.length * blockAlign;
  const headerSize = 44;
  
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  
  // Interleave channels and write PCM data
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }
  
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}
```

**Speed processing:**
```typescript
function speedUpBuffer(ctx: BaseAudioContext, buffer: AudioBuffer, speed: number): AudioBuffer {
  const newLength = Math.floor(buffer.length / speed);
  const offCtx = new OfflineAudioContext(buffer.numberOfChannels, newLength, buffer.sampleRate);
  const source = offCtx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = speed;
  source.connect(offCtx.destination);
  source.start();
  return offCtx.startRendering(); // returns Promise<AudioBuffer>
}
```

**Reverse processing:**
```typescript
function reverseBuffer(buffer: AudioBuffer): AudioBuffer {
  const ctx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const reversed = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const input = buffer.getChannelData(ch);
    const output = reversed.getChannelData(ch);
    for (let i = 0; i < buffer.length; i++) {
      output[i] = input[buffer.length - 1 - i];
    }
  }
  return reversed;
}
```

**Ultrasonic AM modulation:**
```typescript
async function ultrasonicShift(buffer: AudioBuffer, carrierHz: number): Promise<AudioBuffer> {
  const offCtx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const source = offCtx.createBufferSource();
  source.buffer = buffer;
  
  // Create carrier oscillator
  const carrier = offCtx.createOscillator();
  carrier.frequency.value = carrierHz;
  
  // Create gain node modulated by carrier
  const modGain = offCtx.createGain();
  modGain.gain.value = 0;
  carrier.connect(modGain.gain);
  
  source.connect(modGain);
  modGain.connect(offCtx.destination);
  
  source.start();
  carrier.start();
  
  return offCtx.startRendering();
}
```

---

### 3. Visual Flash (`/flash`)

**A fullscreen subliminal text flash experience.**

#### Setup Panel (shown first):
- **Heading**: "Visual Flash" — Instrument Serif
- **Affirmation input**: textarea, one per line
  - Placeholder: "I am powerful beyond measure\nAbundance flows to me\nI trust my journey"
  - Pre-fill with 5 default affirmations
- **Settings** (grid of controls):
  - **Flash duration**: slider 10ms — 200ms (default 50ms)
    - Label shows current value
    - Note: "Below 50ms is truly subliminal — your conscious mind cannot read it"
  - **Interval**: slider 2s — 15s (default 5s) — time between flashes
  - **Flash opacity**: slider 0.1 — 1.0 (default 0.3)
    - Lower = more subliminal, higher = more visible
  - **Text size**: Small / Medium / Large (pill toggle, default Medium)
  - **Position**: Centre / Random (pill toggle, default Random)
    - Random: each flash appears at a random screen position
  - **Background**: 
    - Dark void (default — just var(--bg-deep))
    - Sacred geometry (animated subtle line patterns)
    - Colour pulse (slow colour cycling dark background)
    - Custom colour picker
- **"Begin Session" button** — large, var(--accent)
- **Duration**: 5 / 10 / 15 / 20 / 30 min (pills, default 10)

#### Flash Mode (fullscreen):
- Tap "Begin Session" → go fullscreen (Fullscreen API)
- Background: chosen background option, full viewport
- **The flash mechanic:**
  - At each interval (e.g., every 5 seconds):
    - Pick next affirmation from the list (cycle through)
    - Render it on screen at configured position
    - Display for configured duration (e.g., 50ms)
    - Then hide instantly
  - Text style: DM Sans bold, configured size, var(--flash) colour at configured opacity
  - If "Random" position: random x (10-90vw), random y (20-80vh)
  - Optional: very subtle "whoosh" sound effect on flash (tiny sine ping, 5ms, very quiet) — toggle in settings

- **Sacred geometry background** (if selected):
  - Canvas animation: slowly rotating line patterns
  - Thin lines, var(--sacred) at 0.1 opacity
  - Metatron's Cube or Flower of Life, rotating at 0.02deg/frame
  - This is what makes screen recordings gorgeous for TikTok

- **Session counter**: tiny text bottom-right, var(--text-dim): "12/200 flashes" — barely visible

- **Controls**: tap screen to show/hide
  - Pause/Resume
  - Time remaining
  - Exit (return to setup)

- **Session complete**: 
  - Overlay: "Session complete. [X] subliminal flashes delivered in [Y] minutes."
  - "New session" / "Exit"

- **IMPORTANT for TikTok virality**: When sacred geometry background is active and flash opacity is set to 0.3-0.5 with random positioning, a screen recording of this looks INCREDIBLE — mysterious text appearing and vanishing over rotating sacred geometry. This is the primary content creation feature.

---

### 4. Subliminal Wallpaper (`/wallpaper`)

**Generate beautiful images with hidden affirmation text.**

#### Creation Panel:
- **Heading**: "Subliminal Wallpaper" — Instrument Serif
- **Affirmation input**: single text input
  - Placeholder: "I am worthy of love and abundance"
  - Max ~60 characters (needs to fit in design)
- **Style selection** — 4 preset styles as preview cards:

**Style 1: Sacred Geometry**
- Background: dark gradient (deep indigo to black)
- Flower of Life pattern drawn in thin lines
- Affirmation text rendered WITHIN the geometry lines at 0.03-0.05 opacity
- Text follows circular paths of the sacred geometry
- Colours: var(--sacred) lines, var(--text-primary) text at near-invisible opacity

**Style 2: Mandala**
- Background: deep teal to black gradient
- Radial mandala pattern (concentric circles with petal shapes)
- Affirmation text repeated in a spiral from centre outward at 0.03 opacity
- Text gets smaller as it spirals out

**Style 3: Cosmic**
- Background: deep space black with tiny star dots
- Nebula-like colour cloud (subtle, dark purple/blue/pink at low opacity)
- Affirmation text scattered across the image at random angles and sizes, 0.02-0.04 opacity
- Some text very large (fills viewport width), some tiny — layered depth effect

**Style 4: Minimal**
- Background: pure black or deep grey
- Affirmation text repeated hundreds of times in a grid pattern
- Each instance: tiny font (6-8px equivalent), 0.02 opacity
- Creates a subtle texture that looks like noise but is actually your affirmation

- **Preview**: live Canvas preview showing the wallpaper (phone aspect ratio: 390×844 or 1170×2532)
- **Reveal toggle**: switch that bumps text opacity to 0.5 so you can SEE where the text is hidden — toggle back to see the subliminal version
- **Download button**: "Download Wallpaper" → exports Canvas as PNG at high resolution (1170×2532 for phone)
  - `canvas.toBlob()` → trigger download
- **Size options**: Phone (1170×2532) / Desktop (2560×1440) / iPad (2048×2732)

#### Canvas Rendering Technical:

All wallpapers rendered on Canvas:

```typescript
// Phone wallpaper dimensions
const PHONE_WIDTH = 1170;
const PHONE_HEIGHT = 2532;

function renderSacredGeometry(ctx: CanvasRenderingContext2D, text: string, reveal: boolean) {
  // 1. Draw gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, PHONE_HEIGHT);
  grad.addColorStop(0, '#0A0820');
  grad.addColorStop(1, '#050510');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, PHONE_WIDTH, PHONE_HEIGHT);
  
  // 2. Draw Flower of Life
  const centerX = PHONE_WIDTH / 2;
  const centerY = PHONE_HEIGHT / 2;
  const radius = PHONE_WIDTH * 0.3;
  ctx.strokeStyle = reveal ? 'rgba(196, 161, 255, 0.3)' : 'rgba(196, 161, 255, 0.08)';
  ctx.lineWidth = 1;
  // Draw 7 overlapping circles in Flower of Life pattern
  drawFlowerOfLife(ctx, centerX, centerY, radius);
  
  // 3. Embed text along the geometry paths
  ctx.font = '14px "DM Sans"';
  ctx.fillStyle = reveal ? 'rgba(232, 230, 240, 0.5)' : 'rgba(232, 230, 240, 0.035)';
  // Render text along circular arcs of the Flower of Life
  // Repeat the text multiple times to fill the pattern
  for (let ring = 0; ring < 6; ring++) {
    const ringRadius = radius * (ring + 1) / 6;
    renderTextAlongCircle(ctx, text, centerX, centerY, ringRadius);
  }
}
```

---

### 5. Learn Page (`/learn`)

**Clean, informative, honest. NOT salesy.**

- **Heading**: "How Subliminals Work" — Instrument Serif
- **Sections** (vertical scroll, clean typography):

**Section 1: "What is a subliminal?"**
- Brief explanation: a message delivered below the threshold of conscious perception
- The word "subliminal" comes from Latin: sub (below) + limen (threshold)
- Three types: audio, visual, and embedded image

**Section 2: "Audio techniques"**
- **Speed layering**: Affirmations sped up 4-8x. Sounds like rapid chittering — your conscious mind can't decode it, but research suggests the subconscious can process compressed speech.
- **Volume reduction**: Affirmations mixed at -20 to -35dB beneath ambient sound. Present in the recording but imperceptible.
- **Reverse audio**: Played backwards under forward-playing music. A debated but popular technique.
- **Ultrasonic/Silent**: Affirmations modulated onto a carrier frequency above 17kHz. Completely inaudible. Pioneered by Oliver Lowery (US Patent 5,159,703, 1992).
- Each technique: brief paragraph + inline diagram/visual showing what happens to the waveform

**Section 3: "Visual techniques"**
- **Flash**: Text shown for <50ms — below conscious reading speed but registered by visual cortex
- **Embedded image**: Text hidden within artwork at near-invisible opacity
- Historical context: the famous (debunked) 1957 "Drink Coca-Cola" experiment by James Vicary, and the (real) research that followed

**Section 4: "The honest take"**
- Be transparent: subliminal priming has some research support for short-term effects
- Not a magic bullet — it's a tool to complement intentional practice
- Most effective when: you know what's being programmed (hence the "reveal" feature), you're consistent, and you combine with conscious intention
- Link to published research

**Section 5: "Tools in Deep Whisper"**
- Quick cards linking to /audio, /flash, /wallpaper with one-line descriptions
- "Part of Harmonic Waves ecosystem" badge

---

## File Structure
```
src/
├── app/
│   ├── layout.tsx               # Root layout, fonts, metadata, Plausible, global styles
│   ├── page.tsx                 # Landing page with 3 tool cards
│   ├── globals.css              # CSS custom properties, scrollbar hide, grain texture
│   ├── audio/
│   │   └── page.tsx             # Audio Lab — full creation studio
│   ├── flash/
│   │   └── page.tsx             # Visual Flash — setup + fullscreen flash mode
│   ├── wallpaper/
│   │   └── page.tsx             # Subliminal Wallpaper generator
│   └── learn/
│       └── page.tsx             # Education page
├── components/
│   ├── WaveformVisualiser.tsx   # Canvas waveform display for recorded audio
│   ├── RecordButton.tsx         # Circular record button with states (idle/recording/recorded)
│   ├── AudioPlayer.tsx          # Simple play/pause with waveform for recorded clips
│   ├── TechniqueCard.tsx        # Selectable processing technique card
│   ├── SoundscapeSelector.tsx   # Ambient + binaural + healing freq controls
│   ├── ExportProgress.tsx       # Progress bar for offline rendering
│   ├── FlashCanvas.tsx          # Fullscreen flash mode Canvas/DOM renderer
│   ├── SacredGeometry.tsx       # Canvas sacred geometry drawing utilities
│   ├── WallpaperPreview.tsx     # Live wallpaper preview with reveal toggle
│   ├── ToolCard.tsx             # Landing page tool card component
│   └── EcosystemBadge.tsx       # "Part of Harmonic Waves" badge
├── hooks/
│   ├── useAudioRecorder.ts      # MediaRecorder wrapper: record, stop, get AudioBuffer
│   ├── useAudioProcessor.ts     # Offline processing: speed, reverse, volume, ultrasonic
│   ├── useAudioExport.ts        # Full session rendering + WAV encoding + download
│   ├── useSoundscape.ts         # Procedural ambient + binaural + healing freq (real-time for preview)
│   ├── useFlashSession.ts       # Visual flash timing/state management
│   └── useFullscreen.ts         # Fullscreen API wrapper
├── lib/
│   ├── audio/
│   │   ├── processor.ts         # Core: speedUp, reverse, volumeReduce, ultrasonicShift functions
│   │   ├── wav-encoder.ts       # WAV file encoding from AudioBuffer
│   │   ├── noise.ts             # White/brown/pink noise generators
│   │   ├── ambients.ts          # Procedural soundscape generators
│   │   ├── binaural.ts          # Binaural beat setup
│   │   └── speech.ts            # SpeechSynthesis → AudioBuffer helper
│   ├── canvas/
│   │   ├── sacred-geometry.ts   # Flower of Life, Metatron's Cube, Mandala drawing functions
│   │   ├── wallpaper.ts         # Wallpaper rendering: all 4 styles
│   │   └── waveform.ts          # Waveform visualisation drawing
│   └── utils.ts                 # nanoid, formatTime, etc.
├── types/
│   └── index.ts                 # All TypeScript interfaces
└── public/
    ├── manifest.json            # PWA manifest
    └── icons/                   # PWA icons
```

---

## TypeScript Interfaces

```typescript
// types/index.ts

export type ProcessingTechnique = 'speed' | 'volume' | 'reverse' | 'ultrasonic';

export interface ProcessingConfig {
  techniques: ProcessingTechnique[];
  speedMultiplier: number;        // 2-8, default 4
  volumeReduction: number;        // -20 to -35 dB, default -25
  ultrasonicCarrier: number;      // Hz, default 17500
}

export type AmbientType = 'rain' | 'ocean' | 'forest' | 'bowls' | 'drone' | 'pink-noise' | 'brown-noise' | 'silence';
export type BinauralPreset = 'off' | 'theta' | 'alpha' | 'delta';
export type HealingFrequency = 0 | 432 | 528 | 396 | 639;

export interface SoundscapeConfig {
  ambient: AmbientType;
  binaural: BinauralPreset;
  carrierFreq: number;
  healingFreq: HealingFrequency;
}

export interface AudioSession {
  id: string;
  name: string;
  affirmations: string[];         // text of affirmations
  recordings: string[];           // blob URLs of recorded audio
  processing: ProcessingConfig;
  soundscape: SoundscapeConfig;
  duration: number;               // seconds
  createdAt: string;
}

export type FlashPosition = 'centre' | 'random';
export type FlashBackground = 'dark' | 'sacred-geometry' | 'colour-pulse' | 'custom';

export interface FlashConfig {
  affirmations: string[];
  flashDuration: number;          // ms (10-200)
  interval: number;               // seconds (2-15)
  opacity: number;                // 0.1-1.0
  textSize: 'small' | 'medium' | 'large';
  position: FlashPosition;
  background: FlashBackground;
  customBgColour?: string;
  sessionDuration: number;        // seconds
  soundEnabled: boolean;
}

export type WallpaperStyle = 'sacred-geometry' | 'mandala' | 'cosmic' | 'minimal';
export type WallpaperSize = 'phone' | 'desktop' | 'tablet';

export interface WallpaperConfig {
  affirmation: string;
  style: WallpaperStyle;
  size: WallpaperSize;
  reveal: boolean;
}

// Wallpaper dimensions
export const WALLPAPER_SIZES = {
  phone: { width: 1170, height: 2532 },
  desktop: { width: 2560, height: 1440 },
  tablet: { width: 2048, height: 2732 },
} as const;
```

---

## Metadata

```typescript
export const metadata: Metadata = {
  title: 'Deep Whisper — Subliminal Creation Studio',
  description: 'Create real subliminal audio, visual flash sessions, and hidden-message wallpapers. Record your affirmations, process with speed/reverse/ultrasonic techniques, and export. Free web tool.',
  keywords: ['subliminal maker', 'subliminal audio', 'subliminal generator', 'create subliminals', 'subliminal messages', 'visual subliminal', 'subliminal wallpaper', 'affirmations'],
  openGraph: {
    title: 'Deep Whisper — Subliminal Creation Studio',
    description: 'Create real subliminal audio, visual flash sessions, and hidden-message wallpapers. Free.',
    url: 'https://deepwhisper.app',
    siteName: 'Deep Whisper',
  },
  manifest: '/manifest.json',
  themeColor: '#4A3AFF',
};
```

---

## Critical Implementation Notes

### Audio Recording → AudioBuffer
MediaRecorder gives you a Blob. To process it, you need an AudioBuffer:
```typescript
async function blobToAudioBuffer(blob: Blob, ctx: AudioContext): Promise<AudioBuffer> {
  const arrayBuffer = await blob.arrayBuffer();
  return ctx.decodeAudioData(arrayBuffer);
}
```

### OfflineAudioContext for Export
ALL audio processing and final export rendering MUST use OfflineAudioContext — not real-time AudioContext. This ensures:
- Processing happens as fast as possible (not real-time)
- No audio glitches
- Deterministic output
- Can render 30-60 minute files without playing them

### iOS Safari
- AudioContext/OfflineAudioContext: create inside user gesture handler
- MediaRecorder: request microphone permission, handle denial gracefully
- Fullscreen API: limited on iOS Safari — handle gracefully (show a "go fullscreen in your browser" message, or use a CSS fullscreen approach with position:fixed + 100vh)
- Canvas toBlob: supported on iOS but test with large wallpaper sizes

### SpeechSynthesis → AudioBuffer (Type & Speak fallback)
This is tricky — SpeechSynthesis can't be directly captured into an AudioBuffer in most browsers. Approach:
- Use MediaStream + MediaRecorder: create a MediaStreamDestination from AudioContext, but SpeechSynthesis doesn't route through Web Audio API
- Alternative: use the SpeechSynthesis directly for real-time preview only, and encourage users to record their own voice for export
- For the "Type & Speak" tab: render speech in real-time for preview only, and show a note: "For downloadable subliminals, please use the Record tab to capture your voice"
- This is the honest approach — don't fake it

### Wallpaper Canvas Resolution
- Render at full resolution (1170×2532 for phone) but display preview scaled down
- Use CSS: `canvas { width: 100%; max-width: 300px; height: auto; }`
- Set canvas.width and canvas.height to actual pixel dimensions
- Text at 0.03 opacity WILL be visible at full resolution but nearly invisible on a phone screen at normal viewing distance — this is correct subliminal behaviour

---

## Quality Checklist
- [ ] No scrollbars visible anywhere
- [ ] NOT generic AI aesthetic — looks like a real studio tool
- [ ] Audio recording works on Chrome + Safari (mobile + desktop)
- [ ] Waveform visualisation renders correctly
- [ ] All 4 processing techniques produce correct output
- [ ] OfflineAudioContext renders full sessions without crashes
- [ ] WAV export downloads correctly and plays in any audio player
- [ ] Visual Flash fullscreen works (or graceful fallback on iOS)
- [ ] Flash timing is accurate (requestAnimationFrame + performance.now)
- [ ] All 4 wallpaper styles render beautifully
- [ ] Wallpaper reveal toggle works
- [ ] Wallpaper PNG download works at full resolution
- [ ] Canvas doesn't exceed memory on mobile for large wallpapers
- [ ] All fonts load (Instrument Serif, DM Sans, IBM Plex Mono)
- [ ] Plausible analytics present
- [ ] PWA manifest correct
- [ ] Build passes: npm run build with 0 errors
- [ ] Mobile-first responsive on all pages
- [ ] Instrument Serif used for headings, DM Sans for body, IBM Plex Mono for data
- [ ] No console errors

---

## Deploy
After building:
```bash
git add -A
git commit -m "Deep Whisper v2 — Subliminal Creation Studio"
git push origin master:main
```

Delete ALL old source files in src/ first. This is a complete rebuild. Keep package.json (update dependencies if needed), tsconfig, tailwind.config, next.config. Replace everything in src/.

Build the entire app now. Make it feel like a real tool that a creator or practitioner would actually use — not a meditation app with pretty animations. This needs to be FUNCTIONAL and POWERFUL, with the beauty coming from precision and clarity, not decorative fluff.
