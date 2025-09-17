# Story Component Directives System

This document describes the markdown directive system for creating modular, interactive components in your Astro portfolio.

## Overview

The story directive system allows you to use custom markdown syntax to embed rich, interactive components directly in your MDX content. Each directive converts to a corresponding Astro component with full interactivity and styling.

## Available Directives

### 1. Carousel (`:::carousel`)

Creates an image slideshow with navigation controls.

**MDX Syntax:**
```jsx
<CompCarousel 
  title="Design Evolution"
  images={['/images/slide1.jpg', '/images/slide2.jpg', '/images/slide3.jpg']}
  captions={['Caption 1', 'Caption 2', 'Caption 3']}
  height="500px"
/>
```

**Props:**
- `title` (optional): Section title
- `images`: Array of image URLs
- `captions` (optional): Array of captions for each image
- `height` (optional): Custom height (default: 500px)

### 2. Side-by-Side (`:::side-by-side`)

Creates a two-column layout with text content and an image.

**MDX Syntax:**
```jsx
<CompSideBySide 
  image="/images/example.jpg" 
  imageAlt="Alt text"
  imageCaption="Image caption"
  reverse={false}
>
### Your Content Here
Text, lists, and other markdown content goes inside the component.
</CompSideBySide>
```

**Props:**
- `image`: Image URL
- `imageAlt` (optional): Alt text for the image
- `imageCaption` (optional): Caption below the image
- `reverse` (optional): Swap image and content positions

### 3. Expandable (`:::expandable`)

Creates collapsible content sections.

**MDX Syntax:**
```jsx
<CompExpandable title="Technical Details" defaultOpen={false}>
#### Content Title
Your expandable content goes here. Can include markdown formatting.
</CompExpandable>
```

**Props:**
- `title`: Button text to expand/collapse
- `defaultOpen` (optional): Whether to start expanded (default: false)

### 4. Before/After (`:::before-after`)

Interactive comparison slider.

**MDX Syntax:**
```jsx
<CompBeforeAfter 
  beforeLabel="Before" 
  afterLabel="After"
  beforeImage="/images/before.jpg"
  afterImage="/images/after.jpg"
  height="500px"
>
<div slot="before">
  <h3>Before State</h3>
  <p>Description of the before state</p>
</div>

<div slot="after">
  <h3>After State</h3>
  <p>Description of the after state</p>
</div>
</CompBeforeAfter>
```

**Props:**
- `beforeLabel` (optional): Label for before state
- `afterLabel` (optional): Label for after state
- `beforeImage` (optional): Before image URL
- `afterImage` (optional): After image URL
- `height` (optional): Custom height

### 5. Image Grid (`:::image-grid`)

Masonry-style grid layout for multiple images.

**MDX Syntax:**
```jsx
<CompImageGrid 
  columns={4}
  gap="20px"
  images={[
    { src: '/images/1.jpg', alt: 'Image 1', size: 'large' },
    { src: '/images/2.jpg', alt: 'Image 2', size: 'normal' },
    { src: '/images/3.jpg', alt: 'Image 3', size: 'tall' }
  ]}
/>
```

**Props:**
- `images`: Array of image objects with `src`, `alt`, and optional `size`
- `columns` (optional): Number of columns (default: 4)
- `gap` (optional): Gap between images (default: 20px)

**Image sizes:** `normal`, `tall`, `wide`, `large`

### 6. Parallax (`:::parallax`)

Emphasized section breaks with background effects.

**MDX Syntax:**
```jsx
<CompParallax 
  title="Key Insight"
  subtitle="Supporting description text"
  backgroundImage="/images/bg.jpg"
  height="400px"
/>
```

**Props:**
- `title`: Main title text
- `subtitle` (optional): Supporting text
- `backgroundImage` (optional): Background image URL
- `height` (optional): Custom height (default: 400px)

## Usage in MDX Files

1. **Import components** at the top of your MDX file:
```jsx
import CompCarousel from '../../components/story/CompCarousel.astro';
import CompSideBySide from '../../components/story/CompSideBySide.astro';
// ... other imports
```

2. **Use components** directly in your content:
```jsx
<CompCarousel 
  title="My Gallery"
  images={['/img1.jpg', '/img2.jpg']}
/>
```

3. **Mix with markdown** for rich content:
```jsx
<div class="content-block text-block">

## Regular Markdown Section

Your regular markdown content here.

</div>

<CompSideBySide image="/example.jpg">
### Component Content
This supports **markdown** formatting inside components.
</CompSideBySide>
```

## Layout Requirements

Use the `StoryLayout` for pages that include story components:

```astro
---
import { getEntry } from 'astro:content';
import StoryLayout from '../../layouts/StoryLayout.astro';

const project = await getEntry('projects', 'your-project');
const { Content } = await project.render();
---

<StoryLayout project={project}>
  <Content />
</StoryLayout>
```

## Styling

Components inherit styles from:
- `/src/styles/global.css` - Global story component styles
- Individual component styles - Scoped component styling
- Terminal-inspired design system - Dark theme with accent colors

## Image Handling

- Use images in `/public/images/` directory
- Reference as `/images/filename.jpg` (not `./public/images/`)
- Support for various formats: JPG, PNG, WebP, SVG
- Responsive images with `object-fit: cover`
- Lazy loading enabled by default

## Performance Notes

- Components use modern CSS Grid and Flexbox
- JavaScript interactions are scoped to individual components
- Images are lazy-loaded and optimized
- Smooth transitions and hover effects
- Mobile-responsive breakpoints included

## Examples

See `/src/content/projects/keystrok-demo.mdx` for a complete example showcasing all components.

Visit `/test-story` for isolated component testing.