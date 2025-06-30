#!/bin/bash

# Visual Testing Setup Script for Dive Design System
# This script helps set up Chromatic visual testing

set -e

echo "🔍 Setting up Visual Testing for Dive Design System"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Storybook addon is installed
echo "📦 Checking Storybook Visual Tests addon..."
if grep -q "@chromatic-com/storybook" package.json; then
    echo "✅ Visual Tests addon is already installed"
else
    echo "❌ Visual Tests addon not found. Installing..."
    npx storybook@latest add @chromatic-com/storybook
fi

# Check if GitHub Actions workflow exists
echo "🔧 Checking GitHub Actions workflow..."
if [ -f ".github/workflows/visual-tests.yml" ]; then
    echo "✅ Visual testing workflow is configured"
else
    echo "❌ GitHub Actions workflow not found"
    echo "   Please ensure .github/workflows/visual-tests.yml exists"
fi

# Build design tokens and Storybook
echo "🏗️ Building design tokens..."
npm run build:tokens

echo "📚 Building Storybook..."
npm run build-storybook

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. Create Chromatic Account:"
echo "   → Go to https://chromatic.com"
echo "   → Sign up with your GitHub account"
echo "   → Connect this repository"
echo ""
echo "2. Configure GitHub Secret:"
echo "   → Copy your Chromatic project token"
echo "   → Go to GitHub → Settings → Secrets and variables → Actions"
echo "   → Add new secret: CHROMATIC_PROJECT_TOKEN"
echo ""
echo "3. Install Chromatic CLI:"
echo "   → npm install --save-dev chromatic"
echo ""
echo "4. Test Visual Testing:"
echo "   → Push changes to trigger GitHub Actions"
echo "   → Or run locally: npx chromatic --project-token=<your-token>"
echo ""
echo "4. Review Documentation:"
echo "   → docs/visual-testing-setup.md - Complete setup guide"
echo "   → src/components/Button/Button.stories.ts - Visual regression stories"
echo ""
echo "✅ Visual testing setup is ready!"
echo "   Once you configure Chromatic, visual tests will run automatically on every PR." 