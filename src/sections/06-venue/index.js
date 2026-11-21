import { clamp, seg } from '../../core/util.js';
import { scrub } from '../../core/scroll.js';
import './venue.css';

const n = v => Number(v.toFixed(2));

export default {
  id: '06-venue',
  height: '220svh',

  html(content) {
    const c = content?.content ?? content;
    const v = c.venue;
    const embed = v.embedUrl.replace(/&/g, '&amp;');
    return `
<div class="stage" id="vs">
  <div class="vig" aria-hidden="true"></div>
  <p class="vl label gut" id="vl">${v.label}</p>
  <p class="va gut" id="va"><span><b>${v.lines[0]}</b></span><span><b>${v.lines[1]}</b></span></p>
  <div class="mapw" id="mapw">
    <iframe class="mapf" id="mapf" title="Map of the venue" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${embed}"></iframe>
    <svg class="route" viewBox="0 0 390 336" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none"><path id="rt" pathLength="1" d="M-6 20C70 40 40 110 120 130S170 175 195 168" stroke="#B25D17" stroke-width="2.4" stroke-linecap="round" style="stroke-dasharray:.004 .016"/></svg>
    <div class="ring" aria-hidden="true"></div><div class="ring r2" aria-hidden="true"></div>
    <svg class="pin" id="pin" viewBox="0 0 34 44" aria-hidden="true"><path d="M17 43C9 30 3 24 3 16A14 14 0 0 1 31 16C31 24 25 30 17 43Z" fill="var(--saffron)" stroke="var(--ink)" stroke-width="2"/><circle cx="17" cy="16" r="5.5" fill="var(--ink)"/></svg>
    <button class="lock" id="lock" type="button"><span>${v.hint}</span></button>
  </div>
  <div class="vb gut" id="vb"><a class="btn fill" href="${v.directionsUrl}" target="_blank" rel="noopener">${v.directionsLabel}</a><button class="btn" id="copy" type="button">${v.copyLabel}</button></div>
  <div class="grain" aria-hidden="true"></div>
</div>`;
  },

  mount({ root, content, reduced }) {
    const stage = root.querySelector('#vs');
    if (!stage) return null;
    const c = content?.content ?? content;
    const v = c.venue;

    const label = root.querySelector('#vl');
    const lines = [...root.querySelectorAll('#va b')];
    const mapw = root.querySelector('#mapw');
    const iframe = root.querySelector('#mapf');
    const route = root.querySelector('#rt');
    const pin = root.querySelector('#pin');
    const buttons = root.querySelector('#vb');
    const lock = root.querySelector('#lock');
    const copy = root.querySelector('#copy');

    let u = 1;
    let currentP = 0;
    let unlocked = false;
    let alive = true;
    let copyTimer = 0;

    if (reduced) root.classList.add('reduced');

    function apply(p) {
      label.style.opacity = String(reduced ? 1 : seg(p, .02, .10));
      lines.forEach((el, i) => {
        const t = reduced ? 1 : seg(p, .05 + i * .06, .16 + i * .06);
        el.style.transform = `translateY(${n((1 - t) * 110)}%)`;
      });

      const iris = reduced ? 1 : seg(p, .12, .50);
      const radius = iris * Math.hypot(stage.clientWidth, 336 * u) * .75;
      mapw.style.clipPath = `circle(${n(radius)}px at 50% 50%)`;

      route.style.strokeDashoffset = String(n(reduced ? 0 : 1 - seg(p, .30, .62)));

      const drop = reduced ? 1 : seg(p, .58, .70);
      pin.style.opacity = String(n(clamp(drop * 3, 0, 1)));
      pin.style.transform = `translateY(${n((1 - drop) * -70)}px)`;
      root.classList.toggle('go', !reduced && drop > .9);

      const shown = reduced ? 1 : seg(p, .66, .78);
      buttons.style.opacity = String(n(shown));
      buttons.style.transform = `translateY(${n((1 - shown) * 14)}px)`;
      buttons.style.pointerEvents = shown >= .5 ? 'auto' : 'none';
    }

    function layout() {
      const h = Math.max(1, stage.getBoundingClientRect().height);
      u = h / 844;
      stage.style.setProperty('--u', String(u));
      root.style.height = `${h * 2.2}px`;
      apply(currentP);
    }

    function unlock() {
      unlocked = true;
      iframe.style.pointerEvents = 'auto';
      lock.classList.add('off');
    }

    function relock() {
      if (!unlocked) return;
      unlocked = false;
      iframe.style.pointerEvents = 'none';
      lock.classList.remove('off');
    }

    function copied() {
      copy.textContent = v.copiedLabel;
      clearTimeout(copyTimer);
      copyTimer = window.setTimeout(() => { copy.textContent = v.copyLabel; }, 1600);
    }

    async function onCopy() {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
        await navigator.clipboard.writeText(v.copyText);
        copied();
      } catch {
        const ta = document.createElement('textarea');
        ta.value = v.copyText;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch { /* ignore */ }
        ta.remove();
        if (ok) copied();
      }
    }

    lock.addEventListener('click', unlock);
    copy.addEventListener('click', onCopy);
    const io = new IntersectionObserver(entries => {
      if (entries[entries.length - 1].intersectionRatio < .3) relock();
    }, { threshold: [0, .3] });
    io.observe(root);

    window.addEventListener('resize', layout);
    layout();
    const unsubscribe = scrub(root, apply);
    if (document.fonts?.ready) document.fonts.ready.then(() => { if (alive) layout(); });

    return {
      destroy() {
        alive = false;
        clearTimeout(copyTimer);
        lock.removeEventListener('click', unlock);
        copy.removeEventListener('click', onCopy);
        io.disconnect();
        window.removeEventListener('resize', layout);
        unsubscribe();
      },
    };
  },
};
