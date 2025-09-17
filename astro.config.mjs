// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkDirective from 'remark-directive';
import rehypeRaw from 'rehype-raw';
import { storyDirectives } from './src/lib/story-directives.mjs';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx({
      remarkPlugins: [
        remarkDirective,
        storyDirectives,
      ],
      rehypePlugins: [
        rehypeRaw,
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
