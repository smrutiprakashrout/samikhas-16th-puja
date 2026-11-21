# TASKS.md

Deadline: **Sat 21 Nov 2026**. Owners: **CX** = Codex (expensive, use sparingly) · **OC** = OpenCode · **AG** = Antigravity · **YOU** = you.
Tick `[x]` with a one-line note when done. Max parallelism: AG assets + OC sections run at the same time.

## Paste-ready prompt (use for any task, change only the ID)
```
Read AGENTS.md, then TASKS.md task <ID>, then only the files it names. Do only that task.
Follow the acceptance criteria. Save a 390×844 screenshot to qa/<ID>.png. Tick the box in TASKS.md. Reply in ≤ 5 lines.
```

---
## Phase 1 — Foundation (Thu evening)
- [x] **T01 · OC · Scaffold.** Done 2026-11-19: Vite scaffold + deps (animejs 4.5.0, Rive 2.51.0), stubs, build passes, screenshot qa/T01.png; missing fonts warn as expected. Vite vanilla project in this folder: `npm i animejs @rive-app/canvas`; `vite.config.js` with `publicDir: 'assets'`; `index.html` shell (viewport meta `width=device-width, initial-scale=1, viewport-fit=cover`, Open Graph tags using `/img/og.jpg`, `<main id="scenes">`, fixed mute button); `src/styles/tokens.css` (from `docs/DESIGN-TOKENS.md`), `base.css` (480px centered column, navy backdrop, `@font-face` for fonts in `assets/fonts/`, reduced-motion rules); empty stubs `src/sections/NN-*/index.js` + `style.css` exporting the contract. Reads: `ARCHITECTURE.md`, `docs/DESIGN-TOKENS.md`. Done when `npm run dev` shows the navy page.
- [x] **T02 · CX · Core (small, critical).** Implement `src/core/{scene,parallax,audio,rive,particles,util}.js` and `src/main.js` exactly per `ARCHITECTURE.md` (section contract, `ctx.scrub` with 0–1000 timeline synced via anime.js v4 `onScroll`, lazy mount, gate lock/unlock, audio with mute, Rive loader with SVG fallback, `ics()` helper). Add a throwaway demo section proving a 300vh scrubbed tween works at 390px. Then **freeze the API**: write the final signatures at the top of `ARCHITECTURE.md`. Reads: `ARCHITECTURE.md`, `AGENTS.md` only. — Core engine implemented and build passes; browser QA blocked by sandbox port binding.
- [x] **T03 · AG · SVG set A (shared motifs).** Done 2026-11-19: Created all 11 SVGs (A1–A11) in `assets/svg/` strictly matching design tokens & specs, all ≤ 17 KB, viewBox set, IDs prefixed, seamless tiles verified; built contact sheet `assets/svg/_preview.html` and saved QA screenshot to `qa/T03.png`.
- [x] **T04 · AG · SVG set B (scene art).** Done 2026-11-19: Created all 14 SVGs (B1–B13) with required animation IDs verified, under size budget (all ≤ 10 KB), palette tokens only; contact sheet _preview-b.html and screenshot qa/T04.png.
- [x] **T05 · AG · Raster extras.** Done 2026-11-19: Created assets/img/ganesha.webp (520px wide transparent, 27 KB), assets/img/og.jpg (1200×630, 139 KB), and assets/favicon.svg (64×64 diya on navy); screenshot saved to qa/T05.png.
- [ ] **R01–R04 · YOU · Rive files** (see `REQUIREMENTS.md` section C): `bell.riv`, `diya.riv`, `lotus-bloom.riv`, `peacock-fan.riv`. Optional: the site works with fallbacks if skipped.

## Phase 2 — Sections (Fri) · all OC, one session each, can run in parallel after T01 + T02
- [x] **S00 · gate** → `docs/sections/00-gate.md` — done 2026-11-19: bell tap/rope drag/hint open, Rive+SVG fallbacks, reduced-motion path, build/screenshot qa/S00.png pass; missing Rive/audio noted in qa/BUGS.md.
- [x] **S01 · opening** → `docs/sections/01-opening.md` (needs B3 rangoli) — done 2026-11-19: 300vh scrub beats, rangoli draw/diya one-shot lit/title wipe/sparks, reduced-motion final state, build + qa/S01.png pass; missing diya.riv noted in qa/BUGS.md.
- [x] **S02 · invitation** → `docs/sections/02-invitation.md` (needs B4 palm leaf) — done 2026-11-19: 300vh palm-leaf unroll, stylus-tracked text engraving beats, no text clipping at 360/390/430, reduced-motion final state, build + qa/S02.png pass.
- [x] **S03 · samikshya** → `docs/sections/03-samikshya.md` (needs A3, photo) — done 2026-11-19: 350vh lotus bloom via 16-petal fallback, photo reveals after bloom with ring, names write in and lead fades, reduced-motion final state, build + qa/S03.png pass; missing .riv/photo noted in qa/BUGS.md.
- [x] **S04 · family** → `docs/sections/04-family.md` (needs B7 vine) — done 2026-11-19: 350vh stem/branches draw in three beats, blooms+leaves stagger, three DOM-ordered chips with no leaf overlap at 360/390/430, reduced-motion final state, build + qa/S04.png pass.
- [x] **S05 · shloka** → `docs/sections/05-shloka.md` (needs ganesha.webp, B10 lamp) — done 2026-11-19: masked aarti reveal follows pointer tap/horizontal drag or scroll S-path, full lit + meaning at 0.85 with one-shot chime, real Devanagari text, pan-y scroll intact, reduced-motion final state, build + qa/S05.png pass; missing ganesha.webp noted in qa/BUGS.md.
- [x] **S06 · details** → `docs/sections/06-details.md` (needs B11 foil, A4 diya) — done 2026-11-19: canvas scratch reveal (55% cleared, tap fallback, auto at 400, scroll never locked), 7 diyas lighting 450–750 + timeText, IST countdown with .ics download, reduced-motion final state, build + qa/S06.png pass at 360/390/430; optional scratch.mp3 noted in qa/BUGS.md.
- [x] **S07 · venue** → `docs/sections/07-venue.md` (needs B8 path, B9 house) — done 2026-11-19: lamp follows #route via getPointAtLength (exact at 360/390/430), four stops pop at 25/45/65/82%, house lights 800–900, peacocks + nameplate 900–1000, plain 22px selectable address with working Copy and Maps hidden when URL empty, reduced-motion final state, build + qa/S07.png pass.
- [x] **S08 · rsvp** → `docs/sections/08-rsvp.md` — done 2026-11-19: tap-to-light diya (Rive `diya.riv` with `svg/diya.svg` fallback + warning), glow/particles/bell sfx, prompt switches to the hard-coded thank-you, copper-arch panel with two selectable numbers + Call/WhatsApp and ringing bells, scrub 0–300 diya rise, 300–600 panel rise, lit state persists, reduced-motion final state, build + qa/S08.png pass.
- [x] **S09 · closing** → `docs/sections/09-closing.md` — done 2026-11-19: 250vh scrub, 9-feather peacock fan opens −80°→+80° over 0–600 (Rive `peacock-fan.riv` with feather fallback + warning), closing line writes in via clip-path 500–800, share button rises 800–1000 with gentle fan sway, native `navigator.share` with clean `wa.me` fallback, marigold shower from progress 0.5 capped at 40 nodes and stopped off-screen, tap-anywhere burst, reduced-motion final state, build + qa/S09.png pass at 360/390/430.
Each section may use placeholders if an asset isn't ready; swap later (no code change needed when the same file name is replaced).

## Phase 3 — Integrate, QA, ship (Sat)
- [ ] **I01 · CX · Integrate.** Mount all sections in order, check gate lock/unlock, scroll order, parallax, audio/mute, lazy init. Fix cross-section conflicts only. Total payload within the budget.
- [ ] **Q01 · AG · Browser QA.** Run the site at 390×844 and 360×740; scroll through every scene; screenshot each into `qa/`; produce `qa/BUGS.md` as one-line items (`[section] problem — expected`). Check: text overflow, overlaps, janky scenes, console errors, missing assets.
- [ ] **B01… · OC (small bugs) / CX (hard bugs).** Work the list in `qa/BUGS.md`.
- [ ] **Q02 · YOU · Real-phone test** on your phone and one other (iPhone if possible): sound, scratch, drag, `tel:`/WhatsApp links, share.
- [ ] **D01 · AG or OC · Deploy.** `npm run build` → drag `dist/` to Netlify; send you the link. Check the WhatsApp link preview (title, image).

## Suggested schedule
| When | Do |
|---|---|
| Thu 19 eve | T01 (OC), T02 (CX), T03 + T04 (AG), you start R01–R04 and collect photo/music/maps link |
| Fri 20 morning | S00–S02 (OC), T05 (AG) |
| Fri 20 afternoon | S03–S05 (OC) |
| Fri 20 night | S06–S09 (OC) |
| Sat 21 morning | I01 (CX), Q01 (AG), bug fixes |
| Sat 21 midday | Q02, D01, send the link |

## Cut list (if time runs short, in this order)
1. Family vine → replace with two sliding navy arch panels.
2. Venue path → static signboard (keep the plain address + Maps button).
3. Rive pieces → use the SVG fallbacks only.
4. Palm-leaf engraving → simple line-by-line fade.
Never cut: gate, scratch card date, details, address, RSVP numbers, music button.

## Token-saving rules
- One section per agent session; never paste the whole repo.
- If a task needs a decision, the agent writes it in 1 line in `qa/BUGS.md` and moves on, not a long discussion.
- Bring back to Claude only: design questions, new prompts, or when something fails twice.
