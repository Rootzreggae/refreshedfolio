import { defineCollection, z } from 'astro:content';

/**
 * Standardized Projects Collection Schema
 *
 * This schema enforces consistency across all portfolio projects
 * and supports the complete ProjectMetadata interface.
 */
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    // === CORE CONTENT FIELDS ===
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),

    // === PROJECT HIERARCHY ===
    category: z.enum(['keystrok', 'grafana', 'opensource', 'jungleai', 'notes']),
    projectType: z.enum(['single', 'category', 'subproject']).default('single'),
    parentProject: z.string().optional(),
    childProjects: z.array(z.string()).default([]),
    order: z.number().default(999),
    slug: z.string().optional(),

    // === VISUAL CONTENT ===
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    thumbnail: z.string().optional(),
    color: z.string().optional(),

    // === EXTERNAL LINKS ===
    url: z.string().url().optional(),
    github: z.string().url().optional(),
    externalLinks: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
      type: z.enum(['demo', 'documentation', 'case-study', 'article']).optional(),
    })).default([]),

    // === PROJECT DETAILS ===
    role: z.string().optional(),
    team: z.array(z.string()).default([]),
    timeline: z.string().optional(), // Replaces 'duration' for consistency
    client: z.string().optional(),
    technologies: z.array(z.string()).default([]),

    // === TECHNICAL DETAILS ===
    architecture: z.string().optional(),
    scale: z.string().optional(),

    // === PROCESS AND METHODOLOGY ===
    methodology: z.enum(['agile', 'design-thinking', 'lean-ux', 'waterfall']).optional(),
    researchMethods: z.array(z.string()).default([]),

    // === RESULTS AND IMPACT ===
    metrics: z.object({
      userSatisfaction: z.string().optional(),
      conversionImprovement: z.string().optional(),
      performanceGains: z.string().optional(),
      adoptionRate: z.string().optional(),
      custom: z.array(z.object({
        label: z.string(),
        value: z.string(),
      })).optional(),
    }).optional(),

    // === COLLABORATION ===
    stakeholders: z.array(z.string()).default([]),
    crossFunctionalTeam: z.boolean().default(false),

    // === CONTENT ORGANIZATION ===
    sections: z.array(z.enum(['problem', 'research', 'design', 'development', 'results', 'learnings'])).default(['problem', 'design', 'results']),

    // === SEO AND DISCOVERY ===
    keywords: z.array(z.string()).default([]),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),

    // === CONTENT STRATEGY ===
    audience: z.array(z.enum(['developers', 'designers', 'product-managers', 'executives', 'general'])).default(['developers', 'designers']),
    narrativeFocus: z.enum(['process', 'results', 'technical', 'collaboration']).optional(),
    readingTime: z.string().optional(),

    // === STORY COMPONENTS ===
    hero: z.object({
      title: z.string(),
      description: z.string(),
      project: z.string().optional(),
      role: z.string().optional(),
      timeline: z.string().optional(),
      status: z.string().optional(),
    }).optional(),

    // === NAVIGATION ===
    footer: z.object({
      backLink: z.string().optional(),
      backText: z.string().optional(),
      nextLink: z.string().optional(),
      nextText: z.string().optional(),
    }).optional(),

    // === BACKWARD COMPATIBILITY ===
    // Keep 'duration' for existing content migration
    duration: z.string().optional(),
  }).refine((data) => {
    // Ensure heroImageAlt is provided when heroImage exists
    if (data.heroImage && !data.heroImageAlt) {
      return false;
    }

    // Ensure parent project exists for subprojects
    if (data.projectType === 'subproject' && !data.parentProject) {
      return false;
    }

    // Ensure category projects have child projects listed
    if (data.projectType === 'category' && data.childProjects.length === 0) {
      console.warn(`Category project "${data.title}" should specify childProjects`);
    }

    return true;
  }, {
    message: "Invalid project configuration",
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  projects,
  notes,
};
