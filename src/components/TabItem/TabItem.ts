import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * @summary A TabItem component for navigation tabs matching Figma design exactly.
 * @since 1.0.0
 * 
 * @slot - The tab item text content
 * 
 * @example
 * ```html
 * <dive-tab-item text="Tabs" orientation="horizontal" type="line" color="primary" selected></dive-tab-item>
 * ```
 * 
 * @example
 * ```html
 * <dive-tab-item orientation="vertical" type="pill" color="base" leading-icon="scuba-mask" trailing-icon="scuba-mask">
 *   Tabs
 * </dive-tab-item>
 * ```
 */
@customElement('dive-tab-item')
export class DiveTabItem extends LitElement {
  static styles = css`
    :host {
      --tab-item-font-family: 'Atkinson Hyperlegible Next', sans-serif;
      --tab-item-font-size: 16px;
      --tab-item-line-height: 1.5em;
      --tab-item-font-weight: 400;
      
      /* Default colors - base color scheme */
      --tab-item-text-color: #31394A;
      --tab-item-icon-color: #31394A;
      --tab-item-background: transparent;
      --tab-item-border-color: #C7CAD1;
      
      /* Hover colors */
      --tab-item-background-hover: #ECEDF0;
      --tab-item-border-color-hover: #A1A7B3;
      
      /* Selected colors for base */
      --tab-item-text-color-selected: #1D222C;
      --tab-item-icon-color-selected: #1D222C;
      --tab-item-background-selected: #FFFFFF;
      --tab-item-border-color-selected: #31394A;
      
      /* Disabled colors */
      --tab-item-text-color-disabled: #A1A7B3;
      --tab-item-icon-color-disabled: #A1A7B3;
      
      /* Focus ring */
      --tab-item-focus-ring-color: #2C72E0;
      
      display: inline-flex;
      cursor: pointer;
      box-sizing: border-box;
      font-family: var(--tab-item-font-family);
    }

    :host([disabled]) {
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Primary color scheme overrides */
    :host([color="primary"]) {
      --tab-item-text-color-selected: #1D222C;
      --tab-item-icon-color-selected: #1D222C;
      --tab-item-border-color-selected: #2C72E0;
    }

    .tab-item {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--tab-item-background);
      color: var(--tab-item-text-color);
      font-size: var(--tab-item-font-size);
      line-height: var(--tab-item-line-height);
      font-weight: var(--tab-item-font-weight);
      text-decoration: none;
      position: relative;
      outline: none;
      user-select: none;
      transition: all 0.2s ease-in-out;
      border: none;
    }

    /* Ghost type styles */
    :host([type="ghost"]) .tab-item {
      padding: 10px 12px;
    }

    :host([type="ghost"][orientation="vertical"]) .tab-item {
      padding: 16px;
    }

    :host([type="ghost"]) .tab-item:hover:not(.selected):not(.disabled) {
      background: var(--tab-item-background-hover);
    }

    :host([type="ghost"]) .tab-item.selected .content {
      border-left: 3px solid var(--tab-item-border-color-selected);
      padding-left: 13px; /* 16px - 3px border */
    }

    :host([type="ghost"][orientation="horizontal"]) .tab-item.selected .content {
      border-left: none;
      border-bottom: 3px solid var(--tab-item-border-color-selected);
      padding-left: 0;
      padding-bottom: 7px; /* 10px - 3px border */
    }

    /* Line type styles */
    :host([type="line"]) .tab-item {
      padding: 8px 16px 12px;
      border-bottom: 1px solid var(--tab-item-border-color);
    }

    :host([type="line"][orientation="vertical"]) .tab-item {
      padding: 16px;
      border-bottom: none;
      border-left: 1px solid var(--tab-item-border-color);
    }

    :host([type="line"]) .tab-item:hover:not(.selected):not(.disabled) {
      background: var(--tab-item-background-hover);
      border-bottom-color: var(--tab-item-border-color-hover);
      border-bottom-width: 2px;
      padding-bottom: 11px; /* Adjust for thicker border */
    }

    :host([type="line"][orientation="vertical"]) .tab-item:hover:not(.selected):not(.disabled) {
      border-left-color: var(--tab-item-border-color-hover);
      border-left-width: 2px;
      border-bottom: none;
      padding-bottom: 12px;
      padding-left: 15px; /* Adjust for thicker border */
    }

    :host([type="line"]) .tab-item.selected {
      border-bottom: 3px solid var(--tab-item-border-color-selected);
      padding-bottom: 9px; /* Adjust for thicker border */
    }

    :host([type="line"][orientation="vertical"]) .tab-item.selected {
      border-left: 3px solid var(--tab-item-border-color-selected);
      border-bottom: none;
      padding-left: 13px; /* Adjust for thicker border */
      padding-bottom: 12px;
    }

    /* Pill type styles */
    :host([type="pill"]) .tab-item {
      padding: 10px 16px;
      border-radius: 8px;
    }

    :host([type="pill"][orientation="vertical"]) .tab-item {
      padding: 12px 16px;
    }

    :host([type="pill"]) .tab-item:hover:not(.selected):not(.disabled) {
      background: var(--tab-item-background-hover);
    }

    :host([type="pill"]) .tab-item.selected {
      background: var(--tab-item-background-selected);
    }

    /* Selected state text and icon colors */
    .tab-item.selected {
      color: var(--tab-item-text-color-selected);
    }

    /* Disabled state */
    .tab-item.disabled {
      color: var(--tab-item-text-color-disabled);
    }

    /* Focus styles with focus ring component simulation */
    .tab-item:focus-visible {
      position: relative;
    }

    .tab-item:focus-visible::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      border: 2px solid var(--tab-item-focus-ring-color);
      border-radius: 12px;
      pointer-events: none;
    }

    :host([type="line"][orientation="horizontal"]) .tab-item:focus-visible::before {
      border-radius: 12px 12px 0px 0px;
    }

    :host([type="line"][orientation="vertical"]) .tab-item:focus-visible::before {
      border-radius: 0px 12px 12px 0px;
    }

    .content {
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease-in-out;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .icon dive-icon {
      color: var(--tab-item-icon-color);
    }

    .tab-item.selected .icon dive-icon {
      color: var(--tab-item-icon-color-selected);
    }

    .tab-item.disabled .icon dive-icon {
      color: var(--tab-item-icon-color-disabled);
    }

    .text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: var(--tab-item-font-family);
      font-size: var(--tab-item-font-size);
      line-height: var(--tab-item-line-height);
      font-weight: var(--tab-item-font-weight);
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `;

  /**
   * The orientation of the tab item.
   */
  // @ts-ignore
  @property({ reflect: true })
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * The visual style variant of the tab item.
   */
  // @ts-ignore
  @property({ reflect: true })
  type: 'ghost' | 'line' | 'pill' = 'line';

  /**
   * The color theme of the tab item.
   */
  // @ts-ignore
  @property({ reflect: true })
  color: 'base' | 'primary' = 'base';

  /**
   * The text content of the tab item.
   */
  // @ts-ignore
  @property()
  text = '';

  /**
   * The left icon to display before the text.
   */
  // @ts-ignore
  @property({ attribute: 'left-icon' })
  leftIcon = '';

  /**
   * The right icon to display after the text.
   */
  // @ts-ignore
  @property({ attribute: 'right-icon' })
  rightIcon = '';

  /**
   * Whether to show the left icon.
   */
  // @ts-ignore
  @property({ type: Boolean, attribute: 'show-left-icon' })
  showLeftIcon = false;

  /**
   * Whether to show the right icon.
   */
  // @ts-ignore
  @property({ type: Boolean, attribute: 'show-right-icon' })
  showRightIcon = false;

  /**
   * Whether the tab item is selected.
   */
  // @ts-ignore
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * Whether the tab item is disabled.
   */
  // @ts-ignore
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * The ARIA label for accessibility.
   */
  // @ts-ignore
  @property({ attribute: 'aria-label' })
  ariaLabel = '';

  /**
   * The ARIA controls attribute for accessibility.
   */
  // @ts-ignore
  @property({ attribute: 'aria-controls' })
  ariaControls = '';

  /**
   * The tab index for keyboard navigation.
   */
  // @ts-ignore
  @property({ type: Number, attribute: 'tabindex' })
  tabIndex = 0;

  /**
   * The ARIA role for accessibility.
   */
  // @ts-ignore
  @property()
  role = 'tab';

  private _handleClick = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(new CustomEvent('tab-click', {
      detail: {
        text: this.text,
        leftIcon: this.leftIcon,
        rightIcon: this.rightIcon,
        selected: this.selected,
        orientation: this.orientation,
        type: this.type,
        color: this.color
      },
      bubbles: true,
      composed: true
    }));

    if (!this.selected) {
      this.dispatchEvent(new CustomEvent('tab-select', {
        detail: {
          text: this.text,
          leftIcon: this.leftIcon,
          rightIcon: this.rightIcon,
          orientation: this.orientation,
          type: this.type,
          color: this.color
        },
        bubbles: true,
        composed: true
      }));
    }
  };

  private _handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._handleClick(event);
    }
  };

  render() {
    const classes = {
      'tab-item': true,
      selected: this.selected,
      disabled: this.disabled
    };

    return html`
      <div
        class=${classMap(classes)}
        role=${this.role}
        aria-selected=${this.selected ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label=${ifDefined(this.ariaLabel || undefined)}
        aria-controls=${ifDefined(this.ariaControls || undefined)}
        tabindex=${this.disabled ? '-1' : this.tabIndex}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >
        <div class="content">
          ${this.showLeftIcon && this.leftIcon ? html`
            <div class="icon">
              <dive-icon name=${this.leftIcon}></dive-icon>
            </div>
          ` : ''}
          <div class="text">
            ${this.text || html`<slot></slot>`}
          </div>
          ${this.showRightIcon && this.rightIcon ? html`
            <div class="icon">
              <dive-icon name=${this.rightIcon}></dive-icon>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

 
declare global {
  interface HTMLElementTagNameMap {
    'dive-tab-item': DiveTabItem;
  }
} 