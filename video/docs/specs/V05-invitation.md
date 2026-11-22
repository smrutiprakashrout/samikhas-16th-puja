# V05 — Invitation sentence (scene slot 4, 190 frames, global start 610)
Needs V04. File: `src/scenes/SceneInvitation.tsx`. Geometry: `../docs/specs/03-invitation.md` (site spec wins). Reference: `../qa/S03-p70.png` (the site version has the family column on the right; in the FILM the family is its own scene, so show only the left text block here, centred in the column).
Texts: `content.invitation.label`, `.before`, `.key`, `.after`, `.closing`.
Ground `--ivory` with a faint 16-petal mandala watermark (stroke `--wood` at .10 opacity, rotating slowly, as in the site). Transition in: `rise` (the sand→ivory wipe is done by the `Scene` wrapper).

## Layout
Left-aligned text block as in the site spec, but placed in the vertical middle of the safe area. Sentence = "big" style (Cormorant 500, 36 site px ≈ 82 video px, line height 1.18, `text-wrap: balance`), max width = column. `key` in italic saffron-deep.

## Timeline (local frames)
- 10–30: label `fadeUp`.
- 24–84: sentence `Words`, stagger 3 frames per word (this is the slow version).
- 70–96: a hand-drawn-style underline under `key` draws left→right (SVG path with slight wave, 3 px at site scale, `--saffron-deep`, dashoffset).
- 96–110: `Diamond` divider draws.
- 104–140: `closing` line `Words`, Cormorant italic 400 at 20 site px, ink at .8.
- 140–190: hold (the text is fully visible from frame 140; mandala keeps turning).

## Check
Global stills 640, 690, 730, 760 → `qa/V05-f<frame>.png`. Everything legible, no line shorter than two words (widows), sentence inside the column, nothing in the top 200 / bottom 340 px. Reply ≤ 5 lines.
