import { defineCollection, z } from 'astro:content';

/**
 * Projects collection removed - projects are now managed as Astro pages in /src/pages/projects/
 * This eliminates content collection conflicts and allows for more flexible page structures.
 *
 * Migration notes:
 * - Old content collection projects have been moved to /src/pages/projects/
 * - Project navigation and relationships are now handled through direct data structures
 * - This maintains the notes collection for blog-style content
 */

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  notes,
};
