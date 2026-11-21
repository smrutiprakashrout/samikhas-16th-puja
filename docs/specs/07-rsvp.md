# 07 — RSVP / contact: "Light the diya"
Owner: OpenCode (task S07) · Needs S06 · Normal-flow section (NOT scrubbed), `min-height:100svh`. Ivory ground.
Visual reference: `docs/prototype/prototype-v3-venue-rsvp-closing.html` — open only the `RSVP` CSS block, the `#diya` SVG block and the diya click handler. If reference and spec differ, **this spec wins**.

## 0. Experience
The sand of the venue chapter fades softly into ivory (no edge). A small "For any queries" label, then a brass diya. Both phone numbers are always visible and tappable. Tapping the diya lights it: the flame grows and flickers, a warm glow spreads behind it, the hint disappears, the Call/WhatsApp buttons brighten (WhatsApp turns deep saffron) and a thank-you line fades in. The guest never has to light the diya to reach someone.

## 1. Content — add to `src/content.js`
```js
rsvp: {
  label: 'For any queries',
  hint: 'Tap the diya',
  diyaLabel: 'Light the diya',
  callLabel: 'Call',
  whatsappLabel: 'WhatsApp',
  thanks: 'Thank you — we look forward to seeing you.',
  contacts: [
    { name: '', phone: '98539 93661', tel: '+919853993661', wa: '919853993661' },
    { name: '', phone: '77351 72417', tel: '+917735172417', wa: '917735172417' },
  ],   // OWNER: fill `name` (e.g. 'Papa'); if empty, no name line is rendered
},
```
WhatsApp link = `https://wa.me/{wa}`; Call link = `tel:{tel}`. Numbers are real text (user-select all).

## 2. Markup
```html
<section data-scene="07-rsvp" class="rsvp" id="rsvp">
  <div class="glowr"></div>
  <p class="rl label">{label}</p>
  <button class="diya" id="diya" type="button" aria-label="{diyaLabel}" aria-pressed="false">
    <svg viewBox="0 0 156 130" aria-hidden="true"> … copy verbatim from the prototype `#diya` … </svg>
  </button>
  <p class="dh label" id="dh">{hint}</p>
  <div class="rows">
    <!-- one per contact -->
    <div class="row">
      <p class="nm label">{name}</p>   <!-- only if name -->
      <p class="num">{phone}</p>
      <div class="acts"><a class="btn" href="tel:{tel}">{callLabel}</a><a class="btn fill" href="https://wa.me/{wa}" target="_blank" rel="noopener">{whatsappLabel}</a></div>
    </div>
  </div>
  <p class="up" aria-live="polite">{thanks}</p>
  <div class="grain"></div>
</section>
```
Remove the S06 temporary `.tail`; add a temporary sand `.tail` (60svh) marked "TEMP until closing spec".

## 3. Layout and style
| Element | Value |
|---|---|
| Section | `position:relative; z-index:4; min-height:100svh; background:var(--ivory); display:flex; flex-direction:column; align-items:center; text-align:center; overflow:hidden; padding:12svh max(24px,safe-area) 10svh` |
| Fade-in `::before` | `left:0; right:0; top:-30svh; height:30svh; background:linear-gradient(180deg, rgba(251,243,228,0), var(--ivory)); z-index:2; pointer-events:none` (draws over the venue's rest area so there is no seam) |
| Glow `.glowr` | `position:absolute; left:50%; top:calc(12svh + 78px); width:150%; aspect-ratio:1; translate:-50% -50%; border-radius:50%; background:radial-gradient(circle, rgba(255,226,166,.85) 0, rgba(245,183,78,.35) 24%, rgba(244,228,204,0) 56%); opacity:0; transform:scale(.3); pointer-events:none`; lit: opacity 1, scale 1 (opacity 1.6s ease, transform 2.2s `--ease-out`) |
| Label | `label` style, `rgba(35,43,37,.74)`, z 3 |
| Diya button | 156×130px, margin-top 20px, no border/background, `-webkit-tap-highlight-color:transparent`, z 3; tap target is the whole 156×130 |
| Flame | `transform-origin:78px 74px; transform:scale(0)`; lit: scale(1) over 1s `--ease-out`, then `flick` 1.6s ease-in-out infinite (keyframes 0/100% `scale(1,1) rotate(0)`; 30% `scale(.96,1.06) rotate(-1.5deg)`; 60% `scale(1.03,.97) rotate(1.2deg)`), starts after 1s |
| Hint `.dh` | margin-top 6px, `label` style, `rgba(35,43,37,.8)`; lit → opacity 0 in .5s |
| Rows | width 100%, max-width 342px, margin-top 26px; each row `padding:20px 0; border-top:1px solid rgba(35,43,37,.16)`; last row also border-bottom |
| Name line | `label` style, `rgba(35,43,37,.62)`, margin-bottom 8px (only if a name exists) |
| Number | Cormorant 500 `clamp(31px,9.2vw,37px)/1`, letter-spacing .01em, lining nums |
| Actions | flex, gap 10px, centred, margin-top 14px; each `.btn` flex:1, max-width 150px, opacity .62 (unlit); lit: opacity 1 (transition .8s ease .4s) and `.fill` bg/border → `--saffron-deep` (.6s) |
| Buttons | same `.btn` as S06 (48px, pill, 11.5px caps, `.fill` = ink bg/ivory text) |
| Thanks | Cormorant italic 400 19px/1.4, margin-top 20px, min-height 28px, `rgba(35,43,37,.85)`, opacity 0 → 1 (.8s ease .8s delay) when lit |
| Grain | opacity .06, multiply, z 30 |

## 4. Interaction
- Diya `click` (idempotent): add `.lit` to `.rsvp`, set `aria-pressed="true"`, `navigator.vibrate(20)` in try/catch. Nothing is persisted; a reload shows the diya unlit.
- Call/WhatsApp links work in both states (the dimming is visual only; do not disable them).
- Reduced motion: add `.lit` automatically when the section is 40% in view (IntersectionObserver, once); no flicker animation, no glow scale transition (glow simply visible).
- No audio in this task.

## 5. Accessibility
Real `<button>` for the diya, real `<a>` for call/WhatsApp, tap targets ≥ 44px (buttons 48px). Numbers are plain text. Thank-you line `aria-live="polite"`. Contrast: ink on ivory 13:1.

## 6. Acceptance checklist
- [ ] Seamless fade from the venue sand into ivory; no horizontal edge visible while scrolling.
- [ ] Unlit: diya with no flame, hint visible, both numbers and buttons visible (dimmed).
- [ ] Tap: flame grows then flickers, glow spreads, hint fades, buttons brighten, thank-you appears; second tap does nothing.
- [ ] Call opens `tel:+91…`, WhatsApp opens `https://wa.me/91…` in a new tab; numbers match `content.rsvp.contacts`.
- [ ] Empty `name` renders no name line and no gap.
- [ ] Works at 360×740, 390×844, 430×932; nothing overflows or overlaps. No console errors; build passes.
- [ ] Screenshots: `qa/S07-unlit.png`, `qa/S07-lit.png`, `qa/S07-seam.png` (scrolled so the venue/RSVP join is mid-screen), `qa/S07-360.png`, `qa/S07-430.png`.

