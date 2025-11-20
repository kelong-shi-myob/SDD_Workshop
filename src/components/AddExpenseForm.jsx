import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { validateExpense } from '../logic/expenseLogic';

export const AddExpenseForm = ({ onCancel, onSuccess }) => {
  const { addExpense } = useExpenses();
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    description: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateExpense(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    addExpense(formData);
    if (onSuccess) onSuccess();
  };

  return (
    <article>
      <header><strong>Add New Expense</strong></header>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: '#d93526', marginBottom: '1rem' }}>{error}</div>}
        
        <label>
          Amount
          <input 
            type="number" 
            name="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            step="0.01" 
            required 
          />
        </label>

        <label>
          Date
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
          />
        </label>

        <label>
          Category
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Description (Optional)
          <input 
            type="text" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
          />
        </label>

        <div className="grid">
          <button type="submit">Save Expense</button>
          <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </article>
  );
};

