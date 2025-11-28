import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy /api → Spring Boot at :8080 to avoid CORS during dev
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": { target: "http://localhost:8080", changeOrigin: true }
    }
  }
});
