export function createParallax(scenes, reduced) {
  let frame = 0;
  if (reduced) return { destroy() {} };
  const tick = () => {
    frame = 0;
    const center = innerHeight / 2;
    scenes.forEach((scene) => {
      if (!scene.isNear) return;
      const rect = scene.el.getBoundingClientRect();
      const sceneCenter = rect.top + rect.height / 2;
      scene.el.querySelectorAll('[data-depth]').forEach((element) => {
        const depth = Number(element.dataset.depth) || 0;
        const y = Math.max(-200, Math.min(200, (center - sceneCenter) * depth * 0.3));
        element.style.transform = `translate3d(0,${y}px,0)`;
      });
    });
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(tick); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();
  return { destroy() { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(frame); } };
}
