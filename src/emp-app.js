import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './components/layout/emp-nav.js';
import './pages/emp-list.js';
import './pages/emp-form.js';

export class EmployeeApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .container {
      width: 100%;
      margin: 0 auto;
    }

    main {
      padding: 0;
    }
  `;

  firstUpdated() {
    const outlet = this.shadowRoot.querySelector('#outlet');
    const router = new Router(outlet);
    
    router.setRoutes([
      {
        path: '/',
        component: 'emp-list'
      },
      {
        path: '/add',
        component: 'emp-form'
      },
      {
        path: '/edit/:id',
        component: 'emp-form'
      },
      { path: '(.*)', redirect: '/' },
    ]);

    // Make router available to other components
    this.router = router;
  }

  render() {
    return html`
      <emp-nav></emp-nav>
      <div class="container">
        <main id="outlet"></main>
      </div>
    `;
  }
}

customElements.define('emp-app', EmployeeApp); 