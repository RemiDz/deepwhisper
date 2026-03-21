# DeepWhisper — Animation Direction Fix (Critical)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: gigathink

## The Problem (CRITICAL)

The animation has the gears free-spinning in one direction, then when deceleration begins, the gears have to REVERSE direction to reach today's target angles. This causes an ugly fast snap/reversal in the middle of the animation.

**The fix:** The free-spin must be set up so that both gears approach their target angles from a direction that requires ONLY deceleration, never reversal.

## The Solution: Approach From Behind

Instead of free-spinning in arbitrary directions and then trying to blend to the target, pre-calculate the entire animation path so that each gear:

1. Starts at a position that is several full rotations BEFORE the target
2. Spins toward the target throughout the entire animation
3. Decelerates smoothly as it approaches the target
4. Never reverses direction

### Implementation

**Replace the entire animation logic in GearWheel.tsx** with this approach:

```typescript
// Pre-calculate animation paths when animation starts
function startAnimation() {
  setAnimPhase('running');
  animStartRef.current = performance.now();
  
  // Target angles for today's Kin
  const innerTarget = -(toneIndex / 13) * Math.PI * 2;
  const outerTarget = -(sealIndex / 20) * Math.PI * 2;
  
  // Inner gear: starts several rotations before target, spinning CLOCKWISE
  // Add extra full rotations so it has distance to travel
  // Clockwise means decreasing angle, so start at target + extra rotations
  innerAnimStart.current = innerTarget + Math.PI * 2 * 3; // 3 full rotations to travel
  innerAnimEnd.current = innerTarget;
  
  // Outer gear: starts several rotations before target, spinning COUNTER-CLOCKWISE
  // Counter-clockwise means increasing angle, so start at target - extra rotations
  outerAnimStart.current = outerTarget - Math.PI * 2 * 3; // 3 full rotations to travel
  outerAnimEnd.current = outerTarget;
  
  // Reset visibility
  visibleSeals.current.fill(false);
  visibleTones.current.fill(false);
  decelStartCaptured.current = false;
}
```

**In the animation frame**, the angle at any point is simply an interpolation from start to end using an easing curve:

```typescript
function getAnimatedAngles(elapsed: number) {
  const totalDuration = 3000; // total animation duration in ms
  const fadeInEnd = 800; // elements finish appearing by this time
  
  if (elapsed >= totalDuration) {
    return {
      inner: innerAnimEnd.current,
      outer: outerAnimEnd.current,
      innerAlpha: 1,
      outerAlpha: 1,
      done: true
    };
  }
  
  // Overall progress 0 to 1
  const t = Math.min(1, elapsed / totalDuration);
  
  // Use ease-out quintic for the ENTIRE motion — fast start, very slow finish
  // This means the gears spin fast at the beginning and gracefully slow to a stop
  const eased = 1 - Math.pow(1 - t, 5);
  
  // Interpolate angles from start to end
  const inner = innerAnimStart.current + (innerAnimEnd.current - innerAnimStart.current) * eased;
  const outer = outerAnimStart.current + (outerAnimEnd.current - outerAnimStart.current) * eased;
  
  // Fade-in: inner gear appears 300-800ms, outer gear appears 500-1000ms
  const innerAlpha = Math.min(1, Math.max(0, (elapsed - 300) / 500));
  const outerAlpha = Math.min(1, Math.max(0, (elapsed - 500) / 500));
  
  // Element visibility: reveal seals/tones progressively during first 60% of animation
  if (elapsed < totalDuration * 0.6) {
    const revealProgress = elapsed / (totalDuration * 0.6);
    const tonesToShow = Math.floor(revealProgress * 13);
    const sealsToShow = Math.floor(revealProgress * 20);
    for (let i = 0; i < tonesToShow; i++) visibleTones.current[i] = true;
    for (let i = 0; i < sealsToShow; i++) visibleSeals.current[i] = true;
  } else {
    visibleTones.current.fill(true);
    visibleSeals.current.fill(true);
  }
  
  return { inner, outer, innerAlpha, outerAlpha, done: false };
}
```

**In the main animate function:**

```typescript
function animate(timestamp: number) {
  if (animPhase === 'running') {
    const elapsed = timestamp - animStartRef.current;
    const anim = getAnimatedAngles(elapsed);
    
    // Use animated angles for drawing
    outerAngle = anim.outer;
    innerAngle = anim.inner;
    
    // Apply fade alphas when drawing each gear
    outerGearAlpha = anim.outerAlpha;
    innerGearAlpha = anim.innerAlpha;
    
    if (anim.done) {
      setAnimPhase('complete');
      outerAngle = outerAnimEnd.current;
      innerAngle = innerAnimEnd.current;
      outerGearAlpha = 1;
      innerGearAlpha = 1;
    }
  }
  
  draw();
  requestAnimationFrame(animate);
}
```

### Why This Works

- The inner gear starts 3 full rotations CLOCKWISE from the target and eases toward it — it only ever moves in one direction (clockwise / decreasing angle)
- The outer gear starts 3 full rotations COUNTER-CLOCKWISE from the target and eases toward it — it only ever moves in one direction (counter-clockwise / increasing angle) 
- The easeOutQuint curve means most of the 3 rotations happen quickly at the start (the exciting spinning part), then the last fraction of a rotation happens very slowly (the graceful landing)
- There is NEVER a direction reversal because the entire path goes from start to end in one smooth motion
- The two gears naturally appear to spin in opposite directions because one is going clockwise and the other counter-clockwise

### Moon and Text Fade-in (CSS, unchanged)

The moon container should fade in from 0ms, the Kin info text should fade in after 2800ms. Keep the existing CSS transitions for these DOM elements.

---

## Additional Refs Needed

```typescript
const innerAnimStart = useRef<number>(0);
const innerAnimEnd = useRef<number>(0);
const outerAnimStart = useRef<number>(0);
const outerAnimEnd = useRef<number>(0);
const outerGearAlpha = useRef<number>(1);
const innerGearAlpha = useRef<number>(1);
```

In the draw function, multiply each gear's drawing globalAlpha by the corresponding gear alpha value:
- When drawing outer gear elements: `ctx.globalAlpha = normalAlpha * outerGearAlpha.current`
- When drawing inner gear elements: `ctx.globalAlpha = normalAlpha * innerGearAlpha.current`

---

## Today Button Behaviour (keep from previous fix)

The Today button should still trigger `startAnimation()` when pressed. Prev/Next do NOT trigger animation.

## Mesh Zone Pulse

After the gears reach their final position (around elapsed 2800-3200ms), pulse the mesh zone highlight once:
```typescript
if (elapsed >= 2800 && elapsed < 3200) {
  const t = (elapsed - 2800) / 400;
  meshPulseAlpha = Math.sin(t * Math.PI) * 0.3 + 0.15; // smooth sine pulse
}
```

---

## DO NOT

- Do NOT change gear drawing logic (tooth shapes, colours, proportions)
- Do NOT change moon centre component
- Do NOT change Learn tab, Daily tab, Energy Intensity
- Do NOT add any new buttons
- Do NOT change the existing day navigation (prev/next) behaviour

## Quality Checks

- [ ] Gears spin in OPPOSITE directions from the start
- [ ] Inner gear moves clockwise throughout the entire animation
- [ ] Outer gear moves counter-clockwise throughout the entire animation
- [ ] Speed is FAST at the beginning, SLOW at the end — NEVER speeds up
- [ ] NO direction reversal at any point during the animation
- [ ] Gears gracefully, smoothly decelerate into today's position
- [ ] The final approach is very gentle (barely moving)
- [ ] Mesh zone pulses once when gears settle
- [ ] Today button replays animation
- [ ] Prev/Next buttons do not trigger animation
- [ ] Animation total duration ~3 seconds
- [ ] 60fps smooth performance
- [ ] `git push origin master:main` succeeds
