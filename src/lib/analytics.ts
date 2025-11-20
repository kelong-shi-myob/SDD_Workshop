import { Expense, Category, CATEGORIES } from './types';

export type CategoryTotal = {
  category: Category;
  total: number;
};

export function calculateCategoryTotals(expenses: Expense[]): CategoryTotal[] {
  const totals: Partial<Record<Category, number>> = {};
  
  // Initialize
  CATEGORIES.forEach(cat => totals[cat] = 0);
  
  // Sum
  expenses.forEach(expense => {
    if (totals[expense.category] !== undefined) {
      totals[expense.category]! += expense.amount;
    }
  });
  
  // Convert to array and filter
  return CATEGORIES
    .map(category => ({
      category,
      total: totals[category] || 0
    }))
    .filter(item => item.total > 0);
}

