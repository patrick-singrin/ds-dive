module.exports = {
  ci: {
    collect: {
      staticDistDir: './storybook-static',
      url: [
        'http://localhost/index.html',
        'http://localhost/iframe.html?id=foundation-icons--default',
        'http://localhost/iframe.html?id=foundation-icons--icon-gallery',
        'http://localhost/iframe.html?id=molecules-blueprint--default',
        'http://localhost/iframe.html?id=foundation-typography--headings'
      ],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.7 }],
        
        // Bundle size assertions
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 50000 }],
        
        // Performance metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        
        // Accessibility
        'color-contrast': 'error',
        'image-alt': 'error',
        'button-name': 'error'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}; 