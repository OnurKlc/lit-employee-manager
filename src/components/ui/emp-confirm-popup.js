import { LitElement, html, css } from 'lit';
import { i18n } from '../../services/translations.js';

export class EmployeeConfirmPopup extends LitElement {
  static properties = {
    title: { type: String },
    message: { type: String },
    confirmText: { type: String },
    cancelText: { type: String },
    type: { type: String } // 'delete' | 'add' | 'update'
  };

  static styles = css`
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .popup {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      max-width: 400px;
      width: 90%;
    }

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .popup-title {
      margin: 0;
      font-size: 1.25rem;
    }

    .popup-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      justify-content: flex-end;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .confirm-button {
      color: white;
    }

    .confirm-button.delete {
      background-color: var(--error-color);
    }

    .confirm-button.add,
    .confirm-button.update {
      background-color: var(--primary-color);
    }

    .cancel-button {
      background-color: var(--secondary-color);
      color: var(--text-color);
    }
  `;

  render() {
    const t = key => i18n.translate(key);

    return html`
      <div class="popup-overlay">
        <div class="popup">
          <div class="popup-header">
            <h2 class="popup-title">${this.title}</h2>
          </div>
          <div class="popup-content">
            ${this.message}
          </div>
          <div class="popup-actions">
            <button class="cancel-button" @click=${this._handleCancel}>
              ${this.cancelText || t('common.cancel')}
            </button>
            <button class="confirm-button ${this.type}" @click=${this._handleConfirm}>
              ${this.confirmText || t('common.confirm')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _handleConfirm() {
    this.dispatchEvent(new CustomEvent('confirm', {
      bubbles: true,
      composed: true
    }));
  }

  _handleCancel() {
    this.dispatchEvent(new CustomEvent('cancel', {
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('emp-confirm-popup', EmployeeConfirmPopup); 