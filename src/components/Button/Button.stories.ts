import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

// Import and register the component
import './Button';
import type { DiveButton } from './Button';

// Ensure the custom element is defined
if (!customElements.get('dive-button')) {
  console.warn('dive-button custom element not registered. Component may not render properly.');
}

const meta: Meta<DiveButton> = {
  title: 'Components/Button',
  component: 'dive-button',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Button Component

A comprehensive button implementation based on the Figma design system matrix.
Supports all design variants with optional icon display control.

## Design Matrix
- **Types**: \`base\`, \`primary\`, \`destructive\`
- **Variants**: \`filled\`, \`outline\`, \`ghost\`
- **Sizes**: \`small\`, \`default\`
- **Icon Control**: \`show-icon\` property toggles icon visibility

## Key Features
- **Show Icon Property**: Toggle between icon+text and text-only modes
- **Full Figma Compliance**: Matches all button variants from design system
- **Design Token Integration**: Uses CSS custom properties for theming
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA support
- **Keyboard Navigation**: Full keyboard support
- **Event System**: Custom \`button-click\` events with structured payloads

## Usage Examples
\`\`\`html
<!-- With icon -->
<dive-button type="primary" variant="filled" text="Save" icon="check" show-icon></dive-button>

<!-- Text only -->
<dive-button type="primary" variant="filled" text="Save" icon="check"></dive-button>
\`\`\`
        `
      }
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'button-name', enabled: true }
        ]
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['base', 'primary', 'destructive'],
      description: 'Button type/semantic meaning',
      table: {
        defaultValue: { summary: 'base' },
        type: { summary: 'base | primary | destructive' }
      }
    },
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outline', 'ghost'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'filled' },
        type: { summary: 'filled | outline | ghost' }
      }
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'default'],
      description: 'Button size variant',
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'small | default' }
      }
    },
    text: {
      control: { type: 'text' },
      description: 'Button text content',
      table: {
        type: { summary: 'string' }
      }
    },
    icon: {
      control: { type: 'select' },
      options: [
        'scuba-mask', 'check', 'home', 'user', 'heart', 'star', 'settings', 
        'x', 'plus', 'minus', 'chevron-right', 'chevron-left', 'chevron-up', 
        'chevron-down', 'alert-triangle', 'info-circle'
      ],
      description: 'Tabler icon name',
      table: {
        defaultValue: { summary: 'scuba-mask' },
        type: { summary: 'string' }
      }
    },
    showIcon: {
      control: { type: 'boolean' },
      description: 'Whether to show the icon (key feature)',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' }
      }
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' }
      }
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Custom ARIA label for accessibility',
      table: {
        type: { summary: 'string | null' }
      }
    }
  }
};

export default meta;
type Story = StoryObj<DiveButton>;

// Template function
const Template = (args: Partial<DiveButton>) => html`
  <dive-button
    type=${ifDefined(args.type)}
    variant=${ifDefined(args.variant)}
    size=${ifDefined(args.size)}
    text=${ifDefined(args.text)}
    icon=${ifDefined(args.icon)}
    ?show-icon=${args.showIcon}
    ?disabled=${args.disabled}
    aria-label=${ifDefined(args.ariaLabel)}
    @button-click=${(e: CustomEvent) => {
      console.log('Button clicked:', e.detail);
    }}
  ></dive-button>
`;

// Primary interactive story
export const Interactive: Story = {
  args: {
    type: 'primary',
    variant: 'filled',
    size: 'default',
    text: 'Button',
    icon: 'scuba-mask',
    showIcon: true,
    disabled: false
  },
  render: Template
};

// Show Icon Toggle Demo (Key Feature)
export const ShowIconToggle: Story = {
  name: 'Show Icon Toggle (Key Feature)',
  parameters: {
    docs: {
      description: {
        story: `
This demonstrates the **Show Icon** property - the core feature you requested.
Toggle the \`Show Icon\` control to see the button switch between:
- **Icon + Text**: Icon on the left, text next to it
- **Text Only**: Icon hidden, just the text

This creates two distinct button states from a single component.
        `
      }
    }
  },
  args: {
    type: 'primary',
    variant: 'filled',
    size: 'default',
    text: 'Save Changes',
    icon: 'check',
    showIcon: true,
    disabled: false
  },
  render: Template
};

// Complete Design Matrix
export const DesignMatrix: Story = {
  name: 'Complete Design Matrix',
  parameters: {
    docs: {
      description: {
        story: 'Complete matrix showing all type + variant combinations from Figma design system.'
      }
    }
  },
  render: () => html`
    <div style="display: grid; gap: 24px; font-family: var(--font-family-primary, sans-serif);">
      ${['base', 'primary', 'destructive'].map(type => html`
        <div>
          <h4 style="margin: 0 0 16px 0; text-transform: capitalize; color: var(--Color-Base-Foreground-default, #1d222c);">
            ${type} Type
          </h4>
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            ${['filled', 'outline', 'ghost'].map(variant => html`
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <dive-button
                  type=${type}
                  variant=${variant}
                  text="Button"
                  icon="scuba-mask"
                  show-icon
                ></dive-button>
                <span style="font-size: 12px; color: var(--Color-Base-Foreground-muted, #7b8394); text-transform: capitalize;">
                  ${variant}
                </span>
              </div>
            `)}
          </div>
        </div>
      `)}
    </div>
  `
};

// Size Variants
export const SizeVariants: Story = {
  name: 'Size Variants',
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <dive-button
          type="primary"
          variant="filled"
          size="small"
          text="Small"
          icon="scuba-mask"
          show-icon
        ></dive-button>
        <span style="font-size: 12px; color: var(--Color-Base-Foreground-muted, #7b8394);">Small</span>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <dive-button
          type="primary"
          variant="filled"
          size="default"
          text="Default"
          icon="scuba-mask"
          show-icon
        ></dive-button>
        <span style="font-size: 12px; color: var(--Color-Base-Foreground-muted, #7b8394);">Default</span>
      </div>
    </div>
  `
};

// Icon vs Text Only Comparison
export const IconTextComparison: Story = {
  name: 'Icon vs Text Only (Height Fixed)',
  parameters: {
    docs: {
      description: {
        story: `
Side-by-side comparison showing the same button with and without icon display.

**Figma-Accurate Implementation:**
- ✅ **24px Line-Height**: Text uses Figma-specified 24px line-height (matches icon height)
- ✅ **Perfect Height Consistency**: Icon (24px) and text (24px line-height) create natural alignment
- ✅ **Size-Appropriate Icons**: Small buttons use 20px icons with 20px line-height
- ✅ **Design System Accuracy**: Follows Figma specifications rather than CSS hacks

This approach matches your Figma design system where text line-height naturally prevents height changes when toggling icons.
        `
      }
    }
  },
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center;">
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <dive-button
          type="primary"
          variant="filled"
          text="Save Changes"
          icon="check"
          show-icon
        ></dive-button>
        <span style="font-size: 12px; color: var(--Color-Base-Foreground-muted, #7b8394);">With Icon (24×24px)</span>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <dive-button
          type="primary"
          variant="filled"
          text="Save Changes"
          icon="check"
        ></dive-button>
        <span style="font-size: 12px; color: var(--Color-Base-Foreground-muted, #7b8394);">Text Only (Same Height)</span>
      </div>
    </div>
    
         <div style="margin-top: 24px; padding: 16px; background: var(--Color-Success-Subtle-Background-default, #e8f5e8); border-radius: 6px; border-left: 4px solid var(--Color-Success-Primary-Background-default, #058900);">
       <strong>✅ Figma-Accurate Implementation:</strong> 24px line-height matches 24px icon height for natural consistency.
     </div>
  `
};

// Common Icons
export const CommonIcons: Story = {
  name: 'Common Icons',
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      ${['check', 'plus', 'x', 'settings', 'heart', 'star'].map(iconName => html`
        <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
          <dive-button
            type="primary"
            variant="filled"
            text="Action"
            icon=${iconName}
            show-icon
          ></dive-button>
          <span style="font-size: 12px; color: var(--Color-Base-Foreground-muted, #7b8394);">${iconName}</span>
        </div>
      `)}
    </div>
  `
};

// Interactive States
export const InteractiveStates: Story = {
  name: 'Interactive States',
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates various interactive states including disabled state.'
      }
    }
  },
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <dive-button
          type="primary"
          variant="filled"
          text="Normal"
          icon="check"
          show-icon
        ></dive-button>
        <span style="font-size: 12px; color: var(--Color-Base-Foreground-muted, #7b8394);">Normal</span>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <dive-button
          type="primary"
          variant="filled"
          text="Disabled"
          icon="check"
          show-icon
          disabled
        ></dive-button>
        <span style="font-size: 12px; color: var(--Color-Base-Foreground-muted, #7b8394);">Disabled</span>
      </div>
    </div>
  `
};

// Real-world Examples
export const RealWorldExamples: Story = {
  name: 'Real-world Examples',
  parameters: {
    docs: {
      description: {
        story: 'Common button patterns you would use in real applications.'
      }
    }
  },
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <dive-button
        type="primary"
        variant="filled"
        text="Save Changes"
        icon="check"
        show-icon
      ></dive-button>
      
      <dive-button
        type="base"
        variant="outline"
        text="Cancel"
        icon="x"
      ></dive-button>
      
      <dive-button
        type="destructive"
        variant="filled"
        text="Delete"
        icon="x"
        show-icon
      ></dive-button>
      
      <dive-button
        type="primary"
        variant="ghost"
        text="Add Item"
        icon="plus"
        show-icon
      ></dive-button>
    </div>
  `
};

// Accessibility Demo
export const AccessibilityDemo: Story = {
  name: 'Accessibility',
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features including custom ARIA labels and keyboard navigation.'
      }
    }
  },
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <dive-button
        type="primary"
        variant="filled"
        text="Save"
        icon="check"
        show-icon
        aria-label="Save your changes to the document"
      ></dive-button>
      
      <dive-button
        type="destructive"
        variant="outline"
        text="Delete"
        icon="x"
        show-icon
        aria-label="Permanently delete this item"
      ></dive-button>
    </div>
    <p style="margin-top: 16px; font-size: 14px; color: var(--Color-Base-Foreground-muted, #7b8394);">
      Try navigating with Tab key and activating with Enter or Space.
    </p>
  `
};

// Visual Regression Test Matrix - Optimized for Automated Testing
export const VisualRegressionMatrix: Story = {
  name: 'Visual Regression Matrix',
  parameters: {
    // Optimize for visual testing
    layout: 'padded',
    docs: {
      description: {
        story: `
**Automated Visual Testing Matrix**

This story is optimized for visual regression testing and captures the complete Figma design matrix.
It will automatically detect visual changes including:

- ✅ **Base Type Color Accuracy**: Ensures base buttons use correct Figma tokens
- ✅ **Cross-Browser Consistency**: Tests rendering across Chrome, Safari, Firefox
- ✅ **Size Scaling**: Validates both small and default button sizes
- ✅ **Icon Alignment**: Checks icon positioning and height consistency
- ✅ **State Variations**: Covers disabled and interactive states

**Figma Token Validation:**
- Base Filled: \`--Color-Base-Primary-Background-*\` + \`--Color-Base-Primary-Foreground-*\`
- Base Outline/Ghost: \`--Color-Base-Foreground-*\` (correct #1D222C color)
- Spacing: \`--Spacing-*\` tokens for padding and gaps
        `
      }
    },
    chromatic: {
      // Multi-mode testing for different themes
      modes: {
        light: { 
          theme: 'light'
        },
        dark: { 
          theme: 'dark' 
        },
        'high-contrast': { 
          theme: 'hc-light' 
        }
      }
    }
  },
  render: () => html`
    <div style="padding: 24px; background: var(--Color-Background-body, #ffffff);">
      <!-- Complete Type × Variant Matrix -->
      <div style="display: grid; gap: 32px; margin-bottom: 32px;">
        ${['base', 'primary', 'destructive'].map(type => html`
          <div>
            <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; text-transform: capitalize; color: var(--Color-Base-Foreground-default, #1d222c);">
              ${type} Type Buttons
            </h3>
            
            <!-- Default Size -->
            <div style="margin-bottom: 24px;">
              <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 500; color: var(--Color-Base-Subtle-Foreground-default, #31394a);">
                Default Size
              </h4>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 600px;">
                ${['filled', 'outline', 'ghost'].map(variant => html`
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    <!-- With Icon -->
                    <dive-button
                      type=${type}
                      variant=${variant}
                      size="default"
                      text="${variant.charAt(0).toUpperCase() + variant.slice(1)}"
                      icon="check"
                      show-icon
                    ></dive-button>
                    
                    <!-- Text Only -->
                    <dive-button
                      type=${type}
                      variant=${variant}
                      size="default"
                      text="Text Only"
                      icon="check"
                    ></dive-button>
                    
                    <!-- Disabled -->
                    <dive-button
                      type=${type}
                      variant=${variant}
                      size="default"
                      text="Disabled"
                      icon="check"
                      show-icon
                      disabled
                    ></dive-button>
                  </div>
                `)}
              </div>
            </div>
            
            <!-- Small Size -->
            <div>
              <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 500; color: var(--Color-Base-Subtle-Foreground-default, #31394a);">
                Small Size
              </h4>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 600px;">
                ${['filled', 'outline', 'ghost'].map(variant => html`
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    <!-- Small with Icon -->
                    <dive-button
                      type=${type}
                      variant=${variant}
                      size="small"
                      text="Small"
                      icon="check"
                      show-icon
                    ></dive-button>
                    
                    <!-- Small Text Only -->
                    <dive-button
                      type=${type}
                      variant=${variant}
                      size="small"
                      text="Small"
                      icon="check"
                    ></dive-button>
                  </div>
                `)}
              </div>
            </div>
          </div>
        `)}
      </div>
      
      <!-- Critical Base Type Validation (for color accuracy) -->
      <div style="padding: 20px; border: 2px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 8px; background: var(--Color-Base-Subtle-Background-default, #ecedf0);">
        <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: var(--Color-Base-Foreground-default, #1d222c);">
          🎯 Base Type Color Validation
        </h3>
        <div style="display: flex; gap: 16px; align-items: center;">
          <dive-button type="base" variant="filled" text="Base Filled" icon="check" show-icon></dive-button>
          <dive-button type="base" variant="outline" text="Base Outline" icon="check" show-icon></dive-button>
          <dive-button type="base" variant="ghost" text="Base Ghost" icon="check" show-icon></dive-button>
        </div>
        <p style="margin: 12px 0 0 0; font-size: 12px; color: var(--Color-Base-Subtle-Foreground-default, #31394a);">
          ✅ Filled: Dark background (#242A37) with white text<br>
          ✅ Outline/Ghost: Light text (#1D222C) with transparent background
        </p>
      </div>
    </div>
  `
}; 