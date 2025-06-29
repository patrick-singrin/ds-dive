/**
 * TokenResolver - Resolves token references with cycle detection
 * Follows the cascade hierarchy: layout → component → mode → theme
 */

import type { 
  TokenSet, 
  DesignToken, 
  TokenValue
} from './types.js';
import { TokenValidationError, TokenResolutionError } from './types.js';

export class TokenResolver {
  private themeTokens: TokenSet;
  private modeTokens: Record<string, TokenSet>;
  private componentTokens: TokenSet;
  private layoutTokens: TokenSet;
  private resolvedCache: Map<string, TokenValue> = new Map();

  constructor(tokens: {
    theme: TokenSet;
    modes: Record<string, TokenSet>;
    component: TokenSet;
    layout: TokenSet;
  }) {
    this.themeTokens = tokens.theme;
    this.modeTokens = tokens.modes;
    this.componentTokens = tokens.component;
    this.layoutTokens = tokens.layout;
  }

  /**
   * Resolve a token by path for a specific mode
   */
  public resolve(tokenPath: string, mode: string): TokenValue {
    const cacheKey = `${tokenPath}::${mode}`;
    
    if (this.resolvedCache.has(cacheKey)) {
      return this.resolvedCache.get(cacheKey)!;
    }

    const resolvedValue = this.resolveWithCycleDetection(tokenPath, mode, new Set());
    this.resolvedCache.set(cacheKey, resolvedValue);
    
    return resolvedValue;
  }

  private resolveWithCycleDetection(
    tokenPath: string, 
    mode: string, 
    visited: Set<string>
  ): TokenValue {
    const visitKey = `${tokenPath}::${mode}`;
    
    if (visited.has(visitKey)) {
      throw new TokenValidationError(
        `Circular reference detected: ${Array.from(visited).concat(visitKey).join(' → ')}`,
        tokenPath,
        Array.from(visited)
      );
    }

    visited.add(visitKey);

    try {
      // Find token following cascade: layout → component → mode → theme
      const token = this.getTokenByPath(tokenPath, this.layoutTokens)
        || this.getTokenByPath(tokenPath, this.componentTokens)
        || this.getTokenByPath(tokenPath, this.modeTokens[mode] || {})
        || this.getTokenByPath(tokenPath, this.themeTokens);

      if (!token) {
        throw new TokenResolutionError(
          `Token not found: ${tokenPath}`,
          tokenPath,
          mode
        );
      }

      let value = token.$value;

      // Resolve references recursively
      if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        const refPath = value.slice(1, -1);
        value = this.resolveWithCycleDetection(refPath, mode, new Set(visited));
      }

      visited.delete(visitKey);
      return value;

    } catch (error) {
      visited.delete(visitKey);
      throw error;
    }
  }

  /**
   * Get a token by path from a token set
   */
  private getTokenByPath(path: string, tokenSet: TokenSet): DesignToken | null {
    const pathParts = path.split('.');
    let current: any = tokenSet;

    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return null;
      }
    }

    // Check if this is a valid token
    if (current && typeof current === 'object' && '$value' in current) {
      return current as DesignToken;
    }

    return null;
  }

  /**
   * Resolve all tokens in a set for a specific mode
   */
  public resolveTokenSet(tokenSet: TokenSet, mode: string, pathPrefix: string[] = []): Record<string, TokenValue> {
    const resolved: Record<string, TokenValue> = {};

    this.walkTokenSet(tokenSet, pathPrefix, (path, token) => {
      try {
        const tokenPath = path.join('.');
        resolved[this.toCssVarName(path)] = this.resolve(tokenPath, mode);
      } catch (error) {
        if (error instanceof TokenValidationError || error instanceof TokenResolutionError) {
          console.warn(`⚠️  Failed to resolve token ${path.join('.')}: ${error.message}`);
        } else {
          throw error;
        }
      }
    });

    return resolved;
  }

  /**
   * Walk through a token set and call callback for each token
   */
  private walkTokenSet(
    tokenSet: TokenSet | DesignToken, 
    path: string[], 
    callback: (path: string[], token: DesignToken) => void
  ): void {
    if (tokenSet && typeof tokenSet === 'object') {
      if ('$value' in tokenSet) {
        // This is a token
        callback(path, tokenSet as DesignToken);
      } else {
        // This is a nested object
        for (const [key, value] of Object.entries(tokenSet)) {
          this.walkTokenSet(value, [...path, key], callback);
        }
      }
    }
  }

  /**
   * Convert token path to CSS variable name
   */
  private toCssVarName(path: string[]): string {
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
   * Clear the resolution cache
   */
  public clearCache(): void {
    this.resolvedCache.clear();
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.resolvedCache.size,
      keys: Array.from(this.resolvedCache.keys())
    };
  }

  /**
   * Validate all token references in a set
   */
  public validateTokenSet(tokenSet: TokenSet, mode: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    this.walkTokenSet(tokenSet, [], (path, token) => {
      try {
        this.resolve(path.join('.'), mode);
      } catch (error) {
        if (error instanceof Error) {
          errors.push(`${path.join('.')}: ${error.message}`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
} 