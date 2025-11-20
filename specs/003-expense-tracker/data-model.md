# Data Model: Personal Expense Tracker

## Entities

### Expense

Represents a single financial transaction.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | `string` (UUID) | Yes | Unique | Unique identifier (generated via `crypto.randomUUID()`). |
| `amount` | `number` | Yes | `> 0` | The cost value. Stored as float (e.g. 10.99). |
| `date` | `string` (ISO8601) | Yes | Valid Date | Date of transaction (YYYY-MM-DD). |
| `category` | `string` (Enum) | Yes | In Fixed List | One of: Food, Transport, Entertainment, Utilities, Health, Other. |
| `description` | `string` | No | Max 100 chars | Optional brief note. |
| `createdAt` | `number` (Timestamp)| Yes | - | Creation timestamp for sorting if dates are same. |

## Storage Schema

Data is stored in `localStorage` under the key: `workshop_app_expenses_data`

**Structure**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 12.50,
    "date": "2023-11-20",
    "category": "Food",
    "description": "Lunch",
    "createdAt": 1700485200000
  }
]
```

## State Management (React Context)

**State Shape**:
```javascript
{
  expenses: Expense[], // Array of Expense objects
  currentView: 'dashboard' | 'add-expense', // Current UI view
  error: string | null // Global error message
}
```

**Actions**:
- `ADD_EXPENSE`: Appends new expense to list.
- `SET_VIEW`: Changes current view.
- `CLEAR_ERROR`: Resets error state.
- `LOAD_EXPENSES`: Replaces state with loaded data (startup).

