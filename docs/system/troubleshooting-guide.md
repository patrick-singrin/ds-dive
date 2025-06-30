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

### Issue #012: Button Height Inconsistency with Icon Toggle

**Symptoms**:
- Button height changes when toggling `show-icon` property
- Icon container creating incorrect 31px height instead of expected 24px
- Icons not perfectly vertically centered within buttons
- Visual layout jumps when switching between icon+text and text-only states

**User Feedback**:
> "I think we need to refine it a bit the icon is in a container or something creating a height of 31px (the icon should be 24x24px) causing it to be not vertically in the centred. If i set showIcon=false the height of the button changes. I guess that's also caused by the 31px height of the icon container"

**Root Cause Analysis**:
**Icon container inheriting text spacing properties**: The `.button__icon` container was not properly isolated from text-related CSS properties, causing it to adopt font-based line-heights and spacing that exceeded the intended 24px icon dimensions.

**Initial CSS Issues**:
```css
.button__icon {
  flex-shrink: 0;  // ❌ Missing explicit dimensions
  // ❌ No height/width constraints
  // ❌ Inheriting line-height from button text styles
}
```

**User's Key Insight - Figma Design System Approach**:
> "in figma the text has a line-height of 24px ... I guess that's preventing the height change when hiding the icon"

**This was the breakthrough insight**: Instead of CSS workarounds, use Figma's actual **24px line-height specification** to naturally match the **24px icon height**.

**Solution - Figma-Accurate Implementation**:

**Step 1: Use Figma-specified line-heights**
```css
/* Typography from Figma specifications */
--button-line-height: 24px;        /* ✅ Matches icon height exactly */
--button-line-height-small: 20px;  /* ✅ For small buttons */

.button__text {
  line-height: var(--button-line-height); /* 24px from Figma */
}
```

**Step 2: Icon container with exact dimensions**
```css
.button__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;                      /* ✅ Exact icon size */
  height: 24px;                     /* ✅ Exact icon size */
  line-height: 24px;                /* ✅ Match text line-height */
}
```

**Step 3: Size-appropriate scaling**
```css
.button--small .button__icon {
  width: 20px;
  height: 20px;
  line-height: 20px;               /* ✅ Match small button line-height */
}
```

**Why This Approach Works**:
- **Text (24px line-height) = Icon (24px height)** creates natural alignment
- **No CSS hacks required** - follows actual Figma design specifications
- **Size scaling works correctly** for both default and small button variants
- **Design system accuracy** over CSS workarounds

**User Feedback on Solution**:
> "it worked"

**Verification**:
```bash
# Test height consistency
npm run storybook
# Navigate to Button > "Icon vs Text Only (Height Fixed)"
# Toggle show-icon control - height should remain constant
# Buttons with/without icons should have identical height
```

**Prevention**:
- **Follow Figma Specifications**: Use actual design system values rather than CSS approximations
- **Line-height = Icon Height**: Ensure text line-height matches icon dimensions  
- **Size Scaling**: Maintain proportions across size variants
- **Document Figma Values**: Clearly mark temporary CSS variables for future token replacement

**Related Issues**: ADR-011 (Button Component), #011 (Storybook Integration)

---

### Issue #013: Design Token Consistency and CSS Variable Management

**Symptoms**:
- Hardcoded CSS values in components that should use design tokens
- Risk of Figma-Storybook design inconsistencies  
- Temporary CSS variables without clear replacement guidance
- Missing typography tokens from Figma export pipeline

**User Feedback**:
> "Regarding the button and the text. I saw that you created some CSS Variables for the line-height. I don't want to have a mismatch of CSS Variables i Storybook and Figma. So far the problem is that I didn't export the font styles used in Figma. Can you maybe add a comment to replace and remove the css vars you created once we imported the proper text styles"

**Root Cause Analysis**:
**Incomplete design token pipeline**: Typography tokens have not yet been exported from Figma, creating a gap where components need temporary hardcoded values. Without clear documentation, these temporary values risk becoming permanent technical debt.

**Solution - TODO Documentation Pattern**:

**Step 1: Mark temporary variables clearly**
```css
/* TODO: Replace with proper Figma typography tokens once exported */
/* TEMPORARY: These should be replaced with design system typography tokens */
--button-font-size: 16px;                /* TODO: Replace with --Typography-Body-Medium-FontSize */
--button-font-weight: 400;               /* TODO: Replace with --Typography-Body-Medium-FontWeight */
--button-line-height: 24px;              /* TODO: Replace with --Typography-Body-Medium-LineHeight */

/* TODO: Replace with proper Figma small text tokens once exported */
--button-font-size-small: 14px;          /* TODO: Replace with --Typography-Body-Small-FontSize */
--button-line-height-small: 20px;        /* TODO: Replace with --Typography-Body-Small-LineHeight */
```

**Step 2: Create replacement workflow**
```bash
# When typography tokens are exported from Figma:
# 1. Search for: "TODO: Replace with proper Figma typography tokens"
# 2. Replace hardcoded values with proper design tokens
# 3. Remove TODO comments
# 4. Update component documentation
```

**Expected Token Structure** (when exported):
```css
/* Future Figma typography tokens */
--Typography-Body-Medium-FontSize: 16px;
--Typography-Body-Medium-FontWeight: 400;
--Typography-Body-Medium-LineHeight: 24px;
--Typography-Body-Small-FontSize: 14px;
--Typography-Body-Small-LineHeight: 20px;
```

**Prevention**:
- **Clear TODO Markers**: Always document temporary solutions
- **Token Pipeline Planning**: Export typography tokens alongside color tokens
- **Regular Audits**: Search for TODO comments during design system reviews
- **Component Standards**: Require proper token usage before production release

**Related Issues**: #012 (Button Height), CSS_Variable_Usage_Guide.md

---

### Issue #014: Incorrect Icon Implementation from Source

**Symptoms**:
- Icons displaying incorrectly despite using correct icon names
- Visual appearance doesn't match official icon library
- Outline/stroke rendering problems with specific icons
- Icon paths not matching canonical source

**User Feedback**:
> "The scuba-mask icon has a outline problem. I think it's not correctly applied. Check our docs/ and/or the website for this icon: @https://tabler.io/icons/icon/scuba-mask"

**Root Cause Analysis**:
**Incorrect SVG path data**: The scuba-mask icon was implemented with incorrect path data that didn't match the official Tabler Icons source, causing visual rendering problems.

**Comparison Analysis**:

**❌ Incorrect Implementation** (original):
```xml
<path d="M4 7h16v5a8 8 0 0 1 -16 0z" />
<path d="M9 7v-2a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v2" />
<path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
<path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
<path d="M12 18l2 3l2 -3" />
<path d="M4 12l4 2" />
<path d="M20 12l-4 2" />
```

**✅ Correct Implementation** ([Tabler Icons official](https://tabler.io/icons/icon/scuba-mask)):
```xml
<path d="M4 7h12a1 1 0 0 1 1 1v4.5a2.5 2.5 0 0 1 -2.5 2.5h-.5a2 2 0 0 1 -2 -2a2 2 0 1 0 -4 0a2 2 0 0 1 -2 2h-.5a2.5 2.5 0 0 1 -2.5 -2.5v-4.5a1 1 0 0 1 1 -1z" />
<path d="M10 17a2 2 0 0 0 2 2h3.5a5.5 5.5 0 0 0 5.5 -5.5v-9.5" />
```

**Solution Process**:
1. **Reference Official Source**: Always verify icons against [Tabler Icons website](https://tabler.io/icons/icon/scuba-mask)
2. **Copy Exact SVG Code**: Use the official SVG paths without modifications
3. **Maintain Tabler Attributes**: Keep standard stroke properties and class names
4. **Visual Verification**: Test icon appearance in Storybook after implementation

**Prevention Standards**:
- **Icon Verification Workflow**: Always check official Tabler Icons source before implementation
- **Visual Testing**: Include icon appearance in component review process  
- **Source Documentation**: Link to official icon source in code comments
- **Regular Audits**: Periodically verify icon implementations against latest Tabler versions

**Icon Implementation Template**:
```typescript
// Always include source reference
'icon-name': `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24" height="24" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-[name]"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <!-- Copy exact paths from https://tabler.io/icons/icon/[name] -->
</svg>`
```

**Related Issues**: #010 (Icon Rendering), ADR-003 (Icon Strategy)

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

### Issue #014: Netlify Build Failures with Storybook

**Symptoms**:
- Netlify deployment fails with build errors
- Error about missing `public` directory
- Node.js version issues
- Build command returning non-zero exit codes

**Error Messages**:
```
Error: Failed to load static files, no such directory: /opt/build/repo/public
Make sure this directory exists.
Failed during stage 'building site': Build script returned non-zero exit code: 2
```

**Root Cause Analysis**:
1. **Static Directory Configuration**: Storybook configured to look for `../public` directory that may be empty or missing
2. **Node.js Version**: Netlify using unsupported Node.js versions
3. **Build Configuration**: Missing or incorrect Netlify configuration

**Diagnostic Steps**:
```bash
# 1. Check if public directory exists and has content
ls -la public/

# 2. Test build locally
npm run build

# 3. Check Storybook configuration
grep -n "staticDirs" .storybook/main.ts

# 4. Verify build output
ls -la storybook-static/
```

**Solution**:

**Step 1: Create Netlify Configuration**
Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "storybook-static"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/iframe.html"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"

[[headers]]
  for = "*.html"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

**Step 2: Fix Storybook Configuration (if needed)**
In `.storybook/main.ts`, ensure static directory configuration is correct:
```typescript
// Remove if causing issues, or ensure directory exists
// staticDirs: ['../public'],

// Keep minimal configuration for production builds
features: {
  storyStoreV7: true
},
```

**Step 3: Ensure Public Directory**
```bash
# Create public directory with placeholder if needed
mkdir -p public
echo "# Keep this directory in git even when empty" > public/.gitkeep
```

**Prevention**:
- Always include `netlify.toml` for Netlify deployments
- Test builds locally before deploying
- Use stable Node.js versions (18 recommended)
- Ensure all referenced directories exist

**Related Issues**: #007 (Vite Build Errors), #001 (Component Registration)

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

### Issue #012: Blueprint Component Missing Styling (Comprehensive Fix)

**Date**: 2025-01-30  
**Severity**: High  
**Components Affected**: Blueprint component, CSS Variable Pipeline  

### Problem Description
The Blueprint component was displaying without proper styling:
- Missing padding and spacing
- No border radius
- Atkinson Hyperlegible Next font not loading
- Excessive button padding when initially fixed

### Root Cause Analysis
This was a multi-layered issue involving several system components:

1. **Missing Font CSS Variables**: Font faces were defined but not as CSS custom properties
2. **Incorrect Spacing Token Mapping**: JSON token mappings didn't match Figma specifications
3. **CSS Import Errors**: Build script generating incorrect imports to deleted files
4. **Component Implementation**: Blueprint component had CSS override issues

### Investigation Process

#### Step 1: Initial Diagnosis
- **Symptom**: Blueprint component rendered with no padding, border radius, or custom font
- **First Check**: Verified CSS custom properties were being imported correctly
- **Discovery**: Multiple issues beyond simple styling

#### Step 2: Font Integration Issue
- **Problem**: Font faces defined but no CSS variables available
- **Location**: `src/assets/fonts/fonts.css`
- **Missing**: CSS custom properties for font-family tokens

#### Step 3: Spacing Token Pipeline Issue  
- **Problem**: Generated CSS showed wrong spacing values
- **Figma Expected**: 2, 4, 8, 10, 12, 16px
- **Generated Output**: 0, 16, 24, 32, 40, 48px
- **Root Cause**: Incorrect token mapping in `src/tokens/data/layouts/layout.json`

#### Step 4: Build Script CSS Import Issue
- **Problem**: Build script generating imports to deleted CSS files
- **Error**: `@import './brand-theme.css'` (file deleted)
- **Location**: `scripts/generate-css-variables.ts` hardcoded wrong imports

### Complete Fix Implementation

#### Fix 1: Font CSS Variables Integration
**File**: `src/assets/fonts/fonts.css`

Added CSS custom properties after font-face declarations:
```css
/* CSS Custom Properties for Design Token Integration */
:root {
  /* Font Family Tokens */
  --font-family-primary: 'Atkinson Hyperlegible Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Consolas', 'Courier New', monospace;
  
  /* Font Weight Tokens */
  --font-weight-extra-light: 200;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semi-bold: 600;
  --font-weight-bold: 700;
  --font-weight-extra-bold: 800;
  
  /* Line Height and Letter Spacing Tokens */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.6;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
}
```

#### Fix 2: Spacing Token Mapping Correction
**File**: `src/tokens/data/layouts/layout.json`

**Before (Wrong Mapping)**:
```json
"Spacing": {
  "0": { "$type": "number", "$value": "{Space.0}" },    // 0
  "1": { "$type": "number", "$value": "{Space.6}" },    // 16
  "2": { "$type": "number", "$value": "{Space.8}" },    // 24
  "3": { "$type": "number", "$value": "{Space.10}" },   // 32
  "4": { "$type": "number", "$value": "{Space.11}" },   // 40
  "5": { "$type": "number", "$value": "{Space.12}" }    // 48
}
```

**After (Correct Mapping)**:
```json
"Spacing": {
  "0": { "$type": "number", "$value": "{Space.1}" },    // 2
  "1": { "$type": "number", "$value": "{Space.2}" },    // 4
  "2": { "$type": "number", "$value": "{Space.3}" },    // 8
  "3": { "$type": "number", "$value": "{Space.4}" },    // 10
  "4": { "$type": "number", "$value": "{Space.5}" },    // 12
  "5": { "$type": "number", "$value": "{Space.6}" }     // 16
}
```

#### Fix 3: Build Script CSS Import Correction
**File**: `scripts/generate-css-variables.ts`

**Before (Generating Wrong Imports)**:
```typescript
const mainIndexContent = `/* Auto-generated design tokens */
@import '../../assets/fonts/fonts.css';
@import './brand-theme.css';
@import './light-mode.css';
@import './dark-mode.css';
@import './hc-light-mode.css';
@import './hc-dark-mode.css';
@import './dive-theme/index.css';
@import '../../styles/global.css';
`;
```

**After (Correct Imports)**:
```typescript
const mainIndexContent = `/* Auto-generated design tokens */
@import '../../assets/fonts/fonts.css';
@import './dive-theme/index.css';
@import '../../styles/global.css';
`;
```

#### Fix 4: Blueprint Component Styling Updates
**File**: `src/components/_Blueprint/_Blueprint.ts`

**Font Integration**:
```css
/* Typography fallbacks */
--blueprint-font-family: var(--font-family-primary, 'Atkinson Hyperlegible Next', -apple-system, BlinkMacSystemFont, sans-serif);

.blueprint {
  /* Typography */
  font-family: var(--blueprint-font-family);
}
```

**Spacing Token Usage** (Final Values):
```css
/* Spacing tokens - More reasonable button padding */
--blueprint-padding-small: calc(var(--Spacing-2, 8) * 1px) calc(var(--Spacing-4, 12) * 1px);     // 8px 12px
--blueprint-padding-medium: calc(var(--Spacing-3, 10) * 1px) calc(var(--Spacing-5, 16) * 1px);   // 10px 16px
--blueprint-padding-large: calc(var(--Spacing-4, 12) * 1px) calc(var(--Spacing-6, 20) * 1px);    // 12px 20px

--blueprint-gap: calc(var(--Spacing-2, 8) * 1px);
--blueprint-border-radius: calc(var(--border-border-radius-md, 8) * 1px);
```

**Removed CSS Override Issue**:
- Removed `border: none;` that was preventing borders from showing
- Added proper fallback values using `calc()` for unitless design tokens

### Verification Process

#### Step 1: Token Pipeline Verification
```bash
npm run build:tokens
```

**Expected Output**:
- Total Variables: 1004
- Files Written: 4  
- Processing Time: ~13ms
- Unresolved Tokens: 0

**Verified Generated Values**:
```css
:root {
  --Spacing-0: 2;
  --Spacing-1: 4;
  --Spacing-2: 8;
  --Spacing-3: 10;    /* Used for button padding */
  --Spacing-4: 12;
  --Spacing-5: 16;    /* Used for button padding */
}
```

#### Step 2: Storybook Integration Test
```bash
npm run storybook
```

**Expected Results**:
- No CSS import errors
- Blueprint component renders with:
  - Atkinson Hyperlegible Next font
  - Proper padding (10px top/bottom, 16px left/right for medium)
  - 8px border radius
  - All design token colors working

### Final Implementation Details

#### CSS Variable Pipeline Architecture
```
src/tokens/data/brand-theme/dive-theme.json
  └── Space tokens: 0→0, 1→2, 2→4, 3→8, 4→10, 5→12, 6→16...

src/tokens/data/layouts/layout.json  
  └── Spacing mapping: 0→Space.1, 1→Space.2, 2→Space.3...

scripts/generate-css-variables.ts
  └── Processes and generates: css-vars/dive-theme/component.css + layout.css

src/tokens/css-vars/index.css
  └── Imports: fonts.css + dive-theme/index.css + global.css
```

#### Button Padding Specifications
| Size | Top/Bottom | Left/Right | Design Tokens Used |
|------|------------|------------|-------------------|
| Small | 8px | 12px | `Spacing-2` + `Spacing-4` |
| Medium | 10px | 16px | `Spacing-3` + `Spacing-5` |
| Large | 12px | 20px | `Spacing-4` + `Spacing-6` |

### Prevention Measures

1. **Token Mapping Validation**: Always verify generated CSS values match Figma
2. **Build Script Testing**: Test CSS generation after any script changes
3. **Font Integration Checklist**: Ensure both font-faces AND CSS variables are defined
4. **Import Path Verification**: Check that all CSS imports reference existing files

### Related Documentation
- [CSS Variable Usage Guide](./CSS_Variable_Usage_Guide.md)
- [Architecture Decision Records](./architecture-decisions.md) - ADR-003: Icon Rendering Strategy
- [Issue #011: Icons Not Rendering](./troubleshooting-guide.md#issue-011)

---

### Issue #015: Base Type Button Color Mapping Mismatch

**Symptoms**:
- Base type buttons in Storybook don't visually match Figma design reference
- Outline and ghost variants using wrong text color (#242A37 instead of #1D222C)
- Dark background color being incorrectly applied as text color in non-filled variants
- Visual inconsistency between design specification and implementation

**User Feedback**:
> "I just discovered an issue with the type=base variant. see the attached images. The image with the vertically stacked buttons is the figma component. Can we fix the type=base variant in storybook"

**Visual Evidence**:
User provided side-by-side comparison images showing clear color mismatches in base type button matrix between Storybook and Figma reference design.

**Root Cause Analysis**:
**Incorrect Figma token mapping**: Component was creating custom CSS variables and mapping the wrong Figma tokens to the wrong use cases:

1. **Wrong Approach**: Created custom variables like `--button-base-text-default`
2. **Token Misuse**: Used `--Color-Base-Primary-Background-default` (#242A37 dark) for outline button text
3. **Missing Proper Mapping**: Should use `--Color-Base-Foreground-default` (#1D222C light) for outline button text

**Diagnostic Steps**:
```bash
# 1. Compare Storybook vs Figma visually
npm run storybook
# Navigate to Button > Complete Design Matrix
# Compare base type buttons against Figma reference

# 2. Check generated CSS tokens
npm run build:tokens
cat src/tokens/css-vars/dive-theme/component.css | grep "Color-Base"

# 3. Verify token values
# --Color-Base-Foreground-default: #1d222c (correct for outline text)
# --Color-Base-Primary-Background-default: #242a37 (correct for filled bg)
```

**Solution - Use Proper Figma Design Tokens Directly**:

**Before (Custom Variables - Wrong Approach)**:
```css
/* Creating unnecessary custom variables */
--button-base-filled-background-default: var(--Color-Base-Primary-Background-default, #242a37);
--button-base-text-default: var(--Color-Base-Foreground-default, #1d222c);

.button--base.button--outline {
  color: var(--button-base-text-default); /* Extra abstraction layer */
}
```

**After (Direct Figma Tokens - Correct Approach)**:
```css
/* Base filled: Dark background + white text */
.button--base.button--filled {
  background: var(--Color-Base-Primary-Background-default, #242a37);
  color: var(--Color-Base-Primary-Foreground-default, #ffffff);
  border-color: var(--Color-Base-Primary-Background-default, #242a37);
}

/* Base outline/ghost: Light text + transparent background */
.button--base.button--outline,
.button--base.button--ghost {
  background: transparent;
  color: var(--Color-Base-Foreground-default, #1d222c); /* Correct light color */
  border-color: var(--Color-Base-Border-default, #c7cad1);
}
```

**Figma Token Mapping Reference**:

| Use Case | Correct Figma Token | Color Value | Usage |
|----------|-------------------|-------------|-------|
| Base filled background | `--Color-Base-Primary-Background-default` | #242A37 | Dark background |
| Base filled text | `--Color-Base-Primary-Foreground-default` | #FFFFFF | White text on dark |
| Base outline/ghost text | `--Color-Base-Foreground-default` | #1D222C | Light text color |
| Base borders | `--Color-Base-Border-default` | #C7CAD1 | Border color |
| Hover backgrounds | `--Color-Base-Subtle-Background-hover` | #ECEDF0 | Light hover bg |

**Design System Principles Reinforced**:

1. **✅ Use Actual Figma Tokens**: Don't create custom variables when proper tokens exist
2. **✅ Direct Token Mapping**: Map tokens directly to their intended use cases
3. **✅ Design-Code Alignment**: Ensure Storybook perfectly matches Figma specifications
4. **✅ Token Consistency**: Use same naming convention across all components

**User Validation**:
> "is thereb a way to fix the button problem without creating new css variables that don't align with figma. Shouldn't it work out using the variables used in figma in storybook as well?"

User correctly identified that custom variables were against design system principles and insisted on using proper Figma tokens.

**Verification**:
```bash
# Test fixed implementation
npm run storybook
# Navigate to Button > Visual Regression Matrix
# Verify base buttons match Figma design exactly

# Check visual testing
npm run build-storybook
npx chromatic --project-token=<token> # (when configured)
```

**Benefits of Proper Implementation**:
- **🎯 Design System Alignment**: Uses actual Figma tokens, not custom ones
- **🔄 Automatic Updates**: Components automatically stay in sync with Figma changes  
- **📏 Consistency**: Same token naming across all components
- **🔍 Visual Accuracy**: Perfect match to Figma design specifications
- **🚀 Maintainability**: Fewer variables to manage and maintain

**Prevention**:
- **Design Token First**: Always check existing Figma tokens before creating custom ones
- **Visual Testing**: Automated visual regression testing catches design mismatches
- **Code Review**: Verify token usage aligns with design system principles
- **Figma Reference**: Compare components against Figma designs during development

**Related Issues**: ADR-011 (Button Component), #012 (Button Height Consistency), Visual Testing Setup

**Status**: ✅ **Resolved** - Visual testing works via CLI, Storybook builds successfully

---

### Issue #016: Netlify Build Failure - Node.js Version Compatibility 

**Symptoms**:
- Netlify deployment builds fail after adding Chromatic visual testing addon
- Yarn/npm install fails during dependency installation phase
- Build stops before reaching the actual build command

**Error Messages**:
```
error @chromatic-com/storybook@4.0.1: The engine "node" is incompatible with this module. Expected version ">=20.0.0". Got "18.20.8"
error Found incompatible module.
Error during Yarn install
Failing build: Failed to install dependencies
```

**Additional Warning**:
```
warning package-lock.json found. Your project contains lock files generated by tools other than Yarn. It is advised not to mix package managers in order to avoid resolution inconsistencies caused by unsynchronized lock files.
```

**Root Cause Analysis**:
1. **Node Version Mismatch**: Chromatic addon requires Node.js 20+ but Netlify was configured to use Node.js 18
2. **Lock File Conflict**: Both `package-lock.json` and `yarn.lock` existed, causing dependency resolution conflicts
3. **Build Environment**: Netlify build environment wasn't updated to support newer Node requirements

**Diagnostic Steps**:
```bash
# 1. Check current Netlify Node version
cat netlify.toml | grep NODE_VERSION

# 2. Verify Chromatic addon requirements
npm info @chromatic-com/storybook engines

# 3. Check for lock file conflicts
ls -la | grep -E "(package-lock|yarn.lock)"
```

**Solution**:

**Step 1: Update Netlify Node Version**
```toml
# netlify.toml
[build.environment]
  NODE_VERSION = "20"  # Changed from "18"
```

**Step 2: Remove Lock File Conflict**
```bash
# Remove package-lock.json since project uses yarn
rm package-lock.json
```

**Step 3: Verify Build Configuration**
```toml
# netlify.toml
[build]
  command = "npm run build"  # Ensure this matches package.json scripts
  publish = "storybook-static"
```

**Implementation Details**:

**Before (Failing Configuration)**:
```toml
[build.environment]
  NODE_VERSION = "18"  # Too old for Chromatic addon
```

**After (Working Configuration)**:
```toml
[build.environment]
  NODE_VERSION = "20"  # Meets Chromatic requirements
```

**Verification**:
```bash
# 1. Test build locally with Node 20
nvm use 20  # or nvm install 20
npm run build

# 2. Push changes and monitor Netlify build logs
git add netlify.toml
git commit -m "fix: Update Node version to 20 for Chromatic compatibility"
git push

# 3. Check Netlify build console for:
# "Now using node v20.x.x"
# "Installing npm packages using Yarn"
# Successful build completion
```

**Build Process Flow**:
```
1. Netlify detects push to main branch
2. Fetches dependencies from cache
3. Sets Node.js environment to v20.x.x  ✅
4. Runs yarn install (no conflicts)      ✅  
5. Executes npm run build               ✅
6. Publishes storybook-static directory ✅
```

**Package Manager Best Practices**:
- **Stick to One Manager**: Use either npm (package-lock.json) OR yarn (yarn.lock), not both
- **Lock File Consistency**: Keep lock files in version control
- **Clean Dependencies**: Remove conflicting lock files when switching package managers

**Prevention Measures**:
1. **Node Version Monitoring**: Keep track of dependency requirements when adding new packages
2. **Lock File Management**: Choose one package manager and stick with it consistently  
3. **Local Testing**: Test builds with same Node version as production environment
4. **Dependency Auditing**: Check engine requirements before adding new dependencies

**Related Dependencies**:
- `@chromatic-com/storybook@4.0.1`: Requires Node >=20.0.0
- Future Storybook addons may have similar requirements
- Consider Node LTS versions for long-term compatibility

**Status**: ✅ **Fixed** - Netlify now uses Node 20.x for builds, Chromatic addon installs successfully

---

### Issue #017: Storybook Visual Testing Addon Import Resolution ✅ RESOLVED

**Symptoms**:
- Storybook build fails when using `@chromatic-com/storybook` addon
- Manager build errors with import resolution issues during compilation
- Build process stops during manager compilation phase
- Netlify deployments fail after visual testing setup

**Error Messages**:
```
✘ [ERROR] Could not resolve "storybook/manager-api"
✘ [ERROR] Could not resolve "storybook/theming"
Build failed with 2 errors:
node_modules/@chromatic-com/storybook/dist/manager.mjs:4:256: ERROR: Could not resolve "storybook/manager-api"
node_modules/@chromatic-com/storybook/dist/manager.mjs:5:56: ERROR: Could not resolve "storybook/theming"
```

**Root Cause Analysis**:
1. **Package Export Compatibility**: The Visual Tests addon has import issues with current Storybook version
2. **Missing Exports**: Required paths `storybook/manager-api` and `storybook/theming` not exported by current package
3. **ESBuild Failure**: Import resolution failures cause build termination

**Build Process Impact**:
- **Manager Build Phase**: Addon attempts to import from unavailable export paths
- **Compilation Failure**: ESBuild cannot resolve dependencies and stops
- **Deployment Blocking**: Both local and CI/CD builds fail

## ✅ **SOLUTION IMPLEMENTED**: Direct Chromatic CLI Approach

**Step 1: Remove Problematic Addon**
```typescript
// .storybook/main.ts - Updated addons configuration
addons: [
  '@storybook/addon-links',
  '@storybook/addon-essentials', 
  '@storybook/addon-interactions',
  '@storybook/addon-a11y',
  '@storybook/addon-themes',
  '@storybook/addon-viewport',
  '@storybook/addon-measure',
  '@storybook/addon-outline',
  '@storybook/addon-controls',
  '@storybook/addon-docs'
  // Note: @chromatic-com/storybook addon removed due to import resolution issues
  // Visual testing handled via Chromatic CLI in GitHub Actions instead
],
```

**Step 2: Remove Addon Dependency**
```json
// package.json - Clean devDependencies
{
  "devDependencies": {
    // REMOVED: "@chromatic-com/storybook": "^4.0.1",
    "chromatic": "^10.0.0", // Keep CLI version for visual testing
  }
}
```

**Step 3: Update Visual Testing Workflow**
```yaml
# .github/workflows/visual-tests.yml
- name: Run Chromatic Visual Tests
  run: |
    # Use Chromatic CLI directly to avoid addon compatibility issues
    npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }} --exit-zero-on-changes --only-changed --auto-accept-changes main
  env:
    NODE_OPTIONS: --max_old_space_size=4096
    CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

**Verification Steps**:
```bash
# 1. Test Storybook build locally
npm run build  # Should complete without errors

# 2. Verify static files generated
ls storybook-static/  # Should contain built Storybook

# 3. Test visual testing (when token configured)
npm run visual:test  # Uses Chromatic CLI directly
```

**Benefits of CLI Approach**:
- ✅ **No Import Issues**: Bypasses addon compatibility problems completely
- ✅ **Same Functionality**: Full visual testing capabilities maintained  
- ✅ **Better Control**: More CLI options and configuration flexibility
- ✅ **Reliable Builds**: Storybook builds successfully in all environments
- ✅ **Future-Proof**: Less dependent on addon compatibility updates

**Alternative Solutions** (if CLI not preferred):
1. **Wait for Addon Update**: Monitor `@chromatic-com/storybook` for compatibility fixes
2. **Playwright Visual Testing**: Use `@playwright/test` for component visual testing
3. **Argos + Storybook**: Use `@argos-ci/storybook` for visual regression testing

**Prevention Measures**:
1. **Addon Testing**: Test addon compatibility during Storybook upgrades
2. **Build Verification**: Include Storybook build in CI/CD pipeline
3. **Documentation**: Document working configurations for team reference

**Related Issues**: #016 (Netlify Node Version), Visual Testing Setup, Deployment Pipeline

**Status**: ✅ **Resolved** - Visual testing works via CLI, Storybook builds successfully

---

### Related Documentation
- [CSS Variable Usage Guide](./CSS_Variable_Usage_Guide.md)  
- [Visual Testing Setup Guide](./visual-testing-setup.md)
- [Architecture Decision Records](./architecture-decisions.md) - ADR-003: Icon Rendering Strategy
- [Issue #011: Icons Not Rendering](./troubleshooting-guide.md#issue-011)

---

### Issue #018: Icon Button Accessibility and Focus Management

**Symptoms**:
- Icon buttons not announcing properly to screen readers
- Missing or unclear focus indicators
- Click events not triggered by keyboard navigation
- ARIA attributes not working as expected

**Error Messages**:
```
Accessibility violation: Button element is missing an accessible name
Focus trap warning: Element not focusable
Console warning: aria-label should not be empty
```

**Root Cause Analysis**:
Icon buttons without text content need explicit accessibility attributes to be usable by assistive technologies. Common issues include:
1. **Missing ARIA Labels**: Screen readers can't identify the button's purpose
2. **Focus Management**: Custom focus styles may not be clearly visible
3. **Icon-Only Context**: No text content means accessibility depends entirely on attributes

**Solution**:

**Step 1: Always Provide ARIA Labels**
```typescript
// ❌ BROKEN: No accessible name
<dive-icon-button type="primary" icon="save"></dive-icon-button>

// ✅ SOLUTION: Explicit ARIA label
<dive-icon-button 
  type="primary" 
  icon="save" 
  aria-label="Save document"
></dive-icon-button>

// ✅ ALTERNATIVE: Descriptive context
<dive-icon-button 
  type="destructive" 
  icon="delete" 
  aria-label="Delete item permanently"
></dive-icon-button>
```

**Step 2: Verify Focus Ring Visibility**
```css
/* ✅ SOLUTION: Clear focus indicators */
.icon-button:focus-visible {
  outline: none;
  box-shadow: 
    0 0 0 2px var(--Color-Base-Foreground-default, #ffffff), 
    0 0 0 4px var(--focus-ring-color, var(--Color-Primary-Primary-Background-default, #2c72e0));
}

/* ✅ High contrast mode support */
@media (prefers-contrast: high) {
  .icon-button:focus-visible {
    outline: 2px solid ButtonText;
    outline-offset: 2px;
  }
}
```

**Step 3: Keyboard Event Handling**
```typescript
// ✅ SOLUTION: Proper keyboard support is built-in
// The component uses HTML button element which provides:
// - Tab navigation
// - Enter and Space key activation
// - Focus management
// - ARIA semantics

// Verify implementation:
render() {
  return html`
    <button
      class="icon-button icon-button--${this.type} icon-button--${this.variant}"
      ?disabled=${this.disabled}
      aria-label=${this['aria-label'] || this.icon} // Fallback to icon name
      role="button"
      type="button"
    >
      <!-- Icon content -->
    </button>
  `;
}
```

**Step 4: Icon Selection and Context**
```typescript
// ✅ SOLUTION: Choose icons that match actions
const iconMappings = {
  // Primary actions
  'save': 'Save document',
  'check': 'Confirm action', 
  'plus': 'Add new item',
  
  // Navigation
  'chevron-left': 'Previous page',
  'chevron-right': 'Next page',
  'home': 'Go to homepage',
  
  // Destructive actions  
  'delete': 'Delete item permanently',
  'x': 'Cancel or close',
  
  // Settings and tools
  'settings': 'Open settings',
  'edit': 'Edit content',
  'search': 'Search'
};
```

**Implementation Best Practices**:

**Accessibility Checklist**:
- ✅ Every icon button has meaningful `aria-label`
- ✅ Labels describe the action, not the icon
- ✅ Focus rings are clearly visible in all themes
- ✅ Disabled buttons don't receive focus
- ✅ Icon choice matches the action semantics

**Common Label Patterns**:
```typescript
// Action-oriented labels (preferred)
aria-label="Save document"     // Not "Save icon"
aria-label="Delete item"       // Not "Trash can"
aria-label="Edit content"      // Not "Pencil"
aria-label="Go to homepage"    // Not "House icon"

// Context-specific labels
aria-label="Save draft"        // In draft context
aria-label="Save changes"      // In edit context
aria-label="Save as template"  // In template context
```

**Testing Verification**:
```bash
# Screen reader testing
# 1. Navigate with Tab key - should announce purpose clearly
# 2. Test with screen reader (VoiceOver/NVDA) - should read aria-label
# 3. Verify focus rings are visible in high contrast mode

# Automated accessibility testing  
npm run test:a11y  # If configured with @storybook/addon-a11y
```

**Prevention Measures**:
1. **Design Review**: Include accessibility in component design process
2. **Storybook a11y Addon**: Use `@storybook/addon-a11y` for automated testing
3. **Manual Testing**: Test with keyboard navigation and screen readers
4. **Documentation**: Provide clear usage examples with accessibility

**Related Issues**: #008 (Class Field Shadowing), #001 (Property Configuration)

**Status**: 🔧 **Preventable** - Follow accessibility guidelines and test with assistive technologies

---

### Related Documentation
- [CSS Variable Usage Guide](./CSS_Variable_Usage_Guide.md)  
- [Visual Testing Setup Guide](./visual-testing-setup.md)
- [Architecture Decision Records](./architecture-decisions.md) - ADR-003: Icon Rendering Strategy
- [Issue #011: Icons Not Rendering](./troubleshooting-guide.md#issue-011)

--- 

### Issue #019: Icon Outline Error - SVG Fill vs Stroke

**Problem**: Icons render as filled shapes instead of outlined strokes when using incorrect SVG structure.

**Symptoms**:
- Icons appear solid/filled instead of outlined
- Visual difference from design specifications
- Inconsistent with other icon implementations
- May not be caught by automated visual testing

**Error Indicators**:
```
Visual regression: Icon appears filled instead of outlined
Component renders but doesn't match Figma design
```

**Root Cause**: Using simplified SVG path data without proper Tabler Icons attributes:

```typescript
// ❌ WRONG: Simple path only (renders as filled)
const iconPath = 'M8.5 8.5l1 -4.5h5l1 4.5';
return `<svg><path d="${iconPath}"/></svg>`;

// ✅ CORRECT: Complete SVG with proper attributes
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" 
  stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M8.5 8.5l1 -4.5h5l1 4.5"/>
</svg>`;
```

**Solution Steps**:
1. **Use Complete SVG Markup**: Include all Tabler Icons attributes
2. **Set Proper Attributes**: `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`
3. **Import unsafeHTML**: Use `unsafeHTML(iconSvg)` for rendering
4. **Test Visually**: Verify icons appear outlined, not filled

**Prevention**:
- Always copy complete SVG markup from Tabler Icons
- Include comprehensive visual regression testing
- Test icon rendering in all component variants

**Related Issues**: [Issue #011: Icons Not Rendering](#issue-011)

---

### Issue #020: Icon Button Development - AI Agent Workflow Best Practices

**Problem**: Ensuring consistent, high-quality component development using AI agent workflow while avoiding common pitfalls.

**Key Success Factors**:
1. **Follow Component Development Guide**: Use `docs/component-development-guide.md` checklist
2. **Use AI Agent Prompt Template**: Copy from `docs/ai-agent-prompt-template.md`
3. **Proper Figma Analysis**: Extract complete specifications before coding
4. **Direct Token Usage**: Use actual Figma design tokens, not custom variables

**Critical Checklist**:
- ✅ **Documentation Page**: Include `tags: ['autodocs']` in stories
- ✅ **Icon Rendering**: Use complete SVG markup with `fill="none"`, `stroke="currentColor"`
- ✅ **Visual Testing**: Add VisualRegressionMatrix story with multi-mode support
- ✅ **Accessibility**: Include proper ARIA labels and focus management
- ✅ **Token Mapping**: Use actual design tokens directly (no custom CSS variables)

**Component Structure Pattern**:
```typescript
// ✅ Correct approach
@customElement('dive-component-name')
export class DiveComponentName extends LitElement {
  static styles = css`
    :host {
      /* Use Figma tokens directly */
      --component-padding: calc(var(--Spacing-3, 10) * 1px);
    }
    
    .component--primary.component--filled {
      background: var(--Color-Primary-Primary-Background-default, #2c72e0);
      color: var(--Color-Primary-Primary-Foreground-default, #ffffff);
    }
  `;
  
  @property({ type: String, reflect: true })
  type: 'base' | 'primary' | 'destructive' = 'base';
  
  // Include comprehensive accessibility
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;
}
```

**Stories Best Practices**:
```typescript
// ✅ Essential story structure
const meta: Meta = {
  title: 'Components/Component Name',
  component: 'dive-component-name',
  tags: ['autodocs'], // CRITICAL: Generates Documentation page
  // ... other config
};

// ✅ Always include VisualRegressionMatrix for Chromatic
export const VisualRegressionMatrix: Story = {
  parameters: {
    chromatic: {
      modes: {
        light: { theme: 'light' },
        dark: { theme: 'dark' },
        'high-contrast': { theme: 'hc-light' }
      }
    }
  },
  // Complete variant matrix with all types/states
};
```

**Common Pitfalls to Avoid**:
- ❌ Missing `tags: ['autodocs']` → No Documentation page
- ❌ Simple SVG paths → Icons render filled instead of outlined
- ❌ Custom CSS variables → Design system inconsistency
- ❌ Missing visual regression testing → Chromatic gaps
- ❌ Poor accessibility → Screen reader issues

**Verification Steps**:
1. **Build Test**: `npm run build:storybook` succeeds
2. **Documentation**: "Documentation" tab appears in Storybook
3. **Icon Rendering**: Icons appear outlined with proper stroke
4. **Visual Testing**: VisualRegressionMatrix covers all variants
5. **Accessibility**: ARIA labels and keyboard navigation work

**Success Metrics**:
- ✅ Component built in under 2 hours
- ✅ All Figma variants implemented
- ✅ Complete Storybook documentation
- ✅ Comprehensive visual testing coverage
- ✅ WCAG 2.1 AA accessibility compliance

**Related Documentation**:
- [Component Development Guide](./component-development-guide.md)
- [AI Agent Prompt Template](./ai-agent-prompt-template.md)
- [CSS Variable Usage Guide](./CSS_Variable_Usage_Guide.md)

---

### Related Documentation
- [CSS Variable Usage Guide](./CSS_Variable_Usage_Guide.md)  
- [Visual Testing Setup Guide](./visual-testing-setup.md)
- [Architecture Decision Records](./architecture-decisions.md) - ADR-003: Icon Rendering Strategy
- [Issue #011: Icons Not Rendering](./troubleshooting-guide.md#issue-011)

## Issue #019: Icon Button Icons Rendering as Filled Instead of Outlined

### Problem
Icons in the IconButton component were rendering as filled shapes instead of outlined strokes, not matching the Figma design which shows outlined icons.

### Root Cause
The IconButton component was duplicating SVG icon markup instead of using the existing Icon component, leading to:
- Inconsistent SVG structure 
- Missing proper `fill="none"` and `stroke="currentColor"` attributes
- Duplication of icon logic that was already correctly implemented in the Icon component

### Solution
Refactor IconButton to use the existing Icon component:

```typescript
// Before: Custom SVG markup duplication
render() {
  return html`
    <button>
      <div class="icon">
        ${unsafeHTML(this._getIconSvg(this.icon))}
      </div>
    </button>
  `;
}

// After: Use existing Icon component
import '../Icon/Icon.js';

render() {
  return html`
    <button>
      <dive-icon 
        name=${this.icon} 
        size="medium"
        aria-hidden="true"
      ></dive-icon>
    </button>
  `;
}
```

### Benefits of This Approach
- **Consistency**: Uses same icon rendering logic as standalone Icon component
- **Maintainability**: Single source of truth for icon definitions
- **Quality**: Inherits proper SVG structure with outlined strokes
- **DRY Principle**: No code duplication

### Prevention
- Always check if existing components can be reused before creating new implementations
- Review visual testing results carefully - outline vs fill differences should be caught
- Follow design system principles of component composition over duplication

### Testing
Verify fix by checking IconButton stories in Storybook - all icons should render as outlined strokes, not filled shapes.

## Issue #020: Focus Indicators Should Always Use Primary Color

### Problem
Focus indicators across components (Button, IconButton) were using type-specific colors, creating inconsistent visual hierarchy and potentially confusing users about interaction patterns.

**Before:**
- Base buttons: Dark gray focus rings
- Primary buttons: Blue focus rings  
- Destructive buttons: Red focus rings
- Focus ring width varied between components

### Root Cause
Components were implementing their own focus color logic based on component type rather than following a unified design system principle.

### Solution
Standardized all focus indicators to always use primary color (`--Color-Brand-Primary-Background-default: #0066cc`):

**Button Component:**
```css
/* Before: Type-specific colors */
--button-focus-base: var(--Color-Primary-Primary-Background-default, #2c72e0);
--button-focus-primary: var(--Color-Primary-Primary-Background-default, #2c72e0);
--button-focus-destructive: var(--Color-Error-Primary-Background-default, #ea0d11);

/* After: Always primary color */
--button-focus-color: var(--Color-Brand-Primary-Background-default, #0066cc);

.button:focus-visible {
  outline: 1px solid var(--button-focus-color);
  outline-offset: 2px;
}
```

**IconButton Component:**
```css
/* Before: Type-specific overrides */
.icon-button--base:focus-visible { outline-color: #242a37; }
.icon-button--primary:focus-visible { outline-color: #0066cc; }
.icon-button--destructive:focus-visible { outline-color: #dc2626; }

/* After: Unified primary color */
.icon-button:focus-visible {
  outline: 1px solid var(--Color-Brand-Primary-Background-default, #0066cc);
  outline-offset: 2px;
}
```

### Design System Principle Established
**Focus indicators should always use primary color across all components for:**
- **Consistency**: Same visual language throughout the interface
- **Accessibility**: Predictable focus behavior for keyboard users
- **Brand Recognition**: Reinforces primary brand color usage
- **Simplicity**: Removes complexity of type-specific focus colors

### Updated Documentation
- Added focus color principle to core design system principles
- Updated AI agent prompt templates to include this requirement
- Updated component development guide with focus color standards

### Testing
Verify in Storybook that all Button and IconButton variants now show consistent blue (#0066cc) focus rings regardless of their type (base/primary/destructive).

## Issue #021: IconButton Hover States Using Wrong Figma Tokens

### Problem
IconButton hover states were using completely incorrect Figma design tokens, making outline and ghost variants look like filled buttons on hover instead of subtle background changes.

**Incorrect Implementation:**
```css
/* WRONG: IconButton base outline hover */
.icon-button--base.icon-button--outline:hover {
  background: var(--Color-Base-Primary-Background-default, #242a37);  /* Dark! */
  color: var(--Color-Base-Primary-Foreground-default, #ffffff);       /* White! */
}

/* WRONG: IconButton base ghost hover */
.icon-button--base.icon-button--ghost:hover {
  background: var(--Color-Base-Primary-Background-default, #242a37);  /* Dark! */
  color: var(--Color-Base-Primary-Foreground-default, #ffffff);       /* White! */
}
```

**Expected Behavior (from Button component):**
```css
/* CORRECT: Button base outline hover */
.button--base.button--outline:hover {
  background: var(--Color-Base-Subtle-Background-hover, #ecedf0);     /* Light gray! */
  color: var(--Color-Base-Foreground-hover, #1d222c);               /* Dark text! */
}
```

### Root Cause
1. **No Cross-Component Validation**: IconButton was developed without comparing to Button component behavior
2. **Incorrect Token Category**: Used `Primary-Background` tokens instead of `Subtle-Background` tokens
3. **Missing Design System Rules**: No documented rules about when to use subtle vs primary backgrounds

### Solution Applied

**Fixed all IconButton hover states to match Button component:**

```css
/* Base type - CORRECTED */
.icon-button--base.icon-button--outline:hover {
  background: var(--Color-Base-Subtle-Background-hover, #ecedf0);
  color: var(--Color-Base-Foreground-hover, #1d222c);
  border-color: var(--Color-Base-Border-hover, #a1a7b3);
}

/* Primary type - CORRECTED */
.icon-button--primary.icon-button--outline:hover {
  background: var(--Color-Primary-Subtle-Background-hover, #eaf1fc);
  color: var(--Color-Brand-Primary-Background-hover, #0052a3);
  border-color: var(--Color-Brand-Primary-Background-default, #0066cc);
}

/* Destructive type - CORRECTED */
.icon-button--destructive.icon-button--outline:hover {
  background: var(--Color-Error-Subtle-Background-hover, #fde7e7);
  color: var(--Color-Status-Error-Background-hover, #b91c1c);
  border-color: var(--Color-Status-Error-Background-default, #dc2626);
}
```

### Design System Rule Established
**"Outline and ghost variants should ALWAYS use subtle background tokens on hover, never primary background tokens"**

- **Filled buttons**: Use primary background tokens
- **Outline/ghost buttons**: Use subtle background tokens  
- **IconButton**: Should follow exact same patterns as Button component

### Prevention Strategy Implemented

**1. Component Comparison Requirements**
- All new components must be compared with similar existing components
- Token usage patterns must be documented and validated
- Cross-component consistency must be verified

**2. Documentation Standards**
- Added token usage rules to component development guide
- Created comparative examples showing correct vs incorrect patterns
- Established design principles for component state behaviors

**3. Testing Enhancement Planned**
- Visual regression tests for ALL states (hover, active, focus)
- Cross-component style comparison automation
- CSS token validation scripts

### Files Modified
- `src/components/IconButton/IconButton.ts` - Fixed all hover/active state tokens
- `docs/troubleshooting-guide.md` - Documented issue and prevention
- `docs/component-development-guide.md` - Added token usage rules

### Testing
1. Build Storybook and verify IconButton hover states now show light backgrounds for outline/ghost variants
2. Compare Button and IconButton hover behaviors - should be identical
3. Confirm no visual regressions in existing Button component