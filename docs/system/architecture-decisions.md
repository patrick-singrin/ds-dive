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

**Atomic Design Classification**: Icons are **Foundation-level Atoms**
- **Rationale**: Icons are fundamental building blocks that cannot be broken down further
- **Usage**: Standalone visual primitives used throughout molecules and organisms
- **Storybook Location**: `Foundation/Icons`
- **Component Hierarchy**: Atoms → Molecules (Button, Blueprint) → Organisms (Alert, Notification)

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
| 006 | CSS Variable Pipeline | ⚠️ Superseded | Enterprise-grade token system |
| 007 | Typography System | ✅ Accepted | Accessible font foundation |
| 008 | Atomic Design Architecture | ✅ Accepted | Component hierarchy and organization |
| 009 | Deployment Strategy | ✅ Accepted | Netlify hosting with optimization |
| 010 | CSS Pipeline Optimization | ✅ Accepted | Fixed spacing tokens and component styling |

---

## ADR-008: Atomic Design Component Architecture

**Date**: 2025-01-15
**Status**: Accepted
**Context**: Need clear component hierarchy and organization strategy for design system scalability
**Decision**: Implement strict Atomic Design methodology with three-tier component architecture

**Atomic Design Structure**:

### **Foundation (Atoms)**
- **Icons** (`<dive-icon>`) - Individual SVG graphics
- **Typography** - Font definitions and text styling  
- **Design Tokens** - CSS variables for colors, spacing, borders
- **Token Pipeline** - Build system and token architecture

**Characteristics**:
- Cannot be broken down further
- Serve as building blocks for molecules
- No complex interactions or business logic
- Highly reusable across the system

### **Molecules** 
- **Blueprint** (`<dive-blueprint>`) - Button-like interactive element
- **Planned**: Button, Label, Chip, Input, Badge
- **Definition**: Basic interactive components combining 2-3 atoms

**Characteristics**:
- Combine multiple atoms (icon + text + styling)
- Single responsibility and focused functionality  
- Reusable across different organisms
- Limited complexity and configuration options

### **Organisms**
- **Planned**: Alert, Notification, Card, Modal, Navigation, Header
- **Definition**: Complex components combining multiple molecules and atoms

**Characteristics**:
- Complex functionality and business logic
- Multiple interaction states and behaviors
- Combine several molecules to create meaningful interfaces
- Context-specific and may have specialized use cases

**Storybook Organization**:
```
📁 Introduction
📁 Foundation/
   ├── 🎨 Design Tokens
   ├── 📝 Typography  
   ├── 🔧 Token Pipeline
   └── 🎯 Icons
📁 Molecules/
   ├── 🧩 Blueprint
   ├── 🔲 Button (planned)
   ├── 🏷️ Label (planned)
   └── 🎫 Chip (planned)
📁 Organisms/
   ├── 🚨 Alert (planned)
   ├── 🔔 Notification (planned)
   └── 🃏 Card (planned)
```

**Implementation Guidelines**:

1. **Atoms → Molecules**: Always use foundation atoms in molecule components
   ```typescript
   // ✅ Good: Molecule using atoms
   <dive-icon name="check" color="primary"></dive-icon>
   <span style="color: var(--Color-Primary-Foreground-default)">Save</span>
   ```

2. **Molecules → Organisms**: Combine molecules for complex functionality
   ```typescript
   // ✅ Good: Organism using molecules  
   <dive-button variant="primary">
   <dive-badge count="3">
   <dive-alert type="success">
   ```

3. **Avoid Atom → Organism**: Don't skip the molecule layer
   ```typescript
   // ❌ Bad: Direct atom usage in complex organism
   <complex-form>
     <dive-icon name="user">  <!-- Should use input molecule instead -->
   ```

**Rationale**:
- **Scalability**: Clear hierarchy enables systematic component growth
- **Consistency**: Atoms ensure visual and behavioral consistency across molecules/organisms  
- **Maintainability**: Changes to atoms automatically propagate up the hierarchy
- **Developer Experience**: Predictable component architecture reduces learning curve
- **Design System Integrity**: Enforces design token usage and prevents style drift

**Component Development Process**:
1. **Identify Level**: Determine if new component is molecule or organism
2. **Dependency Mapping**: List required atoms/molecules as dependencies
3. **Token Integration**: Use design tokens exclusively, no hardcoded values
4. **Story Creation**: Document in appropriate Storybook section
5. **Testing**: Verify component works in isolation and composition

**Migration Strategy**:
- **Current**: Blueprint moved from "Components" to "Molecules" 
- **Future**: New components categorized during development planning
- **Documentation**: Update ADRs when component hierarchy decisions are made

---

## ADR-009: Deployment Strategy with Netlify

**Date**: 2025-01-15
**Status**: Accepted
**Context**: Need reliable deployment platform for Storybook documentation site
**Decision**: Use Netlify for primary deployment with static site hosting

**Implementation**:
- **Platform**: Netlify for automatic deployment
- **Build Process**: Storybook static site generation
- **Configuration**: `netlify.toml` for build settings and optimization
- **Output**: `storybook-static/` directory with complete documentation site

**Configuration Details**:
```toml
[build]
  command = "npm run build"
  publish = "storybook-static"

[build.environment]
  NODE_VERSION = "18"
```

**Rationale**:
- **Zero Configuration**: Automatic detection of build settings
- **Performance**: Global CDN with optimal caching headers
- **Developer Experience**: Preview deployments for pull requests
- **Reliability**: Enterprise-grade hosting with 99.9% uptime
- **Integration**: Seamless GitHub integration

**Security Headers**:
- Content Security Policy optimization
- XSS protection and frame options
- Optimal caching for static assets (fonts, CSS, JS)

**Consequences**:
- **Positive**: Fast deployment, excellent performance, preview builds
- **Negative**: Vendor lock-in, potential costs for high usage
- **Mitigation**: Build output works on any static hosting platform

**Alternative Platforms Considered**:
- **Vercel**: Similar features, chose Netlify for better Storybook optimization
- **GitHub Pages**: Free but limited features and slower builds
- **AWS S3**: More complex setup, unnecessary for documentation site

---

## ADR-010: CSS Variable Pipeline Optimization and Fixes

**Date**: 2025-01-30  
**Status**: Accepted  
**Context**: Blueprint Component Styling Issues Resolution  
**Decision**: Implement comprehensive fixes to the CSS Variable Pipeline to resolve styling issues and ensure proper token-to-CSS generation

### Problem Statement
The CSS Variable Pipeline had multiple issues preventing proper component styling:

1. **Spacing Token Mismatch**: Generated CSS values didn't match Figma specifications
2. **Font Integration Gap**: Font faces defined but CSS variables missing  
3. **Build Script Issues**: Generating imports to non-existent files
4. **Component Integration**: Components not properly using design tokens

### Implementation Strategy

#### 1. Token Mapping Correction
**Source**: `src/tokens/data/layouts/layout.json`

**Fixed Mapping Logic**:
```json
// Figma: 2, 4, 8, 10, 12, 16px
// Before: Space.0, Space.6, Space.8, Space.10, Space.11, Space.12  
// After: Space.1, Space.2, Space.3, Space.4, Space.5, Space.6

"Spacing": {
  "0": { "$value": "{Space.1}" },  // 2px
  "1": { "$value": "{Space.2}" },  // 4px  
  "2": { "$value": "{Space.3}" },  // 8px
  "3": { "$value": "{Space.4}" },  // 10px ← Button padding
  "4": { "$value": "{Space.5}" },  // 12px
  "5": { "$value": "{Space.6}" }   // 16px ← Button padding
}
```

#### 2. Font CSS Variable Integration  
**Source**: `src/assets/fonts/fonts.css`

**Added CSS Custom Properties**:
```css
:root {
  --font-family-primary: 'Atkinson Hyperlegible Next', [fallbacks];
  --font-weight-extra-light: 200;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semi-bold: 600;
  --font-weight-bold: 700;
  --font-weight-extra-bold: 800;
}
```

#### 3. Build Script Optimization
**Source**: `scripts/generate-css-variables.ts`

**Fixed Index Generation**:
```typescript
// Removed references to deleted files
const mainIndexContent = `
@import '../../assets/fonts/fonts.css';
@import './dive-theme/index.css';
@import '../../styles/global.css';
`;
```

#### 4. Component Token Usage
**Source**: `src/components/_Blueprint/_Blueprint.ts`

**Design Token Integration**:
```css
:host {
  --blueprint-font-family: var(--font-family-primary, [fallbacks]);
  --blueprint-padding-medium: calc(var(--Spacing-3, 10) * 1px) calc(var(--Spacing-5, 16) * 1px);
  --blueprint-border-radius: calc(var(--border-border-radius-md, 8) * 1px);
}
```

### Consequences

#### Positive
- ✅ **Spacing tokens match Figma exactly** (2, 4, 8, 10, 12, 16px)
- ✅ **Button padding uses proper design tokens** (10px/16px for medium)
- ✅ **Font integration complete** with CSS variables and fallbacks
- ✅ **Build process reliable** - no more broken imports
- ✅ **Components use semantic tokens** exclusively

#### Considerations
- **Build dependency**: Components now require token generation to be run first
- **Calc() usage**: Needed for unitless design tokens (adds slight complexity)
- **Token validation**: Should verify generated values match Figma in future

### Performance Impact
- **Build time**: 13ms for complete token pipeline (1004 variables)
- **CSS size**: Optimized output with no redundant imports
- **Runtime**: No performance impact, CSS variables are native

### Button Padding Specifications
| Size | Top/Bottom | Left/Right | Design Tokens Used |
|------|------------|------------|-------------------|
| Small | 8px | 12px | `Spacing-2` + `Spacing-4` |
| Medium | 10px | 16px | `Spacing-3` + `Spacing-5` |
| Large | 12px | 20px | `Spacing-4` + `Spacing-6` |

### Future Enhancements
1. **Automated validation**: Compare generated tokens against Figma API
2. **Unit handling**: Consider adding units to base tokens to eliminate calc()
3. **Component auditing**: Ensure all components use design tokens exclusively

### Related Decisions
- **ADR-003**: Icon Rendering Strategy  
- **ADR-005**: Icon Usage Guidelines
- **ADR-006**: CSS Variable Pipeline (superseded)
- **ADR-007**: Typography System

### Documentation
- [Issue #012: Blueprint Component Missing Styling](./troubleshooting-guide.md#issue-012)
- [CSS Variable Usage Guide](./CSS_Variable_Usage_Guide.md)

---

## ADR-011: Icon Component Storybook Integration

**Date**: 2025-01-30
**Status**: Accepted
**Context**: Icon component rendering issues in Storybook environment
**Decision**: Implement robust component lifecycle and story configuration patterns for reliable Storybook integration

### Problem Statement
Icon components were experiencing rendering issues specifically in Storybook:
- Icons not appearing despite proper component registration
- Loading states showing indefinitely without transitioning to rendered content
- Component lifecycle not properly triggering in Storybook's rendering context

### Root Cause Analysis

#### Component Lifecycle Issues
- `connectedCallback()` and `updated()` methods not properly handling Storybook's reactive property updates
- Icon loading logic not completing due to async timing issues
- Render method logic not accounting for all state combinations

#### Story Configuration Gaps
- Missing comprehensive args configuration for all component properties
- Incomplete attribute binding in story templates
- Lack of debugging capabilities for development troubleshooting

### Implementation Solution

#### Component Lifecycle Robustness
```typescript
// Ensure icon loading triggers on both initial connection and property changes
connectedCallback() {
  super.connectedCallback();
  if (this.name) {
    this._loadIcon();
  }
}

updated(changedProperties: Map<string | number | symbol, unknown>) {
  super.updated(changedProperties);
  if (changedProperties.has('name')) {
    this._loadIcon();
  }
}

// Comprehensive render state handling
render() {
  if (!this.name) {
    return html`<div class="error-fallback">?</div>`;
  }
  
  if (this.error) {
    return html`<div class="error-fallback">!</div>`;
  }
  
  if (this.loading || !this._svgContent) {
    return html`<div class="icon-container">Loading...</div>`;
  }
  
  return html`
    <div class="icon-container" ...>
      ${unsafeHTML(this._svgContent)}
    </div>
  `;
}
```

#### Complete Story Configuration
```typescript
// Comprehensive argTypes for all component properties
argTypes: {
  name: { control: { type: 'select' }, options: [...] },
  size: { control: { type: 'select' }, options: [...] },
  color: { control: { type: 'select' }, options: [...] },
  interactive: { control: { type: 'boolean' } },
  ariaLabel: { control: { type: 'text' } },
  ariaHidden: { control: { type: 'text' } }
}

// Complete attribute binding in story templates
render: (args) => html`
  <dive-icon
    name="${args.name || 'check'}"
    size="${args.size || 'medium'}"
    color="${args.color || 'base'}"
    ?interactive="${args.interactive || false}"
    aria-label="${args.ariaLabel || undefined}"
    aria-hidden="${args.ariaHidden || undefined}"
  ></dive-icon>
`
```

### Development Methodology

#### Debug-First Approach
1. **Temporary Logging**: Add comprehensive logging during issue investigation
2. **Standalone Testing**: Create isolated HTML test files for component verification
3. **State Inspection**: Monitor component lifecycle and property changes
4. **Production Cleanup**: Remove debug code once issues are resolved

#### Testing Strategy
- Test components in both Storybook and standalone environments
- Verify component registration and lifecycle events
- Validate proper SVG content loading and rendering
- Ensure accessibility attributes work correctly

### Consequences

#### Positive
- ✅ **Reliable Storybook Integration**: Icons render consistently across all stories
- ✅ **Robust Error Handling**: Clear fallback states for debugging
- ✅ **Complete Property Coverage**: All component features accessible in Storybook
- ✅ **Development Efficiency**: Comprehensive debugging methodology established

#### Technical Considerations
- **Lifecycle Complexity**: More robust but slightly more complex component lifecycle
- **Story Maintenance**: Additional argTypes require maintenance when properties change
- **Debug Overhead**: Temporary logging adds development overhead but improves reliability

### Best Practices Established

#### Component Development
1. Always implement comprehensive lifecycle handling for reactive properties
2. Include error states and loading states in render logic
3. Test components outside of Storybook during development
4. Use `ifDefined()` for optional attributes to prevent empty attribute binding

#### Story Development
1. Include all component properties in argTypes for complete testing
2. Use proper Lit HTML attribute binding (`?` for booleans, `${...}` for dynamic values)
3. Provide meaningful default args for immediate usability
4. Document expected behavior in story descriptions

#### Debugging Methodology
1. Add temporary comprehensive logging during issue investigation
2. Create standalone test files for isolation testing
3. Monitor browser console for component lifecycle events
4. Clean up debug code before production builds

### Related Issues
- **Issue #010**: Icons rendering as filled shapes vs strokes
- **Issue #011**: Icons not rendering in Storybook stories (this ADR)
- **ADR-003**: Icon Rendering Strategy
- **ADR-006**: TypeScript Configuration for LitElement

### Future Considerations
1. **Automated Testing**: Add automated tests for Storybook story rendering
2. **Developer Tools**: Consider permanent debug modes for development
3. **Component Templates**: Create standardized templates for new components
4. **Documentation**: Maintain troubleshooting guide with common issues

---

## Next Review Items

1. **Dynamic Icon Loading** - Migration from static to dynamic approach
2. **Component Library Expansion** - Additional semantic components
3. **Performance Optimization** - Bundle size and runtime optimizations
4. **Accessibility Enhancements** - WCAG 2.2 compliance review
5. **Deployment Scaling** - Multi-environment deployment strategy
6. **Storybook Testing** - Automated story rendering verification

---

**Maintained by**: Design System Team  
**Review Cycle**: Quarterly or when major architectural changes are proposed 