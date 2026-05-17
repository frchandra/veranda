import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().max(160),
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
    pinned: z.boolean().default(false),
  })
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
    thumbnail: z.string().optional(),
    externalUrl: z.string().optional(),
  })
});

export const collections = {
  blog,
  projects
};
