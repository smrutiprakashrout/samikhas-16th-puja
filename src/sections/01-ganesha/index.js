import { seg } from '../../core/util.js';
import { scrub } from '../../core/scroll.js';
import { buildGarlands, haloSvg, lotusBack, lotusFront } from './art.js';
import { createAmbience } from './ambience.js';
import './style.css';

const RAYS = [3, 7, 2, 9, 4, 6, 2, 8, 3, 5, 2, 7, 4, 6];

function paintRays(el) {
  const stops = [];
  for (let i = 0; i < 14; i++) {
    const w = RAYS[i] * .9;
    const start = i * 25.7 + (RAYS[(i + 3) % 14] - 5);
    stops.push(`rgba(255,249,236,.13) ${start}deg ${start + w}deg`);
    stops.push(`transparent ${start + w}deg ${start + 25.7}deg`);
  }
  el.style.background = `conic-gradient(from 0deg,${stops.join(',')})`;
}

export default {
  id: '01-ganesha',
  height: '420vh',

  html(content) {
    const c = content?.content ?? content;
    return `
<div class="stage" style="position:sticky;top:0;height:100svh">
  <div class="glow" aria-hidden="true"></div><div class="rays2" id="rays2" aria-hidden="true"></div>
  <div class="vig" aria-hidden="true"></div><div class="grain" aria-hidden="true"></div>
  <canvas id="motes" aria-hidden="true"></canvas>
  <div id="petals" aria-hidden="true"></div>
  <p class="t label kicker">${c.invocation.label}</p>
  <p class="t odia-t">${c.invocation.sanskrit}</p>
  <div class="hg" id="hg"><div class="hrise">
      ${haloSvg()} ${lotusBack()} <div class="gshadow" aria-hidden="true"></div>
      <img src="${c.shloka.image}" alt="Lord Ganesha on his mouse">
      ${lotusFront()}
  </div></div>
  <div class="shloka" id="shloka">${c.shloka.lines.map(line => `<p>${line}</p>`).join('')}</div>
  <div class="divider" id="divider" aria-hidden="true"><i></i><b></b></div>
  <p class="meaning" id="meaning">${c.shloka.meaning}</p>
  <div class="hint label" id="hint">Scroll<i aria-hidden="true"></i></div>
  <svg class="garl" id="garl" viewBox="0 0 390 400" aria-hidden="true">
    <g class="drop sw0" id="gT"><g id="gTin"></g></g>
    <g class="drop sw1 d2" id="gL"></g>
    <g class="drop sw2 d3" id="gR"></g>
  </svg>
</div>`;
  },

  mount({ root, reduced }) {
    const stage = root.querySelector('.stage');
    if (!stage) return null;

    const hg = root.querySelector('#hg');
    const shlokaLines = [...root.querySelectorAll('#shloka p')];
    const divider = root.querySelector('#divider');
    const dvLine = divider.querySelector('i');
    const dvDiamond = divider.querySelector('b');
    const meaning = root.querySelector('#meaning');
    const hint = root.querySelector('#hint');
    const garl = root.querySelector('#garl');
    const rays2 = root.querySelector('#rays2');
    const motesCanvas = root.querySelector('#motes');
    const petalsBox = root.querySelector('#petals');
    const textLayers = [...stage.querySelectorAll('.kicker,.odia-t')];

    if (reduced) stage.classList.add('reduced');
    paintRays(rays2);
    buildGarlands(root.querySelector('#gTin'), root.querySelector('#gL'), root.querySelector('#gR'));

    const words = meaning.textContent.split(' ');
    meaning.innerHTML = words.map(word => `<span class="w">${word}</span>`).join(' ');
    const wordEls = [...meaning.querySelectorAll('.w')];

    let u = 1;
    let currentP = 0;
    let started = false;
    let visible = true;
    let alive = true;
    let observer;
    let unsubscribe = () => {};

    const ambience = createAmbience({
      stage,
      canvas: motesCanvas,
      petals: petalsBox,
      reduced,
      isActive: () => started && visible,
    });

    function applyReduced() {
      hg.style.transform = `translateY(${-34 * u}px) scale(.6)`;
      hg.style.opacity = '1';
      for (const el of shlokaLines) {
        el.style.clipPath = 'inset(0)';
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
      dvLine.style.transform = 'scaleX(1)';
      dvDiamond.style.transform = 'scale(1)';
      divider.style.opacity = '1';
      divider.style.transform = 'none';
      for (const el of wordEls) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
      meaning.style.opacity = '1';
      meaning.style.transform = 'none';
      hint.style.opacity = '0';
      garl.style.transform = 'none';
      rays2.style.transform = 'none';
      for (const el of textLayers) {
        el.style.translate = 'none';
        el.style.opacity = '';
      }
    }

    function apply(p) {
      currentP = p;
      if (reduced) { applyReduced(); return; }
      const e1 = seg(p, .08, .40);
      const ex = seg(p, .86, 1);
      const scale = 1 - .4 * e1;

      hg.style.transform = `translateY(${-34 * u * e1 - 60 * ex}px) scale(${scale})`;
      hg.style.opacity = String(1 - ex);

      shlokaLines.forEach((el, i) => {
        const t = seg(p, .22 + i * .085, .32 + i * .085);
        el.style.clipPath = `inset(0 ${((1 - t) * 100).toFixed(2)}% 0 0)`;
        el.style.opacity = t > 0 ? '1' : '0';
        el.style.transform = `translateY(${(1 - t) * 8 - 60 * ex}px)`;
      });

      dvLine.style.transform = `scaleX(${seg(p, .54, .66)})`;
      dvDiamond.style.transform = `scale(${seg(p, .60, .66)})`;
      divider.style.opacity = String(1 - ex);
      divider.style.transform = `translateY(${-60 * ex}px)`;

      wordEls.forEach((el, i) => {
        const a = .62 + i / wordEls.length * .1;
        const t = seg(p, a, a + .035);
        el.style.opacity = String(t);
        el.style.transform = `translateY(${(1 - t) * 8}px)`;
      });
      meaning.style.opacity = String(1 - ex);
      meaning.style.transform = `translateY(${-60 * ex}px)`;

      hint.style.opacity = started && p < .12 ? String(1 - p / .12) : '0';
      garl.style.transform = `translateY(${-30 * e1 - 130 * ex}px)`;
      rays2.style.transform = `rotate(${p * 40}deg)`;
      for (const el of textLayers) {
        el.style.translate = `0 ${-60 * ex}px`;
        el.style.opacity = started ? String(1 - ex) : '';
      }
    }

    function layout() {
      const rect = stage.getBoundingClientRect();
      const h = Math.max(1, rect.height);
      const w = Math.max(1, rect.width);
      u = h / 844;
      const gw = Math.min(270 * u, .69 * w);
      stage.style.setProperty('--u', String(u));
      hg.style.setProperty('--gw', `${gw}px`);
      hg.style.setProperty('--gh', `${gw * 1190 / 800}px`);
      root.style.height = `${h * 4.2}px`;
      ambience.resize();
      apply(currentP);
    }

    function enter() {
      if (started) return;
      started = true;
      stage.classList.add('entered');
      ambience.sync();
      apply(currentP);
    }

    function reset() {
      started = false;
      stage.classList.remove('entered');
      currentP = 0;
      ambience.sync();
      apply(0);
    }

    document.addEventListener('gate:opened', enter);
    window.addEventListener('resize', layout);
    observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
      ambience.sync();
    }, { threshold: 0 });
    observer.observe(stage);

    layout();
    if (document.fonts?.ready) document.fonts.ready.then(() => { if (alive) layout(); });
    unsubscribe = scrub(root, apply);

    return {
      stage,
      enter,
      reset,
      destroy() {
        alive = false;
        document.removeEventListener('gate:opened', enter);
        window.removeEventListener('resize', layout);
        observer.disconnect();
        unsubscribe();
        ambience.destroy();
      },
    };
  },
};
