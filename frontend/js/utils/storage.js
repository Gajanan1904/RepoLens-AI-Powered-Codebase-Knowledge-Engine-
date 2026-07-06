/**
 * Safe local storage wrapper.
 */
export const storage = {
  /**
   * Get an item from localStorage.
   * @param {string} key
   * @param {*} defaultValue
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      try {
        return JSON.parse(item);
      } catch {
        return item; // return raw string if not JSON
      }
    } catch (e) {
      console.warn(`localStorage read error for key "${key}":`, e);
      return defaultValue;
    }
  },

  /**
   * Set an item in localStorage.
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      localStorage.setItem(key, stringValue);
    } catch (e) {
      console.warn(`localStorage write error for key "${key}":`, e);
    }
  },

  /**
   * Remove an item from localStorage.
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`localStorage remove error for key "${key}":`, e);
    }
  },

  /**
   * Clear all localStorage.
   */
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('localStorage clear error:', e);
    }
  }
};
