import './styles/tokens.css';
import './styles/base.css';
import { content } from './content.js';
import { mountMuteButton } from './core/audio.js';
import gate from './sections/00-gate/index.js';
import ganesha from './sections/01-ganesha/index.js';
import hero from './sections/02-hero/index.js';
import invitation from './sections/03-invitation/index.js';
import puja from './sections/03b-puja/index.js';
import family from './sections/04-family/index.js';
import date from './sections/05-date/index.js';
import venue from './sections/06-venue/index.js';
import rsvp from './sections/07-rsvp/index.js';
import closing from './sections/08-closing/index.js';

const params = new URLSearchParams(location.search);
const skipgate = params.get('skipgate') === '1';
const dev = params.get('dev') === '1';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Contract: { id, height, html(content), mount(ctx) } — see ARCHITECTURE.md.
const sections = [gate, ganesha, hero, invitation, puja, family, date, venue, rsvp, closing];
let activeGate;
let activeChapter;

function mountGate() {
  const section = sections.find(s => s.id === '00-gate');
  const scenes = document.getElementById('scenes');
  let root = scenes.querySelector('[data-scene="00-gate"]');
  if (!root) {
    root = document.createElement('section');
    root.dataset.scene = '00-gate';
    scenes.appendChild(root);
  }
  root.innerHTML = section.html(content);
  // The chapter listens for gate:opened; no temporary stage is passed to the gate.
  activeGate = section.mount({ root, content, reduced });
}

function boot() {
  document.documentElement.classList.add('locked');
  const scenes = document.getElementById('scenes');
  scenes.setAttribute('tabindex', '-1');

  for (const section of sections) {
    if (section.id === '00-gate' && skipgate) continue;
    const root = document.createElement('section');
    root.dataset.scene = section.id;
    if (section.id === '01-ganesha') {
      root.classList.add('ch1');
      root.style.height = '420vh';
    } else if (section.id === '02-hero') {
      root.classList.add('ch2');
      root.style.height = '320vh';
    } else if (section.id === '03-invitation') {
      root.classList.add('inv');
      root.style.height = '260vh';
    } else if (section.id === '04-family') {
      root.classList.add('fam');
      root.style.height = '220vh';
    } else if (section.id === '05-date') {
      root.classList.add('band');
      root.id = 'band';
    } else if (section.id === '06-venue') {
      root.classList.add('ven');
      root.id = 'ven';
    } else if (section.id === '07-rsvp') {
      root.classList.add('rsvp');
      root.id = 'rsvp';
    } else if (section.id === '08-closing') {
      root.classList.add('clo');
      root.id = 'clo';
    } else if (section.height) {
      root.style.height = section.height;
    }
    root.innerHTML = section.html ? section.html(content) : '';
    scenes.appendChild(root);
    const mounted = section.mount ? section.mount({ root, content, reduced }) : null;
    if (section.id === '00-gate') activeGate = mounted;
    if (section.id === '01-ganesha') activeChapter = mounted;
  }

  if (skipgate) {
    document.documentElement.classList.remove('locked');
    mountMuteButton().show();
    document.dispatchEvent(new CustomEvent('gate:opened'));
  }

  if (dev) {
    const style = document.createElement('style');
    style.textContent = `.dev-replay{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:40;padding:8px 12px;border:1px solid var(--wood);border-radius:99px;color:var(--ink);background:var(--sand)}`;
    document.head.appendChild(style);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'label dev-replay';
    button.textContent = 'Replay opening';
    button.addEventListener('click', () => {
      activeGate?.destroy();
      activeChapter?.reset();
      window.scrollTo(0, 0);
      document.documentElement.classList.add('locked');
      mountGate();
    });
    document.body.appendChild(button);
  }
}

boot();
