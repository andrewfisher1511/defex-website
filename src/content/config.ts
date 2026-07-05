import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number(),
    summary: z.string().max(160),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    sector: z.string(),
    region: z.string(),
    scopeTags: z.array(z.string()),
    order: z.number(),
    image: z.enum(['project-1', 'project-2', 'project-3', 'hero']),
  }),
});

const appFeatures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/app-features' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    screenshot: z.string().nullable(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    attribution: z.string(),
    placeholder: z.boolean(),
  }),
});

export const collections = { services, projects, 'app-features': appFeatures, testimonials };
