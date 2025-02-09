import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { i18n } from '../../services/translations.js';

export class EmployeeNav extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      margin: 0 auto;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: bold;
      cursor: pointer;
      font-size: 1.25rem;
      white-space: nowrap;
    }

    .logo-img {
      height: 32px;
      width: auto;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-color);
      text-decoration: none;
      padding: 0.5rem;
      height: 24px;
      transition: color 0.2s, background-color 0.2s;
      border-radius: 4px;
    }

    .nav-link:hover {
      background-color: var(--primary-color);
      color: white;
    }

    .nav-link.active {
      background-color: var(--primary-color);
      color: white;
    }

    .nav-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .plus-icon {
      font-size: 2rem;
      line-height: 1;
      margin-right: 0.25rem;
    }

    .language-flags {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .flag-button {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      font-size: 1.25rem;
      transition: transform 0.2s;
      border-radius: 4px;
    }

    .flag-button:hover {
      transform: scale(1.1);
    }

    .menu-toggle {
      display: none;
      background: none;
      border: none;
      color: #666;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
    }

    @media (max-width: 1024px) {
      .nav-container {
        padding: 1rem;
      }

      .nav-actions {
        gap: 1rem;
      }
    }

    @media (max-width: 768px) {
      .nav-container {
        position: relative;
      }

      .menu-toggle {
        display: block;
      }

      .nav-actions {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .nav-actions.show {
        display: flex;
      }

      .nav-links {
        flex-direction: column;
        width: 100%;
        align-items: end;
        gap: 1rem;
      }

      .nav-controls {
        margin-left: auto;
      }
    }

    @media (max-width: 480px) {
      .nav-container {
        padding: 0.75rem;
      }

      .logo-img {
        height: 24px;
      }
    }

    .employee-icon {
      width: 20px;
      height: 20px;
    }
  `;

  static properties = {
    menuOpen: { type: Boolean },
    lang: { type: String }
  };

  constructor() {
    super();
    this.menuOpen = false;
    this.lang = i18n.currentLanguage;
    this._updateActiveLink();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = i18n.subscribe(lang => {
      this.lang = lang;
    });
    window.addEventListener('vaadin-router-location-changed', () => {
      this._updateActiveLink();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe?.();
    window.removeEventListener('vaadin-router-location-changed', () => {
      this._updateActiveLink();
    });
  }

  _updateActiveLink() {
    this.requestUpdate();
  }

  _isActive(path) {
    return window.location.pathname === path;
  }

  toggleLanguage() {
    const newLang = this.lang === 'en' ? 'tr' : 'en';
    i18n.setLanguage(newLang);
  }

  render() {
    const t = key => i18n.translate(key);

    return html`
      <div class="nav-container">
        <div class="logo-section" @click=${() => Router.go('/')}>
          <img src="/src/assets/logo.svg" alt="ING Logo" class="logo-img">
          <span>ING</span>
        </div>

        <button class="menu-toggle" @click=${this.toggleMenu}>
          ☰
        </button>

        <div class="nav-actions ${this.menuOpen ? 'show' : ''}">
          <nav class="nav-links">
            <a 
              href="/" 
              class="nav-link ${this._isActive('/') ? 'active' : ''}"
              @click=${(e) => {
                e.preventDefault();
                Router.go('/');
                this.menuOpen = false;
              }}
            >
              <img src="/src/assets/employee.svg" alt="employee" class="employee-icon">
              ${t('nav.employees')}
            </a>
            <a 
              href="/add" 
              class="nav-link ${this._isActive('/add') ? 'active' : ''}"
              @click=${(e) => {
                e.preventDefault();
                Router.go('/add');
                this.menuOpen = false;
              }}
            >
              <span class="plus-icon">+</span>
              <span>${t('nav.addNew')}</span>
            </a>
          </nav>

          <div class="nav-controls">
            

            <button 
              class="flag-button"
              @click=${this.toggleLanguage}
              title=${this.lang === 'en' ? 'Türkçe' : 'English'}
            >
              ${this.lang === 'en' ? '🇬🇧' : '🇹🇷'}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('emp-nav', EmployeeNav); 