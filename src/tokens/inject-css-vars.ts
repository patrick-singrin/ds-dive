/**
 * Runtime CSS Variable Injection
 * Provides dynamic mode switching and token value access at runtime
 */

import type { ResolvedTokens } from './types.js';
import { TokenProcessor } from './processor.js';
import { TokenResolver } from './resolver.js';

class RuntimeTokenManager {
  private resolvedTokens: ResolvedTokens = {};
  private currentMode: string = 'light-mode';
  private injectedStyleId: string = 'dive-token-css-vars';
  
  constructor() {
    if (typeof document !== 'undefined') {
      this.initializeTokens();
    }
  }

  /**
   * Initialize tokens for runtime use
   */
  private async initializeTokens(): Promise<void> {
    try {
      // This would typically load from a generated JSON file in production
      // For now, we'll generate them on-demand
      await this.loadResolvedTokens();
    } catch (error) {
      console.warn('⚠️  Failed to initialize runtime tokens:', error);
    }
  }

  /**
   * Load and resolve all tokens for runtime use
   */
  private async loadResolvedTokens(): Promise<void> {
    // In a real implementation, this would load from pre-generated JSON
    // For now, we'll generate them dynamically
    const processor = new TokenProcessor({
      dataPath: '/src/tokens/data', // This would be adjusted for runtime
      outputPath: '/tmp',
      verbose: false
    });

    try {
      processor.loadAllTokens();
      const resolver = new TokenResolver(processor.getAllTokens());
      const modes = processor.getAvailableModes();

      this.resolvedTokens['dive'] = {};

             for (const mode of modes) {
         const componentTokens = processor.getAllTokens().component;
         const resolvedComponent = resolver.resolveTokenSet(componentTokens, mode);
         
         // Convert TokenValue to string for CSS output
         const stringValues: { [cssVarName: string]: string } = {};
         for (const [key, value] of Object.entries(resolvedComponent)) {
           stringValues[key] = value.toString();
         }
         
         this.resolvedTokens['dive'][mode] = stringValues;
       }
    } catch (error) {
      console.warn('Failed to resolve tokens at runtime:', error);
    }
  }

  /**
   * Inject CSS variables for a specific mode
   */
  public injectModeTokens(mode: string): void {
    if (typeof document === 'undefined') {
      console.warn('injectModeTokens called in non-browser environment');
      return;
    }

    const tokens = this.resolvedTokens['dive']?.[mode];
    if (!tokens) {
      console.warn(`No tokens found for mode: ${mode}`);
      return;
    }

    // Remove existing injected styles
    this.removeInjectedStyles();

    // Create new style element
    const style = document.createElement('style');
    style.id = this.injectedStyleId;
    style.setAttribute('data-mode', mode);
    
    // Generate CSS content
    const cssVars = Object.entries(tokens)
      .map(([name, value]) => `  ${name}: ${value};`)
      .join('\n');
    
    style.innerHTML = `:root {\n${cssVars}\n}`;
    
    // Inject into document head
    document.head.appendChild(style);
    
    this.currentMode = mode;

    if (console.debug) {
      console.debug(`🎨 Injected ${Object.keys(tokens).length} CSS variables for mode: ${mode}`);
    }
  }

  /**
   * Remove all injected CSS variable styles
   */
  private removeInjectedStyles(): void {
    const existingStyle = document.getElementById(this.injectedStyleId);
    if (existingStyle) {
      existingStyle.remove();
    }
  }

  /**
   * Get the current active mode
   */
  public getCurrentMode(): string {
    return this.currentMode;
  }

  /**
   * Get all available modes
   */
  public getAvailableModes(): string[] {
    return Object.keys(this.resolvedTokens['dive'] || {});
  }

  /**
   * Get resolved token value for current mode
   */
  public getTokenValue(tokenPath: string): string | undefined {
    const tokens = this.resolvedTokens['dive']?.[this.currentMode];
    if (!tokens) return undefined;

    // Convert token path to CSS variable name
    const cssVarName = `--${tokenPath.replace(/\./g, '-')}`;
    return tokens[cssVarName];
  }

  /**
   * Set a custom token value (overrides default)
   */
  public setCustomTokenValue(tokenPath: string, value: string): void {
    if (typeof document === 'undefined') return;

    const cssVarName = `--${tokenPath.replace(/\./g, '-')}`;
    document.documentElement.style.setProperty(cssVarName, value);
  }

  /**
   * Remove a custom token value (reverts to default)
   */
  public removeCustomTokenValue(tokenPath: string): void {
    if (typeof document === 'undefined') return;

    const cssVarName = `--${tokenPath.replace(/\./g, '-')}`;
    document.documentElement.style.removeProperty(cssVarName);
  }

  /**
   * Apply theme data attribute for CSS selectors
   */
  public applyThemeAttribute(mode: string): void {
    if (typeof document === 'undefined') return;

    // Map mode names to data-theme values
    const themeMap: Record<string, string> = {
      'light-mode': 'light',
      'dark-mode': 'dark',
      'hc-light-mode': 'hc-light',
      'hc-dark-mode': 'hc-dark'
    };

    const themeValue = themeMap[mode] || mode;
    document.documentElement.setAttribute('data-theme', themeValue);
  }

  /**
   * Complete mode switch (inject tokens + apply attribute)
   */
  public switchMode(mode: string): void {
    this.injectModeTokens(mode);
    this.applyThemeAttribute(mode);
    
    // Dispatch custom event for components to react to mode changes
    if (typeof document !== 'undefined') {
      const event = new CustomEvent('dive:mode-changed', {
        detail: { mode, previousMode: this.currentMode }
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Validate if mode switching is working correctly
   */
  public validateModeSwitch(): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (typeof document === 'undefined') {
      issues.push('Not running in browser environment');
      return { valid: false, issues };
    }

    // Check if style element exists
    const styleElement = document.getElementById(this.injectedStyleId);
    if (!styleElement) {
      issues.push('No injected style element found');
    }

    // Check data-theme attribute
    const themeAttr = document.documentElement.getAttribute('data-theme');
    if (!themeAttr) {
      issues.push('No data-theme attribute set on document element');
    }

    // Check if we have resolved tokens
    if (!this.resolvedTokens['dive']?.[this.currentMode]) {
      issues.push(`No resolved tokens for current mode: ${this.currentMode}`);
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

// Global instance
let runtimeManager: RuntimeTokenManager;

/**
 * Get the global runtime token manager instance
 */
export function getRuntimeManager(): RuntimeTokenManager {
  if (!runtimeManager) {
    runtimeManager = new RuntimeTokenManager();
  }
  return runtimeManager;
}

/**
 * Inject CSS variables for all tokens in the specified mode
 * @param mode The mode to inject (e.g., 'light-mode', 'dark-mode')
 */
export function injectAllTokenCssVars(mode: string = 'light-mode'): void {
  getRuntimeManager().injectModeTokens(mode);
}

/**
 * Switch to a new mode (inject tokens + apply theme attribute)
 * @param mode The mode to switch to
 */
export function switchToMode(mode: string): void {
  getRuntimeManager().switchMode(mode);
}

/**
 * Get the currently active mode
 */
export function getCurrentMode(): string {
  return getRuntimeManager().getCurrentMode();
}

/**
 * Get all available modes
 */
export function getAvailableModes(): string[] {
  return getRuntimeManager().getAvailableModes();
}

/**
 * Get a resolved token value for the current mode
 * @param tokenPath Dot-separated token path (e.g., 'Color.Primary.Background.default')
 */
export function getResolvedTokenValue(tokenPath: string): string | undefined {
  return getRuntimeManager().getTokenValue(tokenPath);
}

/**
 * Set a custom token value override
 * @param tokenPath Dot-separated token path
 * @param value CSS value to set
 */
export function setCustomToken(tokenPath: string, value: string): void {
  getRuntimeManager().setCustomTokenValue(tokenPath, value);
}

/**
 * Remove a custom token value override
 * @param tokenPath Dot-separated token path
 */
export function removeCustomToken(tokenPath: string): void {
  getRuntimeManager().removeCustomTokenValue(tokenPath);
}

/**
 * Validate that mode switching is working correctly
 */
export function validateTokenSystem(): { valid: boolean; issues: string[] } {
  return getRuntimeManager().validateModeSwitch();
}

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      getRuntimeManager();
    });
  } else {
    getRuntimeManager();
  }
} 