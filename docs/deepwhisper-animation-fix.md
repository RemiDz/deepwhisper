# DeepWhisper — Animation Easing Fix + Today Button Replay

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: megathink

## Two Issues

### Issue 1: Animation speeds up at the end — should slow down

The animation currently accelerates in the second half, creating a stressful rushed feeling. It MUST do the opposite — start with energy and excitement (the free-spinning gears) then gradually, smoothly, gracefully decelerate to a gentle stop at today's position. The ending should feel calm and satisfying, like a clock pendulum coming to rest.

**Fix the easing/deceleration phase:**

The problem is likely in the deceleration calculation. The transition from free-spinning to locked position needs to use a **strong ease-out curve** — fast at the very start of deceleration, then progressively slower and slower until it barely creeps into the final position.

Replace whatever easing function is used during the deceleration phase with:

```typescript
// Ease-out quintic — very strong deceleration, almost stops before reaching the end
function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}
```

This curve means:
- At t=0.0 (start of deceleration): moving quickly
- At t=0.5 (halfway): already at 97% of the way there, moving slowly
- At t=0.8: at 99.97%, barely moving
- At t=1.0: perfectly stopped

Also, the deceleration phase should be LONGER — extend it from whatever it currently is to **1200ms** (from roughly 1800ms to 3000ms of the total animation). The free-spinning phase can be slightly shorter to compensate.

**Additionally**, during the free-spin phase, the spin speed itself should NOT increase over time. It should be constant or even slightly decreasing. Check that the spin increment per frame is constant (e.g. `+= 0.03` per frame for inner, `-= 0.025` per frame for outer) and does NOT multiply or accumulate.

**Revised timing:**
- Phase 1 (Moon fade): 0 - 600ms
- Phase 2 (Inner gear materialise + spin): 400 - 1400ms
- Phase 3 (Outer gear materialise + spin): 700 - 1700ms
- Phase 4 (Deceleration — LONG and SMOOTH): 1700 - 2900ms (1200ms duration)
- Phase 5 (Engage pulse + text fade): 2900 - 3300ms

During Phase 4, use this blending approach:

```typescript
if (elapsed >= 1700 && elapsed < 2900) {
  const t = (elapsed - 1700) / 1200; // 0 to 1 over 1200ms
  const eased = easeOutQuint(t); // very strong ease-out
  
  // Blend from current free-spin angle to target angle
  innerAngle = currentInnerSpin + (innerTarget - currentInnerSpin) * eased;
  outerAngle = currentOuterSpin + (outerTarget - currentOuterSpin) * eased;
}
```

The key: `currentInnerSpin` and `currentOuterSpin` should be captured ONCE at the start of Phase 4 (when elapsed first crosses 1700ms), then held constant. Do NOT keep updating the spin angles during deceleration — that causes the acceleration effect.

```typescript
// Capture spin positions at the start of deceleration
if (!decelStartCaptured.current && elapsed >= 1700) {
  decelStartCaptured.current = true;
  capturedInnerAngle.current = animSpinInner.current;
  capturedOuterAngle.current = animSpinOuter.current;
}
```

Then during deceleration, blend from captured positions to targets:
```typescript
innerAngle = capturedInnerAngle.current + (innerTarget - capturedInnerAngle.current) * eased;
outerAngle = capturedOuterAngle.current + (outerTarget - capturedOuterAngle.current) * eased;
```

### Issue 2: Remove separate replay button — use Today button instead

Remove the dedicated replay/refresh button that was added next to the navigation buttons. Instead, wire the animation replay into the **existing Today button**.

When the user taps the Today button:
1. Reset dayOffset to 0 (return to today) — this already happens
2. ALSO trigger `startAnimation()` to replay the full cinematic sequence

This means the Today button serves dual purpose: it navigates back to today AND replays the dramatic wheel animation. This is intuitive because tapping "Today" is a "reset to now" action, and the animation reinforces that visually.

```typescript
function handleTodayPress() {
  setDayOffset(0);
  startAnimation(); // replay the full sequence
}
```

**Remove:**
- The separate circular replay button element
- Its onClick handler
- Its styling
- Any related state or refs specific to the replay button

**The prev/next arrow buttons should NOT trigger animation** — they should continue to work as they do now (just rotating the gears to the new position with the existing smooth easing).

---

## DO NOT

- Do NOT modify the gear drawing logic (tooth shapes, colours, proportions, seal icons, tone symbols)
- Do NOT modify the moon centre
- Do NOT modify the Learn tab, Daily tab, or Energy Intensity component
- Do NOT change the overall animation sequence (moon → inner gear → outer gear → lock) — just fix the SPEED CURVE
- Do NOT add any new buttons

## Quality Checks

- [ ] Animation starts fast/energetic with free-spinning gears
- [ ] Animation smoothly and gracefully decelerates in the second half
- [ ] The final approach to today's position is very slow and gentle (not rushed)
- [ ] No acceleration or speed-up at any point after the free-spin phase
- [ ] The "lock into place" moment feels calm and satisfying
- [ ] Separate replay button is removed
- [ ] Today button triggers animation replay + returns to today
- [ ] Prev/Next buttons do NOT trigger animation (just normal gear rotation)
- [ ] Animation works on first page load
- [ ] Animation replays correctly when Today is tapped multiple times
- [ ] `git push origin master:main` succeeds
