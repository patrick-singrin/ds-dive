// Dive Design System - Main Entry Point

// Export all components
export * from './components';

// Export design tokens and utilities
export * from './tokens';

// Export component styles (for custom integration)
export { default as tokens } from './tokens/css-vars/index.css?inline';

// Version information
export const VERSION = '1.0.0';

// Design system metadata
export const DESIGN_SYSTEM = {
  name: 'Dive Design System',
  version: VERSION,
  description: 'Modern Web Components with Storybook and Design Tokens',
  components: ['dive-blueprint', 'dive-icon'],
  frameworks: ['lit', 'stencil', 'react', 'vue', 'angular', 'vanilla'],
  features: [
    'Web Components',
    'Design Tokens',
    'Accessibility (WCAG 2.1 AA)',
    'TypeScript',
    'Framework Agnostic',
    'Storybook Integration',
    'Performance Optimized'
  ]
} as const;

// Auto-register all components when imported
if (typeof window !== 'undefined' && 'customElements' in window) {
  // Import components to register them
  import('./components/_Blueprint/_Blueprint');
  import('./components/Icon/Icon');
}
