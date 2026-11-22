import { clamp, seg } from '../../core/util.js';
import { scrub } from '../../core/scroll.js';
import './style.css';

const TAU = Math.PI * 2;
const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default {
  id: '05-date',

  html(content) {
    const c = content?.content ?? content;
    const d = c.date;
    const calendar = d.calendarUrl
      ? `<a class="btn" id="btn" href="${d.calendarUrl}" target="_blank" rel="noopener">${d.calendarLabel}</a>`
      : '';
    return `
<div class="stage" id="ds">
  <div class="shade" aria-hidden="true"></div>
  <div class="burst" id="burst" aria-hidden="true"></div>
  <div class="wrap" id="wrap">
    <div class="tkw" id="tkw"><div class="ticket" id="tk">
      <svg class="bd" id="bd" aria-hidden="true"><rect id="bdr" pathLength="1" fill="none" stroke="rgba(168,121,63,.55)" stroke-width="1"/></svg>
      <p class="tt label" id="tt">${d.label}<i></i></p>
      <div class="panel" id="panel">
        <div class="rev" aria-live="polite">
          <div class="n">${d.day}</div>
          <div class="m">${d.month}</div>
          <div class="d">${d.weekday}</div>
          <div class="r"></div>
          <div class="t">${d.time}<small>${d.timeNote}</small></div>
        </div>
        <canvas class="fc" id="fc" aria-hidden="true"></canvas>
        <div class="shim" aria-hidden="true"></div>
      </div>
      <div class="perf" id="perf" aria-hidden="true"></div>
      <div class="stubz">${calendar}</div>
    </div></div>
    <p class="hint label" id="hint"><span class="dot" aria-hidden="true"></span>${d.scratchHint}</p>
    <button class="rv" id="rv" type="button" disabled>${d.revealButton}</button>
  </div>
  <div class="grain" aria-hidden="true"></div>
</div>`;
  },

  mount({ root, content, reduced }) {
    const band = root;
    band.classList.remove('band');
    band.classList.add('date');
    band.id = 'date';
    const c = content?.content ?? content;
    const d = c.date;
    const stage = band.querySelector('#ds');
    const panel = band.querySelector('#panel');
    const fc = band.querySelector('#fc');
    const burst = band.querySelector('#burst');
    const hint = band.querySelector('#hint');
    const rv = band.querySelector('#rv');
    const tkw = band.querySelector('#tkw');
    const tk = band.querySelector('#tk');
    const bd = band.querySelector('#bd');
    const bdr = band.querySelector('#bdr');
    const tt = band.querySelector('#tt');
    const perf = band.querySelector('#perf');
    if (!stage || !panel || !fc) return null;

    const ctx = fc.getContext('2d');
    const tmp = document.createElement('canvas');
    tmp.width = 40;
    tmp.height = 26;
    const tx = tmp.getContext('2d', { willReadFrequently: true });

    let W = 0;
    let H = 0;
    let sw = 0;
    let sh = 0;
    let ox = 24.5;
    let oy = 626;
    let currentQ = 0;
    let alive = true;
    let done = false;
    let touched = false;
    let down = false;
    let lx = 0;
    let ly = 0;
    let moves = 0;

    function drawSpaced(text, cx, cy, spacing) {
      const chars = [...text];
      const widths = chars.map(ch => ctx.measureText(ch).width);
      const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
      let x = cx - total / 2;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      chars.forEach((ch, i) => {
        ctx.fillText(ch, x, cy);
        x += widths[i] + spacing;
      });
    }

    function foil() {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      W = panel.clientWidth;
      H = panel.clientHeight;
      fc.width = Math.round(W * ratio);
      fc.height = Math.round(H * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);

      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#F6DC9C');
      g.addColorStop(.28, '#E0AF70');
      g.addColorStop(.5, '#F8E2A8');
      g.addColorStop(.72, '#C98A3E');
      g.addColorStop(1, '#F1CB80');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const m = Math.min(W, H);
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.strokeStyle = 'rgba(110,76,40,.28)';
      ctx.lineWidth = 1;
      [m * .46, m * .40, m * .22].forEach(r => {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, TAU);
        ctx.stroke();
      });
      for (let i = 0; i < 16; i++) {
        ctx.save();
        ctx.rotate(i * Math.PI / 8);
        ctx.beginPath();
        const r0 = m * .23;
        const r1 = m * .40;
        ctx.moveTo(0, -r0);
        ctx.bezierCurveTo(14, -r0 - (r1 - r0) * .3, 14, -r1 + (r1 - r0) * .2, 0, -r1);
        ctx.bezierCurveTo(-14, -r1 + (r1 - r0) * .2, -14, -r0 - (r1 - r0) * .3, 0, -r0);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.strokeStyle = 'rgba(255,246,224,.55)';
      for (let j = 0; j < 16; j++) {
        ctx.save();
        ctx.rotate(j * Math.PI / 8);
        ctx.translate(0, .8);
        ctx.beginPath();
        ctx.moveTo(0, -m * .23);
        ctx.lineTo(0, -m * .40);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      for (let k = 0; k < 420; k++) {
        ctx.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,.55)' : 'rgba(110,76,40,.16)';
        ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 1.6 + .4, Math.random() * 1.6 + .4);
      }

      ctx.fillStyle = 'rgba(110,76,40,.75)';
      ctx.font = `500 11px ${cssVar('--sans') || '"DM Sans", sans-serif'}`;
      drawSpaced(d.scratchLabel, W / 2, H / 2, 3);
    }

    const seeds = [3, 7, 2, 9, 4, 6, 2, 8, 3, 5, 2, 7, 4, 6];
    let rays = '';
    for (let i = 0; i < 14; i++) {
      const w = seeds[i] * .9;
      const st = i * 25.7 + (seeds[(i + 3) % 14] - 5);
      rays += `rgba(255,243,208,.38) ${st}deg ${st + w}deg,transparent ${st + w}deg ${st + 25.7}deg,`;
    }
    burst.style.background = `conic-gradient(from 0deg,${rays.replace(/,$/, '')})`;

    function apply(q) {
      currentQ = q;
      const radius = Math.hypot(sw, sh) * 1.05;
      if (reduced) {
        stage.style.clipPath = `circle(${radius.toFixed(2)}px at ${ox.toFixed(2)}px ${oy.toFixed(2)}px)`;
        burst.style.opacity = '.5';
        tkw.style.opacity = '1';
        tkw.style.transform = 'none';
        tk.style.clipPath = 'inset(0 0 0 0)';
        bdr.style.strokeDashoffset = '0';
        tt.style.opacity = '1';
        tt.style.transform = 'none';
        panel.style.opacity = '1';
        panel.style.transform = 'none';
        perf.style.clipPath = 'inset(0 0 0 0)';
        hint.style.opacity = '1';
        rv.style.opacity = '1';
        stage.classList.add('on');
        rv.disabled = false;
        return;
      }
      stage.style.clipPath = `circle(${(seg(q, 0, .269) * radius).toFixed(2)}px at ${ox.toFixed(2)}px ${oy.toFixed(2)}px)`;
      burst.style.opacity = String(.5 * seg(q, .20, .34));
      const u = seg(q, .20, .40);
      tkw.style.opacity = String(clamp(u * 4, 0, 1));
      tkw.style.transform = `translateY(${((1 - u) * 40).toFixed(2)}px) rotate(${(-3 * (1 - u)).toFixed(2)}deg)`;
      tk.style.clipPath = `inset(${((1 - u) * 50).toFixed(2)}% 0 ${((1 - u) * 50).toFixed(2)}% 0)`;
      bdr.style.strokeDashoffset = String(1 - seg(q, .36, .50));
      const l = seg(q, .46, .54);
      tt.style.opacity = String(l);
      tt.style.transform = `translateY(${((1 - l) * 8).toFixed(2)}px)`;
      const pn = seg(q, .50, .60);
      panel.style.opacity = String(pn);
      panel.style.transform = `scale(${(.94 + .06 * pn).toFixed(4)})`;
      perf.style.clipPath = `inset(0 ${((1 - seg(q, .56, .64)) * 100).toFixed(2)}% 0 0)`;
      const h = seg(q, .62, .70);
      hint.style.opacity = String(h);
      rv.style.opacity = String(h);
      stage.classList.toggle('on', q > .62);
      rv.disabled = q <= .62;
    }

    function layout() {
      const h = Math.max(1, stage.clientHeight || stage.getBoundingClientRect().height);
      sw = stage.clientWidth || band.clientWidth;
      sh = h;
      stage.style.setProperty('--u', String(h / 844));
      band.style.height = `${h * 2.3}px`;
      band.style.marginTop = `${(-1.35 * h).toFixed(2)}px`;
      ox = (parseFloat(getComputedStyle(stage).paddingLeft) || 24) + .5;
      oy = 626 * (h / 844) + 15.5;
      const bw = Math.max(0, tk.clientWidth - 16);
      const bh = Math.max(0, tk.clientHeight - 16);
      bd.setAttribute('width', String(bw));
      bd.setAttribute('height', String(bh));
      bd.setAttribute('viewBox', `0 0 ${bw} ${bh}`);
      bdr.setAttribute('x', '.5');
      bdr.setAttribute('y', '.5');
      bdr.setAttribute('width', String(Math.max(0, bw - 1)));
      bdr.setAttribute('height', String(Math.max(0, bh - 1)));
      apply(currentQ);
    }

    function pos(e) {
      const r = fc.getBoundingClientRect();
      return [(e.clientX - r.left) * (W / r.width), (e.clientY - r.top) * (H / r.height)];
    }

    function dot(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, TAU);
      ctx.fill();
    }

    function cleared() {
      tx.clearRect(0, 0, 40, 26);
      tx.drawImage(fc, 0, 0, 40, 26);
      const data = tx.getImageData(0, 0, 40, 26).data;
      let count = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] < 60) count++;
      return count / (40 * 26);
    }

    function check() {
      if (cleared() > .45) reveal();
    }

    function reveal() {
      if (done) return;
      done = true;
      panel.classList.add('done');
      band.classList.add('done-all');
      try {
        if (navigator.userActivation?.hasBeenActive !== false) navigator.vibrate?.(30);
      } catch { /* ignore */ }
      if (reduced) return;

      const pr = panel.getBoundingClientRect();
      const br = band.getBoundingClientRect();
      const cx = pr.left + pr.width / 2 - br.left;
      const cy = pr.top + pr.height / 2 - br.top;
      const cols = [cssVar('--marigold'), cssVar('--ivory'), '#FFD58A', cssVar('--saffron-deep'), cssVar('--ivory')];
      for (let i = 0; i < 22; i++) {
        const petal = document.createElement('div');
        petal.className = 'pt';
        petal.style.left = `${cx}px`;
        petal.style.top = `${cy}px`;
        petal.style.background = cols[i % cols.length];
        band.appendChild(petal);
        const a = Math.random() * TAU;
        const dist = 90 + Math.random() * 150;
        const dx = Math.cos(a) * dist;
        const dy = Math.sin(a) * dist - 40;
        const animation = petal.animate([
          { transform: 'translate(0,0) rotate(0) scale(.4)', opacity: 1 },
          { transform: `translate(${dx}px,${dy}px) rotate(${Math.random() * 540}deg) scale(1)`, opacity: 1, offset: .55 },
          { transform: `translate(${dx * 1.1}px,${dy + 120}px) rotate(700deg) scale(.9)`, opacity: 0 },
        ], { duration: 1500 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
        animation.onfinish = () => petal.remove();
      }
    }

    function onDown(e) {
      if (done) return;
      down = true;
      touched = true;
      try { fc.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      const [x, y] = pos(e);
      lx = x;
      ly = y;
      dot(x, y);
      hint.style.opacity = '0';
    }

    function onMove(e) {
      if (!down || done) return;
      const [x, y] = pos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 30;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(x, y);
      ctx.stroke();
      lx = x;
      ly = y;
      if (++moves % 6 === 0) check();
    }

    function onUp() {
      if (!down) return;
      down = false;
      check();
    }

    function onResize() {
      if (!alive) return;
      layout();
      if (!done) foil();
    }

    fc.addEventListener('pointerdown', onDown);
    fc.addEventListener('pointermove', onMove);
    fc.addEventListener('pointerup', onUp);
    fc.addEventListener('pointercancel', () => { down = false; });
    rv.addEventListener('click', reveal);
    window.addEventListener('resize', onResize);
    if (document.fonts?.ready) document.fonts.ready.then(() => {
      if (!alive) return;
      layout();
      if (!done && !touched) foil();
    });

    layout();
    const unsubscribe = scrub(band, apply);
    foil();
    if (reduced) reveal();

    return {
      destroy() {
        alive = false;
        unsubscribe();
        fc.removeEventListener('pointerdown', onDown);
        fc.removeEventListener('pointermove', onMove);
        fc.removeEventListener('pointerup', onUp);
        rv.removeEventListener('click', reveal);
        window.removeEventListener('resize', onResize);
      },
    };
  },
};
