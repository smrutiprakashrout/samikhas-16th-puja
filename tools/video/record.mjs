import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TIMELINE = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/video/timeline.json'), 'utf8'));
const WARNINGS = [];

/* ---------- CLI (§7) ---------- */
const args = process.argv.slice(2);
const flags = { speed: 1 };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--preview') flags.preview = true;
  else if (['--from', '--to', '--speed', '--audio', '--out'].includes(a)) flags[a.slice(2)] = args[++i];
  else throw new Error(`Unknown flag: ${a}`);
}
const speed = Number(flags.speed) || 1;
if (speed <= 0) throw new Error('--speed must be positive');
const S = (t) => t / speed;

const fps = flags.preview ? 15 : Number(TIMELINE.fps) || 30;
const dsf = flags.preview ? 1 : 3;
const quality = flags.preview ? 80 : 95;
const W = flags.preview ? 540 : 1080;
const H = flags.preview ? 960 : 1920;
const outDir = path.resolve(ROOT, flags.out || 'out/video');
fs.mkdirSync(outDir, { recursive: true });
const masterName = flags.preview ? 'invitation-9x16-preview.mp4' : 'invitation-9x16.mp4';
const masterPath = path.join(outDir, masterName);
const whatsappPath = path.join(outDir, 'invitation-whatsapp.mp4');
const posterPath = path.join(outDir, 'poster.png');

const tapGate = S(TIMELINE.tap.gate);
const tapDiya = S(TIMELINE.tap.diya);
const gateSettle = S(TIMELINE.gate.settle);
const scratchStart = S(TIMELINE.scratch.start);
const scratchDuration = S(TIMELINE.scratch.duration);
const scratchEnd = scratchStart + scratchDuration;
const endFade = S(TIMELINE.endFadeSeconds);
const keys = TIMELINE.keyframes.map((k) => ({ ...k, t: S(k.t) }));
const duration = keys[keys.length - 1].t + endFade;
const from = flags.from === undefined ? 0 : Number(flags.from);
const to = flags.to === undefined ? duration : Number(flags.to);
const N = Math.ceil(duration * fps) + 1;
const dateRevealAt = scratchEnd + 2 / speed;

const AUDIO = flags.audio ? path.resolve(ROOT, flags.audio) : null;
if (AUDIO && !fs.existsSync(AUDIO)) {
  WARNINGS.push(`audio file not found: ${AUDIO}; rendering silent`);
  console.warn(WARNINGS.at(-1));
}
const audioArgs = (dur, kbps) => AUDIO && fs.existsSync(AUDIO)
  ? ['-i', AUDIO, '-af', `afade=t=in:st=0:d=2,afade=t=out:st=${Math.max(0, dur - 3)}:d=3,loudnorm=I=-18`, '-c:a', 'aac', '-b:a', `${kbps}k`, '-shortest']
  : [];

/* ---------- ffmpeg filter (§3) ---------- */
const FILTER = flags.preview
  ? '[0:v]split=2[a][b];[a]scale=540:960:force_original_aspect_ratio=increase,crop=540:960,boxblur=40:5,eq=brightness=0.03:saturation=1.1[bg];[b]scale=-2:960[fg];[bg][fg]overlay=(W-w)/2:0,format=yuv420p'
  : '[0:v]split=2[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:5,eq=brightness=0.03:saturation=1.1[bg];[b]scale=-2:1920[fg];[bg][fg]overlay=(W-w)/2:0,format=yuv420p';

/* ---------- Serving (§2) ---------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function ping() {
  try {
    const res = await fetch('http://127.0.0.1:4173/');
    return res.ok;
  } catch { return false; }
}
function staticServer() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1:4173');
    let file = path.join(ROOT, 'dist', decodeURIComponent(url.pathname));
    if (!file.startsWith(path.join(ROOT, 'dist'))) { res.writeHead(403).end(); return; }
    try { if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html'); } catch { res.writeHead(404).end(); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      res.end(buf);
    });
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(4173, '127.0.0.1', () => resolve({ stop: () => server.close(), kind: 'static fallback' }));
  });
}
async function startServer() {
  const vite = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
  for (let i = 0; i < 40; i++) {
    if (vite.exitCode !== null) break;
    if (await ping()) return { stop: () => vite.kill(), kind: 'vite preview' };
    await sleep(250);
  }
  vite.kill();
  await sleep(200);
  if (await ping()) return { stop: () => {}, kind: 'existing server on 4173' };
  return staticServer();
}

/* ---------- deterministic setup (§4.3) ---------- */
const INIT = (seed) => {
  let s = seed >>> 0;
  Math.random = () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const RealDTF = Intl.DateTimeFormat;
  const DTF = function (locales, options = {}) {
    return new RealDTF(locales, { timeZone: 'Asia/Kolkata', ...options });
  };
  Object.setPrototypeOf(DTF, RealDTF);
  DTF.prototype = RealDTF.prototype;
  Intl.DateTimeFormat = DTF;
  const onGate = () => { window.__gateOpened = true; window.__gateOpenedAt = performance.now() / 1000; };
  window.addEventListener('gate:opened', onGate);
  document.addEventListener('gate:opened', onGate);
  document.addEventListener('DOMContentLoaded', () => {
    const st = document.createElement('style');
    st.textContent = '::-webkit-scrollbar{display:none!important}html{scrollbar-width:none!important}body{scrollbar-width:none!important}';
    document.head.appendChild(st);
  });
};
const DRIVER = (vt) => {
  const T = window.__t0 || (window.__t0 = new WeakMap());
  for (const a of document.getAnimations({ subtree: true })) {
    if (!T.has(a)) T.set(a, vt);          // first time we see it: its virtual start time
    a.pause();
    a.currentTime = vt - T.get(a);        // includes its delay; infinite animations loop by themselves
  }
};

const easeInOutSine = (u) => 0.5 - 0.5 * Math.cos(Math.PI * u);

/* ---------- main ---------- */
let server, browser, ffmpeg;
try {
  server = await startServer();
  console.log(`serving dist/ via ${server.kind}`);

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: dsf,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'no-preference',
    colorScheme: 'light',
    timezoneId: 'Asia/Kolkata'
  });
  const page = await context.newPage();
  await page.addInitScript(INIT, 20261129);
  await page.clock.install({ time: 0 });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready.then(() => true));

  const layout = await page.evaluate((ks) => {
    const ys = [];
    const missing = [];
    for (const k of ks) {
      const el = document.querySelector(`[data-scene="${k.scene}"]`);
      if (!el) { missing.push(k.scene); ys.push(0); continue; }
      const normal = k.scene === '05-date' || k.scene === '07-rsvp';
      const span = el.offsetHeight - innerHeight;
      ys.push(Math.max(0, el.offsetTop + k.p * (normal ? Math.max(0, span) : span)));
    }
    const gate = document.querySelector('[data-gate-tap]');
    const g = gate ? gate.getBoundingClientRect() : null;
    return {
      ys, missing: [...new Set(missing)],
      gate: g ? { x: g.left + g.width / 2, y: g.top + g.height / 2 } : { x: innerWidth / 2, y: innerHeight / 2 }
    };
  }, keys);
  if (layout.missing.length) WARNINGS.push(`missing scene elements: ${layout.missing.join(', ')}`);
  const ys = layout.ys;

  await page.evaluate(() => {
    const f = document.createElement('div');
    f.id = '__finger';
    Object.assign(f.style, {
      position: 'fixed', left: '0px', top: '0px', width: '46px', height: '46px',
      borderRadius: '50%', background: 'rgba(255,255,255,.55)',
      border: '2px solid rgba(35,43,37,.35)', boxShadow: '0 2px 10px rgba(0,0,0,.18)',
      transform: 'translate(-50%,-50%) scale(1)', opacity: '0',
      zIndex: '99999', pointerEvents: 'none'
    });
    document.body.appendChild(f);
    const fade = document.createElement('div');
    fade.id = '__fade';
    Object.assign(fade.style, {
      position: 'fixed', inset: '0', background: '#000', opacity: '0',
      zIndex: '99998', pointerEvents: 'none'
    });
    document.body.appendChild(fade);
  });

  const yAt = (t) => {
    if (t <= keys[0].t) return 0;
    for (let i = 0; i < keys.length - 1; i++) {
      if (t <= keys[i + 1].t) {
        const u = (t - keys[i].t) / (keys[i + 1].t - keys[i].t);
        return ys[i] + (ys[i + 1] - ys[i]) * easeInOutSine(u);
      }
    }
    return ys[ys.length - 1];
  };

  ffmpeg = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-vf', FILTER,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'slow',
    '-movflags', '+faststart', ...audioArgs(duration, 192), masterPath
  ], { stdio: ['pipe', 'ignore', 'pipe'] });
  let ffErr = '';
  ffmpeg.stderr.on('data', (d) => { ffErr = (ffErr + d.toString()).slice(-4000); });
  const ffDone = once(ffmpeg, 'close').then(([code]) => code);

  let gateTapped = false, gateOpened = false, gateOpenAt = null;
  let gateTapAt = 0;
  let diyaTapped = false, diyaPoint = null;
  let scratchStarted = false, scratchDone = false, scratchRect = null, revealLogged = false;
  let scratchFinger = null;
  let ringAt = null, posterSaved = false;
  const ring = async (x, y) => {
    ringAt = null;
    await page.evaluate(({ x, y }) => {
      const f = document.getElementById('__finger');
      if (!f) return;
      const r = document.createElement('span');
      Object.assign(r.style, { position: 'absolute', inset: '-2px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.85)' });
      f.appendChild(r);
      const a = r.animate([
        { transform: 'scale(.8)', opacity: '.75' },
        { transform: 'scale(2.6)', opacity: '0' }
      ], { duration: 500, easing: 'ease-out', fill: 'forwards' });
      a.onfinish = () => r.remove();
      a.play();
    }, { x, y });
  };

  for (let i = 0; i < N; i++) {
    const t = i / fps;
    if (t > to) break;
    const capture = t >= from;

    /* scripted input, applied before the clock step */
    if (!gateTapped && t >= tapGate) {
      gateTapped = true; gateTapAt = t;
      await page.mouse.click(layout.gate.x, layout.gate.y);
      await ring(layout.gate.x, layout.gate.y);
    }
    if (gateTapped && !gateOpened) {
      gateOpened = await page.evaluate(() => !!window.__gateOpened);
      if (gateOpened) gateOpenAt = await page.evaluate(() => window.__gateOpenedAt ?? performance.now() / 1000);
    }
    if (diyaTapped === false && t >= tapDiya) {
      diyaTapped = true;
      diyaPoint = await page.evaluate(() => {
        const el = document.querySelector('#diya');
        const r = el ? el.getBoundingClientRect() : null;
        const x = r ? Math.min(innerWidth - 8, Math.max(8, r.left + r.width / 2)) : innerWidth / 2;
        const y = r ? Math.min(innerHeight - 8, Math.max(8, r.top + r.height / 2)) : innerHeight / 2;
        return { x, y };
      });
      await page.mouse.click(diyaPoint.x, diyaPoint.y);
      await ring(diyaPoint.x, diyaPoint.y);
    }
    if (!scratchStarted && t >= scratchStart) {
      scratchStarted = true;
      scratchRect = await page.evaluate(() => {
        const el = document.querySelector('#panel');
        const r = el ? el.getBoundingClientRect() : null;
        return r ? { x: r.left, y: r.top, w: r.width, h: r.height } : { x: 40, y: innerHeight / 2 - 60, w: 310, h: 120 };
      });
      const sx = scratchRect.x + scratchRect.w * 0.12;
      const sy = scratchRect.y + scratchRect.h * 0.12;
      await page.mouse.move(sx, sy);
      await page.mouse.down();
    }
    if (scratchStarted && !scratchDone && t <= scratchEnd) {
      const u = Math.min(1, Math.max(0, (t - scratchStart) / scratchDuration));
      const rowF = u * 4.999;
      const row = Math.min(4, Math.floor(rowF));
      const frac = rowF - row;
      const left = scratchRect.x + scratchRect.w * 0.12;
      const right = scratchRect.x + scratchRect.w * 0.88;
      const top = scratchRect.y + scratchRect.h * 0.12;
      const bottom = scratchRect.y + scratchRect.h * 0.88;
      const x = row % 2 === 0 ? left + (right - left) * frac : right - (right - left) * frac;
      const y = top + (bottom - top) * (row / 4); // 5 rows evenly spaced inside the panel
      scratchFinger = { x, y };
      await page.mouse.move(x, y);
    }
    if (scratchStarted && !scratchDone && t >= scratchEnd) {
      scratchDone = true;
      await page.mouse.up();
      const px = scratchRect.x + scratchRect.w * 0.88;
      const py = scratchRect.y + scratchRect.h * 0.88;
      await ring(px, py);
    }
    if (scratchDone && !revealLogged && t >= scratchEnd + 0.5) {
      revealLogged = true;
      const revealed = await page.evaluate(() => {
        const p = document.querySelector('#panel');
        if (!p) return false;
        if (p.classList.contains('done') || p.dataset.revealed === 'true') return true;
        if (p.querySelector('[data-revealed],.revealed,[data-state="revealed"]')) return true;
        const foil = p.querySelector('#fc');
        if (!foil) return true;
        const cs = getComputedStyle(foil);
        return cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.05;
      });
      if (!revealed) {
        const did = await page.evaluate(() => {
          if (typeof window.__reveal === 'function') { window.__reveal(); return 'window.__reveal()'; }
          const rv = document.querySelector('#rv');
          if (rv) { rv.click(); return '#rv click'; }
          return null;
        });
        WARNINGS.push(`foil not revealed by ${scratchEnd + 0.5}s; used ${did || 'no fallback available'}`);
        console.warn(WARNINGS.at(-1));
      }
    }

    /* finger + scroll + end fade, one evaluate per frame */
    let finger = { x: -100, y: -100, o: 0, s: 1 };
    const evt = (at, pt) => {
      if (!pt) return null;
      if (t >= at && t < at + 0.03) return { x: pt.x, y: pt.y, o: 1, s: 0.85 };
      if (t >= at - 0.35 && t < at) {
        const u = (t - (at - 0.35)) / 0.35;
        return { x: pt.x, y: pt.y, o: 1, s: 0.8 + 0.2 * u };
      }
      if (t >= at + 0.03 && t < at + 0.4) return { x: pt.x, y: pt.y, o: 1, s: 1 };
      return null;
    };
    finger = evt(tapGate, layout.gate) || finger;
    if (diyaPoint) finger = evt(tapDiya, diyaPoint) || finger;
    if (scratchFinger && scratchStarted && !scratchDone && t <= scratchEnd) {
      finger = { x: scratchFinger.x, y: scratchFinger.y, o: 1, s: 0.85 };
    }
    const holdScroll = gateTapped && !(gateOpened && (gateOpenAt ?? gateTapAt) + gateSettle <= t);
    const y = holdScroll ? 0 : yAt(t);
    const fadeOpacity = t > duration - endFade ? Math.min(1, (t - (duration - endFade)) / endFade) : 0;
    await page.evaluate(({ y, f, fo }) => {
      window.scrollTo(0, y);
      const el = document.getElementById('__finger');
      if (el) {
        el.style.left = `${f.x}px`; el.style.top = `${f.y}px`;
        el.style.opacity = String(f.o);
        el.style.transform = `translate(-50%,-50%) scale(${f.s})`;
      }
      const fade = document.getElementById('__fade');
      if (fade) fade.style.opacity = String(fo);
    }, { y, f: finger, fo: fadeOpacity });

    /* virtual clock + CSS/WAAPI driver */
    await page.clock.runFor(1000 / fps);
    await page.evaluate(DRIVER, t * 1000);
    await page.clock.runFor(1); // flush a pending paint without faking rAF

    if (i % 60 === 0) console.log(`frame ${i}/${N - 1}`);
    if (!capture) continue;

    const buf = await page.screenshot({ type: 'jpeg', quality });
    if (!ffmpeg.stdin.write(buf)) await once(ffmpeg.stdin, 'drain');

    if (!flags.preview && !posterSaved && t >= dateRevealAt) {
      posterSaved = true;
      await page.screenshot({ path: posterPath, type: 'png' });
    }
  }

  ffmpeg.stdin.end();
  const code = await ffDone;
  if (code !== 0) throw new Error(`ffmpeg failed (${code}): ${ffErr}`);

  if (!flags.preview) {
    fs.mkdirSync('/tmp/opencode', { recursive: true });
    const kbps = Math.max(100, Math.floor((15 * 8192 * 0.92) / duration) - 96);
    const vf = '[0:v]split=2[a][b];[a]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,boxblur=40:5,eq=brightness=0.03:saturation=1.1[bg];[b]scale=-2:1280[fg];[bg][fg]overlay=(W-w)/2:0,format=yuv420p';
    for (const pass of [1, 2]) {
      const passArgs = pass === 1
        ? ['-f', 'null', '/dev/null']
        : ['-movflags', '+faststart', ...audioArgs(duration, 96), whatsappPath];
      const rc = spawnSync('ffmpeg', [
        '-y', '-loglevel', 'error', '-i', masterPath,
        '-vf', vf, '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        '-b:v', `${kbps}k`, '-pass', String(pass), '-passlogfile', '/tmp/opencode/v01-wa', ...passArgs
      ]);
      if (rc.status !== 0) { WARNINGS.push(`WhatsApp pass ${pass} failed`); break; }
    }
  }

  console.log(`duration ${duration.toFixed(2)}s`);
  console.log(`master ${masterPath} ${fs.existsSync(masterPath) ? fs.statSync(masterPath).size : 0} bytes (${W}x${H}, ${fps} fps)`);
  if (!flags.preview) {
    console.log(`whatsapp ${whatsappPath} ${fs.existsSync(whatsappPath) ? fs.statSync(whatsappPath).size : 0} bytes`);
    console.log(`poster ${posterPath} ${fs.existsSync(posterPath) ? fs.statSync(posterPath).size : 0} bytes`);
  }
  console.log(`gate open ${gateOpenAt === null ? 'not detected' : gateOpenAt.toFixed(2) + 's'}`);
  console.log('warnings: ' + (WARNINGS.length ? WARNINGS.join(' | ') : 'none'));
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  if (ffmpeg && ffmpeg.stdin && !ffmpeg.stdin.destroyed) ffmpeg.stdin.end();
  if (browser) await browser.close();
  if (server) server.stop();
}

