# 01 — Chapter 1: "Ganesha on sand" (Ganesha + shloka)
Owner: OpenCode (task S01) · Needs G00b, T02 · Scene height `420vh` (4.2 × stage height), scrubbed.
Visual reference: `docs/prototype/prototype-v3-gate-ganesha.html` (the layout was approved as-is). If reference and spec differ, **this spec wins**. Asset: `assets/img/ganesha.webp` (800×1190, transparent, provided).

## 0. Experience
After the white dissolves into sand, marigold garlands drop in from the top and sway, the kicker and Sanskrit title fade up, Ganesha rises with a soft glow and a thin halo drawing around him, a lotus blooms under his mouse, gold dust drifts up and marigold petals fall. Scrolling shrinks and lifts him while the four shloka lines write in, a divider draws, and the English meaning appears word by word. At the end everything lifts away (the hero follows in a later spec).

## 1. Content (all from `src/content.js`)
`invocation.label` ("An Auspicious Beginning" → rendered as "An auspicious beginning" via the label style, uppercase), `invocation.sanskrit`, `shloka.lines[4]`, `shloka.meaning`. Image alt: "Lord Ganesha on his mouse". No other text.

## 2. Markup (exact structure)
```html
<section data-scene="01-ganesha" class="ch1" style="height:420vh">   <!-- ch1 height = 4.2 × stage height -->
  <div class="stage" style="position:sticky;top:0;height:100svh">    <!-- stage gets class "entered" on gate:opened -->
    <div class="glow"></div><div class="rays2" id="rays2"></div><div class="vig"></div><div class="grain"></div>
    <canvas id="motes" aria-hidden="true"></canvas>
    <div id="petals" aria-hidden="true"></div>
    <p class="t label kicker">…</p>
    <p class="t deva-t">…</p>
    <div class="hg" id="hg"><div class="hrise">
        {halo svg}  <svg class="lotus back">…</svg>  <div class="gshadow"></div>
        <img src="/img/ganesha.webp" alt="…">  <svg class="lotus front">…</svg>
    </div></div>
    <div class="shloka" id="shloka"><p>…</p>×4</div>
    <div class="divider" id="divider"><i></i><b></b></div>
    <p class="meaning" id="meaning">…</p>
    <div class="hint label" id="hint">Scroll<i></i></div>
    <svg class="garl" id="garl" viewBox="0 0 390 400" aria-hidden="true"> three drop groups: toran (#gT>#gTin), left strand #gL, right strand #gR </svg>
  </div>
</section>
```
Halo and lotus SVG generation: see section 7. Everything decorative is `aria-hidden`. The text elements are real HTML text.

## 3. Layers (back → front)
sand ground (`--sand`, set on `.stage`) → glow → rays2 → vignette (z29, behind grain) → dust canvas (z3) → back petals (z5) → text (kicker, title) → Ganesha group `.hg` (z10; halo and back-lotus inside at z −1, front-lotus z 2) → shloka/divider/meaning/hint (z12) → garlands (z20) → front petals (z25) → paper grain (z30, `multiply`, opacity .06, `url(/img/grain.svg)`).

## 4. Layout (390×844 reference; every vertical value is `calc(var(--u) * Npx)` where `--u = stageHeight/844`, set by JS on `.stage`)
| Element | Position / size |
|---|---|
| Kicker | `top 104u`, centred, `label` style, colour `rgba(35,43,37,.74)` |
| Title "॥ श्री गणेशाय नमः ॥" | `top 126u`, centred, Noto Serif Oriya 600, `clamp(21px, 24u, 26px)`, line-height 1.5, `--ink` |
| Ganesha group `.hg` | width `gw = min(270u, 0.69 × stageWidth)`, height `gh = gw × 1190/800`; `left:50%`, `margin-left:-gw/2`; `top 210u` at start; `transform-origin:50% 0`. Set CSS vars `--gw`, `--gh` in JS on every resize. |
| Halo | inside `.hg`: `left:50%; top:30%; width:158%; translate:-50% -50%` |
| Lotus (back and front svgs) | `left:-10%; width:120%`; `top: calc(var(--gh) − var(--gw)*1.2*.613*.478)` so the lotus pivot sits at the bottom edge of the image |
| Ganesha shadow `.gshadow` | `left 8%, right 8%, bottom −3%, height 7%`, radial `rgba(110,76,40,.34)`, blur 4px |
| Shloka | `top 468u`, 4 lines, Noto Serif Oriya 600, `clamp(19px, 22u, 25px)` / 1.5, row gap `6u`, centred, `--ink` |
| Divider | `top 646u`, 120px wide centred; 1px `--wood` line + 6px `--saffron-deep` diamond (rotated 45°) with a 4px sand ring around it |
| Meaning | `top 668u`, width `min(100% − 48px, 290px)` centred, Cormorant Garamond italic 400, 19px / 1.42, `rgba(35,43,37,.8)`, `text-wrap:balance` |
| Hint "Scroll" | `bottom 30u`, `label` style, ink .7, with a 1×26px `--wood→transparent` line; visible only before scrolling (fades out over p 0–.12) |
| Garlands svg | `left 0; top 0; width 100%; height auto`, viewBox 390×400 |
End-state check at 390×844: Ganesha group occupies y≈176–417 (scaled .6), shloka y≈468–618, divider y 646, meaning y 668–750, no overlaps. At 360×740 (`u≈.877`) the same proportions hold.

## 5. Entry animation (time-based, starts when `.entered` is added; CSS transitions, values exactly as in the reference CSS)
| Delay | Element | Effect |
|---|---|---|
| 0 | garlands | each drop group `translateY(−130% → 0)` over 1.8s ease-out; delays 0 / .15 / .3s (toran, left strand, right strand); then sway forever: toran ±.35° 7.5s, left ±1.2° 5.5s, right ±1.2° 6.8s (reverse), `ease-in-out`, `rotate` property, transform-origin at each anchor (toran 195px -4px, left 26px -4px, right 364px -4px) |
| .4 | glow | opacity 0→1 over 2.2s |
| .5 | kicker | fade + `translateY(14px→0)` 1.2s / 1.4s ease-out |
| .8 | title | same |
| 1.0 | rays2 | opacity 0→1 over 2.4s |
| 1.1 | `.hrise` (halo, lotus, Ganesha) | opacity 0→1, `translateY(40px)+scale(.97)` → none; 1.6s / 1.8s ease-out |
| 1.2 | halo line | draws via stroke-dashoffset 1→0 over 2.4s |
| 1.5 + d×8ms | lotus petals | each petal scales 0→1 around its pivot, 1.4s ease-out, `--d` = angular distance from the centre petal (staggers outward) |
| 1.6 | halo rings, dust canvas | fade in 2s |
| now | petals | falling animation un-pauses |

## 6. Scroll scrub (progress p = 0..1 over the scene; use `ctx.scrub`; write transforms/opacity directly; easing = `seg()` in-out quad)
`e1 = seg(p,.08,.40)`, `ex = seg(p,.86,1)`
| What | Window / formula |
|---|---|
| Ganesha group | `translateY = −34u·e1 − 60·ex` px; `scale = 1 − .4·e1`; `opacity = 1 − ex` |
| Shloka line i (0–3) | window `[.22 + .085i, .32 + .085i]`: `clip-path: inset(0 (1−t)·100% 0 0)`, `translateY((1−t)·8px − 60·ex)`, opacity 0 until t>0 |
| Divider line | `scaleX = seg(p,.54,.66)`; diamond `scale = seg(p,.60,.66)`; both lift with `ex` |
| Meaning words | word i of n: window `[.62 + .10·i/n, +.035]`: opacity 0→1, `translateY(8px→0)`; the block lifts and fades with `ex` |
| Hint | opacity `1 − p/.12` for p<.12 else 0 (only after `.entered`) |
| Garlands | `translateY = −30·e1 − 130·ex` px |
| rays2 | `rotate(p × 40deg)` |
| Kicker + title | `translate 0 −60·ex px`, opacity `1 − ex` |
Hold: p .74–.86 nothing moves except ambient loops. Until the hero spec exists, add a temporary `.tail` sand block of 30svh after the section.

## 7. Generated graphics (port these exactly; they are in the reference file)
- **Halo svg** (`viewBox -100 -100 200 200`): full circle path `#haloDraw` (r97, stroke `--gold` .8, `pathLength=1`); group `.spin` (rotates 100s linear infinite): circle r92 dashed `1 3`, 24 petals `M0-88c5-8 5-16 0-24c-5 8-5 16 0 24Z` rotated every 15°, circle r76; group `.spin.r` (reverse, 70s): dotted circle r64 + 12 dots r1.3. Stroke `--wood`, widths .45, opacities .4–.8.
- **Lotus** (viewBox `0 -64 300 184`, petal pivot at (150,24)): petal path `M0 0 C w L*.3, w*.8 L*.8, 0 L C -w*.8 L*.8, -w L*.3, 0 0 Z` inside `<g transform="translate(150 24) rotate(a)">`, the path itself has class `lp`. BACK svg: row A angles `96+9k` (k 0–18), L 108, w 21, fill `#E48C35`, stroke `#B25D17`; row B angles `104+11k` (k 0–14), L 86, w 17, fill `#F5B74E`, stroke `#B25D17`. FRONT svg: angles `[98,108,118,242,252,262]`, L 52, w 12, fill `#FBF3E4`, stroke `#E48C35`. Stroke width .8. `--d = |a − 180|`.
- **Garlands** (viewBox 390×400): toran = quadratic path `M-6 -4 Q195 140 396 -4`, stroke `--wood` 1.2, 25 blossoms placed at t = i/24 (size cycle 20/15/24/17 → radius `s·.5+3`) with sage leaves (`#AAA06D`, stroke `#5D695D` .5) at every second point; strands at x=26 (length 236) and x=364 (length 320): a gently curved string, a blossom every ~21px (radius 9.5), leaves every second, ending in a larger blossom (r12) with three short tassel strings in `--saffron` with `--marigold` dots. Blossom = 10 ellipses around a centre (rx .3r, ry .5r), colours picked 50% marigold `#F5B74E/#FFD58A`, 35% saffron `#E48C35/#F5B74E`, 15% ivory `#FBF3E4/#F5B74E`; centre dot `#B25D17`. Use the seeded random (`seed=7`, Park–Miller) so the garland looks identical on every load. Functions `blossom, leaf, pick, strand` in the reference JS below.
- **Petals** (14 DOM nodes in `#petals`): 4 "front" (z25, size 16–20px, blur 1.6px, 19–24s) and 10 "back" (z5, size 9–16px, 26–36s). Shape `border-radius:80% 0 80% 0`, height 1.25×width, colours cycling `#F5B74E #E48C35 #FBF3E4 #F5B74E #E48C35`, opacity .9; keyframes `fall` (5 stops, ±14px sway, rotate to 520°) with negative delays 0–30s so they start spread out; animation paused until `.entered`, and **paused while the stage is off-screen** (IntersectionObserver).
- **Dust** (`#motes` canvas, DPR ≤ 2): 38 motes, r .5–2, rise .1–.4 px/frame, sway ±7px, alpha .2–.7, colours 2/3 `--marigold`, 1/3 white. Pause the rAF loop when off-screen.
- **Glow**: `radial-gradient(circle, rgba(255,249,236,.95) 0, rgba(255,226,166,.6) 24%, rgba(245,183,78,.22) 46%, transparent 66%)`, width 130%, centred at `top 410u`. **rays2**: conic gradient of 14 irregular rays in `rgba(255,249,236,.13)`, width 210%, centred at `top 410u`, masked by `radial-gradient(circle,#000 0,transparent 55%)`. **Vignette**: `radial-gradient(120% 90% at 50% 42%, transparent 55%, rgba(216,182,132,.55) 100%)`.

## 8. Reduced motion
No sway, petals, dust, rotation, shine. Show the end state of the entry animation (garlands in place, Ganesha visible) with a 300ms crossfade. Scrub is replaced by the final layout (shloka and meaning fully visible, Ganesha scaled to .6); no scroll effects.

## 9. Edge cases
Stage height 640–932: all vertical values scale with `u`; Ganesha width capped at 69% of the stage width (`gw`). Fonts not loaded: wait for `document.fonts.ready` before measuring. `?skipgate=1`: add `.entered` immediately. Resize: recompute `--u`, `--gw`, `--gh`, canvas sizes, and re-apply `frame()`.

## 10. Acceptance checklist
- [ ] At 390×844 the idle state, p≈.12, .3, .55, .78 and .97 match the prototype's layout (same positions and sizes).
- [ ] No text overlaps at 360×740, 390×844, 430×932; shloka and meaning fully readable at the end state.
- [ ] Entry animation sequence plays in the order of the table; the sand ground and paper grain are visible (no flat colour); vignette present.
- [ ] Garlands drop in, then sway; petals fall; dust rises; halo draws; lotus blooms petal by petal.
- [ ] Only transform/opacity/clip-path animate; petals and dust pause off-screen; 60fps feel.
- [ ] Text is real and selectable; image has alt; decorative layers are `aria-hidden`.
- [ ] Reduced-motion path works. No console errors. Build passes.
- [ ] Screenshots: `qa/S01-p00.png` (≈4s after the gate), `qa/S01-p12.png`, `qa/S01-p30.png`, `qa/S01-p55.png`, `qa/S01-p78.png`, `qa/S01-p97.png`.

## 11. Reference CSS (port; swap to tokens; `{{GRAIN}}` already replaced by /img/grain.svg)
```css
/* ===== CHAPTER 1 ===== */
.ch1{position:relative}
.stage{position:sticky;top:0;overflow:hidden;background:var(--sand)}
.grain,.vig{position:absolute;inset:0;pointer-events:none}
.grain{background:url("/img/grain.svg");opacity:.06;mix-blend-mode:multiply;z-index:30}
.vig{background:radial-gradient(120% 90% at 50% 42%,transparent 55%,rgba(216,182,132,.55) 100%);z-index:29}
.glow{position:absolute;left:50%;top:calc(var(--u)*410px);width:130%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;opacity:0;transition:opacity 2.2s ease .4s;
  background:radial-gradient(circle,rgba(255,249,236,.95) 0,rgba(255,226,166,.6) 24%,rgba(245,183,78,.22) 46%,transparent 66%)}
.entered .glow{opacity:1}
.rays2{position:absolute;left:50%;top:calc(var(--u)*410px);width:210%;aspect-ratio:1;translate:-50% -50%;opacity:.0;transition:opacity 2.4s ease 1s;pointer-events:none;
  -webkit-mask:radial-gradient(circle,#000 0,transparent 55%);mask:radial-gradient(circle,#000 0,transparent 55%)}
.entered .rays2{opacity:1}
#motes{position:absolute;inset:0;width:100%;height:100%;z-index:3;opacity:0;transition:opacity 2s ease 1.6s;pointer-events:none}
.entered #motes{opacity:1}
.t{position:absolute;left:0;right:0;text-align:center;opacity:0;transform:translateY(14px);transition:opacity 1.2s var(--ease-out),transform 1.4s var(--ease-out)}
.entered .t{opacity:1;transform:none}
.kicker{top:calc(var(--u)*104px);color:rgba(35,43,37,.74);transition-delay:.5s}
.deva-t{top:calc(var(--u)*126px);font:600 clamp(21px,calc(var(--u)*24px),26px)/1.5 var(--odia);color:var(--ink);transition-delay:.8s}
.hg{position:absolute;left:50%;top:calc(var(--u)*210px);width:var(--gw);height:var(--gh);margin-left:calc(var(--gw)/-2);transform-origin:50% 0;z-index:10;will-change:transform}
.hrise{position:absolute;inset:0;opacity:0;transform:translateY(40px) scale(.97);transition:opacity 1.6s var(--ease-out) 1.1s,transform 1.8s var(--ease-out) 1.1s}
.entered .hrise{opacity:1;transform:none}
.hg img{position:absolute;inset:0;width:100%;height:100%;display:block;filter:drop-shadow(0 10px 14px rgba(110,76,40,.18))}
.gshadow{position:absolute;left:8%;right:8%;bottom:-3%;height:7%;border-radius:50%;background:radial-gradient(ellipse,rgba(110,76,40,.34),transparent 70%);filter:blur(4px)}
.halo{position:absolute;left:50%;top:30%;width:158%;translate:-50% -50%;overflow:visible;pointer-events:none;z-index:-1}
.halo .spin{transform-origin:0 0;animation:spin2 100s linear infinite}.halo .r{animation-direction:reverse;animation-duration:70s}
@keyframes spin2{to{transform:rotate(360deg)}}
#haloDraw{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 2.4s ease 1.2s}
.entered #haloDraw{stroke-dashoffset:0}
.halo .spin{opacity:0;transition:opacity 2s ease 1.6s}.entered .halo .spin{opacity:1}
.lotus{position:absolute;left:-10%;width:120%;top:calc(var(--gh)*1.0 - var(--gw)*1.2*.613*.478);overflow:visible;pointer-events:none}
.lotus.back{z-index:-1}.lotus.front{z-index:2}
.lp{transform:scale(0);transform-origin:0 0;transition:transform 1.4s var(--ease-out);transition-delay:calc(1.5s + var(--d)*8ms)}
.entered .lp{transform:scale(1)}
.shloka{position:absolute;left:0;right:0;top:calc(var(--u)*468px);text-align:center;display:grid;gap:calc(var(--u)*6px);z-index:12}
.shloka p{font:600 clamp(19px,calc(var(--u)*22px),25px)/1.5 var(--odia);color:var(--ink);clip-path:inset(0 100% 0 0);opacity:0}
.divider{position:absolute;left:50%;top:calc(var(--u)*646px);width:120px;margin-left:-60px;height:8px;display:flex;align-items:center;justify-content:center;z-index:12}
.divider i{position:absolute;left:0;right:0;top:50%;height:1px;background:var(--wood);transform:scaleX(0)}
.divider b{width:6px;height:6px;rotate:45deg;background:var(--saffron-deep);transform:scale(0);position:relative;z-index:1;box-shadow:0 0 0 4px var(--sand)}
.meaning{position:absolute;left:50%;top:calc(var(--u)*668px);width:min(calc(100% - 48px),290px);margin-left:calc(min(calc(100% - 48px),290px)/-2);text-align:center;font:italic 400 19px/1.42 var(--display);color:rgba(35,43,37,.8);z-index:12;text-wrap:balance}
.meaning .w{display:inline-block;opacity:0;transform:translateY(8px)}
.hint{position:absolute;left:0;right:0;bottom:calc(var(--u)*30px);text-align:center;color:rgba(35,43,37,.7);opacity:0;transition:opacity .5s;z-index:12}
.hint i{display:block;margin:8px auto 0;width:1px;height:26px;background:linear-gradient(var(--wood),transparent)}
.garl{position:absolute;left:0;top:0;width:100%;height:auto;z-index:20;overflow:visible;pointer-events:none;will-change:transform}
.garl .drop{transform:translateY(-130%);transition:transform 1.8s var(--ease-out)}
.entered .garl .drop{transform:none}
.entered .garl .d2{transition-delay:.15s}.entered .garl .d3{transition-delay:.3s}
.sw1{transform-origin:26px -4px;animation:sw 5.5s ease-in-out infinite}
.sw2{transform-origin:364px -4px;animation:sw 6.8s ease-in-out infinite reverse}
.sw0{transform-origin:195px -4px;animation:sw0 7.5s ease-in-out infinite}
@keyframes sw{0%,100%{rotate:-1.2deg}50%{rotate:1.2deg}}
@keyframes sw0{0%,100%{rotate:-.35deg}50%{rotate:.35deg}}
.pt{position:absolute;top:0;left:var(--x);width:var(--s);height:calc(var(--s)*1.25);border-radius:80% 0 80% 0;background:var(--c);opacity:.9;filter:blur(var(--b));z-index:var(--z);
  animation:fall var(--t) linear var(--dl) infinite;animation-play-state:paused;will-change:transform}
.entered .pt{animation-play-state:running}
@keyframes fall{0%{transform:translate3d(0,-8vh,0) rotate(0)}25%{transform:translate3d(14px,26vh,0) rotate(120deg)}50%{transform:translate3d(-12px,52vh,0) rotate(250deg)}75%{transform:translate3d(12px,80vh,0) rotate(380deg)}100%{transform:translate3d(0,110vh,0) rotate(520deg)}}
.tail{height:30svh;background:var(--sand)}
.replay{position:absolute;z-index:60;left:max(14px,env(safe-area-inset-left,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));min-height:40px;padding:0 14px;border-radius:99px;border:1px solid rgba(110,76,40,.5);background:rgba(244,228,204,.85);color:var(--wood-dk);font:500 11px var(--sans);letter-spacing:.16em;text-transform:uppercase;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .6s}
.replay.on{opacity:1;pointer-events:auto}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important;transition-delay:0s!important;animation:none!important}}
```

## 12. Reference JS (garlands + scrub; adapt to the section contract and `content`)
```js
/* blossoms */
var seed=7;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
function blossom(x,y,r,c1,c2,rot){var g='<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+rot+')">';
  for(var i=0;i<10;i++){g+='<ellipse cx="0" cy="'+(-r*.52)+'" rx="'+(r*.3)+'" ry="'+(r*.5)+'" fill="'+c1+'" stroke="#B25D17" stroke-opacity=".45" stroke-width=".5" transform="rotate('+(i*36)+')"/>'}
  g+='<circle r="'+(r*.42)+'" fill="'+c2+'"/><circle r="'+(r*.16)+'" fill="#B25D17" fill-opacity=".75"/></g>';return g}
function leaf(x,y,r,rot){return '<path d="M0 0C'+r*.5+' '+-r*.3+' '+r*.9+' '+-r*.1+' '+r+' 0C'+r*.9+' '+r*.3+' '+r*.4+' '+r*.4+' 0 0Z" transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+rot+')" fill="#AAA06D" stroke="#5D695D" stroke-opacity=".5" stroke-width=".5"/>'}
function pick(){var r=rnd();return r<.5?['#F5B74E','#FFD58A']:r<.85?['#E48C35','#F5B74E']:['#FBF3E4','#F5B74E']}
// toran swag: quad bezier P0(-6,-4) C(195,140) P2(396,-4)
var gT='<path d="M-6 -4Q195 140 396 -4" fill="none" stroke="#A8793F" stroke-width="1.2"/>',N=24;
for(var i=0;i<=N;i++){var t=i/N,x=(1-t)*(1-t)*-6+2*t*(1-t)*195+t*t*396,y=(1-t)*(1-t)*-4+2*t*(1-t)*140+t*t*-4;
  var dx=2*(1-t)*(195+6)+2*t*(396-195),dy=2*(1-t)*(140+4)+2*t*(-4-140),ang=Math.atan2(dy,dx)*180/Math.PI;
  var s=[20,15,24,17][i%4];var cc=pick();
  if(i%2===0){gT+=leaf(x,y+3,15,ang+80+(i%4)*10);gT+=leaf(x,y+3,15,ang-100)}
  gT+=blossom(x,y+(i%2?4:0),s*.5+3,cc[0],cc[1],Math.round(rnd()*36))}
$('#gTin').innerHTML=gT;
function strand(x0,len,mid){var s='<path d="M'+x0+' -4C'+(x0+mid)+' '+len*.3+' '+(x0-mid)+' '+len*.7+' '+x0+' '+len+'" fill="none" stroke="#A8793F" stroke-width="1.2"/>',n=Math.floor(len/21);
  for(var i=1;i<=n;i++){var t=i/(n+1),y=-4+(len+4)*t,x=x0+mid*3*t*(1-t)*(2*t-1)*-2.4;var cc=pick();if(i%2===0)s+=leaf(x,y,13,i%4===0?60:-120);s+=blossom(x,y,9.5,cc[0],cc[1],Math.round(rnd()*36))}
  var e=x0;for(var k=-1;k<=1;k++){s+='<path d="M'+e+' '+len+'L'+(e+k*5)+' '+(len+22)+'" stroke="#E48C35" stroke-width="1.6" stroke-linecap="round"/><circle cx="'+(e+k*5)+'" cy="'+(len+23)+'" r="2.4" fill="#F5B74E"/>'}
  s+=blossom(x0,len,12,'#E48C35','#F5B74E',10);return s}
$('#gL').innerHTML=strand(26,236,6);$('#gR').innerHTML=strand(364,320,-6);

/* falling petals */
var pc=['#F5B74E','#E48C35','#FBF3E4','#F5B74E','#E48C35'],ph='';
for(var i=0;i<14;i++){var front=i<4,s=front?16+Math.round(rnd()*4):9+Math.round(rnd()*7);
  ph+='<div class="pt" style="--x:'+(4+rnd()*92).toFixed(0)+'%;--s:'+s+'px;--t:'+(front?19+rnd()*5:26+rnd()*10).toFixed(1)+'s;--dl:-'+(rnd()*30).toFixed(1)+'s;--c:'+pc[i%5]+';--b:'+(front?'1.6px':'0px')+';--z:'+(front?25:5)+'"></div>'}
$('#petals').innerHTML=ph;

/* scrub */
var shl=[].slice.call(document.querySelectorAll('#shloka p')),dv=$('#divider'),dvI=dv.querySelector('i'),dvB=dv.querySelector('b'),meaning=$('#meaning'),hint=$('#hint'),garl=$('#garl'),r2=$('#rays2');
var words=meaning.textContent.split(' ');meaning.innerHTML=words.map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');var ws=[].slice.call(meaning.querySelectorAll('.w'));
function apply(p){
  var e1=seg(p,.08,.40),s=1-.4*e1;
  var ex=seg(p,.86,1);
  hg.style.transform='translateY('+((-34*U)*e1-60*ex)+'px) scale('+s+')';hg.style.opacity=1-ex;
  shl.forEach(function(el,i){var t=seg(p,.22+i*.085,.32+i*.085);el.style.clipPath='inset(0 '+((1-t)*100)+'% 0 0)';el.style.opacity=t>0?1:0;el.style.transform='translateY('+((1-t)*8-60*ex)+'px)'});
  var d=seg(p,.54,.66);dvI.style.transform='scaleX('+d+')';dvB.style.transform='scale('+seg(p,.6,.66)+')';dv.style.opacity=1-ex;dv.style.transform='translateY('+(-60*ex)+'px)';
  ws.forEach(function(el,i){var a=.62+i/ws.length*.1,t=seg(p,a,a+.035);el.style.opacity=t;el.style.transform='translateY('+((1-t)*8)+'px)'});
  meaning.style.opacity=1-ex;meaning.style.transform='translateY('+(-60*ex)+'px)';
  hint.style.opacity=(started&&p<.12)?1-p/.12:0;
  garl.style.transform='translateY('+(-30*e1-130*ex)+'px)';
  r2.style.transform='rotate('+(p*40)+'deg)';
  document.querySelectorAll('.pt').forEach(function(){});
  stage.querySelectorAll('.kicker,.deva-t').forEach(function(el){el.style.translate='0 '+(-60*ex)+'px';el.style.opacity=started?String(1-ex):''});
}
function frame(){var mx2=ch1.offsetHeight-sc.clientHeight;apply(clamp(sc.scrollTop/mx2,0,1))}
var tick=false;sc.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(function(){tick=false;frame()})}},{passive:true});frame();
```
