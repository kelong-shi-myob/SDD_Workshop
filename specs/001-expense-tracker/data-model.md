# Data Model: Personal Expense Tracker

**Phase**: 1 (Design & Contracts)  
**Date**: 2025-11-19  
**Status**: Complete

## Overview

This document defines the data entities, relationships, validation rules, and localStorage schemas for the Personal Expense Tracker application.

## Entity Definitions

### 1. Expense

Represents a single spending transaction recorded by the user.

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string (UUID v4) | Yes | Auto-generated | Unique identifier for the expense |
| `amount` | number | Yes | Positive, max 10 digits, 2 decimal places | Monetary value of the expense |
| `date` | string (ISO 8601 date) | Yes | Format: YYYY-MM-DD, not in future | Date when expense occurred |
| `category` | ExpenseCategory (enum) | Yes | One of 8 predefined values | Categorization of the expense |
| `description` | string | No | Max 200 characters | Optional notes about the expense |
| `createdAt` | string (ISO 8601 datetime) | Yes | Auto-generated | Timestamp when record was created |
| `updatedAt` | string (ISO 8601 datetime) | Yes | Auto-updated | Timestamp when record was last modified |

**TypeScript Type**:
```typescript
type ExpenseCategory = 
  | 'Food' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Bills' 
  | 'Healthcare' 
  | 'Education' 
  | 'Other';

interface Expense {
  id: string;
  amount: number;
  date: string; // ISO 8601 date (YYYY-MM-DD)
  category: ExpenseCategory;
  description?: string;
  createdAt: string; // ISO 8601 datetime
  updatedAt: string; // ISO 8601 datetime
}
```

**Validation Rules**:
```typescript
// Using Zod schema
import { z } from 'zod';

const expenseSchema = z.object({
  id: z.string().uuid(),
  amount: z.number()
    .positive("Amount must be a positive number")
    .max(9999999999, "Amount too large")
    .multipleOf(0.01, "Amount must have at most 2 decimal places"),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine(
      (date) => new Date(date) <= new Date(),
      "Date cannot be in the future"
    ),
  category: z.enum([
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Bills',
    'Healthcare',
    'Education',
    'Other'
  ]),
  description: z.string()
    .max(200, "Description must be 200 characters or less")
    .optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

type Expense = z.infer<typeof expenseSchema>;
```

**Example**:
```json
{
  "id": "a3c8f9e2-4d5b-4c7a-9e1f-2b3c4d5e6f7g",
  "amount": 45.50,
  "date": "2025-11-19",
  "category": "Food",
  "description": "Lunch at cafe",
  "createdAt": "2025-11-19T12:30:00.000Z",
  "updatedAt": "2025-11-19T12:30:00.000Z"
}
```

---

### 2. UserPreferences

Stores user interface settings (theme and language).

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `theme` | Theme (enum) | Yes | 'light' or 'dark' | User's preferred color theme |
| `language` | Language (enum) | Yes | 'en' or 'zh' | User's preferred interface language |

**TypeScript Type**:
```typescript
type Theme = 'light' | 'dark';
type Language = 'en' | 'zh';

interface UserPreferences {
  theme: Theme;
  language: Language;
}
```

**Validation Rules**:
```typescript
const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark']),
  language: z.enum(['en', 'zh'])
});

type UserPreferences = z.infer<typeof userPreferencesSchema>;
```

**Example**:
```json
{
  "theme": "dark",
  "language": "zh"
}
```

---

### 3. CategorySummary (Derived)

Computed entity for dashboard display (not stored, calculated from Expenses).

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `category` | ExpenseCategory | Category name |
| `totalAmount` | number | Sum of all expense amounts in this category |
| `expenseCount` | number | Number of expenses in this category |

**TypeScript Type**:
```typescript
interface CategorySummary {
  category: ExpenseCategory;
  totalAmount: number;
  expenseCount: number;
}
```

**Computation Logic**:
```typescript
function calculateCategorySummaries(expenses: Expense[]): CategorySummary[] {
  const summaryMap = new Map<ExpenseCategory, CategorySummary>();

  expenses.forEach(expense => {
    const existing = summaryMap.get(expense.category);
    if (existing) {
      existing.totalAmount += expense.amount;
      existing.expenseCount += 1;
    } else {
      summaryMap.set(expense.category, {
        category: expense.category,
        totalAmount: expense.amount,
        expenseCount: 1
      });
    }
  });

  // Sort by totalAmount descending (highest spending first)
  return Array.from(summaryMap.values())
    .sort((a, b) => b.totalAmount - a.totalAmount);
}
```

**Example**:
```json
[
  {
    "category": "Food",
    "totalAmount": 450.75,
    "expenseCount": 12
  },
  {
    "category": "Transport",
    "totalAmount": 280.50,
    "expenseCount": 8
  },
  {
    "category": "Entertainment",
    "totalAmount": 125.00,
    "expenseCount": 3
  }
]
```

---

## Entity Relationships

```
┌─────────────────┐
│  UserPreferences│  (1:1 with user)
│  - theme        │  Stored in localStorage
│  - language     │  Key: sdd_workshop_expense_tracker_preferences
└─────────────────┘

┌─────────────────┐
│    Expense      │  (1:many per user)
│  - id           │  Stored in localStorage
│  - amount       │  Key: sdd_workshop_expense_tracker_expenses
│  - date         │  Array of Expense objects
│  - category     │
│  - description  │
│  - createdAt    │
│  - updatedAt    │
└─────────────────┘
         │
         │ computed from
         ▼
┌─────────────────┐
│ CategorySummary │  (derived, not stored)
│  - category     │  Calculated on-demand from Expense array
│  - totalAmount  │  Sorted by totalAmount descending
│  - expenseCount │
└─────────────────┘
```

**Relationship Notes**:
- **No foreign keys**: All data is client-side, no relational database
- **No user entity**: Single-user application (no authentication per spec)
- **No joins**: CategorySummary computed via JavaScript reduce/map operations

---

## localStorage Schema

### Storage Keys

All keys are namespaced with `sdd_workshop_expense_tracker_` prefix:

| Key | Purpose | Type |
|-----|---------|------|
| `sdd_workshop_expense_tracker_expenses` | Expense records with versioning | ExpenseStorage |
| `sdd_workshop_expense_tracker_preferences` | User theme and language settings | PreferencesStorage |
| `sdd_workshop_expense_tracker_version` | Data format version (for migrations) | string |

### Storage Wrapper Types

**ExpenseStorage** (wraps expense array with version):
```typescript
interface ExpenseStorage {
  version: string; // Semantic version (e.g., "1.0.0")
  expenses: Expense[];
}
```

**PreferencesStorage** (wraps preferences with version):
```typescript
interface PreferencesStorage {
  version: string;
  preferences: UserPreferences;
}
```

**Example localStorage State**:
```javascript
// localStorage.getItem('sdd_workshop_expense_tracker_expenses')
{
  "version": "1.0.0",
  "expenses": [
    {
      "id": "a3c8f9e2-4d5b-4c7a-9e1f-2b3c4d5e6f7g",
      "amount": 45.50,
      "date": "2025-11-19",
      "category": "Food",
      "description": "Lunch at cafe",
      "createdAt": "2025-11-19T12:30:00.000Z",
      "updatedAt": "2025-11-19T12:30:00.000Z"
    },
    // ... more expenses
  ]
}

// localStorage.getItem('sdd_workshop_expense_tracker_preferences')
{
  "version": "1.0.0",
  "preferences": {
    "theme": "dark",
    "language": "en"
  }
}

// localStorage.getItem('sdd_workshop_expense_tracker_version')
"1.0.0"
```

---

## State Transitions

### Expense Lifecycle

```
[User Action: Add Expense]
    ↓
┌─────────────┐
│   Create    │  Generate id, createdAt, updatedAt (all identical)
│   Expense   │  Validate all fields
└─────────────┘
    ↓
┌─────────────┐
│  Persisted  │  Add to expenses array in localStorage
│  in Storage │  Trigger storage event for multi-tab sync
└─────────────┘
    ↓
┌─────────────┐
│  Displayed  │  Appear in dashboard (if in top 10 recent)
│  on         │  Contribute to CategorySummary totals
│  Dashboard  │
└─────────────┘

[User Action: Edit Expense]
    ↓
┌─────────────┐
│   Update    │  Modify fields (except id, createdAt)
│   Expense   │  Update updatedAt timestamp
└─────────────┘
    ↓
┌─────────────┐
│  Persisted  │  Replace in expenses array
│  in Storage │  Trigger storage event
└─────────────┘

[User Action: Delete Expense]
    ↓
┌─────────────┐
│   Remove    │  Confirmation dialog
│   Expense   │  Filter out from expenses array
└─────────────┘
    ↓
┌─────────────┐
│  Persisted  │  Save updated array to localStorage
│  in Storage │  Trigger storage event
└─────────────┘
```

### UserPreferences Lifecycle

```
[User Action: Toggle Theme]
    ↓
┌─────────────┐
│   Update    │  Set theme: 'light' ↔ 'dark'
│   Theme     │
└─────────────┘
    ↓
┌─────────────┐
│  Persisted  │  Update in localStorage
│  in Storage │  Apply <html class="dark"> or remove
└─────────────┘

[User Action: Change Language]
    ↓
┌─────────────┐
│   Update    │  Set language: 'en' ↔ 'zh'
│   Language  │
└─────────────┘
    ↓
┌─────────────┐
│  Persisted  │  Update in localStorage
│  in Storage │  Trigger i18next language change
└─────────────┘
```

---

## Data Migrations

### Version 1.0.0 (Initial)

Current version. Future migrations will check `version` field and apply transformations.

**Migration Strategy**:
```typescript
interface MigrationHandler {
  fromVersion: string;
  toVersion: string;
  migrate: (data: any) => any;
}

const migrations: MigrationHandler[] = [
  // Example future migration:
  // {
  //   fromVersion: '1.0.0',
  //   toVersion: '2.0.0',
  //   migrate: (data) => {
  //     // Add new field, transform existing data, etc.
  //     return data;
  //   }
  // }
];

function migrateData(currentVersion: string, data: any): any {
  let migratedData = data;
  let version = currentVersion;

  const applicableMigrations = migrations.filter(
    m => m.fromVersion === version
  );

  for (const migration of applicableMigrations) {
    migratedData = migration.migrate(migratedData);
    version = migration.toVersion;
  }

  return { ...migratedData, version };
}
```

---

## Data Constraints

### Size Limits

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Max expenses | ~1,000 | localStorage 5MB limit, each expense ~500 bytes |
| Max description length | 200 characters | Display constraints, reasonable detail level |
| Max amount | 9,999,999,999.99 | 10 digits + 2 decimals (covers most personal expenses) |
| localStorage capacity | 5MB | Browser standard limit |
| Warning threshold | 4MB (80%) | Alert user before hitting limit |

### Performance Considerations

- **Expense list rendering**: Only display 10 most recent (performance: O(n log n) sort + slice)
- **Category summary calculation**: O(n) iteration over all expenses
- **localStorage reads**: Synchronous, <10ms for 1,000 records
- **localStorage writes**: Synchronous, <20ms for 1,000 records

### Data Integrity Rules

1. **Unique IDs**: Use UUID v4 to ensure no collisions
2. **Timestamp immutability**: `createdAt` never changes after creation
3. **Timestamp accuracy**: Use `new Date().toISOString()` for consistency
4. **Amount precision**: Store as number, format on display (avoid floating-point display issues)
5. **Date format**: Always ISO 8601 (YYYY-MM-DD) for sortability
6. **Category consistency**: Use TypeScript enum to prevent typos

---

## Query Patterns

### Common Operations

**1. Get All Expenses (sorted by date descending)**:
```typescript
const expenses = getExpensesFromStorage();
const sortedExpenses = expenses.sort((a, b) => 
  new Date(b.date).getTime() - new Date(a.date).getTime()
);
```

**2. Get 10 Most Recent Expenses**:
```typescript
const recentExpenses = sortedExpenses.slice(0, 10);
```

**3. Calculate Category Summaries**:
```typescript
const summaries = calculateCategorySummaries(expenses);
// Returns sorted by totalAmount descending
```

**4. Get Expenses by Date Range** (for future features):
```typescript
const expensesInRange = expenses.filter(expense => 
  expense.date >= startDate && expense.date <= endDate
);
```

**5. Get Expenses by Category** (for future features):
```typescript
const foodExpenses = expenses.filter(expense => 
  expense.category === 'Food'
);
```

---

## CSV Export Format

**Column Headers**:
```
Date,Amount,Category,Description,Created At,Updated At
```

**Row Format**:
```csv
2025-11-19,45.50,Food,"Lunch at cafe",2025-11-19T12:30:00.000Z,2025-11-19T12:30:00.000Z
2025-11-18,12.00,Transport,"Bus fare",2025-11-18T08:15:00.000Z,2025-11-18T08:15:00.000Z
2025-11-17,89.99,Entertainment,"Movie tickets",2025-11-17T19:30:00.000Z,2025-11-17T19:30:00.000Z
```

**Special Character Handling**:
- Commas in description: Wrap field in quotes
- Quotes in description: Escape with double quotes (`""`)
- Newlines in description: Wrap field in quotes

---

**Phase 1 Data Model Complete** ✅  
Proceed to generating TypeScript contract files.

