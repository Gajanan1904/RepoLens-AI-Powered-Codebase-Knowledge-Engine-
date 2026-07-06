import { authApi } from '../api/auth.js';
import { authState } from '../state/authState.js';
import { guardRoute } from '../utils/auth.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import { toast } from '../components/toast.js';

export const loginPage = {
  init() {
    // Redirect if already authenticated
    guardRoute();
    
    this.form = document.getElementById('login-form');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.submitBtn = document.getElementById('login-btn');
    this.globalAlert = document.getElementById('login-global-alert');
    this.globalErrorMsg = document.getElementById('login-global-error-msg');

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  },

  /**
   * Handle form submission.
   */
  async handleSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    this.clearErrors();

    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;

    // Client-side validations
    let hasError = false;
    
    if (!validateEmail(email)) {
      this.showFieldError('email', 'Please enter a valid email address.');
      hasError = true;
    }
    
    if (!validatePassword(password)) {
      this.showFieldError('password', 'Password must be at least 6 characters.');
      hasError = true;
    }

    if (hasError) return;

    // Apply loading state to button
    this.setLoading(true);

    try {
      const response = await authApi.login(email, password);
      
      // Save tokens in state & local storage
      authState.login({
        access: response.access,
        refresh: response.refresh
      });

      toast.success('Login successful! Redirecting...', 2000);

      this.setLoading(false);
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.replace('dashboard.html');
      }, 1000);

    } catch (error) {
      this.setLoading(false);
      
      if (error.status === 401) {
        // Direct backend detail display
        const msg = error.payload?.detail || 'No active account found with the given credentials.';
        this.showGlobalError(msg);
        toast.error(msg);
      } else if (error.status === 400 && error.payload) {
        // Field-specific validation errors from backend
        Object.entries(error.payload).forEach(([field, messages]) => {
          const errorMsg = Array.isArray(messages) ? messages[0] : messages;
          this.showFieldError(field, errorMsg);
        });
        toast.error('Validation error. Please correct the fields.');
      } else {
        const msg = error.message || 'An unexpected error occurred. Please try again.';
        this.showGlobalError(msg);
        toast.error(msg);
      }
    }
  },

  /**
   * Set submit button loading state.
   */
  setLoading(isLoading) {
    if (isLoading) {
      this.submitBtn.classList.add('btn-loading');
      this.submitBtn.disabled = true;
    } else {
      this.submitBtn.classList.remove('btn-loading');
      this.submitBtn.disabled = false;
    }
  },

  /**
   * Display field-specific error.
   */
  showFieldError(field, message) {
    const group = document.getElementById(`group-${field}`);
    const errorEl = document.getElementById(`error-${field}`);
    const msgEl = document.getElementById(`error-${field}-msg`);
    
    if (group && errorEl && msgEl) {
      group.classList.add('has-error');
      errorEl.classList.remove('hidden');
      msgEl.textContent = message;
    }
  },

  /**
   * Display general top card alert.
   */
  showGlobalError(message) {
    if (this.globalAlert && this.globalErrorMsg) {
      this.globalErrorMsg.textContent = message;
      this.globalAlert.classList.remove('hidden');
    }
  },

  /**
   * Clear all active validation visual styles.
   */
  clearErrors() {
    // Hide global alert
    if (this.globalAlert) {
      this.globalAlert.classList.add('hidden');
    }

    // Hide field errors
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(el => el.classList.add('hidden'));

    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('has-error'));
  }
};
