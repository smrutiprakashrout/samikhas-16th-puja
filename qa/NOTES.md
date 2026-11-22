# NOTES
T01: ?dev=1 replay button deferred to G00 (no gate yet; index.html body fixed by spec).
G00: anime.js v4 uses `cubicBezier(...)` functions; the `ease:'cubicBezier(...)'` string is deprecated and warns in this version.
G00: seam 2px→14px is done with `scaleX(1→7)` so only transform/opacity/filter animate.
G00: audio kick is deferred two rAF frames; calling audio.start() in the same frame lets Chromium's rAF timestamp precede performance.now() and set a negative bgm volume (console error).
G00: right-door `<use href="#gd-art">` renders correctly in Chromium; no id-renamed fallback needed.
S01: hint label "Scroll" and the image alt are literal UI strings from the spec markup; all chapter content text still comes from src/content.js.
S02: S01 grain/vignette/dust/petal code was factored into src/sections/01-ganesha/ambience.{js,css} and shared by both chapters; the intermediate niche gradient uses a color-mix of sand tokens.
S04: Blossom centre uses the spec-literal #FFD58A (no token exists); petals/stroke use --marigold/--saffron-deep, and the S03 temporary tail was removed.
S04: Spec's explicit CSS/JS place node/blossom top anchors at 231u/431u/626u with the thread at the same y values; QA checks those anchors (prose "centres" is read as the same anchor point).
S05: Foil gradient, ray/shadow colours and the #FFD58A petal follow spec literals; canvas label is drawn letter-by-letter to honour the 3px tracking without relying on ctx.letterSpacing.
S05: Scoped ticket/hint/petal selectors to `.band` to avoid S01 `.hint`/`.pt` collisions; vibrate is skipped when `navigator.userActivation.hasBeenActive` is false so automatic/reduced reveals produce no console error.
S05: Panel glow uses the spec's literal rgba(255,226,166,.9); the numeral emboss keeps --flood (#FFF9EC) as specified.
S05: Calendar link path verified with a temporary dummy URL (button rendered, href matched, 48px target, faded in after reveal), then reverted to empty as required.
S06: Real iframe uses `ll=` with no Google marker; screenshot scan found 0 Google-red pixels in the map area, so the saffron pin is the only marker. S05 temp tail removed; ivory 60svh tail marked "TEMP until RSVP spec" follows S06.
S07: spec's `::before` at top:-30svh was fully clipped by the required section `overflow:hidden`, so the fade now uses the same `::before` at top:0 with sand→ivory to give a seamless join; S06 ivory tail overridden with sand tail until closing spec.
S08: Garland generator extracted to `src/core/garland.js` with a per-instance seed 7; S01 top/left/right garlands and petal markup are byte-for-byte identical to the pre-refactor capture. Share tested with clipboard, forced-rejection fallback and simulated native sheet; RSVP→closing join sampled at ivory with max adjacent delta 2/765.
L45: S04 kept unchanged except 240svh; disc origin uses the blossom's real centre (gutter+.5, 626u+15.5) so it grows from the visible flower, not the 626u CSS top anchor.
L45: §3 starts the ticket at q=.20 while §8 labels q=.27 "flat saffron"; kept §3 timings, so L45-q27.png has the first thin ticket strip over an otherwise saffron screen.
L45: Added only the allowed `.ven { z-index:61 }`; the stage class/id swap from main.js's `.band` shell is done inside S05 mount without touching core/main.
S03b: approved visual reference docs/prototype/reference-puja.jpg is not present in the repo; layout was implemented from the spec's converted u values only.
S03b: spec asset path assets/img/kalash.svg is absent; the existing assets/svg/kalash.svg was inlined unchanged via ?raw from its actual path.
