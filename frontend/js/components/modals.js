import { projectsApi } from '../api/projects.js';
import { toast } from './toast.js';

// Global modal container helper
function getModalWrapper() {
  let wrapper = document.getElementById('modal-wrapper');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'modal-wrapper';
    document.body.appendChild(wrapper);
  }
  return wrapper;
}

/**
 * Modal Manager for creating projects and uploading repository ZIPs.
 */
export const modalManager = {
  /**
   * Close any open modals and remove container markup.
   */
  close() {
    const wrapper = document.getElementById('modal-wrapper');
    if (wrapper) {
      const overlay = wrapper.querySelector('.modal-overlay');
      const box = wrapper.querySelector('.modal-box');
      if (overlay && box) {
        box.style.transform = 'translateY(15px)';
        box.style.opacity = '0';
        overlay.style.opacity = '0';
        setTimeout(() => {
          wrapper.innerHTML = '';
        }, 200);
      } else {
        wrapper.innerHTML = '';
      }
    }
    // Remove body scroll locks
    document.body.style.overflow = '';
  },

  /**
   * Opens the Create Repository Modal.
   * @param {function(Object): void} onSuccess Callback invoked when repository is successfully created.
   */
  openCreateProjectModal(onSuccess) {
    const wrapper = getModalWrapper();
    document.body.style.overflow = 'hidden'; // Trap page scrolling

    wrapper.innerHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-box animate-slide-up" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button class="modal-close-btn" id="modal-close-trigger" aria-label="Close modal">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <h3 class="modal-title" id="modal-title">Create Repository</h3>
          <p class="modal-subtitle">Configure a new workspace to start indexing your code.</p>

          <form id="create-project-form" class="mt-md" novalidate>
            <div class="form-group" id="group-name">
              <label for="modal-repo-name" class="form-label">Project Name</label>
              <input type="text" id="modal-repo-name" name="name" class="form-input" placeholder="e.g. Django E-Commerce" required>
              <div class="field-error hidden" id="error-name"><span id="error-name-msg"></span></div>
            </div>

            <div class="form-group" id="group-repository_name">
              <label for="modal-repo-subdir" class="form-label">Repository Directory Name</label>
              <input type="text" id="modal-repo-subdir" name="repository_name" class="form-input" placeholder="e.g. django-ecommerce" required>
              <div class="field-error hidden" id="error-repository_name"><span id="error-repository_name-msg"></span></div>
            </div>

            <div class="form-group" id="group-description">
              <label for="modal-repo-desc" class="form-label">Description (Optional)</label>
              <textarea id="modal-repo-desc" name="description" class="form-input" rows="3" placeholder="Brief outline of repository scope"></textarea>
              <div class="field-error hidden" id="error-description"><span id="error-description-msg"></span></div>
            </div>

            <div class="form-group" id="group-upload_type">
              <label for="modal-repo-type" class="form-label">Upload Method</label>
              <select id="modal-repo-type" name="upload_type" class="form-input">
                <option value="zip">ZIP File Archive (.zip)</option>
              </select>
              <div class="field-error hidden" id="error-upload_type"><span id="error-upload_type-msg"></span></div>
            </div>

            <div class="flex justify-end gap-md mt-lg">
              <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
              <button type="submit" class="btn btn-primary" id="modal-submit-btn">
                <span>Create</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Overlay transition
    setTimeout(() => {
      const overlay = wrapper.querySelector('.modal-overlay');
      if (overlay) overlay.style.opacity = '1';
    }, 10);

    // Event hooks
    const closeBtn = wrapper.querySelector('#modal-close-trigger');
    const cancelBtn = wrapper.querySelector('#modal-cancel-btn');
    const overlay = wrapper.querySelector('#modal-overlay');
    const form = wrapper.querySelector('#create-project-form');

    const dismissModal = (e) => {
      e.preventDefault();
      this.close();
    };

    closeBtn.addEventListener('click', dismissModal);
    cancelBtn.addEventListener('click', dismissModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    // Auto-populate directory name slug when typing project name
    const nameInput = wrapper.querySelector('#modal-repo-name');
    const subdirInput = wrapper.querySelector('#modal-repo-subdir');
    nameInput.addEventListener('input', () => {
      const slug = nameInput.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      subdirInput.value = slug;
    });

    // Keyboard bindings
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.close();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    // Form submit listener
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.clearFormErrors(form);

      const submitBtn = form.querySelector('#modal-submit-btn');
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const payload = {
        name: formData.get('name').trim(),
        repository_name: formData.get('repository_name').trim(),
        description: formData.get('description').trim(),
        upload_type: formData.get('upload_type')
      };

      // Basic client-side validation
      let clientError = false;
      if (!payload.name) {
        this.showFieldError('name', 'Project name is required.');
        clientError = true;
      }
      if (!payload.repository_name) {
        this.showFieldError('repository_name', 'Repository directory name is required.');
        clientError = true;
      }

      if (clientError) {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        return;
      }

      try {
  const project = await projectsApi.createProject(payload);

  toast.success(`Project "${project.name}" created successfully!`);

  // Close Create Project modal
  this.close();

  // Open Upload ZIP modal automatically
  setTimeout(() => {
    this.openUploadModal(
      project.id,
      project.name,
      () => {
        if (onSuccess) {
          onSuccess(project);
        }
      }
    );
  }, 200);

} catch (error) {
  submitBtn.classList.remove('btn-loading');
  submitBtn.disabled = false;

  if (error.status === 400 && error.payload) {
    Object.entries(error.payload).forEach(([field, messages]) => {
      const msg = Array.isArray(messages) ? messages[0] : messages;
      this.showFieldError(field, msg);
    });
  } else {
    toast.error(error.message || 'Failed to create repository.');
  }
}

});
},

  /**
   * Opens the Upload Repository ZIP Modal.
   * @param {number|string} projectId Target project index ID.
   * @param {string} repoName Display name of the repository.
   * @param {function(): void} onSuccess Callback invoked when upload completes.
   */
  openUploadModal(projectId, repoName, onSuccess) {
    const wrapper = getModalWrapper();
    document.body.style.overflow = 'hidden';

    wrapper.innerHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-box animate-slide-up" role="dialog" aria-modal="true" aria-labelledby="modal-title" style="max-width: 460px;">
          <button class="modal-close-btn" id="modal-close-trigger" aria-label="Close modal">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <h3 class="modal-title" id="modal-title">Upload ZIP Archive</h3>
          <p class="modal-subtitle">Select repository source package for <strong>${repoName}</strong>.</p>

          <div class="upload-modal-content mt-md">
            <!-- Dropzone Area -->
            <div class="upload-dropzone" id="upload-dropzone">
              <input type="file" id="upload-file-input" accept=".zip" class="hidden">
              <div class="dropzone-prompt text-center">
                <svg viewBox="0 0 24 24" width="40" height="40" class="dropzone-icon" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"></path></svg>
                <p class="mt-sm font-semibold">Drag & Drop your ZIP file here</p>
                <p class="text-muted text-xs mt-xs">or click to browse local files</p>
                <p class="text-muted text-xs mt-xxs">ZIP archives up to 100 MB only</p>
              </div>
            </div>

            <!-- File Selected Status -->
            <div class="selected-file-panel hidden" id="selected-file-panel">
              <div class="flex items-center justify-between card p-sm bg-secondary">
                <div class="flex items-center gap-sm overflow-hidden">
                  <svg viewBox="0 0 24 24" width="24" height="24" class="text-secondary" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <div class="text-left overflow-hidden">
                    <div class="file-name-label font-semibold text-sm truncate" id="label-filename">repo.zip</div>
                    <div class="file-size-label text-muted text-xs" id="label-filesize">0 MB</div>
                  </div>
                </div>
                <button class="btn-icon btn-sm" id="btn-remove-file" aria-label="Remove selected file">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>

            <!-- Progress Block -->
            <div class="upload-progress-container hidden" id="upload-progress-block">
              <div class="flex justify-between items-center text-sm mb-xs">
                <span class="font-medium" id="upload-status-label">Uploading...</span>
                <span class="font-bold text-secondary" id="upload-percentage-label">0%</span>
              </div>
              <div class="upload-progress-track">
                <div class="upload-progress-fill" id="upload-progress-fill" style="width: 0%;"></div>
              </div>
            </div>

            <!-- Modal Action Buttons -->
            <div class="flex justify-end gap-md mt-lg" id="modal-actions-wrapper">
              <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
              <button class="btn btn-primary" id="btn-submit-upload" disabled>Start Upload</button>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const overlay = wrapper.querySelector('.modal-overlay');
      if (overlay) overlay.style.opacity = '1';
    }, 10);

    const closeBtn = wrapper.querySelector('#modal-close-trigger');
    const cancelBtn = wrapper.querySelector('#modal-cancel-btn');
    const overlay = wrapper.querySelector('#modal-overlay');
    const dropzone = wrapper.querySelector('#upload-dropzone');
    const fileInput = wrapper.querySelector('#upload-file-input');
    const filePanel = wrapper.querySelector('#selected-file-panel');
    const removeFileBtn = wrapper.querySelector('#btn-remove-file');
    const filenameLabel = wrapper.querySelector('#label-filename');
    const filesizeLabel = wrapper.querySelector('#label-filesize');
    const submitBtn = wrapper.querySelector('#btn-submit-upload');
    const progressBlock = wrapper.querySelector('#upload-progress-block');
    const progressFill = wrapper.querySelector('#upload-progress-fill');
    const percentLabel = wrapper.querySelector('#upload-percentage-label');
    const statusLabel = wrapper.querySelector('#upload-status-label');
    const actionsWrapper = wrapper.querySelector('#modal-actions-wrapper');

    let selectedFile = null;
    let xhrPromise = null; // Reference to cancel request if possible

    const dismissModal = (e) => {
      e?.preventDefault();
      this.close();
    };

    closeBtn.addEventListener('click', dismissModal);
    cancelBtn.addEventListener('click', dismissModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    // File selection hook
    const handleFileSelect = (file) => {
      if (!file) return;

      // Validate ZIP extension
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension !== 'zip') {
        toast.error('Only ZIP files are allowed.');
        return;
      }

      // Validate file size limit (100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        toast.error('ZIP file size cannot exceed 100 MB.');
        return;
      }

      selectedFile = file;
      filenameLabel.textContent = file.name;
      filesizeLabel.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

      dropzone.classList.add('hidden');
      filePanel.classList.remove('hidden');
      submitBtn.disabled = false;
    };

    // Drag-and-drop events
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => handleFileSelect(fileInput.files[0]));

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt.files[0];
      handleFileSelect(file);
    });

    // Remove file hook
    removeFileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedFile = null;
      fileInput.value = '';
      dropzone.classList.remove('hidden');
      filePanel.classList.add('hidden');
      submitBtn.disabled = true;
    });

    // Submit upload hook
    submitBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!selectedFile) return;

      // Lock UI actions during uploads
      closeBtn.classList.add('hidden');
      actionsWrapper.classList.add('hidden');
      filePanel.classList.add('hidden');
      progressBlock.classList.remove('hidden');

      try {
        statusLabel.textContent = 'Uploading ZIP archive...';
        await projectsApi.uploadRepository(projectId, selectedFile, (percentage) => {
          progressFill.style.width = `${percentage}%`;
          percentLabel.textContent = `${percentage}%`;
          
          if (percentage >= 100) {
            statusLabel.textContent = 'Processing repository...';
            progressFill.classList.add('pulse-glow');
          }
        });

        toast.success('Upload complete! Repository details updated.');
        
        // Success indicator animation
        progressBlock.innerHTML = `
          <div class="flex items-center gap-sm justify-center text-success font-semibold py-sm animate-fade-in">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Repository Processed Successfully</span>
          </div>
        `;
        
        setTimeout(() => {
          this.close();
          if (onSuccess) onSuccess();
        }, 1500);

      } catch (error) {
        toast.error(error.message || 'Upload failed.');
        this.close();
      }
    });
  },

  /**
   * Helper to display field error styles inside modals.
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
   * Clear error state stylings.
   */
  clearFormErrors(form) {
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(el => el.classList.add('hidden'));

    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('has-error'));
  }
};
