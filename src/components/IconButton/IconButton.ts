import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../Icon/Icon.js';

/**
 * Icon Button component for Dive Design System
 * 
 * A button component that displays only an icon, following Figma design tokens.
 * Supports three types (base, primary, destructive) and three variants (filled, outline, ghost).
 * 
 * @element dive-icon-button
 * @fires click - Fired when button is clicked
 * @fires focus - Fired when button receives focus
 * @fires blur - Fired when button loses focus
 */
@customElement('dive-icon-button')
export class DiveIconButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      --button-size: 44px;
      --icon-size: 24px;
      --border-radius: 8px;
    }

    .icon-button {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--button-size);
      height: var(--button-size);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
      position: relative;
      box-sizing: border-box;
    }

    .icon-button:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }

    .icon-button:focus-visible {
      outline: 1px solid var(--Color-Brand-Primary-Background-default, #0066cc);
      outline-offset: 2px;
    }

    /* Base type styles */
    .icon-button--base.icon-button--filled {
      background: var(--Color-Base-Primary-Background-default, #242a37);
      color: var(--Color-Base-Primary-Foreground-default, #ffffff);
    }

    .icon-button--base.icon-button--filled:hover:not(:disabled) {
      background: var(--Color-Base-Primary-Background-hover, #31394a);
    }

    .icon-button--base.icon-button--filled:active:not(:disabled) {
      background: var(--Color-Base-Primary-Background-active, #374054);
    }

    .icon-button--base.icon-button--outline {
      background: transparent;
      border-color: var(--Color-Base-Border-default, #c7cad1);
      color: var(--Color-Base-Foreground-default, #1d222c);
    }

    .icon-button--base.icon-button--outline:hover:not(:disabled) {
      background: var(--Color-Base-Subtle-Background-hover, #ecedf0);
      color: var(--Color-Base-Foreground-hover, #1d222c);
      border-color: var(--Color-Base-Border-hover, #a1a7b3);
    }

    .icon-button--base.icon-button--outline:active:not(:disabled) {
      background: var(--Color-Base-Subtle-Background-active, #c7cad1);
      color: var(--Color-Base-Foreground-active, #1d222c);
      border-color: var(--Color-Base-Border-active, #7b8394);
    }

    .icon-button--base.icon-button--ghost {
      background: transparent;
      color: var(--Color-Base-Foreground-default, #1d222c);
    }

    .icon-button--base.icon-button--ghost:hover:not(:disabled) {
      background: var(--Color-Base-Subtle-Background-hover, #ecedf0);
      color: var(--Color-Base-Foreground-hover, #1d222c);
    }

    .icon-button--base.icon-button--ghost:active:not(:disabled) {
      background: var(--Color-Base-Subtle-Background-active, #c7cad1);
      color: var(--Color-Base-Foreground-active, #1d222c);
    }

    /* Primary type styles */
    .icon-button--primary.icon-button--filled {
      background: var(--Color-Brand-Primary-Background-default, #0066cc);
      color: var(--Color-Brand-Primary-Foreground-default, #ffffff);
    }

    .icon-button--primary.icon-button--filled:hover:not(:disabled) {
      background: var(--Color-Brand-Primary-Background-hover, #0052a3);
    }

    .icon-button--primary.icon-button--filled:active:not(:disabled) {
      background: var(--Color-Brand-Primary-Background-active, #003d7a);
    }

    .icon-button--primary.icon-button--outline {
      background: transparent;
      border-color: var(--Color-Brand-Primary-Background-default, #0066cc);
      color: var(--Color-Brand-Primary-Background-default, #0066cc);
    }

    .icon-button--primary.icon-button--outline:hover:not(:disabled) {
      background: var(--Color-Primary-Subtle-Background-hover, #eaf1fc);
      color: var(--Color-Brand-Primary-Background-hover, #0052a3);
      border-color: var(--Color-Brand-Primary-Background-default, #0066cc);
    }

    .icon-button--primary.icon-button--outline:active:not(:disabled) {
      background: var(--Color-Primary-Subtle-Background-active, #c0d5f6);
      color: var(--Color-Brand-Primary-Background-active, #003d7a);
      border-color: var(--Color-Brand-Primary-Background-active, #003d7a);
    }

    .icon-button--primary.icon-button--ghost {
      background: transparent;
      color: var(--Color-Brand-Primary-Background-default, #0066cc);
    }

    .icon-button--primary.icon-button--ghost:hover:not(:disabled) {
      background: var(--Color-Primary-Subtle-Background-hover, #eaf1fc);
      color: var(--Color-Brand-Primary-Background-hover, #0052a3);
    }

    .icon-button--primary.icon-button--ghost:active:not(:disabled) {
      background: var(--Color-Primary-Subtle-Background-active, #c0d5f6);
      color: var(--Color-Brand-Primary-Background-active, #003d7a);
    }

    /* Destructive type styles */
    .icon-button--destructive.icon-button--filled {
      background: var(--Color-Status-Error-Background-default, #dc2626);
      color: var(--Color-Status-Error-Foreground-default, #ffffff);
    }

    .icon-button--destructive.icon-button--filled:hover:not(:disabled) {
      background: var(--Color-Status-Error-Background-hover, #b91c1c);
    }

    .icon-button--destructive.icon-button--filled:active:not(:disabled) {
      background: var(--Color-Status-Error-Background-active, #991b1b);
    }

    .icon-button--destructive.icon-button--outline {
      background: transparent;
      border-color: var(--Color-Status-Error-Background-default, #dc2626);
      color: var(--Color-Status-Error-Background-default, #dc2626);
    }

    .icon-button--destructive.icon-button--outline:hover:not(:disabled) {
      background: var(--Color-Error-Subtle-Background-hover, #fde7e7);
      color: var(--Color-Status-Error-Background-hover, #b91c1c);
      border-color: var(--Color-Status-Error-Background-default, #dc2626);
    }

    .icon-button--destructive.icon-button--outline:active:not(:disabled) {
      background: var(--Color-Error-Subtle-Background-active, #f9b6b8);
      color: var(--Color-Status-Error-Background-active, #991b1b);
      border-color: var(--Color-Status-Error-Background-active, #991b1b);
    }

    .icon-button--destructive.icon-button--ghost {
      background: transparent;
      color: var(--Color-Status-Error-Background-default, #dc2626);
    }

    .icon-button--destructive.icon-button--ghost:hover:not(:disabled) {
      background: var(--Color-Error-Subtle-Background-hover, #fde7e7);
      color: var(--Color-Status-Error-Background-hover, #b91c1c);
    }

    .icon-button--destructive.icon-button--ghost:active:not(:disabled) {
      background: var(--Color-Error-Subtle-Background-active, #f9b6b8);
      color: var(--Color-Status-Error-Background-active, #991b1b);
    }

    /* Icon sizing */
    dive-icon {
      width: var(--icon-size);
      height: var(--icon-size);
    }
  `;

  /**
   * The type of button that determines the color scheme
   */
  @property({ type: String, reflect: true })
  type: 'base' | 'primary' | 'destructive' = 'base';

  /**
   * The variant of button that determines the visual style
   */
  @property({ type: String, reflect: true })
  variant: 'filled' | 'outline' | 'ghost' = 'filled';

  /**
   * The name of the icon to display
   */
  @property({ type: String, reflect: true })
  icon: string = 'scuba-mask';

  /**
   * Whether the button is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  /**
   * ARIA label for accessibility
   */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string = '';

  private _handleClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(new CustomEvent('click', {
      detail: {
        type: this.type,
        variant: this.variant,
        icon: this.icon
      },
      bubbles: true,
      composed: true
    }));
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._handleClick(event);
    }
  }

  render() {
    const classes = [
      'icon-button',
      `icon-button--${this.type}`,
      `icon-button--${this.variant}`
    ].join(' ');

    return html`
      <button
        class=${classes}
        ?disabled=${this.disabled}
        aria-label=${this.ariaLabel || `${this.type} ${this.variant} button`}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >
        <dive-icon 
          name=${this.icon} 
          size="medium"
          aria-hidden="true"
        ></dive-icon>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dive-icon-button': DiveIconButton;
  }
} 