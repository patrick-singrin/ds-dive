import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './TabItem.js';
import './TabBar.js';

/**
 * ## TabItem & TabBar Components
 * 
 * A comprehensive tab system consisting of:
 * - **TabItem**: Individual interactive tab elements
 * - **TabBar**: Container component that manages multiple tabs
 * 
 * ### Design Variants
 * - **Orientations**: `horizontal`, `vertical` 
 * - **Types**: `ghost`, `line`, `pill`
 * - **Colors**: `base`, `primary`
 * - **States**: `default`, `selected`, `disabled`
 * 
 * ### Key Features
 * - Automatic selection management within TabBar
 * - Keyboard navigation support
 * - WCAG 2.1 AA accessibility compliance
 * - Icon support (left and right)
 * - Custom event handling (`tab-bar-change`)
 */
const meta: Meta = {
  title: 'Components/Tab System',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
TabItem and TabBar components work together to create flexible navigation interfaces.
TabBar automatically manages selection state and provides proper ARIA support.

**Import both components:**
\`\`\`javascript
import { TabItem, TabBar } from '@dive/design-system';
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Template for individual TabItem examples
const TabItemTemplate = (args: any) => html`
  <dive-tab-item
    orientation=${ifDefined(args.orientation)}
    type=${ifDefined(args.type)}
    color=${ifDefined(args.color)}
    text=${ifDefined(args.text)}
    ?selected=${args.selected}
    ?disabled=${args.disabled}
    left-icon=${ifDefined(args.leftIcon)}
    right-icon=${ifDefined(args.rightIcon)}
    ?show-left-icon=${args.showLeftIcon}
    ?show-right-icon=${args.showRightIcon}
    aria-label=${ifDefined(args.ariaLabel)}
  ></dive-tab-item>
`;

// Template for TabBar examples
const TabBarTemplate = (args: any) => html`
  <dive-tab-bar
    orientation=${ifDefined(args.orientation)}
    type=${ifDefined(args.type)}
    color=${ifDefined(args.color)}
    aria-label=${ifDefined(args.ariaLabel)}
  >
    <dive-tab-item 
      text="Home" 
      selected
      left-icon="home" 
      ?show-left-icon=${args.showIcons}
    ></dive-tab-item>
    <dive-tab-item 
      text="Search" 
      left-icon="search" 
      ?show-left-icon=${args.showIcons}
    ></dive-tab-item>
    <dive-tab-item 
      text="Profile" 
      left-icon="user" 
      ?show-left-icon=${args.showIcons}
    ></dive-tab-item>
    <dive-tab-item 
      text="Settings" 
      left-icon="settings" 
      ?show-left-icon=${args.showIcons}
      disabled
    ></dive-tab-item>
  </dive-tab-bar>
`;

/**
 * Individual TabItem component demonstration showing all properties and states.
 */
export const IndividualTabItem: Story = {
  render: TabItemTemplate,
  args: {
    orientation: 'horizontal',
    type: 'ghost',
    color: 'base',
    text: 'Tab Item',
    selected: false,
    disabled: false,
    leftIcon: 'home',
    rightIcon: 'chevron-down',
    showLeftIcon: true,
    showRightIcon: false,
    ariaLabel: 'Navigation tab'
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation of the tab'
    },
    type: {
      control: { type: 'select' },
      options: ['ghost', 'line', 'pill'],
      description: 'Visual style variant'
    },
    color: {
      control: { type: 'select' },
      options: ['base', 'primary'],
      description: 'Color scheme'
    },
    text: {
      control: { type: 'text' },
      description: 'Tab label text'
    },
    selected: {
      control: { type: 'boolean' },
      description: 'Selected state'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state'
    },
    showLeftIcon: {
      control: { type: 'boolean' },
      description: 'Show left icon'
    },
    showRightIcon: {
      control: { type: 'boolean' },
      description: 'Show right icon'
    },
    leftIcon: {
      control: { type: 'text' },
      description: 'Left icon name'
    },
    rightIcon: {
      control: { type: 'text' },
      description: 'Right icon name'
    }
  }
};

/**
 * Horizontal navigation patterns using TabBar container.
 * Matches Figma horizontal tab bar designs.
 * 
 * ✨ **Automatic Configuration**: TabBar automatically applies its `orientation`, `type`, 
 * and `color` properties to all child TabItems. You only need to set these on the TabBar!
 */
export const HorizontalNavigation: Story = {
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
                  <h3>Line Style</h3>
        <!-- ✨ Child TabItems automatically inherit: orientation="horizontal" type="line" color="base" -->
<dive-tab-bar orientation="horizontal" type="line" color="base">
          <dive-tab-item text="Overview" selected left-icon="home" show-left-icon></dive-tab-item>
          <dive-tab-item text="Analytics" left-icon="chart" show-left-icon></dive-tab-item>
          <dive-tab-item text="Reports" left-icon="document" show-left-icon></dive-tab-item>
          <dive-tab-item text="Settings" left-icon="settings" show-left-icon></dive-tab-item>
        </dive-tab-bar>
      </div>

      <div>
        <h3>Line Style</h3>
        <!-- ✨ Child TabItems automatically inherit: orientation="horizontal" type="line" color="primary" -->
        <dive-tab-bar orientation="horizontal" type="line" color="primary">
          <dive-tab-item text="Dashboard" selected left-icon="grid" show-left-icon></dive-tab-item>
          <dive-tab-item text="Projects" left-icon="folder" show-left-icon></dive-tab-item>
          <dive-tab-item text="Team" left-icon="users" show-left-icon></dive-tab-item>
          <dive-tab-item text="Admin" left-icon="shield" show-left-icon disabled></dive-tab-item>
        </dive-tab-bar>
      </div>

      <div>
        <h3>Pill Style</h3>
        <!-- ✨ Child TabItems automatically inherit: orientation="horizontal" type="pill" color="base" -->
        <dive-tab-bar orientation="horizontal" type="pill" color="base">
          <dive-tab-item text="All" selected></dive-tab-item>
          <dive-tab-item text="Active"></dive-tab-item>
          <dive-tab-item text="Draft"></dive-tab-item>
          <dive-tab-item text="Archived"></dive-tab-item>
        </dive-tab-bar>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Horizontal tab bars for main navigation. Ghost and line types provide clean layouts, while pill type offers contained grouping.'
      }
    }
  }
};

/**
 * Vertical navigation patterns using TabBar container.
 * Matches Figma vertical tab bar designs.
 * 
 * ✨ **Automatic Configuration**: Each TabBar applies its properties to child TabItems.
 */
export const VerticalNavigation: Story = {
  render: (args) => html`
    <div style="display: flex; gap: 3rem; align-items: flex-start;">
      <div>
                  <h3>Vertical Line</h3>
        <!-- ✨ Child TabItems automatically inherit: orientation="vertical" type="line" color="primary" -->
<dive-tab-bar orientation="vertical" type="line" color="primary">
          <dive-tab-item text="Inbox" selected left-icon="inbox" show-left-icon right-icon="chevron-right" show-right-icon></dive-tab-item>
          <dive-tab-item text="Sent" left-icon="send" show-left-icon right-icon="chevron-right" show-right-icon></dive-tab-item>
          <dive-tab-item text="Draft" left-icon="edit" show-left-icon right-icon="chevron-right" show-right-icon></dive-tab-item>
          <dive-tab-item text="Spam" left-icon="alert" show-left-icon right-icon="chevron-right" show-right-icon></dive-tab-item>
        </dive-tab-bar>
      </div>

      <div>
        <h3>Vertical Line</h3>
        <dive-tab-bar orientation="vertical" type="line" color="base">
          <dive-tab-item text="General" selected left-icon="settings" show-left-icon></dive-tab-item>
          <dive-tab-item text="Account" left-icon="user" show-left-icon></dive-tab-item>
          <dive-tab-item text="Security" left-icon="shield" show-left-icon></dive-tab-item>
          <dive-tab-item text="Billing" left-icon="credit-card" show-left-icon></dive-tab-item>
        </dive-tab-bar>
      </div>

      <div>
        <h3>Vertical Pill</h3>
        <dive-tab-bar orientation="vertical" type="pill" color="base">
          <dive-tab-item text="Design" selected left-icon="palette" show-left-icon></dive-tab-item>
          <dive-tab-item text="Code" left-icon="code" show-left-icon></dive-tab-item>
          <dive-tab-item text="Deploy" left-icon="upload" show-left-icon></dive-tab-item>
          <dive-tab-item text="Monitor" left-icon="activity" show-left-icon></dive-tab-item>
        </dive-tab-bar>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Vertical tab bars perfect for sidebar navigation. Supports icons on both sides for enhanced information hierarchy.'
      }
    }
  }
};

/**
 * Interactive playground for testing TabBar functionality.
 */
export const InteractiveTabBar: Story = {
  render: TabBarTemplate,
  args: {
    orientation: 'horizontal',
    type: 'line',
    color: 'base',
    showIcons: true,
    ariaLabel: 'Main navigation'
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'TabBar layout orientation'
    },
    type: {
      control: { type: 'select' },
      options: ['ghost', 'line', 'pill'],
      description: 'TabBar visual style'
    },
    color: {
      control: { type: 'select' },
      options: ['base', 'primary'],
      description: 'TabBar color scheme'
    },
    showIcons: {
      control: { type: 'boolean' },
      description: 'Show icons in tabs'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test different TabBar configurations. Selection is automatically managed by the TabBar component.'
      }
    }
  }
};

/**
 * Comprehensive visual regression matrix showing all component variants.
 * Used for automated visual testing in Chromatic.
 */
export const VisualRegressionMatrix: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 3rem; padding: 1rem;">
      <!-- Horizontal Variants -->
      <div>
        <h2>Horizontal TabBars</h2>
        <div style="display: grid; gap: 2rem;">
          <!-- Line Types (Default) -->
          <div>
            <h3>Line - Base (Default)</h3>
            <dive-tab-bar orientation="horizontal" type="line" color="base">
<dive-tab-item text="Tab 1" selected left-icon="home" show-left-icon></dive-tab-item>
<dive-tab-item text="Tab 2" left-icon="search" show-left-icon></dive-tab-item>
<dive-tab-item text="Tab 3" left-icon="user" show-left-icon disabled></dive-tab-item>
</dive-tab-bar>
          </div>

          <div>
                          <h3>Line - Primary</h3>
            <dive-tab-bar orientation="horizontal" type="line" color="primary">
              <dive-tab-item text="Tab 1" selected left-icon="home" show-left-icon></dive-tab-item>
              <dive-tab-item text="Tab 2" left-icon="search" show-left-icon></dive-tab-item>
              <dive-tab-item text="Tab 3" left-icon="user" show-left-icon disabled></dive-tab-item>
            </dive-tab-bar>
          </div>

          <!-- Line Types -->
          <div>
            <h3>Line - Base</h3>
            <dive-tab-bar orientation="horizontal" type="line" color="base">
              <dive-tab-item text="Tab 1" selected left-icon="grid" show-left-icon></dive-tab-item>
              <dive-tab-item text="Tab 2" left-icon="chart" show-left-icon></dive-tab-item>
              <dive-tab-item text="Tab 3" left-icon="settings" show-left-icon disabled></dive-tab-item>
            </dive-tab-bar>
          </div>

          <div>
            <h3>Line - Primary</h3>
            <dive-tab-bar orientation="horizontal" type="line" color="primary">
              <dive-tab-item text="Tab 1" selected left-icon="grid" show-left-icon></dive-tab-item>
              <dive-tab-item text="Tab 2" left-icon="chart" show-left-icon></dive-tab-item>
              <dive-tab-item text="Tab 3" left-icon="settings" show-left-icon disabled></dive-tab-item>
            </dive-tab-bar>
          </div>

          <!-- Pill Types -->
          <div>
            <h3>Pill - Base</h3>
            <dive-tab-bar orientation="horizontal" type="pill" color="base">
              <dive-tab-item text="Tab 1" selected></dive-tab-item>
              <dive-tab-item text="Tab 2"></dive-tab-item>
              <dive-tab-item text="Tab 3" disabled></dive-tab-item>
            </dive-tab-bar>
          </div>
        </div>
      </div>

      <!-- Vertical Variants -->
      <div>
        <h2>Vertical TabBars</h2>
        <div style="display: flex; gap: 2rem; align-items: flex-start;">
          <div>
            <h3>Line - Base (Default)</h3>
            <dive-tab-bar orientation="vertical" type="line" color="base">
              <dive-tab-item text="Tab 1" selected left-icon="inbox" show-left-icon right-icon="chevron-right" show-right-icon></dive-tab-item>
              <dive-tab-item text="Tab 2" left-icon="send" show-left-icon right-icon="chevron-right" show-right-icon></dive-tab-item>
              <dive-tab-item text="Tab 3" left-icon="edit" show-left-icon right-icon="chevron-right" show-right-icon disabled></dive-tab-item>
            </dive-tab-bar>
          </div>

          <div>
            <h3>Line - Primary</h3>
            <dive-tab-bar orientation="vertical" type="line" color="primary">
              <dive-tab-item text="Tab 1" selected left-icon="user" show-left-icon></dive-tab-item>
              <dive-tab-item text="Tab 2" left-icon="shield" show-left-icon></dive-tab-item>
              <dive-tab-item text="Tab 3" left-icon="credit-card" show-left-icon disabled></dive-tab-item>
            </dive-tab-bar>
          </div>

          <div>
            <h3>Pill - Base</h3>
            <dive-tab-bar orientation="vertical" type="pill" color="base">
              <dive-tab-item text="Tab 1" selected left-icon="palette" show-left-icon></dive-tab-item>
              <dive-tab-item text="Tab 2" left-icon="code" show-left-icon></dive-tab-item>
              <dive-tab-item text="Tab 3" left-icon="upload" show-left-icon disabled></dive-tab-item>
            </dive-tab-bar>
          </div>
        </div>
      </div>

      <!-- Individual TabItem States -->
      <div>
        <h2>Individual TabItem States</h2>
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <dive-tab-item text="Default" type="line" color="base"></dive-tab-item>
<dive-tab-item text="Selected" type="line" color="base" selected></dive-tab-item>
<dive-tab-item text="Disabled" type="line" color="base" disabled></dive-tab-item>
<dive-tab-item text="With Icons" type="line" color="base" left-icon="star" show-left-icon right-icon="chevron-down" show-right-icon></dive-tab-item>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Complete visual regression test matrix covering all TabItem and TabBar variants, orientations, and states. Used for automated visual testing.'
      }
    },
    chromatic: {
      viewports: [375, 768, 1200], // Test across different screen sizes
      modes: {
        light: { theme: 'light' },
        dark: { theme: 'dark' },
        'high-contrast': { theme: 'high-contrast' }
      }
    }
  }
};

/**
 * Accessibility demonstration showing proper ARIA usage and keyboard navigation.
 */
export const AccessibilityDemo: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h3>Proper ARIA Labeling</h3>
        <dive-tab-bar aria-label="Main site navigation" orientation="horizontal" type="line" color="primary">
          <dive-tab-item text="Home" selected aria-label="Navigate to homepage"></dive-tab-item>
          <dive-tab-item text="About" aria-label="Learn about our company"></dive-tab-item>
          <dive-tab-item text="Contact" aria-label="Get in touch with us"></dive-tab-item>
        </dive-tab-bar>
      </div>

      <div>
        <h3>Keyboard Navigation</h3>
        <p>Use <kbd>Tab</kbd> to focus, <kbd>Space</kbd> or <kbd>Enter</kbd> to select tabs.</p>
        <dive-tab-bar aria-label="Settings sections" orientation="vertical" type="line" color="base">
          <dive-tab-item text="General" selected left-icon="settings" show-left-icon aria-label="General settings"></dive-tab-item>
          <dive-tab-item text="Privacy" left-icon="shield" show-left-icon aria-label="Privacy settings"></dive-tab-item>
          <dive-tab-item text="Account" left-icon="user" show-left-icon aria-label="Account settings"></dive-tab-item>
        </dive-tab-bar>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features including proper ARIA labeling, keyboard navigation, and focus management. Both components meet WCAG 2.1 AA standards.'
      }
    }
  }
}; 