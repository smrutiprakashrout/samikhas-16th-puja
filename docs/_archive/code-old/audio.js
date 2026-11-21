export function createAudio() {
  let bgm;
  let muted = localStorage.getItem('invite-muted') === 'true';
  let ducked = false;
  const button = document.querySelector('#mute');

  const sync = () => {
    if (button) button.setAttribute('aria-pressed', String(muted));
    if (bgm) bgm.volume = muted ? 0 : ducked ? 0.15 : 0.35;
  };
  button?.addEventListener('click', () => {
    muted = !muted;
    localStorage.setItem('invite-muted', String(muted));
    sync();
    if (!muted) bgm?.play().catch(() => {});
  });
  sync();

  return {
    start() {
      if (bgm) return;
      try {
        bgm = new Audio('/audio/bgm.mp3');
        bgm.loop = true;
        bgm.volume = 0;
        bgm.play().then(() => {
          const started = performance.now();
          const fade = () => {
            if (!bgm) return;
            const amount = Math.min(1, (performance.now() - started) / 2000);
            bgm.volume = muted ? 0 : (ducked ? 0.15 : 0.35) * amount;
            if (amount < 1) requestAnimationFrame(fade);
          };
          requestAnimationFrame(fade);
        }).catch(() => {});
      } catch {}
    },
    sfx(name) {
      try { const sound = new Audio(`/audio/${encodeURIComponent(name)}.mp3`); sound.play().catch(() => {}); } catch {}
    },
    setBgmDuck(value) { ducked = Boolean(value); sync(); },
  };
}
