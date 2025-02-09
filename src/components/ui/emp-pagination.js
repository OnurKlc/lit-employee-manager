import { LitElement, html, css } from 'lit';

export class EmployeePagination extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number }
  };

  static styles = css`
    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      background: none;
      cursor: pointer;
      border-radius: 4px;
    }

    button.active {
      background-color: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  render() {
    const pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    return html`
      <div class="pagination">
        <button 
          ?disabled=${this.currentPage === 1}
          @click=${() => this._emitPageChange(this.currentPage - 1)}
        >
          ←
        </button>
        ${pages.map(page => html`
          <button
            class=${this.currentPage === page ? 'active' : ''}
            @click=${() => this._emitPageChange(page)}
          >
            ${page}
          </button>
        `)}
        <button 
          ?disabled=${this.currentPage === this.totalPages}
          @click=${() => this._emitPageChange(this.currentPage + 1)}
        >
          →
        </button>
      </div>
    `;
  }

  _emitPageChange(page) {
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('emp-pagination', EmployeePagination); 