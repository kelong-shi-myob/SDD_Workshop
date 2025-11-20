# Contract: Storage Service Interface

**Feature**: `002-expense-tracker`
**Type**: Local Interface (TypeScript)

## Overview

Interface for the data access layer wrapping LocalStorage.

## Interface Definition

```typescript
export type Category = 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Health' | 'Other';

export interface Expense {
  id: string;
  amount: number;
  date: string; // ISO Date string YYYY-MM-DD
  category: Category;
  description?: string;
  createdAt: number;
}

export interface StorageService {
  /**
   * Retrieves all expenses from storage.
   * @returns Array of Expense objects or empty array if none.
   */
  getExpenses(): Expense[];

  /**
   * Adds a new expense to storage.
   * @param expense - The expense object to save
   * @throws Error if storage quota exceeded
   */
  addExpense(expense: Expense): void;

  /**
   * Clears all data (debug/reset purpose).
   */
  clearAll(): void;
}
```

## Error Handling

- **QuotaExceededError**: Should be caught by the service and re-thrown as a user-friendly error or handled gracefully.

