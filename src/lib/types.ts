export type Category = 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Health' | 'Other';

export const CATEGORIES: Category[] = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Other'];

export interface Expense {
  id: string;
  amount: number;
  date: string; // ISO Date string YYYY-MM-DD
  category: Category;
  description?: string;
  createdAt: number;
}

