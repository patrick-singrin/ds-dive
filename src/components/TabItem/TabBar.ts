import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { DiveTabItem } from './TabItem.js';

/**
 * @summary TabBar component - A container for organizing multiple TabItem components
 *
 * @description
 * The TabBar component serves as a container that manages the layout and visual grouping
 * of multiple TabItem components. It supports different orientations, visual types, and
 * color schemes to match various interface patterns.
 *
 * @example
 * ```html
 * <dive-tab-bar orientation="horizontal" type="line" color="base">
 *   <dive-tab-item text="Tab 1" selected></dive-tab-item>
 *   <dive-tab-item text="Tab 2"></dive-tab-item>
 *   <dive-tab-item text="Tab 3"></dive-tab-item>
 * </dive-tab-bar>
 * ```
 *
 * @cssproperty --tab-bar-gap - Gap between tab items
 * @cssproperty --tab-bar-padding - Padding around the tab bar container
 * @cssproperty --tab-bar-background - Background color for pill type containers
 * @cssproperty --tab-bar-border-radius - Border radius for pill type containers
 */
@customElement('dive-tab-bar')
export class DiveTabBar extends LitElement {
  static styles = css`
    :host {
      /* Design token variables for consistent theming */
      --tab-bar-gap-horizontal-pill: 4px;
      --tab-bar-gap-vertical: 8px;
      --tab-bar-padding-pill: 8px;
      --tab-bar-background-pill: var(--Color-Base-Subtle-Background-default, #ECEDF0);
      --tab-bar-border-radius-pill: 12px;

      display: inline-flex;
      box-sizing: border-box;
    }

    .tab-bar {
      display: flex;
      box-sizing: border-box;
    }

    /* Horizontal orientation */
    .tab-bar--horizontal {
      flex-direction: row;
    }

    /* Vertical orientation */
    .tab-bar--vertical {
      flex-direction: column;
    }

    /* Pill type styling */
    .tab-bar--pill {
      background: var(--tab-bar-background-pill);
      border-radius: var(--tab-bar-border-radius-pill);
      padding: var(--tab-bar-padding-pill);
    }

    .tab-bar--pill.tab-bar--horizontal {
      gap: var(--tab-bar-gap-horizontal-pill);
    }

    .tab-bar--pill.tab-bar--vertical {
      gap: var(--tab-bar-gap-vertical);
    }

    /* Ghost and Line types - no container styling, just layout */
    .tab-bar--ghost,
    .tab-bar--line {
      gap: 0;
      padding: 0;
      background: transparent;
    }

    /* Accessibility and interaction enhancements */
    :host([role="tablist"]) {
      /* Ensure proper ARIA structure */
    }

    /* Focus management for keyboard navigation */
    ::slotted(dive-tab-item:focus-visible) {
      outline: 2px solid var(--Color-Primary-Primary-Background-default, #2C72E0);
      outline-offset: 2px;
      border-radius: 4px;
    }
  `;

  /**
   * Layout orientation of the tab bar
   * @type {'horizontal' | 'vertical'}
   */
  // @ts-ignore
  @property({ type: String, reflect: true })
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * Visual style type of the tab bar
   * @type {'ghost' | 'line' | 'pill'}
   */
  // @ts-ignore
  @property({ type: String, reflect: true })
  type: 'ghost' | 'line' | 'pill' = 'line';

  /**
   * Color scheme for the tab bar
   * @type {'base' | 'primary'}
   */
  // @ts-ignore
  @property({ type: String, reflect: true })
  color: 'base' | 'primary' = 'base';

  /**
   * ARIA role for the tab bar (defaults to tablist)
   */
  // @ts-ignore
  @property({ type: String, reflect: true })
  role = 'tablist';

  /**
   * Optional ARIA label for accessibility
   */
  // @ts-ignore
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('tab-select', this._handleTabSelect.bind(this));
    this.addEventListener('slotchange', this._handleSlotChange.bind(this));
    // Configure existing tabs on initial connection
    this.updateComplete.then(() => this._configureChildTabs());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('tab-select', this._handleTabSelect.bind(this));
    this.removeEventListener('slotchange', this._handleSlotChange.bind(this));
  }

  /**
   * Handle tab selection events from child TabItem components
   */
  private _handleTabSelect(event: Event) {
    const customEvent = event as CustomEvent;
    customEvent.stopPropagation();
    
    const clickedTab = customEvent.target as DiveTabItem;
    const allTabs = this.querySelectorAll('dive-tab-item');
    
    // Update selection state: deselect all, then select the clicked tab
    allTabs.forEach(tab => {
      if (tab === clickedTab) {
        tab.setAttribute('selected', '');
      } else {
        tab.removeAttribute('selected');
      }
    });

    // Dispatch a tab-bar-change event for external listeners
    this.dispatchEvent(new CustomEvent('tab-bar-change', {
      detail: {
        selectedTab: clickedTab,
        selectedIndex: Array.from(allTabs).indexOf(clickedTab)
      },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Handle slot changes to configure new child TabItems
   */
  private _handleSlotChange() {
    this._configureChildTabs();
  }

  /**
   * Configure all child TabItem components to match TabBar properties
   */
  private _configureChildTabs() {
    const tabs = this.querySelectorAll('dive-tab-item');
    tabs.forEach(tab => {
      // Apply TabBar properties to each child TabItem
      tab.setAttribute('orientation', this.orientation);
      tab.setAttribute('type', this.type);
      tab.setAttribute('color', this.color);
    });
  }

  /**
   * Update child tabs when TabBar properties change
   */
  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    
    // If any of the key properties changed, update child tabs
    if (changedProperties.has('orientation') || 
        changedProperties.has('type') || 
        changedProperties.has('color')) {
      this._configureChildTabs();
    }
  }

  render() {
    const classes = {
      'tab-bar': true,
      [`tab-bar--${this.orientation}`]: true,
      [`tab-bar--${this.type}`]: true,
      [`tab-bar--${this.color}`]: true,
    };

    return html`
      <div 
        class=${classMap(classes)}
        role=${this.role}
        aria-label=${this.ariaLabel || ''}
      >
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }
}

 
declare global {
  interface HTMLElementTagNameMap {
    'dive-tab-bar': DiveTabBar;
  }
} 