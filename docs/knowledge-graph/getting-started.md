# Getting Started with Knowledge Graph AI Development

## 🎯 **Quick Start Template**

Copy this institutional knowledge prompt for any new component:

```
CONTEXT: I'm building a ${COMPONENT_NAME} component for the Dive Design System.

INSTITUTIONAL KNOWLEDGE CHECK:

KNOWN ISSUES TO AVOID:
- Issue #001: Component registration timing (import in .storybook/setup.ts)
- Issue #002: Icon SVG sprites fail in Shadow DOM (use inline SVG)  
- Issue #003: Design tokens not accessible (use :host level inheritance)

ARCHITECTURAL CONSTRAINTS:
- ADR-001: Must use LitElement for Web Components
- ADR-004: Must use Shadow DOM for encapsulation
- ADR-006: Must use CSS Variable Pipeline tokens only

REUSE OPPORTUNITIES:
- Blueprint component as structural foundation
- Button component for story templates
- Icon component for consistent icon usage

ANTI-PATTERNS TO AVOID:
- No hardcoded colors/spacing values
- No external SVG sprite references  
- No global CSS dependencies
- No non-semantic token combinations

DESIGN PRINCIPLES:
- Framework agnostic (works across React, Vue, etc.)
- Accessibility first (WCAG 2.1 AA compliance)
- Performance conscious (efficient re-renders)
- Token-based theming only

TASK: Create a ${COMPONENT_NAME} component structure following these proven patterns.
```

## 🚀 **Immediate Action Plan**

### **Step 1: Choose Your Test Component (2 minutes)**
Pick a simple component to validate the approach:
- **Recommended**: Card, Alert, or Badge component
- **Why**: Complex enough to test patterns, simple enough to complete quickly

### **Step 2: Use Multi-Phase Approach**

**Phase 1 - Institutional Memory**:
```
[Use template above with your component name]

TASK: Analyze what I need to know before starting this component.
```

**Phase 2 - Pattern Reuse**:
```
Based on the institutional knowledge above:

TASK: Create a detailed reuse strategy:
- Which existing component should I use as foundation?
- What specific patterns should I copy from Button component?
- What story templates should I adapt?
- What token patterns should I follow?
```

**Phase 3 - Preventive Implementation**:
```
Using the reuse strategy above:

TASK: Generate the component implementation with:
- Blueprint structure as foundation
- Preventive solutions for known issues
- Proper token inheritance pattern
- Complete TypeScript implementation following established patterns
```

### **Step 3: Validation Checklist**

Check if the knowledge graph approach prevented known issues:

1. ✅ **Component Registration**: Import added to .storybook/setup.ts?
2. ✅ **Token Access**: Tokens defined at :host level?
3. ✅ **Icon Strategy**: Using dive-icon component vs. external sprites?
4. ✅ **State Completeness**: All states (default/hover/active/disabled) implemented?
5. ✅ **TypeScript Patterns**: Follows Blueprint/Button property patterns?

## 📊 **Success Metrics**

### **Expected Results**
- **Time**: 1 hour total vs. 3+ hours traditional
- **Quality**: Zero known issues vs. multiple debugging cycles
- **Consistency**: Matches existing patterns automatically

### **Track Your Progress**
- Development speed improvements
- Issues prevented vs. encountered
- Pattern consistency scores

## 🎯 **Your Next Action (Right Now)**

1. **Pick a component** (Card, Alert, Badge)
2. **Copy the institutional knowledge template**
3. **Replace ${COMPONENT_NAME}** with your choice
4. **Run Phase 1 prompt** with your AI assistant
5. **Follow through phases 2 & 3**

**Ready to start? The knowledge graph approach is ready to use!** 🚀 