import { seg } from '../../core/util.js';
import { scrub } from '../../core/scroll.js';
import './style.css';

const n = v => Number(v.toFixed(2));

function blossomSvg() {
  const petals = Array.from({ length: 10 }, (_, i) =>
    `<ellipse cx="0" cy="-8" rx="4.4" ry="7.6" fill="var(--marigold)" stroke="var(--saffron-deep)" stroke-opacity=".45" stroke-width=".5" transform="rotate(${i * 36})"/>`
  ).join('');
  return `<svg class="bl" id="bl" viewBox="-16 -16 32 32" aria-hidden="true">${petals}<circle r="6.2" fill="#FFD58A"/><circle r="2.4" fill="var(--saffron-deep)" fill-opacity=".75"/></svg>`;
}

function block(label, names, top, id) {
  return `<div class="ft" id="${id}" style="top:calc(var(--u)*${top}px)">
  <p class="label fl">${label}</p>
  <p class="fn first"><span>${names[0]}</span></p>
  <p class="fn"><span><em>&amp;</em>${names[1]}</span></p>
</div>`;
}

export default {
  id: '04-family',
  height: '240vh',

  html(content) {
    const c = content?.content ?? content;
    const f = c.family;
    return `
<div class="stage" style="position:sticky;top:0;height:100svh">
  <div class="vig" aria-hidden="true"></div>
  <svg class="thread" id="thread" aria-hidden="true"><path class="l" id="tl" pathLength="1" d="M24.5 231V626" stroke="var(--wood)" stroke-width="1.2" fill="none"/></svg>
  <div class="node" id="n1" aria-hidden="true" style="top:calc(var(--u)*231px)"></div>
  <div class="node" id="n2" aria-hidden="true" style="top:calc(var(--u)*431px)"></div>
  ${blossomSvg()}
  ${block(f.parentsLabel, f.parents, 226, 'b1')}
  ${block(f.grandLabel, f.grand, 426, 'b2')}
  <div class="grain" aria-hidden="true"></div>
</div>`;
  },

  mount({ root, reduced }) {
    const stage = root.querySelector('.stage');
    if (!stage) return null;

    const path = root.querySelector('#tl');
    const nodes = [root.querySelector('#n1'), root.querySelector('#n2')];
    const blossom = root.querySelector('#bl');
    const blocks = [root.querySelector('#b1'), root.querySelector('#b2')];
    const labels = blocks.map(b => b.querySelector('.fl'));
    const names = blocks.map(b => [...b.querySelectorAll('.fn span')]);

    let u = 1;
    let currentP = 0;
    let alive = true;

    if (reduced) stage.classList.add('reduced');

    function apply(p) {
      currentP = p;
      path.style.strokeDashoffset = String(reduced ? 0 : 1 - seg(p, .05, .66));
      nodes[0].style.transform = `scale(${reduced ? 1 : seg(p, .05, .12)})`;
      nodes[1].style.transform = `scale(${reduced ? 1 : seg(p, .30, .37)})`;
      labels[0].style.opacity = String(reduced ? 1 : seg(p, .06, .14));
      labels[1].style.opacity = String(reduced ? 1 : seg(p, .30, .38));
      names.forEach((spans, bi) => {
        const base = bi === 0 ? .10 : .34;
        spans.forEach((span, i) => {
          const t = reduced ? 1 : seg(p, base + .07 * i, base + .10 + .07 * i);
          span.style.transform = `translateY(${n((1 - t) * 110)}%)`;
        });
      });
      const s = reduced ? 1 : seg(p, .58, .72);
      blossom.style.transform = reduced
        ? 'scale(1)'
        : `scale(${s.toFixed(4)}) rotate(${n(-40 + 40 * s)}deg)`;
    }

    function layout() {
      const h = Math.max(1, stage.getBoundingClientRect().height);
      u = h / 844;
      stage.style.setProperty('--u', String(u));
      root.style.height = `${h * 2.4}px`;
      path.setAttribute('d', `M24.5 ${n(231 * u)}V${n(626 * u)}`);
      apply(currentP);
    }

    window.addEventListener('resize', layout);
    layout();
    const unsubscribe = scrub(root, apply);
    if (document.fonts?.ready) document.fonts.ready.then(() => { if (alive) layout(); });

    return {
      stage,
      destroy() {
        alive = false;
        window.removeEventListener('resize', layout);
        unsubscribe();
      },
    };
  },
};
