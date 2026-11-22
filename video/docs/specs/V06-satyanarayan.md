# V06 — NEW scene: Satyanarayan Puja (scene slot 5, 200 frames, global start 780)
Needs V05. Files: `src/scenes/SceneSatya.tsx`, `src/components/Kalash.tsx`, `src/components/ClockIcon.tsx`. This scene does NOT exist on the website, so there is no site spec: **this document is the whole design. Reference picture of the finished frame: `docs/ref/satya-end.png` (1080×1920).** Match it. `docs/ref/satya-end-with-safe-zones.png` shows the same frame with the unsafe zones in red.
Do not add anything that is not listed here. No Odia line, no extra ornaments, no garland.

## 1. Texts (never retype)
- Date line: `content.event.dateLong` ("Sunday, 29 November 2026"), shown uppercase by CSS.
- `videoContent.satya`: `titleA` "Satyanarayan", `titleB` "Puja", `time` "6:00", `meridiem` "PM", `timeNote` "onwards", `arriveLead` "Kindly arrive before", `arriveTime` "5:30 PM", `clock.hour` 5, `clock.minute` 30.

## 2. Ground and light
- Background: vertical gradient from `--ivory` (top, identical to the previous scene so the crossfade is invisible) to `--sand-lt` (bottom). `Grain` on top at the usual opacity.
- Glow: a full-bleed radial gradient circle, centre (540, 546) px, radius 560 px: `--marigold` at alpha .42 (centre) → .14 (55%) → 0 (100%). Opacity animates 0 → 1 over frames 6–60, then breathes ±8% (`sine`, period 150).
- `Dust` (gold, 20) and `Petals` (marigold, 6, from frame 70) as in the other scenes. Nothing else.

## 3. Elements and exact positions (video px, canvas 1080×1920; x centre = 540)
| Element | Style | Position |
|---|---|---|
| Date line | `Label`: DM Sans 500, 25 px, uppercase, letter-spacing .24em, ink at .74 | centre y = 246 |
| Kalash | `Kalash` component, height 432 px (width 332 px = 432 × 200/260) | top y = 319, centred on x = 540 |
| Title | Cormorant 500, 86 px, ink; `titleB` in Cormorant italic 500, saffron-deep; one line, `white-space: nowrap`, a normal space between words | vertical centre y = 892 |
| Divider | `Diamond`: two 2 px `--wood` lines (alpha .8), each from 26 to 190 px away from centre, diamond = 18 px square rotated 45°, `--saffron-deep` | y = 983 |
| Numeral | `time` ("6:00") Cormorant 500, **218 px**, `--saffron-deep`; `meridiem` ("PM") Cormorant italic 500, 66 px (= .3em), same colour, raised so its centre is 48 px above the numeral's centre line, 10 px gap after the numeral; the pair is centred as a group | numeral centre y = 1110 |
| Time note | `Label` style with `timeNote` uppercase ("ONWARDS") | centre y = 1233 |
| Hairline | 2 px, ink at .2, from x = 151 to x = 929 | y = 1301 |
| Clock | `ClockIcon`, 105 px square | centre y = 1406; the row (clock + 34 px gap + text block) is centred as a group on x = 540 |
| Arrive lead | `arriveLead`: Cormorant italic 400, 45 px, ink | centre y = 1406 − 24, left-aligned to the text block |
| Arrive time | `arriveTime`: Cormorant 600, 66 px, ink | centre y = 1406 + 28, same left edge |
All of it sits between y = 200 and y = 1580 (safe). Never move elements into the top 200 / bottom 340 px.

## 4. `Kalash.tsx` (convert `assets-src/kalash.svg`; it is already in `public/svg/kalash.svg`)
Inline the SVG as JSX (viewBox `0 0 200 260`; rename attributes to camelCase: `stroke-width`→`strokeWidth`, `clip-path`→`clipPath`, `stop-color`→`stopColor`, etc.). **Keep every id and every path exactly as in the file; do not redraw or recolour anything.** Prefix gradient/clipPath ids with `k-` is already done; make sure they stay unique. Props: `{ frame: number }` (the scene's local frame). Animate with these local-frame windows (all `E.out` unless stated):
1. `k-base` (plate + foot): frames 4–20: opacity 0→1, scaleX .5→1 about x = 100 (use `transform="translate(100 0) scale(s 1) translate(-100 0)"`).
2. `k-body` + `k-bands`: frames 10–34: revealed bottom→top by an SVG `<clipPath>` containing one `<rect x="0" width="200">` whose top edge goes from y = 240 to y = 90 (height grows to cover the pot).
3. `k-thread`: frames 30–42: draw on with `pathLength="1"`, `strokeDasharray="1"`, `strokeDashoffset = 1 − p` on each of its three paths.
4. `k-lip`: frames 28–38: translateY −12 → 0 (SVG units), opacity 0→1.
5. `k-coconut`: frames 34–48: translateY −30 → 0, opacity 0→1, scale .92→1 about (100, 76).
6. Leaves: the `transform` attribute of each leaf group is `translate(100 94) rotate(A)`. Animate A from **0** (upright, closed) to the final angle with `E.out` over 24 frames, opacity 0→1 over the first 8 frames of each leaf. Final angles: `k-leaf-1` −80, `k-leaf-2` 80, `k-leaf-3` −52, `k-leaf-4` 52, `k-leaf-5` −24, `k-leaf-6` 24. Start frames in this order: leaf-5 and leaf-6 at 38, leaf-3 and leaf-4 at 44, leaf-1 and leaf-2 at 50.
7. After frame 80: each leaf sways `± 1.2°` (`sine(frame, 120, phase = index/6)`), the whole kalash floats `± 3` SVG units vertically (period 150).
8. `k-shine` (the white highlight stroke): opacity breathes between .35 and .7 (period 100).

## 5. `ClockIcon.tsx` (draw in SVG, size prop, default 105)
Viewbox = size × size, centre c = size/2, R = size/2.
- Face: circle r = R − 3, fill `--ivory` at .7, stroke `--wood` 2.5.
- 12 tick marks: from radius R − 9 inward; hour ticks (every 3rd) length 9, width 3; others length 4, width 1.6; colour `--wood-dk`, round caps.
- Hour hand: length R × .46, width 4.5, `--ink`. Minute hand: length R × .66, width 3, `--ink`. Both round caps. Centre dot: r 5.5, `--saffron-deep`.
- Props `{ frame, from, dur }`: the hands sweep from 5:00 to `videoContent.satya.clock` (5:30): minute hand angle 0° → 180° (`E.light`), hour hand angle = hour × 30 + minute × .5 → from 150° to 165°, both over `dur` frames starting at `from`. Angles are clockwise from 12 o'clock.
- After the sweep ends, one soft pulse ring: a circle r from R to R × 1.6, stroke `--saffron-deep` 2 px, opacity .5 → 0 over 24 frames (once).

## 6. Timeline (local frames)
- 0–20: date line `fadeUp`.
- 4–70: kalash assembles (section 4 windows).
- 6–60: glow fades in.
- 44–72: title: `titleA` then `titleB`, `Words` with stagger 8.
- 60–74: divider `Diamond` draws (centre-out).
- 72–100: numeral: each character of `time` rises (`fadeUp`, dist 30) with stagger 4 frames; `meridiem` `fadeUp` at 90; `timeNote` `fadeUp` at 96.
- 98–114: hairline draws left → right (scaleX 0→1, origin left).
- 104–: clock fades in (opacity, 12 frames); hands sweep `from = 108`, `dur = 30`; pulse after.
- 112 and 120: `arriveLead` then `arriveTime` `fadeUp`.
- 140–200: hold (everything visible, the kalash floats, leaves sway, glow breathes, dust drifts).

## 7. Check
1. `npm run typecheck`.
2. Global-frame stills (global = 780 + local): local 10, 40, 62, 90, 124, 150 → global 790, 820, 842, 870, 904, 930 → `qa/V06-f<global>.png`.
3. `npm run compare -- qa/V06-f930.png docs/ref/satya-end.png --full` and look at `qa/compare-V06-f930.png`: the left and right halves must have the same layout (kalash size and position, title, "6:00 PM", clock row). Small anti-aliasing differences are fine, different positions or sizes are not.
4. Check: the clock hands at frame 150 point at 5:30 (hour hand just before the 6, minute hand straight down). The kalash's leaves are open, not upright. The date line reads Sunday, 29 November 2026. No text overlaps. Reply ≤ 5 lines.
