# Research: Personal Expense Tracker

**Phase**: 0 (Research & Technology Decisions)  
**Date**: 2025-11-19  
**Status**: Complete

## Overview

This document consolidates research findings for implementing a React-based personal expense tracker SPA using localStorage for persistence, shadcn/ui for components, and supporting dark/light themes plus English/Chinese internationalization.

## Technology Stack Decisions

### 1. React 18+ with TypeScript

**Decision**: Use React 18 functional components with TypeScript strict mode

**Rationale**:
- React 18 provides automatic batching for better performance
- Concurrent features (Suspense, transitions) available for future enhancements
- Hooks-based architecture aligns with modern React patterns
- TypeScript strict mode catches errors at compile time, essential for data manipulation logic
- Strong ecosystem support for testing (React Testing Library, Vitest)

**Alternatives Considered**:
- Vue 3: Excellent, but React has better shadcn/ui integration
- Svelte: Smaller bundle size, but less mature TypeScript support
- Next.js: Overkill for client-only app with no SSR requirements

**Implementation Notes**:
- Use functional components exclusively (no class components)
- Custom hooks for reusable logic (useExpenses, useLocalStorage, useStorageSync)
- React Context for global state (theme, language, expenses)
- React.memo for performance optimization on expensive renders

---

### 2. shadcn/ui + Tailwind CSS

**Decision**: Use shadcn/ui components with Tailwind CSS for styling

**Rationale**:
- shadcn provides accessible, customizable components (not a library, copy-paste model)
- Built on Radix UI primitives (excellent keyboard navigation, ARIA support)
- Tailwind enables rapid responsive design with utility classes
- Dark mode support built-in via Tailwind's `dark:` variants
- Small bundle size (only includes components you use)

**Alternatives Considered**:
- Material-UI (MUI): Heavier bundle, harder to customize
- Ant Design: Good i18n support but doesn't match modern design aesthetic
- Chakra UI: Great DX but larger bundle size

**Implementation Notes**:
- Install shadcn CLI: `npx shadcn-ui@latest init`
- Add components as needed: Button, Card, Form, Dialog, Select, Label
- Configure Tailwind dark mode: `darkMode: 'class'` in tailwind.config.ts
- Use CSS variables for theme colors (supports runtime switching)

---

### 3. localStorage for Client-Side Persistence

**Decision**: Use browser localStorage with namespaced keys and JSON serialization

**Rationale**:
- Simple API: `localStorage.setItem()`, `localStorage.getItem()`
- Synchronous operations (no async complexity)
- 5MB+ storage capacity (sufficient for 1,000+ expense records)
- Data persists across browser sessions
- Supported in all modern browsers
- No backend/database setup required

**Alternatives Considered**:
- IndexedDB: More complex API, async operations, overkill for simple key-value needs
- sessionStorage: Data lost on tab close (violates persistence requirement)
- Cookies: 4KB limit too small, sent with every HTTP request (privacy concern)

**Implementation Notes**:
- Namespace all keys: `sdd_workshop_expense_tracker_`
- Store expenses as JSON array: `JSON.stringify(expenses)`
- Include version field for future migrations: `{ version: '1.0.0', expenses: [...] }`
- Wrap in try-catch for QuotaExceededError handling
- Use `storage` event listener for cross-tab synchronization

**Storage Schema**:
```typescript
// Key: sdd_workshop_expense_tracker_expenses
{
  version: "1.0.0",
  expenses: [
    {
      id: "uuid-v4",
      amount: 45.50,
      date: "2025-11-19",
      category: "Food",
      description: "Lunch at cafe",
      createdAt: "2025-11-19T12:30:00Z",
      updatedAt: "2025-11-19T12:30:00Z"
    }
  ]
}

// Key: sdd_workshop_expense_tracker_preferences
{
  version: "1.0.0",
  theme: "light", // or "dark"
  language: "en"  // or "zh"
}
```

---

### 4. i18n-next for Internationalization

**Decision**: Use react-i18next library for English/Chinese translations

**Rationale**:
- De facto standard for React internationalization
- Supports namespaces for organizing translations
- Lazy loading for language files (performance benefit)
- React hooks: `useTranslation()` for easy access in components
- Pluralization, interpolation, formatting support
- localStorage persistence for language preference

**Alternatives Considered**:
- react-intl: More complex API, larger bundle size
- Custom solution: Reinventing the wheel, harder to maintain
- next-intl: Tied to Next.js, overkill for SPA

**Implementation Notes**:
```typescript
// src/i18n/translations.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import zh from './zh.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh }
    },
    lng: localStorage.getItem('sdd_workshop_expense_tracker_preferences')?.language || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });
```

**Translation Keys Structure**:
```json
// en.json
{
  "dashboard": {
    "title": "Expense Tracker",
    "addExpense": "Add Expense",
    "noExpenses": "No expenses yet. Start tracking!"
  },
  "form": {
    "amount": "Amount",
    "date": "Date",
    "category": "Category",
    "description": "Description (optional)",
    "submit": "Save Expense",
    "cancel": "Cancel"
  },
  "validation": {
    "amountRequired": "Amount is required",
    "amountPositive": "Amount must be a positive number",
    "dateRequired": "Date is required",
    "dateFuture": "Date cannot be in the future"
  },
  "currency": {
    "symbol": "$"
  }
}

// zh.json (Chinese translations)
{
  "dashboard": {
    "title": "费用追踪器",
    "addExpense": "添加费用",
    "noExpenses": "还没有费用。开始追踪吧！"
  },
  "currency": {
    "symbol": "¥"
  }
  // ... mirror structure
}
```

---

### 5. React Hook Form + Zod for Form Validation

**Decision**: Use React Hook Form with Zod schema validation

**Rationale**:
- React Hook Form minimizes re-renders (performance)
- Uncontrolled inputs by default (less React state)
- Built-in validation, error handling, and field state management
- Zod provides TypeScript-first schema validation
- shadcn Form components integrate seamlessly with React Hook Form

**Alternatives Considered**:
- Formik: Older, less performant (more re-renders)
- Manual validation: Error-prone, harder to maintain
- Yup: Good but Zod has better TypeScript inference

**Implementation Notes**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const expenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  date: z.string().refine(
    (date) => new Date(date) <= new Date(),
    "Date cannot be in the future"
  ),
  category: z.enum(["Food", "Transport", "Entertainment", "Shopping", "Bills", "Healthcare", "Education", "Other"]),
  description: z.string().max(200).optional()
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const { register, handleSubmit, formState: { errors } } = useForm<ExpenseFormData>({
  resolver: zodResolver(expenseSchema)
});
```

---

### 6. Vitest + React Testing Library

**Decision**: Use Vitest for test runner, React Testing Library for component tests

**Rationale**:
- Vitest: Vite-native, extremely fast, Jest-compatible API
- React Testing Library: Tests user behavior, not implementation details
- Built-in coverage with c8/v8
- Supports TypeScript out of the box
- Fast feedback loop for TDD

**Alternatives Considered**:
- Jest: Slower, requires more configuration with Vite
- Cypress Component Testing: Heavier, E2E-focused

**Implementation Notes**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['**/*.config.ts', '**/node_modules/**']
    }
  }
});
```

**Test Structure**:
- Unit tests: Pure functions (validation, formatting, localStorage utils)
- Component tests: User interactions (form submission, button clicks, data display)
- Integration tests: Complete flows (add expense → appears in list → category totals update)

---

### 7. Vite for Build Tool

**Decision**: Use Vite for development server and production builds

**Rationale**:
- Instant HMR (Hot Module Replacement) via ESM
- Fast cold start compared to Webpack/CRA
- Optimized production builds with Rollup
- Native TypeScript support
- Small configuration surface

**Alternatives Considered**:
- Create React App: Deprecated, slower, more complex
- Webpack: More configuration overhead, slower dev server

**Implementation Notes**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true
  }
});
```

---

## Architecture Patterns

### 1. Context + Custom Hooks Pattern

**Pattern**: Use React Context for global state, expose via custom hooks

**Rationale**:
- Avoids prop drilling for theme, language, expenses
- Custom hooks encapsulate logic and provide clean API
- Easy to test hooks in isolation
- No external state management library needed (app is simple enough)

**Implementation**:
```typescript
// src/context/ExpenseContext.tsx
interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  loading: boolean;
  error: string | null;
}

// src/hooks/useExpenses.ts
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used within ExpenseProvider');
  return context;
};
```

---

### 2. Custom localStorage Hook

**Pattern**: Abstract localStorage operations behind a hook

**Rationale**:
- Centralizes error handling (QuotaExceededError, parse errors)
- Handles JSON serialization/deserialization
- Provides type safety with generics
- Easier to mock for tests

**Implementation**:
```typescript
// src/hooks/useLocalStorage.ts
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        // Notify user storage is full
        alert('Storage limit exceeded. Please export and clear old data.');
      }
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
```

---

### 3. Storage Event Listener for Multi-Tab Sync

**Pattern**: Listen for `storage` events to sync changes across tabs

**Rationale**:
- localStorage changes in one tab don't automatically update React state in other tabs
- `storage` event fires when localStorage changes in another tab
- Ensures consistent state across all open instances

**Implementation**:
```typescript
// src/hooks/useStorageSync.ts
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'sdd_workshop_expense_tracker_expenses' && e.newValue) {
      const updated = JSON.parse(e.newValue);
      setExpenses(updated.expenses);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

---

### 4. CSV Export Utility

**Pattern**: Generate CSV from expense data, trigger browser download

**Rationale**:
- Provides data portability (user can import into Excel, Google Sheets)
- Simple backup mechanism without cloud storage
- Handles special characters (commas, quotes, newlines) properly

**Implementation**:
```typescript
// src/utils/csvExport.ts
export function exportExpensesToCSV(expenses: Expense[]): void {
  const headers = ['Date', 'Amount', 'Category', 'Description', 'Created At', 'Updated At'];
  
  const rows = expenses.map(expense => [
    expense.date,
    expense.amount.toString(),
    expense.category,
    escapeCSVField(expense.description || ''),
    expense.createdAt,
    expense.updatedAt
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
```

---

## Performance Considerations

### 1. Memoization Strategy

- Use `React.memo` for `ExpenseCard` (rendered in list of 10)
- Use `useMemo` for:
  - Category totals calculation (recompute only when expenses change)
  - Sorted expenses (sort once per expense array change)
  - Filtered expense list (if filtering implemented)
- Use `useCallback` for event handlers passed to child components

### 2. Bundle Size Optimization

- Tree-shaking: Vite automatically removes unused code
- Code splitting: Not needed for this small app (single bundle is fine)
- shadcn components: Only import what's used
- i18n lazy loading: Load language files on demand (if bundle grows)

### 3. Rendering Performance

- Virtualization: Not needed (max 10 items displayed)
- Debouncing: Use for form inputs if needed
- Throttling: Use for storage event handlers

---

## Security Considerations

### 1. localStorage Security

- **No sensitive data**: Per spec, no authentication/tokens stored
- **XSS protection**: React escapes all rendered values by default
- **Input sanitization**: Zod validation prevents malicious input
- **No eval()**: Never parse user input as code

### 2. Content Security Policy (CSP)

- Consider adding CSP meta tag to prevent inline script injection
- Not critical for this app (no external scripts), but good practice

---

## Accessibility Best Practices

### 1. Semantic HTML

- Use `<main>`, `<nav>`, `<form>`, `<button>`, `<table>` elements
- Avoid `<div>` for interactive elements

### 2. ARIA Labels

- Add `aria-label` to icon buttons (edit, delete, theme toggle)
- Use `role="alert"` for error messages
- `aria-live="polite"` for success notifications

### 3. Keyboard Navigation

- Ensure all interactive elements are focusable
- Tab order follows visual order
- Enter/Space to activate buttons
- Escape to close dialogs

### 4. Color Contrast

- Verify 4.5:1 contrast ratio for text in both themes
- Use Tailwind's default palette (designed for accessibility)
- Test with browser DevTools contrast checker

---

## Development Workflow

### 1. Setup Steps

1. Initialize Vite project: `npm create vite@latest expense-tracker -- --template react-ts`
2. Install dependencies: `npm install`
3. Setup shadcn: `npx shadcn-ui@latest init`
4. Install additional deps: `npm install react-hook-form zod @hookform/resolvers/zod react-i18next i18next uuid`
5. Install dev deps: `npm install -D @types/uuid vitest @testing-library/react @testing-library/jest-dom jsdom`
6. Configure Tailwind for dark mode
7. Setup ESLint + Prettier
8. Initialize git: `git init`

### 2. Development Order

1. **Phase 1**: Setup project structure, install dependencies
2. **Phase 2**: Implement localStorage utilities + tests
3. **Phase 3**: Create Expense types and validation
4. **Phase 4**: Build ExpenseForm component + tests
5. **Phase 5**: Build Dashboard and ExpenseList + tests
6. **Phase 6**: Implement CategorySummary + tests
7. **Phase 7**: Add theme context and toggle
8. **Phase 8**: Add i18n support with translations
9. **Phase 9**: Implement CSV export
10. **Phase 10**: Integration tests and polish

---

## Open Questions (Resolved)

All technical unknowns from specification have been resolved through research:

1. ~~Which i18n library to use?~~ → react-i18next
2. ~~How to handle form validation?~~ → React Hook Form + Zod
3. ~~localStorage synchronization across tabs?~~ → `storage` event listener
4. ~~CSV generation approach?~~ → Client-side with Blob download
5. ~~Dark mode implementation?~~ → Tailwind `dark:` class + Context API

---

## References

- [React 18 Documentation](https://react.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [react-i18next](https://react.i18next.com)
- [Vitest](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [MDN localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Phase 0 Complete** ✅  
All technology decisions finalized. Proceed to Phase 1 (Design & Contracts).

