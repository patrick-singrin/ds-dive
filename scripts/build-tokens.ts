#!/usr/bin/env tsx

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

interface Token {
  $type: string;
  $value: string | number;
  $description?: string;
}

interface TokenSet {
  [key: string]: Token | TokenSet;
}

/**
 * Transforms nested token object into flat CSS variables
 */
function transformTokensToCSS(tokens: TokenSet, prefix: string[] = []): string[] {
  const cssVariables: string[] = [];
  
  for (const [key, value] of Object.entries(tokens)) {
    if (value && typeof value === 'object' && '$value' in value) {
      // This is a token
      const token = value as Token;
      const variableName = `--${[...prefix, key].join('-')}`;
      
      // Resolve token references
      let resolvedValue = token.$value.toString();
      if (resolvedValue.startsWith('{') && resolvedValue.endsWith('}')) {
        // This is a reference - convert to CSS variable reference
        const referencePath = resolvedValue.slice(1, -1).split('.');
        resolvedValue = `var(--${referencePath.join('-')})`;
      }
      
      cssVariables.push(`  ${variableName}: ${resolvedValue};`);
    } else if (value && typeof value === 'object') {
      // This is a nested object
      const nestedVariables = transformTokensToCSS(value as TokenSet, [...prefix, key]);
      cssVariables.push(...nestedVariables);
    }
  }
  
  return cssVariables;
}

/**
 * Builds CSS variables from token files
 */
async function buildTokens() {
  console.log('🚀 Building design tokens...');
  
  const tokensDataPath = join(rootDir, 'src/tokens/data');
  const outputPath = join(rootDir, 'src/tokens/css-vars');
  
  // Ensure output directory exists
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
  
  try {
    // Read and process brand theme tokens
    const brandThemePath = join(tokensDataPath, 'brand-theme/dive-theme.json');
    if (existsSync(brandThemePath)) {
      const brandTokens = JSON.parse(readFileSync(brandThemePath, 'utf8'));
      const brandCSS = transformTokensToCSS(brandTokens);
      
      const brandCSSContent = `:root {\n${brandCSS.join('\n')}\n}`;
      writeFileSync(join(outputPath, 'brand-theme.css'), brandCSSContent);
      console.log('✅ Brand theme tokens processed');
    }
    
    // Process color mode tokens
    const colorModesPath = join(tokensDataPath, 'color-modes');
    const colorModes = ['light-mode', 'dark-mode', 'hc-light-mode', 'hc-dark-mode'];
    
    for (const mode of colorModes) {
      const modePath = join(colorModesPath, `${mode}.json`);
      if (existsSync(modePath)) {
        const modeTokens = JSON.parse(readFileSync(modePath, 'utf8'));
        const modeCSS = transformTokensToCSS(modeTokens);
        
        const selector = mode.includes('dark') ? 
          (mode.includes('hc') ? '[data-theme="hc-dark"]' : '[data-theme="dark"]') :
          (mode.includes('hc') ? '[data-theme="hc-light"]' : ':root');
        
        const modeCSSContent = `${selector} {\n${modeCSS.join('\n')}\n}`;
        writeFileSync(join(outputPath, `${mode}.css`), modeCSSContent);
        console.log(`✅ ${mode} tokens processed`);
      }
    }
    
    // Create master index file
    const indexContent = `/* Auto-generated design tokens */
@import './brand-theme.css';
@import './light-mode.css';
@import './dark-mode.css';
@import './hc-light-mode.css';
@import './hc-dark-mode.css';
`;
    
    writeFileSync(join(outputPath, 'index.css'), indexContent);
    
    console.log('🎉 Design tokens build complete!');
    
  } catch (error) {
    console.error('❌ Error building tokens:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildTokens();
}

export { buildTokens };
