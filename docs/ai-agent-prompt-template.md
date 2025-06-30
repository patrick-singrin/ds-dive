# 🤖 AI Agent Prompt Template - Quick Copy/Paste

## **For New Component Development**

**Copy this prompt when starting a new component:**

```
I'm developing a new [COMPONENT_NAME] component for the Dive Design System based on this Figma design: [FIGMA_URL]

Please follow the complete Component Development Guide (docs/component-development-guide.md) and ensure:
1. Use actual Figma design tokens (no custom variables)
2. Create comprehensive Storybook stories including VisualRegressionMatrix
3. Follow Button component patterns for consistency  
4. Add proper documentation to troubleshooting guide
5. Include accessibility features and multi-mode visual testing

Context: This is a LitElement + TypeScript + Storybook design system with automated visual testing via Chromatic.

Key reference files:
- Component patterns: src/components/Button/Button.ts
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
2. Maintain visual regression test coverage
3. Update documentation in troubleshooting guide if needed
4. Follow established Button/Icon component patterns

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

**💡 Pro Tip:** Always reference `docs/component-development-guide.md` for complete context and patterns! 