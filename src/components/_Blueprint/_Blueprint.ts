import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * Blueprint Component
 * 
 * A comprehensive reference implementation showing all design system patterns:
 * - Design token integration via CSS custom properties
 * - TypeScript property definitions with validation
 * - Accessibility implementation (WCAG 2.1 AA)
 * - Event handling and state management
 * - Responsive design patterns
 * - Testing-friendly structure
 * 
 * @element dive-blueprint
 * @slot - Default slot for content
 * @slot icon - Icon slot for leading icon
 * @slot trailing - Trailing content slot
 * 
 * @fires blueprint-click - Fired when component is clicked
 * @fires blueprint-change - Fired when internal state changes
 * 
 * @example
 * ```html
 * <dive-blueprint 
 *   variant="primary" 
 *   size="medium"
 *   text="Hello World"
 *   ?disabled="false">
 * </dive-blueprint>
 * ```
 */
@customElement('dive-blueprint')
export class DiveBlueprint extends LitElement {
  static styles = css`
    /* CSS Custom Properties - Inherit from design tokens */
    :host {
      /* Color tokens */
      --blueprint-background-default: var(--Color-Primary-Primary-Background-default, #2c72e0);
      --blueprint-background-hover: var(--Color-Primary-Primary-Background-hover, #245db8);
      --blueprint-background-active: var(--Color-Primary-Primary-Background-active, #2053a4);
      --blueprint-background-disabled: var(--Color-Base-Background-disabled, #a1a7b3);
      
      --blueprint-foreground-default: var(--Color-Primary-Primary-Foreground-default, #ffffff);
      --blueprint-foreground-hover: var(--Color-Primary-Primary-Foreground-hover, #ffffff);
      --blueprint-foreground-active: var(--Color-Primary-Primary-Foreground-active, #ffffff);
      --blueprint-foreground-disabled: var(--Color-Base-Foreground-disabled, #a1a7b3);
      
      --blueprint-border-default: var(--Color-Primary-Primary-Border-default, transparent);
      --blueprint-border-hover: var(--Color-Primary-Primary-Border-hover, transparent);
      --blueprint-border-active: var(--Color-Primary-Primary-Border-active, transparent);
      --blueprint-border-disabled: var(--Color-Base-Border-disabled, #c7cad1);
      
      /* Spacing tokens - More reasonable button padding */
      --blueprint-padding-small: calc(var(--Spacing-2, 8) * 1px) calc(var(--Spacing-4, 12) * 1px);
      --blueprint-padding-medium: calc(var(--Spacing-3, 10) * 1px) calc(var(--Spacing-5, 16) * 1px);
      --blueprint-padding-large: calc(var(--Spacing-4, 12) * 1px) calc(var(--Spacing-6, 20) * 1px);
      
      --blueprint-gap: calc(var(--Spacing-2, 8) * 1px);
      
      /* Border radius */
      --blueprint-border-radius: calc(var(--border-border-radius-md, 8) * 1px);
      
      /* Typography fallbacks */
      --blueprint-font-family: var(--font-family-primary, 'Atkinson Hyperlegible Next', -apple-system, BlinkMacSystemFont, sans-serif);
      
      /* Typography */
      --blueprint-font-size-small: 14px;
      --blueprint-font-size-medium: 16px;
      --blueprint-font-size-large: 18px;
      --blueprint-font-weight: 500;
      --blueprint-line-height: 1.43;
      
      /* Component defaults */
      display: inline-flex;
      position: relative;
      box-sizing: border-box;
    }

    .blueprint {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--blueprint-gap);
      
      background: var(--blueprint-background-default);
      color: var(--blueprint-foreground-default);
      border: 1px solid var(--blueprint-border-default);
      border-radius: var(--blueprint-border-radius);
      
      font-size: var(--blueprint-font-size-medium);
      font-weight: var(--blueprint-font-weight);
      line-height: var(--blueprint-line-height);
      
      cursor: pointer;
      user-select: none;
      text-decoration: none;
      
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      
      /* Typography */
      font-family: var(--blueprint-font-family);
      
      /* Remove default button styles */
      outline: none;
    }

    /* Size variants */
    .blueprint--small {
      padding: var(--blueprint-padding-small);
      font-size: var(--blueprint-font-size-small);
    }

    .blueprint--medium {
      padding: var(--blueprint-padding-medium);
      font-size: var(--blueprint-font-size-medium);
    }

    .blueprint--large {
      padding: var(--blueprint-padding-large);
      font-size: var(--blueprint-font-size-large);
    }

    /* Interactive states */
    .blueprint:hover:not(.blueprint--disabled) {
      background: var(--blueprint-background-hover);
      color: var(--blueprint-foreground-hover);
      border-color: var(--blueprint-border-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    }

    .blueprint:active:not(.blueprint--disabled),
    .blueprint--pressed {
      background: var(--blueprint-background-active);
      color: var(--blueprint-foreground-active);
      border-color: var(--blueprint-border-active);
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    }

    .blueprint:focus-visible {
      outline: 2px solid var(--Color-Primary-Primary-Background-default, #2c72e0);
      outline-offset: 2px;
    }

    .blueprint--disabled {
      background: var(--blueprint-background-disabled);
      color: var(--blueprint-foreground-disabled);
      border-color: var(--blueprint-border-disabled);
      cursor: not-allowed;
      opacity: 0.6;
      transform: none;
      box-shadow: none;
    }

    /* Loading state */
    .blueprint--loading {
      cursor: wait;
      position: relative;
    }

    .blueprint--loading::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Variant styles */
    .blueprint--secondary {
      --blueprint-background-default: var(--Color-Base-Subtle-Background-default, #ecedf0);
      --blueprint-background-hover: var(--Color-Base-Subtle-Background-hover, #c7cad1);
      --blueprint-background-active: var(--Color-Base-Subtle-Background-active, #a1a7b3);
      
      --blueprint-foreground-default: var(--Color-Base-Subtle-Foreground-default, #31394a);
      --blueprint-foreground-hover: var(--Color-Base-Subtle-Foreground-hover, #31394a);
      --blueprint-foreground-active: var(--Color-Base-Subtle-Foreground-active, #1d222c);
    }

    .blueprint--ghost {
      --blueprint-background-default: transparent;
      --blueprint-background-hover: var(--Color-Base-Subtle-Background-hover, #c7cad1);
      --blueprint-background-active: var(--Color-Base-Subtle-Background-active, #a1a7b3);
      
      --blueprint-foreground-default: var(--Color-Primary-Primary-Background-default, #2c72e0);
      --blueprint-foreground-hover: var(--Color-Primary-Primary-Background-hover, #245db8);
      --blueprint-foreground-active: var(--Color-Primary-Primary-Background-active, #2053a4);
      
      --blueprint-border-default: var(--Color-Primary-Primary-Background-default, #2c72e0);
      --blueprint-border-hover: var(--Color-Primary-Primary-Background-hover, #245db8);
      --blueprint-border-active: var(--Color-Primary-Primary-Background-active, #2053a4);
    }

    /* Icon styles - now handled by dive-icon component */

    /* Responsive design */
    @media (max-width: 768px) {
      .blueprint--large {
        padding: var(--blueprint-padding-medium);
        font-size: var(--blueprint-font-size-medium);
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .blueprint {
        border-width: 2px;
      }
      
      .blueprint:focus-visible {
        outline-width: 3px;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .blueprint {
        transition: none;
      }
    }
  `;

  /** Visual variant of the component */
  @property({ type: String, reflect: true })
  variant: 'primary' | 'secondary' | 'ghost' = 'primary';

  /** Size variant of the component */
  @property({ type: String, reflect: true })
  size: 'small' | 'medium' | 'large' = 'medium';

  /** Text content of the component */
  @property({ type: String })
  text: string = '';

  /** Icon name from Tabler Icons */
  @property({ type: String })
  icon?: string;

  /** Whether the component is disabled */
  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  /** Whether the component is in loading state */
  @property({ type: Boolean, reflect: true })
  loading: boolean = false;

  /** Whether the component is pressed/active */
  @property({ type: Boolean, reflect: true })
  pressed: boolean = false;

  /** ARIA label for accessibility */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

  /** ARIA described by reference */
  @property({ type: String, attribute: 'aria-describedby' })
  ariaDescribedBy: string | null = null;

  /** Component role for accessibility */
  @property({ type: String })
  role: string = 'button';

  /** Internal state for demonstration */
  @state()
  private _clickCount: number = 0;

  protected willUpdate(changedProperties: PropertyValueMap<this>) {
    super.willUpdate(changedProperties);
    
    // Update ARIA attributes based on component state
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', String(this.disabled));
    }
    
    if (changedProperties.has('loading')) {
      this.setAttribute('aria-busy', String(this.loading));
    }
  }

  private _handleClick(event: Event) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this._clickCount++;
    
    // Dispatch custom events
    this.dispatchEvent(new CustomEvent('blueprint-click', {
      detail: {
        clickCount: this._clickCount,
        variant: this.variant,
        size: this.size
      },
      bubbles: true,
      composed: true
    }));

    this.dispatchEvent(new CustomEvent('blueprint-change', {
      detail: {
        clickCount: this._clickCount
      },
      bubbles: true,
      composed: true
    }));
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (this.disabled || this.loading) {
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
      blueprint: true,
      [`blueprint--${this.variant}`]: true,
      [`blueprint--${this.size}`]: true,
      'blueprint--disabled': this.disabled,
      'blueprint--loading': this.loading,
      'blueprint--pressed': this.pressed,
    };

    return html`
      <button
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        aria-label=${ifDefined(this.ariaLabel || this.text)}
        aria-describedby=${ifDefined(this.ariaDescribedBy)}
        role=${this.role}
        tabindex=${this.disabled ? '-1' : '0'}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >
        ${this.icon ? html`
          <slot name="icon">
            <dive-icon name="${this.icon}" size="medium" aria-hidden="true"></dive-icon>
          </slot>
        ` : ''}
        
        ${this.text ? html`<span>${this.text}</span>` : ''}
        
        <slot></slot>
        
        <slot name="trailing"></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dive-blueprint': DiveBlueprint;
  }
}
