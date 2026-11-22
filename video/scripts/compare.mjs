// Side-by-side comparison tool. Usage:
//   node scripts/compare.mjs <still.png> <reference.png> [--full]
// Remotion's bundled ffmpeg is used for the crop/scale where available; the
// horizontal join uses ImageMagick because Remotion's ffmpeg has no hstack.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const full = args.includes('--full');
const files = args.filter((a) => a !== '--full');
if (files.length !== 2) {
  console.error('Usage: node scripts/compare.mjs <still.png> <reference.png> [--full]');
  process.exit(1);
}
const [still, reference] = files;
const name = path.basename(still, path.extname(still));
const out = path.join('qa', `compare-${name}.png`);
fs.mkdirSync('qa', { recursive: true });

const a = path.join('qa', `.cmp-a-${name}.png`);
const b = path.join('qa', `.cmp-b-${name}.png`);
const size = full ? '540x960!' : '390x844!';
const stillArgs = full
  ? [still, '-resize', size, a]
  : [still, '-crop', '887x1920+96+0', '+repage', '-resize', size, a];
execFileSync('magick', stillArgs, { stdio: 'ignore' });
execFileSync('magick', [reference, '-resize', size, b], { stdio: 'ignore' });
execFileSync('magick', [a, b, '+append', out], { stdio: 'ignore' });
fs.unlinkSync(a);
fs.unlinkSync(b);
console.log(out);
