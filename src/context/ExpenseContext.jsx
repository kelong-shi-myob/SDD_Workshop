import { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { expenseReducer, initialState } from './expenseReducer.js';

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const [storedExpenses, setStoredExpenses] = useLocalStorage('data', []);
  const [state, dispatch] = useReducer(expenseReducer, {
    ...initialState,
    expenses: storedExpenses
  });

  // Sync state changes back to localStorage
  useEffect(() => {
    setStoredExpenses(state.expenses);
  }, [state.expenses, setStoredExpenses]);

  // Actions
  const loadExpenses = (data) => dispatch({ type: 'LOAD_EXPENSES', payload: data });
  const addExpense = (expense) => dispatch({ type: 'ADD_EXPENSE', payload: expense });
  const deleteExpense = (id) => dispatch({ type: 'DELETE_EXPENSE', payload: { id } });
  const updateExpense = (id, updates) => dispatch({ type: 'UPDATE_EXPENSE', payload: { id, updates } });
  const setView = (view, data = null) => dispatch({ type: 'SET_VIEW', payload: { view, data } });
  const setError = (error) => dispatch({ type: 'SET_ERROR', payload: error });

  return (
    <ExpenseContext.Provider value={{ 
      state, 
      dispatch, 
      actions: { 
        loadExpenses, 
        addExpense, 
        deleteExpense, 
        updateExpense, 
        setView, 
        setError 
      } 
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}

