/**
 * Shadow DOM Diagnostics
 * 
 * Comprehensive diagnostic tool for identifying and fixing Shadow DOM issues
 * in Storybook environments. Based on enterprise implementation patterns.
 */

export interface ShadowDOMDiagnosticResult {
  component: string;
  issues: string[];
  warnings: string[];
  performance: {
    renderTime: number;
    shadowRootAccess: boolean;
    tokenAccess: boolean;
  };
  fixes: string[];
}

export class ShadowDOMDiagnostics {
  private static readonly CRITICAL_TOKENS = [
    'Color-Primary-Primary-Background-default',
    'Color-Base-Foreground-default',
    'Color-Base-Background-default',
    'Spacing-2',
    'Spacing-3',
    'border-border-radius-md'
  ];

  /**
   * Run comprehensive Shadow DOM diagnostics on a component
   */
  static async diagnose(element: Element): Promise<ShadowDOMDiagnosticResult> {
    const componentName = element.tagName.toLowerCase();
    const startTime = performance.now();
    
    const result: ShadowDOMDiagnosticResult = {
      component: componentName,
      issues: [],
      warnings: [],
      performance: {
        renderTime: 0,
        shadowRootAccess: false,
        tokenAccess: false
      },
      fixes: []
    };

    // 1. Check Shadow DOM access
    const shadowRoot = (element as any).shadowRoot;
    if (!shadowRoot) {
      result.issues.push('Shadow DOM not accessible or not created');
      result.fixes.push('Ensure component extends LitElement or creates shadow root');
    } else {
      result.performance.shadowRootAccess = true;
    }

    // 2. Check design token access
    const tokenAccessResult = this.checkTokenAccess(element);
    result.performance.tokenAccess = tokenAccessResult.accessible > 0;
    
    if (tokenAccessResult.missing.length > 0) {
      result.warnings.push(`Missing design tokens: ${tokenAccessResult.missing.join(', ')}`);
      result.fixes.push('Import design token CSS files in .storybook/preview.ts');
    }

    // 3. Check icon rendering (common Shadow DOM issue)
    if (shadowRoot) {
      const iconIssues = this.checkIconRendering(shadowRoot);
      result.issues.push(...iconIssues.issues);
      result.fixes.push(...iconIssues.fixes);
    }

    // 4. Check event handling
    const eventIssues = this.checkEventHandling(element);
    result.warnings.push(...eventIssues.warnings);
    result.fixes.push(...eventIssues.fixes);

    // 5. Performance measurement
    await new Promise(resolve => requestAnimationFrame(resolve));
    result.performance.renderTime = performance.now() - startTime;

    if (result.performance.renderTime > 16) {
      result.warnings.push(`Slow rendering: ${result.performance.renderTime.toFixed(2)}ms (>16ms threshold)`);
      result.fixes.push('Consider reducing CSS complexity or optimizing Shadow DOM styles');
    }

    // 6. Storybook-specific checks
    const storybookIssues = this.checkStorybookCompatibility(element);
    result.warnings.push(...storybookIssues.warnings);
    result.fixes.push(...storybookIssues.fixes);

    return result;
  }

  /**
   * Check design token accessibility in Shadow DOM
   */
  private static checkTokenAccess(element: Element): { accessible: number; missing: string[] } {
    const computedStyle = getComputedStyle(element);
    const missing: string[] = [];
    let accessible = 0;

    this.CRITICAL_TOKENS.forEach(token => {
      const value = computedStyle.getPropertyValue(`--${token}`);
      if (value.trim()) {
        accessible++;
      } else {
        missing.push(token);
      }
    });

    return { accessible, missing };
  }

  /**
   * Check for common icon rendering issues
   */
  private static checkIconRendering(shadowRoot: ShadowRoot): { issues: string[]; fixes: string[] } {
    const issues: string[] = [];
    const fixes: string[] = [];

    // Check for broken SVG sprite references
    const useElements = shadowRoot.querySelectorAll('use[href^="#"]');
    if (useElements.length > 0) {
      issues.push('Found SVG sprite references that may not work in Shadow DOM');
      fixes.push('Replace <use href="#icon-name"> with inline <path> elements');
    }

    // Check for missing viewBox on SVG elements
    const svgElements = shadowRoot.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      if (!svg.hasAttribute('viewBox')) {
        issues.push('SVG elements missing viewBox attribute');
        fixes.push('Add viewBox="0 0 24 24" to SVG elements for proper scaling');
      }
    });

    // Check for proper icon accessibility
    const iconSvgs = shadowRoot.querySelectorAll('svg.icon, svg.blueprint__icon');
    iconSvgs.forEach((svg) => {
      if (!svg.hasAttribute('aria-hidden') && !svg.hasAttribute('aria-label')) {
        issues.push('Icon SVGs missing accessibility attributes');
        fixes.push('Add aria-hidden="true" for decorative icons or aria-label for meaningful icons');
      }
    });

    return { issues, fixes };
  }

  /**
   * Check event handling through Shadow DOM boundaries
   */
  private static checkEventHandling(element: Element): { warnings: string[]; fixes: string[] } {
    const warnings: string[] = [];
    const fixes: string[] = [];

    // Check if component has event listeners
    const hasEventListeners = (element as any)._eventListeners || 
                              Object.getOwnPropertyNames(element).some(prop => prop.startsWith('on'));

    if (hasEventListeners) {
      // Test event bubbling
      try {
        const testEvent = new CustomEvent('test-event', { bubbles: true, composed: false });
        element.dispatchEvent(testEvent);
        
        warnings.push('Events may not bubble correctly through Shadow DOM');
        fixes.push('Use { composed: true } in CustomEvent for proper Shadow DOM event bubbling');
      } catch (error) {
        // Event testing failed - this is expected
      }
    }

    return { warnings, fixes };
  }

  /**
   * Check Storybook-specific compatibility issues
   */
  private static checkStorybookCompatibility(element: Element): { warnings: string[]; fixes: string[] } {
    const warnings: string[] = [];
    const fixes: string[] = [];

    // Check if running in Storybook
    if (typeof window !== 'undefined' && window.parent !== window) {
      // Check for Storybook controls integration
      const shadowRoot = (element as any).shadowRoot;
      if (shadowRoot) {
        const hasStorybookOptimization = shadowRoot.querySelector('style[data-storybook]');
        if (!hasStorybookOptimization) {
          warnings.push('Component not optimized for Storybook Canvas view');
          fixes.push('Apply Storybook-specific Shadow DOM optimizations');
        }
      }

      // Check for proper component registration
      const customElementName = element.tagName.toLowerCase();
      if (!customElements.get(customElementName)) {
        warnings.push(`Custom element ${customElementName} not properly registered`);
        fixes.push('Ensure component is imported in .storybook/preview.ts');
      }
    }

    return { warnings, fixes };
  }

  /**
   * Generate a comprehensive diagnostic report
   */
  static generateReport(results: ShadowDOMDiagnosticResult[]): string {
    let report = '# Shadow DOM Diagnostic Report\n\n';
    
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
    const avgRenderTime = results.reduce((sum, r) => sum + r.performance.renderTime, 0) / results.length;

    report += `## Summary\n`;
    report += `- Components analyzed: ${results.length}\n`;
    report += `- Critical issues: ${totalIssues}\n`;
    report += `- Warnings: ${totalWarnings}\n`;
    report += `- Average render time: ${avgRenderTime.toFixed(2)}ms\n\n`;

    results.forEach(result => {
      report += `## ${result.component}\n\n`;
      
      if (result.issues.length > 0) {
        report += `### ❌ Critical Issues\n`;
        result.issues.forEach(issue => report += `- ${issue}\n`);
        report += '\n';
      }

      if (result.warnings.length > 0) {
        report += `### ⚠️ Warnings\n`;
        result.warnings.forEach(warning => report += `- ${warning}\n`);
        report += '\n';
      }

      if (result.fixes.length > 0) {
        report += `### 🔧 Recommended Fixes\n`;
        result.fixes.forEach(fix => report += `- ${fix}\n`);
        report += '\n';
      }

      report += `### 📊 Performance\n`;
      report += `- Render time: ${result.performance.renderTime.toFixed(2)}ms\n`;
      report += `- Shadow root access: ${result.performance.shadowRootAccess ? '✅' : '❌'}\n`;
      report += `- Token access: ${result.performance.tokenAccess ? '✅' : '❌'}\n\n`;
    });

    return report;
  }

  /**
   * Auto-fix common Shadow DOM issues
   */
  static async autoFix(element: Element): Promise<{ fixed: string[]; failed: string[] }> {
    const fixed: string[] = [];
    const failed: string[] = [];

    try {
      const shadowRoot = (element as any).shadowRoot;
      
      if (shadowRoot) {
        // Fix 1: Add Storybook optimization styles
        const storybookStyle = document.createElement('style');
        storybookStyle.setAttribute('data-storybook', 'true');
        storybookStyle.textContent = `
          :host {
            display: var(--sb-display, inline-flex);
            box-sizing: border-box;
          }
        `;
        shadowRoot.appendChild(storybookStyle);
        fixed.push('Added Storybook optimization styles');

        // Fix 2: Fix SVG accessibility
        const svgs = shadowRoot.querySelectorAll('svg:not([aria-hidden]):not([aria-label])');
        svgs.forEach((svg: Element) => {
          svg.setAttribute('aria-hidden', 'true');
        });
        if (svgs.length > 0) {
          fixed.push(`Fixed accessibility for ${svgs.length} SVG elements`);
        }
      }

    } catch (error) {
      failed.push(`Auto-fix failed: ${error}`);
    }

    return { fixed, failed };
  }
}

/**
 * Convenience function to run diagnostics on all components in the page
 */
export async function diagnoseAllComponents(): Promise<ShadowDOMDiagnosticResult[]> {
  const components = document.querySelectorAll('[data-testid*="component"], dive-blueprint, dive-icon');
  const results: ShadowDOMDiagnosticResult[] = [];

  for (const component of Array.from(components)) {
    const result = await ShadowDOMDiagnostics.diagnose(component);
    results.push(result);
  }

  return results;
}

/**
 * Console-friendly diagnostic runner for Storybook
 */
export function runStorybookDiagnostics(): void {
  if (typeof window !== 'undefined') {
    console.log('🔍 Running Shadow DOM diagnostics...');
    
    diagnoseAllComponents().then(results => {
      const report = ShadowDOMDiagnostics.generateReport(results);
      console.log(report);
      
      // Auto-fix if requested
      if (results.some(r => r.issues.length > 0 || r.warnings.length > 0)) {
        console.log('🔧 Auto-fixing detected issues...');
        
        Promise.all(
          results.map(async (result) => {
            const element = document.querySelector(result.component);
            if (element) {
              return ShadowDOMDiagnostics.autoFix(element);
            }
            return { fixed: [], failed: [] };
          })
        ).then(fixes => {
          const totalFixed = fixes.reduce((sum, f) => sum + f.fixed.length, 0);
          console.log(`✅ Auto-fixed ${totalFixed} issues`);
        });
      }
    });
  }
}

// Auto-run diagnostics in development mode
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Delay to allow components to load
  setTimeout(runStorybookDiagnostics, 2000);
} 