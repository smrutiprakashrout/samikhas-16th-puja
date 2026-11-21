import './style.css';

// Only UI string allowed to be hard-coded in this section (per 00-gate.md).
const HINT = 'Ring the bell to open the invitation';
const HINT_HTML = HINT.replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));
const EASE = 'cubicBezier(0.22, 0.61, 0.36, 1)';

function safeRive(ctx, name, canvas) {
  let ctrl = null;
  try {
    ctrl = ctx.rive(name, canvas, { artboard: 'Main', stateMachine: 'SM' });
  } catch {
    ctrl = null;
  }
  const ready = (ctrl && ctrl.ready) ? ctrl.ready : Promise.resolve(false);
  return { ctrl, ready: Promise.resolve(ready).catch(() => false) };
}

export default {
  id: '00-gate',

  html(content) {
    const sanskrit = String(content?.content?.invocation?.sanskrit ?? content?.invocation?.sanskrit ?? '')
      .replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      }[c]));

    return `
      <div class="gate" role="dialog" aria-modal="true" aria-label="${HINT_HTML}">
        <div class="gate__bg" aria-hidden="true"></div>

        <div class="gate__doors" aria-hidden="true">
          <div class="gate__door gate__door--left">
            <img src="/svg/door-left.svg" alt="" width="195" height="844" draggable="false" />
          </div>
          <div class="gate__door gate__door--right">
            <img src="/svg/door-right.svg" alt="" width="195" height="844" draggable="false" />
          </div>
        </div>

        <p class="gate__sanskrit">${sanskrit}</p>

        <button class="gate__bell" type="button" aria-label="${HINT_HTML}">
          <span class="gate__bell-art">
            <img class="gate__bell-fallback" src="/svg/bell.svg" alt="" width="120" height="260" draggable="false" />
            <canvas class="gate__bell-canvas" width="120" height="260" hidden></canvas>
          </span>
          <span class="gate__grab" aria-hidden="true"></span>
        </button>

        <div class="gate__diya" aria-hidden="true">
          <canvas class="gate__diya-canvas" width="160" height="128" hidden></canvas>
          <span class="gate__diya-inline"></span>
        </div>

        <button class="gate__hint" type="button" aria-label="${HINT_HTML}">${HINT_HTML}</button>
      </div>`;
  },

  mount(ctx) {
    const root = ctx.root;
    const overlay = root.querySelector('.gate');
    if (!overlay) return { destroy() {} };

    const { animate } = ctx.anime;
    const reduced = !!ctx.reduced;
    const bell = overlay.querySelector('.gate__bell');
    const bellArt = overlay.querySelector('.gate__bell-art');
    const bellFallback = overlay.querySelector('.gate__bell-fallback');
    const bellCanvas = overlay.querySelector('.gate__bell-canvas');
    const diyaCanvas = overlay.querySelector('.gate__diya-canvas');
    const diyaHost = overlay.querySelector('.gate__diya-inline');
    const leftDoor = overlay.querySelector('.gate__door--left');
    const rightDoor = overlay.querySelector('.gate__door--right');
    const hint = overlay.querySelector('.gate__hint');

    const timers = [];
    const animations = [];
    const ac = new AbortController();
    let opened = false;
    let litRequested = false;
    let flameTarget = null;
    let glowTarget = null;
    let bellReady = false;
    let diyaReady = false;

    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const play = (target, params) => {
      const instance = animate(target, params);
      if (instance) animations.push(instance);
      return instance;
    };

    // Always consult ctx.rive().ready; SVG art stays visible when it resolves false.
    const bellRive = safeRive(ctx, 'bell', bellCanvas);
    bellRive.ready.then((ok) => {
      bellReady = !!ok;
      bellCanvas.hidden = !bellReady;
      bellFallback.hidden = bellReady;
    });

    const diyaRive = safeRive(ctx, 'diya', diyaCanvas);
    diyaRive.ready.then((ok) => {
      diyaReady = !!ok;
      diyaCanvas.hidden = !diyaReady;
      diyaHost.hidden = diyaReady;
    });

    // External diya SVG is inlined so its flame/glow can be lit with opacity/scale only.
    fetch('/svg/diya.svg')
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => {
        if (!text || !diyaHost.isConnected) return;
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (!svg) return;
        flameTarget = svg.querySelector('#diya-flame');
        glowTarget = svg.querySelector('#diya-glow');
        flameTarget?.classList.add('gate__flame');
        glowTarget?.classList.add('gate__glow');
        diyaHost.replaceChildren(document.importNode(svg, true));
        if (litRequested) lightDiya(true);
      })
      .catch(() => {
        if (diyaHost.isConnected) {
          diyaHost.dataset.placeholder = '/svg/diya.svg';
        }
      });

    function lightDiya(immediate = false) {
      litRequested = true;
      if (diyaReady) {
        try { diyaRive.ctrl?.setInput('lit', true); } catch { /* fallback below */ }
      }
      if (!flameTarget) return;
      if (immediate || reduced) {
        flameTarget.style.opacity = '1';
        flameTarget.style.transform = 'scale(1)';
        if (glowTarget) {
          glowTarget.style.opacity = '1';
          glowTarget.style.transform = 'scale(1)';
        }
        return;
      }
      play(flameTarget, { opacity: [0, 1], scale: [0.3, 1], duration: 600, ease: EASE });
      if (glowTarget) {
        play(glowTarget, { opacity: [0, 1], scale: [0.4, 1], duration: 900, ease: EASE });
      }
    }

    function ringBell() {
      if (bellReady) {
        try { bellRive.ctrl?.fire('ring'); } catch { /* fallback below */ }
      }
      if (reduced || bellReady) return;
      play(bellArt, {
        rotate: ['0deg', '-12deg', '12deg', '-8deg', '4deg', '0deg'],
        duration: 1000,
        ease: 'easeOutQuad',
      });
    }

    function finish() {
      if (!overlay.isConnected) return;
      overlay.remove();
      window.dispatchEvent(new Event('gate:opened'));
    }

    function open() {
      if (opened) return;
      opened = true;

      ringBell();
      try { ctx.audio?.sfx?.('bell'); } catch { /* sound blocked */ }

      if (reduced) {
        later(() => {
          try { ctx.audio?.start?.(); } catch { /* sound blocked */ }
          lightDiya(true);
          try { ctx.audio?.sfx?.('diya'); } catch { /* sound blocked */ }
        }, 100);
        play(overlay, { opacity: [1, 0], duration: 250, ease: 'linear' });
        later(finish, 300);
        return;
      }

      later(() => {
        try { ctx.audio?.start?.(); } catch { /* sound blocked */ }
        lightDiya();
        try { ctx.audio?.sfx?.('diya'); } catch { /* sound blocked */ }
      }, 500);

      later(() => {
        play(leftDoor, { x: ['0%', '-100%'], duration: 1200, ease: EASE });
        play(rightDoor, { x: ['0%', '100%'], duration: 1200, ease: EASE });
      }, 1200);

      later(() => {
        play(overlay, { opacity: [1, 0], duration: 300, ease: 'linear' });
      }, 2100);

      later(finish, 2400);
    }

    // Tap bell, drag the rope handle ≥ 40px, or tap the hint.
    let dragStartY = null;
    let dragged = false;

    function onPointerDown(e) {
      const rect = bell.getBoundingClientRect();
      if (e.clientY < rect.top + rect.height - 60) return; // handle/rope zone only
      dragStartY = e.clientY;
      dragged = false;
      try { bell.setPointerCapture(e.pointerId); } catch { /* unsupported */ }
    }
    function onPointerMove(e) {
      if (dragStartY === null) return;
      if (e.clientY - dragStartY >= 40) {
        dragged = true;
        dragStartY = null;
        open();
      }
    }
    function onPointerUp() {
      dragStartY = null;
    }
    function onBellClick() {
      if (dragged) { dragged = false; return; }
      open();
    }

    bell.addEventListener('pointerdown', onPointerDown, { signal: ac.signal });
    bell.addEventListener('pointermove', onPointerMove, { signal: ac.signal });
    bell.addEventListener('pointerup', onPointerUp, { signal: ac.signal });
    bell.addEventListener('pointercancel', onPointerUp, { signal: ac.signal });
    bell.addEventListener('click', onBellClick, { signal: ac.signal });
    hint.addEventListener('click', open, { signal: ac.signal });

    return {
      destroy() {
        ac.abort();
        timers.forEach(clearTimeout);
        animations.forEach((a) => { try { a.pause(); } catch { /* noop */ } });
      },
    };
  },
};
