/**
 * Expense CRUD Integration Tests
 * 
 * End-to-end tests for creating, reading, updating, and deleting expenses.
 * Tests persistence to localStorage and data consistency.
 * 
 * TDD: These tests should FAIL before implementation.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import '@/i18n/config';
import type { Expense } from '@/types/expense';

// Test wrapper with all necessary providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ExpenseProvider>{children}</ExpenseProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

// Mock Dashboard component for testing
function MockDashboard() {
  return (
    <div>
      <h1>Expense Tracker Dashboard</h1>
      <button>Add Expense</button>
      <div data-testid="expense-list">Expense List</div>
    </div>
  );
}

describe('Expense CRUD - Create', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create expense and persist to localStorage', async () => {
    const user = userEvent.setup();
    
    // Render app with providers
    render(<MockDashboard />, { wrapper: TestWrapper });

    // Verify localStorage is empty initially
    expect(localStorage.getItem('sdd_workshop_expense_tracker_expenses')).toBeNull();

    // Click "Add Expense" button
    const addButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(addButton);

    // Wait for form dialog to open
    await waitFor(() => {
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    });

    // Fill form
    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '45.50');

    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-11-19');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const foodOption = screen.getByRole('option', { name: /food/i });
    await user.click(foodOption);

    const descriptionTextarea = screen.getByLabelText(/description/i);
    await user.type(descriptionTextarea, 'Test expense');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    // Verify expense was saved to localStorage
    await waitFor(() => {
      const stored = localStorage.getItem('sdd_workshop_expense_tracker_expenses');
      expect(stored).not.toBeNull();

      const expenses: Expense[] = JSON.parse(stored!);
      expect(expenses).toHaveLength(1);
      expect(expenses[0]).toMatchObject({
        amount: 45.50,
        date: '2025-11-19',
        category: 'Food',
        description: 'Test expense',
      });
      expect(expenses[0]?.id).toBeDefined();
      expect(expenses[0]?.createdAt).toBeDefined();
      expect(expenses[0]?.updatedAt).toBeDefined();
    });
  });

  it('should persist expense across page refresh', async () => {
    // Create expense
    const expense: Expense = {
      id: 'test-id-123',
      amount: 100,
      date: '2025-01-15',
      category: 'Transport',
      description: 'Taxi ride',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      'sdd_workshop_expense_tracker_expenses',
      JSON.stringify([expense])
    );

    // Simulate page refresh by re-rendering
    const { unmount } = render(<MockDashboard />, { wrapper: TestWrapper });
    
    // Verify expense list shows the expense
    await waitFor(() => {
      expect(screen.getByTestId('expense-list')).toBeInTheDocument();
    });

    // Unmount (simulate navigation away)
    unmount();

    // Re-render (simulate coming back)
    render(<MockDashboard />, { wrapper: TestWrapper });

    // Verify expense is still in localStorage
    const stored = localStorage.getItem('sdd_workshop_expense_tracker_expenses');
    expect(stored).not.toBeNull();

    const expenses: Expense[] = JSON.parse(stored!);
    expect(expenses).toHaveLength(1);
    expect(expenses[0]).toMatchObject(expense);
  });

  it('should handle QuotaExceededError gracefully', async () => {
    const user = userEvent.setup();

    // Mock localStorage.setItem to throw QuotaExceededError
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      const error = new Error('QuotaExceededError');
      error.name = 'QuotaExceededError';
      throw error;
    });

    render(<MockDashboard />, { wrapper: TestWrapper });

    // Try to add expense
    const addButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    });

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '50');

    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-01-15');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const foodOption = screen.getByRole('option', { name: /food/i });
    await user.click(foodOption);

    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/storage.*full|quota.*exceeded/i)).toBeInTheDocument();
    });

    // Restore original setItem
    Storage.prototype.setItem = originalSetItem;
  });

  it('should validate expense data before saving', async () => {
    const user = userEvent.setup();
    
    render(<MockDashboard />, { wrapper: TestWrapper });

    const addButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    });

    // Try to submit with negative amount
    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '-100');

    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-01-15');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const foodOption = screen.getByRole('option', { name: /food/i });
    await user.click(foodOption);

    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    // Verify validation error is shown
    await waitFor(() => {
      expect(screen.getByText(/amount.*positive/i)).toBeInTheDocument();
    });

    // Verify nothing was saved to localStorage
    expect(localStorage.getItem('sdd_workshop_expense_tracker_expenses')).toBeNull();
  });
});

describe('Expense CRUD - Update', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should update expense and persist changes to localStorage', async () => {
    const user = userEvent.setup();

    // Pre-populate with an expense
    const expense: Expense = {
      id: 'expense-1',
      amount: 50,
      date: '2025-01-10',
      category: 'Food',
      description: 'Original description',
      createdAt: '2025-01-10T10:00:00Z',
      updatedAt: '2025-01-10T10:00:00Z',
    };

    localStorage.setItem(
      'sdd_workshop_expense_tracker_expenses',
      JSON.stringify([expense])
    );

    render(<MockDashboard />, { wrapper: TestWrapper });

    // Click edit button for the expense
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    // Wait for form to open with pre-filled data
    await waitFor(() => {
      const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement;
      expect(amountInput.value).toBe('50');
    });

    // Modify amount and category
    const amountInput = screen.getByLabelText(/amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, '75.25');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const entertainmentOption = screen.getByRole('option', { name: /entertainment/i });
    await user.click(entertainmentOption);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    // Verify expense was updated in localStorage
    await waitFor(() => {
      const stored = localStorage.getItem('sdd_workshop_expense_tracker_expenses');
      const expenses: Expense[] = JSON.parse(stored!);

      expect(expenses).toHaveLength(1);
      expect(expenses[0]).toMatchObject({
        id: 'expense-1',
        amount: 75.25,
        category: 'Entertainment',
        description: 'Original description',
      });
      expect(expenses[0]?.updatedAt).not.toBe(expense.updatedAt);
    });
  });

  it('should recalculate category totals after update', async () => {
    const user = userEvent.setup();

    // Pre-populate with expenses
    const expenses: Expense[] = [
      {
        id: 'expense-1',
        amount: 50,
        date: '2025-01-10',
        category: 'Food',
        description: 'Lunch',
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z',
      },
      {
        id: 'expense-2',
        amount: 30,
        date: '2025-01-11',
        category: 'Food',
        description: 'Dinner',
        createdAt: '2025-01-11T10:00:00Z',
        updatedAt: '2025-01-11T10:00:00Z',
      },
    ];

    localStorage.setItem(
      'sdd_workshop_expense_tracker_expenses',
      JSON.stringify(expenses)
    );

    render(<MockDashboard />, { wrapper: TestWrapper });

    // Verify initial Food category total
    await waitFor(() => {
      expect(screen.getByText(/Food.*80/)).toBeInTheDocument();
    });

    // Edit first expense to change category
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]!);

    await waitFor(() => {
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    });

    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const transportOption = screen.getByRole('option', { name: /transport/i });
    await user.click(transportOption);

    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    // Verify category totals updated
    await waitFor(() => {
      expect(screen.getByText(/Food.*30/)).toBeInTheDocument();
      expect(screen.getByText(/Transport.*50/)).toBeInTheDocument();
    });
  });
});

describe('Expense CRUD - Delete', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should delete expense from localStorage', async () => {
    const user = userEvent.setup();

    // Pre-populate with expenses
    const expenses: Expense[] = [
      {
        id: 'expense-1',
        amount: 50,
        date: '2025-01-10',
        category: 'Food',
        description: 'Lunch',
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z',
      },
      {
        id: 'expense-2',
        amount: 30,
        date: '2025-01-11',
        category: 'Transport',
        description: 'Taxi',
        createdAt: '2025-01-11T10:00:00Z',
        updatedAt: '2025-01-11T10:00:00Z',
      },
    ];

    localStorage.setItem(
      'sdd_workshop_expense_tracker_expenses',
      JSON.stringify(expenses)
    );

    render(<MockDashboard />, { wrapper: TestWrapper });

    // Click delete button for first expense
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]!);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm|yes/i });
    await user.click(confirmButton);

    // Verify expense was removed from localStorage
    await waitFor(() => {
      const stored = localStorage.getItem('sdd_workshop_expense_tracker_expenses');
      const remainingExpenses: Expense[] = JSON.parse(stored!);

      expect(remainingExpenses).toHaveLength(1);
      expect(remainingExpenses[0]?.id).toBe('expense-2');
    });
  });

  it('should update category totals after deletion', async () => {
    const user = userEvent.setup();

    const expenses: Expense[] = [
      {
        id: 'expense-1',
        amount: 50,
        date: '2025-01-10',
        category: 'Food',
        description: 'Lunch',
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z',
      },
      {
        id: 'expense-2',
        amount: 30,
        date: '2025-01-11',
        category: 'Food',
        description: 'Dinner',
        createdAt: '2025-01-11T10:00:00Z',
        updatedAt: '2025-01-11T10:00:00Z',
      },
    ];

    localStorage.setItem(
      'sdd_workshop_expense_tracker_expenses',
      JSON.stringify(expenses)
    );

    render(<MockDashboard />, { wrapper: TestWrapper });

    // Verify initial total
    await waitFor(() => {
      expect(screen.getByText(/Food.*80/)).toBeInTheDocument();
    });

    // Delete first expense
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]!);

    const confirmButton = screen.getByRole('button', { name: /confirm|yes/i });
    await user.click(confirmButton);

    // Verify total updated
    await waitFor(() => {
      expect(screen.getByText(/Food.*30/)).toBeInTheDocument();
    });
  });
});

