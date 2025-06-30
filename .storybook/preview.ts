import type { Preview } from '@storybook/web-components';

// Import design tokens
import '../src/tokens/css-vars/index.css';

// Import component setup to ensure proper registration
import './setup';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst'
    },
    docs: {
      extractComponentDescription: (component: any, { notes }: { notes?: any }) => {
        if (notes) {
          return typeof notes === 'string' ? notes : notes.markdown || notes.text;
        }
        return null;
      },
    },
    backgrounds: {
      default: 'base',
      values: [
        {
          name: 'base',
          value: 'var(--Color-Base-Background-default)',
          title: 'Base Background (Design Token)'
        },
        {
          name: 'subtle',
          value: 'var(--Color-Base-Subtle-Background-default)', 
          title: 'Subtle Background (Design Token)'
        }
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
        wide: {
          name: 'Wide',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'autocomplete-valid',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-order-semantics',
            enabled: true,
          },
          {
            id: 'form-field-multiple-labels',
            enabled: true,
          },
          {
            id: 'frame-title',
            enabled: true,
          },
          {
            id: 'image-alt',
            enabled: true,
          },
          {
            id: 'input-image-alt',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'link-name',
            enabled: true,
          },
        ],
      },
      manual: false,
    },
  },
  globalTypes: {
    designTheme: {
      name: 'Theme',
      description: 'Choose design theme variant',
      defaultValue: 'dive-theme',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'dive-theme', title: 'Dive Theme' },
          // Future themes will be added here:
          // { value: 'enterprise-theme', title: 'Enterprise Theme' },
          // { value: 'consumer-theme', title: 'Consumer Theme' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    colorMode: {
      name: 'Mode',
      description: 'Choose color mode for the selected theme',
      defaultValue: 'light-mode',
      toolbar: {
        icon: 'contrast',
        items: [
          { value: 'light-mode', title: 'Light Mode' },
          { value: 'dark-mode', title: 'Dark Mode' },
          { value: 'hc-light-mode', title: 'High Contrast Light' },
          { value: 'hc-dark-mode', title: 'High Contrast Dark' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    density: {
      name: 'Density',
      description: 'Component spacing density',
      defaultValue: 'medium',
      toolbar: {
        icon: 'zoom',
        items: [
          { value: 'compact', title: 'Compact', left: '📱' },
          { value: 'medium', title: 'Medium', left: '💻' },
          { value: 'comfortable', title: 'Comfortable', left: '🖥️' }
        ],
        showName: true
      }
    },
    motion: {
      name: 'Motion',
      description: 'Animation preferences',
      defaultValue: 'full',
      toolbar: {
        icon: 'play',
        items: [
          { value: 'full', title: 'Full Motion' },
          { value: 'reduced', title: 'Reduced Motion' },
          { value: 'none', title: 'No Motion' }
        ],
        showName: true
      }
    }
  },
  decorators: [
    // Unified Theme and Color Mode decorator
    (story, context) => {
      const { designTheme, colorMode } = context.globals;
      
      // Apply attributes to the document root for the iframe context
      // Use setTimeout to ensure it applies after the story is rendered
      setTimeout(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', designTheme || 'dive-theme');
        root.setAttribute('data-mode', colorMode || 'light-mode');
      }, 0);
      
      return story();
    },
  ],
};

export default preview;
