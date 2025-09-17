# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is **Refreshedfolio**, a personal portfolio website for Nilson Gaspar built with Astro 5 and Tailwind CSS v4. It showcases design work and technical projects with a focus on clean, minimal design and performance.

## Key Technologies & Architecture
- **Framework**: Astro 5 with TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with Vite plugin integration
- **Content Management**: Astro Content Collections with Zod schemas
- **Build Tool**: Vite (via Astro)
- **Package Manager**: npm

### Content Architecture
The project uses Astro's content collections for structured content management:
- **Projects Collection**: Comprehensive schema supporting portfolio projects with metadata like role, technologies, metrics, methodologies, etc.
- **Notes Collection**: Simpler schema for blog-like content
- **Categories**: Projects are organized by category (keystrok, grafana, opensource, jungleai, notes)
- **Project Types**: Supports both 'single' projects and 'category' overview pages

### Layout System
- `BaseLayout.astro`: Main layout with dark mode, view transitions, and SEO meta tags
- `ProjectLayout.astro`: Specialized layout for project content pages
- Global styles in `src/styles/global.css`

## Available Resources & Decision Framework

### MCP Servers (Use for Real-time Information)
- **figma-dev-mode-mcp-server**: Design handoff, token extraction
- **puppeteer**: Testing, screenshots, performance audits
- **gemini-cli**: AI-assisted development and optimization
- **context7**: Project context and codebase analysis

### Specialized Agents (Consult for Domain Expertise)
- **Frontend Expert**: Astro/React optimization, performance, accessibility
- **UX Expert**: Portfolio UX patterns, case study presentation
- **Content Strategist**: Technical writing, storytelling for developers
- **Design System Architect**: Component consistency, design tokens
- **Performance Optimizer**: Core Web Vitals, bundle analysis
- **SEO/Analytics Specialist**: Technical SEO, discoverability

### When to Use Resources
- **Technical implementation** → Frontend Expert + MCP tools
- **User experience decisions** → UX Expert + puppeteer testing
- **Content and storytelling** → Content Strategist + gemini-cli
- **Component architecture** → Design System Architect + context7
- **Performance optimization** → Performance Optimizer + puppeteer
- **SEO improvements** → SEO Specialist + current best practices

## Development Commands
```bash
# Development
npm run dev              # Start dev server at localhost:4321
npm run start           # Alias for dev

# Build & Deploy
npm run build           # Type check + build (runs `astro check && astro build`)
npm run preview         # Preview production build
npm run clean           # Remove dist and .astro folders

# Code Quality
npm run validate        # Run format check + lint + type check
npm run lint            # ESLint check
npm run lint:fix        # ESLint with auto-fix
npm run format          # Format code with Prettier
npm run format:check    # Check formatting without changes
npm run type-check      # Astro check + TypeScript check (noEmit)

# Testing
npm run test            # Currently placeholder (no tests implemented)

# Utilities
npm run screenshot      # Generate screenshots using Puppeteer script
npm run sync            # Sync Astro content types
Code Quality & Standards
Quality Gates

Accessibility: WCAG 2.1 AA compliance minimum
Performance: Core Web Vitals >90 scores
TypeScript: Strict mode, no any types
Testing: Use puppeteer for automated testing

Code Standards

ESLint: Configured with Astro plugin, TypeScript support, and strict rules
Prettier: With Astro and Tailwind CSS plugins for consistent formatting
TypeScript: Strict mode enabled with Astro's strict tsconfig
Component modularity: Reusable story components for case studies

Content Structure
Content lives in src/content/:

projects/: Markdown files for portfolio projects
notes/: Blog-style content
config.ts: Zod schemas defining content structure

Projects support rich metadata including metrics, methodologies, team info, and technical details. The schema is designed for comprehensive case study presentation.
Styling Approach

Dark-first design: Default dark mode with system font stack
Terminal-inspired aesthetic: Clean, minimal, developer-focused
Custom Tailwind config: Extended with brand colors and spacing
Component-scoped styles: Astro's scoped CSS approach
System fonts: Prioritizes SF Pro Display/Mono and system fonts

Decision Making Protocol
Autonomous Decisions (Proceed Independently)

Code formatting and linting fixes
Minor performance optimizations
Accessibility improvements
Bug fixes with clear solutions

Consult Agents For

New component architecture decisions
Significant UX changes
Content strategy questions
Performance trade-offs

Use MCP Tools For

Accessing latest documentation
Validating against current best practices
Real-time testing and auditing
Code analysis and optimization

Development Notes

Portfolio focuses on UX/design work with technical depth
Content is structured for comprehensive project case studies
Performance-oriented with Astro's static generation
Target audience: Technical stakeholders (developers, PMs, designers)
Uses view transitions for smooth navigation
Terminal-inspired aesthetic throughout

Success Metrics

Performance: All Core Web Vitals in green
Accessibility: 100% automated test pass rate
Design: Consistent component usage across pages
Content: Engaging case studies demonstrating design expertise
