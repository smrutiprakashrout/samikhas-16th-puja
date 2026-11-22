# video/TASKS.md
Owners: **OC** OpenCode · **YOU** the owner. Tasks are released ONE AT A TIME by Claude. Do not start a task that is not unlocked by the owner.

## Paste-ready prompt (change only the ID)
```
Read video/AGENTS.md, then video/TASKS.md task <ID>, then only the spec files it names. Do only that task.
Follow the spec literally (sizes, positions, text, timings). Save stills to video/qa/. Tick the box in video/TASKS.md. Reply in ≤ 5 lines.
```

## Tasks (in order, each needs the one before)
- [x] **V00 · OC · Set up this computer and prove the pipeline** → `docs/specs/V00-setup.md` — Node 26.13.0, Remotion 4.0.545, h264/1080×1920/30fps/AAC verified; fonts still saved, owner to view.
- [x] **V01 · OC · Core kit (theme, helpers, shared components, empty scene slots)** → `docs/specs/V01-core.md` — totalFrames 1735; theme/helpers/10 components/9 placeholder scenes/Invite/compare.mjs; 11 stills + safe-zone still verified.
- [x] **V02 · OC · Gate (doors, light flood)** → `docs/specs/V02-gate.md` — 3D doors/latch/bloom/flood frame-driven; 6 stills + 2 compare pairs saved; pixel checks pass, owner to eyeball compares.
- [x] **V03 · OC · Ganesha + shloka** → `docs/specs/V03-ganesha.md` — flood dissolve, garland/halo/lotus/shloka/meaning frame-driven; 6 stills + compare saved, owner to eyeball.
- [x] **V04 · OC · Hero (arch, photo, 16th)** → `docs/specs/V04-hero.md` — arch draw, photo reveal, digits/name beats; 6 stills + compare saved; composition raised u(56) for safe zone.
- [x] **V05 · OC · Invitation sentence** → `docs/specs/V05-invitation.md` — ivory scene, mandala, slow Words, key underline, divider/closing; 5 stills + compare saved.
- [x] **V06 · OC · NEW: Satyanarayan Puja (kalash, 6:00 PM, arrive before 5:30 PM)** → `docs/specs/V06-satyanarayan.md` — kalash/clock components, glow, all beats; 6 stills + full compare, positions tuned to reference (RMSE .083), owner to eyeball.
- [x] **V07 · OC · Family** → `docs/specs/V07-family.md` — centred thread/nodes/names/blossom, watermark, Dust; 4 stills + compare saved, all names on one line, owner to eyeball.
- [x] **V08 · OC · Date and time (scratch ticket)** → `docs/specs/V08-date.md` — ticket, SVG scratch mask/stylus, reveal beats + shine; 6 required stills + f1285 clean final and compares (f1300 is in V09 overlap), owner to eyeball.
- [x] **V09 · OC · Venue (drawn map)** → `docs/specs/V09-venue.md` — drawn SVG map, iris, roads/route/pin/ripple, address; 5 stills + compare saved, owner to eyeball; f1440 is in V10 overlap.
- [x] **V10 · OC · RSVP diya + Closing** → `docs/specs/V10-rsvp-closing.md` — inline diya+flame/glow, two numbers, hold, garland/closing lines, final fade; 9 stills + 2 compares, plain-sand last frame verified, owner to eyeball.
- [ ] **V11 · OC · Assemble, audio, final renders** → `docs/specs/V11-final.md`
- [ ] **YOU · Watch the full video, list changes by scene and timestamp, bring them back to Claude.**

## Rules
One task per session. Never paste the repo. Bring back to Claude only design questions or a task that failed twice.
