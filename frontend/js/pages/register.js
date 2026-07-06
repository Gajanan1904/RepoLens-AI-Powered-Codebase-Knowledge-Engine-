import { authApi } from '../api/auth.js';
import { guardRoute } from '../utils/auth.js';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators.js';
import { toast } from '../components/toast.js';

export const registerPage = {
  init() {
    // Redirect if already authenticated
    guardRoute();

    this.form = document.getElementById('register-form');
    this.usernameInput = document.getElementById('username');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.submitBtn = document.getElementById('register-btn');
    this.globalAlert = document.getElementById('register-global-alert');
    this.globalErrorMsg = document.getElementById('register-global-error-msg');

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  },

  /**
   * Handle registration form submit.
   */
  async handleSubmit(e) {
    e.preventDefault();
    this.clearErrors();

    const username = this.usernameInput.value.trim();
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;

    // Client-side validations
    let hasError = false;

    if (!validateUsername(username)) {
      this.showFieldError('username', 'Name must be at least 2 characters.');
      hasError = true;
    }

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
      await authApi.register(username, email, password);
      
      toast.success('Account created! Redirecting to login page...', 3000);

      this.setLoading(false);
      
      // Redirect to login page after success
      setTimeout(() => {
        window.location.replace('login.html');
      }, 2000);

    } catch (error) {
      this.setLoading(false);

      if (error.status === 400 && error.payload) {
        // Field-specific validation errors from backend
        Object.entries(error.payload).forEach(([field, messages]) => {
          const errorMsg = Array.isArray(messages) ? messages[0] : messages;
          this.showFieldError(field, errorMsg);
        });
        toast.error('Validation error. Please verify input fields.');
      } else {
        const msg = error.message || 'An unexpected error occurred. Please try again.';
        this.showGlobalError(msg);
        toast.error(msg);
      }
    }
  },

  /**
   * Set loading indicator on button.
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
   * Display field-specific error messages.
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
   * Display general top-level alert.
   */
  showGlobalError(message) {
    if (this.globalAlert && this.globalErrorMsg) {
      this.globalErrorMsg.textContent = message;
      this.globalAlert.classList.remove('hidden');
    }
  },

  /**
   * Remove previous error visual markings.
   */
  clearErrors() {
    if (this.globalAlert) {
      this.globalAlert.classList.add('hidden');
    }

    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(el => el.classList.add('hidden'));

    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('has-error'));
  }
};
