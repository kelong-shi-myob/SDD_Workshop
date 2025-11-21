import { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES } from '../utils/constants';
import { generateUUID } from '../utils/uuid';

export default function ExpenseForm() {
  const { state, actions } = useExpenses();
  const { viewData, expenses } = state;
  const isEditMode = !!viewData?.id;

  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: CATEGORIES[0],
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const expenseToEdit = expenses.find(e => e.id === viewData.id);
      if (expenseToEdit) {
        setFormData({
          amount: expenseToEdit.amount,
          date: expenseToEdit.date,
          category: expenseToEdit.category,
          description: expenseToEdit.description || ''
        });
      }
    }
  }, [isEditMode, viewData?.id, expenses]);

  const validate = (data) => {
    const newErrors = {};
    if (!data.amount || Number(data.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!data.date) {
      newErrors.date = 'Date is required';
    }
    if (!data.category) {
      newErrors.category = 'Category is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isEditMode) {
      actions.updateExpense(viewData.id, {
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        description: formData.description
      });
    } else {
      const newExpense = {
        id: generateUUID(),
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        description: formData.description,
        createdAt: Date.now()
      };
      actions.addExpense(newExpense);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <article>
      <header>
        <strong>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</strong>
      </header>
      <form onSubmit={handleSubmit}>
        <label>
          Amount ($)
          <input
            type="number"
            name="amount"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            aria-invalid={errors.amount ? "true" : undefined}
          />
          {errors.amount && <small style={{ color: 'var(--pico-color-red-500)' }}>{errors.amount}</small>}
        </label>

        <label>
          Date
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            aria-invalid={errors.date ? "true" : undefined}
          />
          {errors.date && <small style={{ color: 'var(--pico-color-red-500)' }}>{errors.date}</small>}
        </label>

        <label>
          Category
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            aria-invalid={errors.category ? "true" : undefined}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label>
          Description (Optional)
          <input
            type="text"
            name="description"
            placeholder="What was this for?"
            value={formData.description}
            onChange={handleChange}
            maxLength={100}
          />
        </label>

        <div className="grid">
          <button type="button" className="secondary" onClick={() => actions.setView('dashboard')}>
            Cancel
          </button>
          <button type="submit">{isEditMode ? 'Save Changes' : 'Save Expense'}</button>
        </div>
      </form>
    </article>
  );
}

