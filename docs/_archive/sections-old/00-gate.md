# 00 — Gate: "Ring the temple bell"
Owner: OpenCode · Not scroll-driven (full-screen overlay, `position: fixed`, z-index top).

## Goal
First screen. Guest rings a bell; a diya lights; two carved jharokha doors swing open; music starts; the page unlocks.

## Content (from `content.js`)
`invocation.sanskrit` small at top. Hint text: "Ring the bell to open the invitation" (hard-code this one UI string in the section).

## Layers (back → front)
1. Navy-deep background with `tile-wave` (parallax not needed).
2. Doors: `svg/door-left.svg`, `svg/door-right.svg`, each 50% width, closed in the middle with a copper seam.
3. Bell hanging at top center (Rive `bell.riv`, fallback `svg/bell.svg`), rope hanging down with a 44px handle.
4. Diya at bottom center (Rive `diya.riv`, fallback `svg/diya.svg`), unlit.
5. Hint text (pulsing opacity) near bottom.

## Interaction
- Tap the bell, OR drag the rope handle down ≥ 40px, OR tap the hint. All do the same thing.
- Sequence on trigger (≈ 2.4 s total): bell rings (`ring` trigger / fallback swing ±12° decaying) + `audio.sfx('bell')` → at 0.5 s `audio.start()` (bgm) and diya `lit = true` + `sfx('diya')` → at 1.2 s doors slide outward (translateX ∓100%, `--ease-calm`, 1.2 s) revealing the page → overlay fades out, removed from DOM → dispatch `window.dispatchEvent(new Event('gate:opened'))`.
- Body scroll stays locked until `gate:opened`.
- Reduced motion: skip the door slide; crossfade overlay instead.

## Assets
`svg/door-left.svg`, `svg/door-right.svg`, `svg/bell.svg`, `svg/diya.svg`, `rive/bell.riv`, `rive/diya.riv`, `audio/bell.mp3`, `audio/bgm.mp3`.

## Acceptance
- Works with every asset missing (placeholders + fallbacks) and with sound blocked.
- Rope drag works with touch; tap targets ≥ 44px.
- Page cannot scroll before opening; scrolls normally after.
- No layout shift when the overlay is removed.
