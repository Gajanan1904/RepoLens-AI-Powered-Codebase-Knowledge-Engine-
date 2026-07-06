/**
 * Reusable Error State Component.
 * @param {Object} params
 * @param {string} params.message The error explanation message.
 * @param {string} [params.retryId] Optional ID for the Retry Button.
 * @returns {string} HTML string.
 */
export function getErrorStateHTML({ message, retryId = 'error-retry-btn' }) {
  return `
    <div class="error-state-card animate-fade-in">
      <div class="error-state-icon">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="error-state-content">
        <h4 class="error-state-title">Data Loading Failed</h4>
        <p class="error-state-desc">${message}</p>
      </div>
      <button class="btn btn-secondary btn-sm" id="${retryId}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
        <span>Retry</span>
      </button>
    </div>
  `;
}
