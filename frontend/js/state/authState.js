import { storage } from '../utils/storage.js';

const ACCESS_TOKEN_KEY = 'repolens_access_token';
const REFRESH_TOKEN_KEY = 'repolens_refresh_token';

const listeners = [];

/**
 * Global authentication state manager.
 */
export const authState = {
  /**
   * Get JWT access token.
   * @returns {string|null}
   */
  getAccessToken() {
    return storage.get(ACCESS_TOKEN_KEY);
  },

  /**
   * Get JWT refresh token.
   * @returns {string|null}
   */
  getRefreshToken() {
    return storage.get(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if user is currently logged in.
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  },

  /**
   * Store JWT credentials.
   * @param {Object} tokens
   * @param {string} tokens.access
   * @param {string} tokens.refresh
   */
  login({ access, refresh }) {
    if (!access) return;
    
    storage.set(ACCESS_TOKEN_KEY, access);
    if (refresh) {
      storage.set(REFRESH_TOKEN_KEY, refresh);
    }
    
    this.notify(true);
  },

  /**
   * Update the access token only (e.g. after refresh).
   * @param {string} access
   */
  updateAccessToken(access) {
    if (!access) return;
    storage.set(ACCESS_TOKEN_KEY, access);
  },

  /**
   * Clear JWT credentials (logout).
   */
  logout() {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
    this.notify(false);
  },

  /**
   * Subscribe to auth changes (login/logout events).
   * @param {function(boolean): void} callback
   * @returns {function(): void} Unsubscribe function.
   */
  subscribe(callback) {
    listeners.push(callback);
    return () => {
      const idx = listeners.indexOf(callback);
      if (idx !== -1) {
        listeners.splice(idx, 1);
      }
    };
  },

  /**
   * Notify subscribers of state changes.
   * @param {boolean} isAuthenticated
   */
  notify(isAuthenticated) {
    listeners.forEach(callback => callback(isAuthenticated));
  }
};
