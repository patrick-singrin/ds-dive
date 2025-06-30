#!/usr/bin/env node

/**
 * Interactive Component Development Checklist
 * Prevents common token misuse and consistency issues
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CHECKLIST = [
  {
    id: 'tokens-hover',
    category: 'Critical Token Usage',
    question: '✅ Do outline/ghost hover states use SUBTLE-background tokens (not primary-background)?',
    help: 'Example: var(--Color-Base-Subtle-Background-hover) ✅ NOT var(--Color-Base-Primary-Background-default) ❌',
    critical: true
  },
  {
    id: 'tokens-consistency', 
    category: 'Cross-Component Consistency',
    question: '✅ If this is similar to Button/IconButton, do hover states match exactly?',
    help: 'Compare your CSS with Button.ts - outline/ghost hover should use identical tokens',
    critical: true
  },
  {
    id: 'figma-tokens',
    category: 'Design Token Usage',
    question: '✅ Are you using actual Figma design tokens (not custom CSS variables)?',
    help: 'Use var(--Color-Brand-Primary-Background-default) ✅ NOT var(--my-custom-color) ❌',
    critical: false
  },
  {
    id: 'component-reuse',
    category: 'Component Architecture', 
    question: '✅ Did you check if existing components can be reused (e.g., dive-icon for icons)?',
    help: 'Import ../Icon/Icon.js and use <dive-icon> instead of duplicating SVG logic',
    critical: false
  },
  {
    id: 'visual-tests',
    category: 'Testing',
    question: '✅ Does your .stories.ts include VisualRegressionMatrix with hover/active/focus states?',
    help: 'Copy pattern from Button.stories.ts or IconButton.stories.ts',
    critical: false
  },
  {
    id: 'accessibility',
    category: 'Accessibility',
    question: '✅ Does your component have proper ARIA labels and focus management?',
    help: 'Include aria-label prop, focus-visible styles, and keyboard navigation',
    critical: false
  },
  {
    id: 'documentation',
    category: 'Documentation',
    question: '✅ Does your component have comprehensive JSDoc comments and examples?',
    help: 'Include @element, @fires, @example tags with usage examples',
    critical: false
  }
];

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().startsWith('y'));
    });
  });
}

function printHeader() {
  console.log('\n🔍 Component Development Checklist');
  console.log('===================================');
  console.log('Answer "y" for yes, anything else for no\n');
}

function printHelp(item) {
  console.log(`   💡 ${item.help}\n`);
}

async function runChecklist() {
  printHeader();
  
  const results = {
    passed: [],
    failed: [],
    critical_failed: []
  };
  
  for (const item of CHECKLIST) {
    const severity = item.critical ? '🚨 CRITICAL' : '⚠️  IMPORTANT';
    console.log(`${severity} - ${item.category}`);
    
    const passed = await askQuestion(`${item.question} (y/n): `);
    
    if (passed) {
      results.passed.push(item);
      console.log('   ✅ Good!\n');
    } else {
      results.failed.push(item);
      if (item.critical) {
        results.critical_failed.push(item);
      }
      console.log('   ❌ Needs attention:');
      printHelp(item);
    }
  }
  
  // Summary
  console.log('\n📋 Checklist Results:');
  console.log('====================');
  console.log(`✅ Passed: ${results.passed.length}/${CHECKLIST.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${CHECKLIST.length}`);
  
  if (results.critical_failed.length > 0) {
    console.log(`\n🚨 CRITICAL ISSUES (${results.critical_failed.length}):`);
    results.critical_failed.forEach(item => {
      console.log(`   - ${item.question}`);
    });
    console.log('\n🛑 Please fix critical issues before committing!');
    console.log('📚 See: docs/component-development-guide.md for guidance');
    
    rl.close();
    process.exit(1);
  } else if (results.failed.length > 0) {
    console.log(`\n⚠️  Non-critical issues (${results.failed.length}):`);
    results.failed.forEach(item => {
      console.log(`   - ${item.question}`);
    });
    console.log('\n💡 Consider addressing these before committing');
  } else {
    console.log('\n🎉 All checks passed! Ready to commit.');
  }
  
  rl.close();
  process.exit(results.critical_failed.length > 0 ? 1 : 0);
}

runChecklist().catch(console.error); 