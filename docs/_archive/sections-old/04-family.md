# 04 — Family: "The family vine"
Owner: OpenCode · Scene height `350vh` · scrubbed.

## Goal
A vine grows upward as you scroll. Grandparents bloom first (bottom), then parents (middle), and finally Samikshya as a lotus at the top.

## Content
`family.grandparents` (label + names), `family.parents` (label + names), `honoree.first`.

## Layers
1. Background navy-deep, `tile-wave` (`data-depth="0.15"`).
2. `svg/vine.svg` (390×700 viewBox): one main stem path `#stem` (bottom → top), side branches `#b1 #b2 #b3`, leaves `.leaf` (many), and three bloom nodes `#bloom-gp`, `#bloom-parents`, `#bloom-top`. Stroke green/teal, flowers copper/peach/gold.
3. HTML name chips positioned over the SVG nodes using percentages derived from the node positions (documented in a comment in the section CSS): label (Cinzel caps, small) + names (Cormorant, ≥ 20px, ivory).
4. Top node: lotus icon + `honoree.first` in Great Vibes.

## Scroll beats
- 0–350: `#stem` draws from the bottom to the 40% mark; `#bloom-gp` opens (scale 0 → 1); grandparents chip fades/rises.
- 300–650: stem continues to 75%; branches `#b1 #b2` draw; leaves pop (stagger); `#bloom-parents` opens; parents chip appears.
- 650–950: stem reaches the top; `#b3`; `#bloom-top` lotus opens; name appears.
- 950–1000: all blooms sway ±2° (transform only).
The stage view stays still; the vine grows inside it (no scrolling of the SVG itself).

## Assets
`svg/vine.svg` (ids above), `svg/lotus.svg`, `svg/marigold-petal.svg`.

## Acceptance
- Chips never overlap each other or leaves at 360px and 430px.
- Reading order top-to-bottom still makes sense in the DOM (grandparents, parents, Samikshya).
- Works with reduced motion (final state shown).
