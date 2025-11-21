import { useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import ExpenseList from '../components/ExpenseList';
import CategorySummary from '../components/CategorySummary';
import { ExpensePieChart } from '../components/ExpensePieChart';
import { calculateCategoryTotals } from '../utils/calculations';
import { aggregateExpensesByCategory } from '../utils/expenseUtils';

export default function Dashboard() {
  const { state, actions } = useExpenses();
  const { expenses } = state;

  const recentExpenses = useMemo(() => {
    // Sort by Date descending (newest first)
    // If dates match, sort by createdAt descending (newest created first)
    const sorted = [...expenses].sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
    
    // Return top 10
    return sorted.slice(0, 10);
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    return calculateCategoryTotals(expenses);
  }, [expenses]);

  const pieChartData = useMemo(() => {
    return aggregateExpensesByCategory(expenses);
  }, [expenses]);

  return (
    <>
      <div className="grid" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Dashboard</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => actions.setView('add-expense')}>
            + Add Expense
          </button>
        </div>
      </div>

      {/* Pie Chart Section - Prominently at the top */}
      <ExpensePieChart data={pieChartData} />

      <div className="grid" style={{ marginTop: '2rem' }}>
        <div>
          <article>
            <header>
              <strong>Recent Expenses</strong>
            </header>
            <ExpenseList expenses={recentExpenses} />
          </article>
        </div>
        <div>
           <CategorySummary totals={categoryTotals} />
        </div>
      </div>
    </>
  );
}
