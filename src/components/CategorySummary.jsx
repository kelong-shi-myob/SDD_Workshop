import { formatCurrency } from '../utils/format';

export default function CategorySummary({ totals }) {
  if (Object.keys(totals).length === 0) return null;

  return (
    <article>
      <header>
        <strong>Spending by Category</strong>
      </header>
      <div className="grid">
        {Object.entries(totals).map(([category, amount]) => (
          <div key={category} style={{ marginBottom: '1rem' }}>
            <small>{category}</small>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {formatCurrency(amount)}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

