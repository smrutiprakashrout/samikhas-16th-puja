# video/PLAN.md — the film

## What it is
A cinematic, minimal, polished 9:16 film (1080×1920, 30 fps) of the invitation website. NOT a screen recording and NOT scrolling: each chapter is re-staged as motion graphics with light, depth and clean transitions. Same content, same colours, same assets. The owner will add music and effects afterwards in an editor, so the video is built with the existing `bgm.mp3` only as a simple bed (V11) and every duration lives in one config file.

## Scene order (frames at 30 fps, overlap 20 frames between scenes)
| # | Scene | Task | Ground | Length | Start |
|---|---|---|---|---|---|
| 1 | Gate: sandalwood doors open into light | V02 | sand | 210 | 0 |
| 2 | Ganesha + shloka | V03 | sand | 270 | 190 |
| 3 | Hero: arch, photo, "16th", name | V04 | sand | 190 | 440 |
| 4 | Invitation sentence | V05 | ivory | 190 | 610 |
| 5 | **NEW** Satyanarayan Puja: 6:00 PM onwards, arrive before 5:30 PM | V06 | ivory + marigold glow | 200 | 780 |
| 6 | Family | V07 | ivory | 170 | 960 |
| 7 | Date and time: 29 Nov, 7:00 PM onwards | V08 | saffron | 200 | 1110 |
| 8 | Venue | V09 | sand | 160 | 1290 |
| 9 | RSVP diya, then Closing | V10 | ivory → sand | 305 | 1430 |
Total ≈ 1735 frames ≈ 58 s. Starts are computed from the lengths in `src/config.ts`, never hard-coded.

## The new scene (V06) in one paragraph
Right after the invitation sentence, ivory continues and a warm marigold glow blooms. A brass kalash (sacred pot) assembles itself: plate, pot, sacred thread, lip, coconut, then six mango leaves fan open. Below it: "Satyanarayan *Puja*", a diamond divider, a big saffron "6:00 PM" with "onwards", then a hairline and a small clock whose hands sweep to 5:30 beside "Kindly arrive before 5:30 PM". The date line on top comes from the site content. Reference picture of the finished frame: `docs/ref/satya-end.png`.

## Assumptions to confirm (owner)
1. Satyanarayan Puja is on the **same day**, Sunday 29 November 2026, before the 7:00 PM Birthday Puja. The date line reuses `content.event.dateLong`.
2. Spelling "Satyanarayan Puja".
3. Because a 6:00 PM time now appears before the 7:00 PM time, the Date scene (V08) gets a small label "Birthday Puja" above "7:00 PM". Set it to `''` in `src/content.video.ts` to remove.

## Tech
Remotion (all packages pinned to one exact version), React + TypeScript, fonts via `@remotion/google-fonts` (Cormorant Garamond, DM Sans, Noto Serif Oriya). Site assets are copied into `video/public/` by `npm run sync`. Site text is copied into `video/src/generated/` by the same script.

## Files in the kit
`AGENTS.md` rules · `PLAN.md` this file · `TASKS.md` task list and the paste-ready prompt · `docs/FILM-GUIDE.md` shared numbers and recipes · `docs/specs/V00…V11` one spec per task · `docs/ref/` reference images · `assets-src/kalash.svg` drawn artwork for the new scene · `src/content.video.ts` text for the new scene.
