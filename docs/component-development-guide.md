# Component Development Guide for AI Agents

## 🎯 **Purpose**

This guide ensures AI agents have complete context for developing new components in the Dive Design System, following established patterns and best practices.

## 📋 **AI Agent Context Template**

When starting a new component, provide this context to the AI agent:

---

### **Project Context**
You are working on the **Dive Design System** - a comprehensive design system built with:
- **LitElement Web Components** + TypeScript
- **Storybook** for component documentation and testing
- **Figma Design Tokens** for design-code consistency  
- **Automated Visual Testing** with Chromatic
- **Comprehensive Documentation** patterns

### **Required Knowledge Base**
The agent should be aware of these key files and patterns:

**📁 Component Architecture:**
- `src/components/ComponentName/ComponentName.ts` - Main component implementation
- `src/components/ComponentName/ComponentName.stories.ts` - Storybook stories
- `src/components/index.ts` - Component exports

**🎨 Design Token Integration:**
- `src/tokens/css-vars/dive-theme/component.css` - Available Figma tokens
- Use actual Figma tokens directly (e.g., `--Color-Base-Foreground-default`)
- Never create custom CSS variables when Figma tokens exist

**📚 Documentation Requirements:**
- `docs/troubleshooting-guide.md` - Add component issues
- `docs/user-feedback-log.md` - Document development insights
- Component-specific documentation in stories

**🔍 Visual Testing:**
- Include comprehensive visual regression stories
- Follow `VisualRegressionMatrix` pattern from Button component
- Multi-mode testing (light, dark, high-contrast)

### **Established Patterns to Follow**

**✅ Use these successful patterns from existing components:**

1. **Button Component** (`src/components/Button/Button.ts`)
   - Proper Figma token usage
   - Comprehensive property validation
   - Size variants (small, default)
   - Type variants (base, primary, destructive)
   - Visual regression testing stories

2. **Icon Component** (`src/components/Icon/Icon.ts`)
   - Tabler Icons integration
   - SVG attribute management
   - Proper stroke-based rendering

3. **Blueprint Component** (`src/components/_Blueprint/_Blueprint.ts`)
   - Component template structure
   - Design token integration patterns

## 🚀 **Complete Component Development Checklist**

### Phase 1: Analysis & Planning
- [ ] **Analyze Figma Design**: Understand component specifications
- [ ] **Identify Design Tokens**: Map required colors, spacing, typography
- [ ] **Review Existing Patterns**: Check similar components for consistency
- [ ] **Plan Component API**: Properties, events, variants

### Phase 2: Implementation
- [ ] **Create Component File**: `src/components/ComponentName/ComponentName.ts`
- [ ] **Use Proper Figma Tokens**: Direct token usage, no custom variables
- [ ] **Follow LitElement Patterns**: Based on Button/Icon examples
- [ ] **Implement Accessibility**: ARIA attributes, keyboard navigation
- [ ] **Add to Index**: Update `src/components/index.ts`

### Phase 3: Storybook Integration  
- [ ] **Create Stories File**: `src/components/ComponentName/ComponentName.stories.ts`
- [ ] **Interactive Story**: Main playground with all controls
- [ ] **Design Matrix**: All variant combinations
- [ ] **Visual Regression Matrix**: Comprehensive testing story
- [ ] **Real-world Examples**: Practical usage patterns
- [ ] **Accessibility Demo**: A11y features demonstration

### Phase 4: Visual Testing
- [ ] **Add Visual Test Coverage**: Include in VisualRegressionMatrix story
- [ ] **Multi-mode Testing**: Light, dark, high-contrast themes
- [ ] **Cross-browser Validation**: Ensure consistent rendering
- [ ] **Figma Comparison**: Verify pixel-perfect accuracy

### Phase 5: Documentation
- [ ] **Component Documentation**: Comprehensive story descriptions
- [ ] **Troubleshooting Guide**: Add potential issues and solutions  
- [ ] **User Feedback Log**: Document development insights
- [ ] **Implementation Notes**: Architecture decisions

### Phase 6: Quality Assurance
- [ ] **Build Verification**: `npm run build:tokens && npm run build:storybook`
- [ ] **Visual Testing**: `npx chromatic --project-token=<token>`
- [ ] **Accessibility Testing**: Screen reader and keyboard navigation
- [ ] **Token Validation**: Verify proper Figma token usage

## 🎨 **Design Token Usage Standards**

### ✅ **Correct Token Usage**
```css
/* Use actual Figma tokens directly */
.component {
  background: var(--Color-Primary-Primary-Background-default, #2c72e0);
  color: var(--Color-Primary-Primary-Foreground-default, #ffffff);
  border: 1px solid var(--Color-Primary-Border-default, #568ee6);
  padding: calc(var(--Spacing-3, 10) * 1px) calc(var(--Spacing-5, 16) * 1px);
  border-radius: calc(var(--border-border-radius-md, 8) * 1px);
}
```

### ❌ **Avoid Custom Variables**
```css
/* Don't create unnecessary abstractions */
--component-custom-background: var(--Color-Primary-Primary-Background-default);
```

### 📋 **Available Token Categories**
- **Colors**: `--Color-{Base|Primary|Success|Warning|Error|Info}-{Background|Foreground|Border}-{default|hover|active|disabled}`
- **Spacing**: `--Spacing-{0-12}` (2px, 4px, 8px, 10px, 12px, 16px...)
- **Typography**: Use existing font family and weight tokens
- **Borders**: `--border-border-radius-{sm|md|lg}`, `--Border-border-width-{default|hover|active}`

## 📖 **Component Template Structure**

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('dive-component-name')
export class DiveComponentName extends LitElement {
  static styles = css`
    /* Use Figma design tokens */
    :host {
      --component-background: var(--Color-Primary-Primary-Background-default, #2c72e0);
      display: inline-block;
      box-sizing: border-box;
    }
    
    .component {
      /* Implementation using proper tokens */
    }
  `;

  @property({ type: String, reflect: true })
  variant: 'primary' | 'secondary' = 'primary';

  @property({ type: String, reflect: true })
  size: 'small' | 'default' = 'default';

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  render() {
    return html`
      <div 
        class="component component--${this.variant} component--${this.size}"
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dive-component-name': DiveComponentName;
  }
}
```

## 📊 **Visual Testing Story Template**

```typescript
export const VisualRegressionMatrix: Story = {
  name: 'Visual Regression Matrix',
  parameters: {
    layout: 'padded',
    chromatic: {
      modes: {
        light: { theme: 'light' },
        dark: { theme: 'dark' },
        'high-contrast': { theme: 'hc-light' }
      }
    }
  },
  render: () => html`
    <div style="padding: 24px;">
      <!-- Complete variant matrix -->
      ${['variant1', 'variant2'].map(variant => html`
        <div style="margin-bottom: 24px;">
          <h3>${variant} Variant</h3>
          <div style="display: flex; gap: 16px;">
            ${['small', 'default'].map(size => html`
              <dive-component-name
                variant=${variant}
                size=${size}
              >
                ${size} ${variant}
              </dive-component-name>
            `)}
          </div>
        </div>
      `)}
    </div>
  `
};
```

## 🛠 **Common Issues & Solutions**

### Token Not Found
```bash
# Check available tokens
cat src/tokens/css-vars/dive-theme/component.css | grep "Color-Primary"
```

### Build Failures
```bash
# Verify tokens build correctly
npm run build:tokens

# Test Storybook build
npm run build:storybook
```

### Visual Testing Issues
```bash
# Local visual test
npx chromatic --project-token=<token> --dry-run
```

## 📞 **When to Ask for Help**

Ask the user for clarification when:
- **Figma Design Unclear**: Need specific design specifications
- **Token Mapping Uncertain**: Multiple token options available
- **Component Behavior**: Interactive patterns not specified
- **Accessibility Requirements**: Specific A11y needs

## 🎯 **Success Criteria**

A complete component implementation includes:
- ✅ **Pixel-perfect Figma match**
- ✅ **Proper Figma token usage**
- ✅ **Comprehensive Storybook stories**
- ✅ **Visual regression testing**
- ✅ **Accessibility compliance**
- ✅ **Complete documentation**

---

## 🚀 **Quick Start Command for AI Agent**

**Paste this prompt when starting a new component:**

```
I'm developing a new [COMPONENT_NAME] component for the Dive Design System based on this Figma design: [FIGMA_URL]

Please follow the complete Component Development Guide (docs/component-development-guide.md) and ensure:
1. Use actual Figma design tokens (no custom variables)
2. Create comprehensive Storybook stories including VisualRegressionMatrix
3. Follow Button component patterns for consistency
4. Add proper documentation to troubleshooting guide
5. Include accessibility features and multi-mode visual testing

Context: This is a LitElement + TypeScript + Storybook design system with automated visual testing via Chromatic.
```

This ensures every component follows the same high-quality standards and patterns established in the Dive Design System. 