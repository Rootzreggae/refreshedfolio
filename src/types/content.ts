/**
 * Standardized Project Metadata Interface
 *
 * This interface defines the complete structure for project frontmatter,
 * ensuring consistency across all portfolio case studies.
 */

export interface ProjectMetadata {
  // === CORE CONTENT FIELDS ===
  /** Project title - concise and descriptive */
  title: string;

  /** Project description - 1-2 sentences for previews and SEO */
  description: string;

  /** Publication date for sorting and chronological display */
  publishDate: Date;

  /** Content tags for filtering and discovery */
  tags: string[];

  /** Whether to feature this project prominently */
  featured: boolean;

  /** Draft status - hide from production */
  draft: boolean;

  // === PROJECT HIERARCHY ===
  /** Project category for grouping and navigation */
  category: 'keystrok' | 'grafana' | 'opensource' | 'jungleai' | 'notes';

  /** Type of project for different rendering approaches */
  projectType: 'single' | 'category' | 'subproject';

  /** Parent project slug for subprojects (enables breadcrumbs) */
  parentProject?: string;

  /** Child project slugs for category projects (enables navigation) */
  childProjects?: string[];

  /** Sort order within category/parent */
  order: number;

  /** URL slug override (defaults to filename if not provided) */
  slug?: string;

  // === VISUAL CONTENT ===
  /** Hero image for project detail pages */
  heroImage?: string;

  /** Alt text for hero image (required if heroImage provided) */
  heroImageAlt?: string;

  /** Thumbnail for project cards and previews */
  thumbnail?: string;

  /** Brand color for accents and theming */
  color?: string;

  // === EXTERNAL LINKS ===
  /** Live project URL */
  url?: string;

  /** GitHub repository URL */
  github?: string;

  /** Additional external links */
  externalLinks?: {
    label: string;
    url: string;
    type?: 'demo' | 'documentation' | 'case-study' | 'article';
  }[];

  // === PROJECT DETAILS ===
  /** Role(s) in the project */
  role: string;

  /** Team members and collaborators */
  team: string[];

  /** Project timeline (replaces duration field) */
  timeline: string;

  /** Client or organization */
  client: string;

  /** Technologies and tools used */
  technologies: string[];

  // === TECHNICAL DETAILS ===
  /** Technical architecture description */
  architecture?: string;

  /** Project scale and scope */
  scale?: string;

  // === PROCESS AND METHODOLOGY ===
  /** Primary methodology used */
  methodology?: 'agile' | 'design-thinking' | 'lean-ux' | 'waterfall';

  /** Research methods employed */
  researchMethods: string[];

  // === RESULTS AND IMPACT ===
  /** Quantitative and qualitative metrics */
  metrics?: {
    /** User satisfaction scores or feedback */
    userSatisfaction?: string;
    /** Conversion or adoption improvements */
    conversionImprovement?: string;
    /** Performance gains achieved */
    performanceGains?: string;
    /** User adoption rates */
    adoptionRate?: string;
    /** Custom metrics specific to project */
    custom?: {
      label: string;
      value: string;
    }[];
  };

  // === COLLABORATION ===
  /** Key stakeholders involved */
  stakeholders: string[];

  /** Whether this involved cross-functional collaboration */
  crossFunctionalTeam: boolean;

  // === CONTENT ORGANIZATION ===
  /** Story sections to include in the narrative */
  sections: ('problem' | 'research' | 'design' | 'development' | 'results' | 'learnings')[];

  // === SEO AND DISCOVERY ===
  /** Keywords for search optimization */
  keywords: string[];

  /** Project complexity level */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';

  // === STORY COMPONENTS ===
  /** Hero section configuration for story components */
  hero?: {
    title: string;
    description: string;
    project?: string;
    role?: string;
    timeline?: string;
    status?: string;
  };

  // === NAVIGATION ===
  /** Footer navigation configuration */
  footer?: {
    backLink?: string;
    backText?: string;
    nextLink?: string;
    nextText?: string;
  };

  // === CONTENT STRATEGY ===
  /** Target audience for this case study */
  audience?: ('developers' | 'designers' | 'product-managers' | 'executives' | 'general')[];

  /** Primary narrative focus */
  narrativeFocus?: 'process' | 'results' | 'technical' | 'collaboration';

  /** Estimated reading time */
  readingTime?: string;
}

/**
 * Simplified interface for project previews and cards
 */
export interface ProjectPreview {
  slug: string;
  title: string;
  description: string;
  category: ProjectMetadata['category'];
  projectType: ProjectMetadata['projectType'];
  thumbnail?: string;
  color?: string;
  role: string;
  timeline: string;
  tags: string[];
  featured: boolean;
  order: number;
}

/**
 * Interface for project navigation relationships
 */
export interface ProjectNavigation {
  current: {
    slug: string;
    title: string;
    projectType: ProjectMetadata['projectType'];
  };
  parent?: {
    slug: string;
    title: string;
  };
  children?: {
    slug: string;
    title: string;
    order: number;
  }[];
  siblings?: {
    prev?: {
      slug: string;
      title: string;
    };
    next?: {
      slug: string;
      title: string;
    };
  };
  breadcrumbs: {
    slug: string;
    title: string;
  }[];
}

/**
 * Interface for metrics display component
 */
export interface MetricsDisplay {
  metrics: {
    number: string;
    label: string;
    description?: string;
  }[];
  layout?: 'grid' | 'horizontal' | 'vertical';
  showIcons?: boolean;
}

/**
 * Type guards for project types
 */
export const isCategory = (project: ProjectMetadata): boolean =>
  project.projectType === 'category';

export const isSubproject = (project: ProjectMetadata): boolean =>
  project.projectType === 'subproject';

export const isSingleProject = (project: ProjectMetadata): boolean =>
  project.projectType === 'single';

/**
 * Utility type for filtering projects by category
 */
export type ProjectsByCategory = {
  [K in ProjectMetadata['category']]: ProjectMetadata[];
};