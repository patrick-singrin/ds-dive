import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Design System/Introduction',
  component: 'div', // Use div as the component for documentation stories
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => html`
        <div style="padding: 2rem; max-width: 1200px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <header style="text-align: center; margin-bottom: 3rem;">
            <h1 style="font-size: 3rem; font-weight: 700; color: var(--Color-Primary-Primary-Background-default, #2c72e0); margin: 0 0 1rem 0;">
              Dive Design System
            </h1>
            <p style="font-size: 1.25rem; color: var(--Color-Base-Foreground-default, #1d222c); margin: 0;">
              Modern Web Components with Storybook and Design Tokens
            </p>
          </header>

          <div style="display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); margin-bottom: 3rem;">
            <div style="padding: 1.5rem; border: 1px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 12px; background: var(--Color-Base-Background-default, #ffffff);">
              <h3 style="margin: 0 0 1rem 0; color: var(--Color-Primary-Primary-Background-default, #2c72e0);">🧩 Web Components</h3>
              <p style="margin: 0; color: var(--Color-Base-Foreground-default, #1d222c); line-height: 1.6;">
                Framework-agnostic components built with Lit. Works seamlessly with React, Vue, Angular, and vanilla JavaScript.
              </p>
            </div>

            <div style="padding: 1.5rem; border: 1px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 12px; background: var(--Color-Base-Background-default, #ffffff);">
              <h3 style="margin: 0 0 1rem 0; color: var(--Color-Primary-Primary-Background-default, #2c72e0);">🎨 Design Tokens</h3>
              <p style="margin: 0; color: var(--Color-Base-Foreground-default, #1d222c); line-height: 1.6;">
                W3C-compliant design token system with CSS custom properties for consistent theming and styling.
              </p>
            </div>

            <div style="padding: 1.5rem; border: 1px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 12px; background: var(--Color-Base-Background-default, #ffffff);">
              <h3 style="margin: 0 0 1rem 0; color: var(--Color-Primary-Primary-Background-default, #2c72e0);">♿ Accessibility</h3>
              <p style="margin: 0; color: var(--Color-Base-Foreground-default, #1d222c); line-height: 1.6;">
                WCAG 2.1 AA compliance built-in with proper ARIA attributes, keyboard navigation, and screen reader support.
              </p>
            </div>

            <div style="padding: 1.5rem; border: 1px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 12px; background: var(--Color-Base-Background-default, #ffffff);">
              <h3 style="margin: 0 0 1rem 0; color: var(--Color-Primary-Primary-Background-default, #2c72e0);">⚡ Performance</h3>
              <p style="margin: 0; color: var(--Color-Base-Foreground-default, #1d222c); line-height: 1.6;">
                Optimized for modern browsers with tree-shaking, minimal bundle sizes, and efficient rendering.
              </p>
            </div>

            <div style="padding: 1.5rem; border: 1px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 12px; background: var(--Color-Base-Background-default, #ffffff);">
              <h3 style="margin: 0 0 1rem 0; color: var(--Color-Primary-Primary-Background-default, #2c72e0);">🔧 TypeScript</h3>
              <p style="margin: 0; color: var(--Color-Base-Foreground-default, #1d222c); line-height: 1.6;">
                Full type safety and excellent developer experience with auto-completion and compile-time validation.
              </p>
            </div>

            <div style="padding: 1.5rem; border: 1px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 12px; background: var(--Color-Base-Background-default, #ffffff);">
              <h3 style="margin: 0 0 1rem 0; color: var(--Color-Primary-Primary-Background-default, #2c72e0);">🎭 Tabler Icons</h3>
              <p style="margin: 0; color: var(--Color-Base-Foreground-default, #1d222c); line-height: 1.6;">
                5,880+ beautiful SVG icons with consistent design and seamless integration with the component system.
              </p>
            </div>
          </div>

          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 2rem; font-weight: 600; color: var(--Color-Base-Foreground-default, #1d222c); margin: 0 0 1.5rem 0;">
              Getting Started
            </h2>
            
            <div style="background: var(--Color-Base-Subtle-Background-default, #ecedf0); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
              <h4 style="margin: 0 0 1rem 0; color: var(--Color-Base-Foreground-default, #1d222c);">Installation</h4>
              <code style="background: var(--Color-Base-Background-default, #ffffff); padding: 0.5rem 1rem; border-radius: 6px; font-family: ui-monospace, 'SF Mono', Monaco, monospace; display: block;">
                npm install @dive/design-system
              </code>
            </div>

            <div style="background: var(--Color-Base-Subtle-Background-default, #ecedf0); padding: 1.5rem; border-radius: 8px;">
              <h4 style="margin: 0 0 1rem 0; color: var(--Color-Base-Foreground-default, #1d222c);">Usage</h4>
              <pre style="background: var(--Color-Base-Background-default, #ffffff); padding: 1rem; border-radius: 6px; font-family: ui-monospace, 'SF Mono', Monaco, monospace; overflow-x: auto; margin: 0;"><code>import '@dive/design-system';

&lt;dive-blueprint variant="primary" text="Hello World"&gt;&lt;/dive-blueprint&gt;
&lt;dive-icon name="home" size="medium" color="primary"&gt;&lt;/dive-icon&gt;</code></pre>
            </div>
          </section>

          <section>
            <h2 style="font-size: 2rem; font-weight: 600; color: var(--Color-Base-Foreground-default, #1d222c); margin: 0 0 1.5rem 0;">
              Navigation
            </h2>
            
            <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
              <a href="?path=/docs/design-system-foundation-blueprint--docs" style="display: block; padding: 1rem; border: 1px solid var(--Color-Primary-Primary-Background-default, #2c72e0); border-radius: 8px; text-decoration: none; color: var(--Color-Primary-Primary-Background-default, #2c72e0); transition: all 0.2s; cursor: pointer;" 
                 onclick="window.parent.postMessage({type: 'navigate', path: '/docs/design-system-foundation-blueprint--docs'}, '*')">
                <strong>Blueprint Component</strong><br>
                <small style="color: var(--Color-Base-Foreground-default, #1d222c);">Reference implementation with all patterns</small>
              </a>
              
              <a href="?path=/docs/design-system-components-icon--docs" style="display: block; padding: 1rem; border: 1px solid var(--Color-Primary-Primary-Background-default, #2c72e0); border-radius: 8px; text-decoration: none; color: var(--Color-Primary-Primary-Background-default, #2c72e0); transition: all 0.2s; cursor: pointer;"
                 onclick="window.parent.postMessage({type: 'navigate', path: '/docs/design-system-components-icon--docs'}, '*')">
                <strong>Icon Component</strong><br>
                <small style="color: var(--Color-Base-Foreground-default, #1d222c);">Tabler Icons integration</small>
              </a>
              
              <a href="?path=/docs/design-system-tokens-overview--docs" style="display: block; padding: 1rem; border: 1px solid var(--Color-Primary-Primary-Background-default, #2c72e0); border-radius: 8px; text-decoration: none; color: var(--Color-Primary-Primary-Background-default, #2c72e0); transition: all 0.2s; cursor: pointer;"
                 onclick="window.parent.postMessage({type: 'navigate', path: '/docs/design-system-tokens-overview--docs'}, '*')">
                <strong>Design Tokens</strong><br>
                <small style="color: var(--Color-Base-Foreground-default, #1d222c);">Token system documentation</small>
              </a>
            </div>
          </section>
        </div>
      `
    }
  }
};

export default meta;
type Story = StoryObj;

/**
 * Welcome to the Dive Design System
 */
export const Overview: Story = {
  render: () => html`
    <div style="padding: 2rem; text-align: center;">
      <h2 style="color: var(--Color-Primary-Primary-Background-default, #2c72e0); margin-bottom: 1rem;">Welcome to Dive Design System</h2>
      <p style="color: var(--Color-Base-Foreground-default, #1d222c);">
        Switch to the "Docs" tab to view the complete introduction and getting started guide.
      </p>
    </div>
  `
};
