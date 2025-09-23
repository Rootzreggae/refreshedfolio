/**
 * DISABLED: Centralized Routing Configuration for Astro Portfolio
 *
 * This module was designed for content collection projects but has been
 * disabled during migration to Astro page-based project structure.
 * Routing is now handled directly by Astro's file-based routing system.
 */

// Export placeholder types and functions to prevent import errors
export type ProjectType = 'single' | 'category' | 'subproject';
export type LayoutType = 'component-case-study' | 'markdown-case-study' | 'project' | 'category' | 'story';

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

export interface Breadcrumb {
  label: string;
  url: string;
}

// Export empty functions to prevent import errors
export function generateSlug(): string {
  return '';
}

export function generateUrl(): string {
  return '';
}

export function getLayoutType(): LayoutType {
  return 'project';
}

export function generateStaticPaths(): Array<any> {
  return [];
}

export function getParentCategory(): undefined {
  return undefined;
}

export function getSubprojects(): Array<any> {
  return [];
}

export function validateProjectRouting(): { valid: boolean; errors: string[] } {
  return { valid: true, errors: [] };
}

export function generateBreadcrumbs(): Breadcrumb[] {
  return [];
}