/**
 * Expense Entity Types
 * 
 * Defines the core data structure for expense records in the Personal Expense Tracker.
 * All expenses are stored in browser localStorage and manipulated via React components.
 */

import { z } from 'zod';

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
  
  /** Optional description (max 200 characters) */
  description?: string;
  
  /** Timestamp when expense was created (ISO 8601 datetime) */
  createdAt: string;
  
  /** Timestamp when expense was last updated (ISO 8601 datetime) */
  updatedAt: string;
}

/**
 * Zod schema for Expense validation
 * 
 * Used by React Hook Form with zodResolver for form validation
 */
export const expenseSchema = z.object({
  id: z.string().uuid(),
  amount: z.number()
    .positive("Amount must be a positive number")
    .max(9999999999, "Amount exceeds maximum limit")
    .multipleOf(0.01, "Amount must have at most 2 decimal places"),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine(
      (date) => new Date(date) <= new Date(),
      "Date cannot be in the future"
    ),
  category: z.enum([
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Bills',
    'Healthcare',
    'Education',
    'Other'
  ]),
  description: z.string()
    .max(200, "Description must be 200 characters or less")
    .optional()
    .or(z.literal('')), // Allow empty string
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

/**
 * Type inferred from Zod schema (ensures consistency)
 */
export type ExpenseValidated = z.infer<typeof expenseSchema>;

/**
 * Form input type for creating a new expense
 * (excludes auto-generated fields: id, createdAt, updatedAt)
 */
export type ExpenseFormInput = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Form input type for updating an existing expense
 * (all fields optional except ID)
 */
export type ExpenseUpdateInput = Partial<ExpenseFormInput> & { id: string };

/**
 * Category Summary (derived entity, not stored)
 * 
 * Calculated from expense array for dashboard display.
 * Sorted by totalAmount descending (highest spending first).
 */
export interface CategorySummary {
  /** Category name */
  category: ExpenseCategory;
  
  /** Sum of all expense amounts in this category */
  totalAmount: number;
  
  /** Number of expenses in this category */
  expenseCount: number;
}

/**
 * Utility function to calculate category summaries from expenses
 * 
 * @param expenses - Array of expenses to summarize
 * @returns Array of CategorySummary objects sorted by totalAmount descending
 */
export function calculateCategorySummaries(expenses: Expense[]): CategorySummary[] {
  const summaryMap = new Map<ExpenseCategory, CategorySummary>();

  expenses.forEach(expense => {
    const existing = summaryMap.get(expense.category);
    if (existing) {
      existing.totalAmount += expense.amount;
      existing.expenseCount += 1;
    } else {
      summaryMap.set(expense.category, {
        category: expense.category,
        totalAmount: expense.amount,
        expenseCount: 1
      });
    }
  });

  // Sort by totalAmount descending (highest spending first)
  return Array.from(summaryMap.values())
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * Utility function to generate a new expense with auto-generated fields
 * 
 * @param input - Expense form input (amount, date, category, description)
 * @returns Complete Expense object with id, createdAt, updatedAt
 */
export function createExpense(input: ExpenseFormInput): Expense {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(), // Browser-native UUID v4 generator
    ...input,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Utility function to update an expense with new updatedAt timestamp
 * 
 * @param existing - Current expense object
 * @param updates - Fields to update
 * @returns Updated Expense object
 */
export function updateExpense(
  existing: Expense,
  updates: Partial<ExpenseFormInput>
): Expense {
  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
}

