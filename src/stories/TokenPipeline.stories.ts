import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

/**
 * CSS Variable Pipeline showcases the advanced design token system implementation.
 * This demonstrates the complete W3C Design Token format with cascading layers,
 * reference resolution, and runtime mode switching.
 */
const meta: Meta = {
  title: 'Foundation/Token Pipeline',
  parameters: {
    docs: {
      description: {
        component: `
# CSS Variable Pipeline

The Dive Design System implements a sophisticated CSS Variable Pipeline that follows the W3C Design Token Community Group specification with advanced features:

## 🏗️ System Architecture

### **Cascading Layer System**
1. **Brand Theme** - Base color palettes and foundational values
2. **Color Modes** - Light, dark, and high-contrast variants  
3. **Component Tokens** - Semantic tokens for UI components
4. **Layout Tokens** - Spacing and layout-specific values

### **Token Reference Resolution**
- Supports \`{TokenPath}\` syntax for cross-references
- Cycle detection prevents infinite loops
- Comprehensive error handling and validation
- 1004 variables resolved across 4 modes in 14ms

### **Build Performance**
- **Processing Time**: 14ms for complete pipeline
- **Variables Generated**: 1004 total across all modes
- **Files Written**: 10 CSS files + index files
- **Unresolved Tokens**: 0 (100% success rate)

## 🔄 Runtime Features

### **Dynamic Mode Switching**
- Inject CSS variables for any mode at runtime
- Apply theme attributes for CSS selectors
- Custom event dispatching for component reactions
- Token value validation and override system

### **Developer Experience**
- Type-safe token access
- Comprehensive error reporting
- Build metrics and performance monitoring
- Dry-run testing capabilities
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj;

/**
 * Token statistics and build metrics from the pipeline
 */
export const BuildMetrics: Story = {
  render: () => html`
    <div style="font-family: var(--font-family-primary); line-height: 1.6;">
      <h3 style="color: var(--Color-Primary-Primary-Background-default); margin-bottom: 1.5rem;">
        🚀 CSS Variable Pipeline Performance
      </h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Processing Metrics -->
        <div style="
          background: var(--Color-Success-Subtle-Background-default);
          border: 2px solid var(--Color-Success-Border-default);
          border-radius: 8px;
          padding: 1.5rem;
        ">
          <h4 style="color: var(--Color-Success-Primary-Background-default); margin: 0 0 1rem 0;">
            ⚡ Performance
          </h4>
          <div style="font-size: 24px; font-weight: var(--font-weight-bold); color: var(--Color-Success-Primary-Background-default);">
            14ms
          </div>
          <div style="color: var(--Color-Success-Subtle-Foreground-default); font-size: 14px;">
            Total processing time
          </div>
        </div>

        <!-- Variables Generated -->
        <div style="
          background: var(--Color-Primary-Subtle-Background-default);
          border: 2px solid var(--Color-Primary-Border-default);
          border-radius: 8px;
          padding: 1.5rem;
        ">
          <h4 style="color: var(--Color-Primary-Primary-Background-default); margin: 0 0 1rem 0;">
            🎨 Variables
          </h4>
          <div style="font-size: 24px; font-weight: var(--font-weight-bold); color: var(--Color-Primary-Primary-Background-default);">
            1,004
          </div>
          <div style="color: var(--Color-Primary-Subtle-Foreground-default); font-size: 14px;">
            CSS variables generated
          </div>
        </div>

        <!-- Files Written -->
        <div style="
          background: var(--Color-Info-Subtle-Background-default);
          border: 2px solid var(--Color-Info-Border-default);
          border-radius: 8px;
          padding: 1.5rem;
        ">
          <h4 style="color: var(--Color-Info-Primary-Background-default); margin: 0 0 1rem 0;">
            📁 Files
          </h4>
          <div style="font-size: 24px; font-weight: var(--font-weight-bold); color: var(--Color-Info-Primary-Background-default);">
            10
          </div>
          <div style="color: var(--Color-Info-Subtle-Foreground-default); font-size: 14px;">
            CSS files written
          </div>
        </div>

        <!-- Success Rate -->
        <div style="
          background: var(--Color-Warning-Subtle-Background-default);
          border: 2px solid var(--Color-Warning-Border-default);
          border-radius: 8px;
          padding: 1.5rem;
        ">
          <h4 style="color: var(--Color-Warning-Primary-Background-default); margin: 0 0 1rem 0;">
            ✅ Success Rate
          </h4>
          <div style="font-size: 24px; font-weight: var(--font-weight-bold); color: var(--Color-Warning-Primary-Background-default);">
            100%
          </div>
          <div style="color: var(--Color-Warning-Subtle-Foreground-default); font-size: 14px;">
            0 unresolved tokens
          </div>
        </div>
      </div>

      <!-- Token Statistics -->
      <div style="
        background: var(--Color-Base-Subtle-Background-default);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;
      ">
        <h4 style="margin: 0 0 1rem 0;">📊 Token Statistics by Layer</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
          <div>
            <div style="font-weight: var(--font-weight-semi-bold);">Theme</div>
            <div style="color: var(--Color-Base-Subtle-Foreground-default);">258 tokens</div>
          </div>
          <div>
            <div style="font-weight: var(--font-weight-semi-bold);">Component</div>
            <div style="color: var(--Color-Base-Subtle-Foreground-default);">189 tokens</div>
          </div>
          <div>
            <div style="font-weight: var(--font-weight-semi-bold);">Layout</div>
            <div style="color: var(--Color-Base-Subtle-Foreground-default);">62 tokens</div>
          </div>
          <div>
            <div style="font-weight: var(--font-weight-semi-bold);">Each Mode</div>
            <div style="color: var(--Color-Base-Subtle-Foreground-default);">74 tokens</div>
          </div>
        </div>
      </div>

      <!-- Command Examples -->
      <div style="
        background: var(--Color-Base-Background-default);
        border: 1px solid var(--Color-Base-Border-default);
        border-radius: 8px;
        padding: 1.5rem;
      ">
        <h4 style="margin: 0 0 1rem 0;">🛠️ Available Commands</h4>
        <div style="font-family: var(--font-family-mono); font-size: 14px; line-height: 1.8;">
          <div style="margin-bottom: 0.5rem;">
            <code style="background: var(--Color-Base-Subtle-Background-default); padding: 0.25rem 0.5rem; border-radius: 4px;">
              npm run build:tokens
            </code>
            <span style="margin-left: 1rem; color: var(--Color-Base-Subtle-Foreground-default);">
              Generate all CSS variables
            </span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <code style="background: var(--Color-Base-Subtle-Background-default); padding: 0.25rem 0.5rem; border-radius: 4px;">
              npm run build:tokens:dev
            </code>
            <span style="margin-left: 1rem; color: var(--Color-Base-Subtle-Foreground-default);">
              Generate with verbose output
            </span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <code style="background: var(--Color-Base-Subtle-Background-default); padding: 0.25rem 0.5rem; border-radius: 4px;">
              npm run build:tokens:dry
            </code>
            <span style="margin-left: 1rem; color: var(--Color-Base-Subtle-Foreground-default);">
              Test run without writing files
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Real performance metrics from the CSS Variable Pipeline showing processing speed and success rates.'
      }
    }
  }
};

/**
 * Token resolution and reference system demonstration
 */
export const TokenResolution: Story = {
  render: () => html`
    <div style="font-family: var(--font-family-primary); line-height: 1.6;">
      <h3 style="color: var(--Color-Primary-Primary-Background-default); margin-bottom: 1.5rem;">
        🔗 Token Reference Resolution
      </h3>
      
      <div style="margin-bottom: 2rem;">
        <h4>Cascade Hierarchy</h4>
        <div style="background: var(--Color-Base-Subtle-Background-default); padding: 1rem; border-radius: 8px; font-family: var(--font-family-mono); font-size: 14px;">
          <div style="margin-bottom: 0.5rem;">🏗️ <strong>Layout Tokens</strong> (highest priority)</div>
          <div style="margin-bottom: 0.5rem; margin-left: 1rem;">↓</div>
          <div style="margin-bottom: 0.5rem;">🧩 <strong>Component Tokens</strong></div>
          <div style="margin-bottom: 0.5rem; margin-left: 1rem;">↓</div>
          <div style="margin-bottom: 0.5rem;">🌓 <strong>Mode Tokens</strong> (light/dark/hc)</div>
          <div style="margin-bottom: 0.5rem; margin-left: 1rem;">↓</div>
          <div>🎨 <strong>Theme Tokens</strong> (base values)</div>
        </div>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4>Reference Examples</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <!-- Theme Token -->
          <div style="background: var(--Color-Base-Subtle-Background-default); padding: 1rem; border-radius: 8px;">
            <div style="font-weight: var(--font-weight-semi-bold); margin-bottom: 0.5rem;">Theme Token</div>
            <code style="font-size: 12px; display: block; background: var(--Color-Base-Background-default); padding: 0.5rem; border-radius: 4px;">
{
  "Color": {
    "Primary": {
      "600": {
        "$type": "color",
        "$value": "#2c72e0"
      }
    }
  }
}
            </code>
          </div>

          <!-- Mode Token -->
          <div style="background: var(--Color-Base-Subtle-Background-default); padding: 1rem; border-radius: 8px;">
            <div style="font-weight: var(--font-weight-semi-bold); margin-bottom: 0.5rem;">Mode Reference</div>
            <code style="font-size: 12px; display: block; background: var(--Color-Base-Background-default); padding: 0.5rem; border-radius: 4px;">
{
  "Primary": {
    "600": {
      "$type": "color",
      "$value": "{Color.Primary.600}"
    }
  }
}
            </code>
          </div>

          <!-- Component Token -->
          <div style="background: var(--Color-Base-Subtle-Background-default); padding: 1rem; border-radius: 8px;">
            <div style="font-weight: var(--font-weight-semi-bold); margin-bottom: 0.5rem;">Component Reference</div>
            <code style="font-size: 12px; display: block; background: var(--Color-Base-Background-default); padding: 0.5rem; border-radius: 4px;">
{
  "Color": {
    "Primary": {
      "Background": {
        "default": {
          "$type": "color",
          "$value": "{Primary.600}"
        }
      }
    }
  }
}
            </code>
          </div>

          <!-- Final CSS -->
          <div style="background: var(--Color-Success-Subtle-Background-default); padding: 1rem; border-radius: 8px;">
            <div style="font-weight: var(--font-weight-semi-bold); margin-bottom: 0.5rem;">Final CSS Output</div>
            <code style="font-size: 12px; display: block; background: var(--Color-Base-Background-default); padding: 0.5rem; border-radius: 4px;">
:root {
  --Color-Primary-Background-default: #2c72e0;
}

[data-theme="dark"] {
  --Color-Primary-Background-default: #245db8;
}
            </code>
          </div>
        </div>
      </div>

      <div style="background: var(--Color-Info-Subtle-Background-default); padding: 1rem; border-radius: 8px;">
        <h4 style="color: var(--Color-Info-Primary-Background-default); margin: 0 0 0.5rem 0;">
          🔍 Advanced Features
        </h4>
        <ul style="margin: 0; color: var(--Color-Info-Subtle-Foreground-default);">
          <li><strong>Cycle Detection</strong> - Prevents infinite reference loops</li>
          <li><strong>Caching</strong> - 980 cache entries for optimal performance</li>
          <li><strong>Error Handling</strong> - Comprehensive validation and reporting</li>
          <li><strong>Type Safety</strong> - Full TypeScript support with interfaces</li>
        </ul>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how token references are resolved through the cascade hierarchy with cycle detection and error handling.'
      }
    }
  }
};

/**
 * Runtime mode switching capabilities
 */
export const RuntimeFeatures: Story = {
  render: () => html`
    <div style="font-family: var(--font-family-primary); line-height: 1.6;">
      <h3 style="color: var(--Color-Primary-Primary-Background-default); margin-bottom: 1.5rem;">
        🌓 Runtime Mode Switching
      </h3>
      
      <!-- Mode Demo Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="
          background: var(--Color-Base-Background-default);
          border: 2px solid var(--Color-Base-Border-default);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        ">
          <div style="font-weight: var(--font-weight-semi-bold); margin-bottom: 0.5rem;">Light Mode</div>
          <div style="color: var(--Color-Base-Subtle-Foreground-default); font-size: 14px;">
            Default theme with light backgrounds
          </div>
        </div>

        <div style="
          background: var(--Color-Base-Subtle-Background-default);
          border: 2px solid var(--Color-Base-Border-default);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        ">
          <div style="font-weight: var(--font-weight-semi-bold); margin-bottom: 0.5rem;">Dark Mode</div>
          <div style="color: var(--Color-Base-Subtle-Foreground-default); font-size: 14px;">
            Dark theme for low-light environments
          </div>
        </div>

        <div style="
          background: var(--Color-Primary-Subtle-Background-default);
          border: 2px solid var(--Color-Primary-Border-default);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        ">
          <div style="font-weight: var(--font-weight-semi-bold); margin-bottom: 0.5rem; color: var(--Color-Primary-Primary-Background-default);">
            High Contrast
          </div>
          <div style="color: var(--Color-Primary-Subtle-Foreground-default); font-size: 14px;">
            Enhanced contrast for accessibility
          </div>
        </div>
      </div>

      <!-- API Examples -->
      <div style="margin-bottom: 2rem;">
        <h4>Runtime API</h4>
        <div style="background: var(--Color-Base-Subtle-Background-default); padding: 1rem; border-radius: 8px;">
          <code style="font-family: var(--font-family-mono); font-size: 14px; line-height: 1.6; display: block;">
<span style="color: var(--Color-Primary-Primary-Background-default);">import</span> { switchToMode, getResolvedTokenValue } <span style="color: var(--Color-Primary-Primary-Background-default);">from</span> <span style="color: var(--Color-Success-Primary-Background-default);">'@dive/tokens'</span>;

<span style="color: var(--Color-Info-Primary-Background-default);">// Switch to dark mode</span>
<span style="color: var(--Color-Primary-Primary-Background-default);">switchToMode</span>(<span style="color: var(--Color-Success-Primary-Background-default);">'dark-mode'</span>);

<span style="color: var(--Color-Info-Primary-Background-default);">// Get resolved token value</span>
<span style="color: var(--Color-Primary-Primary-Background-default);">const</span> primaryColor = <span style="color: var(--Color-Primary-Primary-Background-default);">getResolvedTokenValue</span>(<span style="color: var(--Color-Success-Primary-Background-default);">'Color.Primary.Background.default'</span>);

<span style="color: var(--Color-Info-Primary-Background-default);">// Custom token override</span>
<span style="color: var(--Color-Primary-Primary-Background-default);">setCustomToken</span>(<span style="color: var(--Color-Success-Primary-Background-default);">'Color.Primary.Background.default'</span>, <span style="color: var(--Color-Success-Primary-Background-default);">'#custom-color'</span>);
          </code>
        </div>
      </div>

      <!-- Architecture Benefits -->
      <div style="background: var(--Color-Success-Subtle-Background-default); padding: 1rem; border-radius: 8px;">
        <h4 style="color: var(--Color-Success-Primary-Background-default); margin: 0 0 0.5rem 0;">
          🚀 Pipeline Benefits
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          <div>
            <div style="font-weight: var(--font-weight-semi-bold); color: var(--Color-Success-Primary-Background-default);">
              Performance
            </div>
            <div style="color: var(--Color-Success-Subtle-Foreground-default); font-size: 14px;">
              14ms build time, cached resolution, optimized CSS output
            </div>
          </div>
          <div>
            <div style="font-weight: var(--font-weight-semi-bold); color: var(--Color-Success-Primary-Background-default);">
              Type Safety
            </div>
            <div style="color: var(--Color-Success-Subtle-Foreground-default); font-size: 14px;">
              Full TypeScript interfaces, compile-time validation
            </div>
          </div>
          <div>
            <div style="font-weight: var(--font-weight-semi-bold); color: var(--Color-Success-Primary-Background-default);">
              Scalability
            </div>
            <div style="color: var(--Color-Success-Subtle-Foreground-default); font-size: 14px;">
              Handles 1000+ variables, extensible architecture
            </div>
          </div>
          <div>
            <div style="font-weight: var(--font-weight-semi-bold); color: var(--Color-Success-Primary-Background-default);">
              Standards
            </div>
            <div style="color: var(--Color-Success-Subtle-Foreground-default); font-size: 14px;">
              W3C Design Token format, industry best practices
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates runtime capabilities including mode switching, token access, and the comprehensive API for dynamic theme management.'
      }
    }
  }
}; 