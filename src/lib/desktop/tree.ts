/**
 * Nilson OS: the virtual file system behind /desktop.
 *
 * One typed tree feeds the desktop icons, the Files app, the launcher, the terminal and URL state.
 * Case studies are hand-built Astro pages (no content collection), so they are listed here with their
 * real routes; essays come from the `notes` collection and are passed in at build time.
 * Anything marked `todo` is placeholder copy waiting for Nilson.
 */

export type NodeKind =
  | 'folder'
  | 'case'
  | 'md'
  | 'video'
  | 'pdf'
  | 'app'
  | 'trash';

export interface FsNode {
  /** Path from the home folder, e.g. "Case studies/Grafana Labs/cloud-onboarding.case". */
  id: string;
  name: string;
  kind: NodeKind;
  title?: string;
  summary?: string;
  /** Route on this site. */
  url?: string;
  /** Link off-site (Keystrok, GitHub). */
  external?: string;
  /** Behind the existing NDA password flow. */
  locked?: boolean;
  /** Placeholder content, waiting for Nilson. */
  todo?: boolean;
  /** Text shown natively in the window (about, principles), from the homepage copy. */
  body?: { heading?: string; text: string }[];
  children?: FsNode[];
}

export interface NoteInput {
  slug: string;
  title: string;
  description: string;
}

type Spec = Omit<FsNode, 'id' | 'children'> & { children?: Spec[] };

const caseStudies: Spec = {
  name: 'Case studies',
  kind: 'folder',
  children: [
    {
      name: 'Dynatrace',
      kind: 'folder',
      locked: true,
      summary: 'Developer tooling for observability at scale.',
      children: [
        {
          name: 'settings-platform.case',
          kind: 'case',
          locked: true,
          title: 'Settings Platform',
          summary: 'Redesigning the configuration experience for Dynatrace.',
          url: '/projects/dynatrace/settings-platform',
        },
        {
          name: 'spaces.case',
          kind: 'case',
          locked: true,
          title: 'Spaces',
          summary: 'Designing the permission governance layer for Dynatrace.',
          url: '/projects/dynatrace/spaces',
        },
      ],
    },
    {
      name: 'Grafana Labs',
      kind: 'folder',
      summary: 'APM and observability UX.',
      children: [
        {
          name: 'cloud-app-observability.case',
          kind: 'case',
          title: 'Grafana Cloud Application Observability',
          summary:
            'APM and RUM for DevOps teams and non-technical users. 60% less user drop-off.',
          url: '/projects/grafana-cloud-observability',
        },
        {
          name: 'cloud-onboarding.case',
          kind: 'case',
          title: 'Grafana Cloud Onboarding',
          summary:
            'Redesigning the Grafana Cloud onboarding experience, with measurable impact.',
          url: '/projects/grafana-cloud-onboarding',
        },
        {
          name: 'frontend-observability-rum.case',
          kind: 'case',
          title: 'Frontend Observability: Real User Monitoring',
          summary:
            'A frontend monitoring solution for Grafana Cloud, from competitor analysis to principles.',
          url: '/projects/grafana-frontend',
        },
      ],
    },
    {
      name: 'Open source',
      kind: 'folder',
      summary: 'Contributions and experiments in the open.',
      children: [
        {
          name: 'service-radar-part-1.case',
          kind: 'case',
          title: 'Service Radar, part 1',
          summary:
            'Finding the design gap in open source distributed network monitoring.',
          url: '/projects/service-radar-part1',
        },
        {
          name: 'service-radar-part-2.case',
          kind: 'case',
          title: 'Service Radar, part 2',
          summary:
            'Designing the dashboard app for distributed network monitoring.',
          url: '/projects/service-radar-part2',
        },
      ],
    },
  ],
};

const sideProjects: Spec = {
  name: 'Side projects',
  kind: 'folder',
  children: [
    {
      name: 'keystrok.app',
      kind: 'app',
      title: 'Keystrok',
      summary:
        'Self-hosted, open-source API key management. Researched, designed and shipped end to end.',
      url: '/projects/keystrok',
      external: 'https://keystrok.dev',
    },
    {
      name: 'homelab.md',
      kind: 'md',
      title: 'Homelab',
      summary:
        '[TODO] The home server this desktop is modelled on: what runs there and why.',
      todo: true,
    },
    {
      name: 'tvtube.case',
      kind: 'case',
      title: 'tvTube',
      summary:
        '[TODO] A TV client for a self-hosted video front end, built for the couch.',
      todo: true,
    },
  ],
};

const about: Spec = {
  name: 'About & CV',
  kind: 'folder',
  children: [
    {
      name: 'about.md',
      kind: 'md',
      title: 'About',
      summary:
        'Product designer for developer tools and observability platforms.',
      body: [
        {
          text: "I'm a product designer specializing in developer tools and observability platforms. My broad design background helps me create technical products that feel surprisingly human.",
        },
        {
          text: 'There\'s nothing quite like making a developer say "finally, this makes sense!"',
        },
        {
          heading: 'Why technical products',
          text: 'Complex problems energize me. Transforming observability data into actionable insights at Grafana taught me that the harder the technical challenge, the more impactful good design becomes.',
        },
      ],
    },
    {
      name: 'principles.md',
      kind: 'md',
      title: 'Principles',
      summary:
        'Real-time impact at scale · Collaboration with brilliant minds · Art and science',
      body: [
        {
          heading: 'Real-time impact at scale',
          text: "When the work ships, it's not a mock — it's thousands of engineers moving faster every day.",
        },
        {
          heading: 'Collaboration with brilliant minds',
          text: 'Working with engineers sharpened how I think. I ask "what\'s possible?" before "what\'s ideal?"',
        },
        {
          heading: 'Art and science',
          text: 'Visualizing millions of data points needs both aesthetic sense and a deep grasp of how developers work.',
        },
      ],
    },
    {
      name: 'nilson-gaspar-cv.pdf',
      kind: 'pdf',
      title: 'CV',
      summary: '[TODO] CV file not in the repo yet.',
      todo: true,
    },
  ],
};

const trash: Spec = {
  name: 'Trash',
  kind: 'trash',
  summary: 'Design explorations that did not ship, and why.',
  children: [1, 2, 3].map((n) => ({
    name: `killed-idea-${n}.md`,
    kind: 'md' as const,
    title: `[TODO] Killed idea ${n}`,
    summary: '[TODO] What it was, and why it was killed.',
    todo: true,
  })),
};

function materialise(spec: Spec, parent: string): FsNode {
  const id = parent ? `${parent}/${spec.name}` : spec.name;
  const { children, ...rest } = spec;
  return {
    ...rest,
    id,
    ...(children ? { children: children.map((c) => materialise(c, id)) } : {}),
  };
}

export function buildTree(notes: NoteInput[]): FsNode[] {
  const essays: Spec = {
    name: 'Essays',
    kind: 'folder',
    children: notes.map((n) => ({
      name: `${n.slug}.md`,
      kind: 'md' as const,
      title: n.title,
      summary: n.description,
      url: `/notes/${n.slug}`,
    })),
  };
  const intro: Spec = {
    name: 'intro.mp4',
    kind: 'video',
    title: "Hi, I'm Nilson",
    summary: '[TODO] Intro video not recorded yet.',
    todo: true,
  };
  return [intro, caseStudies, sideProjects, essays, about, trash].map((s) =>
    materialise(s, '')
  );
}

/** Every node, depth first (launcher, terminal completion). */
export function flatten(nodes: FsNode[]): FsNode[] {
  return nodes.flatMap((n) => [n, ...flatten(n.children ?? [])]);
}
