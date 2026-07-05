/**
 * facts-gate.mjs — runs after `astro build`. Scans every dist/**\/*.html for
 * forbidden strings and null-state violations (spec §11). Exits non-zero on any
 * hit so `npm run build` fails loudly. This is the enforcement backstop for the
 * hard rules in spec §1.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const site = JSON.parse(
  fs.readFileSync(path.join(root, 'src', 'content', 'site.json'), 'utf8')
);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

if (!fs.existsSync(distDir)) {
  console.error('facts-gate: dist/ not found — run astro build first.');
  process.exit(1);
}

// [label, regex, alwaysForbidden]. Null-state rules are added conditionally.
const rules = [
  ['TBC', /\bTBC\b/],
  ['XXX', /XXX/],
  ['lorem ipsum', /lorem ipsum/i],
  ['[PLACEHOLDER]', /\[PLACEHOLDER\]/],
  ['Placeholder — do not publish', /Placeholder — do not publish/],
  ['PO Box (postal unconfirmed)', /PO Box/],
  ['ABN (unconfirmed)', /ABN/],
  ['insurance (no claim permitted)', /insurance/i],
];

// appUrl-null null-state assertions.
if (site.appUrl === null) {
  rules.push(['Sign in (appUrl is null)', /Sign in/]);
  rules.push(['Open DEFEX (appUrl is null)', /Open DEFEX/]);
}

const files = walk(distDir);
const violations = [];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [label, re] of rules) {
    const m = html.match(re);
    if (m) {
      violations.push({
        file: path.relative(root, file),
        label,
        match: m[0],
      });
    }
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
