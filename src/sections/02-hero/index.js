import { clamp, seg } from '../../core/util.js';
import { scrub } from '../../core/scroll.js';
import { createAmbience } from '../01-ganesha/ambience.js';
import './style.css';

function archSvg() {
  return `
  <svg class="fillsvg" id="fillsvg" viewBox="0 0 288 414" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="nf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--sand-lt)"/>
        <stop offset=".6" stop-color="color-mix(in srgb,var(--sand-lt) 35%,var(--sand))"/>
        <stop offset="1" stop-color="var(--sand)"/>
      </linearGradient>
      <radialGradient id="nr" cx=".5" cy=".28" r=".6">
        <stop offset="0" stop-color="var(--flood)" stop-opacity=".95"/>
        <stop offset="1" stop-color="var(--flood)" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <path d="M0 414V145A144 144 0 0 1 288 145V414Z" fill="url(#nf)"/>
    <path d="M0 414V145A144 144 0 0 1 288 145V414Z" fill="url(#nr)"/>
  </svg>
  <svg class="line" viewBox="0 0 288 414" preserveAspectRatio="none" aria-hidden="true" fill="none">
    <path class="draw" id="ln" pathLength="1" d="M1 414V145A143 143 0 0 1 287 145V414" stroke="var(--wood)" stroke-width="1.3"/>
  </svg>
  <svg class="dots" viewBox="-12 -12 312 438" preserveAspectRatio="none" aria-hidden="true" fill="none">
    <path class="draw" id="ln2" pathLength="1" d="M-11 414V145A155 155 0 0 1 299 145V414" stroke="var(--gold)" stroke-width="1.6" stroke-dasharray="0.002 0.0125" stroke-linecap="round"/>
  </svg>`;
}

export default {
  id: '02-hero',
  height: '320vh',

  html(content) {
    const c = content?.content ?? content;
    const words = c.title.text.split(' ');
    const titleHtml = words
      .map((word, i) => `<span class="w">${i === words.length - 1 ? `<em>${word}</em>` : word}</span>`)
      .join(' ');
    const letters = [...c.honoree.first].map(ch => `<span class="ch">${ch}</span>`).join('');
    const digits = String(c.title.number);

    return `
<div class="stage" style="position:sticky;top:0;height:100svh">
  <div class="glow" id="glow" aria-hidden="true"></div><div class="vig" aria-hidden="true"></div><div class="grain" aria-hidden="true"></div>
  <canvas id="motes" aria-hidden="true"></canvas><div id="petals" aria-hidden="true"></div>
  <h2 class="sr-only">${c.title.number}${c.title.suffix} ${c.title.text}</h2>
  <div class="arch" id="arch" aria-hidden="true">${archSvg()}</div>
  <div class="base" id="base" aria-hidden="true"></div>
  <div class="dg d1" id="d1" aria-hidden="true">${digits[0]}</div>
  <div class="dg d6" id="d6" aria-hidden="true">${digits[1]}</div>
  <div class="th" id="th" aria-hidden="true">${c.title.suffix}</div>
  <div class="her" id="her"><img src="${c.honoree.photo}" alt="${c.honoree.photoAlt}" width="700" height="1171" decoding="async"></div>
  <p class="tx t1" id="t1">${titleHtml}</p>
  <p class="tx t2" id="t2" aria-label="${c.honoree.first}">${letters}</p>
  <p class="tx t3 label" id="t3"><i aria-hidden="true"></i><span id="t3s">${c.honoree.rest}</span><i aria-hidden="true"></i></p>
</div>`;
  },

  mount({ root, reduced }) {
    const stage = root.querySelector('.stage');
    if (!stage) return null;

    const glow = root.querySelector('#glow');
    const ln = root.querySelector('#ln');
    const ln2 = root.querySelector('#ln2');
    const fill = root.querySelector('#fillsvg');
    const base = root.querySelector('#base');
    const her = root.querySelector('#her');
    const d1 = root.querySelector('#d1');
    const d6 = root.querySelector('#d6');
    const th = root.querySelector('#th');
    const t3s = root.querySelector('#t3s');
    const wordEls = [...root.querySelectorAll('#t1 .w')];
    const charEls = [...root.querySelectorAll('#t2 .ch')];
    const ruleEls = [...root.querySelectorAll('#t3 i')];

    let u = 1;
    let currentP = 0;
    let visible = true;
    let alive = true;
    let observer;
    let unsubscribe = () => {};

    if (reduced) {
      stage.classList.add('reduced');
      requestAnimationFrame(() => { if (alive) stage.classList.add('entered'); });
    }

    const ambience = createAmbience({
      stage,
      canvas: root.querySelector('#motes'),
      petals: root.querySelector('#petals'),
      reduced,
      count: 12,
      front: 3,
      isActive: () => visible,
    });

    function endState() {
      glow.style.transform = 'none';
      ln.style.strokeDashoffset = '0';
      ln2.style.strokeDashoffset = '0';
      ln2.style.strokeDasharray = '1 1';
      base.style.transform = 'scaleX(1)';
      her.style.transform = 'none';
      d1.style.transform = 'none';
      d6.style.transform = 'none';
      th.style.transform = 'none';
      for (const el of wordEls) el.style.transform = 'none';
      for (const el of charEls) el.style.transform = 'none';
      for (const el of ruleEls) el.style.transform = 'scaleX(1)';
    }

    function frame(p) {
      currentP = p;
      if (reduced) { endState(); return; }

      const a = seg(p, .04, .26);
      const r = seg(p, .20, .46);
      const dr = seg(p, .46, 1);

      glow.style.opacity = String(seg(p, 0, .12));
      glow.style.transform = `translateY(${-6 * dr}px)`;

      ln.style.strokeDashoffset = String(1 - a);
      ln2.style.opacity = a > 0 ? '1' : '0';
      ln2.style.strokeDashoffset = '0';
      ln2.style.strokeDasharray = `${a} 1`;

      fill.style.opacity = String(seg(p, .12, .30));
      base.style.transform = `scaleX(${seg(p, .04, .20)})`;

      her.style.opacity = String(clamp(r * 1.6, 0, 1));
      her.style.transform = `translateY(${(1 - r) * 160 * u - 24 * u * dr}px) scale(${1.06 - .06 * r})`;

      const e1 = seg(p, .34, .46);
      const e6 = seg(p, .40, .52);
      const et = seg(p, .50, .58);
      d1.style.opacity = String(e1);
      d1.style.transform = `translateY(${(1 - e1) * 40 * u - 10 * u * dr}px)`;
      d6.style.opacity = String(e6);
      d6.style.transform = `translateY(${(1 - e6) * 40 * u - 10 * u * dr}px)`;
      th.style.opacity = String(et);
      th.style.transform = `translateY(${-10 * u * dr}px) scale(${.6 + .4 * et})`;

      wordEls.forEach((el, i) => {
        const t = seg(p, .50 + i * .05, .58 + i * .05);
        el.style.opacity = String(t);
        el.style.transform = `translateY(${(1 - t) * 12}px)`;
      });
      charEls.forEach((el, i) => {
        const t = seg(p, .60 + i * .012, .66 + i * .012);
        el.style.opacity = String(t);
        el.style.transform = `translateY(${(1 - t) * 24}px)`;
      });

      const s3 = seg(p, .70, .80);
      t3s.style.opacity = String(s3);
      for (const el of ruleEls) el.style.transform = `scaleX(${s3})`;
    }

    function layout() {
      const h = Math.max(1, stage.getBoundingClientRect().height);
      u = h / 844;
      stage.style.setProperty('--u', String(u));
      root.style.height = `${h * 3.2}px`;
      ambience.resize();
      frame(currentP);
    }

    observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
      ambience.sync();
    }, { threshold: 0 });
    observer.observe(stage);

    layout();
    if (document.fonts?.ready) document.fonts.ready.then(() => { if (alive) layout(); });
    unsubscribe = scrub(root, frame);

    return {
      stage,
      destroy() {
        alive = false;
        observer.disconnect();
        unsubscribe();
        ambience.destroy();
      },
    };
  },
};
