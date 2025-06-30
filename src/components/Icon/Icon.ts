import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/**
 * Icon Component
 * 
 * A Web Component for displaying Tabler Icons using official SVG content.
 * 
 * **Current Implementation**: Static SVG map with content copied from @tabler/icons package.
 * **Available Icons**: check, home, user, heart, star, settings, x, plus, minus,
 *                     chevron-right, chevron-left, chevron-up, chevron-down, 
 *                     alert-triangle, info-circle
 * **Future**: Will migrate to dynamic loading for unlimited icon access.
 * 
 * @element dive-icon
 * 
 * @fires icon-error - Fired when icon fails to load
 * @fires icon-click - Fired when interactive icon is clicked
 * 
 * @example
 * ```html
 * <dive-icon name="check" size="medium" color="primary"></dive-icon>
 * <dive-icon name="heart" size="large" interactive></dive-icon>
 * ```
 */
@customElement('dive-icon')
export class DiveIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .icon-container svg {
      display: block;
    }

    /* Size variants */
    :host([size="small"]) .icon-container svg {
      width: 16px;
      height: 16px;
    }

    :host([size="medium"]) .icon-container svg {
      width: 24px;
      height: 24px;
    }

    :host([size="large"]) .icon-container svg {
      width: 32px;
      height: 32px;
    }

    :host([size="xlarge"]) .icon-container svg {
      width: 48px;
      height: 48px;
    }

    /* Color variants */
    :host([color="base"]) .icon-container svg {
      color: var(--Color-Base-Foreground-default, #1d222c);
    }

    :host([color="primary"]) .icon-container svg {
      color: var(--Color-Primary-Primary-Background-default, #2c72e0);
    }

    :host([color="success"]) .icon-container svg {
      color: var(--Color-Success-Primary-Background-default, #058900);
    }

    :host([color="warning"]) .icon-container svg {
      color: var(--Color-Warning-Primary-Background-default, #cc4e00);
    }

    :host([color="error"]) .icon-container svg {
      color: var(--Color-Error-Primary-Background-default, #ea0d11);
    }

    :host([color="info"]) .icon-container svg {
      color: var(--Color-Info-Primary-Background-default, #007bba);
    }

    /* Loading state */
    :host([loading]) .icon-container svg {
      opacity: 0.5;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 0.8; }
    }

    /* Error state */
    :host([error]) .icon-container {
      color: var(--Color-Error-Primary-Background-default, #ef4444);
    }

    /* Interactive states */
    :host([interactive]) {
      cursor: pointer;
      border-radius: var(--border-border-radius-sm, 4px);
      padding: 0.25rem;
      margin: -0.25rem;
      transition: background-color 0.2s ease;
    }

    :host([interactive]:hover) {
      background-color: var(--Color-Base-Subtle-Background-hover, #c7cad1);
    }

    :host([interactive]:active) {
      background-color: var(--Color-Base-Subtle-Background-active, #a1a7b3);
    }

    :host([interactive]:focus-visible) {
      outline: 2px solid var(--Color-Primary-Primary-Background-default, #2c72e0);
      outline-offset: 2px;
    }

    /* Accessibility */
    :host([aria-hidden="true"]) {
      pointer-events: none;
    }

    /* Error fallback */
    .error-fallback {
      width: 24px;
      height: 24px;
      background: var(--Color-Error-Primary-Background-default, #ef4444);
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: white;
      font-weight: bold;
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .icon-container svg {
        stroke-width: 2.5;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      :host([loading]) .icon-container svg {
        animation: none;
        opacity: 0.7;
      }
    }
  `;

  /** Name of the Tabler icon (without .svg extension) */
  @property({ type: String, reflect: true })
  name!: string;

  /** Size variant of the icon */
  @property({ type: String, reflect: true })
  size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';

  /** Color variant of the icon */
  @property({ type: String, reflect: true })
  color?: 'base' | 'primary' | 'success' | 'warning' | 'error' | 'info';

  /** Whether the icon is in loading state */
  @property({ type: Boolean, reflect: true })
  loading: boolean = false;

  /** Whether the icon failed to load */
  @property({ type: Boolean, reflect: true })
  error: boolean = false;

  /** Whether the icon is interactive (clickable) */
  @property({ type: Boolean, reflect: true })
  interactive: boolean = false;

  /** ARIA label for accessibility */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

  /** Whether the icon is decorative (hidden from screen readers) */
  @property({ type: String, attribute: 'aria-hidden' })
  ariaHidden: string | null = null;

  /** Cached SVG content */
  private _svgContent: string = '';

  connectedCallback() {
    super.connectedCallback();
    
    // Set up accessibility attributes
    if (!this.ariaLabel && !this.ariaHidden) {
      this.ariaHidden = 'true'; // Default to decorative
    }
    
    if (this.interactive) {
      this.setAttribute('tabindex', '0');
      this.setAttribute('role', 'button');
    }

    // Load the icon
    this._loadIcon();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    
    if (changedProperties.has('name')) {
      this._loadIcon();
    }
  }

  private async _loadIcon() {
    if (!this.name) {
      this.error = true;
      return;
    }

    try {
      this.loading = true;
      this.error = false;

      // Get SVG content from our static map
      const svgContent = await this._getIconSvg(this.name);
      
      if (svgContent) {
        this._svgContent = svgContent;
        this.loading = false;
        this.requestUpdate();
      } else {
        throw new Error(`Icon "${this.name}" not found`);
      }
    } catch (error) {
      console.error('Failed to load icon:', this.name, error);
      this.error = true;
      this.loading = false;
      
      this.dispatchEvent(new CustomEvent('icon-error', {
        detail: { name: this.name, error },
        bubbles: true,
        composed: true
      }));
    }
  }

  private async _getIconSvg(iconName: string): Promise<string> {
    // Official Tabler Icons SVG structure - using the actual format from the package
    // TODO: Replace with dynamic import from @tabler/icons package for better scalability
    const iconSvgs: Record<string, string> = {
      'check': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-check"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M5 12l5 5l10 -10" />
      </svg>`,
      
      'home': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-home"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M5 12l-2 0l9 -9l9 9l-2 0l0 7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
      </svg>`,
      
      'user': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-user"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
      </svg>`,
      
      'heart': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-heart"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.566" />
      </svg>`,

      'star': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-star"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
      </svg>`,

      'settings': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      </svg>`,

      'x': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-x"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>`,

      'plus': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-plus"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 5l0 14" />
        <path d="M5 12l14 0" />
      </svg>`,

      'minus': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-minus"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M5 12l14 0" />
      </svg>`,

      'chevron-right': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 6l6 6l-6 6" />
      </svg>`,

      'chevron-left': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M15 6l-6 6l6 6" />
      </svg>`,

      'chevron-up': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-up"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M6 15l6 -6l6 6" />
      </svg>`,

      'chevron-down': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M6 9l6 6l6 -6" />
      </svg>`,

      'alert-triangle': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 9v4" />
        <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
        <path d="M12 16h.01" />
      </svg>`,

      'info-circle': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
        <path d="M12 9h.01" />
        <path d="M11 12h1v4h1" />
      </svg>`,

      'scuba-mask': `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-scuba-mask"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 7h12a1 1 0 0 1 1 1v4.5a2.5 2.5 0 0 1 -2.5 2.5h-.5a2 2 0 0 1 -2 -2a2 2 0 1 0 -4 0a2 2 0 0 1 -2 2h-.5a2.5 2.5 0 0 1 -2.5 -2.5v-4.5a1 1 0 0 1 1 -1z" />
        <path d="M10 17a2 2 0 0 0 2 2h3.5a5.5 5.5 0 0 0 5.5 -5.5v-9.5" />
      </svg>`
    };
    
    return iconSvgs[iconName] || '';
  }

  private _handleClick(event: Event) {
    if (!this.interactive) return;
    
    this.dispatchEvent(new CustomEvent('icon-click', {
      detail: {
        name: this.name,
        size: this.size,
        color: this.color
      },
      bubbles: true,
      composed: true
    }));
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (!this.interactive) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._handleClick(event);
    }
  }

  render() {
    if (!this.name) {
      return html`<div class="error-fallback">?</div>`;
    }

    if (this.error) {
      return html`<div class="error-fallback">!</div>`;
    }

    if (this.loading || !this._svgContent) {
      return html`<div class="icon-container">Loading...</div>`;
    }

    return html`
      <div 
        class="icon-container"
        aria-hidden=${ifDefined(this.ariaHidden)}
        aria-label=${ifDefined(this.ariaLabel)}
        role=${this.ariaLabel ? 'img' : 'presentation'}
        @click=${this.interactive ? this._handleClick : undefined}
        @keydown=${this.interactive ? this._handleKeyDown : undefined}
        tabindex=${this.interactive ? '0' : undefined}
      >
        ${unsafeHTML(this._svgContent)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dive-icon': DiveIcon;
  }
}
