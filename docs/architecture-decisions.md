# Architecture Decision Records (ADRs)

## Decision Overview
This document tracks major architectural decisions made for the Dive Design System, providing context and rationale for future development.

**Last Updated**: 2025 | **Next Review**: Quarterly

---

## ADR-001: Web Components with LitElement

**Date**: 2024-12-01
**Status**: Accepted
**Context**: Need to choose component technology stack
**Decision**: Use LitElement for Web Components implementation
**Rationale**: 
- Framework agnostic
- Native browser standards
- Shadow DOM encapsulation
- TypeScript support
- Small bundle size

**Consequences**: 
- Components work across any framework
- Requires polyfills for older browsers
- Learning curve for developers new to Web Components

---

## ADR-002: Tabler Icons Integration

**Date**: 2024-12-01  
**Status**: Accepted
**Context**: Need comprehensive icon system
**Decision**: Use Tabler Icons as primary icon library
**Rationale**:
- Comprehensive icon set (4000+ icons)
- Consistent design language  
- SVG-based for scalability
- Open source and actively maintained
- Strong accessibility features

**Consequences**:
- Dependency on external icon library
- Bundle size considerations for large icon sets
- Need for custom loading strategy

---

## ADR-003: Icon Rendering Strategy

**Date**: 2025-01-15
**Status**: Accepted *(Updated)*
**Context**: Icons showing as red exclamation marks in Storybook
**Decision**: Official Tabler Icons SVG content with interim static approach

**Implementation Details**:
- **Current State**: Static map with 15 manually defined icons using official SVG content
- **Available Icons**: check, home, user, heart, star, settings, x, plus, minus, chevron-right, chevron-left, chevron-up, chevron-down, alert-triangle, info-circle
- **Future Plan**: Dynamic loading from @tabler/icons package for unlimited access

**Rationale**:
- Research showed manual SVG paths are not industry standard
- Official package content ensures consistency and updates
- Static approach provides immediate solution while maintaining quality
- Interim solution allows for gradual migration to dynamic loading

**Process for Adding New Icons**:
1. Find icon in @tabler/icons package
2. Copy complete SVG content to `_getIconSvg()` method
3. Test in Storybook
4. Update available icons list in documentation

**Migration Path**:
```typescript
// Future implementation
const iconModule = await import(`@tabler/icons/icons/outline/${iconName}.svg?raw`);
```

---

## ADR-004: Shadow DOM Usage

**Date**: 2024-12-01
**Status**: Accepted
**Context**: Style encapsulation and CSS isolation
**Decision**: Use Shadow DOM for all components
**Rationale**:
- Prevents CSS conflicts
- Encapsulates component styles
- Better performance through style scoping
- Native browser feature

**Consequences**:
- CSS debugging more complex
- Global styles don't penetrate Shadow DOM
- Requires CSS custom properties for theming

---

## ADR-005: Icon Usage Guidelines

**Date**: 2025-01-15
**Status**: Accepted
**Context**: Standardize icon integration across components
**Decision**: Comprehensive icon usage patterns and guidelines

**Integration Patterns**:
1. **Direct Icon Usage**: `<dive-icon name="check" size="medium" color="primary">`
2. **Component Integration**: Blueprint component uses `<dive-icon>` for consistency
3. **Accessibility Requirements**: 
   - Decorative icons: `aria-hidden="true"`
   - Meaningful icons: `aria-label="descriptive text"`

**Color System Alignment** *(Updated 2025-01-15)*:
- **6 Official Categories**: base, primary, success, warning, error, info
- **Removed**: legacy 'secondary' and 'muted' variants
- **Integration**: Complete alignment with CSS Variable Pipeline system
- **TypeScript Support**: Type-safe color property definitions

**Guidelines**:
- Always use semantic color variants from official 6-category system
- Size icons appropriately for context (small=16px, medium=24px, large=32px, xlarge=48px)
- Provide loading and error states for interactive icons
- Use consistent naming (kebab-case, no .svg extension)

**TypeScript Integration**:
```typescript
type IconName = 'check' | 'home' | 'user' | 'heart' | 'star' | 'settings' | 'x' | 'plus' | 'minus' | 'chevron-right' | 'chevron-left' | 'chevron-up' | 'chevron-down' | 'alert-triangle' | 'info-circle';

type IconColor = 'base' | 'primary' | 'success' | 'warning' | 'error' | 'info';
```

---

## ADR-006: CSS Variable Pipeline Architecture

**Date**: 2025-01-15
**Status**: Accepted
**Context**: Need enterprise-grade design token system with multi-mode support
**Decision**: Implement comprehensive CSS Variable Pipeline following W3C Design Token specification

**System Architecture**:
1. **Token Data Layer**: JSON files in W3C format with cascading hierarchy
2. **Processing Layer**: TypeScript classes for loading, resolving, and formatting
3. **Build Layer**: Advanced CLI with performance monitoring and validation
4. **Output Layer**: Organized CSS files with mode-specific selectors

**Key Features**:
- **1004 total variables** across all modes (251 per mode)
- **6 official color categories**: Base, Primary, Success, Warning, Error, Info
- **4 color modes**: Light, Dark, High Contrast Light, High Contrast Dark
- **Reference system**: `{TokenPath}` syntax with cycle detection
- **Performance**: 14ms build time, 980 cache entries, 100% resolution success

**Cascading Layer Order**:
1. `brand-theme/dive-theme` - Base theme colors and values
2. `color-modes/light-mode` - Light mode overrides  
3. `color-modes/hc-light-mode` - High contrast light mode
4. `color-modes/dark-mode` - Dark mode overrides
5. `color-modes/hc-dark-mode` - High contrast dark mode
6. `components/component` - Semantic component tokens
7. `layouts/layout` - Layout-specific tokens

**Rationale**:
- W3C standards compliance ensures future compatibility
- Cascading system allows flexible theming without duplication
- Type-safe resolution prevents runtime errors
- Performance monitoring enables optimization
- Multi-mode support essential for accessibility compliance

**Variable Naming Convention**:
```
--{Category}-{Subcategory}-{Property}-{State}
```
Examples:
- `--Color-Primary-Background-default`
- `--Color-Base-Foreground-hover` 
- `--border-border-radius-md`
- `--Spacing-3`

**Build Commands**:
- `npm run build:tokens` - Production build
- `npm run build:tokens:dev` - Development with verbose output
- `npm run build:tokens:dry` - Validation only

**Runtime Features**:
- Dynamic mode switching: `switchToMode('dark-mode')`
- Token value access: `getResolvedTokenValue('Color.Primary.Background.default')`
- Custom overrides: `setCustomToken(path, value)`
- Event dispatching for component reactions

---

## ADR-007: Typography System with Atkinson Hyperlegible Next

**Date**: 2025-01-15
**Status**: Accepted
**Context**: Need accessible, comprehensive typography system
**Decision**: Implement Atkinson Hyperlegible Next as primary font family with complete design token integration

**Implementation**:
- **Font Family**: Atkinson Hyperlegible Next (accessibility-focused)
- **Weights**: ExtraLight (200) to ExtraBold (800) with italic variants
- **Font Files**: 14 .woff2 files for optimal performance
- **Design Tokens**: Integrated into CSS variable pipeline
- **Typography Scale**: H1-H6 with semantic sizing

**Features**:
- **Accessibility Optimizations**: Enhanced character distinction, dyslexia support
- **High Contrast Support**: Automatic weight adjustments for HiDPI displays
- **Reduced Motion**: Respects user preference settings
- **Performance**: Optimized loading with font-display: swap

**Token Integration**:
```css
--font-family-primary: 'Atkinson Hyperlegible Next', sans-serif;
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

**Storybook Integration**: Complete typography showcase with live examples

---

## Decision Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|---------|
| 001 | LitElement Web Components | ✅ Accepted | Framework agnostic foundation |
| 002 | Tabler Icons | ✅ Accepted | Comprehensive icon system |
| 003 | Icon Rendering Strategy | ✅ Accepted | 15 icons with official SVG content |
| 004 | Shadow DOM Usage | ✅ Accepted | Style encapsulation |
| 005 | Icon Usage Guidelines | ✅ Accepted | Standardized icon patterns |
| 006 | CSS Variable Pipeline | ✅ Accepted | Enterprise-grade token system |
| 007 | Typography System | ✅ Accepted | Accessible font foundation |

## Next Review Items

1. **Dynamic Icon Loading** - Migration from static to dynamic approach
2. **Component Library Expansion** - Additional semantic components
3. **Performance Optimization** - Bundle size and runtime optimizations
4. **Accessibility Enhancements** - WCAG 2.2 compliance review

---

**Maintained by**: Design System Team  
**Review Cycle**: Quarterly or when major architectural changes are proposed 