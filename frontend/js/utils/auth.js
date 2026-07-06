import { authState } from '../state/authState.js';

// Define routing paths
export const PATHS = {
  LANDING: 'index.html',
  LOGIN: 'login.html',
  REGISTER: 'register.html',
  DASHBOARD: 'dashboard.html'
};

/**
 * Route guarding utility.
 * Redirects users based on their active session.
 */
export function guardRoute() {
  const currentPath = window.location.pathname.split('/').pop() || PATHS.LANDING;
  const isAuth = authState.isAuthenticated();

  const isAuthPage = currentPath === PATHS.LOGIN || currentPath === PATHS.REGISTER;
  const isProtectedPage = [
    PATHS.DASHBOARD,
    'repositories.html',
    'repository-details.html',
    'file-viewer.html',
    'settings.html'
  ].includes(currentPath);

  if (isAuth && isAuthPage) {
    // If logged in and trying to access login/register, send to dashboard
    window.location.replace(PATHS.DASHBOARD);
  } else if (!isAuth && isProtectedPage) {
    // If not logged in and trying to access dashboard/settings, send to login
    window.location.replace(PATHS.LOGIN);
  }
}

/**
 * Performs logout operation and redirects back to Landing Page.
 */
export function logout() {
  authState.logout();
  window.location.replace(PATHS.LANDING);
}
