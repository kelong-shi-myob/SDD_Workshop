/**
 * useLocalStorage Hook
 * 
 * Generic type-safe React hook for syncing state with localStorage.
 * Automatically persists state changes and syncs across components.
 */

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

/**
 * Custom hook for managing localStorage with React state
 * 
 * @template T - The type of the value to store
 * @param key - localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Tuple of [value, setValue] similar to useState
 * 
 * @example
 * ```tsx
 * const [name, setName] = useLocalStorage('username', 'Guest');
 * 
 * // Update value
 * setName('John');
 * 
 * // Functional update
 * setName(prev => prev + ' Doe');
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: SetValue<T>) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from localStorage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or return defaultValue
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        // Dispatch custom event to sync across tabs/components
        window.dispatchEvent(
          new CustomEvent('local-storage', {
            detail: { key, value: valueToStore },
          })
        );
      } catch (error) {
        // Handle quota exceeded or other errors
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded');
        } else {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      }
    },
    [key, storedValue]
  );

  // Listen for changes to this key from other components/tabs
  useEffect(() => {
    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: T }>;
      
      if (customEvent.detail?.key === key) {
        setStoredValue(customEvent.detail.value);
      }
    };

    // Listen for custom storage events (from other components)
    window.addEventListener('local-storage', handleStorageChange as EventListener);

    // Listen for native storage events (from other tabs)
    const handleNativeStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage change for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(defaultValue);
      }
    };

    window.addEventListener('storage', handleNativeStorageChange);

    return () => {
      window.removeEventListener('local-storage', handleStorageChange as EventListener);
      window.removeEventListener('storage', handleNativeStorageChange);
    };
  }, [key, defaultValue]);

  return [storedValue, setValue];
}

