# DeepWhisper — Animation: Fix Target Angles + Shorten Duration

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: megathink

## Two Issues

### Issue 1: Animation lands on wrong date when replaying via Today button

When the user navigates to a future/past day (using prev/next arrows), then taps Today, the animation plays BUT the gears settle at the wrong Kin position — they land on whatever day was previously selected instead of TODAY.

**Root cause:** The `startAnimation()` function uses `sealIndex` and `toneIndex` values that are stale — they still reflect the previous dayOffset, not today (dayOffset = 0).

**Fix:** The Today button handler must:
1. FIRST set dayOffset to 0
2. WAIT for the component to re-render with the new dayOffset (so sealIndex and toneIndex update to today's values)
3. THEN call startAnimation()

The simplest approach — pass today's Kin data directly to startAnimation instead of relying on component state:

```typescript
function startAnimation(targetSealIndex: number, targetToneIndex: number) {
  const innerEnd = -(targetToneIndex / 13) * Math.PI * 2;
  const outerEnd = -(targetSealIndex / 20) * Math.PI * 2;
  
  innerAngleStart.current = innerEnd + Math.PI * 2 * 2;
  innerAngleEnd.current = innerEnd;
  outerAngleStart.current = outerEnd - Math.PI * 2 * 2;
  outerAngleEnd.current = outerEnd;
  
  animStartTime.current = performance.now();
  animRunning.current = true;
  
  // Reset visibility
  sealVisible.current = new Array(20).fill(false);
  toneVisible.current = new Array(13).fill(false);
}
```

And the Today button handler:

```typescript
function handleTodayPress() {
  setDayOffset(0);
  
  // Calculate TODAY's Kin (dayOffset = 0)
  const todayKin = getTzolkinKin(new Date());
  const todaySealIndex = (todayKin - 1) % 20;
  const todayToneIndex = (todayKin - 1) % 13;
  
  startAnimation(todaySealIndex, todayToneIndex);
}
```

Similarly, on first page load:

```typescript
useEffect(() => {
  const todayKin = getTzolkinKin(new Date());
  const todaySealIndex = (todayKin - 1) % 20;
  const todayToneIndex = (todayKin - 1) % 13;
  
  const timer = setTimeout(() => {
    startAnimation(todaySealIndex, todayToneIndex);
  }, 300);
  return () => clearTimeout(timer);
}, []);
```

**The key point:** startAnimation must receive the CORRECT target seal and tone indices as parameters. It must NOT read them from component state/props that might be stale.

### Issue 2: Animation is too long — shorten from 5500ms to 4000ms

Change the `ANIM_DURATION` constant from `5500` to `4000`.

Update all timing thresholds proportionally:
- Inner gear fade-in start: 200ms (was 300ms)
- Inner gear fade-in duration: 600ms
- Outer gear fade-in start: 400ms (was 600ms)  
- Outer gear fade-in duration: 600ms
- Element reveal: first 55% of duration (~2200ms)
- Mesh pulse: last 400ms (3600-4000ms)

Keep everything else the same — same smoothEase function, same 2 extra rotations, same opposite-direction spinning.

---

## DO NOT

- Do NOT change the smoothEase function
- Do NOT change the gear drawing logic
- Do NOT change moon, Learn tab, Energy Intensity
- Do NOT add or remove any buttons
- Do NOT change prev/next button behaviour

## Quality Checks

- [ ] Navigate to a future day, then tap Today — gears land on TODAY's Kin (not the future day)
- [ ] Navigate to a past day, then tap Today — gears land on TODAY's Kin (not the past day)
- [ ] Animation on first page load lands on correct Kin
- [ ] Animation duration is ~4 seconds (not 5.5)
- [ ] Animation still starts gentle, peaks in middle, ends gentle
- [ ] No speed-up at the end
- [ ] `git push origin master:main` succeeds
