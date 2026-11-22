# V03 — Ganesha + shloka (scene slot 2, 270 frames, starts at global frame 190)
Needs V02. File: `src/scenes/SceneGanesha.tsx`. Geometry, sizes, ornaments: `../docs/specs/01-ganesha.md` (read it; site spec wins on layout) and `../src/sections/01-ganesha/art.js` for the halo and lotus drawing. Reference: `../qa/S01-p30.png` (shows the finished chapter).
Texts: `content.invocation.label`, `content.invocation.sanskrit`, `content.shloka.lines` (4), `content.shloka.meaning`, image `content.shloka.image` → `public/img/ganesha.webp` (800×1190, RGBA).

## Differences from the website
No scroll, no hint label, no mute button. Ground is `--sand` with grain + vignette. Garland: `Garland` component (top + sides), `Dust` (gold, 24), `Petals` (8, from frame 40).
The Odia lines use `fontFamily: odia`, weight 600, sizes from the site spec ×2.275.

## Timeline (local frames)
- 0–40: a `--flood` overlay (full-bleed) fades opacity 1 → 0 with `E.flood` reversed (use `E.out`); this is the dissolve out of the gate.
- 8–38: garland drops in (`Garland from=8`).
- 20–40: label (invocation.label) `fadeUp`. 28–52: Odia invocation `fadeUp`.
- 20–70: 16-petal mandala halo draws (stroke-dashoffset, 1 px at site scale, `--wood`) and then rotates 360° per 1800 frames forever.
- 36–76: Ganesha image rises: translateY `u(40)`→0, scale .94→1, opacity 0→1, `E.out`; a marigold glow (radial, `--marigold` at .45 → 0) sits behind and pulses ±8% (period 120). After 76 he floats ±`u(3)` (sine period 120).
- 50–70: the lotus under Ganesha (`public/svg/lotus.svg`, per site spec) scaleY .6→1, opacity 0→1.
- 84–180: the four shloka lines are written one after another, line i starts at `84 + i*22`, each `wipe` 24 frames.
- 186–210: meaning (italic, 18 px site) `fadeUp`.
- 210–270: hold (everything visible, idle motion continues).

## Check
Global-frame stills: 200, 230, 270, 330, 400, 450 → `qa/V03-f<frame>.png`. `npm run compare -- qa/V03-f400.png ../qa/S01-p30.png`. Look for: all four Odia lines readable with joined conjuncts, garland not touching text, Ganesha not cropped, nothing in the bottom 340 px that must be read except the meaning (move the whole stack up by the same amount if it falls in the bottom zone, keep relative spacing). Reply ≤ 5 lines.
