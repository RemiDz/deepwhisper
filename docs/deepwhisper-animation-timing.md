# DeepWhisper — Animation Timing: Longer + Gentler Start

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: ultrathink

## The Problem

The animation plays too fast and starts too abruptly, creating a stressful feeling. It should feel meditative, graceful, and calming — like watching a cosmic mechanism gently come to life.

## The Fix

Two changes in GearWheel.tsx animation logic ONLY:

### 1. Extend total duration from 3000ms to 5500ms

Find the total animation duration constant (likely `3000` or `totalDuration = 3000`) and change it to **5500**.

Also update all phase timing milestones proportionally:
- Moon fade-in: 0 - 800ms (was 0-600ms)
- Inner gear appears: 500 - 1200ms (was 300-800ms)
- Outer gear appears: 800 - 1500ms (was 500-1000ms)
- Elements reveal: first 55% of duration (~3000ms)
- Mesh pulse: 5000 - 5500ms (was 2800-3200ms)
- Text/energy fade-in: after 5000ms

### 2. Change easing from easeOutQuint to a custom ease-in-out curve

The current easeOutQuint starts fast. We need an **ease-in-out** curve that:
- Starts GENTLY (slow acceleration — the gears softly begin to turn)
- Reaches medium speed in the middle (the mesmerising spinning phase)
- Decelerates VERY gradually at the end (graceful landing)

Replace the easing function with:

```typescript
// Custom ease: gentle start, medium cruise, very gradual stop
function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}
```

Or even better, a custom cubic bezier approximation that spends MORE time in the middle cruising phase:

```typescript
function cosmicEase(t: number): number {
  // Slow start (0-20%), steady cruise (20-65%), long gentle deceleration (65-100%)
  if (t < 0.2) {
    // Ease in: slow start
    const p = t / 0.2;
    return 0.15 * (p * p); // quadratic ease-in, maps 0-0.2 to 0-0.15
  } else if (t < 0.65) {
    // Linear cruise: steady speed
    const p = (t - 0.2) / 0.45;
    return 0.15 + 0.55 * p; // linear, maps 0.2-0.65 to 0.15-0.7
  } else {
    // Ease out: long gentle stop
    const p = (t - 0.65) / 0.35;
    return 0.7 + 0.3 * (1 - Math.pow(1 - p, 4)); // quartic ease-out, maps 0.65-1.0 to 0.7-1.0
  }
}
```

This gives:
- 0-20% of time: gears gently start turning (slow, dreamy)
- 20-65% of time: steady mesmerising spinning (the beautiful TikTok-worthy part)
- 65-100% of time: very gradual deceleration, barely moving at the end

Replace the easing call:
```typescript
// Old:
const eased = 1 - Math.pow(1 - t, 5);

// New:
const eased = cosmicEase(t);
```

### 3. Reduce the number of pre-calculated rotations

With the longer duration, 3 full rotations might still feel fast. Reduce to **2 full rotations** so the spinning speed is more gentle:

```typescript
// Old:
innerAnimStart.current = innerTarget + Math.PI * 2 * 3;
outerAnimStart.current = outerTarget - Math.PI * 2 * 3;

// New:
innerAnimStart.current = innerTarget + Math.PI * 2 * 2;
outerAnimStart.current = outerTarget - Math.PI * 2 * 2;
```

## Summary of Changes

1. `totalDuration`: 3000 → **5500**
2. Easing function: easeOutQuint → **cosmicEase** (gentle start, cruise, gentle stop)
3. Pre-rotation count: 3 → **2** full rotations
4. Update all phase timing thresholds to match new duration
5. Moon fade delay and text fade-in timing adjusted proportionally

## DO NOT

- Do NOT change gear drawing, colours, proportions
- Do NOT change moon, Learn tab, energy intensity
- Do NOT add or remove any buttons
- Do NOT change any interaction behaviour

## Quality Checks

- [ ] Animation starts gently — gears softly begin to turn
- [ ] Middle phase has steady, mesmerising spinning
- [ ] End phase has very gradual, calm deceleration
- [ ] Total animation takes about 5-6 seconds
- [ ] No abrupt speed changes at any point
- [ ] The overall feeling is meditative, not stressful
- [ ] Today button still triggers replay
- [ ] `git push origin master:main` succeeds
