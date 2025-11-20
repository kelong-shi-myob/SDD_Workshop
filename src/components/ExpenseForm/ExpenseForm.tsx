/**
 * ExpenseForm Component
 * 
 * Form for creating and editing expenses with validation.
 * Uses React Hook Form + Zod for type-safe validation.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { expenseSchema, type ExpenseFormData } from '@/utils/validation';
import type { CreateExpenseInput, ExpenseCategory } from '@/types/expense';

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other',
];

interface ExpenseFormProps {
  onSubmit: (data: CreateExpenseInput) => void | Promise<void>;
  onCancel: () => void;
  initialData?: CreateExpenseInput;
}

/**
 * Expense Form Component
 * 
 * Validates all fields and displays localized error messages.
 * Supports both create and edit modes via initialData prop.
 */
export function ExpenseForm({ onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData || {
      amount: undefined,
      date: '',
      category: undefined,
      description: '',
    },
  });

  const selectedCategory = watch('category');

  const onFormSubmit = async (data: ExpenseFormData) => {
    try {
      await onSubmit(data);
      if (!initialData) {
        // Only reset form if creating new expense (not editing)
        reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Don't reset form on error so user can retry
    }
  };

  // Get today's date in YYYY-MM-DD format for max date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Amount Field */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="required">
          {t('form.amount')}
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder={t('form.amountPlaceholder')}
          {...register('amount', { valueAsNumber: true })}
          aria-invalid={errors.amount ? 'true' : 'false'}
          aria-describedby={errors.amount ? 'amount-error' : undefined}
        />
        {errors.amount && (
          <p id="amount-error" className="text-sm text-destructive" role="alert">
            {t(errors.amount.message || 'validation.amountRequired')}
          </p>
        )}
      </div>

      {/* Date Field */}
      <div className="space-y-2">
        <Label htmlFor="date" className="required">
          {t('form.date')}
        </Label>
        <Input
          id="date"
          type="date"
          max={today}
          {...register('date')}
          aria-invalid={errors.date ? 'true' : 'false'}
          aria-describedby={errors.date ? 'date-error' : undefined}
        />
        {errors.date && (
          <p id="date-error" className="text-sm text-destructive" role="alert">
            {t(errors.date.message || 'validation.dateRequired')}
          </p>
        )}
      </div>

      {/* Category Field */}
      <div className="space-y-2">
        <Label htmlFor="category" className="required">
          {t('form.category')}
        </Label>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setValue('category', value as ExpenseCategory, { shouldValidate: true })}
        >
          <SelectTrigger
            id="category"
            aria-invalid={errors.category ? 'true' : 'false'}
            aria-describedby={errors.category ? 'category-error' : undefined}
            aria-label={t('form.category')}
          >
            <SelectValue placeholder={t('form.categoryPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {EXPENSE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {t(`categories.${category.toLowerCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p id="category-error" className="text-sm text-destructive" role="alert">
            {t(errors.category.message || 'validation.categoryRequired')}
          </p>
        )}
      </div>

      {/* Description Field (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="description">
          {t('form.description')} <span className="text-muted-foreground">({t('form.optional')})</span>
        </Label>
        <textarea
          id="description"
          rows={3}
          maxLength={500}
          placeholder={t('form.descriptionPlaceholder')}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register('description')}
          aria-invalid={errors.description ? 'true' : 'false'}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p id="description-error" className="text-sm text-destructive" role="alert">
            {t(errors.description.message || 'validation.descriptionTooLong')}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {watch('description')?.length || 0}/500 {t('form.characters')}
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : initialData ? t('common.update') : t('common.save')}
        </Button>
      </div>
    </form>
  );
}

