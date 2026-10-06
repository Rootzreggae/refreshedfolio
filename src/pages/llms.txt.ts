/**
 * /llms.txt: a plain-Markdown map of this site for AI agents (llmstxt.org).
 * Built from the site's own data so it can't drift: case descriptions are the pages' meta
 * descriptions, essays come from the notes collection, experience from the 2026 CV.
 */
import type { APIRoute } from 'astro';
import { getPublishedNotes } from '../lib/notes';
import { contact } from '../lib/work';

const SITE = 'https://nilsongaspar.omg.lol';

const CASES: [string, string, string][] = [
  [
    'Grafana Cloud Application Observability',
    '/projects/grafana-cloud-observability',
    'Designing APM and RUM solutions for Grafana Labs, bridging the gap between DevOps teams and non-technical users. 60% reduction in user drop-off.',
  ],
  [
    'Grafana Cloud Onboarding',
    '/projects/grafana-cloud-onboarding',
    'Redesigning the Grafana Cloud onboarding experience with measurable impact.',
  ],
  [
    'Grafana Frontend Observability (RUM)',
    '/projects/grafana-frontend',
    'Designing comprehensive frontend monitoring solution for Grafana Cloud. RUM implementation with competitor analysis and design principles.',
  ],
  [
    'Service Radar, part 1',
    '/projects/service-radar-part1',
    'Finding the design gap in open source distributed network monitoring. UX research, community building, and design strategy.',
  ],
  [
    'Service Radar, part 2',
    '/projects/service-radar-part2',
    'Designing the dashboard application for Service Radar. AI-assisted design, React development, and DevOps UX optimization.',
  ],
  [
    'Dynatrace Settings Platform (password protected, NDA)',
    '/projects/dynatrace/settings-platform',
    'Redesigning the configuration experience for Dynatrace.',
  ],
  [
    'Dynatrace Spaces (password protected, NDA)',
    '/projects/dynatrace/spaces',
    'Designing the permission governance layer for Dynatrace.',
  ],
];

const EXPERIENCE = [
  'Senior Product Designer, Dynatrace (Oct 2025 to Apr 2026)',
  'Designer and Developer (independent), Keystrok (Jul 2024 to present)',
  'Senior Product Designer, Grafana Labs (May 2022 to Jul 2024)',
  'Senior Product Designer, KI Challengers (Aug 2020 to May 2022)',
  'Lead Product Designer, Jungle (Sep 2019 to Aug 2020)',
  'UX lead, Comparamais (2018 to Sep 2019)',
  'UX/UI Designer, Aptoide (Jan 2016 to Dec 2017)',
];

export const GET: APIRoute = async () => {
  const notes = await getPublishedNotes();
  const lines = [
    '# Nilson Gaspar',
    '',
    `> Senior Product Designer, developer tools, observability and data platforms. Based in ${contact.based}.`,
    '',
    'Fourteen years designing, last eight focused on technical products for the people who build software.',
    '',
    '## Contact',
    '',
    `- [Email](mailto:${contact.email})`,
    '- [LinkedIn](https://www.linkedin.com/in/nilsongaspar)',
    `- [GitHub](${contact.github.url})`,
    `- [Bluesky](${contact.bluesky.url})`,
    `- [CV (PDF)](${SITE}/nilson-gaspar-cv.pdf)`,
    '',
    '## Case studies',
    '',
    ...CASES.map(([t, u, d]) => `- [${t}](${SITE}${u}): ${d}`),
    '',
    '## Side projects',
    '',
    `- [Keystrok](${SITE}/projects/keystrok): Self-hosted, open-source API key management. Live at https://keystrok.dev`,
    '',
    '## Essays',
    '',
    ...notes.map(
      (n) =>
        `- [${n.data.title}](${SITE}/notes/${n.slug}): ${n.data.description}`
    ),
    '',
    '## Experience',
    '',
    ...EXPERIENCE.map((e) => `- ${e}`),
    '',
    '## Optional',
    '',
    `- [Homepage](${SITE}/)`,
    `- [Notes index](${SITE}/notes)`,
    `- [RSS](${SITE}/rss.xml)`,
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
