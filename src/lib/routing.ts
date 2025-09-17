/**
 * Centralized Routing Configuration for Astro Portfolio
 *
 * This module provides type-safe routing utilities that ensure consistency
 * across all project routes and layouts.
 */

import type { CollectionEntry } from 'astro:content';

// === TYPE DEFINITIONS ===

export type ProjectType = 'single' | 'category' | 'subproject';
export type LayoutType = 'component-case-study' | 'markdown-case-study' | 'project' | 'category';

export interface RouteConfig {
  url: string;
  layout: LayoutType;
  params: {
    slug: string;
  };
}

export interface ProjectMetadata {
  title: string;
  category: string;
  projectType: ProjectType;
  parentProject?: string;
  slug: string;
  fileExtension: 'md' | 'mdx';
}

// === LAYOUT MAPPING CONFIGURATION ===

/**
 * Defines which layout to use based on project characteristics
 * This replaces the complex conditional logic in [...slug].astro
 */
const LAYOUT_MAPPING: Record<string, (project: ProjectMetadata) => LayoutType> = {
  single: (project) => {
    // MDX files with component imports use ComponentCaseStudyLayout
    if (project.fileExtension === 'mdx') {
      return 'component-case-study';
    }

    // Special handling for certain categories that prefer markdown layout
    if (project.category === 'jungleai') {
      return 'markdown-case-study';
    }

    // Default to project layout for simple markdown content
    return 'project';
  },

  category: () => 'category',

  subproject: (project) => {
    // Subprojects with MDX get component case study layout
    if (project.fileExtension === 'mdx') {
      return 'component-case-study';
    }

    // Fallback to project layout
    return 'project';
  },
};

// === URL GENERATION UTILITIES ===

/**
 * Generates a clean, predictable slug from a collection entry
 */
export function generateSlug(project: CollectionEntry<'projects'>): string {
  const { category, projectType } = project.data;

  // Use explicit slug if provided in frontmatter
  if (project.data.slug) {
    return project.data.slug;
  }

  // Use Astro's generated slug from filename
  const fileSlug = project.slug;
  if (!fileSlug) {
    console.error(`No slug available for project: ${project.data.title}`);
    return 'unknown';
  }

  // For category projects, use category name if file follows pattern category-overview
  if (projectType === 'category' && fileSlug === `${category}-overview`) {
    return category;
  }

  // For single projects, keep full filename as slug to avoid conflicts with category routes
  // Note: Single projects should never simplify to just category name to avoid route conflicts
  if (projectType === 'single') {
    return fileSlug;
  }

  // For subprojects, remove category prefix for cleaner nested URLs
  let cleanSlug = fileSlug;
  if (projectType === 'subproject' && fileSlug.startsWith(`${category}-`)) {
    cleanSlug = fileSlug.replace(`${category}-`, '');
  }

  // If after cleanup we have an empty string or just 'main'/'overview', use the full filename
  if (!cleanSlug || cleanSlug === 'main' || cleanSlug === 'overview') {
    return fileSlug;
  }

  return cleanSlug;
}

/**
 * Generates the full URL path for a project
 */
export function generateUrl(project: CollectionEntry<'projects'>): string {
  const { category, projectType, parentProject } = project.data;
  const slug = generateSlug(project);

  switch (projectType) {
    case 'single':
      return `/work/${slug}`;

    case 'category':
      return `/work/${category}`;

    case 'subproject':
      if (!parentProject) {
        console.error(`Subproject "${project.data.title}" missing parentProject`);
        return `/work/${category}/${slug}`;
      }
      return `/work/${category}/${slug}`;

    default:
      console.error(`Unknown projectType: ${projectType}`);
      return `/work/${slug}`;
  }
}

/**
 * Determines the appropriate layout for a project
 */
export function getLayoutType(project: CollectionEntry<'projects'>): LayoutType {
  const projectType = project.data.projectType || 'single';
  const fileExtension = project.id.endsWith('.mdx') ? 'mdx' : 'md';

  const metadata: ProjectMetadata = {
    title: project.data.title,
    category: project.data.category,
    projectType,
    parentProject: project.data.parentProject,
    slug: project.slug || 'unknown',
    fileExtension,
  };

  const layoutResolver = LAYOUT_MAPPING[projectType];
  if (!layoutResolver) {
    console.error(`No layout mapping for projectType: ${projectType}`);
    return 'project';
  }

  return layoutResolver(metadata);
}

// === ROUTE GENERATION ===

/**
 * Generates static paths for Astro's getStaticPaths()
 */
export function generateStaticPaths(projects: CollectionEntry<'projects'>[]): Array<{
  params: { slug: string };
  props: {
    project: CollectionEntry<'projects'>;
    routeConfig: RouteConfig;
    relatedProjects?: CollectionEntry<'projects'>[];
  };
}> {
  const paths: Array<{
    params: { slug: string };
    props: {
      project: CollectionEntry<'projects'>;
      routeConfig: RouteConfig;
      relatedProjects?: CollectionEntry<'projects'>[];
    };
  }> = [];

  // Create lookup maps for efficient relationships
  const projectsByCategory = new Map<string, CollectionEntry<'projects'>[]>();
  const categoryProjects = new Map<string, CollectionEntry<'projects'>>();

  projects.forEach(project => {
    const category = project.data.category;

    if (!projectsByCategory.has(category)) {
      projectsByCategory.set(category, []);
    }
    projectsByCategory.get(category)!.push(project);

    if (project.data.projectType === 'category') {
      categoryProjects.set(category, project);
    }
  });

  projects.forEach(project => {
    const url = generateUrl(project);
    const layout = getLayoutType(project);
    const { projectType, category } = project.data;

    // Generate slug from URL (remove /work/ prefix)
    // For [...slug] routes, Astro expects a string representing the full path
    const slug = url.replace('/work/', '');

    const routeConfig: RouteConfig = {
      url,
      layout,
      params: { slug },
    };

    // Get related projects based on project type
    let relatedProjects: CollectionEntry<'projects'>[] | undefined;

    if (projectType === 'category') {
      // For category pages, include all subprojects
      relatedProjects = projectsByCategory.get(category)
        ?.filter(p => p.data.projectType === 'subproject' && p.data.parentProject?.includes(category))
        .sort((a, b) => (a.data.order || 999) - (b.data.order || 999));
    }

    // For [...slug] routes, the slug parameter should be the string path
    paths.push({
      params: { slug },
      props: {
        project,
        routeConfig,
        relatedProjects,
      },
    });
  });

  return paths;
}

// === NAVIGATION UTILITIES ===

/**
 * Gets the parent category project for a subproject
 */
export function getParentCategory(
  project: CollectionEntry<'projects'>,
  allProjects: CollectionEntry<'projects'>[]
): CollectionEntry<'projects'> | undefined {
  if (project.data.projectType !== 'subproject' || !project.data.parentProject) {
    return undefined;
  }

  return allProjects.find(p =>
    p.data.projectType === 'category' &&
    p.data.category === project.data.category
  );
}

/**
 * Gets all subprojects for a category
 */
export function getSubprojects(
  categoryProject: CollectionEntry<'projects'>,
  allProjects: CollectionEntry<'projects'>[]
): CollectionEntry<'projects'>[] {
  if (categoryProject.data.projectType !== 'category') {
    return [];
  }

  return allProjects
    .filter(p =>
      p.data.projectType === 'subproject' &&
      p.data.category === categoryProject.data.category
    )
    .sort((a, b) => (a.data.order || 999) - (b.data.order || 999));
}

// === VALIDATION UTILITIES ===

/**
 * Validates that all projects have consistent routing configuration
 */
export function validateProjectRouting(projects: CollectionEntry<'projects'>[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const urlSet = new Set<string>();

  projects.forEach(project => {
    const { title, projectType, parentProject, category } = project.data;

    // Check for duplicate URLs
    const url = generateUrl(project);
    if (urlSet.has(url)) {
      errors.push(`Duplicate URL detected: ${url} for project "${title}"`);
    }
    urlSet.add(url);

    // Validate subproject relationships
    if (projectType === 'subproject') {
      if (!parentProject) {
        errors.push(`Subproject "${title}" missing parentProject field`);
      } else {
        const hasParentCategory = projects.some(p =>
          p.data.projectType === 'category' &&
          p.data.category === category
        );

        if (!hasParentCategory) {
          errors.push(`Subproject "${title}" references category "${category}" but no category project exists`);
        }
      }
    }

    // Validate category projects have subprojects
    if (projectType === 'category') {
      const hasSubprojects = projects.some(p =>
        p.data.projectType === 'subproject' &&
        p.data.category === category
      );

      if (!hasSubprojects) {
        console.warn(`Category "${title}" has no subprojects`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

// === BREADCRUMB UTILITIES ===

/**
 * Generates breadcrumb navigation for a project
 */
export interface Breadcrumb {
  label: string;
  url: string;
}

export function generateBreadcrumbs(
  project: CollectionEntry<'projects'>,
  allProjects: CollectionEntry<'projects'>[]
): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Work', url: '/' }
  ];

  const { projectType, category } = project.data;

  if (projectType === 'subproject') {
    const categoryProject = getParentCategory(project, allProjects);
    if (categoryProject) {
      breadcrumbs.push({
        label: categoryProject.data.title,
        url: generateUrl(categoryProject)
      });
    }
  }

  if (projectType !== 'category') {
    breadcrumbs.push({
      label: project.data.title,
      url: generateUrl(project)
    });
  }

  return breadcrumbs;
}