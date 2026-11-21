# 02 — Invitation: "Palm-leaf manuscript (talapatra)"
Owner: OpenCode · Scene height `300vh` · scrubbed.

## Goal
Odisha's engraved palm-leaf books: a palm-leaf strip unrolls downward and a stylus "engraves" the invitation text line by line.

## Content
`invite.blessing`, `invite.headline`, `invite.body`.

## Layers
1. Background navy-deep, `tile-jaali` at 8% (`data-depth="0.2"`).
2. Palm leaf panel (`svg/palm-leaf.svg` used as a background image of a tall `div`, 340px wide): peach/ivory body with copper edge lines and two string holes with a thin gold cord at the top that stays fixed.
3. Text lines inside the leaf (real HTML, navy ink, Cormorant, ≥ 20px; headline in Great Vibes).
4. `svg/stylus.svg` (small copper pen) that moves along the current line.

## Scroll beats
- 0–250: leaf unrolls — a clip-path `inset(0 0 100% 0)` → `inset(0)` plus a rolled-edge element (`svg/leaf-roll.svg` or CSS gradient) moving down with the edge (transform only).
- 250–450: blessing line engraves (clip-path inset right → 0, left→right), stylus tracks the reveal edge.
- 450–700: headline engraves.
- 700–950: body text engraves line by line (split into 3–4 lines, each its own clip-path tween).
- 950–1000: stylus lifts away (translateY −20, opacity 0).
Parallax: jaali layer drifts slower than the leaf.

## Assets
`svg/palm-leaf.svg`, `svg/stylus.svg`, `svg/tile-jaali.svg`.

## Acceptance
- Text is real selectable HTML, readable at the end state even with reduced motion.
- Stylus stays aligned with the reveal edge on 360px and 430px widths (use percentages/em, not fixed px offsets).
- Leaf panel never overflows the viewport.
