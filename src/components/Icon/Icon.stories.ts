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
  title: 'Foundation/Icons',
  component: 'dive-icon',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Icon Component

Foundation-level atom providing consistent icon rendering using the Tabler Icons library.
Icons are primitive visual elements that serve as building blocks for molecules and organisms.

## Design Principles
- **Consistency**: All icons use 24x24 grid with 2px stroke weight
- **Accessibility**: Supports both decorative and meaningful icon patterns  
- **Performance**: Optimized SVG rendering with Shadow DOM encapsulation
- **Theming**: Integrates with design token color system

## Usage Guidelines
- Use \`aria-hidden="true"\` for decorative icons
- Provide \`aria-label\` for meaningful icons
- Maintain 44px minimum touch targets for interactive icons
- Follow WCAG 3:1 color contrast requirements
        `
      }
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'image-alt', enabled: true },
          { id: 'button-name', enabled: true }
        ]
      }
    }
  },
  tags: ['autodocs', 'test'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: [
        'check', 'home', 'user', 'heart', 'star', 'settings', 'x', 'plus', 
        'minus', 'chevron-right', 'chevron-left', 'chevron-up', 'chevron-down', 
        'alert-triangle', 'info-circle'
      ],
      description: 'Icon name from available Tabler Icons set',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'check' }
      }
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Icon size following design token scale',
      table: {
        type: { summary: 'small | medium | large' },
        defaultValue: { summary: 'medium' }
      }
    },
    color: {
      control: { type: 'select' },
      options: ['base', 'primary', 'success', 'warning', 'error', 'info'],
      description: 'Color variant using design token categories',
      table: {
        type: { summary: 'base | primary | success | warning | error | info' },
        defaultValue: { summary: 'base' }
      }
    },
    interactive: {
      control: { type: 'boolean' },
      description: 'Whether the icon is interactive (clickable)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label for meaningful icons',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    ariaHidden: {
      control: { type: 'text' },
      description: 'Whether icon is hidden from screen readers',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default icon story with interactive controls
 */
export const Default: Story = {
  render: (args) => html`
    <dive-icon
      name="${args.name || 'check'}"
      size="${args.size || 'medium'}"
      color="${args.color || 'base'}"
      ?interactive="${args.interactive || false}"
      aria-label="${args.ariaLabel || undefined}"
      aria-hidden="${args.ariaHidden || undefined}"
    ></dive-icon>
  `,
  args: {
    name: 'check' as const,
    size: 'medium' as const,
    color: 'base' as const,
    interactive: false,
    ariaLabel: undefined,
    ariaHidden: undefined
  }
};

/**
 * All available icons in the system
 */
export const IconGallery: Story = {
  render: () => html`
    <div style="
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); 
      gap: 1rem; 
      padding: 1rem;
      font-family: var(--font-family-primary);
    ">
      ${['check', 'home', 'user', 'heart', 'star', 'settings', 'x', 'plus', 
         'minus', 'chevron-right', 'chevron-left', 'chevron-up', 'chevron-down', 
         'alert-triangle', 'info-circle'].map(iconName => html`
        <div style="
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          gap: 0.5rem;
          padding: 1rem;
          border: 1px solid var(--Color-Base-Border-default);
          border-radius: 8px;
          text-align: center;
        ">
          <dive-icon name="${iconName}" size="medium" color="base"></dive-icon>
          <code style="font-size: 12px; color: var(--Color-Base-Subtle-Foreground-default);">
            ${iconName}
          </code>
        </div>
      `)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Complete gallery of all 15 available icons in the design system foundation.'
      }
    }
  }
};

/**
 * Color variants demonstration
 */
export const ColorVariants: Story = {
  render: () => html`
    <div style="
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
      gap: 1.5rem;
      font-family: var(--font-family-primary);
    ">
      ${['base', 'primary', 'success', 'warning', 'error', 'info'].map(color => html`
        <div style="
          padding: 1.5rem;
          border: 2px solid var(--Color-${color === 'base' ? 'Base' : color.charAt(0).toUpperCase() + color.slice(1)}-Border-default);
          border-radius: 8px;
          text-align: center;
          background: var(--Color-${color === 'base' ? 'Base' : color.charAt(0).toUpperCase() + color.slice(1)}-Subtle-Background-default);
        ">
          <dive-icon name="check" size="large" color="${color}"></dive-icon>
          <div style="margin-top: 0.5rem; font-weight: var(--font-weight-medium);">
            ${color.charAt(0).toUpperCase() + color.slice(1)}
          </div>
          <code style="font-size: 12px; opacity: 0.7;">
            color="${color}"
          </code>
        </div>
      `)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Icon color variants using the six official design token categories.'
      }
    }
  }
};

/**
 * Size scale demonstration  
 */
export const SizeScale: Story = {
  render: () => html`
    <div style="
      display: flex; 
      align-items: center; 
      gap: 2rem;
      font-family: var(--font-family-primary);
    ">
      ${['small', 'medium', 'large'].map(size => html`
        <div style="text-align: center;">
          <dive-icon name="star" size="${size}" color="primary"></dive-icon>
          <div style="margin-top: 0.5rem; font-weight: var(--font-weight-medium);">
            ${size.charAt(0).toUpperCase() + size.slice(1)}
          </div>
          <code style="font-size: 12px; opacity: 0.7;">
            size="${size}"
          </code>
        </div>
      `)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Icon size scale following design token dimensions: small (16px), medium (24px), large (32px).'
      }
    }
  }
};

/**
 * Accessibility patterns
 */
export const AccessibilityPatterns: Story = {
  render: () => html`
    <div style="
      display: grid; 
      gap: 2rem;
      font-family: var(--font-family-primary);
      max-width: 600px;
    ">
      <div style="
        padding: 1.5rem;
        border: 1px solid var(--Color-Base-Border-default);
        border-radius: 8px;
        background: var(--Color-Base-Subtle-Background-default);
      ">
        <h4 style="margin: 0 0 1rem 0; color: var(--Color-Base-Foreground-default);">
          Decorative Icons (aria-hidden)
        </h4>
        <p style="
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          margin: 0;
          color: var(--Color-Base-Foreground-default);
        ">
          <dive-icon name="check" size="medium" color="success" aria-hidden="true"></dive-icon>
          Task completed successfully
        </p>
      </div>
      
      <div style="
        padding: 1.5rem;
        border: 1px solid var(--Color-Base-Border-default);
        border-radius: 8px;
        background: var(--Color-Base-Subtle-Background-default);
      ">
        <h4 style="margin: 0 0 1rem 0; color: var(--Color-Base-Foreground-default);">
          Meaningful Icons (aria-label)
        </h4>
        <button style="
          display: flex; 
          align-items: center; 
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 1px solid var(--Color-Primary-Border-default);
          border-radius: 4px;
          background: var(--Color-Primary-Primary-Background-default);
          color: var(--Color-Primary-Primary-Foreground-default);
          cursor: pointer;
        " aria-label="Delete item permanently">
          <dive-icon name="x" size="medium" color="primary" aria-hidden="true"></dive-icon>
          Delete
        </button>
      </div>
      
      <div style="
        padding: 1.5rem;
        border: 1px solid var(--Color-Base-Border-default);
        border-radius: 8px;
        background: var(--Color-Base-Subtle-Background-default);
      ">
        <h4 style="margin: 0 0 1rem 0; color: var(--Color-Base-Foreground-default);">
          Icon-Only Button (44px touch target)
        </h4>
        <button style="
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--Color-Info-Border-default);
          border-radius: 4px;
          background: var(--Color-Info-Subtle-Background-default);
          cursor: pointer;
        " aria-label="Show information">
          <dive-icon name="info-circle" size="medium" color="info"></dive-icon>
        </button>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Accessibility patterns showing proper aria-hidden and aria-label usage, plus 44px minimum touch targets.'
      }
    }
  }
};

/**
 * Performance testing story with render metrics
 */
export const PerformanceTest: Story = {
  render: () => {
    let renderTime = 0;
    const iconCount = 100;
    
    const startTime = performance.now();
    
    // Simulate large icon rendering for performance testing
    const icons = Array.from({ length: iconCount }, (_, i) => html`
      <dive-icon 
        name="check" 
        size="medium" 
        color="base"
        style="margin: 2px;"
      ></dive-icon>
    `);
    
    // Calculate render time (approximated)
    requestAnimationFrame(() => {
      renderTime = performance.now() - startTime;
    });
    
    return html`
      <div style="font-family: var(--font-family-primary);">
        <div style="
          background: var(--Color-Info-Subtle-Background-default);
          border: 2px solid var(--Color-Info-Border-default);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        ">
          <h4 style="margin: 0 0 0.5rem 0; color: var(--Color-Info-Primary-Background-default);">
            ⚡ Performance Metrics
          </h4>
          <div>Rendering ${iconCount} icons</div>
          <div style="font-family: var(--font-family-mono); font-size: 14px; opacity: 0.8;">
            Estimated render time: ~${renderTime.toFixed(2)}ms
          </div>
        </div>
        
        <div style="
          max-height: 300px; 
          overflow-y: auto; 
          border: 1px solid var(--Color-Base-Border-default);
          border-radius: 4px;
          padding: 1rem;
        ">
          ${icons}
        </div>
      </div>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance testing story demonstrating icon rendering capabilities with 100 simultaneous icons.'
      }
    }
  }
};
