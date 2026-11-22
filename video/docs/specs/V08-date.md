# V08 — Date and time: the scratch ticket (scene slot 7, 200 frames, global start 1110)
Needs V07. File: `src/scenes/SceneDate.tsx`. Geometry, colours, foil, ticket, emboss: `../docs/specs/05-date.md` (read it; site spec wins on layout and colours). Reference: `../qa/S05-done.png`. Assets: `public/svg/scratch-foil.svg`, `public/svg/stylus.svg`.
Texts: `content.date.label`, `.day`, `.month`, `.weekday`, `.time`, `.timeNote`, and `videoContent.dateScene.timeLabel` ("Birthday Puja"; if it is `''` render nothing).
Ground `--saffron` with the soft light rays of the site version. Transition in: `rise` (wrapper). The film has NO hint text, NO "Reveal the date" button, NO calendar link: the scratching is automatic.

## The only layout change
Directly above the time ("7:00 PM") add a small label line with `timeLabel` (label style, 11 site px). Keep all other spacings of the site spec; if the extra line pushes content into the bottom unsafe zone, shift the whole ticket up by the needed amount.

## Timeline (local frames)
- 0–24: saffron ground is already there from the wrapper. Ticket slides up: translateY `u(120)`→0, opacity 0→1, 14–44, `E.out`.
- 40–92: **automatic scratch:** the foil (opaque `scratch-foil.svg`) covers the panel. A stylus (`stylus.svg`) follows 4 deterministic back-and-forth strokes (zig-zag, each ~12 frames, overlapping the previous by 2) and the foil is removed behind it: implement the foil with an SVG `<mask>` whose white stroked paths grow with `strokeDashoffset` (stroke width ≈ `u(34)`), so the date underneath is revealed exactly where the stylus has been. After stroke 4 the remaining foil fades out (opacity → 0 over 8 frames).
- 84–104: `day` ("29") lands: scale 1.15→1, opacity 0→1, `E.out`, with the emboss from the site spec; 6 tiny `#FFD58A` petals burst outward (deterministic) and fade.
- 100: `month`; 106: `weekday` (italic); 112: `timeLabel`; 118: `time` ("7:00 PM"); 126: `timeNote` ("onwards"), each `fadeUp` (dist 12, 20 frames).
- 140–200: hold (everything visible ≥ 60 frames). The numeral gets the site's subtle shine sweep once at frame 150.

## Check
Global stills 1130, 1160, 1185, 1210, 1250, 1300 → `qa/V08-f<frame>.png`; compare 1300 with `../qa/S05-done.png`. Check: scratched region matches the stylus path, "29" crisp, "7:00 PM" and "onwards" readable, `timeLabel` present, nothing in the unsafe zones. Reply ≤ 5 lines.
