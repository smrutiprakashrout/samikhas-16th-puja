# AGENTS.md — rules for every coding agent (Codex, OpenCode, Antigravity)

Project: mobile-only scroll-animated invitation for **Samikshya Pragyan Panda's 16th Birthday Puja** (Sun 29 Nov 2026, 7:00 PM onwards). **Deadline: Sat 21 Nov 2026.**
Design: warm sand "sandalwood and marigold" look — see `docs/DESIGN-SYSTEM.md`. Visual reference: `docs/prototype/prototype-v3-gate-ganesha.html` (open it in a browser at phone width next to `assets/img/ganesha.webp`; tap the gate, scroll). It is a REFERENCE for look, timing and values, not production code. Do NOT read it whole; open only the parts your spec points to.

## Read order (saves tokens)
1. This file. 2. Your task in `TASKS.md`. 3. ONLY the spec(s) the task names (`docs/specs/NN-*.md`), plus `docs/DESIGN-SYSTEM.md` if the task says so.
Do not read other files unless the task says so. Do not summarise the project back. If a detail is missing, choose the simplest option, write one line in `qa/NOTES.md`, and continue. Do not ask questions unless blocked twice.

## Stack (fixed)
- Vite + vanilla JS (ES modules), Node 20+. Plain CSS with custom properties from `src/styles/tokens.css`.
- anime.js **v4** (`import { animate, createTimeline, stagger, svg } from 'animejs'`) for timelines and sequences; check v4 docs, no v3 syntax.
- Scroll-scrubbed scenes use ONE shared scroll listener (see `ARCHITECTURE.md`), not per-element listeners.
- Rive (`@rive-app/canvas`) is OPTIONAL and only added later for one piece (RSVP diya). Do not use it unless a task says so.
- No Tailwind, React, GSAP, UI kits.

## Hard rules
- Phone only. Design 390×844; must work 360–430 wide. The page column is `max-width:430px`, centered, background `--sand`; outside it (desktop only) the background is `--ink-deep`. Use `svh`, `env(safe-area-inset-*)`.
- Animate only `transform`, `opacity` (+ SVG `stroke-dashoffset`, + `clip-path` for image reveals). Never animate layout properties.
- **All text comes from `src/content.js`.** Never retype names, dates, address, phones, shloka.
- Colours, fonts, easings only from `src/styles/tokens.css`. No new colours (the gate spec lists its few literal exceptions). Ink is for text and thin lines only — never a large background; no dark-green backgrounds.
- One section = one folder `src/sections/NN-name/` (`index.js`, `style.css`). Never edit another section or `src/core/` unless the task says so.
- Missing asset → clearly labelled placeholder + update its row in `REQUIREMENTS.md`. Never fabricate photos, audio, or `.riv`.
- Reduced motion: show end states, 300 ms crossfades, no scrub, no rotation; every interaction still works by tap.
- Accessibility: real text; `<button>`/`<a>` for controls; tap targets ≥ 44 px; address and phone numbers selectable plain text; gate is keyboard operable.
- Budget: initial JS+CSS ≤ 200 KB gzip, images ≤ 200 KB (webp), bgm ≤ 2 MB.
- Follow the spec literally for sizes, positions, spacing, text and timings. Do not "improve" the design. If the spec and the prototype disagree, the spec wins.

## Dev helpers (required in every build)
- `?skipgate=1` skips the gate and shows the next chapter immediately.
- `?dev=1` shows a small "Replay opening" button bottom-left.

## Definition of done
1. Every acceptance item in the spec passes.
2. `npm run build` OK, no console errors.
3. Checked at 390×844, 360×740 and 430×932; screenshot(s) saved to `qa/<task-id>.png`.
4. Tick the box in `TASKS.md` with a one-line note. Reply in ≤ 5 lines.

## Tool roles
- **OpenCode:** scaffold and sections, one spec per session.
- **Codex:** `src/core/` and integration only; smallest possible diff; no repo-wide reads.
- **Antigravity:** SVG/raster assets and browser QA; SVGs need `viewBox`, no embedded raster, ids prefixed with the file name, ≤ 40 KB, palette tokens only.

## Commits
`feat(gate): …` · `asset: …` · `fix(core): …` · `docs: …`
