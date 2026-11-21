# DESIGN-SYSTEM.md — "Editorial dusk"
One look for the whole site: **warm sand, ivory and saffron grounds, thin wood/gold line-work, marigold florals, ink text.** Calm, spacious, few elements per screen. Nothing is copied from the printed card except the content.

## 1. Principles (apply to every section)
1. One idea per screen. Max 3 text levels visible at once.
2. Motion explains, never decorates. Only `transform` and `opacity` (+ SVG `stroke-dashoffset`, + `clip-path` for image reveals).
3. Lots of empty space. If it feels crowded, remove an element, do not shrink it.
4. Gold is a line, not a fill (thin 0.5–1 px strokes). Saffron is used for ONE big numeral per screen, plus the date chapter ground.
5. All text is real HTML text. Odia script only in the invocation and shloka.
6. Phone only: design 390×844, support 360–430 wide. Page column max `430px`, centered, background `--sand`; outside it the backdrop is `--ink-deep`.

## 2. Colour roles (see `src/styles/tokens.css`)
**Foundation is warm sand. No dark-green backgrounds anywhere.** Ink is for text and thin lines only.
| Token | Hex | Use | Contrast note |
|---|---|---|---|
| `--sand` | #EBCEAE | main ground of the gate and chapter 1; venue chapter | ink on sand 9.7:1 |
| `--sand-lt` | #F4E4CC | highlights, lit side of wood | |
| `--sand-dp` | #D8B684 | shaded wood, vignette edges | |
| `--wood` | #A8793F | carved lines, halo, garland string, hairlines on sand | decorative only |
| `--wood-dk` | #6E4C28 | deepest carving, door recess, soft shadows | |
| `--ivory` | #FBF3E4 | second light ground; emboss highlights | ink on ivory 13.2:1 |
| `--saffron` | #E48C35 | ONE bold ground (date chapter) and big numerals; ink text on it 5.6:1 | never small text on ivory |
| `--saffron-deep` | #B25D17 | numerals/accents on sand and ivory (large only), diamond dividers | 3.6:1 on sand → large text only |
| `--marigold` | #F5B74E | flowers, light, glow | |
| `--gold` | #E0AF70 | studs, thin highlights, mandala line | |
| `--moss` / `--sage` | #5D695D / #AAA06D | quiet details on ivory / leaf colour | moss on ivory 5.2:1 |
| `--ink` | #232B25 | all body text (at 72–100% opacity: kicker .74, meaning .8) | |
| `--ink-deep` | #181E1A | backdrop outside the column on desktop only | |
Rules: never add a colour. Text on sand is ink (opacity ≥ .72). Gold text is never used on sand or ivory.
**Chapter rhythm:** sand (gate, Ganesha) → ivory (invitation) → saffron (date) → sand (venue) → ivory (RSVP, closing).

## 3. Typography (Google Fonts, `display=swap`)
Fonts: **Cormorant Garamond** 400/500/600 + italic 400/500 · **DM Sans** 400/500 · **Noto Serif Oriya** 500/600. No script fonts.
Load in `index.html` with `<link rel="preconnect">` + one stylesheet link (copy from `docs/prototype/prototype-v2.html`).

| Style | Font | Size / line-height | Extra | Used for |
|---|---|---|---|---|
| `label` | DM Sans 500 | 11px / 1.4 | uppercase, letter-spacing .24em, colour ink at .74 | kickers, small captions, buttons text 12–13px |
| `deva-title` | Noto Serif Oriya 600 | clamp(20px,5.6vw,24px) / 1.5 | — | "॥ श्री गणेशाय नमः ॥" |
| `shloka` | Noto Serif Oriya 600 | clamp(21px,5.9vw,25px) / 1.35 | line gap 6px | the four shloka lines |
| `meaning` | Cormorant italic 400 | 18px / 1.45 | max-width 30ch, centered | English meaning |
| `big` | Cormorant 500 | clamp(31px,9vw,38px) / 1.18 | `text-wrap:balance` | invitation sentence |
| `numeral` | Cormorant 500 | min(44vw,190px) / .8 | letter-spacing −.04em | date "29" |
| `hero-num` | Cormorant 500 | min(34vw,148px) / .9 | letter-spacing −.03em; "th" = .3em italic, raised | "16th" |
| `title-md` | Cormorant 500 | clamp(34px,10vw,44px) / 1 | — | "Birthday Puja" |
| `addr` | Cormorant 500 | clamp(30px,8.6vw,36px) / 1.15 | — | address |
| `body-sm` | DM Sans 400 | 12–14px / 1.5 | — | notes, helper text |
Minimum size of any text: 11px (labels only), body copy ≥ 14px except notes.

## 4. Space and layout
- 4 px base grid. Page side gutter `24px` (`--gutter`, plus safe-area).
- Chapter vertical padding (light/ink bands): `clamp(84px,14svh,120px)` top and bottom.
- Alignment: gate / Ganesha / hero are **centered**. Content bands are **left-aligned** (text column = viewport − 48px), numerals may bleed.
- Radius: arch = fully round top (`border-radius:999px 999px 0 0`); buttons pill (99px); map 6px. Nothing else rounded.
- Hairlines: 1px, `currentColor` at .2 opacity.
- z-index: content 1–10 · mute button 30 · replay/dev 40 · gate 50.

## 5. Motion language
| Name | Value | Use |
|---|---|---|
| `ease-out` | cubic-bezier(.16,1,.3,1) | all reveals |
| `ease-door` | cubic-bezier(.65,0,.25,1) | doors |
| `ease-light` | cubic-bezier(.5,0,.2,1) | light growth |
| `ease-flood` | cubic-bezier(.6,0,.9,.4) | white flood |
Durations: micro 300ms · reveal 900ms · scene 1.4–2.6s.
Recipes:
- **Word reveal:** each word `opacity 0→1`, `translateY(20px)→0`, 900ms ease-out, stagger 45ms, triggered when the block is 25% in view.
- **Line write (shloka):** per line a left-to-right `clip-path` wipe (`inset(0 100% 0 0)` → `inset(0)`) with `translateY(8px→0)`, scrubbed.
- **Image reveal:** `clip-path: inset(100% 0 0 0)` → `inset(0)`, image inside scales 1.28 → 1.08 and translates −5% (parallax). Scrubbed.
- **Line draw:** SVG stroke via `stroke-dasharray = length`, offset length→0.
- **Parallax:** one image/ornament layer per screen, scale + translate only, amount ≤ 8% of its height.
- No scroll snapping. Allowed ambient loops only: gate embers, gate lattice backlight pulse, numeral shine, chapter-1 gold dust, falling petals, garland sway, halo rotation.
- `prefers-reduced-motion`: show end states, 300ms crossfades, no scrub, no rotation.

## 6. Ornament vocabulary (only these)
Carved sandalwood line-work (gate) · thin 16-petal mandala halo · jaali lattice (gate window only) · marigold garlands (toran + two strands) · lotus (under Ganesha only) · small diamond divider (line–◆–line) · falling marigold petals and gold dust. Max ONE ornament family per screen besides petals/dust. No diyas except the single RSVP diya. No peacocks. No stars.

## 7. Don't list (these caused the previous failure)
Script fonts · more than 2 ornaments per screen · coloured boxes · gradients on text other than the gate numeral · shadows other than glow · text smaller than 11px · text over busy imagery without a scrim · centre-aligned paragraphs longer than 3 lines.
