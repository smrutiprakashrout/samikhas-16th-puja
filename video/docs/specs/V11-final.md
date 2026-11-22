# V11 — Assemble, audio, final renders
Needs V02–V10 done and ticked.

## 1. Transitions review
Render stills at the overlap midpoints (global frames **200, 450, 620, 790, 970, 1120, 1300, 1440**) → `qa/V11-t<frame>.png`. For each, look: two scenes blended without a visual glitch, no flash of the wrong colour, no hard cut. Fix only what is wrong, only in `Scene.tsx` or the affected scene.

## 2. Audio (in `Invite.tsx`)
One audio element for the whole film (use `Html5Audio` or `Audio` as the installed Remotion version prefers): `src={staticFile('audio/bgm.mp3')}`, start at `BGM_START_SEC` of the file (use the version's `trimBefore` / `startFrom` prop), volume as a function of frame: 0 → .6 over the first 45 frames, constant .6, then .6 → 0 over the last 60 frames of `totalFrames()`. Do not edit the mp3. No voiceover, no sound effects.

## 3. Scripts and extras
Add to `package.json`: `"render:silent": "npm run sync && remotion render src/index.ts Invite out/samikshya-16th-puja-9x16-silent.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --muted"` and `"poster": "npm run sync && remotion still src/index.ts Invite out/poster.png --frame=600"`.
Write `out/TIMECODES.md`: a table with each scene, start and end in frames and in `mm:ss.f` seconds (start = `sceneStart(i)`, end = start + length), computed from `src/config.ts`. The owner uses it to place music and effects in the editor.

## 4. Render (this takes minutes; run in this order)
1. `npm run typecheck`.
2. `npm run render` → `out/samikshya-16th-puja-9x16.mp4` (high quality).
3. `npm run render:share` → `out/samikshya-16th-puja-9x16-share.mp4`. Must be **under about 16 MB** (WhatsApp's video limit). If larger, re-render with `--crf=28` and say so.
4. `npm run render:silent` → `out/…-silent.mp4`, `npm run poster` → `out/poster.png`.
If rendering is slow or the 3D doors or filters look wrong, retry with `--gl=angle`, and `--concurrency=50%` if memory is low.

## 5. Verify
`npx remotion ffprobe` on the three videos: 1080×1920, 30 fps, h264, yuv420p; audio present on the first two, absent on the silent one; duration ≈ 58 s (1735 frames / 30). Check `SHOW_SAFE_ZONES` is `false`. List the file sizes (`ls -lh out`).

## Reply (≤ 6 lines)
Paths and sizes of the four outputs, the duration, anything that failed or was adapted. Then tell the owner: "Watch the full video and list changes by scene and timestamp."
