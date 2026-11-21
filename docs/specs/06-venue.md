# 06 — Venue: "The iris map"
Owner: OpenCode (task S06) · Needs S05 · Scrubbed sticky scene, **220svh** tall (`ven` height = 2.2 × viewport). Sand ground.
Visual reference: `docs/prototype/prototype-v3-venue-rsvp-closing.html` (approved) — open only the `VENUE` CSS block and the `applyV` function. If reference and spec differ, **this spec wins**. The prototype uses a drawn mock map; the real build uses the Google embed (§4).

## 0. Experience
The saffron date band ends; a sand "horizon" ellipse rises over it (the sun has set). "Venue" and the two address lines rise in. A full-bleed map opens like an iris from the pin position; a dotted marigold-brown route draws toward the pin; the pin drops with two ping rings; "Get directions" and "Copy address" fade up. A "Tap to explore" chip lets the guest unlock the live map (otherwise it never traps page scroll).

## 1. Content — add to `src/content.js`
```js
venue: {
  label: 'Venue',
  lines: ['Sapnpur, Sisua,', 'Salepur, Cuttack'],
  copyText: 'Sapnpur, Sisua, Salepur, Cuttack',   // OWNER may append the PIN code later
  lat: 20.488226, lng: 86.086465,
  embedUrl: 'https://www.google.com/maps?ll=20.488226,86.086465&z=16&t=m&output=embed',
  directionsUrl: 'https://maps.app.goo.gl/owquKixAFBJHX1Zt8',
  hint: 'Tap to explore',
  directionsLabel: 'Get directions',
  copyLabel: 'Copy address',
  copiedLabel: 'Copied',
},
```
Also set `date.calendarUrl: 'https://calendar.app.google/Vu5tDqV1WnCpchCP6'` (S05 button now renders).

## 2. Markup
```html
<section data-scene="06-venue" class="ven" id="ven">
  <div class="stage" id="vs">
    <div class="vig"></div>
    <p class="vl label gut" id="vl">{label}</p>
    <p class="va gut" id="va"><span><b>{lines[0]}</b></span><span><b>{lines[1]}</b></span></p>
    <div class="mapw" id="mapw">
      <iframe class="mapf" id="mapf" title="Map of the venue" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="{embedUrl}"></iframe>
      <svg class="route" viewBox="0 0 390 336" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none"><path id="rt" pathLength="1" d="M-6 20C70 40 40 110 120 130S170 175 195 168" stroke="#B25D17" stroke-width="2.4" stroke-linecap="round" style="stroke-dasharray:.004 .016"/></svg>
      <div class="ring"></div><div class="ring r2"></div>
      <svg class="pin" id="pin" viewBox="0 0 34 44" aria-hidden="true">…same pin path as reference…</svg>
      <button class="lock" id="lock" type="button"><span>{hint}</span></button>
    </div>
    <div class="vb gut" id="vb"><a class="btn fill" href="{directionsUrl}" target="_blank" rel="noopener">{directionsLabel}</a><button class="btn" id="copy" type="button">{copyLabel}</button></div>
    <div class="grain"></div>
  </div>
</section>
```
Remove the S05 temporary `.tail`. Section order: `…05-date` → `06-venue`. Add a temporary ivory `.tail` (60svh) after it, marked "TEMP until RSVP spec".

## 3. Layout (stage = 100svh, `--u = stageHeight/844`; gutters `max(24px, safe-area)`; page column max 430px)
| Element | Value |
|---|---|
| `.ven` | `position:relative; height:220svh; background:var(--sand)` |
| Horizon `.ven::before` | `left/right:-14%; top:-80px; height:160px; background:var(--sand); border-radius:50% 50% 0 0; z-index:2` (overlaps the saffron band end) |
| `.stage` | `position:sticky; top:0; height:100svh; overflow:hidden; background:var(--sand); z-index:3` |
| Vignette `.vig` | `radial-gradient(120% 90% at 50% 45%, transparent 58%, rgba(216,182,132,.55) 100%)`, z 2 |
| Label | `top: calc(var(--u)*108px)`; `label` style; `rgba(35,43,37,.74)`; starts opacity 0 |
| Address | `top: calc(var(--u)*134px)`; Cormorant 500 `clamp(31px,9.2vw,37px)/1.12`; two block lines each `overflow:hidden` with inner `b` starting `translateY(110%)` |
| Map `.mapw` | `left:0; right:0; top: calc(var(--u)*268px); height: calc(var(--u)*336px); z-index:4; overflow:hidden; clip-path:circle(0px at 50% 50%)` |
| Warm wash | `.mapw::after`: `inset:0; background:rgba(235,206,174,.28); mix-blend-mode:multiply; pointer-events:none; z-index:2` |
| Buttons `.vb` | `top: calc(var(--u)*632px)`; flex, gap 10px, wrap; opacity 0 → 1 |
| Button style | min-height 48px, padding 0 20px, 1px ink border, radius 99px, 11.5px DM Sans 500 caps, letter-spacing .14em; `.fill` = ink bg, ivory text |
| Lock chip | `.lock` fills `.mapw`, `z-index:6`, transparent, chip bottom-centre 18px up: ink bg, ivory text, 11.5px caps, padding 11×18px, radius 99px |
| Pin | 34×44px at `left:50%; top:50%; margin:-44px 0 0 -17px`; z 5 |
| Rings | 22px circles, 2px `--saffron-deep` border at `50% 50%` (centred on the pin tip); animate `scale(.4→4)`, opacity `.9→0`, 2.4s ease-out infinite; second ring delayed 1.2s; only while `.go` is on `.ven` |
| Grain | opacity .06, multiply, z 30 |

## 4. Real map (replaces the prototype's drawn SVG)
- iframe: `position:absolute; inset:0; width:100%; height:100%; border:0; filter:sepia(.25) saturate(.9); pointer-events:none` (locked state). The map centre (the venue coordinate) is the centre of `.mapw`, so the pin sits at 50%/50%. `.mapw` MUST have `overflow:hidden` so nothing ever spills over the buttons; Google's logo and attribution must stay visible (never crop the iframe).
- Marker rule: use `ll=` (no Google marker); our pin is the only marker. If Google's own red marker still appears, do NOT add a second one: hide our pin (keep the rings and the drop timing on the iframe's marker position) and note it in the S06 report.
- Unlock: tapping `.lock` sets `iframe.style.pointerEvents='auto'` and hides the chip. Re-lock (restore pointer-events none and show the chip) when `.ven` is less than 30% in view (IntersectionObserver) so the guest never gets trapped.
- If the iframe fails to load, the section still reads correctly (address + buttons); no JS error.
- The route is decorative only (an "approach" line); do not claim it follows roads.

## 5. Scrub timeline (progress p = clamp((scrollTop − ven.offsetTop)/(ven.offsetHeight − stageHeight), 0, 1); use `core/scroll.js` scrub; `seg` = in-out quad)
| Item | Window | Effect |
|---|---|---|
| Label | .02–.10 | opacity 0→1 |
| Address line 1 / 2 | .05–.16 / .11–.22 | `b` translateY 110%→0 |
| Map iris | .12–.50 | `clip-path: circle(R at 50% 50%)`, R = t × hypot(stageWidth, 336u) × .75 |
| Route | .30–.62 | `stroke-dashoffset` 1→0 |
| Pin | .58–.70 | opacity min(1, 3t); translateY −70px→0; toggle `.go` when t > .9 |
| Buttons | .66–.78 | opacity 0→1, translateY 14px→0 |
After p = .78 everything holds; the last 22% is rest time (no exit animation: the RSVP chapter fades in from below).

## 6. Buttons
- **Get directions**: real `<a target="_blank" rel="noopener">` to `directionsUrl`.
- **Copy address**: `navigator.clipboard.writeText(copyText)` inside the click handler; on success the label becomes `copiedLabel` for 1.6s; on rejection fall back to selecting a hidden textarea + `document.execCommand('copy')`, same label feedback.
- Buttons are inert (`pointer-events:none`) while opacity < .5.

## 7. Accessibility and reduced motion
Address and buttons are real text/elements. The iframe has a `title`. The lock chip is a real `<button>`. Reduced motion: no scrub; final state shown (map open, route drawn, pin placed, no rings, buttons visible).

## 8. Acceptance checklist
- [ ] At 390×844 the final state matches the prototype layout (label 108u, address 134u, map 268u–604u, buttons 632u strictly below the map, never overlapping it).
- [ ] The sand horizon visibly rises over the saffron band; no hard seam between S05 and S06.
- [ ] Iris opens from the pin point; route draws; pin lands on the venue coordinate; exactly one marker visible.
- [ ] Map never blocks page scroll until "Tap to explore" is tapped; re-locks after leaving.
- [ ] Directions opens the short link; Copy copies and shows "Copied".
- [ ] Works at 360×740, 390×844, 430×932; nothing overlaps or overflows. No console errors; build passes.
- [ ] Screenshots: `qa/S06-p20.png`, `qa/S06-p50.png`, `qa/S06-p100.png`, `qa/S06-360.png`, `qa/S06-430.png`.

