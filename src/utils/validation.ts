/**
 * Validation Utilities
 * 
 * Zod schemas for validating expense form data.
 * Returns translation keys for error messages (not plain text).
 */

import { z } from 'zod';

/**
 * Expense categories enum for validation
 */
const expenseCategoryEnum = z.enum([
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
 * Expense validation schema
 * 
 * Validates all required fields with proper constraints.
 * Error messages are translation keys (not plain English).
 */
export const expenseSchema = z.object({
  amount: z
    .number({ message: 'validation.amountRequired' })
    .positive({ message: 'validation.amountPositive' })
    .refine(
      (val) => {
        // Check if number has at most 2 decimal places
        const decimalPlaces = val.toString().split('.')[1]?.length || 0;
        return decimalPlaces <= 2;
      },
      { message: 'validation.amountDecimalPlaces' }
    ),
  
  date: z
    .string({ message: 'validation.dateRequired' })
    .min(1, { message: 'validation.dateRequired' })
    .refine(
      (dateStr) => {
        // Validate date format YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) return false;
        
        // Validate it's a real date
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date.getTime());
      },
      { message: 'validation.dateInvalid' }
    )
    .refine(
      (dateStr) => {
        // Ensure date is not in the future
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date <= today;
      },
      { message: 'validation.dateFuture' }
    ),
  
  category: expenseCategoryEnum.refine((val) => val !== undefined, {
    message: 'validation.categoryRequired',
  }),
  
  description: z
    .string()
    .max(500, { message: 'validation.descriptionTooLong' })
    .optional()
    .or(z.literal('')),
});

/**
 * Partial update schema (for editing expenses)
 * All fields are optional, but maintain same validation rules
 */
export const updateExpenseSchema = expenseSchema.partial();

/**
 * TypeScript type inferred from schema
 */
export type ExpenseFormData = z.infer<typeof expenseSchema>;

/**
 * TypeScript type for partial updates
 */
export type UpdateExpenseFormData = z.infer<typeof updateExpenseSchema>;

/**
 * Validate expense data and return result
 * 
 * @param data - The expense data to validate
 * @returns Validation result with data or errors
 */
export function validateExpense(data: unknown) {
  return expenseSchema.safeParse(data);
}

/**
 * Validate partial expense update data
 * 
 * @param data - The partial expense data to validate
 * @returns Validation result with data or errors
 */
export function validateExpenseUpdate(data: unknown) {
  return updateExpenseSchema.safeParse(data);
}
