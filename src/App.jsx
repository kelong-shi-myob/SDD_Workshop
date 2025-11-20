import { useState } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AddExpenseForm } from './components/AddExpenseForm';
import '@picocss/pico';
import './App.css'; // Optional, can be empty or custom tweaks

function App() {
  const [view, setView] = useState('dashboard');

  return (
    <ExpenseProvider>
      <Layout setView={setView} currentView={view}>
        {view === 'dashboard' && <Dashboard />}
        {view === 'add' && (
          <AddExpenseForm 
            onCancel={() => setView('dashboard')} 
            onSuccess={() => setView('dashboard')} 
          />
        )}
      </Layout>
    </ExpenseProvider>
  );
}

export default App;
