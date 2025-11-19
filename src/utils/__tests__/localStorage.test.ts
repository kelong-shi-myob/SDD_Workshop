/**
 * localStorage Adapter Tests
 * 
 * Tests for the localStorage abstraction layer that handles expense and preference storage.
 * Tests cover: CRUD operations, error handling, versioning, quota exceeded scenarios.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getExpenses,
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getPreferences,
  setPreferences,
  clearAllData,
  exportToCSV,
} from '../localStorage';
import type { Expense, CreateExpenseInput } from '@/types/expense';
import type { UserPreferences } from '@/types/preferences';

describe('localStorage Adapter', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getExpenses', () => {
    it('should return empty array when no expenses exist', () => {
      const expenses = getExpenses();
      expect(expenses).toEqual([]);
    });

    it('should return parsed expenses from localStorage', () => {
      const mockExpenses: Expense[] = [
        {
          id: '1',
          amount: 50.00,
          date: '2025-01-15',
          category: 'Food',
          description: 'Lunch',
          createdAt: '2025-01-15T12:00:00Z',
          updatedAt: '2025-01-15T12:00:00Z',
        },
      ];
      localStorage.setItem('sdd_workshop_expense_tracker_expenses', JSON.stringify(mockExpenses));

      const expenses = getExpenses();
      expect(expenses).toEqual(mockExpenses);
    });

    it('should return empty array if localStorage data is invalid JSON', () => {
      localStorage.setItem('sdd_workshop_expense_tracker_expenses', 'invalid json');
      const expenses = getExpenses();
      expect(expenses).toEqual([]);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('sdd_workshop_expense_tracker_expenses', '{"invalid": "data"}');
      const expenses = getExpenses();
      expect(expenses).toEqual([]);
    });
  });

  describe('setExpenses', () => {
    it('should save expenses to localStorage', () => {
      const mockExpenses: Expense[] = [
        {
          id: '1',
          amount: 100.50,
          date: '2025-01-20',
          category: 'Transport',
          createdAt: '2025-01-20T10:00:00Z',
          updatedAt: '2025-01-20T10:00:00Z',
        },
      ];

      setExpenses(mockExpenses);

      const stored = localStorage.getItem('sdd_workshop_expense_tracker_expenses');
      expect(stored).toBe(JSON.stringify(mockExpenses));
    });

    it('should throw QuotaExceededError when storage is full', () => {
      // Mock localStorage.setItem to throw QuotaExceededError
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const mockExpenses: Expense[] = [
        {
          id: '1',
          amount: 50,
          date: '2025-01-15',
          category: 'Food',
          createdAt: '2025-01-15T12:00:00Z',
          updatedAt: '2025-01-15T12:00:00Z',
        },
      ];

      expect(() => setExpenses(mockExpenses)).toThrow('Storage quota exceeded');

      // Restore original setItem
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('addExpense', () => {
    it('should add a new expense with generated ID and timestamps', () => {
      const input: CreateExpenseInput = {
        amount: 75.25,
        date: '2025-01-22',
        category: 'Entertainment',
        description: 'Movie tickets',
      };

      const newExpense = addExpense(input);

      expect(newExpense.id).toBeDefined();
      expect(newExpense.id).toHaveLength(36); // UUID v4 length
      expect(newExpense.amount).toBe(75.25);
      expect(newExpense.date).toBe('2025-01-22');
      expect(newExpense.category).toBe('Entertainment');
      expect(newExpense.description).toBe('Movie tickets');
      expect(newExpense.createdAt).toBeDefined();
      expect(newExpense.updatedAt).toBeDefined();
      expect(newExpense.createdAt).toBe(newExpense.updatedAt);

      // Verify it's saved to localStorage
      const expenses = getExpenses();
      expect(expenses).toHaveLength(1);
      expect(expenses[0]?.id).toBe(newExpense.id);
    });

    it('should add expense without description', () => {
      const input: CreateExpenseInput = {
        amount: 20,
        date: '2025-01-23',
        category: 'Food',
      };

      const newExpense = addExpense(input);

      expect(newExpense.description).toBeUndefined();
      expect(newExpense.amount).toBe(20);
    });

    it('should append to existing expenses', () => {
      const firstExpense = addExpense({
        amount: 10,
        date: '2025-01-01',
        category: 'Food',
      });

      const secondExpense = addExpense({
        amount: 20,
        date: '2025-01-02',
        category: 'Transport',
      });

      const expenses = getExpenses();
      expect(expenses).toHaveLength(2);
      expect(expenses[0]?.id).toBe(firstExpense.id);
      expect(expenses[1]?.id).toBe(secondExpense.id);
    });
  });

  describe('updateExpense', () => {
    it('should update an existing expense and modify updatedAt', () => {
      const expense = addExpense({
        amount: 50,
        date: '2025-01-15',
        category: 'Food',
        description: 'Old description',
      });

      // Wait a bit to ensure updatedAt changes
      const originalUpdatedAt = expense.updatedAt;

      const updated = updateExpense(expense.id, {
        amount: 75,
        description: 'New description',
      });

      expect(updated).toBeDefined();
      expect(updated?.id).toBe(expense.id);
      expect(updated?.amount).toBe(75);
      expect(updated?.description).toBe('New description');
      expect(updated?.category).toBe('Food'); // Unchanged
      expect(updated?.date).toBe('2025-01-15'); // Unchanged
      expect(updated?.createdAt).toBe(expense.createdAt); // Unchanged
      expect(updated?.updatedAt).not.toBe(originalUpdatedAt); // Changed

      // Verify in localStorage
      const expenses = getExpenses();
      expect(expenses[0]?.amount).toBe(75);
    });

    it('should return null if expense not found', () => {
      const result = updateExpense('non-existent-id', { amount: 100 });
      expect(result).toBeNull();
    });

    it('should allow partial updates', () => {
      const expense = addExpense({
        amount: 50,
        date: '2025-01-15',
        category: 'Food',
        description: 'Original',
      });

      const updated = updateExpense(expense.id, {
        category: 'Transport',
      });

      expect(updated?.amount).toBe(50); // Unchanged
      expect(updated?.category).toBe('Transport'); // Changed
      expect(updated?.description).toBe('Original'); // Unchanged
    });
  });

  describe('deleteExpense', () => {
    it('should delete an expense by ID', () => {
      const expense1 = addExpense({ amount: 10, date: '2025-01-01', category: 'Food' });
      const expense2 = addExpense({ amount: 20, date: '2025-01-02', category: 'Transport' });

      const deleted = deleteExpense(expense1.id);

      expect(deleted).toBe(true);

      const expenses = getExpenses();
      expect(expenses).toHaveLength(1);
      expect(expenses[0]?.id).toBe(expense2.id);
    });

    it('should return false if expense not found', () => {
      const deleted = deleteExpense('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('getPreferences', () => {
    it('should return default preferences when none exist', () => {
      const prefs = getPreferences();
      expect(prefs).toEqual({ theme: 'light', language: 'en' });
    });

    it('should return stored preferences', () => {
      const mockPrefs: UserPreferences = { theme: 'dark', language: 'zh' };
      localStorage.setItem('sdd_workshop_expense_tracker_preferences', JSON.stringify(mockPrefs));

      const prefs = getPreferences();
      expect(prefs).toEqual(mockPrefs);
    });

    it('should return default preferences if data is invalid', () => {
      localStorage.setItem('sdd_workshop_expense_tracker_preferences', 'invalid');
      const prefs = getPreferences();
      expect(prefs).toEqual({ theme: 'light', language: 'en' });
    });
  });

  describe('setPreferences', () => {
    it('should save preferences to localStorage', () => {
      const prefs: UserPreferences = { theme: 'dark', language: 'zh' };
      setPreferences(prefs);

      const stored = localStorage.getItem('sdd_workshop_expense_tracker_preferences');
      expect(stored).toBe(JSON.stringify(prefs));
    });

    it('should update existing preferences', () => {
      setPreferences({ theme: 'light', language: 'en' });
      setPreferences({ theme: 'dark', language: 'zh' });

      const prefs = getPreferences();
      expect(prefs.theme).toBe('dark');
      expect(prefs.language).toBe('zh');
    });
  });

  describe('clearAllData', () => {
    it('should remove all expense tracker data from localStorage', () => {
      addExpense({ amount: 50, date: '2025-01-15', category: 'Food' });
      setPreferences({ theme: 'dark', language: 'zh' });

      clearAllData();

      expect(localStorage.getItem('sdd_workshop_expense_tracker_expenses')).toBeNull();
      expect(localStorage.getItem('sdd_workshop_expense_tracker_preferences')).toBeNull();
      expect(localStorage.getItem('sdd_workshop_expense_tracker_version')).toBeNull();
    });

    it('should not affect other localStorage keys', () => {
      localStorage.setItem('other_app_data', 'should remain');
      addExpense({ amount: 50, date: '2025-01-15', category: 'Food' });

      clearAllData();

      expect(localStorage.getItem('other_app_data')).toBe('should remain');
    });
  });

  describe('exportToCSV', () => {
    it('should generate CSV string from expenses', () => {
      addExpense({ amount: 50.5, date: '2025-01-15', category: 'Food', description: 'Lunch' });
      addExpense({ amount: 100, date: '2025-01-16', category: 'Transport' });

      const csv = exportToCSV();

      expect(csv).toContain('ID,Amount,Date,Category,Description,Created At,Updated At');
      expect(csv).toContain('50.5');
      expect(csv).toContain('100');
      expect(csv).toContain('Food');
      expect(csv).toContain('Transport');
      expect(csv).toContain('Lunch');
    });

    it('should return empty CSV with headers when no expenses', () => {
      const csv = exportToCSV();
      expect(csv).toBe('ID,Amount,Date,Category,Description,Created At,Updated At\n');
    });

    it('should escape commas and quotes in descriptions', () => {
      addExpense({
        amount: 25,
        date: '2025-01-15',
        category: 'Food',
        description: 'Dinner, with "special" sauce',
      });

      const csv = exportToCSV();

      expect(csv).toContain('"Dinner, with ""special"" sauce"');
    });
  });
});

