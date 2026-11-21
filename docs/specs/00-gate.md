# 00 — Gate v2: "The sandalwood doors"  (supersedes the previous 00-gate.md)
Owner: OpenCode (task G00b) · The gate already exists in dark green from G00; this task RESTYLES it.
Visual reference (look + timing): `docs/prototype/prototype-v3-gate-ganesha.html` (open it next to `assets/img/ganesha.webp`, tap the gate). If the reference and this spec differ, **this spec wins**.

## 0. Experience
Warm carved sandalwood doors with a gold "16th" split across the seam. A light glows through the lattice window and a thin line of light pulses down the seam; gold and white dust rises. Tap → the doors settle like a latch releasing, then swing away in 3D. Real-feeling bloom light grows from the seam (near-white core, warm edges, uneven rays, overexposed door edges), expands to a full warm white, and the white dissolves into the sand-coloured Ganesha chapter. Music starts on the tap.

## 1. Content
Unchanged: `content.gate` (`kicker`, `cta`, `ariaLabel`). No other text on the gate.

## 2. Files to change / add
- REPLACE `src/sections/00-gate/door.svg` with the provided new file. It contains the token `{{p}}` used as an id prefix: when inlining, build two copies, `door.replaceAll('{{p}}','gl')` for the left door and `'gr'` for the right door (so ids are unique and the `.back` backlight animates in both).
- ADD `assets/img/grain.svg` (provided).
- REPLACE `src/styles/tokens.css` with the provided one (adds sand tones, wood, flood). Keep `#page{background:var(--sand)}` in base.css (change from `--ink`); `html,body` background stays `--ink-deep` (visible only outside the column on desktop).
- UPDATE `src/sections/00-gate/index.js` + `style.css` as below. DELETE `src/core/stars.js` and the temporary dark backdrop (`backdrop.js`) — chapter 1 (task S01) provides the ground. Until S01 exists, keep a temporary `<div class="stage" style="background:var(--sand);height:100svh">` behind the gate with the class `entered` toggled at handoff, so the transition can be checked.

## 3. Markup (exact)
```html
<div class="gate" id="gate" role="button" tabindex="0" aria-label="{gate.ariaLabel}">
  <div class="light"><div class="rays" id="rays"></div><div class="core"></div></div>
  <div class="door door-l"><div class="face">{doorSvg with prefix gl}<div class="dt"><span>16<sup>th</sup></span></div></div></div>
  <div class="door door-r"><div class="face flip">{doorSvg with prefix gr}<div class="dt"><span>16<sup>th</sup></span></div></div></div>
  <canvas id="embers" aria-hidden="true"></canvas>
  <canvas id="specks" aria-hidden="true"></canvas>
  <div class="streak"></div><div class="bloom"></div>
  <div class="seam"></div><div class="shock"></div>
  <div class="gate-ui top"><p class="label">{gate.kicker}</p></div>
  <div class="gate-ui bot"><span class="tap"><span class="label">{gate.cta}</span><i></i></span></div>
  <div class="flood"></div>
</div>
```
Each door svg gets `class="art" viewBox="0 0 195 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true"` (the root attributes in door.svg may be replaced when inlining). The right door is the same art with `.flip .art{transform:scaleX(-1)}`.
Gate position: `position:fixed;top:0;bottom:0;left:50%;width:min(100%,430px);transform:translateX(-50%);z-index:50;overflow:hidden;perspective:1100px` (if the wrapper transform breaks the 3D, centre with margins instead).

## 4. Colour and geometry (390×844 reference)
| Element | Exact value |
|---|---|
| Gate ground | `--sand` |
| Door face | horizontal gradient, hinge edge → seam: `--sand-dp` → `--sand` at 55% → `--sand-lt` (the right door is mirrored). Vertical wood grain `repeating-linear-gradient(90deg, rgba(110,76,40,.05) 0 1px, transparent 1px 6px)`. Grain overlay `url(/img/grain.svg)` at .09, `mix-blend-mode:multiply`. Seam-side inner highlight `inset ∓26px 0 40px -22px rgba(255,246,224,.9)`. |
| Carving | every carved line is a 0.7px `--wood-dk` stroke plus an ivory copy 0.9px lower (already baked into door.svg). Do not restyle. |
| Metalwork | gold gradient on studs (x=181 every 22px), 3 hinge plates per outer edge (y=120/396/694), pull-ring plate (167,640), mandala outer ring and outer petals. |
| Lattice window | `--wood-dk` recess with gold lattice; a warm radial backlight inside it animates opacity .3 ↔ .6 every 3.2s (`.art .back`). |
| Art layout | same as before: window y46–214, band y226–234, mandala panel y248–596 with the mandala centred on the seam at y=422 (r=150), lower panel y612–820 with 5 niches and diamond row. |
| Numeral "16th" | Cormorant Garamond 500, `min(34vw,148px)`, centred on seam at 50% height; 200%-wide box per door. Gradient `linear-gradient(105deg,#B25D17 0,#E48C35 30%,#FFD9A0 42%,#E48C35 54%,#B25D17 100%)`, size 250% 100%, shine 5s. Emboss: `drop-shadow(0 1.5px 0 rgba(255,249,236,.85)) drop-shadow(0 8px 10px rgba(110,76,40,.3))`. |
| Seam | 3px wide, `linear-gradient(#FFF6E0,#FFE2A6 50%,#FFF6E0)`, glow `0 0 14px 3px rgba(255,226,166,.9), 0 0 40px 10px rgba(245,183,78,.45)`, pulse 3.2s. |
| Labels | `label` style, colour `rgba(35,43,37,.78)`; top label `top:max(28px,safe-top)`; CTA `bottom:max(30px,safe-bottom)` with a 1×34px `--wood→transparent` line and 2s drip. |
| Embers | 34 particles, alternate `--marigold` and white, radius .5–2, rise .12–.47 px/frame, sway ±8px, alpha .3–.8. |
| Tilt | `pointermove` sets `perspective-origin` ±15% x, ±10% y. |
Literal colours allowed in the gate: `#FFF6E0 #FFE2A6 #FFD9A0 #FFF9EC #FFFFFF #F6DC9C #8E6221 #8A6234` (+ the rgba values in the reference CSS).

## 5. Open sequence (CSS classes + transitions exactly as in the reference CSS; times from the tap)
| Time (ms) | What |
|---|---|
| 0 | add `.latch` (doors nudge 1.5px inward, .4s); `html.locked`; `audio.start()`; `audio.sfx('bell')` |
| 120 (= T0) | remove `.latch`, add `.opening`; start the specks (26 white specks fly outward from the seam for 3.2s) |
| T0+0–500 | seam widens 3→12px; UI fades (.4s); embers fade (.6s) |
| T0+300–1300 | `.light` opacity 0→1 (linear) |
| T0+500–2600 | `.core` scale .08→1.25 (`--ease-light`); doors `translateX(∓5%) rotateY(±88deg)`, filter `brightness(.68) saturate(.9)` (`--ease-door`); `.streak` scaleX .15→1.6 and opacity→1; `.bloom` scale .3→1.5 and opacity→1; lattice backlight to full |
| T0+550–2350 | `.shock` ring scale .2→16 |
| T0+1700–2800 | `.flood` (`--flood` #FFF9EC) opacity 0→1 (`--ease-flood`) |
| T0+2900 | HANDOFF: add `.clear` (hide doors, light, seam, streak, bloom, UI; gate bg transparent); add `.entered` to chapter 1; dispatch `gate:opened`; remove `html.locked`; show mute button; focus `#scenes` |
| T0+2900–4800 | flood opacity 1→0 (ease, 1.9s) — the white dissolves into sand |
| T0+4880 | remove the gate element |
`.rays` is an irregular conic gradient built in JS (14 rays, see the `rays()` function in the reference); it rotates 50s linear infinite. Second tap during the sequence does nothing (`opened` flag).

## 6. Reduced motion
No embers, tilt, shine, pulses, rays rotation, specks. On tap: audio.start(), crossfade the gate to opacity 0 in 400ms, handoff immediately, remove after 500ms.

## 7. Accessibility & edge cases
Single `role="button"` with `tabindex="0"`; Enter/Space opens; focus ring 2px `--marigold`, offset 3px. Wait for `document.fonts.ready` (max 1500ms) before showing the gate. Heights 640–932: art uses `slice`, numeral stays at 50%. iOS Safari: `-webkit-` prefixes where needed; `will-change:transform` on the doors only during the sequence. Resize during the gate: resize canvases, do not restart. `?skipgate=1`: no gate, `.entered` set, fire `gate:opened`.

## 8. Acceptance checklist
- [ ] Idle at 390×844 matches the prototype (carving, mandala joined at the seam, "16th" centred, lattice glow).
- [ ] No dark green anywhere on or behind the gate; ground is sand.
- [ ] Latch beat, then the doors rotate (3D) and slide away; bloom light grows from the seam with a near-white core and warm edges, streak, rays, overexposed edges.
- [ ] Whole screen becomes warm white at about T0+2.8s, then dissolves into sand with grain, with no dark or blank frame.
- [ ] Scroll locked until handoff, free after. Second tap ignored. Audio starts or skips silently.
- [ ] 60fps feel: only transform/opacity/filter; no layout shifts. Checked at 360×740, 390×844, 430×932 and desktop (column ≤ 430px).
- [ ] Reduced-motion path works; no console errors with bell/bgm missing.
- [ ] Screenshots: `qa/G00b-idle.png`, `qa/G00b-opening.png` (≈1.6s), `qa/G00b-flood.png` (≈2.9s), `qa/G00b-sand.png` (≈5.5s).

## 9. Reference CSS (port it; swap literals to tokens where a token exists)
```css
/* ===== GATE ===== */
.gate{position:absolute;inset:0;z-index:50;perspective:1100px;background:var(--sand);overflow:hidden;cursor:pointer}
.gate.done{display:none}
.light{position:absolute;inset:0;opacity:0;transition:opacity 1s linear .3s}
.rays{position:absolute;left:50%;top:50%;width:260%;aspect-ratio:1;translate:-50% -50%;opacity:.9;
  -webkit-mask:radial-gradient(circle,#000 0,transparent 60%);mask:radial-gradient(circle,#000 0,transparent 60%);animation:spin 50s linear infinite}
.core{position:absolute;left:50%;top:50%;width:150%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;transform:scale(.08);
  background:radial-gradient(circle,#fff 0,#FFF6E0 14%,#FFE2A6 30%,#F5B74E 52%,rgba(228,140,53,.35) 70%,transparent 82%);transition:transform 2.1s cubic-bezier(.5,0,.2,1) .5s}
.gate.opening .light{opacity:1}.gate.opening .core{transform:scale(1.25)}
.streak{position:absolute;left:50%;top:0;bottom:0;width:30%;translate:-50% 0;transform:scaleX(.15);opacity:0;z-index:8;pointer-events:none;mix-blend-mode:screen;
  background:radial-gradient(ellipse at center,rgba(255,246,224,.95) 0,rgba(255,226,166,.5) 35%,transparent 70%);transition:transform 2s var(--ease-out) .4s,opacity 1.2s ease .4s}
.gate.opening .streak{transform:scaleX(1.6);opacity:1}
.bloom{position:absolute;inset:0;z-index:8;pointer-events:none;mix-blend-mode:screen;opacity:0;transform:scale(.3);
  background:radial-gradient(circle at 50% 50%,#fff 0,rgba(255,246,224,.85) 12%,rgba(255,226,166,.45) 32%,rgba(245,183,78,.18) 55%,transparent 72%);transition:opacity 1.4s ease .6s,transform 2.2s cubic-bezier(.5,0,.2,1) .5s}
.gate.opening .bloom{opacity:1;transform:scale(1.5)}
.seam{position:absolute;left:50%;top:0;bottom:0;width:3px;translate:-50% 0;z-index:6;background:linear-gradient(#FFF6E0,#FFE2A6 50%,#FFF6E0);
  box-shadow:0 0 14px 3px rgba(255,226,166,.9),0 0 40px 10px rgba(245,183,78,.45);opacity:.8;animation:pulse 3.2s ease-in-out infinite;transition:width .5s ease .05s}
.gate.opening .seam{width:12px;animation:none;opacity:1}
@keyframes pulse{50%{opacity:1;box-shadow:0 0 18px 5px rgba(255,226,166,1),0 0 50px 14px rgba(245,183,78,.6)}}
.door{position:absolute;top:0;bottom:0;width:50%;z-index:5;transform-style:preserve-3d;
  transition:transform .4s ease,filter 2.1s ease .5s}
.door-l{left:0;transform-origin:0 50%}.door-r{right:0;transform-origin:100% 50%}
.gate.latch .door-l{transform:translateX(1.5px)}.gate.latch .door-r{transform:translateX(-1.5px)}
.gate.opening .door{transition:transform 2.1s cubic-bezier(.65,0,.25,1) .5s,filter 2.1s ease .5s}
.gate.opening .door-l{transform:translateX(-5%) rotateY(88deg);filter:brightness(.68) saturate(.9)}
.gate.opening .door-r{transform:translateX(5%) rotateY(-88deg);filter:brightness(.68) saturate(.9)}
.face{position:absolute;inset:0;overflow:hidden;
  background:repeating-linear-gradient(90deg,rgba(110,76,40,.05) 0 1px,transparent 1px 6px),linear-gradient(90deg,var(--sand-dp),var(--sand) 55%,var(--sand-lt))}
.door-r .face{background:repeating-linear-gradient(90deg,rgba(110,76,40,.05) 0 1px,transparent 1px 6px),linear-gradient(270deg,var(--sand-dp),var(--sand) 55%,var(--sand-lt))}
.face::after{content:"";position:absolute;inset:0;background:url("/img/grain.svg");opacity:.09;mix-blend-mode:multiply;pointer-events:none}
.door-l .face{box-shadow:inset -26px 0 40px -22px rgba(255,246,224,.9)}
.door-r .face{box-shadow:inset 26px 0 40px -22px rgba(255,246,224,.9)}
.art{position:absolute;inset:0;width:100%;height:100%}.flip .art{transform:scaleX(-1)}
.art .back{animation:backlit 3.2s ease-in-out infinite}
@keyframes backlit{0%,100%{opacity:.3}50%{opacity:.6}}
.gate.opening .art .back{animation:none;opacity:1;transition:opacity 1s ease .3s}
.dt{position:absolute;top:0;bottom:0;width:200%;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2}
.door-l .dt{left:0}.door-r .dt{right:0}
.dt span{font:500 min(34vw,148px)/1 var(--display);letter-spacing:-.02em;
  background:linear-gradient(105deg,#B25D17 0,#E48C35 30%,#FFD9A0 42%,#E48C35 54%,#B25D17 100%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:shine 5s ease-in-out infinite;
  filter:drop-shadow(0 1.5px 0 rgba(255,249,236,.85)) drop-shadow(0 8px 10px rgba(110,76,40,.3))}
.dt sup{font-size:.3em;vertical-align:top;position:relative;top:.28em;margin-left:.04em;font-style:italic}
@keyframes shine{0%,30%{background-position:100% 0}70%,100%{background-position:0 0}}
.gate-ui{position:absolute;left:0;right:0;z-index:9;text-align:center;pointer-events:none;transition:opacity .4s ease}
.gate-ui.top{top:max(28px,env(safe-area-inset-top,0px))}.gate-ui.bot{bottom:max(30px,env(safe-area-inset-bottom,0px))}
.gate-ui .label{color:rgba(35,43,37,.78)}
.tap{display:inline-flex;flex-direction:column;align-items:center;gap:10px}
.tap i{display:block;width:1px;height:34px;background:linear-gradient(var(--wood),transparent);animation:drip 2s ease-in-out infinite}
@keyframes drip{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
.gate.opening .gate-ui{opacity:0}
#embers,#specks{position:absolute;inset:0;width:100%;height:100%;z-index:7;pointer-events:none}
.gate.opening #embers{opacity:0;transition:opacity .6s}
.shock{position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px;border-radius:50%;border:2px solid rgba(255,249,236,.95);z-index:9;opacity:0;pointer-events:none}
.gate.opening .shock{animation:shock 1.8s cubic-bezier(.2,.7,.2,1) .55s}
@keyframes shock{0%{opacity:.9;transform:scale(.2)}100%{opacity:0;transform:scale(16)}}
.flood{position:absolute;inset:0;z-index:20;background:#FFF9EC;opacity:0;pointer-events:none}
.gate.opening .flood{opacity:1;transition:opacity 1.1s cubic-bezier(.6,0,.9,.4) 1.7s}
.gate.clear .flood{opacity:0;transition:opacity 1.9s ease}
.gate.clear .door,.gate.clear .light,.gate.clear .seam,.gate.clear .gate-ui,.gate.clear .streak,.gate.clear .bloom{visibility:hidden}
.gate.clear{background:transparent;pointer-events:none}
@keyframes spin{to{rotate:360deg}}
```

## 10. Reference JS (embers, specks, tilt, open/replay — adapt to modules and `content`)
```js
/* gate embers / specks */
var ec=$('#embers'),ex=ec.getContext('2d'),em=[],EW=0,EH=0,eraf=0,sp=$('#specks'),sx=sp.getContext('2d'),specks=[];
function eSize(){var d=Math.min(2,devicePixelRatio||1);EW=gate.clientWidth;EH=gate.clientHeight;ec.width=sp.width=EW*d;ec.height=sp.height=EH*d;ex.setTransform(d,0,0,d,0,0);sx.setTransform(d,0,0,d,0,0);em=[];for(var i=0;i<34;i++)em.push({x:Math.random()*EW,y:Math.random()*EH,r:Math.random()*1.5+.5,v:Math.random()*.35+.12,s:Math.random()*6,c:i%2?'#F5B74E':'#FFFFFF'})}
eSize();addEventListener('resize',eSize);
function eDraw(t){ex.clearRect(0,0,EW,EH);for(var i=0;i<em.length;i++){var e=em[i];e.y-=e.v;if(e.y<-4){e.y=EH+4;e.x=Math.random()*EW}ex.globalAlpha=.3+.5*Math.abs(Math.sin(t/900+e.s));ex.fillStyle=e.c;ex.beginPath();ex.arc(e.x+Math.sin(t/1400+e.s)*8,e.y,e.r,0,6.283);ex.fill()}if(!opened)eraf=requestAnimationFrame(eDraw)}
eraf=requestAnimationFrame(eDraw);
function specksRun(t0){for(var i=0;i<26;i++){var a=(Math.random()-.5)*2.4+(Math.random()<.5?0:Math.PI);specks.push({x:EW/2,y:EH*(.2+Math.random()*.6),vx:Math.cos(a)*(1+Math.random()*2.4),vy:(Math.random()-.5)*.8,r:Math.random()*1.6+.5})}
  (function f(now){var age=(now-t0)/1000;sx.clearRect(0,0,EW,EH);if(age>3.2)return;specks.forEach(function(s){s.x+=s.vx;s.y+=s.vy;s.vx*=.992;sx.globalAlpha=Math.max(0,.9-age*.3);sx.fillStyle='#fff';sx.beginPath();sx.arc(s.x,s.y,s.r,0,6.283);sx.fill()});requestAnimationFrame(f)})(performance.now())}
gate.addEventListener('pointermove',function(e){if(opened)return;var r=gate.getBoundingClientRect();gate.style.perspectiveOrigin=(50+((e.clientX-r.left)/r.width-.5)*30)+'% '+(50+((e.clientY-r.top)/r.height-.5)*20)+'%'});

function open(){
  if(opened)return;opened=true;gate.classList.add('latch');
  setTimeout(function(){gate.classList.remove('latch');gate.classList.add('opening');specksRun(performance.now())},120);
  setTimeout(function(){gate.classList.add('clear');stage.classList.add('entered');started=true;sc.classList.remove('locked');setTimeout(frame,2200)},3020);
  setTimeout(function(){gate.classList.add('done');replay.classList.add('on')},5000);
}
gate.addEventListener('click',open);
gate.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
replay.addEventListener('click',function(){sc.scrollTop=0;sc.classList.add('locked');stage.classList.remove('entered');started=false;replay.classList.remove('on');gate.className='gate';opened=false;sx.clearRect(0,0,EW,EH);specks=[];void gate.offsetWidth;eraf=requestAnimationFrame(eDraw);frame()});

/* rays (irregular) */
function rays(el,col,a){var s='',ang=0,seeds=[3,7,2,9,4,6,2,8,3,5,2,7,4,6];for(var i=0;i<14;i++){var w=seeds[i]*.9,start=i*25.7+(seeds[(i+3)%14]-5);s+=col(a)+' '+start+'deg '+(start+w)+'deg,transparent '+(start+w)+'deg '+(start+25.7)+'deg,'}
  el.style.background='conic-gradient(from 0deg,'+s.replace(/,$/,'')+')'}
rays($('#rays'),function(a){return 'rgba(255,240,200,.6)'});
rays($('#rays2'),function(){return 'rgba(255,249,236,.13)'});
```
