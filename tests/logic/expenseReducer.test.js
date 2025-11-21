import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { expenseReducer, initialState } from '../../src/context/expenseReducer.js';

describe('Expense Reducer - CRUD Operations', () => {
  const sampleExpense = {
    id: '123',
    amount: 100,
    category: 'Food',
    date: '2023-10-01',
    description: 'Groceries'
  };

  const stateWithExpense = {
    ...initialState,
    expenses: [sampleExpense]
  };

  it('should handle DELETE_EXPENSE', () => {
    const action = {
      type: 'DELETE_EXPENSE',
      payload: { id: '123' }
    };

    const newState = expenseReducer(stateWithExpense, action);
    assert.equal(newState.expenses.length, 0);
  });

  it('should not change state if DELETE_EXPENSE id is not found', () => {
    const action = {
      type: 'DELETE_EXPENSE',
      payload: { id: '999' }
    };

    const newState = expenseReducer(stateWithExpense, action);
    assert.equal(newState.expenses.length, 1);
    assert.deepEqual(newState.expenses[0], sampleExpense);
  });

  it('should handle UPDATE_EXPENSE', () => {
    const updates = { amount: 200, description: 'Updated' };
    const action = {
      type: 'UPDATE_EXPENSE',
      payload: { id: '123', updates }
    };

    const newState = expenseReducer(stateWithExpense, action);
    assert.equal(newState.expenses.length, 1);
    assert.equal(newState.expenses[0].amount, 200);
    assert.equal(newState.expenses[0].description, 'Updated');
    assert.equal(newState.expenses[0].category, 'Food'); // Unchanged
  });

  it('should not change state if UPDATE_EXPENSE id is not found', () => {
    const updates = { amount: 200 };
    const action = {
      type: 'UPDATE_EXPENSE',
      payload: { id: '999', updates }
    };

    const newState = expenseReducer(stateWithExpense, action);
    assert.deepEqual(newState, stateWithExpense);
  });

  it('should handle SET_VIEW with optional data', () => {
    const action = {
      type: 'SET_VIEW',
      payload: { view: 'edit-expense', data: { id: '123' } }
    };

    const newState = expenseReducer(initialState, action);
    assert.equal(newState.currentView, 'edit-expense');
    assert.deepEqual(newState.viewData, { id: '123' });
  });
});

