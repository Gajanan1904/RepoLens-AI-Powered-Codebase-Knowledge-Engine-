import { request } from './request.js';

/**
 * Authentication API module.
 */
export const authApi = {
  /**
   * Register a new user account.
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} The registered user.
   */
  register(username, email, password) {
    return request('/api/auth/register/', {
      method: 'POST',
      body: { username, email, password }
    });
  },

  /**
   * Log in an existing user.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} JWT tokens (access, refresh).
   */
  login(email, password) {
    return request('/api/auth/login/', {
      method: 'POST',
      body: { email, password }
    });
  },

  /**
   * Refresh the access token.
   * @param {string} refresh
   * @returns {Promise<Object>} New access token.
   */
  refresh(refresh) {
    return request('/api/auth/refresh/', {
      method: 'POST',
      body: { refresh }
    });
  }
};
