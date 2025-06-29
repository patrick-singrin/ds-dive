/**
 * Storybook Setup - Component Registration
 * 
 * This file ensures all custom elements are properly registered
 * before stories are loaded, preventing rendering issues.
 */

// Import all components to register them
import '../src/components/_Blueprint/_Blueprint';
import '../src/components/Icon/Icon';

// Import Shadow DOM utilities for diagnostics
import '../src/utils/shadowdom-diagnostics';

// List of all custom elements that should be registered
const EXPECTED_COMPONENTS = [
  'dive-blueprint',
  'dive-icon'
] as const;

/**
 * Verify all expected components are registered
 */
export function verifyComponentRegistration(): void {
  const unregistered = EXPECTED_COMPONENTS.filter(
    tagName => !customElements.get(tagName)
  );

  if (unregistered.length > 0) {
    console.error(
      'Storybook Setup: The following components are not registered:',
      unregistered
    );
    console.error(
      'This may cause rendering issues in Canvas view. Check component imports.'
    );
  } else {
    console.log('Storybook Setup: All components successfully registered');
  }
}

/**
 * Wait for custom elements to be defined
 */
export async function waitForComponents(): Promise<void> {
  const promises = EXPECTED_COMPONENTS.map(tagName => 
    customElements.whenDefined(tagName)
  );

  try {
    await Promise.all(promises);
    console.log('Storybook Setup: All components ready');
  } catch (error) {
    console.error('Storybook Setup: Error waiting for components:', error);
  }
}

// Auto-run verification when this module is imported
if (typeof window !== 'undefined') {
  // Run verification after a small delay to allow imports to complete
  setTimeout(verifyComponentRegistration, 100);
} 