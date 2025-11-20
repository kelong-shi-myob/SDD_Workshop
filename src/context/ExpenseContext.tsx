/**
 * Expense Context
 * 
 * Provides expense management (CRUD operations) across the application.
 * Persists data to localStorage and manages global expense state.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import {
  getExpenses,
  addExpense as addExpenseToStorage,
  updateExpense as updateExpenseInStorage,
  deleteExpense as deleteExpenseFromStorage,
} from '@/utils/localStorage';
import type { Expense, CreateExpenseInput, UpdateExpenseInput } from '@/types/expense';

interface ExpenseContextValue {
  expenses: Expense[];
  sortedExpenses: Expense[];
  isLoading: boolean;
  error: string | null;
  addExpense: (input: CreateExpenseInput) => Promise<Expense>;
  updateExpense: (id: string, updates: UpdateExpenseInput) => Promise<Expense | null>;
  deleteExpense: (id: string) => Promise<boolean>;
  clearError: () => void;
}

const ExpenseContext = createContext<ExpenseContextValue | undefined>(undefined);

interface ExpenseProviderProps {
  children: ReactNode;
}

/**
 * Expense Provider Component
 * 
 * Wraps the application to provide expense context.
 * Loads expenses from localStorage on mount and keeps state synchronized.
 */
export function ExpenseProvider({ children }: ExpenseProviderProps) {
  const [expenses, setExpensesState] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load expenses from localStorage on mount
  useEffect(() => {
    try {
      const loadedExpenses = getExpenses();
      setExpensesState(loadedExpenses);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sort expenses by date descending (most recent first)
  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Descending order
    });
  }, [expenses]);

  /**
   * Add a new expense
   * 
   * @param input - Expense data without ID and timestamps
   * @returns The created expense with generated ID and timestamps
   * @throws Error if storage quota is exceeded
   */
  const addExpense = useCallback(async (input: CreateExpenseInput): Promise<Expense> => {
    try {
      setError(null);
      
      // Add expense to localStorage
      const newExpense = addExpenseToStorage(input);
      
      // Update state
      setExpensesState((prev) => [...prev, newExpense]);
      
      return newExpense;
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('quota') || err.message.includes('QuotaExceededError')) {
          const errorMsg = 'Storage is full. Please delete some expenses or export your data.';
          setError(errorMsg);
          throw new Error(errorMsg);
        }
        setError(err.message);
        throw err;
      }
      const errorMsg = 'Failed to add expense';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Update an existing expense
   * 
   * @param id - ID of the expense to update
   * @param updates - Partial expense data to update
   * @returns Updated expense or null if not found
   */
  const updateExpense = useCallback(async (
    id: string,
    updates: UpdateExpenseInput
  ): Promise<Expense | null> => {
    try {
      setError(null);
      
      // Update expense in localStorage
      const updatedExpense = updateExpenseInStorage(id, updates);
      
      if (!updatedExpense) {
        setError('Expense not found');
        return null;
      }
      
      // Update state
      setExpensesState((prev) =>
        prev.map((expense) => (expense.id === id ? updatedExpense : expense))
      );
      
      return updatedExpense;
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('quota') || err.message.includes('QuotaExceededError')) {
          const errorMsg = 'Storage is full. Please delete some expenses first.';
          setError(errorMsg);
          throw new Error(errorMsg);
        }
        setError(err.message);
        throw err;
      }
      const errorMsg = 'Failed to update expense';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Delete an expense by ID
   * 
   * @param id - ID of the expense to delete
   * @returns true if deleted, false if not found
   */
  const deleteExpense = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      // Delete expense from localStorage
      const success = deleteExpenseFromStorage(id);
      
      if (!success) {
        setError('Expense not found');
        return false;
      }
      
      // Update state
      setExpensesState((prev) => prev.filter((expense) => expense.id !== id));
      
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      const errorMsg = 'Failed to delete expense';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Clear the current error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sdd_workshop_expense_tracker_expenses' && e.newValue) {
        try {
          const updatedExpenses = JSON.parse(e.newValue) as Expense[];
          setExpensesState(updatedExpenses);
        } catch (err) {
          console.error('Error parsing storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value: ExpenseContextValue = {
    expenses,
    sortedExpenses,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    clearError,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

/**
 * Hook to access expense context
 * 
 * @throws Error if used outside ExpenseProvider
 * @returns ExpenseContextValue with expense state and CRUD methods
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { expenses, addExpense } = useExpenses();
 *   
 *   const handleAdd = async () => {
 *     await addExpense({
 *       amount: 50,
 *       date: '2025-01-15',
 *       category: 'Food',
 *       description: 'Lunch',
 *     });
 *   };
 *   
 *   return <div>{expenses.length} expenses</div>;
 * }
 * ```
 */
export function useExpenses(): ExpenseContextValue {
  const context = useContext(ExpenseContext);
  
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  
  return context;
}

