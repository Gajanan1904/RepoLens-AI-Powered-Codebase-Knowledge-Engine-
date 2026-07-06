import { toast } from './toast.js';

/**
 * Renders the sidebar navigation panel.
 * @param {HTMLElement} container Container to inject sidebar HTML into.
 * @param {'dashboard'|'repositories'|'chat'|'settings'} activeItem Name of current page.
 */
export function renderSidebar(container, activeItem) {
  if (!container) return;

  container.className = 'sidebar';
  container.id = 'app-sidebar';

  container.innerHTML = `
    <nav class="sidebar-nav" aria-label="Application Navigation">
      <ul class="sidebar-menu">
        <li>
          <a href="dashboard.html" class="sidebar-item ${activeItem === 'dashboard' ? 'active' : ''}" id="sidebar-dashboard-link">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="repositories.html" class="sidebar-item ${activeItem === 'repositories' ? 'active' : ''}" id="sidebar-repos-link">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <span>Repositories</span>
          </a>
        </li>
        <li>
          <a href="#" class="sidebar-item ${activeItem === 'chat' ? 'active' : ''}" id="sidebar-chat-link">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>AI Chat</span>
          </a>
        </li>
        <li>
          <a href="#" class="sidebar-item ${activeItem === 'settings' ? 'active' : ''}" id="sidebar-settings-link">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Settings</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer">
      <div class="developer-profile-card">
        <div class="profile-info-compact">
          <div class="profile-name-small">Developer</div>
          <div class="profile-email-small">developer@example.com</div>
        </div>
      </div>
    </div>
  `;

  // Bind toast actions for inactive modules
  const chatLink = container.querySelector('#sidebar-chat-link');
  const settingsLink = container.querySelector('#sidebar-settings-link');

  if (chatLink) {
    chatLink.addEventListener('click', (e) => {
      e.preventDefault();
      toast.info('Please open a repository from Dashboard or Repositories page to start AI Chat.');
    });
  }

  if (settingsLink) {
    settingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      toast.info('Settings module will be available in a future update.');
    });
  }
}
