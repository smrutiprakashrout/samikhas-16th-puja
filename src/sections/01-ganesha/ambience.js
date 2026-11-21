// Shared S01 ambience modules: grain/vignette CSS, gold dust and falling petals.
import './ambience.css';
import { rnd } from './art.js';

const PETAL_COLORS = ['var(--marigold)', 'var(--saffron)', 'var(--ivory)', 'var(--marigold)', 'var(--saffron)'];

export function petalMarkup(count = 14, front = 4) {
  let html = '';
  for (let i = 0; i < count; i++) {
    const isFront = i < front;
    const s = isFront ? 16 + Math.round(rnd() * 4) : 9 + Math.round(rnd() * 7);
    const t = isFront ? 19 + rnd() * 5 : 26 + rnd() * 10;
    html += `<div class="pt" style="--x:${(4 + rnd() * 92).toFixed(0)}%;--s:${s}px;--t:${t.toFixed(1)}s;--dl:-${(rnd() * 30).toFixed(1)}s;--c:${PETAL_COLORS[i % 5]};--b:${isFront ? '1.6px' : '0px'};--z:${isFront ? 25 : 5}"></div>`;
  }
  return html;
}

export function createAmbience({ stage, canvas, petals, reduced, count = 14, front = 4, isActive }) {
  const mx = canvas.getContext('2d');
  petals.innerHTML = petalMarkup(count, front);
  const petalEls = [...petals.querySelectorAll('.pt')];

  let mw = 0;
  let mh = 0;
  let motes = [];
  let raf = 0;
  let alive = true;

  function active() {
    return !!isActive?.() && !reduced;
  }

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    mw = Math.max(1, stage.clientWidth);
    mh = Math.max(1, stage.clientHeight);
    canvas.width = Math.round(mw * dpr);
    canvas.height = Math.round(mh * dpr);
    mx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const marigold = getComputedStyle(document.documentElement).getPropertyValue('--marigold').trim() || '#F5B74E';
    motes = Array.from({ length: 38 }, (_, i) => ({
      x: Math.random() * mw,
      y: Math.random() * mh,
      r: .5 + Math.random() * 1.5,
      v: .1 + Math.random() * .3,
      s: Math.random() * 6,
      c: i % 3 ? marigold : '#FFFFFF',
    }));
  }

  function draw(t) {
    if (!alive || !active()) { raf = 0; return; }
    mx.clearRect(0, 0, mw, mh);
    for (const m of motes) {
      m.y -= m.v;
      if (m.y < -4) { m.y = mh + 4; m.x = Math.random() * mw; }
      mx.globalAlpha = .2 + .5 * Math.abs(Math.sin(t / 1000 + m.s));
      mx.fillStyle = m.c;
      mx.beginPath();
      mx.arc(m.x + Math.sin(t / 1700 + m.s) * 7, m.y, m.r, 0, Math.PI * 2);
      mx.fill();
    }
    mx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }

  function sync() {
    const on = active();
    if (on && !raf) raf = requestAnimationFrame(draw);
    if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
    const play = on ? 'running' : 'paused';
    for (const el of petalEls) el.style.animationPlayState = play;
  }

  resize();
  sync();

  return {
    resize,
    sync,
    destroy() {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
