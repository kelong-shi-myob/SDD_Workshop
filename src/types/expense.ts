/**
 * Expense Entity Types
 * 
 * Defines the core data structure for expense records in the Personal Expense Tracker.
 * All expenses are stored in browser localStorage and manipulated via React components.
 */

/**
 * Predefined expense categories
 */
export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Healthcare'
  | 'Education'
  | 'Other';

/**
 * Array of all valid expense categories (for dropdowns, validation)
 */
export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other',
] as const;

/**
 * Core Expense entity
 * 
 * Represents a single spending transaction with metadata.
 * Stored in localStorage as part of ExpenseStorage array.
 */
export interface Expense {
  /** Unique identifier (UUID v4) */
  id: string;
  
  /** Monetary amount (positive number, max 2 decimal places) */
  amount: number;
  
  /** Date of expense in ISO 8601 format (YYYY-MM-DD) */
  date: string;
  
  /** Category classification */
  category: ExpenseCategory;
  
  /** Optional user-provided note about the expense */
  description?: string;
  
  /** Timestamp when expense was created (ISO 8601) */
  createdAt: string;
  
  /** Timestamp of last modification (ISO 8601) */
  updatedAt: string;
}

/**
 * Input data for creating a new expense (before ID and timestamps are added)
 */
export interface CreateExpenseInput {
  amount: number;
  date: string;
  category: ExpenseCategory;
  description?: string;
}

/**
 * Input data for updating an existing expense
 */
export interface UpdateExpenseInput {
  amount?: number;
  date?: string;
  category?: ExpenseCategory;
  description?: string;
}

/**
 * Category-wise expense summary
 * Used for dashboard aggregations
 */
export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  count: number;
}

