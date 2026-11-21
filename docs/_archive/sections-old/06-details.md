# 06 — Details: "Scratch card + seven diyas"
Owner: OpenCode · Scene height `400vh` · scrubbed + canvas interaction.

## Goal
Reveal WHEN: a gold scratch card hides the date; seven diyas light one by one for 7 PM; a live countdown follows.

## Content
`event.dateLong`, `event.weekday`, `event.day`, `event.month`, `event.year`, `event.timeText`, `event.startISO`, `event.title`.

## Part A — Scratch card (progress 0–450)
- Card 330×210, rounded corners, ivory panel with copper keyline. Under the foil (real HTML): weekday (Cinzel caps), day number huge (Great Vibes/Cinzel gold ~96px), "November 2026".
- Canvas overlay (same size, DPR ≤ 2) painted with gold foil (draw `svg/scratch-foil.svg`, or gradient `--gold-light → --gold → --gold-dark` + mandala pattern) and the hint "Scratch to reveal the date".
- Pointer/touch scratching: `globalCompositeOperation = 'destination-out'`, 26px round brush, `touch-action: none` ON THE CANVAS ONLY. Play `audio.sfx('scratch')` softly while scratching (throttled).
- Every 150 ms estimate cleared area on a 16×-downsampled sample; at ≥ 55% cleared → fade the canvas out and `particles.burst(cardCenter, 24)`.
- Auto-reveal: if progress reaches 400 and not yet revealed, reveal automatically. A visible "Tap to reveal" text button is always available.
- The scroll position must never be locked.

## Part B — Seven diyas (progress 450–800)
- Row of 7 `svg/diya.svg` (each ~38px) in a gentle arc. Scrubbed: diya i lights at `450 + i*50` (flame scale 0→1, glow opacity). After the 7th: "7:00 PM onwards" (`event.timeText`) fades in under them. Label above: "Time".

## Part C — Countdown (progress 800–1000)
- Four boxes: Days · Hours · Minutes · Seconds to `event.startISO` (update every second with `setInterval`, only while the scene is near the viewport; clear on destroy). If the time has passed: show "Today is the day 🙏" or "Thank you for celebrating with us" after the event ends.
- Button "Add to calendar": generates and downloads an `.ics` (`core/util.js → ics(event)`), title `event.title`, start `event.startISO`, duration `event.durationMin`, location from `venue.lines`.

## Assets
`svg/scratch-foil.svg`, `svg/diya.svg`, `svg/marigold-petal.svg`, `audio/scratch.mp3` (optional).

## Acceptance
- Scratching works with touch on iOS Safari and Chrome Android; doesn't scroll the page while scratching; doesn't break when the card is off-screen.
- Date is real text under the foil (screen readers can read it; the canvas is `aria-hidden`).
- Countdown correct in IST regardless of the phone's timezone.
- `.ics` opens in the phone calendar.
