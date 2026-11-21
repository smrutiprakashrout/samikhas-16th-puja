# DESIGN-TOKENS.md (matches the approved printed card)

## `src/styles/tokens.css`
```css
:root{
  --navy:#1E2C70;  --navy-deep:#0A1B5C;  --navy-mid:#12308F;  --navy-line:#34459B;
  --copper:#D98F78; --copper-text:#AD5E46; --peach:#F3B9A6; --peach-light:#F8D2C4;
  --ivory:#FBF6EC;  --gold:#C9A24B;  --gold-light:#F0D58A;  --gold-dark:#9A7425;
  --flame:#FFB62E;  --flame-deep:#F29A1F;  --teal:#0E8C86;  --green:#2FA07F;  --rose:#D81B72; /* rose = tiny jewel dots only */
  --font-script:'Great Vibes',cursive;
  --font-text:'Cormorant Garamond',Georgia,serif;
  --font-caps:'Cinzel',Georgia,serif;
  --font-deva:'Noto Serif Devanagari',serif;
  --ease-calm:cubic-bezier(.22,.61,.36,1);   /* default easing */
  --dur-1:.4s; --dur-2:.8s; --dur-3:1.4s;
  --col:min(100vw,480px);
}
```

## Look
- Page background deep navy `--navy-deep` with the navy wave tile (`svg/tile-wave.svg`) at 100% and a faint jaali tile (`svg/tile-jaali.svg`, 8% opacity).
- Text: ivory or peach on navy; navy on ivory/peach panels. Script (Great Vibes) for titles/names; Cormorant for body (min 18px on mobile); Cinzel for caps labels with 0.15em tracking and numbers.
- Panels: ivory or navy cusped-arch shapes with a 1.5px copper keyline and a dashed inner keyline (same as the card).
- Gold only for the "16th" numeral, small dividers and the scratch foil. Flame colors only for diya flames and glows.
- Motion: slow, calm, `--ease-calm`; one hero movement at a time; never faster than 0.4s except taps.

## Shared motifs (made once in `assets/svg/`, reused by sections)
`mandala`, `lotus` (closed), `lotus-petal`, `diya`, `peacock`, `peacock-feather`, `marigold-petal`, `tile-wave`, `tile-jaali`, `divider-lotus` (line–lotus–line), `divider-diamond`.
