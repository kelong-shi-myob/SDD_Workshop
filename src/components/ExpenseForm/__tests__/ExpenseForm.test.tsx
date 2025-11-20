/**
 * ExpenseForm Component Tests
 * 
 * Tests for the expense form component with validation and submission.
 * TDD: These tests should FAIL before implementation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseForm } from '../ExpenseForm';
import type { CreateExpenseInput } from '@/types/expense';

describe('ExpenseForm - Validation', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('should display error when amount is negative', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '-50');
    
    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/amount.*positive/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display error when amount is zero', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, '0');
    
    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/amount.*positive/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display error when amount has more than 2 decimal places', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '50.999');
    
    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/2 decimal places/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display error when date is in the future', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const dateInput = screen.getByLabelText(/date/i);
    await user.clear(dateInput);
    await user.type(dateInput, futureDateStr!);
    
    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/future/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display error when amount field is empty', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-01-15');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const foodOption = screen.getByRole('option', { name: /food/i });
    await user.click(foodOption);
    
    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/amount.*required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display error when date field is empty', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '50');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const foodOption = screen.getByRole('option', { name: /food/i });
    await user.click(foodOption);
    
    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/date.*required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display error when category is not selected', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '50');

    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-01-15');
    
    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/category.*required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display error when description exceeds 500 characters', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const descriptionTextarea = screen.getByLabelText(/description/i);
    await user.type(descriptionTextarea, 'A'.repeat(501));
    
    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/500 characters/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should allow submission with empty description', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '50.99');

    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-01-15');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const foodOption = screen.getByRole('option', { name: /food/i });
    await user.click(foodOption);
    
    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 50.99,
          date: '2025-01-15',
          category: 'Food',
        })
      );
    });
  });
});

describe('ExpenseForm - Submission', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('should submit valid form with correct data structure', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill all fields
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

    // Verify onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        amount: 45.50,
        date: '2025-11-19',
        category: 'Food',
        description: 'Test expense',
      });
    });
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement;
    await user.type(amountInput, '100');

    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-01-20');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const transportOption = screen.getByRole('option', { name: /transport/i });
    await user.click(transportOption);

    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Check that form is reset
    await waitFor(() => {
      expect(amountInput.value).toBe('');
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should not reset form if submission fails', async () => {
    const failingSubmit = vi.fn(() => {
      throw new Error('Submission failed');
    });
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={failingSubmit} onCancel={mockOnCancel} />);

    const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement;
    await user.type(amountInput, '50');

    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-01-15');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const foodOption = screen.getByRole('option', { name: /food/i });
    await user.click(foodOption);

    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    // Form should not be reset
    await waitFor(() => {
      expect(amountInput.value).toBe('50');
    });
  });

  it('should disable submit button while submitting', async () => {
    const slowSubmit = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={slowSubmit} onCancel={mockOnCancel} />);

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

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(slowSubmit).toHaveBeenCalled();
    });
  });
});

describe('ExpenseForm - Edit Mode', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const existingExpense: CreateExpenseInput = {
    amount: 75.25,
    date: '2025-01-10',
    category: 'Entertainment',
    description: 'Movie tickets',
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('should pre-fill form with existing expense data', () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={existingExpense}
      />
    );

    const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement;
    expect(amountInput.value).toBe('75.25');

    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
    expect(dateInput.value).toBe('2025-01-10');

    const descriptionTextarea = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    expect(descriptionTextarea.value).toBe('Movie tickets');
  });

  it('should update existing expense when submitted in edit mode', async () => {
    const user = userEvent.setup();
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={existingExpense}
      />
    );

    const amountInput = screen.getByLabelText(/amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, '100');

    const submitButton = screen.getByRole('button', { name: /save|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 100,
          category: 'Entertainment',
        })
      );
    });
  });
});

