import { storage } from '../utils/storage.js';

const THEME_STORAGE_KEY = 'repolens_theme';
const DEFAULT_THEME = 'dark';

// Active listeners for theme changes
const listeners = [];

/**
 * Initialize and manage the application's active theme.
 */
export const themeState = {
  /**
   * Get the current active theme.
   * @returns {'dark'|'light'}
   */
  getTheme() {
    // Get stored theme or default to system preference if any, otherwise dark
    const stored = storage.get(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    
    return DEFAULT_THEME;
  },

  /**
   * Apply the theme to document.documentElement.
   * @param {'dark'|'light'} theme
   */
  setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    
    storage.set(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Notify all registered listeners
    listeners.forEach(callback => callback(theme));
  },

  /**
   * Toggle between dark and light themes.
   * @returns {'dark'|'light'} The new theme.
   */
  toggle() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  },

  /**
   * Initialize theme on application boot.
   */
  init() {
    const active = this.getTheme();
    this.setTheme(active);
  },

  /**
   * Subscribe to theme changes.
   * @param {function(string): void} callback
   * @returns {function(): void} Unsubscribe function.
   */
  subscribe(callback) {
    listeners.push(callback);
    return () => {
      const idx = listeners.indexOf(callback);
      if (idx !== -1) {
        listeners.splice(idx, 1);
      }
    };
  }
};
