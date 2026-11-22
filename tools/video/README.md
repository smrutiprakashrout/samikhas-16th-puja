# Invitation video recorder
Requirements: Node 18+, `ffmpeg` in PATH, `npx playwright install chromium`.
Build first: `npm run build` (the recorder serves `dist/` on 127.0.0.1:4173, with a static fallback).
Full render: `npm run video` → `out/video/invitation-9x16.mp4`, `invitation-whatsapp.mp4`, `poster.png`.
Quick timing check: `npm run video:preview` → 540×960, 15 fps `invitation-9x16-preview.mp4`.
Flags: `npm run video -- --from 20 --to 30 --speed 1.15 --audio music.mp3 --out out/video`.
All timings live in `timeline.json`; editing it changes the video, no code changes needed.
The virtual clock and seeded `Math.random` make every run pixel-repeatable; `src/` is untouched.
Optional `--audio` is faded and loudnormed; a missing file means a silent render with a warning.
Playwright's bundled Chromium is used (no `executablePath`); Arch's unsupported-OS warning is expected.
Progress prints every 60 frames; the final log reports duration, sizes, gate time and warnings.
