/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext, useEffect } from 'react';
import { addExpense } from '../logic/expenseLogic';

const ExpenseContext = createContext();

const STORAGE_KEY = 'workshop_app_expenses';

const initialState = {
  expenses: []
};

const init = (initialState) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialState;
  } catch (e) {
    console.error('Failed to load expenses from localStorage', e);
    return initialState;
  }
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: addExpense(state.expenses, action.payload)
      };
    default:
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState, init);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save expenses to localStorage', e);
    }
  }, [state]);

  const addExpenseAction = (expense) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  return (
    <ExpenseContext.Provider value={{ state, addExpense: addExpenseAction }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
