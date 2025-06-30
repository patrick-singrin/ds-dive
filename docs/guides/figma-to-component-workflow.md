# Figma to Component Development Workflow

This document outlines the standardized process for converting Figma designs into production-ready Web Components in the Dive Design System.

## Pre-Development Checklist

### ✅ System Readiness
Before starting component development, verify all systems are operational:

```bash
# 1. Design token pipeline
npm run build:tokens
# Expected: 1004+ variables generated in <20ms

# 2. Development environment  
npm run storybook
# Expected: Storybook running on http://localhost:6006

# 3. Code quality
npm run lint
# Expected: No linting errors

# 4. Test environment
npm test
# Expected: All existing tests passing
```

### ✅ Figma Access Requirements
- [ ] Figma file access with developer permissions
- [ ] Figma file key extracted from URL (`figma.com/file/{fileKey}/...`)
- [ ] Specific node IDs identified for components (`node-id={nodeId}`)
- [ ] Design specifications documented (spacing, colors, typography)

### ✅ Component Planning
- [ ] Component atomic level determined (atom/molecule/organism)
- [ ] Dependencies identified (required atoms/molecules)
- [ ] Design token usage mapped
- [ ] Accessibility requirements defined
- [ ] Story scenarios documented

## Phase 1: Design Analysis and Token Validation

### 1.1 Extract Figma Design Data
Use MCP Figma tools to gather design specifications:

```typescript
// Get component layout and measurements
const figmaData = await getFigmaData(fileKey, nodeId);

// Extract design tokens (colors, spacing, typography)
const designTokens = extractDesignTokens(figmaData);

// Download assets if needed (icons, images)
const assets = await downloadFigmaImages(fileKey, nodeIds, './src/assets/');
```

### 1.2 Validate Design Tokens
Compare Figma design specifications with current design tokens:

```bash
# Check current token values
cat src/tokens/css-vars/dive-theme/component.css | grep -E "(spacing|color|typography)"

# Verify token alignment with Figma specs
npm run build:tokens:dev -- --validate
```

**Token Alignment Checklist:**
- [ ] Colors match Figma color styles exactly
- [ ] Spacing values align with Figma measurements
- [ ] Typography scale matches Figma text styles
- [ ] Border radius values match design specifications
- [ ] Component-specific tokens defined if needed

### 1.3 Update Tokens if Needed
If Figma designs use new values not in current tokens:

```json
// Example: Add new component-specific tokens
{
  "component": {
    "new-component": {
      "padding": { "$value": "calc(var(--Spacing-3) * 1px)" },
      "border-radius": { "$value": "calc(var(--border-border-radius-lg) * 1px)" }
    }
  }
}
```

## Phase 2: Component Architecture

### 2.1 Component Structure Setup
Create component following established patterns:

```bash
# Create component directory
mkdir src/components/NewComponent

# Create component files
touch src/components/NewComponent/NewComponent.ts
touch src/components/NewComponent/NewComponent.stories.ts
touch src/components/NewComponent/NewComponent.test.ts
```

### 2.2 Base Component Template
Use this template as starting point:

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * NewComponent
 * 
 * [Component description from Figma design]
 * 
 * @element dive-new-component
 * 
 * @fires component-event - Description of events
 * 
 * @example
 * ```html
 * <dive-new-component variant="primary" size="medium">
 *   Content
 * </dive-new-component>
 * ```
 */
@customElement('dive-new-component')
export class DiveNewComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      /* Design token integration */
      --component-padding: calc(var(--Spacing-3, 10) * 1px);
      --component-border-radius: calc(var(--border-border-radius-md, 8) * 1px);
      --component-color: var(--Color-Base-Foreground-default, #1d222c);
    }

    .component-container {
      padding: var(--component-padding);
      border-radius: var(--component-border-radius);
      color: var(--component-color);
    }

    /* Size variants */
    :host([size="small"]) {
      --component-padding: calc(var(--Spacing-2, 8) * 1px);
    }

    :host([size="large"]) {
      --component-padding: calc(var(--Spacing-4, 12) * 1px);
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .component-container {
        transition: none;
      }
    }

    @media (prefers-contrast: high) {
      .component-container {
        border: 1px solid currentColor;
      }
    }
  `;

  /** Component variant from Figma design */
  @property({ type: String, reflect: true })
  variant: 'primary' | 'secondary' = 'primary';

  /** Component size from Figma specifications */
  @property({ type: String, reflect: true })
  size: 'small' | 'medium' | 'large' = 'medium';

  render() {
    return html`
      <div class="component-container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dive-new-component': DiveNewComponent;
  }
}
```

## Phase 3: Storybook Integration

### 3.1 Story Configuration
Create comprehensive stories covering all Figma variants:

```typescript
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './NewComponent';
import type { DiveNewComponent } from './NewComponent';

const meta: Meta<DiveNewComponent> = {
  title: 'Components/NewComponent',
  component: 'dive-new-component',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# NewComponent

[Description from Figma design file]

## Design Specifications
- **Figma File**: [Link to Figma file]
- **Node ID**: [Figma node ID]
- **Design Tokens Used**: [List specific tokens]
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
      description: 'Component variant from Figma design'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size scale from design specifications'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story for each Figma variant
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium'
  },
  render: (args) => html`
    <dive-new-component variant="${args.variant}" size="${args.size}">
      Content from Figma design
    </dive-new-component>
  `
};

// All variants story
export const AllVariants: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
      ${['primary', 'secondary'].map(variant => 
        ['small', 'medium', 'large'].map(size => html`
          <div style="text-align: center;">
            <dive-new-component variant="${variant}" size="${size}">
              ${variant} ${size}
            </dive-new-component>
          </div>
        `)
      )}
    </div>
  `
};
```

### 3.2 Accessibility Testing
Include accessibility validation in stories:

```typescript
export const AccessibilityTest: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'keyboard-navigation', enabled: true },
          { id: 'aria-roles', enabled: true }
        ]
      }
    }
  },
  render: () => html`
    <!-- Test various accessibility scenarios -->
    <dive-new-component aria-label="Accessible component">
      Accessible content
    </dive-new-component>
  `
};
```

## Phase 4: Quality Assurance

### 4.1 Automated Testing
Run comprehensive test suite:

```bash
# Visual regression testing
npm run chromatic

# Accessibility testing  
npm run test:a11y

# Performance testing
npm run performance:test

# Unit testing
npm test
```

### 4.2 Design Review Checklist
- [ ] **Visual Accuracy**: Component matches Figma design exactly
- [ ] **Responsive Behavior**: Works across all breakpoints
- [ ] **Interaction States**: Hover, focus, active states implemented
- [ ] **Design Token Usage**: No hardcoded values, all tokens used
- [ ] **Accessibility**: WCAG 2.1 AA compliant
- [ ] **Performance**: Renders in <100ms, passes budget thresholds

### 4.3 Documentation Validation
- [ ] **Component Props**: All properties documented with types
- [ ] **Design Rationale**: Links to Figma and design decisions
- [ ] **Usage Examples**: Real-world implementation examples
- [ ] **Token Dependencies**: Clear design token requirements
- [ ] **Browser Support**: Compatibility testing completed

## Phase 5: Integration and Deployment

### 5.1 Component Registration
Update component exports:

```typescript
// src/components/index.ts
export { DiveNewComponent } from './NewComponent/NewComponent';
export type { DiveNewComponent as NewComponentType } from './NewComponent/NewComponent';
```

### 5.2 Final Validation
```bash
# Build and test complete system
npm run build:tokens
npm run build:storybook
npm run test:coverage

# Performance validation
npm run analyze
```

### 5.3 Documentation Updates
- [ ] Update main README with new component
- [ ] Add component to architecture decisions if needed
- [ ] Update troubleshooting guide with any issues encountered
- [ ] Add to design system usage examples

## Development Best Practices

### Design Token Integration
- Always use design tokens, never hardcode values
- Use `calc()` for unitless tokens: `calc(var(--Spacing-3) * 1px)`
- Provide fallback values: `var(--Color-Primary, #2563eb)`

### Component Patterns
- Follow atomic design principles
- Use Shadow DOM for style encapsulation
- Implement proper ARIA attributes
- Support reduced motion and high contrast preferences

### Storybook Documentation
- Include Figma links in component descriptions
- Document all property variants with controls
- Provide real-world usage examples
- Test edge cases and error states

### Performance Considerations
- Lazy load components when possible
- Optimize SVG assets from Figma
- Use efficient CSS selectors
- Minimize re-renders with proper change detection

This workflow ensures consistent, high-quality component development from Figma designs to production-ready Web Components in the Dive Design System. 