/**
 * facts-gate.mjs — runs after `astro build`. Scans every dist/**\/*.html for
 * forbidden strings in the VISIBLE TEXT (tags, scripts, styles, comments and
 * the doctype are stripped first, so Tailwind-ish class names like
 * "leading-none" or the "!" in "<!DOCTYPE html>" can't false-positive).
 * Exits non-zero on any hit so `npm run build` fails loudly.
 *
 * rev2 differs from rev1 here: the ABN placeholder ("ABN XXX XXX XXX XXX")
 * is now an APPROVED, always-shown string (design_handoff README hard
 * guardrail), not something to hide — so this gate allow-lists exactly that
 * phrase and instead flags any OTHER stray "XXX", plus the voice rules
 * (no PI insurance claim, no superlatives, no exclamation marks, no lorem
 * ipsum / bracket placeholders).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

const APPROVED_ABN_LINE = 'ABN XXX XXX XXX XXX';

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Reduce HTML to its visible text: drop scripts/styles/comments/doctype/tags. */
function visibleText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<!DOCTYPE[^>]*>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
}

if (!fs.existsSync(distDir)) {
  console.error('facts-gate: dist/ not found — run astro build first.');
  process.exit(1);
}

const rules = [
  ['lorem ipsum', /lorem ipsum/i],
  ['[PLACEHOLDER]', /\[PLACEHOLDER\]/],
  ['Placeholder — do not publish', /Placeholder — do not publish/],
  ['PO Box (postal not part of rev2 copy)', /PO Box/],
  ['insurance (no PI claim permitted)', /professional indemnity|\bPI insurance\b/i],
  ['banned superlative: leading', /\bleading\b/i],
  ['banned superlative: best', /\bbest\b/i],
  ['banned superlative: trusted', /\btrusted\b/i],
  ['banned superlative: premier', /\bpremier\b/i],
];

const files = walk(distDir);
const violations = [];

for (const file of files) {
  const text = visibleText(fs.readFileSync(file, 'utf8'));

  for (const [label, re] of rules) {
    const m = text.match(re);
    if (m) violations.push({ file: path.relative(root, file), label, match: m[0] });
  }

  const withoutApproved = text.split(APPROVED_ABN_LINE).join('');
  const strayXxx = withoutApproved.match(/XXX/);
  if (strayXxx) {
    violations.push({ file: path.relative(root, file), label: 'stray XXX placeholder', match: strayXxx[0] });
  }

  const bang = text.match(/!/);
  if (bang) {
    const idx = text.indexOf('!');
    violations.push({
      file: path.relative(root, file),
      label: 'exclamation mark in copy',
      match: text.slice(Math.max(0, idx - 30), idx + 10).trim(),
    });
  }
}

if (violations.length) {
  console.error(`\nFACTS GATE FAILED — ${violations.length} violation(s):\n`);
  for (const v of violations) {
    console.error(`  ✗ [${v.label}] "${v.match}" in ${v.file}`);
  }
  console.error('');
  process.exit(1);
}

console.log(`facts-gate: OK — ${files.length} HTML file(s) clean.`);
