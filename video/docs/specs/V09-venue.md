# V09 — Venue with a drawn map (scene slot 8, 160 frames, global start 1290)
Needs V08. File: `src/scenes/SceneVenue.tsx`, `src/components/DrawnMap.tsx`. Text layout and typography: `../docs/specs/06-venue.md` (site spec wins for text). Reference: `../qa/S06-p100.png` (the real site uses a live Google map; **the film must not use Google Maps imagery, screenshots, iframes or place names**; the map is drawn in code as below).
Texts: `content.venue.label`, `content.venue.lines` (2 lines). Ground `--sand`, grain, vignette. Transition in: `circle` (wrapper).

## Layout (video px)
- Label (`Label`) left-aligned at x = 151, centre y = 250.
- Address: the 2 lines, Cormorant 500, 76 px (site `addr` 33.5 px), line height 1.15, ink, left-aligned at x = 151, first line centre y = 330 (second ≈ 418). Plain text, big and crisp (elders read this).
- Map panel: x = 151, y = 520, width 778, height 760, corner radius 14 px (the only rounded thing), `overflow: hidden`, border 2 px `--wood` at .35. Inside, an SVG `viewBox="0 0 778 760"`.

## `DrawnMap.tsx` (draw exactly this; no extra labels, no text on the map)
- Base rect fill `--sand-lt`.
- Parks: ellipse (150,180) rx 90 ry 60 and ellipse (640,600) rx 110 ry 70, fill `--sage` at .35.
- Minor roads (stroke `--ivory`, width 12, round caps): `M -20 300 C 120 280 240 300 360 270 S 600 180 800 120` · `M 600 -20 C 620 140 640 260 700 360 S 790 520 800 560` · `M -20 700 L 340 660` · `M 520 520 L 800 640` · `M 80 120 L 300 200`.
- Major roads (stroke `--ivory`, width 22, round caps, each with a casing: the same path drawn first with stroke `--wood` .25 opacity, width 26): A `M -20 610 C 150 560 290 480 420 410 S 700 280 800 200` · B `M 250 -20 C 300 160 400 290 430 420 S 520 690 560 780`.
- Route: `M 30 740 C 120 640 220 560 320 500 S 400 440 430 418`, stroke `--saffron-deep`, width 6, `strokeLinecap: round`, `strokeDasharray: "1 16"` (dotted), drawn progressively (animate via a mask or via pathLength clip so the dots appear along the path).
- Pin at (430, 418): teardrop path pointing down, 56 px tall, fill `--saffron`, 3 px stroke `--saffron-deep`, an ivory circle r 9 in its head; a soft ellipse shadow under the tip (`--wood-dk` .25). Ripple ring: circle at (430, 418), stroke `--saffron-deep` 3 px.
Gold dust is NOT used in this scene; `Petals` (6) yes, from frame 20.

## Timeline (local frames)
- 10–30: label `fadeUp`. 16–46: the two address lines `fadeUp` with stagger 8.
- 30–70: **iris reveal** of the map: clip-path `circle(r at 430px 418px)` (in panel coordinates) with r 0 → 1000, `E.light`.
- 40–80: roads draw (dashoffset, minor first then major; stagger 4).
- 70–100: dotted route draws toward the pin.
- 96–112: pin drops from 300 px above to its place with a small bounce (use `spring` with damping 12, stiffness 120), shadow fades in; at landing a haptic-like squash (scaleY .9 for 3 frames).
- 110–160: ripple ring repeats every 50 frames (scale 1 → 3.2, opacity .55 → 0). Hold: address visible from 46, pin from 112.

## Check
Global stills 1310, 1340, 1370, 1410, 1440 → `qa/V09-f<frame>.png`. Check: address readable at full size, map panel inside safe area (bottom at y = 1280), pin on the road crossing, no text anywhere on the map, no Google logos. Reply ≤ 5 lines.
