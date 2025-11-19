/**
 * useLocalStorage Hook Tests
 * 
 * Tests for the generic type-safe localStorage React hook.
 * Tests cover: reading, writing, default values, type safety, error handling.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return default value when key does not exist', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test_key', 'default_value')
    );

    expect(result.current[0]).toBe('default_value');
  });

  it('should return stored value when key exists', () => {
    localStorage.setItem('test_key', JSON.stringify('stored_value'));

    const { result } = renderHook(() =>
      useLocalStorage('test_key', 'default_value')
    );

    expect(result.current[0]).toBe('stored_value');
  });

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test_key', 'initial')
    );

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test_key')).toBe(JSON.stringify('updated'));
  });

  it('should support functional updates', () => {
    const { result } = renderHook(() =>
      useLocalStorage('counter', 0)
    );

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(6);
  });

  it('should work with complex objects', () => {
    interface TestObj {
      name: string;
      age: number;
      active: boolean;
    }

    const defaultValue: TestObj = { name: 'John', age: 30, active: true };

    const { result } = renderHook(() =>
      useLocalStorage<TestObj>('user', defaultValue)
    );

    expect(result.current[0]).toEqual(defaultValue);

    act(() => {
      result.current[1]({ name: 'Jane', age: 25, active: false });
    });

    expect(result.current[0]).toEqual({ name: 'Jane', age: 25, active: false });
    
    const stored = localStorage.getItem('user');
    expect(stored).toBe(JSON.stringify({ name: 'Jane', age: 25, active: false }));
  });

  it('should work with arrays', () => {
    const { result } = renderHook(() =>
      useLocalStorage<number[]>('numbers', [])
    );

    expect(result.current[0]).toEqual([]);

    act(() => {
      result.current[1]([1, 2, 3, 4, 5]);
    });

    expect(result.current[0]).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle null values', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string | null>('nullable', null)
    );

    expect(result.current[0]).toBeNull();

    act(() => {
      result.current[1]('not null');
    });

    expect(result.current[0]).toBe('not null');

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBeNull();
  });

  it('should return default value if stored value is invalid JSON', () => {
    localStorage.setItem('invalid_json', 'not valid json');

    const { result } = renderHook(() =>
      useLocalStorage('invalid_json', 'default')
    );

    expect(result.current[0]).toBe('default');
  });

  it('should handle boolean values correctly', () => {
    const { result } = renderHook(() =>
      useLocalStorage('flag', false)
    );

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
  });

  it('should handle number values correctly', () => {
    const { result } = renderHook(() =>
      useLocalStorage('score', 0)
    );

    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1](100);
    });

    expect(result.current[0]).toBe(100);
  });

  it('should persist across hook re-renders', () => {
    const { result, rerender } = renderHook(() =>
      useLocalStorage('persist_test', 'initial')
    );

    act(() => {
      result.current[1]('updated');
    });

    rerender();

    expect(result.current[0]).toBe('updated');
  });

  it('should sync across multiple hook instances', () => {
    const { result: result1 } = renderHook(() =>
      useLocalStorage('shared_key', 'value1')
    );

    const { result: result2 } = renderHook(() =>
      useLocalStorage('shared_key', 'value1')
    );

    act(() => {
      result1.current[1]('updated_value');
    });

    // Both hooks should see the updated value
    expect(result1.current[0]).toBe('updated_value');
    expect(result2.current[0]).toBe('updated_value');
  });

  it('should handle rapid updates correctly', () => {
    const { result } = renderHook(() =>
      useLocalStorage('rapid', 0)
    );

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[1](3);
    });

    expect(result.current[0]).toBe(3);
  });

  it('should handle storage quota exceeded gracefully', () => {
    const { result } = renderHook(() =>
      useLocalStorage('quota_test', 'small')
    );

    // Mock QuotaExceededError
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      const error = new Error('QuotaExceededError');
      error.name = 'QuotaExceededError';
      throw error;
    };

    act(() => {
      // This should not throw, but fail gracefully
      result.current[1]('attempting to save large data');
    });

    // Value should remain unchanged
    expect(result.current[0]).toBe('small');

    // Restore original setItem
    Storage.prototype.setItem = originalSetItem;
  });

  it('should remove item from localStorage when set to undefined', () => {
    localStorage.setItem('remove_test', JSON.stringify('exists'));

    const { result } = renderHook(() =>
      useLocalStorage<string | undefined>('remove_test', undefined)
    );

    expect(result.current[0]).toBe('exists');

    act(() => {
      result.current[1](undefined);
    });

    expect(localStorage.getItem('remove_test')).toBeNull();
    expect(result.current[0]).toBeUndefined();
  });
});

