# Visual Testing Setup Guide

## Overview

This document outlines the complete automated visual regression testing implementation for the Dive Design System, including setup instructions, workflow documentation, and troubleshooting guidance.

## 🎯 **Why Visual Testing for Design Systems**

Visual regression testing is critical for design systems because:

- **🔍 Pixel-Perfect Accuracy**: Catches 1px border changes and subtle color shifts
- **🔄 Design-Code Alignment**: Ensures Storybook components match Figma designs exactly  
- **⚡ Fast Feedback**: Visual changes detected in CI before merge
- **📱 Cross-Browser Consistency**: Tests rendering across Chrome, Safari, Firefox
- **👥 Team Confidence**: Reduces visual bugs reaching production

## 🚀 **Implementation Overview**

We've implemented a comprehensive visual testing solution using:

- **Storybook Visual Tests Addon** (`@chromatic-com/storybook`)
- **Chromatic Cloud Platform** for visual diff processing
- **GitHub Actions** for automated CI/CD integration
- **Multi-mode Testing** across light, dark, and high-contrast themes

## 📋 **Setup Instructions**

### Step 1: Verify Addon Installation

The Visual Tests addon has already been installed and configured:

```typescript
// .storybook/main.ts
addons: [
  '@storybook/addon-links',
  '@storybook/addon-essentials',
  // ... other addons
  '@chromatic-com/storybook' // ✅ Installed
]
```

### Step 2: Create Chromatic Account

1. **Sign up at [chromatic.com](https://chromatic.com)** using your GitHub account
2. **Connect your repository** to Chromatic
3. **Copy the Project Token** from your Chromatic project settings

### Step 3: Configure GitHub Secrets

Add the Chromatic project token to your GitHub repository:

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `CHROMATIC_PROJECT_TOKEN`
4. Value: Your Chromatic project token

### Step 4: GitHub Actions Workflow

The visual testing workflow is already configured in `.github/workflows/visual-tests.yml`:

```yaml
name: Visual Regression Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Required for baseline comparison

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build design tokens
        run: npm run build:tokens

      - name: Build Storybook
        run: npm run build-storybook

      - name: Run Chromatic Visual Tests
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: build-storybook
          exitZeroOnChanges: true # Don't fail PR on visual changes
          onlyChanged: true # Only test changed stories (faster)
          skipUpdateCheck: true
          autoAcceptChanges: main # Auto-accept changes on main branch
```

## 📊 **Visual Test Stories**

### Comprehensive Test Coverage

We've created a dedicated `VisualRegressionMatrix` story that covers:

#### **Complete Design Matrix**
- All button types: `base`, `primary`, `destructive`
- All variants: `filled`, `outline`, `ghost`  
- Both sizes: `small`, `default`
- All states: `normal`, `disabled`, `with-icon`, `text-only`

#### **Critical Base Type Validation**
Special focus on the base type buttons to ensure correct Figma token mapping:

```typescript
// Base Type Color Validation
<dive-button type="base" variant="filled" text="Base Filled"></dive-button>
<dive-button type="base" variant="outline" text="Base Outline"></dive-button>
<dive-button type="base" variant="ghost" text="Base Ghost"></dive-button>
```

#### **Multi-Mode Testing**
```typescript
parameters: {
  chromatic: {
    modes: {
      light: { theme: 'light' },
      dark: { theme: 'dark' },
      'high-contrast': { theme: 'hc-light' }
    }
  }
}
```

## 🔧 **Workflow Process**

### Development Workflow

1. **Make Component Changes**: Update Button component or design tokens
2. **Local Testing**: Run `npm run storybook` to verify changes locally
3. **Commit & Push**: Push changes to feature branch
4. **Automatic Testing**: GitHub Actions triggers Chromatic visual tests
5. **Review Results**: Check Chromatic UI for visual differences
6. **Approve/Deny**: Team reviews and approves or requests changes
7. **Merge**: Once approved, merge to main branch

### Visual Change Review Process

**When Chromatic detects changes:**

1. **GitHub PR Check**: Shows "Visual Tests" status
2. **Click "Details"**: Opens Chromatic comparison UI
3. **Review Differences**: Side-by-side before/after comparison
4. **Decision Points**:
   - ✅ **Accept**: Intentional design change (new baseline)
   - ❌ **Reject**: Unintended visual bug (fix required)

### Manual Testing Commands

```bash
# Run Chromatic locally (requires CHROMATIC_PROJECT_TOKEN)
npx chromatic --project-token=<your-token>

# Build Storybook for testing
npm run build-storybook

# Run full visual regression (all stories)
npx chromatic --project-token=<your-token> --only-changed=false
```

## 🎯 **Recent Fix: Base Type Button Colors**

### Problem Identified

Visual testing revealed that base type buttons didn't match Figma designs:
- Base outline/ghost buttons used wrong text color (#242A37 instead of #1D222C)
- Component created custom CSS variables instead of using proper Figma tokens

### Solution Implemented

**✅ Fixed by using proper Figma design tokens directly:**

```css
/* Before: Custom variables (wrong approach) */
--button-base-text-default: var(--Color-Base-Foreground-default, #1d222c);

/* After: Direct Figma tokens (correct approach) */
.button--base.button--outline {
  color: var(--Color-Base-Foreground-default, #1d222c); /* Correct Figma token */
}

.button--base.button--filled {
  background: var(--Color-Base-Primary-Background-default, #242a37);
  color: var(--Color-Base-Primary-Foreground-default, #ffffff);
}
```

### Token Mapping Corrections

| Use Case | Correct Figma Token | Color Value | Usage |
|----------|-------------------|-------------|-------|
| Base filled background | `--Color-Base-Primary-Background-default` | #242A37 | Dark background |
| Base filled text | `--Color-Base-Primary-Foreground-default` | #FFFFFF | White text on dark |
| Base outline/ghost text | `--Color-Base-Foreground-default` | #1D222C | Light text color |
| Base borders | `--Color-Base-Border-default` | #C7CAD1 | Border color |

### Benefits of This Fix

- **🎯 Design System Alignment**: Uses actual Figma tokens, not custom ones
- **🔄 Automatic Updates**: Components automatically stay in sync with Figma changes
- **📏 Consistency**: Same token naming across all components
- **🔍 Visual Accuracy**: Perfect match to Figma design specifications

## 🛠 **Troubleshooting**

### Common Issues

#### **Visual Tests Failing**
```bash
# Check build status
npm run build-storybook

# Verify design tokens are built
npm run build:tokens

# Test locally
npx chromatic --project-token=<token> --dry-run
```

#### **Token Not Found Error**
```yaml
# Ensure secret is properly set in GitHub
CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

#### **Build Timeout**
```yaml
# Increase memory allocation in workflow
env:
  NODE_OPTIONS: --max_old_space_size=4096
```

### Debug Commands

```bash
# Check Storybook build
npm run build-storybook && npx http-server storybook-static

# Verify all stories load
npm run storybook

# Check design token generation
npm run build:tokens && cat src/tokens/css-vars/index.css | head -20
```

## 🚀 **Next Steps**

### Phase 1: Baseline Establishment
1. **Initial Run**: Establish visual baselines for all components
2. **Team Training**: Train team on Chromatic review process
3. **Workflow Documentation**: Document approval processes

### Phase 2: Enhanced Integration
1. **Figma Plugin**: Install Storybook Connect for Figma
2. **Slack Integration**: Add notifications for visual changes
3. **Advanced Modes**: Add mobile viewport testing

### Phase 3: Comprehensive Coverage
1. **Component Library**: Add visual tests for all components
2. **Theme Testing**: Expand multi-mode testing
3. **Performance**: Optimize test execution time

## 📖 **Additional Resources**

- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Storybook Visual Testing Guide](https://storybook.js.org/docs/writing-tests/visual-testing)
- [GitHub Actions for Chromatic](https://github.com/chromaui/action)

## 🏆 **Success Metrics**

Track the effectiveness of visual testing:

- **🐛 Visual Bugs Caught**: Number of unintended changes detected
- **⏱ Feedback Speed**: Time from commit to visual feedback
- **👥 Team Adoption**: Percentage of PRs reviewed visually
- **🎯 Accuracy**: Figma-Storybook design consistency score

---

*This visual testing setup ensures pixel-perfect accuracy between Figma designs and Storybook implementation, catching issues like the base button color mapping automatically before they reach production.* 