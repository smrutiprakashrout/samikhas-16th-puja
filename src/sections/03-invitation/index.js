import { seg } from '../../core/util.js';
import { scrub } from '../../core/scroll.js';
import './style.css';

const n = v => Number(v.toFixed(2));

function mandalaSvg() {
  const petals = Array.from({ length: 24 }, (_, i) =>
    `<path d="M0-88c5-8 5-16 0-24c-5 8-5 16 0 24Z" transform="rotate(${i * 15})"/>`
  ).join('');
  const dots = Array.from({ length: 12 }, (_, i) => {
    const a = i * Math.PI / 6;
    return `<circle cx="${n(64 * Math.cos(a))}" cy="${n(64 * Math.sin(a))}" r="1.3" fill="var(--wood)" stroke="none"/>`;
  }).join('');
  return `<svg class="mand" id="mand" viewBox="-100 -100 200 200" fill="none" stroke="var(--wood)" stroke-width=".5" aria-hidden="true">
    <g class="s"><circle r="96"/><circle r="92" stroke-dasharray="1 3"/>${petals}<circle r="76"/></g>
    <circle r="64" stroke-dasharray=".5 2.2"/>${dots}
  </svg>`;
}

function splitWords(el) {
  const out = [];
  for (const node of [...el.childNodes]) {
    const isKey = node.nodeType === 1 && node.classList.contains('k');
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      const span = document.createElement('span');
      span.className = `w${isKey ? ' k' : ''}`;
      span.textContent = part;
      frag.appendChild(span);
      out.push(span);
    });
    el.replaceChild(frag, node);
  }
  return out;
}

export default {
  id: '03-invitation',
  height: '260vh',

  html(content) {
    const c = content?.content ?? content;
    const inv = c.invitation;
    return `
<div class="stage" style="position:sticky;top:0;height:100svh">
  <div class="vig" aria-hidden="true"></div>
  ${mandalaSvg()}
  <p class="col label lab" id="lab">${inv.label}</p>
  <p class="col big" id="big">${inv.before}<span class="k">${inv.key}</span>${inv.after}</p>
  <div class="col div" id="div" aria-hidden="true"><i></i><b></b></div>
  <p class="col small" id="small">${inv.closing}</p>
  <div class="grain" aria-hidden="true"></div>
</div>`;
  },

  mount({ root, reduced }) {
    const stage = root.querySelector('.stage');
    if (!stage) return null;

    const lab = root.querySelector('#lab');
    const big = root.querySelector('#big');
    const small = root.querySelector('#small');
    const divider = root.querySelector('#div');
    const dvLine = divider.querySelector('i');
    const dvDiamond = divider.querySelector('b');
    const mand = root.querySelector('#mand');

    let u = 1;
    let currentP = 0;
    let alive = true;
    let prepared = false;
    let bigWords = [];
    let smallWords = [];
    let unsubscribe = () => {};

    if (reduced) stage.classList.add('reduced');

    function frame(p) {
      currentP = p;
      lab.style.opacity = reduced ? '1' : String(seg(p, .02, .12));

      if (prepared) {
        const count = bigWords.length;
        bigWords.forEach((el, i) => {
          const a = .10 + (i / count) * .46;
          const t = reduced ? 1 : seg(p, a, a + .07);
          el.style.opacity = String(.16 + .84 * t);
          if (el.classList.contains('k')) {
            el.style.setProperty('--k', String(reduced ? 1 : seg(p, a + .02, a + .10)));
          }
        });
      }

      dvLine.style.transform = `scaleX(${reduced ? 1 : seg(p, .60, .70)})`;
      dvDiamond.style.transform = `scale(${reduced ? 1 : seg(p, .66, .72)})`;

      if (prepared) {
        const count = smallWords.length;
        smallWords.forEach((el, i) => {
          const a = .68 + (i / count) * .20;
          const t = reduced ? 1 : seg(p, a, a + .06);
          el.style.opacity = String(.16 + .84 * t);
        });
      }

      mand.style.transform = reduced
        ? `translateY(${-70 * u}px)`
        : `translateY(${-70 * u * p}px) rotate(${p * 40}deg)`;
    }

    function prepare() {
      if (prepared || !alive) return;
      bigWords = splitWords(big);
      smallWords = splitWords(small);
      prepared = true;
      big.style.opacity = '1';
      small.style.opacity = '1';
      frame(currentP);
    }

    function layout() {
      const h = Math.max(1, stage.getBoundingClientRect().height);
      u = h / 844;
      stage.style.setProperty('--u', String(u));
      root.style.height = `${h * 2.6}px`;
      frame(currentP);
    }

    window.addEventListener('resize', layout);
    layout();
    unsubscribe = scrub(root, frame);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { prepare(); layout(); });
    } else {
      prepare();
    }

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
