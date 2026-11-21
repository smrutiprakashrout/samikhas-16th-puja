# 03 — Samikshya: "The 16-petal lotus"
Owner: OpenCode · Scene height `350vh` · scrubbed.

## Goal
A closed lotus with sixteen petals blooms as the guest scrolls, revealing her photo at its heart; her name then writes in.

## Content
`honoree.lead`, `honoree.first`, `honoree.rest`, `honoree.photo`, `honoree.photoAlt`.

## Layers
1. Background navy-deep; faint mandala (`data-depth="0.3"`), drifting marigold petals (`data-depth="0.6"`, 6 petals, low opacity).
2. Lotus (Rive `lotus-bloom.riv`, input `bloom` 0–100; fallback: 16 × `svg/lotus-petal.svg` arranged radially, 22.5° apart, 300px diameter). Canvas/SVG centered at ~42% viewport height.
3. Photo: circular image (`honoree.photo`, 150px) at the lotus center with a 2px copper ring and dashed outer ring. Until the real photo exists, use `img/placeholder-portrait.svg`.
4. Text below: lead (Cinzel caps, small), first name (Great Vibes ~64px), rest (Great Vibes ~40px).

## Scroll beats
- 0–550: lotus bloom 0 → 100 (Rive input or fallback: petals scale 0.15→1 and rotate from stacked to radial, staggered by index).
- 350–700: photo scales 0.6 → 1 and fades in; ring rotates slowly.
- 650–850: first name writes in (clip-path left→right), then rest.
- 850–1000: lead line fades in; petals do a tiny 2° breathing loop.

## Assets
`rive/lotus-bloom.riv`, `svg/lotus-petal.svg`, `svg/mandala.svg`, `svg/marigold-petal.svg`, `img/samikshya.webp` (user photo, ≤ 200 KB, square crop).

## Acceptance
- Fallback bloom looks intentional (not a broken Rive).
- Photo never appears before the lotus is ≥ 40% open; it is not stretched (object-fit: cover).
- Names are real text, not images.
