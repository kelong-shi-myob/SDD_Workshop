# Quickstart: Personal Expense Tracker

**Feature**: `002-expense-tracker`

## Setup

1. **Install Dependencies**:
   ```bash
   npm install lucide-react date-fns clsx tailwind-merge
   # shadcn components (via CLI)
   npx shadcn-ui@latest add button input label select dialog card table
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Usage

1. **Add Expense**:
   - Click "Add Expense" button on top right.
   - Fill in Amount, Date, Category.
   - Click "Save".

2. **View Dashboard**:
   - "Recent Expenses" table shows last 10 items.
   - "Category Summary" cards show totals.

## Troubleshooting

- **Data not saving**: Check browser LocalStorage quota.
- **Reset Data**: Clear LocalStorage key `sdd_workshop_expense_tracker_v1_expenses` via DevTools application tab.

