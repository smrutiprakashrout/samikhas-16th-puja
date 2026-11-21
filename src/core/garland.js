// Shared seeded garland generator: same seed 7, quad Bezier and blossom look as S01.
const C = {
  gold: 'var(--gold)',
  wood: 'var(--wood)',
  woodDk: 'var(--wood-dk)',
  marigold: 'var(--marigold)',
  saffron: 'var(--saffron)',
  deep: 'var(--saffron-deep)',
  ivory: 'var(--ivory)',
  sage: 'var(--sage)',
  moss: 'var(--moss)',
};

const n = v => Number(v.toFixed(1));
const f = v => v.toFixed(1);

export function createGarland(seed = 7) {
  let s = seed;

  function rnd() {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  }

  function blossom(x, y, r, c1, c2, rot) {
    let g = `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot})">`;
    for (let i = 0; i < 10; i++) {
      g += `<ellipse cx="0" cy="${f(-r * .52)}" rx="${f(r * .3)}" ry="${f(r * .5)}" fill="${c1}" stroke="${C.deep}" stroke-opacity=".45" stroke-width=".5" transform="rotate(${i * 36})"/>`;
    }
    g += `<circle r="${f(r * .42)}" fill="${c2}"/><circle r="${f(r * .16)}" fill="${C.deep}" fill-opacity=".75"/></g>`;
    return g;
  }

  function leaf(x, y, r, rot) {
    return `<path d="M0 0C${n(r * .5)} ${n(-r * .3)} ${n(r * .9)} ${n(-r * .1)} ${n(r)} 0C${n(r * .9)} ${n(r * .3)} ${n(r * .4)} ${n(r * .4)} 0 0Z" transform="translate(${f(x)} ${f(y)}) rotate(${rot})" fill="${C.sage}" stroke="${C.moss}" stroke-opacity=".5" stroke-width=".5"/>`;
  }

  function pick() {
    const r = rnd();
    if (r < .5) return [C.marigold, '#FFD58A'];
    if (r < .85) return [C.saffron, C.marigold];
    return [C.ivory, C.marigold];
  }

  function topGarland() {
    let top = `<path d="M-6 -4Q195 140 396 -4" fill="none" stroke="${C.wood}" stroke-width="1.2"/>`;
    const N = 24;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const mt = 1 - t;
      const x = mt * mt * -6 + 2 * t * mt * 195 + t * t * 396;
      const y = mt * mt * -4 + 2 * t * mt * 140 + t * t * -4;
      const dx = 2 * mt * (195 + 6) + 2 * t * (396 - 195);
      const dy = 2 * mt * (140 + 4) + 2 * t * (-4 - 140);
      const ang = Math.atan2(dy, dx) * 180 / Math.PI;
      const size = [20, 15, 24, 17][i % 4];
      const cc = pick();
      if (i % 2 === 0) {
        top += leaf(x, y + 3, 15, ang + 80 + (i % 4) * 10);
        top += leaf(x, y + 3, 15, ang - 100);
      }
      top += blossom(x, y + (i % 2 ? 4 : 0), size * .5 + 3, cc[0], cc[1], Math.round(rnd() * 36));
    }
    return top;
  }

  function strand(x0, len, mid) {
    let s = `<path d="M${x0} -4C${x0 + mid} ${n(len * .3)} ${x0 - mid} ${n(len * .7)} ${x0} ${len}" fill="none" stroke="${C.wood}" stroke-width="1.2"/>`;
    const count = Math.floor(len / 21);
    for (let i = 1; i <= count; i++) {
      const t = i / (count + 1);
      const y = -4 + (len + 4) * t;
      const x = x0 + mid * 3 * t * (1 - t) * (2 * t - 1) * -2.4;
      const cc = pick();
      if (i % 2 === 0) s += leaf(x, y, 13, i % 4 === 0 ? 60 : -120);
      s += blossom(x, y, 9.5, cc[0], cc[1], Math.round(rnd() * 36));
    }
    for (let k = -1; k <= 1; k++) {
      s += `<path d="M${x0} ${len}L${x0 + k * 5} ${len + 22}" stroke="${C.saffron}" stroke-width="1.6" stroke-linecap="round"/><circle cx="${x0 + k * 5}" cy="${len + 23}" r="2.4" fill="${C.marigold}"/>`;
    }
    s += blossom(x0, len, 12, C.saffron, C.marigold, 10);
    return s;
  }

  function buildGarlands(gT, gL, gR) {
    if (gT) gT.innerHTML = topGarland();
    if (gL) gL.innerHTML = strand(26, 236, 6);
    if (gR) gR.innerHTML = strand(364, 320, -6);
  }

  return { rnd, blossom, leaf, pick, topGarland, strand, buildGarlands };
}

export const garland = createGarland(7);
