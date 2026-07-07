import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        register: resolve(__dirname, "register.html"),
        dashboard: resolve(__dirname, "dashboard.html"),
        repositories: resolve(__dirname, "repositories.html"),
        repositoryDetails: resolve(__dirname, "repository-details.html"),
        fileViewer: resolve(__dirname, "file-viewer.html"),
      },
    },
  },
});