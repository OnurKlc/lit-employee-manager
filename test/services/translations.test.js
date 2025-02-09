import { expect } from '@open-wc/testing';
import { i18n } from '../../src/services/translations.js';

describe('TranslationService', () => {
  beforeEach(() => {
    document.documentElement.lang = 'en';
    i18n.setLanguage('en'); // Reset to English before each test
  });

  it('initializes with correct default language', () => {
    expect(i18n.currentLanguage).to.equal('en');
  });

  it('changes language correctly', () => {
    i18n.setLanguage('tr');
    expect(i18n.currentLanguage).to.equal('tr');
    expect(document.documentElement.lang).to.equal('tr');
  });

  it('translates keys correctly', () => {
    expect(i18n.translate('nav.employees')).to.equal('Employees');
    i18n.setLanguage('tr');
    expect(i18n.translate('nav.employees')).to.equal('Çalışanlar');
    i18n.setLanguage('en'); // Reset back to English
  });

  it('handles nested translations', () => {
    expect(i18n.translate('departments.analytics')).to.equal('Analytics');
    i18n.setLanguage('tr');
    expect(i18n.translate('departments.analytics')).to.equal('Analitik');
    i18n.setLanguage('en'); // Reset back to English
  });

  it('returns key if translation not found', () => {
    expect(i18n.translate('nonexistent.key')).to.equal('nonexistent.key');
  });

  it('notifies subscribers of language changes', async () => {
    let notifiedLang = null;
    const listener = (lang) => {
      notifiedLang = lang;
    };
    
    i18n.subscribe(listener);
    i18n.setLanguage('tr');
    
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(notifiedLang).to.equal('tr');
  });
}); 