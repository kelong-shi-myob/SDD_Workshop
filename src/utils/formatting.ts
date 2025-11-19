/**
 * Formatting Utilities
 * 
 * Currency and date formatting functions with i18n support.
 * Formats data based on user's selected language (English/Chinese).
 */

import type { Language } from '@/types/preferences';

/**
 * Format currency amount with localized symbol
 * 
 * @param amount - The amount to format
 * @param language - The language locale ('en' or 'zh')
 * @returns Formatted currency string (e.g., "$50.00" or "¥50.00")
 */
export function formatCurrency(amount: number, language: Language): string {
  const symbol = language === 'zh' ? '¥' : '$';
  
  // Handle negative numbers
  if (amount < 0) {
    return `-${symbol}${Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format date in short format
 * 
 * @param date - Date string (YYYY-MM-DD) or Date object
 * @param language - The language locale ('en' or 'zh')
 * @returns Formatted date string
 *   - English: "M/D/YYYY" (e.g., "1/15/2025")
 *   - Chinese: "YYYY/M/D" (e.g., "2025/1/15")
 */
export function formatDate(date: string | Date, language: Language): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // 0-indexed
  const day = dateObj.getDate();
  
  if (language === 'zh') {
    return `${year}/${month}/${day}`;
  }
  
  // Default to English format
  return `${month}/${day}/${year}`;
}

/**
 * Format date in long format
 * 
 * @param date - Date string (YYYY-MM-DD) or Date object
 * @param language - The language locale ('en' or 'zh')
 * @returns Formatted date string
 *   - English: "January 15, 2025"
 *   - Chinese: "2025年1月15日"
 */
export function formatDateLong(date: string | Date, language: Language): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (language === 'zh') {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return dateObj.toLocaleDateString('zh-CN', options);
  }
  
  // Default to English
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Format date relative to today
 * 
 * @param date - Date string (YYYY-MM-DD) or Date object
 * @param language - The language locale ('en' or 'zh')
 * @returns Relative date string
 *   - "Today" / "今天" if date is today
 *   - "Yesterday" / "昨天" if date is yesterday
 *   - Formatted date otherwise
 */
export function formatDateRelative(date: string | Date, language: Language): string {
  const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const inputDate = new Date(dateObj);
  inputDate.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - inputDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return language === 'zh' ? '今天' : 'Today';
  }
  
  if (diffDays === 1) {
    return language === 'zh' ? '昨天' : 'Yesterday';
  }
  
  // For older dates, use short format
  return formatDate(date, language);
}

/**
 * Parse date string to Date object
 * Handles both YYYY-MM-DD format and ISO 8601
 * 
 * @param dateStr - Date string to parse
 * @returns Date object
 */
export function parseDate(dateStr: string): Date {
  // Handle YYYY-MM-DD format (add time to avoid timezone issues)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr + 'T00:00:00');
  }
  
  return new Date(dateStr);
}

/**
 * Format date for input[type="date"] value (YYYY-MM-DD)
 * 
 * @param date - Date object
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

