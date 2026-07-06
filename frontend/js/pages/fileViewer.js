import { projectsApi } from '../api/projects.js';
import { guardRoute } from '../utils/auth.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';
import { toast } from '../components/toast.js';

export const fileViewerPage = {
  init() {
    // 1. Guard route authentication
    guardRoute();

    // 2. Parse search parameters
    const params = new URLSearchParams(window.location.search);
    this.projectId = params.get('project');
    this.fileId = params.get('file');

    if (!this.projectId || !this.fileId) {
      toast.error('File viewer parameters missing.');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
      return;
    }

    // 3. Render Shared Layout Shells
    renderNavbar(document.getElementById('navbar-container'));
    renderSidebar(document.getElementById('sidebar-container'), 'repositories');

    // 4. Load file details
    this.loadFileContent();
  },

  /**
   * Fetch and display file content.
   */
  async loadFileContent() {
    const linesContainer = document.getElementById('code-lines-container');
    const numbersContainer = document.getElementById('line-numbers-container');
    const breadcrumbs = document.getElementById('file-breadcrumbs');
    const headerCard = document.getElementById('file-header-card');

    try {
      const fileData = await projectsApi.getProjectFile(this.projectId, this.fileId);
      
      // Store raw content
      this.rawContent = fileData.content;
      this.filename = fileData.filename;

      // 1. Render Breadcrumbs
      const pathParts = fileData.path.split('/');
      const breadcrumbHTML = `
        <div class="breadcrumb-item">
          <a href="repositories.html" class="breadcrumb-link">Repositories</a>
          <span class="breadcrumb-separator">/</span>
        </div>
        <div class="breadcrumb-item">
          <a href="repository-details.html?id=${this.projectId}" class="breadcrumb-link">Workspace</a>
          <span class="breadcrumb-separator">/</span>
        </div>
        ${pathParts.map((part, index) => {
          const isLast = index === pathParts.length - 1;
          return `
            <div class="breadcrumb-item">
              <span class="${isLast ? 'breadcrumb-active' : 'text-muted'}">${part}</span>
              ${isLast ? '' : '<span class="breadcrumb-separator">/</span>'}
            </div>
          `;
        }).join('')}
      `;
      breadcrumbs.innerHTML = breadcrumbHTML;

      // 2. Render File Header Card
      const sizeKB = (fileData.size / 1024).toFixed(1);
      headerCard.innerHTML = `
        <div class="file-title-block">
          <h1 class="file-title">${fileData.filename}</h1>
          <span class="badge badge-tech capitalize">${fileData.language}</span>
          <span class="file-size-badge font-mono">${sizeKB} KB</span>
        </div>
        <div class="file-actions-row">
          <button class="btn btn-secondary" id="btn-copy-code" aria-label="Copy file content">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copy</span>
          </button>
          <button class="btn btn-secondary" id="btn-download-file" aria-label="Download file">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path></svg>
            <span>Download</span>
          </button>
        </div>
      `;

      // 3. Render Line Numbers & Code Lines
      const lines = fileData.content.split('\n');
      
      let numbersHTML = '';
      let codeHTML = '';

      lines.forEach((line, index) => {
        const lineNum = index + 1;
        numbersHTML += `<div class="line-number-row">${lineNum}</div>`;
        
        const highlighted = this.highlightSyntax(line, fileData.language);
        codeHTML += `<div class="code-line-row"><span class="code-line-text">${highlighted || ' '}</span></div>`;
      });

      numbersContainer.innerHTML = numbersHTML;
      linesContainer.innerHTML = codeHTML;

      // 4. Bind Action Listeners
      this.bindActions();

    } catch (error) {
      toast.error('Failed to load file content.');
      linesContainer.innerHTML = `<div class="text-danger text-center py-xl w-full">${error.message || 'Error fetching codebase file.'}</div>`;
    }
  },

  /**
   * Bind Copy and Download buttons.
   */
  bindActions() {
    const copyBtn = document.getElementById('btn-copy-code');
    const downloadBtn = document.getElementById('btn-download-file');

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(this.rawContent);
          toast.success('Code copied to clipboard!');
        } catch {
          toast.error('Clipboard access failed.');
        }
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const blob = new Blob([this.rawContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Downloading ${this.filename}...`);
      });
    }
  },

  /**
   * Fast, lightweight Regex Tokenizer for standard python/JS highlights.
   */
  highlightSyntax(line, language) {
    if (!line) return '';
    let escaped = this.escapeHTML(line);

    // Skip highlight if language is not supported
    const langLower = (language || '').toLowerCase();
    if (langLower !== 'python' && langLower !== 'javascript' && langLower !== 'js' && langLower !== 'css' && langLower !== 'html') {
      return escaped;
    }

    // Comment highlight
    if (escaped.trim().startsWith('#') || escaped.trim().startsWith('//')) {
      return `<span class="token-comment">${escaped}</span>`;
    }

    // Keywords
    const keywords = [
      'class', 'def', 'function', 'return', 'import', 'from', 'as', 'if', 'else', 'elif', 'for', 'while', 'in', 
      'const', 'let', 'var', 'async', 'await', 'export', 'default', 'try', 'except', 'catch', 'finally', 'raise', 'throw'
    ];

    // Regex replace for keywords
    keywords.forEach(word => {
      const reg = new RegExp(`\\b(${word})\\b`, 'g');
      escaped = escaped.replace(reg, '<span class="token-keyword">$1</span>');
    });

    // Strings (double/single quotes)
    escaped = escaped.replace(/(".*?"|'.*?')/g, '<span class="token-string">$1</span>');

    // Numbers
    escaped = escaped.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');

    return escaped;
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
