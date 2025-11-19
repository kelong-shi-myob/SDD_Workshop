/**
 * localStorage Adapter
 * 
 * Abstraction layer for browser localStorage operations.
 * Handles expense and preference storage with proper error handling and versioning.
 */

import { v4 as uuidv4 } from 'uuid';
import type { Expense, CreateExpenseInput, UpdateExpenseInput } from '@/types/expense';
import type { UserPreferences } from '@/types/preferences';
import { DEFAULT_PREFERENCES } from '@/types/preferences';

// localStorage keys with namespace
const STORAGE_KEYS = {
  EXPENSES: 'sdd_workshop_expense_tracker_expenses',
  PREFERENCES: 'sdd_workshop_expense_tracker_preferences',
  VERSION: 'sdd_workshop_expense_tracker_version',
} as const;

const STORAGE_VERSION = '1.0.0';

/**
 * Get all expenses from localStorage
 * 
 * @returns Array of expenses (empty array if none exist or data is corrupted)
 */
export function getExpenses(): Expense[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!data) return [];

    const parsed = JSON.parse(data);
    
    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      console.error('Invalid expenses data format');
      return [];
    }

    return parsed;
  } catch (error) {
    console.error('Error reading expenses from localStorage:', error);
    return [];
  }
}

/**
 * Save expenses to localStorage
 * 
 * @param expenses - Array of expenses to save
 * @throws Error if storage quota is exceeded
 */
export function setExpenses(expenses: Expense[]): void {
  try {
    const data = JSON.stringify(expenses);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, data);
    localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some expenses or export your data.');
    }
    throw error;
  }
}

/**
 * Add a new expense
 * 
 * @param input - Expense data without ID and timestamps
 * @returns The created expense with generated ID and timestamps
 */
export function addExpense(input: CreateExpenseInput): Expense {
  const now = new Date().toISOString();
  
  const newExpense: Expense = {
    id: uuidv4(),
    amount: input.amount,
    date: input.date,
    category: input.category,
    description: input.description,
    createdAt: now,
    updatedAt: now,
  };

  const expenses = getExpenses();
  expenses.push(newExpense);
  setExpenses(expenses);

  return newExpense;
}

/**
 * Update an existing expense
 * 
 * @param id - ID of the expense to update
 * @param updates - Partial expense data to update
 * @returns Updated expense or null if not found
 */
export function updateExpense(id: string, updates: UpdateExpenseInput): Expense | null {
  const expenses = getExpenses();
  const index = expenses.findIndex((expense) => expense.id === id);

  if (index === -1) {
    return null;
  }

  const updatedExpense: Expense = {
    ...expenses[index]!,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  expenses[index] = updatedExpense;
  setExpenses(expenses);

  return updatedExpense;
}

/**
 * Delete an expense by ID
 * 
 * @param id - ID of the expense to delete
 * @returns true if deleted, false if not found
 */
export function deleteExpense(id: string): boolean {
  const expenses = getExpenses();
  const filteredExpenses = expenses.filter((expense) => expense.id !== id);

  if (filteredExpenses.length === expenses.length) {
    return false; // Expense not found
  }

  setExpenses(filteredExpenses);
  return true;
}

/**
 * Get user preferences from localStorage
 * 
 * @returns User preferences (defaults if none exist or data is corrupted)
 */
export function getPreferences(): UserPreferences {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!data) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(data);
    
    // Validate structure
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'theme' in parsed &&
      'language' in parsed
    ) {
      return parsed as UserPreferences;
    }

    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error reading preferences from localStorage:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save user preferences to localStorage
 * 
 * @param preferences - User preferences to save
 */
export function setPreferences(preferences: UserPreferences): void {
  try {
    const data = JSON.stringify(preferences);
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, data);
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
    throw error;
  }
}

/**
 * Clear all expense tracker data from localStorage
 * 
 * Removes expenses, preferences, and version data.
 * Does not affect other applications' localStorage data.
 */
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.EXPENSES);
  localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  localStorage.removeItem(STORAGE_KEYS.VERSION);
}

/**
 * Export expenses to CSV format
 * 
 * @returns CSV string with headers and expense data
 */
export function exportToCSV(): string {
  const expenses = getExpenses();
  const headers = 'ID,Amount,Date,Category,Description,Created At,Updated At\n';

  if (expenses.length === 0) {
    return headers;
  }

  const rows = expenses.map((expense) => {
    // Escape CSV special characters in description
    const description = expense.description || '';
    const escapedDescription = description.includes(',') || description.includes('"')
      ? `"${description.replace(/"/g, '""')}"`
      : description;

    return [
      expense.id,
      expense.amount,
      expense.date,
      expense.category,
      escapedDescription,
      expense.createdAt,
      expense.updatedAt,
    ].join(',');
  });

  return headers + rows.join('\n') + '\n';
}

/**
 * Get storage version
 * 
 * @returns Current storage version or null if not set
 */
export function getStorageVersion(): string | null {
  return localStorage.getItem(STORAGE_KEYS.VERSION);
}

