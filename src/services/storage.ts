import { Expense } from '../lib/types';

const STORAGE_KEY = 'sdd_workshop_expense_tracker_v1_expenses';

export const StorageService = {
  getExpenses(): Expense[] {
    if (typeof window === 'undefined') return [];
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Failed to load expenses', error);
      return [];
    }
  },

  addExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    const newExpenses = [...expenses, expense];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage limit exceeded. Cannot save new expense.');
      }
      throw error;
    }
  },

  clearAll(): void {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

