/**
 * Selected work — single source of truth for the home page.
 *
 * Case studies live as individual Astro pages under /src/pages/projects/ (there is
 * no content collection for them), so this module is the one place that lists them.
 * Both the home "Selected work" column and the ⌘K "Work" group read from here, so
 * the visible list and the command palette can never drift apart.
 *
 * Order is intentional: most-relevant / current first.
 */

export interface WorkItem {
  /** Display name. */
  name: string;
  /** Real case-study route. */
  url: string;
  /** Two-line caption shown under the name in the hero column. */
  caption: string;
  /** Short tenure tag shown in the Work slide-over (now / prev / side / ∞). */
  tenure: string;
  /** One-line description shown in the Work slide-over. */
  blurb: string;
  /** Password-protected case study — renders a lock icon. */
  locked?: boolean;
}

export const selectedWork: WorkItem[] = [
  {
    name: 'Dynatrace',
    url: '/projects/dynatrace',
    caption: 'developer tooling · now',
    tenure: 'now',
    blurb: 'Building developer tooling for observability at scale.',
    locked: true,
  },
  {
    name: 'Grafana Labs',
    url: '/projects/grafana',
    caption: 'observability UX · −20% time-to-insight',
    tenure: 'prev',
    blurb: 'APM & observability UX. Cut time-to-insight by 20%.',
  },
  {
    name: 'Keystrok',
    url: '/projects/keystrok',
    caption: 'keyboard-first tools',
    tenure: 'side',
    blurb: 'Keyboard-first tools, designed and shipped solo.',
  },
  {
    name: 'Open source',
    url: '/projects/service-radar',
    caption: 'experiments in the open',
    tenure: '∞',
    blurb: 'Contributions & experiments in the open.',
  },
];

/** Real contact / social values used across the home page. */
export const contact = {
  email: 'hello@nilsongaspar.com',
  bluesky: { handle: '@nilsongaspar', url: 'https://bsky.app/profile/nilsongaspar.bsky.social' },
  github: { handle: '/nilsongaspar', url: 'https://github.com/nilsongaspar' },
  based: 'Lisbon, Portugal',
};
