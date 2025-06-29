# Documentation Strategy & Best Practices

This directory contains critical documentation for the Dive Design System that follows industry-standard practices to prevent knowledge loss and architectural drift.

## 📚 Documentation Types

### 1. Architecture Decision Records (ADRs)
**File**: [`architecture-decisions.md`](./architecture-decisions.md)

**Purpose**: Captures **WHY** we made specific architectural decisions to prevent:
- ❌ Accidental reversions of settled decisions
- ❌ Repeated debates about already-resolved issues
- ❌ Knowledge loss when team members change
- ❌ Architectural drift over time

**When to Use**:
- Making any significant architectural choice
- Choosing between multiple viable approaches
- Establishing coding standards or patterns
- Making technology stack decisions

### 2. Troubleshooting Guide
**File**: [`troubleshooting-guide.md`](./troubleshooting-guide.md)

**Purpose**: Documents **HOW** to solve specific problems to prevent:
- ❌ Repetitive problem-solving cycles
- ❌ Lost solutions to complex issues
- ❌ Developer frustration with recurring bugs
- ❌ Time waste on already-solved problems

**When to Use**:
- Encountering any error that takes >30 minutes to solve
- Finding workarounds for tool limitations
- Discovering performance issues and their fixes
- Resolving configuration problems

## 🏗️ Best Practices for Documentation

### Architecture Decision Records (ADRs)

#### ADR Structure Template
```markdown
## ADR-XXX: [Decision Title]

**Status**: 🔄 PROPOSED | ✅ ACCEPTED | ❌ REJECTED | 🔄 SUPERSEDED
**Decision Date**: YYYY-MM-DD
**Participants**: [Team members involved]

### Context
[Problem statement and alternatives considered]

### Decision
**CHOSEN**: [Selected approach]

### Rationale
[Why this decision was made - most important section]

### Implementation Details
[Code examples and requirements]

### Consequences
**Positive**: [Benefits gained]
**Negative**: [Drawbacks accepted]
**Mitigation**: [How to address drawbacks]

### Related Decisions
[References to other ADRs]
```

#### ADR Writing Guidelines

1. **Be Specific About Context**
   ```markdown
   ❌ Bad: "We needed icon rendering"
   ✅ Good: "Shadow DOM isolation prevents SVG sprite references from working, requiring a new icon rendering strategy for Web Components"
   ```

2. **Document Alternatives Considered**
   ```markdown
   ❌ Bad: "We chose inline SVG"
   ✅ Good: "Considered: SVG sprites (fails in Shadow DOM), icon fonts (accessibility issues), inline SVG (chosen for reliability)"
   ```

3. **Include Technical Evidence**
   ```markdown
   ❌ Bad: "Shadow DOM is better"
   ✅ Good: "Based on Nolan Lawson's research: Shadow DOM maintains ~70ms rendering vs ~600ms for global styles with complex selectors"
   ```

4. **Document Implementation Requirements**
   ```typescript
   // ✅ Include specific code examples
   @customElement('dive-component')
   export class DiveComponent extends LitElement {
     // Required implementation pattern
   }
   ```

### Troubleshooting Guide

#### Issue Documentation Template
```markdown
### Issue #XXX: [Brief Description]

**Symptoms**:
- [Observable behavior from user perspective]

**Error Messages**:
```
[Exact error text from console/logs]
```

**Root Cause Analysis**:
[Technical explanation of WHY this happens]

**Diagnostic Steps**:
```javascript
// Code to reproduce and confirm the issue
```

**Solution**:
```typescript
// Working fix with explanation
```

**Prevention**:
- [How to avoid this in the future]

**Related Issues**: [Cross-references]
```

#### Troubleshooting Best Practices

1. **Include Exact Error Messages**
   ```markdown
   ❌ Bad: "TypeScript error about types"
   ✅ Good: "Type 'string | undefined' is not assignable to type 'string | null'"
   ```

2. **Provide Diagnostic Steps**
   ```javascript
   // ✅ Always include verification steps
   console.log('Component registered:', !!customElements.get('dive-blueprint'));
   ```

3. **Document Root Causes**
   ```markdown
   ❌ Bad: "Icons don't work"
   ✅ Good: "Shadow DOM isolation prevents <use href="#icon"> from accessing external sprites"
   ```

4. **Include Prevention Strategies**
   ```markdown
   ✅ Good: "Use automatic diagnostics to detect sprite references before they cause issues"
   ```

## 🔄 Maintenance Workflows

### For Development Team

#### Before Making Architectural Changes
1. **Check existing ADRs** in [`architecture-decisions.md`](./architecture-decisions.md)
2. **Search for related decisions** using the Decision Status Reference table
3. **If changing existing architecture**: Update the original ADR status and create a new superseding ADR

#### When Encountering New Issues
1. **Check troubleshooting guide** first - might already be solved
2. **Document new issues** immediately when resolved
3. **Include exact error messages** for searchability
4. **Update related issues** cross-references

#### During Code Reviews
1. **Reference relevant ADRs** to justify architectural choices
2. **Ensure consistency** with documented decisions
3. **Flag potential new ADRs** needed for novel patterns

### For Team Leads/Architects

#### Weekly Documentation Review
```bash
# Check for outdated decisions
grep -n "Status.*PROPOSED" docs/architecture-decisions.md

# Verify recent issues are documented
git log --since="1 week ago" --oneline | grep -i "fix\|bug\|issue"
```

#### Monthly Architecture Audit
1. **Review ADR status table** for decisions that need updates
2. **Check for architectural drift** - code not following documented decisions
3. **Update consequences** as they become apparent over time
4. **Identify missing ADRs** for undocumented architectural patterns

### For Project Onboarding

#### New Team Member Checklist
- [ ] Read all ADRs in [`architecture-decisions.md`](./architecture-decisions.md)
- [ ] Understand the rationale behind major decisions
- [ ] Bookmark [`troubleshooting-guide.md`](./troubleshooting-guide.md) for quick reference
- [ ] Know how to add new documentation when needed

## 🛡️ Quality Gates

### Pre-Commit Checks
```bash
# Ensure new ADRs follow template
docs/scripts/validate-adr-format.sh

# Check for undocumented architectural changes
docs/scripts/detect-architectural-drift.sh
```

### Code Review Requirements
- [ ] **Architectural changes** must reference existing ADR or propose new one
- [ ] **Bug fixes** must check if troubleshooting guide needs updating
- [ ] **New patterns** must be documented if they'll be reused

## 📊 Success Metrics

### ADR Effectiveness
- **Decision Reversals**: Should decrease over time
- **Architecture Debates**: Should reference existing ADRs
- **Onboarding Time**: New developers should understand decisions faster

### Troubleshooting Guide Value
- **Issue Resolution Time**: Faster for documented problems
- **Repeat Issues**: Should decrease as solutions are documented
- **Developer Satisfaction**: Less frustration with recurring problems

## 🔗 Integration with Development Tools

### IDE Integration
```json
// .vscode/snippets/adr.json
{
  "Architecture Decision Record": {
    "prefix": "adr",
    "body": [
      "## ADR-${1:XXX}: ${2:Decision Title}",
      "",
      "**Status**: 🔄 **PROPOSED**",
      "**Decision Date**: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
      "**Participants**: ${3:Team members}",
      "",
      "### Context",
      "${4:Problem statement}",
      "",
      "### Decision", 
      "**CHOSEN**: ${5:Selected approach}",
      "",
      "### Rationale",
      "${6:Why this decision was made}",
      "",
      "### Consequences",
      "**Positive**: ${7:Benefits}",
      "**Negative**: ${8:Drawbacks}",
      "",
      "### Related Decisions",
      "${9:References to other ADRs}"
    ]
  }
}
```

### Git Hooks
```bash
#!/bin/sh
# .git/hooks/pre-commit
# Check if architectural files were modified without documentation update

if git diff --cached --name-only | grep -E "(components/|utils/)" > /dev/null; then
  echo "⚠️  Architectural code changes detected."
  echo "📝 Consider updating docs/architecture-decisions.md if needed."
  echo "🔧 Consider updating docs/troubleshooting-guide.md if fixing bugs."
fi
```

### Automated Reminders
```yaml
# .github/workflows/documentation-reminder.yml
name: Documentation Reminder
on:
  pull_request:
    paths: ['src/components/**', 'src/utils/**']

jobs:
  remind:
    runs-on: ubuntu-latest
    steps:
      - name: Check for documentation updates
        run: |
          echo "::notice::Consider updating architecture-decisions.md for significant changes"
          echo "::notice::Update troubleshooting-guide.md if fixing issues"
```

## 🚀 Advanced Patterns

### Decision Dependencies
```markdown
## ADR-006: Component State Management

### Dependencies
**Requires**: ADR-001 (Shadow DOM), ADR-005 (Component API)
**Influences**: Future data binding decisions
**Conflicts**: None identified

### Decision Impact Matrix
| Component | High | Medium | Low |
|-----------|------|--------|-----|
| Blueprint | ✅   |        |     |
| Icon      |      | ✅     |     |
```

### Issue Relationship Mapping
```markdown
### Issue #008: State Synchronization Problems

**Upstream Issues**: #003 (Token Access), #001 (Component Registration)
**Downstream Effects**: May affect #009 (Performance Issues)
**Similar Issues**: #006 (Hot Reload) - different symptoms, same root cause
```

---

## 📞 Getting Help

### Documentation Issues
- **Missing ADR**: Create GitHub issue with `documentation` label
- **Outdated Information**: Update directly and create PR
- **Unclear Solutions**: Add comments to troubleshooting guide

### Process Questions
- **When to create ADR**: If you're debating architectural approaches
- **How much detail**: Include enough context that you'd understand it in 6 months
- **Who reviews**: Team lead or architect should approve new ADRs

**Remember**: These documents are **living** - they're only valuable if they're maintained and used actively!

---

**Documentation Principles**:
- ✅ **Write for your future self** - you'll forget why you made decisions
- ✅ **Include context** - not just what, but why and what alternatives were considered  
- ✅ **Keep it current** - outdated docs are worse than no docs
- ✅ **Make it searchable** - use exact error messages and symptoms
- ✅ **Cross-reference** - link related decisions and issues 

# Dive Design System Documentation

## Overview

Welcome to the Dive Design System documentation! This design system provides a comprehensive set of design tokens, components, and guidelines for building consistent, accessible user interfaces.

## Quick Start

### 1. Installation & Setup
See [SETUP.md](../SETUP.md) for development environment setup.

### 2. Using CSS Variables
```css
/* Import design tokens */
@import '../tokens/css-vars/index.css';

/* Use in your components */
.my-component {
  background-color: var(--Color-Primary-Background-default);
  color: var(--Color-Primary-Foreground-default);
  border-radius: var(--border-border-radius-md);
  padding: var(--Spacing-3) var(--Spacing-4);
}
```

### 3. Components
```html
<dive-icon name="check" size="medium" color="primary"></dive-icon>
<dive-blueprint variant="primary" text="Hello World"></dive-blueprint>
```

## System Architecture

### Design Token Pipeline
Our CSS Variable Pipeline transforms structured JSON design tokens into CSS custom properties with multi-mode support:

- **1004 variables** across all color modes
- **6 official color categories**: Base, Primary, Success, Warning, Error, Info
- **4 color modes**: Light, Dark, High Contrast Light, High Contrast Dark
- **Type-safe resolution** with cycle detection
- **14ms build time** for complete pipeline

### Components
- **Web Components** built with LitElement
- **Shadow DOM** for style encapsulation
- **TypeScript** for type safety
- **Accessibility-first** implementation (WCAG 2.1 AA)

## Documentation Structure

### Core Documentation
- **[CSS Variable Usage Guide](./CSS_Variable_Usage_Guide.md)** - Complete guide for using design tokens
- **[CSS Variable Pipeline Documentation](../src/tokens/CSS_Variable_Pipeline_Documentation.md)** - Technical architecture details
- **[Enterprise Setup](./enterprise-setup.md)** - Enterprise-grade Storybook features, performance monitoring, and quality gates
- **[Troubleshooting Guide](./troubleshooting-guide.md)** - Common issues and solutions
- **[Architecture Decisions](./architecture-decisions.md)** - ADRs for major system decisions

### Development Guides
- **[Setup Guide](../SETUP.md)** - Development environment setup
- **[Component Development](./CSS_Variable_Usage_Guide.md#component-implementation-patterns)** - How to build new components
- **[Token Management](../src/tokens/CSS_Variable_Pipeline_Documentation.md#extending-the-system)** - Adding and modifying design tokens

## Design Token Categories

### Colors (189 semantic variables)
```css
/* 6 Official Categories */
--Color-Base-*        /* Neutral colors */
--Color-Primary-*     /* Brand colors */
--Color-Success-*     /* Success states */
--Color-Warning-*     /* Warning states */
--Color-Error-*       /* Error states */
--Color-Info-*        /* Info states */
```

### Spacing (6 variables)
```css
--Spacing-0           /* 0px */
--Spacing-1           /* 16px */
--Spacing-2           /* 24px */
--Spacing-3           /* 32px */
--Spacing-4           /* 40px */
--Spacing-5           /* 48px */
```

### Borders (14 variables)
```css
--border-border-radius-*  /* Border radius values */
--border-border-width-*   /* Border width values */
```

### Focus (1 variable)
```css
--Color-Focus-focus       /* Primary focus color */
```

## Color Modes

The system supports automatic color mode switching:

### Available Modes
- **Light Mode** (default) - `:root`
- **Dark Mode** - `[data-mode="dark-mode"]`
- **High Contrast Light** - `[data-mode="hc-light-mode"]`
- **High Contrast Dark** - `[data-mode="hc-dark-mode"]`

### Runtime Switching
```typescript
import { injectAllTokenCssVars } from '../tokens/inject-css-vars';

// Switch modes dynamically
injectAllTokenCssVars('dark-mode');
injectAllTokenCssVars('hc-light-mode');
```

## Atomic Design Structure

### Foundation (Atoms)
- **Icons** (`<dive-icon>`) - Tabler icon system with 15+ icons
- **Typography** - Atkinson Hyperlegible Next font system
- **Design Tokens** - CSS variables for colors, spacing, borders
- **Token Pipeline** - Advanced W3C-compliant token architecture

### Molecules
- **Blueprint** (`<dive-blueprint>`) - Button-like element combining icon + text + styling atoms
- **Planned**: Button, Label, Chip - basic interactive elements

### Organisms  
- **Planned**: Alert, Notification, Card, Modal - complex components combining molecules

### Component Features
- ✅ **CSS Variable Integration** - All components use design tokens
- ✅ **Multi-mode Support** - Automatic color mode switching
- ✅ **TypeScript** - Full type safety
- ✅ **Accessibility** - WCAG 2.1 AA compliant
- ✅ **Testing Ready** - Structured for unit and integration tests
- ✅ **Storybook Integration** - Interactive documentation

## Development Workflow

### Building Design Tokens
```bash
# Generate all CSS variables
npm run build:tokens

# Development build with verbose output
npm run build:tokens:dev

# Dry run (validation only)
npm run build:tokens:dry
```

### Running Storybook
```bash
# Start development server
npm run dev

# Build static version
npm run build
```

### Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage
```

## Performance Metrics

### Build Performance
- **Processing Time**: 14ms for complete pipeline
- **Variables Generated**: 1,004 total across all modes
- **Files Written**: 10 CSS files + index files
- **Success Rate**: 100% (0 unresolved tokens)
- **Cache Efficiency**: 980 cache entries

### Runtime Performance
- **CSS Variable Resolution**: Native browser performance
- **Mode Switching**: ~1ms for 250+ variables
- **Bundle Size**: Optimized CSS output with no JavaScript overhead

## Browser Support

### CSS Variables
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 16+

### Web Components
- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Getting Help

### Documentation
1. Start with [CSS Variable Usage Guide](./CSS_Variable_Usage_Guide.md)
2. Check [Troubleshooting Guide](./troubleshooting-guide.md) for common issues
3. Review [Architecture Decisions](./architecture-decisions.md) for context

### Development Issues
1. Run `npm run build:tokens:dev --verbose` for detailed build output
2. Check generated CSS files in `src/tokens/css-vars/`
3. Validate token JSON syntax with build process
4. Test mode switching with runtime functions

### Storybook Examples
- **Token Pipeline Stories** - Live examples of all design tokens
- **Component Stories** - Interactive component documentation
- **Typography Stories** - Font system examples

## Contributing

### Adding New Components
1. Follow the Blueprint component pattern
2. Use semantic CSS variables exclusively
3. Implement all interaction states (hover, active, disabled)
4. Add Storybook stories and tests
5. Update documentation

### Modifying Design Tokens
1. Edit JSON files in `src/tokens/data/`
2. Run `npm run build:tokens:dev` to regenerate CSS
3. Test across all color modes
4. Update relevant documentation

### Submitting Changes
1. Ensure all tests pass
2. Update documentation as needed
3. Add entries to troubleshooting guide if applicable
4. Include Storybook stories for new features

## Version History

### Current: v1.0.0
- ✅ Complete CSS Variable Pipeline implementation
- ✅ 6 official color categories
- ✅ 4 color modes with automatic switching
- ✅ Icon and Blueprint component implementation
- ✅ Typography system with Atkinson Hyperlegible Next
- ✅ Comprehensive documentation system

### Next Release
- 🔄 Dynamic icon loading system
- 🔄 Additional semantic components
- 🔄 Enhanced accessibility features
- 🔄 Performance optimizations 