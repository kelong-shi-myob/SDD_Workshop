import { describe, it } from 'node:test';
import assert from 'node:assert';

const calculateCategoryTotals = (expenses) => {
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

describe('Calculations: Category Totals', () => {
  it('should calculate correct totals for multiple categories', () => {
    const expenses = [
      { category: 'Food', amount: 10 },
      { category: 'Food', amount: 5.50 },
      { category: 'Transport', amount: 20 }
    ];
    
    const totals = calculateCategoryTotals(expenses);
    
    assert.strictEqual(totals['Food'], 15.50);
    assert.strictEqual(totals['Transport'], 20);
  });

  it('should return empty object for no expenses', () => {
    const totals = calculateCategoryTotals([]);
    assert.deepStrictEqual(totals, {});
  });

  it('should handle single category', () => {
    const expenses = [{ category: 'Food', amount: 10 }];
    const totals = calculateCategoryTotals(expenses);
    assert.strictEqual(totals['Food'], 10);
  });
});

