/**
 * verify-budget.mjs — static first-load budget check for `/` (spec §11/§13.3).
 *
 * Sums the bytes the home page requests on first load: the HTML itself, every
 * local stylesheet and script it links, the preloaded font, and the single
 * heaviest hero image candidate (the hero is the only eager image; below-fold
 * images are lazy). Asserts the total is under 1 MB. Static analysis of the
 * built output — an approximation the spec explicitly accepts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const BUDGET = 1024 * 1024; // 1 MB

const htmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(htmlPath)) {
  console.error('verify-budget: dist/index.html not found — run astro build first.');
  process.exit(1);
}
const html = fs.readFileSync(htmlPath, 'utf8');

function localPath(url) {
  if (!url || /^https?:\/\//.test(url) || url.startsWith('//') || url.startsWith('data:')) {
    return null;
  }
  const clean = url.split('?')[0].split('#')[0];
  return path.join(distDir, clean.replace(/^\//, ''));
}

function sizeOf(p) {
  try {
    return fs.statSync(p).size;
  } catch {
    return 0;
  }
}

const seen = new Set();
function addAsset(list, url, kind) {
  const p = localPath(url);
  if (!p || seen.has(p) || !fs.existsSync(p)) return;
  seen.add(p);
  list.push({ kind, file: path.relative(distDir, p), bytes: sizeOf(p) });
}

const assets = [];

// HTML itself.
assets.push({ kind: 'html', file: 'index.html', bytes: Buffer.byteLength(html) });

// Stylesheets + preloaded fonts (<link>).
for (const m of html.matchAll(/<link\b[^>]*>/g)) {
  const tag = m[0];
  const href = (tag.match(/href="([^"]+)"/) || [])[1];
  if (/rel="stylesheet"/.test(tag)) addAsset(assets, href, 'css');
  else if (/rel="preload"/.test(tag) && /as="font"/.test(tag)) addAsset(assets, href, 'font');
}

// Scripts.
for (const m of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)) {
  addAsset(assets, m[1], 'js');
}

// Hero image: the only eager image. Pick the heaviest candidate across all
// <source>/<img> srcset entries referencing the hero, so the check is
// conservative for any viewport/DPR.
const heroCandidates = new Map();
for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const part of m[1].split(',')) {
    const url = part.trim().split(/\s+/)[0];
    if (/hero-architecture/.test(url)) {
      const p = localPath(url);
      if (p && fs.existsSync(p)) heroCandidates.set(p, sizeOf(p));
    }
  }
}
if (heroCandidates.size) {
  let heaviest = null;
  for (const [p, bytes] of heroCandidates) {
    if (!heaviest || bytes > heaviest.bytes) heaviest = { p, bytes };
  }
  assets.push({
    kind: 'image(hero, heaviest candidate)',
    file: path.relative(distDir, heaviest.p),
    bytes: heaviest.bytes,
  });
}

const total = assets.reduce((s, a) => s + a.bytes, 0);

console.log('\nFirst-load budget for /  (conservative static estimate):');
for (const a of assets.sort((x, y) => y.bytes - x.bytes)) {
  console.log(`  ${(a.bytes / 1024).toFixed(1).padStart(7)} kB  ${a.kind.padEnd(12)} ${a.file}`);
}
console.log(`  ${'-'.repeat(40)}`);
console.log(`  ${(total / 1024).toFixed(1).padStart(7)} kB  total  (budget ${(BUDGET / 1024).toFixed(0)} kB)`);

if (total >= BUDGET) {
  console.error(`\nBUDGET FAILED — / first load ${(total / 1024).toFixed(1)} kB ≥ 1024 kB.`);
  process.exit(1);
}
console.log(`\nverify-budget: OK — ${(total / 1024).toFixed(1)} kB under 1 MB.`);
