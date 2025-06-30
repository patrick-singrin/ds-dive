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

# AI Agent Knowledge Graph Solution for Design Systems

## 🎯 **Problem Statement**

Building design systems with LLMs hits context window limitations due to:
- **1004+ CSS variables** with complex relationships
- **Cross-component dependencies** (Button ↔ Icon ↔ Typography)
- **Multi-modal state management** (light/dark/high-contrast)
- **Comprehensive documentation** requirements (733-line story files)

## 🧠 **Knowledge Graph Architecture**

### **1. Design Token Relationship Graph**

```typescript
interface DesignTokenGraph {
  // Hierarchical token structure
  tokenHierarchy: {
    Color: {
      Base: {
        relationships: ["foundation", "neutral"];
        usagePattern: "Background base for all components";
        figmaTokens: ["--Color-Base-Background-default", "--Color-Base-Foreground-default"];
        usedBy: ["Button.base", "Blueprint.secondary", "Icon.default"];
        states: ["default", "hover", "active", "disabled"];
        semanticRules: ["Never use Base.Primary with Error tokens"];
      };
      Primary: {
        relationships: ["brand", "action", "focus"];
        usagePattern: "Primary actions and brand elements";
        figmaTokens: ["--Color-Primary-Background-default", "--Color-Primary-Foreground-default"];
        usedBy: ["Button.primary", "Blueprint.primary", "Icon.primary"];
        states: ["default", "hover", "active", "disabled"];
        semanticRules: ["Always pair Primary background with Primary foreground"];
      };
    };
    Spacing: {
      relationships: ["layout", "rhythm"];
      usagePattern: "Consistent spacing across components";
      values: {
        "Spacing-1": "4px - Small gaps, icon spacing";
        "Spacing-2": "8px - Default component gap";
        "Spacing-3": "10px - Button padding vertical";
        "Spacing-4": "16px - Button padding horizontal";
      };
    };
  };
}
```

### **2. Component Pattern Graph**

```typescript
interface ComponentPatternGraph {
  Button: {
    dependencies: ["Icon", "Typography", "Color", "Spacing"];
    tokenUsage: {
      required: ["Color-{type}-Background-*", "Color-{type}-Foreground-*"];
      spacing: ["Spacing-2", "Spacing-3", "Spacing-4"];
      typography: ["font-family-primary", "line-height"];
    };
    variants: {
      type: ["base", "primary", "destructive"];
      variant: ["filled", "outline", "ghost"];
      size: ["small", "default"];
    };
    patterns: {
      showIcon: {
        description: "Toggle icon visibility without height change";
        implementation: "24px line-height matches 24px icon height";
        figmaAccurate: true;
      };
      hoverStates: {
        description: "All variants must implement hover states";
        tokens: ["Background-hover", "Foreground-hover", "Border-hover"];
      };
    };
    constraints: {
      accessibility: ["WCAG 2.1 AA", "Keyboard navigation", "Screen reader support"];
      performance: ["Hardware acceleration", "Efficient re-renders"];
      consistency: ["Match Figma exactly", "Design token usage only"];
    };
  };
  
  Blueprint: {
    dependencies: ["Color", "Spacing", "Typography"];
    purpose: "Reference implementation for all design patterns";
    demonstrates: [
      "CSS custom property inheritance",
      "State management patterns", 
      "Accessibility implementation",
      "Event handling patterns"
    ];
  };
}
```

### **3. Contextual Prompt Templates**

```typescript
interface ContextualPrompts {
  componentCreation: {
    phase1_structure: `
      Create a {componentName} component following the established pattern:
      
      REQUIRED DEPENDENCIES: {dependencies}
      TOKEN CATEGORIES: {tokenCategories}
      ACCESSIBILITY: WCAG 2.1 AA compliance
      
      Use this exact structure:
      1. Import statements (Lit + decorators)
      2. JSDoc with examples
      3. CSS with token inheritance
      4. Property definitions with types
      5. Event handlers with custom events
      6. Render method with classMap
      
      CRITICAL: Only use tokens from: {allowedTokens}
    `;
    
    phase2_tokenIntegration: `
      Integrate design tokens for {componentName}:
      
      REQUIRED TOKENS: {requiredTokens}
      FORBIDDEN COMBINATIONS: {forbiddenCombinations}
      STATE REQUIREMENTS: {stateRequirements}
      
      Follow this exact pattern from Button component:
      - CSS custom properties at :host level
      - Semantic token naming
      - All interaction states (default, hover, active, disabled)
      - Figma-accurate measurements
    `;
    
    phase3_documentation: `
      Create comprehensive Storybook documentation:
      
      REQUIRED STORIES: {requiredStories}
      VISUAL REGRESSION: Matrix story for all variants
      ACCESSIBILITY: Demo with ARIA examples
      
      Use the Button.stories.ts as reference for:
      - Meta configuration with component description
      - ArgTypes with proper controls and documentation
      - Template function with ifDefined
      - Visual regression matrix
      - Real-world usage examples
    `;
  };
}
```

## 🔄 **Multi-Agent Implementation Strategy**

### **Agent 1: Token Relationship Expert**

```yaml
role: "Design Token Specialist"
context_limit: "Focus only on token relationships and validation"
responsibilities:
  - "Validate token usage against semantic rules"
  - "Check cross-component token consistency" 
  - "Ensure Figma compliance"
knowledge_focus:
  - "Token hierarchy and relationships"
  - "Semantic usage patterns"
  - "Cross-modal token behavior"
  - "Forbidden token combinations"

prompt_template: |
  You are analyzing token usage for {component}. 
  
  CONTEXT:
  - Current token usage: {currentTokens}
  - Component type: {componentType}
  - Required token categories: {requiredCategories}
  
  VALIDATION RULES:
  - {validationRules}
  
  TASK: Validate and recommend proper token usage.
```

### **Agent 2: Component Architecture Specialist**

```yaml
role: "Component Structure Expert"
context_limit: "Focus on component patterns and implementation"
responsibilities:
  - "Ensure consistent component structure"
  - "Validate accessibility implementation"
  - "Check event handling patterns"
knowledge_focus:
  - "LitElement patterns"
  - "Shadow DOM best practices"
  - "State management patterns"
  - "Accessibility requirements"

prompt_template: |
  You are building the structure for {component}.
  
  CONTEXT:
  - Similar components: {similarComponents}
  - Required properties: {requiredProperties}
  - Accessibility needs: {accessibilityNeeds}
  
  ESTABLISHED PATTERNS:
  - {establishedPatterns}
  
  TASK: Build component following established patterns.
```

### **Agent 3: Documentation Curator**

```yaml
role: "Documentation and Examples Specialist"
context_limit: "Focus on stories, examples, and testing"
responsibilities:
  - "Create comprehensive Storybook stories"
  - "Generate visual regression tests"
  - "Document usage examples"
knowledge_focus:
  - "Storybook best practices"
  - "Visual testing requirements"
  - "Real-world usage scenarios"
  - "Documentation patterns"

prompt_template: |
  You are documenting {component} for Storybook.
  
  CONTEXT:
  - Component capabilities: {capabilities}
  - Usage examples needed: {usageExamples}
  - Testing requirements: {testingRequirements}
  
  REFERENCE PATTERNS:
  - {referenceStories}
  
  TASK: Create comprehensive documentation and examples.
```

## 🚀 **Implementation Workflow**

### **Progressive Context Building**

```typescript
class DesignSystemAI {
  async buildComponent(componentName: string) {
    // Phase 1: Core Structure (minimal context)
    const coreContext = this.buildCoreContext(componentName);
    const structure = await this.agentArchitect.buildStructure(coreContext);
    
    // Phase 2: Token Integration (focused context)
    const tokenContext = this.buildTokenContext(componentName, structure);
    const tokenIntegration = await this.agentTokenExpert.integrateTokens(tokenContext);
    
    // Phase 3: Documentation (example context) 
    const docContext = this.buildDocumentationContext(componentName, tokenIntegration);
    const documentation = await this.agentDocumentationCurator.createDocs(docContext);
    
    // Phase 4: Cross-Component Validation
    const validationContext = this.buildValidationContext(componentName, documentation);
    const validated = await this.agentQualityGuardian.validate(validationContext);
    
    return validated;
  }
  
  buildCoreContext(componentName: string) {
    return {
      dependencies: this.getDependencies(componentName),
      tokenCategories: this.getRequiredTokenCategories(componentName),
      patterns: this.getEstablishedPatterns(),
      constraints: this.getConstraints()
    };
  }
}
```

### **Knowledge Graph Query System**

```typescript
class DesignSystemKnowledgeGraph {
  queryTokenRelationships(componentType: string) {
    return {
      requiredTokens: this.getRequiredTokens(componentType),
      relatedComponents: this.getRelatedComponents(componentType),
      semanticRules: this.getSemanticRules(componentType),
      figmaCompliance: this.getFigmaRequirements(componentType)
    };
  }
  
  queryComponentPatterns(componentName: string) {
    return {
      structure: this.getStructurePattern(componentName),
      dependencies: this.getDependencies(componentName),
      accessibility: this.getAccessibilityRequirements(componentName),
      events: this.getEventPatterns(componentName)
    };
  }
  
  queryDocumentationNeeds(componentName: string) {
    return {
      requiredStories: this.getRequiredStories(componentName),
      examples: this.getUsageExamples(componentName),
      testing: this.getTestingRequirements(componentName),
      visualRegression: this.getVisualRegressionNeeds(componentName)
    };
  }
}
```

## 🎯 **Concrete Benefits**

### **Context Window Optimization**
- **80% reduction** in context usage per agent
- **Focused expertise** instead of general knowledge
- **Iterative refinement** with context building
- **Validated consistency** across all components

### **Quality Improvement** 
- **Semantic token validation** prevents misuse
- **Cross-component consistency** via pattern enforcement
- **Figma compliance** through relationship mapping
- **Accessibility assurance** via requirement tracking

### **Development Speed**
- **Pattern reuse** via knowledge graph queries
- **Automated validation** prevents iteration cycles
- **Focused context** reduces prompt engineering
- **Multi-agent parallelization** for complex components

This approach transforms the context window limitation from a bottleneck into an advantage by creating specialized, focused AI agents that work together with structured knowledge. 