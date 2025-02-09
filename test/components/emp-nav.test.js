import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../src/components/layout/emp-nav.js';
import { Router } from '@vaadin/router';

describe('EmployeeNav', () => {
  let element;

  beforeEach(async () => {
    // Stub Router.go to prevent actual navigation
    stub(Router, 'go');
    element = await fixture(html`<emp-nav></emp-nav>`);
  });

  afterEach(() => {
    Router.go.restore();
  });

  it('renders with default state', () => {
    const logo = element.shadowRoot.querySelector('.logo-section');
    expect(logo).to.exist;
    expect(logo.textContent.trim()).to.equal('ING');
  });

  it('toggles menu on mobile', async () => {
    const menuButton = element.shadowRoot.querySelector('.menu-toggle');
    const navActions = element.shadowRoot.querySelector('.nav-actions');
    
    expect(navActions.classList.contains('show')).to.be.false;
    
    menuButton.click();
    await element.updateComplete;
    
    expect(navActions.classList.contains('show')).to.be.true;
  });

  it('changes language', async () => {
    const flagButton = element.shadowRoot.querySelector('.flag-button');
    const initialLang = element.lang;
    
    flagButton.click();
    await element.updateComplete;
    
    expect(element.lang).to.not.equal(initialLang);
  });

  it('handles navigation correctly', async () => {
    const employeesLink = element.shadowRoot.querySelector('a[href="/"]');
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });
    
    employeesLink.dispatchEvent(event);
    await element.updateComplete;
    
    expect(Router.go.calledWith('/')).to.be.true;
  });

  it('closes menu after navigation', async () => {
    element.menuOpen = true;
    await element.updateComplete;
    
    const employeesLink = element.shadowRoot.querySelector('a[href="/"]');
    const event = new Event('click');
    event.preventDefault = () => {};
    
    employeesLink.dispatchEvent(event);
    await element.updateComplete;
    
    expect(element.menuOpen).to.be.false;
  });
}); 