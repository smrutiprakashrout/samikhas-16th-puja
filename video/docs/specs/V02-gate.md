# V02 — Gate: the sandalwood doors open into light (scene slot 1, 210 frames)
Needs V01. File: `src/scenes/SceneGate.tsx` (+ helper files if needed). Geometry, colours and carving come from `../docs/specs/00-gate.md` (sections 3 and 4) and `../src/sections/00-gate/door.svg`: **read those two**; the site spec wins on sizes, colours and layering. This task changes only TIMING and removes interaction.
Reference: `../qa/G00-idle.png` (closed) and `../qa/G00b-opening.png` (opening).

## Differences from the website
- No tap, no "Tap to open" text, no mute button, no tilt, no keyboard. The film plays by itself.
- Keep the top label `content.gate.kicker`. Doors fill the whole 1080×1920 frame, 540 px each. Door art is 195×844; fit it to the height without cropping the lattice window or the mandala (scale by height = 2.275 → 444 px wide) and extend the outer 96 px of each door with the same wood gradient + vertical grain so there is no gap at the screen edge. Hinge plates stay at the outer edge of the art, not the screen edge.
- `door.svg` contains `{{p}}`: replace with `gl` for the left door and `gr` for the right (unique ids). Inline it with `dangerouslySetInnerHTML`.
- The "16th" numeral (Cormorant 500, `min(34vw,148px)` on the site → **367 px** here) sits centred on the seam at 50% height, gradient + emboss from the site spec. The numeral's shine sweep is frame-driven (background-position over 150 frames, loop).
- All site CSS animations become frame functions: lattice backlight opacity .3↔.6 every 96 frames (`sine`), seam pulse every 96 frames, embers 34 particles (alternate marigold/white, radius .5–2 site px, rise .12–.47 site px per frame, sway ±8 px, alpha .3–.8) and specks, deterministic.

## Timeline (local frames)
- 0–12: nothing hidden; frame 0 must already look good (doors closed, glowing seam). Kicker label `fadeUp` 8–28.
- 0–210: whole scene slow push-in scale 1.00 → 1.04, origin on the seam (50% 50%).
- 56–84 **latch settle:** both doors rotateY ±1.2° away then back to 0 (ease `E.door`), seam widens from 3 to 14 px using `scaleX(1→7)`, kicker fades out (opacity → 0).
- 84–150 **swing:** left door rotateY 0 → −104° about its left edge, right door 0 → +104° about its right edge, `E.door`, wrapper `perspective: 2500px`. As the doors open they darken slightly (opacity of a `--wood-dk` overlay 0 → .35).
- 80–170 **bloom:** the light layer behind the doors: a near-white core (`#FFF6E0`) with warm edges (`#FFE2A6`, `--marigold`), scale .2 → 3.2, `E.light`; rays (rotated thin wedges, uneven lengths, seeded) slowly rotate 0 → 25°; the door edges nearest the seam get an overexposed white inner glow growing with the bloom.
- 150–195 **flood:** a full-screen `--flood` (#FFF9EC) layer opacity 0 → 1, `E.flood`. At frame 195 it is fully opaque. (The Ganesha scene starts at global frame 190 with the same flood colour, so the handover is invisible.)
- 195–210: hold flood (nothing else visible).

## Check
Stills of `Invite` at global frames 0, 70, 100, 125, 150, 175 → `qa/V02-f<frame>.png`. Compare 0 and 100 against the references with `npm run compare`. Look for: no gap at screen edges, "16" and "th" both visible on the seam at frame 0, doors really swinging in 3D at 100–125, flood white at 175. Reply ≤ 5 lines.
