export function createParticles(root) {
  const alive = new Set();
  let showering = false;
  let showerFrame;
  const burst = (x, y, n = 1) => {
    for (let i = 0; i < Math.min(n, 40 - alive.size); i += 1) {
      const petal = document.createElement('img');
      petal.src = '/svg/marigold-petal.svg';
      petal.alt = '';
      petal.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:12px;height:18px;pointer-events:none;z-index:1100;`;
      petal.onerror = () => { petal.removeAttribute('src'); petal.style.cssText += 'width:8px;height:8px;border-radius:50%;background:var(--saffron);'; };
      (root || document.body).append(petal);
      alive.add(petal);
      const angle = Math.random() * Math.PI * 2;
      const distance = 35 + Math.random() * 110;
      const animation = petal.animate([
        { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate3d(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance + 80}px,0) rotate(${Math.random() * 600 - 300}deg)`, opacity: 0 },
      ], { duration: 1000 + Math.random() * 1200, easing: 'ease-out' });
      animation.onfinish = () => { alive.delete(petal); petal.remove(); };
    }
  };
  const showerTick = () => {
    if (!showering) return;
    burst(Math.random() * innerWidth, -10, 2);
    showerFrame = requestAnimationFrame(showerTick);
  };
  return {
    burst,
    shower(on) {
      showering = Boolean(on);
      cancelAnimationFrame(showerFrame);
      if (showering) showerFrame = requestAnimationFrame(showerTick);
    },
  };
}
