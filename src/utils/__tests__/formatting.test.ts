/**
 * Formatting Tests
 * 
 * Tests for currency and date formatting utilities.
 * Tests cover: currency localization, date formatting, edge cases.
 */

import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatDateLong,
  formatDateRelative,
} from '../formatting';

describe('Formatting Utilities', () => {
  describe('formatCurrency', () => {
    describe('English (en) locale', () => {
      it('should format amount with $ symbol', () => {
        const formatted = formatCurrency(50, 'en');
        expect(formatted).toBe('$50.00');
      });

      it('should format decimals correctly', () => {
        const formatted = formatCurrency(50.99, 'en');
        expect(formatted).toBe('$50.99');
      });

      it('should format large numbers with comma separators', () => {
        const formatted = formatCurrency(1000, 'en');
        expect(formatted).toBe('$1,000.00');
      });

      it('should format very large numbers', () => {
        const formatted = formatCurrency(1234567.89, 'en');
        expect(formatted).toBe('$1,234,567.89');
      });

      it('should format zero', () => {
        const formatted = formatCurrency(0, 'en');
        expect(formatted).toBe('$0.00');
      });

      it('should round to 2 decimal places', () => {
        const formatted = formatCurrency(50.999, 'en');
        expect(formatted).toBe('$51.00');
      });
    });

    describe('Chinese (zh) locale', () => {
      it('should format amount with ¥ symbol', () => {
        const formatted = formatCurrency(50, 'zh');
        expect(formatted).toBe('¥50.00');
      });

      it('should format decimals correctly', () => {
        const formatted = formatCurrency(50.99, 'zh');
        expect(formatted).toBe('¥50.99');
      });

      it('should format large numbers', () => {
        const formatted = formatCurrency(1000, 'zh');
        expect(formatted).toBe('¥1,000.00');
      });

      it('should format zero', () => {
        const formatted = formatCurrency(0, 'zh');
        expect(formatted).toBe('¥0.00');
      });
    });

    describe('edge cases', () => {
      it('should default to English if invalid language', () => {
        const formatted = formatCurrency(50, 'fr' as any);
        expect(formatted).toBe('$50.00');
      });

      it('should handle negative numbers', () => {
        const formatted = formatCurrency(-50, 'en');
        expect(formatted).toBe('-$50.00');
      });

      it('should handle very small decimals', () => {
        const formatted = formatCurrency(0.01, 'en');
        expect(formatted).toBe('$0.01');
      });
    });
  });

  describe('formatDate', () => {
    it('should format date in short format (MM/DD/YYYY for en)', () => {
      const formatted = formatDate('2025-01-15', 'en');
      expect(formatted).toBe('1/15/2025');
    });

    it('should format date in short format (YYYY/M/D for zh)', () => {
      const formatted = formatDate('2025-01-15', 'zh');
      expect(formatted).toBe('2025/1/15');
    });

    it('should handle single-digit months and days', () => {
      const formattedEn = formatDate('2025-03-05', 'en');
      const formattedZh = formatDate('2025-03-05', 'zh');
      
      expect(formattedEn).toBe('3/5/2025');
      expect(formattedZh).toBe('2025/3/5');
    });

    it('should handle December 31st', () => {
      const formattedEn = formatDate('2025-12-31', 'en');
      const formattedZh = formatDate('2025-12-31', 'zh');
      
      expect(formattedEn).toBe('12/31/2025');
      expect(formattedZh).toBe('2025/12/31');
    });

    it('should default to English if invalid language', () => {
      const formatted = formatDate('2025-01-15', 'fr' as any);
      expect(formatted).toBe('1/15/2025');
    });

    it('should handle Date objects', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const formatted = formatDate(date, 'en');
      expect(formatted).toContain('2025');
    });
  });

  describe('formatDateLong', () => {
    it('should format date in long format for English', () => {
      const formatted = formatDateLong('2025-01-15', 'en');
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2025');
    });

    it('should format date in long format for Chinese', () => {
      const formatted = formatDateLong('2025-01-15', 'zh');
      expect(formatted).toContain('2025');
      expect(formatted).toContain('1');
      expect(formatted).toContain('15');
    });

    it('should handle different months', () => {
      const formatted = formatDateLong('2025-06-20', 'en');
      expect(formatted).toContain('June');
    });

    it('should handle Date objects', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const formatted = formatDateLong(date, 'en');
      expect(formatted).toContain('January');
    });
  });

  describe('formatDateRelative', () => {
    it('should return "Today" for today\'s date in English', () => {
      const today = new Date().toISOString().split('T')[0];
      const formatted = formatDateRelative(today!, 'en');
      expect(formatted).toBe('Today');
    });

    it('should return "今天" for today\'s date in Chinese', () => {
      const today = new Date().toISOString().split('T')[0];
      const formatted = formatDateRelative(today!, 'zh');
      expect(formatted).toBe('今天');
    });

    it('should return "Yesterday" for yesterday in English', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];
      
      const formatted = formatDateRelative(dateStr!, 'en');
      expect(formatted).toBe('Yesterday');
    });

    it('should return "昨天" for yesterday in Chinese', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];
      
      const formatted = formatDateRelative(dateStr!, 'zh');
      expect(formatted).toBe('昨天');
    });

    it('should return formatted date for dates older than yesterday', () => {
      const formatted = formatDateRelative('2025-01-01', 'en');
      expect(formatted).not.toBe('Today');
      expect(formatted).not.toBe('Yesterday');
      expect(formatted).toContain('2025');
    });

    it('should handle Date objects', () => {
      const today = new Date();
      const formatted = formatDateRelative(today, 'en');
      expect(formatted).toBe('Today');
    });
  });
});

