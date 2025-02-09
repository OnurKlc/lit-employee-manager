import { fixture, expect, html } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../src/pages/emp-form.js';
import { Router } from '@vaadin/router';
import { store } from '../../src/store/employee-store.js';
import { i18n } from '../../src/services/translations.js';

describe('EmployeeForm', () => {
  let element;
  const sampleEmployee = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfEmployment: '2023-01-01',
    dateOfBirth: '1990-01-01',
    phoneNumber: '5301234567',
    email: 'john@example.com',
    department: 'Analytics',
    position: 'Junior'
  };

  beforeEach(async () => {
    stub(Router, 'go');
    stub(store, 'addEmployee');
    stub(store, 'updateEmployee');
    element = await fixture(html`<emp-form></emp-form>`);
  });

  afterEach(() => {
    Router.go.restore();
    store.addEmployee.restore();
    store.updateEmployee.restore();
  });

  it('renders form fields correctly', () => {
    const inputs = element.shadowRoot.querySelectorAll('input, select');
    expect(inputs.length).to.equal(8); // All form fields
    
    const labels = element.shadowRoot.querySelectorAll('label');
    expect(labels.length).to.equal(8);
  });

  it('initializes with empty form data', () => {
    expect(element.formData).to.deep.equal({
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      department: 'Analytics',
      position: 'Junior'
    });
  });

  it('validates required fields', async () => {
    // Mark all fields as touched to show errors
    element.touched = {
      firstName: true,
      lastName: true,
      dateOfEmployment: true,
      dateOfBirth: true,
      phoneNumber: true,
      email: true,
      department: true,
      position: true
    };
    
    // Trigger validation
    element.validateForm();
    await element.updateComplete;

    const errors = element.shadowRoot.querySelectorAll('.error');
    expect(errors.length).to.be.greaterThan(0);
  });

  it('validates email format', async () => {
    const emailInput = element.shadowRoot.querySelector('#email');
    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    await element.updateComplete;

    const error = element.shadowRoot.querySelector('#email + .error');
    expect(error).to.exist;
  });

  it('validates phone number format', async () => {
    const phoneInput = element.shadowRoot.querySelector('#phoneNumber');
    phoneInput.value = '123'; // Invalid format
    phoneInput.dispatchEvent(new Event('input'));
    phoneInput.dispatchEvent(new Event('blur'));
    await element.updateComplete;

    const error = element.shadowRoot.querySelector('#phoneNumber + .error');
    expect(error).to.exist;
  });

  it('validates date of birth for minimum age', async () => {
    const currentYear = new Date().getFullYear();
    const dateInput = element.shadowRoot.querySelector('#dateOfBirth');
    dateInput.value = `${currentYear}-01-01`; // Current year = under 18
    dateInput.dispatchEvent(new Event('input'));
    dateInput.dispatchEvent(new Event('blur'));
    await element.updateComplete;

    const error = element.shadowRoot.querySelector('#dateOfBirth + .error');
    expect(error).to.exist;
  });

  it('handles form submission with valid data', async () => {
    // Fill form with valid data
    Object.entries(sampleEmployee).forEach(([id, value]) => {
      const input = element.shadowRoot.querySelector(`#${id}`);
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await element.updateComplete;

    // Submit form
    const form = element.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    await element.updateComplete;

    // Confirm via popup
    const popup = element.shadowRoot.querySelector('emp-confirm-popup');
    popup.dispatchEvent(new CustomEvent('confirm'));
    await element.updateComplete;

    expect(store.addEmployee.called).to.be.true;
    expect(Router.go.calledWith('/')).to.be.true;
  });

  it('loads existing employee data in edit mode', async () => {
    stub(store, 'getEmployees').returns([sampleEmployee]);
    
    element = await fixture(html`<emp-form></emp-form>`);
    
    // Manually set edit mode and load data
    element.isEdit = true;
    element.employeeId = '1';
    element.loadEmployeeData();
    await element.updateComplete;

    const firstNameInput = element.shadowRoot.querySelector('#firstName');
    expect(firstNameInput.value).to.equal(sampleEmployee.firstName);

    store.getEmployees.restore();
  });

  it('handles form cancellation', async () => {
    const cancelButton = element.shadowRoot.querySelector('button[type="button"]');
    cancelButton.click();
    await element.updateComplete;

    expect(Router.go.calledWith('/')).to.be.true;
  });

  it('disables submit button when form is invalid', async () => {
    // Mark all fields as touched to show errors
    element.touched = {
      firstName: true,
      lastName: true,
      dateOfEmployment: true,
      dateOfBirth: true,
      phoneNumber: true,
      email: true,
      department: true,
      position: true
    };
    
    // Trigger validation
    element.validateForm();
    await element.updateComplete;

    const submitButton = element.shadowRoot.querySelector('button[type="submit"]');
    expect(submitButton.disabled).to.be.true;

    // Fill form with valid data
    Object.entries(sampleEmployee).forEach(([id, value]) => {
      const input = element.shadowRoot.querySelector(`#${id}`);
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await element.updateComplete;

    expect(submitButton.disabled).to.be.false;
  });
}); 