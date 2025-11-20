import { useExpenses } from '../context/ExpenseContext';
import { calculateCategoryTotals, getRecentExpenses } from '../logic/expenseLogic';

export const Dashboard = () => {
  const { state } = useExpenses();
  const { expenses } = state;

  const totals = calculateCategoryTotals(expenses);
  const recent = getRecentExpenses(expenses);

  return (
    <>
      <section>
        <h3>Category Totals</h3>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {Object.keys(totals).length === 0 ? (
            <p>No expenses yet.</p>
          ) : (
            Object.entries(totals).map(([category, total]) => (
              <article key={category} style={{ margin: 0 }}>
                <header>{category}</header>
                <strong>${Number(total).toFixed(2)}</strong>
              </article>
            ))
          )}
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3>Recent Expenses</h3>
        {recent.length === 0 ? (
          <p>No expenses recorded.</p>
        ) : (
          <div className="overflow-auto">
            <table className="striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description || '-'}</td>
                    <td>${Number(expense.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
};

