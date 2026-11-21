# 01 — Opening: "The rangoli draws itself"
Owner: OpenCode · Scene height `300vh` · scrubbed.

## Goal
As the guest scrolls, a mandala rangoli is drawn line by line from the center outward, a diya lights at its heart, and "16th Birthday Puja" appears.

## Content
`invocation.sanskrit`, `invocation.label`, `title.number`, `title.suffix`, `title.text`.

## Layers
1. Background navy-deep + `tile-wave` (`data-depth="0.15"`), faint large `mandala.svg` (`data-depth="0.35"`, 10% opacity).
2. Center: `svg/rangoli.svg` — concentric rings and petals as separate `<path>`s with ids `r1…r8` (inner → outer), stroke ivory/peach/copper, no fill.
3. Diya at center (Rive `diya.riv`, fallback `svg/diya.svg`).
4. Text: invocation at top; "16" + superscript "th" as large gold-gradient Cinzel numerals; "Birthday Puja" in Great Vibes.

## Scroll beats (progress 0–1000 on the timeline)
- 0–100: invocation fades/slides in at top; label below it.
- 50–600: rangoli paths draw with `svg.createDrawable` (stroke-dashoffset), staggered inner → outer, `linear` easing so scroll = drawing.
- 600–700: diya lights (`lit = true`, once, not scrubbed back) + soft radial gold glow behind it scales 0 → 1.
- 700–900: "16th" scales 0.8 → 1 and fades in; "Birthday Puja" revealed with a left→right clip-path wipe.
- 900–1000: 12 gold sparkles twinkle (`stagger`), rangoli rotates 6° total for life.
Scrolling back up un-draws everything except the diya lit state.

## Assets
`svg/rangoli.svg` (needs the ids above), `svg/mandala.svg`, `svg/tile-wave.svg`, `svg/diya.svg`, `rive/diya.riv`.

## Acceptance
- Rangoli drawing is smooth and tied exactly to scroll.
- "16th" has the `th` as a proper superscript; text is real HTML, readable.
- 60 fps feel at 390px (no per-frame layout).
