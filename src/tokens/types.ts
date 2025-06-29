/**
 * TypeScript interfaces for the CSS Variable Pipeline
 * Following W3C Design Token Community Group specification
 */

export interface DesignToken {
  $type: TokenType;
  $value: TokenValue;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

export type TokenType = 'color' | 'number' | 'string' | 'boolean' | 'dimension' | 'fontFamily' | 'fontWeight';

export type TokenValue = string | number | boolean;

export interface TokenReference {
  path: string;
  value: string; // The {TokenPath} format
}

export interface TokenSet {
  [key: string]: DesignToken | TokenSet;
}

export interface ProcessedTokenSet {
  [key: string]: {
    type: TokenType;
    value: TokenValue;
    resolved: boolean;
    path: string[];
  };
}

export interface TokenMetadata {
  tokenSetOrder: string[];
  themes?: string[];
  modes?: string[];
}

export interface TokenProcessorConfig {
  dataPath: string;
  outputPath: string;
  verbose?: boolean;
  dryRun?: boolean;
}

export interface ResolvedTokens {
  [theme: string]: {
    [mode: string]: {
      [cssVarName: string]: string;
    };
  };
}

export interface BuildMetrics {
  totalVariables: number;
  filesWritten: number;
  processingTime: number;
  unresolvedTokens: number;
  duplicateVariables: number;
  cycleDetections: number;
}

export class TokenValidationError extends Error {
  constructor(
    message: string,
    public tokenPath?: string,
    public cycleChain?: string[]
  ) {
    super(message);
    this.name = 'TokenValidationError';
  }
}

export class TokenResolutionError extends Error {
  constructor(
    message: string,
    public tokenPath: string,
    public mode: string
  ) {
    super(message);
    this.name = 'TokenResolutionError';
  }
}

export class TokenProcessingError extends Error {
  constructor(
    message: string,
    public stage: 'loading' | 'resolving' | 'generating' | 'writing'
  ) {
    super(message);
    this.name = 'TokenProcessingError';
  }
} 