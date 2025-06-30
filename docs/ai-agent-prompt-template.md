# 🤖 AI Agent Prompt Template - Quick Copy/Paste

## Core Development Principles

**Always follow these principles when developing components:**

1. **Component Reuse Over Duplication**: Before implementing any functionality, check if existing components can be reused. For example, use `<dive-icon>` for icons rather than duplicating SVG logic.

2. **Figma Design Token Alignment**: Use actual Figma design tokens directly, never create custom CSS variables that don't align with the design system.

3. **Cross-Component Consistency**: New components should follow exact same patterns as existing components. IconButton should match Button behavior exactly.

4. **Correct Token Categories**: 
   - Filled variants: Use `Primary-Background` tokens
   - Outline/ghost variants: Use `Subtle-Background` tokens on hover (NEVER primary backgrounds)

5. **Comprehensive Testing**: Implement both unit tests and visual regression tests for all components.

6. **Accessibility First**: Ensure proper ARIA labels, focus management, and keyboard navigation.

**💡 Pro Tip:** Always reference `docs/component-development-guide.md` for complete context and patterns!

---

## **For New Component Development**

**Copy this prompt when starting a new component:**

```
I'm developing a new [COMPONENT_NAME] component for the Dive Design System based on this Figma design: [FIGMA_URL]

Please follow the complete Component Development Guide (docs/component-development-guide.md) and ensure:
1. Use actual Figma design tokens (no custom variables)
2. Reuse existing components (e.g., <dive-icon>) instead of duplicating functionality
3. Create comprehensive Storybook stories including VisualRegressionMatrix
4. Follow Button component patterns for consistency  
5. Add proper documentation to troubleshooting guide
6. Include accessibility features and multi-mode visual testing

Context: This is a LitElement + TypeScript + Storybook design system with automated visual testing via Chromatic.

Key reference files:
- Component patterns: src/components/Button/Button.ts
- Existing components: src/components/Icon/Icon.ts
- Design tokens: src/tokens/css-vars/dive-theme/component.css
- Story patterns: src/components/Button/Button.stories.ts
- Documentation: docs/troubleshooting-guide.md
```

## **For Component Updates/Fixes**

**Copy this prompt when updating existing components:**

```
I need to update the [COMPONENT_NAME] component in the Dive Design System.

Please review the Component Development Guide (docs/component-development-guide.md) and ensure any changes:
1. Use proper Figma design tokens (never custom variables)
2. Check for opportunities to reuse existing components instead of duplicating code
3. Maintain visual regression test coverage
4. Update documentation in troubleshooting guide if needed
5. Follow established Button/Icon component patterns

Current issue: [DESCRIBE_ISSUE]
Expected outcome: [DESCRIBE_EXPECTED_RESULT]

Context: LitElement + TypeScript + Storybook design system with Chromatic visual testing.
```

## **For Visual Testing Issues**

**Copy this prompt for visual test problems:**

```
I have visual testing issues in the Dive Design System.

Please review:
1. Visual testing setup guide: docs/visual-testing-setup.md
2. Chromatic configuration: .github/workflows/visual-tests.yml
3. Story patterns: src/components/Button/Button.stories.ts (VisualRegressionMatrix)

Issue: [DESCRIBE_VISUAL_ISSUE]
Component: [COMPONENT_NAME]

Context: Storybook + Chromatic visual testing with multi-mode support (light/dark/high-contrast).
```

---

## Quick Reference Checklist

### Before Creating New Functionality:
- [ ] Can I reuse an existing component? (Icon, Button, etc.)
- [ ] Are there similar patterns in the codebase?
- [ ] Do the Figma design tokens already exist?

### During Development:
- [ ] Using actual Figma design tokens (not custom variables)
- [ ] Following established component patterns
- [ ] Including comprehensive accessibility features
- [ ] Adding visual regression tests

### After Implementation:
- [ ] Component renders correctly in all variants/states
- [ ] Icons are outlined (not filled) if applicable
- [ ] Documentation updated in troubleshooting guide
- [ ] Visual tests pass in Chromatic 