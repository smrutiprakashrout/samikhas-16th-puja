import { clamp, reduced } from './util.js';

const registry = [];
let scheduled = false;
let listening = false;

function update() {
  scheduled = false;
  const height = window.innerHeight;
  for (const item of registry) {
    const rect = item.el.getBoundingClientRect();
    const inside = rect.bottom > -height && rect.top < 2 * height;
    const p = clamp(-rect.top / (rect.height - height), 0, 1);
    if (inside) {
      item.fn(p);
      item.inside = true;
    } else if (item.inside) {
      item.fn(rect.bottom <= -height ? 1 : 0);
      item.inside = false;
    }
  }
}

function schedule() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(update);
  }
}

function listen() {
  if (!listening && !reduced) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    listening = true;
  }
}

function unlisten() {
  if (listening && registry.length === 0) {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    listening = false;
  }
}

export function scrub(sceneEl, fn) {
  if (reduced) {
    fn(1);
    return () => {};
  }
  const item = { el: sceneEl, fn, inside: false };
  registry.push(item);
  const rect = sceneEl.getBoundingClientRect();
  const height = window.innerHeight;
  item.inside = rect.bottom > -height && rect.top < 2 * height;
  fn(clamp(-rect.top / (rect.height - height), 0, 1));
  listen();
  return () => {
    const index = registry.indexOf(item);
    if (index !== -1) registry.splice(index, 1);
    unlisten();
  };
}
