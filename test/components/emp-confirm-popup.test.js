import { html, fixture, expect } from '@open-wc/testing';
import '../../src/components/ui/emp-confirm-popup.js';

describe('EmployeeConfirmPopup', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`
      <emp-confirm-popup
        .title=${'Test Title'}
        .message=${'Test Message'}
        .type=${'delete'}
      ></emp-confirm-popup>
    `);

    expect(el.shadowRoot.querySelector('.popup-title').textContent).to.equal('Test Title');
    expect(el.shadowRoot.querySelector('.popup-content').textContent.trim()).to.equal('Test Message');
  });

  it('emits confirm event when confirm button is clicked', async () => {
    const el = await fixture(html`<emp-confirm-popup></emp-confirm-popup>`);
    
    let confirmCalled = false;
    el.addEventListener('confirm', () => confirmCalled = true);
    
    el.shadowRoot.querySelector('.confirm-button').click();
    expect(confirmCalled).to.be.true;
  });

  it('emits cancel event when cancel button is clicked', async () => {
    const el = await fixture(html`<emp-confirm-popup></emp-confirm-popup>`);
    
    let cancelCalled = false;
    el.addEventListener('cancel', () => cancelCalled = true);
    
    el.shadowRoot.querySelector('.cancel-button').click();
    expect(cancelCalled).to.be.true;
  });
}); 