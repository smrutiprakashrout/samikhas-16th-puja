# 05b — Family → Date link: "The blossom becomes the sun" (PATCH to specs 04 and 05)
Owner: OpenCode (task L45) · Needs S04, S05 done. This patch **supersedes** the parts of 04 and 05 named below; everything else in those specs stays (all visuals, text, content keys, the foil, scratch logic, petals, calendar button).
Visual reference (approved): `docs/prototype/prototype-v4-family-date-link.html`. Open only: the `DATE` CSS block, `size()`, `applyFam()`, `applyDate()` and `frame()`. If reference and spec differ, **this spec wins**.

## 0. Experience
The family thread ends in a marigold blossom (as in S04). On further scroll that blossom swells into a saffron circle that grows from its exact spot until the whole screen is saffron. Then the ticket builds itself, piece by piece: it unrolls from its middle, its border draws, the label, foil panel and dashed line appear, and the scratch hint fades in. Scrolling back reverses everything (all scrubbed).

## 1. What changes in S04 (family)
- `.fam` height `220svh` → **`240svh`**. All S04 scrub windows stay as they are (thread .05–.66, blocks .06/.30, blossom .58–.72).
- Nothing else. The blossom stays at `left: gutter − 15px` (31px wide), `top: 626u − 15px`, so its centre is **OX = max(24px, safe-area-left) + .5px, OY = 626u**.
- Remove the S04 temporary tail block if it still exists.

## 2. What changes in S05 (date)
The date chapter is no longer a normal-flow band. It becomes a **pinned stage that overlaps the end of the family section**.
**Remove:** `.band::before` (curved top edge), `.band.in` / IntersectionObserver entrance, `min-height:100svh`, the wrapper entrance transform (`opacity 0; translateY(70px) rotate(-3deg)`), and `.ticket::before` (the inset border; replaced by an SVG border, §4). Reduced-motion rule stays (§7).

### Markup (same content keys; changed shell)
```html
<section data-scene="05-date" class="date" id="date">
  <div class="stage" id="ds">           <!-- pinned, saffron, clipped by a circle -->
    <div class="shade"></div><div class="burst" id="burst"></div>
    <div class="wrap" id="wrap">
      <div class="tkw" id="tkw"><div class="ticket" id="tk">
        <svg class="bd" id="bd" aria-hidden="true"><rect id="bdr" pathLength="1" fill="none" stroke="rgba(168,121,63,.55)" stroke-width="1"/></svg>
        <p class="tt label" id="tt">{label}<i></i></p>
        <div class="panel" id="panel"> …unchanged (rev, canvas, shim)… </div>
        <div class="perf" id="perf"></div>
        <div class="stubz"><a class="btn" id="btn" …unchanged…></a></div>
      </div></div>
      <p class="hint label" id="hint"><span class="dot"></span>{scratchHint}</p>
      <button class="rv" id="rv" type="button">{revealButton}</button>
    </div>
    <div class="grain"></div>
  </div>
</section>
```
### Layout
| Element | Value |
|---|---|
| `.date` | `position:relative; z-index:60; height:230svh; margin-top:-135svh` (= −(1 + 0.35) × viewport; the date stage starts pinned while the family stage is still pinned underneath) |
| `.date .stage` | `position:sticky; top:0; height:100svh; overflow:hidden; background:var(--saffron); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 max(24px,safe-area)`; initial `clip-path:circle(0px at OX OY)` |
| `.ven` (S06) | add `z-index:61` so the sand horizon of the venue chapter draws over the end of this stage |
| `.shade`, `.burst`, ticket, panel, foil, perf, stub, hint | all exactly as in S05 §3 (ticket width `min(100vw − 84px, 306px)`, aspect 306/452, notches at 76%…), except: `.burst` starts `opacity:0`; `.tkw` starts `opacity:0`; `.ticket` starts `clip-path:inset(50% 0 50% 0)`; `.tt`, `.panel`, `.hint`, `.rv` start `opacity:0`; `.perf` starts `clip-path:inset(0 100% 0 0)`; `.bd rect` has `stroke-dasharray:1; stroke-dashoffset:1` |
| `.bd` | `position:absolute; left:8px; top:8px; pointer-events:none; overflow:visible`. JS sets its `width/height/viewBox` to `ticket.clientWidth − 16` × `ticket.clientHeight − 16` (px, so no scaling) and the rect to `x .5, y .5, width w−1, height h−1`. Recompute on resize. |
| Canvas `.fc` | `pointer-events:none` until the stage has class `.on` |

## 3. Scrub timeline
Family progress `p = clamp((scrollTop − fam.offsetTop)/(fam.offsetHeight − H), 0, 1)` (unchanged).
Date progress `q = clamp((scrollTop − date.offsetTop)/(date.offsetHeight − H), 0, 1)`; date travel = 1.3H; the circle needs 0.35H of it, so its window is **0 → 0.269** (= 0.35/1.3). At q = 0 the family has reached p ≈ .75 (blossom done); the family stage unpins exactly when the circle completes, so the family never drifts away under the circle.
| Item | q window | Effect |
|---|---|---|
| Circle | 0–.269 | `clip-path: circle(R at OX OY)`, R = seg × hypot(W, H) × 1.05, W = stage width, H = stage height |
| Burst rays | .20–.34 | opacity 0 → .5 |
| Ticket wrapper `.tkw` | .20–.40 | opacity min(1, 4×t); `translateY(40px→0)`; `rotate(−3deg→0)` |
| Ticket body `.ticket` | .20–.40 | `clip-path: inset(((1−t)×50)% 0 ((1−t)×50)% 0)` (unrolls from the middle) |
| Border draw | .36–.50 | `.bd rect` `stroke-dashoffset` 1 → 0 |
| Label + diamond `.tt` | .46–.54 | opacity 0→1, `translateY(8px→0)` |
| Foil panel | .50–.60 | opacity 0→1, `scale(.94→1)` |
| Perforation | .56–.64 | `clip-path: inset(0 ((1−t)×100)% 0 0)` |
| Hint + Reveal button | .62–.70 | opacity 0→1 |
| Interactivity | q > .62 | add `.on` to the stage (canvas receives pointers; Reveal button enabled). Remove `.on` if q < .62. |
`seg` = the shared in-out quad. After q = .70 nothing animates (rest time ≈ .5H while the guest scratches). Scratch, reveal (`.done`, `.done-all`), petals, vibrate, calendar button: **unchanged** from S05 and persist when scrolling back.

## 4. Sizing (run in `size()` on load, resize, and after fonts load)
`H = stage height; U = H/844; fam.height = 2.4H (or 240svh); date.height = 2.3H; date.marginTop = −1.35H; OX = max(24, safe-left) + .5; OY = 626U`. Use the shared scrub helper from `core/scroll.js` (one scroll listener + rAF); do not add a second scroll listener.

## 5. Z-order and seams
Family stage `z auto` (below); date `z60`; venue `z61`. At q = 0 the circle has radius 0 and the date stage is invisible (clipped), so no flash. When the circle completes the screen is flat saffron, then the ticket builds. At the end of the date section the venue's sand horizon (S06) rises over the saffron, as before.

## 6. Accessibility
The date/time text stays real DOM text inside the panel at all times. The Reveal button gets `disabled` until `.on`. Tab order unchanged.

## 7. Reduced motion
No circle/clip animation: show the final assembled ticket immediately (stage fully visible, circle R = max, all windows at 1), run S05's reduced-motion auto-reveal, no petals.

## 8. Acceptance checklist
- [ ] Scrolling slowly: blossom appears at the thread end, then a saffron disc grows exactly from it (no jump, no flash) until the screen is flat saffron; the family text never scrolls away under it.
- [ ] Ticket assembles in the order of §3; at q ≥ .70 it is identical to the approved S05 ticket (compare to `qa/S05-idle.png`).
- [ ] Scratching only works once the hint is visible; page still scrolls when touching outside the panel; reveal/petals/calendar button unchanged.
- [ ] Scrolling back up reverses everything smoothly; a revealed ticket stays revealed.
- [ ] The venue horizon draws over the saffron end (no hard seam, no saffron peeking above the venue sand).
- [ ] 360×740, 390×844, 430×932: no overlap, the disc origin sits on the blossom at all three.
- [ ] No console errors; build passes; S04 and S05 acceptance items still pass.
- [ ] Screenshots into qa/: `L45-q05.png` (q=.05), `L45-q15.png`, `L45-q27.png` (flat saffron), `L45-q33.png` (ticket unrolling), `L45-q45.png` (border drawing), `L45-q58.png`, `L45-q72.png` (hint visible), `L45-360.png` and `L45-430.png` at q=.72.
