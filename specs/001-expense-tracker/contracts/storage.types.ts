/**
 * localStorage Storage Types
 * 
 * Defines the structure for data persisted in browser localStorage.
 * All keys are namespaced with 'sdd_workshop_expense_tracker_' prefix.
 */

import { Expense } from './expense.types';
import { UserPreferences } from './preferences.types';

/**
 * Current data format version (for migrations)
 */
export const DATA_VERSION = '1.0.0';

/**
 * localStorage key names (all namespaced)
 */
export const STORAGE_KEYS = {
  EXPENSES: 'sdd_workshop_expense_tracker_expenses',
  PREFERENCES: 'sdd_workshop_expense_tracker_preferences',
  VERSION: 'sdd_workshop_expense_tracker_version',
} as const;

/**
 * Storage wrapper for expenses (includes versioning)
 */
export interface ExpenseStorage {
  /** Data format version (semantic versioning) */
  version: string;
  
  /** Array of all expense records */
  expenses: Expense[];
}

/**
 * Storage wrapper for user preferences (includes versioning)
 */
export interface PreferencesStorage {
  /** Data format version (semantic versioning) */
  version: string;
  
  /** User theme and language settings */
  preferences: UserPreferences;
}

/**
 * localStorage access interface
 * 
 * Abstracts direct localStorage calls for easier testing and error handling
 */
export interface LocalStorageAdapter {
  /**
   * Get expenses from storage
   * @returns ExpenseStorage object or null if not found
   * @throws StorageError if JSON parse fails
   */
  getExpenses(): ExpenseStorage | null;

  /**
   * Save expenses to storage
   * @param storage - ExpenseStorage object to persist
   * @throws StorageError if quota exceeded or serialization fails
   */
  setExpenses(storage: ExpenseStorage): void;

  /**
   * Get user preferences from storage
   * @returns PreferencesStorage object or null if not found
   * @throws StorageError if JSON parse fails
   */
  getPreferences(): PreferencesStorage | null;

  /**
   * Save user preferences to storage
   * @param storage - PreferencesStorage object to persist
   * @throws StorageError if quota exceeded or serialization fails
   */
  setPreferences(storage: PreferencesStorage): void;

  /**
   * Clear all application data from localStorage
   */
  clear(): void;

  /**
   * Get current storage usage estimate
   * @returns Storage size in bytes (approximate)
   */
  getStorageSize(): number;
}

/**
 * Custom error for storage operations
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: StorageErrorCode,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Storage error codes
 */
export type StorageErrorCode =
  | 'QUOTA_EXCEEDED'
  | 'PARSE_ERROR'
  | 'SERIALIZE_ERROR'
  | 'NOT_SUPPORTED'
  | 'UNKNOWN';

/**
 * Storage event payload (for cross-tab synchronization)
 */
export interface StorageChangeEvent {
  /** Storage key that changed */
  key: string;
  
  /** Previous value (null if new) */
  oldValue: string | null;
  
  /** New value (null if deleted) */
  newValue: string | null;
  
  /** URL of the page that made the change */
  url: string;
}

/**
 * Storage capacity status
 */
export interface StorageCapacity {
  /** Approximate current usage in bytes */
  usedBytes: number;
  
  /** Browser localStorage limit (typically 5MB) */
  limitBytes: number;
  
  /** Percentage of capacity used (0-100) */
  percentageUsed: number;
  
  /** Whether storage is approaching limit (>80%) */
  isNearLimit: boolean;
  
  /** Whether storage is full (>95%) */
  isFull: boolean;
}

/**
 * Utility function to calculate storage capacity
 * 
 * @param adapter - LocalStorageAdapter instance
 * @returns StorageCapacity status object
 */
export function getStorageCapacity(adapter: LocalStorageAdapter): StorageCapacity {
  const usedBytes = adapter.getStorageSize();
  const limitBytes = 5 * 1024 * 1024; // 5MB (typical browser limit)
  const percentageUsed = (usedBytes / limitBytes) * 100;

  return {
    usedBytes,
    limitBytes,
    percentageUsed,
    isNearLimit: percentageUsed > 80,
    isFull: percentageUsed > 95
  };
}

/**
 * Migration handler interface (for future data migrations)
 */
export interface MigrationHandler {
  /** Version to migrate from */
  fromVersion: string;
  
  /** Version to migrate to */
  toVersion: string;
  
  /** Migration function */
  migrate: (data: ExpenseStorage | PreferencesStorage) => ExpenseStorage | PreferencesStorage;
}

/**
 * Registry of all data migrations
 * 
 * Apply in sequence when loading data from storage
 */
export const MIGRATIONS: MigrationHandler[] = [
  // Example future migration:
  // {
  //   fromVersion: '1.0.0',
  //   toVersion: '2.0.0',
  //   migrate: (data) => {
  //     // Transform data structure
  //     return { ...data, version: '2.0.0' };
  //   }
  // }
];

