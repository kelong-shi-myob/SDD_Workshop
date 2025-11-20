import { describe, it, expect } from 'vitest';
import { calculateCategoryTotals } from '../analytics';
import { Expense } from '../types';

describe('analytics', () => {
  describe('calculateCategoryTotals', () => {
    it('returns empty array for no expenses', () => {
      expect(calculateCategoryTotals([])).toEqual([]);
    });

    it('calculates total for single category', () => {
      const expenses: Expense[] = [
        { id: '1', amount: 10, date: '2025-01-01', category: 'Food', createdAt: 1 },
        { id: '2', amount: 20, date: '2025-01-02', category: 'Food', createdAt: 2 },
      ];
      const result = calculateCategoryTotals(expenses);
      expect(result).toEqual([{ category: 'Food', total: 30 }]);
    });

    it('calculates totals for multiple categories', () => {
      const expenses: Expense[] = [
        { id: '1', amount: 10, date: '2025-01-01', category: 'Food', createdAt: 1 },
        { id: '2', amount: 50, date: '2025-01-02', category: 'Transport', createdAt: 2 },
      ];
      const result = calculateCategoryTotals(expenses);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ category: 'Food', total: 10 });
      expect(result).toContainEqual({ category: 'Transport', total: 50 });
    });

    it('ignores categories with zero total', () => {
      const expenses: Expense[] = [
        { id: '1', amount: 10, date: '2025-01-01', category: 'Food', createdAt: 1 },
      ];
      const result = calculateCategoryTotals(expenses);
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('Food');
      // Should not contain 'Transport' etc.
    });
  });
});

