# Data Model: Edit and Remove Expense Records

## Entities

### Expense (Modified)
No schema changes required, but `id` becomes critical for CRUD operations.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (UUID). **Immutable**. |
| `amount` | `number` | Cost value. |
| `date` | `string` | ISO Date string. |
| `category` | `string` | One of fixed categories. |
| `description` | `string` | Optional text. |

## State Transformations

### Reducer Actions

#### `DELETE_EXPENSE`
- **Payload**: `{ id: string }`
- **Effect**: Removes the item with matching ID from the `expenses` array.

#### `UPDATE_EXPENSE`
- **Payload**: `{ id: string, updates: Partial<Expense> }`
- **Effect**: Finds item by ID and merges `updates`.

#### `SET_VIEW` (Modified)
- **Payload**: `{ view: string, data?: any }`
- **Effect**: Updates `currentView` and optionally sets temporary UI state (e.g. `editingExpenseId`).

