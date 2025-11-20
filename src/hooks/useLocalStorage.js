import { useState, useEffect } from 'react';

/**
 * Hook to manage state synced with localStorage
 * @param {string} key - Storage key (will be prefixed)
 * @param {any} initialValue - Default value if storage is empty
 * @returns {[any, Function]} - [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const prefixedKey = `workshop_app_expense_${key}`;

  // Initialize state from local storage or default
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${prefixedKey}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${prefixedKey}":`, error);
    }
  };

  return [storedValue, setValue];
}

