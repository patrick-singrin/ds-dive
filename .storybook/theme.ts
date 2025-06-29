import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  
  // Typography
  fontBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontCode: 'ui-monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',

  brandTitle: 'Dive Design System',
  brandUrl: 'https://dive-design-system.com',
  brandImage: undefined,
  brandTarget: '_self',

  // Colors
  colorPrimary: '#2c72e0',
  colorSecondary: '#245db8',

  // UI colors
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e1e5e9',
  appBorderRadius: 8,

  // Text colors
  textColor: '#1d222c',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#374054',
  barSelectedColor: '#2c72e0',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#c7cad1',
  inputTextColor: '#1d222c',
  inputBorderRadius: 6,
});
