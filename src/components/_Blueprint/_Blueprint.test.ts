import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import '../_Blueprint/_Blueprint';
import type { DiveBlueprint } from '../_Blueprint/_Blueprint';

describe('DiveBlueprint', () => {
  let element: DiveBlueprint;

  beforeEach(async () => {
    element = await fixture<DiveBlueprint>(html`
      <dive-blueprint text="Test Button"></dive-blueprint>
    `);
  });

  it('should render with default properties', () => {
    expect(element).to.exist;
    expect(element.variant).to.equal('primary');
    expect(element.size).to.equal('medium');
    expect(element.text).to.equal('Test Button');
    expect(element.disabled).to.be.false;
  });

  it('should have correct ARIA attributes', () => {
    const button = element.shadowRoot?.querySelector('button');
    expect(button).to.exist;
    expect(button?.getAttribute('role')).to.equal('button');
    expect(button?.getAttribute('aria-label')).to.equal('Test Button');
  });

  it('should apply variant classes correctly', async () => {
    element.variant = 'secondary';
    await element.updateComplete;
    
    const button = element.shadowRoot?.querySelector('button');
    expect(button?.classList.contains('blueprint--secondary')).to.be.true;
  });

  it('should handle disabled state', async () => {
    element.disabled = true;
    await element.updateComplete;
    
    const button = element.shadowRoot?.querySelector('button');
    expect(button?.disabled).to.be.true;
    expect(button?.getAttribute('aria-disabled')).to.equal('true');
    expect(button?.classList.contains('blueprint--disabled')).to.be.true;
  });

  it('should emit events on click', async () => {
    let eventFired = false;
    let eventDetail: any = null;

    element.addEventListener('blueprint-click', (e: any) => {
      eventFired = true;
      eventDetail = e.detail;
    });

    const button = element.shadowRoot?.querySelector('button');
    button?.click();

    expect(eventFired).to.be.true;
    expect(eventDetail).to.have.property('clickCount', 1);
    expect(eventDetail).to.have.property('variant', 'primary');
  });

  it('should not emit events when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener('blueprint-click', () => {
      eventFired = true;
    });

    const button = element.shadowRoot?.querySelector('button');
    button?.click();

    expect(eventFired).to.be.false;
  });

  it('should handle keyboard navigation', async () => {
    let eventFired = false;
    element.addEventListener('blueprint-click', () => {
      eventFired = true;
    });

    const button = element.shadowRoot?.querySelector('button');
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    button?.dispatchEvent(enterEvent);

    expect(eventFired).to.be.true;
  });

  it('should apply loading state correctly', async () => {
    element.loading = true;
    await element.updateComplete;
    
    const button = element.shadowRoot?.querySelector('button');
    expect(button?.classList.contains('blueprint--loading')).to.be.true;
    expect(button?.getAttribute('aria-busy')).to.equal('true');
  });

  it('should render icon when provided', async () => {
    element.icon = 'check';
    await element.updateComplete;
    
    const icon = element.shadowRoot?.querySelector('.blueprint__icon');
    expect(icon).to.exist;
  });

  it('should be accessible', () => {
    expect(element).toBeAccessible();
  });
});
