export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;

export function seg(p, a, b) {
  const t = clamp((p - a) / (b - a), 0, 1);
  return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export const storage = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
