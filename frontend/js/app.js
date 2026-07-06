import { themeState } from './state/themeState.js';
import { initThemeToggle } from './components/themeToggle.js';
import { landingPage } from './pages/landing.js';
import { loginPage } from './pages/login.js';
import { registerPage } from './pages/register.js';
import { dashboardPage } from './pages/dashboard.js';
import { repositoriesPage } from './pages/repositories.js';
import { repositoryDetailsPage } from './pages/repositoryDetails.js';
import { fileViewerPage } from './pages/fileViewer.js';

// Bootstrap function
function bootstrap() {
  // 1. Initialize global theme state
  themeState.init();

  // 2. Bind theme toggles found in DOM (desktop, mobile, and shell toggles)
  const toggles = document.querySelectorAll('.theme-toggle-btn');
  toggles.forEach(toggle => {
    initThemeToggle(toggle);
  });

  // 3. Page specific bootstrapping
  if (document.querySelector('.landing-page-wrapper') !== null) {
    landingPage.init();
  }
  
  if (document.getElementById('login-form') !== null) {
    loginPage.init();
  }

  if (document.getElementById('register-form') !== null) {
    registerPage.init();
  }

  // Check unique selectors for shell pages
  if (document.querySelector('.tabs-container') !== null) {
    repositoryDetailsPage.init();
  } else if (document.getElementById('file-breadcrumbs') !== null) {
    fileViewerPage.init();
  } else {
    // Fallback checking via dashboard title for dashboard and repositories index
    const titleHeader = document.querySelector('.dashboard-title');
    if (titleHeader) {
      const text = titleHeader.textContent.trim();
      if (text === 'Dashboard') {
        dashboardPage.init();
      } else if (text === 'Repositories') {
        repositoriesPage.init();
      }
    }
  }
}

// Ensure bootstrap runs even if DOMContentLoaded already fired (e.g. race conditions)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
