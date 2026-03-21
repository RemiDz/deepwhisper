# DeepWhisper — Cinematic Gear Wheel Load Animation

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: gigathink

## Overview

Add a cinematic load animation to the gear wheel on the Today view. When the page first loads, the wheel assembles itself from the void — gears spinning in opposite directions, elements materialising one by one, then decelerating and locking into today's Kin position. This creates a mesmerising "cosmic clockwork assembling" effect perfect for TikTok screen recordings.

Also add a small replay button so users can trigger the animation again without refreshing the page.

---

## Animation Sequence (total duration: ~3 seconds)

The animation runs in the `requestAnimationFrame` loop that already exists in GearWheel.tsx. Use a state variable `animationPhase` and `animationStartTime` to track progress.

### Phase 1: Moon Emerges (0ms - 600ms)

- The moon centre (which is a DOM overlay) fades in from `opacity: 0` to `opacity: 1`
- Use a CSS transition on the moon overlay container: `transition: opacity 0.6s ease-out`
- Everything else (both gears, pointer, mesh zone) is hidden/transparent during this phase

### Phase 2: Inner Gear Materialises + Spins Clockwise (400ms - 1600ms)

- Starting at 400ms (overlapping slightly with the moon fade)
- The inner gear ring fades in from `globalAlpha: 0` to full opacity over 600ms
- While fading in, the inner gear is SPINNING CLOCKWISE at a steady speed (about 1 full rotation per 2 seconds)
- The 13 tone dot-and-bar symbols appear one by one as the gear rotates — each symbol fades in when its tooth position passes the twelve o'clock point
- The inner gear teeth (purple) also fade in progressively

### Phase 3: Outer Gear Materialises + Spins Counter-Clockwise (800ms - 2000ms)

- Starting at 800ms (overlapping with inner gear)
- The outer gear ring fades in from `globalAlpha: 0` to full opacity over 600ms
- While fading in, the outer gear is SPINNING COUNTER-CLOCKWISE (opposite to inner gear) at a similar speed
- The 20 seal icons appear one by one as the gear rotates — each icon fades in with a subtle scale-up (0.5 → 1.0) when its position passes twelve o'clock
- The counter-rotation against the inner gear creates the mesmerising interlocking illusion

### Phase 4: Deceleration + Lock (2000ms - 2800ms)

- Both gears begin decelerating from their free-spin speeds
- Use an easing curve (ease-out-cubic or similar) — fast at first, gradually slowing
- Both gears converge toward their target angles for today's Kin:
  - Inner gear target: `-(toneIndex / 13) * 2π`
  - Outer gear target: `-(sealIndex / 20) * 2π`
- The deceleration should feel natural, like mechanical gears finding their resting position
- Near the end, the gears "settle" with a very subtle overshoot-and-return (spring effect) to give a satisfying "click into place" feeling

### Phase 5: Engage + Reveal (2800ms - 3200ms)

- The mesh zone highlight at twelve o'clock pulses once (opacity 0 → 0.3 → 0.15 over 400ms)
- The pointer triangle fades in
- The Kin info text below the wheel fades in (use CSS transition on the text container)
- The energy intensity component fades in

### After Animation

- The wheel returns to its normal interactive state (drag-to-spin, day navigation all work normally)
- `animationPhase` is set to `'complete'`
- All existing interactivity is preserved exactly as before

---

## Implementation Approach

### State Variables (add to GearWheel component)

```typescript
const [animPhase, setAnimPhase] = useState<'idle' | 'running' | 'complete'>('idle');
const animStartRef = useRef<number>(0);
const animSpinOuter = useRef<number>(0); // free-spin angle for outer gear
const animSpinInner = useRef<number>(0); // free-spin angle for inner gear
const animFadeOuter = useRef<number>(0); // 0-1 fade progress for outer
const animFadeInner = useRef<number>(0); // 0-1 fade progress for inner
const visibleSeals = useRef<boolean[]>(new Array(20).fill(false));
const visibleTones = useRef<boolean[]>(new Array(13).fill(false));
```

### In the Animation Frame

```typescript
function animate(timestamp: number) {
  if (animPhase === 'running') {
    const elapsed = timestamp - animStartRef.current;
    
    // Phase 1: Moon (handled by CSS, not canvas)
    
    // Phase 2: Inner gear spin + fade (400-1600ms)
    if (elapsed >= 400 && elapsed < 1600) {
      const t = (elapsed - 400) / 1200;
      animFadeInner.current = Math.min(1, t * 1.5); // fade in faster than phase duration
      animSpinInner.current += 0.03; // clockwise spin speed per frame
      
      // Reveal tones one by one as they pass twelve o'clock
      const innerAngleNow = animSpinInner.current;
      for (let i = 0; i < 13; i++) {
        const toneAngle = innerAngleNow + i * (Math.PI * 2 / 13) - Math.PI / 2;
        const normAngle = ((toneAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        // If this tone has passed near the top (around -π/2 or 3π/2)
        if (normAngle < Math.PI * 0.3 || normAngle > Math.PI * 1.7) {
          visibleTones.current[i] = true;
        }
      }
    }
    
    // Phase 3: Outer gear spin + fade (800-2000ms)
    if (elapsed >= 800 && elapsed < 2000) {
      const t = (elapsed - 800) / 1200;
      animFadeOuter.current = Math.min(1, t * 1.5);
      animSpinOuter.current -= 0.025; // counter-clockwise (negative)
      
      // Reveal seals one by one
      const outerAngleNow = animSpinOuter.current;
      for (let i = 0; i < 20; i++) {
        const sealAngle = outerAngleNow + i * (Math.PI * 2 / 20) - Math.PI / 2;
        const normAngle = ((sealAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        if (normAngle < Math.PI * 0.3 || normAngle > Math.PI * 1.7) {
          visibleSeals.current[i] = true;
        }
      }
    }
    
    // Continue free-spinning during overlap
    if (elapsed >= 1600) animSpinInner.current += 0.03 * Math.max(0, 1 - (elapsed - 1600) / 1200);
    if (elapsed >= 2000) animSpinOuter.current -= 0.025 * Math.max(0, 1 - (elapsed - 2000) / 800);
    
    // Phase 4: Deceleration (2000-2800ms)
    if (elapsed >= 2000 && elapsed < 2800) {
      const t = (elapsed - 2000) / 800;
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      
      // Blend from current free-spin angle to target angle
      // Inner gear
      const innerTarget = -(toneIndex / 13) * Math.PI * 2;
      innerAngle = animSpinInner.current + (innerTarget - animSpinInner.current) * eased;
      
      // Outer gear
      const outerTarget = -(sealIndex / 20) * Math.PI * 2;
      outerAngle = animSpinOuter.current + (outerTarget - animSpinOuter.current) * eased;
      
      animFadeInner.current = 1;
      animFadeOuter.current = 1;
      // All seals and tones visible by now
      visibleSeals.current.fill(true);
      visibleTones.current.fill(true);
    }
    
    // Phase 5: Engage (2800-3200ms)
    if (elapsed >= 2800 && elapsed < 3200) {
      // Mesh zone pulse
      const t = (elapsed - 2800) / 400;
      meshPulseAlpha = t < 0.5 ? t * 0.6 : (1 - t) * 0.6 + 0.15;
    }
    
    // Animation complete
    if (elapsed >= 3200) {
      setAnimPhase('complete');
      // Ensure final angles are correct
      innerAngle = -(toneIndex / 13) * Math.PI * 2;
      outerAngle = -(sealIndex / 20) * Math.PI * 2;
    }
    
    // During animation, use animated angles for drawing
    // Override outerAngle and innerAngle with animated values
  }
  
  draw(); // existing draw function
  requestAnimationFrame(animate);
}
```

### In the Draw Function

When `animPhase === 'running'`:
- Use `animFadeOuter.current` and `animFadeInner.current` as additional alpha multipliers for each gear
- Only draw seal icons where `visibleSeals.current[i] === true`
- Only draw tone symbols where `visibleTones.current[i] === true`
- For newly visible seals, apply a scale-up animation (start at 0.5 scale, ease to 1.0 over 200ms)
- Use `animSpinOuter.current` / `animSpinInner.current` as the rotation angles during phases 2-3
- During phase 4, blend toward target angles

When `animPhase === 'complete'` or `animPhase === 'idle'`:
- Draw normally (existing behaviour, no animation modifications)

---

## Starting the Animation

### On First Page Load

When the component mounts, start the animation:
```typescript
useEffect(() => {
  // Small delay to ensure everything is rendered
  const timer = setTimeout(() => {
    startAnimation();
  }, 300);
  return () => clearTimeout(timer);
}, []);

function startAnimation() {
  setAnimPhase('running');
  animStartRef.current = performance.now();
  animSpinOuter.current = 0;
  animSpinInner.current = 0;
  animFadeOuter.current = 0;
  animFadeInner.current = 0;
  visibleSeals.current.fill(false);
  visibleTones.current.fill(false);
  // Also trigger CSS fade-in on moon overlay and Kin info text
}
```

### Fade-in for DOM Elements (Moon, Kin Info, Energy Intensity)

These are NOT canvas elements, so animate them with CSS:

```tsx
// Moon overlay container
<div style={{
  opacity: animPhase === 'idle' ? 0 : 1,
  transition: 'opacity 0.6s ease-out',
  transitionDelay: '0s'
}}>
  {/* existing moon component */}
</div>

// Kin info text below wheel
<div style={{
  opacity: animPhase === 'complete' ? 1 : 0,
  transition: 'opacity 0.4s ease-out',
}}>
  {/* existing kin info */}
</div>

// Energy intensity component
<div style={{
  opacity: animPhase === 'complete' ? 1 : 0,
  transition: 'opacity 0.4s ease-out',
  transitionDelay: '0.2s'
}}>
  <EnergyIntensity ... />
</div>
```

---

## Replay Button

Add a small circular replay button positioned OUTSIDE the wheel area — specifically below the navigation buttons row (< Today >) but above the Kin info text. This avoids any conflict with the wheel's drag-to-spin and tap interactions.

**Button specs:**
- Small circle, 32px diameter
- Icon: a simple circular arrow (replay/refresh symbol) drawn as an SVG path
- Background: rgba(255,255,255,0.04)
- Border: 0.5px solid rgba(255,255,255,0.08)
- Border-radius: 50%
- On hover: background rgba(255,255,255,0.08)
- Position: centred horizontally, sitting in the row with the nav buttons OR just below them
- When tapped: calls `startAnimation()` which resets everything and replays the full sequence

**Alternative position:** to the right of the "Today" button, as a small icon button in the same row. This keeps it contextually grouped with the navigation controls.

```tsx
<div className="nav-row">
  <button onClick={() => setDayOffset(prev => prev - 1)}>{'<'}</button>
  <button onClick={() => setDayOffset(0)}>Today</button>
  <button onClick={() => setDayOffset(prev => prev + 1)}>{'>'}</button>
  <button 
    onClick={startAnimation}
    style={{
      width: 32, height: 32, borderRadius: '50%',
      background: 'rgba(255,255,255,0.04)',
      border: '0.5px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', marginLeft: 8
    }}
    title="Replay animation"
  >
    {/* Simple replay icon SVG */}
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 7A5 5 0 1 1 7 2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 0.5L9 2.5L7 4.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
</div>
```

---

## Important: Preserve Existing Interactivity

- During the animation (`animPhase === 'running'`), **disable** drag-to-spin and day navigation buttons. The user should just watch.
- Once `animPhase === 'complete'`, all interactivity returns to normal.
- If the user taps prev/next during animation, ignore the input or immediately complete the animation and jump to the requested day.

---

## DO NOT

- Do NOT modify the moon centre component itself — only its container opacity
- Do NOT modify the Learn tab or Daily tab
- Do NOT modify the energy intensity component logic — only its container opacity for the fade-in
- Do NOT change the gear drawing logic (tooth shapes, colours, proportions) — only add animation control over opacity, rotation, and visibility
- Do NOT break the existing drag-to-spin or day navigation

## Quality Checks

- [ ] On first page load, the wheel animates from void
- [ ] Moon appears first (fade in)
- [ ] Inner gear spins clockwise while materialising
- [ ] Outer gear spins counter-clockwise while materialising
- [ ] Tone symbols appear one by one as inner gear rotates
- [ ] Seal icons appear one by one as outer gear rotates
- [ ] Both gears decelerate and lock into today's Kin position
- [ ] Mesh zone pulses once when gears engage
- [ ] Kin info and energy intensity fade in after gears lock
- [ ] Replay button visible and functional
- [ ] Replay button does NOT interfere with wheel interaction
- [ ] After animation completes, all interactivity works normally
- [ ] Drag-to-spin works after animation
- [ ] Day navigation works after animation
- [ ] Animation duration is ~3 seconds total
- [ ] Animation looks smooth at 60fps
- [ ] `git push origin master:main` succeeds
