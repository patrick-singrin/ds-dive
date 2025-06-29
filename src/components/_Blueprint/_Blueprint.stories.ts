import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

// Import and register the component
import '../_Blueprint/_Blueprint';
import type { DiveBlueprint } from '../_Blueprint/_Blueprint';

// Ensure the custom element is defined - the import above should handle registration
// If it's still not registered, log a warning
if (!customElements.get('dive-blueprint')) {
  console.warn('dive-blueprint custom element not registered. Component may not render properly.');
}

const meta: Meta<DiveBlueprint> = {
  title: 'Molecules/Blueprint',
  component: 'dive-blueprint',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Blueprint Component

The Blueprint component serves as the comprehensive reference implementation for the Dive Design System. It demonstrates:

- **Design Token Integration**: All styling through CSS custom properties
- **Accessibility First**: WCAG 2.1 AA compliance with proper ARIA attributes
- **Framework Agnostic**: Built with Lit, works everywhere
- **TypeScript**: Full type safety and autocompletion
- **Responsive Design**: Adapts to different screen sizes and user preferences
- **State Management**: Proper handling of interactive states
- **Event System**: Custom events with structured payloads

## Design Tokens Used

- \`--Color-Primary-*\`: Primary color variants for different states
- \`--Color-Base-*\`: Base color system for secondary variants
- \`--Spacing-*\`: Consistent spacing scale
- \`--border-border-radius-*\`: Border radius system

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support with Enter/Space activation
- **Screen Reader Support**: Proper ARIA labels and roles
- **High Contrast Mode**: Enhanced borders and focus indicators
- **Reduced Motion**: Respects user's motion preferences
- **Focus Management**: Visible focus indicators with proper contrast
        `
      }
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'focusable-content', enabled: true }
        ]
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost'],
      description: 'Visual style variant derived from design tokens',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'primary' }
      }
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size variant affecting padding and font size',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'medium' }
      }
    },
    text: {
      control: { type: 'text' },
      description: 'Text content of the component',
      table: {
        category: 'Content'
      }
    },
    icon: {
      control: { type: 'select' },
      options: ['', 'home', 'user', 'settings', 'check', 'x', 'plus', 'minus'],
      description: 'Icon name from Tabler Icons (optional)',
      table: {
        category: 'Content'
      }
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the component is disabled',
      table: {
        category: 'State',
        defaultValue: { summary: 'false' }
      }
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the component is in loading state',
      table: {
        category: 'State',
        defaultValue: { summary: 'false' }
      }
    },
    pressed: {
      control: { type: 'boolean' },
      description: 'Whether the component is pressed/active',
      table: {
        category: 'State',
        defaultValue: { summary: 'false' }
      }
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label for accessibility (optional)',
      table: {
        category: 'Accessibility'
      }
    },
    role: {
      control: { type: 'text' },
      description: 'ARIA role for the component',
      table: {
        category: 'Accessibility',
        defaultValue: { summary: 'button' }
      }
    }
  },
  args: {
    variant: 'primary',
    size: 'medium',
    text: 'Blueprint Component',
    disabled: false,
    loading: false,
    pressed: false,
    role: 'button'
  }
};

export default meta;
type Story = StoryObj<DiveBlueprint>;

/**
 * Default interactive example showing the Blueprint component
 * with configurable properties via Storybook controls
 */
export const Interactive: Story = {
  args: {
    text: 'Interactive Blueprint',
    icon: 'check'
  },
  render: (args) => html`
    <dive-blueprint
      variant="${args.variant}"
      size="${args.size}"
      text="${args.text}"
      icon="${ifDefined(args.icon)}"
      ?disabled="${args.disabled}"
      ?loading="${args.loading}"
      ?pressed="${args.pressed}"
      aria-label="${ifDefined(args.ariaLabel)}"
      role="${args.role}"
    ></dive-blueprint>
  `
};

/**
 * All variant combinations displayed in a grid layout
 * for visual comparison and design QA
 */
export const AllVariants: Story = {
  render: () => html`
    <div style="display: grid; gap: 1rem; grid-template-columns: repeat(3, 1fr); align-items: start;">
      <div style="text-align: center;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 14px; color: var(--Color-Base-Foreground-default);">Primary</h4>
        <dive-blueprint variant="primary" text="Primary"></dive-blueprint>
      </div>
      <div style="text-align: center;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 14px; color: var(--Color-Base-Foreground-default);">Secondary</h4>
        <dive-blueprint variant="secondary" text="Secondary"></dive-blueprint>
      </div>
      <div style="text-align: center;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 14px; color: var(--Color-Base-Foreground-default);">Ghost</h4>
        <dive-blueprint variant="ghost" text="Ghost"></dive-blueprint>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All visual variants displayed together for comparison. Each variant uses different design tokens for appropriate contrast and hierarchy.'
      }
    }
  }
};

/**
 * Size variations showing responsive scaling
 */
export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      <dive-blueprint size="small" text="Small" icon="check"></dive-blueprint>
      <dive-blueprint size="medium" text="Medium" icon="check"></dive-blueprint>
      <dive-blueprint size="large" text="Large" icon="check"></dive-blueprint>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Size variants demonstrating scaling with design tokens. Typography and spacing adjust proportionally.'
      }
    }
  }
};

/**
 * Interactive states including hover, focus, active, and disabled
 */
export const States: Story = {
  render: () => html`
    <div style="display: grid; gap: 1rem; grid-template-columns: repeat(2, 1fr); max-width: 400px;">
      <dive-blueprint text="Default" icon="check"></dive-blueprint>
      <dive-blueprint text="Pressed" icon="check" pressed></dive-blueprint>
      <dive-blueprint text="Loading" icon="check" loading></dive-blueprint>
      <dive-blueprint text="Disabled" icon="check" disabled></dive-blueprint>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All interactive states showing visual feedback for user actions. Hover and focus states are visible during interaction.'
      }
    }
  }
};

/**
 * Icon integration examples with Tabler Icons
 */
export const WithIcons: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
      <dive-blueprint text="Home" icon="home"></dive-blueprint>
      <dive-blueprint text="User" icon="user" variant="secondary"></dive-blueprint>
      <dive-blueprint text="Settings" icon="settings" variant="ghost"></dive-blueprint>
      <dive-blueprint icon="check" aria-label="Confirm action"></dive-blueprint>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Icon integration using Tabler Icons. Icons automatically inherit color and scale with the component size.'
      }
    }
  }
};

/**
 * Accessibility demonstration with screen reader support
 */
export const Accessibility: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-direction: column; align-items: flex-start;">
      <dive-blueprint 
        text="Accessible Button" 
        aria-label="Primary action button with detailed description"
        icon="check">
      </dive-blueprint>
      
      <dive-blueprint 
        icon="x" 
        aria-label="Close dialog" 
        variant="ghost"
        size="small">
      </dive-blueprint>
      
      <dive-blueprint 
        text="Loading..." 
        loading
        aria-label="Submitting form, please wait">
      </dive-blueprint>
      
      <dive-blueprint 
        text="Disabled" 
        disabled
        aria-label="Feature not available">
      </dive-blueprint>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features including proper ARIA labels, screen reader support, and keyboard navigation. Test with keyboard navigation (Tab, Enter, Space) and screen readers.'
      }
    }
  }
};

/**
 * Event handling demonstration
 */
export const Events: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-direction: column; align-items: flex-start;">
      <dive-blueprint 
        text="Click Counter" 
        icon="plus"
        @blueprint-click=${(e: CustomEvent) => {
          const target = e.target as DiveBlueprint;
          target.text = `Clicked ${e.detail.clickCount} time(s)`;
          console.log('Blueprint clicked:', e.detail);
        }}>
      </dive-blueprint>
      
      <div style="font-size: 14px; color: var(--Color-Base-Foreground-default); margin-top: 0.5rem;">
        <strong>Check browser console for event details</strong><br>
        Events fired: <code>blueprint-click</code>, <code>blueprint-change</code>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Event system demonstration. Click the button to see event data in the browser console. Events include structured data about the interaction.'
      }
    }
  }
};

/**
 * Design token showcase
 */
export const DesignTokens: Story = {
  render: () => html`
    <div style="display: flex; gap: 2rem; flex-direction: column;">
      <div>
        <h4 style="margin: 0 0 1rem 0;">Color Tokens</h4>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <dive-blueprint variant="primary" text="Primary Tokens"></dive-blueprint>
          <dive-blueprint variant="secondary" text="Base Tokens"></dive-blueprint>
          <dive-blueprint variant="ghost" text="Transparent Tokens"></dive-blueprint>
        </div>
      </div>
      
      <div>
        <h4 style="margin: 0 0 1rem 0;">Spacing Tokens</h4>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <dive-blueprint size="small" text="Small Spacing"></dive-blueprint>
          <dive-blueprint size="medium" text="Medium Spacing"></dive-blueprint>
          <dive-blueprint size="large" text="Large Spacing"></dive-blueprint>
        </div>
      </div>
      
      <div style="font-size: 14px; color: var(--Color-Base-Foreground-default); background: var(--Color-Base-Subtle-Background-default); padding: 1rem; border-radius: 8px;">
        <strong>Design Tokens Used:</strong><br>
        • Color: <code>--Color-Primary-Primary-Background-default</code><br>
        • Spacing: <code>--Spacing-2</code>, <code>--Spacing-3</code>, <code>--Spacing-4</code><br>
        • Border: <code>--border-border-radius-md</code><br>
        • Typography: Component-specific font sizing
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Design token integration demonstration. All styling comes from the design token system, enabling consistent theming and easy customization.'
      }
    }
  }
};
