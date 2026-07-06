import { projectsApi } from '../api/projects.js';
import { intelligenceApi } from '../api/intelligence.js';
import { aiApi } from '../api/ai.js';
import { guardRoute } from '../utils/auth.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';
import { getStatsSkeletonHTML, getTableSkeletonHTML } from '../components/loading.js';
import { getErrorStateHTML } from '../components/errorState.js';
import { getEmptyStateHTML } from '../components/emptyState.js';
import { toast } from '../components/toast.js';

export const repositoryDetailsPage = {
  init() {
    // 1. Guard session auth
    guardRoute();

    // 2. Parse URL parameter
    const params = new URLSearchParams(window.location.search);
    this.projectId = params.get('id');

    if (!this.projectId) {
      toast.error('No repository project selected.');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
      return;
    }

    // 3. Render Shared Layout Shells
    renderNavbar(document.getElementById('navbar-container'));
    renderSidebar(document.getElementById('sidebar-container'), 'repositories');

    // Tab state tracking
    this.loadedTabs = {
      overview: false,
      explorer: false,
      insights: false,
      aichat: false
    };

    // Tree expanded state memory
    this.expandedFolders = new Set();

    // 4. Bind DOM listeners
    this.bindTabEvents();

    // 5. Initial load (Overview)
    this.switchTab('overview');
  },

  /**
   * Bind switching buttons clicks.
   */
  bindTabEvents() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });
  },

  /**
   * Tab manager.
   */
  switchTab(tabName) {
    // 1. Update Buttons Active states
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    // 2. Update Content Panes visibility
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `${tabName}-pane`);
    });

    // 3. Trigger content loading once
    if (!this.loadedTabs[tabName]) {
      this.loadedTabs[tabName] = true;
      if (tabName === 'overview') this.loadOverviewTab();
      if (tabName === 'explorer') this.loadExplorerTab();
      if (tabName === 'insights') this.loadInsightsTab();
      if (tabName === 'aichat') this.loadAiChatTab();
    }
  },

  /**
   * Loads Header identity and Overview widgets.
   */
  async loadOverviewTab() {
    const headerContainer = document.getElementById('repo-header-container');
    const pane = document.getElementById('overview-pane');

    pane.innerHTML = getStatsSkeletonHTML() + '<div class="mt-lg">' + getTableSkeletonHTML() + '</div>';

    try {
      // Fetch details + intelligence statistics concurrently
      const [project, intelligence] = await Promise.all([
        projectsApi.getProject(this.projectId),
        intelligenceApi.getIntelligence(this.projectId)
      ]);

      // 1. Render Header info
      const status = project.status ? project.status.toLowerCase() : 'pending';
      const statusClass = `status-${status}`;
      headerContainer.innerHTML = `
        <div>
          <h1 class="dashboard-title">${project.name}</h1>
          <div class="flex items-center gap-sm mt-xs">
            <span class="status-badge ${statusClass}">${project.status}</span>
            <span class="text-muted text-sm">${project.repository_name}</span>
          </div>
        </div>
      `;

      // 2. Render Overview Grid
      const stats = intelligence.statistics;
      const projectType = typeof intelligence.identity.type === 'object' 
        ? (intelligence.identity.type.type || 'Unknown') 
        : (intelligence.identity.type || 'Unknown');

      pane.innerHTML = `
        <div class="grid grid-cols-2 md-grid-cols-4 gap-md mb-xl animate-fade-in">
          <div class="metric-card">
            <span class="metric-title">Total Files</span>
            <span class="metric-value">${stats.files}</span>
          </div>
          <div class="metric-card">
            <span class="metric-title">Lines of Code</span>
            <span class="metric-value">${stats.total_size_bytes ? Math.round(stats.total_size_bytes / 100).toLocaleString() : 0}</span>
          </div>
          <div class="metric-card">
            <span class="metric-title">Detected Classes</span>
            <span class="metric-value">${stats.classes}</span>
          </div>
          <div class="metric-card">
            <span class="metric-title">Detected Functions</span>
            <span class="metric-value">${stats.functions}</span>
          </div>
        </div>

        <div class="overview-meta-grid animate-fade-in delay-1">
          <!-- Identity Info -->
          <div class="card">
            <h3 class="meta-section-title">Identity & Path</h3>
            <ul class="overview-list">
              <li class="overview-list-item"><span class="overview-list-key">Project Type</span><span class="overview-list-val badge badge-tech">${projectType}</span></li>
              <li class="overview-list-item"><span class="overview-list-key">Indexed Size</span><span class="overview-list-val">${(stats.total_size_bytes / (1024 * 1024)).toFixed(2)} MB</span></li>
              <li class="overview-list-item"><span class="overview-list-key">Storage Path</span><span class="overview-list-val text-xs text-muted font-mono">${project.storage_path}</span></li>
              <li class="overview-list-item"><span class="overview-list-key">Creation Date</span><span class="overview-list-val">${new Date(project.created_at).toLocaleDateString()}</span></li>
            </ul>
          </div>


          <!-- Technologies -->
          <div class="card">
            <h3 class="meta-section-title">Languages & Frameworks</h3>
            <div class="flex flex-wrap gap-xs mb-sm">
              ${intelligence.languages.map(l => `<span class="badge capitalize" style="border-color: var(--color-primary-border);">${l}</span>`).join('')}
            </div>
            <div class="flex flex-wrap gap-xs">
              ${intelligence.frameworks.map(f => `<span class="badge badge-tech capitalize">${f}</span>`).join('')}
            </div>
          </div>

          <!-- Entry Points -->
          <div class="card">
            <h3 class="meta-section-title">Key Entry Points</h3>
            <ul class="overview-list">
              ${intelligence.entry_points.map(ep => `
                <li class="overview-list-item">
                  <span class="font-mono text-xs truncate w-full text-left" style="color: var(--color-primary);">${ep}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;

    } catch (error) {
      toast.error('Failed to load project details.');
      pane.innerHTML = getErrorStateHTML({
        message: error.message || 'Check database connection and try again.',
        retryId: 'overview-error-retry'
      });
      const retryBtn = document.getElementById('overview-error-retry');
      if (retryBtn) retryBtn.addEventListener('click', () => this.loadOverviewTab());
    }
  },

  /**
   * Loads Explorer folder trees.
   */
  async loadExplorerTab() {
    const root = document.getElementById('explorer-tree-root');
    const searchInput = document.getElementById('explorer-search');
    
    root.innerHTML = `<div class="py-lg text-center"><span class="pulse-glow text-muted">Reading structure...</span></div>`;

    try {
      const data = await projectsApi.getProjectExplorer(this.projectId);
      this.explorerTree = data.tree;

      // Render Tree
      this.renderExplorerTree(this.explorerTree, root);

      // Search filtration
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          const query = searchInput.value.trim().toLowerCase();
          this.filterTreeNodes(query);
        });
      }

    } catch (error) {
      toast.error('Failed to load project files tree.');
      root.innerHTML = `<div class="text-danger text-center text-xs py-md">${error.message || 'Error loading file tree.'}</div>`;
    }
  },

  /**
   * Renders the directory tree.
   */
  renderExplorerTree(tree, container) {
    if (!tree || !container) return;

    // Build hierarchical HTML
    const buildHTML = (nodes, depth = 0) => {
      let html = '';
      nodes.forEach(node => {
        const paddingLeft = depth * 16 + 12;
        const isFolder = node.type === 'folder';
        
        if (isFolder) {
          const folderId = `folder-${node.name}-${depth}`;
          const isExpanded = this.expandedFolders.has(folderId);
          const icon = isExpanded 
            ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>` 
            : `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;

          html += `
            <div class="explorer-folder-wrapper" data-node-name="${node.name.toLowerCase()}">
              <div class="explorer-row folder-node" style="padding-left: ${paddingLeft}px;" data-folder-id="${folderId}">
                <span class="explorer-row-icon">${icon}</span>
                <span class="explorer-row-label">${node.name}</span>
              </div>
              <div class="explorer-folder-children ${isExpanded ? '' : 'hidden'}" id="${folderId}">
                ${buildHTML(node.children, depth + 1)}
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="explorer-row file-node" style="padding-left: ${paddingLeft}px;" data-file-id="${node.id}" data-file-path="${node.path}" data-node-name="${node.name.toLowerCase()}">
              <span class="explorer-row-icon text-muted">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              </span>
              <span class="explorer-row-label">${node.name}</span>
            </div>
          `;
        }
      });
      return html;
    };

    container.innerHTML = buildHTML(tree);

    // Bind Folder expand clicks
    container.querySelectorAll('.folder-node').forEach(row => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = row.getAttribute('data-folder-id');
        const children = container.querySelector(`#${id}`);
        
        if (this.expandedFolders.has(id)) {
          this.expandedFolders.delete(id);
          children.classList.add('hidden');
        } else {
          this.expandedFolders.add(id);
          children.classList.remove('hidden');
        }
        
        // Re-render folder icon state
        const iconContainer = row.querySelector('.explorer-row-icon');
        iconContainer.innerHTML = this.expandedFolders.has(id)
          ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`
          : `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
      });
    });

    // Bind File selection clicks
    container.querySelectorAll('.file-node').forEach(row => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        container.querySelectorAll('.file-node').forEach(n => n.classList.remove('active'));
        row.classList.add('active');

        const fileId = row.getAttribute('data-file-id');
        const filePath = row.getAttribute('data-file-path');
        this.previewFileContent(fileId, filePath);
      });
    });
  },

  /**
   * Fetches preview snippet for a specific file node.
   */
  async previewFileContent(fileId, path) {
    const previewContainer = document.getElementById('explorer-preview-root');
    previewContainer.innerHTML = `<div class="py-lg text-center flex justify-center items-center h-full"><span class="pulse-glow text-muted">Reading code...</span></div>`;

    try {
      const fileData = await projectsApi.getProjectFile(this.projectId, fileId);

      // Truncate code to first 40 lines for preview speed
      const lines = fileData.content.split('\n');
      const truncated = lines.slice(0, 40).join('\n');
      const hasMore = lines.length > 40;

      previewContainer.innerHTML = `
        <div class="preview-file-header">
          <span class="font-mono text-sm font-semibold">${fileData.filename}</span>
          <button class="btn btn-primary btn-sm" id="btn-open-full-viewer">
            <span>View Full File</span>
          </button>
        </div>
        <div class="preview-file-body">
          <pre class="preview-code-pre"><code>${this.escapeHTML(truncated)}</code></pre>
          ${hasMore ? `<div class="text-muted text-xs mt-sm font-mono text-center border-t border-dashed pt-xs">+ ${lines.length - 40} more lines (open full viewer to see entire content)</div>` : ''}
        </div>
      `;

      // Bind Full Viewer route
      document.getElementById('btn-open-full-viewer').addEventListener('click', () => {
        window.location.href = `file-viewer.html?project=${this.projectId}&file=${fileId}`;
      });

    } catch (error) {
      previewContainer.innerHTML = `
        <div class="preview-placeholder text-danger">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <p class="mt-md text-sm">${error.message || 'Failed to parse code snippet.'}</p>
        </div>
      `;
    }
  },

  /**
   * Search filter explorer rows.
   */
  filterTreeNodes(query) {
    const explorer = document.getElementById('explorer-tree-root');
    const folderWrappers = explorer.querySelectorAll('.explorer-folder-wrapper');
    const fileNodes = explorer.querySelectorAll('.file-node');

    if (!query) {
      // Reset displays
      explorer.querySelectorAll('.explorer-row').forEach(n => n.style.display = '');
      explorer.querySelectorAll('.explorer-folder-children').forEach(c => {
        const folderId = c.id;
        c.classList.toggle('hidden', !this.expandedFolders.has(folderId));
      });
      return;
    }

    // Hide files that do not match
    fileNodes.forEach(node => {
      const match = node.getAttribute('data-node-name').includes(query);
      node.style.display = match ? 'flex' : 'none';
    });

    // Expand directories that contain matching files
    folderWrappers.forEach(wrapper => {
      const folderNode = wrapper.querySelector('.folder-node');
      const childContainer = wrapper.querySelector('.explorer-folder-children');
      
      const hasVisibleChild = wrapper.querySelectorAll('.file-node[style="display: flex;"]').length > 0;
      if (hasVisibleChild) {
        folderNode.style.display = 'flex';
        childContainer.classList.remove('hidden');
      } else {
        // Check if directory matches folder query
        const folderMatches = folderNode.getAttribute('data-folder-id').toLowerCase().includes(query);
        if (folderMatches) {
          folderNode.style.display = 'flex';
          childContainer.classList.remove('hidden');
          // Show all children inside matching folder
          wrapper.querySelectorAll('.explorer-row').forEach(r => r.style.display = 'flex');
        } else {
          folderNode.style.display = 'none';
          childContainer.classList.add('hidden');
        }
      }
    });
  },

  /**
   * Loads Insights metrics.
   */
  async loadInsightsTab() {
    const pane = document.getElementById('insights-pane');
    pane.innerHTML = getStatsSkeletonHTML();

    try {
      const data = await projectsApi.getProjectInsights(this.projectId);

      pane.innerHTML = `
        <div class="grid grid-cols-1 md-grid-cols-2 gap-lg animate-fade-in">
          
          <!-- Languages Distributions -->
          <div class="card flex flex-col">
            <h3 class="meta-section-title">Lines Distribution by Language</h3>
            <div class="flex flex-col gap-md mt-sm flex-grow">
              ${data.languages.map(lang => `
                <div>
                  <div class="flex justify-between items-center text-sm mb-xxs">
                    <span class="font-medium text-secondary">${lang.language}</span>
                    <span class="font-bold text-muted">${lang.percentage}% (${lang.count} files)</span>
                  </div>
                  <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: ${lang.percentage}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Dependencies Matrix -->
          <div class="card">
            <h3 class="meta-section-title">Dependencies Matrix</h3>
            <div class="table-responsive" style="max-height: 280px; overflow-y: auto;">
              <table class="table">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>Target Version</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.dependencies.map(dep => `
                    <tr>
                      <td class="font-bold text-sm" style="color: var(--color-primary);">${dep.name}</td>
                      <td class="text-xs font-mono">${dep.version}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      `;

    } catch (error) {
      toast.error('Failed to load insights.');
      pane.innerHTML = `<div class="text-danger text-center text-xs py-md">${error.message || 'Error loading insights.'}</div>`;
    }
  },

  /**
   * Initializes AI Chat listeners.
   */
  loadAiChatTab() {
    const pane = document.getElementById('aichat-pane');
    const input = pane.querySelector('#chat-message-input');
    const sendBtn = pane.querySelector('#btn-send-chat');

    input.addEventListener('input', () => {
      sendBtn.disabled = !input.value.trim();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.submitChatMessage();
      }
    });

    sendBtn.addEventListener('click', () => this.submitChatMessage());

    const newChatBtn = pane.querySelector('#btn-new-chat');
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => {
        pane.querySelector('#chat-messages-container').innerHTML = `
          <div class="chat-message ai">
            <div class="chat-message-header">AI ASSISTANT</div>
            <div class="chat-message-body">
              <p>Conversation history reset. Ask me another question about this repository!</p>
            </div>
          </div>
        `;
        pane.querySelector('#chat-retrieved-contexts').innerHTML = `<div class="text-muted text-xs text-center py-xl">Matches from similarity lookups will show up here.</div>`;
      });
    }
  },

  /**
   * Triggers Chat query submission.
   */
  async submitChatMessage() {
    const pane = document.getElementById('aichat-pane');
    const input = pane.querySelector('#chat-message-input');
    const sendBtn = pane.querySelector('#btn-send-chat');
    const messagesContainer = pane.querySelector('#chat-messages-container');
    const contextContainer = pane.querySelector('#chat-retrieved-contexts');

    const question = input.value.trim();
    if (!question) return;

    // 1. Render User message bubble
    const userMsgHTML = `
      <div class="chat-message user animate-slide-up">
        <div class="chat-message-header">YOU</div>
        <div class="chat-message-body">
          <p>${this.escapeHTML(question)}</p>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', userMsgHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Clear and lock input
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    // 2. Render Typing indicator bubble
    const typingBubbleId = `typing-${Date.now()}`;
    const typingHTML = `
      <div class="chat-message ai animate-fade-in" id="${typingBubbleId}">
        <div class="chat-message-header">AI ASSISTANT</div>
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      // Fetch Chat answer + retrieved contexts concurrently
      const [chatRes, contexts] = await Promise.all([
        aiApi.chat({ project_id: Number(this.projectId), question }),
        aiApi.retrieve({ project_id: Number(this.projectId), question })
      ]);

      // Remove typing bubble
      const typingNode = document.getElementById(typingBubbleId);
      if (typingNode) typingNode.parentNode.removeChild(typingNode);

      // 3. Render AI Response
      const responseHTML = `
        <div class="chat-message ai animate-slide-up">
          <div class="chat-message-header">AI ASSISTANT (${chatRes.provider})</div>
          <div class="chat-message-body">
            ${this.formatChatResponse(chatRes.answer)}
          </div>
        </div>
      `;
      messagesContainer.insertAdjacentHTML('beforeend', responseHTML);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // 4. Render Similar retrieved contexts in right pane
      if (contexts?.context?.length) {
  contextContainer.innerHTML = contexts.context.map(ctx => `
    <div class="context-file-card">

      <div class="context-file-path">
        ${ctx.metadata?.path || ctx.knowledge_type}
      </div>

      <div class="text-xs text-muted font-mono truncate mt-xxs">
        ${ctx.knowledge_type}
      </div>

      <div class="context-file-meta">
        <span class="similarity-badge">
          Distance: ${ctx.distance}
        </span>
      </div>

      <pre class="font-mono text-xxs mt-xs overflow-x-auto p-xxs"
        style="background: rgba(8,7,16,0.5); border:1px solid var(--color-border); border-radius:2px; max-height:80px;">
${this.escapeHTML(ctx.content)}
      </pre>

    </div>
  `).join('');
} else {
  contextContainer.innerHTML =
    `<div class="text-muted text-xs text-center py-xl">
      No similarity matches found.
    </div>`;
}

    } catch (error) {
      // Remove typing bubble
      const typingNode = document.getElementById(typingBubbleId);
      if (typingNode) typingNode.parentNode.removeChild(typingNode);

      toast.error('AI chat failed.');
      const errorHTML = `
        <div class="chat-message ai text-danger animate-fade-in">
          <div class="chat-message-header">SYSTEM ERROR</div>
          <div class="chat-message-body">
            <p>${error.message || 'Connection lost. Please try again.'}</p>
          </div>
        </div>
      `;
      messagesContainer.insertAdjacentHTML('beforeend', errorHTML);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } finally {
      input.disabled = false;
      input.focus();
    }
  },

  /**
   * Helper to format markdown code blocks / bold patterns in chat answers.
   */
  formatChatResponse(text) {
    if (!text) return '';
    let escaped = this.escapeHTML(text);

    // Render code blocks ```language ... ```
    escaped = escaped.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="font-mono text-xs"><code class="language-${lang}">${code}</code></pre>`;
    });

    // Render inline code `code`
    escaped = escaped.replace(/`([^`]+)`/g, '<code class="font-mono text-xs px-xxs py-xxs" style="background-color: var(--color-surface-hover); border-radius: var(--radius-xs);">$1</code>');

    // Render bold **text**
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Replace linebreaks with paragraph breaks
    return escaped.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  },

  /**
   * Escapes HTML string injections.
   */
  escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
