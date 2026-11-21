import './styles/tokens.css';
import './styles/base.css';
import * as anime from 'animejs';
import * as content from './content.js';
import gate from './sections/00-gate/index.js';
import opening from './sections/01-opening/index.js';
import invitation from './sections/02-invitation/index.js';
import samikshya from './sections/03-samikshya/index.js';
import family from './sections/04-family/index.js';
import shloka from './sections/05-shloka/index.js';
import details from './sections/06-details/index.js';
import venue from './sections/07-venue/index.js';
import rsvp from './sections/08-rsvp/index.js';
import closing from './sections/09-closing/index.js';
import { createSceneEngine } from './core/scene.js';
import { createAudio } from './core/audio.js';
import { createRiveLoader } from './core/rive.js';
import { createParticles } from './core/particles.js';
import { reducedMotion } from './core/util.js';

const sections = [opening, invitation, samikshya, family, shloka, details, venue, rsvp, closing];
const scenes = document.querySelector('#scenes');
const audio = createAudio();
const rive = createRiveLoader();
const particles = createParticles(document.body);
let engine;

function buildScenes() {
  if (engine) return;
  scenes.innerHTML = sections.map((section) => `<section class="scene" id="${section.id}" style="--h:${section.height || '100svh'}"><div class="stage">${section.html(content)}</div></section>`).join('');
  engine = createSceneEngine({
    sceneElements: [...scenes.querySelectorAll('.scene')], sections, content,
    anime: { animate: anime.animate, createTimeline: anime.createTimeline, onScroll: anime.onScroll, stagger: anime.stagger, svg: anime.svg },
    rive, audio, reduced: reducedMotion, particles,
  });
}

function unlock({ playAudio = true } = {}) {
  if (document.documentElement.classList.contains('unlocked')) return;
  document.documentElement.classList.add('unlocked');
  document.querySelector('#gate-overlay')?.remove();
  buildScenes();
  if (playAudio) audio.start();
}

if (new URLSearchParams(location.search).get('skipgate') === '1') {
  unlock({ playAudio: false });
} else {
  document.documentElement.classList.remove('unlocked');
  const overlay = document.createElement('div');
  overlay.id = 'gate-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  Object.assign(overlay.style, { position: 'fixed', inset: '0', zIndex: '1000', overflow: 'auto' });
  overlay.innerHTML = `<section class="scene" id="${gate.id}" style="--h:100svh"><div class="stage">${gate.html(content)}</div></section>`;
  document.body.append(overlay);
  const gateCtx = { root: overlay.querySelector('.stage'), anime: { animate: anime.animate, createTimeline: anime.createTimeline, onScroll: anime.onScroll, stagger: anime.stagger, svg: anime.svg }, rive, audio, content, reduced: reducedMotion, particles };
  gate.mount?.(gateCtx);
  // The T01 stub has no gate control. These bridges let it open via the documented event,
  // and keep the stub usable with an intentional tap until its real interaction is added.
  overlay.addEventListener('click', () => window.dispatchEvent(new Event('gate:opened')), { once: true });
  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') window.dispatchEvent(new Event('gate:opened'));
  });
  window.addEventListener('gate:opened', () => unlock(), { once: true });
}

export { engine };
