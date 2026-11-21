import { storage } from './util.js';

let bgm = null;
let muted = storage.get('mute') === '1';
let started = false;

function playBgm() {
  if (bgm && !muted) bgm.play().catch(() => {});
}

export const audio = {
  start() {
    started = true;
    if (muted) return;
    if (!bgm) {
      bgm = new Audio('/audio/bgm.mp3');
      bgm.loop = true;
      bgm.volume = 0;
      bgm.addEventListener('error', () => {});
    }
    playBgm();
    const began = performance.now();
    const fade = now => {
      if (!bgm || muted) return;
      bgm.volume = Math.min(.35, .35 * (now - began) / 2000);
      if (bgm.volume < .35) requestAnimationFrame(fade);
    };
    requestAnimationFrame(fade);
  },
  sfx(name) {
    if (muted) return;
    try {
      const sound = new Audio(`/audio/${name}.mp3`);
      sound.volume = .6;
      sound.addEventListener('error', () => {});
      sound.play().catch(() => {});
    } catch {}
  },
  setMuted(bool) {
    muted = Boolean(bool);
    storage.set('mute', muted ? '1' : '0');
    if (muted) bgm?.pause();
    else if (started) audio.start();
  },
  isMuted() { return muted; },
};

document.addEventListener('visibilitychange', () => {
  if (!bgm || !started) return;
  if (document.hidden) bgm.pause();
  else if (!muted) playBgm();
});

function icon() {
  return `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M3 8v4h3l4 3V5L6 8H3"/><path d="M13 7a4 4 0 0 1 0 6" class="sound-wave"/><path d="m13 7 5 6m0-6-5 6" class="sound-slash"/></svg>`;
}

function updateButton(button) {
  const isMuted = audio.isMuted();
  button.setAttribute('aria-pressed', String(isMuted));
  button.setAttribute('aria-label', isMuted ? 'Unmute music' : 'Mute music');
  button.querySelector('.sound-wave').style.display = isMuted ? 'none' : '';
  button.querySelector('.sound-slash').style.display = isMuted ? '' : 'none';
}

export function mountMuteButton() {
  let button = document.getElementById('mute');
  if (!button) {
    button = document.createElement('button');
    button.id = 'mute';
    button.type = 'button';
    button.setAttribute('aria-label', 'Mute music');
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = icon();
    button.style.cssText = 'position:fixed;top:max(14px,env(safe-area-inset-top));right:max(14px,env(safe-area-inset-right));width:44px;height:44px;border-radius:50%;border:1px solid rgba(224,175,112,.6);background:rgba(24,30,26,.6);backdrop-filter:blur(6px);color:var(--gold);z-index:30;opacity:0;pointer-events:none;transition:opacity .6s';
    const style = document.createElement('style');
    style.textContent = '@media(min-width:431px){#mute{right:calc(50% - 215px + 14px)}}';
    document.head.append(style);
    button.addEventListener('click', () => {
      audio.setMuted(!audio.isMuted());
      updateButton(button);
    });
    document.body.append(button);
  }
  updateButton(button);
  return { show() { button.style.opacity = '1'; button.style.pointerEvents = 'auto'; } };
}
