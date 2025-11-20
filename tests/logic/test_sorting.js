import { describe, it } from 'node:test';
import assert from 'node:assert';

const sortExpensesByDate = (expenses) => {
  return [...expenses].sort((a, b) => {
    // Sort by Date descending (newest first)
    // If dates match, sort by createdAt descending (newest created first)
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    return b.createdAt - a.createdAt;
  });
};

describe('Sorting: Expenses', () => {
  it('should sort expenses by date descending', () => {
    const expenses = [
      { id: 1, date: '2023-01-01' },
      { id: 2, date: '2023-01-03' },
      { id: 3, date: '2023-01-02' }
    ];
    
    const sorted = sortExpensesByDate(expenses);
    
    assert.strictEqual(sorted[0].id, 2); // Jan 3
    assert.strictEqual(sorted[1].id, 3); // Jan 2
    assert.strictEqual(sorted[2].id, 1); // Jan 1
  });

  it('should use createdAt as tiebreaker for same dates', () => {
    const expenses = [
      { id: 1, date: '2023-01-01', createdAt: 100 },
      { id: 2, date: '2023-01-01', createdAt: 200 }
    ];
    
    const sorted = sortExpensesByDate(expenses);
    
    assert.strictEqual(sorted[0].id, 2); // Newer createdAt
    assert.strictEqual(sorted[1].id, 1);
  });
});

