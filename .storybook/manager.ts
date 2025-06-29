import { addons } from '@storybook/manager-api';
import theme from './theme';

addons.setConfig({
  theme,
  panelPosition: 'bottom',
  selectedPanel: 'controls',
  showNav: true,
  showPanel: true,
  showToolbar: true,
  isFullscreen: false,
  isToolshown: true,
  initialActive: 'sidebar',
  sidebar: {
    showRoots: true,
    collapsedRoots: [],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
