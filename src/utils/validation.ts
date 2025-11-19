/**
 * Validation Utilities
 * 
 * Zod schemas for runtime validation of expense data and form inputs.
 * Used by react-hook-form for client-side validation.
 */

import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '@/types/expense';

/**
 * Expense category validation schema
 */
export const expenseCategorySchema = z.enum([
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other',
]);

/**
 * Expense creation validation schema
 * 
 * Validates all required fields for creating a new expense:
 * - amount: positive number with max 2 decimal places
 * - date: valid date string (YYYY-MM-DD format)
 * - category: one of the predefined categories
 * - description: optional string (no min length, max 500 chars)
 */
export const expenseSchema = z.object({
  amount: z
    .number({
      required_error: 'validation.required',
      invalid_type_error: 'validation.invalidAmount',
    })
    .positive({ message: 'validation.amountPositive' })
    .refine(
      (val) => {
        // Check for max 2 decimal places
        const str = val.toString();
        const decimalIndex = str.indexOf('.');
        if (decimalIndex === -1) return true;
        return str.length - decimalIndex - 1 <= 2;
      },
      { message: 'Amount must have at most 2 decimal places' }
    ),
  
  date: z
    .string({
      required_error: 'validation.required',
    })
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      { message: 'validation.invalidDate' }
    )
    .refine(
      (dateStr) => {
        // Validate that it's a real date
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
      },
      { message: 'validation.invalidDate' }
    ),
  
  category: expenseCategorySchema,
  
  description: z
    .string()
    .max(500, { message: 'Description must be at most 500 characters' })
    .optional()
    .or(z.literal('')),
});

/**
 * Expense update validation schema
 * All fields optional (partial update support)
 */
export const updateExpenseSchema = expenseSchema.partial();

/**
 * Type inference from Zod schemas
 */
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type UpdateExpenseFormData = z.infer<typeof updateExpenseSchema>;

/**
 * Validate expense data
 * 
 * @param data - The data to validate
 * @returns Validation result with parsed data or errors
 */
export function validateExpense(data: unknown) {
  return expenseSchema.safeParse(data);
}

/**
 * Validate partial expense data (for updates)
 * 
 * @param data - The data to validate
 * @returns Validation result with parsed data or errors
 */
export function validateExpenseUpdate(data: unknown) {
  return updateExpenseSchema.safeParse(data);
}

