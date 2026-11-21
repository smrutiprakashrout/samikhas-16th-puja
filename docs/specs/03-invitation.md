# 03 — Invitation: "Reading light"
Owner: OpenCode (task S03) · Needs S02 · Scene height `260vh` (2.6 × stage height), scrubbed.
Visual reference: `docs/prototype/prototype-v3-invitation.html` (approved; its first section is only a stub for the hero — ignore it). If reference and spec differ, **this spec wins**. Do not read the prototype whole; open only the parts named here.

## 0. Experience
The ivory chapter slides up over the hero (soft shadow along its top edge). A label appears. The big sentence is faint (16% ink); as the guest scrolls, the words brighten one by one to full ink — a reading light moving along the line. The key phrase "sixteenth birthday puja" is italic deep saffron and a thin wood underline draws under each of its words. A divider draws, then the closing line brightens the same way. A very faint mandala watermark at the right edge turns slowly and drifts up a little slower than the text.

## 1. Content — add this block to `src/content.js` (replace any old `invitation` block; keep everything else)
```js
invitation: {
  label: 'With the blessings of the Almighty',
  before: 'We joyfully invite you to the ',
  key: 'sixteenth birthday puja',
  after: ' of our beloved granddaughter, Samikshya.',
  closing: 'Your gracious presence will make this occasion even more special.',
},
```
Build the sentence as `before + <span class="k">key</span> + after`; split into words (keep spaces as text nodes; words of `key` are `.w.k`).

## 2. Markup
```html
<section data-scene="03-invitation" class="inv" id="inv" style="height:260vh">   <!-- 2.6 × stage height -->
  <div class="stage" style="position:sticky;top:0;height:100svh">
    <div class="vig"></div>
    <svg class="mand" id="mand" viewBox="-100 -100 200 200" fill="none" stroke="#A8793F" stroke-width=".5" aria-hidden="true">
      <g class="s"><circle r="96"/><circle r="92" stroke-dasharray="1 3"/> 24 petals <path d="M0-88c5-8 5-16 0-24c-5 8-5 16 0 24Z" transform="rotate(k*15)"/> <circle r="76"/></g>
      <circle r="64" stroke-dasharray=".5 2.2"/> 12 dots r1.3 at radius 64 (fill #A8793F, no stroke) </svg>
    <p class="col label lab" id="lab">{label}</p>
    <p class="col big" id="big">…sentence…</p>
    <div class="col div" id="div"><i></i><b></b></div>
    <p class="col small" id="small">{closing}</p>
    <div class="grain"></div>
  </div>
</section>
```
Slide-over: `.inv{position:relative; z-index:40; margin-top:-50svh; background:var(--ivory); box-shadow:0 -24px 40px -10px rgba(110,76,40,.28)}`. Remove the S02 temporary ivory `.next` block. Add a temporary ivory `.tail` (60svh) after this section, marked "TEMP until family spec". The sentence is a single `<p>` (real text, selectable); the word spans must keep normal spaces between them so the text reads and copies correctly.

## 3. Layers
ivory ground (`--ivory` on `.stage`) → mandala watermark (z1) → vignette (z2) → text (z5) → paper grain (z30, same as other chapters, `/img/grain.svg`, opacity .06, multiply).
Vignette: `radial-gradient(120% 90% at 50% 45%, transparent 60%, rgba(244,228,204,.9) 100%)`.

## 4. Layout (390×844 reference; `--u = stageHeight/844`; text column = full width minus 24px gutters = 342px; left-aligned)
| Element | Position / style |
|---|---|
| Label | `top 196u`; `label` style (DM Sans 500, 11px, caps, .24em); colour `rgba(35,43,37,.74)`; starts at opacity 0 |
| Sentence | `top 236u`; Cormorant Garamond 500; `clamp(31px, 9vw, 38px)` / 1.2; `text-wrap:pretty`; words start at opacity .16 |
| Key phrase | italic, `--saffron-deep`; underline = `::after` on EACH key word: 2px `--wood`, `left:0; right:.25em; bottom:.06em`, `transform:scaleX(var(--k))`, origin left |
| Divider | `top 572u`; 84px wide × 8px; 1px `--wood` line (scaleX from the left) + 6px `--saffron-deep` diamond (rotated 45°, centred) with a 4px ivory ring |
| Closing line | `top 608u`; Cormorant italic 400, 20px / 1.42, `--ink`, `max-width:27ch`; words start at .16 |
| Mandala watermark | `right: −190u; top: 250u; width: 470u`; opacity .09; `will-change:transform` |
At 390×844 the sentence wraps to five lines (ends near y≈410) and the closing line sits at y≈608–660; nothing overlaps at 360×740 or 430×932.

## 5. Scroll scrub (progress p over the scene; `seg()` = in-out quad)
| What | Window / formula |
|---|---|
| Label | opacity `seg(p,.02,.12)` |
| Sentence word i of n | start `a = .10 + (i/n)·.46`; `t = seg(p, a, a+.07)`; opacity `.16 + .84·t` |
| Key-word underline | `--k = seg(p, a+.02, a+.10)` for each key word (its own `a`) |
| Divider line | `scaleX = seg(p,.60,.70)`; diamond `scale = seg(p,.66,.72)` |
| Closing word j of m | start `a = .68 + (j/m)·.20`; `t = seg(p,a,a+.06)`; opacity `.16 + .84·t` |
| Mandala | `transform: translateY(−70u·p px) rotate(p·40deg)` |
Hold: p .92–1 nothing changes. Only opacity/transform animate.

## 6. Reduced motion
Show the end state: all words at full ink, underlines drawn, divider drawn, no mandala rotation; slide-over still happens (it is plain scrolling).

## 7. Accessibility / edge cases
The sentence and closing line are real text in `<p>` elements; contrast of the faint start state is decorative only (end state ink on ivory 13:1). The mandala is `aria-hidden`. Wait for `document.fonts.ready` before splitting/measuring. Resize: recompute `--u`.

## 8. Acceptance checklist
- [ ] The ivory chapter slides over the hero with the soft top shadow; the hero is not cut off before the slide starts.
- [ ] At p≈0, .25, .5, .7, 1.0 the state matches the prototype (words progressively brighter; underline under the three key words; divider; closing line).
- [ ] Text selects and copies as a normal sentence (no missing spaces).
- [ ] No overlaps at 360×740, 390×844, 430×932.
- [ ] Mandala watermark visible but faint, never competes with the text.
- [ ] Reduced-motion path works; no console errors; `npm run build` passes.
- [ ] Screenshots: `qa/S03-p00.png`, `p25`, `p50`, `p70`, `p100` (390×844), `qa/S03-360.png`, `qa/S03-430.png` (p≈.7).

## 9. Reference CSS (port; swap to tokens; the `.pre` stub rules are prototype-only — skip them)
```css
:root{--ink:#232B25;--ink-deep:#181E1A;--ivory:#FBF3E4;--sand:#EBCEAE;--sand-lt:#F4E4CC;--sand-dp:#D8B684;--wood:#A8793F;--wood-dk:#6E4C28;--gold:#E0AF70;--saffron:#E48C35;--saffron-deep:#B25D17;
 --display:'Cormorant Garamond',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif;--u:1;color-scheme:light}
*{box-sizing:border-box;margin:0}html,body{height:100%}
body{background:var(--ink-deep);color:var(--ink);font-family:var(--sans);overflow:hidden;-webkit-font-smoothing:antialiased}
.phone{position:relative;width:min(100%,430px);height:100%;margin:0 auto;background:var(--sand);overflow:hidden}
.scroller{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none}.scroller::-webkit-scrollbar{display:none}
.label{font:500 11px/1.4 var(--sans);letter-spacing:.24em;text-transform:uppercase}
.stage{position:sticky;top:0;overflow:hidden}
.grain{position:absolute;inset:0;pointer-events:none;background:url("/img/grain.svg");opacity:.06;mix-blend-mode:multiply;z-index:30}
/* stub standing in for the hero */
.pre{position:relative;height:200vh}.pre .stage{background:var(--sand);display:grid;place-items:center}
.pre p{font:500 52px/1 var(--display);color:rgba(35,43,37,.5)}.pre small{display:block;text-align:center;margin-top:10px;color:rgba(35,43,37,.5)}
/* invitation */
.inv{position:relative;z-index:40;margin-top:-50svh;background:var(--ivory);box-shadow:0 -24px 40px -10px rgba(110,76,40,.28)}
.inv .stage{background:var(--ivory)}
.vig{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 45%,transparent 60%,rgba(244,228,204,.9) 100%);pointer-events:none;z-index:2}
.mand{position:absolute;right:calc(var(--u)*-190px);top:calc(var(--u)*250px);width:calc(var(--u)*470px);opacity:.09;pointer-events:none;z-index:1;will-change:transform}
.col{position:absolute;left:max(24px,env(safe-area-inset-left,0px));right:max(24px,env(safe-area-inset-right,0px));z-index:5}
.lab{top:calc(var(--u)*196px);color:rgba(35,43,37,.74);opacity:0}
.big{top:calc(var(--u)*236px);font:500 clamp(31px,9vw,38px)/1.2 var(--display);text-wrap:pretty}
.big .w,.small .w{opacity:.16;display:inline-block;position:relative}
.big .k{font-style:italic;color:var(--saffron-deep)}
.big .k::after{content:"";position:absolute;left:0;right:.25em;bottom:.06em;height:2px;background:var(--wood);transform:scaleX(var(--k,0));transform-origin:0 50%}
.div{top:calc(var(--u)*572px);width:84px;height:8px;display:flex;align-items:center}
.div i{position:absolute;left:0;right:0;top:50%;height:1px;background:var(--wood);transform:scaleX(0);transform-origin:0 50%}
.div b{position:absolute;left:50%;margin-left:-3px;width:6px;height:6px;rotate:45deg;background:var(--saffron-deep);transform:scale(0);box-shadow:0 0 0 4px var(--ivory)}
.small{top:calc(var(--u)*608px);font:italic 400 20px/1.42 var(--display);color:var(--ink);max-width:27ch}
.small .w{opacity:.16}
.next{position:relative;height:60vh;background:var(--ivory)}
```

## 10. Reference JS (word split and scrub; adapt to modules and `content`)
```js
// split words (keeps the .k span)
function split(el,cls){var out=[];[].slice.call(el.childNodes).forEach(function(n){var isK=n.nodeType===1&&n.classList.contains('k');var txt=n.textContent;
  var frag=document.createDocumentFragment();txt.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){frag.appendChild(document.createTextNode(w));return}var s=document.createElement('span');s.className='w'+(isK?' k':'');s.textContent=w;frag.appendChild(s);out.push(s)});
  el.replaceChild(frag,n)});return out}

var lab=$('#lab'),dv=$('#div'),dI=dv.querySelector('i'),dB=dv.querySelector('b'),mand=$('#mand');
function apply(p){
 lab.style.opacity=seg(p,.02,.12);
 var n=bw.length;bw.forEach(function(el,i){var a=.10+i/n*.46,t=seg(p,a,a+.07);el.style.opacity=.16+.84*t;if(el.classList.contains('k'))el.style.setProperty('--k',seg(p,a+.02,a+.1))});
 dI.style.transform='scaleX('+seg(p,.60,.70)+')';dB.style.transform='scale('+seg(p,.66,.72)+')';
 var m=sw.length;sw.forEach(function(el,i){var a=.68+i/m*.2,t=seg(p,a,a+.06);el.style.opacity=.16+.84*t});
 mand.style.transform='translateY('+(-70*U*p)+'px) rotate('+(p*40)+'deg)';
}
```
