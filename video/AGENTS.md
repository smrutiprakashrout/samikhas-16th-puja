# video/AGENTS.md — rules for every coding agent working on the VIDEO

Project: a 1080×1920, 30 fps portrait film (Remotion) of **Samikshya's 16th Birthday Puja invitation**, built from the website in the parent folder. You work ONLY inside `video/`. The website (`../src`, `../assets`, `../docs`, `../AGENTS.md`) is read-only reference: never edit it, never run its build.
The website's `../AGENTS.md` is about the website. Ignore it, except that its design rules are repeated here.

## Read order (saves tokens, prevents mistakes)
1. This file. 2. Your task in `video/TASKS.md`. 3. Only the spec files the task names (`video/docs/specs/Vnn-*.md`). 4. `video/docs/FILM-GUIDE.md` if the task says so (V01 onward: always).
Do not read other files unless a spec points to them. Do not summarise the project back. If something is not specified, choose the simplest option, write ONE line in `video/NOTES.md`, and continue. Ask the owner a question only if blocked twice.

## You are NOT the designer
All design decisions are already made in the specs. Do not "improve", restyle, add elements, change colours, change fonts, change timings or add effects that the spec does not list. If your result looks different from the spec or from the reference image, your result is wrong: fix it, do not defend it.

## Hard rules
- Remotion project, TypeScript + React. Frame-driven animation only (`useCurrentFrame`, `interpolate`, `spring`, `Easing.bezier`).
- FORBIDDEN in scene code: CSS `transition`, CSS `animation`/`@keyframes`, `Math.random`, `Date.now`, `setTimeout`/`setInterval`, anime.js, `position: fixed`, `vh/vw/svh` units, `<img>` (use Remotion `<Img>`), Tailwind, UI kits.
- Always call `interpolate` with `extrapolateLeft: 'clamp', extrapolateRight: 'clamp'` (the helpers in `src/lib/anim.ts` already do).
- Animate only: `transform`, `opacity`, `clip-path`, SVG `stroke-dashoffset` / SVG transform attributes, and glow via `box-shadow` / `drop-shadow`. No big `filter: blur()` (renders slowly).
- **All text comes from `../src/content.js` (via `src/generated/content.js`) or `src/content.video.ts`.** Never retype names, dates, address, phones, shloka. Never edit `src/generated/` by hand.
- **Colours, fonts, easings come only from `src/theme.ts`** (a port of `../src/styles/tokens.css`). No new colours except literals listed in a spec. Ink is for text and thin lines, never a large background. No gradients on text except where a spec says so.
- Design language (full text in `../docs/DESIGN-SYSTEM.md`): warm sand / ivory / saffron, thin gold lines, marigold florals, ink text. One idea per screen. Max one ornament family per screen besides petals and dust. Calm and spacious: if it feels crowded, remove, do not shrink.
- Sizes: the site is 390×844. In the video **1 site px = 2.275 video px** (`u`). The "column" is 887 px wide, centred. See FILM-GUIDE for safe areas. Nothing essential in the top 200 px or bottom 340 px.
- Information screens (date, time, venue, phones, family names) must be fully visible and still for ≥ 60 frames. Phones ≥ 90 frames.
- Missing asset → clearly labelled placeholder + one line in `NOTES.md`. Never fabricate photos or audio.

## Definition of done (every task)
1. Every acceptance item in the spec passes.
2. `npx tsc --noEmit` passes and `npx remotion compositions src/index.ts` runs without errors.
3. Stills saved to `video/qa/<task-id>-<name>.png` at the frames the spec lists, and you LOOKED at them (open the PNG). If you cannot view images, say so in your reply so the owner can check.
4. If the spec names a reference image, run `npm run compare -- <still> <reference>` and look at the side-by-side it writes to `video/qa/compare-*.png`.
5. Tick the box in `video/TASKS.md` with a one-line note. Reply in ≤ 5 lines.

## Commits
`feat(video): …` · `chore(video): …` · `docs(video): …`
