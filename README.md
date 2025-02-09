# Employee Management Application

A modern web application for managing employee records, built with Lit Elements and following web component architecture. This project demonstrates best practices in frontend development including component reusability, state management, internationalization, and responsive design.

## Features

- CRUD operations for employee management
- Real-time search functionality
- Responsive design with table and list views
- Internationalization support (English/Turkish)
- Local storage persistence
- Form validation
- Pagination
- Comprehensive test coverage

## Tech Stack

- **Lit Elements** - For creating fast, lightweight web components
- **Vaadin Router** - For client-side routing
- **CSS Custom Properties** - For consistent theming
- **ESLint/Prettier** - For code quality and formatting

## Project Structure

```
src/
├── assets/           # SVG icons and images
├── components/       # Reusable components
│   ├── layout/      # Layout components
│   │   └── emp-nav.js
│   └── ui/          # UI components
│       ├── emp-confirm-popup.js
│       └── emp-pagination.js
├── pages/           # Page components
│   ├── emp-list.js
│   └── emp-form.js
├── services/        # Application services
│   └── translations.js
├── store/           # State management
│   └── employee-store.js
└── emp-app.js       # Root application component

test/
├── components/      # Component tests
├── pages/          # Page component tests
└── services/       # Service tests
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run serve
```

3. Visit `http://localhost:8000` in your browser

## Testing

Run the test suite:
```bash
npm test
```

View test coverage:
```bash
npm run test:coverage
```

## Key Implementation Details

- Component-based architecture using Lit Elements
- Reactive state management with custom store
- Responsive design with table/list view switching
- Comprehensive test coverage using @open-wc/testing
- Internationalization with dynamic language switching
- Client-side routing with Vaadin Router

## Running in Production Mode

```bash
npm run serve:prod
```

---
Developed by Onur Kılıç as a technical assessment for ING
