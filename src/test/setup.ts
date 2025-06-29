import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/dom';
import '@testing-library/jest-dom/vitest';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Setup custom matchers
expect.extend({
  toBeAccessible: (received: HTMLElement) => {
    // Basic accessibility checks
    const hasAriaLabel = received.hasAttribute('aria-label');
    const hasAriaLabelledBy = received.hasAttribute('aria-labelledby');
    const hasAriaDescribedBy = received.hasAttribute('aria-describedby');
    const hasRole = received.hasAttribute('role');
    const hasTabIndex = received.hasAttribute('tabindex');
    
    const isAccessible = hasAriaLabel || hasAriaLabelledBy || hasAriaDescribedBy || hasRole || hasTabIndex;
    
    return {
      pass: isAccessible,
      message: () => 
        isAccessible 
          ? 'Element has accessibility attributes'
          : 'Element is missing accessibility attributes (aria-label, aria-labelledby, aria-describedby, role, or tabindex)'
    };
  }
});

// Declare custom matcher types
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeAccessible(): T;
  }
  interface AsymmetricMatchersContaining {
    toBeAccessible(): any;
  }
}

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver for tests
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver for tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
