import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './IconButton';

const meta: Meta = {
  title: 'Components/Icon Button',
  component: 'dive-icon-button',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Icon Button Component

The **Icon Button** component provides compact, icon-only actions based on Figma design specifications. Perfect for toolbars, forms, and space-constrained interfaces.

### Key Features
- **Multiple Types**: Base, Primary, Destructive semantic variants
- **Three Styles**: Filled, Outline, Ghost appearances  
- **Complete States**: Default, Hover, Active, Focus, Disabled
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Icon Library**: 20+ common icons with Tabler Icons styling
- **Figma Aligned**: Uses actual design tokens for pixel-perfect match

### Design System Integration
- ✅ **Figma Token Mapping**: Direct usage of design system tokens
- ✅ **44×44px Sizing**: Matches Figma specifications exactly
- ✅ **8px Border Radius**: Consistent with design system
- ✅ **Visual Testing**: Comprehensive Chromatic coverage
- ✅ **Accessibility**: WCAG 2.1 AA compliant

### Usage Guidelines
Always provide meaningful \`aria-label\` attributes for screen readers. Icon buttons should have clear, descriptive labels that explain the action being performed.
        `
      }
    }
  },
  tags: ['autodocs'], // This generates the Documentation page
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['base', 'primary', 'destructive'],
      description: 'Semantic type that determines the button\'s intent and styling'
    },
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outline', 'ghost'],
      description: 'Visual style variant affecting background and border'
    },
    icon: {
      control: { type: 'select' },
      options: [
        'scuba-mask', 'home', 'user', 'settings', 'edit', 'delete', 'save',
        'plus', 'minus', 'check', 'x', 'chevron-up', 'chevron-down',
        'chevron-left', 'chevron-right', 'search', 'heart', 'star', 'bell', 'mail'
      ],
      description: 'Icon to display in the button'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled'
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessible label for screen readers'
    }
  },
  args: {
    type: 'base',
    variant: 'filled',
    icon: 'scuba-mask',
    disabled: false,
    ariaLabel: 'Icon button'
  }
};

export default meta;
type Story = StoryObj;

// Interactive playground story
export const Playground: Story = {
  name: 'Interactive Playground',
  render: (args) => html`
    <dive-icon-button
      type=${args.type}
      variant=${args.variant}
      icon=${args.icon}
      ?disabled=${args.disabled}
      aria-label=${args.ariaLabel}
    ></dive-icon-button>
  `
};

// Design matrix showing all combinations
export const DesignMatrix: Story = {
  name: 'Design Matrix',
  parameters: {
    layout: 'padded'
  },
  render: () => html`
    <div style="padding: 24px;">
      <h2 style="margin-bottom: 24px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
        Icon Button Design Matrix
      </h2>
      
      ${['base', 'primary', 'destructive'].map(type => html`
        <div style="margin-bottom: 32px;">
          <h3 style="margin-bottom: 16px; text-transform: capitalize; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            ${type} Type
          </h3>
          <div style="display: grid; grid-template-columns: repeat(3, auto); gap: 16px; align-items: center;">
            ${['filled', 'outline', 'ghost'].map(variant => html`
              <div style="text-align: center;">
                <div style="margin-bottom: 8px;">
                  <dive-icon-button
                    type=${type}
                    variant=${variant}
                    icon="scuba-mask"
                    aria-label="${type} ${variant} icon button"
                  ></dive-icon-button>
                </div>
                <label style="font-size: 12px; color: #666; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
                  ${variant}
                </label>
              </div>
            `)}
          </div>
        </div>
      `)}
    </div>
  `
};

// States demonstration
export const States: Story = {
  name: 'States Demo',
  parameters: {
    layout: 'padded'
  },
  render: () => html`
    <div style="padding: 24px;">
      <h2 style="margin-bottom: 24px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
        Icon Button States
      </h2>
      
      <div style="display: grid; grid-template-columns: repeat(4, auto); gap: 24px; align-items: center;">
        <div style="text-align: center;">
          <div style="margin-bottom: 8px;">
            <dive-icon-button
              type="primary"
              variant="filled"
              icon="scuba-mask"
              aria-label="Normal state"
            ></dive-icon-button>
          </div>
          <label style="font-size: 12px; color: #666; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Normal
          </label>
        </div>
        
        <div style="text-align: center;">
          <div style="margin-bottom: 8px;">
            <dive-icon-button
              type="primary"
              variant="filled"
              icon="scuba-mask"
              aria-label="Disabled state"
              disabled
            ></dive-icon-button>
          </div>
          <label style="font-size: 12px; color: #666; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Disabled
          </label>
        </div>
        
        <div style="text-align: center;">
          <div style="margin-bottom: 8px; padding: 4px; outline: 1px solid #0066cc; outline-offset: 2px; border-radius: 8px;">
            <dive-icon-button
              type="primary"
              variant="filled"
              icon="scuba-mask"
              aria-label="Focus state simulation"
            ></dive-icon-button>
          </div>
          <label style="font-size: 12px; color: #666; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Focus
          </label>
        </div>
        
        <div style="text-align: center;">
          <div style="margin-bottom: 8px;">
            <div style="padding: 8px; background: #f0f0f0; border-radius: 4px;">
              <span style="font-size: 12px; color: #666;">Hover over button →</span>
            </div>
          </div>
          <label style="font-size: 12px; color: #666; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Hover
          </label>
        </div>
      </div>
    </div>
  `
};

// Icon showcase
export const IconShowcase: Story = {
  name: 'Icon Library',
  parameters: {
    layout: 'padded'
  },
  render: () => html`
    <div style="padding: 24px;">
      <h2 style="margin-bottom: 24px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
        Available Icons
      </h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px;">
        ${[
          'scuba-mask', 'home', 'user', 'settings', 'plus', 'minus', 'check', 'x', 
          'chevron-up', 'chevron-down', 'chevron-left', 'chevron-right', 
          'heart', 'star', 'alert-triangle', 'info-circle'
        ].map(iconName => html`
          <div style="text-align: center; padding: 16px; border: 1px solid #eee; border-radius: 8px;">
            <div style="margin-bottom: 8px;">
              <dive-icon-button
                type="base"
                variant="outline"
                icon=${iconName}
                aria-label="${iconName} icon"
              ></dive-icon-button>
            </div>
            <label style="font-size: 11px; color: #666; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
              ${iconName}
            </label>
          </div>
        `)}
      </div>
    </div>
  `
};

// Accessibility features
export const AccessibilityFeatures: Story = {
  name: 'Accessibility Demo',
  parameters: {
    layout: 'padded'
  },
  render: () => html`
    <div style="padding: 24px;">
      <h2 style="margin-bottom: 24px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
        Accessibility Features
      </h2>
      
      <div style="display: grid; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 12px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            ARIA Labels
          </h3>
          <div style="display: flex; gap: 16px; align-items: center;">
            <dive-icon-button
              type="primary"
              variant="filled"
              icon="settings"
              aria-label="Edit profile information"
            ></dive-icon-button>
            <dive-icon-button
              type="destructive"
              variant="filled"
              icon="x"
              aria-label="Delete this item permanently"
            ></dive-icon-button>
            <dive-icon-button
              type="base"
              variant="outline"
              icon="check"
              aria-label="Save your changes"
            ></dive-icon-button>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 8px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Each button has a descriptive aria-label for screen readers.
          </p>
        </div>
        
        <div>
          <h3 style="margin-bottom: 12px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Keyboard Navigation
          </h3>
          <div style="display: flex; gap: 16px; align-items: center;">
            <dive-icon-button
              type="primary"
              variant="outline"
              icon="chevron-left"
              aria-label="Previous page"
            ></dive-icon-button>
            <dive-icon-button
              type="primary"
              variant="filled"
              icon="home"
              aria-label="Go to home page"
            ></dive-icon-button>
            <dive-icon-button
              type="primary"
              variant="outline"
              icon="chevron-right"
              aria-label="Next page"
            ></dive-icon-button>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 8px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Use Tab to navigate, Enter or Space to activate.
          </p>
        </div>
        
        <div>
          <h3 style="margin-bottom: 12px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Focus Indicators (Always Primary Color)
          </h3>
          <div style="display: flex; gap: 16px; align-items: center;">
            <div style="padding: 4px; outline: 1px solid #0066cc; outline-offset: 2px; border-radius: 8px;">
              <dive-icon-button
                type="base"
                variant="filled"
                icon="user"
                aria-label="Base type focus (simulated)"
              ></dive-icon-button>
            </div>
            <div style="padding: 4px; outline: 1px solid #0066cc; outline-offset: 2px; border-radius: 8px;">
              <dive-icon-button
                type="primary"
                variant="filled"
                icon="settings"
                aria-label="Primary type focus (simulated)"
              ></dive-icon-button>
            </div>
            <div style="padding: 4px; outline: 1px solid #0066cc; outline-offset: 2px; border-radius: 8px;">
              <dive-icon-button
                type="destructive"
                variant="filled"
                icon="x"
                aria-label="Destructive type focus (simulated)"
              ></dive-icon-button>
            </div>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 8px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            All focus rings use primary color (#0066cc) for consistency.
          </p>
        </div>
      </div>
    </div>
  `
};

// Real-world usage examples
export const UsageExamples: Story = {
  name: 'Usage Examples',
  parameters: {
    layout: 'padded'
  },
  render: () => html`
    <div style="padding: 24px;">
      <h2 style="margin-bottom: 24px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
        Real-world Usage Examples
      </h2>
      
      <div style="display: grid; gap: 32px;">
        <!-- Toolbar Example -->
        <div>
          <h3 style="margin-bottom: 16px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Toolbar Actions
          </h3>
          <div style="padding: 16px; background: #f8f9fa; border-radius: 8px; display: flex; gap: 8px; align-items: center;">
            <dive-icon-button
              type="base"
              variant="ghost"
              icon="edit"
              aria-label="Edit document"
            ></dive-icon-button>
            <dive-icon-button
              type="base"
              variant="ghost"
              icon="save"
              aria-label="Save document"
            ></dive-icon-button>
            <div style="width: 1px; height: 24px; background: #dee2e6; margin: 0 8px;"></div>
            <dive-icon-button
              type="base"
              variant="ghost"
              icon="plus"
              aria-label="Add new item"
            ></dive-icon-button>
            <dive-icon-button
              type="destructive"
              variant="ghost"
              icon="delete"
              aria-label="Delete selected items"
            ></dive-icon-button>
          </div>
        </div>
        
        <!-- Card Actions Example -->
        <div>
          <h3 style="margin-bottom: 16px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Card Actions
          </h3>
          <div style="padding: 20px; background: white; border: 1px solid #dee2e6; border-radius: 12px; max-width: 320px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <h4 style="margin: 0; font-family: 'Atkinson Hyperlegible Next', sans-serif;">User Profile</h4>
              <div style="display: flex; gap: 8px;">
                <dive-icon-button
                  type="base"
                  variant="ghost"
                  icon="edit"
                  aria-label="Edit profile"
                ></dive-icon-button>
                <dive-icon-button
                  type="base"
                  variant="ghost"
                  icon="settings"
                  aria-label="Profile settings"
                ></dive-icon-button>
              </div>
            </div>
            <p style="margin: 0; color: #666; font-size: 14px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
              John Doe • Software Engineer
            </p>
          </div>
        </div>
        
        <!-- Navigation Example -->
        <div>
          <h3 style="margin-bottom: 16px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Navigation Controls
          </h3>
          <div style="display: flex; gap: 16px; align-items: center;">
            <dive-icon-button
              type="primary"
              variant="outline"
              icon="chevron-left"
              aria-label="Previous page"
            ></dive-icon-button>
            <span style="font-family: 'Atkinson Hyperlegible Next', sans-serif; color: #666;">
              Page 3 of 10
            </span>
            <dive-icon-button
              type="primary"
              variant="outline"
              icon="chevron-right"
              aria-label="Next page"
            ></dive-icon-button>
          </div>
        </div>
        
        <!-- Form Actions Example -->
        <div>
          <h3 style="margin-bottom: 16px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
            Form Actions
          </h3>
          <div style="padding: 20px; background: white; border: 1px solid #dee2e6; border-radius: 8px; max-width: 400px;">
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 4px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
                Email Address
              </label>
              <div style="display: flex; gap: 8px; align-items: center;">
                <input 
                  type="email" 
                  value="john@example.com"
                  style="flex: 1; padding: 8px 12px; border: 1px solid #dee2e6; border-radius: 6px; font-family: 'Atkinson Hyperlegible Next', sans-serif;"
                />
                <dive-icon-button
                  type="primary"
                  variant="filled"
                  icon="check"
                  aria-label="Verify email address"
                ></dive-icon-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};

// Visual regression testing matrix for Chromatic
export const VisualRegressionMatrix: Story = {
  name: 'Visual Regression Matrix',
  parameters: {
    layout: 'padded',
    chromatic: {
      modes: {
        light: { theme: 'light' },
        dark: { theme: 'dark' },
        'high-contrast': { theme: 'hc-light' }
      }
    }
  },
  render: () => html`
    <div style="padding: 24px; font-family: 'Atkinson Hyperlegible Next', sans-serif;">
      <h2 style="margin-bottom: 24px;">Icon Button Visual Regression Matrix</h2>
      
      <!-- Complete Type × Variant Matrix -->
      ${['base', 'primary', 'destructive'].map(type => html`
        <div style="margin-bottom: 32px;">
          <h3 style="margin-bottom: 16px; text-transform: capitalize;">${type} Type</h3>
          
          <!-- Normal State -->
          <div style="margin-bottom: 16px;">
            <h4 style="margin-bottom: 12px; font-size: 14px; color: #666;">Normal State</h4>
            <div style="display: flex; gap: 16px; align-items: center;">
              ${['filled', 'outline', 'ghost'].map(variant => html`
                <div style="text-align: center;">
                  <dive-icon-button
                    type=${type}
                    variant=${variant}
                    icon="scuba-mask"
                    aria-label="${type} ${variant} normal"
                  ></dive-icon-button>
                  <div style="font-size: 11px; color: #888; margin-top: 4px;">${variant}</div>
                </div>
              `)}
            </div>
          </div>
          
          <!-- Disabled State -->
          <div style="margin-bottom: 16px;">
            <h4 style="margin-bottom: 12px; font-size: 14px; color: #666;">Disabled State</h4>
            <div style="display: flex; gap: 16px; align-items: center;">
              ${['filled', 'outline', 'ghost'].map(variant => html`
                <div style="text-align: center;">
                  <dive-icon-button
                    type=${type}
                    variant=${variant}
                    icon="scuba-mask"
                    aria-label="${type} ${variant} disabled"
                    disabled
                  ></dive-icon-button>
                  <div style="font-size: 11px; color: #888; margin-top: 4px;">${variant}</div>
                </div>
              `)}
            </div>
          </div>
          
          <!-- Focus State Simulation -->
          <div style="margin-bottom: 16px;">
            <h4 style="margin-bottom: 12px; font-size: 14px; color: #666;">Focus State (Simulated)</h4>
            <div style="display: flex; gap: 16px; align-items: center;">
              ${['filled', 'outline', 'ghost'].map(variant => html`
                <div style="text-align: center;">
                  <div style="padding: 4px; outline: 2px solid ${
                    type === 'base' ? '#1d222c' : 
                    type === 'primary' ? '#2c72e0' : '#ea0d11'
                  }; outline-offset: 2px; border-radius: 8px;">
                    <dive-icon-button
                      type=${type}
                      variant=${variant}
                      icon="scuba-mask"
                      aria-label="${type} ${variant} focus"
                    ></dive-icon-button>
                  </div>
                  <div style="font-size: 11px; color: #888; margin-top: 4px;">${variant}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      `)}
      
      <!-- Icon Variety Test -->
      <div style="margin-bottom: 32px;">
        <h3 style="margin-bottom: 16px;">Icon Rendering Test</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          ${['scuba-mask', 'home', 'user', 'settings', 'edit', 'delete', 'save', 'plus', 'minus', 'check', 'x'].map(iconName => html`
            <dive-icon-button
              type="primary"
              variant="outline"
              icon=${iconName}
              aria-label="${iconName} icon test"
            ></dive-icon-button>
          `)}
        </div>
      </div>
      
      <!-- Color Accuracy Validation Section -->
      <div style="margin-bottom: 32px;">
        <h3 style="margin-bottom: 16px;">Color Accuracy Validation</h3>
        <div style="display: grid; gap: 16px;">
          <!-- Base Type Validation -->
          <div>
            <h4 style="margin-bottom: 8px; font-size: 14px;">Base Type Colors</h4>
            <div style="display: flex; gap: 16px; align-items: center;">
              <div style="text-align: center;">
                <dive-icon-button
                  type="base"
                  variant="filled"
                  icon="scuba-mask"
                  aria-label="Base filled validation"
                ></dive-icon-button>
                <div style="font-size: 10px; color: #888; margin-top: 4px;">
                  BG: #242a37<br/>FG: #ffffff
                </div>
              </div>
              <div style="text-align: center;">
                <dive-icon-button
                  type="base"
                  variant="outline"
                  icon="scuba-mask"
                  aria-label="Base outline validation"
                ></dive-icon-button>
                <div style="font-size: 10px; color: #888; margin-top: 4px;">
                  Text: #1d222c<br/>Border: #c7cad1
                </div>
              </div>
              <div style="text-align: center;">
                <dive-icon-button
                  type="base"
                  variant="ghost"
                  icon="scuba-mask"
                  aria-label="Base ghost validation"
                ></dive-icon-button>
                <div style="font-size: 10px; color: #888; margin-top: 4px;">
                  Text: #1d222c<br/>BG: transparent
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}; 