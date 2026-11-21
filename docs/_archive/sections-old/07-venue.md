# 07 — Venue: "The lamp-lit path to the house"
Owner: OpenCode · Scene height `350vh` · scrubbed.

## Goal
A small lamp walks along a dotted alpana path through four stops (Sapnpur → Sisua → Salepur → Cuttack) to a house whose windows light up, where the full address is shown in plain text with a Maps button.

## Content
`venue.heading`, `venue.lines`, `venue.stops`, `venue.mapsUrl`, `venue.mapsLabel`.

## Layers
1. Background navy-deep, `tile-wave` (`data-depth="0.15"`), distant soft hill silhouettes (`data-depth="0.3"`, simple navy-mid shapes).
2. `svg/path-alpana.svg`: a single vertical S-curve `<path id="route">` drawn as a dotted copper line from top to bottom (viewBox 390×640).
3. Lamp: `svg/lamp.svg` (small flame icon, 28px) positioned along `#route` using `getPointAtLength` (or anime.js `svg.createMotionPath`), driven by scroll.
4. Four stop markers (HTML labels + tiny dot) at fixed lengths along the route (25%, 45%, 65%, 82%): each pops (scale 0.6→1, opacity) when the lamp passes. Label text from `venue.stops`.
5. At the end: `svg/house.svg` — windows `#win1 #win2 #door` initially dark; they light (fill flame, glow) at the end. Peacock pair (`svg/peacock.svg`) slides in from both sides.
6. Nameplate panel (HTML, ivory arch/rect, navy text): heading `venue.heading` + the address lines (≥ 22px, plain selectable text), button "Open in Google Maps" (`<a href=venue.mapsUrl target=_blank rel=noopener>`; if `mapsUrl` is empty hide the button) and a secondary "Copy address" button (clipboard + tiny "Copied" toast).

## Scroll beats
- 0–100: route fades in; heading shows.
- 100–800: lamp travels the path; stops pop as passed.
- 800–900: house windows light, door glows.
- 900–1000: peacocks slide in; nameplate rises (translateY, opacity).

## Assets
`svg/path-alpana.svg` (`#route`), `svg/lamp.svg`, `svg/house.svg` (`#win1 #win2 #door`), `svg/peacock.svg`, `svg/tile-wave.svg`.

## Acceptance
- The full address is visible, plain text, never inside an SVG or canvas.
- Lamp stays exactly on the path at 360px and 430px.
- Maps button hidden gracefully if the URL is empty.
