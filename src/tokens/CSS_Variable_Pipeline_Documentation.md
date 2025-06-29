# CSS Variable Pipeline Documentation

## Overview

This document describes the comprehensive CSS variable pipeline used in the Dive Design System. The system transforms structured JSON design tokens into CSS custom properties (variables) while supporting multiple color modes, semantic token references, and type-safe resolution.

## System Architecture

### Core Components

1. **Token Data Layer** (`src/tokens/data/`)
   - JSON files containing design tokens in W3C Design Token format
   - Organized in cascading layers with specific merge order
   - Supports token references using `{TokenPath}` syntax

2. **Processing Layer** (`src/tokens/`)
   - `processor.ts` - Loads and merges token JSON files
   - `resolver.ts` - Resolves token references with cycle detection
   - `inject-css-vars.ts` - Runtime CSS variable injection

3. **Build Layer** (`scripts/`)
   - `generate-css-variables.cjs` - Main build script
   - `css-formatter.cjs` - CSS formatting utilities
   - `token-resolver.cjs` - CommonJS token resolution

4. **Output Layer** (`src/tokens/css-vars/`)
   - Generated CSS files with CSS custom properties
   - Organized by theme and mode combinations
   - Includes index files for easy importing

## Token Structure & Format

### W3C Design Token Format
All tokens follow the W3C Design Token Community Group specification:

```json
{
  "Color": {
    "Primary": {
      "500": {
        "$type": "color",
        "$value": "#2c72e0"
      }
    }
  }
}
```

### Token Types Supported
- `color` - Color values (hex, rgb, hsl)
- `number` - Numeric values with optional units
- `boolean` - Boolean values
- `string` - String values

### Token Reference System
Tokens can reference other tokens using curly brace syntax:

```json
{
  "Base": {
    "Background": {
      "default": {
        "$type": "color",
        "$value": "{Color.Base.50}"
      }
    }
  }
}
```

## Cascading Layer System

### Layer Order (defined in `$metadata.json`)
1. `brand-theme/dive-theme` - Base theme colors and values
2. `color-modes/light-mode` - Light mode overrides
3. `color-modes/hc-light-mode` - High contrast light mode
4. `color-modes/dark-mode` - Dark mode overrides
5. `color-modes/hc-dark-mode` - High contrast dark mode
6. `components/component` - Semantic component tokens
7. `layouts/layout` - Layout-specific tokens

### Layer Structure

#### 1. Brand Theme Layer (`brand-theme/dive-theme.json`)
Contains base color palettes and foundational design values:

```json
{
  "Color": {
    "Base": {
      "0": { "$type": "color", "$value": "#ffffff" },
      "50": { "$type": "color", "$value": "#ffffff" },
      "100": { "$type": "color", "$value": "#ecedf0" },
      "200": { "$type": "color", "$value": "#c7cad1" }
    },
    "Primary": {
      "600": { "$type": "color", "$value": "#2c72e0" },
      "700": { "$type": "color", "$value": "#245db8" }
    }
  }
}
```

#### 2. Color Mode Layers (`color-modes/*.json`)
Map theme colors to mode-specific values using references:

```json
{
  "Base": {
    "50": { "$type": "color", "$value": "{Color.Base.50}" },
    "900": { "$type": "color", "$value": "{Color.Base.850}" }
  }
}
```

#### 3. Component Layer (`components/component.json`)
Semantic tokens that reference mode tokens:

```json
{
  "Color": {
    "Base": {
      "Background": {
        "default": { "$type": "color", "$value": "{Base.50}" },
        "hover": { "$type": "color", "$value": "{Base.100}" }
      }
    }
  }
}
```

## Processing Pipeline

### 1. Token Loading (`TokenProcessor`)

```typescript
class TokenProcessor {
  loadAllTokens(): void {
    // Load theme tokens
    this.tokens.theme = JSON.parse(fs.readFileSync('brand-theme/dive-theme.json'));
    
    // Load mode tokens
    const modeFiles = ['light-mode.json', 'dark-mode.json', ...];
    for (const file of modeFiles) {
      this.tokens.modes[modeName] = JSON.parse(fs.readFileSync(file));
    }
    
    // Load component and layout tokens
    this.tokens.component = JSON.parse(fs.readFileSync('components/component.json'));
    this.tokens.layout = JSON.parse(fs.readFileSync('layouts/layout.json'));
  }
}
```

### 2. Token Resolution (`TokenResolver`)

The resolver follows the cascade hierarchy with cycle detection:

```typescript
class TokenResolver {
  resolve(tokenPath: string, mode: string): TokenValue {
    // Resolve through cascade: layout → component → mode → theme
    let token = this.getTokenByPath(tokenPath, this.tokens.layout)
      || this.getTokenByPath(tokenPath, this.tokens.component)
      || this.getTokenByPath(tokenPath, this.tokens.modes[mode])
      || this.getTokenByPath(tokenPath, this.tokens.theme);
    
    // Resolve references recursively with cycle detection
    if (token.$value.startsWith('{') && token.$value.endsWith('}')) {
      const refPath = token.$value.slice(1, -1);
      return this.resolveWithCycleDetection(refPath, mode, visited);
    }
    
    return token;
  }
}
```

### 3. CSS Generation (`generate-css-variables.cjs`)

The build script processes each theme/mode combination:

```javascript
function processTokenSet({ theme, mode, tokenSet }) {
  const resolver = new TokenResolver({
    componentTokens: tokenSet,
    modeTokens: modeTokens,
    themeTokens: themeTokens
  });
  
  // Walk token tree and generate CSS variables
  function walk(obj, pathArr = []) {
    for (const key in obj) {
      if (obj[key].$value) {
        const value = resolver.resolveToken([...pathArr, key]);
        const cssVarName = toCssVarName([...pathArr, key]);
        cssLines.push(`  ${cssVarName}: ${formatCssValue(value, type)};`);
      } else if (typeof obj[key] === 'object') {
        walk(obj[key], [...pathArr, key]);
      }
    }
  }
  
  walk(tokenSet);
  return `${generateModeSelector(mode)} {\n${cssLines.join('\n')}\n}`;
}
```

## CSS Output Format

### Variable Naming Convention
Token paths are converted to CSS variable names:

- `Color.Base.Background.default` → `--Color-Base-Background-default`
- Spaces are replaced with hyphens
- Dot notation becomes hyphen-separated

### Mode Selectors
Different modes use attribute selectors:

```css
:root {
  --Color-Base-Background-default: #ffffff;
}

[data-mode="dark-mode"] {
  --Color-Base-Background-default: #000000;
}

[data-mode="hc-light-mode"] {
  --Color-Base-Background-default: #ffffff;
}
```

### Generated File Structure
```
src/tokens/css-vars/
├── index.css                    # Global imports
└── dive-theme/
    ├── index.css               # Theme imports
    ├── component.css           # Component tokens
    └── layout.css              # Layout tokens (optional)
```

## Runtime CSS Injection

### Dynamic Mode Switching
The `inject-css-vars.ts` module provides runtime token injection:

```typescript
export function injectAllTokenCssVars(mode: string = 'light') {
  const cssVars = resolvedTokens['dive']?.[mode] || {};
  let style = document.createElement('style');
  style.id = 'dive-token-css-vars';
  style.innerHTML = `:root {\n${Object.entries(cssVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')}\n}`;
  document.head.appendChild(style);
}
```

## Error Handling & Validation

### Cycle Detection
The resolver prevents infinite loops in token references:

```typescript
private resolveWithCycleDetection(tokenPath: string, mode: string, visited: Set<string>) {
  if (visited.has(tokenPath)) {
    throw new TokenValidationError(
      `Circular reference detected: ${Array.from(visited).concat(tokenPath).join(' -> ')}`
    );
  }
  visited.add(tokenPath);
  // ... resolve logic
}
```

### Missing Reference Validation
Invalid token references are caught and reported:

```typescript
if (!token) {
  throw new TokenValidationError(
    `Token not found: ${tokenPath} (mode: ${mode})`,
    tokenPath
  );
}
```

## Build Performance

### Metrics Collected
- Total variables generated
- Files written
- Processing time
- Unresolved tokens count
- Duplicate variable detection

### Optimization Features
- Parallel processing of theme/mode combinations
- Dry-run mode for testing
- Verbose logging for debugging
- Watch mode for development

## Usage Examples

### Building CSS Variables
```bash
# Generate all themes and modes
node scripts/generate-css-variables.cjs

# Generate specific theme
node scripts/generate-css-variables.cjs --theme dive-theme

# Dry run (no file writes)
node scripts/generate-css-variables.cjs --dry-run

# Verbose output
node scripts/generate-css-variables.cjs --verbose
```

### Using in Components
```css
.button {
  background-color: var(--Color-Primary-Background-default);
  color: var(--Color-Primary-Foreground-default);
  border: var(--border-border-width-default) solid var(--Color-Primary-Border-default);
}

.button:hover {
  background-color: var(--Color-Primary-Background-hover);
  color: var(--Color-Primary-Foreground-hover);
}
```

### Runtime Mode Switching
```typescript
import { injectAllTokenCssVars } from './src/tokens/inject-css-vars';

// Switch to dark mode
injectAllTokenCssVars('dark-mode');

// Switch to high contrast light mode
injectAllTokenCssVars('hc-light-mode');
```

## Key Features

1. **Type Safety** - TypeScript interfaces ensure token path validity
2. **Multi-Mode Support** - Light, dark, and high-contrast variants
3. **Semantic Tokens** - Component-level abstractions over raw values
4. **Reference Resolution** - Automatic token reference resolution
5. **Cycle Detection** - Prevents infinite reference loops
6. **Performance Monitoring** - Build-time metrics and optimization
7. **Runtime Flexibility** - Dynamic mode switching capabilities
8. **Validation** - Comprehensive error handling and reporting

## Extending the System

### Adding New Modes
1. Create new JSON file in `color-modes/`
2. Add mode to `$metadata.json` tokenSetOrder
3. Reference existing theme tokens using `{TokenPath}` syntax
4. Rebuild CSS variables

### Adding New Token Types
1. Extend `formatCssValue()` in `css-formatter.cjs`
2. Add type-specific validation in `TokenProcessor`
3. Update TypeScript interfaces in `types.ts`

### Custom Token Sets
1. Add new directory under `data/`
2. Update `$metadata.json` with new token set order
3. Modify build script to include new token set
4. Create resolution logic in `TokenResolver`

This pipeline provides a robust, scalable foundation for design token management with strong type safety, comprehensive validation, and flexible runtime capabilities. 