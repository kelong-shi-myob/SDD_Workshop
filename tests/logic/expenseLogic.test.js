import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateExpense, calculateCategoryTotals, getRecentExpenses, addExpense } from '../../src/logic/expenseLogic.js';

describe('Expense Logic', () => {
  describe('validateExpense', () => {
    it('should return null for valid expense', () => {
      const valid = { amount: 10, date: '2023-01-01', category: 'Food', description: 'Test' };
      assert.strictEqual(validateExpense(valid), null);
    });

    it('should return error if amount is missing', () => {
       const invalid = { date: '2023-01-01', category: 'Food' };
       assert.ok(validateExpense(invalid));
    });

    it('should return error if amount is <= 0', () => {
       assert.ok(validateExpense({ amount: 0, date: '2023-01-01', category: 'Food' }));
       assert.ok(validateExpense({ amount: -10, date: '2023-01-01', category: 'Food' }));
    });

    it('should return error if date is missing', () => {
       assert.ok(validateExpense({ amount: 10, category: 'Food' }));
    });

    it('should return error if category is missing', () => {
       assert.ok(validateExpense({ amount: 10, date: '2023-01-01' }));
    });
  });

  describe('calculateCategoryTotals', () => {
    it('should sum amounts by category', () => {
      const expenses = [
        { amount: 10, category: 'Food' },
        { amount: 20, category: 'Transport' },
        { amount: 15, category: 'Food' }
      ];
      const totals = calculateCategoryTotals(expenses);
      assert.deepStrictEqual(totals, { Food: 25, Transport: 20 });
    });

    it('should handle empty list', () => {
      assert.deepStrictEqual(calculateCategoryTotals([]), {});
    });
  });

  describe('getRecentExpenses', () => {
    it('should sort by date descending', () => {
      const expenses = [
        { id: 1, date: '2023-01-01' },
        { id: 2, date: '2023-01-03' },
        { id: 3, date: '2023-01-02' }
      ];
      const recent = getRecentExpenses(expenses);
      assert.strictEqual(recent[0].id, 2);
      assert.strictEqual(recent[1].id, 3);
      assert.strictEqual(recent[2].id, 1);
    });

    it('should limit results', () => {
       const expenses = Array.from({ length: 15 }, (_, i) => ({ id: i, date: '2023-01-01' }));
       const recent = getRecentExpenses(expenses, 10);
       assert.strictEqual(recent.length, 10);
    });
  });

  describe('addExpense', () => {
    it('should add expense to list immutably', () => {
      const expenses = [{ id: 1 }];
      const newExpense = { amount: 10 };
      const result = addExpense(expenses, newExpense);
      assert.strictEqual(result.length, 2);
      assert.notStrictEqual(result, expenses);
      assert.ok(result.find(e => e.amount === 10));
    });

    it('should generate id if missing', () => {
        const result = addExpense([], { amount: 10 });
        assert.ok(result[0].id);
    });
  });
});

