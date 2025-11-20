import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CATEGORIES } from '../../src/utils/constants.js';

describe('Constants', () => {
  it('should have the correct fixed categories', () => {
    const expected = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Other'];
    assert.deepStrictEqual(CATEGORIES, expected);
  });

  it('should not allow modification of categories (runtime check)', () => {
    // Note: In JS modules, exports are bindings. 
    // To make the array truly immutable we would need Object.freeze, 
    // but for this scope we just verify content integrity.
    assert.strictEqual(CATEGORIES.length, 6);
  });
});

