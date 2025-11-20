# Research: Personal Expense Tracker

**Feature**: Personal Expense Tracker (003-expense-tracker)
**Status**: Complete

## 1. Decisions & Rationale

### State Management
- **Decision**: React Context + `useReducer`
- **Rationale**: Aligns with Constitution (Principle V). Sufficient for managing a simple list of expenses and view state without external dependencies.
- **Alternatives Considered**: Zustand (Rejected by Constitution), Prop Drilling (Too messy for global expense list).

### Routing
- **Decision**: Conditional Rendering (View State)
- **Rationale**: Constitution prohibits React Router. Simple `view` state string ('dashboard', 'add') in App component is sufficient for 2 screens.
- **Alternatives Considered**: React Router (Rejected by Constitution), Hashchange listener (Too complex for 2 views).

### Data Persistence
- **Decision**: `localStorage` with custom hook wrapper
- **Rationale**: Constitution mandates `localStorage`. A custom hook `useLocalStorage` will handle serialization/deserialization and namespacing (`workshop_app_expense_`).
- **Alternatives Considered**: IndexedDB (Too complex/overkill), SessionStorage (Data lost on close).

### CSS Framework
- **Decision**: Pico.css
- **Rationale**: Constitution mandatory. Provides clean, responsive semantic HTML styling without class-name soup.

### Date Handling
- **Decision**: Native `Date` object + `Intl.DateTimeFormat`
- **Rationale**: No external libs like moment/date-fns needed for simple display. Native API is robust in modern browsers.

## 2. Technical Unknowns Resolved

- **Storage Limits**: `localStorage` typically 5MB.
  - *Analysis*: A typical expense record is ~200 bytes. 5MB stores ~25,000 records. ample for a "simple tracker".
- **Currency Formatting**:
  - *Analysis*: Use `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` for robust, locale-aware formatting without libraries.

