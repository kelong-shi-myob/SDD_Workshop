/**
 * Generates a random UUID v4
 * Uses native crypto API
 * @returns {string} UUID string
 */
export const generateUUID = () => {
  return crypto.randomUUID();
};

