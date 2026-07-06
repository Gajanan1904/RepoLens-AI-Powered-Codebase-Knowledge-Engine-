import { themeState } from '../state/themeState.js';
import { getThemeToggleHTML, initThemeToggle } from './themeToggle.js';
import { logout } from '../utils/auth.js';

/**
 * Renders the top navigation bar.
 * @param {HTMLElement} container The container to inject the navbar into.
 */
export function renderNavbar(container) {
  if (!container) return;

  const userProfileName = 'Developer';
  const userProfileEmail = 'developer@example.com';
  const initialLetter = userProfileName.charAt(0);

  container.className = 'navbar-fixed';
  container.id = 'sticky-navbar';
  
  container.innerHTML = `
    <div class="container navbar-container">
      <!-- Logo -->
      <a href="dashboard.html" class="logo" id="nav-logo-link" aria-label="RepoLens Dashboard">
        <div class="logo-icon">R</div>
        <span>RepoLens</span>
      </a>

      <!-- Right Hand Actions -->
      <div class="flex items-center gap-md">
        <!-- Reusable Theme Toggle -->
        ${getThemeToggleHTML()}
        
        <!-- Profile Menu Trigger -->
        <div class="profile-dropdown-wrapper">
          <button class="profile-avatar-btn" id="profile-menu-trigger" aria-label="Open profile menu">
            ${initialLetter}
          </button>
          
          <!-- Dropdown Menu -->
          <div class="profile-menu-dropdown hidden" id="profile-menu-dropdown">
            <div class="profile-menu-header">
              <div class="profile-menu-avatar">${initialLetter}</div>
              <div class="profile-menu-user-info">
                <div class="profile-menu-name">${userProfileName}</div>
                <div class="profile-menu-email">${userProfileEmail}</div>
              </div>
            </div>
            <div class="profile-menu-divider"></div>
            <a href="settings.html" class="profile-menu-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>Settings</span>
            </a>
            <div class="profile-menu-divider"></div>
            <button class="profile-menu-item text-danger w-full text-left" id="profile-logout-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind theme toggle behavior
  const toggleBtn = container.querySelector('.theme-toggle-btn');
  initThemeToggle(toggleBtn);

  // Bind profile dropdown trigger
  const trigger = container.querySelector('#profile-menu-trigger');
  const dropdown = container.querySelector('#profile-menu-dropdown');
  const logoutBtn = container.querySelector('#profile-logout-btn');

  if (trigger && dropdown) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      dropdown.classList.add('hidden');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}
