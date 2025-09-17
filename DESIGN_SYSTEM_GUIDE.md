# Design System Implementation Guide

This guide provides comprehensive instructions for using the unified design system in the Refreshedfolio project. The system ensures visual consistency, maintainable code, and scalable component architecture.

## Design Token System

### Core Philosophy

The design system is built on CSS custom properties (design tokens) that provide a single source of truth for all design decisions. This approach ensures consistency and makes theme changes, maintenance, and scaling much easier.

### Token Categories

#### Colors
```css
/* Background Colors */
--color-bg-primary: #1a1a1a     /* Main background */
--color-bg-secondary: #0a0a0a   /* Darker areas */
--color-bg-elevated: #2a2a2a    /* Cards, elevated surfaces */

/* Text Colors */
--color-text-primary: #ffffff    /* Headlines, primary content */
--color-text-secondary: #cccccc  /* Body text */
--color-text-tertiary: #888888   /* Supporting text */
--color-text-quaternary: #666666 /* Muted text, labels */
--color-text-muted: #555555      /* Disabled, very low contrast */

/* Border Colors */
--color-border-primary: #333333   /* Standard dividers */
--color-border-secondary: #1a1a1a /* Subtle dividers */

/* Accent Colors */
--color-accent-primary: #4a9eff   /* Links, CTAs, highlights */
--color-accent-hover: #3d8ae6     /* Hover states */
```

#### Typography Scale
```css
--font-size-xs: 0.75rem     /* 12px - Captions, metadata */
--font-size-sm: 0.875rem    /* 14px - Small text */
--font-size-base: 1rem      /* 16px - Body text */
--font-size-lg: 1.125rem    /* 18px - Large body text */
--font-size-xl: 1.25rem     /* 20px - Subheadings */
--font-size-2xl: 1.5rem     /* 24px - Section headings */
--font-size-4xl: 2rem       /* 32px - Page headings */
--font-size-5xl: 3rem       /* 48px - Hero text */
--font-size-6xl: 4rem       /* 64px - Large hero */
--font-size-7xl: 4.5rem     /* 72px - Extra large hero */
```

#### Spacing Scale
```css
--space-1: 0.25rem   /* 4px - Tight spacing */
--space-2: 0.5rem    /* 8px - Small gaps */
--space-3: 0.75rem   /* 12px - List items */
--space-4: 1rem      /* 16px - Standard spacing */
--space-5: 1.25rem   /* 20px - Paragraph margins */
--space-6: 1.5rem    /* 24px - Section spacing */
--space-8: 2rem      /* 32px - Component spacing */
--space-16: 4rem     /* 64px - Layout spacing */
--space-20: 5rem     /* 80px - Section padding */
--space-32: 8rem     /* 128px - Large section gaps */
```

## Layout System

### UnifiedLayout Component

The `UnifiedLayout` component is the foundation for all pages and consolidates multiple layout patterns:

```astro
---
import UnifiedLayout from '../layouts/UnifiedLayout.astro';
---

<UnifiedLayout
  project={project}
  layout="story"
  containerSize="wide"
  showHeader={true}
  headerLayout="hero"
  navigation={{
    backLink: "/work",
    backText: "Back to Work",
    nextLink: "/work/next-project",
    nextText: "Next Project"
  }}
>
  <!-- Your content here -->
</UnifiedLayout>
```

### Layout Types

#### 1. Project Layout (`layout="project"`)
- **Use for**: Traditional project pages with markdown content
- **Container**: Standard (1200px max-width)
- **Features**: Navigation, header, prose styling

#### 2. Story Layout (`layout="story"`)
- **Use for**: Component-rich storytelling pages
- **Container**: Wide (1400px max-width)
- **Features**: Navigation, hero header, story components

#### 3. Category Layout (`layout="category"`)
- **Use for**: Project listing and overview pages
- **Container**: Standard
- **Features**: Navigation, grid layouts

#### 4. Prose Layout (`layout="prose"`)
- **Use for**: Markdown-heavy content (notes, articles)
- **Container**: Narrow for readability
- **Features**: Typography-focused styling

### Container Sizes

```astro
<!-- Narrow: 640px - For reading content -->
<UnifiedLayout containerSize="narrow">

<!-- Standard: 1200px - Default for most content -->
<UnifiedLayout containerSize="standard">

<!-- Wide: 1400px - For story components, media-rich content -->
<UnifiedLayout containerSize="wide">
```

## Component Library

### Typography Components

Use semantic CSS classes for consistent typography:

```astro
<!-- Hero headlines -->
<h1 class="heading-hero">Building tools at Dynatrace</h1>

<!-- Page titles -->
<h1 class="heading-1">Project Title</h1>

<!-- Section headings -->
<h2 class="heading-2">Section Title</h2>

<!-- Subsection headings -->
<h3 class="heading-3">Subsection</h3>

<!-- Body text variants -->
<p class="body-lg">Large body text for introductions</p>
<p class="body-base">Standard body text</p>
<p class="body-sm">Small supporting text</p>

<!-- Metadata labels -->
<span class="caption">PROJECT</span>
```

### Navigation Component

Unified navigation for headers and footers:

```astro
---
import Navigation from '../components/ui/Navigation.astro';
---

<!-- Header navigation -->
<Navigation
  backLink="/work"
  backText="Back to Work"
  variant="header"
  showDivider={true}
/>

<!-- Footer navigation -->
<Navigation
  backLink="/work"
  backText="All Work"
  nextLink="/work/next"
  nextText="Next Project"
  variant="footer"
  showDivider={true}
/>
```

### Project Header Component

Standardized project headers with metadata:

```astro
---
import ProjectHeader from '../components/ui/ProjectHeader.astro';
---

<ProjectHeader
  title="Project Title"
  subtitle="Brief project description"
  description="Longer project description explaining the context and goals."
  metadata={{
    "Project": "Keystrok",
    "Role": "Product Designer",
    "Timeline": "2023-2024",
    "Technologies": ["React", "TypeScript", "Figma"]
  }}
  layout="hero"
  showDivider={true}
/>
```

### Story Components

#### CompText - Rich Text Content

```astro
---
import CompText from '../components/story/CompText.astro';
---

<!-- Standard text block -->
<CompText>
  <h2>Section Title</h2>
  <p>Your content here with **emphasis** and *italics*.</p>
</CompText>

<!-- Narrow text for better readability -->
<CompText size="narrow">
  <p>Long form reading content.</p>
</CompText>

<!-- Wide text for full-width content -->
<CompText size="wide" spacing="loose">
  <p>Content that needs more space.</p>
</CompText>
```

#### CompImageSingle - Single Images

```astro
---
import CompImageSingle from '../components/story/CompImageSingle.astro';
---

<!-- Standard image -->
<CompImageSingle
  src="/images/project-screenshot.png"
  alt="Project interface screenshot"
  caption="The main dashboard interface"
/>

<!-- Large hero image -->
<CompImageSingle
  src="/images/hero.png"
  alt="Hero image"
  size="large"
  spacing="loose"
  borderRadius="large"
  showBorder={false}
/>

<!-- Small aligned image -->
<CompImageSingle
  src="/images/detail.png"
  alt="Interface detail"
  size="small"
  alignment="left"
  spacing="tight"
/>
```

## Responsive Design Standards

### Breakpoint System

```css
/* Mobile-first approach */
@media (min-width: 640px)  { /* sm: Tablet portrait */ }
@media (min-width: 768px)  { /* md: Tablet landscape */ }
@media (min-width: 1024px) { /* lg: Desktop */ }
@media (min-width: 1280px) { /* xl: Large desktop */ }
```

### Container Behavior

- **Mobile (< 768px)**: 16px horizontal padding
- **Desktop (≥ 768px)**: 64px horizontal padding
- **Layout stacking**: Two-column layouts stack on mobile
- **Text alignment**: Left/right alignments center on mobile

### Typography Scaling

All typography uses `clamp()` for responsive scaling:

```css
/* Example: Hero text scales from 48px to 72px */
font-size: clamp(var(--font-size-5xl), 6vw, var(--font-size-7xl));
```

## When to Use Each Layout

### UnifiedLayout with layout="story"
**Use for:**
- Component-rich case studies
- Visual storytelling projects
- Interactive content
- Projects with custom components

**Features:**
- Wide container (1400px)
- Story component support
- Hero header with metadata
- Flexible navigation

### UnifiedLayout with layout="project"
**Use for:**
- Traditional markdown projects
- Documentation-style content
- Simple project pages
- Blog-style articles

**Features:**
- Standard container (1200px)
- Prose typography
- Standard header
- Clean reading experience

### UnifiedLayout with layout="category"
**Use for:**
- Project listing pages
- Category overviews
- Portfolio grids
- Navigation pages

**Features:**
- Grid layouts
- Card components
- Consistent spacing
- Clear navigation

## Accessibility Requirements

### Color Contrast
- Text on background: 4.5:1 minimum ratio
- Interactive elements: Clear focus states
- Accent colors: Sufficient contrast for links

### Typography
- Minimum 16px body text
- Clear heading hierarchy
- Adequate line spacing (1.5-1.7)
- Readable font weights

### Navigation
- Keyboard accessible
- Screen reader friendly
- Clear focus indicators
- Semantic HTML structure

### Images
- Alt text for all images
- Figcaptions for context
- Lazy loading for performance
- Responsive sizing

## Migration from Legacy Components

### Replacing Old Layouts

```astro
<!-- OLD: ProjectLayout -->
<ProjectLayout project={project}>
  <!-- content -->
</ProjectLayout>

<!-- NEW: UnifiedLayout -->
<UnifiedLayout project={project} layout="project">
  <!-- content -->
</UnifiedLayout>
```

### Updating Story Components

```astro
<!-- OLD: Multiple header components -->
<StoryHeader />
<StoryHero title={title} description={description} />
<CompProjectHeader metadata={metadata} />

<!-- NEW: Single ProjectHeader -->
<ProjectHeader
  title={title}
  description={description}
  metadata={metadata}
  layout="hero"
/>
```

### Styling Migration

```css
/* OLD: Hardcoded values */
.component {
  color: #cccccc;
  font-size: 18px;
  margin: 60px 0;
}

/* NEW: Design tokens */
.component {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  margin: var(--space-16) 0;
}
```

## Performance Considerations

### CSS Custom Properties
- Single source of truth reduces bundle size
- Runtime theming capabilities
- Efficient cascade inheritance

### Component Architecture
- Shared base components reduce duplication
- Semantic HTML for better performance
- Optimized image loading

### Responsive Images
- Use `loading="lazy"` for images below fold
- Provide appropriate alt text
- Consider WebP format for better compression

## Maintenance Guidelines

### Adding New Components
1. Use existing design tokens
2. Follow naming conventions (`comp-*`, `component__element`, `component--modifier`)
3. Include responsive design
4. Add TypeScript interfaces
5. Document component API

### Updating Design Tokens
1. Modify tokens in `src/styles/global.css`
2. Test across all components
3. Update Tailwind config if needed
4. Document breaking changes

### Version Control
- Document component changes
- Maintain backward compatibility when possible
- Use semantic versioning for major updates
- Keep this guide updated with changes

This design system ensures consistency, maintainability, and scalability across the entire portfolio while providing the flexibility needed for diverse storytelling requirements.