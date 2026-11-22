// Side-by-side comparison tool. Usage:
//   node scripts/compare.mjs <still.png> <reference.png> [--full]
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

const stillFilter = full ? '[0:v]scale=390:844[a]' : '[0:v]crop=887:1920:96:0,scale=390:844[a]';
const refFilter = '[1:v]scale=390:844[b]';
const filter = `${stillFilter};${refFilter};[a][b]hstack=inputs=2[out]`;

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
execFileSync(
  npx,
  ['remotion', 'ffmpeg', '-y', '-i', still, '-i', reference, '-filter_complex', filter, '-map', '[out]', out],
  { stdio: 'inherit' },
);
console.log(out);
