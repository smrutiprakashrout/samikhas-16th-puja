# ARCHITECTURE.md

## Folder tree
```
invite-site/
├─ AGENTS.md  PRD.md  ARCHITECTURE.md  TASKS.md  REQUIREMENTS.md
├─ docs/
│  ├─ DESIGN-SYSTEM.md
│  ├─ specs/            00-gate.md … 08-closing.md   (one spec = one agent task)
│  ├─ prototype/        prototype-v2.html            (visual reference only)
│  └─ _archive/         old plan, ignore
├─ assets/              (Vite publicDir: /img/x.webp, /audio/x.mp3 …)
│  ├─ img/  svg/  audio/  rive/  fonts/
├─ src/
│  ├─ content.js        ALL text/data
│  ├─ main.js           boot
│  ├─ core/             scroll.js  reveal.js  audio.js  util.js
│  ├─ styles/           tokens.css  base.css
│  └─ sections/         00-gate … 08-closing/  (index.js + style.css [+ local svg])
├─ qa/                  screenshots, NOTES.md
└─ index.html  vite.config.js  package.json
```

## Page structure
```
<body>
  <div id="page">                      ← max-width 430px, margin auto, background --sand
    <main id="scenes">                 ← window scroll; sections appended in order
      <section data-scene="01-ganesha" style="height:420vh"> <div class="stage" style="position:sticky;top:0;height:100svh">…</div></section>   (scrubbed)
      <section data-scene="02-hero" …>                                                                                                  (scrubbed)
      <section class="band ivory|saffron|sand"> … </section>                                                                                (normal flow, reveal on view)
    </main>
  </div>
  <div id="gate">…</div>               ← fixed overlay, z-index 50, inside #page's width
  <button id="mute">…</button>         ← fixed, z-index 30
</body>
```
`html.locked{overflow:hidden}` until the gate finishes.

## Boot flow (`main.js`)
1. Load tokens/base CSS. Add `html.locked`. Build `#scenes` from sections 01–08 (hidden behind the gate). If `?skipgate=1`: skip to step 4.
2. Mount section 00 (gate). On tap/Enter/Space/rope-free tap anywhere: `audio.start()` (user gesture), run the gate sequence.
3. At gate time T+2900 ms: `document.dispatchEvent(new CustomEvent('gate:opened'))`, remove `html.locked`, show mute button.
4. Sections listen for `gate:opened` to start their entrance (the first chapter adds `.entered`).

## Section contract
```js
export default {
  id: '01-ganesha',
  height: '420vh',            // omit for normal-flow bands and the gate
  html: (content) => `…`,     // markup from content.js values
  mount(ctx) { return { destroy() {} } },
}
```
`ctx`: `{ root, content, reduced, scrub(fn), reveal(el), audio, anime }`
- `ctx.scrub(fn)`: registers `fn(p)` called with scene progress `p` in 0..1 on each animation frame while the scene is within ±1 viewport (one shared scroll listener + rAF in `core/scroll.js`). Progress = `clamp(-rect.top / (rect.height - innerHeight), 0, 1)`. Inside `fn`, write styles directly with transforms/opacity (helpers: `seg(p,a,b)` easing 0..1 in window [a,b], `lerp`, `clamp` from `core/util.js`).
- `ctx.reveal(el)`: word-split (`.reveal`) and `IntersectionObserver` (threshold .25, once) per DESIGN-SYSTEM §5.

## core/audio.js
`audio.start()` (called from the gate tap): loops `/audio/bgm.mp3` at volume .35 with 2 s fade-in; if the file is missing, fail silently. `audio.sfx(name)` plays `/audio/<name>.mp3`, silent on missing. Persistent mute button (fixed, top-right, 44×44, appears after `gate:opened`), state remembered in `localStorage` (wrapped in try/catch). Pauses when the tab is hidden.

## Performance
Transform/opacity only; one rAF scroll loop; canvases at DPR ≤ 2; `will-change` only on elements while their animation runs; images lazy with width/height.

## Build / deploy
`npm run dev`, `npm run build` → `dist/` → Netlify drag-and-drop. `index.html` has Open Graph tags (`/img/og.jpg`, 1200×630).
