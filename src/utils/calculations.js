export const calculateCategoryTotals = (expenses) => {
  const totals = {};
  
  expenses.forEach(expense => {
    const { category, amount } = expense;
    if (!totals[category]) {
      totals[category] = 0;
    }
    totals[category] += Number(amount);
  });
  
  return totals;
};

