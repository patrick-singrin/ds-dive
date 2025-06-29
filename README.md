# Dive Design System

A modern, accessible, and performant design system built with Web Components, Storybook, and Design Tokens.

## 🚀 Features

- **Web Components**: Framework-agnostic components built with Lit
- **Design Tokens**: W3C-compliant design token system with CSS custom properties
- **Storybook 8**: Comprehensive component documentation and testing
- **Accessibility**: WCAG 2.1 AA compliance built-in
- **TypeScript**: Full type safety and developer experience
- **Performance**: Optimized for modern browsers with tree-shaking support
- **Tabler Icons**: 5,880+ beautiful SVG icons integrated seamlessly

## 📋 Quick Start

### Installation

```bash
npm install @dive/design-system
```

### Usage

#### Vanilla HTML/JS
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@dive/design-system/dist/styles/index.css">
</head>
<body>
  <dive-blueprint variant="primary" text="Hello World"></dive-blueprint>
  <dive-icon name="home" size="medium" color="primary"></dive-icon>
  
  <script type="module">
    import '@dive/design-system';
  </script>
</body>
</html>
```

#### React
```jsx
import '@dive/design-system';
import '@dive/design-system/dist/styles/index.css';

function App() {
  return (
    <div>
      <dive-blueprint variant="primary" text="Hello World" />
      <dive-icon name="home" size="medium" color="primary" />
    </div>
  );
}
```

#### Vue
```vue
<template>
  <div>
    <dive-blueprint variant="primary" text="Hello World" />
    <dive-icon name="home" size="medium" color="primary" />
  </div>
</template>

<script>
import '@dive/design-system';
import '@dive/design-system/dist/styles/index.css';
</script>
```

## 🎨 Design Tokens

The design system uses a comprehensive token system based on the W3C Design Tokens specification:

### Color System
```css
/* Primary colors */
--Color-Primary-Primary-Background-default: #2c72e0;
--Color-Primary-Primary-Foreground-default: #ffffff;

/* Base colors */
--Color-Base-Background-default: #ffffff;
--Color-Base-Foreground-default: #1d222c;
```

### Spacing Scale
```css
--Spacing-1: 4px;
--Spacing-2: 8px;
--Spacing-3: 10px;
--Spacing-4: 12px;
--Spacing-5: 16px;
```

### Typography
```css
--Typography-Body-md-size: 16px;
--Typography-Body-md-weight: 400;
--Typography-Body-md-line-height: 1.5;
```

## 🧩 Components

### Blueprint Component
A comprehensive reference implementation demonstrating all design system patterns.

```html
<dive-blueprint 
  variant="primary" 
  size="medium"
  text="Click me"
  icon="check"
  ?disabled="false">
</dive-blueprint>
```

### Icon Component
Tabler Icons integration with design token support.

```html
<dive-icon 
  name="home" 
  size="medium" 
  color="primary"
  aria-label="Home">
</dive-icon>
```

## 🎭 Theming

The design system supports multiple themes:

- **Light Mode** (default)
- **Dark Mode**
- **High Contrast Light**
- **High Contrast Dark**

### Theme Switching
```javascript
import { setTheme, THEMES } from '@dive/design-system';

// Switch to dark theme
setTheme(THEMES.DARK);

// Switch to high contrast light
setTheme(THEMES.HC_LIGHT);
```

### Custom Themes
Override CSS custom properties to create custom themes:

```css
:root {
  --Color-Primary-Primary-Background-default: #your-color;
  --Color-Primary-Primary-Foreground-default: #your-text-color;
}
```

## 🧪 Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup
```bash
# Install dependencies
npm install

# Build design tokens
npm run build:tokens

# Start Storybook
npm run storybook

# Run tests
npm test

# Build for production
npm run build
```

## 🚀 Deployment

### Netlify (Recommended)
Automatic deployment configured via `netlify.toml`:

1. **Connect repository** to Netlify
2. **Auto-detected settings**: Build command and publish directory
3. **Deploy**: Automatic on push to main branch

**Build Configuration**:
- **Command**: `npm run build` (builds Storybook)
- **Directory**: `storybook-static`
- **Node Version**: 18 (stable)

### Other Platforms
- **Vercel**: `npm run build` → deploy `storybook-static/`
- **GitHub Pages**: Use Actions to build and deploy
- **Static Hosting**: Upload `storybook-static/` contents

### Adding New Components
1. Create component directory in `src/components/YourComponent/`
2. Implement component in `YourComponent.ts`
3. Create stories in `YourComponent.stories.ts`
4. Add tests in `YourComponent.test.ts`
5. Export from `src/components/index.ts`

## 📊 Performance

- **Bundle Size**: Individual components <10KB gzipped
- **Build Time**: 2-4x faster with Vite vs Webpack
- **Runtime**: Optimized Shadow DOM and CSS custom properties
- **Tree Shaking**: Automatic dead code elimination

## ♿ Accessibility

All components meet WCAG 2.1 AA standards:

- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ High contrast mode support
- ✅ Focus management
- ✅ ARIA attributes
- ✅ Color contrast compliance

## 📚 Documentation

- **Storybook**: Comprehensive component documentation
- **API Docs**: Auto-generated TypeScript documentation
- **Design Guidelines**: Token usage and patterns
- **Accessibility Guide**: Implementation best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Include comprehensive tests
- Update Storybook documentation
- Ensure accessibility compliance
- Follow semantic versioning

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Storybook Documentation](./storybook-static/index.html)
- **Issues**: [GitHub Issues](https://github.com/company/dive-design-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/company/dive-design-system/discussions)

---

Built with ❤️ by the Dive Design Team
