# Data Model: Personal Expense Tracker

**Feature**: `002-expense-tracker`
**Date**: 2025-11-20

## Entities

### Expense

Primary record representing a financial transaction.

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | `string` | Yes | UUID v4 | Unique identifier |
| `amount` | `number` | Yes | > 0 | Cost value |
| `date` | `string` | Yes | ISO 8601 | Date of expense (YYYY-MM-DD) |
| `category` | `Category` | Yes | Enum | Fixed classification |
| `description`| `string` | No | Max 100 chars | Optional details |
| `createdAt` | `number` | Yes | Timestamp | For creation order sorting (secondary) |

### Category (Enum)

Fixed list of expense types.

- `Food`
- `Transport`
- `Entertainment`
- `Utilities`
- `Health`
- `Other`

## Storage Schema

Data is persisted in `localStorage`.

**Key**: `sdd_workshop_expense_tracker_v1_expenses`

**Value**: JSON Array of `Expense` objects.

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 42.50,
    "date": "2025-11-20",
    "category": "Food",
    "description": "Lunch with team",
    "createdAt": 1732156800000
  }
]
```

## State Management

- **Global State**: Not required (Prop drilling or Context sufficient for small app, but simple `useLocalStorage` hook in parent `Dashboard` component is likely enough).
- **Scope**: Dashboard component loads data; passed down to `RecentList` and `Summary` components. `AddExpenseForm` calls a handler to update the list.

