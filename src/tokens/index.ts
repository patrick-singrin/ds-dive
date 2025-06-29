// Export design tokens (commented out until dist is generated)
// export * from './dist/tokens';

// Export new CSS Variable Pipeline
export * from './inject-css-vars.js';
export { TokenProcessor } from './processor.js';
export { TokenResolver } from './resolver.js';
export { CSSFormatter } from './css-formatter.js';
export * from './types.js';

// Export utility functions for working with tokens
export const getTokenValue = (tokenName: string): string => {
  if (typeof document !== 'undefined') {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${tokenName}`)
      .trim();
    return value || '';
  }
  return '';
};

export const setTokenValue = (tokenName: string, value: string): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(`--${tokenName}`, value);
  }
};

export const removeTokenValue = (tokenName: string): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.removeProperty(`--${tokenName}`);
  }
};

// Theme switching utilities
export const setTheme = (themeName: string): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', themeName);
  }
};

export const getTheme = (): string => {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
  return 'light';
};

// Available themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  HC_LIGHT: 'hc-light',
  HC_DARK: 'hc-dark'
} as const;

export type Theme = typeof THEMES[keyof typeof THEMES];
