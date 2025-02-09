const translations = {
  en: {
    common: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close'
    },
    nav: {
      employees: 'Employees',
      departments: 'Departments',
      reports: 'Reports',
      addNew: 'Add New'
    },
    list: {
      title: 'Employee List',
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfEmployment: 'Date of Employment',
      dateOfBirth: 'Date of Birth',
      phone: 'Phone',
      email: 'Email',
      department: 'Department',
      position: 'Position',
      actions: 'Actions',
      tableView: 'Table View',
      listView: 'List View',
      searchPlaceholder: 'Search employees...',
      showing: 'Showing',
      of: 'of',
      noResults: 'No employees found'
    },
    form: {
      addTitle: 'Add New Employee',
      editTitle: 'Edit Employee',
      cancel: 'Cancel',
      save: 'Save',
      update: 'Update',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid 10-digit phone number (e.g., 5301234567)',
      confirmAdd: 'Are you sure you want to add this employee?',
      confirmUpdate: 'Are you sure you want to update {name}\'s information?',
      addSuccess: 'Employee added successfully',
      updateSuccess: 'Employee updated successfully',
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfEmployment: 'Date of Employment',
      dateOfBirth: 'Date of Birth',
      phoneNumber: 'Phone Number',
      email: 'Email',
      department: 'Department',
      position: 'Position'
    },
    delete: {
      title: 'Delete Employee',
      confirm: 'Are you sure you want to delete {name}?',
      cancel: 'Cancel',
      delete: 'Delete',
      success: 'Employee deleted successfully'
    },
    departments: {
      analytics: 'Analytics',
      tech: 'Tech'
    },
    positions: {
      junior: 'Junior',
      medior: 'Medior',
      senior: 'Senior'
    }
  },
  tr: {
    common: {
      cancel: 'İptal',
      confirm: 'Onayla',
      close: 'Kapat'
    },
    nav: {
      employees: 'Çalışanlar',
      departments: 'Departmanlar',
      reports: 'Raporlar',
      addNew: 'Yeni Ekle'
    },
    list: {
      title: 'Çalışan Listesi',
      firstName: 'Ad',
      lastName: 'Soyad',
      dateOfEmployment: 'İşe Başlama Tarihi',
      dateOfBirth: 'Doğum Tarihi',
      phone: 'Telefon',
      email: 'E-posta',
      department: 'Departman',
      position: 'Pozisyon',
      actions: 'İşlemler',
      tableView: 'Tablo Görünümü',
      listView: 'Liste Görünümü',
      searchPlaceholder: 'Çalışan ara...',
      showing: 'Gösterilen',
      of: '/',
      noResults: 'Çalışan bulunamadı'
    },
    form: {
      addTitle: 'Yeni Çalışan Ekle',
      editTitle: 'Çalışan Düzenle',
      cancel: 'İptal',
      save: 'Kaydet',
      update: 'Güncelle',
      required: 'Bu alan zorunludur',
      invalidEmail: 'Lütfen geçerli bir e-posta adresi girin',
      invalidPhone: 'Lütfen geçerli bir 10 haneli telefon numarası girin (örn: 5301234567)',
      confirmAdd: 'Bu çalışanı eklemek istediğinizden emin misiniz?',
      confirmUpdate: '{name} bilgilerini güncellemek istediğinizden emin misiniz?',
      addSuccess: 'Çalışan başarıyla eklendi',
      updateSuccess: 'Çalışan başarıyla güncellendi',
      firstName: 'Ad',
      lastName: 'Soyad',
      dateOfEmployment: 'İşe Başlama Tarihi',
      dateOfBirth: 'Doğum Tarihi',
      phoneNumber: 'Telefon',
      email: 'E-posta',
      department: 'Departman',
      position: 'Pozisyon'
    },
    delete: {
      title: 'Kaydı Sil',
      confirm: '{name} kaydını silmek istediğinizden emin misiniz?',
      cancel: 'İptal',
      delete: 'Sil',
      success: 'Çalışan başarıyla silindi'
    },
    departments: {
      analytics: 'Analitik',
      tech: 'Teknoloji'
    },
    positions: {
      junior: 'Junior',
      medior: 'Medior',
      senior: 'Senior'
    }
  }
};

class TranslationService {
  constructor() {
    this._lang = document.documentElement.lang || 'en';
    this._listeners = new Set();
    
    // Watch for language changes in the HTML element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'lang') {
          this._lang = document.documentElement.lang || 'en';
          this._notifyListeners();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });
  }

  get currentLanguage() {
    return this._lang;
  }

  setLanguage(lang) {
    if (translations[lang]) {
      document.documentElement.lang = lang;
      this._lang = lang;
      this._notifyListeners();
    }
  }

  translate(key) {
    const keys = key.split('.');
    let value = translations[this._lang];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return value;
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notifyListeners() {
    this._listeners.forEach(listener => listener(this._lang));
  }
}

export const i18n = new TranslationService(); 