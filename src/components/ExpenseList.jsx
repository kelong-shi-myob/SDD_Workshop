import { formatCurrency, formatDate } from '../utils/format';
import { useExpenses } from '../context/ExpenseContext';

export default function ExpenseList({ expenses }) {
  const { actions } = useExpenses();

  const handleDelete = (id) => {
    actions.deleteExpense(id);
  };

  const handleEdit = (id) => {
    actions.setView('edit-expense', { id });
  };

  if (!expenses || expenses.length === 0) {
    return (
      <article>
        <p style={{ textAlign: 'center', color: 'var(--pico-color-grey-500)' }}>
          No expenses yet. Add one to get started!
        </p>
      </article>
    );
  }

  return (
    <figure>
      <table role="grid">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
            <th scope="col" style={{ textAlign: 'right' }}>Amount</th>
            <th scope="col" style={{ textAlign: 'right', width: '1%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td>{formatDate(expense.date)}</td>
              <td>{expense.category}</td>
              <td>{expense.description || '-'}</td>
              <td style={{ textAlign: 'right' }}>
                <strong>{formatCurrency(expense.amount)}</strong>
              </td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button 
                  className="outline secondary"
                  style={{ padding: '2px 8px', marginRight: '4px', fontSize: '0.8em', border: 'none' }}
                  onClick={() => handleEdit(expense.id)}
                  aria-label="Edit"
                >
                  ✎
                </button>
                <button 
                  className="outline contrast"
                  style={{ padding: '2px 8px', fontSize: '0.8em', border: 'none', color: 'var(--pico-del-color)' }}
                  onClick={() => handleDelete(expense.id)}
                  aria-label="Delete"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
