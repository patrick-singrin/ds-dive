/**
 * TokenProcessor - Loads and merges design token JSON files
 * Handles the cascading layer system with proper merge order
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { 
  TokenSet, 
  TokenMetadata, 
  TokenProcessorConfig
} from './types.js';
import { TokenProcessingError } from './types.js';

export class TokenProcessor {
  private config: TokenProcessorConfig;
  private metadata: TokenMetadata | null = null;
  
  public tokens: {
    theme: TokenSet;
    modes: Record<string, TokenSet>;
    component: TokenSet;
    layout: TokenSet;
  } = {
    theme: {},
    modes: {},
    component: {},
    layout: {}
  };

  constructor(config: TokenProcessorConfig) {
    this.config = config;
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!existsSync(this.config.dataPath)) {
      throw new Error(`Data path does not exist: ${this.config.dataPath}`);
    }
  }

  /**
   * Load all token files according to metadata configuration
   */
  public loadAllTokens(): void {
    try {
      this.loadMetadata();
      this.loadThemeTokens();
      this.loadModeTokens();
      this.loadComponentTokens();
      this.loadLayoutTokens();
      
      if (this.config.verbose) {
        console.log('✅ All token files loaded successfully');
        this.logTokenStats();
      }
    } catch (error) {
      throw new TokenProcessingError(
        `Failed to load tokens: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'loading'
      );
    }
  }

  private loadMetadata(): void {
    const metadataPath = join(this.config.dataPath, '$metadata.json');
    if (!existsSync(metadataPath)) {
      throw new Error('$metadata.json not found');
    }

    this.metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
    if (this.config.verbose) {
      console.log('📋 Metadata loaded:', this.metadata?.tokenSetOrder.length, 'token sets');
    }
  }

  private loadThemeTokens(): void {
    if (!this.metadata) throw new Error('Metadata not loaded');

    // Find theme token set in metadata
    const themeSet = this.metadata.tokenSetOrder.find(set => set.startsWith('brand-theme/'));
    if (!themeSet) {
      throw new Error('No brand theme found in tokenSetOrder');
    }

    const themePath = join(this.config.dataPath, `${themeSet}.json`);
    if (existsSync(themePath)) {
      this.tokens.theme = JSON.parse(readFileSync(themePath, 'utf8'));
      if (this.config.verbose) {
        console.log(`🎨 Theme tokens loaded: ${themeSet}`);
      }
    }
  }

  private loadModeTokens(): void {
    if (!this.metadata) return;

    const modeSets = this.metadata.tokenSetOrder.filter(set => set.startsWith('color-modes/'));
    
    for (const modeSet of modeSets) {
      const modePath = join(this.config.dataPath, `${modeSet}.json`);
      if (existsSync(modePath)) {
        const modeName = modeSet.split('/')[1]; // Extract mode name from path
        this.tokens.modes[modeName] = JSON.parse(readFileSync(modePath, 'utf8'));
        
        if (this.config.verbose) {
          console.log(`🌓 Mode tokens loaded: ${modeName}`);
        }
      }
    }
  }

  private loadComponentTokens(): void {
    const componentPath = join(this.config.dataPath, 'components/component.json');
    if (existsSync(componentPath)) {
      this.tokens.component = JSON.parse(readFileSync(componentPath, 'utf8'));
      if (this.config.verbose) {
        console.log('🧩 Component tokens loaded');
      }
    }
  }

  private loadLayoutTokens(): void {
    const layoutPath = join(this.config.dataPath, 'layouts/layout.json');
    if (existsSync(layoutPath)) {
      this.tokens.layout = JSON.parse(readFileSync(layoutPath, 'utf8'));
      if (this.config.verbose) {
        console.log('📐 Layout tokens loaded');
      }
    }
  }

  private logTokenStats(): void {
    const stats = {
      theme: this.countTokens(this.tokens.theme),
      modes: Object.entries(this.tokens.modes).map(([name, tokens]) => ({
        name,
        count: this.countTokens(tokens)
      })),
      component: this.countTokens(this.tokens.component),
      layout: this.countTokens(this.tokens.layout)
    };

    console.log('📊 Token Statistics:');
    console.log(`   Theme: ${stats.theme} tokens`);
    stats.modes.forEach(mode => {
      console.log(`   ${mode.name}: ${mode.count} tokens`);
    });
    console.log(`   Component: ${stats.component} tokens`);
    console.log(`   Layout: ${stats.layout} tokens`);
  }

  private countTokens(tokenSet: TokenSet): number {
    let count = 0;
    
    function walk(obj: TokenSet | any): void {
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
          if (obj[key].$value !== undefined) {
            count++;
          } else {
            walk(obj[key]);
          }
        }
      }
    }
    
    walk(tokenSet);
    return count;
  }

  /**
   * Get available modes from loaded token data
   */
  public getAvailableModes(): string[] {
    return Object.keys(this.tokens.modes);
  }

  /**
   * Get metadata information
   */
  public getMetadata(): TokenMetadata | null {
    return this.metadata;
  }

  /**
   * Get all loaded tokens
   */
  public getAllTokens() {
    return this.tokens;
  }
} 