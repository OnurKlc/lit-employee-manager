import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { store } from '../store/employee-store.js';
import { i18n } from '../services/translations.js';
import '../components/ui/emp-confirm-popup.js';

export class EmployeeForm extends LitElement {
  static properties = {
    employeeId: { type: String },
    formData: { type: Object },
    isEdit: { type: Boolean },
    lang: { type: String },
    errors: { type: Object },
    touched: { type: Object },
    showConfirmPopup: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: var(--text-color);
    }

    input, select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    input:invalid {
      border-color: #dc3545;
    }

    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    button[type="submit"] {
      background-color: var(--primary-color);
      color: white;
    }

    button[type="button"] {
      background-color: var(--secondary-color);
      color: var(--text-color);
    }

    button[type="button"]:hover {
      background-color: var(--secondary-color-dark);
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem 0.5rem;
      }
    }

    .invalid {
      border-color: var(--error-color, #dc3545) !important;
      background-color: var(--error-bg-color, #fff8f8);
    }

    .error {
      color: var(--error-color, #dc3545);
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }

    button[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
    }

    input:focus, select:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--primary-color-light);
      border-color: var(--primary-color);
    }
  `;

  constructor() {
    super();
    this.formData = {};
    this.resetForm();
    this.isEdit = false;
    this.lang = i18n.currentLanguage;
    this.errors = {};
    this.touched = {};
    this.showConfirmPopup = false;
    this.unsubscribe = i18n.subscribe(lang => {
      this.lang = lang;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  resetForm() {
    this.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      department: 'Analytics',
      position: 'Junior'
    };
  }

  connectedCallback() {
    super.connectedCallback();
    const path = window.location.pathname;
    if (path.startsWith('/edit/')) {
      this.isEdit = true;
      this.employeeId = path.split('/').pop();
      this.loadEmployeeData();
    }
  }

  loadEmployeeData() {
    const employees = store.getEmployees();
    const employee = employees.find(emp => emp.id === this.employeeId);
    if (employee) {
      console.log('Loading employee data:', employee);
      this.formData = { ...employee };
      this.requestUpdate();
    } else {
      console.error('Employee not found');
      Router.go('/');
    }
  }

  validateField(name, value) {
    const t = key => i18n.translate(key);
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() ? '' : t('form.required');
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
          ? '' 
          : t('form.invalidEmail');
      case 'phoneNumber':
        return /^\d{10}$/.test(value) 
          ? '' 
          : t('form.invalidPhone');
      case 'dateOfBirth':
        const birthDate = new Date(value);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        return age >= 18 ? '' : t('form.minimumAge');
      case 'dateOfEmployment':
        return value ? '' : t('form.required');
      case 'department':
      case 'position':
        return value ? '' : t('form.required');
      default:
        return '';
    }
  }

  handleInput(e) {
    const { id: name, value } = e.target;
    
    this.formData = {
      ...this.formData,
      [name]: value
    };

    this.touched = {
      ...this.touched,
      [name]: true
    };

    const error = this.validateField(name, value);
    this.errors = {
      ...this.errors,
      [name]: error
    };
  }

  validateForm() {
    this.touched = Object.keys(this.formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});

    const newErrors = {};
    Object.entries(this.formData).forEach(([name, value]) => {
      newErrors[name] = this.validateField(name, value);
    });

    this.errors = newErrors;
    return !Object.values(newErrors).some(error => error);
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.showConfirmPopup = true;
  }

  handleConfirm() {
    if (this.isEdit) {
      store.updateEmployee({ ...this.formData, id: this.employeeId });
    } else {
      store.addEmployee({ ...this.formData });
    }
    Router.go('/');
  }

  handleCancel() {
    this.showConfirmPopup = false;
  }

  render() {
    const t = key => i18n.translate(key);
    const showError = (fieldName) => this.touched[fieldName] && this.errors[fieldName];

    return html`
      <h2>${this.isEdit ? t('form.editTitle') : t('form.addTitle')}</h2>
      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label for="firstName">${t('form.firstName')}</label>
          <input
            type="text"
            id="firstName"
            .value=${this.formData.firstName || ''}
            @input=${this.handleInput}
            @blur=${() => this.touched.firstName = true}
            class=${showError('firstName') ? 'invalid' : ''}
            required
          >
          ${showError('firstName') ? html`
            <span class="error">${this.errors.firstName}</span>
          ` : ''}
        </div>

        <div class="form-group">
          <label for="lastName">${t('form.lastName')}</label>
          <input
            type="text"
            id="lastName"
            .value=${this.formData.lastName || ''}
            @input=${this.handleInput}
            @blur=${() => this.touched.lastName = true}
            class=${showError('lastName') ? 'invalid' : ''}
            required
          >
          ${showError('lastName') ? html`
            <span class="error">${this.errors.lastName}</span>
          ` : ''}
        </div>

        <div class="form-group">
          <label for="dateOfEmployment">${t('form.dateOfEmployment')}</label>
          <input
            type="date"
            id="dateOfEmployment"
            .value=${this.formData.dateOfEmployment || ''}
            @input=${this.handleInput}
            @blur=${() => this.touched.dateOfEmployment = true}
            class=${showError('dateOfEmployment') ? 'invalid' : ''}
            required
          >
          ${showError('dateOfEmployment') ? html`
            <span class="error">${this.errors.dateOfEmployment}</span>
          ` : ''}
        </div>

        <div class="form-group">
          <label for="dateOfBirth">${t('form.dateOfBirth')}</label>
          <input
            type="date"
            id="dateOfBirth"
            .value=${this.formData.dateOfBirth || ''}
            @input=${this.handleInput}
            @blur=${() => this.touched.dateOfBirth = true}
            class=${showError('dateOfBirth') ? 'invalid' : ''}
            required
          >
          ${showError('dateOfBirth') ? html`
            <span class="error">${this.errors.dateOfBirth}</span>
          ` : ''}
        </div>

        <div class="form-group">
          <label for="phoneNumber">${t('form.phoneNumber')}</label>
          <input
            type="tel"
            id="phoneNumber"
            .value=${this.formData.phoneNumber || ''}
            @input=${this.handleInput}
            @blur=${() => this.touched.phoneNumber = true}
            class=${showError('phoneNumber') ? 'invalid' : ''}
            pattern="[0-9]{10}"
            required
          >
          ${showError('phoneNumber') ? html`
            <span class="error">${this.errors.phoneNumber}</span>
          ` : ''}
        </div>

        <div class="form-group">
          <label for="email">${t('form.email')}</label>
          <input
            type="email"
            id="email"
            .value=${this.formData.email || ''}
            @input=${this.handleInput}
            @blur=${() => this.touched.email = true}
            class=${showError('email') ? 'invalid' : ''}
            required
          >
          ${showError('email') ? html`
            <span class="error">${this.errors.email}</span>
          ` : ''}
        </div>

        <div class="form-group">
          <label for="department">${t('form.department')}</label>
          <select
            id="department"
            .value=${this.formData.department || ''}
            @change=${this.handleInput}
            @blur=${() => this.touched.department = true}
            class=${showError('department') ? 'invalid' : ''}
            required
          >
            <option value="">${t('form.required')}</option>
            <option value="Analytics">${t('departments.analytics')}</option>
            <option value="Tech">${t('departments.tech')}</option>
          </select>
          ${showError('department') ? html`
            <span class="error">${this.errors.department}</span>
          ` : ''}
        </div>

        <div class="form-group">
          <label for="position">${t('form.position')}</label>
          <select
            id="position"
            .value=${this.formData.position || ''}
            @change=${this.handleInput}
            @blur=${() => this.touched.position = true}
            class=${showError('position') ? 'invalid' : ''}
            required
          >
            <option value="">${t('form.required')}</option>
            <option value="Junior">${t('positions.junior')}</option>
            <option value="Medior">${t('positions.medior')}</option>
            <option value="Senior">${t('positions.senior')}</option>
          </select>
          ${showError('position') ? html`
            <span class="error">${this.errors.position}</span>
          ` : ''}
        </div>

        <div class="buttons">
          <button 
            type="submit"
            ?disabled=${Object.values(this.errors).some(error => error)}
          >
            ${this.isEdit ? t('form.update') : t('form.save')}
          </button>
          <button type="button" @click=${() => Router.go('/')}>
            ${t('form.cancel')}
          </button>
        </div>
      </form>
      ${this.showConfirmPopup ? html`
        <emp-confirm-popup
          .title=${this.isEdit ? t('form.editTitle') : t('form.addTitle')}
          .message=${this.isEdit 
            ? t('form.confirmUpdate').replace('{name}', `${this.formData.firstName} ${this.formData.lastName}`)
            : t('form.confirmAdd')
          }
          .type=${this.isEdit ? 'update' : 'add'}
          .confirmText=${this.isEdit ? t('form.update') : t('form.save')}
          .cancelText=${t('form.cancel')}
          @confirm=${this.handleConfirm}
          @cancel=${this.handleCancel}
        ></emp-confirm-popup>
      ` : ''}
    `;
  }
}

customElements.define('emp-form', EmployeeForm); 