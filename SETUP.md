# Installation and Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd /Users/A200301419/Documents/storybook/ds-dive
   npm install
   ```

2. **Build Design Tokens**
   ```bash
   npm run tokens:build
   ```

3. **Start Storybook**
   ```bash
   npm run storybook
   ```

4. **Start Development Server (Optional)**
   ```bash
   npm run dev
   ```

## Available Commands

- `npm run dev` - Start Vite development server
- `npm run build` - Build the design system for production
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for deployment
- `npm run test` - Run component tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run tokens:build` - Build design tokens from JSON to CSS
- `npm run tokens:watch` - Watch for token changes and rebuild
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## Architecture Overview

```
ds-dive/
├── .storybook/          # Storybook configuration
├── public/              # Static assets (icons, etc.)
├── src/
│   ├── components/      # Web Components
│   │   ├── _Blueprint/  # Reference implementation
│   │   └── Icon/        # Icon component
│   ├── stories/         # Documentation stories
│   ├── tokens/          # Design token system
│   │   ├── data/        # Source token files (JSON)
│   │   ├── css-vars/    # Generated CSS variables
│   │   └── dist/        # Processed token outputs
│   └── test/           # Test utilities
├── scripts/            # Build scripts
└── docs/              # Additional documentation
```

## Key Features Implemented

✅ **State-of-the-art Storybook 8 setup** with optimized configuration
✅ **Web Components with Lit** for framework-agnostic components  
✅ **Design Token system** with W3C compliance and CSS custom properties
✅ **Tabler Icons integration** with performance optimization
✅ **TypeScript** with full type safety and auto-completion
✅ **Testing setup** with Vitest and accessibility testing
✅ **Accessibility first** with WCAG 2.1 AA compliance
✅ **Performance optimization** with tree-shaking and modern tooling
✅ **Multi-theme support** (light, dark, high contrast variants)
✅ **Blueprint component** as comprehensive reference implementation
✅ **Icon component** with semantic color and sizing systems
✅ **Documentation** with auto-generated docs and comprehensive stories

## Next Steps

1. **Install dependencies** and start Storybook
2. **Add your Figma component URLs** to create new components
3. **Customize design tokens** in `src/tokens/data/` to match your brand
4. **Extend the system** by adding new components following the Blueprint pattern

## Figma Integration Workflow

When ready to add components from Figma:

1. Provide the Figma component URL
2. The system will analyze the component using the MCP Figma integration
3. Generate a complete specification following the pattern in the documentation
4. Implement the component using the Blueprint as reference
5. Add comprehensive Storybook stories and tests

This setup provides the foundation for a scalable, enterprise-ready design system with modern tooling and best practices.
