import { describe, it } from 'node:test';
import assert from 'node:assert';

// Validation logic (to be implemented in src/views/AddExpense.jsx or utils)
// We define the contract here first.

const validateExpense = (data) => {
  const errors = {};
  
  if (!data.amount || Number(data.amount) <= 0) {
    errors.amount = 'Amount must be a positive number';
  }
  
  if (!data.date) {
    errors.date = 'Date is required';
  }
  
  if (!data.category) {
    errors.category = 'Category is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

describe('Validation: Expense Input', () => {
  it('should fail if amount is missing or zero', () => {
    const result = validateExpense({ amount: 0, date: '2023-01-01', category: 'Food' });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.amount);
  });

  it('should fail if amount is negative', () => {
    const result = validateExpense({ amount: -5, date: '2023-01-01', category: 'Food' });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.amount);
  });

  it('should fail if date is missing', () => {
    const result = validateExpense({ amount: 10, category: 'Food' });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.date);
  });

  it('should pass with valid data', () => {
    const result = validateExpense({ amount: 10, date: '2023-01-01', category: 'Food' });
    assert.strictEqual(result.isValid, true);
  });
});

