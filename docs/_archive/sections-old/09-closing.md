# 09 — Closing: "The peacock fan and the flower shower"
Owner: OpenCode · Scene height `250vh` · scrubbed.

## Goal
A peacock's tail opens fully as the last scroll, marigold petals shower down, the closing line appears, and the guest can share the invitation.

## Content
`closing.line`, `share.title`, `share.text`, `honoree.first`.

## Layers
1. Background navy-deep, `tile-wave` (`data-depth="0.15"`), mandala (`data-depth="0.3"`).
2. Peacock fan (Rive `peacock-fan.riv`, number `open` 0–100; fallback: 9 × `svg/peacock-feather.svg` fanned from −80° to +80° around a bottom-center pivot), ~330px wide, bottom-anchored.
3. Closing line (Great Vibes ~34px, ivory/peach) above the fan; small caps line with `honoree.first` below it.
4. Share button (`<button>`, ≥ 44px): uses `navigator.share({title, text, url: location.href})`; fallback opens `https://wa.me/?text=<encoded text + url>`.
5. Petal shower: `particles.shower(true)` (DOM petals, ≤ 40, transform-only, gentle sway) starting at progress 0.5.

## Scroll beats
- 0–600: fan opens 0 → 100 (Rive input or fallback feather rotations, staggered).
- 500–800: closing line writes in (clip-path); shower starts.
- 800–1000: share button rises in; fan gently sways; shower continues (stop it when the scene leaves the viewport).
- Tap anywhere on the stage: `particles.burst(x, y, 14)`.

## Assets
`rive/peacock-fan.riv`, `svg/peacock-feather.svg`, `svg/marigold-petal.svg`.

## Acceptance
- No more than 40 petal nodes alive at once; shower stops off-screen.
- Share works on mobile (native sheet) and falls back cleanly.
- Final state is calm and legible; closing line is real text.
