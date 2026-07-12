/**
 * generate-knowledge.mjs — regenerates the Ask DEFEX knowledge blob from
 * content/ at build time, so functions/api/ask.ts never drifts from the
 * site's actual copy (README §10). Run before deploy; wired into `npm run
 * build`. Output is committed so the Function can import it without a build
 * step of its own inside the Functions bundle.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'content');

const site = JSON.parse(fs.readFileSync(path.join(contentDir, 'site.json'), 'utf8'));

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw.trim() };
  const [, fm, body] = m;
  const data = {};
  for (const line of fm.split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^"|"$/g, '');
  }
  return { data, body: body.trim() };
}

function loadDir(dir) {
  const full = path.join(contentDir, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseFrontmatter(fs.readFileSync(path.join(full, f), 'utf8')));
}

const services = loadDir('services').sort((a, b) => Number(a.data.order) - Number(b.data.order));

const serviceLines = services
  .map((s, i) => `${i + 1}) ${s.data.title} — ${s.body.replace(/\s+/g, ' ')}`)
  .join(' ');

const processSteps =
  '01 Contact (describe the building and symptoms), 02 Proposal (written scope and fee in plain terms), ' +
  '03 Investigation and reporting (photo-evidenced, standards-keyed), 04 Design and delivery (where rectification proceeds, through to completion).';

const knowledge =
  `${site.tradingName} is a deliberately small Sydney remedial consulting practice led by ${site.principal.name} ` +
  `(${site.principal.credentials}, NER; ${site.principal.registrations.join('; ')}). Tagline: ${site.tagline} ` +
  'The engineer who inspects the building is the engineer who writes the report, prepares the design and superintends the works. ' +
  `Service area: ${site.serviceArea}. Contact: ${site.phone}, ${site.email}. ` +
  `Hours: ${site.hours.line1} ${site.hours.line2} ` +
  `Services: ${serviceLines} ` +
  `How engagements run: ${processSteps} ` +
  'The DEFEX platform is the in-house software the practice runs on (site capture with photos tied to defects, project board, timesheets, documents); ' +
  'it is not for sale and has no pricing; clients and builders log in to the projects they are connected to. ' +
  'Enquiries can be sent from the Contact page with photos and documents attached.';

const outDir = path.join(root, 'functions', '_generated');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'site-knowledge.json'), JSON.stringify({ knowledge }, null, 2));

console.log(`generate-knowledge: wrote ${knowledge.length} chars from ${services.length} service file(s).`);
