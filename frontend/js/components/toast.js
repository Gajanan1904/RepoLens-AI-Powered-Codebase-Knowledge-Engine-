/**
 * Toast notification system.
 * Creates a top-right overlay to display notifications.
 */

// Ensure container exists
function getContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Show a toast notification.
 * @param {string} message The notification message.
 * @param {'success'|'error'|'warning'|'info'} type The type of notification.
 * @param {number} duration Duration in ms before automatic dismissal.
 */
function show(message, type = 'info', duration = 4000) {
  const container = getContainer();
  
  const toastEl = document.createElement('div');
  toastEl.className = `toast toast-${type} animate-slide-up`;
  
  // Choose icon based on type
  let icon = '';
  switch (type) {
    case 'success':
      icon = `<svg viewBox="0 0 24 24" class="toast-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      break;
    case 'error':
      icon = `<svg viewBox="0 0 24 24" class="toast-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
      break;
    case 'warning':
      icon = `<svg viewBox="0 0 24 24" class="toast-icon"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
      break;
    default:
      icon = `<svg viewBox="0 0 24 24" class="toast-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toastEl.innerHTML = `
    ${icon}
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Dismiss notification">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;

  // Bind close action
  const closeBtn = toastEl.querySelector('.toast-close');
  const dismiss = () => {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      if (toastEl.parentNode) {
        toastEl.parentNode.removeChild(toastEl);
      }
    }, 300);
  };

  closeBtn.addEventListener('click', dismiss);

  // Auto dismiss
  const timeoutId = setTimeout(dismiss, duration);
  
  container.appendChild(toastEl);
}

export const toast = {
  success(msg, duration) { show(msg, 'success', duration); },
  error(msg, duration) { show(msg, 'error', duration); },
  warning(msg, duration) { show(msg, 'warning', duration); },
  info(msg, duration) { show(msg, 'info', duration); }
};
