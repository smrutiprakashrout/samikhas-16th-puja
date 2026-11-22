# V04 — Hero: arch, photo, "16th", name (scene slot 3, 190 frames, global start 440)
Needs V03. File: `src/scenes/SceneHero.tsx`. Geometry and ornaments: `../docs/specs/02-hero.md` (read it; site spec wins on layout). Reference: `../qa/S02-p62.png`.
Texts: `content.title.number`, `content.title.suffix`, `content.title.text`, `content.honoree.first`, `content.honoree.rest`. Photo: `content.honoree.photo` → `public/img/samikshya.webp` (700×1171, RGBA). Keep the site's treatment exactly (arch, soft fade at the bottom of the photo), no new backgrounds.
Ground `--sand`, grain, vignette, `Petals` (8), `Dust` (16). Fade-in from the previous scene (`in: 'fade'`).

## Timeline (local frames)
- 0–30: arch outline draws (stroke-dashoffset, `--wood` 1 px site scale, `E.out`).
- 14–56: photo image-reveal (clip-path bottom→top) inside the arch; the photo scales 1.28 → 1.08 during the reveal, then keeps drifting to 1.04 by frame 190.
- 30–70: big saffron numeral `title.number` ("16") rises from behind the arch: translateY `u(60)`→0, opacity 0→1, `E.out`; the "th" (`title.suffix`, italic, .3em, raised, as in the site spec) fades in 60–72. Numeral stays BEHIND the photo as in the reference.
- 64–100: `title.text` ("Birthday Puja", "Puja" italic saffron-deep) with `Words` (stagger 4).
- 96–130: honoree name: `first` letter by letter (3 frames per letter, each letter `fadeUp` 12 frames, dist 10), then `rest` `fadeUp` at 120.
- 130–190: hold.

## Check
Global stills 450, 480, 520, 560, 600, 620 → `qa/V04-f<frame>.png`; compare 600 with `../qa/S02-p62.png`. Look for: face not cut by the arch, numeral behind the photo, name fully inside the safe zone (if the name lands in the bottom 340 px, move the whole composition up keeping spacing). Reply ≤ 5 lines.
