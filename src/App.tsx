/**
 * App Component
 * 
 * Main application component with all providers and layout.
 */

import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import './i18n/config';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ExpenseProvider>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ExpenseProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
