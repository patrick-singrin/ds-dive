# Troubleshooting Guide & Error Resolution

> **Purpose**: This document captures common issues, errors, and their proven solutions for the Dive Design System. It serves as a diagnostic resource to prevent repeated problem-solving and knowledge loss.

> **Maintenance**: This is a **living document** that must be updated whenever new issues are discovered and resolved. Include error messages, root causes, and step-by-step solutions.

## How to Use This Guide

### For Developers
- **Search by error message** or symptom description
- **Follow diagnostic steps** before implementing solutions
- **Test solutions** in development environment first
- **Update this document** when you discover new issues

### For Troubleshooting
1. **Identify the symptom** (rendering issue, console error, etc.)
2. **Check the relevant section** below
3. **Follow diagnostic steps** to confirm root cause
4. **Apply the documented solution**
5. **Verify the fix** works as expected

---

## 🔍 Quick Diagnostic Checklist

Before diving into specific issues, run these quick checks:

```bash
# 1. Verify Storybook is running properly
npm run storybook
# Should start without errors on http://localhost:6006

# 2. Check browser console for errors
# Open DevTools → Console tab
# Look for red error messages

# 3. Run automatic diagnostics (if available)
# Open browser console in Storybook
# Look for: "🔍 Running Shadow DOM diagnostics..."

# 4. Verify component registration
# In browser console, run:
console.log(customElements.get('dive-blueprint'));
console.log(customElements.get('dive-icon'));
# Should return constructor functions, not undefined
```

---

## 🚨 Critical Issues (System Blocking)

### Issue #001: Components Not Rendering in Canvas View

**Symptoms**:
- Components appear blank in Storybook Canvas view
- Stories load but show empty containers
- Browser console may show custom element errors

**Error Messages**:
```
Uncaught DOMException: Failed to execute 'define' on 'CustomElementRegistry'
dive-icon custom element not registered
```

**Root Cause Analysis**:
1. **Component Registration Timing**: Custom elements not defined before story rendering
2. **Import Dependencies**: Component modules not properly imported
3. **Shadow DOM Issues**: Shadow root content not rendering

**Diagnostic Steps**:
```javascript
// 1. Check component registration
console.log('Blueprint registered:', !!customElements.get('dive-blueprint'));
console.log('Icon registered:', !!customElements.get('dive-icon'));

// 2. Check shadow root access
const component = document.querySelector('dive-blueprint');
console.log('Shadow root:', component?.shadowRoot);

// 3. Check for import errors
console.log('Component modules loaded');
```

**Solution**:
```typescript
// ✅ SOLUTION: Ensure centralized registration in .storybook/setup.ts
import '../src/components/_Blueprint/_Blueprint';
import '../src/components/Icon/Icon';

// Verification function
const EXPECTED_COMPONENTS = ['dive-blueprint', 'dive-icon'] as const;
export function verifyComponentRegistration(): void {
  const unregistered = EXPECTED_COMPONENTS.filter(
    tagName => !customElements.get(tagName)
  );
  if (unregistered.length > 0) {
    console.error('Unregistered components:', unregistered);
  }
}
```

**Prevention**:
- Always import components in `.storybook/setup.ts`
- Use registration verification functions
- Add component import checks in story files

**Related Issues**: #002, #003

---

### Issue #002: Icon SVG Sprites Not Working in Shadow DOM

**Symptoms**:
- Icons not displaying in components
- Empty SVG elements in rendered output
- Console warnings about missing sprites

**Error Messages**:
```
Warning: SVG sprite reference not found: #icon-home
Failed to load resource: #icon-home
```

**Root Cause Analysis**:
Shadow DOM isolation prevents access to external SVG sprite definitions. The `<use href="#icon-name">` pattern fails because:
1. **Shadow Boundary**: External document references don't cross shadow DOM boundaries
2. **Sprite Dependencies**: Icons depend on external SVG sprite sheets
3. **Build System**: No sprite generation in current build pipeline

**Before (Broken Implementation)**:
```typescript
// ❌ BROKEN: External sprite reference
html`
  <svg class="icon">
    <use href="#icon-${this.icon}"></use>
  </svg>
`;
```

**Solution**:
```typescript
// ✅ SOLUTION: Inline SVG with shared path definitions
private _getIconPath(iconName: string): string {
  const iconPaths: Record<string, string> = {
    'home': 'M5 12l-2 0l9 -9l9 9l-2 0l0 7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z',
    'user': 'M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2',
    // ... add all required icons
  };
  return iconPaths[iconName] || '';
}

// Render with inline path
html`
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" 
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="${this._getIconPath(this.icon)}"></path>
  </svg>
`;
```

**Implementation Requirements**:
1. **Shared Icon Definitions**: Both Icon and Blueprint components use same `_getIconPath` method
2. **Proper SVG Attributes**: Include viewBox, stroke properties for Tabler Icons
3. **Fallback Handling**: Return empty string for unknown icons

**Prevention**:
- Use automatic diagnostics to detect sprite references
- Standardize on inline SVG approach across all components
- Create shared icon utilities for consistent implementation

**Related Issues**: #001, #004

---

## ⚠️ Common Warnings (Non-blocking)

### Issue #003: Design Tokens Not Accessible in Shadow DOM

**Symptoms**:
- Components using fallback colors instead of design tokens
- Theming not working properly
- Console warnings about missing CSS custom properties

**Error Messages**:
```
Design Token Missing: --Color-Primary-Primary-Background-default not accessible
Component using fallback values instead of design tokens
```

**Root Cause Analysis**:
CSS custom properties not inherited properly into Shadow DOM due to:
1. **Import Order**: Token CSS not loaded before components
2. **CSS Cascade**: Shadow DOM doesn't inherit global styles
3. **Token Naming**: Incorrect token references in component CSS

**Diagnostic Steps**:
```javascript
// Check token access in component
const component = document.querySelector('dive-blueprint');
const styles = getComputedStyle(component);
const primaryColor = styles.getPropertyValue('--Color-Primary-Primary-Background-default');
console.log('Primary color token:', primaryColor || 'NOT FOUND');
```

**Solution**:
```typescript
// ✅ SOLUTION 1: Ensure proper token import in .storybook/preview.ts
import '../src/tokens/css-vars/index.css';

// ✅ SOLUTION 2: Use fallback values in component CSS
:host {
  background: var(--Color-Primary-Primary-Background-default, #2c72e0);
  color: var(--Color-Primary-Primary-Foreground-default, #ffffff);
}

// ✅ SOLUTION 3: Add development validation
import { validateDesignTokenAccess } from '../src/utils/shadowdom-utils';

connectedCallback() {
  super.connectedCallback();
  if (process.env.NODE_ENV === 'development') {
    validateDesignTokenAccess(this, [
      'Color-Primary-Primary-Background-default',
      'Color-Base-Foreground-default'
    ]);
  }
}
```

**Prevention**:
- Always include fallback values for design tokens
- Use development validation utilities
- Import token CSS before component registration

**Related Issues**: #002, #005

---

### Issue #004: TypeScript Errors in Component Properties

**Symptoms**:
- Build errors during compilation
- Linter warnings about property types
- IDE showing type mismatches

**Error Messages**:
```
Type 'string | undefined' is not assignable to type 'string | null'
Unable to resolve signature of class decorator when called as an expression
Parameter 'svg' implicitly has an 'any' type
```

**Root Cause Analysis**:
1. **LitElement Type Compatibility**: Property types must match base class expectations
2. **Decorator Type Resolution**: @customElement decorator requires specific type signatures
3. **Event Handler Types**: Implicit any types in forEach loops

**Solution**:
```typescript
// ✅ SOLUTION 1: Use correct property types for LitElement
@property({ type: String, attribute: 'aria-label' })
ariaLabel: string | null = null;  // Not string | undefined

// ✅ SOLUTION 2: Explicit type annotations for loops
svgElements.forEach((svg: Element) => {
  svg.setAttribute('aria-hidden', 'true');
});

// ✅ SOLUTION 3: Proper component class structure
@customElement('dive-component')
export class DiveComponent extends LitElement {
  // Properties with correct types
  @property({ type: String, reflect: true })
  variant: 'primary' | 'secondary' = 'primary';
}
```

**Prevention**:
- Follow LitElement property type patterns
- Use explicit type annotations in loops
- Enable strict TypeScript checking

**Related Issues**: #001, #003

---

## 🔧 Development Issues

### Issue #005: Storybook Hot Reload Not Working with Web Components

**Symptoms**:
- Changes to components not reflected without full page reload
- Stories showing stale component versions
- Development workflow interruptions

**Root Cause Analysis**:
Web Components don't hot reload like framework components due to:
1. **Custom Element Registry**: Cannot redefine registered elements
2. **Shadow DOM Persistence**: Shadow root content doesn't update
3. **Module Caching**: ES modules cached by browser

**Solution**:
```typescript
// ✅ SOLUTION: Add development-only re-registration
if (process.env.NODE_ENV === 'development') {
  // Force reload in development
  if (customElements.get('dive-component')) {
    console.warn('Re-registering component for hot reload');
    // Custom logic for development hot reload
  }
}
```

**Workaround**:
1. **Full Page Reload**: Use Ctrl+R/Cmd+R for component changes
2. **Story Switching**: Navigate away and back to story
3. **Development Server**: Restart Storybook for major changes

**Prevention**:
- Structure code to minimize need for hot reload
- Use story controls for testing different states
- Implement development-specific reload utilities

---

### Issue #006: Performance Issues in Storybook Canvas

**Symptoms**:
- Slow story loading times
- Browser lag when switching stories
- High memory usage

**Error Messages**:
```
Shadow DOM Performance: dive-blueprint took 45.67ms to render (>16ms threshold)
Warning: Component render time exceeds 60fps threshold
```

**Root Cause Analysis**:
1. **Excessive Re-rendering**: Components re-rendering unnecessarily
2. **CSS Complexity**: Complex selectors in Shadow DOM styles
3. **Memory Leaks**: Event listeners not properly cleaned up

**Diagnostic Tools**:
```javascript
// Use built-in performance monitoring
import { ShadowDOMPerformanceMonitor } from '../src/utils/shadowdom-diagnostics';

// Track component performance
ShadowDOMPerformanceMonitor.trackRender(element, 'dive-blueprint');
```

**Solution**:
```typescript
// ✅ SOLUTION 1: Optimize component lifecycle
protected shouldUpdate(changedProperties: PropertyValueMap<this>): boolean {
  // Only update for relevant property changes
  return Array.from(changedProperties.keys()).some(prop => 
    ['variant', 'disabled', 'text'].includes(prop as string)
  );
}

// ✅ SOLUTION 2: Clean up event listeners
disconnectedCallback() {
  super.disconnectedCallback();
  // Clean up any external event listeners
  this.removeEventListener('click', this._handleClick);
}

// ✅ SOLUTION 3: Use CSS containment
static styles = css`
  :host {
    contain: layout style paint;
  }
`;
```

**Prevention**:
- Monitor component render times in development
- Use CSS containment for performance isolation
- Implement proper cleanup in component lifecycle

---

### Issue #011: Icons Not Rendering in Storybook Stories

**Symptoms**:
- Icons show in Blueprint component but not in Icon component stories
- Console shows "Icon render called" but no visual output
- Storybook diagnostics show no `dive-icon` components detected
- Path resolution works but icons remain invisible

**Error Messages**:
```
🔍 Icon render called: {name: "check", size: "medium", hasName: true, pathFound: true}
⚠️ Warning: Component not optimized for Storybook Canvas view
```

**Root Cause Analysis**:
**Multi-layer issue requiring systematic elimination**:

1. **Manual Path Approach Limitations**: 
   - Hardcoded SVG paths prone to maintenance issues
   - Missing complete SVG structure from Tabler icons
   - Inconsistent attribute handling vs official package

2. **Font-Size Context Missing**:
   - Icon component used `1em` sizing without font-size context
   - Blueprint works because button provides font-size inheritance
   - Standalone icons have no font-size base → `1em` = 0px

3. **Industry Standard vs Custom Implementation**:
   - Manual SVG path approach not industry standard
   - Official @tabler/icons package provides complete solutions
   - Tree-shaking and TypeScript support missing in custom approach

**Diagnostic Steps**:
```javascript
// 1. Verify component registration
console.log('Icon registered:', !!customElements.get('dive-icon'));

// 2. Check font-size context
const iconElement = document.querySelector('dive-icon');
console.log('Font size:', getComputedStyle(iconElement).fontSize);

// 3. Verify SVG structure
const svg = iconElement.shadowRoot?.querySelector('svg');
console.log('SVG attributes:', {
  fill: svg?.getAttribute('fill'),
  stroke: svg?.getAttribute('stroke'),
  width: svg?.style.width,
  height: svg?.style.height
});

// 4. Compare with working Blueprint
const blueprint = document.querySelector('dive-blueprint');
const blueprintIcon = blueprint?.shadowRoot?.querySelector('.blueprint__icon');
console.log('Blueprint icon styles:', getComputedStyle(blueprintIcon));
```

**Solution (Interim Approach)**:
```typescript
// ✅ SOLUTION: Static map with official @tabler/icons SVG content
// 1. Install official package for reference
npm install @tabler/icons

// 2. Copy official SVG content to component
private async _getIconSvg(iconName: string): Promise<string> {
  // Official Tabler Icons SVG content - copied from package
  const iconSvgs: Record<string, string> = {
    'check': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M5 12l5 5l10 -10" />
            </svg>`,
    // Add all commonly used icons: home, user, heart, star, settings, 
    // x, plus, minus, chevron-right, etc.
  };
  
  return iconSvgs[iconName] || '';
}

// 3. Render with unsafeHTML
render() {
  if (this.error) {
    return html`<div class="error-fallback">!</div>`;
  }

  return html`
    <div class="icon-container">
      ${unsafeHTML(this._svgContent)}
    </div>
  `;
}
```

**Why This Solution Works**:
1. **Official Quality**: Uses exact SVG content from @tabler/icons package
2. **Immediate Fix**: Resolves icon visibility issues without complex setup
3. **No Build Dependencies**: Works without bundler configuration for ?raw imports
4. **Predictable Performance**: No async loading complexity

**Prevention**:
- Use official icon SVG content instead of manual path definitions
- Test components in isolation (not just within other components)  
- Use direct sizing rather than relative units for icon components
- Document current icon limitations and expansion process
- Plan migration to dynamic loading for better scalability

**Future Enhancement**: Migrate to dynamic import approach for unlimited icon access:
```typescript
// Future implementation
const iconModule = await import(`@tabler/icons/icons/outline/${iconName}.svg?raw`);
```

**Related Issues**: 
- Issue #010: CSS/SVG attribute conflicts
- Issue #008: LitElement class field shadowing

---

## 🛠️ Build & Configuration Issues

### Issue #007: Vite Build Errors with Web Components

**Symptoms**:
- Build fails with module resolution errors
- Production build different from development
- Missing dependencies in final bundle

**Error Messages**:
```
Failed to resolve import "@lit/decorators"
Module not found: Can't resolve 'lit'
Build failed: TypeError: Cannot read property 'customElement'
```

**Solution**:
```typescript
// ✅ SOLUTION: Proper Vite configuration in vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['lit'],
      output: {
        globals: {
          lit: 'Lit'
        }
      }
    }
  },
  optimizeDeps: {
    include: ['lit']
  }
});
```

**Prevention**:
- Test builds regularly during development
- Use consistent import patterns
- Configure proper externals for library builds

---

### Issue #008: LitElement Class Field Shadowing Error

**Symptoms**:
- Console errors about properties not triggering updates
- Component properties not reactive to changes
- Properties declared with `@property()` decorator still causing issues

**Error Messages**:
```
The following properties on element dive-icon will not trigger updates as expected because they are set using class fields: name, size, color, loading, error, interactive, ariaLabel, ariaHidden. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.
```

**Root Cause Analysis**:
TypeScript compilation with `useDefineForClassFields: true` (default in ES2022+) causes class field initialization to override LitElement's reactive property descriptors. This happens when:
1. Properties use field initializers (`property = value`)
2. TypeScript target is ES2022 or higher
3. `useDefineForClassFields` is enabled

**Diagnostic Steps**:
```javascript
// Check TypeScript configuration
// In tsconfig.json, look for:
{
  "compilerOptions": {
    "target": "ES2020", // or higher
    "useDefineForClassFields": true // causes the issue even with ES2020
  }
}

// Verify current setting:
grep -A 5 -B 5 "useDefineForClassFields" tsconfig.json
```

**Solution**:
```typescript
// ❌ BROKEN: Field initializers override reactive properties
@customElement('dive-component')
export class DiveComponent extends LitElement {
  @property({ type: String, reflect: true })
  name: string = ''; // This breaks reactivity

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false; // This breaks reactivity
}

// ✅ SOLUTION 1: Fix TypeScript configuration (RECOMMENDED)
// In tsconfig.json:
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": false // Fix for LitElement compatibility
  }
}

// ✅ SOLUTION 2: Remove field initializers, use definite assignment
@customElement('dive-component')
export class DiveComponent extends LitElement {
  @property({ type: String, reflect: true })
  name!: string; // Definite assignment assertion

  @property({ type: Boolean, reflect: true })
  disabled!: boolean;
}

// ✅ SOLUTION 3: Use property descriptor defaults
@customElement('dive-component')
export class DiveComponent extends LitElement {
  @property({ type: String, reflect: true })
  name: string = 'medium'; // Keep for non-boolean types if needed

  @property({ type: Boolean, reflect: true })
  disabled!: boolean; // Remove initializer for booleans
}

// ✅ SOLUTION 4: Ensure proper types for ARIA attributes
@property({ type: String, attribute: 'aria-label' })
ariaLabel: string | null = null; // Use string | null, not string | undefined

@property({ type: String, attribute: 'aria-hidden' })
ariaHidden: string | null = null; // Use string for boolean attributes
```

**Implementation Requirements**:
1. **PRIMARY FIX**: Set `useDefineForClassFields: false` in tsconfig.json
2. **ALTERNATIVE**: Remove field initializers for boolean properties  
3. **ALTERNATIVE**: Use definite assignment (`!`) for properties without defaults
4. **ALWAYS**: Use proper ARIA types (`string | null`) for accessibility attributes

**Verification**:
```bash
# Check if configuration fix resolves the issue
grep "useDefineForClassFields" tsconfig.json
# Should show: "useDefineForClassFields": false

# Restart development server after config change
npm run storybook
```

**Prevention**:
- Always configure `useDefineForClassFields: false` for LitElement projects
- Document TypeScript requirements in project README
- Add configuration validation to build process
- Test property reactivity during development

**Related Issues**: #004, #001, ADR-006

---

### Issue #009: Invalid CSS Selector in Diagnostic Tools

**Symptoms**:
- Diagnostic tools throwing SyntaxError
- Console errors about invalid selectors
- Automatic diagnostics failing to run

**Error Messages**:
```
Uncaught (in promise) SyntaxError: Failed to execute 'querySelectorAll' on 'Document': '[data-testid*="component"], dive-*' is not a valid selector.
```

**Root Cause Analysis**:
CSS selector syntax doesn't support glob patterns like `dive-*`. The `*` wildcard must be used within attribute selectors or with specific patterns.

**Solution**:
```typescript
// ❌ BROKEN: Invalid CSS selector syntax
const components = document.querySelectorAll('[data-testid*="component"], dive-*');

// ✅ SOLUTION: Use specific element selectors
const components = document.querySelectorAll('[data-testid*="component"], dive-blueprint, dive-icon');

// ✅ ALTERNATIVE: Use attribute-based selection
const components = document.querySelectorAll('[data-testid*="component"], [class*="dive-"]');

// ✅ ALTERNATIVE: Use tag name patterns
const components = document.querySelectorAll('dive-blueprint, dive-icon, [data-component-type="dive"]');
```

**Prevention**:
- Validate CSS selectors in development
- Use specific element names instead of wildcards
- Test diagnostic tools regularly
- Add CSS selector validation to build process

**Related Issues**: #001, #006

---

### Issue #010: Icons Rendering as Filled Shapes Instead of Outlined Strokes

**Symptoms**:
- Icons appear as solid/filled geometric shapes instead of outlined strokes
- Check icon displays as "triangular plane" instead of proper checkmark
- Icons work correctly in Blueprint component but not in Icon component (or vice versa)
- Visual inconsistency between components using identical icon paths
- Icons use both stroke and fill styling simultaneously

**Error Messages**:
```
No console errors - purely visual rendering issue
Icons render but with incorrect visual appearance
User reports: "check icon looks like a triangular plane"
```

**Root Cause Analysis**:
**CSS fill property overrides SVG fill attribute**: When CSS contains `fill: currentColor`, it overrides the SVG's `fill="none"` attribute, causing icons to render as filled shapes. **Tabler Icons specifically require stroke-based rendering** with `fill="none"` to display as intended outlined icons.

The conflict occurs when:
1. SVG has correct `fill="none" stroke="currentColor"` attributes  
2. CSS has conflicting `fill: currentColor` property
3. CSS specificity causes fill override, breaking outline appearance

**Diagnostic Steps**:
```typescript
// 1. Check SVG attributes in rendered HTML
// ✅ CORRECT: Full Tabler icon attributes
<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

// ❌ INCORRECT: Missing stroke attributes
<svg viewBox="0 0 24 24">

// 2. Check CSS styling conflicts in DevTools
.icon {
  fill: currentColor;  // ❌ This overrides SVG fill="none"
}

.blueprint__icon {
  fill: none;          // ✅ This reinforces SVG attributes
  stroke: currentColor;
}

// 3. Test visual appearance
// Check icon should look like ✓ not ▲
```

**Solution**:

**Step 1: Ensure SVG has proper Tabler attributes**
```typescript
// src/components/Icon/Icon.ts & src/components/_Blueprint/_Blueprint.ts
<svg 
  class="icon"
  viewBox="0 0 24 24"
  fill="none"                    // ← CRITICAL: Prevents filled shapes
  stroke="currentColor"          // ← Uses component's text color
  stroke-width="2"              // ← Standard Tabler thickness
  stroke-linecap="round"        // ← Rounded line endings
  stroke-linejoin="round"       // ← Rounded line joins
>
  <path d="${iconPath}"></path>
</svg>
```

**Step 2: Align CSS styling with SVG attributes**
```typescript
// CSS must reinforce SVG attributes, not override them
static styles = css`
  .icon, .blueprint__icon {
    fill: none;          // ✅ Reinforces SVG fill="none"
    stroke: currentColor; // ✅ Reinforces SVG stroke
    stroke-width: 2;     // ✅ Consistent with SVG
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;
```

**Step 3: Fix existing components**
```typescript
// Icon component - ADD missing SVG attributes
<svg 
  fill="none" stroke="currentColor" stroke-width="2" 
  stroke-linecap="round" stroke-linejoin="round"
>

// Blueprint component - FIX CSS fill override
.blueprint__icon {
  fill: none;                    // ✅ Changed from 'currentColor'
  stroke: currentColor;          // ✅ Added missing stroke styles
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

**Technical Background**:
**Tabler Icons Design Principle**: All Tabler icons are designed as **stroke-based outline icons**. They require specific attributes:
- `fill="none"` - Prevents filled geometric shapes
- `stroke="currentColor"` - Uses parent's text color for icon color
- `stroke-width="2"` - Standard Tabler visual thickness  
- `stroke-linecap/join="round"` - Rounded line style for modern appearance

**Verification**:
```bash
# Test visual appearance after fix
npm run storybook
# Navigate to Icon stories > CommonIcons
# Check icon should display as ✓ outline, not filled triangle
```

**Prevention**:
- **Icon Component Template**: Always include complete Tabler SVG attributes
- **CSS Review**: Ensure CSS reinforces SVG attributes rather than overriding them
- **Component Standards**: Document stroke-based icon requirements for new components
- **Visual Testing**: Include icon appearance in component visual regression tests
- **Code Review**: Check icon styling consistency between components

**Related Issues**: #003 (SVG Sprite Issues), ADR-003 (Icon Rendering Strategy)

---

## 🔄 Automated Diagnostics

### Running Diagnostics

**Automatic (Development)**:
```javascript
// Runs automatically when shadowdom-diagnostics.ts is imported
// Check browser console for:
// "🔍 Running Shadow DOM diagnostics..."
// "✅ Auto-fixed X issues"
```

**Manual (Production/Debugging)**:
```javascript
// In browser console
import { runStorybookDiagnostics } from './src/utils/shadowdom-diagnostics';
runStorybookDiagnostics();
```

### Diagnostic Output Examples

**Healthy System**:
```
🔍 Running Shadow DOM diagnostics...
✅ All components successfully registered
📊 Average render time: 12.34ms (optimal)
🔧 Auto-fixed 0 issues
```

**Issues Detected**:
```
🔍 Running Shadow DOM diagnostics...
❌ Critical Issues: 2
⚠️ Warnings: 3
📊 Average render time: 45.67ms (>16ms threshold)
🔧 Auto-fixing detected issues...
✅ Auto-fixed 2 issues
```

---

## 📋 Issue Reporting Template

When documenting new issues, use this template:

```markdown
### Issue #XXX: [Brief Description]

**Symptoms**:
- [What the user observes]
- [Error behaviors]

**Error Messages**:
```
[Exact error messages from console]
```

**Root Cause Analysis**:
[Why this happens - technical explanation]

**Diagnostic Steps**:
```javascript
// Code to reproduce and diagnose
```

**Solution**:
```typescript
// Working solution code
```

**Prevention**:
- [How to avoid this in the future]

**Related Issues**: [Links to related problems]
```

---

## 🔗 Quick Reference Links

### Critical Files for Troubleshooting
- `.storybook/setup.ts` - Component registration
- `.storybook/preview.ts` - Global configuration
- `src/utils/shadowdom-diagnostics.ts` - Diagnostic tools
- `src/utils/shadowdom-utils.ts` - Utility functions

### Common Commands
```bash
# Restart Storybook
npm run storybook

# Clean build
rm -rf node_modules/.cache
npm run storybook

# Check component registration
# In browser console:
Object.keys(customElements)
```

### Documentation References
- [Architecture Decisions](./architecture-decisions.md)
- [Shadow DOM Specification](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [Lit Documentation](https://lit.dev/docs/)
- [Storybook Web Components](https://storybook.js.org/docs/web-components/get-started/introduction)

---

**Last Updated**: 2025 | **Next Review**: When new issues are discovered  
**Maintenance Note**: Add new issues immediately when discovered and resolved 

### Issue #012: CSS Variable Names with Spaces Causing PostCSS Errors

**Symptoms**:
- Storybook fails to start with PostCSS parsing errors
- Error message: `[postcss] Unknown word Background-default`
- CSS build fails with syntax errors

**Error Messages**:
```
[postcss] postcss-import: component.css:18:21: Unknown word Background-default
--Color-Base-Subtle Background-default: #1d222c;
                    ^
```

**Root Cause Analysis**:
The component token JSON files contain keys with spaces (e.g., `"Subtle Background"`, `"Primary Foreground"`) which were being directly converted to CSS variable names without proper sanitization. CSS variable names cannot contain spaces and must use hyphens instead.

**Diagnostic Steps**:
```bash
# Check generated CSS for invalid variable names
grep "Background-default\|Foreground-default" src/tokens/css-vars/dive-theme/component.css

# Look for spaces in CSS variable names
grep -E "\-\-[a-zA-Z]+ [a-zA-Z]+" src/tokens/css-vars/**/*.css

# Test token generation with dry run
npm run build:tokens:dry
```

**Solution**:
Updated the `toCssVarName()` method in both `CSSFormatter` and `TokenResolver` to properly sanitize token path segments:

```typescript
public static toCssVarName(path: string[]): string {
  const cleanPath = path.map(segment => 
    segment.replace(/\s+/g, '-')  // Replace spaces with hyphens
           .replace(/[^a-zA-Z0-9-_]/g, '-')  // Replace invalid chars
           .replace(/-+/g, '-')  // Replace multiple hyphens with single
           .replace(/^-|-$/g, '')  // Remove leading/trailing hyphens
  );
  return `--${cleanPath.join('-')}`;
}
```

**Fixed Examples**:
- `"Subtle Background"` → `--Color-Base-Subtle-Background-default`
- `"Primary Foreground"` → `--Color-Primary-Primary-Foreground-default`

**Prevention**:
- Token JSON keys should avoid spaces in production systems
- CSS variable name generation should always sanitize input
- Add validation step to detect invalid CSS variable names during build

**Related Issues**: None

---

### Issue #013: CSS Variable Pipeline Setup Complete

**Symptoms**:
- CSS Variable Pipeline is now fully operational
- 1004 variables across all modes working correctly
- Components use semantic tokens exclusively

**System Status**:
✅ **Components**: Icon and Blueprint components use CSS variables only
✅ **Color Categories**: 6 official categories (Base, Primary, Success, Warning, Error, Info)
✅ **Mode Support**: 4 modes (Light, Dark, High Contrast Light, High Contrast Dark)
✅ **CSS Files**: Clean structure with proper mode selectors
✅ **Documentation**: Complete usage guides and architecture documentation

**Generated Files**:
```
src/tokens/css-vars/
├── index.css                    # Main import file
└── dive-theme/
    ├── index.css               # Theme imports
    ├── component.css           # All 4 modes with 251 variables each
    └── layout.css              # Layout tokens for all modes
```

**Performance Metrics**:
- **Processing Time**: 13ms for complete pipeline
- **Variables Generated**: 1,004 total across all modes
- **Files Written**: 4 CSS files + index files
- **Success Rate**: 100% (0 unresolved tokens)
- **Cache Efficiency**: 980 cache entries

**Mode Selectors**:
```css
:root { /* Light mode variables */ }
[data-mode="dark-mode"] { /* Dark mode variables */ }
[data-mode="hc-light-mode"] { /* High contrast light variables */ }
[data-mode="hc-dark-mode"] { /* High contrast dark variables */ }
```

**Next Steps**: System is ready for production use and component development.

--- 