# 04 — Family: "A thread of names"
Owner: OpenCode (task S04) · Needs S03 · Scene height `220vh` (2.2 × stage height), scrubbed. Ivory ground, continues from the invitation chapter.
Visual reference: `docs/prototype/prototype-v3-family-date.html` (approved; the DATE half of that file is superseded by spec 05 — ignore it). If reference and spec differ, **this spec wins**. Do not read the prototype whole.

## 0. Experience
A thin wood thread draws itself down the left margin. A diamond node sits where each group of names begins. The names rise into place line by line from behind a mask. The thread ends in a small marigold blossom.

## 1. Content — add to `src/content.js` (replace any old family/parents/grandparents keys used by older sections; keep everything else)
```js
family: {
  parentsLabel: 'Daughter of',
  parents: ['Manorama Nanda', 'Sarada Prasanna Panda'],   // order = first line, second line (confirm with owner; swap here only)
  grandLabel: 'With love and blessings from her grandparents',
  grand: ['Malati Panda', 'Nikunja Bihari Panda'],
},
```
Each group renders: first name on its own line, second name on the next line prefixed with an italic saffron-deep "&" (`<em>&amp;</em>` followed by the name).

## 2. Markup
```html
<section data-scene="04-family" class="fam" id="fam" style="height:220vh">
  <div class="stage" style="position:sticky;top:0;height:100svh">
    <div class="vig"></div>
    <svg class="thread" id="thread" aria-hidden="true"> <path class="l" id="tl" pathLength="1" d="M24.5 {231u}V{626u}" stroke="#A8793F" stroke-width="1.2" fill="none"/> </svg>
    <div class="node" id="n1"></div><div class="node" id="n2"></div>
    <svg class="bl" id="bl" viewBox="-16 -16 32 32" aria-hidden="true"> marigold blossom: 10 ellipses (cx 0, cy −8, rx 4.4, ry 7.6, fill #F5B74E, stroke #B25D17 .45 opacity, .5 width) rotated every 36°, centre circle r6.2 #FFD58A, dot r2.4 #B25D17 at .75 </svg>
    <div class="ft" id="b1" style="top:calc(var(--u)*226px)"><p class="label fl">{parentsLabel}</p><p class="fn"><span>Name 1</span></p><p class="fn"><span><em>&amp;</em>Name 2</span></p></div>
    <div class="ft" id="b2" style="top:calc(var(--u)*426px)"> same structure for the grandparents </div>
    <div class="grain"></div>
  </div>
</section>
```
Names are real text in `<p>` elements (the inner `<span>` is only for the mask animation; keep the reading order). The thread, nodes and blossom are `aria-hidden`.

## 3. Layout (390×844 reference; `--u = stageHeight/844`)
| Element | Position / style |
|---|---|
| Thread | x = 24.5px (centre of a 1.2px line; `left` gutter = `max(24px, safe-left)`), from `y 231u` to `y 626u`; stroke `--wood` 1.2px |
| Node 1 | diamond 9×9, rotated 45°, `--saffron-deep`, 5px ivory ring (`box-shadow:0 0 0 5px var(--ivory)`), centred on the thread at `y 231u` (CSS `top: calc(var(--u)*231px)`) |
| Node 2 | same, at `y 431u` |
| Blossom | 31×31, centred on the thread at `y 626u` |
| Block 1 | `top 226u`; left = gutter + 20px (text column starts at x≈44); right = gutter |
| Block 2 | `top 426u` |
| Label | `label` style, `rgba(35,43,37,.74)`, max-width 30ch (the grandparents label wraps to two lines) |
| Names | Cormorant Garamond 500, `clamp(26px, 7.8vw, 31px)` / 1.2; each name on one line at 390–430 width; first name margin-top 12px; "&" italic `--saffron-deep`, margin-right .18em |
| Name mask | each `.fn` has `overflow:hidden`; inner span starts at `translateY(110%)` |

## 4. Scroll scrub (progress p over the scene; `seg()` = in-out quad)
| What | Window / formula |
|---|---|
| Thread | `stroke-dashoffset = 1 − seg(p,.05,.66)` |
| Node 1 | `scale = seg(p,.05,.12)` |
| Block 1 label | opacity `seg(p,.06,.14)` |
| Block 1 name i (0,1) | `t = seg(p, .10 + .07i, .20 + .07i)`; span `translateY((1−t)·110%)` |
| Node 2 | `scale = seg(p,.30,.37)` |
| Block 2 label | opacity `seg(p,.30,.38)` |
| Block 2 name i | `t = seg(p, .34 + .07i, .44 + .07i)` |
| Blossom | `s = seg(p,.58,.72)`; `scale(s) rotate(−40deg + 40deg·s)` |
| Hold | p .75–1: nothing moves |

## 5. Reduced motion
Show the end state (thread drawn, all names in place).

## 6. Acceptance checklist
- [ ] At p≈.1, .3, .55, .8 the state matches the prototype; every name fits on one line at 360, 390, 430 widths (at 360 the second name may wrap — then the "&" stays with it).
- [ ] The thread starts and ends exactly at the node/blossom centres at all heights (values scale with `u`).
- [ ] Order of names matches `content.family`; text is selectable in reading order.
- [ ] No overlaps; paper grain and vignette same as other ivory chapters.
- [ ] Only transform/opacity/stroke animate. No console errors; build passes.
- [ ] Screenshots: `qa/S04-p10.png`, `p30.png`, `p55.png`, `p80.png` (390×844), `qa/S04-360.png`, `qa/S04-430.png` (p≈.8).

## 7. Reference CSS (port; swap to tokens)
```css
/* FAMILY */
.fam{position:relative;background:var(--ivory)}.fam .stage{background:var(--ivory)}
.vig{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 45%,transparent 60%,rgba(244,228,204,.9) 100%);pointer-events:none;z-index:2}
.thread{position:absolute;left:0;top:0;width:100%;height:100%;z-index:3;overflow:visible}
.thread path.l{stroke-dasharray:1;stroke-dashoffset:1}
.node{position:absolute;left:calc(max(24px,env(safe-area-inset-left,0px)) - 4px);width:9px;height:9px;rotate:45deg;background:var(--saffron-deep);box-shadow:0 0 0 5px var(--ivory);transform:scale(0);z-index:4}
.bl{position:absolute;left:calc(max(24px,env(safe-area-inset-left,0px)) - 15px);width:31px;height:31px;z-index:4;transform:scale(0) rotate(-40deg)}
.ft{position:absolute;left:calc(max(24px,env(safe-area-inset-left,0px)) + 20px);right:max(24px,env(safe-area-inset-right,0px));z-index:5}
.fl{color:rgba(35,43,37,.74);opacity:0;max-width:30ch}
.fn{font:500 clamp(26px,7.8vw,31px)/1.2 var(--display);overflow:hidden}
.fn span{display:block;transform:translateY(110%)}
.fn em{font-style:italic;color:var(--saffron-deep);margin-right:.18em}
```

## 8. Reference JS (adapt to modules/`content`; the prototype hard-codes names — read them from `content.family`)
```js
// build family blocks
var parents=['Manorama Nanda','Sarada Prasanna Panda'],grand=['Malati Panda','Nikunja Bihari Panda'];
function block(label,names,top,id){return '<div class="ft" id="'+id+'" style="top:calc(var(--u)*'+top+'px)"><p class="label fl">'+label+'</p><p class="fn" style="margin-top:12px"><span>'+names[0]+'</span></p><p class="fn"><span><em>&amp;</em>'+names[1]+'</span></p></div>'}
$('#b1').outerHTML=block('Daughter of',parents,226,'b1');
fs.insertAdjacentHTML('beforeend',block('With love and blessings from her grandparents',grand,426,'b2'));
var n1=$('#n1'),n2=$('#n2'),bl=$('#bl');n1.style.top='calc(var(--u)*231px)';n2.style.top='calc(var(--u)*431px)';bl.style.top='calc(var(--u)*626px)';

// blossom for thread end
(function(){var g='',cols=['#F5B74E','#E48C35'];for(var i=0;i<10;i++)g+='<ellipse cx="0" cy="-8" rx="4.4" ry="7.6" fill="'+cols[i%2?0:0]+'" stroke="#B25D17" stroke-opacity=".45" stroke-width=".5" transform="rotate('+(i*36)+')"/>';g+='<circle r="6.2" fill="#FFD58A"/><circle r="2.4" fill="#B25D17" fill-opacity=".75"/>';bl.innerHTML=g})();

function applyFam(p){
 tl=tl||$('#tl');tl.style.strokeDashoffset=1-seg(p,.05,.66);
 n1.style.transform='scale('+seg(p,.05,.12)+')';n2.style.transform='scale('+seg(p,.30,.37)+')';
 bl.style.transform='scale('+seg(p,.58,.72)+') rotate('+(-40+40*seg(p,.58,.72))+'deg)';
 [['#b1',.06],['#b2',.30]].forEach(function(b){var el=$(b[0]),s=b[1];el.querySelector('.fl').style.opacity=seg(p,s,s+.08);var sp=el.querySelectorAll('.fn span');sp.forEach(function(x,i){var t=seg(p,s+.04+i*.07,s+.14+i*.07);x.style.transform='translateY('+((1-t)*110)+'%)'})});
}
```
