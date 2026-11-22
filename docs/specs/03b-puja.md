# 03b — Satyanarayan Puja: "The kalash and the hour"
Owner: OpenCode (task S03b) · Needs S03 · Goes **between 03-invitation and 04-family**. Scrubbed sticky scene, **240svh** tall (travel 1.4 × viewport). Ivory ground.
Visual reference (approved by the owner, no prototype): `docs/prototype/reference-puja.jpg` (a 1080×1920 mock). Positions below were measured from it and converted to our `u` grid (`u = stageHeight / 844`; reference y × 0.4396 = u). If reference and spec differ, **this spec wins**. Asset: `assets/img/kalash.svg` (inline it with Vite `?raw`, do not use `<img>`: the leaves are animated).

## 0. Experience
A soft golden disc opens like a sunrise. The kalash (brass pot, mango leaves, coconut) rises into it and its leaves fan out. "Satyanarayan Puja" rises in letter-masked lines, a diamond divider draws from the centre, the time "6:00 PM" settles in large saffron, a thin rule draws, and a small clock sweeps to 5:30 beside "Kindly arrive before 5:30 PM". Marigold petals and gold dust drift slowly throughout. Scrolling back reverses the scrub; the drifting is time-based.

## 1. Content — add to `src/content.js`
```js
puja: {
  dateLine: 'Sunday, 29 November 2026',
  title: { pre: 'Satyanarayan', accent: 'Puja' },
  time: '6:00',
  meridiem: 'PM',
  timeNote: 'onwards',
  arrive: { label: 'Kindly arrive before', time: '5:30 PM', hour: 5, minute: 30 },
},
```
All text comes from here. The clock hands are computed from `arrive.hour` and `arrive.minute`.

## 2. Markup
```html
<section data-scene="03b-puja" class="puja" id="puja">
  <div class="stage" id="ps">
    <div class="disc" id="disc"></div>
    <div class="motes" id="motes" aria-hidden="true"></div>   <!-- 8 dots -->
    <div class="petals" id="ppetals" aria-hidden="true"></div> <!-- 9 petals -->
    <p class="pd label" id="pd">{dateLine}</p>
    <div class="kal" id="kal"><!-- inline kalash.svg --></div>
    <h2 class="pt" id="pt"><span class="l1"><b>{title.pre}</b></span> <span class="l2"><b><em>{title.accent}</em></b></span></h2>
    <div class="dv" id="dv"><i class="a"></i><s></s><i class="b"></i></div>
    <div class="tm" id="tm"><span class="n">{time}</span><span class="m">{meridiem}</span></div>
    <p class="tn label" id="tn">{timeNote}</p>
    <div class="rl" id="rl"></div>
    <div class="ar" id="ar">
      <svg class="ck" id="ck" viewBox="0 0 38 38" aria-hidden="true"> … clock (§4) … </svg>
      <p class="at"><span>{arrive.label}</span><strong>{arrive.time}</strong></p>
    </div>
    <div class="grain"></div>
  </div>
</section>
```
`<h2>` is the chapter heading. Add the scene to the section order in the main entry between `03-invitation` and `04-family`.

## 3. Layout (stage = 100svh; horizontal positions are centre-relative; gutters `max(24px, safe-area)`)
Ground: `.stage{background:linear-gradient(180deg,var(--ivory) 0,#F4E4CC 55%,var(--ivory) 100%)}` (starts and ends ivory so it joins invitation and family without a seam). Grain at .06 multiply, z 30.
| Element | Value |
|---|---|
| Disc `.disc` | `position:absolute; left:50%; top:calc(var(--u)*229px); width:116%; aspect-ratio:1; translate:-50% -50%; border-radius:50%; background:radial-gradient(closest-side, rgba(245,183,78,.38) 0, rgba(245,183,78,.24) 68%, rgba(245,183,78,.13) 96%, rgba(245,183,78,0) 100%); clip-path:circle(0% at 50% 50%)`; slow breathing `opacity .9↔1` 6s ease-in-out infinite (after `.in`) |
| Date line `.pd` | `top:calc(var(--u)*102px)`, centred, `label` style, `rgba(35,43,37,.85)` |
| Kalash `.kal` | `position:absolute; left:50%; top:calc(var(--u)*143px); width:min(97px, 25vw)... ` use **`width:calc(var(--u)*128px)`** (aspect 270/416 so height ≈ 197u); `translate:-50% 0`; z 6 |
| Title `.pt` | `top:calc(var(--u)*374px)`, centred, Cormorant 500 `clamp(28px,8vw,33px)/1.15`, `--ink`; `.l2 em` italic `--saffron-deep`; one line (white-space nowrap); each `span` is `display:inline-block; overflow:hidden; vertical-align:top` with the `b` inside `display:block` starting `translateY(110%)` |
| Divider `.dv` | `top:calc(var(--u)*436px)`, centred flex, gap 9px, align centre: `.a`/`.b` are 60×1px `--wood` (scaleX 0→1, origins towards the diamond), `s` is a 9×9px `--saffron-deep` square rotated 45° (scale 0→1) |
| Time `.tm` | `top:calc(var(--u)*452px)`, centred inline-flex, `align-items:flex-start`, gap 6px. `.n`: Cormorant 500 `clamp(68px,20.5vw,84px)/.82`, `--saffron-deep`, **old-style figures (font default, do NOT set lining-nums)**, letter-spacing −.02em. `.m` (PM): Cormorant italic 500 `clamp(19px,5.6vw,23px)`, `--saffron-deep`, `margin-top:.22em` |
| Note `.tn` | `top:calc(var(--u)*535px)`, centred, `label` style, `rgba(35,43,37,.8)` ("onwards") |
| Rule `.rl` | `top:calc(var(--u)*573px)`, `left:13%; right:13%` (width 74%), 1px `rgba(168,121,63,.45)`, scaleX 0→1 from centre |
| Arrive row `.ar` | `top:calc(var(--u)*596px)`, centred flex row, gap 22px, align centre |
| Clock `.ck` | 38×38px |
| Arrive text `.at` | block; `span`: Cormorant italic 400 `clamp(16px,4.6vw,18px)/1.2`, `rgba(35,43,37,.85)`; `strong`: Cormorant 500 `clamp(23px,6.6vw,26px)/1.1`, `--ink`, margin-top 2px, old-style figures; left aligned |
Everything below 650u is empty (petals and dust only).

## 4. Clock (inside `.ck`, viewBox 0 0 38 38)
Circle r 17.5 at 19,19: fill `--ivory`, stroke `--wood` 1.4. Ticks: at 12, 3, 6, 9 — 4.5px long, 1.2px stroke `--wood-dk`; eight shorter 2px ticks at the other hours, 0.8px, opacity .6. Hands (both `--ink`, round caps, pivot at 19,19, `transform-origin:19px 19px; transform-box:view-box`): **hour** hand 9.5px long, 2px; **minute** hand 13px long, 1.4px; centre dot r 1.6 `--saffron-deep`. Final angles: hour = `(hour % 12) × 30 + minute × 0.5` deg (165° for 5:30); minute = `minute × 6` deg (180°). Both start at 0° (pointing up).

## 5. Scrub timeline (progress p = clamp((scrollTop − puja.offsetTop)/(puja.offsetHeight − stageHeight), 0, 1); `core/scroll.js` scrub; `seg` = in-out quad)
| Item | Window | Effect |
|---|---|---|
| Disc | .02–.30 | `clip-path: circle(0% → 72% at 50% 50%)` (72% of the disc covers it fully) |
| Date line | .08–.18 | opacity 0→1, `translateY(8px→0)` |
| Kalash | .12–.34 | opacity 0→1, `translateY(calc(var(--u)*40px) → 0)` |
| Leaves `#lf1…#lf6` | .22–.42, staggered .02 each in order 5,6,3,4,1,2 | each `rotate` from toward-vertical to rest: leaves 5,3,1 start at `+Δ` and 6,4,2 at `−Δ` where Δ = 38° for 5/6, 52° for 3/4, 62° for 1/2, easing to 0°; their `transform-origin` is already set in the SVG (`transform-box:view-box`) |
| Coconut `#coconut` | .20–.32 | `scale(.6→1)`, origin `135px 125px` (view-box) |
| Title line 1 / line 2 | .30–.42 / .34–.46 | `b` `translateY(110%→0)` |
| Divider | .40–.50 | diamond scale 0→1 at .40–.46; lines scaleX 0→1 at .44–.50 |
| Time numerals `.n` | .46–.58 | opacity 0→1, `translateY(calc(var(--u)*24px)→0)` |
| PM `.m` | .54–.62 | opacity 0→1 |
| Note `.tn` | .58–.66 | opacity 0→1 |
| Rule | .62–.72 | scaleX 0→1 |
| Clock | .70–.78 | opacity 0→1, `scale(.8→1)` |
| Hands | .72–.86 | hour hand 0→165°, minute hand 0→180° (both eased) |
| Arrive text | .74–.82 (label) / .78–.88 (time) | opacity 0→1, `translateY(8px→0)` |
Hold .88–1.0 (the guest reads it). No exit animation.

## 6. Ambient (time-based, starts when the section is 35% in view, once; IntersectionObserver)
- **Petals**: 9 `.pp` elements, shape `border-radius:80% 0 80% 0`, size 12–18px (aspect 1:1.25), colours `#F5B74E #E48C35 #FFD58A`, opacity .9, `left` 5–95% (seeded Park–Miller, seed 11), fall 22–34s linear infinite with the same `fall` keyframes as S08 (reuse the shared keyframes; do not duplicate), negative delays so the field is populated at once, z 3 (behind text).
- **Dust**: 8 dots, 3–5px circles `rgba(168,121,63,.5)`, drifting upward 6–10px and back (`translateY`, 7–11s ease-in-out infinite, alternate), scattered over the disc and below.
- Animation-play-state paused until `.in`.

## 7. Reduced motion
Show the final state (disc open, kalash and text visible, hands at 5:30), no petals/dust/breathing.

## 8. Accessibility
All text is real DOM text (the `<h2>` carries the title); the kalash svg has `role="img"` and an `aria-label` (already in the file); the clock is `aria-hidden` (the time is in the text); contrast ink on ivory ≥ 12:1, saffron-deep numerals are large text.

## 9. Acceptance checklist
- [ ] At 390×844 the end state (p ≥ .88) matches `reference-puja.jpg`: date line 102u, kalash 143u–340u, title 374u, divider 436u, numerals 452u, "onwards" 535u, rule 573u, arrive row 596u; nothing overlaps; no horizontal overflow.
- [ ] The title is on one line at 360, 390 and 430 px widths.
- [ ] Numerals "6:00" use the old-style figures (the "00" is x-height), "PM" sits top-right of them.
- [ ] Disc opens from its centre; leaves fan out in the stated order; clock hands end at 5:30.
- [ ] Joins: 03-invitation → this scene and this scene → 04-family show no hard seam (ivory both sides).
- [ ] Scrolling back reverses cleanly; petals/dust keep drifting; no console errors; build passes.
- [ ] Screenshots into qa/: `S03b-p10.png`, `S03b-p25.png`, `S03b-p40.png`, `S03b-p55.png`, `S03b-p75.png`, `S03b-p95.png` (390×844), `S03b-360.png`, `S03b-430.png` (p=.95).
