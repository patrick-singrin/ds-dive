import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

// Create a simple wrapper for documentation-only stories
const TokensDocumentation = () => html`<div></div>`;

const meta: Meta = {
  title: 'Foundation/Design Tokens',
  component: 'div', // Use div as the component for documentation stories
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => html`
        <div style="padding: 2rem; max-width: 1200px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.5rem; font-weight: 700; color: var(--Color-Primary-Primary-Background-default, #2c72e0); margin: 0 0 1rem 0;">
              Design Tokens
            </h1>
            <p style="font-size: 1.125rem; color: var(--Color-Base-Foreground-default, #1d222c); margin: 0; line-height: 1.6;">
              The Dive Design System uses a comprehensive token architecture based on the W3C Design Tokens specification.
            </p>
          </header>
          
          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.875rem; font-weight: 600; color: var(--Color-Base-Foreground-default, #1d222c); margin: 0 0 1.5rem 0;">
              Color System
            </h2>
            <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); margin: 2rem 0;">
              <div style="padding: 1.5rem; border-radius: 12px; background: var(--Color-Primary-Primary-Background-default, #2c72e0); color: var(--Color-Primary-Primary-Foreground-default, #ffffff); border: 1px solid var(--Color-Base-Border-default, #c7cad1);">
                <strong style="display: block; margin-bottom: 0.5rem; font-size: 1.125rem;">Primary</strong>
                <code style="font-size: 0.875rem; opacity: 0.9; font-family: ui-monospace, 'SF Mono', Monaco, monospace;">--Color-Primary-Primary-Background-default</code>
              </div>
              <div style="padding: 1.5rem; border-radius: 12px; background: var(--Color-Base-Subtle-Background-default, #ecedf0); color: var(--Color-Base-Subtle-Foreground-default, #31394a); border: 1px solid var(--Color-Base-Border-default, #c7cad1);">
                <strong style="display: block; margin-bottom: 0.5rem; font-size: 1.125rem;">Base Subtle</strong>
                <code style="font-size: 0.875rem; opacity: 0.8; font-family: ui-monospace, 'SF Mono', Monaco, monospace;">--Color-Base-Subtle-Background-default</code>
              </div>
              <div style="padding: 1.5rem; border-radius: 12px; background: var(--Color-Base-Primary-Background-default, #242a37); color: var(--Color-Base-Primary-Foreground-default, #ffffff); border: 1px solid var(--Color-Base-Border-default, #c7cad1);">
                <strong style="display: block; margin-bottom: 0.5rem; font-size: 1.125rem;">Base Primary</strong>
                <code style="font-size: 0.875rem; opacity: 0.9; font-family: ui-monospace, 'SF Mono', Monaco, monospace;">--Color-Base-Primary-Background-default</code>
              </div>
            </div>
          </section>
          
          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.875rem; font-weight: 600; color: var(--Color-Base-Foreground-default, #1d222c); margin: 0 0 1.5rem 0;">
              Spacing Scale
            </h2>
            <div style="margin: 2rem 0; background: var(--Color-Base-Background-default, #ffffff); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--Color-Base-Border-default, #c7cad1);">
              ${[2, 3, 4, 5, 6, 8, 10, 12].map(space => html`
                <div style="display: flex; align-items: center; margin: 1rem 0; padding: 0.5rem 0;">
                  <div style="width: 120px; font-family: ui-monospace, 'SF Mono', Monaco, monospace; font-size: 0.875rem; color: var(--Color-Base-Foreground-default, #1d222c);">--Spacing-${space}</div>
                  <div style="width: ${space * 4}px; height: 20px; background: var(--Color-Primary-Primary-Background-default, #2c72e0); margin: 0 1rem; border-radius: 4px;"></div>
                  <div style="font-family: ui-monospace, 'SF Mono', Monaco, monospace; color: var(--Color-Base-Foreground-default, #1d222c); font-size: 0.875rem;">${space * 4}px</div>
                </div>
              `)}
            </div>
          </section>
          
          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.875rem; font-weight: 600; color: var(--Color-Base-Foreground-default, #1d222c); margin: 0 0 1.5rem 0;">
              Usage Examples
            </h2>
            
            <div style="display: grid; gap: 2rem; grid-template-columns: 1fr 1fr; margin: 2rem 0;">
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--Color-Base-Foreground-default, #1d222c); margin: 0 0 1rem 0;">CSS</h3>
                <pre style="background: var(--Color-Base-Subtle-Background-default, #ecedf0); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 0; font-family: ui-monospace, 'SF Mono', Monaco, monospace; font-size: 0.875rem; line-height: 1.5;"><code>/* Component styling with tokens */
.my-component {
  background: var(--Color-Primary-Primary-Background-default);
  color: var(--Color-Primary-Primary-Foreground-default);
  padding: var(--Spacing-4);
  border-radius: var(--border-border-radius-md);
  border: 1px solid var(--Color-Base-Border-default);
}</code></pre>
              </div>
              
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--Color-Base-Foreground-default, #1d222c); margin: 0 0 1rem 0;">JavaScript</h3>
                <pre style="background: var(--Color-Base-Subtle-Background-default, #ecedf0); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 0; font-family: ui-monospace, 'SF Mono', Monaco, monospace; font-size: 0.875rem; line-height: 1.5;"><code>// Token utilities
import { getTokenValue, setTokenValue } from '@dive/design-system';

const primaryColor = getTokenValue('Color-Primary-Primary-Background-default');
setTokenValue('Color-Primary-Primary-Background-default', '#new-color');</code></pre>
              </div>
            </div>
          </section>
          
          <section>
            <h2 style="font-size: 1.875rem; font-weight: 600; color: var(--Color-Base-Foreground-default, #1d222c); margin: 0 0 1.5rem 0;">
              Theme System
            </h2>
            
            <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin: 2rem 0;">
              <div style="padding: 1rem; border: 1px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 8px; text-align: center;">
                <div style="width: 40px; height: 40px; background: #ffffff; border: 2px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 8px; margin: 0 auto 0.5rem auto;"></div>
                <strong style="display: block; margin-bottom: 0.25rem;">Light</strong>
                <small style="color: var(--Color-Base-Foreground-default, #1d222c); opacity: 0.7;">Default theme</small>
              </div>
              
              <div style="padding: 1rem; border: 1px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 8px; text-align: center;">
                <div style="width: 40px; height: 40px; background: #1d222c; border: 2px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 8px; margin: 0 auto 0.5rem auto;"></div>
                <strong style="display: block; margin-bottom: 0.25rem;">Dark</strong>
                <small style="color: var(--Color-Base-Foreground-default, #1d222c); opacity: 0.7;">Dark mode variant</small>
              </div>
              
              <div style="padding: 1rem; border: 1px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 8px; text-align: center;">
                <div style="width: 40px; height: 40px; background: linear-gradient(45deg, #ffffff 50%, #000000 50%); border: 2px solid var(--Color-Base-Border-default, #c7cad1); border-radius: 8px; margin: 0 auto 0.5rem auto;"></div>
                <strong style="display: block; margin-bottom: 0.25rem;">High Contrast</strong>
                <small style="color: var(--Color-Base-Foreground-default, #1d222c); opacity: 0.7;">Enhanced accessibility</small>
              </div>
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
 * Design tokens overview and usage documentation
 */
export const TokenOverview: Story = {
  render: () => html`
    <div style="padding: 2rem; text-align: center;">
      <h2 style="color: var(--Color-Primary-Primary-Background-default, #2c72e0); margin-bottom: 1rem;">Design Tokens Documentation</h2>
      <p style="color: var(--Color-Base-Foreground-default, #1d222c);">
        Switch to the "Docs" tab to view the complete design tokens documentation.
      </p>
    </div>
  `
};
