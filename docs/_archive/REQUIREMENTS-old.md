# REQUIREMENTS.md — pending assets and inputs

Status: `needed` → `in-progress` → `done`. Drop files into `assets/<type>/` using the EXACT file names below.

## A. From YOU (inputs)
| ID | Item | Where it goes | Status |
|---|---|---|---|
| U1 | Samikshya's photo (square crop, face centered; I'll compress to ≤ 200 KB) | `assets/img/samikshya.webp` | needed |
| U2 | Background music: soft instrumental (flute/sitar), 60–120 s loopable, royalty-free, ≤ 2 MB | `assets/audio/bgm.mp3` | needed |
| U3 | Google Maps share link of the venue | `src/content.js → venue.mapsUrl` | needed |
| U4 | Confirm name order on the card (mother/father, grandmother/grandfather) | `src/content.js` | needed |
| U5 | The final card's Ganesha illustration as a file (PNG/SVG), or extract from the final card SVG | `assets/img/ganesha.webp` (T05) | done |
| U6 | Fonts (free, Google Fonts): Great Vibes, Cormorant Garamond (400/600/700 + italic), Cinzel (600/700), Noto Serif Devanagari (600/700) as woff2 | `assets/fonts/` | needed |
| U7 | Hosting choice (Netlify drag-and-drop is fine) and optional custom domain | — | needed |
| U8 | Short SFX (royalty-free): temple bell, diya "whoosh", soft chime, light scratch | `assets/audio/{bell,diya,chime,scratch}.mp3` (each < 60 KB) | needed |

If you can't find U2/U8, use the generation prompts in section D.

## B. SVG assets (Antigravity, task T03 / T04). All: `viewBox` set, palette tokens only (`docs/DESIGN-TOKENS.md`), ≤ 40 KB, flat vector, no raster, ids prefixed with the file name.
| ID | File | Spec | Used by | Status |
|---|---|---|---|---|
| A1 | `svg/mandala.svg` | Layered 12-petal copper-and-navy mandala, 300×300, as on the printed card (copper strokes on navy-mid fill) | 01,03,09 | done |
| A2 | `svg/lotus.svg` | Closed-to-open lotus, peach + copper outline, 120×90 | 04,07 | done |
| A3 | `svg/lotus-petal.svg` | ONE petal, 60×120, pivot at bottom center, peach fill copper outline (will be rotated 16×) | 03 | done |
| A4 | `svg/diya.svg` | Brass diya (gold gradient bowl) + separable flame `#flame` and glow `#glow` groups, 100×80 | 00,01,06,08 | done |
| A5 | `svg/peacock.svg` | Peacock facing right, navy/teal/green body, gold eye feathers — match the card's peacock, 220×240 | 07 | done |
| A6 | `svg/peacock-feather.svg` | ONE feather with eye, 40×200, pivot bottom center | 09 | done |
| A7 | `svg/marigold-petal.svg` | Single flame-orange petal, 24×24 | 03,06,09 | done |
| A8 | `svg/tile-wave.svg` | Seamless navy wave-pattern tile 64×64 (as the card border) | all | done |
| A9 | `svg/tile-jaali.svg` | Seamless lattice tile 56×56 (stars + circles), stroke gold-light | 02,08 | done |
| A10 | `svg/divider-lotus.svg` | Line–lotus–line divider, 240×24 | misc | done |
| A11 | `svg/divider-diamond.svg` | Line–diamond–line divider, 240×12 | misc | done |
| B1 | `svg/door-left.svg` / `door-right.svg` | Carved jharokha door halves, 195×844 each, navy with copper panels and jaali, centered seam | 00 | done |
| B2 | `svg/bell.svg` | Brass temple bell with rope and handle, 120×260 | 00,08 | done |
| B3 | `svg/rangoli.svg` | 300×300 mandala rangoli as separate stroke-only `<path>` rings, ids `r1…r8` inner→outer | 01 | done |
| B4 | `svg/palm-leaf.svg` | Tall palm leaf, 340×560, peach body with copper edge lines, two string holes + gold cord at top | 02 | done |
| B5 | `svg/stylus.svg` | Small pen/stylus, copper, 24×60 | 02 | done |
| B6 | `svg/leaf-roll.svg` | Rolled-edge strip for the unroll, 340×24 | 02 | done |
| B7 | `svg/vine.svg` | 390×700 vine: `#stem`, `#b1 #b2 #b3`, many `.leaf`, nodes `#bloom-gp #bloom-parents #bloom-top` | 04 | done |
| B8 | `svg/path-alpana.svg` | 390×640 dotted S-curve `<path id="route">` | 07 | done |
| B9 | `svg/house.svg` | Simple village house, windows `#win1 #win2`, door `#door`, dark by default, 200×180 | 07 | done |
| B10 | `svg/aarti-lamp.svg` | Aarti lamp/thali icon, 44×44 | 05 | done |
| B11 | `svg/scratch-foil.svg` | 330×210 gold foil with tone-on-tone mandala pattern | 06 | done |
| B12 | `svg/lamp.svg` | Small flame-lamp marker 28×28 | 07 | done |
| B13 | `img/placeholder-portrait.svg` | Neutral peach/copper portrait silhouette, 300×300 | 03 | done |
| B14 | `img/og.jpg`, `favicon.svg` | 1200×630 share image, favicon (T05) | index.html | done |

## C. Rive files (YOU, in the Rive editor or from Rive Community). Artboard `Main`, state machine `SM`, ≤ 100 KB each, transparent background, palette from tokens.
| ID | File | Inputs | Look | Fallback | Status |
|---|---|---|---|---|---|
| R1 | `rive/bell.riv` | trigger `ring` | Brass bell swings and settles (~1.5 s) | `svg/bell.svg` | optional |
| R2 | `rive/diya.riv` | boolean `lit` | Unlit diya → flame ignites with a flickering loop | `svg/diya.svg` | optional |
| R3 | `rive/lotus-bloom.riv` | number `bloom` 0–100 | 16-petal lotus from closed bud (0) to fully open (100), center left empty for the photo | 16 × `lotus-petal.svg` | optional |
| R4 | `rive/peacock-fan.riv` | number `open` 0–100 | Peacock tail closed (0) → fully fanned (100), eyes gold/teal | 9 × `peacock-feather.svg` | optional |
Tip: search Rive Community for "bell", "diya flame", "lotus bloom", "peacock" files and restyle colors to the palette.

## D. Generation prompts (use only if you can't find the file)
**Music (Suno/Udio/other):**
`Soft Indian devotional instrumental, bansuri flute lead with gentle sitar and tanpura drone, slow tempo 70 BPM, calm, warm, premium, no vocals, no percussion drops, seamless loop, 90 seconds.`
**SFX (any sound-effect generator):**
- `Single temple bell ring, brass, short reverb, 2 seconds`
- `Soft whoosh of a diya flame lighting, gentle, 1 second`
- `Soft chime, three notes ascending, 1.5 seconds`
- `Light scratching on a metal foil, 1 second, quiet`
**Photo help:** none needed; use her real photo. If I should clean the background or crop, send it and say so.
