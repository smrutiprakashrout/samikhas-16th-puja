# V01 — Invitation video (9:16, automatic walkthrough of the real site)
Owner: OpenCode (task V01) · Needs I01 (integrated site) and Q01 (QA passed). Output: an MP4 for people who will not open a website (WhatsApp, TV, elders).

## 0. Approach (decided)
We do NOT rebuild anything. A script opens the finished site in headless Chromium, drives it like a guest (tap the gate, scroll, tap the diya, scratch the foil) on a **virtual clock**, takes one screenshot per frame, and pipes the frames to ffmpeg. Result = pixel-identical to the website. Remotion is not needed (it would force a rewrite of the vanilla-JS scenes); it stays optional later for titles/music only.
Why virtual clock: real-time screen recording drops frames and desyncs CSS animations from scroll. With a virtual clock every frame is rendered at an exact time, so the video is smooth and repeatable (same input → same video).

## 1. Files to create (only in `tools/video/`; do not touch `src/`)
- `tools/video/record.mjs` — the recorder (§3–§6)
- `tools/video/timeline.json` — all timings (§4). Editing this file changes the video; no code change.
- `tools/video/README.md` — 10 lines: install, run, flags.
- `package.json`: add devDependency `playwright` (≥ 1.45, needed for `page.clock`) and scripts `"video": "node tools/video/record.mjs"`, `"video:preview": "node tools/video/record.mjs --preview"`.
Requirements on the machine: Node 18+, `ffmpeg` in PATH (check `ffmpeg -version`; if missing, stop and tell the owner to install it), Chromium via `npx playwright install chromium`.

## 2. Serving
`npm run build`, then serve `dist/` with `npx vite preview --port 4173 --strictPort` as a child process (kill it at the end). If binding a port is denied, fall back to a tiny Node static server on 127.0.0.1:4173. Open `http://127.0.0.1:4173/` (NOT `?skipgate=1`: the gate must play).

## 3. Rendering settings
| Item | Value |
|---|---|
| Browser viewport | **390×844** CSS px, `deviceScaleFactor: 3` (frames are 1170×2532), `isMobile: true`, `hasTouch: true`, `reducedMotion: 'no-preference'`, `colorScheme: 'light'` |
| Output frame | **1080×1920 (9:16)**, 30 fps, H.264 `yuv420p`, `-crf 17 -preset slow -movflags +faststart` |
| Layout in the 9:16 frame | The 390×844 screenshot is scaled to height 1920 (width ≈ 887) and centred; the side bars are a blurred, warm copy of the same frame (so no black bars). Exact ffmpeg filter: `[0:v]split=2[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:5,eq=brightness=0.03:saturation=1.1[bg];[b]scale=-2:1920[fg];[bg][fg]overlay=(W-w)/2:0,format=yuv420p` |
| Frame capture | `page.screenshot({type:'jpeg', quality:95})` piped to ffmpeg via `image2pipe` (`-f image2pipe -framerate 30 -c:v mjpeg -i -`). Never write frames to disk. |
| Extra output | `invitation-whatsapp.mp4`: 720×1280, same layout, two-pass, target size ≤ 15 MB: `video_kbps = floor((15 * 8192 * 0.92 / duration_s) − 96)`, AAC 96k if audio. WhatsApp rejects videos over 16 MB. |

## 4. Virtual clock and deterministic animation (the key part)
1. Before navigation: `await page.clock.install({ time: 0 })`. This fakes `setTimeout`, `setInterval`, `Date`, `performance.now` and `requestAnimationFrame`. Load the page, wait for `document.fonts.ready` and the gate to be visible, then start the frame loop.
2. Frame loop, for frame `i` at virtual time `vt = i * 1000/30` ms:
   a. Apply scripted input for this frame (scroll, finger, pointer events — §5).
   b. `await page.clock.runFor(1000/30)` (fires timers and rAF callbacks, so the scrub listeners, canvas dust and `gate` timelines advance).
   c. Drive every CSS animation, CSS transition and Web Animations API animation by hand, in one `page.evaluate(vt => …, vt)`:
```js
(vt) => {
  const T = window.__t0 || (window.__t0 = new WeakMap());
  for (const a of document.getAnimations({ subtree: true })) {
    if (!T.has(a)) T.set(a, vt);          // first time we see it: its virtual start time
    a.pause();
    a.currentTime = vt - T.get(a);        // includes its delay; infinite animations loop by themselves
  }
}
```
   d. `await page.evaluate(() => new Promise(r => requestAnimationFrame(() => r())))` is NOT used (rAF is faked); instead `await page.clock.runFor(1)` once more so a pending paint is flushed, then screenshot.
   e. Write the screenshot buffer to ffmpeg stdin (respect backpressure: `await once(stdin, 'drain')` when `write` returns false).
3. Known sources of non-determinism to neutralise (`page.addInitScript` before load): replace `Math.random` with a seeded PRNG (mulberry32, seed 20261129) so petals, embers and foil sparkle are identical on every run; set `Intl`/timezone to `Asia/Kolkata`; hide the scrollbar. Do not stub anything else.
4. If a scene visibly depends on real elapsed time and looks frozen in the output, fix it in `record.mjs` (never in `src/`) and mention it in the report.

## 5. The "guest" (scripted input) — all timings come from `timeline.json`
- **Finger indicator**: inject into the page at start a `div#__finger` (position fixed, z-index 99999, pointer-events none, 46×46px, border-radius 50%, background `rgba(255,255,255,.55)`, border `2px solid rgba(35,43,37,.35)`, `box-shadow 0 2px 10px rgba(0,0,0,.18)`, centred on its `left/top`, opacity 0). Show it (opacity 1, scale .8→1) 0.35 s before a tap, press = scale .85, release adds a 0.5 s expanding ring (WAAPI so the driver in §4 controls it), hide 0.4 s after. It is only for taps and the scratch; it is never shown while scrolling.
- **Scroll**: `window.scrollTo(0, y)` every frame. `y` comes from the keyframes (below), interpolated with `easeInOutSine` between consecutive keyframes. Two consecutive keyframes with the same scene and p are a hold.
- **Keyframe format**: `{ "t": seconds, "scene": "01-ganesha", "p": 0.40 }`. Convert to `y` at start (after layout): `el = document.querySelector('[data-scene="<scene>"]')`; for sticky scenes `y = el.offsetTop + p * (el.offsetHeight − innerHeight)`; for normal-flow scenes (`05-date`, `07-rsvp`) `p` = fraction of `(el.offsetHeight − innerHeight)` clamped at 0 (so p 0 = section top at the viewport top). Recompute on every run (never hard-code pixels).
- **Gate tap** at `tap.gate`: `page.mouse.click` at the centre of the gate's tap target (use `[data-gate-tap]` if it exists; otherwise the centre of the screen). Then wait until the `gate:opened` event has fired (listen via `page.evaluate` once; do not scroll before it) and `gate.settle` seconds more.
- **Diya tap** at `tap.diya`: `page.mouse.click` at the centre of `#diya`.
- **Scratch** from `scratch.start` for `scratch.duration` s: `page.mouse.move/down` at the panel's top-left + 12%, then one `mouse.move` per frame along a serpentine path (5 horizontal passes, 5 rows evenly spaced inside the panel rect, brush is 30px so the spacing is ≈ 24px), `mouse.up` at the end. Panel rect = `#panel.getBoundingClientRect()` read at that moment. If the reveal has not happened by `scratch.start + duration + 0.5` s, call `window.__reveal()` (exists from S05) and log a warning.
- Do not unlock the venue map (never tap "Tap to explore").

## 6. `timeline.json` — first draft (seconds). Seeds the whole video; owner tunes it after the preview.
```json
{
  "fps": 30,
  "tap":     { "gate": 1.4, "diya": 83.4 },
  "gate":    { "settle": 1.2 },
  "scratch": { "start": 62.8, "duration": 3.6 },
  "keyframes": [
    { "t": 7.4,  "scene": "01-ganesha",    "p": 0.00 },
    { "t": 10.5, "scene": "01-ganesha",    "p": 0.30 },
    { "t": 16.0, "scene": "01-ganesha",    "p": 0.76 },
    { "t": 17.6, "scene": "01-ganesha",    "p": 0.76 },
    { "t": 19.4, "scene": "01-ganesha",    "p": 1.00 },
    { "t": 21.0, "scene": "02-hero",       "p": 0.00 },
    { "t": 24.5, "scene": "02-hero",       "p": 0.45 },
    { "t": 28.5, "scene": "02-hero",       "p": 0.85 },
    { "t": 30.0, "scene": "02-hero",       "p": 0.85 },
    { "t": 31.5, "scene": "02-hero",       "p": 1.00 },
    { "t": 33.0, "scene": "03-invitation", "p": 0.00 },
    { "t": 35.0, "scene": "03-invitation", "p": 0.10 },
    { "t": 41.0, "scene": "03-invitation", "p": 0.62 },
    { "t": 43.5, "scene": "03-invitation", "p": 0.90 },
    { "t": 45.0, "scene": "03-invitation", "p": 1.00 },
    { "t": 46.5, "scene": "04-family",     "p": 0.00 },
    { "t": 49.0, "scene": "04-family",     "p": 0.28 },
    { "t": 50.5, "scene": "04-family",     "p": 0.28 },
    { "t": 53.5, "scene": "04-family",     "p": 0.70 },
    { "t": 55.0, "scene": "04-family",     "p": 1.00 },
    { "t": 58.0, "scene": "05-date",       "p": 0.26 },
    { "t": 62.0, "scene": "05-date",       "p": 0.62 },
    { "t": 70.0, "scene": "05-date",       "p": 0.62 },
    { "t": 71.5, "scene": "06-venue",      "p": 0.00 },
    { "t": 74.5, "scene": "06-venue",      "p": 0.50 },
    { "t": 77.5, "scene": "06-venue",      "p": 0.80 },
    { "t": 79.5, "scene": "06-venue",      "p": 0.80 },
    { "t": 81.0, "scene": "06-venue",      "p": 1.00 },
    { "t": 82.5, "scene": "07-rsvp",       "p": 0.00 },
    { "t": 88.0, "scene": "07-rsvp",       "p": 0.00 },
    { "t": 89.5, "scene": "08-closing",    "p": 0.00 },
    { "t": 92.5, "scene": "08-closing",    "p": 0.50 },
    { "t": 98.5, "scene": "08-closing",    "p": 0.50 }
  ],
  "endFadeSeconds": 1.0
}
```
Notes: the gate opening lasts about 4.9 s after the tap (spec 00), so the first scroll keyframe (7.4 s) is after it. Between two different scenes the interpolation scrolls through the handoff, which is the desired connecting animation. Total ≈ 99.5 s (98.5 + fade). Flag `--speed 1.15` divides every time by 1.15 (the tap/scratch times too) to shorten it. The date → venue and family → date joins follow the finished connected-animation specs; retune those keyframes after those specs are built.
Rule for editing keyframes: a scrub window of width Δp must take at least 1.5 s on screen (`Δp × segment_seconds / Δp_segment ≥ 1.5`), and after the last text of a chapter appears the video holds still ≥ 1.2 s so it can be read.

## 7. CLI
`node tools/video/record.mjs [--preview] [--from s] [--to s] [--speed n] [--audio path] [--out dir]`
- `--preview`: 540×960 output (viewport 390×844, `deviceScaleFactor: 1`, jpeg quality 80), 15 fps; for checking timing in ~3 minutes.
- `--from/--to`: render only that time range (the loop still runs the clock from 0 without screenshots until `--from`, so the state is correct).
- `--audio`: mux a music file: `-af "afade=t=in:st=0:d=2,afade=t=out:st=<dur-3>:d=3,loudnorm=I=-18"`, AAC 192k; no audio by default. If the file does not exist, say so and render silent.
- Default `--out out/video/`. Files: `invitation-9x16.mp4` (master), `invitation-whatsapp.mp4`, `poster.png` (frame at the "date revealed" moment, i.e. `scratch.start + scratch.duration + 2`).
- Progress: print `frame i/N` every 60 frames and a final report: duration, file sizes, any warnings.

## 8. Acceptance checklist
- [ ] `npm run video:preview` produces a playable 540×960 file; open it and confirm: gate opens after the finger tap, every chapter appears in order, the diya lights, the foil is scratched and revealed, the closing toran drops, nothing is cut off.
- [ ] Master is exactly 1080×1920, 30 fps, `yuv420p`, plays in QuickTime/VLC and a phone gallery; blurred side bars present, no black bars.
- [ ] Running the command twice gives visually identical videos (compare frame 900 and frame 2400 PNG hashes).
- [ ] No frame shows a half-rendered state, a white flash that is not part of the gate flood, the finger indicator while scrolling, or a scrollbar.
- [ ] `invitation-whatsapp.mp4` is ≤ 15 MB.
- [ ] `git status` shows changes only in `tools/video/`, `package.json` and lockfile.
- [ ] Report: total duration, file sizes, warnings, and the 6 timestamps (gate open, Ganesha end, hero end, family end, date revealed, closing in) so the owner can tune `timeline.json`.
