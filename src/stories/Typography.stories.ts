import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

/**
 * Typography showcases the Atkinson Hyperlegible Next font family implementation.
 * This font is specifically designed for high legibility and accessibility.
 */
const meta: Meta = {
  title: 'Foundation/Typography',
  parameters: {
    docs: {
      description: {
        component: `
# Typography

The Dive Design System uses **Atkinson Hyperlegible Next** as the primary font family. This font is specifically designed for people with visual impairments, including low vision, dyslexia, and other reading difficulties.

## Key Features
- Improved character recognition
- Clear distinction between similar characters (e.g., b/d, p/q)
- Optimized for accessibility
- Complete weight range from ExtraLight (200) to ExtraBold (800)

## Available Font Weights
- **ExtraLight (200)** - For subtle, light text
- **Light (300)** - For secondary information
- **Regular (400)** - Default body text
- **Medium (500)** - For emphasis
- **SemiBold (600)** - For headings and important text
- **Bold (700)** - For strong emphasis
- **ExtraBold (800)** - For display text and headers

All weights include both normal and italic styles.
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj;

/**
 * Typography hierarchy showing all heading levels with the Atkinson Hyperlegible Next font
 */
export const Headings: Story = {
  render: () => html`
    <div style="font-family: var(--font-family-primary); line-height: 1.6;">
      <h1 style="margin-bottom: 1rem;">Heading 1 - Display (36px, Bold)</h1>
      <h2 style="margin-bottom: 1rem;">Heading 2 - Section (30px, SemiBold)</h2>
      <h3 style="margin-bottom: 1rem;">Heading 3 - Subsection (24px, SemiBold)</h3>
      <h4 style="margin-bottom: 1rem;">Heading 4 - Component (20px, Medium)</h4>
      <h5 style="margin-bottom: 1rem;">Heading 5 - Small Heading (18px, Medium)</h5>
      <h6 style="margin-bottom: 1rem;">Heading 6 - Label (16px, Medium)</h6>
      
      <p style="margin-top: 2rem; font-size: 16px; color: var(--Color-Base-Foreground-default);">
        This is regular body text (16px, Regular 400). The Atkinson Hyperlegible Next font ensures 
        excellent readability with clear character distinctions. Notice how each letter is easily 
        distinguishable, making it ideal for users with visual impairments.
      </p>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Typography hierarchy using the Atkinson Hyperlegible Next font family with semantic heading levels.'
      }
    }
  }
};

/**
 * Font weight demonstration showing all available weights
 */
export const FontWeights: Story = {
  render: () => html`
    <div style="font-family: var(--font-family-primary); font-size: 18px; line-height: 2;">
      <div style="font-weight: var(--font-weight-extra-light);">
        ExtraLight (200) - The quick brown fox jumps over the lazy dog
      </div>
      <div style="font-weight: var(--font-weight-light);">
        Light (300) - The quick brown fox jumps over the lazy dog
      </div>
      <div style="font-weight: var(--font-weight-regular);">
        Regular (400) - The quick brown fox jumps over the lazy dog
      </div>
      <div style="font-weight: var(--font-weight-medium);">
        Medium (500) - The quick brown fox jumps over the lazy dog
      </div>
      <div style="font-weight: var(--font-weight-semi-bold);">
        SemiBold (600) - The quick brown fox jumps over the lazy dog
      </div>
      <div style="font-weight: var(--font-weight-bold);">
        Bold (700) - The quick brown fox jumps over the lazy dog
      </div>
      <div style="font-weight: var(--font-weight-extra-bold);">
        ExtraBold (800) - The quick brown fox jumps over the lazy dog
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All available font weights of Atkinson Hyperlegible Next, demonstrating the complete weight spectrum.'
      }
    }
  }
};

/**
 * Font styles including italic variants
 */
export const FontStyles: Story = {
  render: () => html`
    <div style="font-family: var(--font-family-primary); font-size: 18px; line-height: 2.5;">
      <div style="font-weight: var(--font-weight-light);">
        Light Normal - Clear and readable text
      </div>
      <div style="font-weight: var(--font-weight-light); font-style: italic;">
        Light Italic - Elegant slanted text for emphasis
      </div>
      
      <div style="font-weight: var(--font-weight-regular); margin-top: 1rem;">
        Regular Normal - Standard body text weight
      </div>
      <div style="font-weight: var(--font-weight-regular); font-style: italic;">
        Regular Italic - Emphasized body text
      </div>
      
      <div style="font-weight: var(--font-weight-medium); margin-top: 1rem;">
        Medium Normal - Slightly heavier for importance
      </div>
      <div style="font-weight: var(--font-weight-medium); font-style: italic;">
        Medium Italic - Strong emphasis with elegance
      </div>
      
      <div style="font-weight: var(--font-weight-bold); margin-top: 1rem;">
        Bold Normal - Strong emphasis
      </div>
      <div style="font-weight: var(--font-weight-bold); font-style: italic;">
        Bold Italic - Maximum emphasis with style
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Font styles showing both normal and italic variants across different weights.'
      }
    }
  }
};

/**
 * Accessibility features demonstration
 */
export const AccessibilityFeatures: Story = {
  render: () => html`
    <div style="font-family: var(--font-family-primary); font-size: 18px; line-height: 1.8;">
      <h3 style="margin-bottom: 1.5rem; font-weight: var(--font-weight-semi-bold);">
        Character Distinction Examples
      </h3>
      
      <div style="font-size: 24px; line-height: 2; background: var(--Color-Base-Subtle-Background-default); padding: 1.5rem; border-radius: 8px;">
        <div><strong>Similar characters are clearly distinguishable:</strong></div>
        <div style="margin-top: 1rem; font-weight: var(--font-weight-medium);">
          b d p q - Ball, Dog, Pen, Queen
        </div>
        <div style="font-weight: var(--font-weight-medium);">
          6 9 - Six, Nine
        </div>
        <div style="font-weight: var(--font-weight-medium);">
          I l 1 - India, Lima, One
        </div>
        <div style="font-weight: var(--font-weight-medium);">
          O 0 - Oscar, Zero
        </div>
        <div style="font-weight: var(--font-weight-medium);">
          rn m - Run, Mary
        </div>
      </div>
      
      <div style="margin-top: 2rem;">
        <h4 style="font-weight: var(--font-weight-medium); margin-bottom: 1rem;">
          Reading Comfort Features:
        </h4>
        <ul style="margin: 0; padding-left: 1.5rem;">
          <li>Improved x-height for better readability at small sizes</li>
          <li>Clear ascenders and descenders to prevent confusion</li>
          <li>Generous spacing between letters</li>
          <li>Optimized for screen reading</li>
          <li>Supports dyslexia-friendly reading patterns</li>
        </ul>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of accessibility features in Atkinson Hyperlegible Next, showing clear character distinction and reading comfort features.'
      }
    }
  }
};

/**
 * Font combinations with monospace
 */
export const FontCombinations: Story = {
  render: () => html`
    <div style="font-family: var(--font-family-primary); line-height: 1.6;">
      <h3 style="font-weight: var(--font-weight-semi-bold); margin-bottom: 1.5rem;">
        Font Family Combinations
      </h3>
      
      <div style="margin-bottom: 2rem;">
        <h4 style="font-weight: var(--font-weight-medium); margin-bottom: 0.5rem;">
          Primary Font (Atkinson Hyperlegible Next)
        </h4>
        <p style="font-size: 16px; margin: 0;">
          This is the primary font used for all body text, headings, and interface elements. 
          It provides excellent readability and accessibility.
        </p>
      </div>
      
      <div style="margin-bottom: 2rem;">
        <h4 style="font-weight: var(--font-weight-medium); margin-bottom: 0.5rem;">
          Monospace Font (Code)
        </h4>
        <p style="margin-bottom: 0.5rem;">For code snippets and technical content:</p>
        <code style="
          font-family: var(--font-family-mono);
          background: var(--Color-Base-Subtle-Background-default);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 14px;
        ">
          const message = 'Hello, accessible world!';
        </code>
      </div>
      
      <div style="background: var(--Color-Primary-Subtle-Background-default); padding: 1.5rem; border-radius: 8px;">
        <h4 style="font-weight: var(--font-weight-semi-bold); margin-bottom: 1rem; color: var(--Color-Primary-Primary-Background-default);">
          Example Interface Text
        </h4>
        <p style="margin-bottom: 1rem; color: var(--Color-Primary-Subtle-Foreground-default);">
          This demonstrates how the Atkinson Hyperlegible Next font appears in interface contexts
          with design tokens for color and spacing.
        </p>
        <button style="
          font-family: var(--font-family-primary);
          font-weight: var(--font-weight-medium);
          background: var(--Color-Primary-Primary-Background-default);
          color: var(--Color-Primary-Primary-Foreground-default);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
        ">
          Example Button
        </button>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Examples of font combinations showing primary and monospace fonts in typical interface contexts.'
      }
    }
  }
}; 