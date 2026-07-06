/**
 * Validator utilities for form fields.
 */

/**
 * Validates email format.
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (!email) return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validates password criteria.
 * @param {string} password
 * @returns {boolean}
 */
export function validatePassword(password) {
  if (!password) return false;
  // Simple check for presence and minimal length (e.g. 6 chars)
  return password.trim().length >= 6;
}

/**
 * Validates username criteria.
 * @param {string} username
 * @returns {boolean}
 */
export function validateUsername(username) {
  if (!username) return false;
  return username.trim().length >= 2;
}

/**
 * Checks if a string is empty or whitespace.
 * @param {string} value
 * @returns {boolean}
 */
export function isEmpty(value) {
  return !value || value.trim() === '';
}
