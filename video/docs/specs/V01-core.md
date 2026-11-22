# V01 — Core kit: theme, helpers, shared components, empty scene slots
Read first: `docs/FILM-GUIDE.md`. Needs V00. Output: the whole film skeleton renders (placeholders), and every later task only adds one scene file.

## 1. Files to create
```
src/config.ts            fps, size, durations, overlap, SHOW_SAFE_ZONES, BGM_START_SEC
src/theme.ts             colours, cssVars, fonts, easings, U, u(), COL_W, COL_X
src/lib/anim.ts          helpers (below)
src/components/…         shared components (below)
src/Invite.tsx           the full composition: 9 scene slots with overlaps
src/scenes/Scene*.tsx    9 placeholder scenes (see 4)
scripts/compare.mjs      side-by-side tool (see 5)
```
Update `Root.tsx`: keep `FontTest`, add `Invite` (1080×1920, 30 fps, `durationInFrames = totalFrames()`).

## 2. `config.ts` (exact)
```ts
export const FPS = 30, WIDTH = 1080, HEIGHT = 1920, OVERLAP = 20;
export const SHOW_SAFE_ZONES = false;
export const BGM_START_SEC = 0;
export const SCENES = [
  { id: 'gate',       length: 210, in: 'none'   },
  { id: 'ganesha',    length: 270, in: 'none'   }, // starts with its own flood overlay
  { id: 'hero',       length: 190, in: 'fade'   },
  { id: 'invitation', length: 190, in: 'rise'   },
  { id: 'satya',      length: 200, in: 'fade'   },
  { id: 'family',     length: 170, in: 'fade'   },
  { id: 'date',       length: 200, in: 'rise'   },
  { id: 'venue',      length: 160, in: 'circle' },
  { id: 'rsvp',       length: 305, in: 'fade'   },
] as const;
export const sceneStart = (i: number) => SCENES.slice(0, i).reduce((s, x) => s + x.length - OVERLAP, 0);
export const totalFrames = () => sceneStart(SCENES.length - 1) + SCENES[SCENES.length - 1].length;
```
`totalFrames()` must equal 1735. Print it.

## 3. `lib/anim.ts` (exact signatures)
```ts
clamp(v,a,b) · lerp(a,b,t)
seg(frame, from, to, ease = E.out): number      // 0..1, clamped, eased
fadeUp(frame, from, dur = 27, dist = 20, ease = E.out): React.CSSProperties  // opacity + translateY(u(dist)→0)
wipe(frame, from, dur = 24, ease = E.out): React.CSSProperties               // clip-path inset(0 100% 0 0)→inset(0) + translateY(u(8)→0)
sine(frame, periodFrames, phase = 0): number    // -1..1
rand(seed: string): number                      // wraps remotion's random()
```
`E` = easings from `theme.ts`. Everything clamps.

## 4. Shared components (each in `src/components/`, props typed)
- `Scene` — wrapper used by every scene: `<AbsoluteFill style={{...cssVars, background}}>`, applies the **transition-in** from `SCENES[i].in` during the first `OVERLAP` frames, and the slow push-in (scale 1→1.03 over `length`, origin centre) on its content layer, not on the background. Props: `{ id, background, children }`. Transitions: `fade` = opacity 0→1 `E.out`; `rise` = `clip-path: inset(100% 0 0 0)`→`inset(0)` `E.light`; `circle` = `clip-path: circle(r at 50% 55%)` r 0→1500 px `E.light`; `none` = no transition.
- `Column` — `position:absolute; left: COL_X; width: COL_W; top:0; bottom:0`; children use site coordinates via `u()`.
- `Grain` — full-bleed `public/img/grain.svg` tile (tile size 200 px) at opacity .09, `mix-blend-mode: multiply`. `Vignette` — radial edge darkening using `--sand-dp` at ≤ .25 opacity.
- `Words` — props `{ text, from, stagger = 1.4, style }`: splits on spaces, each word `fadeUp`. `Label` — the DM Sans label style from FILM-GUIDE.
- `Diamond` — divider line–◆–line, props `{ from, width = 164 (site px), color }`: lines scaleX 0→1 from the centre over 18 f, diamond (rotated 8 px square, saffron-deep) pops scale 0→1.15→1 over 12 f.
- `Dust` — props `{ count = 24, seed }`: deterministic gold particles (radius .5–2 site px), rising slowly, ±8 px sway, alpha .3–.8, wrapping vertically; positions are pure functions of `frame` and `seed`.
- `Petals` — props `{ count = 8, seed, from = 0 }`: marigold petals (use `public/svg/marigold-petal.svg`) falling with drift and slow rotation, alpha .9, deterministic.
- `Garland` — uses `src/generated/garland.js` (`createGarland(7)`), inserts the returned top and side garland SVG markup via `dangerouslySetInnerHTML` into an `<svg>` scaled **uniformly** to 1080 px wide and anchored to the top; `cssVars` are provided by `Scene`, so `var(--gold)` etc. resolve. Props `{ from, dropDist = 120 }`: drops in from above (translateY `-u(dropDist)`→0 over 30 f, `E.out`) then sways ±0.8° (period 150 f). Read `../src/core/garland.js` to see what it exports and adapt the call; if the shape is unclear write the ONE line in NOTES.md and use the top garland only.
- `SafeZones` — only when `SHOW_SAFE_ZONES`: red .12 bands top 200 and bottom 340, a 1 px outline of the column.
`Scene` renders `SafeZones` last.

## 5. `scripts/compare.mjs`
Usage: `node scripts/compare.mjs <still.png> <reference.png> [--full]`. Uses `npx remotion ffmpeg` (Remotion's bundled ffmpeg): crop the still to `crop=887:1920:96:0`, scale to `390:844` (skip the crop with `--full`; instead scale to 390×844 directly, and also scale the reference to 390×844), then `hstack` the two into `qa/compare-<stillname>.png`. Print the output path.

## 6. Placeholder scenes + `Invite.tsx`
Each `scenes/SceneX.tsx` renders `<Scene id=… background=…>` filling the ground colour for its chapter (sand for gate, ganesha, hero, venue; ivory for invitation, satya, family, rsvp; saffron for date) and ONE `Label` in the middle with the scene id and its length. `Invite.tsx`: for each scene a `<Sequence from={sceneStart(i)} durationInFrames={length}>` in order (later scene on top), plus `<SafeZones/>`. No audio yet.

## 7. Check
1. `npm run typecheck`. `npx remotion compositions src/index.ts` lists `Invite` with duration 1735.
2. Stills of `Invite` at frames 100, 300, 500, 700, 880, 1040, 1200, 1360, 1560 → `qa/V01-f<frame>.png`; each shows the right ground colour and label.
3. Still at frame 200 (inside the gate/ganesha overlap) shows no error.
4. With `SHOW_SAFE_ZONES = true` render one still → `qa/V01-safe.png`, then set it back to `false`.
Reply in ≤ 5 lines: total frames, files created, anything you adapted.
