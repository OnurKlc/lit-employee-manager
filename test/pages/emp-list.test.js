import { fixture, expect, html } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../src/pages/emp-list.js';
import { store } from '../../src/store/employee-store.js';
import { Router } from '@vaadin/router';

describe('EmployeeList', () => {
  let element;
  const sampleEmployee = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfEmployment: '2023-01-01',
    dateOfBirth: '1990-01-01',
    phoneNumber: '1234567890',
    email: 'john@example.com',
    department: 'Analytics',
    position: 'Junior'
  };

  beforeEach(async () => {
    stub(store, 'getEmployees').returns([sampleEmployee]);
    stub(Router, 'go');
    element = await fixture(html`<emp-list></emp-list>`);
  });

  afterEach(() => {
    store.getEmployees.restore();
    Router.go.restore();
  });

  it('renders employee data correctly', () => {
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
    
    const cells = rows[0].querySelectorAll('td');
    expect(cells[1].textContent).to.equal('John');
    expect(cells[2].textContent).to.equal('Doe');
  });

  it('handles checkbox selection', async () => {
    const checkbox = element.shadowRoot.querySelector('tbody input[type="checkbox"]');
    checkbox.click();
    await element.updateComplete;
    
    expect(element.selectedEmployees).to.include(sampleEmployee.id);
  });

  it('shows delete confirmation popup', async () => {
    const deleteButton = element.shadowRoot.querySelector('.delete-button');
    deleteButton.click();
    await element.updateComplete;
    
    const popup = element.shadowRoot.querySelector('emp-confirm-popup');
    expect(popup).to.exist;
    expect(popup.message).to.include('John Doe');
  });

  it('deletes employee when confirmed', async () => {
    const deleteStub = stub(store, 'deleteEmployee');
    
    element.employeeToDelete = sampleEmployee;
    element.showDeletePopup = true;
    await element.updateComplete;
    
    const popup = element.shadowRoot.querySelector('emp-confirm-popup');
    popup.dispatchEvent(new CustomEvent('confirm'));
    
    expect(deleteStub.calledWith(sampleEmployee.id)).to.be.true;
    deleteStub.restore();
  });

  it('navigates to edit page', async () => {
    const editButton = element.shadowRoot.querySelector('.action-button');
    editButton.click();
    await element.updateComplete;
    
    expect(Router.go.calledWith(`/edit/${sampleEmployee.id}`)).to.be.true;
  });

  it('updates when store changes', async () => {
    const newEmployee = { ...sampleEmployee, id: '2', firstName: 'Jane' };
    store.getEmployees.returns([sampleEmployee, newEmployee]);
    
    store._notifyListeners();
    await element.updateComplete;
    
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(2);
  });

  it('filters employees based on search query', async () => {
    // Set up multiple employees first
    const newEmployee = { ...sampleEmployee, id: '2', firstName: 'Jane' };
    store.getEmployees.returns([sampleEmployee, newEmployee]);
    element = await fixture(html`<emp-list></emp-list>`);
    await element.updateComplete;

    // Show search bar and perform search
    const searchIcon = element.shadowRoot.querySelector('.search-icon');
    searchIcon.click();
    await element.updateComplete;

    const searchInput = element.shadowRoot.querySelector('.search-input');
    searchInput.value = 'Jane';
    // Trigger both input and change events to ensure the search is processed
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    await element.updateComplete;

    // Wait a bit for the search to process
    await new Promise(resolve => setTimeout(resolve, 0));
    await element.updateComplete;

    // Verify results
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
    const nameCell = rows[0].querySelectorAll('td')[1];
    expect(nameCell.textContent.trim()).to.equal('Jane');
  });

  it('toggles view mode between table and list', async () => {
    const listViewButton = element.shadowRoot.querySelector('.view-button:last-child');
    listViewButton.click();
    await element.updateComplete;

    expect(element.viewMode).to.equal('list');
    let cards = element.shadowRoot.querySelectorAll('.employee-card');
    expect(cards.length).to.equal(1);

    const tableViewButton = element.shadowRoot.querySelector('.view-button:first-child');
    tableViewButton.click();
    await element.updateComplete;

    expect(element.viewMode).to.equal('table');
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
  });

  it('handles pagination', async () => {
    // Create multiple employees to test pagination
    const employees = Array.from({ length: 12 }, (_, i) => ({
      ...sampleEmployee,
      id: `${i + 1}`,
      firstName: `User${i + 1}`
    }));
    
    // Update store and component
    store.getEmployees.returns(employees);
    element = await fixture(html`<emp-list></emp-list>`);
    await element.updateComplete;

    // Verify first page
    let rows = element.viewMode === 'table' 
      ? element.shadowRoot.querySelectorAll('tbody tr')
      : element.shadowRoot.querySelectorAll('.employee-card');
    expect(rows.length).to.equal(10); // Default items per page

    // Find and click the next page button
    const pagination = element.shadowRoot.querySelector('emp-pagination');
    pagination.dispatchEvent(new CustomEvent('page-change', { 
      detail: { page: 2 },
      bubbles: true,
      composed: true 
    }));
    await element.updateComplete;

    // Verify second page
    rows = element.viewMode === 'table'
      ? element.shadowRoot.querySelectorAll('tbody tr')
      : element.shadowRoot.querySelectorAll('.employee-card');
    expect(rows.length).to.equal(2); // Remaining items
  });

  it('toggles search bar visibility', async () => {
    const searchIcon = element.shadowRoot.querySelector('.search-icon');
    
    // Open search
    searchIcon.click();
    await element.updateComplete;
    expect(element.showSearch).to.be.true;

    // Close search with Escape key
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);
    await element.updateComplete;
    expect(element.showSearch).to.be.false;
  });

  it('handles empty search results', async () => {
    store.getEmployees.returns([sampleEmployee]);
    await element.updateComplete;

    const searchInput = element.shadowRoot.querySelector('.search-input');
    searchInput.value = 'NonexistentUser';
    searchInput.dispatchEvent(new Event('input'));
    await element.updateComplete;

    const noResults = element.shadowRoot.querySelector('.no-results');
    expect(noResults).to.exist;
  });

  it('closes delete popup when cancelled', async () => {
    element.employeeToDelete = sampleEmployee;
    element.showDeletePopup = true;
    await element.updateComplete;

    const popup = element.shadowRoot.querySelector('emp-confirm-popup');
    popup.dispatchEvent(new CustomEvent('cancel'));
    await element.updateComplete;

    expect(element.showDeletePopup).to.be.false;
    expect(element.employeeToDelete).to.be.null;
  });
}); 