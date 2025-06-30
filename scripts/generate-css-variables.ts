#!/usr/bin/env tsx

/**
 * Advanced CSS Variable Generation Script
 * Implements the complete pipeline described in the documentation
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { TokenProcessor } from '../src/tokens/processor.js';
import { TokenResolver } from '../src/tokens/resolver.js';
import { CSSFormatter } from '../src/tokens/css-formatter.js';
import type { BuildMetrics, TokenSet } from '../src/tokens/types.js';

// CLI argument parsing
interface CLIArgs {
  theme?: string;
  mode?: string;
  dryRun?: boolean;
  verbose?: boolean;
  watch?: boolean;
  outputDir?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

class CSSVariableGenerator {
  private args: CLIArgs;
  private processor: TokenProcessor;
  private resolver: TokenResolver;
  private metrics: BuildMetrics;
  private startTime: number;

  constructor(args: CLIArgs) {
    this.args = args;
    this.startTime = Date.now();
    this.metrics = {
      totalVariables: 0,
      filesWritten: 0,
      processingTime: 0,
      unresolvedTokens: 0,
      duplicateVariables: 0,
      cycleDetections: 0
    };

    const config = {
      dataPath: join(rootDir, 'src/tokens/data'),
      outputPath: args.outputDir || join(rootDir, 'src/tokens/css-vars'),
      verbose: args.verbose || false,
      dryRun: args.dryRun || false
    };

    this.processor = new TokenProcessor(config);
  }

  /**
   * Main generation process
   */
  public async generate(): Promise<void> {
    try {
      console.log('🚀 Starting CSS Variable Generation Pipeline...');
      
      // Load all token data
      this.processor.loadAllTokens();
      
      // Initialize resolver
      this.resolver = new TokenResolver(this.processor.getAllTokens());
      
      // Generate CSS for all theme/mode combinations
      await this.generateAllCombinations();
      
      // Generate index files
      this.generateIndexFiles();
      
      // Complete metrics
      this.completeMetrics();
      
      // Report results
      this.reportResults();
      
    } catch (error) {
      console.error('❌ CSS Variable Generation Failed:', error);
      process.exit(1);
    }
  }

  private async generateAllCombinations(): Promise<void> {
    const modes = this.processor.getAvailableModes();
    const componentTokens = this.processor.getAllTokens().component;
    const layoutTokens = this.processor.getAllTokens().layout;
    
    if (this.args.verbose) {
      console.log(`📦 Processing ${modes.length} modes...`);
    }

    // Filter modes if specific mode requested
    const targetModes = this.args.mode ? [this.args.mode] : modes;

    // Accumulate CSS for all modes
    let allComponentCSS = '';
    let allLayoutCSS = '';

    for (const mode of targetModes) {
      const modeResult = await this.generateModeCSS(mode, componentTokens, layoutTokens);
      
      // Accumulate CSS for all modes
      if (modeResult.componentCSS) {
        allComponentCSS += (allComponentCSS ? '\n\n' : '') + modeResult.componentCSS;
      }
      if (modeResult.layoutCSS) {
        allLayoutCSS += (allLayoutCSS ? '\n\n' : '') + modeResult.layoutCSS;
      }
    }

    // Write accumulated CSS for all modes
    if (!this.args.dryRun) {
      await this.writeFiles('all-modes', allComponentCSS, allLayoutCSS || null);
    }
  }

  private async generateModeCSS(
    mode: string, 
    componentTokens: TokenSet, 
    layoutTokens: TokenSet
  ): Promise<{ componentCSS: string; layoutCSS: string | null }> {
    try {
      if (this.args.verbose) {
        console.log(`🌓 Processing mode: ${mode}`);
      }

      // Resolve component tokens for this mode
      const componentVariables = this.resolver.resolveTokenSet(componentTokens, mode);
      this.metrics.totalVariables += Object.keys(componentVariables).length;

      // Resolve layout tokens for this mode (if any)
      const layoutVariables = Object.keys(layoutTokens).length > 0 
        ? this.resolver.resolveTokenSet(layoutTokens, mode)
        : {};
      this.metrics.totalVariables += Object.keys(layoutVariables).length;

      // Generate CSS content
      const componentCSS = this.generateCSS(mode, componentVariables, 'component');
      const layoutCSS = Object.keys(layoutVariables).length > 0 
        ? this.generateCSS(mode, layoutVariables, 'layout')
        : null;

      if (this.args.verbose) {
        console.log(`✅ Mode ${mode} processed: ${Object.keys(componentVariables).length + Object.keys(layoutVariables).length} variables`);
      }

      return { componentCSS, layoutCSS };

    } catch (error) {
      console.error(`❌ Failed to process mode ${mode}:`, error);
      this.metrics.unresolvedTokens++;
      return { componentCSS: '', layoutCSS: null };
    }
  }

  private generateCSS(
    mode: string, 
    variables: Record<string, any>, 
    type: 'component' | 'layout'
  ): string {
    const selector = CSSFormatter.generateModeSelector(mode);
    const cssRule = CSSFormatter.generateCssRule(selector, variables);
    
    // Return just the CSS rule without header (headers will be added when combining all modes)
    return cssRule;
  }

  private async writeFiles(
    mode: string, 
    componentCSS: string, 
    layoutCSS: string | null
  ): Promise<void> {
    const outputDir = join(rootDir, 'src/tokens/css-vars');
    
    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Create theme-specific directory
    const themeDir = join(outputDir, 'dive-theme');
    if (!existsSync(themeDir)) {
      mkdirSync(themeDir, { recursive: true });
    }

    // Generate file headers for combined CSS
    const componentHeader = CSSFormatter.generateFileHeader(
      'component.css',
      'Component tokens for all modes',
      {
        modes: ['light-mode', 'hc-light-mode', 'dark-mode', 'hc-dark-mode'],
        type: 'component',
        variables: 251 * 4, // 251 variables per mode × 4 modes
        generated: new Date().toISOString()
      }
    );

    const layoutHeader = CSSFormatter.generateFileHeader(
      'layout.css',
      'Layout tokens for all modes',
      {
        modes: ['light-mode', 'hc-light-mode', 'dark-mode', 'hc-dark-mode'],
        type: 'layout',
        variables: 62 * 4, // 62 variables per mode × 4 modes
        generated: new Date().toISOString()
      }
    );

    // Write component CSS with header
    const componentFile = join(themeDir, 'component.css');
    writeFileSync(componentFile, CSSFormatter.optimizeCss(componentHeader + componentCSS));
    this.metrics.filesWritten++;

    // Write layout CSS if exists
    if (layoutCSS) {
      const layoutFile = join(themeDir, 'layout.css');
      writeFileSync(layoutFile, CSSFormatter.optimizeCss(layoutHeader + layoutCSS));
      this.metrics.filesWritten++;
    }

    if (this.args.verbose) {
      console.log(`💾 Files written for all modes`);
    }
  }

  private generateIndexFiles(): void {
    if (this.args.dryRun) return;

    const outputDir = join(rootDir, 'src/tokens/css-vars');
    const themeDir = join(outputDir, 'dive-theme');

    // Theme index file
    const themeIndexContent = `/* dive-theme/index.css */
/* Auto-generated theme imports */

@import './component.css';
@import './layout.css';
`;

    writeFileSync(join(themeDir, 'index.css'), themeIndexContent);

    // Main index file
    const mainIndexContent = `/* Auto-generated design tokens */
@import '../../assets/fonts/fonts.css';
@import './dive-theme/index.css';
@import '../../styles/global.css';
`;

    writeFileSync(join(outputDir, 'index.css'), mainIndexContent);
    this.metrics.filesWritten += 2;

    if (this.args.verbose) {
      console.log('📄 Index files generated');
    }
  }

  private completeMetrics(): void {
    this.metrics.processingTime = Date.now() - this.startTime;
    
    // Get cache stats from resolver
    const cacheStats = this.resolver.getCacheStats();
    if (this.args.verbose) {
      console.log(`🔄 Resolution cache: ${cacheStats.size} entries`);
    }
  }

  private reportResults(): void {
    console.log('\n🎉 CSS Variable Generation Complete!');
    console.log('📊 Build Metrics:');
    console.log(`   • Total Variables: ${this.metrics.totalVariables}`);
    console.log(`   • Files Written: ${this.metrics.filesWritten}`);
    console.log(`   • Processing Time: ${this.metrics.processingTime}ms`);
    console.log(`   • Unresolved Tokens: ${this.metrics.unresolvedTokens}`);
    
    if (this.metrics.unresolvedTokens > 0) {
      console.warn(`⚠️  ${this.metrics.unresolvedTokens} tokens could not be resolved`);
    }

    if (this.args.dryRun) {
      console.log('🧪 Dry run completed - no files were written');
    }
  }
}

// CLI Processing
function parseArgs(argv: string[]): CLIArgs {
  const args: CLIArgs = {};
  
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    
    switch (arg) {
      case '--theme':
        args.theme = argv[++i];
        break;
      case '--mode':
        args.mode = argv[++i];
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--verbose':
        args.verbose = true;
        break;
      case '--watch':
        args.watch = true;
        break;
      case '--output-dir':
        args.outputDir = argv[++i];
        break;
      case '--help':
        printHelp();
        process.exit(0);
        break;
    }
  }
  
  return args;
}

function printHelp(): void {
  console.log(`
CSS Variable Generator

Usage: tsx scripts/generate-css-variables.ts [options]

Options:
  --theme <name>        Generate for specific theme only
  --mode <name>         Generate for specific mode only
  --dry-run            Test run without writing files
  --verbose            Detailed output
  --watch              Watch for changes (not implemented)
  --output-dir <path>   Custom output directory
  --help               Show this help

Examples:
  tsx scripts/generate-css-variables.ts
  tsx scripts/generate-css-variables.ts --verbose
  tsx scripts/generate-css-variables.ts --mode dark-mode --dry-run
  tsx scripts/generate-css-variables.ts --theme dive-theme --verbose
  `);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv);
  const generator = new CSSVariableGenerator(args);
  generator.generate().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
} 