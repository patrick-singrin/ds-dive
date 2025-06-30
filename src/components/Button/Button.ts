import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * Button Component
 * 
 * A comprehensive button implementation based on the Figma design system.
 * Supports all design variants with optional icon display.
 * 
 * @element dive-button
 * @slot - Default slot for custom content
 * 
 * @fires button-click - Fired when button is clicked
 * 
 * @example
 * ```html
 * <dive-button 
 *   type="primary" 
 *   variant="filled"
 *   size="default"
 *   text="Save Changes"
 *   icon="check"
 *   ?show-icon="true">
 * </dive-button>
 * ```
 */
@customElement('dive-button')
export class DiveButton extends LitElement {
  static styles = css`
    /* CSS Custom Properties - Inherit from design tokens */
    :host {
      /* Base color tokens - Using proper Figma design tokens */
      /* No custom variables needed - using Figma tokens directly */
      
      /* Primary color tokens */
      --button-primary-background-default: var(--Color-Primary-Primary-Background-default, #2c72e0);
      --button-primary-background-hover: var(--Color-Primary-Primary-Background-hover, #245db8);
      --button-primary-background-active: var(--Color-Primary-Primary-Background-active, #2053a4);
      --button-primary-background-disabled: var(--Color-Primary-Primary-Background-disabled, #a1a7b3);
      
      --button-primary-foreground-default: var(--Color-Primary-Primary-Foreground-default, #ffffff);
      --button-primary-foreground-hover: var(--Color-Primary-Primary-Foreground-hover, #ffffff);
      --button-primary-foreground-active: var(--Color-Primary-Primary-Foreground-active, #ffffff);
      --button-primary-foreground-disabled: var(--Color-Primary-Primary-Foreground-disabled, #ecedf0);
      
      --button-primary-border-default: var(--Color-Primary-Primary-Border-default, #2c72e0);
      --button-primary-border-hover: var(--Color-Primary-Primary-Border-hover, #245db8);
      --button-primary-border-active: var(--Color-Primary-Primary-Border-active, #2053a4);
      --button-primary-border-disabled: var(--Color-Primary-Primary-Border-disabled, #a1a7b3);
      
      /* Destructive color tokens */
      --button-destructive-background-default: var(--Color-Error-Primary-Background-default, #ea0d11);
      --button-destructive-background-hover: var(--Color-Error-Primary-Background-hover, #c00b0e);
      --button-destructive-background-active: var(--Color-Error-Primary-Background-active, #ab090c);
      --button-destructive-background-disabled: var(--Color-Error-Primary-Background-disabled, #a1a7b3);
      
      --button-destructive-foreground-default: var(--Color-Error-Primary-Foreground-default, #ffffff);
      --button-destructive-foreground-hover: var(--Color-Error-Primary-Foreground-hover, #ffffff);
      --button-destructive-foreground-active: var(--Color-Error-Primary-Foreground-active, #ffffff);
      --button-destructive-foreground-disabled: var(--Color-Error-Primary-Foreground-disabled, #ecedf0);
      
      --button-destructive-border-default: var(--Color-Error-Primary-Border-default, #ee3d41);
      --button-destructive-border-hover: var(--Color-Error-Primary-Border-hover, #ea0d11);
      --button-destructive-border-active: var(--Color-Error-Primary-Border-active, #c00b0e);
      --button-destructive-border-disabled: var(--Color-Error-Primary-Border-disabled, #a1a7b3);
      
      /* Focus colors - Always use primary color for consistency */
      --button-focus-color: var(--Color-Brand-Primary-Background-default, #0066cc);
      
      /* Spacing tokens */
      --button-padding-small: calc(var(--Spacing-1, 4) * 1px) calc(var(--Spacing-4, 16) * 1px);
      --button-padding-default: calc(var(--Spacing-2, 10) * 1px) calc(var(--Spacing-4, 16) * 1px);
      
      --button-gap: calc(var(--Spacing-2, 8) * 1px);
      
      /* Border radius */
      --button-border-radius: calc(var(--border-border-radius-md, 8) * 1px);
      
      /* Typography */
      --button-font-family: var(--font-family-primary, 'Atkinson Hyperlegible Next', -apple-system, BlinkMacSystemFont, sans-serif);
      
      /* TODO: Replace with proper Figma typography tokens once exported */
      /* TEMPORARY: These should be replaced with design system typography tokens */
      --button-font-size: 16px;                /* TODO: Replace with --Typography-Body-Medium-FontSize */
      --button-font-weight: 400;               /* TODO: Replace with --Typography-Body-Medium-FontWeight */
      --button-line-height: 24px;              /* TODO: Replace with --Typography-Body-Medium-LineHeight */
      
      /* TODO: Replace with proper Figma small text tokens once exported */
      --button-font-size-small: 14px;          /* TODO: Replace with --Typography-Body-Small-FontSize */
      --button-line-height-small: 20px;        /* TODO: Replace with --Typography-Body-Small-LineHeight */
      
      /* Component defaults */
      display: inline-flex;
      position: relative;
      box-sizing: border-box;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--button-gap);
      
      border-radius: var(--button-border-radius);
      border: 1px solid;
      
      font-family: var(--button-font-family);
      font-size: var(--button-font-size);
      font-weight: var(--button-font-weight);
      line-height: var(--button-line-height);
      
      cursor: pointer;
      user-select: none;
      text-decoration: none;
      box-sizing: border-box;
      
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      
      /* Remove default button styles */
      outline: none;
      background: none;
      
      /* Ensure consistent height */
      min-height: fit-content;
    }

    /* Size variants */
    .button--small {
      padding: var(--button-padding-small);
      font-size: var(--button-font-size-small);
      line-height: var(--button-line-height-small);
    }

    .button--default {
      padding: var(--button-padding-default);
    }

    /* Base type styles - Using proper Figma design tokens */
    .button--base.button--filled {
      background: var(--Color-Base-Primary-Background-default, #242a37);
      color: var(--Color-Base-Primary-Foreground-default, #ffffff);
      border-color: var(--Color-Base-Primary-Background-default, #242a37);
    }

    .button--base.button--filled:hover:not(.button--disabled) {
      background: var(--Color-Base-Primary-Background-hover, #31394a);
      color: var(--Color-Base-Primary-Foreground-hover, #ffffff);
      border-color: var(--Color-Base-Primary-Background-hover, #31394a);
    }

    .button--base.button--filled:active:not(.button--disabled) {
      background: var(--Color-Base-Primary-Background-active, #374054);
      color: var(--Color-Base-Primary-Foreground-active, #ffffff);
      border-color: var(--Color-Base-Primary-Background-active, #374054);
    }

    .button--base.button--outline {
      background: transparent;
      color: var(--Color-Base-Foreground-default, #1d222c);
      border-color: var(--Color-Base-Border-default, #c7cad1);
    }

    .button--base.button--outline:hover:not(.button--disabled) {
      background: var(--Color-Base-Subtle-Background-hover, #ecedf0);
      color: var(--Color-Base-Foreground-hover, #1d222c);
      border-color: var(--Color-Base-Border-hover, #a1a7b3);
    }

    .button--base.button--outline:active:not(.button--disabled) {
      background: var(--Color-Base-Subtle-Background-active, #c7cad1);
      color: var(--Color-Base-Foreground-active, #1d222c);
      border-color: var(--Color-Base-Border-active, #7b8394);
    }

    .button--base.button--ghost {
      background: transparent;
      color: var(--Color-Base-Foreground-default, #1d222c);
      border-color: transparent;
    }

    .button--base.button--ghost:hover:not(.button--disabled) {
      background: var(--Color-Base-Subtle-Background-hover, #ecedf0);
      color: var(--Color-Base-Foreground-hover, #1d222c);
      border-color: transparent;
    }

    .button--base.button--ghost:active:not(.button--disabled) {
      background: var(--Color-Base-Subtle-Background-active, #c7cad1);
      color: var(--Color-Base-Foreground-active, #1d222c);
      border-color: transparent;
    }

    /* Primary type styles */
    .button--primary.button--filled {
      background: var(--button-primary-background-default);
      color: var(--button-primary-foreground-default);
      border-color: var(--button-primary-background-default);
    }

    .button--primary.button--filled:hover:not(.button--disabled) {
      background: var(--button-primary-background-hover);
      color: var(--button-primary-foreground-hover);
      border-color: var(--button-primary-background-hover);
    }

    .button--primary.button--filled:active:not(.button--disabled) {
      background: var(--button-primary-background-active);
      color: var(--button-primary-foreground-active);
      border-color: var(--button-primary-background-active);
    }

    .button--primary.button--outline {
      background: transparent;
      color: var(--button-primary-background-default);
      border-color: var(--button-primary-border-default);
    }

    .button--primary.button--outline:hover:not(.button--disabled) {
      background: var(--Color-Primary-Subtle-Background-hover, #eaf1fc);
      color: var(--button-primary-background-hover);
      border-color: var(--button-primary-border-hover);
    }

    .button--primary.button--outline:active:not(.button--disabled) {
      background: var(--Color-Primary-Subtle-Background-active, #c0d5f6);
      color: var(--button-primary-background-active);
      border-color: var(--button-primary-border-active);
    }

    .button--primary.button--ghost {
      background: transparent;
      color: var(--button-primary-background-default);
      border-color: transparent;
    }

    .button--primary.button--ghost:hover:not(.button--disabled) {
      background: var(--Color-Primary-Subtle-Background-hover, #eaf1fc);
      color: var(--button-primary-background-hover);
      border-color: transparent;
    }

    .button--primary.button--ghost:active:not(.button--disabled) {
      background: var(--Color-Primary-Subtle-Background-active, #c0d5f6);
      color: var(--button-primary-background-active);
      border-color: transparent;
    }

    /* Destructive type styles */
    .button--destructive.button--filled {
      background: var(--button-destructive-background-default);
      color: var(--button-destructive-foreground-default);
      border-color: var(--button-destructive-background-default);
    }

    .button--destructive.button--filled:hover:not(.button--disabled) {
      background: var(--button-destructive-background-hover);
      color: var(--button-destructive-foreground-hover);
      border-color: var(--button-destructive-background-hover);
    }

    .button--destructive.button--filled:active:not(.button--disabled) {
      background: var(--button-destructive-background-active);
      color: var(--button-destructive-foreground-active);
      border-color: var(--button-destructive-background-active);
    }

    .button--destructive.button--outline {
      background: transparent;
      color: var(--button-destructive-background-default);
      border-color: var(--button-destructive-border-default);
    }

    .button--destructive.button--outline:hover:not(.button--disabled) {
      background: var(--Color-Error-Subtle-Background-hover, #fde7e7);
      color: var(--button-destructive-background-hover);
      border-color: var(--button-destructive-border-hover);
    }

    .button--destructive.button--outline:active:not(.button--disabled) {
      background: var(--Color-Error-Subtle-Background-active, #f9b6b8);
      color: var(--button-destructive-background-active);
      border-color: var(--button-destructive-border-active);
    }

    .button--destructive.button--ghost {
      background: transparent;
      color: var(--button-destructive-background-default);
      border-color: transparent;
    }

    .button--destructive.button--ghost:hover:not(.button--disabled) {
      background: var(--Color-Error-Subtle-Background-hover, #fde7e7);
      color: var(--button-destructive-background-hover);
      border-color: transparent;
    }

    .button--destructive.button--ghost:active:not(.button--disabled) {
      background: var(--Color-Error-Subtle-Background-active, #f9b6b8);
      color: var(--button-destructive-background-active);
      border-color: transparent;
    }

    /* Disabled state */
    .button--disabled {
      background: var(--Color-Base-Primary-Background-disabled, #a1a7b3) !important;
      color: var(--Color-Base-Primary-Foreground-disabled, #ecedf0) !important;
      border-color: var(--Color-Base-Border-disabled, #c7cad1) !important;
      cursor: not-allowed;
      opacity: 0.6;
    }

    /* Focus states - Always primary color for all button types */
    .button:focus-visible {
      outline: 1px solid var(--button-focus-color);
      outline-offset: 2px;
    }

    /* Icon container */
    .button__icon {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      line-height: 24px; /* Match text line-height and icon size */
    }

    /* Small button icon adjustments */
    .button--small .button__icon {
      width: 20px;
      height: 20px;
      line-height: 20px; /* Match small button line-height */
    }

    /* Hide icon when show-icon is false */
    :host(:not([show-icon])) .button__icon {
      display: none;
    }

    /* Text content */
    .button__text {
      white-space: nowrap;
      line-height: var(--button-line-height); /* Use Figma-specified 24px line-height */
      display: inline-flex;
      align-items: center;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .button {
        border-width: 2px;
      }
      
      .button:focus-visible {
        outline-width: 3px;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .button {
        transition: none;
      }
    }
  `;

  /** Button type variant */
  @property({ type: String, reflect: true })
  type: 'base' | 'primary' | 'destructive' = 'base';

  /** Button variant style */
  @property({ type: String, reflect: true })
  variant: 'filled' | 'outline' | 'ghost' = 'filled';

  /** Button size variant */
  @property({ type: String, reflect: true })
  size: 'small' | 'default' = 'default';

  /** Button text content */
  @property({ type: String })
  text: string = '';

  /** Icon name from Tabler Icons */
  @property({ type: String })
  icon: string = 'scuba-mask';

  /** Whether to show the icon */
  @property({ type: Boolean, reflect: true, attribute: 'show-icon' })
  showIcon: boolean = true;

  /** Whether the button is disabled */
  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  /** ARIA label for accessibility */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

  /** Component role for accessibility */
  @property({ type: String })
  role: string = 'button';

  protected willUpdate(changedProperties: PropertyValueMap<this>) {
    super.willUpdate(changedProperties);
    
    // Update ARIA attributes based on component state
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', String(this.disabled));
    }
  }

  private _handleClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('button-click', {
      detail: {
        type: this.type,
        variant: this.variant,
        size: this.size,
        text: this.text,
        showIcon: this.showIcon
      },
      bubbles: true,
      composed: true
    }));
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (this.disabled) {
      return;
    }

    // Handle Enter and Space key activation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._handleClick(event);
    }
  }

  render() {
    const classes = {
      button: true,
      [`button--${this.type}`]: true,
      [`button--${this.variant}`]: true,
      [`button--${this.size}`]: true,
      'button--disabled': this.disabled,
    };

    return html`
      <button
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        aria-label=${ifDefined(this.ariaLabel || this.text)}
        role=${this.role}
        tabindex=${this.disabled ? '-1' : '0'}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >
        ${this.showIcon && this.icon ? html`
          <div class="button__icon">
            <dive-icon name="${this.icon}" size="${this.size === 'small' ? 'small' : 'medium'}" aria-hidden="true"></dive-icon>
          </div>
        ` : ''}
        
        ${this.text ? html`<span class="button__text">${this.text}</span>` : ''}
        
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dive-button': DiveButton;
  }
} 