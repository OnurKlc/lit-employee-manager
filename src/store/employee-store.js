class EmployeeStore {
  constructor() {
    // Try to load existing data from localStorage
    const savedEmployees = localStorage.getItem('employees');
    this._employees = savedEmployees ? JSON.parse(savedEmployees) : [];
    this._listeners = new Set();
    
    // Initialize with sample data if empty
    if (this._employees.length === 0) {
      this.initializeWithSampleData();
    }
  }

  getEmployees() {
    return [...this._employees];
  }

  addEmployee(employee) {
    console.log('Adding employee:', employee); // Debug log
    employee.id = Date.now().toString();
    this._employees.push(employee);
    this._saveToLocalStorage();
    this._notifyListeners();
  }

  updateEmployee(updatedEmployee) {
    const index = this._employees.findIndex(emp => emp.id === updatedEmployee.id);
    if (index !== -1) {
      this._employees[index] = updatedEmployee;
      this._saveToLocalStorage();
      this._notifyListeners();
    }
  }

  deleteEmployee(id) {
    this._employees = this._employees.filter(emp => emp.id !== id);
    this._saveToLocalStorage();
    this._notifyListeners();
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notifyListeners() {
    console.log('Notifying listeners with:', this._employees); // Debug log
    this._listeners.forEach(listener => listener(this.getEmployees()));
  }

  _saveToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(this._employees));
  }

  initializeWithSampleData() {
    const sampleEmployees = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2023-01-15',
        dateOfBirth: '1990-05-20',
        phoneNumber: '555-0123',
        email: 'john.doe@example.com',
        department: 'Tech',
        position: 'Senior'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfEmployment: '2023-02-01',
        dateOfBirth: '1992-08-15',
        phoneNumber: '555-0124',
        email: 'jane.smith@example.com',
        department: 'Analytics',
        position: 'Medior'
      }
    ];

    this._employees = sampleEmployees;
    this._saveToLocalStorage();
    this._notifyListeners();
  }
}

export const store = new EmployeeStore(); 