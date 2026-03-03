Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use the --yes flag wherever applicable.

---

# DEEP WHISPER — Deep Scan Audit & Fix

## Task
Perform a comprehensive audit of the entire Deep Whisper codebase. Analyse every file, identify all bugs, issues, inconsistencies, and improvement opportunities. Then fix everything you find.

Work in three phases:
1. **SCAN** — Read every file, compile a detailed report
2. **REPORT** — Output a structured findings report before making changes
3. **FIX** — Fix all issues found

---

## Phase 1: SCAN — Check ALL of the following

### Build & Compilation
- Run `npm run build` and capture ALL warnings and errors
- Run `npx tsc --noEmit` for TypeScript type checking
- Run `npm run lint` for ESLint issues
- Check for any unused imports, variables, or dead code
- Check for missing dependencies or version conflicts in package.json

### Runtime & Browser Compatibility
- Check all `window`, `document`, `navigator` references have SSR guards (`typeof window !== 'undefined'` or `'use client'` directives)
- Check all Web Audio API usage has proper AudioContext creation with user gesture handling
- Check SpeechSynthesis API has fallback/error handling for browsers that don't support it
- Check MediaRecorder API has feature detection and fallback
- Check Canvas rendering has proper cleanup (cancelAnimationFrame, context disposal)
- Verify all `useEffect` hooks have proper cleanup functions (especially audio, timers, animation frames)
- Check for memory leaks: audio nodes not disconnected, buffers not released, intervals not cleared
- Test localStorage operations have try/catch (private browsing mode throws)

### iOS Safari Specific
- AudioContext MUST be created/resumed inside a user gesture handler — verify this
- SpeechSynthesis on iOS requires user gesture — verify first utterance is triggered by tap
- Check for any `autoplay` assumptions that would fail on mobile
- Verify touch events work alongside mouse events for all interactive elements

### Audio Engine Deep Dive
- Verify binaural beats use proper stereo separation (ChannelMergerNode or StereoPannerNode) — left and right oscillators must go to separate channels
- Check all OscillatorNodes and AudioBufferSourceNodes are properly started/stopped
- Verify noise generators (white/brown/pink) produce correct output — no DC offset, no clipping
- Check all GainNode values are in valid range (0-1 for most, verify subliminal depth range)
- Verify LFO connections for ambient sounds (tremolo, wave rhythm) are correctly wired
- Check fade in/out uses linearRampToValueAtTime or exponentialRampToValueAtTime correctly
- Verify audio cleanup: all nodes disconnected, AudioContext closed on component unmount
- Check for audio glitches: clicking on start/stop (need short fade), overlapping audio contexts
- Verify binaural carrier frequency + beat frequency produces correct output (e.g., 200Hz left, 206Hz right for 6Hz theta)

### Session Management
- Verify localStorage save/load works correctly with the full SubliminalSession schema
- Check serialisation handles all edge cases: recorded audio blob URLs (these DON'T persist across sessions — handle gracefully)
- Verify share URL encoding/decoding: base64 roundtrip, URL length limits, special characters in affirmations
- Check nanoid generation for session IDs and share IDs
- Verify session not found states are handled (/play/[id] with invalid ID)

### UI/UX Issues
- Check all Framer Motion animations have proper `key` props to avoid remount issues
- Verify step navigation in session builder preserves state when going back
- Check all form inputs are controlled components (no uncontrolled→controlled warnings)
- Verify responsive layout: does the grid collapse properly on mobile (especially category grid, soundscape cards)?
- Check for z-index stacking issues between particles, whisper wall, orb, and controls
- Verify all buttons have proper hover/active/focus states
- Check colour contrast meets WCAG AA for all text
- Verify custom range sliders work on touch devices
- Check all clickable elements have adequate tap targets (minimum 44px) on mobile

### Visual Consistency
- Verify all colours reference CSS custom properties (no hardcoded hex values in components)
- Check glass morphism is consistent: backdrop-blur value, background opacity, border colour
- Verify Cormorant Garamond is used for display/hero text, Outfit for body/UI — no font misuse
- Check gradient mesh animation runs smoothly (no janky keyframes)
- Verify particle field doesn't cause layout shifts or overflow issues
- Check the orb Canvas scales correctly on resize (window resize handler)

### Performance
- Check for unnecessary re-renders in player (audio state changes triggering full re-renders)
- Verify Canvas animation uses requestAnimationFrame (not setInterval)
- Check component lazy loading: player page should not load session builder code
- Verify images/assets are optimised (PWA icons)
- Check for layout thrashing in scroll animations

### Security & Best Practices
- Verify no sensitive data in localStorage beyond session configs
- Check base64 session data in URLs can't be exploited (XSS via affirmation text)
- Verify all external links use rel="noopener noreferrer"
- Check Plausible script loads correctly with data-domain="deepwhisper.app"

### PWA
- Verify manifest.json has correct name, short_name, icons, theme_color, background_color, display
- Check service worker registration (if implemented)
- Verify app works offline for saved sessions (or gracefully shows offline state)

### OG Image
- Verify opengraph-image.tsx generates valid image
- Check it handles edge cases: very long session names, special characters, missing data
- Test the ImageResponse dimensions (1200×630)

### Code Quality
- Check for any `any` types that should be properly typed
- Verify consistent code style: semicolons, quotes, indentation
- Check for console.log statements that should be removed
- Verify error boundaries exist for audio failures
- Check all async operations have error handling

---

## Phase 2: REPORT

Before making any changes, output a structured report in this format:

```
## DEEP WHISPER AUDIT REPORT

### Critical (must fix — app broken or will crash)
1. [issue description] — [file:line]
2. ...

### High (significant bugs or UX issues)
1. [issue description] — [file:line]
2. ...

### Medium (improvements that noticeably improve quality)
1. [issue description] — [file:line]
2. ...

### Low (nice-to-haves, polish)
1. [issue description] — [file:line]
2. ...

### Performance
1. [issue description] — [file:line]
2. ...

### Missing Features (specified in original prompt but not implemented)
1. [feature] — [expected location]
2. ...
```

---

## Phase 3: FIX

After outputting the report, fix ALL Critical and High issues. Fix as many Medium issues as practical. Note any Low issues you chose to skip.

For each fix:
- Make the minimum change needed
- Don't refactor working code unnecessarily
- Preserve the existing design system and visual style
- Test that `npm run build` still passes after all fixes

After all fixes, run `npm run build` one final time and confirm zero errors.

---

## Important Notes
- Do NOT change the design system colours, fonts, or visual direction
- Do NOT restructure the file layout unless absolutely necessary
- Do NOT add new dependencies unless required for a critical fix
- DO fix all TypeScript errors and warnings
- DO fix all ESLint errors and warnings
- DO ensure iOS Safari compatibility
- DO ensure the audio engine is rock-solid
- Commit all fixes: `git add -A && git commit -m "Deep scan audit fixes" && git push`
