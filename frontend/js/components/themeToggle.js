import { themeState } from '../state/themeState.js';

/**
 * Returns the HTML string of the Theme Toggle button with Sun/Moon SVGs.
 * Icons are controlled via CSS depending on document theme attributes.
 * @returns {string}
 */
export function getThemeToggleHTML() {
  return `
    <button class="theme-toggle-btn" aria-label="Toggle visual theme" id="global-theme-toggle">
      <!-- Sun Icon (visible in dark mode) -->
      <svg class="sun-icon" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <!-- Moon Icon (visible in light mode) -->
      <svg class="moon-icon" viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  `;
}

/**
 * Binds a click listener to the Theme Toggle button in the DOM.
 * @param {HTMLElement} element The toggle button element.
 */
export function initThemeToggle(element) {
  if (!element) return;
  element.addEventListener('click', (e) => {
    e.preventDefault();
    themeState.toggle();
  });
}
