/**
 * Validation Tests
 * 
 * Tests for Zod validation schemas used in expense forms.
 * Tests cover: required fields, data types, constraints, error messages.
 */

import { describe, it, expect } from 'vitest';
import {
  expenseSchema,
  updateExpenseSchema,
  validateExpense,
  validateExpenseUpdate,
} from '../validation';

describe('Validation Schemas', () => {
  describe('expenseSchema', () => {
    it('should validate a complete valid expense', () => {
      const validExpense = {
        amount: 50.99,
        date: '2025-01-15',
        category: 'Food',
        description: 'Lunch at restaurant',
      };

      const result = expenseSchema.safeParse(validExpense);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validExpense);
      }
    });

    it('should validate expense without description', () => {
      const validExpense = {
        amount: 100,
        date: '2025-01-20',
        category: 'Transport',
      };

      const result = expenseSchema.safeParse(validExpense);
      expect(result.success).toBe(true);
    });

    it('should validate expense with empty description', () => {
      const validExpense = {
        amount: 25.5,
        date: '2025-01-18',
        category: 'Entertainment',
        description: '',
      };

      const result = expenseSchema.safeParse(validExpense);
      expect(result.success).toBe(true);
    });

    describe('amount validation', () => {
      it('should reject missing amount', () => {
        const invalidExpense = {
          date: '2025-01-15',
          category: 'Food',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]?.message).toContain('validation');
        }
      });

      it('should reject zero amount', () => {
        const invalidExpense = {
          amount: 0,
          date: '2025-01-15',
          category: 'Food',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]?.message).toContain('positive');
        }
      });

      it('should reject negative amount', () => {
        const invalidExpense = {
          amount: -50,
          date: '2025-01-15',
          category: 'Food',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
      });

      it('should reject non-number amount', () => {
        const invalidExpense = {
          amount: 'fifty',
          date: '2025-01-15',
          category: 'Food',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
      });

      it('should accept amount with 1 decimal place', () => {
        const validExpense = {
          amount: 50.5,
          date: '2025-01-15',
          category: 'Food',
        };

        const result = expenseSchema.safeParse(validExpense);
        expect(result.success).toBe(true);
      });

      it('should accept amount with 2 decimal places', () => {
        const validExpense = {
          amount: 50.99,
          date: '2025-01-15',
          category: 'Food',
        };

        const result = expenseSchema.safeParse(validExpense);
        expect(result.success).toBe(true);
      });

      it('should reject amount with more than 2 decimal places', () => {
        const invalidExpense = {
          amount: 50.999,
          date: '2025-01-15',
          category: 'Food',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]?.message).toContain('2 decimal places');
        }
      });

      it('should accept integer amounts', () => {
        const validExpense = {
          amount: 100,
          date: '2025-01-15',
          category: 'Food',
        };

        const result = expenseSchema.safeParse(validExpense);
        expect(result.success).toBe(true);
      });
    });

    describe('date validation', () => {
      it('should reject missing date', () => {
        const invalidExpense = {
          amount: 50,
          category: 'Food',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
      });

      it('should accept valid YYYY-MM-DD format', () => {
        const validExpense = {
          amount: 50,
          date: '2025-01-15',
          category: 'Food',
        };

        const result = expenseSchema.safeParse(validExpense);
        expect(result.success).toBe(true);
      });

      it('should reject invalid date format (MM/DD/YYYY)', () => {
        const invalidExpense = {
          amount: 50,
          date: '01/15/2025',
          category: 'Food',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
      });

      it('should reject invalid date format (DD-MM-YYYY)', () => {
        const invalidExpense = {
          amount: 50,
          date: '15-01-2025',
          category: 'Food',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
      });

      it('should reject invalid date (not a real date)', () => {
        const invalidExpense = {
          amount: 50,
          date: '2025-02-30', // February doesn't have 30 days
          category: 'Food',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
      });

      it('should reject non-string date', () => {
        const invalidExpense = {
          amount: 50,
          date: 20250115,
          category: 'Food',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
      });
    });

    describe('category validation', () => {
      it('should reject missing category', () => {
        const invalidExpense = {
          amount: 50,
          date: '2025-01-15',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
      });

      it('should accept all valid categories', () => {
        const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

        categories.forEach((category) => {
          const validExpense = {
            amount: 50,
            date: '2025-01-15',
            category,
          };

          const result = expenseSchema.safeParse(validExpense);
          expect(result.success).toBe(true);
        });
      });

      it('should reject invalid category', () => {
        const invalidExpense = {
          amount: 50,
          date: '2025-01-15',
          category: 'InvalidCategory',
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
      });
    });

    describe('description validation', () => {
      it('should accept description up to 500 characters', () => {
        const validExpense = {
          amount: 50,
          date: '2025-01-15',
          category: 'Food',
          description: 'A'.repeat(500),
        };

        const result = expenseSchema.safeParse(validExpense);
        expect(result.success).toBe(true);
      });

      it('should reject description over 500 characters', () => {
        const invalidExpense = {
          amount: 50,
          date: '2025-01-15',
          category: 'Food',
          description: 'A'.repeat(501),
        };

        const result = expenseSchema.safeParse(invalidExpense);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]?.message).toContain('500 characters');
        }
      });
    });
  });

  describe('updateExpenseSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        amount: 75,
      };

      const result = updateExpenseSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow updating only category', () => {
      const partialUpdate = {
        category: 'Transport',
      };

      const result = updateExpenseSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow empty object', () => {
      const emptyUpdate = {};

      const result = updateExpenseSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });

    it('should still validate constraints on provided fields', () => {
      const invalidUpdate = {
        amount: -50,
      };

      const result = updateExpenseSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('should validate date format if date is provided', () => {
      const invalidUpdate = {
        date: '01/15/2025',
      };

      const result = updateExpenseSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });

  describe('validateExpense helper', () => {
    it('should return success for valid expense', () => {
      const validData = {
        amount: 50.99,
        date: '2025-01-15',
        category: 'Food',
      };

      const result = validateExpense(validData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.amount).toBe(50.99);
      }
    });

    it('should return error for invalid expense', () => {
      const invalidData = {
        amount: -50,
        date: '2025-01-15',
        category: 'Food',
      };

      const result = validateExpense(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('validateExpenseUpdate helper', () => {
    it('should return success for valid partial update', () => {
      const validUpdate = {
        amount: 100,
      };

      const result = validateExpenseUpdate(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should return error for invalid partial update', () => {
      const invalidUpdate = {
        amount: 0,
      };

      const result = validateExpenseUpdate(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});

