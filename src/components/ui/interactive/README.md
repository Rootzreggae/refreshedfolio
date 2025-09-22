# Folded Corner Component

A minimalist, performant React component for Astro that creates interactive paper-like folded corners with smooth physics-inspired animations.

## Features

- **Performance Optimized**: 60fps animations using CSS transforms
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation
- **Reduced Motion Support**: Respects `prefers-reduced-motion` settings
- **Physics-Inspired**: Smooth, paper-like animations with elastic bounce-back
- **Highly Customizable**: Configurable size, position, and behavior
- **Terminal Aesthetic**: Matches dark-first, developer-focused design

## Installation

The component requires React and Framer Motion:

```bash
npm install @astrojs/react react react-dom framer-motion
```

Ensure your `astro.config.mjs` includes the React integration:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

## Basic Usage

```astro
---
import { FoldedCorner } from '../components/ui/interactive/FoldedCorner.tsx';
---

<div class="relative bg-bg-elevated p-6 rounded-lg">
  <h2>Your Content</h2>
  <p>This card has an interactive folded corner.</p>

  <FoldedCorner
    client:load
    cornerSize={40}
    position="top-right"
    ariaLabel="Reveal additional information"
  >
    <div>
      <h3>Hidden Content</h3>
      <p>This content is revealed when the corner is unfolded.</p>
    </div>
  </FoldedCorner>
</div>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Content to display when unfolded |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cornerSize` | `number` | `32` | Corner size in pixels |
| `maxUnfold` | `number` | `200` | Maximum unfold distance |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Corner position |
| `onUnfold` | `() => void` | `undefined` | Callback when fully unfolded |
| `onFold` | `() => void` | `undefined` | Callback when returning to folded state |
| `reduceMotion` | `boolean` | `false` | Disable animations |
| `className` | `string` | `''` | Additional CSS classes |
| `ariaLabel` | `string` | `'Interactive folded corner element'` | Accessibility label |

## Positioning

The component supports four corner positions:

- `top-left`: Corner in top-left, opens right and down
- `top-right`: Corner in top-right, opens left and down
- `bottom-left`: Corner in bottom-left, opens right and up
- `bottom-right`: Corner in bottom-right, opens left and up

## Interaction Methods

### Mouse/Touch
- **Hover**: Subtle scale and glow effect
- **Drag**: Smooth physics-based dragging
- **Release**: Snaps to fully unfolded if dragged >60% of maxUnfold distance

### Keyboard
- **Tab**: Focus the corner element
- **Enter/Space**: Toggle between folded and unfolded states
- **Escape**: Return to folded state (when unfolded)

## Accessibility Features

- **Keyboard Navigation**: Full keyboard operability
- **Screen Reader Support**: Proper ARIA labels and role attributes
- **Focus Management**: Clear focus indicators
- **Reduced Motion**: Respects user motion preferences
- **High Contrast**: Uses CSS custom properties for theming

## Performance Optimizations

- **CSS Transforms**: Hardware-accelerated animations
- **Minimal DOM Manipulation**: Efficient re-renders
- **Spring Physics**: Smooth, natural movement
- **Event Debouncing**: Optimized interaction handling
- **Lazy Content**: Content only rendered when needed

## Styling

The component uses the project's design tokens:

```css
/* Colors */
--color-bg-elevated
--color-border-primary
--color-text-primary
--color-accent-primary

/* Spacing */
--space-* variables
```

Custom styling can be applied via the `className` prop or by targeting the component's CSS classes.

## Integration Examples

### Portfolio Card
```astro
<div class="relative bg-bg-elevated rounded-lg p-6">
  <h3>Project Title</h3>
  <p>Brief description...</p>

  <FoldedCorner
    client:load
    position="top-right"
    ariaLabel="View project details"
  >
    <div class="space-y-2">
      <h4>Project Details</h4>
      <ul class="text-sm">
        <li>Duration: 3 months</li>
        <li>Tech: React, TypeScript</li>
        <li>Role: Lead Developer</li>
      </ul>
    </div>
  </FoldedCorner>
</div>
```

### Contact Card
```astro
<div class="relative bg-bg-elevated rounded-lg p-6">
  <h3>Get in Touch</h3>
  <p>Let's discuss your project...</p>

  <FoldedCorner
    client:load
    position="bottom-right"
    cornerSize={48}
    ariaLabel="View contact options"
  >
    <div class="space-y-3">
      <a href="mailto:hello@example.com" class="block text-accent-primary">
        Email: hello@example.com
      </a>
      <a href="tel:+1234567890" class="block text-accent-primary">
        Phone: +1 (234) 567-890
      </a>
    </div>
  </FoldedCorner>
</div>
```

### Multiple Corners
```astro
<div class="relative bg-bg-elevated rounded-lg p-8">
  <h3>Multi-Corner Demo</h3>

  <!-- Top-left: Navigation -->
  <FoldedCorner
    client:load
    position="top-left"
    cornerSize={32}
    ariaLabel="Quick navigation"
  >
    <nav class="space-y-1">
      <a href="/" class="block text-accent-primary">Home</a>
      <a href="/projects" class="block text-accent-primary">Projects</a>
      <a href="/about" class="block text-accent-primary">About</a>
    </nav>
  </FoldedCorner>

  <!-- Top-right: Metadata -->
  <FoldedCorner
    client:load
    position="top-right"
    cornerSize={32}
    ariaLabel="View metadata"
  >
    <div class="text-sm space-y-1">
      <p>Created: 2024</p>
      <p>Updated: Today</p>
      <p>Version: 1.0</p>
    </div>
  </FoldedCorner>
</div>
```

## Browser Support

- **Modern Browsers**: Full support with all animations
- **Reduced Motion**: Graceful degradation with static states
- **Touch Devices**: Full touch interaction support
- **Screen Readers**: Complete accessibility support

## Contributing

When contributing to this component:

1. Maintain accessibility standards
2. Test with keyboard navigation
3. Verify reduced motion support
4. Ensure performance targets are met
5. Follow the existing TypeScript patterns

## Performance Targets

- **Animation Frame Rate**: 60fps
- **Render Time**: <10ms
- **Bundle Size Impact**: <5kb gzipped
- **Memory Usage**: <1MB heap allocation