# DeepWhisper — Animation Complete Rewrite (Simplest Approach)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: gigathink

## The Problem

Every attempt to fix the animation easing has resulted in gears speeding up in the middle or end. The phased approach with custom easing functions is failing.

## The Solution: Completely Replace With The Simplest Possible Approach

Delete ALL existing animation phase logic, custom easing functions, captured angles, deceleration blending, and phase tracking. Replace with ONE simple function.

### The Entire Animation Logic (replace everything)

The animation is nothing more than: interpolate two angles from A to B over time using a smooth curve. That's it. No phases. No blending. No captured angles.

```typescript
// === CONSTANTS ===
const ANIM_DURATION = 5500; // 5.5 seconds total
const INNER_EXTRA_ROTATIONS = 2; // inner gear travels 2 extra full rotations
const OUTER_EXTRA_ROTATIONS = 2; // outer gear travels 2 extra full rotations

// === EASING: simple sine ease-in-out ===
// This curve is mathematically guaranteed to:
// - Start at speed 0 (gentle beginning)
// - Reach max speed at the middle
// - End at speed 0 (gentle ending)
// It CANNOT speed up at the end. It's physically impossible with this function.
function smoothEase(t: number): number {
  return t - Math.sin(t * Math.PI * 2) / (Math.PI * 2);
}
// Note: smoothEase(0) = 0, smoothEase(1) = 1
// The derivative is (1 - cos(2πt)) which is always >= 0
// Speed is 0 at t=0, peaks at t=0.5, returns to 0 at t=1

// === STATE ===
const animRunning = useRef(false);
const animStartTime = useRef(0);
const innerAngleStart = useRef(0);
const innerAngleEnd = useRef(0);
const outerAngleStart = useRef(0);
const outerAngleEnd = useRef(0);

// === START ANIMATION ===
function startAnimation() {
  // Calculate where gears need to end up (today's Kin)
  const innerEnd = -(toneIndex / 13) * Math.PI * 2;
  const outerEnd = -(sealIndex / 20) * Math.PI * 2;
  
  // Starting positions: extra rotations BEFORE the target
  // Inner spins clockwise (angle decreases), so start ABOVE target
  innerAngleStart.current = innerEnd + Math.PI * 2 * INNER_EXTRA_ROTATIONS;
  innerAngleEnd.current = innerEnd;
  
  // Outer spins counter-clockwise (angle increases), so start BELOW target  
  outerAngleStart.current = outerEnd - Math.PI * 2 * OUTER_EXTRA_ROTATIONS;
  outerAngleEnd.current = outerEnd;
  
  animStartTime.current = performance.now();
  animRunning.current = true;
  
  // Reset visibility for progressive reveal
  sealVisible.current = new Array(20).fill(false);
  toneVisible.current = new Array(13).fill(false);
}

// === IN THE ANIMATION FRAME (inside existing requestAnimationFrame loop) ===
if (animRunning.current) {
  const elapsed = performance.now() - animStartTime.current;
  const t = Math.min(1, elapsed / ANIM_DURATION); // 0 to 1
  const eased = smoothEase(t);
  
  // Simple linear interpolation with easing
  outerAngle = outerAngleStart.current + (outerAngleEnd.current - outerAngleStart.current) * eased;
  innerAngle = innerAngleStart.current + (innerAngleEnd.current - innerAngleStart.current) * eased;
  
  // Fade in gears
  const innerAlpha = Math.min(1, Math.max(0, (elapsed - 300) / 800));
  const outerAlpha = Math.min(1, Math.max(0, (elapsed - 600) / 800));
  
  // Progressive reveal of elements (first 60% of animation)
  const revealT = Math.min(1, elapsed / (ANIM_DURATION * 0.6));
  for (let i = 0; i < Math.floor(revealT * 13); i++) toneVisible.current[i] = true;
  for (let i = 0; i < Math.floor(revealT * 20); i++) sealVisible.current[i] = true;
  if (revealT >= 1) {
    toneVisible.current.fill(true);
    sealVisible.current.fill(true);
  }
  
  // Apply alphas when drawing
  // (multiply each gear's globalAlpha by innerAlpha or outerAlpha)
  
  // Mesh pulse in last 500ms
  if (elapsed > ANIM_DURATION - 500) {
    const pt = (elapsed - (ANIM_DURATION - 500)) / 500;
    meshPulseAlpha = Math.sin(pt * Math.PI) * 0.25 + 0.15;
  }
  
  // End animation
  if (t >= 1) {
    animRunning.current = false;
    outerAngle = outerAngleEnd.current;
    innerAngle = innerAngleEnd.current;
    // Trigger fade-in of text elements below wheel
  }
}

// === DRAW FUNCTION MODIFICATIONS ===
// When animRunning.current is true:
//   - Multiply outer gear drawing alpha by outerAlpha
//   - Multiply inner gear drawing alpha by innerAlpha  
//   - Only draw seal[i] if sealVisible.current[i] is true
//   - Only draw tone[i] if toneVisible.current[i] is true
//
// When animRunning.current is false:
//   - Draw everything normally (existing code, no changes)
```

### CRITICAL: Delete All Old Animation Code

Remove completely:
- Any `animPhase` state ('idle' | 'running' | 'complete')
- Any `easeOutQuint` function
- Any `cosmicEase` function  
- Any `decelStartCaptured` ref
- Any `capturedInnerAngle` / `capturedOuterAngle` refs
- Any `animSpinInner` / `animSpinOuter` refs
- Any phase-based if/else chains (Phase 1, Phase 2, Phase 3, Phase 4, Phase 5)
- Any free-spin speed accumulation (`+= 0.03` per frame etc.)

Replace with ONLY the code above. The animation is just: interpolate from A to B using smoothEase(t). Nothing else.

### Why smoothEase Cannot Speed Up At The End

The function `f(t) = t - sin(2πt)/(2π)` has derivative `f'(t) = 1 - cos(2πt)`.

- At t=0: f'(0) = 1 - cos(0) = 1 - 1 = 0 (starts still)
- At t=0.25: f'(0.25) = 1 - cos(π/2) = 1 - 0 = 1 (speeding up)
- At t=0.5: f'(0.5) = 1 - cos(π) = 1 - (-1) = 2 (max speed)
- At t=0.75: f'(0.75) = 1 - cos(3π/2) = 1 - 0 = 1 (slowing down)
- At t=1: f'(1) = 1 - cos(2π) = 1 - 1 = 0 (stopped)

The speed curve is a perfect smooth hill: 0 → peak → 0. It is mathematically impossible for this function to accelerate at the end.

### Today Button

Keep the existing behaviour: Today button calls `startAnimation()` and resets dayOffset to 0.

### Disabling Interaction During Animation

While `animRunning.current` is true:
- Ignore drag-to-spin pointer events
- Ignore prev/next button presses
- OR: if prev/next is pressed during animation, immediately set `animRunning.current = false` and jump to the requested day

### DOM Element Fade-ins

Moon container: fade in over first 800ms (CSS transition, triggered on mount or animation start)
Kin info text: fade in after animation completes (CSS transition, triggered when animRunning becomes false)
Energy intensity: fade in 200ms after Kin info

---

## DO NOT

- Do NOT keep any old animation phase code — delete it all
- Do NOT use easeOutQuint or cosmicEase — use ONLY smoothEase as defined above
- Do NOT accumulate spin angles per frame — the angle is ALWAYS calculated as a direct interpolation
- Do NOT change gear drawing (colours, proportions, tooth shapes)
- Do NOT change moon, Learn tab, Daily tab, Energy Intensity logic

## Quality Checks

- [ ] Animation starts GENTLY (gears barely moving)
- [ ] Animation reaches max speed in the MIDDLE
- [ ] Animation ends GENTLY (gears barely moving, settling softly)
- [ ] Speed NEVER increases after the halfway point
- [ ] NO direction reversal at any point
- [ ] Total duration ~5.5 seconds
- [ ] Gears spin in opposite directions throughout
- [ ] Elements appear progressively during first 60%
- [ ] Mesh zone pulses at the end
- [ ] Today button replays animation
- [ ] All old animation phase code is deleted
- [ ] `git push origin master:main` succeeds
