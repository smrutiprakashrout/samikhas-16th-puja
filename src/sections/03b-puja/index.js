import { seg } from '../../core/util.js';
import { scrub } from '../../core/scroll.js';
import kalash from '../../../assets/svg/kalash.svg?raw';
import './puja.css';

const n = v => Number(v.toFixed(2));

function clockSvg() {
  const ticks = Array.from({ length: 12 }, (_, h) => {
    const a = h * Math.PI / 6;
    const major = h % 3 === 0;
    const outer = 15.4;
    const inner = outer - (major ? 4.5 : 2);
    const x1 = 19 + outer * Math.sin(a);
    const y1 = 19 - outer * Math.cos(a);
    const x2 = 19 + inner * Math.sin(a);
    const y2 = 19 - inner * Math.cos(a);
    return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="var(--wood-dk)" stroke-width="${major ? 1.2 : .8}" opacity="${major ? 1 : .6}"/>`;
  }).join('');
  return `<svg class="ck" id="ck" viewBox="0 0 38 38" aria-hidden="true">
    <circle cx="19" cy="19" r="17.5" fill="var(--ivory)" stroke="var(--wood)" stroke-width="1.4"/>
    ${ticks}
    <line id="hh" class="hand" x1="19" y1="19" x2="19" y2="9.5" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>
    <line id="mh" class="hand" x1="19" y1="19" x2="19" y2="6" stroke="var(--ink)" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="19" cy="19" r="1.6" fill="var(--saffron-deep)"/>
  </svg>`;
}

function random(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default {
  id: '03b-puja',
  height: '240vh',

  html(content) {
    const c = content?.content ?? content;
    const p = c.puja;
    return `
<div class="stage" id="ps">
  <div class="disc" id="disc"></div>
  <div class="motes" id="motes" aria-hidden="true"></div>
  <div class="petals" id="ppetals" aria-hidden="true"></div>
  <p class="pd label" id="pd">${p.dateLine}</p>
  <div class="kal" id="kal">${kalash}</div>
  <h2 class="pt" id="pt"><span class="l1"><b>${p.title.pre}</b></span> <span class="l2"><b><em>${p.title.accent}</em></b></span></h2>
  <div class="dv" id="dv"><i class="a"></i><s></s><i class="b"></i></div>
  <div class="tm" id="tm"><span class="n">${p.time}</span><span class="m">${p.meridiem}</span></div>
  <p class="tn label" id="tn">${p.timeNote}</p>
  <div class="rl" id="rl"></div>
  <div class="ar" id="ar">
    ${clockSvg()}
    <p class="at"><span>${p.arrive.label}</span><strong>${p.arrive.time}</strong></p>
  </div>
  <div class="grain" aria-hidden="true"></div>
</div>`;
  },

  mount({ root, content, reduced }) {
    root.classList.add('puja');
    root.id = 'puja';
    const stage = root.querySelector('#ps');
    if (!stage) return null;

    const c = content?.content ?? content;
    const p = c.puja;
    const disc = root.querySelector('#disc');
    const dateLine = root.querySelector('#pd');
    const kal = root.querySelector('#kal');
    const coconut = root.querySelector('#coconut');
    const line1 = root.querySelector('.l1 b');
    const line2 = root.querySelector('.l2 b');
    const diamond = root.querySelector('#dv s');
    const dvA = root.querySelector('#dv .a');
    const dvB = root.querySelector('#dv .b');
    const numeral = root.querySelector('#tm .n');
    const meridiem = root.querySelector('#tm .m');
    const note = root.querySelector('#tn');
    const rule = root.querySelector('#rl');
    const clock = root.querySelector('#ck');
    const hourHand = root.querySelector('#hh');
    const minuteHand = root.querySelector('#mh');
    const arriveLabel = root.querySelector('.at span');
    const arriveTime = root.querySelector('.at strong');
    const petalBox = root.querySelector('#ppetals');
    const moteBox = root.querySelector('#motes');

    const leafOrder = [5, 6, 3, 4, 1, 2];
    const leafAngle = { 5: 38, 6: 38, 3: 52, 4: 52, 1: 62, 2: 62 };
    const leafSign = { 5: 1, 6: -1, 3: 1, 4: -1, 1: 1, 2: -1 };
    const leaves = leafOrder.map(id => root.querySelector(`#lf${id}`));
    const hourAngle = (p.arrive.hour % 12) * 30 + p.arrive.minute * .5;
    const minuteAngle = p.arrive.minute * 6;

    let u = 1;
    let currentP = 0;
    let alive = true;
    let unsubscribe = () => {};
    let observer = null;

    if (reduced) stage.classList.add('reduced');

    function apply(prog) {
      currentP = prog;
      const at = (a, b) => reduced ? 1 : seg(prog, a, b);

      disc.style.clipPath = `circle(${n(at(.02, .30) * 72)}% at 50% 50%)`;

      const d = at(.08, .18);
      dateLine.style.opacity = String(d);
      dateLine.style.transform = `translateY(${n((1 - d) * 8)}px)`;

      const k = at(.12, .34);
      kal.style.opacity = String(k);
      kal.style.transform = `translate(-50%,${n((1 - k) * 40 * u)}px)`;

      leaves.forEach((el, i) => {
        const id = leafOrder[i];
        const t = at(.22 + i * .02, .42 + i * .02);
        el.style.transform = `rotate(${n((1 - t) * leafSign[id] * leafAngle[id])}deg)`;
      });
      coconut.style.transform = `scale(${(.6 + .4 * at(.20, .32)).toFixed(4)})`;

      line1.style.transform = `translateY(${n((1 - at(.30, .42)) * 110)}%)`;
      line2.style.transform = `translateY(${n((1 - at(.34, .46)) * 110)}%)`;
      diamond.style.transform = `scale(${(at(.40, .46)).toFixed(4)})`;
      dvA.style.transform = `scaleX(${(at(.44, .50)).toFixed(4)})`;
      dvB.style.transform = `scaleX(${(at(.44, .50)).toFixed(4)})`;

      const nm = at(.46, .58);
      numeral.style.opacity = String(nm);
      numeral.style.transform = `translateY(${n((1 - nm) * 24 * u)}px)`;
      meridiem.style.opacity = String(at(.54, .62));
      note.style.opacity = String(at(.58, .66));
      rule.style.transform = `scaleX(${(at(.62, .72)).toFixed(4)})`;

      const cq = at(.70, .78);
      clock.style.opacity = String(cq);
      clock.style.transform = `scale(${(.8 + .2 * cq).toFixed(4)})`;
      hourHand.style.transform = `rotate(${n(at(.72, .86) * hourAngle)}deg)`;
      minuteHand.style.transform = `rotate(${n(at(.72, .86) * minuteAngle)}deg)`;

      const al = at(.74, .82);
      arriveLabel.style.opacity = String(al);
      arriveLabel.style.transform = `translateY(${n((1 - al) * 8)}px)`;
      const atTime = at(.78, .88);
      arriveTime.style.opacity = String(atTime);
      arriveTime.style.transform = `translateY(${n((1 - atTime) * 8)}px)`;
    }

    function ambient() {
      if (reduced) return;
      const rand = random(11);
      const colors = ['#F5B74E', '#E48C35', '#FFD58A'];
      const petals = [];
      for (let i = 0; i < 9; i++) {
        const left = 5 + rand() * 90;
        const size = 12 + rand() * 6;
        const duration = 22 + rand() * 12;
        const delay = -rand() * duration;
        petals.push(`<i class="pp" style="--x:${n(left)}%;--s:${n(size)}px;--c:${colors[i % 3]};--t:${n(duration)}s;--dl:${n(delay)}s;--z:3"></i>`);
      }
      petalBox.innerHTML = petals.join('');

      const motes = [];
      for (let i = 0; i < 8; i++) {
        const left = 10 + rand() * 80;
        const top = 20 + rand() * 72;
        const size = 3 + rand() * 2;
        const duration = 7 + rand() * 4;
        const delay = -rand() * duration;
        const drift = 6 + rand() * 4;
        motes.push(`<i style="--x:${n(left)}%;--y:${n(top)}%;--s:${n(size)}px;--t:${n(duration)}s;--dl:${n(delay)}s;--dy:${n(drift)}px"></i>`);
      }
      moteBox.innerHTML = motes.join('');
    }

    function layout() {
      const h = Math.max(1, stage.getBoundingClientRect().height);
      u = h / 844;
      stage.style.setProperty('--u', String(u));
      root.style.height = `${h * 2.4}px`;
      apply(currentP);
    }

    function onResize() {
      if (alive) layout();
    }

    window.addEventListener('resize', onResize);
    ambient();
    layout();
    unsubscribe = scrub(root, apply);

    if (!reduced) {
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              root.classList.add('in');
              observer.disconnect();
              break;
            }
          }
        }, { threshold: .35 });
        observer.observe(root);
      } else {
        root.classList.add('in');
      }
    }

    if (document.fonts?.ready) document.fonts.ready.then(() => { if (alive) layout(); });

    return {
      stage,
      destroy() {
        alive = false;
        window.removeEventListener('resize', onResize);
        unsubscribe();
        observer?.disconnect();
      },
    };
  },
};
