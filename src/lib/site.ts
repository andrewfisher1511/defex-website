/**
 * Typed accessor for the single source of company facts (content/site.json,
 * repo root per content-editing-spec — separated from layout code so Andrew's
 * AI-driven edits never need to touch a component).
 */
import { z } from 'astro:content';
import raw from '../../content/site.json';

const siteSchema = z.object({
  tradingName: z.string(),
  tagline: z.string(),
  abnPlaceholder: z.string(),
  phone: z.string(),
  phoneHref: z.string(),
  email: z.string(),
  web: z.string(),
  serviceArea: z.string(),
  hours: z.object({ line1: z.string(), line2: z.string() }),
  location: z.object({ suburb: z.string(), mapQuery: z.string() }),
  principal: z.object({
    name: z.string(),
    credentials: z.string(),
    titleLine: z.string(),
    registrations: z.array(z.string()),
  }),
  credentialLine: z.string(),
  appUrl: z.string(),
  social: z.object({
    linkedin: z.string(),
    facebook: z.string(),
    instagram: z.string(),
  }),
  capabilityStatementHref: z.string().nullable(),
  googleReview: z.string().nullable(),
});

export type Site = z.infer<typeof siteSchema>;

/** Validated, typed company facts. Fails the build if the shape is wrong. */
export const site: Site = siteSchema.parse(raw);

/** Current year, evaluated at build time. */
export const currentYear = new Date().getFullYear();
