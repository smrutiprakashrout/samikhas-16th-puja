# 02 — Hero: "A portrait in an arch"
Owner: OpenCode (task S02) · Needs S01 · Scene height `320vh` (3.2 × stage height), scrubbed.
Visual reference: `docs/prototype/prototype-v3-hero.html` (approved; it loads `assets/img/samikshya.webp` and `assets/img/grain.svg` relatively, so open it from inside the project). If reference and spec differ, **this spec wins**. Do not read the prototype whole; open only the parts named here. Asset provided: `assets/img/samikshya.webp` (700×1171, transparent cut-out, warm grade baked in).

## 0. Experience
The Ganesha chapter has lifted away and the sand ground continues. A soft glow appears; a tall arch draws itself from its base upward (wood line plus a dotted gold line outside it) and fills with a lit ivory niche. She rises into the arch from below and her head breaks above the arch's top. The saffron digits "1" and "6" rise behind her, flanking her head, partly tucked behind her hair; "th" pops in. Then "Birthday Puja", "Samikshya" and "Pragyan Panda" appear. Petals and gold dust keep drifting. At the end the ivory invitation chapter slides up over the hero.

## 1. Content (from `src/content.js`; add nothing except the photo path)
`title.number` ("16"), `title.suffix` ("th"), `title.text` ("Birthday Puja" → split on spaces: every word but the last is plain, the last word is wrapped in `<em>`), `honoree.first` ("Samikshya"), `honoree.rest` ("Pragyan Panda"), `honoree.photoAlt`. Set `honoree.photo = '/img/samikshya.webp'`.

## 2. Markup
```html
<section data-scene="02-hero" class="ch2" style="height:320vh">
  <div class="stage" style="position:sticky;top:0;height:100svh">
    <div class="glow" id="glow"></div><div class="vig"></div><div class="grain"></div>
    <canvas id="motes" aria-hidden="true"></canvas><div id="petals" aria-hidden="true"></div>
    <div class="arch" id="arch">
      <svg class="fillsvg" id="fillsvg" viewBox="0 0 288 414" preserveAspectRatio="none" aria-hidden="true">
        defs: linearGradient #nf (vertical: #F4E4CC 0 → #EFD7B3 .6 → #EBCEAE 1), radialGradient #nr (cx .5 cy .28 r .6: #FFF9EC opacity .95 → 0)
        two paths "M0 414V145A144 144 0 0 1 288 145V414Z": fill url(#nf), then fill url(#nr) </svg>
      <svg class="line" viewBox="0 0 288 414" preserveAspectRatio="none" aria-hidden="true" fill="none">
        <path class="draw" id="ln" pathLength="1" d="M1 414V145A143 143 0 0 1 287 145V414" stroke="#A8793F" stroke-width="1.3"/></svg>
      <svg class="dots" viewBox="-12 -12 312 438" preserveAspectRatio="none" aria-hidden="true" fill="none">
        <path class="draw" id="ln2" pathLength="1" d="M-11 414V145A155 155 0 0 1 299 145V414" stroke="#E0AF70" stroke-width="1.6" stroke-dasharray="0.002 0.0125" stroke-linecap="round"/></svg>
    </div>
    <div class="base" id="base"></div>
    <div class="dg d1" id="d1" aria-hidden="true">1</div><div class="dg d6" id="d6" aria-hidden="true">6</div><div class="th" id="th" aria-hidden="true">th</div>
    <div class="her" id="her"><img src="/img/samikshya.webp" alt="…" width="700" height="1171" decoding="async"></div>
    <p class="tx t1" id="t1"><span class="w">Birthday</span> <span class="w"><em>Puja</em></span></p>
    <p class="tx t2" id="t2" aria-label="Samikshya"><span class="ch">S</span>… one span per letter</p>
    <p class="tx t3 label" id="t3"><i></i><span id="t3s">Pragyan Panda</span><i></i></p>
  </div>
</section>
```
Add a visually hidden `<h2 class="sr-only">16th Birthday Puja</h2>` inside the stage for screen readers. The next chapter (built later) will have `margin-top:-50svh; position:relative; z-index:40; background:var(--ivory); box-shadow:0 -24px 40px -10px rgba(110,76,40,.28)` so it slides over the hero. Until it exists, add a temporary ivory `.next` block (min-height 100svh) after the section, marked "TEMP until invitation spec". Remove the S01 temporary `.tail` block.

## 3. Layers (back → front)
sand ground (`--sand` on `.stage`) → glow → vignette (z29) → dust canvas (z3) → back petals (z5) → arch (z6) → arch base line (z6) → digits and "th" (z8) → **her cut-out (z10)** → text (z12) → front petals (z25) → paper grain (z30). Same grain, vignette, dust and petal generators as chapter 1 (reuse the S01 modules; 38 motes; 12 petals: 3 front, 9 back). Petals and dust pause when the stage is off-screen.

## 4. Layout (390×844 reference). `--u = stageHeight/844`, set on `.stage`. HORIZONTAL positions are relative to the stage centre: `calc(50% + var(--u)*Xpx)`, so the composition stays centred at any width (verified at 360, 390, 430).
| Element | Position / size |
|---|---|
| Glow | centre `top 330u`, width 140% of the stage, ivory→marigold radial (see CSS) |
| Arch | width `288u`, height `414u`, `left:50%; margin-left:-144u; top:118u` |
| Arch base line | `top 532u`, width `330u` centred, 1px `--wood`, draws from the centre outward (`scaleX`) |
| Her cut-out `.her` | `left: calc(50% − 180u)`, `top 78u`, width `340u`, height `490u`, `overflow:hidden`; mask `linear-gradient(180deg,#000 0,#000 calc(100% − 48u),transparent 100%)` (fades the waist crop into the sand). Image filter: `drop-shadow(0 0 1px rgba(255,249,236,.95)) drop-shadow(0 0 6px rgba(255,249,236,.35))` (ivory rim). Her head breaks about 40u above the arch apex. |
| Digit "1" | Cormorant Garamond 500, `196u`, line-height 1, `font-variant-numeric: lining-nums`, letter-spacing −.03em; `left: calc(50% − 151u)`, `top 100u` |
| Digit "6" | same style; `left: calc(50% + 27u)`, `top 100u` |
| Digit colour | `linear-gradient(180deg,#E48C35,#B25D17)` clipped to text; `filter: drop-shadow(0 1.5px 0 rgba(255,249,236,.85)) drop-shadow(0 8px 10px rgba(110,76,40,.25))` |
| "th" | Cormorant italic 500, `50u`, `--saffron-deep`; `left: calc(50% + 131u)`, `top 116u`; `transform-origin:0 100%` |
| "Birthday Puja" | `top 590u`, centred, Cormorant 500, `clamp(32px, 38u, 42px)`, line-height 1; "Puja" italic in `--saffron-deep` |
| "Samikshya" | `top 640u`, centred, Cormorant 500, `clamp(48px, 64u, 68px)`, line-height 1.02, letter-spacing −.01em, `--ink` |
| "Pragyan Panda" | `top 728u`, `label` style, `rgba(35,43,37,.78)`, flanked by two 28px × 1px `--wood` lines, gap 12px |

## 5. Scroll scrub (progress p = 0..1 over the scene; use `scrub`; `seg()` = in-out quad)
Let `r = seg(p,.20,.46)`, `dr = seg(p,.46,1)`.
| What | Window / formula |
|---|---|
| Glow | opacity `seg(p,0,.12)`; `translateY(−6px · dr)` |
| Arch line | `stroke-dashoffset = 1 − seg(p,.04,.26)` (the path starts at the bottom-left, so it draws up the left side, over the top, and down the right) |
| Dotted arch | same window: `stroke-dasharray = "a 1"` with `a = seg(p,.04,.26)`; hidden when a=0 |
| Niche fill | opacity `seg(p,.12,.30)` |
| Base line | `scaleX = seg(p,.04,.20)` |
| Her | opacity `clamp(r·1.6, 0, 1)`; `translateY = (1−r)·160u − 24u·dr` px; `scale = 1.06 − .06·r` |
| "1" | `e1 = seg(p,.34,.46)`; opacity `e1`; `translateY = (1−e1)·40u − 10u·dr` |
| "6" | `e6 = seg(p,.40,.52)`; same formula |
| "th" | `et = seg(p,.50,.58)`; opacity `et`; `scale = .6 + .4·et`; `translateY = −10u·dr` |
| "Birthday" / "Puja" | word i: window `[.50 + .05i, .58 + .05i]`, opacity 0→1, `translateY(12px→0)` |
| "Samikshya" | letter i: window `[.60 + .012i, .66 + .012i]`, opacity 0→1, `translateY(24px→0)` |
| "Pragyan Panda" | `s3 = seg(p,.70,.80)`: text opacity `s3`; each line `scaleX = s3` |
| Hold | .80–.90: only ambient loops |
Only transform and opacity (plus stroke-dashoffset/dasharray for the arch). `will-change:transform` on `.her` and the digits only.

## 6. Reduced motion
Show the end state: arch drawn, her visible, digits and text in place; no petals, dust or scrub; 300ms crossfade.

## 7. Accessibility / edge cases
Her image has alt text; digits `aria-hidden` plus the `sr-only` heading; text selectable. Wait for `document.fonts.ready` before measuring. Resize: recompute `--u` and canvas sizes, call `frame()`. Image: explicit width/height, `decoding="async"`, load eagerly.

## 8. Acceptance checklist
- [ ] At 390×844, p≈.06, .2, .4, .62, .8, 1.0 match the prototype's positions and sizes.
- [ ] Her head breaks above the arch apex; "1" and "6" partly tucked behind her hair (70–80% visible); "th" at the top right; "1" is a proper lining "1".
- [ ] Waist fade smooth, no hard crop line; ivory rim visible.
- [ ] No overlaps or clipping at 360×740, 390×844, 430×932; all horizontal positions centre-relative.
- [ ] Parallax: she drifts up 24u, digits 10u (slower), glow 6px, after p=.46.
- [ ] Only transform/opacity/stroke properties animate; petals and dust pause off-screen.
- [ ] Reduced-motion path works. No console errors. `npm run build` passes.
- [ ] Screenshots: `qa/S02-p06.png`, `p20`, `p40`, `p62`, `p80`, `p100` (390×844) and `qa/S02-360.png`, `qa/S02-430.png` at p≈.8.

## 9. Reference CSS (port; swap to tokens; `{{GRAIN}}` already replaced by /img/grain.svg)
```css
:root{--ink:#232B25;--ink-deep:#181E1A;--ivory:#FBF3E4;--sand:#EBCEAE;--sand-lt:#F4E4CC;--sand-dp:#D8B684;--wood:#A8793F;--wood-dk:#6E4C28;--gold:#E0AF70;--marigold:#F5B74E;--saffron:#E48C35;--saffron-deep:#B25D17;
 --display:'Cormorant Garamond',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif;--ease-out:cubic-bezier(.16,1,.3,1);--u:1;color-scheme:light}
*{box-sizing:border-box;margin:0}html,body{height:100%}
body{background:var(--ink-deep);color:var(--ink);font-family:var(--sans);overflow:hidden;-webkit-font-smoothing:antialiased}
.phone{position:relative;width:min(100%,430px);height:100%;margin:0 auto;background:var(--sand);overflow:hidden}
.scroller{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none}.scroller::-webkit-scrollbar{display:none}
.label{font:500 11px/1.4 var(--sans);letter-spacing:.24em;text-transform:uppercase}
.ch2{position:relative}
.stage{position:sticky;top:0;overflow:hidden;background:var(--sand)}
.grain,.vig{position:absolute;inset:0;pointer-events:none}
.grain{background:url("/img/grain.svg");opacity:.06;mix-blend-mode:multiply;z-index:30}
.vig{background:radial-gradient(120% 90% at 50% 42%,transparent 55%,rgba(216,182,132,.55) 100%);z-index:29}
.glow{position:absolute;left:50%;top:calc(var(--u)*330px);width:140%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;opacity:0;
 background:radial-gradient(circle,rgba(255,249,236,.95) 0,rgba(255,226,166,.55) 24%,rgba(245,183,78,.2) 46%,transparent 66%)}
#motes{position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none}
#petals{position:absolute;inset:0;pointer-events:none}
.pt{position:absolute;top:0;left:var(--x);width:var(--s);height:calc(var(--s)*1.25);border-radius:80% 0 80% 0;background:var(--c);opacity:.9;filter:blur(var(--b));z-index:var(--z);animation:fall var(--t) linear var(--dl) infinite}
@keyframes fall{0%{transform:translate3d(0,-8vh,0) rotate(0)}25%{transform:translate3d(14px,26vh,0) rotate(120deg)}50%{transform:translate3d(-12px,52vh,0) rotate(250deg)}75%{transform:translate3d(12px,80vh,0) rotate(380deg)}100%{transform:translate3d(0,110vh,0) rotate(520deg)}}
/* arch */
.arch{position:absolute;left:50%;top:calc(var(--u)*118px);width:calc(var(--u)*288px);height:calc(var(--u)*414px);margin-left:calc(var(--u)*-144px);z-index:6}
.arch svg{position:absolute;overflow:visible}
.arch .fillsvg{inset:0;width:100%;height:100%;opacity:0}
.arch .line{inset:0;width:100%;height:100%}
.arch .dots{left:-12px;top:-12px;width:calc(100% + 24px);height:calc(100% + 24px)}
.arch path.draw{stroke-dasharray:1;stroke-dashoffset:1}
.base{position:absolute;left:50%;top:calc(var(--u)*532px);width:calc(var(--u)*330px);margin-left:calc(var(--u)*-165px);height:1px;background:var(--wood);z-index:6;transform:scaleX(0)}
/* digits */
.dg{position:absolute;z-index:8;font:500 calc(var(--u)*196px)/1 var(--display);font-variant-numeric:lining-nums;letter-spacing:-.03em;opacity:0;will-change:transform;
 background:linear-gradient(180deg,#E48C35,#B25D17);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 1.5px 0 rgba(255,249,236,.85)) drop-shadow(0 8px 10px rgba(110,76,40,.25))}
.d1{left:calc(50% + var(--u)*-151px);top:calc(var(--u)*100px)}
.d6{left:calc(50% + var(--u)*27px);top:calc(var(--u)*100px)}
.th{position:absolute;z-index:8;left:calc(50% + var(--u)*131px);top:calc(var(--u)*116px);font:italic 500 calc(var(--u)*50px)/1 var(--display);color:var(--saffron-deep);opacity:0;transform-origin:0 100%}
/* swag */
.swag{position:absolute;left:0;top:calc(var(--u)*100px);width:100%;z-index:7;overflow:visible;opacity:0}
/* her */
.her{position:absolute;left:calc(50% - var(--u)*180px);top:calc(var(--u)*78px);width:calc(var(--u)*340px);height:calc(var(--u)*490px);z-index:10;overflow:hidden;opacity:0;will-change:transform;
 -webkit-mask-image:linear-gradient(180deg,#000 0,#000 calc(100% - var(--u)*48px),transparent 100%);mask-image:linear-gradient(180deg,#000 0,#000 calc(100% - var(--u)*48px),transparent 100%)}
.her img{display:block;width:100%;height:auto;filter:drop-shadow(0 0 1px rgba(255,249,236,.95)) drop-shadow(0 0 6px rgba(255,249,236,.35))}
/* text */
.tx{position:absolute;left:0;right:0;text-align:center;z-index:12}
.t1{top:calc(var(--u)*590px);font:500 clamp(32px,calc(var(--u)*38px),42px)/1 var(--display)}
.t1 em{color:var(--saffron-deep)}
.t2{top:calc(var(--u)*640px);font:500 clamp(48px,calc(var(--u)*64px),68px)/1.02 var(--display);letter-spacing:-.01em}
.t3{top:calc(var(--u)*728px);display:flex;align-items:center;justify-content:center;gap:12px;color:rgba(35,43,37,.78)}
.t3 i{display:block;height:1px;width:28px;background:var(--wood);transform:scaleX(0)}
.w{display:inline-block;opacity:0;transform:translateY(12px)}
.ch{display:inline-block;opacity:0;transform:translateY(24px)}
.next{position:relative;z-index:40;margin-top:-50svh;background:var(--ivory);padding:calc(14svh) 24px;box-shadow:0 -24px 40px -10px rgba(110,76,40,.28);min-height:100svh}
.next p{font:500 32px/1.2 var(--display);max-width:16ch}
```

## 10. Reference JS (scrub; adapt to modules and `content`)
```js
var glow=$('#glow'),ln=$('#ln'),ln2=$('#ln2'),fill=$('#fillsvg'),base=$('#base'),her=$('#her'),d1=$('#d1'),d6=$('#d6'),th=$('#th'),t1=$('#t1'),t2=$('#t2'),t3=$('#t3'),t3s=$('#t3s');
var w1=[].slice.call(t1.querySelectorAll('.w')),chs=[].slice.call(t2.querySelectorAll('.ch')),lines=[].slice.call(t3.querySelectorAll('i'));
function apply(p){
 glow.style.opacity=seg(p,0,.12);glow.style.transform='translateY('+(-6*seg(p,.46,1))+'px)';
 var a=seg(p,.04,.26);ln.style.strokeDashoffset=1-a;ln2.style.opacity=a>0?1:0;ln2.style.strokeDashoffset=0;ln2.style.strokeDasharray=(a*1)+' 1';
 fill.style.opacity=seg(p,.12,.3);base.style.transform='scaleX('+seg(p,.04,.2)+')';
 var r=seg(p,.20,.46),dr=seg(p,.46,1);
 her.style.opacity=clamp(r*1.6,0,1);her.style.transform='translateY('+((1-r)*160*U-24*U*dr)+'px) scale('+(1.06-.06*r)+')';
 var e1=seg(p,.34,.46),e6=seg(p,.40,.52),et=seg(p,.50,.58);
 d1.style.opacity=e1;d1.style.transform='translateY('+((1-e1)*40*U-10*U*dr)+'px)';
 d6.style.opacity=e6;d6.style.transform='translateY('+((1-e6)*40*U-10*U*dr)+'px)';
 th.style.opacity=et;th.style.transform='translateY('+(-10*U*dr)+'px) scale('+(.6+.4*et)+')';
 w1.forEach(function(el,i){var t=seg(p,.50+i*.05,.58+i*.05);el.style.opacity=t;el.style.transform='translateY('+((1-t)*12)+'px)'});
 chs.forEach(function(el,i){var t=seg(p,.60+i*.012,.66+i*.012);el.style.opacity=t;el.style.transform='translateY('+((1-t)*24)+'px)'});
 var s3=seg(p,.70,.80);t3s.style.opacity=s3;lines.forEach(function(l){l.style.transform='scaleX('+s3+')'});
}
```
