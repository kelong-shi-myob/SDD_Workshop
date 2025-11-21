/**
 * Aggregates an array of expense objects by category.
 * 
 * @param {Array<{category: string, amount: number}>} expenses - Raw expense data
 * @returns {Array<{name: string, value: number}>} - Aggregated data sorted by value desc
 */
export const aggregateExpensesByCategory = (expenses) => {
  if (!expenses || expenses.length === 0) return [];

  const totals = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    // Convert amount to number to ensure safe math, treat invalid as 0
    const val = Number(amount) || 0;
    
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += val;
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);
};

