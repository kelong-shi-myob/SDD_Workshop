import { formatCurrency, formatDate } from '../utils/format';

export default function ExpenseList({ expenses }) {
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
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

