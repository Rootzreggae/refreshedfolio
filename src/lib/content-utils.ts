/**
 * Content Relationship Mapping System
 *
 * This module provides utilities for managing project relationships,
 * navigation, and content organization across the portfolio.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { generateUrl } from './routing';
import type { ProjectMetadata, ProjectNavigation, ProjectPreview } from '../types/content';

type ProjectEntry = CollectionEntry<'projects'>;

/**
 * Get all projects with proper sorting and filtering
 */
export async function getAllProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects');

  return projects
    .filter(project => !project.data.draft)
    .sort((a, b) => {
      // Primary sort: category
      if (a.data.category !== b.data.category) {
        return a.data.category.localeCompare(b.data.category);
      }

      // Secondary sort: order within category
      if (a.data.order !== b.data.order) {
        return a.data.order - b.data.order;
      }

      // Tertiary sort: publish date (newest first)
      return new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime();
    });
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(category: ProjectMetadata['category']): Promise<ProjectEntry[]> {
  const allProjects = await getAllProjects();
  return allProjects.filter(project => project.data.category === category);
}

/**
 * Get featured projects for homepage display
 */
export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
  const allProjects = await getAllProjects();
  return allProjects.filter(project => project.data.featured);
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug: string): Promise<ProjectEntry | undefined> {
  const allProjects = await getAllProjects();
  return allProjects.find(project =>
    (project.data.slug || project.slug) === slug
  );
}

/**
 * Build navigation relationships for a project
 */
export async function getProjectNavigation(currentSlug: string): Promise<ProjectNavigation | null> {
  const allProjects = await getAllProjects();
  const current = allProjects.find(p => (p.data.slug || p.slug) === currentSlug);

  if (!current) return null;

  const navigation: ProjectNavigation = {
    current: {
      slug: current.data.slug || current.slug,
      title: current.data.title,
      projectType: current.data.projectType,
    },
    breadcrumbs: [],
  };

  // Build breadcrumbs
  navigation.breadcrumbs.push({
    slug: '/',
    title: 'Home',
  });

  // Add parent to breadcrumbs if it's a subproject
  if (current.data.projectType === 'subproject' && current.data.parentProject) {
    const parent = allProjects.find(p => (p.data.slug || p.slug) === current.data.parentProject);
    if (parent) {
      navigation.parent = {
        slug: parent.data.slug || parent.slug,
        title: parent.data.title,
      };
      navigation.breadcrumbs.push({
        slug: `/work/${parent.data.slug || parent.slug}`,
        title: parent.data.title,
      });
    }
  }

  // Add current to breadcrumbs
  navigation.breadcrumbs.push({
    slug: `/work/${current.data.slug || current.slug}`,
    title: current.data.title,
  });

  // Get children for category projects
  if (current.data.projectType === 'category') {
    const children = allProjects
      .filter(p => p.data.parentProject === (current.data.slug || current.slug))
      .map(p => ({
        slug: p.data.slug || p.slug,
        title: p.data.title,
        order: p.data.order,
      }))
      .sort((a, b) => a.order - b.order);

    navigation.children = children;
  }

  // Get siblings for subprojects
  if (current.data.projectType === 'subproject' && current.data.parentProject) {
    const siblings = allProjects
      .filter(p =>
        p.data.parentProject === current.data.parentProject &&
        (p.data.slug || p.slug) !== currentSlug
      )
      .sort((a, b) => a.data.order - b.data.order);

    const currentIndex = siblings.findIndex(p => (p.data.slug || p.slug) === currentSlug);

    navigation.siblings = {
      prev: currentIndex > 0 ? {
        slug: siblings[currentIndex - 1].data.slug || siblings[currentIndex - 1].slug,
        title: siblings[currentIndex - 1].data.title,
      } : undefined,
      next: currentIndex < siblings.length - 1 ? {
        slug: siblings[currentIndex + 1].data.slug || siblings[currentIndex + 1].slug,
        title: siblings[currentIndex + 1].data.title,
      } : undefined,
    };
  }

  return navigation;
}

/**
 * Convert project entry to preview format
 */
export function projectToPreview(project: ProjectEntry): ProjectPreview {
  return {
    slug: project.data.slug || project.slug,
    title: project.data.title,
    description: project.data.description,
    category: project.data.category,
    projectType: project.data.projectType,
    thumbnail: project.data.thumbnail,
    color: project.data.color,
    role: project.data.role || '',
    timeline: project.data.timeline || project.data.duration || 'Unknown',
    tags: project.data.tags,
    featured: project.data.featured,
    order: project.data.order,
  };
}

/**
 * Get related projects based on tags and category
 */
export async function getRelatedProjects(
  currentSlug: string,
  limit: number = 3
): Promise<ProjectPreview[]> {
  const allProjects = await getAllProjects();
  const current = allProjects.find(p => (p.data.slug || p.slug) === currentSlug);

  if (!current) return [];

  const related = allProjects
    .filter(p => (p.data.slug || p.slug) !== currentSlug)
    .map(project => {
      let score = 0;

      // Same category gets higher score
      if (project.data.category === current.data.category) {
        score += 3;
      }

      // Shared tags increase score
      const sharedTags = project.data.tags.filter(tag =>
        current.data.tags.includes(tag)
      );
      score += sharedTags.length;

      // Same methodology increases score
      if (project.data.methodology === current.data.methodology) {
        score += 1;
      }

      return { project, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => projectToPreview(item.project));

  return related;
}

/**
 * Generate project URL
 */
export function getProjectUrl(project: ProjectEntry | ProjectPreview): string {
  // Use the generateUrl function from routing.ts to ensure consistency
  if ('data' in project) {
    // For ProjectEntry, use the same logic as routing.ts
    return generateUrl(project);
  } else {
    // For ProjectPreview, construct URL from available data
    const { category, projectType, slug } = project;
    switch (projectType) {
      case 'single':
        return `/work/${slug}`;
      case 'category':
        return `/work/${category}`;
      case 'subproject':
        return `/work/${category}/${slug}`;
      default:
        return `/work/${slug}`;
    }
  }
}

/**
 * Validate project relationships
 */
export async function validateProjectRelationships(): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const allProjects = await getAllProjects();
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const project of allProjects) {
    const slug = project.data.slug || project.slug;

    // Check parent project references
    if (project.data.projectType === 'subproject') {
      if (!project.data.parentProject) {
        errors.push(`Subproject "${slug}" missing parentProject field`);
      } else {
        const parent = allProjects.find(p =>
          (p.data.slug || p.slug) === project.data.parentProject
        );
        if (!parent) {
          errors.push(`Subproject "${slug}" references non-existent parent "${project.data.parentProject}"`);
        } else if (parent.data.projectType !== 'category') {
          warnings.push(`Subproject "${slug}" parent "${project.data.parentProject}" is not a category project`);
        }
      }
    }

    // Check child project references
    if (project.data.projectType === 'category' && project.data.childProjects) {
      for (const childSlug of project.data.childProjects) {
        const child = allProjects.find(p => (p.data.slug || p.slug) === childSlug);
        if (!child) {
          errors.push(`Category project "${slug}" references non-existent child "${childSlug}"`);
        } else if (child.data.parentProject !== slug) {
          warnings.push(`Child project "${childSlug}" doesn't reference parent "${slug}"`);
        }
      }
    }

    // Check required fields
    if (!project.data.role) {
      errors.push(`Project "${slug}" missing required field: role`);
    }
    if (!project.data.client) {
      errors.push(`Project "${slug}" missing required field: client`);
    }
    if (!project.data.timeline && !project.data.duration) {
      errors.push(`Project "${slug}" missing timeline/duration field`);
    }

    // Check accessibility
    if (project.data.heroImage && !project.data.heroImageAlt) {
      errors.push(`Project "${slug}" has heroImage but missing heroImageAlt`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get project timeline for chronological display
 */
export async function getProjectTimeline(): Promise<{
  year: number;
  projects: ProjectPreview[];
}[]> {
  const allProjects = await getAllProjects();
  const timelineMap = new Map<number, ProjectPreview[]>();

  for (const project of allProjects) {
    const year = new Date(project.data.publishDate).getFullYear();
    if (!timelineMap.has(year)) {
      timelineMap.set(year, []);
    }
    timelineMap.get(year)!.push(projectToPreview(project));
  }

  return Array.from(timelineMap.entries())
    .map(([year, projects]) => ({ year, projects }))
    .sort((a, b) => b.year - a.year); // Newest first
}

/**
 * Search projects by query
 */
export async function searchProjects(query: string): Promise<ProjectPreview[]> {
  const allProjects = await getAllProjects();
  const searchTerm = query.toLowerCase();

  return allProjects
    .filter(project => {
      const searchableText = [
        project.data.title,
        project.data.description,
        ...project.data.tags,
        ...project.data.technologies,
        project.data.role,
        project.data.client,
      ].join(' ').toLowerCase();

      return searchableText.includes(searchTerm);
    })
    .map(projectToPreview);
}