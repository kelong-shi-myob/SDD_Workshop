# Quickstart Guide: Personal Expense Tracker

**For**: New developers joining the project  
**Time**: ~30 minutes to get running  
**Last Updated**: 2025-11-19

## Overview

This guide will help you set up your development environment, understand the codebase structure, and make your first contribution to the Personal Expense Tracker application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ (comes with Node.js)
- **Git**: v2.30+
- **VS Code**: Latest version (recommended IDE)
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- TypeScript + JavaScript (`ms-vscode.vscode-typescript-next`)
- Vitest (`ZixuanChen.vitest-explorer`)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/expense-tracker.git
cd expense-tracker
```

### 2. Checkout the Feature Branch

```bash
git fetch origin
git checkout 001-expense-tracker
```

### 3. Install Dependencies

```bash
npm install
```

This will install:
- React 18+ and React DOM
- TypeScript 5+
- Vite (build tool)
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod (form validation)
- react-i18next (internationalization)
- Vitest + React Testing Library (testing)
- ESLint + Prettier (code quality)

### 4. Initialize shadcn/ui

```bash
npx shadcn-ui@latest init
```

Select the following options:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

### 5. Add Required shadcn Components

```bash
npx shadcn-ui@latest add button card form input label select dialog
```

### 6. Start Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173/`

## Project Structure

```
expense-tracker/
├── src/
│   ├── components/           # React components
│   │   ├── Dashboard/        # Main dashboard view
│   │   ├── ExpenseForm/      # Add/edit expense form
│   │   ├── ExpenseList/      # List of recent expenses
│   │   ├── CategorySummary/  # Category totals display
│   │   ├── Layout/           # App layout components
│   │   └── ui/               # shadcn components (auto-generated)
│   ├── context/              # React Context providers
│   │   ├── ThemeContext.tsx
│   │   ├── LanguageContext.tsx
│   │   └── ExpenseContext.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useExpenses.ts
│   │   └── useStorageSync.ts
│   ├── utils/                # Utility functions
│   │   ├── localStorage.ts   # localStorage adapter
│   │   ├── validation.ts     # Zod schemas
│   │   ├── formatting.ts     # Currency/date formatting
│   │   └── csvExport.ts      # CSV export logic
│   ├── i18n/                 # Translations
│   │   ├── en.json           # English translations
│   │   ├── zh.json           # Chinese translations
│   │   └── translations.ts   # i18next config
│   ├── types/                # TypeScript types
│   │   ├── expense.ts
│   │   ├── preferences.ts
│   │   └── index.ts
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── tests/
│   ├── integration/          # Integration tests
│   └── e2e/                  # End-to-end tests (optional)
├── specs/                    # Feature specifications
│   └── 001-expense-tracker/
│       ├── spec.md           # Feature requirements
│       ├── plan.md           # Implementation plan
│       ├── research.md       # Technology decisions
│       ├── data-model.md     # Data structures
│       ├── quickstart.md     # This file
│       └── contracts/        # TypeScript interfaces
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── eslint.config.js
└── README.md
```

## Key Concepts

### 1. State Management

We use **React Context API** for global state (no Redux/Zustand needed):

```typescript
// Example: Using expenses context
import { useExpenses } from '@/hooks/useExpenses';

function MyComponent() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  
  // Use context values and methods
}
```

### 2. Data Persistence

All data is stored in browser **localStorage** with namespaced keys:

```typescript
// Keys:
// - sdd_workshop_expense_tracker_expenses
// - sdd_workshop_expense_tracker_preferences

import { useLocalStorage } from '@/hooks/useLocalStorage';

const [expenses, setExpenses] = useLocalStorage('expenses', []);
```

### 3. Form Validation

We use **React Hook Form** with **Zod** schemas:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema } from '@/types/expense';

const form = useForm({
  resolver: zodResolver(expenseSchema)
});
```

### 4. Internationalization

Translations are managed with **react-i18next**:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('dashboard.title')}</h1>;
}
```

### 5. Styling

We use **Tailwind CSS** utility classes:

```tsx
// Responsive + dark mode aware
<div className="bg-white dark:bg-gray-800 p-4 md:p-6 lg:p-8">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    {title}
  </h1>
</div>
```

## Development Workflow

### Step 1: Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

### Step 2: Write Tests First (TDD)

```bash
# Create test file
touch src/components/MyComponent/__tests__/MyComponent.test.tsx

# Write failing tests
npm run test
```

### Step 3: Implement the Feature

Write the minimum code to make tests pass.

### Step 4: Run Linter

```bash
npm run lint
npm run format
```

### Step 5: Test Your Changes

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

### Step 6: Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

### Step 7: Commit Changes

```bash
git add .
git commit -m "feat: add expense form validation"
```

**Commit Message Format**:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Test changes
- `refactor:` Code refactoring
- `style:` Code style (formatting)
- `chore:` Build/config changes

### Step 8: Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Common Tasks

### Adding a New Component

1. Create component directory:
   ```bash
   mkdir -p src/components/MyComponent
   touch src/components/MyComponent/MyComponent.tsx
   touch src/components/MyComponent/__tests__/MyComponent.test.tsx
   ```

2. Write component with TypeScript:
   ```tsx
   interface MyComponentProps {
     title: string;
     onAction: () => void;
   }

   export function MyComponent({ title, onAction }: MyComponentProps) {
     return (
       <div>
         <h2>{title}</h2>
         <button onClick={onAction}>Action</button>
       </div>
     );
   }
   ```

3. Write tests:
   ```tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { MyComponent } from '../MyComponent';

   describe('MyComponent', () => {
     it('renders title', () => {
       render(<MyComponent title="Test" onAction={vi.fn()} />);
       expect(screen.getByText('Test')).toBeInTheDocument();
     });
   });
   ```

### Adding a New Translation

1. Add keys to `src/i18n/en.json`:
   ```json
   {
     "myFeature": {
       "title": "My Feature",
       "description": "Feature description"
     }
   }
   ```

2. Add corresponding keys to `src/i18n/zh.json`:
   ```json
   {
     "myFeature": {
       "title": "我的功能",
       "description": "功能描述"
     }
   }
   ```

3. Use in components:
   ```tsx
   const { t } = useTranslation();
   return <h1>{t('myFeature.title')}</h1>;
   ```

### Adding a New localStorage Key

1. Update `src/utils/localStorage.ts`:
   ```typescript
   export const STORAGE_KEYS = {
     EXPENSES: 'sdd_workshop_expense_tracker_expenses',
     PREFERENCES: 'sdd_workshop_expense_tracker_preferences',
     MY_NEW_KEY: 'sdd_workshop_expense_tracker_my_new_key', // Add here
   } as const;
   ```

2. Create type-safe getter/setter:
   ```typescript
   export function getMyData(): MyData | null {
     const data = localStorage.getItem(STORAGE_KEYS.MY_NEW_KEY);
     return data ? JSON.parse(data) : null;
   }
   ```

### Debugging localStorage

Open browser DevTools → Application → Local Storage → `http://localhost:5173`

You'll see keys like:
- `sdd_workshop_expense_tracker_expenses`
- `sdd_workshop_expense_tracker_preferences`

Right-click to edit or delete data.

### Running Tests in Watch Mode

```bash
npm run test:watch
```

Tests will re-run automatically when files change.

### Viewing Test Coverage

```bash
npm run test:coverage
```

Open `coverage/index.html` in your browser.

## Troubleshooting

### Issue: Port 5173 already in use

**Solution**: Kill the process or change port in `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000
  }
});
```

### Issue: TypeScript errors after pulling changes

**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: shadcn components not styled

**Solution**: Ensure Tailwind CSS is configured:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Issue: Tests failing with "localStorage is not defined"

**Solution**: Check `vitest.config.ts` has:
```typescript
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
});
```

### Issue: Dark mode not working

**Solution**: Check `tailwind.config.ts` has:
```typescript
export default {
  darkMode: 'class', // Not 'media'
  // ...
};
```

And `<html>` element has `class="dark"` when dark mode enabled.

### Issue: Translations not loading

**Solution**: Check i18next initialization in `src/i18n/translations.ts` is called before React renders:
```typescript
// main.tsx
import './i18n/translations'; // Import before App
import App from './App';
```

## Testing Guidelines

### Unit Tests

Test individual functions and components in isolation:

```typescript
// src/utils/__tests__/formatting.test.ts
import { formatCurrency } from '../formatting';

describe('formatCurrency', () => {
  it('formats USD amounts correctly', () => {
    expect(formatCurrency(1234.56, 'en')).toBe('$1,234.56');
  });

  it('formats CNY amounts correctly', () => {
    expect(formatCurrency(1234.56, 'zh')).toBe('¥1,234.56');
  });
});
```

### Component Tests

Test user interactions and rendering:

```typescript
// src/components/ExpenseForm/__tests__/ExpenseForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpenseForm } from '../ExpenseForm';

describe('ExpenseForm', () => {
  it('shows error when amount is negative', async () => {
    render(<ExpenseForm onSubmit={vi.fn()} />);
    
    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '-10' } });
    fireEvent.blur(amountInput);
    
    expect(await screen.findByText(/amount must be positive/i)).toBeInTheDocument();
  });
});
```

### Integration Tests

Test complete user flows:

```typescript
// tests/integration/expense-crud.test.tsx
describe('Expense CRUD Operations', () => {
  it('creates, displays, updates, and deletes an expense', () => {
    // 1. Add expense
    // 2. Verify it appears in list
    // 3. Edit expense
    // 4. Verify changes persist
    // 5. Delete expense
    // 6. Verify it's removed
  });
});
```

## Accessibility Checklist

When building components, ensure:

- [ ] Semantic HTML elements (`<button>`, `<form>`, `<table>`)
- [ ] ARIA labels for icon buttons (`aria-label="Edit expense"`)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Color contrast ≥ 4.5:1 (use browser DevTools)
- [ ] Screen reader announcements for actions

Test with:
- Chrome DevTools Lighthouse (Accessibility audit)
- Keyboard only (unplug your mouse!)
- Screen reader (NVDA on Windows, VoiceOver on Mac)

## Performance Tips

### 1. Memoize Expensive Calculations

```typescript
import { useMemo } from 'react';

const categorySummaries = useMemo(
  () => calculateCategorySummaries(expenses),
  [expenses]
);
```

### 2. Memoize Components

```typescript
import { memo } from 'react';

export const ExpenseCard = memo(function ExpenseCard(props) {
  // Component implementation
});
```

### 3. Use useCallback for Event Handlers

```typescript
const handleDelete = useCallback((id: string) => {
  deleteExpense(id);
}, [deleteExpense]);
```

### 4. Debounce Form Inputs (if needed)

```typescript
import { useDebouncedCallback } from 'use-debounce';

const handleSearch = useDebouncedCallback((term: string) => {
  // Search logic
}, 300);
```

## Resources

### Documentation

- [Project Spec](./spec.md) - Feature requirements
- [Implementation Plan](./plan.md) - Technical architecture
- [Research](./research.md) - Technology decisions
- [Data Model](./data-model.md) - Entity schemas
- [Contracts](./contracts/) - TypeScript interfaces

### External Links

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- [Vitest Guide](https://vitest.dev/guide/)
- [React Testing Library](https://testing-library.com/react)

### Team Contacts

- **Project Lead**: [Name] ([email])
- **Tech Lead**: [Name] ([email])
- **Design**: [Name] ([email])

### Communication Channels

- **Slack**: `#expense-tracker`
- **GitHub**: [Repository](https://github.com/your-org/expense-tracker)
- **Meetings**: Daily standup at 10am

## Next Steps

Now that you're set up:

1. Read the [Feature Spec](./spec.md) to understand requirements
2. Review the [Implementation Plan](./plan.md) for technical details
3. Pick a task from the backlog (will be in `tasks.md` after `/speckit.tasks`)
4. Write tests first, then implement
5. Submit your first PR!

## Need Help?

- Check the [troubleshooting section](#troubleshooting)
- Search existing GitHub issues
- Ask in Slack `#expense-tracker`
- Schedule a pairing session with a team member

**Welcome to the team! 🎉**

