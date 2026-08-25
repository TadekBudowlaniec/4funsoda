import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 4FUNSODA – Vite + React. Forms są obsługiwane przez Netlify Forms,
// więc nie potrzebujemy backendu/proxy jak w wersji z PHP.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
