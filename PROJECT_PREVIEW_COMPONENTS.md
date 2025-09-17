# Universal Project Preview Component Specifications

## Overview

This specification defines standardized components for displaying project information consistently across the portfolio. These components ensure scalable, maintainable, and accessible project presentation.

## Component Architecture

### 1. ProjectCard (Primary Preview Component)

**Purpose**: Main component for displaying project previews in grids, lists, and featured sections.

#### Props Interface
```typescript
interface ProjectCardProps {
  project: ProjectPreview;
  variant?: 'default' | 'featured' | 'compact' | 'minimal';
  showCategory?: boolean;
  showTags?: boolean;
  showMetrics?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}
```

#### Variants

**Default Variant**
- Full project information display
- Medium-sized thumbnail (16:9 aspect ratio)
- Title, description, role, timeline
- Technology tags
- Hover animations and transitions

**Featured Variant**
- Large hero treatment for homepage
- Prominent thumbnail or hero image
- Enhanced typography hierarchy
- Key metrics display
- Call-to-action button

**Compact Variant**
- Minimal information for sidebars
- Small thumbnail (square aspect ratio)
- Title and role only
- Reduced spacing

**Minimal Variant**
- Text-only display for lists
- No thumbnail
- Title, role, timeline
- Clean typography focus

#### Responsive Behavior
- **Desktop**: Full information display
- **Tablet**: Optimized spacing, maintained functionality
- **Mobile**: Stacked layout, essential information only

### 2. ProjectMetadata (Metadata Display Component)

**Purpose**: Consistent display of project metadata across detail pages and previews.

#### Props Interface
```typescript
interface ProjectMetadataProps {
  project: ProjectEntry | ProjectPreview;
  fields?: ('role' | 'timeline' | 'client' | 'technologies' | 'category')[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  variant?: 'full' | 'condensed';
  showLabels?: boolean;
  className?: string;
}
```

#### Display Patterns
- **Role**: Displayed with subtle styling
- **Timeline**: Formatted consistently (e.g., "2023 (6 months)")
- **Client**: Company/organization name
- **Technologies**: Tag-style display with icons
- **Category**: Breadcrumb-style with navigation

### 3. ProjectNavigation (Navigation Component)

**Purpose**: Handles project-to-project navigation and breadcrumbs.

#### Props Interface
```typescript
interface ProjectNavigationProps {
  navigation: ProjectNavigation;
  variant?: 'breadcrumbs' | 'siblings' | 'full';
  showBackButton?: boolean;
  className?: string;
}
```

#### Navigation Types
- **Breadcrumbs**: Home > Category > Project hierarchy
- **Sibling Navigation**: Previous/Next within category
- **Parent-Child**: Category to subprojects
- **Related Projects**: Based on tags and category

### 4. ProjectMetrics (Metrics Display Component)

**Purpose**: Standardized display of project success metrics.

#### Props Interface
```typescript
interface ProjectMetricsProps {
  metrics: MetricsDisplay;
  variant?: 'cards' | 'horizontal' | 'minimal';
  showIcons?: boolean;
  animateOnView?: boolean;
  className?: string;
}
```

#### Metric Types
- **Performance**: Speed improvements, load times
- **User Satisfaction**: Ratings, NPS scores
- **Business Impact**: Conversion rates, adoption
- **Technical**: Error reduction, uptime improvements

## Implementation Guidelines

### 1. Accessibility Standards

#### Required Features
- **Semantic HTML**: Proper heading hierarchy, nav elements
- **ARIA Labels**: Screen reader optimization
- **Keyboard Navigation**: Full tab navigation support
- **Color Contrast**: WCAG 2.1 AA compliance
- **Alt Text**: All images have descriptive alt attributes

#### Focus Management
- Visible focus indicators
- Logical tab order
- Skip links for navigation

### 2. Performance Optimization

#### Image Handling
- **Lazy Loading**: For thumbnails and hero images
- **Responsive Images**: Multiple sizes for different viewports
- **WebP Support**: Modern format with fallbacks
- **Aspect Ratio**: Consistent ratios to prevent layout shift

#### Component Optimization
- **Code Splitting**: Load components as needed
- **Memoization**: Prevent unnecessary re-renders
- **Bundle Size**: Keep components lightweight

### 3. Design System Integration

#### Typography
- Consistent heading hierarchy (h1-h6)
- Body text sizing and line height
- Link styling and hover states

#### Spacing
- Standardized margin and padding scale
- Consistent component spacing
- Responsive spacing adjustments

#### Color System
- Project accent colors for branding
- Consistent hover and active states
- Dark mode support

## Component File Structure

```
src/components/project/
├── ProjectCard.astro           # Main preview component
├── ProjectMetadata.astro       # Metadata display
├── ProjectNavigation.astro     # Navigation elements
├── ProjectMetrics.astro        # Metrics display
├── ProjectThumbnail.astro      # Standardized image component
├── ProjectTags.astro           # Technology/category tags
└── index.ts                    # Component exports
```

## Usage Examples

### Homepage Featured Projects
```astro
---
import { ProjectCard } from '../components/project';
import { getFeaturedProjects } from '../lib/content-utils';

const featured = await getFeaturedProjects();
---

<section class="featured-projects">
  {featured.map(project => (
    <ProjectCard
      project={project}
      variant="featured"
      showCategory={true}
      showMetrics={true}
    />
  ))}
</section>
```

### Project Detail Navigation
```astro
---
import { ProjectNavigation } from '../components/project';
import { getProjectNavigation } from '../lib/content-utils';

const navigation = await getProjectNavigation(Astro.params.slug);
---

<ProjectNavigation
  navigation={navigation}
  variant="full"
  showBackButton={true}
/>
```

### Category Project Grid
```astro
---
import { ProjectCard } from '../components/project';
import { getProjectsByCategory } from '../lib/content-utils';

const projects = await getProjectsByCategory('grafana');
---

<div class="project-grid">
  {projects.map(project => (
    <ProjectCard
      project={project}
      variant="default"
      showTags={true}
      orientation="vertical"
    />
  ))}
</div>
```

## Styling Architecture

### CSS Custom Properties
```css
/* Project component theming */
:root {
  --project-card-radius: 12px;
  --project-card-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  --project-card-hover-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  --project-accent-color: var(--color-primary);
  --project-thumbnail-aspect: 16/9;
}
```

### Component-Specific Styles
- Scoped styling with Astro's CSS scoping
- Utility classes for spacing and layout
- Component variants using CSS custom properties
- Responsive design with container queries

## Quality Assurance

### Testing Requirements
- [ ] **Visual Regression**: Screenshots across viewports
- [ ] **Accessibility**: Screen reader and keyboard testing
- [ ] **Performance**: Lighthouse scores >90
- [ ] **Cross-Browser**: Chrome, Firefox, Safari, Edge

### Content Validation
- [ ] **Required Fields**: All props properly typed
- [ ] **Image Handling**: Proper fallbacks and loading
- [ ] **Navigation**: All links functional
- [ ] **Responsive**: Mobile-first design

## Future Enhancements

### Phase 2 Features
- **Search Integration**: Filter and search within components
- **Animation Library**: Consistent micro-interactions
- **Analytics Integration**: Track component interactions
- **A/B Testing**: Component variant testing

### Advanced Features
- **Dynamic Content**: Real-time project updates
- **Personalization**: User preference-based display
- **Social Sharing**: Integrated sharing buttons
- **Print Styles**: PDF-friendly layouts

## Migration from Existing Components

### Current Story Components
Replace existing story components with standardized versions:
- `CompProjectHeader` → `ProjectCard` (featured variant)
- `CompMetrics` → `ProjectMetrics`
- Custom metadata displays → `ProjectMetadata`

### Backwards Compatibility
- Support existing component props during transition
- Gradual migration path for content
- Fallback styling for legacy components

## Success Metrics

### Technical Metrics
- **Performance**: <100ms component render time
- **Accessibility**: 100% automated test pass rate
- **Bundle Size**: <50kb total component library
- **Browser Support**: 98%+ compatibility

### User Experience Metrics
- **Navigation Success**: >95% task completion
- **Content Discovery**: Improved time-to-relevant-project
- **Mobile Usability**: >90% mobile user satisfaction
- **Page Load**: <3s time to interactive