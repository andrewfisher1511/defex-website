import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number(),
    summary: z.string().max(200),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/projects' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    tags: z.array(z.string()),
    order: z.number(),
    gallery: z.array(
      z.object({
        image: z.enum(['project-1', 'project-2', 'project-3', 'hero-architecture']),
        caption: z.string(),
      })
    ),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/posts' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    image: z.enum(['project-1', 'project-2', 'project-3', 'hero-architecture']),
    excerpt: z.string(),
    ctaLabel: z.string(),
    order: z.number(),
  }),
});

export const collections = { services, projects, posts };
