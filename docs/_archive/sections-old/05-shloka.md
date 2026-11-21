# 05 — Shloka: "The aarti lamp reveal"
Owner: OpenCode · Scene height `250vh` · scrubbed + pointer.

## Goal
A dark scene where Ganesha and the shloka are hidden. A glowing aarti lamp reveals them: it follows the guest's finger, or moves by itself with scroll for guests who don't touch.

## Content
`shloka.lines` (4 Devanagari lines), `shloka.meaning`, `shloka.image`.

## Layers
1. Background `--navy-deep`.
2. DIM layer: Ganesha image (`img/ganesha.webp`, ~260px wide) + shloka lines at 12% opacity.
3. LIT layer: identical copy at 100%, with `mask-image: radial-gradient(circle var(--r) at var(--x) var(--y), #000 0, #000 60%, transparent 100%)`. Update `--x --y --r` as CSS variables (no layout cost).
4. Warm glow: `radial-gradient` flame-colored circle (multiply/overlay-style, low opacity) following the same point.
5. `svg/aarti-lamp.svg` icon (44px) following the point.
6. Meaning text (Cormorant italic) below, hidden until the end.

## Interaction
- Touch/drag anywhere in the stage moves the lamp point (pointer events, `touch-action: pan-y` so vertical page scroll still works; use horizontal drag + short taps to reposition, and mirror the pointer's x/y).
- Without touch input: the lamp moves along a gentle S-path driven by scroll progress.
- Radius `--r` grows 70px → 100px as progress rises; at progress ≥ 0.85 `--r` expands to cover the whole stage (everything lit) and `shloka.meaning` fades in; `audio.sfx('chime')` once.

## Scroll beats
- 0–100: lamp fades in at the top; scene dim.
- 100–850: lamp path moves through Ganesha (top) → the 4 shloka lines (lower), revealing each.
- 850–1000: full reveal + meaning.

## Assets
`img/ganesha.webp` (extract from final card), `svg/aarti-lamp.svg`.

## Acceptance
- Shloka is real Devanagari text (Noto Serif Devanagari), crisp, not image.
- Page scroll is never blocked by the drag.
- End state is fully lit and readable regardless of interaction.
