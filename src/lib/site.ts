/**
 * Typed accessor for the single source of company facts (src/content/site.json).
 *
 * NULL SEMANTICS (spec §1 hard rule): every nullable field renders NOTHING when
 * null — no label, no empty row, no dash. Components must guard each nullable
 * with a conditional. This module only *types and validates* the shape; the
 * "render nothing" behaviour lives at each call site.
 */
import { z } from 'astro:content';
import raw from '../content/site.json';

const principalSchema = z.object({
  name: z.string(),
  credentials: z.string(),
  registrations: z.array(z.string()),
});

const siteSchema = z.object({
  tradingName: z.string(),
  tagline: z.string(),
  legalEntity: z.string().nullable(),
  abn: z.string().nullable(),
  phone: z.string(),
  phoneHref: z.string(),
  email: z.string(),
  web: z.string(),
  postal: z.string().nullable(),
  serviceArea: z.string(),
  principal: principalSchema,
  piInsurance: z.string().nullable(),
  appUrl: z.string().nullable(),
  social: z.object({
    linkedin: z.string().nullable(),
  }),
});

export type Site = z.infer<typeof siteSchema>;

/** Validated, typed company facts. Fails the build if the shape is wrong. */
export const site: Site = siteSchema.parse(raw);

/** Full credential line, e.g. for the footer. */
export const credentialLine = `${site.principal.name} — ${site.principal.credentials} · ${site.principal.registrations.join(' · ')}`;

/** Current year, evaluated at build time. */
export const currentYear = new Date().getFullYear();
