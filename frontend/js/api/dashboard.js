import { request } from './request.js';

/**
 * Dashboard API module.
 */
export const dashboardApi = {
  /**
   * Fetch aggregated dashboard statistics.
   * @returns {Promise<Object>} Dashboard overview statistics.
   */
  getDashboard() {
    return request('/api/dashboard/');
  }
};
