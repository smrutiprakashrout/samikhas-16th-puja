import { createTimeline } from 'animejs';
import { audio, mountMuteButton } from '../../core/audio.js';
import './style.css';
import doorSvg from './door.svg?raw';

// door.svg uses {{p}} as an id prefix so both doors can be inlined with unique ids.
const doorBody = doorSvg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const art = prefix => doorBody.replaceAll('{{p}}', prefix);

const RAD = Math.PI * 2;
const emberGold = '#F5B74E';
const speckWhite = '#FFFFFF';

function paintRays(el) {
  const seeds = [3, 7, 2, 9, 4, 6, 2, 8, 3, 5, 2, 7, 4, 6];
  const stops = [];
  for (let i = 0; i < 14; i++) {
    const w = seeds[i] * .9;
    const start = i * 25.7 + (seeds[(i + 3) % 14] - 5);
    stops.push(`rgba(255,240,200,.6) ${start}deg ${start + w}deg`);
    stops.push(`transparent ${start + w}deg ${start + 25.7}deg`);
  }
  el.style.background = `conic-gradient(from 0deg,${stops.join(',')})`;
}

export default {
  id: '00-gate',

  html(content) {
    const g = content?.content ?? content;
    return `
<div class="gate" id="gate" role="button" tabindex="0" aria-label="${g.gate.ariaLabel}">
  <div class="light"><div class="rays" id="rays"></div><div class="core"></div></div>
  <div class="door door-l"><div class="face"><svg class="art" viewBox="0 0 195 844" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">${art('gl')}</svg><div class="dt"><span>${g.gate.numeral}<sup>${g.gate.suffix}</sup></span></div></div></div>
  <div class="door door-r"><div class="face flip"><svg class="art" viewBox="0 0 195 844" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">${art('gr')}</svg><div class="dt"><span>${g.gate.numeral}<sup>${g.gate.suffix}</sup></span></div></div></div>
  <canvas id="embers" aria-hidden="true"></canvas>
  <canvas id="specks" aria-hidden="true"></canvas>
  <div class="streak"></div><div class="bloom"></div>
  <div class="seam"></div><div class="shock"></div>
  <div class="gate-ui top"><p class="label">${g.gate.kicker}</p></div>
  <div class="gate-ui bot"><span class="tap"><span class="label">${g.gate.cta}</span><i></i></span></div>
  <div class="flood"></div>
</div>`;
  },

  mount({ root, content, reduced, stage }) {
    const gate = root.querySelector('#gate');
    if (!gate) return null;

    const embers = gate.querySelector('#embers');
    const specksCanvas = gate.querySelector('#specks');
    const ex = embers.getContext('2d');
    const sx = specksCanvas.getContext('2d');
    const rays = gate.querySelector('#rays');
    const doorL = gate.querySelector('.door-l');
    const doorR = gate.querySelector('.door-r');
    const flood = gate.querySelector('.flood');
    const page = document.getElementById('page');
    const scenes = document.getElementById('scenes');

    let vw = 0;
    let vh = 0;
    let embersList = [];
    let specks = [];
    let emberRaf = 0;
    let speckRaf = 0;
    let opened = false;
    let timeline = null;

    paintRays(rays);

    function resizeCanvases() {
      const rect = gate.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      vw = Math.max(1, rect.width);
      vh = Math.max(1, rect.height);
      embers.width = specksCanvas.width = Math.round(vw * dpr);
      embers.height = specksCanvas.height = Math.round(vh * dpr);
      ex.setTransform(dpr, 0, 0, dpr, 0, 0);
      sx.setTransform(dpr, 0, 0, dpr, 0, 0);
      embersList = Array.from({ length: 34 }, (_, i) => ({
        x: Math.random() * vw,
        y: Math.random() * vh,
        r: .5 + Math.random() * 1.5,
        v: .12 + Math.random() * .35,
        phase: Math.random() * RAD,
        color: i % 2 ? emberGold : speckWhite,
      }));
    }

    function drawEmbers(t) {
      ex.clearRect(0, 0, vw, vh);
      for (const e of embersList) {
        e.y -= e.v;
        if (e.y < -4) { e.y = vh + 4; e.x = Math.random() * vw; }
        ex.globalAlpha = .3 + .5 * Math.abs(Math.sin(t / 900 + e.phase));
        ex.fillStyle = e.color;
        ex.beginPath();
        ex.arc(e.x + Math.sin(t / 1400 + e.phase) * 8, e.y, e.r, 0, RAD);
        ex.fill();
      }
      ex.globalAlpha = 1;
      if (!opened) emberRaf = requestAnimationFrame(drawEmbers);
    }

    function stopEmbers() {
      if (emberRaf) cancelAnimationFrame(emberRaf);
      emberRaf = 0;
    }

    function specksRun() {
      for (let i = 0; i < 26; i++) {
        const a = (Math.random() - .5) * 2.4 + (Math.random() < .5 ? 0 : Math.PI);
        specks.push({
          x: vw / 2,
          y: vh * (.2 + Math.random() * .6),
          vx: Math.cos(a) * (1 + Math.random() * 2.4),
          vy: (Math.random() - .5) * .8,
          r: .5 + Math.random() * 1.6,
        });
      }
      const t0 = performance.now();
      const step = now => {
        const age = (now - t0) / 1000;
        sx.clearRect(0, 0, vw, vh);
        if (age > 3.2) { speckRaf = 0; return; }
        sx.globalAlpha = Math.max(0, .9 - age * .3);
        sx.fillStyle = speckWhite;
        for (const s of specks) {
          s.x += s.vx;
          s.y += s.vy;
          s.vx *= .992;
          sx.beginPath();
          sx.arc(s.x, s.y, s.r, 0, RAD);
          sx.fill();
        }
        sx.globalAlpha = 1;
        speckRaf = requestAnimationFrame(step);
      };
      speckRaf = requestAnimationFrame(step);
    }

    function stopSpecks() {
      if (speckRaf) cancelAnimationFrame(speckRaf);
      speckRaf = 0;
      specks = [];
      sx.clearRect(0, 0, vw, vh);
    }

    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
    if (!reduced) emberRaf = requestAnimationFrame(drawEmbers);

    // Do not flash the numeral before the display font is available.
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    let fontTimer;
    Promise.race([fonts, new Promise(resolve => { fontTimer = setTimeout(resolve, 1500); })])
      .then(() => { clearTimeout(fontTimer); gate.classList.add('ready'); });

    function tilt(event) {
      if (reduced || opened) return;
      const rect = gate.getBoundingClientRect();
      const x = 50 + ((event.clientX - rect.left) / rect.width - .5) * 30;
      const y = 50 + ((event.clientY - rect.top) / rect.height - .5) * 20;
      gate.style.perspectiveOrigin = `${x}% ${y}%`;
    }
    gate.addEventListener('pointermove', tilt);

    function handoff({ clear = true } = {}) {
      if (clear) gate.classList.add('clear');
      stage?.classList.add('entered');
      page.style.pointerEvents = '';
      document.dispatchEvent(new CustomEvent('gate:opened'));
      document.documentElement.classList.remove('locked');
      mountMuteButton().show();
      scenes.setAttribute('tabindex', '-1');
      scenes.focus({ preventScroll: true });
    }

    function removeGate() {
      gate.classList.remove('opening');
      stopEmbers();
      stopSpecks();
      window.removeEventListener('resize', resizeCanvases);
      gate.remove();
    }

    function open() {
      if (opened) return;
      opened = true;
      if (!reduced) gate.classList.add('latch');
      document.documentElement.classList.add('locked');
      page.style.pointerEvents = 'none';
      gate.style.pointerEvents = 'auto';
      // Frame of slack keeps Chromium's rAF timestamp ahead of audio.js's baseline.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        audio.start();
        if (!reduced) audio.sfx('bell');
      }));

      if (reduced) {
        // Keep the artwork visible during the crossfade; .clear would hide it instantly.
        handoff({ clear: false });
        timeline = createTimeline({ autoplay: false })
          .add(gate, { opacity: [1, 0], duration: 400, ease: 'linear' }, 0)
          .call(removeGate, 500)
          .play();
        return;
      }

      timeline = createTimeline({ autoplay: false })
        .call(() => {
          gate.classList.remove('latch');
          gate.classList.add('opening');
          specksRun();
        }, 120)
        .call(handoff, 3020)
        .call(removeGate, 5000)
        .play();
    }

    function onKey(event) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        open();
      }
    }
    gate.addEventListener('click', open);
    gate.addEventListener('keydown', onKey);

    return {
      destroy() {
        timeline?.pause();
        stopEmbers();
        stopSpecks();
        window.removeEventListener('resize', resizeCanvases);
        gate.remove();
        page.style.pointerEvents = '';
      },
      open,
    };
  },
};
