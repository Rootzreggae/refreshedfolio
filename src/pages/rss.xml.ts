import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedNotes } from '../lib/notes';

export async function GET(context: APIContext) {
  const notes = await getPublishedNotes();
  return rss({
    title: 'Nilson Gaspar — Notes',
    description: 'Design essays and thinking by Nilson Gaspar.',
    site: context.site ?? 'https://nilsongaspar.com',
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.publishDate,
      link: `/notes/${note.slug}`,
      categories: note.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}
