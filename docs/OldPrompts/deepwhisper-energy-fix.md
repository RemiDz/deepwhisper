# DeepWhisper — Energy Intensity Component Fix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: ultrathink

## Two Issues in the EnergyIntensity component ONLY

### Issue 1: Tubes are too bulky — make them slimmer and more elegant

The glass tubes look heavy and bulky compared to the elegant wheel above. They need to be thinner and shorter to feel more refined.

**Changes:**
- Tube outer width: reduce from 18px to **12px**
- Tube height: reduce from 90px to **70px**
- Tube border-radius: reduce from 9px to **6px** (pill shape maintained)
- Inner fill: left/right inset reduce from 1.5px to **1px**
- Inner fill border-radius: reduce from 7.5px to **5px**
- Glass shine strip: reduce from 2.5px to **1.5px** wide
- Value number font size: reduce from 11px to **10px**
- Gap between tubes: reduce from current spacing to **6px**

This will make the tubes feel like delicate scientific instruments rather than chunky bars.

### Issue 2: Tubes are not consistently aligned — some get pushed up by wrapped labels

When dimension names wrap to two lines (like "Communication" or "Transformation"), the tube above gets pushed up, breaking the horizontal alignment of the tube row.

**Fix:** The tube columns must be laid out so that:
1. All tube bottoms sit on the same horizontal line
2. All value numbers sit on the same horizontal line above the tubes
3. Labels below are allowed to wrap but do NOT affect tube position

The correct approach is to use a flex layout where:
- Each column is `display: flex; flex-direction: column; align-items: center`
- The VALUE number has a fixed height (e.g. `min-height: 16px`)
- The TUBE has a fixed height (70px) — NOT flexible
- The LABEL below has a fixed height (e.g. `min-height: 28px; overflow: hidden`) with `align-items: flex-start` so text starts from the top

Or alternatively, use CSS grid for the tubes section with three explicit rows:
```
Row 1: values (fixed height)
Row 2: tubes (fixed height)
Row 3: labels (fixed height, text wraps within)
```

This ensures the tubes row is always perfectly aligned regardless of how labels wrap.

**CSS grid approach (recommended):**
```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  gridTemplateRows: 'auto 70px auto',
  gap: '4px 6px',
  alignItems: 'end', // for the value row
  justifyItems: 'center',
  width: '100%'
}}>
  {/* Row 1: all 8 value numbers */}
  {values.map((v, i) => (
    <div key={`v${i}`} style={{ fontSize: 10, fontWeight: 500, color: getTextColor(v) }}>
      {v}
    </div>
  ))}
  {/* Row 2: all 8 tubes */}
  {values.map((v, i) => (
    <div key={`t${i}`} style={{
      width: 12, height: 70, borderRadius: 6,
      background: 'rgba(255,255,255,0.04)',
      border: '0.5px solid rgba(255,255,255,0.08)',
      position: 'relative', overflow: 'hidden',
      alignSelf: 'stretch' // ensures all tubes same height
    }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 1, right: 1,
        height: `${v * 10}%`, borderRadius: 5,
        background: getFillColor(v)
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 2, width: 1.5,
        height: '100%', borderRadius: 1,
        background: 'rgba(255,255,255,0.06)'
      }} />
    </div>
  ))}
  {/* Row 3: all 8 labels */}
  {dimensions.map((d, i) => (
    <div key={`l${i}`} style={{
      fontSize: 8, color: 'rgba(255,255,255,0.45)',
      textAlign: 'center', lineHeight: 1.2,
      alignSelf: 'start' // labels start from top of their cell
    }}>
      {d}
    </div>
  ))}
</div>
```

This grid approach guarantees all tubes are perfectly horizontally aligned because they're in the same grid row with a fixed height.

---

## Summary

1. **Slim down all tube dimensions** (width 12px, height 70px, radius 6px, shine 1.5px)
2. **Use CSS grid (3 rows: values, tubes, labels)** to guarantee perfect horizontal alignment regardless of label wrapping

## DO NOT

- Do NOT modify anything outside the EnergyIntensity component
- Do NOT change the dashed overall bar (it's fine)
- Do NOT change the colour coding logic
- Do NOT change the legend
- Do NOT change the data/profiles

## Quality Checks

- [ ] All 8 tubes sit on the same horizontal baseline
- [ ] All 8 value numbers sit on the same horizontal line
- [ ] Tubes are visibly slimmer and more delicate than before
- [ ] Labels wrap where needed without affecting tube positions
- [ ] "Communication" and "Transformation" wrap to 2 lines but tubes above stay aligned
- [ ] Component still looks good on mobile (375px)
- [ ] `git push origin master:main` succeeds
