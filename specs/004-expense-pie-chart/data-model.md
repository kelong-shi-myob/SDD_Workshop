# Data Model: Expense Category Visualization

## Entities

### CategorySummary (Derived)
This entity does not exist in storage but is derived runtime from the `Expense` list for visualization purposes.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | The category name (e.g., "Food"). matches `Expense.category`. |
| `value` | `number` | The total sum of amounts for this category. Must be > 0. |
| `color` | `string` | (Optional) Hex code assigned for visualization. |

## Transformations

### `aggregateExpensesByCategory(expenses: Expense[]): CategorySummary[]`
- **Input**: Array of raw `Expense` objects.
- **Output**: Array of `CategorySummary` objects.
- **Logic**:
    1. Group expenses by `category`.
    2. Sum `amount` for each group.
    3. Filter out categories with `value <= 0`.
    4. Sort by `value` descending (for visual stability).

