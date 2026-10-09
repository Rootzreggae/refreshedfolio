/**
 * /sitemap.xml: the public pages, for search engines and AI search crawlers (robots.txt points here).
 * The NDA cases (/projects/dynatrace/*) and /desktop are left out on purpose.
 */
import type { APIRoute } from 'astro';
import { getPublishedNotes } from '../lib/notes';

const SITE = 'https://nilsongaspar.omg.lol';
const PAGES = [
  '/',
  '/projects/grafana',
  '/projects/grafana-cloud-observability',
  '/projects/grafana-cloud-onboarding',
  '/projects/grafana-frontend',
  '/projects/service-radar',
  '/projects/service-radar-part1',
  '/projects/service-radar-part2',
  '/projects/keystrok',
  '/notes',
];

export const GET: APIRoute = async () => {
  const notes = await getPublishedNotes();
  const urls = [...PAGES, ...notes.map((n) => `/notes/${n.slug}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
