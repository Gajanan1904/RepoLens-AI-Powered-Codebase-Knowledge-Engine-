/**
 * Reusable Empty State Component.
 * @param {Object} params
 * @param {string} params.title Title of empty state.
 * @param {string} params.description Subtitle description.
 * @param {string} [params.btnLabel] Optional text for Action CTA button.
 * @param {string} [params.btnId] Optional ID for Action CTA button.
 * @returns {string} HTML string.
 */
export function getEmptyStateHTML({ title, description, btnLabel = '', btnId = '' }) {
  const buttonMarkup = btnLabel && btnId
    ? `<button class="btn btn-primary mt-md" id="${btnId}">${btnLabel}</button>`
    : '';

  return `
    <div class="empty-state animate-fade-in">
      <div class="empty-state-icon">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </div>
      <h3 class="empty-state-title">${title}</h3>
      <p class="empty-state-desc">${description}</p>
      ${buttonMarkup}
    </div>
  `;
}
