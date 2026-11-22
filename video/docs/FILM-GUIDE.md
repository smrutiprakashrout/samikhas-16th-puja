# FILM-GUIDE.md — shared numbers and recipes (read in V01 onward)

## Canvas, units, safe areas
- Canvas 1080×1920, 30 fps. Site design is 390×844. **`U = 1920 / 844 = 2.275`**; `u(n) = n * U` converts a site px value to video px.
- Column = `390 * U = 887.25` px, centred: `COL_X = (1080 - 887.25) / 2 = 96.4`. All text and key graphics stay inside the column. Backgrounds, glow, grain, doors, garlands, petals, dust are full-bleed (0..1080).
- Site y → video y: `y * U`. Site x → video x: `COL_X + x * U`.
- Safe area for social apps: nothing essential in the top **200 px** or bottom **340 px**. Essential = names, date, time, address, phones, the shloka, anything the owner asked to be read. Decorative garland may enter the top zone.
- Debug aid: `config.SHOW_SAFE_ZONES = true` draws translucent red bands over those zones and a column outline. Must be `false` for final renders.

## Colours / fonts / easings (src/theme.ts must contain exactly these)
Colours: ink #232B25 · ink-deep #181E1A · moss #5D695D · sage #AAA06D · ivory #FBF3E4 · sand #EBCEAE · sand-lt #F4E4CC · sand-dp #D8B684 · wood #A8793F · wood-dk #6E4C28 · gold #E0AF70 · marigold #F5B74E · saffron #E48C35 · saffron-deep #B25D17 · flood #FFF9EC.
Fonts: display = Cormorant Garamond · sans = DM Sans · odia = Noto Serif Oriya (fallback 'Noto Sans Oriya', serif).
Easings: `out = bezier(.16,1,.3,1)` · `door = bezier(.65,0,.25,1)` · `light = bezier(.5,0,.2,1)` · `flood = bezier(.6,0,.9,.4)`.
Text styles (site px → multiply by U): label = DM Sans 500, 11px, uppercase, letter-spacing .24em, ink at .74 · big sentence = Cormorant 500 clamp 31–38px / 1.18 · numeral/hero = Cormorant 500 · title = Cormorant 500 · italic accents use Cormorant italic 500 in saffron-deep. Details per scene are in each spec.

## Motion recipes (frames at 30 fps)
- **Reveal (default entrance):** opacity 0→1 and translateY `u(20)`→0 over **27 frames**, `ease.out`. For words: same, **1.4 frames stagger per word** (use 3 f stagger when the spec says "slow").
- **Line write (shloka, titles):** clip-path `inset(0 100% 0 0)` → `inset(0)` plus translateY `u(8)`→0, 24 frames, `ease.out`.
- **Image reveal:** clip-path `inset(100% 0 0 0)` → `inset(0)`; the image inside scales 1.28 → 1.08 and drifts −5% Y, `ease.out`.
- **Line draw:** SVG `pathLength="1"`, `strokeDasharray="1"`, `strokeDashoffset = 1 - p`.
- **Idle life** (nothing is ever perfectly still): slow push-in on the whole scene (scale 1 → 1.03 over the scene), floating dust, sway ±1°, glow pulse. All sine-based on the frame number, never random.
- **Scene transition:** see V01. The incoming scene handles it; the outgoing scene just keeps playing underneath.

## Remotion pitfalls (avoid these mistakes)
- `useCurrentFrame()` inside a `<Sequence>` returns the frame **relative to that sequence**. Use it as "local frame". Spec frames are local.
- Positioning: `position:absolute` inside `<AbsoluteFill>`. Always set `transformOrigin` explicitly.
- Fonts must be loaded in `src/fonts.ts`, imported once by `Root.tsx`. Text with Odia must use `fontFamily: odia`.
- Randomness: use `random('seed-string')` from `remotion`, or a seeded LCG (`s = (s*16807) % 2147483647`) like `../src/core/garland.js`.
- Images: `<Img src={staticFile('img/ganesha.webp')} />`. Never a raw `<img>`.
- SVG markup copied from the site that contains CSS variables (`var(--gold)`) works only if those variables are defined: the root `<AbsoluteFill>` of every scene gets `style={cssVars}` (from `theme.ts`, all colours as `--ink`, `--sand`, …).
- Keep every scene a pure function of the frame number. If you reload a still at frame 100, it must look the same every time.
- Do not render the full video while developing. Use stills (`npm run still -- <CompId> <frame> <out.png>`).

## Reference screenshots (390×844, from the website QA)
gate `../qa/G00b-opening.png`, `../qa/G00-idle.png` · ganesha `../qa/S01-p30.png` · hero `../qa/S02-p62.png` · invitation `../qa/S03-p70.png` · family `../qa/S04-p80.png` · date `../qa/S05-done.png` · venue `../qa/S06-p100.png` · rsvp `../qa/S07-lit.png` · closing `../qa/S08-end.png` · NEW scene `docs/ref/satya-end.png` (this one is 1080×1920).
`npm run compare -- <video-still.png> <reference.png>` crops the still to the 887 px column, scales it to 390×844, and writes a side-by-side to `qa/compare-<name>.png`. For the NEW scene reference (already 1080×1920) the script is called with `--full`.
