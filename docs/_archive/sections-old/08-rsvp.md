# 08 — RSVP: "Light the diya to confirm"
Owner: OpenCode · Scene height `150vh` · light scrub + tap interaction.

## Goal
Guests light a big diya to confirm; then Call and WhatsApp buttons appear for both numbers. Numbers are always visible as plain text.

## Content
`contact.heading`, `contact.phones[]` (display, tel, wa), `contact.rsvpPrompt`, `contact.whatsappText`.

## Layers
1. Background navy-deep with `tile-jaali` 8%.
2. Large diya center (Rive `diya.riv` bool `lit`, fallback `svg/diya.svg`), 180px, tappable (`<button>`, min 44px hit area, aria-label "Light the diya").
3. Prompt text `contact.rsvpPrompt` under it (Cormorant italic, pulsing opacity until lit).
4. Contact panel (copper-keyline arch, ivory/navy) with `contact.heading` and two rows. Each row: the number as plain text (Cinzel ≥ 20px), a "Call" button (`tel:`), a "WhatsApp" button (`https://wa.me/<wa>?text=<encodeURIComponent(whatsappText)>`).
5. Two small brass bells (`svg/bell.svg`) beside the Call buttons, ring (swing) on tap.

## Interaction
- Before lighting: panel is visible but dimmed to 60%; buttons still work (never hide essential info).
- Tap diya → `lit = true`, `audio.sfx('diya')`, glow expands, `particles.burst(diyaCenter, 16)`, panel animates to 100% and slightly rises, prompt text changes to "Thank you 🙏 — we look forward to you" (hard-code this UI string in the section).
- Scroll beat: diya scales 0.85 → 1 and fades in at progress 0–300; panel rises 300–600.

## Assets
`rive/diya.riv`, `svg/diya.svg`, `svg/bell.svg`, `audio/diya.mp3` (optional).

## Acceptance
- Phone numbers are visible and selectable regardless of the diya state.
- `tel:` and `wa.me` links verified on a real phone.
- Lit state persists while the page stays open.
