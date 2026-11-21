# 08 — Closing: "The toran returns"
Owner: OpenCode (task S08) · Needs S07 · Last scene. Sticky stage in a **180svh** section (not scrubbed; triggered once). Ivory → sand gradient ground.
Visual reference: `docs/prototype/prototype-v3-venue-rsvp-closing.html` — open only the `CLOSING` CSS block, the toran generator (`blossom`, `leaf`, `pick`) and the closing IntersectionObserver. If reference and spec differ, **this spec wins**.

## 0. Experience
The RSVP's ivory continues straight into this chapter (no seam). The marigold toran from the Ganesha chapter drops in from above and sways gently, so the page ends where it began. Marigold petals drift down, some soft-focus in front. The sign-off lines rise in one by one: blessing, family name, event line, a "Share invitation" button, a thank-you.

## 1. Content — add to `src/content.js`
```js
closing: {
  blessing: 'With love and blessings',
  family: { pre: 'The', accent: 'Panda', post: 'family' },   // OWNER: confirm wording
  eventLine: "Samikshya's 16th Birthday Puja",
  dateLine: '29 November 2026',
  shareLabel: 'Share invitation',
  shareCopiedLabel: 'Link copied',
  shareTitle: "Samikshya's 16th Birthday Puja",
  shareText: 'You are warmly invited — Sunday, 29 November 2026, 7:00 PM onwards, Sapnpur, Sisua, Salepur, Cuttack.',
  thanks: 'Thank you for celebrating with us',
},
```

## 2. Markup
```html
<section data-scene="08-closing" class="clo" id="clo">
  <div class="stage">
    <svg class="tor" viewBox="0 0 390 200" aria-hidden="true"><g class="drop"><g class="sw"><!-- generated garland --></g></g></svg>
    <div class="petals" aria-hidden="true"><!-- 14 .pt --></div>
    <p class="cl1">{blessing}</p>
    <p class="cl2">{pre} <em>{accent}</em> {post}</p>
    <p class="cl3 label">{eventLine}<br>{dateLine}</p>
    <div class="cl4"><button class="btn fill" id="share" type="button">{shareLabel}</button></div>
    <p class="cl5 label">{thanks}</p>
    <div class="grain"></div>
  </div>
</section>
```
Remove the S07 temporary `.tail`. This is the last element on the page.

## 3. Layout and style
| Element | Value |
|---|---|
| Section | `position:relative; height:180svh; background:linear-gradient(180deg, var(--ivory) 0, var(--sand-lt) 45%, var(--sand) 100%)` |
| Stage | `position:sticky; top:0; height:100svh; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:0 max(24px, safe-area)` |
| Toran `.tor` | `position:absolute; left:0; top:0; width:100%; overflow:visible; pointer-events:none; z-index:5`. Same garland as S01: quad Bezier `M-6 -4 Q195 140 396 -4`, 25 blossoms (N=24), seeded generator seed 7, leaves on even indices, colours from `pick()` (50% `#F5B74E/#FFD58A`, 35% `#E48C35/#F5B74E`, 15% `#FBF3E4/#F5B74E`) |
| Toran motion | `.drop`: `translateY(-130%)` → none when `.in`, 1.8s `--ease-out`. `.sw`: `transform-origin:195px -4px`, rotate ±.35deg, 7.5s ease-in-out infinite |
| `.cl1` | Cormorant italic 400 `clamp(19px,5.4vw,22px)/1.3`, `rgba(35,43,37,.85)` |
| `.cl2` | Cormorant 500 `clamp(40px,12vw,50px)/1.05`, margin-top 10px; `em` (the accent word) italic, `--saffron-deep` |
| `.cl3` | `label` style, `rgba(35,43,37,.8)`, margin-top 22px, line-height 1.9 |
| `.cl4` | margin-top 30px; button = shared `.btn.fill` (48px, ink) |
| `.cl5` | `label` style, `rgba(35,43,37,.62)`, margin-top 44px |
| Entrance | `.cl1–.cl4`: opacity 0, translateY(14px) → none when `.in`: cl1 1.2s, cl2 1.3s +.2s, cl3 1.2s +.45s, cl4 1.2s +.7s (all `--ease-out`); `.cl5` opacity only, 1.4s +1s |
| Petals | 14 `.pt`: shape `border-radius:80% 0 80% 0`, aspect 1:1.25, colours cycle `#F5B74E #E48C35 #FBF3E4 #F5B74E #E48C35`, opacity .9. 4 "front" (16–20px, blur 1.6px, z 25, 19–24s) and 10 "back" (9–15px, no blur, z 3, 26–36s); `left` 4–96%; negative random delays so the field is already populated; animation `fall` linear infinite: translate3d from (0,−8vh) through (14px,26vh) (−12px,52vh) (12px,80vh) to (0,110vh) with rotation 0→520deg |
| Grain | opacity .06, multiply, z 30 |

## 4. Interaction
- `.in` is added once when 40% of the section is visible (IntersectionObserver, `threshold:.4`). Petals animation is `animation-play-state:paused` until `.in`.
- **Share**: if `navigator.share` exists → `navigator.share({title, text, url:location.href})` (ignore AbortError); otherwise copy `location.href` with `navigator.clipboard.writeText` inside the click handler, label becomes `shareCopiedLabel` for 1.6s; if clipboard is rejected, fall back to hidden textarea + `execCommand('copy')`.
- Nothing else is interactive. The page ends here: no footer, no "back to top".
- Reduced motion: no toran drop or sway, no falling petals (hide `.petals`), text visible immediately (as if `.in`).

## 5. Accessibility
Text is real DOM text; the toran and petals are `aria-hidden`; the Share button is a real `<button>`; contrast ink on sand ≥ 10:1.

## 6. Acceptance checklist
- [ ] No seam between the RSVP ivory and the closing top; the gradient is smooth to sand at the bottom.
- [ ] Toran matches the S01 garland style and drops in once; gentle sway; clipped by the stage top, never covering text.
- [ ] Text rises in order (blessing → family → event/date → button → thank-you); petals drift behind and in front without blocking taps.
- [ ] Share opens the native sheet on a phone; on desktop it copies the link and shows "Link copied".
- [ ] Works at 360×740, 390×844, 430×932; nothing overflows or overlaps. No console errors; build passes.
- [ ] Screenshots: `qa/S08-in.png` (about 2.5s after trigger), `qa/S08-end.png` (page bottom), `qa/S08-360.png`, `qa/S08-430.png`.

