/**
 * Dashboard Component
 * 
 * Main dashboard displaying expense list and category summary.
 * Provides "Add Expense" button that opens a dialog with ExpenseForm.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useExpenses } from '@/context/ExpenseContext';
import { ExpenseForm } from '@/components/ExpenseForm/ExpenseForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CreateExpenseInput } from '@/types/expense';

/**
 * Dashboard Component
 * 
 * Main interface for managing expenses.
 * Shows add button and will display expense list + category summary.
 */
export function Dashboard() {
  const { t } = useTranslation();
  const { addExpense, error, clearError } = useExpenses();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddExpense = async (data: CreateExpenseInput) => {
    try {
      await addExpense(data);
      setIsAddDialogOpen(false);
      clearError();
    } catch (err) {
      // Error is already set in context, just log it
      console.error('Failed to add expense:', err);
    }
  };

  const handleCancelAdd = () => {
    setIsAddDialogOpen(false);
    clearError();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>
          <p className="text-muted-foreground">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('dashboard.addExpense')}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="text-destructive hover:text-destructive"
            >
              {t('common.dismiss')}
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Expense List (will be implemented in Phase 4) */}
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.recentExpenses')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.noExpenses')}
            </p>
          </div>
        </div>

        {/* Category Summary (will be implemented in Phase 4) */}
        <div className="md:col-span-1">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.categorySummary')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.noCategoriesYet')}
            </p>
          </div>
        </div>
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('dialog.addExpense')}</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            onSubmit={handleAddExpense}
            onCancel={handleCancelAdd}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

