import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

// Import and register the component
import './Icon';
import type { DiveIcon } from './Icon';

// Ensure the custom element is defined - the import above should handle registration
// If it's still not registered, log a warning
if (!customElements.get('dive-icon')) {
  console.warn('dive-icon custom element not registered. Component may not render properly.');
}

const meta: Meta<DiveIcon> = {
  title: 'Design System/Components/Icon',
  component: 'dive-icon',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Icon Component

The Icon component provides seamless integration with Tabler Icons, offering 5,880+ high-quality SVG icons with consistent design and performance optimization.

## Features

- **5,880+ Tabler Icons**: Complete icon library with 24x24 grid consistency
- **Design Token Integration**: Sizing and coloring through CSS custom properties
- **Performance Optimized**: Lightweight SVG rendering with tree-shaking support
- **Accessibility First**: Proper ARIA attributes and screen reader support
- **Framework Agnostic**: Works with any frontend framework
- **Interactive Support**: Click handling and keyboard navigation

## Design Tokens Used

- \`--icon-size-*\`: Consistent sizing scale (small: 16px, medium: 24px, large: 32px, xlarge: 48px)
- \`--icon-color-*\`: Semantic color system using official 6 categories (base, primary, success, warning, error, info)
- \`--Color-*\`: Integration with global color system

## Performance Benefits

- **Tree Shaking**: Only used icons are included in bundles
- **SVG Optimization**: Minimal DOM footprint with optimized rendering
- **Lazy Loading**: Support for dynamic icon loading (future enhancement)
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: [
        'home', 'user', 'settings', 'check', 'x', 'plus', 'minus',
        'chevron-right', 'chevron-left', 'chevron-up', 'chevron-down',
        'alert-triangle', 'info', 'heart', 'star'
      ],
      description: 'Icon name from Tabler Icons library',
      table: {
        category: 'Content'
      }
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'xlarge'],
      description: 'Size variant using design tokens',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'medium' }
      }
    },
    color: {
      control: { type: 'select' },
      options: ['', 'base', 'primary', 'success', 'warning', 'error', 'info'],
      description: 'Color variant from official 6-category design token system',
      table: {
        category: 'Appearance'
      }
    },
    interactive: {
      control: { type: 'boolean' },
      description: 'Whether the icon is clickable with hover states',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' }
      }
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the icon is in loading state',
      table: {
        category: 'State',
        defaultValue: { summary: 'false' }
      }
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label for accessibility (required for interactive icons)',
      table: {
        category: 'Accessibility'
      }
    },
    ariaHidden: {
      control: { type: 'text' },
      description: 'String value for aria-hidden attribute (use "true" to hide from screen readers)',
      table: {
        category: 'Accessibility',
        defaultValue: { summary: 'null' }
      }
    }
  },
  args: {
    name: 'home',
    size: 'medium',
    interactive: false,
    loading: false,
    ariaHidden: null
  }
};

export default meta;
type Story = StoryObj<DiveIcon>;

/**
 * Default interactive example with configurable properties
 */
export const Interactive: Story = {
  args: {
    name: 'home',
    size: 'medium',
    color: 'primary'
  },
  render: (args) => html`
    <dive-icon
      name="${args.name}"
      size="${args.size}"
      color="${ifDefined(args.color)}"
      ?interactive="${args.interactive}"
      ?loading="${args.loading}"
      aria-label="${ifDefined(args.ariaLabel)}"
      aria-hidden="${ifDefined(args.ariaHidden)}"
    ></dive-icon>
  `
};

/**
 * All available size variants
 */
export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 2rem; align-items: center;">
      <div style="text-align: center;">
        <dive-icon name="home" size="small"></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Small (16px)</div>
      </div>
      <div style="text-align: center;">
        <dive-icon name="home" size="medium"></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Medium (24px)</div>
      </div>
      <div style="text-align: center;">
        <dive-icon name="home" size="large"></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Large (32px)</div>
      </div>
      <div style="text-align: center;">
        <dive-icon name="home" size="xlarge"></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">XLarge (48px)</div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Size variants demonstrating the consistent sizing scale. All sizes maintain crisp rendering and proper proportions.'
      }
    }
  }
};

/**
 * Color variants using official 6-category design token system
 */
export const Colors: Story = {
  render: () => html`
    <div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(3, 1fr); text-align: center;">
      <div>
        <dive-icon name="user" color="base" size="large"></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Base</div>
      </div>
      <div>
        <dive-icon name="check" color="primary" size="large"></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Primary</div>
      </div>
      <div>
        <dive-icon name="check" color="success" size="large"></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Success</div>
      </div>
      <div>
        <dive-icon name="alert-triangle" color="warning" size="large"></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Warning</div>
      </div>
      <div>
        <dive-icon name="x" color="error" size="large"></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Error</div>
      </div>
      <div>
        <dive-icon name="info-circle" color="info" size="large"></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Info</div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Official 6-category color variants using our semantic design token system: Base (neutral), Primary (brand), Success (positive actions), Warning (caution), Error (danger), and Info (informational).'
      }
    }
  }
};

/**
 * Common Tabler Icons showcase
 */
export const CommonIcons: Story = {
  render: () => html`
    <div style="display: grid; gap: 1rem; grid-template-columns: repeat(6, 1fr); text-align: center;">
      ${['home', 'user', 'settings', 'check', 'x', 'plus', 'minus', 'chevron-right', 'chevron-left', 'chevron-up', 'chevron-down', 'alert-triangle', 'info-circle', 'heart', 'star'].map(iconName => html`
        <div>
          <dive-icon name="${iconName}" size="large" color="primary"></dive-icon>
          <div style="font-size: 11px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default); word-break: break-word;">${iconName}</div>
        </div>
      `)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Selection of commonly used Tabler Icons. The component includes optimized SVG paths for better performance than external icon fonts.'
      }
    }
  }
};

/**
 * Interactive icons with click handling
 */
export const InteractiveIcons: Story = {
  render: () => html`
    <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
      <dive-icon 
        name="heart" 
        size="large" 
        color="error" 
        interactive 
        aria-label="Like this item"
        @icon-click=${(e: CustomEvent) => {
          console.log('Heart clicked:', e.detail);
          alert('Heart clicked! Check console for details.');
        }}>
      </dive-icon>
      
      <dive-icon 
        name="star" 
        size="large" 
        color="warning" 
        interactive 
        aria-label="Add to favorites"
        @icon-click=${(e: CustomEvent) => {
          console.log('Star clicked:', e.detail);
          alert('Star clicked! Check console for details.');
        }}>
      </dive-icon>
      
      <dive-icon 
        name="settings" 
        size="large" 
        color="base" 
        interactive 
        aria-label="Open settings"
        @icon-click=${(e: CustomEvent) => {
          console.log('Settings clicked:', e.detail);
          alert('Settings clicked! Check console for details.');
        }}>
      </dive-icon>
      
      <dive-icon 
        name="x" 
        size="large" 
        color="base" 
        interactive 
        aria-label="Close dialog"
        @icon-click=${(e: CustomEvent) => {
          console.log('Close clicked:', e.detail);
          alert('Close clicked! Check console for details.');
        }}>
      </dive-icon>
    </div>
    
    <div style="margin-top: 1rem; font-size: 14px; color: var(--Color-Base-Foreground-default);">
      <strong>Try clicking the icons above!</strong> Interactive icons have hover states and emit click events.
      Check the browser console for event details.
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Interactive icons with click handling, hover states, and proper accessibility. Icons become focusable and emit custom events when clicked.'
      }
    }
  }
};

/**
 * States demonstration
 */
export const States: Story = {
  render: () => html`
    <div style="display: grid; gap: 2rem; grid-template-columns: repeat(2, 1fr); text-align: center;">
      <div>
        <dive-icon name="check" size="large" color="primary"></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Normal</div>
      </div>
      <div>
        <dive-icon name="home" size="large" color="primary" loading></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Loading</div>
      </div>
      <div>
        <dive-icon name="settings" size="large" color="base" interactive></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Interactive (hover me)</div>
      </div>
      <div>
        <dive-icon name="alert-triangle" size="large" error></dive-icon>
        <div style="font-size: 12px; margin-top: 0.5rem; color: var(--Color-Base-Foreground-default);">Error</div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Different states of the icon component including normal, loading, interactive, and error states.'
      }
    }
  }
};

/**
 * Integration with other components
 */
export const ComponentIntegration: Story = {
  render: () => html`
    <div style="display: flex; gap: 2rem; flex-direction: column; align-items: flex-start;">
      <div style="display: flex; gap: 1rem; align-items: center; padding: 1rem; border: 1px solid var(--Color-Base-Border-default); border-radius: 8px;">
        <dive-icon name="user" color="primary"></dive-icon>
        <span>User Profile</span>
        <dive-icon name="chevron-right" color="base" size="small"></dive-icon>
      </div>
      
      <div style="display: flex; gap: 1rem; align-items: center; padding: 1rem; background: var(--Color-Primary-Subtle-Background-default, #eaf1fc); border-radius: 8px; color: var(--Color-Primary-Subtle-Foreground-default, #245db8);">
        <dive-icon name="check" color="primary"></dive-icon>
        <span>Success: Your changes have been saved</span>
      </div>
      
      <div style="display: flex; gap: 1rem; align-items: center; padding: 1rem; background: var(--Color-Base-Subtle-Background-default, #ecedf0); border-radius: 8px; color: var(--Color-Base-Subtle-Foreground-default, #31394a);">
        <dive-icon name="alert-triangle" color="warning"></dive-icon>
        <span>Warning: Please review your settings</span>
      </div>
      
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <button style="display: flex; gap: 0.5rem; align-items: center; padding: 0.5rem 1rem; border: 1px solid var(--Color-Base-Border-default); border-radius: 6px; background: white; cursor: pointer;">
          <dive-icon name="plus" size="small"></dive-icon>
          <span>Add Item</span>
        </button>
        
        <button style="display: flex; gap: 0.5rem; align-items: center; padding: 0.5rem 1rem; border: 1px solid var(--Color-Base-Border-default); border-radius: 6px; background: white; cursor: pointer;">
          <dive-icon name="settings" size="small"></dive-icon>
          <span>Settings</span>
        </button>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Examples of integrating icons with other UI components like cards, alerts, and buttons. Icons provide visual hierarchy and improve usability.'
      }
    }
  }
};
