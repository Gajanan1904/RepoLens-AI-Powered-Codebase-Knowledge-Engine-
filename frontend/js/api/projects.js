import { request, ApiError } from './request.js';
import { authState } from '../state/authState.js';

/**
 * Projects API module.
 */
export const projectsApi = {
  /**
   * Fetch all user repositories.
   * @returns {Promise<Array>} List of project objects.
   */
  listProjects() {
    return request('/api/projects/');
  },

  /**
   * Fetch specific repository detail.
   * @param {number|string} id Project ID.
   * @returns {Promise<Object>} Project details.
   */
  getProject(id) {
    return request(`/api/projects/${id}/`);
  },

  /**
   * Create a new repository index project.
   * @param {Object} data Project creation payload.
   * @returns {Promise<Object>} Created project.
   */
  createProject(data) {
      const payload = { ...data };

  // Backend expects: ZIP or GITHUB
      if (payload.upload_type) {
        payload.upload_type = payload.upload_type.toUpperCase();
      }

  // Generate storage path if not provided
      if (!payload.storage_path && payload.repository_name) {
        const slug = payload.repository_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        payload.storage_path = `repositories/${slug}`;
      }

      return request('/api/projects/', {
        method: 'POST',
        body: payload
      });
},

  /**
   * Delete a repository index project.
   * @param {number|string} id Project ID.
   * @returns {Promise<null>}
   */
  deleteProject(id) {
    return request(`/api/projects/${id}/`, {
      method: 'DELETE'
    });
  },

  /**
   * Upload repository source ZIP package via multipart form-data.
   * Uses XMLHttpRequest to support uploading progress percent events.
   * @param {number|string} id Project ID.
   * @param {File} file ZIP file.
   * @param {function(number): void} onProgress Callback receiving progress percentage (0-100).
   * @returns {Promise<Object>} Upload response.
   */
  uploadRepository(id, file, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('zip_file', file);

      xhr.open('POST', `/api/projects/${id}/upload/`);

      // Set Authorization headers
      const token = authState.getAccessToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      // Track progress
      if (xhr.upload && onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });
      }

      xhr.onload = () => {
        let responsePayload = null;
        try {
          responsePayload = JSON.parse(xhr.responseText);
        } catch {
          responsePayload = { detail: xhr.responseText };
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(responsePayload);
        } else {
          reject(new ApiError(xhr.status, responsePayload));
        }
      };

      xhr.onerror = () => {
        reject(new ApiError(500, { detail: 'Upload connection failed.' }));
      };

      xhr.send(formData);
    });
  },

  /**
   * Fetch project overview metrics.
   * @param {number|string} id Project ID.
   * @returns {Promise<Object>}
   */
  async getProjectOverview(id) {
    const USE_MOCK = false;
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600));
      return {
        id: Number(id),
        name: "RepoLens Demo",
        description: "AI-powered repository analysis front-end interface dashboard.",
        status: "completed",
        upload_type: "zip",
        repository_name: "repolens-ui",
        storage_path: "repositories/repolens-ui",
        created_at: "2026-07-05T18:20:10Z",
        updated_at: "2026-07-05T18:40:35Z"
      };
    }
    return request(`/api/dashboard/projects/${id}/overview/`);
  },

  /**
   * Fetch project tree hierarchy.
   * @param {number|string} id Project ID.
   * @returns {Promise<Object>}
   */
  async getProjectExplorer(id) {
    const USE_MOCK = false;
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 800));
      return {
        project: "RepoLens Demo",
        tree: [
          {
            name: "backend",
            type: "folder",
            children: [
              {
                id: 201,
                name: "manage.py",
                path: "backend/manage.py",
                extension: ".py",
                language: "Python",
                size: 845,
                type: "file"
              },
              {
                name: "apps",
                type: "folder",
                children: [
                  {
                    id: 202,
                    name: "views.py",
                    path: "backend/apps/views.py",
                    extension: ".py",
                    language: "Python",
                    size: 4201,
                    type: "file"
                  },
                  {
                    id: 203,
                    name: "models.py",
                    path: "backend/apps/models.py",
                    extension: ".py",
                    language: "Python",
                    size: 2189,
                    type: "file"
                  }
                ]
              }
            ]
          },
          {
            name: "frontend",
            type: "folder",
            children: [
              {
                id: 204,
                name: "index.html",
                path: "frontend/index.html",
                extension: ".html",
                language: "HTML",
                size: 15480,
                type: "file"
              },
              {
                name: "js",
                type: "folder",
                children: [
                  {
                    id: 205,
                    name: "app.js",
                    path: "frontend/js/app.js",
                    extension: ".js",
                    language: "JavaScript",
                    size: 1546,
                    type: "file"
                  },
                  {
                    name: "pages",
                    type: "folder",
                    children: [
                      {
                        id: 206,
                        name: "repositories.js",
                        path: "frontend/js/pages/repositories.js",
                        extension: ".js",
                        language: "JavaScript",
                        size: 10082,
                        type: "file"
                      }
                    ]
                  }
                ]
              },
              {
                name: "css",
                type: "folder",
                children: [
                  {
                    id: 207,
                    name: "layout.css",
                    path: "frontend/css/layout.css",
                    extension: ".css",
                    language: "CSS",
                    size: 8621,
                    type: "file"
                  }
                ]
              }
            ]
          }
        ]
      };
    }
    return request(`/api/dashboard/projects/${id}/explorer/`);
  },

  /**
   * Fetch project analytics insights.
   * @param {number|string} id Project ID.
   * @returns {Promise<Object>}
   */
  async getProjectInsights(id) {
    const USE_MOCK = false;
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 700));
      return {
        project_type: "Django Application",
        languages: [
          { language: "Python", count: 82, percentage: 53.2 },
          { language: "JavaScript", count: 34, percentage: 22.1 },
          { language: "HTML", count: 20, percentage: 13.0 },
          { language: "CSS", count: 18, percentage: 11.7 }
        ],
        frameworks: ["Django", "Django Rest Framework", "Vite"],
        dependencies: [
          { name: "django", version: "5.0.2" },
          { name: "djangorestframework", version: "3.14.0" },
          { name: "vite", version: "5.2.0" }
        ],
        statistics: {
          total_files: 154,
          total_functions: 486,
          total_classes: 58,
          total_lines: 18456
        }
      };
    }
    return request(`/api/dashboard/projects/${id}/insights/`);
  },

  /**
   * Fetch specific file content.
   * @param {number|string} projectId Project ID.
   * @param {number|string} fileId File ID.
   * @returns {Promise<Object>}
   */
  async getProjectFile(projectId, fileId) {
    const USE_MOCK = false;
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 500));
      
      const fileIdNum = Number(fileId);
      const mockFiles = {
        201: {
          id: 201,
          filename: "manage.py",
          path: "backend/manage.py",
          language: "Python",
          extension: ".py",
          size: 845,
          content: `#!/usr/bin/env python
\"\"\"Django's command-line utility for administrative tasks.\"\"\"
import os
import sys

def main():
    \"\"\"Run administrative tasks.\"\"\"
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            \"Couldn't import Django. Are you sure it's installed and \"
            \"available on your PYTHONPATH environment variable? Did you \"
            \"forget to activate a virtual environment?\"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()`
        },
        202: {
          id: 202,
          filename: "views.py",
          path: "backend/apps/views.py",
          language: "Python",
          extension: ".py",
          size: 4201,
          content: `from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import Project
from ..serializers import ProjectSerializer

class ProjectDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        \"\"\"Retrieve details for a single repository workspace index.\"\"\"
        project = get_object_or_404(Project, pk=pk, owner=request.user)
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        \"\"\"Remove repository index, files, and embeddings.\"\"\"
        project = get_object_or_404(Project, pk=pk, owner=request.user)
        project.delete()
        return Response(
            {"detail": "Project deleted successfully."}, 
            status=status.HTTP_204_NO_CONTENT
        )`
        },
        205: {
          id: 205,
          filename: "app.js",
          path: "frontend/js/app.js",
          language: "JavaScript",
          extension: ".js",
          size: 1546,
          content: `import { themeState } from './state/themeState.js';
import { initThemeToggle } from './components/themeToggle.js';
import { landingPage } from './pages/landing.js';

function bootstrap() {
  themeState.init();

  const toggles = document.querySelectorAll('.theme-toggle-btn');
  toggles.forEach(toggle => {
    initThemeToggle(toggle);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}`
        }
      };

      return mockFiles[fileIdNum] || {
        id: fileIdNum,
        filename: "unknown_file.py",
        path: "unknown_file.py",
        language: "Python",
        extension: ".py",
        size: 120,
        content: "# Selected source file content could not be located in Mock storage."
      };
    }
    return request(`/api/dashboard/projects/${projectId}/files/${fileId}/`);
  }
};

