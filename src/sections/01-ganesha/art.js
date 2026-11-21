// Generated decorative SVG for chapter 1. Garland lives in core so S08 can reuse it.
import { createGarland } from '../../core/garland.js';
const { rnd, buildGarlands } = createGarland(7);
export { rnd, buildGarlands };

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

export function haloSvg() {
  const petals = Array.from({ length: 24 }, (_, i) =>
    `<path d="M0-88c5-8 5-16 0-24c-5 8-5 16 0 24Z" transform="rotate(${i * 15})" fill="none" stroke="${C.wood}" stroke-width=".45" stroke-opacity=".65"/>`
  ).join('');
  const dots = Array.from({ length: 12 }, (_, i) =>
    `<circle cx="0" cy="-64" r="1.3" transform="rotate(${i * 30})" fill="${C.wood}" fill-opacity=".8"/>`
  ).join('');
  return `<svg class="halo" viewBox="-100 -100 200 200" fill="none" aria-hidden="true">
  <circle id="haloDraw" cx="0" cy="0" r="97" stroke="${C.gold}" stroke-width=".8" pathLength="1"/>
  <g class="spin">
    <circle r="92" stroke="${C.wood}" stroke-width=".45" stroke-opacity=".55" stroke-dasharray="1 3"/>
    ${petals}
    <circle r="76" stroke="${C.wood}" stroke-width=".45" stroke-opacity=".4"/>
  </g>
  <g class="spin r">
    <circle r="64" stroke="${C.wood}" stroke-width=".45" stroke-opacity=".5" stroke-dasharray=".2 5"/>
    ${dots}
  </g>
</svg>`;
}

function petalPath(L, w) {
  return `M0 0C${n(w)} ${n(L * .3)} ${n(w * .8)} ${n(L * .8)} 0 ${n(L)}C${n(-w * .8)} ${n(L * .8)} ${n(-w)} ${n(L * .3)} 0 0Z`;
}

function lotus(kind) {
  const rows = kind === 'back'
    ? [
        { angles: Array.from({ length: 19 }, (_, k) => 96 + 9 * k), L: 108, w: 21, fill: C.saffron, stroke: C.deep },
        { angles: Array.from({ length: 15 }, (_, k) => 104 + 11 * k), L: 86, w: 17, fill: C.marigold, stroke: C.deep },
      ]
    : [{ angles: [98, 108, 118, 242, 252, 262], L: 52, w: 12, fill: C.ivory, stroke: C.saffron }];

  let petals = '';
  for (const row of rows) {
    for (const a of row.angles) {
      const d = Math.abs(a - 180);
      petals += `<g transform="translate(150 24) rotate(${a})"><path class="lp" d="${petalPath(row.L, row.w)}" fill="${row.fill}" stroke="${row.stroke}" stroke-width=".8" style="--d:${d}"/></g>`;
    }
  }
  return `<svg class="lotus ${kind}" viewBox="0 -64 300 184" fill="none" aria-hidden="true">${petals}</svg>`;
}

export const lotusBack = () => lotus('back');
export const lotusFront = () => lotus('front');

// Garland generator moved to ../../core/garland.js (same seed 7, same output).
