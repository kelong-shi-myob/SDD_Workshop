import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO, isValid } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid Date';
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
}
