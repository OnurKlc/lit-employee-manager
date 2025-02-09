import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { store } from '../store/employee-store.js';
import { i18n } from '../services/translations.js';
import '../components/ui/emp-pagination.js';
import '../components/ui/emp-confirm-popup.js';

export class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    filteredEmployees: { type: Array },
    currentPage: { type: Number },
    searchQuery: { type: String },
    itemsPerPage: { type: Number },
    selectedEmployees: { type: Array },
    showDeletePopup: { type: Boolean },
    employeeToDelete: { type: Object },
    lang: { type: String },
    viewMode: { type: String },
    showSearch: { type: Boolean },
    isCompactView: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      background-color: #f8f9fa;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      color: var(--primary-color);
      font-size: 24px;
      margin: 0;
    }

    .view-controls {
      display: flex;
      gap: 0.5rem;
    }

    .view-button {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .view-button img {
      width: 24px;
      height: 24px;
      opacity: 0.6;
      transition: filter 0.2s;
    }

    .view-button.active {
      background-color: var(--primary-color);
      color: white;
    }

    .view-button.active img {
      filter: brightness(0) invert(1);
      opacity: 1;
    }

    table {
      width: 100%;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    th {
      text-align: left;
      padding: 1rem;
      color: var(--primary-color);
      font-weight: normal;
      border-bottom: 1px solid #eee;
    }

    td {
      padding: 1rem;
      color: #666;
      border-bottom: 1px solid #eee;
    }

    .checkbox-cell {
      width: 40px;
      text-align: center;
    }

    .actions-cell {
      text-align: center;
      white-space: nowrap;
      width: 100px;
    }

    td.actions-cell {
      padding: 0.5rem;
    }

    .action-button {
      display: inline-block;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      vertical-align: middle;
      min-width: 24px;
      height: 24px;
      color: var(--primary-color);
    }

    .action-button img {
      width: 20px;
      height: 20px;
      color: var(--primary-color);
      vertical-align: middle;
    }

    .edit-icon {
      stroke: var(--primary-color);
    }

    .trash-icon {
      stroke: var(--primary-color);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      padding: 1rem;
    }

    .page-button {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      min-width: 2.5rem;
      text-align: center;
    }

    .page-button:hover {
      background: #f8f9fa;
    }

    .page-button.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
    }

    .page-button:disabled {
      background: #f8f9fa;
      color: #999;
      cursor: not-allowed;
    }

    .page-info {
      color: #666;
      font-size: 0.875rem;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #FF6B00;
      font-weight: bold;
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .add-new {
      background-color: #FF6B00;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .language-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .popup {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      width: 400px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .popup-title {
      font-size: 20px;
      color: #333;
      margin: 0;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      color: #666;
      cursor: pointer;
      padding: 0;
    }

    .popup-content {
      color: #666;
      margin-bottom: 2rem;
    }

    .popup-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .popup-actions button {
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }

    .cancel-button {
      background-color: #f8f9fa;
      color: #666;
    }

    .delete-confirm-button {
      background-color: #FF6B00;
      color: white;
    }

    /* List view styles */
    .employee-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .employee-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1.5rem;
      align-items: center;
    }

    .employee-checkbox {
      display: flex;
      align-items: center;
    }

    .employee-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .info-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-label {
      font-size: 0.875rem;
      color: #666;
    }

    .info-value {
      font-weight: 500;
    }

    .employee-actions {
      display: flex;
      gap: 0.5rem;
    }

    .search-container {
      position: relative;
      display: flex;
      align-items: center;
      margin: 1rem 0;
    }

    .search-icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      color: var(--text-color);
      margin-left: auto;
    }

    .search-bar {
      position: absolute;
      right: 0;
      width: 0;
      overflow: hidden;
      transition: width 0.3s ease-in-out;
      background: white;
      border-radius: 4px;
    }

    .search-bar.show {
      width: 100%;
    }

    .search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .employee-card {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .employee-actions {
        justify-content: flex-end;
      }
    }
  `;

  constructor() {
    super();
    this.employees = store.getEmployees();
    this.filteredEmployees = [...this.employees];
    this.currentPage = 1;
    this.searchQuery = '';
    this.itemsPerPage = 10;
    this.selectedEmployees = [];
    this.showDeletePopup = false;
    this.employeeToDelete = null;
    this.lang = i18n.currentLanguage;
    this.viewMode = localStorage.getItem('viewMode') || 'table';
    this.showSearch = false;
    this.isCompactView = window.innerWidth < 1110;
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleViewportChange = this._handleViewportChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribeStore = store.subscribe(updatedEmployees => {
      console.log('Store updated:', updatedEmployees);
      this.employees = updatedEmployees;
      this.filterEmployees();
    });

    this.employees = store.getEmployees();
    this.filterEmployees();

    this.unsubscribeI18n = i18n.subscribe(lang => {
      this.lang = lang;
      this.requestUpdate();
    });

    document.addEventListener('click', this._handleClickOutside);
    document.addEventListener('keydown', this._handleKeyDown);
    window.addEventListener('resize', this._handleViewportChange);
    this._handleViewportChange(); // Initial check
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeStore?.();
    this.unsubscribeI18n?.();
    document.removeEventListener('click', this._handleClickOutside);
    document.removeEventListener('keydown', this._handleKeyDown);
    window.removeEventListener('resize', this._handleViewportChange);
  }

  _handleClickOutside(event) {
    const searchContainer = this.shadowRoot.querySelector('.search-container');
    const searchInput = this.shadowRoot.querySelector('.search-input');
    const searchIcon = this.shadowRoot.querySelector('.search-icon');
    
    if (event.composedPath().includes(searchContainer) || 
        event.composedPath().includes(searchIcon)) {
      return;
    }
    
    if (this.showSearch && 
        !this.searchQuery && 
        document.activeElement !== searchInput) {
      this.showSearch = false;
    }
  }

  _handleKeyDown(event) {
    if (event.key === 'Escape' && this.showSearch) {
      this.showSearch = false;
      this.searchQuery = ''; // Clear search when ESC is pressed
      const searchInput = this.shadowRoot.querySelector('.search-input');
      if (searchInput) {
        searchInput.blur(); // Remove focus
      }
    }
  }

  _handleViewportChange() {
    const isCompact = window.innerWidth < 1110;
    if (isCompact !== this.isCompactView) {
      this.isCompactView = isCompact;
      if (isCompact && this.viewMode === 'table') {
        this.toggleView('list');
      }
    }
  }

  toggleView(mode) {
    this.viewMode = mode;
    localStorage.setItem('viewMode', mode);
  }

  filterEmployees() {
    let filtered = [...this.employees];
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query)
      );
    }

    this.filteredEmployees = filtered;
    this.currentPage = 1; // Reset to first page when filtering
    this.requestUpdate();
  }

  handleSearch(e) {
    this.searchQuery = e.target.value;
    if (this.searchQuery) {
      this.showSearch = true; // Ensure search bar stays visible when there's a query
    }
    this.filterEmployees();
  }

  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  get currentPageEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredEmployees.slice(start, end);
  }

  setPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  render() {
    const t = key => i18n.translate(key);

    return html`
      <div class="header">
        <h1>${t('list.title')}</h1>
        <div class="view-controls">
          <button 
            class="view-button ${this.viewMode === 'table' ? 'active' : ''}"
            @click=${() => this.toggleView('table')}
            title=${t('list.tableView')}
          >
            <img src="/src/assets/table.svg" alt="table" class="table-icon">
          </button>
          <button 
            class="view-button ${this.viewMode === 'list' ? 'active' : ''}"
            @click=${() => this.toggleView('list')}
            title=${t('list.listView')}
          >
            <img src="/src/assets/list.svg" alt="list" class="list-icon">
          </button>
        </div>
      </div>

      <div class="search-container">
        <img 
          src="/src/assets/search.svg" 
          alt="search" 
          class="search-icon"
          @click=${this.toggleSearch}
        >
        <div class="search-bar ${this.showSearch ? 'show' : ''}">
          <input 
            type="text"
            class="search-input"
            .value=${this.searchQuery}
            @input=${this.handleSearch}
            placeholder=${t('list.searchPlaceholder')}
          >
        </div>
      </div>

      ${this.viewMode === 'table' ? this.renderTable() : this.renderList()}
      <emp-pagination
        .currentPage=${this.currentPage}
        .totalPages=${this.totalPages}
        @page-change=${e => this.setPage(e.detail.page)}
      ></emp-pagination>
      ${this.showDeletePopup ? html`
        <emp-confirm-popup
          .title=${t('delete.title')}
          .message=${t('delete.confirm').replace('{name}', `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}`)}
          .type=${`delete`}
          .confirmText=${t('delete.delete')}
          .cancelText=${t('delete.cancel')}
          .employee=${this.employeeToDelete}
          @confirm=${this.confirmDelete}
          @cancel=${this.closeDeletePopup}
        ></emp-confirm-popup>
      ` : ''}
    `;
  }

  renderTable() {
    const t = key => i18n.translate(key);

    if (this.filteredEmployees.length === 0) {
      return html`
        <div class="no-results">
          ${t('list.noResults')}
        </div>
      `;
    }

    return html`
      <table>
        <thead>
          <tr>
            <th class="checkbox-cell">
              <input type="checkbox" @change=${this.toggleAllEmployees}>
            </th>
            <th>${t('list.firstName')}</th>
            <th>${t('list.lastName')}</th>
            <th>${t('list.dateOfEmployment')}</th>
            <th>${t('list.dateOfBirth')}</th>
            <th>${t('list.phone')}</th>
            <th>${t('list.email')}</th>
            <th>${t('list.department')}</th>
            <th>${t('list.position')}</th>
            <th class="actions-cell">${t('list.actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${this.currentPageEmployees.map(emp => html`
            <tr>
              <td class="checkbox-cell">
                <input 
                  type="checkbox"
                  .checked=${this.selectedEmployees.includes(emp.id)}
                  @change=${e => this.toggleEmployee(e, emp.id)}
                >
              </td>
              <td>${emp.firstName}</td>
              <td>${emp.lastName}</td>
              <td>${emp.dateOfEmployment}</td>
              <td>${emp.dateOfBirth}</td>
              <td>${emp.phoneNumber}</td>
              <td>${emp.email}</td>
              <td>${t(`departments.${emp.department.toLowerCase()}`)}</td>
              <td>${t(`positions.${emp.position.toLowerCase()}`)}</td>
              <td class="actions-cell">
                <button class="action-button" @click=${() => this.editEmployee(emp.id)}>
                  <img src="/src/assets/edit.svg" alt="edit" class="edit-icon">
                </button>
                <button class="action-button delete-button" @click=${() => this.deleteEmployee(emp.id)}>
                  <img src="/src/assets/trash.svg" alt="delete" class="trash-icon">
                </button>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  renderList() {
    const t = key => i18n.translate(key);

    if (this.filteredEmployees.length === 0) {
      return html`
        <div class="no-results">
          ${t('list.noResults')}
        </div>
      `;
    }

    return html`
      <div class="employee-list">
        ${this.currentPageEmployees.map(emp => html`
          <div class="employee-card">
            <div class="employee-checkbox">
              <input 
                type="checkbox"
                .checked=${this.selectedEmployees.includes(emp.id)}
                @change=${e => this.toggleEmployee(e, emp.id)}
              >
            </div>
            <div class="employee-info">
              <div class="info-group">
                <span class="info-label">${t('list.firstName')}</span>
                <span class="info-value">${emp.firstName}</span>
              </div>
              <div class="info-group">
                <span class="info-label">${t('list.lastName')}</span>
                <span class="info-value">${emp.lastName}</span>
              </div>
              <div class="info-group">
                <span class="info-label">${t('list.dateOfEmployment')}</span>
                <span class="info-value">${emp.dateOfEmployment}</span>
              </div>
              <div class="info-group">
                <span class="info-label">${t('list.dateOfBirth')}</span>
                <span class="info-value">${emp.dateOfBirth}</span>
              </div>
              <div class="info-group">
                <span class="info-label">${t('list.phone')}</span>
                <span class="info-value">${emp.phoneNumber}</span>
              </div>
              <div class="info-group">
                <span class="info-label">${t('list.email')}</span>
                <span class="info-value">${emp.email}</span>
              </div>
              <div class="info-group">
                <span class="info-label">${t('list.department')}</span>
                <span class="info-value">${t(`departments.${emp.department.toLowerCase()}`)}</span>
              </div>
              <div class="info-group">
                <span class="info-label">${t('list.position')}</span>
                <span class="info-value">${t(`positions.${emp.position.toLowerCase()}`)}</span>
              </div>
            </div>
            <div class="employee-actions">
              <button class="action-button" @click=${() => this.editEmployee(emp.id)}>
                <img src="/src/assets/edit.svg" alt="edit" class="edit-icon">
              </button>
              <button class="action-button delete-button" @click=${() => this.deleteEmployee(emp.id)}>
                <img src="/src/assets/trash.svg" alt="delete" class="trash-icon">
              </button>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  toggleAllEmployees(e) {
    if (e.target.checked) {
      this.selectedEmployees = this.employees.map(emp => emp.id);
    } else {
      this.selectedEmployees = [];
    }
  }

  toggleEmployee(e, id) {
    if (e.target.checked) {
      this.selectedEmployees = [...this.selectedEmployees, id];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(empId => empId !== id);
    }
  }

  editEmployee(id) {
    Router.go(`/edit/${id}`);
  }

  deleteEmployee(id) {
    const employee = this.employees.find(emp => emp.id === id);
    this.employeeToDelete = employee;
    this.showDeletePopup = true;
  }

  confirmDelete() {
    if (this.employeeToDelete) {
      store.deleteEmployee(this.employeeToDelete.id);
      this.closeDeletePopup();
    }
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
    this.employeeToDelete = null;
  }

  toggleSearch(e) {
    e.stopPropagation(); // Prevent immediate closing when clicking the search icon
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      // Focus the input when opening
      setTimeout(() => {
        const input = this.shadowRoot.querySelector('.search-input');
        if (input) input.focus();
      }, 100);
    }
  }
}

customElements.define('emp-list', EmployeeList); 