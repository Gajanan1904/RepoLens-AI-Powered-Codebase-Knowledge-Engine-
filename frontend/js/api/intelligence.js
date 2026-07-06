import { request } from './request.js';

const USE_MOCK = false;

export const intelligenceApi = {
  /**
   * Fetch repository intelligence aggregates.
   * @param {number|string} projectId Project ID.
   * @returns {Promise<Object>} Intelligence object containing identity, languages, dependencies, statistics.
   */
  async getIntelligence(projectId) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 900));

      return {
        identity: {
          name: "Sample Repo",
          repository: "sample-repo",
          type: "Django"
        },
        languages: ["Python", "JavaScript", "HTML", "CSS"],
        frameworks: ["Django", "Django Rest Framework", "Vite"],
        dependencies: ["django", "djangorestframework", "psycopg2-binary", "jwt", "vite", "lucide"],
        metadata: [
          { key: "project_type", value: "Django Web Application" },
          { key: "linter_configured", value: "Flake8 & ESLint" },
          { key: "database_backend", value: "PostgreSQL" },
          { key: "auth_type", value: "JWT authentication" }
        ],
        entry_points: [
          "manage.py",
          "backend/wsgi.py",
          "frontend/index.html"
        ],
        statistics: {
          files: 154,
          python_files: 82,
          javascript_files: 34,
          html_files: 20,
          css_files: 18,
          functions: 486,
          classes: 58,
          imports: 592,
          dependencies: 12,
          frameworks: 3,
          metadata: 4,
          total_size_bytes: 1845600,
          largest_file: {
            path: "backend/apps/views.py",
            size: 12401
          },
          average_file_size_bytes: 1198.44,
          extension_stats: {
            ".py": 82,
            ".js": 34,
            ".html": 20,
            ".css": 18
          },
          language_distribution: {
            "Python": 82,
            "JavaScript": 34,
            "HTML": 20,
            "CSS": 18
          },
          source_files: 136,
          avg_functions_per_file: 3.57
        }
      };
    }

    return request(`/api/intelligence/${projectId}/`);
  }
};
