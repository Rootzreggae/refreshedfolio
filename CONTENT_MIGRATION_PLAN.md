# Content Migration Plan

## Overview

This migration plan standardizes all project content to use the new ProjectMetadata interface and ensures consistency across the portfolio. The migration maintains backward compatibility while introducing enhanced features.

## Migration Strategy

### Phase 1: Immediate Fixes (Required Fields)
**Priority**: CRITICAL
**Timeline**: Complete before next deployment

#### 1.1 Field Standardization
- [ ] **Replace `duration` with `timeline`** in all projects
- [ ] **Make `role` and `client` required** (add missing values)
- [ ] **Standardize `timeline` format** (use consistent format: "YYYY (duration)" or "YYYY - YYYY")

#### 1.2 File Format Migration
- [ ] **Convert all `.md` files to `.mdx`** to enable story components
- [ ] **Update imports** in converted files

### Phase 2: Enhanced Features (Navigation & Relationships)
**Priority**: HIGH
**Timeline**: 1-2 days after Phase 1

#### 2.1 Project Relationship Mapping
- [ ] **Add `childProjects` to category projects**
- [ ] **Verify `parentProject` references** in subprojects
- [ ] **Update navigation links** between related projects

#### 2.2 Enhanced Metadata
- [ ] **Add missing `thumbnail` images** for project previews
- [ ] **Standardize `heroImageAlt` text** for accessibility
- [ ] **Add `audience` and `narrativeFocus`** fields

### Phase 3: Content Strategy Enhancement (Optional)
**Priority**: MEDIUM
**Timeline**: Future iterations

#### 3.1 SEO & Discovery
- [ ] **Optimize `keywords` arrays** for search
- [ ] **Add `readingTime` estimates**
- [ ] **Enhance `description` fields** for social sharing

#### 3.2 Story Component Migration
- [ ] **Standardize story component usage** across all projects
- [ ] **Add consistent metrics displays**
- [ ] **Implement universal project headers**

## Project-by-Project Migration Checklist

### 1. jungleai-main.md → jungleai-main.mdx
**Status**: Mostly compliant, needs minor updates
- [ ] Convert to `.mdx` format
- [ ] Replace `duration: "2023 (6 months)"` with `timeline: "2023 (6 months)"`
- [ ] Add missing fields: `client: "Jungle AI"`
- [ ] Update story component imports

### 2. grafana-overview.md → grafana-overview.mdx
**Status**: Needs major updates
- [ ] Convert to `.mdx` format
- [ ] Add `childProjects: ["grafana-cloud-onboarding", "grafana-application-observability", "grafana-frontend-observability"]`
- [ ] Replace `duration: "18 months"` with `timeline: "2022-2023 (18 months)"`
- [ ] Add missing `client: "Grafana Labs"`

### 3. grafana-cloud-onboarding.mdx
**Status**: Good compliance, minor fixes needed
- [ ] Replace `duration: "2022 - 2023"` with `timeline: "2022 - 2023"`
- [ ] Verify `parentProject: "grafana-overview"` reference
- [ ] Add `client: "Grafana Labs"` (currently missing)

### 4. keystrok-main.mdx
**Status**: Good compliance, minor standardization
- [ ] Replace `duration: "2025 - Ongoing"` with `timeline: "2025 - Ongoing"`
- [ ] Add `client: "Open Source Community"` (currently missing)
- [ ] Verify story component usage

### 5. opensource-contributing-pt1.mdx
**Status**: Needs updates
- [ ] Replace `duration: "2023 - Present"` with `timeline: "2023 - Present"`
- [ ] Add `client: "Open Source Community"`
- [ ] Add proper parent-child relationships for part 1/2 series

### Additional Projects
- [ ] **grafana-application-observability.mdx** - Apply similar migration
- [ ] **grafana-frontend-observability.mdx** - Apply similar migration
- [ ] **opensource-contributing-pt2.mdx** - Apply similar migration (if exists)

## Migration Validation

### Automated Checks
Create validation script to verify:
- [ ] All required fields are present
- [ ] Field formats match schema requirements
- [ ] Parent-child relationships are bidirectional
- [ ] Hero images have alt text
- [ ] External URLs are valid

### Content Quality Checks
- [ ] Consistent narrative voice across projects
- [ ] Proper use of story components
- [ ] Accessible image descriptions
- [ ] SEO-optimized metadata

## Rollback Plan

### If Issues Arise
1. **Keep backup copies** of original files
2. **Document any breaking changes** discovered
3. **Implement gradual rollout** (migrate 1-2 projects first)
4. **Test build process** after each migration

### Emergency Procedures
- Git branch for migration work: `feature/content-standardization`
- Ability to revert individual files
- Staging environment testing before production

## Post-Migration Validation

### Build Process Testing
- [ ] Verify Astro build succeeds
- [ ] Check TypeScript compilation
- [ ] Test content collection queries
- [ ] Validate generated routes

### Content Display Testing
- [ ] Project preview cards render correctly
- [ ] Navigation between projects works
- [ ] Metrics display consistently
- [ ] Story components function properly

### SEO & Performance
- [ ] Meta tags generate correctly
- [ ] Images load with proper alt text
- [ ] Page load performance maintained
- [ ] Search indexing optimized

## Implementation Script

```bash
#!/bin/bash
# Content Migration Script

# Phase 1: Backup existing content
mkdir -p .backup/content/projects
cp -r src/content/projects/* .backup/content/projects/

# Phase 2: Rename .md files to .mdx
find src/content/projects -name "*.md" -exec sh -c 'mv "$1" "${1%.md}.mdx"' _ {} \;

# Phase 3: Run validation
npm run type-check
npm run build

echo "Migration complete. Review changes before committing."
```

## Timeline Summary

| Phase | Duration | Tasks |
|-------|----------|--------|
| Phase 1 | 1 day | Critical field fixes, format conversion |
| Phase 2 | 1-2 days | Relationships, enhanced metadata |
| Phase 3 | Ongoing | Content strategy improvements |

## Success Metrics

- [ ] All projects build without TypeScript errors
- [ ] Consistent metadata display across all projects
- [ ] Improved navigation between related projects
- [ ] Enhanced SEO performance
- [ ] Better accessibility compliance

## Risk Mitigation

### High-Risk Changes
- File format conversion (.md → .mdx)
- Required field additions
- Schema validation changes

### Mitigation Strategies
- Incremental migration approach
- Comprehensive testing at each step
- Backup and rollback procedures
- Staging environment validation