import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,          // auto-open browser
    host: true,          // allows LAN access if needed
    port: 5175,          // fixed port (optional)
    // If your frontend calls the backend, proxy avoids CORS and hardcoding base URLs:
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  }
});