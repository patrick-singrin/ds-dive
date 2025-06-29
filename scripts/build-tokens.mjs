#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Sanitizes CSS variable names by replacing spaces and special characters
 */
function sanitizeVariableName(name) {
  return name
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-_]/g, '') // Remove special characters except hyphens and underscores
    .replace(/^-+|-+$/g, '')   // Remove leading/trailing hyphens
    .toLowerCase();
}

/**
 * Transforms nested token object into flat CSS variables
 */
function transformTokensToCSS(tokens, prefix = []) {
  const cssVariables = [];
  
  for (const [key, value] of Object.entries(tokens)) {
    const sanitizedKey = sanitizeVariableName(key);
    
    if (value && typeof value === 'object' && '$value' in value) {
      // This is a token
      const token = value;
      
      // Skip tokens with object values that can't be converted to CSS
      if (typeof token.$value === 'object') {
        console.warn(`Skipping token ${[...prefix, sanitizedKey].join('-')} with object value`);
        continue;
      }
      
      const variableName = `--${[...prefix, sanitizedKey].join('-')}`;
      
      // Resolve token references
      let resolvedValue = token.$value.toString();
      if (resolvedValue.startsWith('{') && resolvedValue.endsWith('}')) {
        // This is a reference - convert to CSS variable reference
        const referencePath = resolvedValue.slice(1, -1).split('.');
        const sanitizedPath = referencePath.map(part => sanitizeVariableName(part));
        resolvedValue = `var(--${sanitizedPath.join('-')})`;
      }
      
      cssVariables.push(`  ${variableName}: ${resolvedValue};`);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // This is a nested object - recurse
      const nestedVariables = transformTokensToCSS(value, [...prefix, sanitizedKey]);
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
    // Use the existing processed CSS from the dive project
    const existingCSSPath = join(rootDir, 'src/tokens/css-vars/dive-theme/component.css');
    if (existsSync(existingCSSPath)) {
      const existingCSS = readFileSync(existingCSSPath, 'utf8');
      writeFileSync(join(outputPath, 'brand-theme.css'), existingCSS);
      console.log('✅ Using existing processed brand theme tokens');
    } else {
      // Read and process brand theme tokens with improved handling
      const brandThemePath = join(tokensDataPath, 'brand-theme/dive-theme.json');
      if (existsSync(brandThemePath)) {
        const brandTokens = JSON.parse(readFileSync(brandThemePath, 'utf8'));
        const brandCSS = transformTokensToCSS(brandTokens);
        
        const brandCSSContent = `:root {\n${brandCSS.join('\n')}\n}`;
        writeFileSync(join(outputPath, 'brand-theme.css'), brandCSSContent);
        console.log('✅ Brand theme tokens processed');
      }
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

// Run the build
buildTokens();
