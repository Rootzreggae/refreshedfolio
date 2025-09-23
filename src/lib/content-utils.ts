/**
 * DISABLED: Content Relationship Mapping System
 *
 * This module was designed for content collection projects but has been
 * disabled during migration to Astro page-based project structure.
 * Project relationships are now managed directly within individual pages.
 *
 * This file is temporarily disabled to prevent TypeScript errors during the migration.
 * All functionality has been moved to individual project pages or removed.
 */

// Export empty functions to prevent import errors
export async function getAllProjects() {
  return [];
}

export async function getProjectsByCategory() {
  return [];
}

export async function getFeaturedProjects() {
  return [];
}

export async function getProjectBySlug() {
  return undefined;
}

export async function getProjectNavigation() {
  return null;
}

export function projectToPreview() {
  return {};
}

export async function getRelatedProjects() {
  return [];
}

export function getProjectUrl() {
  return '';
}

export async function validateProjectRelationships() {
  return { valid: true, errors: [], warnings: [] };
}

export async function getProjectTimeline() {
  return [];
}

export async function searchProjects() {
  return [];
}