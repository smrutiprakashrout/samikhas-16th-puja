# 05 — Date and time: "The scratch ticket"
Owner: OpenCode (task S05) · Needs S04 · Normal-flow band (NOT scrubbed), `min-height:100svh`. Saffron ground (the one bold chapter).
Visual reference: `docs/prototype/prototype-v3-scratch.html` (approved). If reference and spec differ, **this spec wins**. Do not read the prototype whole; open only the parts named here.

## 0. Experience
The saffron band rises under the family chapter with a soft curved top edge. A cream ticket (notched sides, thin wood border) slides up with a slight tilt. A gold foil panel with an embossed mandala covers the date and time. The guest scratches with a finger; after about 45% is cleared the rest dissolves, the panel glows, marigold petals burst out and the phone buzzes briefly. Underneath: a big deep-saffron "29", "November 2026", *Sunday*, "7:00 PM onwards". The **Add to calendar** button then appears on the ticket stub. A "Reveal the date" button is always available.

## 1. Content — add to `src/content.js` (replace any old `event`/date keys used by this section; keep `event.startISO` if present)
```js
date: {
  label: 'Save the date',
  day: '29',
  month: 'November 2026',
  weekday: 'Sunday',
  time: '7:00 PM',
  timeNote: 'onwards',
  scratchHint: 'Scratch with your finger',
  scratchLabel: 'Scratch here',
  revealButton: 'Reveal the date',
  calendarLabel: 'Add to calendar',
  calendarUrl: '',   // OWNER: paste the public calendar event link; if empty the button is not rendered
},
```
UI strings come from `content` too. The date and time are REAL text in the DOM under the foil (screen readers and no-canvas fallback).

## 2. Markup
```html
<section data-scene="05-date" class="band" id="band">
  <div class="shade"></div><div class="burst" id="burst"></div>
  <div class="wrap" id="wrap">
    <div class="tkw"><div class="ticket" id="tk">
      <p class="tt label">{label}<i></i></p>
      <div class="panel" id="panel">
        <div class="rev" aria-live="polite"><div class="n">29</div><div class="m">…</div><div class="d">…</div><div class="r"></div><div class="t">7:00 PM<small>onwards</small></div></div>
        <canvas class="fc" id="fc" aria-hidden="true"></canvas><div class="shim"></div>
      </div>
      <div class="perf"></div>
      <div class="stubz"><a class="btn" id="btn" href="{calendarUrl}" target="_blank" rel="noopener">{calendarLabel}</a></div>
    </div></div>
    <p class="hint label" id="hint"><span class="dot"></span>{scratchHint}</p>
    <button class="rv" id="rv" type="button">{revealButton}</button>
  </div>
  <div class="grain"></div>
</section>
```
Wrap the band so its curved top edge (`.band::before`, 140px ellipse in `--saffron`, top −70px) sits over the family chapter's ivory. Remove the S04 temporary tail block; add a temporary sand `.tail` (40svh) after this section marked "TEMP until venue spec". If `calendarUrl` is empty, do not render the button (keep an empty stub).

## 3. Layout and style (see reference CSS for exact values)
| Element | Value |
|---|---|
| Band | saffron `--saffron`, padding `7svh` + gutters, centred column; vignette `radial-gradient(110% 85% at 50% 48%, transparent 55%, rgba(178,93,23,.32) 100%)`; grain at .07 multiply |
| Sunburst | `.burst`: 14 irregular ivory rays `rgba(255,243,208,.38)`, width 230%, centred at 46%, opacity .5, masked by radial gradient, rotates 90s linear infinite (the ray angles come from the `seeds` list in the reference JS) |
| Ticket | width `min(100vw − 84px, 306px)`, aspect 306/452, ivory; side notches at y=76% via two `radial-gradient(circle 12px …)` masks; inner border 1px `rgba(168,121,63,.55)` inset 8px; grain .06; shadow = `drop-shadow(0 18px 24px rgba(110,48,8,.35)) drop-shadow(0 3px 5px rgba(110,48,8,.25))` on the wrapper |
| Panel (foil window) | `left/right 8.4%`, `top 17.8%`, `height 55.7%`, `--sand-lt`, inset 1px wood border |
| Label | `top 7.2%`, centred, `label` style, `rgba(35,43,37,.78)`; divider 70×1px `--wood` with a 5px `--saffron-deep` diamond (3px ivory ring) |
| Reveal content | "29": Cormorant 500, `clamp(92px, 31vw, 122px)`, lining nums, `--saffron-deep`, emboss `text-shadow:0 1.5px 0 rgba(255,249,236,.9)`; month `clamp(22px,6.6vw,27px)`; weekday italic `clamp(17px,5vw,20px)`; 46×1px `--wood` rule; time `clamp(24px,7.2vw,29px)` with "onwards" 10px caps under it |
| Perforation | `top 76%`, dashed 1.5px `rgba(168,121,63,.65)` |
| Stub | `top 76%` to bottom, centres the button: 48px high pill, 1px ink border, 11.5px caps text |
| Hint | 22px under the ticket, `label` style, `rgba(35,43,37,.85)`, with a pulsing 8px ivory dot; "Reveal" text button below it (min-height 44px, underlined 12px) |

## 4. Foil canvas (inside `.panel`, same size, DPR ≤ 2)
Draw once on load (and on resize while not revealed; redraw after `document.fonts.ready` if untouched): linear gradient `#F6DC9C → #E0AF70 (.28) → #F8E2A8 (.5) → #C98A3E (.72) → #F1CB80`; embossed mandala (3 circles + 16 petals, stroke `rgba(110,76,40,.28)` with an ivory highlight copy 0.8px lower); 420 sparkle specks; centred label (`scratchLabel`, 11px DM Sans 500, letter-spacing 3px, colour `rgba(110,76,40,.75)`). Shimmer overlay `.shim`: diagonal white gradient sweeping every 3.4s (`mix-blend-mode:overlay`, pointer-events none).

## 5. Interaction
- `touch-action:none` on the canvas only (so the page still scrolls elsewhere). Pointer events with pointer capture; brush 30px round, `destination-out`.
- Every 6th move (and on pointerup) sample the canvas on a 40×26 grid; when more than 45% of cells are transparent → `reveal()`.
- `reveal()` (idempotent): add `.done` to the panel (canvas and shimmer fade out in .9s/.6s; panel glow animation 1.6s), add `.done-all` to the band (hint and Reveal button fade out; Add-to-calendar button fades in after .5s delay), `navigator.vibrate(30)` in try/catch, and 22 petals (12×15px, colours `#F5B74E #FBF3E4 #FFD58A #B25D17 #FBF3E4`) burst from the panel centre via the Web Animations API (1.5–2.2s), removed on finish. (Skip petals when reduced motion.)
- First `pointerdown` hides the hint. The "Reveal" button calls `reveal()`.
- Entrance: when 35% of the band is in view (IntersectionObserver, once) add `.in` — the ticket wrapper goes from `opacity 0; translateY(70px) rotate(−3deg)` to none (1.2s opacity / 1.6s transform, ease-out `cubic-bezier(.16,1,.3,1)`).
- Reduced motion: call `reveal()` as soon as the band is `.in`; no petals, no shimmer, no rotation.
- Persist nothing; a reload shows the foil again.

## 6. Accessibility
The date/time text is always in the DOM and readable; `.rev` has `aria-live="polite"`. The canvas is `aria-hidden`. The Reveal button is a real `<button>`. The calendar link is a real `<a>`. Tap targets ≥ 44px. Contrast: ink on ivory 13:1; deep saffron on `--sand-lt` for the large numeral only.

## 7. Acceptance checklist
- [ ] At 390×844 the idle ticket matches the prototype; the saffron band has a curved top over ivory.
- [ ] Scratching with finger/mouse removes foil smoothly; the page still scrolls when touching outside the panel.
- [ ] At >45% the rest clears, glow + petals + button appear; the "Reveal the date" button does the same.
- [ ] Text under the foil is correct and matches `content.date`; the button link equals `content.date.calendarUrl` (and is not rendered when empty).
- [ ] Works at 360×740, 390×844, 430×932; the ticket never overflows; nothing overlaps.
- [ ] Reduced-motion path reveals automatically. No console errors; build passes.
- [ ] Screenshots: `qa/S05-idle.png`, `qa/S05-scratching.png` (about 20% cleared), `qa/S05-done.png`, `qa/S05-360.png`, `qa/S05-430.png`.

## 8. Reference CSS (port; swap to tokens; the `.stub` and `.tail` rules are prototype-only)
```css
:root{--ink:#232B25;--ink-deep:#181E1A;--ivory:#FBF3E4;--sand:#EBCEAE;--sand-lt:#F4E4CC;--wood:#A8793F;--wood-dk:#6E4C28;--gold:#E0AF70;--marigold:#F5B74E;--saffron:#E48C35;--saffron-deep:#B25D17;
 --display:'Cormorant Garamond',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif;--u:1;color-scheme:light}
*{box-sizing:border-box;margin:0}html,body{height:100%}
body{background:var(--ink-deep);color:var(--ink);font-family:var(--sans);overflow:hidden;-webkit-font-smoothing:antialiased}
.phone{position:relative;width:min(100%,430px);height:100%;margin:0 auto;background:var(--ivory);overflow:hidden}
.scroller{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none}.scroller::-webkit-scrollbar{display:none}
.label{font:500 11px/1.4 var(--sans);letter-spacing:.24em;text-transform:uppercase}
.stub{height:46svh;background:var(--ivory)}
.band{position:relative;min-height:100svh;background:var(--saffron);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:calc(7svh) max(24px,env(safe-area-inset-left,0px)) calc(7svh) max(24px,env(safe-area-inset-right,0px));overflow:hidden}
.band::before{content:"";position:absolute;left:-12%;right:-12%;top:-70px;height:140px;background:var(--saffron);border-radius:50% 50% 0 0;z-index:0}
.shade{position:absolute;inset:0;background:radial-gradient(110% 85% at 50% 48%,transparent 55%,rgba(178,93,23,.32) 100%);pointer-events:none}
.grain{position:absolute;inset:0;pointer-events:none;background:url("/img/grain.svg");opacity:.07;mix-blend-mode:multiply;z-index:30}
.burst{position:absolute;left:50%;top:46%;width:230%;aspect-ratio:1;translate:-50% -50%;opacity:.5;pointer-events:none;animation:spin 90s linear infinite;
 -webkit-mask:radial-gradient(circle,#000 0,transparent 52%);mask:radial-gradient(circle,#000 0,transparent 52%)}
@keyframes spin{to{rotate:360deg}}
.wrap{position:relative;z-index:5;display:flex;flex-direction:column;align-items:center;opacity:0;transform:translateY(70px) rotate(-3deg);transition:opacity 1.2s cubic-bezier(.16,1,.3,1),transform 1.6s cubic-bezier(.16,1,.3,1)}
.band.in .wrap{opacity:1;transform:none}
.tkw{filter:drop-shadow(0 18px 24px rgba(110,48,8,.35)) drop-shadow(0 3px 5px rgba(110,48,8,.25))}
.ticket{position:relative;width:min(calc(100vw - 84px),306px);aspect-ratio:306/452;background:var(--ivory);
 -webkit-mask:radial-gradient(circle 12px at 0 76%,#0000 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 12px at 100% 76%,#0000 98%,#000) right/51% 100% no-repeat;
 mask:radial-gradient(circle 12px at 0 76%,#0000 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 12px at 100% 76%,#0000 98%,#000) right/51% 100% no-repeat}
.ticket::before{content:"";position:absolute;inset:8px;border:1px solid rgba(168,121,63,.55);pointer-events:none}
.ticket::after{content:"";position:absolute;inset:0;background:url("/img/grain.svg");opacity:.06;mix-blend-mode:multiply;pointer-events:none}
.tt{position:absolute;left:0;right:0;top:7.2%;text-align:center;color:rgba(35,43,37,.78)}
.tt i{display:block;width:70px;height:1px;background:var(--wood);margin:11px auto 0;position:relative}
.tt i::after{content:"";position:absolute;left:50%;top:50%;width:5px;height:5px;margin:-2.5px;rotate:45deg;background:var(--saffron-deep);box-shadow:0 0 0 3px var(--ivory)}
.panel{position:absolute;left:8.4%;right:8.4%;top:17.8%;height:55.7%;background:var(--sand-lt);box-shadow:inset 0 0 0 1px rgba(168,121,63,.5);overflow:hidden}
.rev{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.rev .n{font:500 clamp(92px,31vw,122px)/.82 var(--display);letter-spacing:-.04em;color:var(--saffron-deep);font-variant-numeric:lining-nums;text-shadow:0 1.5px 0 rgba(255,249,236,.9)}
.rev .m{font:500 clamp(22px,6.6vw,27px)/1.1 var(--display);margin-top:12px}
.rev .d{font:italic 400 clamp(17px,5vw,20px)/1.2 var(--display);margin-top:3px;color:rgba(35,43,37,.85)}
.rev .r{width:46px;height:1px;background:var(--wood);margin:11px 0 10px;position:relative}
.rev .t{font:500 clamp(24px,7.2vw,29px)/1 var(--display)}
.rev .t small{display:block;font:500 10px var(--sans);letter-spacing:.24em;text-transform:uppercase;margin-top:6px;color:rgba(35,43,37,.7)}
.fc{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:pointer;z-index:2;transition:opacity .9s ease}
.shim{position:absolute;inset:0;z-index:3;pointer-events:none;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.55) 50%,transparent 65%);background-size:260% 100%;animation:shim 3.4s ease-in-out infinite;mix-blend-mode:overlay;transition:opacity .6s}
@keyframes shim{0%{background-position:130% 0}60%,100%{background-position:-60% 0}}
.panel.done .fc,.panel.done .shim{opacity:0;pointer-events:none}
.panel.done{animation:glow 1.6s ease-out}
@keyframes glow{0%{box-shadow:inset 0 0 0 1px rgba(168,121,63,.5),0 0 0 0 rgba(255,226,166,.9)}40%{box-shadow:inset 0 0 0 1px rgba(168,121,63,.5),0 0 40px 14px rgba(255,226,166,.9)}100%{box-shadow:inset 0 0 0 1px rgba(168,121,63,.5),0 0 0 0 rgba(255,226,166,0)}}
.perf{position:absolute;left:5%;right:5%;top:76%;border-top:1.5px dashed rgba(168,121,63,.65)}
.stubz{position:absolute;left:0;right:0;top:76%;bottom:0;display:flex;align-items:center;justify-content:center}
.btn{min-height:48px;padding:0 22px;display:inline-flex;align-items:center;border:1px solid var(--ink);border-radius:99px;color:var(--ink);text-decoration:none;font:500 11.5px var(--sans);letter-spacing:.16em;text-transform:uppercase;opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .8s ease .5s,transform .8s ease .5s}
.done-all .btn{opacity:1;transform:none;pointer-events:auto}
.hint{margin-top:22px;text-align:center;color:rgba(35,43,37,.85);transition:opacity .5s}
.hint .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ivory);margin-right:10px;vertical-align:middle;animation:ping 1.8s ease-out infinite}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(251,243,228,.8)}100%{box-shadow:0 0 0 12px rgba(251,243,228,0)}}
.rv{display:block;margin:10px auto 0;font:400 12px var(--sans);color:rgba(35,43,37,.8);background:none;border:0;text-decoration:underline;text-underline-offset:3px;min-height:44px;cursor:pointer}
.done-all .hint,.done-all .rv{opacity:0;pointer-events:none}
.pt{position:absolute;z-index:20;width:12px;height:15px;border-radius:80% 0 80% 0;pointer-events:none}
.tail{height:40svh;background:var(--sand)}
```

## 9. Reference JS (adapt to modules/`content`; keep the foil and scratch logic as is)
```js
(function(){
var $=function(s){return document.querySelector(s)};var sc=$('#sc'),band=$('#band'),panel=$('#panel'),fc=$('#fc'),ctx=fc.getContext('2d');
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// irregular rays
(function(){var s='',seeds=[3,7,2,9,4,6,2,8,3,5,2,7,4,6];for(var i=0;i<14;i++){var w=seeds[i]*.9,st=i*25.7+(seeds[(i+3)%14]-5);s+='rgba(255,243,208,.38) '+st+'deg '+(st+w)+'deg,transparent '+(st+w)+'deg '+(st+25.7)+'deg,'}$('#burst').style.background='conic-gradient(from 0deg,'+s.replace(/,$/,'')+')'})();
// foil
var W=0,H=0,done=false;
function foil(){var d=Math.min(2,devicePixelRatio||1);W=panel.clientWidth;H=panel.clientHeight;fc.width=W*d;fc.height=H*d;ctx.setTransform(d,0,0,d,0,0);ctx.globalCompositeOperation='source-over';
 var g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#F6DC9C');g.addColorStop(.28,'#E0AF70');g.addColorStop(.5,'#F8E2A8');g.addColorStop(.72,'#C98A3E');g.addColorStop(1,'#F1CB80');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 // mandala emboss
 ctx.save();ctx.translate(W/2,H/2);ctx.strokeStyle='rgba(110,76,40,.28)';ctx.lineWidth=1;
 [Math.min(W,H)*.46,Math.min(W,H)*.40,Math.min(W,H)*.22].forEach(function(r){ctx.beginPath();ctx.arc(0,0,r,0,6.283);ctx.stroke()});
 for(var i=0;i<16;i++){ctx.save();ctx.rotate(i*Math.PI/8);ctx.beginPath();var r0=Math.min(W,H)*.23,r1=Math.min(W,H)*.40;ctx.moveTo(0,-r0);ctx.bezierCurveTo(14,-r0-(r1-r0)*.3,14,-r1+(r1-r0)*.2,0,-r1);ctx.bezierCurveTo(-14,-r1+(r1-r0)*.2,-14,-r0-(r1-r0)*.3,0,-r0);ctx.stroke();ctx.restore()}
 ctx.restore();
 ctx.save();ctx.translate(W/2,H/2);ctx.strokeStyle='rgba(255,246,224,.55)';for(var j=0;j<16;j++){ctx.save();ctx.rotate(j*Math.PI/8);ctx.translate(0,.8);ctx.beginPath();ctx.moveTo(0,-Math.min(W,H)*.23);ctx.lineTo(0,-Math.min(W,H)*.40);ctx.stroke();ctx.restore()}ctx.restore();
 // sparkle noise
 for(var k=0;k<420;k++){ctx.fillStyle=Math.random()<.5?'rgba(255,255,255,.55)':'rgba(110,76,40,.16)';ctx.fillRect(Math.random()*W,Math.random()*H,Math.random()*1.6+.4,Math.random()*1.6+.4)}
 ctx.fillStyle='rgba(110,76,40,.75)';ctx.font='500 11px DM Sans, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
 var t='SCRATCH HERE';var x=W/2-((t.length-1)*3.4)/2*1;ctx.save();ctx.translate(W/2,H/2);ctx.letterSpacing='3px';ctx.fillText(t,0,0);ctx.restore()}
function setup(){foil();}
setup();addEventListener('resize',function(){if(!done)setup()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(!done&&!touched)setup()});
// scratch
var down=false,lx=0,ly=0,touched=false,moves=0,tmp=document.createElement('canvas');tmp.width=40;tmp.height=26;var tx=tmp.getContext('2d');
function pos(e){var r=fc.getBoundingClientRect();return [(e.clientX-r.left)*(W/r.width),(e.clientY-r.top)*(H/r.height)]}
function dot(x,y){ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(x,y,15,0,6.283);ctx.fill()}
fc.addEventListener('pointerdown',function(e){if(done)return;down=true;touched=true;fc.setPointerCapture(e.pointerId);var p=pos(e);lx=p[0];ly=p[1];dot(lx,ly);$('#hint').style.opacity=.0});
fc.addEventListener('pointermove',function(e){if(!down||done)return;var p=pos(e);ctx.globalCompositeOperation='destination-out';ctx.lineWidth=30;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(p[0],p[1]);ctx.stroke();lx=p[0];ly=p[1];if(++moves%6===0)check()});
fc.addEventListener('pointerup',function(){down=false;check()});fc.addEventListener('pointercancel',function(){down=false});
function check(){tx.clearRect(0,0,40,26);tx.drawImage(fc,0,0,40,26);var d=tx.getImageData(0,0,40,26).data,c=0;for(var i=3;i<d.length;i+=4)if(d[i]<60)c++;if(c/(40*26)>.45)reveal()}
function reveal(){if(done)return;done=true;panel.classList.add('done');band.classList.add('done-all');if(navigator.vibrate)try{navigator.vibrate(30)}catch(e){}
 var r=panel.getBoundingClientRect(),b=band.getBoundingClientRect(),cx=r.left+r.width/2-b.left,cy=r.top+r.height/2-b.top,cols=['#F5B74E','#FBF3E4','#FFD58A','#B25D17','#FBF3E4'];
 if(!reduce)for(var i=0;i<22;i++){var el=document.createElement('div');el.className='pt';el.style.left=cx+'px';el.style.top=cy+'px';el.style.background=cols[i%5];band.appendChild(el);
  var a=Math.random()*6.283,dist=90+Math.random()*150,dx=Math.cos(a)*dist,dy=Math.sin(a)*dist-40;
  el.animate([{transform:'translate(0,0) rotate(0) scale(.4)',opacity:1},{transform:'translate('+dx+'px,'+dy+'px) rotate('+(Math.random()*540)+'deg) scale(1)',opacity:1,offset:.55},{transform:'translate('+(dx*1.1)+'px,'+(dy+120)+'px) rotate(700deg) scale(.9)',opacity:0}],{duration:1500+Math.random()*700,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'}).onfinish=(function(n){return function(){n.remove()}})(el)}}
$('#rv').addEventListener('click',reveal);
new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){band.classList.add('in');o.disconnect();if(reduce)reveal()}})},{root:sc,threshold:.35}).observe(band);
window.__reveal=reveal;
})();
```
