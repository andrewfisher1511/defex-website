/**
 * generate-og.mjs — deterministic, offline OG + social image kit (spec §10).
 *
 * Composes an SVG per artefact (Navy field, white X-mark, Inter 600 title,
 * Concrete eyebrow, thin Electric Blue rule) and rasterises with
 * @resvg/resvg-js, embedding the committed Inter font buffer. No network.
 * Outputs are committed to the repo.
 */
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const fontBuffer = fs.readFileSync(path.join(__dirname, 'assets', 'InterVariable.woff2'));

const NAVY = '#1a1a2e';
const WHITE = '#ffffff';
const CONCRETE = '#c9cfd8';
const BLUE = '#2563eb';

const ogDir = path.join(root, 'public', 'og');
const socialDir = path.join(root, 'public', 'social');
fs.mkdirSync(ogDir, { recursive: true });
fs.mkdirSync(socialDir, { recursive: true });

/** The DEFEX "Engineered" mark, positioned + scaled. Diamond stays blue. */
function markGroup(x, y, size, frame = WHITE, diamond = BLUE) {
  const s = size / 120;
  return `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect x="10" y="10" width="100" height="100" rx="18" fill="none" stroke="${frame}" stroke-width="7"/>
    <g transform="rotate(45 60 60)" fill="${frame}">
      <rect x="72" y="53" width="40" height="14"/>
      <rect x="8" y="53" width="40" height="14"/>
      <rect x="53" y="72" width="14" height="40"/>
      <rect x="53" y="8" width="14" height="40"/>
    </g>
    <rect x="52.5" y="52.5" width="15" height="15" transform="rotate(45 60 60)" fill="${diamond}"/>
  </g>`;
}

function escapeXml(str) {
  return str.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]
  );
}

function renderPng(svg, width, height, outPath) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: NAVY,
    font: {
      fontBuffers: [fontBuffer],
      loadSystemFonts: false,
      defaultFontFamily: 'Inter Variable',
    },
  });
  const png = resvg.render().asPng();
  fs.writeFileSync(outPath, png);
  return png.length;
}

/** 1200×630 OG card. */
function ogCard(title) {
  const W = 1200;
  const H = 630;
  const pad = 90;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${NAVY}"/>
    ${markGroup(pad, pad, 120)}
    <rect x="${pad}" y="378" width="76" height="6" fill="${BLUE}"/>
    <text x="${pad}" y="430" fill="${CONCRETE}" font-family="Inter Variable" font-size="26" font-weight="600" letter-spacing="2.6">DEFEX ENGINEERING</text>
    <text x="${pad}" y="512" fill="${WHITE}" font-family="Inter Variable" font-size="70" font-weight="600" letter-spacing="-1.4">${escapeXml(title)}</text>
  </svg>`;
}

/** 1584×396 LinkedIn banner — lockup left, tagline right, safe margins. */
function linkedinBanner() {
  const W = 1584;
  const H = 396;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${NAVY}"/>
    ${markGroup(150, 143, 110)}
    <text x="285" y="185" fill="${WHITE}" font-family="Inter Variable" font-size="52" font-weight="700" letter-spacing="1">DEFE<tspan fill="${BLUE}">X</tspan></text>
    <text x="286" y="228" fill="${CONCRETE}" font-family="Inter Variable" font-size="21" font-weight="600" letter-spacing="7">ENGINEERING</text>
    <text x="1434" y="200" text-anchor="end" fill="${WHITE}" font-family="Inter Variable" font-size="40" font-weight="300" letter-spacing="-0.5">Defects Resolved.</text>
    <text x="1434" y="236" text-anchor="end" fill="${CONCRETE}" font-family="Inter Variable" font-size="19" font-weight="500">Remedial consulting engineers · Sydney</text>
  </svg>`;
}

/** 400×400 avatar — white icon on Navy, mark at 62% of canvas. */
function avatar() {
  const W = 400;
  const size = Math.round(W * 0.62); // 248
  const off = Math.round((W - size) / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
    <rect width="${W}" height="${W}" fill="${NAVY}"/>
    ${markGroup(off, off, size)}
  </svg>`;
}

const OG_TITLES = {
  home: 'Defects Resolved.',
  services: 'Services',
  projects: 'Projects',
  'defex-app': 'The DEFEX Platform',
  about: 'About',
  contact: 'Contact',
  default: 'Defects Resolved.',
};

let count = 0;
for (const [key, title] of Object.entries(OG_TITLES)) {
  const bytes = renderPng(ogCard(title), 1200, 630, path.join(ogDir, `${key}.png`));
  console.log(`og/${key}.png  ${(bytes / 1024).toFixed(0)}kB`);
  count++;
}
{
  const bytes = renderPng(linkedinBanner(), 1584, 396, path.join(socialDir, 'linkedin-banner.png'));
  console.log(`social/linkedin-banner.png  ${(bytes / 1024).toFixed(0)}kB`);
  count++;
}
{
  const bytes = renderPng(avatar(), 400, 400, path.join(socialDir, 'avatar.png'));
  console.log(`social/avatar.png  ${(bytes / 1024).toFixed(0)}kB`);
  count++;
}
console.log(`\nGenerated ${count} images.`);
