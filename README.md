# Video kit — how to install and start

1. Copy the `video/` folder from this kit into the ROOT of your website repo, so you get `samikhas-16th-puja/video/AGENTS.md` and so on. (Do not rename anything.)
2. Open a terminal in the repo ROOT (not inside `video/`) and start OpenCode there.
3. Paste this prompt, exactly, for the first task:

```
Read video/AGENTS.md, then video/TASKS.md task V00, then only the spec files it names. Do only that task.
Follow the spec literally (sizes, positions, text, timings). Save stills to video/qa/. Tick the box in video/TASKS.md. Reply in ≤ 5 lines.
```
4. When it replies, open `video/qa/V00-fonts.png` and check that the Odia text shows joined letters (no empty boxes). Then tell Claude the reply and the result. The next prompt is the same text with the ID changed (V01, V02, …), released one at a time.

Order: V00 setup · V01 core kit · V02 gate · V03 Ganesha · V04 hero · V05 invitation · **V06 Satyanarayan Puja (new scene)** · V07 family · V08 date · V09 venue · V10 RSVP + closing · V11 final renders.

New-scene text lives in `video/src/content.video.ts`. Three things to confirm are marked CONFIRM there (same day, spelling, the small "Birthday Puja" label in the date scene).
