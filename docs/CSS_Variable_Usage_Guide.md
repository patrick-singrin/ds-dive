# CSS Variable Usage Guide

## Overview

This guide explains how to use the Dive Design System's CSS Variable Pipeline in your components. Our system transforms structured JSON design tokens into CSS custom properties (variables) while supporting multiple color modes, semantic token references, and type-safe resolution.

## Quick Start

### 1. Import CSS Variables

```css
/* In your component or main CSS file */
@import '../tokens/css-vars/index.css';
```

### 2. Use Variables in Component Styles

```css
.my-component {
  background-color: var(--Color-Primary-Background-default);
  color: var(--Color-Primary-Foreground-default);
  border: 1px solid var(--Color-Primary-Border-default);
  border-radius: var(--border-border-radius-md);
  padding: var(--Spacing-3) var(--Spacing-4);
}

.my-component:hover {
  background-color: var(--Color-Primary-Background-hover);
  color: var(--Color-Primary-Foreground-hover);
}
```

## Official Color Categories

The design system provides **6 official color categories**:

### 1. **Base** - Neutral Colors
```css
/* Backgrounds */
--Color-Base-Background-default     /* Main background */
--Color-Base-Background-hover       /* Hover state */
--Color-Base-Background-active      /* Active/pressed state */
--Color-Base-Background-disabled    /* Disabled state */

/* Foregrounds */
--Color-Base-Foreground-default     /* Main text color */
--Color-Base-Foreground-hover       /* Hover text color */
--Color-Base-Foreground-active      /* Active text color */
--Color-Base-Foreground-disabled    /* Disabled text color */

/* Subtle variants */
--Color-Base-Subtle-Background-default
--Color-Base-Subtle-Foreground-default

/* Primary variants */
--Color-Base-Primary-Background-default
--Color-Base-Primary-Foreground-default

/* Borders */
--Color-Base-Border-default
--Color-Base-Border-hover
--Color-Base-Border-active
--Color-Base-Border-disabled
```

### 2. **Primary** - Brand Colors
```css
--Color-Primary-Background-default
--Color-Primary-Foreground-default
--Color-Primary-Subtle-Background-default
--Color-Primary-Primary-Background-default
--Color-Primary-Border-default
/* ... and all interaction states (hover, active, disabled) */
```

### 3. **Success** - Success/Positive States
```css
--Color-Success-Background-default
--Color-Success-Foreground-default
--Color-Success-Subtle-Background-default
--Color-Success-Primary-Background-default
--Color-Success-Border-default
/* ... and all interaction states */
```

### 4. **Warning** - Warning/Caution States
```css
--Color-Warning-Background-default
--Color-Warning-Foreground-default
--Color-Warning-Subtle-Background-default
--Color-Warning-Primary-Background-default
--Color-Warning-Border-default
/* ... and all interaction states */
```

### 5. **Error** - Error/Danger States
```css
--Color-Error-Background-default
--Color-Error-Foreground-default
--Color-Error-Subtle-Background-default
--Color-Error-Primary-Background-default
--Color-Error-Border-default
/* ... and all interaction states */
```

### 6. **Info** - Informational States
```css
--Color-Info-Background-default
--Color-Info-Foreground-default
--Color-Info-Subtle-Background-default
--Color-Info-Primary-Background-default
--Color-Info-Border-default
/* ... and all interaction states */
```

## Non-Color Variables

### Spacing
```css
--Spacing-0    /* 0px */
--Spacing-1    /* 16px */
--Spacing-2    /* 24px */
--Spacing-3    /* 32px */
--Spacing-4    /* 40px */
--Spacing-5    /* 48px */
```

### Border Radius
```css
--border-border-radius-none     /* 0 */
--border-border-radius-sm       /* 4px */
--border-border-radius-md       /* 8px */
--border-border-radius-md-focus /* 12px */
--border-border-radius-lg       /* 16px */
--border-border-radius-xl       /* 32px */
--border-border-radius-full     /* 999px */
```

### Border Width
```css
--border-border-width-none      /* 0 */
--border-border-width-default   /* 1px */
--border-border-width-hover     /* 2px */
--border-border-width-active    /* 2px */
--border-border-width-selected  /* 3px */
--border-border-width-disabled  /* 1px */
```

### Focus
```css
--Color-Focus-focus  /* Primary focus color */
```

## Component Implementation Patterns

> **Note**: The following examples show molecule-level components that combine foundation atoms (colors, typography, spacing) into interactive elements.

### 1. Button Molecule Example

```css
.button {
  /* Use semantic color variables */
  background-color: var(--Color-Primary-Primary-Background-default);
  color: var(--Color-Primary-Primary-Foreground-default);
  border: var(--border-border-width-default) solid var(--Color-Primary-Border-default);
  border-radius: var(--border-border-radius-md);
  padding: var(--Spacing-2) var(--Spacing-3);
  
  /* Interactive states */
  transition: all 0.2s ease;
}

.button:hover {
  background-color: var(--Color-Primary-Primary-Background-hover);
  color: var(--Color-Primary-Primary-Foreground-hover);
  border-color: var(--Color-Primary-Border-hover);
}

.button:active {
  background-color: var(--Color-Primary-Primary-Background-active);
  color: var(--Color-Primary-Primary-Foreground-active);
  border-color: var(--Color-Primary-Border-active);
}

.button:disabled {
  background-color: var(--Color-Primary-Primary-Background-disabled);
  color: var(--Color-Primary-Primary-Foreground-disabled);
  border-color: var(--Color-Primary-Border-disabled);
}

/* Variant styles */
.button--secondary {
  background-color: var(--Color-Base-Subtle-Background-default);
  color: var(--Color-Base-Subtle-Foreground-default);
  border-color: var(--Color-Base-Border-default);
}

.button--success {
  background-color: var(--Color-Success-Primary-Background-default);
  color: var(--Color-Success-Primary-Foreground-default);
  border-color: var(--Color-Success-Border-default);
}

.button--warning {
  background-color: var(--Color-Warning-Primary-Background-default);
  color: var(--Color-Warning-Primary-Foreground-default);
  border-color: var(--Color-Warning-Border-default);
}

.button--error {
  background-color: var(--Color-Error-Primary-Background-default);
  color: var(--Color-Error-Primary-Foreground-default);
  border-color: var(--Color-Error-Border-default);
}
```

### 2. Input Molecule Example

```css
.input {
  background-color: var(--Color-Base-Background-default);
  color: var(--Color-Base-Foreground-default);
  border: var(--border-border-width-default) solid var(--Color-Base-Border-default);
  border-radius: var(--border-border-radius-sm);
  padding: var(--Spacing-2) var(--Spacing-3);
}

.input:hover {
  border-color: var(--Color-Base-Border-hover);
}

.input:focus {
  outline: var(--border-border-width-hover) solid var(--Color-Focus-focus);
  outline-offset: 2px;
  border-color: var(--Color-Primary-Border-default);
}

.input:disabled {
  background-color: var(--Color-Base-Background-disabled);
  color: var(--Color-Base-Foreground-disabled);
  border-color: var(--Color-Base-Border-disabled);
}

/* State variants */
.input--error {
  border-color: var(--Color-Error-Border-default);
}

.input--success {
  border-color: var(--Color-Success-Border-default);
}
```

### 3. Card Organism Example

```css
.card {
  background-color: var(--Color-Base-Background-default);
  color: var(--Color-Base-Foreground-default);
  border: var(--border-border-width-default) solid var(--Color-Base-Border-default);
  border-radius: var(--border-border-radius-lg);
  padding: var(--Spacing-4);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card__header {
  color: var(--Color-Base-Primary-Foreground-default);
  border-bottom: var(--border-border-width-default) solid var(--Color-Base-Border-default);
  margin-bottom: var(--Spacing-3);
  padding-bottom: var(--Spacing-2);
}

.card__content {
  color: var(--Color-Base-Foreground-default);
}

.card--info {
  border-color: var(--Color-Info-Border-default);
  background-color: var(--Color-Info-Subtle-Background-default);
}

.card--warning {
  border-color: var(--Color-Warning-Border-default);
  background-color: var(--Color-Warning-Subtle-Background-default);
}
```

## Mode Switching

The system supports multiple color modes that automatically switch variable values:

### Available Modes
- **Light Mode** (default): `:root` 
- **Dark Mode**: `[data-mode="dark-mode"]`
- **High Contrast Light**: `[data-mode="hc-light-mode"]`
- **High Contrast Dark**: `[data-mode="hc-dark-mode"]`

### Runtime Mode Switching

```typescript
import { injectAllTokenCssVars } from '../tokens/inject-css-vars';

// Switch to dark mode
injectAllTokenCssVars('dark-mode');

// Switch to high contrast light mode
injectAllTokenCssVars('hc-light-mode');

// Switch back to light mode
injectAllTokenCssVars('light-mode');
```

### Manual Mode Switching (HTML)

```html
<!-- Default light mode -->
<body>
  <div class="my-component">Light mode content</div>
</body>

<!-- Dark mode -->
<body data-mode="dark-mode">
  <div class="my-component">Dark mode content</div>
</body>

<!-- High contrast modes -->
<body data-mode="hc-light-mode">
  <div class="my-component">High contrast light content</div>
</body>

<body data-mode="hc-dark-mode">
  <div class="my-component">High contrast dark content</div>
</body>
```

## Best Practices

### 1. Always Use Semantic Variables
```css
/* ✅ Good - semantic variables */
background-color: var(--Color-Primary-Background-default);
color: var(--Color-Primary-Foreground-default);

/* ❌ Bad - hardcoded colors */
background-color: #2c72e0;
color: #ffffff;
```

### 2. Provide Fallback Values
```css
/* ✅ Good - with fallbacks */
background-color: var(--Color-Primary-Background-default, #2c72e0);
border-radius: var(--border-border-radius-md, 8px);

/* ⚠️ Acceptable - without fallbacks (if system is complete) */
background-color: var(--Color-Primary-Background-default);
```

### 3. Use Consistent Interaction States
```css
.component {
  /* Always implement all states */
  background-color: var(--Color-Primary-Background-default);
}

.component:hover {
  background-color: var(--Color-Primary-Background-hover);
}

.component:active {
  background-color: var(--Color-Primary-Background-active);
}

.component:disabled {
  background-color: var(--Color-Primary-Background-disabled);
}
```

### 4. Use Appropriate Color Categories
```css
/* ✅ Good - appropriate semantic usage */
.success-message {
  background-color: var(--Color-Success-Subtle-Background-default);
  color: var(--Color-Success-Foreground-default);
  border-color: var(--Color-Success-Border-default);
}

.error-message {
  background-color: var(--Color-Error-Subtle-Background-default);
  color: var(--Color-Error-Foreground-default);
  border-color: var(--Color-Error-Border-default);
}

/* ❌ Bad - wrong semantic usage */
.success-message {
  background-color: var(--Color-Error-Background-default); /* Wrong category */
}
```

### 5. Layer CSS Properly
```css
/* Component should define variables at host level */
:host {
  /* Local overrides for component-specific tokens */
  --local-background: var(--Color-Primary-Background-default);
  --local-foreground: var(--Color-Primary-Foreground-default);
  --local-border: var(--Color-Primary-Border-default);
}

.component-element {
  background-color: var(--local-background);
  color: var(--local-foreground);
  border-color: var(--local-border);
}
```

## Variable Naming Convention

All CSS variables follow this pattern:
```
--{Category}-{Subcategory}-{Property}-{State}
```

Examples:
- `--Color-Primary-Background-default`
- `--Color-Base-Foreground-hover`
- `--border-border-radius-md`
- `--Spacing-3`

## Development Workflow

### 1. Building CSS Variables
```bash
# Generate all CSS variables
npm run build:tokens

# Development build with verbose output
npm run build:tokens:dev

# Dry run (no files written)
npm run build:tokens:dry
```

### 2. Validation
The build process automatically validates:
- ✅ Token reference resolution
- ✅ Circular dependency detection
- ✅ CSS variable name formatting
- ✅ Mode consistency across themes

### 3. Performance
- **1004 total variables** across all modes
- **14ms build time** for complete pipeline
- **0 unresolved tokens** guaranteed
- **980 cache entries** for optimal performance

## Troubleshooting

### Common Issues

#### Variables Not Updating
```css
/* Ensure CSS is imported */
@import '../tokens/css-vars/index.css';

/* Check mode selector is correct */
[data-mode="dark-mode"] {
  /* Variables here override :root */
}
```

#### Missing Variables
```bash
# Check if tokens were built
npm run build:tokens:dev

# Verify variable exists in generated CSS
grep "variable-name" src/tokens/css-vars/**/*.css
```

#### Invalid Variable Names
Variables with spaces are automatically converted:
- `"Subtle Background"` → `--Color-Base-Subtle-Background-default`

### Debugging
1. Use browser DevTools to inspect computed CSS variables
2. Check the generated CSS files in `src/tokens/css-vars/`
3. Validate token JSON syntax with build output
4. Test mode switching with runtime functions

## Migration Guide

### From Hardcoded Colors
```css
/* Before */
.button {
  background-color: #2c72e0;
  color: #ffffff;
  border: 1px solid #245db8;
}

/* After */
.button {
  background-color: var(--Color-Primary-Primary-Background-default);
  color: var(--Color-Primary-Primary-Foreground-default);
  border: var(--border-border-width-default) solid var(--Color-Primary-Border-default);
}
```

### From Old CSS Variables
```css
/* Before (old system) */
.button {
  background-color: var(--primary-color);
  color: var(--text-color);
}

/* After (new system) */
.button {
  background-color: var(--Color-Primary-Primary-Background-default);
  color: var(--Color-Primary-Primary-Foreground-default);
}
```

## Support

- **Documentation**: See `src/tokens/CSS_Variable_Pipeline_Documentation.md`
- **Troubleshooting**: See `docs/troubleshooting-guide.md`
- **Storybook**: View live examples in Token Pipeline stories
- **Build Issues**: Run `npm run build:tokens:dev --verbose` for detailed output 