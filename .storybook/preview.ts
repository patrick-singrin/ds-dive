import type { Preview } from '@storybook/web-components';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

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
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1d222c',
        },
        {
          name: 'surface',
          value: '#ecedf0',
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
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', left: '🌞' },
          { value: 'dark', title: 'Dark', left: '🌙' },
          { value: 'hc-light', title: 'High Contrast Light', left: '🔆' },
          { value: 'hc-dark', title: 'High Contrast Dark', left: '🌚' },
        ],
        showName: true,
      },
    },
    iconTheme: {
      name: 'Icon Color',
      description: 'Global icon color theme',
      defaultValue: 'base',
      toolbar: {
        icon: 'component',
        items: [
          { value: 'base', title: 'Base Icons' },
          { value: 'primary', title: 'Primary Icons' },
          { value: 'success', title: 'Success Icons' },
          { value: 'warning', title: 'Warning Icons' },
          { value: 'error', title: 'Error Icons' },
          { value: 'info', title: 'Info Icons' }
        ],
        showName: true
      }
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
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
        'hc-light': 'hc-light',
        'hc-dark': 'hc-dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
