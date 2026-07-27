import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.string().optional(),
    author: z.string().default('Tourvir Team'),
    date: z.date(),
  }),
});

export const collections = {
  blog: blogCollection,
};
