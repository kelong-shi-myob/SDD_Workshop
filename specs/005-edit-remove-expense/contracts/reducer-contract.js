/**
 * Contract for Reducer Actions related to CRUD.
 */

export const REDUCER_CONTRACT = {
  DELETE_EXPENSE: {
    type: 'DELETE_EXPENSE',
    payload: { id: 'string' },
    description: 'Removes expense by ID'
  },
  UPDATE_EXPENSE: {
    type: 'UPDATE_EXPENSE',
    payload: { 
      id: 'string', 
      expense: { 
        amount: 'number', 
        date: 'string', 
        category: 'string', 
        description: 'string' 
      } 
    },
    description: 'Updates existing expense'
  },
  SET_VIEW: {
    type: 'SET_VIEW',
    payload: { 
      view: 'string', // 'dashboard' | 'add-expense' | 'edit-expense'
      expenseId: 'string (optional)' // ID of expense to edit
    },
    description: 'Navigates to view, optionally with context'
  }
};

