import { request } from './request.js';

// Toggle mock behavior if backend is unavailable/not connected yet
const USE_MOCK = false;

export const aiApi = {
  /**
   * Submit query to AI Chat.
   * @param {Object} payload { project_id: number, question: string }
   * @returns {Promise<Object>} Response containing success, provider, and answer.
   */
  async chat(payload) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1200)); // Simulate latency
      
      const q = payload.question.toLowerCase();
      let answer = `I've analyzed your repository context. Here is an explanation regarding your request: "${payload.question}".\n\n`;
      
      if (q.includes('file') || q.includes('how many')) {
        answer += `Based on the latest index, this workspace contains **154 source files** distributed across python modules, HTML template structures, and stylesheets. The largest module is \`apps/dashboard/views.py\` (12 KB).`;
      } else if (q.includes('auth') || q.includes('login')) {
        answer += `Authentication is structured inside the backend configuration layers. The routing uses JWT Bearer tokens defined in \`js/state/authState.js\` and intercepted via the secure network wrappers under \`js/api/request.js\`.`;
      } else if (q.includes('framework') || q.includes('django')) {
        answer += `This project utilizes the **Django Web Framework** (version 5.0+) along with **Django Rest Framework (DRF)** for semantic endpoint APIs. The front-end communicates with these controllers asynchronously via custom fetch wrappers.`;
      } else {
        answer += `To interact with this workspace further, you can ask about code dependencies, files indexing, function details, or request code generation blocks.\n\n\`\`\`python\n# Example repository loader\nclass WorkspaceLoader:\n    def __init__(self, project_id):\n        self.project_id = project_id\n        self.status = "loaded"\n\`\`\``;
      }

      return {
        success: true,
        provider: "gemini (mock)",
        answer: answer
      };
    }

    return request('/api/ai/chat/', {
      method: 'POST',
      body: payload
    });
  },

  /**
   * Retrieve semantic code segments matching query.
   * @param {Object} payload { project_id: number, question: string, top_k?: number }
   * @returns {Promise<Array>} List of similar code contexts.
   */
  async retrieve(payload) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 800));
      
      return [
        {
          path: "backend/apps/views.py",
          score: 0.895,
          snippet: "class DashboardSummaryView(APIView):\n    permission_classes = [IsAuthenticated]\n    def get(self, request):\n        summary = IngestionService.get_aggregates()"
        },
        {
          path: "backend/services/ingestion.py",
          score: 0.812,
          snippet: "class IngestionService:\n    @staticmethod\n    def get_aggregates():\n        return {\n            'total_repositories': Project.objects.count(),"
        },
        {
          path: "frontend/js/api/request.js",
          score: 0.741,
          snippet: "export async function request(url, options = {}) {\n  const token = authState.getAccessToken();\n  // Appends Authorization header Bearer token"
        }
      ];
    }

    return request('/api/semantic/retrieve/', {
      method: 'POST',
      body: payload
    });
  }
};
