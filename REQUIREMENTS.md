# REQUIREMENTS.md — inputs and assets (status: needed → in-progress → done)

## A. From YOU
| ID | Item | Where | Needed by | Status |
|---|---|---|---|---|
| U1 | Samikshya's photo: portrait, plain or simple background, face in the upper third, ≥ 1200 px tall. I will tell you the exact crop; the agent compresses to webp ≤ 200 KB | `assets/img/samikshya.webp` | Hero (02) | needed |
| U2 | Background music: soft instrumental (bansuri/sitar), 60–120 s, loopable, ≤ 2 MB mp3 (prompt in D) | `assets/audio/bgm.mp3` | Gate (G00) | needed |
| U3 | Google Maps share link of the venue + full postal address with PIN | `src/content.js → venue` | Venue (06) | needed |
| U4 | Confirm name order: parents "Manorama Nanda, Sarada Prasanna Panda", grandparents "Malati Panda, Nikunja Bihari Panda" | `src/content.js` | Family (04) | needed |
| U5 | Short temple-bell sound (≤ 60 KB) for the gate tap (optional) | `assets/audio/bell.mp3` | Gate | optional |
| U7 | Public calendar event link (opens and adds the event) | `src/content.js → date.calendarUrl` | Date (S05) | needed |
| U6 | Hosting: Netlify drag-and-drop, optional domain | — | Deploy | needed |

## B. Assets (kept to the minimum)
| ID | File | Spec | Used by | Owner | Status |
|---|---|---|---|---|---|
| B1 | `src/sections/00-gate/door.svg` + `assets/img/grain.svg` | Sandalwood door art (id prefix token `{{p}}`) and paper-grain tile | Gate, chapter 1 | **provided by Claude** | done |
| B2 | `assets/img/ganesha.webp` | Ganesha on his mouse, transparent, 800×1190, 161 KB | 01 | **provided by Claude** (cut from your PNG) | done |
| B3 | `assets/img/og.jpg` | 1200×630 share image: sand ground, saffron "16th" with the sandalwood door detail, text "Samikshya's Birthday Puja · 29 Nov 2026" (text allowed here only) | index.html | Antigravity | needed |
| B4 | `assets/favicon.svg` | saffron "16" on sand, 64×64 | index.html | Antigravity | needed |
| B5 | `assets/svg/diya.svg` | one brass diya with separable `#flame`, 120×90 (RSVP only) | 07 | Antigravity | later |
Everything else (arch, halo, garlands, lotus, petals, dividers, map mock) is drawn in code from the specs.

## C. Rive (optional, last)
One piece only, if time remains: `assets/rive/diya.riv` (boolean `lit`) for RSVP. SVG fallback is the default.

## D. Generation prompts
**Music:** `Soft Indian devotional instrumental, bansuri flute lead, gentle sitar and tanpura drone, slow 70 BPM, calm, warm, premium, no vocals, no drums, seamless loop, 90 seconds.`
**Bell:** `Single temple bell ring, brass, short reverb, 2 seconds.`
