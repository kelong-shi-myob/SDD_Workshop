export const validateExpense = (expense) => {
  if (expense.amount === undefined || expense.amount === null || Number(expense.amount) <= 0) {
    return 'Amount must be greater than 0';
  }
  if (!expense.date) {
    return 'Date is required';
  }
  if (!expense.category) {
    return 'Category is required';
  }
  return null;
};

export const calculateCategoryTotals = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    if (!category) return acc;
    acc[category] = (acc[category] || 0) + Number(amount);
    return acc;
  }, {});
};

export const getRecentExpenses = (expenses, limit = 10) => {
  return [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

export const addExpense = (expenses, newExpense) => {
  const expenseToAdd = {
    ...newExpense,
    id: newExpense.id || crypto.randomUUID(),
    amount: Number(newExpense.amount)
  };
  return [...expenses, expenseToAdd];
};
