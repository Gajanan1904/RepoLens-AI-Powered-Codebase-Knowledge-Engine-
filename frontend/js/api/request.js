import { authState } from '../state/authState.js';

// Base API URL. Can be empty if frontend is served from the same host, or configured.
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Custom API Error class containing status and payload.
 */
export class ApiError extends Error {
  constructor(status, payload) {
    super(payload?.detail || payload?.message || `API Error: ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

// Track whether a token refresh is currently in progress to queue concurrent 401s
let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  refreshQueue = [];
}

/**
 * Safe fetch request wrapper.
 * Handles Authorization headers, JSON body serialization, and silent JWT refreshing.
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<any>}
 */
export async function request(url, options = {}) {
  const fullUrl = `${BASE_URL}${url}`;
  
  // Clone options and setup headers
  const config = { ...options };
  config.headers = { ...config.headers };

  // Set default Content-Type to application/json if not already set,
  // unless the body is FormData (let browser calculate boundary automatically)
  if (!(config.body instanceof FormData)) {
    if (!config.headers['Content-Type'] && !config.headers['content-type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    // Automatically serialize body if it is an object
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }
  }

  // Attach access token if authenticated and no Auth header exists
  const token = authState.getAccessToken();
  if (token && !config.headers['Authorization'] && !config.headers['authorization']) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(fullUrl, config);
    
    // Success status
    if (response.ok) {
      if (response.status === 204) return null; // No Content
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    }

    // Handle 401 Unauthorized (expired token)
    if (response.status === 401 && !url.includes('/api/auth/login') && !url.includes('/api/auth/refresh')) {
      return handleUnauthorized(url, config);
    }

    // Other errors
    let errorPayload = null;
    try {
      errorPayload = await response.json();
    } catch {
      errorPayload = { detail: await response.text() };
    }
    throw new ApiError(response.status, errorPayload);

  } catch (error) {
    if (error instanceof ApiError) throw error;
    
    // Network or other fetch errors
    throw new ApiError(500, { detail: error.message || 'Network connection failed' });
  }
}

/**
 * Handle unauthorized requests by attempting token refresh.
 */
async function handleUnauthorized(url, config) {
  const refresh = authState.getRefreshToken();
  if (!refresh) {
    authState.logout();
    throw new ApiError(401, { detail: 'Session expired. Please log in again.' });
  }

  if (isRefreshing) {
    // Queue request to retry once refreshed
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve: (token) => {
        config.headers['Authorization'] = `Bearer ${token}`;
        resolve(request(url, config));
      }, reject });
    });
  }

  isRefreshing = true;

  try {
    const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });

    if (!refreshRes.ok) {
      throw new Error('Refresh token invalid');
    }

    const payload = await refreshRes.json();
    const newAccess = payload.access;

    authState.updateAccessToken(newAccess);
    processQueue(null, newAccess);
    isRefreshing = false;

    // Retry original request
    config.headers['Authorization'] = `Bearer ${newAccess}`;
    return await request(url, config);

  } catch (err) {
    processQueue(err);
    isRefreshing = false;
    authState.logout();
    throw new ApiError(401, { detail: 'Session expired. Please log in again.' });
  }
}
