import { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const ExpenseContext = createContext(null);

const initialState = {
  expenses: [],
  currentView: 'dashboard', // 'dashboard' | 'add-expense'
  error: null
};

function expenseReducer(state, action) {
  switch (action.type) {
    case 'LOAD_EXPENSES':
      return {
        ...state,
        expenses: action.payload
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses], // Add new to start of list
        currentView: 'dashboard', // Auto-redirect to dashboard
        error: null
      };
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}

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
  const setView = (view) => dispatch({ type: 'SET_VIEW', payload: view });
  const setError = (error) => dispatch({ type: 'SET_ERROR', payload: error });

  return (
    <ExpenseContext.Provider value={{ state, dispatch, actions: { loadExpenses, addExpense, setView, setError } }}>
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

