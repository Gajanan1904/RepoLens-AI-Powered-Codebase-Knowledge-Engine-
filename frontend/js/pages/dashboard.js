import { dashboardApi } from '../api/dashboard.js';
import { guardRoute } from '../utils/auth.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';
import { getStatsSkeletonHTML, getTableSkeletonHTML, getChartsSkeletonHTML } from '../components/loading.js';
import { getErrorStateHTML } from '../components/errorState.js';
import { getEmptyStateHTML } from '../components/emptyState.js';
import { modalManager } from '../components/modals.js';
import { renderStatusChart, renderLanguageChart, renderProjectTypeChart } from '../components/charts.js';
import { toast } from '../components/toast.js';

export const dashboardPage = {
  init() {
    // 1. Guard route (enforce authentication)
    guardRoute();

    // 2. Render Shared Layout Shells
    renderNavbar(document.getElementById('navbar-container'));
    renderSidebar(document.getElementById('sidebar-container'), 'dashboard');

    // 3. Load Metrics and Charts
    this.loadDashboardData();

    // 4. Bind Action Listeners
    this.bindEvents();
  },

  /**
   * Fetch and display dashboard summaries.
   */
  async loadDashboardData() {
    const statsContainer = document.getElementById('stats-container');
    const statusChartContainer = document.getElementById('chart-status-container');
    const langChartContainer = document.getElementById('chart-lang-container');
    const typesChartContainer = document.getElementById('chart-types-container');
    const tableContainer = document.getElementById('table-repos-container');

    // 1. Mount Skeletons
    if (statsContainer) statsContainer.innerHTML = getStatsSkeletonHTML();
    if (statusChartContainer) statusChartContainer.innerHTML = '<div></div>'; // Replaced by skeleton grid
    if (typesChartContainer) typesChartContainer.innerHTML = '';
    
    // Set chart cards content to loading animations
    const chartsWrapper = document.querySelector('.charts-grid-row');
    let chartsSkeletonNode = null;
    if (chartsWrapper) {
      chartsSkeletonNode = document.createElement('div');
      chartsSkeletonNode.className = 'w-full';
      chartsSkeletonNode.innerHTML = getChartsSkeletonHTML();
      chartsWrapper.style.display = 'none'; // Temporarily hide grid
      chartsWrapper.parentNode.insertBefore(chartsSkeletonNode, chartsWrapper);
    }

    if (tableContainer) tableContainer.innerHTML = getTableSkeletonHTML();

    try {
      const data = await dashboardApi.getDashboard();

      // Remove charts skeleton and show real charts grid
      if (chartsSkeletonNode && chartsSkeletonNode.parentNode) {
        chartsSkeletonNode.parentNode.removeChild(chartsSkeletonNode);
      }
      if (chartsWrapper) chartsWrapper.style.display = '';

      // 2. Render Statistics Metrics
      this.renderStatistics(statsContainer, data.summary);

      // 3. Render Charts
      renderStatusChart(statusChartContainer, data.processing_status);
      renderLanguageChart(langChartContainer, data.language_distribution);
      renderProjectTypeChart(typesChartContainer, data.project_type_distribution);

      // 4. Render Recent Projects Table
      this.renderRecentTable(tableContainer, data.recent_repositories);

    } catch (error) {
      toast.error('Failed to load dashboard data.');
      
      // Cleanup skeletons and draw errors
      if (chartsSkeletonNode && chartsSkeletonNode.parentNode) {
        chartsSkeletonNode.parentNode.removeChild(chartsSkeletonNode);
      }
      if (chartsWrapper) chartsWrapper.style.display = '';

      const errHTML = getErrorStateHTML({
        message: error.message || 'Check database connection and try again.',
        retryId: 'dashboard-error-retry'
      });

      if (statsContainer) statsContainer.innerHTML = '';
      if (tableContainer) tableContainer.innerHTML = errHTML;

      // Bind retry
      const retryBtn = document.getElementById('dashboard-error-retry');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => this.loadDashboardData());
      }
    }
  },

  /**
   * Render Stats Card markup.
   */
  renderStatistics(container, summary) {
    if (!container || !summary) return;

    const cards = [
      { label: 'Total Repos', val: summary.total_repositories },
      { label: 'Indexed Files', val: summary.total_files },
      { label: 'Functions', val: summary.total_functions },
      { label: 'Classes', val: summary.total_classes },
      { label: 'Frameworks', val: summary.total_frameworks },
      { label: 'Languages', val: summary.total_languages }
    ];

    container.innerHTML = `
      <div class="grid grid-cols-2 md-grid-cols-3 lg-grid-cols-6 gap-md w-full">
        ${cards.map(card => `
          <div class="metric-card">
            <span class="metric-title">${card.label}</span>
            <span class="metric-value">${this.formatNumber(card.val)}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * Render Recent Projects Table markup.
   */
  renderRecentTable(container, repos) {
    if (!container) return;

    if (!repos || !repos.length) {
      container.innerHTML = getEmptyStateHTML({
        title: 'No repositories found.',
        description: 'You haven\'t indexed any codebases yet.',
        btnLabel: 'Index First Repository',
        btnId: 'empty-table-create-btn'
      });

      // Bind CTA inside empty state
      const btn = container.querySelector('#empty-table-create-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          modalManager.openCreateProjectModal(() => this.loadDashboardData());
        });
      }
      return;
    }

    container.innerHTML = `
      <div class="card p-none mt-xs">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Repository</th>
                <th>Directory</th>
                <th>Status</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              ${repos.map(repo => {
                const relativeTime = this.formatRelativeTime(repo.created_at);
                const statusClass = `status-${repo.status.toLowerCase()}`;
                return `
                  <tr class="repo-row" data-id="${repo.id}">
                    <td>
                      <div class="table-repo-name">${repo.name}</div>
                    </td>
                    <td>
                      <div class="table-repo-subdir">${repo.repository_name}</div>
                    </td>
                    <td>
                      <span class="status-badge ${statusClass}">${repo.status}</span>
                    </td>
                    <td>
                      <div class="text-muted text-sm">${relativeTime}</div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bind row clicks to navigate to Details Workspace page (implemented later)
    const rows = container.querySelectorAll('.repo-row');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        const id = row.getAttribute('data-id');
        window.location.href = `repository-details.html?id=${id}`;
      });
    });
  },

  /**
   * Format numbers to localized strings.
   */
  formatNumber(num) {
    if (num === undefined || num === null) return '0';
    return Number(num).toLocaleString();
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
   * Bind DOM trigger actions.
   */
  bindEvents() {
    const refreshBtn = document.getElementById('btn-dashboard-refresh');
    const newRepoBtn = document.getElementById('btn-create-repo');
    const actionCreate = document.getElementById('action-create-repo');
    const actionBrowse = document.getElementById('action-browse-repos');
    const actionSettings = document.getElementById('action-settings');

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadDashboardData());
    }

    const openCreation = () => {
      modalManager.openCreateProjectModal(() => this.loadDashboardData());
    };

    if (newRepoBtn) newRepoBtn.addEventListener('click', openCreation);
    if (actionCreate) actionCreate.addEventListener('click', openCreation);

    if (actionBrowse) {
      actionBrowse.addEventListener('click', () => {
        window.location.href = 'repositories.html';
      });
    }

    if (actionSettings) {
      actionSettings.addEventListener('click', () => {
        toast.info('Settings module will be available in a future update.');
      });
    }
  }
};
