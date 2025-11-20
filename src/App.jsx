import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import AddExpense from './views/AddExpense';
import Dashboard from './views/Dashboard';

function ExpenseApp() {
  const { state, actions } = useExpenses();
  const { currentView } = state;

  return (
    <>
      <header className="container">
        <nav>
          <ul>
            <li><strong>Expense Tracker</strong></li>
          </ul>
          <ul>
            <li>
              <a 
                href="#" 
                role="button" 
                className={currentView === 'dashboard' ? '' : 'outline'}
                onClick={(e) => { e.preventDefault(); actions.setView('dashboard'); }}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="#" 
                role="button" 
                className={currentView === 'add-expense' ? '' : 'outline'}
                onClick={(e) => { e.preventDefault(); actions.setView('add-expense'); }}
              >
                Add Expense
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="container">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'add-expense' && <AddExpense />}
      </main>
    </>
  );
}

function App() {
  return (
    <ExpenseProvider>
      <ExpenseApp />
    </ExpenseProvider>
  );
}

export default App;
