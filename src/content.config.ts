import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs', retainBody: false }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = { docs };
