# Quickstart: Expense Pie Chart

## Prerequisites
The `recharts` library must be installed:

```bash
npm install recharts
```

## Usage

### 1. Aggregation Utility
Use the helper to prepare data:

```javascript
import { aggregateExpensesByCategory } from '../utils/expenseUtils';

const chartData = aggregateExpensesByCategory(expenses);
```

### 2. Component Implementation
The component encapsulates the Recharts logic:

```javascript
import { ExpensePieChart } from '../components/ExpensePieChart';

// In your Dashboard
<ExpensePieChart data={chartData} />
```

### 3. Layout Integration
Place the chart above the list in `App.jsx`:

```jsx
<main className="container">
  <ExpensePieChart data={summaryData} />
  <ExpenseList expenses={recentExpenses} />
</main>
```

