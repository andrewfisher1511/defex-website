import { z } from 'astro:content';
import raw from '../../content/diagnostics.json';

const pinSchema = z.object({
  kind: z.string(),
  title: z.string(),
  body: z.string(),
  ref: z.string(),
  x: z.number(),
  y: z.number(),
});

const diagnosticsSchema = z.object({
  scenarios: z.array(
    z.object({
      title: z.string(),
      image: z.enum(['project-1', 'project-2', 'project-3']),
      pins: z.array(pinSchema).length(3),
    })
  ),
});

export const diagnostics = diagnosticsSchema.parse(raw);
