import { createTimeline } from 'animejs';
import { clamp } from './util.js';
import { createParallax } from './parallax.js';

export function createSceneEngine({ sceneElements, sections, content, anime, rive, audio, reduced, particles }) {
  const records = sceneElements.map((el, index) => ({ el, section: sections[index], progress: 0, mounted: false, instance: null, isNear: false, scrubs: [] }));
  const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
    const record = records.find((item) => item.el === entry.target);
    if (!record) return;
    record.isNear = entry.isIntersecting;
    if (entry.isIntersecting && !record.mounted) mount(record);
  }), { rootMargin: '150% 0px' });
  records.forEach(({ el }) => io.observe(el));
  const parallax = createParallax(records, reduced);

  function mount(record) {
    record.mounted = true;
    const root = record.el.querySelector('.stage');
    const ctx = {
      root,
      scene: { el: record.el, get progress() { return record.progress; } },
      scrub(build) {
        const tl = createTimeline({ autoplay: false, defaults: { ease: 'linear' } });
        build(tl);
        tl.stretch(1000);
        if (reduced) tl.seek(1000);
        else { record.scrubs.push(tl); tl.seek(record.progress * 1000); }
        return tl;
      },
      anime, rive, audio, content, reduced, particles,
    };
    record.instance = record.section.mount?.(ctx) || null;
  }

  let frame = 0;
  const update = () => {
    frame = 0;
    const scrollY = window.scrollY;
    const viewport = window.innerHeight;
    records.forEach((record) => {
      if (!record.isNear) return;
      const top = record.el.getBoundingClientRect().top + scrollY;
      const height = record.el.offsetHeight;
      record.progress = clamp((scrollY - top) / Math.max(1, height - viewport));
      record.scrubs.forEach((timeline) => timeline.seek(record.progress * 1000));
    });
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
  if (!reduced) { addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll(); }
  return {
    destroy() {
      io.disconnect();
      parallax.destroy();
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
      records.forEach((record) => record.instance?.destroy?.());
    },
  };
}
