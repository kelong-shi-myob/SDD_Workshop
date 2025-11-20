import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, Category } from '@/lib/types';
import { StorageService } from '@/services/storage';

interface AddExpenseFormProps {
  onSuccess: () => void;
}

export function AddExpenseForm({ onSuccess }: AddExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category | ''>('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }
    if (!category) {
      setError('Please select a category.');
      return;
    }

    try {
      StorageService.addExpense({
        id: crypto.randomUUID(),
        amount: parseFloat(amount),
        date,
        category: category as Category,
        description: description || undefined,
        createdAt: Date.now(),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save expense.');
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 text-sm" role="alert">{error}</div>}
      
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input 
          id="amount" 
          type="number" 
          step="0.01" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input 
          id="date" 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input 
          id="description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <Button onClick={handleSubmit} className="w-full">Save Expense</Button>
    </div>
  );
}

