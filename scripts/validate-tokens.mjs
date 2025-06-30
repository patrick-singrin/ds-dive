#!/usr/bin/env node

/**
 * Token Validation Script
 * Prevents common token misuse patterns in component CSS
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Token usage rules
const TOKEN_RULES = {
  // Rule: Outline/ghost hover should never use primary background tokens
  'outline-ghost-hover-primary-bg': {
    pattern: /\.([\w-]*(?:outline|ghost)[\w-]*):hover(?:\:not\([^)]*\))?[^{]*\{[^}]*background:\s*var\(--Color-.*-Primary-Background/gms,
    message: '❌ CRITICAL: Outline/ghost hover states should use Subtle-Background tokens, not Primary-Background',
    severity: 'error'
  },
  
  // Rule: Check for inconsistent button state tokens between Button/IconButton
  'button-iconbutton-inconsistency': {
    pattern: /\/\* This rule is handled in validateComponentConsistency \*\//,
    message: 'Handled separately',
    severity: 'info'
  }
};

// Component comparison rules
const COMPONENT_CONSISTENCY_RULES = {
  'button-iconbutton-hover': {
    components: ['Button', 'IconButton'],
    states: ['outline:hover', 'ghost:hover'],
    tokens: ['background', 'color', 'border-color'],
    message: '❌ Button and IconButton hover states must use identical tokens'
  }
};

function validateComponentTokens(componentPath) {
  const content = fs.readFileSync(componentPath, 'utf8');
  const componentName = path.basename(componentPath, '.ts');
  const issues = [];

  console.log(`\n🔍 Validating ${componentName}...`);

  // Check token usage rules
  for (const [ruleName, rule] of Object.entries(TOKEN_RULES)) {
    const matches = content.match(rule.pattern);
    if (matches) {
      matches.forEach(match => {
        issues.push({
          rule: ruleName,
          severity: rule.severity,
          message: rule.message,
          match: match.trim(),
          component: componentName
        });
      });
    }
  }

  return issues;
}

function extractTokenUsage(componentPath, state) {
  const content = fs.readFileSync(componentPath, 'utf8');
  
  // Extract CSS for specific state (e.g., 'outline:hover')
  const statePattern = new RegExp(`\\.(\\w+--\\w+)\\.(\\w+--${state.split(':')[0]}):${state.split(':')[1] || 'not\\(:disabled\\)'}[^}]+\\{([^}]+)\\}`, 'g');
  const matches = [...content.matchAll(statePattern)];
  
  const tokens = {};
  matches.forEach(match => {
    const cssBlock = match[3];
    
    // Extract token usage
    const tokenMatches = [...cssBlock.matchAll(/(?:background|color|border-color):\s*var\((--[^,)]+)/g)];
    tokenMatches.forEach(tokenMatch => {
      const property = tokenMatch[0].split(':')[0].trim();
      const token = tokenMatch[1];
      tokens[property] = token;
    });
  });
  
  return tokens;
}

function validateComponentConsistency() {
  const issues = [];
  
  for (const [ruleName, rule] of Object.entries(COMPONENT_CONSISTENCY_RULES)) {
    console.log(`\n🔄 Checking consistency: ${rule.components.join(' ↔ ')}...`);
    
    const componentTokens = {};
    
    // Get token usage for each component
    rule.components.forEach(component => {
      const componentPath = path.join(__dirname, '..', 'src', 'components', component, `${component}.ts`);
      if (fs.existsSync(componentPath)) {
        componentTokens[component] = {};
        
        rule.states.forEach(state => {
          componentTokens[component][state] = extractTokenUsage(componentPath, state);
        });
      }
    });
    
    // Compare token usage between components
    if (Object.keys(componentTokens).length >= 2) {
      const [comp1, comp2] = Object.keys(componentTokens);
      
      rule.states.forEach(state => {
        rule.tokens.forEach(tokenType => {
          const token1 = componentTokens[comp1][state]?.[tokenType];
          const token2 = componentTokens[comp2][state]?.[tokenType];
          
          if (token1 && token2 && token1 !== token2) {
            issues.push({
              rule: ruleName,
              severity: 'error',
              message: `${rule.message}: ${comp1} uses ${token1}, ${comp2} uses ${token2}`,
              state,
              tokenType,
              components: [comp1, comp2]
            });
          }
        });
      });
    }
  }
  
  return issues;
}

function main() {
  console.log('🔍 Design Token Validation\n');
  
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const allIssues = [];
  
  // Validate individual components
  const components = fs.readdirSync(componentsDir)
    .filter(dir => dir !== '_Blueprint' && dir !== 'index.ts')
    .filter(dir => fs.statSync(path.join(componentsDir, dir)).isDirectory());
  
  components.forEach(component => {
    const componentPath = path.join(componentsDir, component, `${component}.ts`);
    if (fs.existsSync(componentPath)) {
      const issues = validateComponentTokens(componentPath);
      allIssues.push(...issues);
    }
  });
  
  // Validate cross-component consistency
  const consistencyIssues = validateComponentConsistency();
  allIssues.push(...consistencyIssues);
  
  // Report results
  const errors = allIssues.filter(issue => issue.severity === 'error');
  const warnings = allIssues.filter(issue => issue.severity === 'warning');
  
  console.log('\n📋 Validation Results:');
  
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} Error(s):`);
    errors.forEach(error => {
      console.log(`   ${error.message}`);
      if (error.match) console.log(`   Code: ${error.match}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} Warning(s):`);
    warnings.forEach(warning => {
      console.log(`   ${warning.message}`);
      if (warning.match) console.log(`   Code: ${warning.match}`);
    });
  }
  
  if (allIssues.length === 0) {
    console.log('\n✅ All token usage patterns look good!');
  }
  
  console.log('\n📚 For token usage guidelines, see: docs/component-development-guide.md');
  
  // Exit with error code if there are errors
  process.exit(errors.length > 0 ? 1 : 0);
}

main(); 