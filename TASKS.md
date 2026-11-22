# TASKS.md
Deadline **Sat 21 Nov 2026**. Owners: **OC** OpenCode · **CX** Codex (tiny, critical) · **AG** Antigravity · **YOU**.
Tasks are released ONE AT A TIME by Claude with the spec already written. Do not start a task whose spec says "pending".

## Paste-ready prompt (change only the ID)
```
Read AGENTS.md, then TASKS.md task <ID>, then only the spec files it names. Do only that task.
Follow the spec literally (sizes, positions, text, timings). Save screenshots to qa/<ID>*.png. Tick the box in TASKS.md. Reply in ≤ 5 lines.
```

## Done
- [x] R00 Restructure tree · [x] T01 Scaffold · [x] T02 Core · [x] G00 Gate v1 · [x] G00b Gate v2 (sandalwood) · [x] S01 Ganesha chapter · [x] S02 Hero · [x] S03 Invitation

## Now
- [x] **S03b · OC · Satyanarayan Puja (kalash + time).** → `docs/specs/03b-puja.md`. Needs S03. Sticky 240svh scrub with kalash/leaves/clock, shared petal fall, reduced end state; build clean, 8 screenshots, no console errors.
- [ ] **S04 · OC · Family (thread of names).** → `docs/specs/04-family.md`. Needs S03.
- [ ] **S05 · OC · Date and time (scratch ticket).** → `docs/specs/05-date.md`. Needs S04.
- [ ] **S06 · OC · Venue (iris map).** → `docs/specs/06-venue.md`. Needs S05.
- [ ] **S07 · OC · RSVP (diya).** → `docs/specs/07-rsvp.md`. Needs S06.
- [ ] **S08 · OC · Closing (toran bookend).** → `docs/specs/08-closing.md`. Needs S07.

## Next (specs written one by one after each is approved)
- Specs 07 RSVP and 08 Closing: written after the owner answers the open questions.

## Ship
- [ ] **B-assets · AG** og.jpg, favicon (REQUIREMENTS B3–B4)
- [ ] **L45 · OC · Family → Date link (blossom circle + ticket assembly).** → `docs/specs/05b-family-date-link.md`. Needs S04, S05.
- [ ] **OG1 · OC · Social share preview (og tags + og.jpg).** prompt in chat.
- [ ] **V01 · OC · Invitation video (9:16).** → `docs/specs/V01-video.md`. Needs I01 and Q01.
- [ ] **I01 · CX · Integrate**, **Q01 · AG · Browser QA** (390×844, 360×740, 430×932), **Q02 · YOU · real phone test**, **D01 · deploy** to Netlify.

## Token-saving rules
One task per session. Never paste the repo. Do not read the prototype file whole. Bring back to Claude only design questions or a task that failed twice.
