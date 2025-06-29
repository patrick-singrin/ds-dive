/**
 * CSS Formatter - Utilities for formatting token values into CSS
 * Handles different token types and CSS-specific formatting
 */

import type { TokenType, TokenValue } from './types.js';

export class CSSFormatter {
  /**
   * Format a token value for CSS output
   */
  public static formatCssValue(value: TokenValue, type: TokenType): string {
    switch (type) {
      case 'color':
        return this.formatColorValue(value);
      case 'number':
      case 'dimension':
        return this.formatNumericValue(value);
      case 'fontFamily':
        return this.formatFontFamilyValue(value);
      case 'fontWeight':
        return this.formatFontWeightValue(value);
      case 'boolean':
        return this.formatBooleanValue(value);
      case 'string':
      default:
        return this.formatStringValue(value);
    }
  }

  private static formatColorValue(value: TokenValue): string {
    const stringValue = value.toString();
    
    // Handle different color formats
    if (stringValue.startsWith('#')) {
      return stringValue; // Hex color
    }
    
    if (stringValue.startsWith('rgb') || stringValue.startsWith('hsl')) {
      return stringValue; // CSS color function
    }
    
    if (stringValue.startsWith('var(')) {
      return stringValue; // CSS variable reference
    }
    
    // Named colors or other formats
    return stringValue;
  }

  private static formatNumericValue(value: TokenValue): string {
    const stringValue = value.toString();
    
    // If it's just a number, add 'px' unit for dimensions
    if (/^\d+(\.\d+)?$/.test(stringValue)) {
      return `${stringValue}px`;
    }
    
    // If it already has a unit or is a CSS function, return as-is
    return stringValue;
  }

  private static formatFontFamilyValue(value: TokenValue): string {
    const stringValue = value.toString();
    
    // If it contains spaces but isn't quoted, add quotes
    if (stringValue.includes(' ') && !stringValue.startsWith('"') && !stringValue.startsWith("'")) {
      return `"${stringValue}"`;
    }
    
    return stringValue;
  }

  private static formatFontWeightValue(value: TokenValue): string {
    const stringValue = value.toString();
    
    // Map named weights to numbers if needed
    const weightMap: Record<string, string> = {
      'thin': '100',
      'extra-light': '200',
      'light': '300',
      'normal': '400',
      'medium': '500',
      'semi-bold': '600',
      'bold': '700',
      'extra-bold': '800',
      'black': '900'
    };
    
    return weightMap[stringValue.toLowerCase()] || stringValue;
  }

  private static formatBooleanValue(value: TokenValue): string {
    return value.toString();
  }

  private static formatStringValue(value: TokenValue): string {
    return value.toString();
  }

  /**
   * Generate CSS selector for a mode
   */
  public static generateModeSelector(mode: string): string {
    if (mode === 'light-mode') {
      return ':root';
    }
    
    // Use data-mode attribute for consistency with documentation
    return `[data-mode="${mode}"]`;
  }

  /**
   * Convert token path array to CSS variable name
   */
  public static toCssVarName(path: string[]): string {
    // Replace spaces with hyphens and ensure valid CSS variable naming
    const cleanPath = path.map(segment => 
      segment.replace(/\s+/g, '-')  // Replace spaces with hyphens
             .replace(/[^a-zA-Z0-9-_]/g, '-')  // Replace invalid chars with hyphens
             .replace(/-+/g, '-')  // Replace multiple hyphens with single hyphen
             .replace(/^-|-$/g, '')  // Remove leading/trailing hyphens
    );
    return `--${cleanPath.join('-')}`;
  }

  /**
   * Generate complete CSS rule for a set of variables
   */
  public static generateCssRule(
    selector: string, 
    variables: Record<string, string>
  ): string {
    const variableLines = Object.entries(variables)
      .map(([name, value]) => `  ${name}: ${value};`)
      .join('\n');
    
    return `${selector} {\n${variableLines}\n}`;
  }

  /**
   * Format CSS file header with metadata
   */
  public static generateFileHeader(
    fileName: string,
    description?: string,
    metadata?: Record<string, any>
  ): string {
    const lines = [
      `/* ${fileName} */`,
      ''
    ];

    if (description) {
      lines.push(`/* ${description} */`, '');
    }

    if (metadata) {
      lines.push('/*');
      Object.entries(metadata).forEach(([key, value]) => {
        lines.push(` * ${key}: ${value}`);
      });
      lines.push(' */', '');
    }

    return lines.join('\n');
  }

  /**
   * Optimize CSS output by removing duplicates and sorting
   */
  public static optimizeCss(css: string): string {
    // Remove empty lines and normalize whitespace
    return css
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }
} 