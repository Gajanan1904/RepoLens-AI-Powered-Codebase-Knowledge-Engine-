import { projectsApi } from '../api/projects.js';
import { guardRoute } from '../utils/auth.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';
import { getRepoListSkeletonHTML } from '../components/loading.js';
import { getErrorStateHTML } from '../components/errorState.js';
import { getEmptyStateHTML } from '../components/emptyState.js';
import { modalManager } from '../components/modals.js';
import { toast } from '../components/toast.js';

export const repositoriesPage = {
  init() {
    // 1. Enforce authentication
    guardRoute();

    // 2. Render Shared Layout Shells
    renderNavbar(document.getElementById('navbar-container'));
    renderSidebar(document.getElementById('sidebar-container'), 'repositories');

    // Cache repo lists
    this.repositories = [];
    
    // 3. Load Repositories Cards
    this.loadRepositories();

    // 4. Bind Action Hooks
    this.bindEvents();
  },

  /**
   * Fetch repositories from projects API.
   */
  async loadRepositories() {
    const container = document.getElementById('repos-container');
    if (container) {
      container.innerHTML = getRepoListSkeletonHTML(6);
    }

    try {
      const data = await projectsApi.listProjects();
      
      // Sort projects by newest first
      this.repositories = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      this.renderRepositoriesList(this.repositories);

    } catch (error) {
      toast.error('Failed to load repositories.');
      const errHTML = getErrorStateHTML({
        message: error.message || 'Unable to connect to database.',
        retryId: 'repos-error-retry'
      });
      if (container) container.innerHTML = errHTML;

      const retryBtn = document.getElementById('repos-error-retry');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => this.loadRepositories());
      }
    }
  },

  /**
   * Render cards grid.
   */
  renderRepositoriesList(repos) {
    const container = document.getElementById('repos-container');
    if (!container) return;

    if (!repos || !repos.length) {
      container.innerHTML = getEmptyStateHTML({
        title: 'No repositories available.',
        description: 'Create a new project index and upload code repositories to start analyzing.',
        btnLabel: 'Create First Repository',
        btnId: 'empty-repos-create-btn'
      });

      const btn = container.querySelector('#empty-repos-create-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          modalManager.openCreateProjectModal(() => this.loadRepositories());
        });
      }
      return;
    }

    container.innerHTML = `
      <div class="repos-grid">
        ${repos.map(repo => {
          const relativeTime = this.formatRelativeTime(repo.updated_at || repo.created_at);
          const statusClass = `status-${repo.status.toLowerCase()}`;
          return `
            <div class="card repo-card card-hover" data-id="${repo.id}">
              <div class="repo-card-body">
                <div class="repo-card-header">
                  <div>
                    <h3 class="repo-card-title">${repo.name}</h3>
                    <span class="repo-card-subdir">${repo.repository_name}</span>
                  </div>
                  <span class="status-badge ${statusClass}">${repo.status}</span>
                </div>
                <p class="repo-card-desc mt-sm">${repo.description || 'No description provided.'}</p>
                <div class="repo-card-metadata">
                  <span class="badge badge-tech capitalize">${repo.upload_type}</span>
                </div>
              </div>
              
              <div class="repo-card-footer">
                <span class="repo-date">Updated ${relativeTime}</span>
                <div class="repo-footer-actions">
                  <button class="btn btn-secondary btn-sm btn-icon btn-delete-repo" data-id="${repo.id}" data-name="${repo.name}" aria-label="Delete repository">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                  <button class="btn btn-secondary btn-sm btn-upload-zip" data-id="${repo.id}" data-name="${repo.name}">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"></path></svg>
                    <span>ZIP</span>
                  </button>
                  <button class="btn btn-primary btn-sm btn-open-repo" data-id="${repo.id}">
                    <span>Open</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Bind item actions
    container.querySelectorAll('.btn-open-repo').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.location.href = `repository-details.html?id=${id}`;
      });
    });

    container.querySelectorAll('.btn-upload-zip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        modalManager.openUploadModal(id, name, () => this.loadRepositories());
      });
    });

    container.querySelectorAll('.btn-delete-repo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        this.confirmDelete(id, name);
      });
    });
  },

  /**
   * Delete confirmation dialog handler.
   */
  confirmDelete(id, name) {
    // Custom premium confirmation modal overlay dynamically created
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'delete-confirm-overlay';
    overlay.style.zIndex = 'var(--z-modal-overlay)';
    
    overlay.innerHTML = `
      <div class="modal-box animate-slide-up" style="max-width: 400px;" role="dialog">
        <h3 class="modal-title text-danger">Delete Repository</h3>
        <p class="mt-sm text-sm text-secondary">Are you sure you want to delete <strong>${name}</strong>? This operation will remove all indexed files, vector embeddings, and historical intelligence logs. This cannot be undone.</p>
        
        <div class="flex justify-end gap-md mt-lg">
          <button class="btn btn-secondary" id="confirm-cancel-btn">Cancel</button>
          <button class="btn btn-primary bg-danger border-none" id="confirm-delete-btn" style="background-color: var(--color-danger);">Delete</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => { overlay.style.opacity = '1'; }, 10);

    const cancelBtn = overlay.querySelector('#confirm-cancel-btn');
    const deleteBtn = overlay.querySelector('#confirm-delete-btn');

    const closeConfirm = () => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 200);
    };

    cancelBtn.addEventListener('click', closeConfirm);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeConfirm();
    });

    deleteBtn.addEventListener('click', async () => {
      deleteBtn.classList.add('btn-loading');
      deleteBtn.disabled = true;

      try {
        await projectsApi.deleteProject(id);
        toast.success(`Repository "${name}" deleted.`);
        closeConfirm();
        this.loadRepositories();
      } catch (error) {
        deleteBtn.classList.remove('btn-loading');
        deleteBtn.disabled = false;
        toast.error(error.message || 'Delete operation failed.');
      }
    });
  },

  /**
   * Formats ISO dates to relative strings ("2 hours ago").
   */
  formatRelativeTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hours ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay} days ago`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  },

  /**
   * Bind page DOM interactions.
   */
  bindEvents() {
    const searchInput = document.getElementById('repo-search');
    const refreshBtn = document.getElementById('btn-repos-refresh');
    const createBtn = document.getElementById('btn-create-repo');

    if (searchInput) {
      // Instant frontend filtering
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = this.repositories.filter(repo => 
          repo.name.toLowerCase().includes(query) ||
          repo.repository_name.toLowerCase().includes(query) ||
          (repo.description && repo.description.toLowerCase().includes(query))
        );
        this.renderRepositoriesList(filtered);
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadRepositories());
    }

    if (createBtn) {
      createBtn.addEventListener('click', () => {
        modalManager.openCreateProjectModal(() => this.loadRepositories());
      });
    }
  }
};
