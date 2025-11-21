import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { aggregateExpensesByCategory } from '../../src/utils/expenseUtils.js';

describe('Expense Aggregation Logic', () => {
  it('should correctly aggregate expenses by category', () => {
    const input = [
      { category: 'Food', amount: 50 },
      { category: 'Transport', amount: 30 },
      { category: 'Food', amount: 50 },
      { category: 'Entertainment', amount: 20 },
    ];

    const expected = [
      { name: 'Food', value: 100 },
      { name: 'Transport', value: 30 },
      { name: 'Entertainment', value: 20 },
    ];

    const result = aggregateExpensesByCategory(input);
    
    // Sort both to ensure order doesn't affect test match if sort logic isn't strictly enforced yet
    // But requirement says "sorted by value descending", so let's check that too.
    assert.deepEqual(result, expected);
  });

  it('should filter out categories with zero or negative total amounts', () => {
    const input = [
      { category: 'Food', amount: 50 },
      { category: 'Refund', amount: -20 },
      { category: 'Zero', amount: 0 },
    ];

    const expected = [
      { name: 'Food', value: 50 },
    ];

    const result = aggregateExpensesByCategory(input);
    assert.deepEqual(result, expected);
  });

  it('should return empty array for empty input', () => {
    const result = aggregateExpensesByCategory([]);
    assert.deepEqual(result, []);
  });

  it('should sort results by value descending', () => {
    const input = [
      { category: 'Small', amount: 10 },
      { category: 'Large', amount: 100 },
      { category: 'Medium', amount: 50 },
    ];

    const expected = [
      { name: 'Large', value: 100 },
      { name: 'Medium', value: 50 },
      { name: 'Small', value: 10 },
    ];

    const result = aggregateExpensesByCategory(input);
    assert.deepEqual(result, expected);
  });
});

