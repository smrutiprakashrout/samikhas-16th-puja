# V10 — RSVP diya, then Closing (scene slot 9, 305 frames, global start 1430)
Needs V09. File: `src/scenes/SceneRsvp.tsx` (RSVP and Closing are ONE scene with two halves). Geometry: `../docs/specs/07-rsvp.md` and `../docs/specs/08-closing.md` (site specs win on layout). References: `../qa/S07-lit.png` (RSVP) and `../qa/S08-end.png` (closing). Diya: `public/svg/diya.svg` (viewBox 0 0 100 80; ids `diya-glow`, `diya-flame`, `diya-bowl`; inline it as JSX, keep the paths untouched).
Texts: `content.rsvp.label`, `content.rsvp.contacts[0].phone`, `[1].phone` (and `.name` only if non-empty), `content.rsvp.thanks`; closing: `content.closing.blessing`, `.family.pre/.accent/.post`, `.eventLine`, `.dateLine`, `.thanks`; optional `videoContent.siteUrl` (render only if non-empty).
NO Call/WhatsApp buttons, NO hint text, NO share button, NO mute button in the film.
Ground: `--ivory` at the start; in the closing half it cross-fades to `--sand` (two stacked backgrounds, sand opacity 0→1 over frames 170–200). Grain, `Petals` (8) and `Dust` (12) throughout.

## Timeline (local frames) — RSVP half
- 0–14: label `fadeUp`.
- 10–36: **diya lights:** the diya sits centred, width 420 px, upper third of the safe area (as in the reference). Before 10 the flame group is hidden. 10–36: flame scaleY 0→1 and scaleX .6→1 about (50,44) in SVG units, `E.out`; glow opacity 0→1 and scale .6→1; a warm pool of light under the diya (radial ellipse, `--marigold` .35 → 0) fades in. After 36 the flame flickers deterministically: scaleY `1 + .04·sine(frame,17)`, scaleX `1 + .03·sine(frame,23)`, skewX `2°·sine(frame,31)`; glow opacity `.85 + .1·sine(frame,19)`.
- 34–52: first number: hairline above it draws, number `fadeUp`. 52–70: second number the same. Numbers: Cormorant 500, 100 px, ink, centred, plain selectable-style text with the site's spacing between digits ("98539 93661"), ~170 px between the two.
- 70–170: hold: both numbers fully visible for **100 frames**. `thanks` (italic, Cormorant 400, 20 site px) `fadeUp` at 90.
- 170–190: the whole RSVP block fades out (opacity → 0, translateY `-u(12)`), diya last.

## Timeline — Closing half
- 170–200: `Garland` drops in (same as the Ganesha scene, `from=170`). Background crossfade ivory → sand (170–200).
- 184: `blessing` (Cormorant italic 400, 20 site px) `fadeUp`.
- 190–214: family line: "The" · "Panda" (italic, saffron-deep) · "family", Cormorant 500, 44 site px (≈ 100 px), `Words` stagger 6.
- 216: `eventLine` (label style, uppercase), 222: `dateLine` (label style).
- 234: `thanks` (label style, ink at .74). 246: `siteUrl` label if non-empty.
- 250–290: hold (all visible from frame 246). Petals keep falling.
- 290–305: everything (including garland) fades opacity 1→0 over the plain `--sand` ground. The film ends on clean sand.

## Check
Global stills: 1450, 1470, 1500, 1540, 1590, 1630, 1660, 1690, 1720 → `qa/V10-f<frame>.png`; compare 1540 with `../qa/S07-lit.png` and 1690 with `../qa/S08-end.png`. Check: flame lit and glowing at 1500; both numbers fully visible and large at 1540; garland not touching text at 1690; last frame is plain sand. Reply ≤ 5 lines.
