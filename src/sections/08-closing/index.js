import { createGarland } from '../../core/garland.js';
import './closing.css';

const PETAL_COLORS = ['#F5B74E', '#E48C35', '#FBF3E4', '#F5B74E', '#E48C35'];

function petalMarkup() {
  const { rnd } = createGarland(7);
  return Array.from({ length: 14 }, (_, i) => {
    const front = i < 4;
    const size = front ? 16 + Math.round(rnd() * 4) : 9 + Math.round(rnd() * 6);
    const time = front ? 19 + rnd() * 5 : 26 + rnd() * 10;
    const x = 4 + rnd() * 92;
    const delay = -(rnd() * 30);
    return `<div class="pt" style="--x:${x.toFixed(0)}%;--s:${size}px;--t:${time.toFixed(1)}s;--dl:${delay.toFixed(1)}s;--c:${PETAL_COLORS[i % 5]};--b:${front ? '1.6px' : '0px'};--z:${front ? 25 : 3}"></div>`;
  }).join('');
}

export default {
  id: '08-closing',
  height: '180svh',

  html(content) {
    const c = content?.content ?? content;
    const d = c.closing;
    const toran = createGarland(7).topGarland();
    return `
<div class="stage">
  <svg class="tor" viewBox="0 0 390 200" aria-hidden="true"><g class="drop"><g class="sw" id="torin">${toran}</g></g></svg>
  <div class="petals" aria-hidden="true">${petalMarkup()}</div>
  <p class="cl1">${d.blessing}</p>
  <p class="cl2">${d.family.pre} <em>${d.family.accent}</em> ${d.family.post}</p>
  <p class="cl3 label">${d.eventLine}<br>${d.dateLine}</p>
  <div class="cl4"><div class="ven"><button class="btn fill" id="share" type="button">${d.shareLabel}</button></div></div>
  <p class="cl5 label">${d.thanks}</p>
  <div class="grain" aria-hidden="true"></div>
</div>`;
  },

  mount({ root, content, reduced }) {
    const share = root.querySelector('#share');
    if (!share) return null;
    const c = content?.content ?? content;
    const d = c.closing;
    let alive = true;
    let timer = 0;
    let observer;

    if (reduced) {
      root.classList.add('in');
    } else {
      observer = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting && e.intersectionRatio >= .4)) {
          root.classList.add('in');
          observer.disconnect();
        }
      }, { threshold: [.4] });
      observer.observe(root);
    }

    function copied() {
      share.textContent = d.shareCopiedLabel;
      clearTimeout(timer);
      timer = window.setTimeout(() => { if (alive) share.textContent = d.shareLabel; }, 1600);
    }

    async function onShare() {
      const payload = { title: d.shareTitle, text: d.shareText, url: location.href };
      if (navigator.share) {
        try {
          await navigator.share(payload);
        } catch (error) {
          if (error?.name !== 'AbortError' && error?.name !== 'NotAllowedError') console.warn('share failed', error);
        }
        return;
      }
      try {
        if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
        await navigator.clipboard.writeText(payload.url);
        copied();
      } catch {
        const ta = document.createElement('textarea');
        ta.value = payload.url;
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

    share.addEventListener('click', onShare);

    return {
      destroy() {
        alive = false;
        clearTimeout(timer);
        share.removeEventListener('click', onShare);
        observer?.disconnect();
      },
    };
  },
};
