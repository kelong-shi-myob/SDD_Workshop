import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../utils';

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats number to currency string', () => {
      expect(formatCurrency(10)).toBe('$10.00');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date string to readable string', () => {
      expect(formatDate('2025-11-20')).toBe('Nov 20, 2025');
    });

    it('handles invalid dates gracefully', () => {
      // Assuming implementation returns original string or fallback
      expect(formatDate('invalid')).toBe('Invalid Date'); 
    });
  });
});

